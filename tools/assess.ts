// Ten-seed assessment of the baseline (baseline-calibration decision D16 to D18): runs the calibrate binary over a fixed seed list for each period, applies the
// stability rule, scores the route shares and the count stations (GEH and size bands on the simulator's flows, fitted and held-out), and writes the assessment
// report and, with --noise, the per-link seed spread file the app can use for a noise band.
//   npx tsx tools/assess.ts [--area rockridge] [--periods am_peak,midday,pm_peak] [--seeds 1-10] [--jobs 4] [--minutes 60] [--noise] [--no-write] [--reuse DIR] [--suffix NAME] [--demand FILE] [--cv-demand FILE] [--publish] [--diagnostic] [--root DIR]
// Integrity (change protect-calibration-evidence): the verdict needs the exact requested seeds, a manifest on every run, one compatible run set whose inputs still match the files on
// disk, and a cross-validation demand built as the training view of the frozen split. Stability is computed from those runs. Anything missing or incompatible stops the assessment
// with the list of problems (exit 3) and writes nothing; --diagnostic instead reports what exists, labeled as a diagnostic with no verdict, and needs --suffix or --no-write.
// Outputs: the published set (60-minute runs, no suffix: data/calibration/reports, <area>.assessment.md, public/data/<area>.noise.json) is written only with --publish. Everything else, the
// summaries and the noise file included, goes to a set of its own named by --minutes and --suffix (tools/lib/assess-outputs.ts).
// The held-out stations are scored on the cross-validation demand (`countFit.validation.demandOutput`, built by `build-demand.ts --view training` from the split without them), run with the same seeds.
// Skips with a message (exit 0) when target/release/calibrate is not built. --reuse DIR scores seed reports already in DIR instead of running them (they must still match the files on disk).
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { throughStats, corridorRatios, recoverySentence, zoneLines, featureStats, headlineError, meanLinkFlow, noiseFile, rampStats, readRuns, scoreStations, shareStats, travelTimes, type SeedRun, type StationFile, type TravelNet } from './lib/assess';
import { seedStat } from './lib/acceptance';
import { computeStability, judgedClearings, stabilityRule, suggestStatus, type Stability } from './lib/verdict';
import { MIN_HELD_RECENT, outOfSampleSplit, ruleSplit, ruleVerdicts, sourceYearLines, type RuleSplit, type RuleVerdict } from './lib/recency';
import { writeFileAtomic } from './lib/atomic';
import { checkPair, checkRunSet, expectedInputs, type RunManifest } from './lib/run-manifest';
import { isolationProblems, resolveOutputs } from './lib/assess-outputs';
import { primitiveEvidence, primitiveLines, toVerdict, type ValidationFile } from './lib/primitive-evidence';
import { scopeLines } from './lib/validation-scope';

const has = (k: string) => process.argv.includes(k);
const arg = (k: string, d: string) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : d; };
const root = has('--root') ? resolve(arg('--root', '')) : resolve(import.meta.dirname, '..');
const area = arg('--area', 'rockridge');
const periods = arg('--periods', 'am_peak,midday,pm_peak').split(',');
const seedSpec = arg('--seeds', '1-10');
const jobs = arg('--jobs', '4');
const minutes = Number(arg('--minutes', '60'));
const write = !has('--no-write');
const diagnostic = has('--diagnostic');
const publish = has('--publish') || has('--overwrite-main');
const demandPath = has('--demand') ? resolve(root, arg('--demand', '')) : null;
const suffix = arg('--suffix', '');
const reuse = has('--reuse') ? resolve(root, arg('--reuse', '')) : null;
const outputs = resolveOutputs({ root, area, minutes, suffix, out: has('--out') ? arg('--out', '') : undefined });
if (write && outputs.published && !publish) { console.error('assess: this run would replace the published evidence (data/calibration/reports, the assessment and the noise file). Give --publish to replace it, or --suffix NAME (or --minutes N) for a separate output set, or --no-write.'); process.exit(2); }
if (write && !outputs.published && publish) { console.error('assess: --publish is for the published set (60-minute runs, no --suffix)'); process.exit(2); }
const isolation = isolationProblems(outputs, root, area);
if (write && isolation.length) { console.error(`assess: a variant would write into published evidence:\n  ${isolation.join('\n  ')}`); process.exit(2); }
if (diagnostic && write && outputs.published) { console.error('assess: --diagnostic output never goes to the published set; give --suffix NAME or --no-write'); process.exit(2); }
if (diagnostic && publish) { console.error('assess: --diagnostic and --publish exclude each other'); process.exit(2); }
if (demandPath && publish) { console.error('assess: --demand scores something other than the shipped demand; it cannot be published (use --suffix)'); process.exit(2); }
const bin = process.env.CALIBRATE_BIN ? resolve(process.env.CALIBRATE_BIN) : resolve(root, 'target/release/calibrate');
if (!reuse && !existsSync(bin)) { console.log('assess: target/release/calibrate is not built (cargo build --release -p traffic-sim --bin calibrate); skipping'); process.exit(0); }

