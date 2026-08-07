-- Corrige agregações do Founder e adiciona regras escaláveis de feature flags.

create type public.feature_flag_state as enum ('enabled', 'disabled', 'maintenance', 'development', 'coming_soon');

create table if not exists public.feature_flag_rules (
  id uuid primary key default gen_random_uuid(),
  feature_key text not null references public.feature_flags(key) on delete cascade,
  scope text not null check (scope in ('global', 'plan', 'user', 'screen')),
  target text,
  state public.feature_flag_state not null default 'enabled',
  message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique nulls not distinct (feature_key, scope, target)
);

alter table public.feature_flag_rules enable row level security;
create policy "Founder manages feature flag rules"
  on public.feature_flag_rules for all to authenticated
  using (public.is_orientohub_founder()) with check (public.is_orientohub_founder());

create or replace function public.get_feature_state(feature text, target_user uuid default auth.uid(), screen_name text default null)
returns public.feature_flag_state
language sql
stable
security definer
set search_path = public
as $$
  with current_plan as (select public.current_plan_for_user(target_user) as plan), rules as (
    select state, case scope when 'user' then 1 when 'screen' then 2 when 'plan' then 3 else 4 end as priority
    from public.feature_flag_rules, current_plan
    where feature_key = feature and (
      (scope = 'user' and target = target_user::text) or
      (scope = 'screen' and target = screen_name) or
      (scope = 'plan' and target = current_plan.plan) or
      (scope = 'global' and target is null)
    )
  )
  select coalesce((select state from rules order by priority limit 1),
    case when coalesce((select enabled from public.feature_flags where key = feature), true) then 'enabled'::public.feature_flag_state else 'disabled'::public.feature_flag_state end);
$$;

create or replace function public.get_founder_metrics()
returns jsonb
language sql
stable
security definer
set search_path = public, auth
as $$
  with latest_subscription as (
    select distinct on (user_id) user_id, plan, status, billing_cycle
    from public.billing_subscriptions
    order by user_id, updated_at desc
  ), active_customers as (
    select * from latest_subscription where status = 'active'
  )
  select case when public.is_orientohub_founder() then jsonb_build_object(
    'revenue', jsonb_build_object(
      'total_mrr', coalesce((select sum(case when plan = 'pro' then case billing_cycle when 'annual' then 970.0 / 12 else 97.0 end else 0 end) from active_customers), 0),
      'total_arr', coalesce((select sum(case when plan = 'pro' then case billing_cycle when 'annual' then 970.0 else 97.0 * 12 end else 0 end) from active_customers), 0),
      'mrr_growth', 0, 'ltv', 0
    ),
    'customers', jsonb_build_object(
      'active_customers', (select count(*) from active_customers),
      'new_customers_this_month', (select count(*) from auth.users where created_at >= date_trunc('month', now())),
      'churned_customers', (select count(*) from latest_subscription where status = 'cancelled')
    ),
    'health', jsonb_build_object('avg_health_score', 0, 'healthy_customers', 0, 'at_risk_customers', 0, 'critical_customers', 0),
    'engagement', jsonb_build_object('daily_active_users', 0, 'weekly_active_users', 0, 'monthly_active_users', 0, 'avg_session_duration', 0)
  ) else null end;
$$;
