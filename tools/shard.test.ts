import { withheldDigest } from './lib/lineage';
import { spawn, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { startStubSite, type StubSite } from './fixtures/stub-site';
import { assessFetch, assessRun, calibrateArgs, parseSeeds, periodHasCounts, readStations } from './lib/shard-assess';
import { benchmarkFetch, benchmarkRun } from './lib/shard-benchmark';
import { argValue, checkExploreArgs, exploreFetch, exploreRun, mergeGroups, mergeReports, prettyJson, producedIds, type Group } from './lib/shard-explore';
import { GIT_INPUTS, loadManifest, pullInputs, pushInputs, verifyLocal, type Ctx } from './lib/shard-inputs';
import { checkName, httpStore, jobKey, sha256 } from './lib/shard-store';

const repo = resolve(import.meta.dirname, '..');
const fx = (f: string) => join(repo, 'tools/fixtures', f);
const temps: string[] = [];
let site: StubSite;
beforeAll(async () => { site = await startStubSite(); });
afterAll(async () => { await site.close(); for (const t of temps) rmSync(t, { recursive: true, force: true }); });

const GIT_FILES = ['data/calibration/rockridge.targets.json', 'data/demand/rockridge.stations.json', 'data/demand/rockridge.config.json', 'data/areas/rockridge.json', 'data/proposals/rockridge.references.json', 'data/proposals/rockridge.seeds.json', 'data/calibration/rockridge.volunteer-count-2025-02-25.json'];
const put = (root: string, rel: string, text: string) => { mkdirSync(dirname(join(root, rel)), { recursive: true }); writeFileSync(join(root, rel), text); };
const NET = '{"links":[],"nodes":[]}';
const FP = 'a'.repeat(32);
const env = (over: Record<string, string> = {}): NodeJS.ProcessEnv => ({ ...process.env, SHARD_FINGERPRINT_BIN: fx('stub-fingerprint.mjs'), CALIBRATE_BIN: fx('stub-calibrate.mjs'), EXPLORE_BIN: fx('stub-explore.mjs'), BENCH_BIN: fx('stub-search-bench.mjs'), STUB_FINGERPRINT: FP, ...over });
const ctx = (root: string, e = env()): Ctx => ({ root, area: 'rockridge', store: httpStore(site.url, 'dummy-token', { retries: 1, delayMs: 1 }), log: () => {}, env: e });

/** A repository root with the git-tracked inputs; the lead's also has the files that are not in git. */
function makeRoot(lead: boolean): string {
  const root = mkdtempSync(join(tmpdir(), 'shard-'));
  temps.push(root);
  for (const f of GIT_FILES) { mkdirSync(dirname(join(root, f)), { recursive: true }); cpSync(join(repo, f), join(root, f)); }
  put(root, 'data/demand/rockridge.split.json', '{"version":1}\n');
  if (lead) {
    const split = sha256(readFileSync(join(root, 'data/demand/rockridge.split.json')));
    put(root, 'public/data/rockridge.network.json', NET);
    const sources = { split, network: sha256(Buffer.from(NET)), config: sha256(readFileSync(join(root, 'data/demand/rockridge.config.json'))), countFile: sha256(readFileSync(join(root, 'data/calibration/rockridge.volunteer-count-2025-02-25.json'))) };
    put(root, 'public/data/rockridge.demand.json', JSON.stringify({ periods: [], build: { view: 'shipped', ...sources } }));
    put(root, 'target/validation/rockridge.demand.json', JSON.stringify({ periods: [], build: { view: 'training', ...sources, withheld: withheldDigest({ groups: [], withheldAggregates: [] } as never) } }));
    put(root, 'public/data/areas.json', '[]');
  }
  return root;
}
/** Runs a command without blocking this process, whose event loop serves the stub site. */
const exec = (args: string[], e: NodeJS.ProcessEnv): Promise<{ status: number | null; stdout: string; stderr: string }> => new Promise((ok) => {
  const p = spawn(process.execPath, ['--import', 'tsx', ...args], { cwd: repo, env: e });
  let stdout = '', stderr = '';
  p.stdout.on('data', (d) => (stdout += d));
  p.stderr.on('data', (d) => (stderr += d));
  p.on('close', (status) => ok({ status, stdout, stderr }));
});
const copyGit = (from: string, to: string) => { for (const f of [...GIT_FILES, 'data/demand/rockridge.split.json']) cpSync(join(from, f), join(to, f)); };

describe('names and the store', () => {
  it('accepts plain names and rejects the rest', () => {
    expect(checkName('job id', 'round-1.a_b')).toBe('round-1.a_b');
    for (const bad of ['', '-x', 'a/b', 'a b', 'a..b', 'x'.repeat(49), undefined]) expect(() => checkName('job id', bad)).toThrow(/job id/);
    expect(jobKey('j1', 'inputs.json')).toBe('jobs/j1/inputs.json');
  });
  it('puts, gets, reports a missing key as null and retries a server error', async () => {
    const s = httpStore(site.url, 'dummy-token', { retries: 2, delayMs: 1 });
    await s.put('jobs/t/a.json', Buffer.from('{"a":1}'), 'application/json');
    expect((await s.get('jobs/t/a.json'))?.toString()).toBe('{"a":1}');
    expect(await s.get('jobs/t/none.json')).toBeNull();
    site.failNext.n = 2;
    expect((await s.get('jobs/t/a.json'))?.toString()).toBe('{"a":1}');
  });
  it('fails on a wrong token and on a key outside the allowed prefixes, without retrying a 4xx', async () => {
    const before = site.requests.length;
    await expect(httpStore(site.url, 'wrong', { retries: 3, delayMs: 1 }).put('jobs/t/b.json', Buffer.from('x'))).rejects.toThrow(/HTTP 401/);
    await expect(httpStore(site.url, 'dummy-token', { retries: 3, delayMs: 1 }).put('other/b.json', Buffer.from('x'))).rejects.toThrow(/HTTP 400/);
    expect(site.requests.length - before).toBe(2);
    expect(() => httpStore(undefined, 'x')).toThrow(/TRAFFIC_UPLOAD_URL/);
  });
});

describe('seed runs: arguments and slices', () => {
  it('passes calibrate the arguments tools/assess.ts passes', () => {
    const src = readFileSync(join(repo, 'tools/assess.ts'), 'utf8');
    expect(src).toContain("['--area', area, '--period', p, '--minutes', String(minutes), '--scale', '1', '--seeds', seedSpec, '--jobs', jobs, '--keep-seeds', keep, '--out', summaryDir, ...(demandPath ? ['--demand', demandPath] : [])]");
    expect(src).toContain("['--area', area, '--period', p, '--minutes', String(minutes), '--scale', '1', '--seeds', seedSpec, '--jobs', jobs, '--keep-seeds', keepCv, '--out', join(keepCv, 'summary'), '--demand', cvPath]");
    expect(calibrateArgs({ area: 'a', period: 'p', minutes: 60, seeds: '1-3', jobs: '4', keep: 'k', out: 'o' })).toEqual(['--area', 'a', '--period', 'p', '--minutes', '60', '--scale', '1', '--seeds', '1-3', '--jobs', '4', '--keep-seeds', 'k', '--out', 'o']);
    expect(calibrateArgs({ area: 'a', period: 'p', minutes: 60, seeds: '1', jobs: '4', keep: 'k', out: 'o', demand: 'd' }).slice(-2)).toEqual(['--demand', 'd']);
  });
  it('reads seed lists as the assessment does and rejects bad ones', () => {
    expect(parseSeeds('1-3,7')).toEqual([1, 2, 3, 7]);
    for (const bad of ['', 'a', '1-', '2,2', '1-3,3']) expect(() => parseSeeds(bad)).toThrow();
  });
  it('knows which periods have counts of their own', () => {
    const st = readStations(repo, 'rockridge');
    expect(periodHasCounts(st, 'pm_peak')).toBe(true);
    expect(periodHasCounts(st, 'midday')).toBe(false);
    expect(periodHasCounts(null, 'midday')).toBe(true);
  });
});

describe('inputs', () => {
  it('pushes once, pulls into a fresh clone and checks hashes and the fingerprint', async () => {
    const lead = makeRoot(true), child = makeRoot(false);
    copyGit(lead, child);
    const m = await pushInputs(ctx(lead), { job: 'in1', only: 'all', allowDirty: false, replace: false });
    expect(m.simulator.fingerprint).toBe(FP);
    expect(m.files.map((f) => f.role).sort()).toEqual(['areas', 'cv-demand', 'demand', 'network']);
    expect([...site.store.keys()].filter((k) => k.startsWith('jobs/in1/')).sort()).toEqual(['jobs/in1/inputs.json', ...m.files.map((f) => f.key)].sort());
    await expect(pushInputs(ctx(lead), { job: 'in1', only: 'all', allowDirty: false, replace: false })).rejects.toThrow(/already has inputs/);
    await pullInputs(ctx(child), { job: 'in1', force: false });
    for (const f of m.files) expect(readFileSync(join(child, f.path))).toEqual(readFileSync(join(lead, f.path)));
    expect(verifyLocal(ctx(child), await loadManifest(ctx(child).store, 'in1'))).toEqual([]);
  });

  it('fails when the build has another fingerprint, naming both', async () => {
    const lead = makeRoot(true), child = makeRoot(false);
    copyGit(lead, child);
    await pushInputs(ctx(lead), { job: 'in2', only: 'all', allowDirty: false, replace: false });
    await expect(pullInputs(ctx(child, env({ STUB_FINGERPRINT: 'b'.repeat(32) })), { job: 'in2', force: false })).rejects.toThrow(/fingerprint is bbbbbbbbbbbb, the job expects aaaaaaaaaaaa/);
    expect(existsSync(join(child, 'public/data/rockridge.network.json'))).toBe(false);
  });

  it('fails when a git-tracked input differs, and when a download is corrupt', async () => {
    const lead = makeRoot(true), child = makeRoot(false);
    copyGit(lead, child);
    await pushInputs(ctx(lead), { job: 'in3', only: 'all', allowDirty: false, replace: false });
    put(child, GIT_INPUTS('rockridge').targets, '{"changed":true}');
    await expect(pullInputs(ctx(child), { job: 'in3', force: false })).rejects.toThrow(/targets.json differs from the lead's/);
    copyGit(lead, child);
    site.store.set('jobs/in3/inputs/public/data/rockridge.network.json', { body: Buffer.from('tampered'), type: 'application/json' });
    await expect(pullInputs(ctx(child), { job: 'in3', force: false })).rejects.toThrow(/rockridge.network.json: the download has hash/);
    expect(existsSync(join(child, 'public/data/rockridge.network.json'))).toBe(false);
  });

  it('does not replace a differing local file without --force', async () => {
    const lead = makeRoot(true);
    await pushInputs(ctx(lead), { job: 'in4', only: 'assess', allowDirty: false, replace: false });
    put(lead, 'public/data/rockridge.network.json', '{"links":[],"nodes":[1]}');
    await expect(pullInputs(ctx(lead), { job: 'in4', force: false })).rejects.toThrow(/would be replaced: public\/data\/rockridge.network.json/);
    await pullInputs(ctx(lead), { job: 'in4', force: true });
    expect(readFileSync(join(lead, 'public/data/rockridge.network.json'), 'utf8')).toBe(NET);
  });

  it('stops a push with a missing input and leaves no manifest', async () => {
    const lead = makeRoot(true);
    rmSync(join(lead, 'public/data/rockridge.demand.json'));
    await expect(pushInputs(ctx(lead), { job: 'in5', only: 'all', allowDirty: false, replace: false })).rejects.toThrow(/missing input files: public\/data\/rockridge.demand.json/);
    expect(site.store.has('jobs/in5/inputs.json')).toBe(false);
  });
});

describe('assessment shards', () => {
  const periods = ['pm_peak', 'midday'];
  const run = (c: Ctx, job: string, shard: string, view: 'shipped' | 'cv', seedSpec: string, fresh = false) => assessRun(c, { job, shard, periods, seedSpec, view, minutes: 60, jobs: '4', fresh });
  async function setup(job: string) {
    const lead = makeRoot(true), child = makeRoot(false);
    copyGit(lead, child);
    await pushInputs(ctx(lead), { job, only: 'all', allowDirty: false, replace: false });
    await pullInputs(ctx(child), { job, force: false });
    return { lead, child };
  }
  const fetchAll = (lead: Ctx, job: string, shards: string[], over: Partial<Parameters<typeof assessFetch>[1]> = {}) => assessFetch(lead, { job, shards, periods, seedSpec: '1-10', views: ['shipped', 'cv'], minutes: 60, dest: join(lead.root, 'target/assess-seeds/merged'), force: false, ...over });

  it('runs slices, merges them, and the assessment accepts the directory', async () => {
    const { lead, child } = await setup('as1');
    const c = ctx(child);
    await run(c, 'as1', 's1', 'shipped', '1-5');
    await run(c, 'as1', 's2', 'shipped', '6-10');
    const cvIndex = await run(c, 'as1', 's3', 'cv', '1-10');
    expect(cvIndex.files.map((f) => f.period)).toEqual(Array(10).fill('pm_peak'));
    expect(cvIndex.complete).toBe(true);
    const r = await fetchAll(ctx(lead), 'as1', ['s1', 's2', 's3']);
    expect(r.runs).toBe(30);
    const collector = makeRoot(false);
    await expect(fetchAll(ctx(collector), 'as1', ['s1', 's2', 's3'])).resolves.toMatchObject({ runs: 30 });
    expect(existsSync(join(collector, 'public/data/rockridge.demand.json'))).toBe(false);
    const dir = join(lead, 'target/assess-seeds/merged');
    expect(readdirSync(dir).sort()).toHaveLength(20);
    expect(readdirSync(`${dir}-cv`)).toHaveLength(10);
    const a = spawnSync(process.execPath, ['--import', 'tsx', join(repo, 'tools/assess.ts'), '--root', lead, '--periods', periods.join(','), '--reuse', dir, '--suffix', 'merged'], { cwd: repo, encoding: 'utf8', env: env(), maxBuffer: 16 * 1024 * 1024 });
    expect(a.stderr).toBe('');
    expect(a.status).toBe(0);
    expect(existsSync(join(lead, 'data/calibration/rockridge.assessment-merged.md'))).toBe(true);
  }, 120000);

  it('does not run again what is already here and valid, and uploads again', async () => {
    const { child } = await setup('as2');
    const c = ctx(child);
    await run(c, 'as2', 's1', 'shipped', '1-2');
    const seed1 = join(child, 'target/shard/as2/s1/shipped/rockridge-pm_peak-s1-seed1.json');
    const before = readFileSync(seed1, 'utf8');
    writeFileSync(seed1, before.replace('"completed":900', '"completed":901'));
    await run(c, 'as2', 's1', 'shipped', '1-2');
    expect(readFileSync(seed1, 'utf8')).toContain('"completed":901');
    await run(c, 'as2', 's1', 'shipped', '1-2', true);
    expect(readFileSync(seed1, 'utf8')).toContain('"completed":900');
  });

  it('refuses to upload reports made by another simulator', async () => {
    const { child } = await setup('as3');
    const c = ctx(child);
    await expect(run({ ...c, env: { ...c.env, STUB_FINGERPRINT: FP, CALIBRATE_BIN: fx('stub-calibrate.mjs') } }, 'as3', 's1', 'shipped', '1')).resolves.toBeTruthy();
    const other = { ...c, env: { ...c.env, STUB_FINGERPRINT: FP } };
    const bad = { ...other, env: { ...other.env, CALIBRATE_BIN: join(repo, 'tools/fixtures/stub-calibrate.mjs') } };
    // The build check passes (fingerprint binary agrees) but calibrate reports another simulator: stop before uploading.
    const wrapper = mkdtempSync(join(tmpdir(), 'shard-wrap-'));
    temps.push(wrapper);
    writeFileSync(join(wrapper, 'cal.sh'), `#!/bin/sh\nSTUB_FINGERPRINT=${'c'.repeat(32)} exec ${fx('stub-calibrate.mjs')} "$@"\n`, { mode: 0o755 });
    await expect(run({ ...bad, env: { ...bad.env, CALIBRATE_BIN: join(wrapper, 'cal.sh') } }, 'as3', 's9', 'shipped', '1', true)).rejects.toThrow(/made by simulator cccccccccccc, the job expects aaaaaaaaaaaa/);
    expect([...site.store.keys()].some((k) => k.startsWith('jobs/as3/assess/s9/'))).toBe(false);
  });

  it('names a missing shard, an incomplete one, a repeated run and a run outside the request', async () => {
    const { lead, child } = await setup('as4');
    const c = ctx(child);
    await run(c, 'as4', 's1', 'shipped', '1-10');
    await run(c, 'as4', 's2', 'shipped', '1-2');
    await run(c, 'as4', 's3', 'shipped', '11');
    await expect(fetchAll(ctx(lead), 'as4', ['s1', 's2', 's3', 's4'])).rejects.toThrow(/shard s4: no index[\s\S]*more than once: shipped pm_peak seed 1 is in shards s1 and s2[\s\S]*outside the request: shipped pm_peak seed 11[\s\S]*cv pm_peak seeds 1,2,3,4,5,6,7,8,9,10/);
    const idx = JSON.parse(site.store.get('jobs/as4/assess/s1/index.json')!.body.toString());
    site.store.set('jobs/as4/assess/s1/index.json', { body: Buffer.from(JSON.stringify({ ...idx, complete: false })), type: 'application/json' });
    await expect(fetchAll(ctx(lead), 'as4', ['s1'])).rejects.toThrow(/shard s1: not complete/);
    expect(existsSync(join(lead, 'target/assess-seeds/merged'))).toBe(false);
  });

  it('refuses a shard whose report came from another simulator or other inputs, and writes nothing', async () => {
    const { lead, child } = await setup('as5');
    const c = ctx(child);
    await run(c, 'as5', 's1', 'shipped', '1-10');
    await run(c, 'as5', 's2', 'cv', '1-10');
    const key = 'jobs/as5/assess/s1/shipped/rockridge-pm_peak-s1-seed4.json';
    const report = JSON.parse(site.store.get(key)!.body.toString());
    report.manifest.simulator.fingerprint = 'd'.repeat(32);
    report.manifest.inputs.demand.sha256 = 'e'.repeat(64);
    const body = Buffer.from(JSON.stringify(report));
    site.store.set(key, { body, type: 'application/json' });
    const idx = JSON.parse(site.store.get('jobs/as5/assess/s1/index.json')!.body.toString());
    idx.files.find((f: { key: string }) => f.key === key).sha256 = sha256(body);
    site.store.set('jobs/as5/assess/s1/index.json', { body: Buffer.from(JSON.stringify(idx)), type: 'application/json' });
    const err = await fetchAll(ctx(lead), 'as5', ['s1', 's2']).catch((e: Error) => e.message);
    expect(err).toMatch(/shard s1, shipped pm_peak seed 4: made by simulator dddddddddddd, the job expects aaaaaaaaaaaa/);
    expect(err).toMatch(/shard s1, shipped pm_peak seed 4: the demand input is eeeeeeeeeeee/);
    expect(existsSync(join(lead, 'target/assess-seeds/merged'))).toBe(false);
    expect(existsSync(join(lead, 'target/assess-seeds/merged.partial'))).toBe(false);
  });

  it('catches a report changed in the bucket after the shard indexed it', async () => {
    const { lead, child } = await setup('as6');
    await run(ctx(child), 'as6', 's1', 'shipped', '1-10');
    site.store.set('jobs/as6/assess/s1/shipped/rockridge-pm_peak-s1-seed2.json', { body: Buffer.from('{}'), type: 'application/json' });
    await expect(fetchAll(ctx(lead), 'as6', ['s1'], { views: ['shipped'] })).rejects.toThrow(/seed 2: the download does not match the hash/);
  });
});

describe('proposal shards', () => {
  const eargs = (profile?: string) => ['--area', 'rockridge', '--periods', 'pm_peak', ...(profile ? ['--profile', profile] : []), '--confirm-seeds', '101-110'];
  async function setup(job: string) {
    const lead = makeRoot(true), child = makeRoot(false);
    put(lead, 'public/data/rockridge.proposals.json', JSON.stringify({ version: 4, area: 'rockridge', groups: [{ id: 'old', computed: { networkHash: 'x', demandHash: 'y', simulator: 'z', reportMethod: 'm0' }, proposals: [] }] }));
    copyGit(lead, child);
    await pushInputs(ctx(lead), { job, only: 'explore', allowDirty: false, replace: false });
    await pullInputs(ctx(child), { job, force: false });
    return { lead, child };
  }
  const merge = (lead: string, job: string, shards: string[], o: { seeds?: boolean; report?: boolean } = {}) => exploreFetch(ctx(lead), { job, shards, out: 'public/data/rockridge.proposals.json', seeds: o.seeds ?? true, report: o.report ?? true });

  it('merges two profiles into the proposals file, report and seeds, keeping other groups', async () => {
    const { lead, child } = await setup('ex1');
    put(lead, 'data/proposals/rockridge.profiles.json', JSON.stringify([{ id: 'charter', title: 'c' }, { id: 'unconstrained', title: 'u' }]));
    const c = ctx(child);
    const a = await exploreRun(c, { job: 'ex1', shard: 'charter', args: eargs('charter') });
    expect(a.groups).toEqual(['charter']);
    const b = await exploreRun(c, { job: 'ex1', shard: 'free', args: eargs() });
    expect(b.groups).toEqual(['unconstrained']);
    expect(readFileSync(join(child, 'data/proposals/rockridge.seeds.json'))).toEqual(readFileSync(join(repo, 'data/proposals/rockridge.seeds.json')));
    expect(readFileSync(join(child, 'public/data/rockridge.proposals.json'), 'utf8')).toContain('"old"');
    expect(JSON.parse(readFileSync(join(child, 'public/data/rockridge.proposals.json'), 'utf8')).groups).toHaveLength(1);
    const r = await merge(lead, 'ex1', ['charter', 'free']);
    expect(r.groups).toEqual(['charter', 'unconstrained']);
    const file = JSON.parse(readFileSync(join(lead, 'public/data/rockridge.proposals.json'), 'utf8'));
    expect(file.version).toBe(5);
    expect(file.area).toBe('rockridge');
    expect(file.groups.map((g: Group) => g.id)).toEqual(['charter', 'unconstrained', 'old']);
    const report = readFileSync(join(lead, 'data/proposals/rockridge.md'), 'utf8');
    expect(report).toMatch(/^# Proposals report: rockridge\n\n<!-- profile:charter -->[\s\S]*<!-- profile:unconstrained -->/);
    const seeds = JSON.parse(readFileSync(join(lead, 'data/proposals/rockridge.seeds.json'), 'utf8'));
    expect(seeds.seeds.map((s: { group: string }) => s.group)).toEqual(expect.arrayContaining(['charter', 'unconstrained']));
    const again = await merge(lead, 'ex1', ['charter', 'free']);
    expect(again.groups).toHaveLength(2);
    expect(JSON.parse(readFileSync(join(lead, 'public/data/rockridge.proposals.json'), 'utf8')).groups).toHaveLength(3);
  });

  it('a search without --profile is the whole list: it replaces the groups of an older file and its report', async () => {
    const { lead, child } = await setup('ex5');
    await exploreRun(ctx(child), { job: 'ex5', shard: 'one', args: eargs() });
    const r = await merge(lead, 'ex5', ['one']);
    expect(r.groups).toEqual(['unconstrained']);
    const file = JSON.parse(readFileSync(join(lead, 'public/data/rockridge.proposals.json'), 'utf8'));
    expect(file.groups.map((g: Group) => g.id)).toEqual(['unconstrained']);
    expect(readFileSync(join(lead, 'data/proposals/rockridge.md'), 'utf8')).not.toContain('profile:old');
  });

  it('refuses the same group from two shards before writing anything', async () => {
    const { lead, child } = await setup('ex2');
    await exploreRun(ctx(child), { job: 'ex2', shard: 'a', args: eargs('charter') });
    await exploreRun(ctx(child), { job: 'ex2', shard: 'b', args: eargs('charter') });
    const before = readFileSync(join(lead, 'public/data/rockridge.proposals.json'), 'utf8');
    await expect(merge(lead, 'ex2', ['a', 'b'])).rejects.toThrow(/group charter was produced by both shard a and shard b/);
    expect(readFileSync(join(lead, 'public/data/rockridge.proposals.json'), 'utf8')).toBe(before);
    expect(existsSync(join(lead, 'data/proposals/rockridge.md'))).toBe(false);
  });

  it('refuses a different reporting method, simulator or input between shards', async () => {
    const { lead, child } = await setup('ex3');
    await exploreRun(ctx(child), { job: 'ex3', shard: 'a', args: eargs('charter') });
    await exploreRun(ctx(child, env({ STUB_METHOD: 'm2' })), { job: 'ex3', shard: 'b', args: eargs() });
    await expect(merge(lead, 'ex3', ['a', 'b'])).rejects.toThrow(/groups differ in reportMethod: m1[\s\S]*m2/);
    const idx = JSON.parse(site.store.get('jobs/ex3/explore/a/index.json')!.body.toString());
    const file = JSON.parse(site.store.get('jobs/ex3/explore/a/proposals.json')!.body.toString());
    file.groups[0].computed.demandHash = '0123456789abcdef';
    const body = Buffer.from(JSON.stringify(file));
    site.store.set('jobs/ex3/explore/a/proposals.json', { body, type: 'application/json' });
    idx.files.find((f: { name: string }) => f.name === 'proposals.json').sha256 = sha256(body);
    site.store.set('jobs/ex3/explore/a/index.json', { body: Buffer.from(JSON.stringify(idx)), type: 'application/json' });
    await expect(merge(lead, 'ex3', ['a'])).rejects.toThrow(/shard a: group charter has demandHash 0123456789ab, the job has/);
  });

  it('stops a shard whose groups carry another simulator, and one asked to do more than search', async () => {
    const { child } = await setup('ex4');
    const wrapper = mkdtempSync(join(tmpdir(), 'shard-wrap-'));
    temps.push(wrapper);
    writeFileSync(join(wrapper, 'ex.sh'), `#!/bin/sh\nSTUB_FINGERPRINT=${'c'.repeat(32)} exec ${fx('stub-explore.mjs')} "$@"\n`, { mode: 0o755 });
    await expect(exploreRun(ctx(child, env({ EXPLORE_BIN: join(wrapper, 'ex.sh') })), { job: 'ex4', shard: 'a', args: eargs('charter') })).rejects.toThrow(/group charter has simulator cccccccccccc, the job has aaaaaaaaaaaa/);
    expect([...site.store.keys()].some((k) => k.startsWith('jobs/ex4/explore/a/'))).toBe(false);
    await expect(exploreRun(ctx(child), { job: 'ex4', shard: 'a', args: ['--annotate', '--out', 'x'] })).rejects.toThrow(/--annotate is not a search[\s\S]*--out is set by the shard tool/);
  });

  it('reads which groups an invocation writes', () => {
    const order = ['charter', 'unconstrained'];
    expect(producedIds(['--area', 'a'], order)).toEqual(['unconstrained']);
    expect(producedIds(['--profile', 'all'], order)).toEqual(order);
    expect(producedIds(['--profile', 'charter, x'], order)).toEqual(['charter', 'x']);
    expect(argValue(['--area', 'q'], '--area')).toBe('q');
    expect(checkExploreArgs(['--area', 'other'], 'rockridge')[0]).toMatch(/not the job's area/);
  });

  it('merges groups and report sections the way the search does', () => {
    const g = (id: string, n = 0): Group => ({ id, n });
    expect(mergeGroups([g('old'), g('unconstrained', 1)], [g('charter'), g('unconstrained', 2)], ['charter', 'unconstrained']).map((x) => [x.id, x.n])).toEqual([['charter', 0], ['unconstrained', 2], ['old', 0]]);
    const sec = (id: string, t: string) => `<!-- profile:${id} -->\n## ${id}\n\n${t}\n`;
    const existing = `# Proposals report: a\n\n${sec('unconstrained', 'old text')}\n${sec('other', 'keep')}`;
    const out = mergeReports(existing, [{ text: `# Proposals report: a\n\n${sec('charter', 'new')}\n${sec('unconstrained', 'newer')}`, ids: ['charter', 'unconstrained'] }], 'a', ['charter', 'unconstrained']);
    expect(out).toBe(`# Proposals report: a\n\n${sec('charter', 'new')}\n${sec('unconstrained', 'newer')}\n${sec('other', 'keep')}`);
    expect(() => mergeReports(null, [{ text: '', ids: ['x'] }], 'a', [])).toThrow(/no section for group x/);
  });

  it('writes number arrays on one line, as the search does', () => {
    expect(prettyJson({ a: [1, 2, 3], b: ['x'], c: [] })).toBe('{\n  "a": [1, 2, 3],\n  "b": [\n    "x"\n  ],\n  "c": []\n}\n');
  });
});

describe('command line', () => {
  it('reports a usage error and a missing site without a stack trace', async () => {
    const run = (args: string[], e: Record<string, string> = {}) => exec([join(repo, 'tools/shard.ts'), ...args], { ...process.env, TRAFFIC_UPLOAD_URL: '', ...e });
    const a = await run(['nonsense']);
    expect(a.status).toBe(1);
    expect(a.stderr).toMatch(/^shard: usage/);
    expect((await run(['inputs', 'push', '--job', 'x'])).stderr).toMatch(/TRAFFIC_UPLOAD_URL is not set/);
    expect((await run(['inputs', 'push'])).stderr).toMatch(/--job is required/);
    expect((await run(['assess', 'run', '--job', 'x', '--shard', 's', '--view', 'both', '--periods', 'p', '--seeds', '1'], { TRAFFIC_UPLOAD_URL: site.url })).stderr).toMatch(/--view is shipped or cv/);
  }, 30000);

  it('pushes, pulls and merges through the command line against the stub site', async () => {
    const lead = makeRoot(true), child = makeRoot(false);
    copyGit(lead, child);
    const e = { ...env(), TRAFFIC_UPLOAD_URL: site.url, TRAFFIC_UPLOAD_TOKEN: 'dummy-token' };
    const run = (root: string, args: string[]) => exec([join(repo, 'tools/shard.ts'), '--root', root, ...args], e);
    expect((await run(lead, ['inputs', 'push', '--job', 'cli1', '--for', 'assess'])).status).toBe(0);
    expect((await run(child, ['inputs', 'pull', '--job', 'cli1'])).status).toBe(0);
    expect((await run(child, ['inputs', 'verify', '--job', 'cli1'])).stdout).toMatch(/this checkout matches/);
    expect((await run(child, ['assess', 'run', '--job', 'cli1', '--shard', 'a', '--view', 'shipped', '--periods', 'pm_peak', '--seeds', '1-10'])).status).toBe(0);
    expect((await run(child, ['assess', 'run', '--job', 'cli1', '--shard', 'b', '--view', 'cv', '--periods', 'pm_peak', '--seeds', '1-10'])).status).toBe(0);
    const f = await run(lead, ['assess', 'fetch', '--job', 'cli1', '--shards', 'a,b', '--periods', 'pm_peak']);
    expect(f.stderr).toBe('');
    expect(f.stdout).toMatch(/20 runs are complete and consistent[\s\S]*npm run assess -- --area rockridge --periods pm_peak --seeds 1-10 --reuse target\/assess-seeds\/shard-cli1 --publish --noise/);
    expect(existsSync(join(lead, 'target/assess-seeds/shard-cli1-cv/rockridge-pm_peak-s1-seed10.json'))).toBe(true);
    const bad = await run(lead, ['assess', 'fetch', '--job', 'cli1', '--shards', 'a', '--periods', 'pm_peak', '--dest', 'target/other']);
    expect(bad.status).toBe(1);
    expect(bad.stderr).toMatch(/cv pm_peak seeds 1,2,3,4,5,6,7,8,9,10/);
  }, 60000);
});

describe('benchmark shards', () => {
  const CASE = 'data/search-benchmark/x.json';
  async function setup(job: string) {
    const lead = makeRoot(true), child = makeRoot(false);
    copyGit(lead, child);
    for (const r of [lead, child]) put(r, CASE, JSON.stringify({ id: 'x', area: 'rockridge' }));
    await pushInputs(ctx(lead), { job, only: 'explore', allowDirty: false, replace: false });
    await pullInputs(ctx(child), { job, force: false });
    return { lead, child };
  }

  it('runs a case, uploads its results and confirmation, and fetches them after checking', async () => {
    const { lead, child } = await setup('bm1');
    const idx = await benchmarkRun(ctx(child), { job: 'bm1', shard: 'c1', casePath: CASE, jobs: '2', confirm: true });
    expect(idx.files.map((f) => f.name)).toEqual(['x.results.json', 'x.confirm.json', 'x.confirm.shortlist.json']);
    const files = await benchmarkFetch(ctx(lead), { job: 'bm1', shards: ['c1'], dest: 'target/benchmark/bm1' });
    expect(files).toHaveLength(3);
    expect(existsSync(join(lead, 'target/benchmark/bm1/x.results.json'))).toBe(true);
  });

  it('refuses results from another simulator or a changed file, and writes nothing', async () => {
    const { lead, child } = await setup('bm2');
    const wrapper = mkdtempSync(join(tmpdir(), 'bench-'));
    temps.push(wrapper);
    writeFileSync(join(wrapper, 'b.sh'), `#!/bin/sh\nSTUB_FINGERPRINT=${'c'.repeat(32)} exec ${fx('stub-search-bench.mjs')} "$@"\n`, { mode: 0o755 });
    await expect(benchmarkRun(ctx(child, env({ BENCH_BIN: join(wrapper, 'b.sh') })), { job: 'bm2', shard: 'c1', casePath: CASE, jobs: '2', confirm: false })).rejects.toThrow(/simulator cccccccccccc, the job has aaaaaaaaaaaa/);
    expect([...site.store.keys()].some((k) => k.startsWith('jobs/bm2/benchmark/'))).toBe(false);
    await benchmarkRun(ctx(child), { job: 'bm2', shard: 'c1', casePath: CASE, jobs: '2', confirm: false });
    site.store.set('jobs/bm2/benchmark/c1/x.results.json', { body: Buffer.from('{}'), type: 'application/json' });
    await expect(benchmarkFetch(ctx(lead), { job: 'bm2', shards: ['c1'], dest: 'target/benchmark/bm2' })).rejects.toThrow(/does not match the hash in its index/);
    expect(existsSync(join(lead, 'target/benchmark/bm2'))).toBe(false);
  });
});