const seeds: number[] = seedSpec.split(',').flatMap((p) => { const m = p.match(/^(\d+)-(\d+)$/); return m ? Array.from({ length: +m[2] - +m[1] + 1 }, (_, i) => +m[1] + i) : [+p]; });
const targets = JSON.parse(readFileSync(resolve(root, `data/calibration/${area}.targets.json`), 'utf8'));
const stationsPath = resolve(root, `data/demand/${area}.stations.json`);
const stations: StationFile | null = existsSync(stationsPath) ? JSON.parse(readFileSync(stationsPath, 'utf8')) : null;
const demandCfg = JSON.parse(readFileSync(resolve(root, `data/demand/${area}.config.json`), 'utf8'));
const recencyCfg: { referenceYear: number; recentYears: number } | null = demandCfg.countFit?.recency?.enabled ? demandCfg.countFit.recency : null;
const netPath = resolve(root, `public/data/${area}.network.json`);
const travelNet: TravelNet | null = targets.travelTimes?.segments?.length && existsSync(netPath) ? JSON.parse(readFileSync(netPath, 'utf8')) : null;
const keep = reuse ?? outputs.seeds;
const cvPath = has('--cv-demand') ? resolve(root, arg('--cv-demand', '')) : demandPath ? null : demandCfg.countFit?.validation?.demandOutput ? resolve(root, demandCfg.countFit.validation.demandOutput) : null;
const keepCv = reuse ? `${reuse}-cv` : outputs.seedsCv;
const summaryDir = write ? outputs.reports : join(keep, 'summary');
if (!reuse) { rmSync(keep, { recursive: true, force: true }); mkdirSync(keep, { recursive: true }); }
if (!reuse && cvPath) { rmSync(keepCv, { recursive: true, force: true }); mkdirSync(keepCv, { recursive: true }); }
/** A period has counts of its own when some station target in it is not derived (midday has none: its targets are the PM counts times a factor). */
const hasCounts = (p: string): boolean => !stations || stations.stations.some((q) => (q.target[p] ?? 0) > 0 && !q.derived?.includes(p));
const minHeld: number = targets.acceptance?.minHeldStations ?? MIN_HELD_RECENT;

const areaCfg = JSON.parse(readFileSync(resolve(root, `data/areas/${area}.json`), 'utf8')) as { signalObservations?: { at: string[]; periods: string[]; observedCarsPerCycle?: { mean?: number; median?: number } }[] };
/** What the count says about the cars per cycle of a signal in a period, from the area config; nothing when the config has no reading for it. */
const observedCars = (streets: string, period: string): string => {
  const o = (areaCfg.signalObservations ?? []).find((q) => q.observedCarsPerCycle && q.periods.includes(period) && q.at.every((a) => streets.includes(a)))?.observedCarsPerCycle;
  if (!o) return '';
  return ` (counted: ${[o.mean !== undefined ? `average ${o.mean}` : '', o.median !== undefined ? `median ${o.median}` : ''].filter(Boolean).join(', ')} cars per cycle)`;
};
const pct = (x: number, d = 1) => (Number.isFinite(x) ? (x * 100).toFixed(d) : '-');
const f = (x: number, d = 2) => (Number.isFinite(x) ? x.toFixed(d) : '-');
const L: string[] = [];
const byPeriod: Record<string, SeedRun[]> = {};
const splits: Record<string, RuleSplit | null> = {};
const scores: Record<string, { source?: string; year: number | null; derived?: boolean }[]> = {};
const throughRows: Record<string, ReturnType<typeof throughStats>> = {};
const verdicts: Record<string, { stable: boolean; d5: boolean | null; flow: boolean | null; through: boolean | null; rule: ReturnType<typeof ruleVerdicts> | null }> = {};
const cvRuns: Record<string, SeedRun[]> = {};
const heldFails: Record<string, { label: string; source?: string; year: number | null; counted: number; cv: number; cvGeh: number; shipped: number; shippedGeh: number }[]> = {};
const rule = targets.acceptance?.stability ?? {};

