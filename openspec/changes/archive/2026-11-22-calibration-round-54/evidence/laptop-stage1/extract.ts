// Laptop helper (not part of the round's scripts): the six stations the lead asked for and the D5 headline shares, per period, set and view, from the stage 1 seed reports.
// usage: npx tsx target/r54-stage1/extract.ts
import { readFileSync } from 'node:fs';
import { readSeeds, scoreStations, shareStats, type StationFile } from '../../tools/lib/assess';

const R = 'target/r54-stage1';
const seeds = Array.from({ length: 10 }, (_, i) => i + 1);
const stations: StationFile = JSON.parse(readFileSync('data/demand/rockridge.stations.json', 'utf8'));
const WANT = ['1933', '1868', '1867', '1897', '1990', '1858'];
const bare = (id: string) => String(id).replace(/^count block /, '');
const f0 = (x: number) => (Number.isFinite(x) ? String(Math.round(x)) : '-');
const f1 = (x: number) => (Number.isFinite(x) ? x.toFixed(1) : '-');

for (const period of ['pm_peak', 'am_peak']) {
  console.log(`\n## ${period}\n`);
  console.log('Six named stations (simulated veh/h, mean over seeds 1-10, GEH against the count; held = held out under the judged scope):\n');
  console.log('| Station | Counted | Held | off, shipped | off, cross-validation | on, shipped | on, cross-validation |');
  console.log('| --- | --- | --- | --- | --- | --- | --- |');
  const sc: Record<string, ReturnType<typeof scoreStations>> = {};
  for (const set of ['off', 'on']) for (const view of ['ship', 'cv']) sc[`${set}-${view}`] = scoreStations(readSeeds(`${R}/${period}/${set}-${view}`, 'rockridge', period, seeds), stations, period);
  for (const id of WANT) {
    const c = sc['off-ship'].cases.find((x) => bare(x.stationId) === id || x.label.includes(`(link ${id})`));
    if (!c) { console.log(`| ${id} | no target in ${period} | | | | | |`); continue; }
    const cell = (k: string) => { const x = sc[k].cases.find((y) => y.stationId === c.stationId); return x ? `${f0(x.modeled)} (${f1(x.geh)})` : '-'; };
    console.log(`| ${c.label} [${c.stationId}] | ${f0(c.counted)} | ${c.held ? 'yes' : 'no'} | ${cell('off-ship')} | ${cell('off-cv')} | ${cell('on-ship')} | ${cell('on-cv')} |`);
  }
  console.log('\nD5 headline shares on the shipped demand (simulated %, observed %, error in points):\n');
  console.log('| Share | Observed | off | on |');
  console.log('| --- | --- | --- | --- |');
  const sh = (set: string) => shareStats(readSeeds(`${R}/${period}/${set}-ship`, 'rockridge', period, seeds), period === 'pm_peak').filter((q) => q.headline);
  const off = sh('off'), on = sh('on');
  for (const q of off) {
    const o = on.find((x) => x.block === q.block && x.side === q.side && x.via === q.via);
    const pct = (x: number) => (x <= 1 ? x * 100 : x);
    console.log(`| ${q.block}, ${q.side}${q.via ? `, via ${q.via}` : ''} | ${f1(pct(q.observed))} | ${f1(pct(q.mean))} (${f1(q.errPoints)}) | ${o ? `${f1(pct(o.mean))} (${f1(o.errPoints)})` : '-'} |`);
  }
  const mae = (a: typeof off) => a.reduce((s, q) => s + Math.abs(q.errPoints), 0) / (a.length || 1);
  console.log(`\nMean absolute error: off ${f1(mae(off))} points, ${off.filter((q) => q.within10).length} of ${off.length} within 10; on ${f1(mae(on))} points, ${on.filter((q) => q.within10).length} of ${on.length} within 10.`);
}
