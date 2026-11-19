// Round 44: per-station comparison of the baseline (runs on the b1ff0ef demands, target/r44/p0 and p0cv) and the candidate (target/assess-seeds/60r44 and -cv).
// Fitted stations are judged on the shipped demand, held-out stations on the cross-validation demand, as tools/assess.ts does.
import { readFileSync } from 'node:fs';
import { readSeeds, scoreStations, type StationFile } from '../../tools/lib/assess';

const area = 'rockridge';
const seeds = Array.from({ length: 10 }, (_, i) => i + 1);
const stations: StationFile = JSON.parse(readFileSync(`data/demand/${area}.stations.json`, 'utf8'));
const rec = JSON.parse(readFileSync(`data/demand/${area}.config.json`, 'utf8')).countFit.recency as { referenceYear: number; recentYears: number };
const sets = { base: ['target/r44/p0', 'target/r44/p0cv'], cand: ['target/assess-seeds/60r44', 'target/assess-seeds/60r44-cv'] } as const;
type Row = { id: string; label: string; held: boolean; recent: boolean; derived: boolean; counted: number; base: number; baseGeh: number; baseOk: boolean; cand: number; candGeh: number; candOk: boolean; baseShip: number; candShip: number };
const out: Record<string, Row[]> = {};
for (const p of ['am_peak', 'pm_peak']) {
  const sc = Object.fromEntries(Object.entries(sets).map(([k, [d, dcv]]) => {
    const r = readSeeds(d, area, p, seeds), rcv = readSeeds(dcv, area, p, seeds);
    if (r.length !== 10 || rcv.length !== 10) throw new Error(`${k} ${p}: ${r.length}/${rcv.length} seeds`);
    return [k, { ship: new Map(scoreStations(r, stations, p).cases.map((c) => [c.stationId, c])), cv: new Map(scoreStations(rcv, stations, p).cases.map((c) => [c.stationId, c])) }];
  }));
  const rows: Row[] = [];
  for (const [id, c] of sc.base.ship) {
    const judged = (k: 'base' | 'cand') => (c.held ? sc[k].cv.get(id)! : sc[k].ship.get(id)!);
    const b = judged('base'), q = judged('cand');
    rows.push({ id, label: c.label, held: !!c.held, derived: c.derived, recent: !c.derived && c.year != null && rec.referenceYear - c.year <= rec.recentYears, counted: c.counted,
      base: b.modeled, baseGeh: b.geh, baseOk: b.gehOk, cand: q.modeled, candGeh: q.geh, candOk: q.gehOk, baseShip: c.modeled, candShip: sc.cand.ship.get(id)!.modeled });
  }
  out[p] = rows;
  const tally = (sel: (r: Row) => boolean, k: 'baseOk' | 'candOk') => `${rows.filter((r) => sel(r) && r[k]).length}/${rows.filter(sel).length}`;
  for (const [name, sel] of [['recent fitted', (r: Row) => r.recent && !r.held], ['recent held out', (r: Row) => r.recent && r.held], ['older fitted', (r: Row) => !r.recent && !r.derived && !r.held], ['older held out', (r: Row) => !r.recent && !r.derived && r.held]] as const)
    console.log(`${p} ${name}: base ${tally(sel, 'baseOk')}, candidate ${tally(sel, 'candOk')}`);
}
const f0 = (x: number) => Math.round(x).toString();
const f1 = (x: number) => x.toFixed(1);
console.log('\nFLIPS (recent stations; fitted judged on shipped demand, held out on cross-validation demand)');
console.log('| Period | Station | Set | Counted | Baseline | GEH | Candidate | GEH | Flip |');
console.log('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const [p, rows] of Object.entries(out)) for (const r of rows.filter((x) => x.recent && x.baseOk !== x.candOk))
  console.log(`| ${p} | ${r.label} | ${r.held ? 'held out' : 'fitted'} | ${f0(r.counted)} | ${f0(r.base)} | ${f1(r.baseGeh)} | ${f0(r.cand)} | ${f1(r.candGeh)} | ${r.baseOk ? 'pass to fail' : 'fail to pass'} |`);
console.log('\nOLDER-COUNT FLIPS');
for (const [p, rows] of Object.entries(out)) for (const r of rows.filter((x) => !x.recent && !x.derived && x.baseOk !== x.candOk))
  console.log(`| ${p} | ${r.label} | ${r.held ? 'held out' : 'fitted'} | ${f0(r.counted)} | ${f0(r.base)} | ${f1(r.baseGeh)} | ${f0(r.cand)} | ${f1(r.candGeh)} | ${r.baseOk ? 'pass to fail' : 'fail to pass'} |`);
const pat = process.argv[2] ? new RegExp(process.argv[2]) : null;
if (pat) {
  console.log('\nNAMED (judged value: cross-validation demand for held out, shipped for fitted; shipped values of both in the last two columns)');
  console.log('| Period | Station | Set | Counted | Baseline | GEH | Candidate | GEH | Baseline shipped | Candidate shipped |');
  console.log('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const [p, rows] of Object.entries(out)) for (const r of rows.filter((x) => pat.test(x.label)))
    console.log(`| ${p} | ${r.label} | ${r.held ? 'held out' : 'fitted'}${r.recent ? '' : ' (older)'} | ${f0(r.counted)} | ${f0(r.base)} | ${f1(r.baseGeh)} | ${f0(r.cand)} | ${f1(r.candGeh)} | ${f0(r.baseShip)} | ${f0(r.candShip)} |`);
}
