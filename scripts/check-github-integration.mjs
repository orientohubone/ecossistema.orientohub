import assert from 'node:assert/strict';
import ts from 'typescript';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const dir=await mkdtemp(join(tmpdir(),'orientohub-github-'));
const originalFetch=globalThis.fetch;
const A='00000000-0000-4000-8000-000000000001',B='00000000-0000-4000-8000-000000000002';
const SA='10000000-0000-4000-8000-000000000001',SB='10000000-0000-4000-8000-000000000002';
const repository='org/private-repo';
let githubCalls=0,mode='private',urlForB=`https://github.com/${repository}`,githubFailure=0;
const secret='test-server-only-pat';
try {
  await writeFile(join(dir,'package.json'),'{"type":"module"}');
  for(const file of ['api/github-repository.ts','server/dashboardAuth.ts','server/githubRepository.ts','src/types/github.ts']) {
    const target=join(dir,file.replace('.ts','.js'));
    await mkdir(join(target,'..'),{recursive:true});
    await writeFile(target,ts.transpileModule(await readFile(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText);
  }
  const {default:handler}=await import(pathToFileURL(join(dir,'api/github-repository.js')));
  const {parseGithubRepository}=await import(pathToFileURL(join(dir,'server/githubRepository.js')));
  process.env.SUPABASE_URL='https://auth.example';process.env.SUPABASE_ANON_KEY='public-key';process.env.GITHUB_TOKEN=secret;
  delete process.env.GITHUB_REPOSITORY_ACCESS;
  globalThis.fetch=async(input,options={})=>{
    const url=new URL(input);
    const auth=options.headers.Authorization;
    if(url.origin==='https://auth.example') {
      assert.notEqual(auth,`Bearer ${secret}`);
      if(url.pathname==='/auth/v1/user') return auth==='Bearer A'||auth==='Bearer B'?Response.json({id:auth==='Bearer A'?A:B,role:'authenticated'}):new Response(null,{status:401});
      if(url.pathname==='/rest/v1/rpc/is_orientohub_founder') return Response.json(auth==='Bearer A');
      if(url.pathname==='/rest/v1/solutions') {
        const member=auth==='Bearer A'?A:B;
        assert.equal(url.searchParams.get('user_id'),`eq.${member}`);
        const id=url.searchParams.get('id');
        if(id===`eq.${SA}`&&member===A)return Response.json([{id:SA,git_url:`https://github.com/${repository}`}]);
        if(id===`eq.${SB}`&&member===B)return Response.json([{id:SB,git_url:urlForB}]);
        return Response.json([]);
      }
      throw new Error('Unexpected Supabase endpoint');
    }
    assert.equal(url.origin,'https://api.github.com');
    assert.equal(auth,`Bearer ${secret}`);
    assert.equal(options.redirect,'error');
    githubCalls++;
    if(githubFailure)return new Response(null,{status:githubFailure,headers:githubFailure===403?{'x-ratelimit-remaining':'0'}:{}});
    if(url.pathname.endsWith('/commits'))return mode==='empty'?new Response(null,{status:409}):Response.json([{commit:{committer:{date:'2026-11-01T00:00:00Z'}}}],{headers:{link:'<https://api.github.com/repos/org/private-repo/commits?per_page=1&page=42>; rel="last"'}});
    if(url.pathname.endsWith('/contributors'))return mode==='empty'?new Response(null,{status:204}):Response.json([{login:'contributor'}],{headers:{link:'<https://api.github.com/repos/org/private-repo/contributors?per_page=1&anon=1&page=3>; rel="last"'}});
    if(url.pathname.endsWith('/languages'))return Response.json(mode==='empty'?{}:{TypeScript:900,JavaScript:100});
    return Response.json({private:mode!=='public',visibility:mode==='public'?'public':'private',stargazers_count:2,forks_count:1,open_issues_count:0,pushed_at:null,description:'Repository summary',default_branch:'main',size:123,topics:['test'],created_at:'2026-01-01T00:00:00Z',updated_at:'2026-11-01T00:00:00Z'});
  };
  const call=async(token,id,method='GET')=>{
    const res={statusCode:200,headers:{},setHeader(k,v){this.headers[k]=v;},status(code){this.statusCode=code;return this;},json(body){this.body=body;return this;}};
    await handler({method,headers:token?{authorization:`Bearer ${token}`}:{},query:{solutionId:id}},res);
    assert.equal(res.headers['Cache-Control'],'private, no-store');
    assert.ok(!JSON.stringify(res.body).includes(secret));
    return res;
  };
  assert.equal((await call(null,SA)).statusCode,401);
  assert.equal((await call('forged',SA)).statusCode,401);
  assert.equal((await call('A','not-a-uuid')).statusCode,400);
  assert.equal(githubCalls,0);
  assert.equal((await call('B',SA)).statusCode,404);
  assert.equal(githubCalls,0);
  const owner=await call('A',SA);
  assert.equal(owner.statusCode,200);assert.equal(owner.body.commits,42);assert.equal(owner.body.contributors,3);assert.equal(owner.body.languages[0].percentage,90);
  const cachedCalls=githubCalls;
  assert.equal((await call('A',SA)).statusCode,200);assert.equal(githubCalls,cachedCalls);
  assert.equal((await call('B',SB)).statusCode,404);assert.equal(githubCalls,cachedCalls+1); // no use of A's cache
  process.env.GITHUB_REPOSITORY_ACCESS=JSON.stringify({[B]:[repository]});
  assert.equal((await call('B',SB)).statusCode,200);
  delete process.env.GITHUB_REPOSITORY_ACCESS;
  urlForB='https://github.com/other/private-repo';
  assert.equal((await call('B',SB)).statusCode,404);
  urlForB='https://github.com.evil.example/org/repo';
  const beforeInvalid=githubCalls;assert.equal((await call('B',SB)).statusCode,400);assert.equal(githubCalls,beforeInvalid);
  mode='public';urlForB='https://github.com/org/public-repo';
  assert.equal((await call('B',SB)).statusCode,200);
  githubFailure=401;urlForB='https://github.com/org/expired-token';
  assert.equal((await call('B',SB)).statusCode,502);
  githubFailure=403;urlForB='https://github.com/org/limited';
  assert.equal((await call('B',SB)).statusCode,429);
  githubFailure=0;mode='empty';process.env.GITHUB_REPOSITORY_ACCESS=JSON.stringify({[B]:['org/empty']});urlForB='https://github.com/org/empty';
  const empty=await call('B',SB);assert.equal(empty.statusCode,200);assert.equal(empty.body.commits,0);assert.equal(empty.body.contributors,0);assert.deepEqual(empty.body.languages,[]);
  assert.equal(parseGithubRepository('https://github.com/Org/Repo.git/'),'Org/Repo');
  for(const invalid of ['https://evil.example/org/repo','https://github.com/org/repo/commits','https://github.com/org','http://github.com/org/repo','https://user:password@github.com/org/repo'])assert.equal(parseGithubRepository(invalid),null);
  console.log('OK: autenticação, solução própria, acesso privado founder/allowlist, isolamento de cache, token só no servidor, paginação, rate limit e repositório vazio.');
} finally {
  globalThis.fetch=originalFetch;
  // dir was allocated by mkdtemp directly under the OS temporary directory.
  assert.ok(dir.startsWith(join(tmpdir(),'orientohub-github-')));
  await rm(dir,{recursive:true,force:true});
}
