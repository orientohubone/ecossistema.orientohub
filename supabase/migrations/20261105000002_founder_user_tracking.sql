begin;

-- Some environments missed the original activity migration.
create table if not exists public.user_activity (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  action text not null, target text not null, entity_type text not null, entity_id text,
  xp integer not null default 0, icon text not null default 'Activity', created_at timestamptz not null default now()
);
create index if not exists user_activity_user_created_idx on public.user_activity(user_id, created_at desc);
alter table public.user_activity enable row level security;
revoke all on public.user_activity from anon;
grant select, insert on public.user_activity to authenticated;
drop policy if exists "Users read their activity" on public.user_activity;
drop policy if exists "Users create their activity" on public.user_activity;
create policy "Users read their activity" on public.user_activity for select to authenticated using (auth.uid() = user_id);
create policy "Users create their activity" on public.user_activity for insert to authenticated with check (auth.uid() = user_id);

create table if not exists public.dashboard_presence (
  user_id uuid primary key references auth.users(id) on delete cascade,
  last_seen_at timestamptz not null default now(), screen text not null
);
alter table public.dashboard_presence enable row level security;
revoke all on public.dashboard_presence from public, anon, authenticated;

create table if not exists public.founder_user_followups (
  user_id uuid primary key references auth.users(id) on delete cascade,
  status text not null default 'new' check (status in ('new', 'contacted', 'following', 'resolved')),
  notes text not null default '', follow_up_at date, updated_at timestamptz not null default now()
);
alter table public.founder_user_followups enable row level security;
revoke all on public.founder_user_followups from anon;
grant select, insert, update on public.founder_user_followups to authenticated;
drop policy if exists "Founder manages user followups" on public.founder_user_followups;
create policy "Founder manages user followups" on public.founder_user_followups for all to authenticated
  using (public.is_orientohub_founder()) with check (public.is_orientohub_founder());

