import assert from 'node:assert/strict';
import ts from 'typescript';
import {mkdtemp,mkdir,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash,createHmac,randomUUID} from 'node:crypto';
import {Readable} from 'node:stream';
const dir=await mkdtemp(join(tmpdir(),'orientohub-github-app-')),originalFetch=globalThis.fetch;
const A='00000000-0000-4000-8000-000000000001',B='00000000-0000-4000-8000-000000000002';
const SA='10000000-0000-4000-8000-000000000001',SB='10000000-0000-4000-8000-000000000002';
const ghA='ghu-test-account-a-secret',ghB='ghu-test-account-b-secret',refreshA='ghr-test-refresh-a-secret';
let assertions=0,refreshCalls=0,oauthCalls=0,privateCalls=0;
const ok=(condition,message)=>{assert.ok(condition,message);assertions++;};
const states=[],connections=new Map(),bindings=new Map(),deliveries=new Set();
const solutions=[{id:SA,user_id:A,git_url:'https://github.com/org/private-a'},{id:SB,user_id:B,git_url:'https://github.com/org/private-a'}];
const copy=value=>JSON.parse(JSON.stringify(value));
const repoA={id:101,full_name:'org/private-a',private:true,visibility:'private',stargazers_count:1,forks_count:0,open_issues_count:0,default_branch:'main'};
const repoB={...repoA,id:202,full_name:'org/private-b'};
const noContent=()=>new Response(null,{status:204});
try{
  await writeFile(join(dir,'package.json'),'{"type":"module"}');
  for(const file of ['api/github-app.ts','api/github-app-webhook.ts','api/github-repository.ts','server/githubApp.ts','server/githubRepository.ts','server/dashboardAuth.ts','src/types/github.ts']){
    const target=join(dir,file.replace('.ts','.js'));await mkdir(join(target,'..'),{recursive:true});
    await writeFile(target,ts.transpileModule(await readFile(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText);
  }
  Object.assign(process.env,{SUPABASE_URL:'https://supabase.example',SUPABASE_ANON_KEY:'anon-key',SUPABASE_SERVICE_ROLE_KEY:'service-key',APP_URL:'https://orientohub.example',GITHUB_APP_ID:'7',GITHUB_APP_SLUG:'orientohub-test',GITHUB_APP_CLIENT_ID:'client-id',GITHUB_APP_CLIENT_SECRET:'client-secret',GITHUB_APP_ENCRYPTION_KEY:'ab'.repeat(32),GITHUB_APP_WEBHOOK_SECRET:'webhook-secret',GITHUB_TOKEN:'old-global-pat-must-not-be-used'});
  const app=await import(pathToFileURL(join(dir,'server/githubApp.js')));
  const {default:handler}=await import(pathToFileURL(join(dir,'api/github-app.js')));
  const {default:insights}=await import(pathToFileURL(join(dir,'api/github-repository.js')));
  const {default:webhook,validAppWebhook}=await import(pathToFileURL(join(dir,'api/github-app-webhook.js')));
  const cipher=app.encryptSecret(ghA,`github:${A}:access`);
  ok(!cipher.includes(ghA),'Credentials are encrypted at rest');
  assert.equal(app.decryptSecret(cipher,`github:${A}:access`),ghA);assertions++;
  assert.throws(()=>app.decryptSecret(cipher,`github:${B}:access`));assertions++;
  globalThis.fetch=async(input,options={})=>{
    const url=new URL(input),method=options.method||'GET',auth=options.headers?.Authorization;
    assert.notEqual(auth,`Bearer ${process.env.GITHUB_TOKEN}`);
    const body=options.body?JSON.parse(options.body):null;
    if(url.origin==='https://supabase.example'){
      if(url.pathname==='/auth/v1/user')return auth==='Bearer supa-A'||auth==='Bearer supa-B'?Response.json({id:auth==='Bearer supa-A'?A:B,role:'authenticated'}):new Response(null,{status:401});
      const name=url.pathname.replace('/rest/v1/','');
      const eq=(key)=>url.searchParams.get(key)?.replace(/^eq\./,'');
      const matches=row=>['user_id','id','state_hash','generation','refresh_lease','solution_id','github_user_id','installation_id','delivery_id'].every(key=>!url.searchParams.has(key)||String(row[key])===eq(key));
      if(name==='solutions'){
        if(auth!=='Bearer service-key')assert.equal(eq('user_id'),auth==='Bearer supa-A'?A:B);
        const rows=solutions.filter(matches);
        if(method==='PATCH'){for(const row of rows){Object.assign(row,body);bindings.delete(row.id);}return noContent();}
        return Response.json(copy(rows));
      }
      assert.equal(auth,'Bearer service-key','Private vault only uses server credentials');
      if(name==='github_oauth_states'){
        if(method==='POST'){states.push(copy(body));return noContent();}
        if(method==='DELETE'){
          const rows=states.filter(row=>matches(row)&&(!url.searchParams.has('expires_at')||url.searchParams.get('expires_at').startsWith('gt.')?Date.parse(row.expires_at)>Date.now():Date.parse(row.expires_at)<Date.now()));
          // Explicit filters used below; global expired-state cleanup must not remove live flows.
          const filtered=states.filter(row=>{
            if(!matches(row))return false;
            const expiry=url.searchParams.get('expires_at');
            return !expiry||(expiry.startsWith('gt.')?Date.parse(row.expires_at)>Date.now():Date.parse(row.expires_at)<Date.now());
          });
          for(const row of filtered)states.splice(states.indexOf(row),1);
          return options.headers.Prefer==='return=representation'?Response.json(copy(filtered)):noContent();
        }
      }
      if(name==='rpc/replace_github_connection'){
        for(const [id,row]of bindings)if(row.user_id===body.p_user_id)bindings.delete(id);
        connections.set(body.p_user_id,{user_id:body.p_user_id,generation:randomUUID(),github_user_id:body.p_github_user_id,github_login:body.p_login,access_ciphertext:body.p_access,refresh_ciphertext:body.p_refresh,expires_at:body.p_expires_at,refresh_expires_at:body.p_refresh_expires_at,refresh_lease:null,refresh_lease_until:null});return noContent();
      }
      if(name==='rpc/claim_github_token_refresh'){
        const row=connections.get(body.p_user_id);
        if(!row||row.generation!==body.p_generation||row.refresh_lease_until&&Date.parse(row.refresh_lease_until)>Date.now()||Date.parse(row.expires_at)>Date.now()+60000)return Response.json([]);
        row.refresh_lease=body.p_lease;row.refresh_lease_until=new Date(Date.now()+30000).toISOString();return Response.json([copy(row)]);
      }
      if(name==='github_app_connections'){
        const rows=[...connections.values()].filter(matches);
        if(method==='GET')return Response.json(copy(rows));
        if(method==='DELETE'){for(const row of rows){connections.delete(row.user_id);for(const [id,binding]of bindings)if(binding.user_id===row.user_id)bindings.delete(id);}return noContent();}
        if(method==='PATCH'){for(const row of rows)Object.assign(row,body);return options.headers.Prefer==='return=representation'?Response.json(copy(rows)):noContent();}
      }
      if(name==='github_solution_repositories'){
        const rows=[...bindings.values()].filter(row=>matches(row)&&(!url.searchParams.has('repository_id')||url.searchParams.get('repository_id').includes(String(row.repository_id))));
        if(method==='GET')return Response.json(copy(rows));
        if(method==='DELETE'){for(const row of rows)bindings.delete(row.solution_id);return noContent();}
      }
      if(name==='rpc/bind_github_solution'){
        const solution=solutions.find(row=>row.id===body.p_solution_id&&row.user_id===body.p_user_id);
        assert.ok(solution);assert.equal(connections.get(body.p_user_id).generation,body.p_generation);
        solution.git_url=`https://github.com/${body.p_full_name}`;
        bindings.set(solution.id,{solution_id:solution.id,user_id:body.p_user_id,installation_id:body.p_installation_id,repository_id:body.p_repository_id,full_name:body.p_full_name,is_private:body.p_private});return noContent();
      }
      if(name==='github_webhook_deliveries'){
        if(method==='GET')return Response.json(deliveries.has(eq('delivery_id'))?[{delivery_id:eq('delivery_id')}]:[]);
        if(method==='POST')deliveries.add(body.delivery_id);
        return noContent();
      }
      throw new Error(`Unexpected internal route: ${name}`);
    }
    if(url.origin==='https://github.com'){
      assert.equal(url.pathname,'/login/oauth/access_token');assert.equal(body.client_secret,'client-secret');
      if(body.grant_type==='refresh_token'){
        refreshCalls++;await new Promise(resolve=>setTimeout(resolve,30));
        return Response.json({access_token:ghA,refresh_token:'ghr-test-rotated-a',expires_in:28800,refresh_token_expires_in:15897600});
      }
      oauthCalls++;assert.ok(body.code_verifier.length>=43);
      return Response.json({access_token:body.code==='code-a'?ghA:ghB,refresh_token:body.code==='code-a'?refreshA:'ghr-test-refresh-b',expires_in:28800,refresh_token_expires_in:15897600});
    }
    assert.equal(url.origin,'https://api.github.com');
    if(url.pathname.startsWith('/applications/'))return noContent();
    const who=auth===`Bearer ${ghA}`?A:auth===`Bearer ${ghB}`?B:null;
    if(url.pathname==='/user')return Response.json({id:who===A?11:22,login:who===A?'github-a':'github-b'});
    if(url.pathname==='/user/installations')return Response.json({installations:[{id:501,app_id:7,account:{login:'shared-org'},repository_selection:'selected'}]});
    if(url.pathname==='/user/installations/501/repositories')return Response.json({total_count:1,repositories:[who===A?repoA:repoB]});
    if(url.pathname.startsWith('/repos/')){
      if(!who)return new Response(null,{status:404});
      if(url.pathname.endsWith('/commits'))return Response.json([{commit:{committer:{date:'2026-11-01T00:00:00Z'}}}]);
      if(url.pathname.endsWith('/languages'))return Response.json({TypeScript:100});
      if(url.pathname.endsWith('/contributors'))return Response.json([{login:'contributor'}]);
      privateCalls++;return Response.json(who===A?repoA:repoB);
    }
    throw new Error(`Unexpected provider route: ${url.pathname}`);
  };
  const response=()=>({statusCode:200,headers:{},setHeader(key,value){this.headers[key]=value;return this;},status(code){this.statusCode=code;return this;},json(body){this.body=body;return this;},end(){return this;}});
  const call=async(action,member='A',body={},query={},cookies)=>{
    const res=response();await handler({method:['start','bind','unbind','disconnect'].includes(action)?'POST':'GET',headers:{...(member?{authorization:`Bearer supa-${member}`}:{}) ,...(cookies?{cookie:cookies}:{})},body,query:{action,...query}},res);
    const text=JSON.stringify(res.body)||'';
    ok(!text.includes(ghA)&&!text.includes(ghB)&&!text.includes(refreshA),'No provider credential reaches browser responses');
    return res;
  };
  const connect=async(member,solutionId)=>{
    const start=await call('start',member,{solutionId});assert.equal(start.statusCode,200);
    const authUrl=new URL(start.body.url),state=authUrl.searchParams.get('state');
    const context=states.find(row=>row.state_hash===app.hash(state));
    const verifier=app.decryptSecret(context.verifier_ciphertext,`oauth:${context.state_hash}`);
    assert.equal(authUrl.searchParams.get('code_challenge'),createHash('sha256').update(verifier).digest('base64url'));assertions++;
    const cookies=`${app.oauthCookie}=${state}; __Host-orientohub-session=supa-${member}`;
    return {state,cookies,start};
  };
  assert.equal((await call('status',null)).statusCode,401);assertions++;
  const flowA=await connect('A',SA);
  assert.equal((await call('callback',null,{}, {state:flowA.state,code:'code-a'},'')).headers.Location,'https://orientohub.example/dashboard/solutions?github=error');assertions++;
  await call('callback',null,{}, {state:flowA.state,code:'code-a'},`${app.oauthCookie}=${flowA.state}; __Host-orientohub-session=supa-B`);
  assert.equal(oauthCalls,0);assertions++;
  const completed=await call('callback',null,{}, {state:flowA.state,code:'code-a',installation_id:'999'},flowA.cookies);
  ok(completed.headers.Location.includes('github=connected'),'OAuth completes only in initiating account');
  assert.equal(bindings.size,0);assertions++;
  await call('callback',null,{}, {state:flowA.state,code:'code-a'},flowA.cookies);
  assert.equal(oauthCalls,1);assertions++;
  const flowB=await connect('B',SB);await call('callback',null,{}, {state:flowB.state,code:'code-b'},flowB.cookies);
  ok(!connections.get(A).access_ciphertext.includes(ghA),'Vault stores ciphertext, not a token');
  assert.equal((await call('status','A',{}, {solutionId:SB})).statusCode,404);assertions++;
  assert.equal((await call('repositories','B',{}, {installationId:'999'})).statusCode,403);assertions++;
  assert.equal((await call('bind','B',{solutionId:SB,installationId:501,repositoryId:101})).statusCode,403);assertions++;
  assert.equal((await call('bind','B',{solutionId:SA,installationId:501,repositoryId:202})).statusCode,404);assertions++;
  assert.equal((await call('bind','A',{solutionId:SA,installationId:501,repositoryId:101})).statusCode,200);assertions++;
  assert.equal((await call('bind','B',{solutionId:SB,installationId:501,repositoryId:202})).statusCode,200);assertions++;
  const own=response();await insights({method:'GET',headers:{authorization:'Bearer supa-A'},query:{solutionId:SA}},own);
  assert.equal(own.statusCode,200);assert.equal(own.body.languages[0].name,'TypeScript');assertions+=2;
  const cross=response();await insights({method:'GET',headers:{authorization:'Bearer supa-B'},query:{solutionId:SA}},cross);
  assert.equal(cross.statusCode,404);assertions++;
  // A cached response still requires live provider authorization.
  connections.get(A).expires_at=new Date(Date.now()-1000).toISOString();
  await Promise.all([app.githubUserToken(A),app.githubUserToken(A)]);
  assert.equal(refreshCalls,1);assertions++;
  const body=Buffer.from(JSON.stringify({action:'removed',installation:{id:501,app_id:7},repositories_removed:[{id:101}]}));
  const signature=`sha256=${createHmac('sha256','webhook-secret').update(body).digest('hex')}`;
  ok(validAppWebhook(body,signature),'Webhook authenticates raw body');ok(!validAppWebhook(Buffer.from('changed'),signature),'Tampered webhook is rejected');
  const deliver=async(sig,id='delivery-1')=>{const req=Readable.from([body]);req.method='POST';req.headers={'x-hub-signature-256':sig,'x-github-delivery':id,'x-github-event':'installation_repositories'};const res=response();await webhook(req,res);return res;};
  assert.equal((await deliver('bad')).statusCode,401);assertions++;
  assert.equal((await deliver(signature)).statusCode,200);assertions++;
  ok(!bindings.has(SA)&&bindings.has(SB),'Removing one repo preserves another member binding in the shared installation');
  assert.equal((await deliver(signature)).statusCode,200);assertions++;
  const revoked=response();await insights({method:'GET',headers:{authorization:'Bearer supa-A'},query:{solutionId:SA}},revoked);
  assert.equal(revoked.statusCode,404);assertions++;
  await call('bind','A',{solutionId:SA,installationId:501,repositoryId:101});
  const disconnected=await call('disconnect','A');assert.equal(disconnected.statusCode,200);assertions++;
  ok(!connections.has(A)&&connections.has(B)&&!bindings.has(SA)&&bindings.has(SB),'Disconnect affects only the current account');
  const final=response();await insights({method:'GET',headers:{authorization:'Bearer supa-A'},query:{solutionId:SA}},final);
  assert.equal(final.statusCode,404);assertions++;
  console.log(JSON.stringify({checks:assertions,oauth:'state + PKCE + one-use + session binding',sharedInstallationIsolation:'passed',tokenRefreshConcurrency:'passed',webhookAndDisconnect:'passed',globalPATFallback:false},null,2));
}catch(error){console.error(error);process.exitCode=1;}
finally{globalThis.fetch=originalFetch;assert.ok(dir.startsWith(join(tmpdir(),'orientohub-github-app-')));await rm(dir,{recursive:true,force:true});}
