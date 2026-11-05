import assert from 'node:assert/strict';
import ts from 'typescript';
import { readFile } from 'node:fs/promises';

const compiled = ts.transpileModule(await readFile('src/lib/resourceLimits.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { parseResourceLimit, limitLabel } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
assert.equal(parseResourceLimit(''), null);
assert.equal(parseResourceLimit('   '), null);
assert.equal(parseResourceLimit('0'), 0);
assert.equal(parseResourceLimit(' 10 '), 10);
assert.equal(parseResourceLimit('2147483647'), 2147483647);
for (const value of ['-1', '1.5', 'NaN', 'Infinity', '1e2', '2147483648', 'abc']) {
  assert.throws(() => parseResourceLimit(value), Error, value);
}
assert.equal(limitLabel(null), 'Sem limite');
assert.equal(limitLabel(0), '0');
console.log('OK: ilimitado, bloqueio por zero, inteiros válidos e rejeição de quantidades inválidas.');
