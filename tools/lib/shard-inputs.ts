// The inputs of a sharded job: the files that are not in git and travel through the bucket, the hashes of the git-tracked inputs the runs read, and the check that
// a machine has exactly those and a build with the lead's simulator fingerprint (change sharded-batch-runs, D3).
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, normalize, isAbsolute } from 'node:path';
import { writeFileAtomic } from './atomic';
import { checkName, getJson, jobKey, putJson, sha256, type Store } from './shard-store';

export type Only = 'assess' | 'explore' | 'all';
export interface InputFile { path: string; role: 'network' | 'demand' | 'cv-demand' | 'areas' | 'proposals'; sha256: string; size: number; key: string }
export interface InputsManifest {
  schema: 1; job: string; area: string; createdAt: string; only: Only;
  simulator: { fingerprint: string; revision: string | null; dirty: boolean | null };
  files: InputFile[];
  /** SHA-256 of the git-tracked files the runs read (null when the file does not exist). */
  git: Record<string, string | null>;
}

export const GIT_INPUTS = (area: string): Record<string, string> => ({
  targets: `data/calibration/${area}.targets.json`, stations: `data/demand/${area}.stations.json`, split: `data/demand/${area}.split.json`,
  demandConfig: `data/demand/${area}.config.json`, areaConfig: `data/areas/${area}.json`, groups: `data/demand/${area}.groups.json`,
  profiles: `data/proposals/${area}.profiles.json`, references: `data/proposals/${area}.references.json`, seeds: `data/proposals/${area}.seeds.json`,
});

const hashOf = (path: string): string | null => (existsSync(path) ? sha256(readFileSync(path)) : null);
export const gitHashes = (root: string, area: string): Record<string, string | null> => Object.fromEntries(Object.entries(GIT_INPUTS(area)).map(([k, p]) => [k, hashOf(join(root, p))]));

/** The relative path the demand config names for the cross-validation demand, if any. */
export function cvDemandPath(root: string, area: string): string | null {
  const cfgPath = join(root, `data/demand/${area}.config.json`);
  if (!existsSync(cfgPath)) return null;
  const p: unknown = JSON.parse(readFileSync(cfgPath, 'utf8')).countFit?.validation?.demandOutput;
  if (typeof p !== 'string') return null;
  if (isAbsolute(p) || normalize(p).startsWith('..')) throw new Error(`countFit.validation.demandOutput must be a path inside the repository (got ${p})`);
  return normalize(p);
}

export function inputSpecs(root: string, area: string, only: Only): { path: string; role: InputFile['role']; required: boolean }[] {
  const specs: { path: string; role: InputFile['role']; required: boolean }[] = [
    { path: `public/data/${area}.network.json`, role: 'network', required: true },
    { path: `public/data/${area}.demand.json`, role: 'demand', required: true },
    { path: 'public/data/areas.json', role: 'areas', required: false },
  ];
  const cv = only === 'explore' ? null : cvDemandPath(root, area);
  if (cv) specs.push({ path: cv, role: 'cv-demand', required: true });
  if (only !== 'assess') specs.push({ path: `public/data/${area}.proposals.json`, role: 'proposals', required: false });
  return specs;
}

export interface Git { revision: string | null; simulatorDirty: boolean | null; onOriginMain: boolean | null }
export function gitInfo(root: string): Git {
  const git = (args: string[]) => { const r = spawnSync('git', ['-C', root, ...args], { encoding: 'utf8' }); return r.status === 0 ? { out: r.stdout.trim(), ok: true } : { out: '', ok: false }; };
  const rev = git(['rev-parse', 'HEAD']);
  const dirty = git(['status', '--porcelain', '--', 'crates', 'Cargo.toml', 'Cargo.lock']);
  const anc = spawnSync('git', ['-C', root, 'merge-base', '--is-ancestor', 'HEAD', 'origin/main']);
  return { revision: rev.ok ? rev.out : null, simulatorDirty: dirty.ok ? dirty.out !== '' : null, onOriginMain: anc.status === 0 ? true : anc.status === 1 ? false : null };
}

/** The fingerprint of the simulator in this checkout's build, printed by the `fingerprint` binary (it links the library `calibrate` and `explore` link). */
export function localFingerprint(root: string, env: NodeJS.ProcessEnv = process.env): string {
  const bin = env.SHARD_FINGERPRINT_BIN ?? join(root, 'target/release/fingerprint');
  if (!existsSync(bin)) throw new Error(`${bin} is not built; run: cargo build --release -p traffic-sim --bins`);
  const r = spawnSync(bin, [], { encoding: 'utf8', env });
  const fp = r.stdout?.trim();
  if (r.status !== 0 || !fp) throw new Error(`${bin} failed: ${r.stderr ?? ''}`);
  return fp;
}

export interface Ctx { root: string; area: string; store: Store; log: (m: string) => void; env: NodeJS.ProcessEnv }