/** What the assessment is made from, so a reader can tell which runs, simulator and inputs it describes. */
function provenanceLines(): string[] {
  const out = ['### Evidence this assessment is made from', ''];
  const ms = periods.map((p) => acquired[p]).filter((a) => a.mainManifest);
  const first = ms[0]?.mainManifest, cvFirst = periods.map((p) => acquired[p].cvManifest).find((m) => m) ?? null;
  if (!first) return [...out, 'No run has a manifest (reports from before manifests): the provenance of these figures is unknown.', ''];
  const short = (x: string | null | undefined) => (x ? x.slice(0, 12) : 'none');
  out.push(`- Simulator: fingerprint \`${short(first.simulator.fingerprint)}\`, revision ${[...new Set(ms.flatMap((a) => a.revisions))].map((r) => short(r)).join(', ')}${ms.some((a) => a.dirty) ? ' (working tree had uncommitted changes under crates/)' : ''}.`);
  out.push(`- Run setup: ${first.run.minutes} minutes, scale ${first.run.scale}, warm-up ${first.run.warmupMin} min (flow tables count minutes ${first.run.measurementWindow.fromMin} to ${first.run.measurementWindow.toMin}), initial load ${first.run.initialLoad ? 'on' : 'off'}; seeds ${seeds.join(', ')}.`);
  out.push(`- Inputs (SHA-256, first 12): network ${short(first.inputs.network.sha256)}, shipped demand ${short(first.inputs.demand.sha256)}${first.inputs.demandBuild ? ` (built as ${first.inputs.demandBuild.view})` : ''}, ${cvFirst ? `cross-validation demand ${short(cvFirst.inputs.demand.sha256)} (built as ${cvFirst.inputs.demandBuild?.view ?? 'unknown'}), ` : ''}targets ${short(first.inputs.targets.sha256)}, stations ${short(first.inputs.stations.sha256)}, validation split ${short(first.inputs.split.sha256)}.`);
  return [...out, ''];
}

// ---------- 1. acquire the runs and check them before anything is judged ----------
const problems: string[] = [];
const acquired: Record<string, { main: SeedRun[]; cv: SeedRun[]; mainManifest: RunManifest | null; cvManifest: RunManifest | null; revisions: string[]; dirty: boolean; fingerprint: string | null; wantCv: boolean }> = {};
const splitSha = expectedInputs(root, area, null).split;
const mainDemandFile = demandPath ?? resolve(root, `public/data/${area}.demand.json`);
const cvDemandFile = cvPath ?? (demandCfg.countFit?.validation?.demandOutput ? resolve(root, demandCfg.countFit.validation.demandOutput) : null);
for (const p of periods) {
  if (!reuse) {
    const r = spawnSync(bin, ['--area', area, '--period', p, '--minutes', String(minutes), '--scale', '1', '--seeds', seedSpec, '--jobs', jobs, '--keep-seeds', keep, '--out', summaryDir, ...(demandPath ? ['--demand', demandPath] : [])], { cwd: root, stdio: ['ignore', 'ignore', 'inherit'] });
    if (r.status !== 0) { console.error(`assess: calibrate failed for ${p}`); process.exit(1); }
    if (cvPath && hasCounts(p)) {
      const rc = spawnSync(bin, ['--area', area, '--period', p, '--minutes', String(minutes), '--scale', '1', '--seeds', seedSpec, '--jobs', jobs, '--keep-seeds', keepCv, '--out', join(keepCv, 'summary'), '--demand', cvPath], { cwd: root, stdio: ['ignore', 'ignore', 'inherit'] });
      if (rc.status !== 0) { console.error(`assess: calibrate failed for ${p} on the cross-validation demand`); process.exit(1); }
    }
  }
  const wantCv = hasCounts(p) && !!(cvPath || (reuse && existsSync(keepCv)));
  const mainFound = readRuns(keep, area, p, seeds);
  const mainCheck = checkRunSet(`${p}, shipped demand`, seeds, mainFound, expectedInputs(root, area, mainDemandFile));
  const cvFound = wantCv ? readRuns(keepCv, area, p, seeds) : [];
  const cvCheck = wantCv ? checkRunSet(`${p}, cross-validation demand`, seeds, cvFound, expectedInputs(root, area, cvDemandFile)) : null;
  const mainManifest = mainFound.find((q) => q.manifest)?.manifest ?? null, cvManifest = cvFound.find((q) => q.manifest)?.manifest ?? null;
  problems.push(...mainCheck.problems, ...(cvCheck?.problems ?? []), ...(wantCv ? checkPair(mainManifest, cvManifest, splitSha, !demandPath) : []));
  acquired[p] = { main: mainFound.flatMap((q) => (q.run ? [q.run] : [])), cv: cvFound.flatMap((q) => (q.run ? [q.run] : [])), mainManifest, cvManifest, revisions: mainCheck.revisions, dirty: mainCheck.dirty, fingerprint: mainCheck.fingerprint, wantCv };
}
const fingerprints = [...new Set(periods.map((p) => acquired[p].fingerprint).filter((x): x is string => !!x))];
if (fingerprints.length > 1) problems.push(`the periods were run on different simulators (${fingerprints.map((x) => x.slice(0, 12)).join(', ')})`);
if (problems.length && !diagnostic) {
  console.error(`assess: the runs cannot support a verdict. ${problems.length} problem(s):\n${problems.map((x) => `  - ${x}`).join('\n')}\nNothing was written. Fix the runs (rerun without --reuse), or give --diagnostic with --suffix or --no-write to report what exists without a verdict.`);
  process.exit(3);
}
const validationPath = join(root, 'data/calibration/validation.json');
const validationFile: ValidationFile | null = existsSync(validationPath) ? JSON.parse(readFileSync(validationPath, 'utf8')) : null;
const primitives = primitiveEvidence(validationFile, fingerprints[0] ?? null);
const nameOf = (p: string) => (p.startsWith(`${root}/`) ? p.slice(root.length + 1) : p);

