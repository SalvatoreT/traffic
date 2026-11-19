// Round 46: per-station comparison of the baseline (ten seeds on the b1ff0ef demands, target/r44/p0 and p0cv, judged on the baseline stations file)
// and each candidate (target/assess-seeds/60r46-<candidate> and -cv, judged on the candidate's stations file). Fitted stations are judged on the
// shipped demand, held-out stations on the cross-validation demand, as tools/assess.ts does. The keep-rule lines are filled twice (design D4):
// with every station, and without the stations whose target the candidate changed (evidence/<candidate>-targets-changed.txt); in the second fill
// the line is the baseline's own count on the same stations, so a moved target cannot count as a gain.
import { existsSync, readFileSync } from 'node:fs';
import { readSeeds, scoreStations, type StationFile } from '../../tools/lib/assess';

const area = 'rockridge';
const T = 'target/r46';
const EV = 'openspec/changes/calibration-round-46/evidence';
const NS = +(process.env.SEEDS ?? 10), SUF = process.env.SUF ?? '';
const seeds = Array.from({ length: NS }, (_, i) => i + 1);
const rec = JSON.parse(readFileSync(`data/demand/${area}.config.json`, 'utf8')).countFit.recency as { referenceYear: number; recentYears: number };
const load = (p: string): StationFile => JSON.parse(readFileSync(p, 'utf8'));
const changedIds = (c: string) => new Set(readFileSync(`${EV}/${c}-targets-changed.txt`, 'utf8').split('\n').map((l) => l.match(/^(?:held |fit  ) (?:\d{4}|----) (.+?) \| /)?.[1]).filter((x): x is string => !!x));

type SetDef = { name: string; ship: string; cv: string; stations: StationFile; changed: Set<string> };
const sets: SetDef[] = [{ name: 'baseline', ship: process.env.BASE ?? 'target/r44/p0', cv: process.env.BASE ? `${process.env.BASE}-cv` : 'target/r44/p0cv', stations: load(`${T}/stations.base.json`), changed: new Set() }];
for (const c of process.argv.length > 2 ? process.argv.slice(2) : ['ramp-k-counted', 'ramp-k-counted-min2']) {
  if (!existsSync(`target/assess-seeds/60r46-${c}${SUF}`)) { console.log(`(${c}: no ten-seed set, skipped)`); continue; }
  sets.push({ name: c, ship: `target/assess-seeds/60r46-${c}${SUF}`, cv: `target/assess-seeds/60r46-${c}${SUF}-cv`, stations: load(`${T}/stations-${c}.json`), changed: changedIds(c) });
}

type Case = ReturnType<typeof scoreStations>['cases'][number];
type Scored = { ship: Map<string, Case>; cv: Map<string, Case> };
const periods = ['pm_peak', 'am_peak'] as const;
const sc: Record<string, Record<string, Scored>> = {};
for (const p of periods) {
  sc[p] = {};
  for (const s of sets) {
    const r = readSeeds(s.ship, area, p, seeds), rcv = readSeeds(s.cv, area, p, seeds);
    if (r.length !== NS || rcv.length !== NS) throw new Error(`${s.name} ${p}: ${r.length}/${rcv.length} seeds`);
    sc[p][s.name] = { ship: new Map(scoreStations(r, s.stations, p).cases.map((c) => [c.stationId, c])), cv: new Map(scoreStations(rcv, s.stations, p).cases.map((c) => [c.stationId, c])) };
  }
}
const recent = (c: Case) => !c.derived && c.year != null && rec.referenceYear - c.year <= rec.recentYears;
const judged = (p: string, s: string, id: string) => { const c = sc[p][s].ship.get(id)!; return c.held ? sc[p][s].cv.get(id)! : c; };
const tally = (p: string, s: string, held: boolean, exclude: Set<string>) => {
  let ok = 0, n = 0;
  for (const [id, c] of sc[p][s].ship) { if (!recent(c) || !!c.held !== held || exclude.has(id)) continue; n++; if (judged(p, s, id).gehOk) ok++; }
  return { ok, n };
};
const f0 = (x: number) => Math.round(x).toString();
const f1 = (x: number) => x.toFixed(1);

const lines: Record<string, number> = { 'pm_peak fitted': 74, 'pm_peak held': 14, 'am_peak fitted': 70, 'am_peak held': 14 };
console.log(`KEEP RULE, station lines (${NS} seeds${SUF ? `, sets ${SUF}` : ''}, baseline ${sets[0].ship}; fitted on the shipped demand, held out on the cross-validation demand${NS < 10 ? '; the lines are the ten-seed keep rule, shown for orientation only' : ''})`);
for (const s of sets.slice(1)) {
  console.log(`\n${s.name}: ${s.changed.size} stations with a changed target (${[...s.changed].join(', ')})`);
  console.log('| Criterion | Line | Baseline | Candidate | Pass | Without changed: line (baseline on the same stations) | Candidate | Pass |');
  console.log('| --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const p of periods) for (const held of [false, true]) {
    const k = `${p} ${held ? 'held' : 'fitted'}`;
    const b = tally(p, 'baseline', held, new Set()), c = tally(p, s.name, held, new Set());
    const bx = tally(p, 'baseline', held, s.changed), cx = tally(p, s.name, held, s.changed);
    console.log(`| ${p === 'pm_peak' ? 'PM' : 'AM'} ${held ? 'held out' : 'fitted'} | ${lines[k]} of ${c.n} | ${b.ok} of ${b.n} | ${c.ok} of ${c.n} | ${c.ok >= lines[k] ? 'yes' : 'NO'} | ${bx.ok} of ${bx.n} | ${cx.ok} of ${cx.n} | ${cx.ok >= bx.ok ? 'yes' : 'NO'} |`);
  }
}

