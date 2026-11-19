// Round 45: per-station comparison of the baseline (ten seeds on the b1ff0ef demands, target/r44/p0 and p0cv, run on this laptop in round 44)
// and the three candidates (target/assess-seeds/60r45-<candidate> and -cv). Fitted stations are judged on the shipped demand, held-out stations on
// the cross-validation demand, as tools/assess.ts does. Static final: the shipped fit's final assignment (identical for every candidate, design D6).
import { readFileSync } from 'node:fs';
import { readSeeds, scoreStations, type StationFile } from '../../tools/lib/assess';

const area = 'rockridge';
const seeds = Array.from({ length: 10 }, (_, i) => i + 1);
const stations: StationFile = JSON.parse(readFileSync(`data/demand/${area}.stations.json`, 'utf8'));
const rec = JSON.parse(readFileSync(`data/demand/${area}.config.json`, 'utf8')).countFit.recency as { referenceYear: number; recentYears: number };
const sets: Record<string, [string, string]> = { base: ['target/r44/p0', 'target/r44/p0cv'] };
for (const c of ['forest-25', 'forest-18', 'forest-12']) sets[c] = [`target/assess-seeds/60r45-${c}`, `target/assess-seeds/60r45-${c}-cv`];
const names = Object.keys(sets);
const staticFinal = (p: string) => {
  const m = new Map<string, number>();
  for (const line of readFileSync(`data/demand/${area}.fit.stations-${p}.md`, 'utf8').split('\n')) {
    const c = line.split(' | ');
    if (c.length > 8 && /^\d/.test(c[7])) m.set(c[0].replace(/^\| /, ''), +c[7]);
  }
  return m;
};
type J = { modeled: number; geh: number; ok: boolean };
type Row = { label: string; held: boolean; recent: boolean; derived: boolean; counted: number; j: Record<string, J> };
const out: Record<string, Row[]> = {};
for (const p of ['am_peak', 'pm_peak']) {
  const sc = Object.fromEntries(names.map((k) => {
    const [d, dcv] = sets[k];
    const r = readSeeds(d, area, p, seeds), rcv = readSeeds(dcv, area, p, seeds);
    if (r.length !== 10 || rcv.length !== 10) throw new Error(`${k} ${p}: ${r.length}/${rcv.length} seeds`);
    return [k, { ship: new Map(scoreStations(r, stations, p).cases.map((c) => [c.stationId, c])), cv: new Map(scoreStations(rcv, stations, p).cases.map((c) => [c.stationId, c])) }];
  }));
  const rows: Row[] = [];
  for (const [id, c] of sc.base.ship) {
    const j: Record<string, J> = {};
    for (const k of names) { const q = c.held ? sc[k].cv.get(id)! : sc[k].ship.get(id)!; j[k] = { modeled: q.modeled, geh: q.geh, ok: q.gehOk }; }
    rows.push({ label: c.label, held: !!c.held, derived: c.derived, recent: !c.derived && c.year != null && rec.referenceYear - c.year <= rec.recentYears, counted: c.counted, j });
  }
  out[p] = rows;
  for (const [name, sel] of [['recent fitted', (r: Row) => r.recent && !r.held], ['recent held out', (r: Row) => r.recent && r.held]] as const)
    console.log(`${p} ${name}: ${names.map((k) => `${k} ${rows.filter((r) => sel(r) && r.j[k].ok).length}/${rows.filter(sel).length}`).join(', ')}`);
}
const f0 = (x: number) => Math.round(x).toString();
const f1 = (x: number) => x.toFixed(1);
const pat = /(McAuley Street Howell Street to Canning Street|60th Street Howell Street to Canning Street|Ayala Avenue Martin Street to Howell Street|62nd Street Colby Street to Canning Street|Forest Street Colby Street \/ Claremont Avenue to Ayala Avenue|60th Street Canning Street to Telegraph Avenue, EB|McAuley Street Canning Street to Telegraph Avenue, EB|Howell Street .*, SB|Ayala Avenue Forest Street to McAuley Street, SB)/;
console.log('\nNAMED (simulated, GEH; held out on the cross-validation demand, fitted on the shipped demand)');
console.log(`| Period | Station | Set | Counted | Static final | ${names.map((k) => `${k} | GEH`).join(' | ')} |`);
console.log(`| --- | --- | --- | --- | --- | ${names.map(() => '--- | ---').join(' | ')} |`);
for (const [p, rows] of Object.entries(out)) { const sf = staticFinal(p); for (const r of rows.filter((x) => pat.test(x.label)))
  console.log(`| ${p} | ${r.label} | ${r.held ? 'held out' : 'fitted'}${r.recent ? '' : ' (older)'} | ${f0(r.counted)} | ${sf.has(r.label) ? f0(sf.get(r.label)!) : '-'} | ${names.map((k) => `${f0(r.j[k].modeled)} | ${f1(r.j[k].geh)}`).join(' | ')} |`); }
for (const k of names.slice(1)) {
  console.log(`\nFLIPS ${k} vs base (recent stations)`);
  console.log('| Period | Station | Set | Counted | Baseline | GEH | Candidate | GEH | Flip |');
  console.log('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const [p, rows] of Object.entries(out)) for (const r of rows.filter((x) => x.recent && x.j.base.ok !== x.j[k].ok))
    console.log(`| ${p} | ${r.label} | ${r.held ? 'held out' : 'fitted'} | ${f0(r.counted)} | ${f0(r.j.base.modeled)} | ${f1(r.j.base.geh)} | ${f0(r.j[k].modeled)} | ${f1(r.j[k].geh)} | ${r.j.base.ok ? 'pass to fail' : 'fail to pass'} |`);
}
