// Real PostgreSQL execution in an isolated in-memory PGlite database.
// Install only in the disposable audit workspace:
// npm install --prefix scratch/tenant-audit --no-save --package-lock=false @electric-sql/pglite
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { PGlite } from '../scratch/tenant-audit/node_modules/@electric-sql/pglite/dist/index.js';
const db = new PGlite();
const A = '00000000-0000-4000-8000-000000000001';
const B = '00000000-0000-4000-8000-000000000002';
const F = '00000000-0000-4000-8000-000000000003';
const PA = '10000000-0000-4000-8000-000000000001';
const PB = '10000000-0000-4000-8000-000000000002';
const HA = '20000000-0000-4000-8000-000000000001';
const EA = '30000000-0000-4000-8000-000000000001';
const IA = '40000000-0000-4000-8000-000000000001';
let assertions = 0;
const ok = (condition, message) => { assert.ok(condition, message); assertions++; };
const query = sql => db.query(sql);
const user = async id => {
  await db.exec('reset role');
  await query(`select set_config('request.jwt.claim.sub', '${id || ''}', false), set_config('request.jwt.claims', '${JSON.stringify({ sub: id, role: id ? 'authenticated' : 'anon', email: id === F ? 'fersouluramal@gmail.com' : `${id}@example.test` })}', false)`);
  await db.exec(`set role ${id ? 'authenticated' : 'anon'}`);
};
const denied = async (sql, message) => {
  try { await db.exec(sql); assert.fail(message); }
  catch (error) { if (error.code === 'ERR_ASSERTION') throw error; ok(['42501','23503'].includes(error.code), `${message}: ${error.message}`); }
};
try {
  await db.exec(`
    create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
    create schema auth; create schema storage;
    create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}', created_at timestamptz default now(), email_confirmed_at timestamptz, last_sign_in_at timestamptz);
    create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
    create function auth.jwt() returns jsonb language sql stable as $$select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb$$;
    create function auth.role() returns text language sql stable as $$select auth.jwt()->>'role'$$;
    grant usage on schema public, auth, storage to anon, authenticated, service_role;
    create table storage.buckets(id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
    create table storage.objects(id uuid primary key default gen_random_uuid(), bucket_id text, name text);
    alter table storage.objects enable row level security;
    create function storage.foldername(text) returns text[] language sql immutable as $$select string_to_array($1,'/')$$;
    grant select,insert,update,delete on storage.objects to authenticated;
    create policy legacy_broad_storage on storage.objects for all to authenticated using(true) with check(true);
    create table public.projects(id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id), name text not null, created_at timestamptz default now());
    create table public.hypotheses(id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id), project_id uuid references public.projects(id), created_at timestamptz default now());
    create table public.experiments(id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id), hypothesis_id uuid references public.hypotheses(id), created_at timestamptz default now());
    create table public.interviews(id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id), experiment_id uuid references public.experiments(id), created_at timestamptz default now());
    create table public.solutions(id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id), name text not null, solution_url text default '', created_at timestamptz default now());
    create table public.contact_messages(id uuid primary key default gen_random_uuid(), message text);
    alter table public.contact_messages enable row level security;
    create policy legacy_contact_all on public.contact_messages for all to public using(true) with check(true);
    insert into auth.users(id,email,raw_user_meta_data) values ('${A}','a@example.test','{"role":"founder"}'),('${B}','b@example.test','{}'),('${F}','fersouluramal@gmail.com','{}');
  `);
  const migrations = [
    '20250604011725_copper_term.sql','20251112_fix_projects_rls.sql','20260730000000_extend_solutions_metadata.sql','20260731000000_create_community.sql',
    '20260806000000_create_billing_subscriptions.sql','20260806000001_create_events.sql',
    '20260807000000_plans_founder_and_feature_flags.sql','20260807000001_feature_flag_rules_and_founder_metrics.sql',
    '20260807000002_apply_feature_flag_rules.sql','20260807000003_feature_access_message.sql',
    '20260812000000_create_ideas_incubation.sql','20260813000000_create_user_activity.sql','20260813000002_add_idea_images.sql',
    '20261105000000_harden_dashboard_access.sql','20261105000001_configurable_resource_limits.sql','20261105000002_founder_user_tracking.sql',
  ];
  for (const file of migrations) { await db.exec(await readFile(`supabase/migrations/${file}`, 'utf8')); }
  await user(F); await db.exec('reset role');
  await db.exec(`grant select,insert,update,delete on all tables in schema public to anon,authenticated;
    insert into public.projects(id,user_id,name) values ('${PA}','${A}','A'),('${PB}','${B}','B');
    insert into public.hypotheses(id,user_id,project_id) values ('${HA}','${A}','${PA}');
    insert into public.experiments(id,user_id,hypothesis_id) values ('${EA}','${A}','${HA}');
    insert into public.ideas(id,user_id,title) values ('${IA}','${A}','Private idea');
    insert into public.community_posts(id,user_id,author_name,title,content) values ('${PA}','${A}','A','Public post','Public content');
    insert into public.community_post_bookmarks(post_id,user_id) values ('${PA}','${B}');
    insert into storage.objects(bucket_id,name) values ('idea-images','${A}/idea/a.png'),('idea-images','${B}/idea/b.png');
    insert into public.billing_subscriptions(user_id,plan,status,billing_cycle,external_reference) values ('${B}','pro','active','monthly','fixture-b');
  `);
  await user(A);
  ok((await query('select * from public.community_post_bookmarks')).rows.length === 1, 'Baseline reproduces bookmark exposure');
  await db.exec(`insert into public.hypotheses(user_id,project_id) values ('${A}','${PB}')`);
  assertions++; // Baseline reproduces a cross-owner foreign-key association.
  await db.exec('reset role');
  await db.exec(`delete from public.hypotheses where user_id='${A}' and project_id='${PB}'`);
  const isolation = await readFile('supabase/migrations/20261105000003_tenant_isolation.sql', 'utf8');
  await db.exec(isolation);
  await db.exec(isolation); // Idempotent rerun.
  const imageRepair = await readFile('supabase/migrations/20261105000004_private_idea_image_read.sql', 'utf8');
  await db.exec(imageRepair); await db.exec(imageRepair);
  await user(A);
  ok((await query('select * from public.projects')).rows.every(row => row.user_id === A), 'A reads only own projects');
  ok((await query('select * from public.community_post_bookmarks')).rows.length === 0, 'A cannot read B bookmarks');
  ok((await query('select * from public.billing_subscriptions')).rows.length === 0, 'A cannot read B billing');
  ok((await query(`update public.projects set name='intrusion' where id='${PB}' returning id`)).rows.length === 0, 'A cannot update B');
  ok((await query(`delete from public.projects where id='${PB}' returning id`)).rows.length === 0, 'A cannot delete B');
  ok((await query(`update public.projects set user_id='${A}' where id='${PB}' returning id`)).rows.length === 0, 'A cannot take over B record');
  ok((await query(`select public.current_plan_for_user('${A}') plan`)).rows[0].plan === 'free', 'A can read own plan');
  ok((await query(`select public.get_feature_state('project_creation','${A}',null) state`)).rows[0].state === 'enabled', 'A can use own enabled feature');
  ok((await query('select * from public.community_posts')).rows.length === 1, 'Community posts remain intentionally shared');
  ok((await query(`update public.plan_entitlements set max_solutions=999 where plan='free' returning plan`)).rows.length === 0, 'Member cannot raise own plan limits');
  await db.exec(`insert into public.solutions(user_id,name) values ('${A}','Own valid solution')`);
  ok((await query('select * from public.solutions')).rows.length === 1, 'Owner can create and read solution');
  await denied(`insert into public.projects(user_id,name) values ('${B}','forged')`, 'A cannot insert on behalf of B');
  await denied(`update public.projects set user_id='${B}' where id='${PA}'`, 'A cannot transfer ownership');
  await denied(`insert into public.hypotheses(user_id,project_id) values ('${A}','${PB}')`, 'Cross-owner hypothesis blocked');
  await denied(`insert into public.experiments(user_id,hypothesis_id) values ('${B}','${HA}')`, 'Cross-owner experiment blocked');
  await user(B);
  ok((await query('select * from public.solutions')).rows.length === 0, 'B cannot read A solution');
  ok((await query('select * from public.community_post_bookmarks')).rows.length === 1, 'B can read own bookmark');
  await denied(`insert into public.founder_user_followups(user_id,status) values ('${B}','resolved')`, 'Member cannot edit private founder followups');
  await denied(`insert into public.interviews(user_id,experiment_id) values ('${B}','${EA}')`, 'Cross-owner interview blocked');
  await denied(`insert into public.idea_hypotheses(user_id,idea_id,statement) values ('${B}','${IA}','forged')`, 'Cross-owner idea hypothesis blocked');
  await denied(`select public.current_plan_for_user('${A}')`, 'Plan RPC refuses another account');
  await denied(`select * from public.get_feature_access('project_creation','${A}',null)`, 'Feature RPC refuses another account');
  await denied(`select public.get_feature_state('project_creation','${A}',null)`, 'Feature-state RPC refuses another account');
  await denied(`insert into public.billing_subscriptions(user_id,plan,status,billing_cycle,external_reference) values ('${B}','pro','active','monthly','forged')`, 'User cannot grant own paid subscription');
  await denied(`select public.get_founder_user_tracking()`, 'Member cannot read founder tracking');
  await user(A); // A deliberately has editable metadata role=founder.
  await denied(`select public.get_founder_user_tracking()`, 'Metadata founder role does not grant admin');
  ok((await query('select * from storage.objects')).rows.every(row => row.name.startsWith(A)), 'Storage listing is owner-only');
  await denied(`insert into storage.objects(bucket_id,name) values ('idea-images','${B}/stolen.png')`, 'Storage write into another folder denied');
  await denied(`insert into storage.objects(bucket_id,name) values ('avatars','${B}/stolen.png')`, 'Avatar write into another folder denied');
  ok((await query('select * from public.contact_messages')).rows.length === 0, 'Members cannot read contact messages');
  await user(null);
  for (const table of ['projects','solutions','ideas','hypotheses','billing_subscriptions','user_activity']) {
    try { ok((await query(`select * from public.${table}`)).rows.length === 0, `Anon cannot read ${table}`); }
    catch(error) { ok(error.code === '42501', `Anon denied ${table}`); }
  }
  await denied(`select public.get_founder_user_tracking()`, 'Anonymous founder RPC denied');
  await db.exec('reset role');
  ok((await query(`select public from storage.buckets where id='idea-images'`)).rows[0].public === false, 'Idea bucket is private');
  await user(F);
  const snapshot = (await query('select public.get_founder_user_tracking() snapshot')).rows[0].snapshot;
  ok(snapshot.users.length === 3, 'Founder intentionally sees all three accounts including free');
  ok((await query(`select public.current_plan_for_user('${B}') plan`)).rows[0].plan === 'pro', 'Founder can inspect member plan');
  await db.exec(`insert into public.founder_user_followups(user_id,status) values ('${B}','following')`);
  ok((await query('select * from public.founder_user_followups')).rows.length === 1, 'Founder can persist followup');
  await db.exec('reset role');
  ok((await query(`select name from public.projects where id='${PB}'`)).rows[0].name === 'B', 'Victim data remains untouched');
  const githubMigration=await readFile('supabase/migrations/20261105000005_github_app_connections.sql','utf8');
  await db.exec(githubMigration);await db.exec(githubMigration);
  const solutionA=(await query(`select id from public.solutions where user_id='${A}' limit 1`)).rows[0].id;
  const solutionB=(await query(`insert into public.solutions(user_id,name) values('${B}','B app solution') returning id`)).rows[0].id;
  const service=async()=>{
    await db.exec('reset role');await query(`select set_config('request.jwt.claims','{"role":"service_role"}',false)`);await db.exec('set role service_role');
  };
  await user(A);
  for(const table of ['github_app_connections','github_oauth_states','github_solution_repositories','github_webhook_deliveries'])await denied(`select * from public.${table}`,`Member cannot read ${table}`);
  await denied(`select public.replace_github_connection('${A}',11,'a','cipher-a','cipher-r',now(),now())`,'Member cannot inject own GitHub authorization');
  await service();
  await db.exec(`select public.replace_github_connection('${A}',11,'a','cipher-a','cipher-r',now()-interval '1 minute',now()+interval '1 day')`);
  let generation=(await query(`select generation from public.github_app_connections where user_id='${A}'`)).rows[0].generation;
  const lease='90000000-0000-4000-8000-000000000001';
  ok((await query(`select * from public.claim_github_token_refresh('${A}','${generation}','${lease}')`)).rows.length===1,'One token refresh obtains the database lease');
  ok((await query(`select * from public.claim_github_token_refresh('${A}','${generation}','90000000-0000-4000-8000-000000000002')`)).rows.length===0,'Concurrent refresh cannot reuse the rotating token');
  await db.exec(`select public.bind_github_solution('${A}','${generation}','${solutionA}',501,101,'org/private-a',true)`);
  ok((await query(`select * from public.github_solution_repositories where user_id='${A}'`)).rows.length===1,'Verified own repository binding persists');
  await denied(`select public.bind_github_solution('${A}','${generation}','${solutionB}',501,101,'org/private-a',true)`,'Even service RPC cannot attach A connection to B solution');
  await user(B);
  await denied(`select public.bind_github_solution('${A}','${generation}','${solutionB}',501,101,'org/private-a',true)`,'Member cannot invoke privileged binding RPC');
  await service();
  await db.exec(`select public.replace_github_connection('${A}',11,'a','new-cipher-a','new-cipher-r',now()+interval '1 hour',now()+interval '1 day')`);
  ok((await query(`select * from public.github_solution_repositories where user_id='${A}'`)).rows.length===0,'Reconnection invalidates old bindings atomically');
  await denied(`select public.bind_github_solution('${A}','${generation}','${solutionA}',501,101,'org/private-a',true)`,'Old connection generation cannot bind after reconnect');
  generation=(await query(`select generation from public.github_app_connections where user_id='${A}'`)).rows[0].generation;
  await db.exec(`select public.bind_github_solution('${A}','${generation}','${solutionA}',501,101,'org/private-a',true)`);
  await user(A);
  await query(`update public.solutions set git_url='https://github.com/org/other' where id='${solutionA}'`);
  await service();
  ok((await query(`select * from public.github_solution_repositories where user_id='${A}'`)).rows.length===0,'Editing repository URL removes old verified binding');
  await db.exec(`select public.bind_github_solution('${A}','${generation}','${solutionA}',501,101,'org/private-a',true)`);
  await query(`delete from public.github_app_connections where user_id='${A}'`);
  ok((await query(`select * from public.github_solution_repositories where user_id='${A}'`)).rows.length===0,'Disconnect cascades all own bindings');
  await user(F);await db.exec('reset role');
  const communityMigration=await readFile('supabase/migrations/20261106000000_community_in_free_plan.sql','utf8');
  await db.exec(communityMigration);await db.exec(communityMigration);
  await user(A);
  ok((await query(`select state from public.get_feature_access('premium_community',auth.uid(),'community')`)).rows[0].state==='enabled','Free account has community access when the flag is active');
  await user(F);await db.exec('reset role');
  await db.exec(`update public.feature_flags set enabled=false where key='premium_community'`);
  await user(A);
  ok((await query(`select state from public.get_feature_access('premium_community',auth.uid(),'community')`)).rows[0].state==='disabled','Global community switch is still respected');
  await user(F);await db.exec('reset role');
  await db.exec(`update public.feature_flags set enabled=true where key='premium_community';insert into public.feature_flag_rules(feature_key,scope,target,state,message) values('premium_community','plan','free','maintenance','Maintenance test')`);
  await user(A);
  ok((await query(`select state from public.get_feature_access('premium_community',auth.uid(),'community')`)).rows[0].state==='maintenance','Explicit maintenance rule remains effective for Free');
  const report = { engine: 'PostgreSQL/PGlite', environment: 'isolated synthetic fixture', assertions, migrationRerun: 'passed', productionAccountsUsed: false };
  await writeFile('scratch/tenant-audit/database-tests.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  console.error(JSON.stringify({ code: error.code, message: error.message, context: error.where, detail: error.detail }));
  process.exitCode = 1;
} finally { await db.close(); }
