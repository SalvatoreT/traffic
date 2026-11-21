// node jdiff.cjs A B [--ignore path.with.*.wildcards]... : lists every leaf path where two JSON files differ; ignored paths are listed apart. Exit 1 on any non-ignored difference.
const fs = require('fs');
const [a, b, ...rest] = process.argv.slice(2);
const ign = [];
for (let i = 0; i < rest.length; i++) if (rest[i] === '--ignore') ign.push(rest[++i].split('.'));
const A = JSON.parse(fs.readFileSync(a, 'utf8')), B = JSON.parse(fs.readFileSync(b, 'utf8'));
const diffs = [], ignored = [];
const match = (p) => ign.some((g) => g.length === p.length && g.every((s, i) => s === '*' || s === String(p[i])));
const push = (p, x, y) => (match(p) ? ignored : diffs).push([p.join('.'), x, y]);
function walk(x, y, p) {
  if (match(p)) { if (JSON.stringify(x) !== JSON.stringify(y)) ignored.push([p.join('.'), x, y]); return; }
  if (x && y && typeof x === 'object' && typeof y === 'object' && Array.isArray(x) === Array.isArray(y)) {
    for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) {
      if (!(k in x)) push([...p, k], '(absent)', y[k]);
      else if (!(k in y)) push([...p, k], x[k], '(absent)');
      else walk(x[k], y[k], [...p, k]);
    }
  } else if (JSON.stringify(x) !== JSON.stringify(y)) diffs.push([p.join('.'), x, y]);
}
walk(A, B, []);
const s = (v) => { const t = JSON.stringify(v); return t && t.length > 120 ? t.slice(0, 120) + '...' : t; };
console.log(`${a} vs ${b}: ${diffs.length} differing paths, ${ignored.length} ignored paths`);
for (const [p, x, y] of ignored) console.log(`  ignored ${p}: ${s(x)} -> ${s(y)}`);
for (const [p, x, y] of diffs.slice(0, 40)) console.log(`  DIFF ${p}: ${s(x)} -> ${s(y)}`);
process.exit(diffs.length ? 1 : 0);