export async function pushInputs(ctx: Ctx, o: { job: string; only: Only; allowDirty: boolean; replace: boolean }): Promise<InputsManifest> {
  const { root, area, store, log } = ctx;
  checkName('job id', o.job);
  if (!o.replace && (await store.get(jobKey(o.job, 'inputs.json')))) throw new Error(`job ${o.job} already has inputs; the shards of a job must share them. Use a new job id, or --replace if no shard has started.`);
  const git = gitInfo(root);
  if (git.simulatorDirty && !o.allowDirty) throw new Error('the simulator sources (crates/, Cargo.toml, Cargo.lock) have uncommitted changes, which a child cannot have. Commit and push them first, or give --allow-dirty to accept that the children will fail the fingerprint check.');
  if (git.onOriginMain === false) log('warning: HEAD is not on origin/main (or origin/main is not fetched); children clone main, so push before they start');
  const fingerprint = localFingerprint(root, ctx.env);
  const files: InputFile[] = [];
  const bytes = new Map<string, Buffer>();
  const missing: string[] = [];
  for (const s of inputSpecs(root, area, o.only)) {
    const abs = join(root, s.path);
    if (!existsSync(abs)) { if (s.required) missing.push(s.path); continue; }
    const data = readFileSync(abs);
    bytes.set(s.path, data);
    files.push({ path: s.path, role: s.role, sha256: sha256(data), size: data.length, key: jobKey(o.job, 'inputs', s.path) });
  }
  if (missing.length) throw new Error(`missing input files: ${missing.join(', ')} (npm run data:download, or the data build)`);
  const manifest: InputsManifest = { schema: 1, job: o.job, area, createdAt: new Date().toISOString(), only: o.only, simulator: { fingerprint, revision: git.revision, dirty: git.simulatorDirty }, files, git: gitHashes(root, area) };
  for (const f of files) { await store.put(f.key, bytes.get(f.path)!, 'application/json; charset=utf-8'); log(`uploaded ${f.key} (${f.size} bytes)`); }
  await putJson(store, jobKey(o.job, 'inputs.json'), manifest);
  log(`job ${o.job}: ${files.length} input file(s), simulator ${fingerprint.slice(0, 12)}, revision ${git.revision?.slice(0, 12) ?? 'unknown'}`);
  return manifest;
}

export async function loadManifest(store: Store, job: string): Promise<InputsManifest> {
  const m = await getJson<InputsManifest>(store, jobKey(job, 'inputs.json'));
  if (!m) throw new Error(`job ${job} has no inputs (run \`inputs push --job ${job}\` in the lead session first)`);
  if (m.schema !== 1) throw new Error(`job ${job}: inputs manifest schema ${m.schema} is not supported by this tool`);
  return m;
}

/** What differs between this checkout and the job: the build's fingerprint, the git-tracked inputs, and the downloaded files. */
export function verifyLocal(ctx: Pick<Ctx, 'root' | 'env'>, m: InputsManifest, opts: { files?: boolean } = {}): string[] {
  const problems: string[] = [];
  let fp: string | null = null;
  try { fp = localFingerprint(ctx.root, ctx.env); } catch (e) { problems.push((e as Error).message); }
  if (fp && fp !== m.simulator.fingerprint) problems.push(`this build's simulator fingerprint is ${fp.slice(0, 12)}, the job expects ${m.simulator.fingerprint.slice(0, 12)} (pushed from revision ${m.simulator.revision?.slice(0, 12) ?? 'unknown'}): update the clone to that revision and rebuild with \`cargo build --release -p traffic-sim --bins\``);
  const paths = GIT_INPUTS(m.area);
  const now = gitHashes(ctx.root, m.area);
  for (const k of Object.keys(m.git)) if (now[k] !== m.git[k]) problems.push(`${paths[k] ?? k} differs from the lead's (${now[k]?.slice(0, 12) ?? 'absent'}, the job has ${m.git[k]?.slice(0, 12) ?? 'absent'}): the clone is not at the lead's commit`);
  if (opts.files !== false) for (const f of m.files) {
    const h = hashOf(join(ctx.root, f.path));
    if (h !== f.sha256) problems.push(`${f.path} ${h ? 'differs from' : 'is missing from'} the job's copy${h ? ` (${h.slice(0, 12)}, the job has ${f.sha256.slice(0, 12)})` : ''}: run \`inputs pull --job ${m.job}\``);
  }
  return problems;
}

export async function pullInputs(ctx: Ctx, o: { job: string; force: boolean }): Promise<InputsManifest> {
  const { root, store, log } = ctx;
  const m = await loadManifest(store, o.job);
  if (m.area !== ctx.area) throw new Error(`job ${o.job} is for area ${m.area}, not ${ctx.area} (give --area ${m.area})`);
  const early = verifyLocal(ctx, m, { files: false });
  if (early.length) throw new Error(`this checkout cannot run job ${o.job}:\n  - ${early.join('\n  - ')}`);
  const conflicts = m.files.filter((f) => { const h = hashOf(join(root, f.path)); return h !== null && h !== f.sha256; }).map((f) => f.path);
  if (conflicts.length && !o.force) throw new Error(`these local files differ from the job's copy and would be replaced: ${conflicts.join(', ')}. Give --force to replace them.`);
  for (const f of m.files) {
    const dest = join(root, f.path);
    if (hashOf(dest) === f.sha256) { log(`have ${f.path}`); continue; }
    const data = await store.get(f.key);
    if (!data) throw new Error(`${f.key} is not in the bucket`);
    if (sha256(data) !== f.sha256) throw new Error(`${f.path}: the download has hash ${sha256(data).slice(0, 12)}, the manifest says ${f.sha256.slice(0, 12)}`);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileAtomic(dest, data);
    log(`downloaded ${f.path} (${f.size} bytes)`);
  }
  const git = gitInfo(root);
  if (git.revision && m.simulator.revision && git.revision !== m.simulator.revision) log(`note: this clone is at ${git.revision.slice(0, 12)}, the job was pushed from ${m.simulator.revision.slice(0, 12)}; the fingerprint and input hashes match, so the runs are compatible`);
  log(`job ${o.job}: inputs verified (simulator ${m.simulator.fingerprint.slice(0, 12)})`);
  return m;
}
