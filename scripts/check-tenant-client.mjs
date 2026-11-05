import assert from 'node:assert/strict';
import ts from 'typescript';
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const transpile = source => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const loadSource = source => import(`data:text/javascript;base64,${Buffer.from(transpile(source)).toString('base64')}`);
const cache = await loadSource(await readFile('src/lib/memoryCache.ts', 'utf8'));
let finish;
const old = cache.getOrLoadCachedValue('shared-test', 60000, () => new Promise(resolve => { finish = resolve; }));
const deniedOld = assert.rejects(old, /sessão mudou/);
cache.invalidateCache();
assert.equal(await cache.getOrLoadCachedValue('shared-test', 60000, async () => 'B'), 'B');
finish('A private data');
await deniedOld;
assert.equal(cache.getCachedValue('shared-test'), 'B');

let account = 'A';
const callbacks = [];
let postpone = false;
let resolveQuery;
const database = [{ id: 'a', user_id: 'A', name: 'Private A' }, { id: 'b', user_id: 'B', name: 'Private B' }];
const mock = {
  auth: { getUser: async () => ({ data: { user: account ? { id: account } : null } }), onAuthStateChange(callback) { callbacks.push(callback); callback('INITIAL_SESSION', { user: { id: account } }); } },
  from() {
    const filters = []; let action = 'read'; let payload;
    const query = {
      select() { return query; }, eq(key,value) { filters.push([key,value]); return query; }, order() { return query; }, single() { return query; },
      insert(value) { action='insert'; payload=value; return query; }, update(value) { action='update'; payload=value; return query; }, delete() { action='delete'; return query; },
      then(resolve,reject) {
        assert.ok(action === 'insert' || filters.some(([key,value]) => key === 'user_id' && value === account), 'Every read/mutation must include owner filtering');
        if (action === 'update') assert.equal('user_id' in payload, false);
        const rows = database.filter(row => filters.every(([key,value]) => row[key] === value));
        const response = { data: action === 'read' ? rows : action === 'update' ? { ...rows[0], ...payload } : null, error: null };
        if (postpone) { postpone = false; return new Promise(done => { resolveQuery = () => done(response); }).then(resolve,reject); }
        return Promise.resolve(response).then(resolve,reject);
      },
    }; return query;
  },
};
globalThis.__tenantSupabase = mock;
const source = (await readFile('src/services/solutionsService.ts','utf8')).replace("import { supabase } from '../config/supabase';", 'const supabase = globalThis.__tenantSupabase;');
const { solutionsService } = await loadSource(source);
const change = id => { account=id; callbacks.forEach(callback => callback('SIGNED_IN', id ? { user:{id} } : null)); };
assert.equal((await solutionsService.getAll())[0].name, 'Private A');
assert.equal(solutionsService.getCachedSolutions('B'), null);
postpone = true;
const pendingA = solutionsService.getAll(true);
await new Promise(resolve => setTimeout(resolve,0));
const rejectedA = assert.rejects(pendingA, /sessão mudou/);
change('B'); resolveQuery(); await rejectedA;
assert.equal(solutionsService.getCachedSolutions('A'), null);
assert.equal((await solutionsService.getAll())[0].name, 'Private B');
await solutionsService.update('b', { name:'B updated', user_id:'A' });
await solutionsService.delete('b');
change(null);
assert.equal(solutionsService.getCachedSolutions('B'), null);
await assert.rejects(() => solutionsService.getAll(), /login/);

const { privateIdeaImagePath } = await loadSource(await readFile('src/lib/privateIdeaImages.ts','utf8'));
const base='https://example.supabase.co';
assert.equal(privateIdeaImagePath('A/idea/image.png','A',base), 'A/idea/image.png');
assert.equal(privateIdeaImagePath(`${base}/storage/v1/object/public/idea-images/A/idea/image.png`,'A',base), 'A/idea/image.png');
assert.equal(privateIdeaImagePath(`${base}/storage/v1/object/sign/idea-images/A/idea/image.png?token=expired`,'A',base), 'A/idea/image.png');
assert.equal(privateIdeaImagePath('B/idea/image.png','A',base), null);
assert.equal(privateIdeaImagePath('A/../B/image.png','A',base), null);
assert.equal(privateIdeaImagePath('https://evil.example/storage/v1/object/public/idea-images/A/image.png','A',base), null);

// Test the real handlers in Node ESM, with no network or production credentials.
for (const file of ['api/webhook.ts','api/create-mercadopago-checkout.ts']) {
  await writeFile(`scratch/tenant-audit/${file.split('/').pop().replace('.ts','.mjs')}`, transpile(await readFile(file,'utf8')));
}
const { default: webhook } = await import(pathToFileURL(resolve('scratch/tenant-audit/webhook.mjs')));
const { default: checkout } = await import(pathToFileURL(resolve('scratch/tenant-audit/create-mercadopago-checkout.mjs')));
const response = () => ({ statusCode:200, status(code){this.statusCode=code;return this;}, json(body){this.body=body;return this;}, end(){return this;} });
delete process.env.ASAAS_WEBHOOK_TOKEN;
const missingSecret=response(); await webhook({method:'POST',headers:{},body:{}},missingSecret);
assert.equal(missingSecret.statusCode,401);
process.env.MERCADOPAGO_ACCESS_TOKEN='fake'; process.env.SUPABASE_URL='https://example.supabase.co'; process.env.SUPABASE_ANON_KEY='fake'; process.env.SUPABASE_SERVICE_ROLE_KEY='fake';
const originalFetch=globalThis.fetch;
globalThis.fetch=async () => { throw new Error('Unexpected network call in unauthenticated checkout'); };
try {
  const spoofed=response(); await checkout({method:'POST',headers:{},body:{plan:'pro',billing:'monthly',email:'b@example.test',newUserId:'B'}},spoofed);
  assert.equal(spoofed.statusCode,401);
} finally { globalThis.fetch=originalFetch; }
console.log('OK: troca de conta, cache atrasado, mutações por proprietário, imagens privadas, checkout sem sessão e webhook sem segredo.');