const diag: [string, string][] = [['count block 2697', 'Forest St EB'], ['count block 1933', 'McAuley St EB, Howell to Canning'], ['count block 1868', '60th St EB, Howell to Canning'], ['count block 1831', 'Ayala Ave NB, Martin to Howell'], ['count block 2055', 'Howell St SB, 59th to McAuley']];
const cols = sets.map((s) => `${s.name} shipped | ${s.name} training`).join(' | ');
const colSep = sets.map(() => '--- | ---').join(' | ');
for (const p of periods) {
  console.log(`\nDIAGONAL STATIONS ${p} (simulated veh/h, seed mean; shipped = shipped demand, training = cross-validation demand)`);
  console.log(`| Station | Set | Counted | ${cols} |`);
  console.log(`| --- | --- | --- | ${colSep} |`);
  const sum: Record<string, number> = {}; let counted = 0;
  for (const [id, name] of diag) {
    const c0 = sc[p].baseline.ship.get(id);
    if (!c0) { console.log(`| ${name} | (no case) |`); continue; }
    counted += c0.counted;
    const v = sets.map((s) => { const a = sc[p][s.name].ship.get(id)!.modeled, b = sc[p][s.name].cv.get(id)!.modeled; sum[`${s.name} s`] = (sum[`${s.name} s`] ?? 0) + a; sum[`${s.name} c`] = (sum[`${s.name} c`] ?? 0) + b; return `${f0(a)} | ${f0(b)}`; });
    console.log(`| ${name} | ${c0.held ? 'held out' : 'fitted'} | ${f0(c0.counted)} | ${v.join(' | ')} |`);
  }
  console.log(`| Sum | | ${f0(counted)} | ${sets.map((s) => `${f0(sum[`${s.name} s`])} | ${f0(sum[`${s.name} c`])}`).join(' | ')} |`);
}

const ramps: [string, string][] = [
  ['ix sr24-hudson-claremont W leaving', 'Claremont Ave on-ramp (node 833), counted'], ['ix sr24-clifton-claremont W entering', 'Clifton St off-ramp (node 683), counted'],
  ['ix sr24-52nd N leaving', '52nd St on-ramp (node 725), counted'], ['ix sr24-52nd S entering', '52nd St off-ramp (node 727), counted'],
  ['ix sr24-mlk E leaving', 'MLK Jr Way on-ramp (node 679), counted'], ['ix sr24-mlk E entering', 'MLK Jr Way off-ramp (node 719), counted'],
];
for (const [id, c] of sc.pm_peak.baseline.ship) if (c.kind === 'ramp') ramps.push([id, c.label]);
for (const p of periods) {
  console.log(`\nSR-24 RAMPS ${p} (target: count, or ADT x K from the stations file; simulated veh/h, seed mean)`);
  console.log(`| Ramp | Set | Target ${sets.map((s) => s.name).join(' / ')} | ${cols} |`);
  console.log(`| --- | --- | --- | ${colSep} |`);
  for (const [id, name] of ramps) {
    const c0 = sc[p].baseline.ship.get(id);
    if (!c0) { console.log(`| ${name} | (no case in ${p}) | | |`); continue; }
    const tg = sets.map((s) => f0(sc[p][s.name].ship.get(id)!.counted)).join(' / ');
    const v = sets.map((s) => `${f0(sc[p][s.name].ship.get(id)!.modeled)} | ${f0(sc[p][s.name].cv.get(id)!.modeled)}`);
    console.log(`| ${name} | ${c0.held ? 'held out' : 'fitted'} ${c0.year ?? ''}${c0.derived ? ' derived' : ''} | ${tg} | ${v.join(' | ')} |`);
  }
}

for (const s of sets.slice(1)) {
  console.log(`\nFLIPS ${s.name} vs baseline (recent stations; * = target changed)`);
  console.log('| Period | Station | Set | Target base / cand | Baseline | GEH | Candidate | GEH | Flip |');
  console.log('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const p of periods) for (const [id, c] of sc[p].baseline.ship) {
    if (!recent(c)) continue;
    const b = judged(p, 'baseline', id), q = judged(p, s.name, id);
    if (b.gehOk !== q.gehOk) console.log(`| ${p} | ${c.label}${s.changed.has(id) ? ' *' : ''} | ${c.held ? 'held out' : 'fitted'} | ${f0(b.counted)} / ${f0(q.counted)} | ${f0(b.modeled)} | ${f1(b.geh)} | ${f0(q.modeled)} | ${f1(q.geh)} | ${b.gehOk ? 'pass to fail' : 'fail to pass'} |`);
  }
}
