begin;

-- Restrictive policies intersect older permissive policies instead of trusting
-- that an older broad policy was removed in every environment.
do $$
declare target_table text; operation text;
begin
  foreach target_table in array array['projects','solutions','hypotheses','experiments','interviews','ideas','idea_hypotheses','events','user_activity','community_post_bookmarks'] loop
    if to_regclass(format('public.%I', target_table)) is null then
      raise notice 'Missing private table public.%: not audited until its creation migration is applied.', target_table; continue;
    end if;
    execute format('alter table public.%I enable row level security', target_table);
    execute format('revoke all on public.%I from anon', target_table);
    execute format('drop policy if exists "Tenant isolation boundary" on public.%I', target_table);
    execute format('create policy "Tenant isolation boundary" on public.%I as restrictive for all to public using (auth.uid() is not null and user_id = auth.uid()) with check (auth.uid() is not null and user_id = auth.uid())', target_table);
  end loop;
  foreach target_table in array array['crm_clients','crm_notes','crm_tasks','crm_companies','crm_contacts','crm_deals','crm_deal_contacts','feature_flags','feature_flag_rules','user_resource_limits','founder_user_followups'] loop
    if to_regclass(format('public.%I', target_table)) is null then continue; end if;
    execute format('alter table public.%I enable row level security', target_table);
    execute format('revoke all on public.%I from anon', target_table);
    execute format('drop policy if exists "Founder isolation boundary" on public.%I', target_table);
    execute format('create policy "Founder isolation boundary" on public.%I as restrictive for all to public using (public.is_orientohub_founder() is true) with check (public.is_orientohub_founder() is true)', target_table);
  end loop;
  foreach target_table in array array['billing_subscriptions','contact_messages','newsletter_subscriptions','plan_entitlements'] loop
    if to_regclass(format('public.%I', target_table)) is null then continue; end if;
    execute format('alter table public.%I enable row level security', target_table);
    if target_table = 'billing_subscriptions' then
      execute 'revoke all on public.billing_subscriptions from anon';
      execute 'drop policy if exists "Billing owner read boundary" on public.billing_subscriptions';
      execute 'create policy "Billing owner read boundary" on public.billing_subscriptions as restrictive for select to public using (auth.uid() is not null and user_id = auth.uid())';
    end if;
    foreach operation in array array['insert','update','delete'] loop
      -- Contact forms remain insert-only for public visitors.
      if target_table in ('contact_messages','newsletter_subscriptions') and operation = 'insert' then continue; end if;
      execute format('drop policy if exists %I on public.%I', 'Protected ' || operation || ' boundary', target_table);
      if operation = 'insert' then
        execute format('create policy %I on public.%I as restrictive for insert to public with check (%s)', 'Protected insert boundary', target_table, case when target_table = 'billing_subscriptions' then 'false' else 'public.is_orientohub_founder() is true' end);
      elsif operation = 'update' then
        execute format('create policy %I on public.%I as restrictive for update to public using (%s) with check (%s)', 'Protected update boundary', target_table, case when target_table = 'billing_subscriptions' then 'false' else 'public.is_orientohub_founder() is true' end, case when target_table = 'billing_subscriptions' then 'false' else 'public.is_orientohub_founder() is true' end);
      else
        execute format('create policy %I on public.%I as restrictive for delete to public using (%s)', 'Protected delete boundary', target_table, case when target_table = 'billing_subscriptions' then 'false' else 'public.is_orientohub_founder() is true' end);
      end if;
    end loop;
    if target_table in ('contact_messages','newsletter_subscriptions') then
      execute format('drop policy if exists "Founder contact read boundary" on public.%I', target_table);
      execute format('create policy "Founder contact read boundary" on public.%I as restrictive for select to public using (public.is_orientohub_founder() is true)', target_table);
    end if;
  end loop;
end $$;

-- A user's own child row may not point to a different user's parent record.
create or replace function public.check_private_parent_ownership()
returns trigger language plpgsql security definer set search_path = public as $$
declare link record; parent_id text; owner_id uuid;
begin
  if tg_op = 'UPDATE' and new.user_id is distinct from old.user_id then
    raise exception 'Não é permitido transferir registros entre contas.' using errcode = '42501';
  end if;
  for link in select * from (values ('project_id','projects'),('hypothesis_id','hypotheses'),('experiment_id','experiments'),('idea_id','ideas'),('promoted_project_id','projects')) as links(column_name, parent_table) loop
    parent_id := to_jsonb(new)->>link.column_name;
    if parent_id is not null then
      execute format('select user_id from public.%I where id::text = $1', link.parent_table) into owner_id using parent_id;
      if owner_id is null or owner_id is distinct from new.user_id then
        raise exception 'Vínculo inválido: o registro relacionado não pertence à sua conta.' using errcode = '23503';
      end if;
    end if;
  end loop;
  return new;
end;
$$;
do $$
declare target_table text;
begin
  foreach target_table in array array['projects','solutions','hypotheses','experiments','interviews','ideas','idea_hypotheses','events'] loop
    if to_regclass(format('public.%I', target_table)) is null then continue; end if;
    execute format('drop trigger if exists check_private_parent_ownership on public.%I', target_table);
    execute format('create trigger check_private_parent_ownership before insert or update on public.%I for each row execute function public.check_private_parent_ownership()', target_table);
  end loop;
end $$;

