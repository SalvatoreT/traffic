// Sharded proposal-search benchmark (change improve-proposal-search-coverage). `benchmarkRun` builds one case's table with `search_bench table`
// (resumable: the checkpoint stays in the shard's work directory), optionally runs the frozen confirmation, checks the results against the
// job and uploads them; `benchmarkFetch` downloads every shard's files, checks them against their index and the job, and writes them locally.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { writeFileAtomic } from './atomic';
import { loadManifest, verifyLocal, type Ctx, type InputsManifest } from './shard-inputs';
import { checkName, getJson, jobKey, putJson, sha256 } from './shard-store';

export interface BenchmarkIndex { schema: 1; kind: 'benchmark'; job: string; shard: string; area: string; caseId: string; caseSha256: string; confirm: boolean; complete: boolean; fingerprint: string; updatedAt: string; files: { name: string; key: string; sha256: string; size: number }[] }

const indexKey = (job: string, shard: string) => jobKey(job, 'benchmark', checkName('shard name', shard), 'index.json');
const short = (x: unknown) => String(x ?? 'none').slice(0, 12);

/** What a results or confirmation file's identity says that differs from the job: simulator, network and demand. */
export function identityProblems(label: string, identity: Record<string, unknown> | undefined, m: InputsManifest): string[] {
  if (!identity) return [`${label}: no identity`];
  const out: string[] = [];
  if (identity.simulator !== m.simulator.fingerprint) out.push(`${label}: simulator ${short(identity.simulator)}, the job has ${short(m.simulator.fingerprint)}`);
  const inputs = (identity.inputs ?? {}) as Record<string, string>;
  for (const role of ['network', 'demand'] as const) {
    const want = m.files.find((f) => f.role === role)?.sha256;
    if (inputs[role] !== want) out.push(`${label}: ${role} ${short(inputs[role])}, the job has ${short(want)}`);
  }
  return out;
}

export interface BenchmarkRunOptions { job: string; shard: string; casePath: string; jobs: string; confirm: boolean }

export async function benchmarkRun(ctx: Ctx, o: BenchmarkRunOptions): Promise<BenchmarkIndex> {
  const { root, area, store, log } = ctx;
  const m = await loadManifest(store, o.job);
  if (m.area !== area) throw new Error(`job ${o.job} is for area ${m.area}, not ${area}`);
  const bad = verifyLocal(ctx, m);
  if (bad.length) throw new Error(`this checkout does not match job ${o.job}:\n  - ${bad.join('\n  - ')}`);
  const bin = ctx.env.BENCH_BIN ? resolve(ctx.env.BENCH_BIN) : join(root, 'target/release/search_bench');
  if (!existsSync(bin)) throw new Error(`${bin} is not built; run: cargo build --release -p traffic-sim --bins`);
  const casePath = resolve(root, o.casePath);
  const caseBytes = readFileSync(casePath);
  const c = JSON.parse(caseBytes.toString('utf8')) as { id: string; area: string };
  if (c.area !== area) throw new Error(`case ${c.id} is for area ${c.area}, not ${area}`);
  const work = join(root, 'target/shard', o.job, o.shard, 'benchmark');
  mkdirSync(work, { recursive: true });
  const results = join(work, `${checkName('case id', c.id)}.results.json`);
  const run = (args: string[]) => {
    const r = spawnSync(bin, args, { cwd: root, env: ctx.env, stdio: ['ignore', 'inherit', 'inherit'] });
    if (r.status !== 0) throw new Error(`search_bench ${args[0]} failed, exit ${r.status}`);
  };
  run(['table', '--case', relative(root, casePath), '--out', results, '--jobs', o.jobs]);
  if (!existsSync(results)) throw new Error(`${c.id}: the table is not complete; run the same command again to continue`);
  const names: [string, string][] = [[`${c.id}.results.json`, results]];
  if (o.confirm) {
    const conf = join(work, `${c.id}.confirm.json`);
    run(['confirm', '--case', relative(root, casePath), '--results', results, '--out', conf, '--jobs', o.jobs]);
    names.push([`${c.id}.confirm.json`, conf], [`${c.id}.confirm.shortlist.json`, conf.replace(/\.json$/, '.shortlist.json')]);
  }
  const problems: string[] = [];
  for (const [name, path] of names) {
    if (name.endsWith('.shortlist.json')) continue;
    const v = JSON.parse(readFileSync(path, 'utf8')) as { identity?: Record<string, unknown> };
    problems.push(...identityProblems(`${o.shard}/${name}`, v.identity, m));
    if (v.identity?.caseSha256 !== sha256(caseBytes)) problems.push(`${o.shard}/${name}: made from another version of case ${c.id}`);
  }
  if (problems.length) throw new Error(`the results do not match the job; nothing was uploaded:\n  - ${problems.join('\n  - ')}`);
  const files: BenchmarkIndex['files'] = [];
  for (const [name, path] of names) {
    const data = readFileSync(path);
    const key = jobKey(o.job, 'benchmark', o.shard, name);
    await store.put(key, data, 'application/json; charset=utf-8');
    files.push({ name, key, sha256: sha256(data), size: data.length });
    log(`uploaded ${key} (${data.length} bytes)`);
  }
  const index: BenchmarkIndex = { schema: 1, kind: 'benchmark', job: o.job, shard: o.shard, area, caseId: c.id, caseSha256: sha256(caseBytes), confirm: o.confirm, complete: true, fingerprint: m.simulator.fingerprint, updatedAt: new Date().toISOString(), files };
  await putJson(store, indexKey(o.job, o.shard), index);
  log(`shard ${o.shard}: case ${c.id} complete`);
  return index;
}

