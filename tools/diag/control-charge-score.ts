// Round 54, stage 1 scoring: compare seed-report sets of the router with the control delay charged twice (off) and once (on), under the judged scope of
// change derived-targets-not-judged. Diagnostic only: it writes nothing and gives no verdict on the model.
// usage: tsx tools/diag/control-charge-score.ts --period pm_peak [--seeds 1-10] --set off=SHIPDIR,CVDIR --set on=SHIPDIR,CVDIR [--root DIR]
// A set is the directory of `calibrate --keep-seeds` reports on the shipped demand and, after a comma, the one on the cross-validation demand.
// With exactly two sets (the first is the baseline) it ends with the stage 1 bar of design D2.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { judgedClearings } from '../lib/verdict';
import { readSeeds, scoreStations, shareStats, throughStats, travelTimes, type SeedRun, type StationFile } from '../lib/assess';
import { seedStat } from '../lib/acceptance';
import { outOfSampleSplit, ruleSplit, type RuleSplit } from '../lib/recency';

const argv = process.argv.slice(2);
const all = (k: string) => argv.flatMap((a, i) => (a === k ? [argv[i + 1]] : []));
const one = (k: string, d: string) => all(k)[0] ?? d;
const root = resolve(one('--root', '.'));
const area = one('--area', 'rockridge');
const period = one('--period', 'pm_peak');
const seeds = parseSeeds(one('--seeds', '1-10'));
const sets = all('--set').map((s) => {
  const [label, dirs] = [s.slice(0, s.indexOf('=')), s.slice(s.indexOf('=') + 1)];
  const [ship, cv] = dirs.split(',');
  return { label, ship: resolve(root, ship), cv: cv ? resolve(root, cv) : null };
});
if (!sets.length) { console.error('usage: control-charge-score.ts --period P --set LABEL=SHIPDIR[,CVDIR] ...'); process.exit(2); }

function parseSeeds(spec: string): number[] {
  return spec.split(',').flatMap((p) => { const [a, b] = p.split('-').map(Number); return b === undefined ? [a] : Array.from({ length: b - a + 1 }, (_, i) => a + i); });
}

const read = (f: string) => JSON.parse(readFileSync(resolve(root, f), 'utf8'));
const targets = read(`data/calibration/${area}.targets.json`);
const net = read(`public/data/${area}.network.json`);
const stations: StationFile = read(`data/demand/${area}.stations.json`);
const recency = read(`data/demand/${area}.config.json`).countFit.recency as { referenceYear: number; recentYears: number };

// The five stations of the residential diagonal (Telegraph to McAuley/60th, Howell/Ayala, Forest, Claremont); ids are the block ids of the stations file.
const DIAGONAL: Record<string, string> = { '2697': 'Forest Ave EB', '1933': 'McAuley St EB Howell-Colby', '1868': '60th St EB Howell-Colby', '1831': 'Ayala Ave NB McAuley-Howell', '2055': 'Howell St SB 59th-McAuley' };
const COLBY_NB_BLOCKS = ['2591', '2593', '2595', '2597', '2599', '2605'];
const bare = (id: string) => String(id).replace(/^count block /, '');
const f0 = (x: number) => (Number.isFinite(x) ? String(Math.round(x)) : '-');
const f1 = (x: number) => (Number.isFinite(x) ? x.toFixed(1) : '-');
const pm = (s: { mean: number; sd: number; n: number }) => `${f1(s.mean)} +- ${f1(s.n > 1 ? s.sd / Math.sqrt(s.n) : NaN)}`;

interface Scored {
  label: string; ship: SeedRun[]; cv: SeedRun[];
  split: RuleSplit; diagonal: Record<string, number[]>; colbyNb: number[]; colbyNbCounted: number; shares: { n: number; ok: number }; whole: ReturnType<typeof throughStats>;
  times: ReturnType<typeof travelTimes>; backlog: number[]; cleared: number[]; judgedCleared: number[]; through: number[]; completed: number[];
}