L.push(`# Baseline assessment: ${area}`, '');
if (diagnostic) L.push(`**DIAGNOSTIC OUTPUT: no calibration or stability verdict is issued.** The runs do not satisfy the rules for an assessment (${problems.length} problem(s) below); the figures describe only the runs that exist.`, '', ...problems.map((x) => `- ${x}`), '');
const nRuns = (p: string) => `${acquired[p].main.length} of ${seeds.length}`;
L.push(`Generated by \`tools/assess.ts\` (do not edit).${demandPath ? ` Variant demand: ${nameOf(demandPath)} (not the shipped demand).` : ''}${cvPath ? ` The held-out stations are scored on the cross-validation demand (${nameOf(cvPath)}), built as the training view of the frozen split (their observations are removed from every count-derived step), with the same seeds; the other stations on the shipped demand.` : ' No cross-validation demand: the held-out stations cannot be scored out of sample.'} ${diagnostic ? `Seeds found per period: ${periods.map((p) => `${p} ${nRuns(p)}`).join(', ')} of the requested ${seedSpec}` : `${seeds.length} seeds (${seedSpec}, none chosen)`}, ${minutes}-minute runs at scale 1. Intervals are 95% intervals of the mean over seeds (Student t). Rules: \`openspec/changes/archive/2026-11-13-baseline-calibration/design.md\` D16 to D18.`, '');
L.push(...provenanceLines());
const splitFile = join(root, `data/demand/${area}.split.json`);
L.push(...scopeLines({ cvDemand: !!cvPath, splitSha, minHeld, split: existsSync(splitFile) ? JSON.parse(readFileSync(splitFile, 'utf8')) : null }));

