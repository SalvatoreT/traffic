// Round 50 (from round 48): the baseline ten-seed set (60r47-base: same network, demands 9cdebdabf05c / 2f9ae152b9bb, stations c9db41c930ac, simulator d45a275dd7be)
// against the candidate node-ceiling-membership (60r50, demands 0a589118e2ef / 26f4b0bd65c7, same stations file). No station target changed.
// Fitted stations are judged on the shipped demand, held-out stations on the cross-validation demand, as tools/assess.ts does.
import { existsSync, readFileSync } from 'node:fs';
import { readSeeds, scoreStations, type StationFile } from '../../tools/lib/assess';

const area = 'rockridge';
const T = 'target/r50';
const NS = 10;
const seeds = Array.from({ length: NS }, (_, i) => i + 1);
const rec = JSON.parse(readFileSync(`data/demand/${area}.config.json`, 'utf8')).countFit.recency as { referenceYear: number; recentYears: number };
const stations: StationFile = JSON.parse(readFileSync(`${T}/stations.base.json`, 'utf8'));
const net = JSON.parse(readFileSync(`${T}/network.base.json`, 'utf8')) as { nodes: { id: number }[]; links: { id: number; from: number; to: number }[] };

type SetDef = { name: string; ship: string; cv: string; demand: string; demandCv: string };
const sets: SetDef[] = [
  { name: 'baseline', ship: 'target/assess-seeds/60r47-base', cv: 'target/assess-seeds/60r47-base-cv', demand: `${T}/demand.base.json`, demandCv: `${T}/demand.base.cv.json` },
  { name: 'candidate', ship: 'target/assess-seeds/60r50', cv: 'target/assess-seeds/60r50-cv', demand: `${T}/demand.cand.json`, demandCv: `${T}/demand.cand.cv.json` },
];
type Case = ReturnType<typeof scoreStations>['cases'][number];
type Scored = { ship: Map<string, Case>; cv: Map<string, Case> };
const periods = ['pm_peak', 'am_peak'] as const;
const sc: Record<string, Record<string, Scored>> = {};
const raw: Record<string, Record<string, { ship: ReturnType<typeof readSeeds>; cv: ReturnType<typeof readSeeds> }>> = {};
for (const p of periods) {
  sc[p] = {}; raw[p] = {};
  for (const s of sets) {
    const r = readSeeds(s.ship, area, p, seeds), rcv = readSeeds(s.cv, area, p, seeds);
    if (r.length !== NS || rcv.length !== NS) throw new Error(`${s.name} ${p}: ${r.length}/${rcv.length} seeds`);
    raw[p][s.name] = { ship: r, cv: rcv };
    sc[p][s.name] = { ship: new Map(scoreStations(r, stations, p).cases.map((c) => [c.stationId, c])), cv: new Map(scoreStations(rcv, stations, p).cases.map((c) => [c.stationId, c])) };
  }
}
const recent = (c: Case) => !c.derived && c.year != null && rec.referenceYear - c.year <= rec.recentYears;
const judged = (p: string, s: string, id: string) => { const c = sc[p][s].ship.get(id)!; return c.held ? sc[p][s].cv.get(id)! : c; };
const tally = (p: string, s: string, held: boolean) => {
  let ok = 0, n = 0;
  for (const [id, c] of sc[p][s].ship) { if (!recent(c) || !!c.held !== held) continue; n++; if (judged(p, s, id).gehOk) ok++; }
  return { ok, n };
};
const f0 = (x: number) => (Number.isFinite(x) ? Math.round(x).toString() : '-');
const f1 = (x: number) => x.toFixed(1);
const f2 = (x: number) => x.toFixed(2);
const mean = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length;
const cols = sets.map((s) => `${s.name} shipped | ${s.name} training`).join(' | ');
const colSep = sets.map(() => '--- | ---').join(' | ');

