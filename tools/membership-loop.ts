// Fits the demand on the simulator's own route choice for every station the report binary exports (calibration round 48, openspec/changes/calibration-round-48).
// Pass k builds both views, runs seeds with `calibrate --select-od` (one process per seed, so that each seed writes its own file), pools passes 0 to k with equal
// weight into the membership files that `countFit.throughTargets.simulatedMembership` names, and compares pass k with pass k-1. The last build uses the last pool.
//   npx tsx tools/membership-loop.ts [--area rockridge] [--views shipped,training] [--periods pm_peak,am_peak] [--seeds 1-10] [--iterations 3] [--jobs 4]
//     [--dir target/membership-loop] [--report FILE] [--resume] [--dry-run]
// --dry-run reads the stations file and the split, prints the stations the rule selects per view and period, the stations that stay static and the steps, and runs nothing.
// Needs the demand config with the round 48 entry (apply-candidate.py), target/release/calibrate and the data files; every demand build writes into public/data and data/demand.
import { spawn, spawnSync } from 'node:child_process';
import { closeSync, existsSync, mkdirSync, openSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { writeFileAtomic } from './lib/atomic';
import { withheldStationIds, type SplitManifest } from './lib/lineage';
import { planLoop, selectStations, type StationRec } from './lib/membership-loop';
import { loopPaths, renderReport, runLoop, type CalibrateJob, type LoopOptions, type Runner, type View } from './lib/membership-loop-run';

const root = resolve(import.meta.dirname, '..');
const argv = process.argv.slice(2);
const arg = (k: string, d: string) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const parseSeeds = (spec: string) => spec.split(',').flatMap((p) => { const m = p.match(/^(\d+)-(\d+)$/); return m ? Array.from({ length: +m[2] - +m[1] + 1 }, (_, i) => +m[1] + i) : [+p]; });
const area = arg('--area', 'rockridge');
const opts: LoopOptions = {
  root, area, views: arg('--views', 'shipped,training').split(',') as View[], periods: arg('--periods', 'pm_peak,am_peak').split(','), seeds: parseSeeds(arg('--seeds', '1-10')),
  iterations: Number(arg('--iterations', '3')), jobs: Number(arg('--jobs', '4')), dir: resolve(root, arg('--dir', 'target/membership-loop')), configPath: `data/demand/${area}.config.json`, resume: argv.includes('--resume'),
};
if (opts.views.some((v) => v !== 'shipped' && v !== 'training')) { console.error('--views takes shipped and training'); process.exit(2); }

const cfg = JSON.parse(readFileSync(resolve(root, opts.configPath), 'utf8'));
const hasRule = !!cfg.countFit?.throughTargets?.simulatedMembership;

// Minutes on a 4-core container (round 44, round 46 runbook): a demand build 12 per view, a ten-seed set of one period and view 5; the runs scale with 4 / jobs.
const estimate = () => {
  const builds = opts.views.length * (opts.iterations + 1) * 12;
  const runs = opts.views.length * opts.periods.length * opts.iterations * 5 * (opts.seeds.length / 10) * (4 / opts.jobs);
  return { builds, runs: Math.round(runs), total: Math.round(builds + runs) };
};

if (argv.includes('--dry-run')) {
  const stationsPath = resolve(root, cfg.countFit.stationsOutput);
  const st = JSON.parse(readFileSync(stationsPath, 'utf8')).stations as StationRec[];
  const withheld = withheldStationIds(JSON.parse(readFileSync(resolve(root, cfg.countFit.validation.splitFile ?? `data/demand/${area}.split.json`), 'utf8')) as SplitManifest);
  console.log(`membership loop, dry run${hasRule ? '' : ' (the config has no simulatedMembership entry; a real run stops until apply-candidate.py has been run)'}`);
  console.log(`stations file ${cfg.countFit.stationsOutput}: ${st.length} stations; the frozen split withholds ${withheld.size} from the training view`);
  for (const v of opts.views) for (const q of opts.periods) {
    const s = selectStations(st, q, v === 'training' ? withheld : undefined);
    console.log(`${v} ${q}: ${s.selected.length} selected (${s.selected.filter((x) => x.via === 'link').length} link, ${s.selected.filter((x) => x.via === 'route').length} movement or route), ${s.stayStatic.length} stay static${s.withheld.length ? `, ${s.withheld.length} withheld` : ''}`);
    for (const x of s.stayStatic) console.log(`  static: ${x.id}: ${x.reason}`);
  }
  console.log(`midday: no runs, static membership; its demand is fitted as before`);
  console.log('');
  for (const s of planLoop({ views: opts.views, periods: opts.periods, seeds: opts.seeds, iterations: opts.iterations, jobs: opts.jobs })) console.log(`${s.id}: ${s.title}${s.cmd ? `\n    ${s.cmd}` : ''}`);
  const e = estimate();
  console.log(`\nabout ${e.total} minutes on 4 cores scaled to ${opts.jobs} jobs (${e.builds} of builds, ${e.runs} of seed runs); a stop after pass 1 saves one pass of runs and two builds`);
  process.exit(0);
}

loopPaths(root, opts.configPath, cfg);
const bin = process.env.CALIBRATE_BIN ? resolve(process.env.CALIBRATE_BIN) : resolve(root, 'target/release/calibrate');
if (!existsSync(bin)) { console.error(`${bin} is not built (cargo build --release -p traffic-sim --bin calibrate)`); process.exit(1); }

const runner: Runner = {
  build(view, logFile) {
    mkdirSync(resolve(logFile, '..'), { recursive: true });
    const fd = openSync(logFile, 'w');
    const r = spawnSync('npx', ['tsx', 'tools/build-demand.ts', ...(view === 'training' ? ['--view', 'training'] : [])], { cwd: root, stdio: ['ignore', fd, fd] });
    closeSync(fd);
    if (r.status !== 0) throw new Error(`demand build (${view}) failed; see ${logFile}`);
  },
  // `--seeds` hands every child the same --select-od path, so each seed is its own process.
  async calibrate(jobs: CalibrateJob[], concurrency: number, logDir: string) {
    mkdirSync(logDir, { recursive: true });
    const queue = [...jobs];
    const failures: string[] = [];
    const worker = async () => {
      for (let j = queue.shift(); j; j = queue.shift()) {
        const log = join(logDir, `${j.period}-${j.seed}.log`);
        const fd = openSync(log, 'w');
        const code = await new Promise<number | null>((done) => {
          const c = spawn(bin, ['--area', area, '--period', j.period, '--minutes', '60', '--scale', '1', '--seed', String(j.seed), '--demand', j.demand, '--select-od', j.out, '--no-write'], { cwd: root, stdio: ['ignore', fd, fd] });
          c.on('close', done);
        });
        closeSync(fd);
        if (code !== 0) failures.push(`${j.period} seed ${j.seed} (${log})`);
      }
    };
    await Promise.all(Array.from({ length: Math.max(1, concurrency) }, worker));
    if (failures.length) throw new Error(`calibrate failed for ${failures.join('; ')}`);
  },
};

runLoop(opts, runner).then((s) => {
  const text = renderReport(s, opts);
  const out = resolve(root, arg('--report', join(opts.dir, 'membership-loop.md')));
  writeFileAtomic(out, text);
  console.log(text);
  console.log(`report: ${out}`);
}).catch((e) => { console.error(`membership-loop: ${e.message}`); process.exit(1); });
