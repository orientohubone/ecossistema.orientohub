create or replace function public.get_feature_access(feature text, target_user uuid default auth.uid(), screen_name text default null)
returns table (state public.feature_flag_state, message text)
language sql
stable
security definer
set search_path = public
as $$
  with current_plan as (select public.current_plan_for_user(target_user) as plan), rules as (
    select state, message, case scope when 'user' then 1 when 'screen' then 2 when 'plan' then 3 else 4 end as priority
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
      then 'enabled'::public.feature_flag_state else 'disabled'::public.feature_flag_state end),
    (select message from rules order by priority limit 1);
$$;

revoke all on function public.get_feature_access(text, uuid, text) from public;
grant execute on function public.get_feature_access(text, uuid, text) to authenticated;