console.log('STATION LINES (ten seeds; same stations file for both sets)');
console.log('| Criterion | Line | Baseline | Candidate | Pass |');
console.log('| --- | --- | --- | --- | --- |');
const lines: Record<string, number> = { 'pm_peak fitted': 74, 'pm_peak held': 14, 'am_peak fitted': 70, 'am_peak held': 14 };
for (const p of periods) for (const held of [false, true]) {
  const k = `${p} ${held ? 'held' : 'fitted'}`, b = tally(p, 'baseline', held), c = tally(p, 'candidate', held);
  console.log(`| ${p === 'pm_peak' ? 'PM' : 'AM'} ${held ? 'held out' : 'fitted'} | ${lines[k]} of ${c.n} | ${b.ok} of ${b.n} | ${c.ok} of ${c.n} | ${c.ok >= lines[k] ? 'yes' : 'NO'} |`);
}

const diag: [string, string][] = [['count block 2697', 'Forest St EB'], ['count block 1933', 'McAuley St EB, Howell to Canning'], ['count block 1868', '60th St EB, Howell to Canning'], ['count block 1831', 'Ayala Ave NB, Martin to Howell'], ['count block 2055', 'Howell St SB, 59th to McAuley']];
const blockTable = (title: string, list: [string, string][], p: string) => {
  console.log(`\n${title} ${p} (simulated veh/h, seed mean; shipped = shipped demand, training = cross-validation demand)`);
  console.log(`| Station | Set | Counted | ${cols} |`);
  console.log(`| --- | --- | --- | ${colSep} |`);
  const sum: Record<string, number> = {}; let counted = 0, n = 0;
  for (const [id, name] of list) {
    const c0 = sc[p].baseline.ship.get(id);
    if (!c0) { console.log(`| ${name} | (no case) | | ${sets.map(() => '- | -').join(' | ')} |`); continue; }
    counted += c0.counted; n++;
    const v = sets.map((s) => { const a = sc[p][s.name].ship.get(id)!.modeled, b = sc[p][s.name].cv.get(id)!.modeled; sum[`${s.name} s`] = (sum[`${s.name} s`] ?? 0) + a; sum[`${s.name} c`] = (sum[`${s.name} c`] ?? 0) + b; return `${f0(a)} | ${f0(b)}`; });
    console.log(`| ${name} | ${c0.held ? 'held out' : 'fitted'} | ${f0(c0.counted)} | ${v.join(' | ')} |`);
  }
  console.log(`| Sum (${n} stations) | | ${f0(counted)} | ${sets.map((s) => `${f0(sum[`${s.name} s`])} | ${f0(sum[`${s.name} c`])}`).join(' | ')} |`);
  console.log(`| Sim / count | | | ${sets.map((s) => `${f2(sum[`${s.name} s`] / counted)} | ${f2(sum[`${s.name} c`] / counted)}`).join(' | ')} |`);
};
for (const p of periods) blockTable('DIAGONAL STATIONS', diag, p);
const colby: [string, string][] = [['count block 2591', 'Colby St NB, Forest/Claremont to McAuley'], ['count block 2593', 'Colby St NB, McAuley to 60th'], ['count block 2595', 'Colby St NB, 60th to 61st'], ['count block 2597', 'Colby St NB, 61st to 62nd'], ['count block 2599', 'Colby St NB, 62nd to 63rd'], ['count block 2601', 'Colby St NB, 63rd to 63rd'], ['count block 2605', 'Colby St NB, North to Alcatraz']];
for (const p of periods) blockTable('COLBY ST NB BLOCKS', colby, p);

