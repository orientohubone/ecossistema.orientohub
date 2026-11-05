import assert from 'node:assert/strict';
import ts from 'typescript';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const dir = await mkdtemp(join(tmpdir(), 'orientohub-auth-'));
const originalFetch = globalThis.fetch;
try {
  await writeFile(join(dir, 'package.json'), '{"type":"module"}');
  for (const file of ['middleware.ts', 'api/session.ts', 'server/dashboardAuth.ts']) {
    const target = join(dir, file.replace('.ts', '.js'));
    await mkdir(join(target, '..'), { recursive: true });
    // Preserve imports exactly as emitted for Node ESM in production.
    const source = await readFile(file, 'utf8');
    await writeFile(target, ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText);
  }
  const { default: guard } = await import(pathToFileURL(join(dir, 'middleware.js')));
  const { default: session } = await import(pathToFileURL(join(dir, 'api/session.js')));
  process.env.SUPABASE_URL = 'https://auth.example';
  process.env.SUPABASE_ANON_KEY = 'public-test-key';
  let calls = 0;
  globalThis.fetch = async (url, options) => {
    calls++;
    assert.equal(options.cache, 'no-store');
    const token = options.headers.Authorization;
    if (token === 'Bearer outage') throw new Error('Offline');
    if (url.endsWith('/rpc/is_orientohub_founder')) return Response.json(token === 'Bearer founder');
    if (['Bearer valid', 'Bearer founder'].includes(token)) return Response.json({ id: 'user-1', role: 'authenticated', user_metadata: { role: 'founder' } });
    return new Response(null, { status: 401 });
  };
  const request = (path, token, cookie = false) => new Request(`https://orientohub.com.br${path}`, { headers: token ? cookie ? { cookie: `__Host-orientohub-session=${token}` } : { authorization: `Bearer ${token}` } : {} });
  for (const path of ['/dashboard', '/dashboard/projects', '/dashboard/founder']) {
    const result = await guard(request(path));
    assert.equal(result.status, 302);
    assert.equal(result.headers.get('Location'), '/entrar');
    assert.equal(result.headers.get('X-Robots-Tag'), 'noindex, nofollow');
    assert.equal(result.headers.get('Cache-Control'), 'private, no-store');
  }
  assert.equal(calls, 0);
  assert.equal((await guard(request('/api/dashboard/projects'))).status, 401);
  assert.equal((await guard(request('/dashboard', 'forged', true))).status, 302);
  assert.equal((await guard(request('/dashboard', 'valid', true))).headers.get('x-middleware-next'), '1');
  assert.equal((await guard(request('/dashboard/founder', 'valid'))).status, 403); // forged browser role is insufficient
  assert.equal((await guard(request('/dashboard/pedagogico', 'valid'))).status, 403);
  assert.equal((await guard(request('/dashboard/founder', 'founder'))).headers.get('x-middleware-next'), '1');
  assert.equal((await guard(request('/dashboard', 'outage'))).status, 503);
  const beforePublic = calls;
  assert.equal((await guard(request('/academy/login'))).headers.get('x-middleware-next'), '1');
  assert.equal(calls, beforePublic);
  async function callSession(method, token, origin = 'https://orientohub.com.br') {
    const result = { statusCode: 200, headers: {}, setHeader(k,v) { this.headers[k] = v; }, status(s) { this.statusCode = s; return this; }, end() { return this; }, json(body) { this.body = body; return this; } };
    await session({ method, headers: { host: 'orientohub.com.br', origin, authorization: token && `Bearer ${token}` } }, result);
    return result;
  }
  assert.equal((await callSession('POST')).statusCode, 401);
  assert.equal((await callSession('GET')).statusCode, 405);
  assert.equal((await callSession('POST', 'outage')).statusCode, 503);
  assert.equal((await callSession('POST', 'forged')).statusCode, 401);
  assert.equal((await callSession('POST', 'valid', 'https://attacker.example')).statusCode, 403);
  const loggedIn = await callSession('POST', 'valid');
  assert.equal(loggedIn.statusCode, 204);
  assert.match(loggedIn.headers['Set-Cookie'], /HttpOnly; Secure; SameSite=Lax/);
  assert.match((await callSession('DELETE')).headers['Set-Cookie'], /Max-Age=0/);
  const robots = await readFile('public/robots.txt', 'utf8');
  assert.doesNotMatch(robots, /dashboard|academy\/login/);
  const config = JSON.parse(await readFile('vercel.json', 'utf8'));
  for (const path of ['/dashboard', '/dashboard/:path*', '/academy/login', '/academy/login/:path*']) {
    assert.ok(config.headers.some(rule => rule.source === path && rule.headers.some(h => h.key === 'X-Robots-Tag' && h.value === 'noindex, nofollow')));
  }
  console.log('OK: robots, cabeçalhos, sessão, token forjado, autorização founder, indisponibilidade e login público.');
} finally {
  globalThis.fetch = originalFetch;
  await rm(dir, { recursive: true, force: true });
}