create or replace function public.record_dashboard_presence(screen_name text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'Acesso negado' using errcode = '42501'; end if;
  if screen_name not in ('dashboard', 'ideas', 'projects', 'solutions', 'insights', 'frameworks', 'academy', 'community', 'settings', 'founder', 'pedagogico', 'tarefas', 'jornada', 'calendario') then
    raise exception 'Tela inválida' using errcode = '22023';
  end if;
  insert into public.dashboard_presence(user_id, last_seen_at, screen) values (auth.uid(), now(), screen_name)
    on conflict (user_id) do update set last_seen_at = excluded.last_seen_at, screen = excluded.screen
    where dashboard_presence.last_seen_at < now() - interval '45 seconds' or dashboard_presence.screen <> excluded.screen;
end;
$$;
revoke all on function public.record_dashboard_presence(text) from public, anon;
grant execute on function public.record_dashboard_presence(text) to authenticated;

create or replace function public.get_founder_user_tracking()
returns jsonb language plpgsql security definer set search_path = public, auth as $$
declare
  resource text; resource_counts jsonb := '{}'::jsonb; counts jsonb; rows jsonb;
begin
  if not public.is_orientohub_founder() then raise exception 'Acesso negado' using errcode = '42501'; end if;
  foreach resource in array array['ideas', 'projects', 'solutions'] loop
    if to_regclass(format('public.%I', resource)) is not null then
      execute format('select coalesce(jsonb_object_agg(user_id::text, n), ''{}''::jsonb) from (select user_id, count(*) n from public.%I group by user_id) counts', resource) into counts;
      resource_counts := resource_counts || jsonb_build_object(resource, counts);
    else resource_counts := resource_counts || jsonb_build_object(resource, null);
    end if;
  end loop;
  select coalesce(jsonb_agg(item order by created desc, user_id), '[]'::jsonb) into rows from (
    select u.created_at created, u.id user_id, jsonb_build_object(
      'id', u.id, 'name', coalesce(nullif(trim(u.raw_user_meta_data->>'full_name'), ''), nullif(trim(u.raw_user_meta_data->>'name'), ''), split_part(u.email, '@', 1), 'Sem nome'),
      'email', u.email, 'created_at', u.created_at, 'confirmed_at', u.email_confirmed_at, 'last_sign_in_at', u.last_sign_in_at,
      'last_seen_at', greatest(p.last_seen_at, u.last_sign_in_at), 'last_screen', p.screen,
      'plan', coalesce(active_sub.plan, 'free'), 'billing_status', coalesce(latest_sub.status, 'none'),
      'ideas', case when resource_counts->'ideas' = 'null'::jsonb then null else coalesce((resource_counts->'ideas'->>u.id::text)::bigint, 0) end,
      'projects', case when resource_counts->'projects' = 'null'::jsonb then null else coalesce((resource_counts->'projects'->>u.id::text)::bigint, 0) end,
      'solutions', case when resource_counts->'solutions' = 'null'::jsonb then null else coalesce((resource_counts->'solutions'->>u.id::text)::bigint, 0) end,
      'followup_status', coalesce(f.status, 'new'), 'notes', coalesce(f.notes, ''), 'follow_up_at', f.follow_up_at
    ) item from auth.users u
    left join public.dashboard_presence p on p.user_id = u.id
    left join public.founder_user_followups f on f.user_id = u.id
    left join lateral (select plan from public.billing_subscriptions b where b.user_id = u.id and b.status = 'active' order by updated_at desc, id desc limit 1) active_sub on true
    left join lateral (select status from public.billing_subscriptions b where b.user_id = u.id order by updated_at desc, id desc limit 1) latest_sub on true
  ) user_rows;
  return jsonb_build_object('users', rows, 'generated_at', now());
end;
$$;
revoke all on function public.get_founder_user_tracking() from public, anon;
grant execute on function public.get_founder_user_tracking() to authenticated;

create or replace function public.get_founder_user_timeline(target_user uuid)
returns jsonb language plpgsql security definer set search_path = public, auth as $$
declare events jsonb;
begin
  if not public.is_orientohub_founder() then raise exception 'Acesso negado' using errcode = '42501'; end if;
  select coalesce(jsonb_agg(jsonb_build_object('id', id, 'action', action, 'target', target, 'created_at', created_at) order by created_at desc), '[]'::jsonb) into events from (
    select * from (
      select id::text id, action, target, created_at from public.user_activity where user_id = target_user
      union all select 'signup', 'Criou a conta', '', created_at from auth.users where id = target_user
      union all select 'confirmed', 'Confirmou o e-mail', '', email_confirmed_at from auth.users where id = target_user and email_confirmed_at is not null
      union all select 'signin', 'Último login confirmado', '', last_sign_in_at from auth.users where id = target_user and last_sign_in_at is not null
    ) history order by created_at desc limit 50
  ) recent;
  return events;
end;
$$;
revoke all on function public.get_founder_user_timeline(uuid) from public, anon;
grant execute on function public.get_founder_user_timeline(uuid) to authenticated;

create or replace function public.log_resource_creation()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.user_activity(user_id, action, target, entity_type, entity_id, xp, icon)
    values(new.user_id, case tg_table_name when 'projects' then 'Criou o projeto' else 'Cadastrou a solução' end,
      new.name, case tg_table_name when 'projects' then 'project' else 'solution' end, new.id::text, 0, 'Rocket');
  return new;
end;
$$;
do $$
declare resource text;
begin
  foreach resource in array array['projects', 'solutions'] loop
    if to_regclass(format('public.%I', resource)) is not null then
      execute format('drop trigger if exists log_resource_creation on public.%I', resource);
      execute format('create trigger log_resource_creation after insert on public.%I for each row execute function public.log_resource_creation()', resource);
    end if;
  end loop;
end $$;

-- Paid subscriptions and registered accounts are different populations.
create or replace function public.get_founder_metrics()
returns jsonb language plpgsql stable security definer set search_path = public, auth as $$
declare result jsonb;
begin
  if not public.is_orientohub_founder() then raise exception 'Acesso negado' using errcode = '42501'; end if;
  with latest_subscription as (
    select distinct on (user_id) user_id, plan, status, billing_cycle
    from public.billing_subscriptions order by user_id, updated_at desc, id desc
  ), active_customers as (
    select * from latest_subscription where status = 'active'
  ), seen as (
    select greatest(u.last_sign_in_at, p.last_seen_at) last_seen from auth.users u
      left join public.dashboard_presence p on p.user_id = u.id
  )
  select jsonb_build_object(
    'revenue', jsonb_build_object(
      'total_mrr', coalesce((select sum(case when plan = 'pro' then case billing_cycle when 'annual' then 970.0 / 12 else 97.0 end else 0 end) from active_customers), 0),
      'total_arr', coalesce((select sum(case when plan = 'pro' then case billing_cycle when 'annual' then 970.0 else 97.0 * 12 end else 0 end) from active_customers), 0),
      'mrr_growth', 0, 'ltv', 0
    ),
    'customers', jsonb_build_object(
      'active_customers', (select count(*) from active_customers),
      'new_customers_this_month', (select count(*) from auth.users where created_at >= date_trunc('month', now() at time zone 'America/Sao_Paulo') at time zone 'America/Sao_Paulo'),
      'churned_customers', (select count(*) from latest_subscription where status = 'cancelled')
    ),
    'health', jsonb_build_object('avg_health_score', 0, 'healthy_customers', 0, 'at_risk_customers', 0, 'critical_customers', 0),
    'engagement', jsonb_build_object(
      'daily_active_users', (select count(*) from seen where last_seen >= now() - interval '24 hours'),
      'weekly_active_users', (select count(*) from seen where last_seen >= now() - interval '7 days'),
      'monthly_active_users', (select count(*) from seen where last_seen >= now() - interval '30 days'),
      'avg_session_duration', 0
    )
  ) into result;
  return result;
end;
$$;
revoke all on function public.get_founder_metrics() from public, anon;
grant execute on function public.get_founder_metrics() to authenticated;

commit;
