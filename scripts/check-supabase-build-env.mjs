import assert from 'node:assert/strict';
import ts from 'typescript';
import {readFile,mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {build} from 'vite';
const source=(await readFile('build/supabaseEnv.ts','utf8')).replace("from 'vite'",`from '${import.meta.resolve('vite')}'`);
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {resolveSupabasePublicEnv:resolve,supabasePublicDefines:defines}=await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const anon=`header.${Buffer.from(JSON.stringify({role:'anon'})).toString('base64url')}.signature`;
assert.throws(()=>resolve({}),/Variáveis ausentes/);
assert.throws(()=>resolve({VITE_SUPABASE_URL:'https://test.supabase.co'}),/VITE_SUPABASE_ANON_KEY/);
assert.deepEqual(resolve({SUPABASE_URL:'https://test.supabase.co',SUPABASE_ANON_KEY:anon}),{url:'https://test.supabase.co',key:anon});
assert.equal(resolve({SUPABASE_URL:'https://old.supabase.co',SUPABASE_ANON_KEY:anon,VITE_SUPABASE_URL:'https://new.supabase.co'}).url,'https://new.supabase.co');
for(const key of ['sb_secret_private',`header.${Buffer.from(JSON.stringify({role:'service_role'})).toString('base64url')}.signature`])assert.throws(()=>resolve({SUPABASE_URL:'https://test.supabase.co',SUPABASE_ANON_KEY:key}),/Chave privilegiada/);
const dir=await mkdtemp(join(tmpdir(),'orientohub-env-'));
try{
 await writeFile(join(dir,'.env.production'),`SUPABASE_URL=https://test.supabase.co\nSUPABASE_ANON_KEY=${anon}\nSUPABASE_SERVICE_ROLE_KEY=server-secret-never-in-browser\n`);
 await writeFile(join(dir,'index.html'),'<script type="module" src="/main.js"></script>');
 await writeFile(join(dir,'main.js'),'console.log(import.meta.env.VITE_SUPABASE_URL,import.meta.env.VITE_SUPABASE_ANON_KEY)');
 const result=await build({configFile:false,root:dir,define:defines('production',dir),logLevel:'silent',build:{write:false,minify:false}});
 const text=result.output.filter(x=>x.type==='chunk').map(x=>x.code).join('');
 assert.ok(text.includes('https://test.supabase.co'));assert.ok(text.includes(anon));assert.ok(!text.includes('server-secret-never-in-browser'));
 console.log('OK: missing config rejected, server aliases supported, frontend precedence, secret keys rejected, real Vite build includes only public config.');
}finally{await rm(dir,{recursive:true,force:true});}