for (const p of periods) {
  const acq = acquired[p];
  const runs = acq.main;
  byPeriod[p] = runs;
  if (!runs.length) { L.push(`## ${p}`, '', `No run report exists for ${p}; nothing to report.`, ''); verdicts[p] = { stable: false, d5: null, flow: null, through: null, rule: null }; splits[p] = null; continue; }
  const n = runs.length;
  const per = 60 / minutes;
  const bl = runs.map((r) => r.health.backlogPct);
  const speed = seedStat(runs.map((r) => r.health.arterialMeanSpeed));
  const done = seedStat(runs.map((r) => r.health.completed));
  const stab: Stability = computeStability(runs, stabilityRule(targets));
  const rem = seedStat(runs.map((r) => judgedClearings(r) * per));
  const stable: boolean = stab.holds;
  const ss = shareStats(runs, p === 'pm_peak');
  const head = ss.filter((q) => q.headline);
  const d5 = p === 'pm_peak' ? head.length > 0 && head.every((q) => q.within10) : null;
  const sc = stations ? scoreStations(runs, stations, p) : null;
  const cvR = acq.cv;
  cvRuns[p] = cvR;
  const scCv = stations && cvR.length ? scoreStations(cvR, stations, p) : null;
  const mainSplit = sc && recencyCfg ? ruleSplit(sc.cases.map((c) => ({ year: c.year, c })), recencyCfg) : null;
  const cvSplit = scCv && recencyCfg ? ruleSplit(scCv.cases.map((c) => ({ year: c.year, c })), recencyCfg) : null;
  const split = mainSplit ? outOfSampleSplit(mainSplit, cvSplit) : null;
  if (sc && scCv && recencyCfg) {
    const shipped = new Map(sc.cases.map((c) => [c.stationId, c]));
    heldFails[p] = scCv.cases.filter((c) => c.held && !c.derived && c.year != null && recencyCfg.referenceYear - c.year <= recencyCfg.recentYears && !c.gehOk).sort((x, y) => y.geh - x.geh)
      .map((c) => ({ label: c.label, source: c.source, year: c.year, counted: c.counted, cv: c.modeled, cvGeh: c.geh, shipped: shipped.get(c.stationId)!.modeled, shippedGeh: shipped.get(c.stationId)!.geh }));
  }
  splits[p] = split;
  scores[p] = sc ? sc.cases : [];
  const rv = split ? ruleVerdicts(split, 0.85, minHeld) : null;
  const flow = rv ? rv.met : sc ? sc.fitted.meets : null;
  const th = throughStats(runs);
  throughRows[p] = th;
  verdicts[p] = { stable, d5, flow, through: th.length ? th.every((q) => q.inside) : null, rule: rv };

  L.push(`## ${p}`, '');
  L.push(`**Stability rule (D16): ${diagnostic ? `not judged (diagnostic, ${n} of ${seeds.length} seeds)` : stable ? 'holds' : 'fails'}.** Cars cleared from gridlock ${stab.zoneScoped ? 'near the study area (judged zone, far ones linked to it included)' : '(all of them: no near/far split)'} ${f(rem.mean)} per hour (min ${f(rem.min)}, max ${f(rem.max)}; rule below ${rule.maxMeanRemovalsPerHour ?? 1}${stab.zoneScoped ? `; ${f(stab.allPerHourMean)} in all, ${f(stab.farPerHourMean)} far` : ''}); backlog under ${rule.backlogPct ?? 2}% in ${stab.backlogSeedsOk} of ${n} seeds (mean ${f(seedStat(bl).mean)}%, max ${f(Math.max(...bl))}%); backlog growth in the second half: ${stab.growthSeeds.length ? `seeds ${stab.growthSeeds.join(', ')} exceed ${rule.maxSecondHalfBacklogGrowthPct ?? 2} points` : 'no seed above the limit'}; arterial speed ${f(speed.mean)} m/s (${f(speed.lo)} to ${f(speed.hi)}); completed trips ${Math.round(done.mean)} (${Math.round(done.lo)} to ${Math.round(done.hi)}). The old rule (zero cars cleared from gridlock anywhere in every seed) passes in ${stab.oldRuleSeedsPassing.length} of ${n} seeds. Computed from these ${n} runs. ${recoverySentence(runs)}`, '');
  L.push(...zoneLines(runs, stab, rule.maxMeanRemovalsPerHour ?? 1));
  L.push(`Route shares (modeled seed mean, 95% interval, observed${p === 'pm_peak' ? ', PM values' : '; the observed values are the PM ones, shown for comparison only'}):`, '', '| Share | Observed | Modeled | 95% interval | Error (points) | Within 10 |', '| --- | --- | --- | --- | --- | --- |');
  for (const q of ss) L.push(`| ${q.headline ? '**' : ''}${q.block} ${q.side} ${q.via}${q.headline ? '**' : ''} | ${pct(q.observed, 0)} | ${pct(q.mean)} | ${pct(q.lo)} to ${pct(q.hi)} | ${f(q.errPoints, 1)} | ${q.within10 ? 'yes' : 'NO'} |`);
  L.push('', `Headline shares: mean absolute error ${f(headlineError(ss), 1)} points; ${head.filter((q) => q.within10).length} of ${head.length} within 10 points${d5 === null ? ' (not gated outside the PM peak)' : d5 ? ' (D5 holds)' : ' (D5 fails)'}.`, '');
  const rs = rampStats(runs);
  L.push('Ramp via-street shares, trips from (to) the north side:', '', '| Ramp share | Observed | Modeled | 95% interval | Error (points) |', '| --- | --- | --- | --- | --- |');
  for (const q of rs) L.push(`| ${q.direction} via ${q.via} | ${pct(q.observed, 0)} | ${pct(q.mean)} | ${pct(q.lo)} to ${pct(q.hi)} | ${f(q.errPoints, 1)} |`);
  if (sc) {
    L.push('', `Count stations, simulator flows (mean over seeds) against the counts [WebTAG-M3.1] [TfL-TMG4]; ${sc.skippedGates} gate stations and ${sc.skippedFeatures} movement or route stations have no link: the gates are scored only in the demand fit report, the movements and routes below as select-link counts. Held-out stations in this table are in the shipped fit; the out-of-sample figures are in the verdict:`, '', '| Set | Stations | GEH < 5 | Size bands | Mean GEH | Rule (more than 85%) |', '| --- | --- | --- | --- | --- | --- |');
    for (const [name, s] of [['fitted', sc.fitted], ['validation stations, in the shipped fit', sc.held]] as const) L.push(`| ${name} | ${s.n} | ${s.gehOk} (${pct(s.gehShare, 0)}%) | ${s.bandOk} (${pct(s.bandShare, 0)}%) | ${f(s.meanGeh, 1)} | ${s.meets ? 'met' : 'not met'} |`);
    if (recencyCfg) L.push('', 'Count stations by source and count year, simulator flows (the station file lists the source and count year of each station):', '', ...sourceYearLines(sc.cases.map((c) => ({ source: c.source, year: c.year, c })), recencyCfg));
    L.push('', 'Interior streets (volunteer-count blocks) against the other stations (arterials, ramps, Caltrans and turning-movement counts), simulator flows:', '', '| Group | Set | Stations | GEH < 5 | Size bands | Mean GEH |', '| --- | --- | --- | --- | --- | --- |');
    for (const [gname, g] of [['interior blocks', sc.interior], ['other stations', sc.other]] as const) for (const [name, s] of [['fitted', g.fitted], ['validation stations, in the shipped fit', g.held]] as const) L.push(`| ${gname} | ${name} | ${s.n} | ${s.gehOk} (${pct(s.gehShare, 0)}%) | ${s.bandOk} (${pct(s.bandShare, 0)}%) | ${f(s.meanGeh, 1)} |`);
    const streetsOf = [...new Set<string>((targets.selectLink ?? []).map((t: { street: string }) => t.street))];
    for (const st of streetsOf) {
      const rows = sc.cases.filter((c) => c.kind === 'count' && c.label.startsWith(`${st} `)).sort((a, b) => Number(/link (\d+)/.exec(a.label)?.[1]) - Number(/link (\d+)/.exec(b.label)?.[1]));
      if (!rows.length) continue;
      L.push('', `${st}, block by block (veh/h, counted by the volunteers, modeled seed mean):`, '', '| Block | Counted | Modeled | Ratio | GEH | Validation station |', '| --- | --- | --- | --- | --- | --- |');
      for (const c of rows) L.push(`| ${c.label.replace(`${st} `, '').replace(/ \(link \d+\)/, '')} | ${Math.round(c.counted)} | ${Math.round(c.modeled)} | ${f(c.modeled / c.counted)} | ${f(c.geh, 1)} | ${c.held ? 'yes' : 'no'} |`);
      const nb = rows.filter((c) => /, NB$|, EB$/.test(c.label.replace(/ \(link \d+\)/, ''))), sb = rows.filter((c) => /, SB$|, WB$/.test(c.label.replace(/ \(link \d+\)/, '')));
      const med = (xs: number[]) => { const q = [...xs].sort((a, b) => a - b); return q.length ? q[Math.floor(q.length / 2)] : NaN; };
      L.push('', `Median block: counted ${Math.round(med(nb.map((c) => c.counted)))} NB/EB and ${Math.round(med(sb.map((c) => c.counted)))} SB/WB; modeled ${Math.round(med(nb.map((c) => c.modeled)))} and ${Math.round(med(sb.map((c) => c.modeled)))}.`);
    }
    if (stations!.entries?.length && (p === 'pm_peak' || p === 'am_peak')) {
      const bySide = new Map<string, { counted: number; modeled: number; rows: string[] }>();
      for (const e of stations!.entries) {
        const c = e.counted[p]; if (c == null) continue;
        const m = meanLinkFlow(runs, [e.link]);
        const g = bySide.get(e.side) ?? bySide.set(e.side, { counted: 0, modeled: 0, rows: [] }).get(e.side)!;
        g.counted += c; g.modeled += m; g.rows.push(`| ${e.label} | ${c} | ${Math.round(m)} |`);
      }
      L.push('', 'Entries by side (the interior links that start at a surface arterial; vehicles per hour, counted by the volunteers against the simulator mean):', '', '| Side | Counted | Modeled |', '| --- | --- | --- |');
      for (const [side, g] of bySide) L.push(`| ${side} | ${g.counted} | ${Math.round(g.modeled)} |`);
      L.push(`| all | ${[...bySide.values()].reduce((a, g) => a + g.counted, 0)} | ${Math.round([...bySide.values()].reduce((a, g) => a + g.modeled, 0))} |`, '', '| Entry | Counted | Modeled |', '| --- | --- | --- |', ...[...bySide.values()].flatMap((g) => g.rows));
    }
    const fs = stations!.stations.filter((q) => q.feature && q.target[p] > 0);
    if (fs.length && runs[0].features) {
      L.push('', 'Turning movements and whole-street routes (select-link counts of the simulator: trips that took the movement or drove the whole street, per hour, seed mean with 95% interval):', '', '| Count | Counted | Modeled | 95% interval | Ratio |', '| --- | --- | --- | --- | --- |');
      for (const q of fs) { const st = featureStats(runs, q.id); L.push(`| ${q.label} | ${Math.round(q.target[p])} | ${f(st.mean, 0)} | ${f(st.lo, 0)} to ${f(st.hi, 0)} | ${f(st.mean / q.target[p])} |`); }
    }
    const sg = runs[0].observedSignals ?? [];
    for (const [i, o] of sg.entries()) {
      for (const [j, a] of o.approaches.entries()) {
        const ex = seedStat(runs.map((r) => r.observedSignals![i].approaches[j].exitsPerHour));
        L.push('', `Signal with observed timing, ${o.streets}${o.applies === false ? ' (the observation does not apply to this period; the plan is the Webster plan)' : ''}: modeled cycle ${f(o.cycleS, 0)} s (observed ${f(o.observedCycleS, 0)}), green of the observed approach ${a.modeledGreenS == null ? '-' : f(a.modeledGreenS, 0)} s (observed ${f(a.observedGreenS, 0)}); the approach discharges ${f(ex.mean, 0)} veh/h, ${f((ex.mean * o.cycleS) / 3600, 1)} cars per cycle ${observedCars(o.streets, p)}.`);
      }
    }
    const cr = corridorRatios(runs, stations!, p);
    L.push('', 'Corridor ratios (simulated flow over counted flow, link-based stations of the corridor):', '', '| Corridor | Stations | Ratio | 95% interval |', '| --- | --- | --- | --- |');
    for (const c of cr) L.push(`| ${c.corridor} | ${c.stations} | ${f(c.ratio)} | ${f(c.lo)} to ${f(c.hi)} |`);
    const bad = [...sc.cases].filter((c) => !c.gehOk).sort((a, b) => b.geh - a.geh).slice(0, 12);
    if (bad.length) {
      L.push('', 'Stations with GEH of 5 or more (largest 12), with the reason class of the miss to be explained in the record [WebTAG-M3.1] 3.3.12:', '', '| Station | Validation station | Counted | Modeled | GEH | Class |', '| --- | --- | --- | --- | --- | --- |');
      for (const c of bad) L.push(`| ${c.label} | ${c.held ? 'yes' : 'no'} | ${Math.round(c.counted)} | ${Math.round(c.modeled)} | ${f(c.geh, 1)} | ${c.gehClass} |`);
    }
  }
  if (travelNet) {
    const tt = travelTimes(runs, travelNet, targets.travelTimes.segments, p);
    if (tt.length) {
      L.push('', 'Arterial travel times against the observed peak-period speeds [ACTC-LOS2014] [ACTC-LOS2018] (simulated: free-flow time plus the mean delay per vehicle on each link, scaled to the published segment length; observed: the four count years):', '', '| Segment | Free flow (s) | Simulated (s) | 95% interval | Simulated (mph) | Observed (mph) | Observed (s) | Inside the observed range |', '| --- | --- | --- | --- | --- | --- | --- | --- |');
      for (const r of tt) L.push(`| ${r.id} | ${f(r.freeS, 0)} | ${f(r.modeledS, 0)} | ${f(r.lo, 0)} to ${f(r.hi, 0)} | ${f(r.modeledMph, 1)} | ${r.observedMph.join(', ')} | ${f(r.observedS[0], 0)} to ${f(r.observedS[1], 0)} | ${r.within ? 'yes' : r.modeledS < r.observedS[0] ? 'no, too fast' : 'no, too slow'} |`);
    }
  }
  const cut = runs[0]?.patternFreewayThrough ?? [];
  if (cut.length) { L.push('', 'Cut-through (reported pattern a, local-street vehicle-miles of surface-gate to freeway-gate trips; seed mean):', ''); cut.forEach((c, i) => { const s = seedStat(runs.map((r) => r.patternFreewayThrough![i].localMiles)); L.push(`- ${c.trips}: ${f(s.mean, 1)} veh-miles (${f(s.lo, 1)} to ${f(s.hi, 1)}), ${pct(seedStat(runs.map((r) => r.patternFreewayThrough![i].shareOfLocalMiles)).mean)}% of local vehicle-miles`); }); }
  const byp = runs[0]?.patternBypass ?? [];
  if (byp.length) { L.push('', 'Bypass of the arterial (reported pattern b):', ''); byp.forEach((c, i) => { const v = seedStat(runs.map((r) => r.patternBypass![i].viaBypass / Math.max(1, r.patternBypass![i].corridorTrips))); L.push(`- ${c.bypass} against ${c.arterial}, ${c.dir}: ${pct(v.mean)}% of corridor trips (${pct(v.lo)} to ${pct(v.hi)})`); }); }
  L.push('');
}

