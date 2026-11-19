// Usage: npx tsx openspec/changes/calibration-round-47/station-table.ts --suffix r47-base --stations target/r47/stations.base.json [--periods pm_peak,am_peak] [--seeds 1-10] [--only "pattern"]
// Per-station ten-seed scores of an assessment set that `npm run assess -- --suffix NAME` kept under target/assess-seeds/60NAME (shipped demand) and 60NAME-cv (cross-validation demand).
// Fitted stations are scored on the shipped runs and held-out stations on the cross-validation runs, as tools/assess.ts does. The recent counts are those of the assessment's station rule.
// No simulation: it reads the kept seed reports. The published assessment lists only the 12 largest misses, so this is how a single station is read off a set.
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { readRuns, scoreStations, type StationFile } from '../../../tools/lib/assess';
import { ruleSplit } from '../../../tools/lib/recency';

const arg = (k: string, d = '') => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : d; };
const root = resolve(import.meta.dirname, '../../..');
const suffix = arg('--suffix'), stationsPath = arg('--stations');
if (!suffix || !stationsPath) { console.error('need --suffix and --stations'); process.exit(2); }
const seedSpec = arg('--seeds', '1-10');
const seeds = seedSpec.split(',').flatMap((p) => { const m = p.match(/^(\d+)-(\d+)$/); return m ? Array.from({ length: +m[2] - +m[1] + 1 }, (_, i) => +m[1] + i) : [+p]; });
const periods = arg('--periods', 'pm_peak,am_peak').split(',');
const only = arg('--only') ? new RegExp(arg('--only'), 'i') : null;
const file = JSON.parse(readFileSync(resolve(root, stationsPath), 'utf8')) as StationFile;
const rc = JSON.parse(readFileSync(resolve(root, 'data/demand/rockridge.config.json'), 'utf8')).countFit.recency as { referenceYear: number; recentYears: number };
const dir = resolve(root, 'target/assess-seeds', `60${suffix}`), dirCv = `${dir}-cv`;
const load = (d: string, p: string) => { const f = readRuns(d, 'rockridge', p, seeds, 1, 60); const bad = f.filter((x) => !x.run); if (bad.length || f.length !== seeds.length) throw new Error(`${d} ${p}: ${f.length} of ${seeds.length} seeds, unreadable: ${bad.map((x) => x.file + ' ' + x.error).join('; ')}`); return f.map((x) => x.run!); };

for (const p of periods) {
  if (!existsSync(dir)) throw new Error(`no kept seeds at ${dir}`);
  const main = scoreStations(load(dir, p), file, p);
  const cv = existsSync(dirCv) ? scoreStations(load(dirCv, p), file, p) : null;
  const cvBy = new Map((cv?.cases ?? []).map((c) => [c.stationId, c]));
  const rows = main.cases.map((c) => (c.held && cvBy.has(c.stationId) ? cvBy.get(c.stationId)! : c));
  const split = ruleSplit(rows.map((c) => ({ year: c.year, c })), rc);
  console.log(`\n## ${p}: ${seeds.length} seeds. Recent fitted ${split.recent.fitted.ok} of ${split.recent.fitted.n}; recent held out ${split.recent.held.ok} of ${split.recent.held.n}; older fitted ${split.older.fitted.ok} of ${split.older.fitted.n}; older held out ${split.older.held.ok} of ${split.older.held.n}; derived (not judged) ${split.derived.n}.\n`);
  console.log('| Station id | Label | Held out | Year | Derived | Counted | Modeled | GEH | GEH < 5 |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const c of rows.filter((x) => !only || only.test(`${x.stationId} ${x.label}`)).sort((a, b) => a.stationId.localeCompare(b.stationId))) {
    console.log(`| ${c.stationId} | ${c.label} | ${c.held ? 'yes' : 'no'} | ${c.year ?? ''} | ${c.derived ? 'yes' : 'no'} | ${Math.round(c.counted)} | ${Math.round(c.modeled)} | ${c.geh.toFixed(1)} | ${c.gehOk ? 'yes' : 'no'} |`);
  }
}
