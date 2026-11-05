begin;

-- A restrictive policy is ANDed with existing permissive policies, so an older
-- broad SELECT policy cannot expose another account's private dashboard data.
do $$
declare target_table text;
begin
  foreach target_table in array array['projects', 'hypotheses', 'experiments', 'interviews', 'ideas', 'idea_hypotheses', 'user_activity', 'billing_subscriptions']
  loop
    if to_regclass(format('public.%I', target_table)) is null then
      raise notice 'Skipping missing table public.%. Apply its creation migration before using this feature, then rerun this migration.', target_table;
      continue;
    end if;
    -- An existing table without an ownership column must fail closed, rather
    -- than silently skip the protection of existing data.
    if not exists (
      select 1 from information_schema.columns c
      where c.table_schema = 'public' and c.table_name = target_table and c.column_name = 'user_id'
    ) then
      raise exception 'Cannot protect public.%: missing user_id column', target_table;
    end if;
    execute format('alter table public.%I enable row level security', target_table);
    execute format('revoke all on public.%I from anon', target_table);
    execute format('drop policy if exists "Private dashboard owner boundary" on public.%I', target_table);
    execute format('create policy "Private dashboard owner boundary" on public.%I as restrictive for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id)', target_table);
  end loop;
end $$;

-- SECURITY DEFINER functions also need a caller boundary, independently of RLS.
create or replace function public.current_plan_for_user(target_user_id uuid)
returns text language plpgsql stable security definer set search_path = public
as $$
begin
  if auth.uid() is null or (auth.uid() <> target_user_id and not public.is_orientohub_founder()) then
    raise exception 'Access denied' using errcode = '42501';
  end if;
  return coalesce((select plan from public.billing_subscriptions where user_id = target_user_id and status = 'active' order by updated_at desc limit 1), 'free');
end;
$$;
revoke all on function public.current_plan_for_user(uuid) from public, anon;
grant execute on function public.current_plan_for_user(uuid) to authenticated;

commit;

