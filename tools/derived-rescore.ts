// Re-scores seed reports that already exist under both scopes of the station rule (change derived-targets-not-judged): derived targets counted as before, and set apart. It reads
// reports and the stations file, runs nothing and writes nothing but the table it prints. It does not check that the reports match the files on disk; use `assess` for a verdict.
//   npx tsx tools/derived-rescore.ts --assessment [FILE]   (arithmetic on a committed assessment, PM peak)
//   npx tsx tools/derived-rescore.ts --shipped DIR [--cv DIR] [--seeds 1-10] [--area rockridge] [--periods am_peak,midday,pm_peak]
// DIR holds `<area>-<period>-s1-seed<N>.json` files (data/calibration/reports holds seed 1 of the published set). Without --cv the held-out column is the shipped demand's, which fits
// those stations (in sample), and is labeled so.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { readSeeds, scoreStations, type StationFile } from './lib/assess';
import { ruleSplit, scopeComparisonLines, type RuleSplit } from './lib/recency';

const arg = (k: string, d: string) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : d; };
const root = resolve(import.meta.dirname, '..');
const area = arg('--area', 'rockridge');
const periods = arg('--periods', 'am_peak,midday,pm_peak').split(',');
const seeds = arg('--seeds', '1').split(',').flatMap((p) => { const m = p.match(/^(\d+)-(\d+)$/); return m ? Array.from({ length: +m[2] - +m[1] + 1 }, (_, i) => +m[1] + i) : [+p]; });
const shippedDir = resolve(root, arg('--shipped', 'data/calibration/reports'));
const cvDir = process.argv.includes('--cv') ? resolve(root, arg('--cv', '')) : null;
const stations = JSON.parse(readFileSync(resolve(root, `data/demand/${area}.stations.json`), 'utf8')) as StationFile;
const rcy = JSON.parse(readFileSync(resolve(root, `data/demand/${area}.config.json`), 'utf8')).countFit.recency as { referenceYear: number; recentYears: number };

if (process.argv.includes('--assessment')) {
  // Arithmetic on a committed assessment: the PM peak only, where derived targets were judged as counts. Source and count-year tables give the recent stations per source, the verdict
  // row the published pass counts, and the table of held-out misses says which derived targets missed on the cross-validation demand.
  const given = process.argv[process.argv.indexOf('--assessment') + 1];
  const text = readFileSync(resolve(root, given && !given.startsWith('--') ? given : `data/calibration/${area}.assessment.md`), 'utf8');
  const pm = 'pm_peak';
  const section = text.slice(text.indexOf(`\n## ${pm}\n`), text.indexOf('\n## Verdict'));
  const tally = (c: string) => { const m = /^(\d+) of (\d+)/.exec(c.trim()); return m ? { ok: +m[1], n: +m[2] } : { ok: 0, n: 0 }; };
  const table = section.split('\n').filter((l) => /^\| [^|]+ \| (\d{4}|unknown) \| [^|]+ \| [^|]+ \| [^|]+ \|$/.test(l) && !l.startsWith('| Source')).map((l) => l.split('|').map((c) => c.trim()).slice(1, -1));
  const recent = table.filter((r) => Number(r[2]) <= rcy.recentYears);
  const isDer = (src: string) => src.startsWith('caltrans-');
  const sum = (rs: string[][], i: number) => rs.reduce((a, r) => ({ ok: a.ok + tally(r[i]).ok, n: a.n + tally(r[i]).n }), { ok: 0, n: 0 });
  const verdict = text.split('\n').find((l) => l.startsWith(`| ${pm} |`) && l.includes(' of '))!.split('|').map((c) => c.trim());
  const fails = text.split('\n').filter((l) => l.startsWith(`| ${pm} |`) && /\| caltrans-\w+ \d{4} \|/.test(l));
  const derHeld = sum(recent.filter((r) => isDer(r[0])), 4), derFit = sum(recent.filter((r) => isDer(r[0])), 3);
  const oldFit = tally(verdict[4]), oldHeld = tally(verdict[5]);
  const derHeldOk = derHeld.n - fails.length;
  const f = (t: { ok: number; n: number }) => `${t.ok} of ${t.n} (${t.n ? Math.round((100 * t.ok) / t.n) : 0}%)`;
  console.log(['## Station rule, PM peak, arithmetic on the committed assessment', '', `Recent derived-target stations in the source-and-year table: fitted ${f(derFit)}, held out in the cross-validation demand ${derHeld.n}, of which ${fails.length} appear in the table of held-out misses and so ${derHeldOk} passed.`, '',
    '| | Old scope | New scope |', '| --- | --- | --- |', `| Recent, fitted | ${f(oldFit)} | ${f({ ok: oldFit.ok - derFit.ok, n: oldFit.n - derFit.n })} |`, `| Recent, held out (out of sample) | ${f(oldHeld)} | ${f({ ok: oldHeld.ok - derHeldOk, n: oldHeld.n - derHeld.n })} |`, ''].join('\n'));
  process.exit(0);
}

const rows: { period: string; split: RuleSplit | null }[] = [];
const notes: string[] = [];
for (const p of periods) {
  const runs = readSeeds(shippedDir, area, p, seeds);
  if (!runs.length) { rows.push({ period: p, split: null }); continue; }
  const sc = scoreStations(runs, stations, p);
  const main = ruleSplit(sc.cases.map((c) => ({ year: c.year, c })), rcy);
  const cvRuns = cvDir ? readSeeds(cvDir, area, p, seeds) : [];
  const cv = cvRuns.length ? ruleSplit(scoreStations(cvRuns, stations, p).cases.map((c) => ({ year: c.year, c })), rcy) : null;
  const split: RuleSplit = {
    ...main,
    ...(cv ? { recent: { fitted: main.recent.fitted, held: cv.recent.held }, older: { fitted: main.older.fitted, held: cv.older.held }, all: { fitted: main.all.fitted, held: cv.all.held }, legacy: { all: { fitted: main.legacy.all.fitted, held: cv.legacy.all.held }, recent: { fitted: main.legacy.recent.fitted, held: cv.legacy.recent.held }, older: { fitted: main.legacy.older.fitted, held: cv.legacy.older.held } } } : {}),
  };
  rows.push({ period: p, split });
  notes.push(`${p}: ${runs.length} shipped seed report${runs.length === 1 ? '' : 's'}${cv ? `, ${cvRuns.length} cross-validation` : ', no cross-validation reports (held-out columns are scored on the shipped demand, which fits those stations)'}.`);
}
console.log(['## Station rule under both scopes (re-scored from existing reports)', '', ...notes.map((n) => `- ${n}`), '', ...scopeComparisonLines(rows), ''].join('\n'));
