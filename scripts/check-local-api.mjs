import assert from 'node:assert/strict';
import {createServer} from 'vite';
import {request} from 'node:http';
import {readFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import ts from 'typescript';
// An isolated test server must never replace the running developer's dep cache.
const cacheDir=await mkdtemp(join(tmpdir(),'orientohub-vite-test-'));
const server=await createServer({cacheDir,server:{port:0,strictPort:false},logLevel:'silent'});
try{
  await server.listen();
  const {port}=server.httpServer.address();
  const call=(path,options={})=>new Promise((resolve,reject)=>{
    const req=request(`http://localhost:${port}${path}`,{method:options.method||'GET',headers:{Host:'localhost:5173',...options.headers}},res=>{
      const chunks=[];res.on('data',chunk=>chunks.push(chunk));res.on('end',()=>resolve({status:res.statusCode,json:async()=>JSON.parse(Buffer.concat(chunks).toString())}));
    });req.on('error',reject);req.end(options.body);
  });
  let checks=0;
  for(const path of ['/api/github-app?action=status','/api/github-repository?solutionId=missing']){
    const response=await call(path);assert.equal(response.status,401);assert.ok((await response.json()).message);checks+=2;
  }
  const session=await call('/api/session',{method:'POST',headers:{Origin:'http://localhost:5173'}});
  assert.equal(session.status,401);checks++;
  const invalid=await call('/api/session',{method:'POST',body:'{',headers:{Origin:'http://localhost:5173'}});
  assert.equal(invalid.status,400);checks++;
  assert.equal((await call('/api/unknown')).status,404);checks++;
  assert.equal((await call('/api/github-app',{headers:{Host:'attacker.example'}})).status,403);checks++;
  const auth=await server.ssrLoadModule('/server/dashboardAuth.ts');
  assert.equal(auth.SESSION_COOKIE,'orientohub-local-session');checks++;
  assert.ok(!auth.cookieAttributes.includes('Secure'));checks++;
  assert.ok(auth.cookieAttributes.includes('HttpOnly'));checks++;
  const app=await server.ssrLoadModule('/server/githubApp.ts');
  assert.equal(app.callbackUrl(),'http://localhost:5173/api/github-app?action=callback');checks++;
  const raw=await call('/api/github-app-webhook',{method:'POST',body:'{}'});
  assert.ok([401,503].includes(raw.status));checks++;
  const previousMode=process.env.NODE_ENV;
  try{
    process.env.NODE_ENV='production';
    const source=ts.transpileModule(await readFile('server/dashboardAuth.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
    const production=await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
    assert.equal(production.SESSION_COOKIE,'__Host-orientohub-session');checks++;
    assert.ok(production.cookieAttributes.includes('Secure'));checks++;
  }finally{process.env.NODE_ENV=previousMode;}
  console.log(JSON.stringify({checks,localApi:'passed',callback:app.callbackUrl()}));
}finally{await server.close();await rm(cacheDir,{recursive:true,force:true});}
