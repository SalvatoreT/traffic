// Damped feedback loop between simulator travel times and the demand fit (baseline-calibration decision D18, audit R1).
//
// Each iteration: simulate every period over several seeds (the PM peak over the ten-seed list that also scores it), take the flow-weighted mean delay per vehicle on every link,
// average it into the running cost vector by the method of successive averages (weight 1/n; the first iteration takes the measurement as it is) [PowellSheffi1982]
// [WebTAG-M3.1] 3.4, [Aimsun-Manual] DUE page, [SUMO-Docs] dynamic user assignment, write it to `countFit.assignment.measured.file` and rebuild the demand.
// Convergence is measured on the averaged cost vector between iterations (relative gap, and the share of links whose cost changed by under 1%); the loop stops on a relative
// gap below `--gap` (default 0.10, the 5% to 10% range of [Aimsun-Manual]), after `--iterations`, or when the PM peak stops being stable. Each iteration is scored on the
// PM peak: stability rule D16, headline share error, station GEH on the simulator's flows (fitted and held-out). The loop keeps an iteration only if it improves the
// share error by at least 0.5 points while the PM peak stays stable under D16 and the fitted GEH shares do not fall by more than 5 points (held-out shares are reported, not used); otherwise it restores the
// demand without measured delays. Round 37: stability and the removals in the rule are computed from the PM runs (tools/lib/verdict.ts) and count the cars cleared from gridlock
// in the judged zone of the area, with far ones whose blocking chain reaches it; far clearings are reported beside them. Skips with a message (exit 0) when the binary is missing, so `npm run data` is unaffected.
//   npx tsx tools/cost-loop.ts [--iterations 5] [--gap 0.10] [--jobs 4] [--cost-seeds 1-3] [--score-seeds 1-10] [--config data/demand/rockridge.config.json]
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { keptIteration, msaAverage, relativeGap, shareUnchanged } from './lib/acceptance';
import { farSites, headlineError, rampStats, readSeeds, scoreStations, shareStats, type SeedRun, type StationFile } from './lib/assess';
import { computeStability, stabilityRule } from './lib/verdict';

const root = resolve(import.meta.dirname, '..');
const arg = (k: string, d: string) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : d; };
const maxIter = Number(arg('--iterations', '5'));
const gapStop = Number(arg('--gap', '0.10'));
const jobs = arg('--jobs', '4');
const costSeeds = arg('--cost-seeds', '1-3');
const scoreSeeds = arg('--score-seeds', '1-10');
const objective = arg('--objective', 'share');
const resume = process.argv.includes('--resume') ? Number(arg('--resume', '0')) : -1;
const cfgPath = resolve(root, arg('--config', 'data/demand/rockridge.config.json'));
const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
const bin = process.env.CALIBRATE_BIN ? resolve(process.env.CALIBRATE_BIN) : resolve(root, 'target/release/calibrate');
if (!existsSync(bin)) { console.log('cost-loop: target/release/calibrate is not built (cargo build --release -p traffic-sim --bin calibrate); skipping, the build keeps its free-flow and BPR costs'); process.exit(0); }
const measured = cfg.countFit?.assignment?.measured;
if (!measured) { console.log('cost-loop: countFit.assignment.measured is not configured; nothing to do'); process.exit(0); }
const delaysFile = resolve(root, measured.file);
const minFlow: number = measured.minFlowVehPerHour ?? 60;
const periods: string[] = Object.keys(cfg.periodFactors).filter((p) => !p.startsWith('_'));
const pm = periods[periods.length - 1];
const stationsFile = resolve(root, cfg.countFit.stationsOutput ?? `data/demand/${cfg.area}.stations.json`);
const targets = JSON.parse(readFileSync(resolve(root, `data/calibration/${cfg.area}.targets.json`), 'utf8'));
const work = resolve(root, 'target/cost-loop');
mkdirSync(work, { recursive: true });

