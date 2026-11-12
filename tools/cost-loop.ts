// Outer loop of the demand build (baseline-calibration task 12): simulate -> mean link delays -> assign -> fit -> simulate.
// Each outer iteration runs the calibrate binary on the current demand file for every period (fixed seed, in parallel), writes the mean delay per
// vehicle on every link to `countFit.assignment.measured.file`, and rebuilds the demand, whose static assignment then loads trips over free-flow
// cost plus those delays (tools/lib/demand-fit.ts). With `--evaluate` it also runs the PM peak for seeds 1 to 3 after each iteration and stops when the
// headline-share error stops improving. Skips with a message (exit 0) when the binary is not built, so a plain `npm run data` is unaffected.
//   npx tsx tools/cost-loop.ts [--iterations 2] [--seed 1] [--evaluate] [--config data/demand/rockridge.config.json]
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const arg = (k: string, d: string) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : d; };
const iterations = Number(arg('--iterations', '2'));
const seed = Number(arg('--seed', '1'));
const evaluate = process.argv.includes('--evaluate');
const cfgPath = resolve(root, arg('--config', 'data/demand/rockridge.config.json'));
const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
const bin = resolve(root, 'target/release/calibrate');
if (!existsSync(bin)) {
  console.log('cost-loop: target/release/calibrate is not built (cargo build --release -p traffic-sim --bin calibrate); skipping, the build keeps its free-flow and BPR costs');
  process.exit(0);
}
const measured = cfg.countFit?.assignment?.measured;
if (!measured) { console.log('cost-loop: countFit.assignment.measured is not configured; nothing to do'); process.exit(0); }
const file = resolve(root, measured.file);
const periods: string[] = Object.keys(cfg.periodFactors);
const minFlow = measured.minFlowVehPerHour ?? 60;

const run = (args: string[], env: NodeJS.ProcessEnv = process.env) => new Promise<number>((res) => spawn(args[0], args.slice(1), { cwd: root, env, stdio: 'ignore' }).on('close', (c) => res(c ?? 1)));
const calib = (period: string, sd: number, out: string) => run([bin, '--area', cfg.area, '--period', period, '--minutes', '60', '--scale', '1.0', '--seed', String(sd), '--link-flows', '--out', out]);
const readRun = (out: string, period: string, sd: number) => JSON.parse(readFileSync(join(out, `${cfg.area}-${period}-s1-seed${sd}.json`), 'utf8'));
const build = () => spawnSync('npx', ['tsx', 'tools/build-demand.ts', cfgPath], { cwd: root, stdio: 'ignore' }).status === 0;

async function measure(tag: string) {
  const out = mkdtempSync(join(tmpdir(), 'cost-loop-'));
  await Promise.all(periods.map((p) => calib(p, seed, out)));
  const delayS: Record<string, number[]> = {};
  let links = 0;
  for (const p of periods) {
    const j = readRun(out, p, seed);
    links = j.linkMeanDelayS.length;
    delayS[p] = j.linkMeanDelayS.map((d: number, l: number) => (j.linkFlowVehPerHour[l] >= minFlow ? d : 0));
  }
  rmSync(out, { recursive: true, force: true });
  mkdirSync(resolve(file, '..'), { recursive: true });
  writeFileSync(file, JSON.stringify({ links, note: `${tag}, seed ${seed}, links under ${minFlow} veh/h set to 0`, delayS }));
}

async function score(label: string) {
  const out = mkdtempSync(join(tmpdir(), 'cost-loop-'));
  await Promise.all([1, 2, 3].map((s) => calib('pm_peak', s, out)));
  const rows = [1, 2, 3].map((s) => readRun(out, 'pm_peak', s));
  rmSync(out, { recursive: true, force: true });
  const head = rows.map((r) => r.shares.filter((q: { headline: boolean }) => q.headline));
  const mean = (f: (r: number) => number) => rows.reduce((a, _, i) => a + f(i), 0) / rows.length;
  const err = mean((i) => head[i].reduce((a: number, q: { modelled: number; observedPm: number; observed: number }) => a + Math.abs(q.modelled - (q.observedPm ?? q.observed)) * 100, 0) / head[i].length);
  const rem = mean((i) => rows[i].health.gridlockRemoved), bl = mean((i) => rows[i].health.backlogPct);
  console.log(`${label}: headline share error ${err.toFixed(1)} points (mean over seeds 1 to 3), PM removals ${rem.toFixed(1)}, backlog ${bl.toFixed(1)}%`);
  return err;
}

(async () => {
  if (existsSync(file)) rmSync(file);
  if (!build()) { console.error('cost-loop: build-demand failed'); process.exit(1); }
  let best = evaluate ? await score('iteration 0 (free-flow and BPR costs)') : Infinity;
  for (let k = 1; k <= iterations; k++) {
    await measure(`outer iteration ${k}`);
    if (!build()) { console.error('cost-loop: build-demand failed'); process.exit(1); }
    console.log(`iteration ${k}: measured delays written to ${measured.file} and demand rebuilt`);
    if (evaluate) {
      const e = await score(`iteration ${k}`);
      if (e > best - 0.5) { console.log(`shares stopped improving (${best.toFixed(1)} to ${e.toFixed(1)}); stopping`); break; }
      best = e;
    }
  }
})();
