// Sharded seed runs for the ten-seed assessment (change sharded-batch-runs, D4 and D5). `assessRun` runs one slice the way tools/assess.ts runs it and uploads
// the seed reports; `assessFetch` merges the shards into the directory pair `tools/assess.ts --reuse DIR` reads (shipped runs in DIR, cross-validation runs in DIR-cv).
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { readRuns, type StationFile } from './assess';
import { checkPair, checkRunSet, seedFileName, type ExpectedInputs, type RunManifest } from './run-manifest';
import { loadManifest, verifyLocal, type Ctx, type InputsManifest } from './shard-inputs';
import { checkName, getJson, jobKey, putJson, sha256 } from './shard-store';
import { writeFileAtomic } from './atomic';

export type View = 'shipped' | 'cv';
export const DEFAULT_PERIODS = 'am_peak,midday,pm_peak';

export function parseSeeds(spec: string): number[] {
  const seeds = spec.split(',').flatMap((p) => { const m = p.match(/^(\d+)-(\d+)$/); return m ? Array.from({ length: +m[2] - +m[1] + 1 }, (_, i) => +m[1] + i) : /^\d+$/.test(p) ? [+p] : [NaN]; });
  if (!seeds.length || seeds.some((s) => !Number.isInteger(s))) throw new Error(`bad seed list ${JSON.stringify(spec)} (use 1-10 or 1,2,5)`);
  if (new Set(seeds).size !== seeds.length) throw new Error(`seed list ${spec} repeats a seed`);
  return seeds;
}

/** Same rule as tools/assess.ts: a period has counts of its own when some station target in it is not derived. Without the stations file every period counts. */
export function periodHasCounts(stations: StationFile | null, p: string): boolean {
  return !stations || stations.stations.some((q) => (q.target[p] ?? 0) > 0 && !q.derived?.includes(p));
}

export function readStations(root: string, area: string): StationFile | null {
  const p = join(root, `data/demand/${area}.stations.json`);
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null;
}

/** The arguments tools/assess.ts gives `calibrate` for one period (a test keeps this in step with it). */
export function calibrateArgs(o: { area: string; period: string; minutes: number; seeds: string; jobs: string; keep: string; out: string; demand?: string }): string[] {
  return ['--area', o.area, '--period', o.period, '--minutes', String(o.minutes), '--scale', '1', '--seeds', o.seeds, '--jobs', o.jobs, '--keep-seeds', o.keep, '--out', o.out, ...(o.demand ? ['--demand', o.demand] : [])];
}

export function expectedFromManifest(m: InputsManifest, view: View): ExpectedInputs {
  const file = (role: string) => m.files.find((f) => f.role === role)?.sha256 ?? null;
  return { network: file('network'), demand: view === 'cv' ? file('cv-demand') : file('demand'), targets: m.git.targets, stations: m.git.stations, split: m.git.split, demandConfig: m.git.demandConfig, areaConfig: m.git.areaConfig, groups: m.git.groups };
}

export interface ShardEntry { view: View; period: string; seed: number; name: string; key: string; sha256: string; size: number }
export interface AssessIndex { schema: 1; kind: 'assess'; job: string; shard: string; area: string; view: View; periods: string[]; seeds: number[]; minutes: number; complete: boolean; fingerprint: string; updatedAt: string; files: ShardEntry[] }
const indexKey = (job: string, shard: string) => jobKey(job, 'assess', checkName('shard name', shard), 'index.json');

const short = (x: string | null | undefined) => (x ? x.slice(0, 12) : 'none');

