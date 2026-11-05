begin;

-- Preserve existing plan quantities; ideas remain unlimited until configured.
alter table public.plan_entitlements add column if not exists max_ideas integer;

create table if not exists public.user_resource_limits (
  user_id uuid not null references auth.users(id) on delete cascade,
  resource text not null check (resource in ('ideas', 'projects', 'solutions')),
  max_items integer check (max_items is null or max_items >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, resource)
);
alter table public.user_resource_limits enable row level security;
revoke all on public.user_resource_limits from anon;
grant select, insert, update, delete on public.user_resource_limits to authenticated;
drop policy if exists "Founder manages resource limits" on public.user_resource_limits;
create policy "Founder manages resource limits" on public.user_resource_limits
  for all to authenticated using (public.is_orientohub_founder()) with check (public.is_orientohub_founder());

-- Guard quantities at the database boundary as well as in the form.
create or replace function public.validate_plan_quantities()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.max_ideas < 0 or new.max_projects < 0 or new.max_solutions < 0 then
    raise exception 'As quantidades devem ser iguais ou maiores que zero; use NULL para sem limite.' using errcode = '23514';
  end if;
  return new;
end;
$$;
drop trigger if exists validate_plan_quantities on public.plan_entitlements;
create trigger validate_plan_quantities before insert or update on public.plan_entitlements
  for each row execute function public.validate_plan_quantities();

create or replace function public.enforce_plan_limit()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  current_plan text;
  item_limit integer;
  item_count bigint;
  flag_key text;
  feature_state public.feature_flag_state;
begin
  if auth.uid() is null or (auth.uid() <> new.user_id and not public.is_orientohub_founder()) then
    raise exception 'Acesso negado.' using errcode = '42501';
  end if;
  -- Serialize creation for this account/resource, including concurrent requests.
  perform pg_advisory_xact_lock(hashtextextended(new.user_id::text || ':' || tg_table_name, 0));
  current_plan := public.current_plan_for_user(new.user_id);
  flag_key := case tg_table_name when 'projects' then 'project_creation' when 'solutions' then 'solution_creation' when 'ideas' then 'ideas_access' else null end;
  if flag_key is null then raise exception 'Recurso não suportado.'; end if;
  feature_state := public.get_feature_state(flag_key, new.user_id, tg_table_name);
  if feature_state is distinct from 'enabled'::public.feature_flag_state then
    raise exception 'Esta funcionalidade está indisponível no momento (%).', feature_state using errcode = 'P0001';
  end if;
  select max_items into item_limit from public.user_resource_limits
    where user_id = new.user_id and resource = tg_table_name;
  -- FOUND distinguishes an explicit unlimited override (NULL) from inheritance.
  if not found then
    select case tg_table_name when 'ideas' then max_ideas when 'projects' then max_projects when 'solutions' then max_solutions end
      into item_limit from public.plan_entitlements where plan = current_plan;
    if not found then raise exception 'Limites do plano não configurados.' using errcode = 'P0001'; end if;
  end if;
  execute format('select count(*) from public.%I where user_id = $1', tg_table_name) into item_count using new.user_id;
  if item_limit is not null and item_count >= item_limit then
    raise exception 'Limite de % atingido: % de % no plano %. Solicite uma ampliação ao administrador ou altere seu plano.',
      tg_table_name, item_count, item_limit, upper(current_plan) using errcode = 'P0001';
  end if;
  return new;
end;
$$;

do $$
declare target_table text;
begin
  foreach target_table in array array['projects', 'solutions', 'ideas'] loop
    if to_regclass(format('public.%I', target_table)) is null then
      raise notice 'Tabela public.% ausente: aplique sua migração de criação e reexecute esta migração.', target_table;
      continue;
    end if;
    execute format('drop trigger if exists %I on public.%I', 'enforce_' || target_table || '_plan_limit', target_table);
    execute format('create trigger %I before insert on public.%I for each row execute function public.enforce_plan_limit()', 'enforce_' || target_table || '_plan_limit', target_table);
  end loop;
end $$;

commit;