const ramps: [string, string][] = [
  ['ix sr24-hudson-claremont W leaving', 'Claremont Ave on-ramp (node 833), counted'], ['ix sr24-clifton-claremont W entering', 'Clifton St off-ramp (node 683), counted'],
  ['ix sr24-52nd N leaving', '52nd St on-ramp (node 725), counted'], ['ix sr24-52nd S entering', '52nd St off-ramp (node 727), counted'],
  ['ix sr24-mlk E leaving', 'MLK Jr Way on-ramp (node 679), counted'], ['ix sr24-mlk E entering', 'MLK Jr Way off-ramp (node 719), counted'],
];
for (const [id, c] of sc.pm_peak.baseline.ship) if (c.kind === 'ramp') ramps.push([id, c.label]);
for (const p of periods) {
  console.log(`\nSR-24 RAMPS ${p} (target: count, or ADT x K from the stations file; simulated veh/h, seed mean)`);
  console.log(`| Ramp | Set | Target | ${cols} |`);
  console.log(`| --- | --- | --- | ${colSep} |`);
  for (const [id, name] of ramps) {
    const c0 = sc[p].baseline.ship.get(id);
    if (!c0) { console.log(`| ${name} | (no case in ${p}) | | ${sets.map(() => '- | -').join(' | ')} |`); continue; }
    const v = sets.map((s) => `${f0(sc[p][s.name].ship.get(id)!.modeled)} | ${f0(sc[p][s.name].cv.get(id)!.modeled)}`);
    console.log(`| ${name} | ${c0.held ? 'held out' : 'fitted'} ${c0.year ?? ''}${c0.derived ? ' derived' : ''} | ${f0(c0.counted)} | ${v.join(' | ')} |`);
  }
}

console.log('\nFLIPS candidate vs baseline (recent stations, judged as in the verdict)');
console.log('| Period | Station | Set | Target | Baseline | GEH | Candidate | GEH | Flip |');
console.log('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const p of periods) for (const [id, c] of sc[p].baseline.ship) {
  if (!recent(c)) continue;
  const b = judged(p, 'baseline', id), q = judged(p, 'candidate', id);
  if (b.gehOk !== q.gehOk) console.log(`| ${p} | ${c.label} | ${c.held ? 'held out' : 'fitted'} | ${f0(b.counted)} | ${f0(b.modeled)} | ${f1(b.geh)} | ${f0(q.modeled)} | ${f1(q.geh)} | ${b.gehOk ? 'pass to fail' : 'fail to pass'} |`);
}

// Per-seed markdown reports: study-area through cars, offered and waiting trips at the SR-24 mainline entry gates.
const md = (dir: string, p: string, seed: number) => readFileSync(`${dir}/${area}-${p}-s1-seed${seed}.md`, 'utf8');
const section = (text: string, head: string) => { const i = text.indexOf(head); if (i < 0) return ''; const j = text.indexOf('\n## ', i + head.length); return text.slice(i, j < 0 ? undefined : j); };
const tableVal = (sec: string, node: number, col: number) => { for (const l of sec.split('\n')) { const c = l.split('|').map((x) => x.trim()); if (c[1] === String(node)) return +c[col]; } return NaN; };
const through = (text: string) => +(section(text, '### Study area, all residential and service streets').match(/Model: (\d+(?:\.\d+)?) through cars per hour/)?.[1] ?? NaN);
const gates = [
  { node: 602, name: 'SR-24 EB entering at the west end (Grove Shafter Fwy)', entry: true },
  { node: 1719, name: 'SR-24 WB entering from the Caldecott Tunnel', entry: true },
  { node: 675, name: 'SR-24 WB leaving at the west end', entry: false },
  { node: 1726, name: 'SR-24 EB leaving toward the Caldecott Tunnel', entry: false },
];
const outLinks = (n: number) => net.links.filter((l) => l.from === n).map((l) => l.id);
const inLinks = (n: number) => net.links.filter((l) => l.to === n).map((l) => l.id);

