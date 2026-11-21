// node cmpdir.cjs BEFORE AFTER : compares two public/data trees file by file. Each common file is "identical" (same bytes),
// "stamp-only" (equal once simulator fingerprints, revisions and dates/timestamps are set aside) or "DIFFERENT". Files on one side only are listed.
// Exit 1 if any common file is DIFFERENT.
const fs = require('fs'), path = require('path');
const [before, after] = process.argv.slice(2);
const walk = (d, r = '') => fs.readdirSync(path.join(d, r), { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(d, path.join(r, e.name)) : [path.join(r, e.name)]);
const B = new Set(walk(before)), Aft = new Set(walk(after));
const FP = /(d45a275dd7be|6b886c8f52ee)[0-9a-f]*/g;
const TS = /\b20\d\d-\d\d-\d\d(T\d\d:\d\d:\d\d(\.\d+)?Z)?\b/g;
const REV = /\b(revision|sourceRevision)([`"': ]+)[0-9a-f]{7,40}(-dirty)?/g;
const normText = (s) => s.replace(FP, 'FP').replace(TS, 'DATE').replace(REV, '$1$2REV');
const REVKEYS = new Set(['revision', 'sourceRevision']);
function normJson(v, k) {
  if (typeof v === 'string') return REVKEYS.has(k) ? 'REV' : normText(v);
  if (Array.isArray(v)) return v.map((x) => normJson(x));
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([kk, x]) => [kk, normJson(x, kk)]));
  return v;
}
function leafDiffs(x, y, p, out) {
  if (out.length > 12) return;
  if (x && y && typeof x === 'object' && typeof y === 'object') {
    for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) leafDiffs(x[k], y[k], p.concat(k), out);
  } else if (JSON.stringify(x) !== JSON.stringify(y)) out.push(p.map((s) => (/^\d+$/.test(s) ? '*' : s)).join('.'));
}
const res = { identical: [], stamp: [], different: [] };
const stampPaths = new Map();
for (const f of [...B].filter((f) => Aft.has(f)).sort()) {
  const a = fs.readFileSync(path.join(before, f)), b = fs.readFileSync(path.join(after, f));
  if (a.equals(b)) { res.identical.push(f); continue; }
  if (f.endsWith('.json')) {
    const ja = JSON.parse(a), jb = JSON.parse(b);
    const raw = []; leafDiffs(ja, jb, [], raw);
    const na = normJson(ja), nb = normJson(jb), real = []; leafDiffs(na, nb, [], real);
    if (real.length === 0) { res.stamp.push(f); for (const p of new Set(raw)) stampPaths.set(p, (stampPaths.get(p) || 0) + 1); }
    else res.different.push(`${f}: ${[...new Set(real)].slice(0, 8).join(', ')}`);
  } else if (/\.(md|txt|html|csv)$/.test(f)) {
    const ta = normText(a.toString('utf8')).split('\n'), tb = normText(b.toString('utf8')).split('\n');
    if (ta.join('\n') === tb.join('\n')) {
      res.stamp.push(f);
      const la = a.toString('utf8').split('\n'), lb = b.toString('utf8').split('\n');
      for (let i = 0; i < Math.max(la.length, lb.length); i++) if (la[i] !== lb[i]) { const key = `${f.split('/')[0]} text line: ${(lb[i] || '').replace(/\s+/g, ' ').slice(0, 90)}`; stampPaths.set(key, (stampPaths.get(key) || 0) + 1); }
    } else {
      let n = 0; for (let i = 0; i < Math.max(ta.length, tb.length); i++) if (ta[i] !== tb[i]) n++;
      res.different.push(`${f}: ${n} lines differ after stamps are set aside`);
    }
  } else res.different.push(`${f}: binary, bytes differ`);
}
const onlyB = [...B].filter((f) => !Aft.has(f)).sort(), onlyA = [...Aft].filter((f) => !B.has(f)).sort();
console.log(`common files ${res.identical.length + res.stamp.length + res.different.length}: identical ${res.identical.length}, stamp-only ${res.stamp.length}, DIFFERENT ${res.different.length}; only before ${onlyB.length}; only after ${onlyA.length}`);
console.log('\nStamp fields that changed (path: files):');
for (const [p, n] of [...stampPaths].sort()) console.log(`  ${p}: ${n}`);
console.log('\nStamp-only files:'); for (const f of res.stamp) console.log(`  ${f}`);
console.log('\nDIFFERENT files:'); for (const f of res.different) console.log(`  ${f}`);
console.log('\nOnly in the published set:'); for (const f of onlyB) console.log(`  ${f}`);
console.log('\nOnly in the new set:'); for (const f of onlyA) console.log(`  ${f}`);
console.log('\nIdentical files:'); for (const f of res.identical) console.log(`  ${f}`);
process.exit(res.different.length ? 1 : 0);