const parse = (spec: string) => spec.split(',').flatMap((p) => { const m = p.match(/^(\d+)-(\d+)$/); return m ? Array.from({ length: +m[2] - +m[1] + 1 }, (_, i) => +m[1] + i) : [+p]; });
const build = () => spawnSync('npx', ['tsx', 'tools/build-demand.ts', cfgPath], { cwd: root, stdio: 'ignore' }).status === 0;
const simulate = (period: string, seeds: string, dir: string) => spawnSync(bin, ['--area', cfg.area, '--period', period, '--minutes', '60', '--scale', '1', '--seeds', seeds, '--jobs', jobs, '--keep-seeds', dir, '--out', join(dir, 'summary')], { cwd: root, stdio: ['ignore', 'ignore', 'ignore'] }).status === 0;

/** Flow-weighted mean delay per vehicle over the seeds; links under `minFlow` veh/h are set to zero (they carry too little to measure). */
function meanDelay(runs: SeedRun[]): Float64Array {
  const n = runs[0].linkMeanDelayS!.length;
  const out = new Float64Array(n);
  for (let l = 0; l < n; l++) {
    let w = 0, s = 0;
    for (const r of runs) { const q = r.linkFlowVehPerHour![l]; w += q; s += q * r.linkMeanDelayS![l]; }
    out[l] = w / runs.length >= minFlow && w > 0 ? s / w : 0;
  }
  return out;
}

interface Row { rampCountErr: number; k: number; stable: boolean; meanRemovals: number; allRemovals: number; nearRemovals: number; farRemovals: number; farLinked: number; zoneScoped: boolean; farWhere: string; backlogMean: number; backlogSeedsOk: number; completed: number; headErr: number; rampErr: number; heads: string; fittedGeh: number; heldGeh: number; fittedBand: number; heldBand: number; intFitGeh: number; intHeldGeh: number; gap: number | null; unchanged: number | null }
let observedHead = "";
const rows: Row[] = [];
const history: (Record<string, number[]> | null)[] = [];

/** Counted ramps: stations of a turning-movement count whose leg is a ramp entering the junction (the off-ramps). Mean absolute error of the simulator's ramp flow in veh/h against the count. */
function rampCountError(runs: SeedRun[]): number {
  const st: StationFile = JSON.parse(readFileSync(stationsFile, 'utf8'));
  const ramps = st.stations.filter((q) => q.kind === 'tmc' && q.links.length === 1 && /ramp \(.\ leg\) entering/.test(q.label) && (q.target[pm] ?? 0) > 0);
  const w = runs.filter((r) => r.linkFlowVehPerHour);
  if (!ramps.length || !w.length) return NaN;
  return ramps.reduce((a, q) => a + Math.abs(w.reduce((b, r) => b + r.linkFlowVehPerHour![q.links[0]], 0) / w.length - q.target[pm]), 0) / ramps.length;
}

function score(k: number, gap: number | null, unchanged: number | null, pmRuns: SeedRun[]): Row {
  const stab = computeStability(pmRuns, stabilityRule(targets));
  const ss = shareStats(pmRuns, true);
  const rs = rampStats(pmRuns);
  const st: StationFile = JSON.parse(readFileSync(stationsFile, 'utf8'));
  const sc = scoreStations(pmRuns, st, pm);
  const bl = pmRuns.map((r) => r.health.backlogPct);
  const where = farSites(pmRuns).slice(0, 3).map((q) => `${q.streets} ${q.cleared}`).join('; ');
  return {
    rampCountErr: rampCountError(pmRuns), k, stable: stab.holds, meanRemovals: stab.removalsPerHourMean, allRemovals: stab.allPerHourMean, nearRemovals: stab.nearPerHourMean, farRemovals: stab.farPerHourMean, farLinked: stab.farLinkedPerHourMean, zoneScoped: stab.zoneScoped, farWhere: where,
    backlogMean: bl.reduce((a, b) => a + b, 0) / bl.length, backlogSeedsOk: stab.backlogSeedsOk,
    completed: pmRuns.reduce((a, r) => a + r.health.completed, 0) / pmRuns.length, headErr: headlineError(ss), rampErr: rs.reduce((a, q) => a + Math.abs(q.errPoints), 0) / Math.max(1, rs.length),
    heads: ss.filter((q) => q.headline).map((q) => (q.mean * 100).toFixed(0)).join(' / '), fittedGeh: sc.fitted.gehShare, heldGeh: sc.held.gehShare, intFitGeh: sc.interior.fitted.gehShare, intHeldGeh: sc.interior.held.gehShare, fittedBand: sc.fitted.bandShare, heldBand: sc.held.bandShare, gap, unchanged,
  };
}

