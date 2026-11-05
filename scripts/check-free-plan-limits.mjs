import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '../scratch/tenant-audit/node_modules/@electric-sql/pglite/dist/index.js';
const db=new PGlite();
try{
  await db.exec(`create table public.plan_entitlements(plan text primary key,max_ideas int,max_projects int,max_solutions int,updated_at timestamptz);insert into public.plan_entitlements values('free',null,3,1,now()),('pro',null,null,5,now()),('enterprise',null,null,null,now());create table public.user_resource_limits(user_id text,max_items int);insert into public.user_resource_limits values('custom-user',25);`);
  const migration=await readFile('supabase/migrations/20261105000006_align_free_plan_limits.sql','utf8');
  await db.exec(migration);await db.exec(migration);
  const rows=(await db.query('select plan,max_ideas,max_projects,max_solutions from public.plan_entitlements order by plan')).rows;
  assert.deepEqual(rows,[{plan:'enterprise',max_ideas:null,max_projects:null,max_solutions:null},{plan:'free',max_ideas:10,max_projects:5,max_solutions:2},{plan:'pro',max_ideas:null,max_projects:null,max_solutions:5}]);
  assert.equal((await db.query('select max_items from public.user_resource_limits')).rows[0].max_items,25);
  console.log('OK: Free = 10 ideias, 5 projetos, 2 soluções; migração idempotente; outros planos e exceções individuais preservados.');
}finally{await db.close();}