console.log('\nTHROUGH CARS IN THE STUDY AREA (all residential and service streets, per hour, seed mean and range; per-seed calibrate report)');
console.log('| Period | Set | Shipped demand | Training demand |');
console.log('| --- | --- | --- | --- |');
for (const p of periods) for (const s of sets) {
  const a = seeds.map((n) => through(md(s.ship, p, n))), b = seeds.map((n) => through(md(s.cv, p, n)));
  console.log(`| ${p} | ${s.name} | ${f0(mean(a))} (${f0(Math.min(...a))} to ${f0(Math.max(...a))}) | ${f0(mean(b))} (${f0(Math.min(...b))} to ${f0(Math.max(...b))}) |`);
}

console.log('\nSR-24 MAINLINE GATES, simulated (seed mean; entry: offered veh/h before scale from the run report, flow on the links leaving the gate, trips waiting at the end of the run (blank when the gate is not in the top-10 backlog table of a seed, counted as 0); exit: flow on the links into the gate)');
console.log('| Period | Gate | Set | View | Offered | Simulated flow | Waiting at end (mean, seeds listed) |');
console.log('| --- | --- | --- | --- | --- | --- | --- |');
for (const p of periods) for (const g of gates) for (const s of sets) for (const [view, dir, runs] of [['shipped', s.ship, raw[p][s.name].ship], ['training', s.cv, raw[p][s.name].cv]] as const) {
  const flow = mean(runs.map((r) => (g.entry ? outLinks(g.node) : inLinks(g.node)).reduce((a, l) => a + ((g.entry ? r.linkStartVehPerHour : r.linkStopLineVehPerHour)?.[l] ?? NaN), 0)));
  if (!g.entry) { console.log(`| ${p} | ${g.name} (node ${g.node}) | ${s.name} | ${view} | | ${f0(flow)} | |`); continue; }
  const texts = seeds.map((n) => md(dir, p, n));
  const off = mean(texts.map((t) => tableVal(section(t, '## Largest demand origins'), g.node, 3)));
  const w = texts.map((t) => tableVal(section(t, '## Entry backlog by origin node'), g.node, 3));
  const listed = w.filter(Number.isFinite).length;
  console.log(`| ${p} | ${g.name} (node ${g.node}) | ${s.name} | ${view} | ${f0(off)} | ${f0(flow)} | ${f0(mean(w.map((x) => (Number.isFinite(x) ? x : 0))))} (${listed} of ${NS}) |`);
}

console.log('\nDEMAND FILES (car veh/h; origin = trips that start at the gate, destination = trips that end there)');
console.log('| Period | Set | View | Total | 602 origin | 1719 origin | 675 destination | 1726 destination | Surface gates origin | Surface gates destination |');
console.log('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
const gateIds = new Set((net.nodes as { id: number; gate?: boolean }[]).filter((n) => n.gate).map((n) => n.id));
const mainline = new Set([602, 1719, 675, 1726, 1672, 1674]);
for (const p of periods) for (const s of sets) for (const [view, file] of [['shipped', s.demand], ['training', s.demandCv]] as const) {
  if (!existsSync(file)) { console.log(`| ${p} | ${s.name} | ${view} | (${file} missing) |`); continue; }
  const d = JSON.parse(readFileSync(file, 'utf8')) as { periods: { id: string; flows: { origin: number; destination: number; vehPerHour: number; mode?: string }[] }[] };
  const fl = d.periods.find((x) => x.id === p)!.flows.filter((f) => !f.mode || f.mode === 'car');
  const sum = (pred: (f: (typeof fl)[number]) => boolean) => fl.filter(pred).reduce((a, f) => a + f.vehPerHour, 0);
  console.log(`| ${p} | ${s.name} | ${view} | ${f0(sum(() => true))} | ${f0(sum((f) => f.origin === 602))} | ${f0(sum((f) => f.origin === 1719))} | ${f0(sum((f) => f.destination === 675))} | ${f0(sum((f) => f.destination === 1726))} | ${f0(sum((f) => gateIds.has(f.origin) && !mainline.has(f.origin)))} | ${f0(sum((f) => gateIds.has(f.destination) && !mainline.has(f.destination)))} |`);
}
