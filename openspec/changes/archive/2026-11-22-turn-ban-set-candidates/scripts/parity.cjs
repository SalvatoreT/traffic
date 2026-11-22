// Compares the Rust ban sets (`explore --list-ban-sets`) with the TypeScript packages (`tools/turn-ban-sets.ts`) of the perimeter-turn-bans experiment, movement by movement:
// the entry movements and their turns, then every package both sides define (left-turns, right-turns, all-turns-access, through-streets, and each bounding street's turns).
//   node parity.cjs --rust target/ban-sets/sets.json --ts target/ban-sets/ts/packages.json
// Exit 1 on the first difference, with the differences listed.
const fs = require('fs');

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(`--${name}`); return i >= 0 && args[i + 1] ? args[i + 1] : undefined; };
const rust = JSON.parse(fs.readFileSync(opt('rust') ?? 'target/ban-sets/sets.json', 'utf8'));
const ts = JSON.parse(fs.readFileSync(opt('ts') ?? 'target/ban-sets/ts/packages.json', 'utf8'));
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'unnamed';
const key = (a, b) => `${a}-${b}`;
const bad = [];
const out = [];

const rm = new Map(rust.movements.map((m) => [key(m.from, m.to), m.turn]));
const tm = new Map(ts.movements.map((m) => [key(m.fromLink, m.toLink), m.turn]));
out.push(`entry movements: rust ${rm.size}, typescript ${tm.size}`);
for (const [k, t] of tm) if (rm.get(k) !== t) bad.push(`movement ${k}: typescript ${t}, rust ${rm.get(k) ?? 'missing'}`);
for (const k of rm.keys()) if (!tm.has(k)) bad.push(`movement ${k}: only in rust`);

const tsPackage = (id) => ts.packages.find((p) => p.id === id);
const tsPairs = (p) => new Set(p.movements.map((i) => { const m = ts.movements[i]; return key(m.fromLink, m.toLink); }));
const rustSet = (id) => rust.sets.find((s) => s.id === id);
const rustPairs = (s) => new Set(s.moves.map(([a, b]) => key(a, b)));
const same = (a, b) => a.size === b.size && [...a].every((x) => b.has(x));

const pairsToCompare = [['left-turns', 'left-turns'], ['right-turns', 'right-turns'], ['all-turns-access', 'all-turns-access'], ['through-streets', 'through-streets']];
for (const s of rust.boundingStreets) pairsToCompare.push([`from-${slug(s)}`, `street-${slug(s)}`]);
for (const [rid, tid] of pairsToCompare) {
  const t = tsPackage(tid);
  const r = rustSet(rid);
  const d = rust.dropped.find((x) => x.id === rid);
  if (!t) { bad.push(`${tid}: not in the typescript packages`); continue; }
  if (r) {
    const ok = same(rustPairs(r), tsPairs(t));
    out.push(`${rid} = ${tid}: ${r.bans} bans in rust, ${t.bans} in typescript, ${ok ? 'same movements' : 'DIFFERENT'}`);
    if (!ok) bad.push(`${rid} differs from ${tid}`);
  } else if (d) {
    out.push(`${rid} dropped in rust (${d.bans} bans, ${d.reason}); typescript ${tid} has ${t.bans}`);
    if (d.bans !== t.bans) bad.push(`${rid}: dropped with ${d.bans} bans, typescript has ${t.bans}`);
  } else bad.push(`${rid}: neither a set nor dropped in rust`);
}
const allTurns = rust.dropped.find((x) => x.id === 'all-turns');
if (allTurns && allTurns.bans !== tsPackage('all-turns').bans) bad.push(`all-turns: rust ${allTurns.bans}, typescript ${tsPackage('all-turns').bans}`);
console.log(out.join('\n'));
if (bad.length) { console.error(`PARITY FAILED:\n${bad.join('\n')}`); process.exit(1); }
console.log('parity ok: the Rust ban sets and the TypeScript packages hold the same movements');