function score(s: (typeof sets)[number]): Scored {
  const ship = readSeeds(s.ship, area, period, seeds);
  const cv = s.cv ? readSeeds(s.cv, area, period, seeds) : [];
  if (ship.length !== seeds.length) console.error(`${s.label}: ${ship.length} of ${seeds.length} shipped-view reports in ${s.ship}`);
  if (s.cv && cv.length !== seeds.length) console.error(`${s.label}: ${cv.length} of ${seeds.length} cross-validation reports in ${s.cv}`);
  const sc = scoreStations(ship, stations, period);
  const scCv = cv.length ? scoreStations(cv, stations, period) : null;
  const split = outOfSampleSplit(ruleSplit(sc.cases.map((c) => ({ year: c.year, c })), recency), scCv ? ruleSplit(scCv.cases.map((c) => ({ year: c.year, c })), recency) : null);
  const stationOf = (run: SeedRun, id: string) => scoreStations([run], stations, period).cases.find((c) => bare(c.stationId) === id);
  const diagonal: Record<string, number[]> = {};
  for (const id of Object.keys(DIAGONAL)) diagonal[id] = ship.map((r) => stationOf(r, id)?.modeled ?? NaN);
  const colbyNb = ship.map((r) => { const cs = COLBY_NB_BLOCKS.map((id) => stationOf(r, id)).filter((c): c is NonNullable<typeof c> => !!c); return cs.reduce((a, c) => a + c.modeled, 0); });
  const colbyNbCounted = COLBY_NB_BLOCKS.map((id) => sc.cases.find((c) => bare(c.stationId) === id)?.counted ?? 0).reduce((a, b) => a + b, 0);
  const ss = shareStats(ship, period === 'pm_peak').filter((q) => q.headline);
  const whole = throughStats(ship, targets.selectLink ?? [], period);
  const blocks = new Set((targets.selectLink ?? []).map((t: { street: string; direction: string }) => `${t.street} ${t.direction}`));
  return {
    label: s.label, ship, cv, split, diagonal, colbyNb, colbyNbCounted, shares: { n: ss.length, ok: ss.filter((q) => q.within10).length }, whole,
    times: travelTimes(ship, net, targets.travelTimes.segments, period),
    backlog: ship.map((r) => r.health.backlogPct), cleared: ship.map((r) => r.health.gridlockRemoved), judgedCleared: ship.map((r) => judgedClearings(r)), completed: ship.map((r) => r.health.completed),
    through: ship.map((r) => (r.throughCheck ?? []).filter((x) => blocks.has(x.block)).reduce((a, x) => a + x.modeledThrough, 0)),
  };
}

const tally = (t: { n: number; ok: number }) => (t.n ? `${t.ok} of ${t.n}` : '-');
const results = sets.map(score);

