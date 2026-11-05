-- Read-only catalog inspection. Run as administrator in the production SQL Editor.
-- This does not replace A/B JWT tests through PostgREST and Storage.
select c.relname as table_name, c.relrowsecurity as rls_enabled,
  has_table_privilege('anon', c.oid, 'SELECT') as anon_can_select,
  has_table_privilege('authenticated', c.oid, 'SELECT') as member_can_select
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind in ('r','p') order by c.relname;

select tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies where schemaname in ('public','storage') order by schemaname, tablename, policyname;

select p.oid::regprocedure as function_name, p.prosecdef as security_definer, p.proconfig as settings,
  has_function_privilege('anon', p.oid, 'EXECUTE') as anon_can_execute,
  has_function_privilege('authenticated', p.oid, 'EXECUTE') as member_can_execute
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.prosecdef order by p.proname;

select c.relname as view_name, c.reloptions as view_options,
  has_table_privilege('anon', c.oid, 'SELECT') as anon_can_select,
  has_table_privilege('authenticated', c.oid, 'SELECT') as member_can_select
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind in ('v','m') order by c.relname;

select id, public, allowed_mime_types, file_size_limit from storage.buckets order by id;

-- Existing inconsistent ownership is reported; it must not be silently reassigned.
begin;
create temporary table tenant_link_findings(child_table text, parent_table text, mismatched_rows bigint);
do $$
declare link record; total bigint;
begin
  for link in select * from (values
    ('hypotheses','project_id','projects'), ('experiments','hypothesis_id','hypotheses'),
    ('interviews','experiment_id','experiments'), ('idea_hypotheses','idea_id','ideas'),
    ('ideas','promoted_project_id','projects')
  ) links(child_table, column_name, parent_table) loop
    if to_regclass(format('public.%I',link.child_table)) is null or to_regclass(format('public.%I',link.parent_table)) is null then continue; end if;
    if not exists(select 1 from information_schema.columns c where c.table_schema='public' and c.table_name=link.child_table and c.column_name=link.column_name) then continue; end if;
    execute format('select count(*) from public.%I child join public.%I parent on parent.id::text = child.%I::text where child.user_id is distinct from parent.user_id', link.child_table, link.parent_table, link.column_name) into total;
    insert into tenant_link_findings values(link.child_table,link.parent_table,total);
  end loop;
end $$;
select * from tenant_link_findings order by child_table;
rollback;