create or replace function public.current_plan_for_user(target_user_id uuid)
returns text language plpgsql stable security definer set search_path = public as $$
begin
  if coalesce(auth.role(), '') <> 'service_role' and (auth.uid() is null or (auth.uid() <> target_user_id and public.is_orientohub_founder() is not true)) then
    raise exception 'Acesso negado' using errcode = '42501';
  end if;
  return coalesce((select plan from public.billing_subscriptions where user_id = target_user_id and status = 'active' order by updated_at desc limit 1), 'free');
end;
$$;
revoke all on function public.current_plan_for_user(uuid) from public, anon;
grant execute on function public.current_plan_for_user(uuid) to authenticated, service_role;

create or replace function public.get_feature_access(feature text, target_user uuid default auth.uid(), screen_name text default null)
returns table (state public.feature_flag_state, message text)
language plpgsql stable security definer set search_path = public as $$
declare user_plan text;
begin
  if auth.uid() is null or (target_user is distinct from auth.uid() and public.is_orientohub_founder() is not true) then
    raise exception 'Acesso negado' using errcode = '42501';
  end if;
  user_plan := public.current_plan_for_user(target_user);
  return query with rules as (
    select r.state, r.message, case r.scope when 'user' then 1 when 'screen' then 2 when 'plan' then 3 else 4 end priority
    from public.feature_flag_rules r where r.feature_key = feature and (
      (r.scope = 'user' and r.target = target_user::text) or (r.scope = 'screen' and r.target = screen_name) or
      (r.scope = 'plan' and r.target = user_plan) or (r.scope = 'global' and r.target is null)
    )
  ), entitlement as (
    select case feature when 'advanced_insights' then p.advanced_insights when 'premium_community' then p.premium_community
      when 'mentoring' then p.mentoring_sessions_per_month <> 0 else true end enabled
    from public.plan_entitlements p where p.plan = user_plan
  )
  select coalesce((select r.state from rules r order by r.priority limit 1),
      case when coalesce((select e.enabled from entitlement e), true) and coalesce((select f.enabled from public.feature_flags f where f.key = feature), true)
      then 'enabled'::public.feature_flag_state else 'disabled'::public.feature_flag_state end),
    (select r.message from rules r order by r.priority limit 1);
end;
$$;
create or replace function public.get_feature_state(feature text, target_user uuid default auth.uid(), screen_name text default null)
returns public.feature_flag_state language sql stable security definer set search_path = public as $$
  select a.state from public.get_feature_access(feature, target_user, screen_name) a;
$$;
revoke all on function public.get_feature_access(text,uuid,text) from public, anon;
revoke all on function public.get_feature_state(text,uuid,text) from public, anon;
grant execute on function public.get_feature_access(text,uuid,text) to authenticated;
grant execute on function public.get_feature_state(text,uuid,text) to authenticated;

-- Private ideas are not a public-media gallery. Old public URLs stop working.
update storage.buckets set public = false where id = 'idea-images';
drop policy if exists "Private idea image read" on storage.objects;
create policy "Private idea image read" on storage.objects for select to authenticated
  using (bucket_id = 'idea-images' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "Private idea image boundary" on storage.objects;
create policy "Private idea image boundary" on storage.objects as restrictive for all to public
  using (bucket_id <> 'idea-images' or (auth.uid() is not null and (storage.foldername(name))[1] = auth.uid()::text))
  with check (bucket_id <> 'idea-images' or (auth.uid() is not null and (storage.foldername(name))[1] = auth.uid()::text));

-- Avatars may be public in the community; only their owner may change files.
drop policy if exists "Avatar owner access" on storage.objects;
create policy "Avatar owner access" on storage.objects for all to authenticated
  using (bucket_id = 'avatars' and ((storage.foldername(name))[1] = auth.uid()::text or name like auth.uid()::text || '-%'))
  with check (bucket_id = 'avatars' and ((storage.foldername(name))[1] = auth.uid()::text or name like auth.uid()::text || '-%'));
do $$
declare operation text;
begin
  foreach operation in array array['insert','update','delete'] loop
    execute format('drop policy if exists %I on storage.objects', 'Avatar owner ' || operation || ' boundary');
    if operation = 'insert' then
      execute 'create policy "Avatar owner insert boundary" on storage.objects as restrictive for insert to public with check (bucket_id <> ''avatars'' or (auth.uid() is not null and ((storage.foldername(name))[1] = auth.uid()::text or name like auth.uid()::text || ''-%'')))';
    elsif operation = 'update' then
      execute 'create policy "Avatar owner update boundary" on storage.objects as restrictive for update to public using (bucket_id <> ''avatars'' or (auth.uid() is not null and ((storage.foldername(name))[1] = auth.uid()::text or name like auth.uid()::text || ''-%''))) with check (bucket_id <> ''avatars'' or (auth.uid() is not null and ((storage.foldername(name))[1] = auth.uid()::text or name like auth.uid()::text || ''-%'')))';
    else
      execute 'create policy "Avatar owner delete boundary" on storage.objects as restrictive for delete to public using (bucket_id <> ''avatars'' or (auth.uid() is not null and ((storage.foldername(name))[1] = auth.uid()::text or name like auth.uid()::text || ''-%'')))';
    end if;
  end loop;
end $$;

do $$
declare fn record;
begin
  for fn in select p.oid::regprocedure signature from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname in ('get_founder_companies','get_founder_metrics','get_founder_user_tracking','get_founder_user_timeline')
  loop
    execute format('revoke all on function %s from public, anon', fn.signature);
    execute format('grant execute on function %s to authenticated', fn.signature);
  end loop;
end $$;

commit;