const noCounts = (p: string) => verdicts[p].rule?.fitted === 'no counts' && verdicts[p].rule?.held === 'no counts';
const allStable = periods.every((p) => verdicts[p].stable);
const status = suggestStatus(Object.fromEntries(periods.map((p) => [p, { stable: verdicts[p].stable, d5: verdicts[p].d5, through: p === 'pm_peak' ? verdicts[p].through : null, stations: noCounts(p) ? null : verdicts[p].flow === true }])), 'pm_peak', toVerdict(primitives));
const calibrated = status.calibrated;
const yn = (v: boolean | null, na = 'n/a') => (diagnostic ? 'not judged' : v === null ? na : v ? 'pass' : 'FAIL');
const tl = (b: { n: number; ok: number }) => (b.n ? `${b.ok} of ${b.n} (${pct(b.ok / b.n, 0)}%)` : 'none');
const rvText = (v: RuleVerdict) => (diagnostic ? 'not judged' : v === 'met' ? 'pass' : v === 'not met' ? 'FAIL' : v === 'too few' ? `too few to judge (fewer than ${minHeld}), not a pass` : 'no counts');
L.push('## Verdict', '', `Status rules, per period. D16 stability; D5 headline shares (PM peak only, the other periods have no observed shares); the station rule (GEH below 5 at more than 85% of stations) judged on counts from the last ${recencyCfg?.recentYears ?? 5} years: the fitted stations on the shipped demand, the held-out stations on the cross-validation demand (a fit that left them out, same seeds), so the held-out figure is out of sample; at least ${minHeld} recent held-out stations are needed to judge it. A target that is a scaled copy of another period's count (midday = PM x factor, ASSUMPTION) is not a count and is not judged. The through-car check (modeled through cars inside the observed range on each counted block, PM peak only: the other periods have no whole-street counts; no rows is a failure, not a pass).`, '', '| Period | D16 | D5 | Station rule, recent counts, fitted (shipped fit) | Station rule, recent counts, held out (out of sample) | Through cars | Validation stations, in the shipped fit (in sample, not judged) | Older counts, fitted / held out (out of sample) |', '| --- | --- | --- | --- | --- | --- | --- | --- |');
for (const p of periods) {
  const sp = splits[p], v = verdicts[p];
  const thr = p === 'pm_peak' && v.through === null ? 'FAIL: no through-car rows in the reports' : yn(v.through, 'no target');
  if (!sp || !v.rule || noCounts(p)) { L.push(`| ${p} | ${yn(v.stable)} | ${yn(v.d5, 'not gated')} | no ${p === 'midday' ? 'midday ' : ''}counts: stability only | no counts | ${thr} | - | - |`); continue; }
  L.push(`| ${p} | ${yn(v.stable)} | ${yn(v.d5, 'not gated')} | ${tl(sp.recent.fitted)}, ${rvText(v.rule.fitted)} | ${tl(sp.recent.held)}, ${rvText(v.rule.held)} | ${thr} | ${sp.heldInFit ? tl(sp.heldInFit.recent) : '-'} | ${tl(sp.older.fitted)} / ${tl(sp.older.held)} |`);
}
L.push('', 'Through cars per hour, seed mean (standard error of the mean: standard deviation over the seeds / square root of their number) against the observed range:', '', '| Period | Block | Modeled | Standard error | Observed range | Inside | Fitted |', '| --- | --- | --- | --- | --- | --- | --- |');
for (const p of periods) for (const q of throughRows[p] ?? []) L.push(`| ${p} | ${q.block} | ${f(q.mean, 0)} | ${f(q.se, 1)} | ${q.low} to ${q.high} | ${q.inside ? 'yes' : 'NO'}${!q.inside && Math.min(Math.abs(q.mean - q.low), Math.abs(q.mean - q.high)) <= q.se ? ' (within one standard error)' : ''} | ${q.fitted ? 'yes' : 'no'} |`);
if (periods.some((p) => (throughRows[p] ?? []).some((q) => q.fitted))) L.push('', 'Fitted blocks are targets of the demand fit (calibration round 39), so they are no longer an independent check. The independent checks are the held-out stations, the headline freeway shares, stability and the arterial travel times.');
const failing = periods.filter((p) => heldFails[p]?.length);
if (failing.length) {
  L.push('', 'Recent held-out stations at GEH 5 or more on the cross-validation demand (out of sample), with the same station on the shipped demand:', '', '| Period | Station | Source | Counted | Cross-validation | GEH | Shipped demand | GEH |', '| --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const p of failing) for (const c of heldFails[p]) L.push(`| ${p} | ${c.label} | ${c.source ?? '-'} ${c.year ?? ''} | ${Math.round(c.counted)} | ${Math.round(c.cv)} | ${f(c.cvGeh, 1)} | ${Math.round(c.shipped)} | ${f(c.shippedGeh, 1)} |`);
}
const allCounts = (p: string) => { const sp = splits[p]; return sp ? `${tl(sp.all.fitted)} fitted, ${tl(sp.all.held)} held out (out of sample)` : '-'; };
const dominant = (p: string) => { const m = new Map<string, number>(); let n = 0; for (const c of scores[p] ?? []) { const age = c.year == null || c.derived ? null : recencyCfg!.referenceYear - c.year; if (age !== null && age <= recencyCfg!.recentYears) { n++; m.set(c.source ?? 'unknown', (m.get(c.source ?? 'unknown') ?? 0) + 1); } } const [src, k] = [...m].sort((a, b) => b[1] - a[1])[0] ?? ['none', 0]; return `${p}: ${k} of ${n} recent stations come from one source (${src})`; };
const midday = periods.filter(noCounts);
L.push('', `${midday.length ? `No ${midday.join(', ')} counts exist; ${midday.join(', ')} is checked for stability only, and its station targets (the PM count times a factor, ASSUMPTION) are not judged. ` : ''}Where the recent pass rate comes from: ${recencyCfg ? periods.filter((p) => !noCounts(p)).map(dominant).join('; ') : '-'}. A source counted on a single day carries one hour of that day. The older counts pass less: ${periods.filter((p) => !noCounts(p)).map((p) => `${p} ${splits[p] ? tl(splits[p]!.older.fitted) : '-'} fitted`).join(', ')}. All counts together: ${periods.filter((p) => !noCounts(p)).map((p) => `${p} ${allCounts(p)}`).join('; ')}.`, '', '', ...primitiveLines(primitives), `${diagnostic ? '**No status is suggested: diagnostic output.**' : `Suggested status: **${calibrated ? 'calibrated' : 'uncalibrated'}**; experimental periods: ${status.experimental.join(', ') || 'none'}.${calibrated ? '' : ` Not calibrated because: ${status.reasons.join('; ')}.`}${status.qualifications.length ? ` Qualifications: ${status.qualifications.join('; ')}.` : ''}`}`, '');
console.log(L.join('\n'));
if (write) {
  mkdirSync(dirname(outputs.assessment), { recursive: true });
  writeFileAtomic(outputs.assessment, L.join('\n') + '\n');
}
if (has('--noise') && write) {
  const nf = noiseFile(area, byPeriod);
  mkdirSync(dirname(outputs.noise), { recursive: true });
  writeFileAtomic(outputs.noise, JSON.stringify(nf));
  console.log(`noise file ${nameOf(outputs.noise)}: ${JSON.stringify(nf).length} bytes`);
}
