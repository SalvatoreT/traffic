// Simulated through trips per origin-destination pair on the through-car targets (calibration round 39): pools the `calibrate --select-od` files of one or
// more sets of seed runs, keeps the trips with neither end in the study area (the calibrate report's through figure), and writes, per period, the trips of
// each pair counted on each street run and the trips the pair offered in those runs. `tools/build-demand.ts` reads the file as the measured membership of the
// through-car targets (`countFit.throughTargets.measured`).
//   npx tsx tools/through-membership.ts --area rockridge --period pm_peak --run DIR=DEMAND [--run DIR=DEMAND ...] [--out FILE] [--stations [--ids ID,ID]]
// --stations adds, for that period, the pairs of the movement, route and link stations (all trips) and keeps the through membership; a new FILE holds the station pairs only.
// DIR holds `sod-<period>-<seed>.json` from `calibrate --select-od`; DEMAND is the demand file those runs used. Other periods in FILE are kept.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { hashFile } from './lib/run-manifest';
import { writeFileAtomic } from './lib/atomic';
import { checkSelectOdSeed, membershipEvidence, sameMembershipEvidence, pooledMembership, pooledStations, type MembershipEvidence, type SelectOd } from './lib/through-membership';

const argv = process.argv.slice(2);
const arg = (k: string, d?: string) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const area = arg('--area', 'rockridge')!;
const period = arg('--period', 'pm_peak')!;
const root = resolve(import.meta.dirname, '..');
const out = resolve(root, arg('--out', `data/demand/${area}.through-membership.json`)!);
const runs = argv.flatMap((a, i) => (a === '--run' ? [argv[i + 1]] : []));
if (!runs.length) { console.error('give at least one --run DIR=DEMAND'); process.exit(2); }
const net = JSON.parse(readFileSync(resolve(root, `public/data/${area}.network.json`), 'utf8'));
const inStudy = new Set<number>(net.nodes.filter((n: { inStudyArea?: boolean }) => n.inStudyArea).map((n: { id: number }) => n.id));
let evidence: MembershipEvidence | undefined;
let setup: string | undefined;
const seen = new Set<string>();
const sets = runs.map((r) => {
  const [dir, dem] = r.split('=');
  const files = readdirSync(resolve(root, dir)).filter((f) => f.startsWith(`sod-${period}-`) && f.endsWith('.json'));
  if (!files.length) throw new Error(`${dir}: no sod-${period}-*.json`);
  const demand = JSON.parse(readFileSync(resolve(root, dem), 'utf8'));
  const flows = demand.periods.find((p: { id: string }) => p.id === period).flows.filter((f: { mode?: string }) => !f.mode);
  const hash = hashFile(resolve(root, dem))!;
  const sod = files.map((f) => JSON.parse(readFileSync(join(resolve(root, dir), f), 'utf8')) as SelectOd);
  for (const [i, run] of sod.entries()) {
    checkSelectOdSeed(run, hash, period, files[i], seen);
    const current = membershipEvidence(run, hash);
    if (run.period !== period || run.manifest!.run.area !== area || (evidence && !sameMembershipEvidence(evidence, current))) throw new Error('cannot pool runs from different simulators, areas, periods, sources, splits or demand views');
    const runSetup = JSON.stringify({ ...run.manifest!.run, seed: undefined });
    if (setup !== undefined && setup !== runSetup) throw new Error('cannot pool different run settings or measurement windows');
    setup = runSetup;
    evidence = current;
  }
  return { label: `${dir} (${files.length} seeds)`, flows, sod };
});
const file = existsSync(out) ? JSON.parse(readFileSync(out, 'utf8')) : { area, note: '' };
if (!evidence || evidence.network !== hashFile(resolve(root, `public/data/${area}.network.json`))) throw new Error('pooled run network differs from the selected network');
if (file.periods && !sameMembershipEvidence(file.evidence, evidence)) throw new Error('existing membership file has different or missing source evidence; use a new output file');
if (file.setups?.[period] && file.setups[period] !== setup) throw new Error('existing membership for this period used different run settings');
file.setups = { ...file.setups, [period]: setup };
file.evidence = evidence;
if (argv.includes('--stations')) {
  // Only the movement and route stations' pairs (round 41); the through targets' membership of the period is kept.
  // Version 2 records each station at its specified detector or route feature.
  const st = pooledStations(sets);
  // --ids keeps only the named stations (the file stays small enough for the repository).
  const ids = arg('--ids')?.split(',');
  if (ids) {
    st.hits = Object.fromEntries(Object.entries(st.hits).filter(([id]) => ids.includes(id)));
    const keep = new Set(Object.values(st.hits).flatMap((h) => Object.keys(h)));
    st.trips = Object.fromEntries(Object.entries(st.trips).filter(([q]) => keep.has(q)));
  }
  // A file of station pairs only (the training view's, round 42) starts with an empty through membership.
  if (!file.periods?.[period]) { file.area = area; file.network = net.id; file.note ||= 'Simulated station pairs only (no through membership), pooled over seed runs. Model output, not data. Written by tools/through-membership.ts --stations.'; file.periods = { ...(file.periods ?? {}), [period]: { runs: 0, source: '', hits: {}, trips: {} } }; }
  file.periods[period].stations = st;
  writeFileAtomic(out, JSON.stringify(file));
  console.log(`${out}: ${period} stations, ${st.runs} runs; ${Object.entries(st.hits).map(([id, h]) => `${id} ${(Object.values(h).reduce((a, b) => a + b, 0) / st.runs).toFixed(1)}/h`).join(', ')}`);
  process.exit(0);
}
const m = pooledMembership(sets, inStudy);
file.area = area;
file.network = net.id;
file.note = 'Simulated through trips (neither end in the study area) per origin-destination pair on each through-car target, pooled over seed runs (calibration round 39). hits: trips of the pair counted on the street run, summed over the runs; trips: veh/h the pair offered, summed over the runs; runs: seed runs pooled. Model output, not data. Written by tools/through-membership.ts.';
file.periods = { ...(file.periods ?? {}), [period]: { ...m, ...(file.periods?.[period]?.stations ? { stations: file.periods[period].stations } : {}) } };
writeFileAtomic(out, JSON.stringify(file));
console.log(`${out}: ${period}, ${m.runs} runs from ${sets.length} set(s); ${Object.keys(m.trips).length} pairs; ${Object.entries(m.hits).map(([id, h]) => `${id} ${(Object.values(h).reduce((a, b) => a + b, 0) / m.runs).toFixed(1)}/h`).join(', ')}`);
