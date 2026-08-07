-- Limites de plano, flags globais e dados operacionais exclusivos do Founder.
-- Execute esta migração no SQL Editor do Supabase antes de publicar o front-end.

create table if not exists public.plan_entitlements (
  plan text primary key check (plan in ('free', 'pro', 'enterprise')),
  max_projects integer,
  max_solutions integer,
  advanced_insights boolean not null default false,
  premium_community boolean not null default false,
  mentoring_sessions_per_month integer not null default 0,
  priority_support boolean not null default false,
  updated_at timestamptz not null default now()
);

insert into public.plan_entitlements (
  plan, max_projects, max_solutions, advanced_insights, premium_community, mentoring_sessions_per_month, priority_support
) values
  ('free', 3, 1, false, false, 0, false),
  ('pro', null, 5, true, true, 2, true),
  ('enterprise', null, null, true, true, -1, true)
on conflict (plan) do update set
  max_projects = excluded.max_projects,
  max_solutions = excluded.max_solutions,
  advanced_insights = excluded.advanced_insights,
  premium_community = excluded.premium_community,
  mentoring_sessions_per_month = excluded.mentoring_sessions_per_month,
  priority_support = excluded.priority_support,
  updated_at = now();

create table if not exists public.feature_flags (
  key text primary key,
  name text not null,
  description text,
  enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

insert into public.feature_flags (key, name, description, enabled) values
  ('project_creation', 'Criação de projetos', 'Permite criar novos projetos.', true),
  ('solution_creation', 'Criação de soluções', 'Permite publicar novas soluções.', true),
  ('advanced_insights', 'Insights avançados', 'Habilita análises avançadas para planos elegíveis.', true),
  ('premium_community', 'Comunidade premium', 'Habilita recursos premium de comunidade.', true),
  ('mentoring', 'Mentorias', 'Habilita o agendamento de mentorias.', true)
on conflict (key) do nothing;

alter table public.plan_entitlements enable row level security;
alter table public.feature_flags enable row level security;

create or replace function public.is_orientohub_founder()
returns boolean
language sql
stable
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = 'fersouluramal@gmail.com';
$$;

drop policy if exists "Authenticated users can read plan entitlements" on public.plan_entitlements;
create policy "Authenticated users can read plan entitlements"
  on public.plan_entitlements for select to authenticated using (true);

drop policy if exists "Founder manages plan entitlements" on public.plan_entitlements;
create policy "Founder manages plan entitlements"
  on public.plan_entitlements for all to authenticated
  using (public.is_orientohub_founder()) with check (public.is_orientohub_founder());

drop policy if exists "Founder can read feature flags" on public.feature_flags;
create policy "Founder can read feature flags"
  on public.feature_flags for select to authenticated using (public.is_orientohub_founder());

drop policy if exists "Founder manages feature flags" on public.feature_flags;
create policy "Founder manages feature flags"
  on public.feature_flags for all to authenticated
  using (public.is_orientohub_founder()) with check (public.is_orientohub_founder());

create or replace function public.current_plan_for_user(target_user_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((
    select plan from public.billing_subscriptions
    where user_id = target_user_id and status = 'active'
    order by updated_at desc limit 1
  ), 'free');
$$;

create or replace function public.enforce_plan_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  current_plan text;
  item_limit integer;
  item_count integer;
  flag_key text;
begin
  current_plan := public.current_plan_for_user(new.user_id);
  flag_key := case tg_table_name when 'projects' then 'project_creation' else 'solution_creation' end;

  if not coalesce((select enabled from public.feature_flags where key = flag_key), true) then
    raise exception 'Esta funcionalidade está temporariamente indisponível.' using errcode = 'P0001';
  end if;

  if tg_table_name = 'projects' then
    select max_projects into item_limit from public.plan_entitlements where plan = current_plan;
    select count(*) into item_count from public.projects where user_id = new.user_id;
  else
    select max_solutions into item_limit from public.plan_entitlements where plan = current_plan;
    select count(*) into item_count from public.solutions where user_id = new.user_id;
  end if;

  if item_limit is not null and item_count >= item_limit then
    raise exception 'Limite do plano % atingido. Faça upgrade para continuar.', upper(current_plan) using errcode = 'P0001';
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_projects_plan_limit on public.projects;
create trigger enforce_projects_plan_limit
  before insert on public.projects
  for each row execute function public.enforce_plan_limit();

drop trigger if exists enforce_solutions_plan_limit on public.solutions;
create trigger enforce_solutions_plan_limit
  before insert on public.solutions
  for each row execute function public.enforce_plan_limit();

create or replace function public.get_founder_metrics()
returns jsonb
language sql
stable
security definer
set search_path = public, auth
as $$
  select case when public.is_orientohub_founder() then jsonb_build_object(
    'revenue', jsonb_build_object(
      'total_mrr', coalesce((select sum(case billing_cycle when 'annual' then 970.0 / 12 else 97.0 end) from public.billing_subscriptions where status = 'active' and plan = 'pro'), 0),
      'total_arr', coalesce((select sum(case billing_cycle when 'annual' then 970.0 else 97.0 * 12 end) from public.billing_subscriptions where status = 'active' and plan = 'pro'), 0),
      'mrr_growth', 0, 'ltv', 0
    ),
    'customers', jsonb_build_object(
      'active_customers', (select count(distinct user_id) from public.billing_subscriptions where status = 'active'),
      'new_customers_this_month', (select count(*) from auth.users where created_at >= date_trunc('month', now())),
      'churned_customers', (select count(distinct user_id) from public.billing_subscriptions where status = 'cancelled')
    ),
    'health', jsonb_build_object('avg_health_score', 0, 'healthy_customers', 0, 'at_risk_customers', 0, 'critical_customers', 0),
    'engagement', jsonb_build_object('daily_active_users', 0, 'weekly_active_users', 0, 'monthly_active_users', 0, 'avg_session_duration', 0)
  ) else null end;
$$;

create or replace function public.get_founder_companies()
returns table (id uuid, name text, plan text, mrr numeric, status text, health_score integer, created_at timestamptz, last_activity timestamptz)
language sql
stable
security definer
set search_path = public, auth
as $$
  select u.id,
    coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name', split_part(u.email, '@', 1)),
    coalesce(b.plan, 'free'),
    coalesce(case b.billing_cycle when 'annual' then 970.0 / 12 else case when b.plan = 'pro' and b.status = 'active' then 97.0 else 0 end end, 0),
    coalesce(b.status, 'active'), 0, u.created_at, u.last_sign_in_at
  from auth.users u
  left join lateral (
    select * from public.billing_subscriptions bs where bs.user_id = u.id order by bs.updated_at desc limit 1
  ) b on true
  where public.is_orientohub_founder()
  order by u.created_at desc;
$$;

revoke all on function public.get_founder_metrics() from public;
revoke all on function public.get_founder_companies() from public;
grant execute on function public.get_founder_metrics() to authenticated;
grant execute on function public.get_founder_companies() to authenticated;
