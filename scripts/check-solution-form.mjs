import assert from 'node:assert/strict';
import ts from 'typescript';
import { readFile } from 'node:fs/promises';

const source = await readFile('src/lib/solutionForm.ts', 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`;
const { emptySolutionForm, validateSolutionForm, solutionSaveError, readSolutionDraft, saveSolutionDraft, clearSolutionDraft } = await import(moduleUrl);
const storage = new Map();
globalThis.sessionStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) };
const draft = { ...emptySolutionForm, name: 'Rascunho', description: 'Ainda preenchendo', stage: 'MVP', mrr: '97,50' };
saveSolutionDraft('user-a', draft);
assert.deepEqual(readSolutionDraft('user-a'), draft); // close and reopen
assert.deepEqual(readSolutionDraft('user-b'), emptySolutionForm); // account isolation
const reloaded = await import(`${moduleUrl}#reload`);
assert.deepEqual(reloaded.readSolutionDraft('user-a'), draft); // new module, browser storage preserved
clearSolutionDraft('user-a');
assert.deepEqual(readSolutionDraft('user-a'), emptySolutionForm);
assert.equal(storage.size, 0);
globalThis.sessionStorage = { getItem() { throw new Error('Disabled'); }, setItem() { throw new Error('Disabled'); }, removeItem() { throw new Error('Disabled'); } };
saveSolutionDraft('user-a', draft);
assert.deepEqual(readSolutionDraft('user-a'), draft);
clearSolutionDraft('user-a');
assert.deepEqual(readSolutionDraft('user-a'), emptySolutionForm);
const validate = patch => validateSolutionForm({ ...emptySolutionForm, ...patch });
assert.deepEqual(Object.keys(validate({}).errors).sort(), ['name', 'solution_url']);
assert.ok(validate({ name: '   ', solution_url: 'https://app.example.com' }).errors.name);
const valid = validate({ name: '  Minha solução  ', solution_url: 'app.example.com', description: ' Resolve um problema. ', mrr: '97,50', active_users: '10' });
assert.deepEqual(valid.errors, {});
assert.equal(valid.payload.name, 'Minha solução');
assert.equal(valid.payload.solution_url, 'https://app.example.com/');
assert.equal(valid.payload.description, 'Resolve um problema.');
assert.equal(valid.payload.git_url, null);
assert.equal(valid.payload.mrr, 97.5);
assert.equal(valid.payload.active_users, 10);
for (const url of ['javascript:alert(1)', 'postgres://user:secret@host/db', 'https://user:secret@example.com', 'https://']) {
  assert.ok(validate({ name: 'A', solution_url: url }).errors.solution_url, url);
}
assert.ok(validate({ git_url: 'https://github.com/organization' }).errors.git_url);
assert.ok(validate({ git_url: 'https://github.com.evil.example/org/repo' }).errors.git_url);
assert.equal(validate({ git_url: 'github.com/org/repo' }).payload.git_url, 'https://github.com/org/repo');
assert.ok(validate({ mrr: '-1' }).errors.mrr);
assert.ok(validate({ mrr: 'abc' }).errors.mrr);
assert.ok(validate({ active_users: '1.5' }).errors.active_users);
assert.ok(validate({ stage: 'Inexistente' }).errors.stage);
assert.match(solutionSaveError({ code: '42501' }), /permissão/);
assert.match(solutionSaveError({ code: 'PGRST204' }), /migração/);
assert.match(solutionSaveError(new Error('Falha de conexão')), /Falha de conexão/);
assert.match(solutionSaveError(null), /dados foram mantidos/);
console.log('OK: obrigatórios, normalização, URLs seguras, GitHub opcional, indicadores e mensagens de persistência.');
