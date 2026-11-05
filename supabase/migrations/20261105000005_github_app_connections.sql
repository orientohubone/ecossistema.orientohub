begin;

create table if not exists public.github_app_connections (
  user_id uuid primary key references auth.users(id) on delete cascade,
  generation uuid not null default gen_random_uuid(),
  github_user_id bigint not null, github_login text not null,
  access_ciphertext text not null, refresh_ciphertext text not null,
  expires_at timestamptz not null, refresh_expires_at timestamptz not null,
  refresh_lease uuid, refresh_lease_until timestamptz,
  updated_at timestamptz not null default now()
);
create index if not exists github_connections_identity_idx on public.github_app_connections(github_user_id);
create table if not exists public.github_oauth_states (
  state_hash text primary key, user_id uuid not null references auth.users(id) on delete cascade,
  verifier_ciphertext text not null, solution_id uuid references public.solutions(id) on delete cascade,
  expires_at timestamptz not null
);
create table if not exists public.github_solution_repositories (
  solution_id uuid primary key references public.solutions(id) on delete cascade,
  user_id uuid not null references public.github_app_connections(user_id) on delete cascade,
  installation_id bigint not null, repository_id bigint not null,
  full_name text not null, is_private boolean not null,
  updated_at timestamptz not null default now()
);
create index if not exists github_binding_installation_idx on public.github_solution_repositories(installation_id, repository_id);
create table if not exists public.github_webhook_deliveries (
  delivery_id text primary key, created_at timestamptz not null default now()
);

do $$ declare resource text;
begin
  foreach resource in array array['github_app_connections','github_oauth_states','github_solution_repositories','github_webhook_deliveries'] loop
    execute format('alter table public.%I enable row level security', resource);
    execute format('revoke all on public.%I from public, anon, authenticated', resource);
    execute format('grant select,insert,update,delete on public.%I to service_role', resource);
  end loop;
end $$;

-- Rotation/reconnection invalidates every earlier binding atomically.
create or replace function public.replace_github_connection(p_user_id uuid, p_github_user_id bigint, p_login text, p_access text, p_refresh text, p_expires_at timestamptz, p_refresh_expires_at timestamptz)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.role() is distinct from 'service_role' then raise exception 'Acesso negado' using errcode='42501'; end if;
  perform pg_advisory_xact_lock(hashtextextended('github:' || p_user_id::text,0));
  delete from public.github_solution_repositories where user_id=p_user_id;
  insert into public.github_app_connections(user_id,github_user_id,github_login,access_ciphertext,refresh_ciphertext,expires_at,refresh_expires_at)
  values(p_user_id,p_github_user_id,p_login,p_access,p_refresh,p_expires_at,p_refresh_expires_at)
  on conflict(user_id) do update set generation=gen_random_uuid(),github_user_id=excluded.github_user_id,github_login=excluded.github_login,
    access_ciphertext=excluded.access_ciphertext,refresh_ciphertext=excluded.refresh_ciphertext,expires_at=excluded.expires_at,
    refresh_expires_at=excluded.refresh_expires_at,refresh_lease=null,refresh_lease_until=null,updated_at=now();
end;
$$;

create or replace function public.claim_github_token_refresh(p_user_id uuid,p_generation uuid,p_lease uuid)
returns setof public.github_app_connections language plpgsql security definer set search_path=public as $$
begin
  if auth.role() is distinct from 'service_role' then raise exception 'Acesso negado' using errcode='42501'; end if;
  return query update public.github_app_connections set refresh_lease=p_lease,refresh_lease_until=now()+interval '30 seconds'
  where user_id=p_user_id and generation=p_generation and expires_at<now()+interval '60 seconds'
    and (refresh_lease_until is null or refresh_lease_until<now()) returning *;
end;
$$;

create or replace function public.bind_github_solution(p_user_id uuid,p_generation uuid,p_solution_id uuid,p_installation_id bigint,p_repository_id bigint,p_full_name text,p_private boolean)
returns void language plpgsql security definer set search_path=public as $$
begin
  if auth.role() is distinct from 'service_role' then raise exception 'Acesso negado' using errcode='42501'; end if;
  perform pg_advisory_xact_lock(hashtextextended('github:' || p_user_id::text,0));
  if not exists(select 1 from public.github_app_connections where user_id=p_user_id and generation=p_generation) then
    raise exception 'Conexão alterada. Conecte novamente.' using errcode='42501';
  end if;
  if not exists(select 1 from public.solutions where id=p_solution_id and user_id=p_user_id) then
    raise exception 'Solução indisponível.' using errcode='42501';
  end if;
  -- Updating the URL invalidates the old binding before adding the verified one.
  update public.solutions set git_url='https://github.com/' || p_full_name where id=p_solution_id and user_id=p_user_id;
  insert into public.github_solution_repositories(solution_id,user_id,installation_id,repository_id,full_name,is_private)
    values(p_solution_id,p_user_id,p_installation_id,p_repository_id,p_full_name,p_private)
    on conflict(solution_id) do update set installation_id=excluded.installation_id,repository_id=excluded.repository_id,
      full_name=excluded.full_name,is_private=excluded.is_private,user_id=excluded.user_id,updated_at=now();
end;
$$;

create or replace function public.clear_changed_github_binding()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  if new.git_url is distinct from old.git_url then delete from public.github_solution_repositories where solution_id=new.id; end if;
  return new;
end;
$$;
drop trigger if exists clear_changed_github_binding on public.solutions;
create trigger clear_changed_github_binding before update of git_url on public.solutions for each row execute function public.clear_changed_github_binding();

revoke all on function public.replace_github_connection(uuid,bigint,text,text,text,timestamptz,timestamptz) from public,anon,authenticated;
revoke all on function public.claim_github_token_refresh(uuid,uuid,uuid) from public,anon,authenticated;
revoke all on function public.bind_github_solution(uuid,uuid,uuid,bigint,bigint,text,boolean) from public,anon,authenticated;
grant execute on function public.replace_github_connection(uuid,bigint,text,text,text,timestamptz,timestamptz) to service_role;
grant execute on function public.claim_github_token_refresh(uuid,uuid,uuid) to service_role;
grant execute on function public.bind_github_solution(uuid,uuid,uuid,bigint,bigint,text,boolean) to service_role;

commit;
