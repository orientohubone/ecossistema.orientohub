-- Faz as regras por plano/usuário/tela prevalecerem também nos bloqueios do banco.

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
  ), entitlement as (
    select case feature
      when 'advanced_insights' then advanced_insights
      when 'premium_community' then premium_community
      when 'mentoring' then mentoring_sessions_per_month <> 0
      else true
    end as enabled
    from public.plan_entitlements as entitlement_plan, current_plan where entitlement_plan.plan = current_plan.plan
  )
  select coalesce((select state from rules order by priority limit 1),
    case when coalesce((select enabled from entitlement), true) and coalesce((select enabled from public.feature_flags where key = feature), true)
      then 'enabled'::public.feature_flag_state else 'disabled'::public.feature_flag_state end);
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
  feature_state public.feature_flag_state;
begin
  current_plan := public.current_plan_for_user(new.user_id);
  flag_key := case tg_table_name when 'projects' then 'project_creation' else 'solution_creation' end;
  feature_state := public.get_feature_state(flag_key, new.user_id);
  if feature_state <> 'enabled' then
    raise exception 'Esta funcionalidade está indisponível no momento (%).', feature_state using errcode = 'P0001';
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