(async () => {
  if (resume < 0) {
    if (existsSync(delaysFile)) rmSync(delaysFile);
    if (!build()) { console.error('cost-loop: build-demand failed'); process.exit(1); }
  }
  let avg: Record<string, Float64Array> | null = null;
  history.push(null);
  let n = 0;
  for (let k = 0; k <= maxIter; k++) {
    const dir = join(work, `iter${k}`);
    const replay = k <= resume;
    if (!replay) { rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true }); }
    const cost: Record<string, Float64Array> = {};
    for (const p of periods) {
      const seeds = p === pm ? scoreSeeds : costSeeds;
      if (!replay && !simulate(p, seeds, dir)) { console.error(`cost-loop: calibrate failed for ${p}`); process.exit(1); }
      cost[p] = meanDelay(readSeeds(dir, cfg.area, p, parse(seeds)));
    }
    const pmRuns = readSeeds(dir, cfg.area, pm, parse(scoreSeeds));
    observedHead = shareStats(pmRuns, true).filter((q) => q.headline).map((q) => String(Math.round(q.observed * 100))).join(' / ');
    // The cost vector this iteration's simulation implies, averaged into the running one.
    n = k + 1;
    const next: Record<string, Float64Array> = {};
    for (const p of periods) next[p] = msaAverage(avg ? avg[p] : null, cost[p], n);
    let gap: number | null = null, unchanged: number | null = null;
    if (avg) {
      gap = periods.reduce((a, p) => a + relativeGap(avg![p], next[p]), 0) / periods.length;
      unchanged = periods.reduce((a, p) => a + shareUnchanged(avg![p], next[p]), 0) / periods.length;
    }
    const row = score(k, gap, unchanged, pmRuns);
    rows.push(row);
    console.log(`iteration ${k}: PM stable ${row.stable}, judged cars cleared from gridlock ${row.meanRemovals.toFixed(2)}/h (all ${row.allRemovals.toFixed(2)}, near ${row.nearRemovals.toFixed(2)}, far ${row.farRemovals.toFixed(2)}, far linked ${row.farLinked.toFixed(2)}), headline error ${row.headErr.toFixed(1)} points (${row.heads}), GEH<5 fitted ${(row.fittedGeh * 100).toFixed(0)}% held ${(row.heldGeh * 100).toFixed(0)}%, cost gap ${gap === null ? '-' : gap.toFixed(3)}, unchanged ${unchanged === null ? '-' : (unchanged * 100).toFixed(0) + '%'}`);
    avg = next;
    if (k >= 1 && gap !== null && gap < gapStop) { console.log(`cost gap ${gap.toFixed(3)} below ${gapStop}: converged`); break; }
    if (k >= 1 && rows[0].stable && !row.stable && !process.argv.includes('--no-stop')) { console.log('PM peak no longer stable under D16: stopping (--no-stop continues)'); break; }
    if (k === maxIter) break;
    if (k < resume) { history.push(Object.fromEntries(periods.map((p) => [p, [...next[p]].map((x) => Math.round(x * 10) / 10)]))); continue; }
    mkdirSync(resolve(delaysFile, '..'), { recursive: true });
    const delayS: Record<string, number[]> = {};
    for (const p of periods) delayS[p] = [...next[p]].map((x) => Math.round(x * 10) / 10);
    history.push(delayS);
    writeFileSync(delaysFile, JSON.stringify({ links: next[pm].length, note: `successive average of ${n} iteration(s) over seeds ${scoreSeeds} (${pm}) and ${costSeeds} (others), links under ${minFlow} veh/h set to 0`, delayS }));
    if (!build()) { console.error('cost-loop: build-demand failed'); process.exit(1); }
  }
  // Keep the best iteration or none (tools/lib/acceptance.ts `keptIteration`).
  const best = keptIteration(rows, objective === 'ramp' ? 'ramp' : 'share');
  const lines = ['# Cost loop', '', `Generated by \`tools/cost-loop.ts\`. PM peak scored over seeds ${scoreSeeds}; delays of the other periods averaged over seeds ${costSeeds}; successive averages with weight 1/n; stop on a relative cost gap under ${gapStop}.`, '',
    `Cars cleared from gridlock per hour, seed means: the rule judges those near the study area (the area's judged zone) and far ones whose blocking chain reached it${rows.every((r) => r.zoneScoped) ? '' : '; an iteration whose runs carry no near/far split counts every one'}.`, '',
    `| Iteration | PM stable (D16) | Judged per hour | All | Near | Far | Far, linked | Where far (seeds total) | Backlog mean % | Seeds under 2% | Completed | Headline shares (modeled, observed ${observedHead || 'not read'}) | Headline error (points) | Ramp error (points) | Ramp count error (veh/h) | GEH<5 fitted | GEH<5 held out | Bands fitted | Bands held out | Interior GEH<5 fitted | Interior GEH<5 held out | Cost gap | Links unchanged < 1% |`, `|${' --- |'.repeat(23)}`,
    ...rows.map((r) => `| ${r.k} | ${r.stable ? 'yes' : 'no'} | ${r.meanRemovals.toFixed(2)} | ${r.allRemovals.toFixed(2)} | ${r.nearRemovals.toFixed(2)} | ${r.farRemovals.toFixed(2)} | ${r.farLinked.toFixed(2)} | ${r.farWhere || '-'} | ${r.backlogMean.toFixed(2)} | ${r.backlogSeedsOk} | ${Math.round(r.completed)} | ${r.heads} | ${r.headErr.toFixed(1)} | ${r.rampErr.toFixed(1)} | ${r.rampCountErr.toFixed(0)} | ${(r.fittedGeh * 100).toFixed(0)}% | ${(r.heldGeh * 100).toFixed(0)}% | ${(r.fittedBand * 100).toFixed(0)}% | ${(r.heldBand * 100).toFixed(0)}% | ${(r.intFitGeh * 100).toFixed(0)}% | ${(r.intHeldGeh * 100).toFixed(0)}% | ${r.gap === null ? '-' : r.gap.toFixed(3)} | ${r.unchanged === null ? '-' : (r.unchanged * 100).toFixed(0) + '%'} |`),
    '', best === 0 ? (objective === 'ramp' ? 'Result (objective ramp): no iteration kept PM removals below 1.0 per hour while moving the counted off-ramps toward their counts by at least 25 veh/h with the headline-share error within 0.5 points of the free-flow and BPR baseline; the demand keeps its free-flow and BPR costs and the delays file is removed.' : 'Result: no iteration had fewer judged cars cleared from gridlock and less backlog than the free-flow and BPR costs with the headline-share error within 0.5 points and no fitted GEH share down by more than 5 points; the demand keeps its free-flow and BPR costs and the delays file is removed.') : `Result: iteration ${best} is kept (measured delays in \`${measured.file}\`).`, ''];
  writeFileSync(resolve(root, `data/calibration/${cfg.area}.cost-loop.md`), lines.join('\n'));
  if (best === 0) { if (existsSync(delaysFile)) rmSync(delaysFile); }
  else writeFileSync(delaysFile, JSON.stringify({ links: history[best]![pm].length, note: `successive average, iteration ${best}`, delayS: history[best] }));
  const lastBuilt = best === rows.length - 1;
  if (!lastBuilt && !build()) { console.error('cost-loop: final build-demand failed'); process.exit(1); }
  console.log(lines.join('\n'));
})();