/** What is wrong with one seed report against the job, in words that name the run. */
export function reportProblems(label: string, r: { manifest?: RunManifest | null }, m: InputsManifest, view: View, want: { area: string; period: string; seed: number; minutes: number }): string[] {
  const mf = r.manifest;
  if (!mf) return [`${label}: the report has no manifest`];
  const out: string[] = [];
  if (mf.simulator.fingerprint !== m.simulator.fingerprint) out.push(`${label}: made by simulator ${short(mf.simulator.fingerprint)}, the job expects ${short(m.simulator.fingerprint)}`);
  const exp = expectedFromManifest(m, view);
  for (const k of Object.keys(exp) as (keyof ExpectedInputs)[]) {
    const have = mf.inputs[k]?.sha256 ?? null;
    if (have !== exp[k]) out.push(`${label}: the ${k} input is ${short(have)}, the job has ${short(exp[k])}`);
  }
  const run = mf.run;
  if (run.area !== want.area || run.period !== want.period || run.seed !== want.seed || run.minutes !== want.minutes || run.scale !== 1) out.push(`${label}: the report is for ${run.area} ${run.period} seed ${run.seed}, ${run.minutes} minutes at scale ${run.scale}, not ${want.area} ${want.period} seed ${want.seed}, ${want.minutes} minutes at scale 1`);
  return out;
}

export interface AssessRunOptions { job: string; shard: string; periods: string[]; seedSpec: string; view: View; minutes: number; jobs: string; fresh: boolean }

export async function assessRun(ctx: Ctx, o: AssessRunOptions): Promise<AssessIndex> {
  const { root, area, store, log } = ctx;
  const m = await loadManifest(store, o.job);
  if (m.area !== area) throw new Error(`job ${o.job} is for area ${m.area}, not ${area}`);
  const bad = verifyLocal(ctx, m);
  if (bad.length) throw new Error(`this checkout does not match job ${o.job}:\n  - ${bad.join('\n  - ')}`);
  const seeds = parseSeeds(o.seedSpec);
  const cvFile = m.files.find((f) => f.role === 'cv-demand');
  if (o.view === 'cv' && !cvFile) throw new Error(`job ${o.job} has no cross-validation demand (it was pushed with --for explore, or the demand config names none)`);
  const bin = ctx.env.CALIBRATE_BIN ? resolve(ctx.env.CALIBRATE_BIN) : join(root, 'target/release/calibrate');
  if (!existsSync(bin)) throw new Error(`${bin} is not built; run: cargo build --release -p traffic-sim --bins`);
  const stations = readStations(root, area);
  const periods = o.periods.filter((p) => o.view === 'shipped' || periodHasCounts(stations, p));
  const skipped = o.periods.filter((p) => !periods.includes(p));
  if (skipped.length) log(`skipping ${skipped.join(', ')} for the cross-validation view: no counts of its own, as in tools/assess.ts`);
  if (!periods.length) throw new Error('nothing to run: no period of the request has counts for the cross-validation view');
  const work = join(root, 'target/shard', o.job, o.shard, o.view);
  if (o.fresh) rmSync(work, { recursive: true, force: true });
  mkdirSync(work, { recursive: true });
  const expected = expectedFromManifest(m, o.view);
  const entries: ShardEntry[] = [];
  const index = (complete: boolean): AssessIndex => ({ schema: 1, kind: 'assess', job: o.job, shard: o.shard, area, view: o.view, periods, seeds, minutes: o.minutes, complete, fingerprint: m.simulator.fingerprint, updatedAt: new Date().toISOString(), files: entries });
  const check = (p: string) => {
    const found = readRuns(work, area, p, seeds);
    const set = checkRunSet(`${p}, ${o.view} demand`, seeds, found, expected);
    const per = found.flatMap((f) => (f.manifest ? reportProblems(`${p} seed ${f.seed}`, f, m, o.view, { area, period: p, seed: f.seed, minutes: o.minutes }) : []));
    return { found, problems: [...set.problems, ...per] };
  };
  for (const p of periods) {
    let c = o.fresh ? null : check(p);
    if (c && !c.problems.length) log(`${o.view} ${p}: ${seeds.length} seed report(s) already here and valid, not run again`);
    else {
      log(`${o.view} ${p}: running seeds ${o.seedSpec}`);
      const args = calibrateArgs({ area, period: p, minutes: o.minutes, seeds: o.seedSpec, jobs: o.jobs, keep: work, out: join(work, 'summary'), demand: cvFile ? (o.view === 'cv' ? join(root, cvFile.path) : undefined) : undefined });
      const r = spawnSync(bin, args, { cwd: root, env: ctx.env, stdio: ['ignore', 'ignore', 'inherit'] });
      if (r.status !== 0) throw new Error(`calibrate failed for ${p} (${o.view}), exit ${r.status}`);
      c = check(p);
      if (c.problems.length) throw new Error(`the ${p} reports do not match the job; nothing from them was uploaded:\n  - ${c.problems.join('\n  - ')}`);
    }
    for (const f of c.found) {
      const data = readFileSync(join(work, f.file));
      const key = jobKey(o.job, 'assess', o.shard, o.view, f.file);
      await store.put(key, data, 'application/json; charset=utf-8');
      entries.push({ view: o.view, period: p, seed: f.seed, name: f.file, key, sha256: sha256(data), size: data.length });
    }
    await putJson(store, indexKey(o.job, o.shard), index(p === periods[periods.length - 1]));
    log(`${o.view} ${p}: uploaded ${c.found.length} report(s)`);
  }
  log(`shard ${o.shard}: complete (${entries.length} reports)`);
  return index(true);
}

