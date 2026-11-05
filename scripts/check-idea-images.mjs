import assert from 'node:assert/strict';
import ts from 'typescript';
import { readFile } from 'node:fs/promises';
const load = source => import(`data:text/javascript;base64,${Buffer.from(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64')}`);
const { privateIdeaImagePath } = await load(await readFile('src/lib/privateIdeaImages.ts','utf8'));
const base='https://test.supabase.co';
const raw=['A/ced/one image.png','A/ced/two.png'];
let row={id:'ced',user_id:'A',title:'Método CED',image_urls:raw.map(path=>`${base}/storage/v1/object/public/idea-images/${encodeURI(path)}`),stage:'capture'};
let owner='A',fail=true,partial=false,lastPayload=null;
const signedPaths=[];
globalThis.__imageMock={
  auth:{getUser:async()=>({data:{user:{id:owner}}})},
  from(){let payload=null;const filters=[];const q={select(){return q;},eq(k,v){filters.push([k,v]);return q;},single(){return q;},order(){return q;},update(p){payload=p;return q;},then(resolve){
    if(!filters.every(([k,v])=>row[k]===v)) return Promise.resolve({data:null,error:new Error('Not found')}).then(resolve);
    if(payload){lastPayload=payload;row={...row,...payload};}
    return Promise.resolve({data:structuredClone(row),error:null}).then(resolve);
  }};return q;},
  storage:{from(){return{
    async createSignedUrl(path){signedPaths.push(path);return fail||(partial&&path===raw[0])?{data:null,error:new Error('Denied')}:{data:{signedUrl:`${base}/storage/v1/object/sign/idea-images/${encodeURI(path)}?token=temporary`},error:null};},
    async list(folder){assert.equal(folder,'A/ced');return{data:[{id:'1',name:'one image.png'},{id:'2',name:'two.png'}],error:null};},
  };}},
};
globalThis.__privatePath=privateIdeaImagePath;
let source=await readFile('src/services/ideasService.ts','utf8');
source=source.replace("import { supabase, supabaseProjectUrl } from '../config/supabase';",`const supabase=globalThis.__imageMock;const supabaseProjectUrl='${base}';`)
  .replace("import { activityService } from './activityService';",'const activityService={log:async()=>{}};')
  .replace("import { privateIdeaImagePath } from '../lib/privateIdeaImages';",'const privateIdeaImagePath=globalThis.__privatePath;');
const {ideasService}=await load(source);
let idea=await ideasService.getById('ced');
assert.equal(idea.image_sources.length,2);
assert.deepEqual(idea.image_urls,['','']);
assert.ok(idea.image_error);
const references=[...row.image_urls];
await ideasService.update('ced',{description:'Edit text, keep images'});
assert.deepEqual(row.image_urls,references);
assert.equal('image_sources' in lastPayload,false);
fail=false;
idea=await ideasService.getById('ced');
assert.equal(idea.image_error,null);
assert.equal(idea.image_urls.length,2);
assert.ok(idea.image_urls[0].includes('/sign/'));
partial=true;
idea=await ideasService.getById('ced');
assert.equal(idea.image_urls[0],'');
assert.ok(idea.image_urls[1].includes('two.png'));
assert.equal(idea.image_sources.length,2);
partial=false;
await assert.rejects(()=>ideasService.update('ced',{image_urls:['B/foreign.png']}),/inválida/);
assert.deepEqual(row.image_urls,references);
await ideasService.update('ced',{image_urls:idea.image_sources});
assert.deepEqual(row.image_urls,raw);
assert.ok(!row.image_urls.some(value=>value.includes('token=')));
row.image_urls=[];
const recovered=await ideasService.recoverImages('ced');
assert.deepEqual(recovered.image_sources,raw);
owner='B';
const calls=signedPaths.length;
await assert.rejects(()=>ideasService.getById('ced'),/Not found/);
assert.equal(signedPaths.length,calls);
assert.equal(privateIdeaImagePath(`${base}/storage/v1/render/image/public/idea-images/A/ced/two.png?width=400`,'A',base),raw[1]);
console.log('OK: links legados, anexos preservados em falha de acesso, ordem das imagens, renovação, recuperação explícita e isolamento entre contas.');
