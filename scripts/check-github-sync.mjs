import assert from 'node:assert/strict';
import ts from 'typescript';
import {readFile} from 'node:fs/promises';
const previous=globalThis.fetch;
let active=0,peak=0,calls=0,limited=false;
globalThis.__githubSyncMock={auth:{getUser:async()=>({data:{user:{id:'A'}}}),getSession:async()=>({data:{session:{user:{id:'A'},access_token:'test'}}}),onAuthStateChange:()=>{}}};
try{
 const source=(await readFile('src/services/solutionsService.ts','utf8')).replace("import { supabase } from '../config/supabase';",'const supabase=globalThis.__githubSyncMock;');
 const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
 const {solutionsService:service}=await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
 globalThis.fetch=async()=>{calls++;active++;peak=Math.max(peak,active);await new Promise(r=>setTimeout(r,20));active--;return limited?Response.json({message:'Quota test'},{status:429,headers:{'Retry-After':'60'}}):Response.json({languages:[],stars:1});};
 const solution=id=>({id,git_url:`https://github.com/org/${id}`});
 await Promise.all([service.fetchGithubData(solution('same')),service.fetchGithubData(solution('same'))]);
 assert.equal(calls,1);
 await Promise.all(['one','two','three','four'].map(id=>service.fetchGithubData(solution(id))));
 assert.ok(peak<=2);
 limited=true;
 assert.equal((await service.fetchGithubData(solution('quota'))).error,'Quota test');
 const before=calls;
 assert.equal((await service.fetchGithubData(solution('next'))).error,'Quota test');
 assert.equal(calls,before);
 console.log('OK: duplicate requests shared, maximum two concurrent syncs, rate-limit cooldown prevents further calls.');
}finally{globalThis.fetch=previous;delete globalThis.__githubSyncMock;}