console.log(`# Control delay charged once, stage 1 scoring, ${period}, seeds ${seeds.join(',')}\n`);
console.log('Pass counts under the judged scope (derived targets not judged), GEH below 5; fitted on the shipped demand, held out on the cross-validation demand:\n');
console.log('| Set | Recent fitted | Recent held out | Older fitted | Older held out | All fitted | All held out | D5 shares within 10 points | Whole street within GEH 5 |');
console.log('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const r of results) console.log(`| ${r.label} | ${tally(r.split.recent.fitted)} | ${tally(r.split.recent.held)} | ${tally(r.split.older.fitted)} | ${tally(r.split.older.held)} | ${tally(r.split.all.fitted)} | ${tally(r.split.all.held)} | ${tally(r.shares)} | ${r.whole.filter((w) => w.inside).length} of ${r.whole.length} |`);

console.log('\nThe five stations of the residential diagonal, simulated veh/h on the shipped demand (mean +- standard error over seeds; counted in the last row):\n');
const ids = Object.keys(DIAGONAL);
console.log(`| Set | ${ids.map((i) => DIAGONAL[i]).join(' | ')} | Sum |`);
console.log(`| --- | ${ids.map(() => '---').join(' | ')} | --- |`);
const sums = results.map((r) => ({ label: r.label, per: r.ship.map((_, k) => ids.reduce((a, id) => a + r.diagonal[id][k], 0)) }));
results.forEach((r, i) => console.log(`| ${r.label} | ${ids.map((id) => pm(seedStat(r.diagonal[id]))).join(' | ')} | ${pm(seedStat(sums[i].per))} |`));
const counted = ids.map((id) => stations.stations.find((s) => bare(s.id) === id)?.target[period] ?? NaN);
console.log(`| counted | ${counted.map(f0).join(' | ')} | ${f0(counted.reduce((a, b) => a + b, 0))} |`);

console.log('\nColby Street NB, six blocks (simulated over counted) and the eight whole-street traversals (simulated veh/h, GEH against the count):\n');
console.log(`| Set | Colby NB six blocks | ${(targets.selectLink ?? []).map((t: { street: string; direction: string }) => `${t.street} ${t.direction}`).join(' | ')} |`);
console.log(`| --- | --- | ${(targets.selectLink ?? []).map(() => '---').join(' | ')} |`);
for (const r of results) console.log(`| ${r.label} | ${f0(seedStat(r.colbyNb).mean)} / ${f0(r.colbyNbCounted)} = ${(seedStat(r.colbyNb).mean / r.colbyNbCounted).toFixed(2)} | ${r.whole.map((w) => `${f0(w.mean)} (obs ${f0(w.observed)}, GEH ${f1(w.geh)})`).join(' | ')} |`);

console.log('\nArterial travel times (s, mean over seeds; observed range in brackets; * outside the range):\n');
const segs = results[0].times.map((t) => t.id);
console.log(`| Set | ${segs.join(' | ')} |`);
console.log(`| --- | ${segs.map(() => '---').join(' | ')} |`);
for (const r of results) console.log(`| ${r.label} | ${r.times.map((t) => `${f0(t.modeledS)} (${f0(t.observedS[0])}-${f0(t.observedS[1])})${t.within ? '' : ' *'}`).join(' | ')} |`);

console.log('\nStability and flow (mean over seeds):\n');
console.log('| Set | Backlog % (mean, max) | Cars cleared from gridlock per hour | Judged-zone clearings per hour | Through cars/h on the four whole-street runs | Completed trips |');
console.log('| --- | --- | --- | --- | --- | --- |');
for (const r of results) console.log(`| ${r.label} | ${f1(seedStat(r.backlog).mean)}, ${f1(seedStat(r.backlog).max)} | ${f1(seedStat(r.cleared).mean)} | ${f1(seedStat(r.judgedCleared).mean)} | ${f0(seedStat(r.through).mean)} | ${f0(seedStat(r.completed).mean)} |`);

if (results.length === 2) {
  const [a, b] = results;
  const sa = seedStat(sums[0].per), sb = seedStat(sums[1].per);
  const se = Math.sqrt((sa.sd ** 2) / sa.n + (sb.sd ** 2) / sb.n);
  const fall = sa.mean - sb.mean;
  const drop = (x: { n: number; ok: number }, y: { n: number; ok: number }) => x.ok - y.ok;
  const counts: [string, number][] = [
    ['recent fitted', drop(a.split.recent.fitted, b.split.recent.fitted)], ['recent held out', drop(a.split.recent.held, b.split.recent.held)],
    ['older fitted', drop(a.split.older.fitted, b.split.older.fitted)], ['older held out', drop(a.split.older.held, b.split.older.held)],
    ['all fitted', drop(a.split.all.fitted, b.split.all.fitted)], ['all held out', drop(a.split.all.held, b.split.all.held)],
    ['D5 shares', drop(a.shares, b.shares)], ['whole street within GEH 5', a.whole.filter((w) => w.inside).length - b.whole.filter((w) => w.inside).length],
  ];
  const colby = b.whole.find((w) => w.block === 'Colby Street NB');
  const tele = b.times.filter((t) => /^Telegraph/.test(t.id)).map((t) => ({ t, base: a.times.find((x) => x.id === t.id)! }));
  const teleOk = tele.every(({ t, base }) => t.within || (!base.within && Math.abs(t.modeledS - (t.modeledS < t.observedS[0] ? t.observedS[0] : t.observedS[1])) <= Math.abs(base.modeledS - (base.modeledS < base.observedS[0] ? base.observedS[0] : base.observedS[1])) + 10));
  console.log(`\n## Stage 1 bar (${period}, ${a.label} against ${b.label}; design D2)\n`);
  console.log(`- Diagonal sum falls by more than twice its standard error: ${f1(fall)} veh/h against standard error ${f1(se)} (Welch, ${sa.n} and ${sb.n} seeds): ${fall > 2 * se ? 'MET' : 'NOT MET'}${period === 'pm_peak' ? '' : ' (read for PM only; reported here for information)'}.`);
  const worst = counts.filter(([, d]) => d > 1);
  console.log(`- No judged count falls by more than 1: ${worst.length ? `NOT MET (${worst.map(([n, d]) => `${n} falls by ${d}`).join('; ')})` : 'MET'} (falls: ${counts.map(([n, d]) => `${n} ${d}`).join('; ')}).`);
  console.log(`- Colby Street NB whole street inside GEH 5: ${colby ? `${colby.geh < 5 ? 'MET' : 'NOT MET'} (${f0(colby.mean)} against ${f0(colby.observed)}, GEH ${f1(colby.geh)})` : 'no whole-street value in this period'}.`);
  console.log(`- Telegraph travel times stay in range (inside the observed range wherever the baseline is; where the baseline is outside, no more than 10 s farther out): ${teleOk ? 'MET' : 'NOT MET'}.`);
}
