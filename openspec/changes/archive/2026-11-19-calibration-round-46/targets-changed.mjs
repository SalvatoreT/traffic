// Usage: node openspec/changes/calibration-round-46/targets-changed.mjs <baseline stations.json> <candidate stations.json>
// Lists every station whose id, held flag or per-period target differs, and the station-set sizes. Run it on data/demand/rockridge.stations.json of the two builds.
import { readFileSync } from 'node:fs';
const load = (p) => JSON.parse(readFileSync(p, 'utf8')).stations;
const [a, b] = [load(process.argv[2]), load(process.argv[3])];
const byId = (s) => new Map(s.map((x) => [x.id, x]));
const A = byId(a), B = byId(b);
console.log(`stations: baseline ${a.length}, candidate ${b.length}; only in baseline ${[...A.keys()].filter((k) => !B.has(k)).length}; only in candidate ${[...B.keys()].filter((k) => !A.has(k)).length}`);
let n = 0;
for (const [id, x] of A) {
  const y = B.get(id);
  if (!y) { console.log(`REMOVED ${id}`); continue; }
  if (x.held !== y.held) console.log(`HELD FLAG ${id}: ${x.held} -> ${y.held}`);
  const d = Object.keys({ ...x.target, ...y.target }).filter((p) => Math.round(x.target?.[p] ?? 0) !== Math.round(y.target?.[p] ?? 0));
  if (d.length) { n++; console.log(`${x.held ? 'held ' : 'fit  '} ${x.year ?? '----'} ${id} | ${x.label ?? ''}\n      ` + d.map((p) => `${p} ${Math.round(x.target?.[p] ?? 0)} -> ${Math.round(y.target?.[p] ?? 0)}`).join(', ')); }
}
for (const [id] of B) if (!A.has(id)) console.log(`ADDED ${id}`);
console.log(`${n} stations with a changed target`);