export interface BenchmarkFetchOptions { job: string; shards: string[]; dest: string }

export async function benchmarkFetch(ctx: Ctx, o: BenchmarkFetchOptions): Promise<string[]> {
  const { root, store, log } = ctx;
  const m = await loadManifest(store, o.job);
  const problems: string[] = [];
  const got: [string, Buffer][] = [];
  const cases = new Map<string, string>();
  for (const shard of o.shards) {
    const index = await getJson<BenchmarkIndex>(store, indexKey(o.job, shard));
    if (!index) { problems.push(`shard ${shard}: no index in the bucket (it has not finished)`); continue; }
    if (index.kind !== 'benchmark' || index.job !== o.job || index.shard !== shard) { problems.push(`shard ${shard}: the index belongs to ${index.kind} shard ${index.shard} of job ${index.job}`); continue; }
    if (!index.complete) { problems.push(`shard ${shard}: not complete`); continue; }
    if (index.fingerprint !== m.simulator.fingerprint) problems.push(`shard ${shard}: ran on simulator ${short(index.fingerprint)}, the job expects ${short(m.simulator.fingerprint)}`);
    if (cases.has(index.caseId)) problems.push(`case ${index.caseId} was run by both shard ${cases.get(index.caseId)} and shard ${shard}`);
    cases.set(index.caseId, shard);
    for (const f of index.files) {
      const data = await store.get(f.key);
      if (!data) { problems.push(`shard ${shard}: ${f.key} is not in the bucket`); continue; }
      if (sha256(data) !== f.sha256) { problems.push(`shard ${shard}: ${f.name} does not match the hash in its index`); continue; }
      if (!f.name.endsWith('.shortlist.json')) {
        let v: { identity?: Record<string, unknown> };
        try { v = JSON.parse(data.toString('utf8')); } catch { problems.push(`shard ${shard}: ${f.name} is not valid JSON`); continue; }
        problems.push(...identityProblems(`shard ${shard}: ${f.name}`, v.identity, m));
        if (v.identity?.caseSha256 !== index.caseSha256) problems.push(`shard ${shard}: ${f.name} was made from another version of case ${index.caseId}`);
      }
      got.push([f.name, data]);
    }
  }
  if (problems.length) throw new Error(`cannot fetch job ${o.job}; nothing was written:\n  - ${problems.join('\n  - ')}`);
  const dest = resolve(root, o.dest);
  mkdirSync(dest, { recursive: true });
  for (const [name, data] of got) { writeFileAtomic(join(dest, name), data); log(`wrote ${join(o.dest, name)} (${data.length} bytes)`); }
  return got.map(([n]) => join(o.dest, n));
}