export interface FetchOptions { job: string; shards: string[]; periods: string[]; seedSpec: string; views: View[]; minutes: number; dest: string; force: boolean }

export async function assessFetch(ctx: Ctx, o: FetchOptions): Promise<{ dest: string; destCv: string | null; runs: number }> {
  const { root, area, store, log } = ctx;
  const m = await loadManifest(store, o.job);
  if (m.area !== area) throw new Error(`job ${o.job} is for area ${m.area}, not ${area}`);
  const seeds = parseSeeds(o.seedSpec);
  const stations = readStations(root, area);
  const problems: string[] = [];
  const dests = { shipped: o.dest, cv: `${o.dest}-cv` };
  for (const v of o.views) if (existsSync(dests[v]) && readdirSync(dests[v]).length && !o.force) problems.push(`${dests[v]} already exists and is not empty (give --force to replace it, or --dest elsewhere)`);

  const want: { view: View; period: string; seed: number }[] = [];
  for (const view of o.views) for (const period of o.periods) if (view === 'shipped' || periodHasCounts(stations, period)) for (const seed of seeds) want.push({ view, period, seed });
  const wantKey = (x: { view: string; period: string; seed: number }) => `${x.view} ${x.period} seed ${x.seed}`;
  const wanted = new Set(want.map(wantKey));

  const found = new Map<string, { shard: string; entry: ShardEntry }[]>();
  for (const shard of o.shards) {
    const idx = await getJson<AssessIndex>(store, indexKey(o.job, shard));
    if (!idx) { problems.push(`shard ${shard}: no index in the bucket (it has not uploaded anything yet)`); continue; }
    if (idx.kind !== 'assess' || idx.job !== o.job || idx.shard !== shard) problems.push(`shard ${shard}: the index belongs to ${idx.kind} shard ${idx.shard} of job ${idx.job}`);
    if (!idx.complete) problems.push(`shard ${shard}: not complete (${idx.files.length} report(s) uploaded so far; it is still running or it stopped)`);
    if (idx.fingerprint !== m.simulator.fingerprint) problems.push(`shard ${shard}: ran on simulator ${short(idx.fingerprint)}, the job expects ${short(m.simulator.fingerprint)}`);
    if (idx.minutes !== o.minutes) problems.push(`shard ${shard}: ${idx.minutes}-minute runs, the request is ${o.minutes}`);
    for (const e of idx.files) { const k = wantKey(e); (found.get(k) ?? found.set(k, []).get(k)!).push({ shard, entry: e }); }
  }
  const dup = [...found].filter(([, v]) => v.length > 1).map(([k, v]) => `${k} is in shards ${v.map((x) => x.shard).join(' and ')}`);
  const extra = [...found.keys()].filter((k) => !wanted.has(k));
  const missing = want.filter((x) => !found.has(wantKey(x)));
  if (dup.length) problems.push(`runs present more than once: ${dup.join('; ')}`);
  if (extra.length) problems.push(`runs outside the request: ${extra.join('; ')}`);
  if (missing.length) problems.push(`${missing.length} of ${want.length} runs missing: ${groupMissing(missing)}`);
  if (problems.length) throw new Error(`cannot merge job ${o.job}:\n  - ${problems.join('\n  - ')}`);

  const staging = { shipped: `${dests.shipped}.partial`, cv: `${dests.cv}.partial` };
  for (const v of o.views) { rmSync(staging[v], { recursive: true, force: true }); mkdirSync(staging[v], { recursive: true }); }
  const manifests = new Map<string, RunManifest>();
  for (const x of want) {
    const { shard, entry } = found.get(wantKey(x))![0];
    const label = `shard ${shard}, ${wantKey(x)}`;
    const data = await store.get(entry.key);
    if (!data) { problems.push(`${label}: ${entry.key} is not in the bucket`); continue; }
    if (sha256(data) !== entry.sha256) { problems.push(`${label}: the download does not match the hash in the shard's index`); continue; }
    let report: { manifest?: RunManifest | null };
    try { report = JSON.parse(data.toString('utf8')); } catch { problems.push(`${label}: not valid JSON`); continue; }
    problems.push(...reportProblems(label, report, m, x.view, { area, period: x.period, seed: x.seed, minutes: o.minutes }));
    if (entry.name !== seedFileName(area, x.period, 1, x.seed)) problems.push(`${label}: file name ${entry.name} is not the one the assessment reads`);
    if (report.manifest) manifests.set(wantKey(x), report.manifest);
    writeFileAtomic(join(staging[x.view], entry.name), data);
  }
  if (!problems.length) {
    for (const view of o.views) for (const period of o.periods) {
      if (view === 'cv' && !periodHasCounts(stations, period)) continue;
      const set = checkRunSet(`${period}, ${view} demand`, seeds, readRuns(staging[view], area, period, seeds), expectedFromManifest(m, view));
      problems.push(...set.problems);
    }
    for (const period of o.periods) if (o.views.length === 2 && periodHasCounts(stations, period)) problems.push(...checkPair(manifests.get(`shipped ${period} seed ${seeds[0]}`) ?? null, manifests.get(`cv ${period} seed ${seeds[0]}`) ?? null, m.git.split));
  }
  if (problems.length) {
    for (const v of o.views) rmSync(staging[v], { recursive: true, force: true });
    throw new Error(`cannot merge job ${o.job}; nothing was written:\n  - ${problems.join('\n  - ')}`);
  }
  for (const v of o.views) { rmSync(dests[v], { recursive: true, force: true }); renameSync(staging[v], dests[v]); }
  log(`job ${o.job}: ${want.length} runs from ${o.shards.length} shard(s) in ${o.dest}${o.views.includes('cv') ? ` and ${o.dest}-cv` : ''}, all on simulator ${short(m.simulator.fingerprint)}`);
  return { dest: o.dest, destCv: o.views.includes('cv') ? `${o.dest}-cv` : null, runs: want.length };
}

function groupMissing(missing: { view: string; period: string; seed: number }[]): string {
  const g = new Map<string, number[]>();
  for (const x of missing) (g.get(`${x.view} ${x.period}`) ?? g.set(`${x.view} ${x.period}`, []).get(`${x.view} ${x.period}`)!).push(x.seed);
  return [...g].map(([k, s]) => `${k} seeds ${s.join(',')}`).join('; ');
}
