// Sharded proposal search (change sharded-batch-runs, D6 and D7). `exploreRun` runs `explore` on shard-local copies of the proposals, report and seeds files and uploads
// the groups it produced; `exploreFetch` merges the shards' groups into the area's proposals file and report and their packages into its seeds file.
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { writeFileAtomic } from './atomic';
import { loadManifest, verifyLocal, type Ctx, type InputsManifest } from './shard-inputs';
import { checkName, getJson, jobKey, putJson, sha256 } from './shard-store';

export interface Group { id: string; computed?: Record<string, unknown>; [k: string]: unknown }
export interface ProposalsFile { version: number; area: string; groups: Group[] }
export interface ExploreIndex { schema: 1; kind: 'explore'; job: string; shard: string; area: string; args: string[]; groups: string[]; complete: boolean; fingerprint: string; updatedAt: string; files: { name: string; key: string; sha256: string; size: number }[] }

const UNCONSTRAINED = 'unconstrained';
/** Provenance a group must carry (crates/sim/src/explore/provenance.rs), and the ones every group of a merge must share. */
const REQUIRED = ['networkHash', 'demandHash', 'simulator', 'reportMethod', 'settings', 'minutes'];
const SHARED = ['networkHash', 'demandHash', 'simulator', 'reportMethod'];
const MODES = ['--check', '--check-subsets', '--check-singles', '--add-seed', '--seed-proposals', '--seed-labels', '--annotate'];
const OWNED = ['--out', '--report', '--known', '--profiles', '--references'];
const indexKey = (job: string, shard: string) => jobKey(job, 'explore', checkName('shard name', shard), 'index.json');
const short = (x: unknown) => String(x ?? 'none').slice(0, 12);

/** Group ids in display order: the profiles file's order, with the unconstrained group last unless the file places it (`profile::order`). */
export function profileOrder(root: string, area: string): string[] {
  const p = join(root, `data/proposals/${area}.profiles.json`);
  const ids: string[] = existsSync(p) ? (JSON.parse(readFileSync(p, 'utf8')) as { id: string }[]).map((x) => x.id) : [];
  return ids.includes(UNCONSTRAINED) ? ids : [...ids, UNCONSTRAINED];
}

const wholeList0 = (got: { index: { args: string[] } }[]) => got.every((s) => argValue(s.index.args, '--profile') === undefined);
export const argValue = (args: string[], k: string): string | undefined => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };

/** The group ids one `explore` invocation writes: `--profile all`, a comma list, one id, or the unconstrained group. */
export function producedIds(args: string[], order: string[]): string[] {
  const v = argValue(args, '--profile');
  if (v === undefined) return [UNCONSTRAINED];
  if (v === 'all') return order;
  return v.split(',').map((x) => x.trim());
}

export function checkExploreArgs(args: string[], area: string): string[] {
  const problems: string[] = [];
  for (const a of args) {
    if (MODES.includes(a)) problems.push(`${a} is not a search; run it on one machine, not as a shard`);
    if (OWNED.includes(a)) problems.push(`${a} is set by the shard tool (shard-local files, and the repository's profiles and references), so it cannot be given`);
  }
  const a = argValue(args, '--area') ?? 'rockridge';
  if (a !== area) problems.push(`--area ${a} is not the job's area ${area}`);
  return problems;
}

/** `JSON.stringify` with each array of plain numbers on one line, as `explore` writes the file (util::pretty_json). */
export function prettyJson(v: unknown): string {
  const lines = JSON.stringify(v, null, 2).split('\n');
  const isNum = (l: string) => { const t = l.trim().replace(/,$/, ''); return t !== '' && Number.isFinite(Number(t)); };
  const out: string[] = [];
  for (let i = 0; i < lines.length;) {
    const l = lines[i];
    if (l.trimEnd().endsWith('[')) {
      let j = i + 1;
      while (j < lines.length && isNum(lines[j])) j++;
      const close = (lines[j] ?? '').trim();
      if (j > i + 1 && (close === ']' || close === '],')) { out.push(l.trimEnd() + lines.slice(i + 1, j).map((n) => n.trim().replace(/,$/, '')).join(', ') + close); i = j + 1; continue; }
    }
    out.push(l); i++;
  }
  return out.join('\n') + '\n';
}

/** Put `produced` into the groups of `existing`: a group with the same id is replaced, the others kept, in the profiles file's order (`profile::merge_file`). */
export function mergeGroups(existing: Group[], produced: Group[], order: string[]): Group[] {
  const groups = existing.map((g) => g);
  for (const g of produced) { const i = groups.findIndex((x) => x.id === g.id); if (i >= 0) groups[i] = g; else groups.push(g); }
  const rank = (g: Group) => { const i = order.indexOf(g.id); return i < 0 ? order.length : i; };
  return groups.map((g, i) => ({ g, i })).sort((a, b) => rank(a.g) - rank(b.g) || a.i - b.i).map((x) => x.g);
}

function sections(text: string | null): [string, string][] {
  const out: [string, string][] = [];
  if (!text || !text.includes('<!-- profile:')) return out;
  let cur: [string, string] | null = null;
  for (const l of text.split('\n')) {
    const m = l.match(/^<!-- profile:(.*) -->$/);
    if (m) { if (cur) out.push(cur); cur = [m[1], '']; }
    if (cur) cur[1] += l + '\n';
  }
  if (cur) out.push(cur);
  return out;
}

/** Replace or add the report sections of the produced groups, in the profiles file's order (`profile::merge_report`). A report from before profiles has no sections and is dropped. */
export function mergeReports(existing: string | null, shardReports: { text: string; ids: string[] }[], area: string, order: string[]): string {
  const all = sections(existing);
  for (const r of shardReports) {
    const mine = sections(r.text);
    for (const id of r.ids) {
      const s = mine.find((x) => x[0] === id);
      if (!s) throw new Error(`a shard's report has no section for group ${id}`);
      const i = all.findIndex((x) => x[0] === id);
      if (i >= 0) all[i] = s; else all.push(s);
    }
  }
  const rank = (s: [string, string]) => { const i = order.indexOf(s[0]); return i < 0 ? order.length : i; };
  const sorted = all.map((s, i) => ({ s, i })).sort((a, b) => rank(a.s) - rank(b.s) || a.i - b.i).map((x) => x.s);
  return `# Proposals report: ${area}\n\n` + sorted.map(([, body]) => body.trimEnd() + '\n\n').join('').trimEnd() + '\n';
}

/** `explore` hashes the files it read to 16 hex characters of SHA-256 (util::short_hash). */
const hash16 = (m: InputsManifest, role: string) => m.files.find((f) => f.role === role)?.sha256.slice(0, 16);

/** What is wrong with the groups a shard produced, against the job. */
export function groupProblems(label: string, groups: Group[], m: InputsManifest): string[] {
  const out: string[] = [];
  for (const g of groups) {
    const c = g.computed ?? {};
    const missing = REQUIRED.filter((k) => c[k] === undefined || c[k] === null);
    if (missing.length) { out.push(`${label}: group ${g.id} lacks ${missing.join(', ')}`); continue; }
    const want: Record<string, unknown> = { networkHash: hash16(m, 'network'), demandHash: hash16(m, 'demand'), simulator: m.simulator.fingerprint };
    for (const [k, v] of Object.entries(want)) if (c[k] !== v) out.push(`${label}: group ${g.id} has ${k} ${short(c[k])}, the job has ${short(v)}`);
  }
  return out;
}

export interface ExploreRunOptions { job: string; shard: string; args: string[] }

export async function exploreRun(ctx: Ctx, o: ExploreRunOptions): Promise<ExploreIndex> {
  const { root, area, store, log } = ctx;
  const m = await loadManifest(store, o.job);
  if (m.area !== area) throw new Error(`job ${o.job} is for area ${m.area}, not ${area}`);
  const argProblems = checkExploreArgs(o.args, area);
  if (argProblems.length) throw new Error(`explore arguments:\n  - ${argProblems.join('\n  - ')}`);
  const bad = verifyLocal(ctx, m);
  if (bad.length) throw new Error(`this checkout does not match job ${o.job}:\n  - ${bad.join('\n  - ')}`);
  const bin = ctx.env.EXPLORE_BIN ? resolve(ctx.env.EXPLORE_BIN) : join(root, 'target/release/explore');
  if (!existsSync(bin)) throw new Error(`${bin} is not built; run: cargo build --release -p traffic-sim --bins`);
  const order = profileOrder(root, area);
  const ids = producedIds(o.args, order);
  const work = join(root, 'target/shard', o.job, o.shard, 'explore');
  rmSync(work, { recursive: true, force: true });
  mkdirSync(work, { recursive: true });
  const [out, report, known] = ['proposals.json', 'report.md', 'seeds.json'].map((f) => join(work, f));
  for (const [src, dest] of [[`public/data/${area}.proposals.json`, out], [`data/proposals/${area}.md`, report], [`data/proposals/${area}.seeds.json`, known]]) if (existsSync(join(root, src))) copyFileSync(join(root, src), dest);
  const r = spawnSync(bin, [...o.args, '--out', out, '--report', report, '--known', known], { cwd: root, env: ctx.env, stdio: ['ignore', 'inherit', 'inherit'] });
  if (r.status !== 0) throw new Error(`explore failed, exit ${r.status}`);
  const file = JSON.parse(readFileSync(out, 'utf8')) as ProposalsFile;
  const groups = ids.map((id) => file.groups.find((g) => g.id === id) ?? null);
  const absent = ids.filter((_, i) => !groups[i]);
  if (absent.length) throw new Error(`the run did not write group ${absent.join(', ')}`);
  const produced = groups as Group[];
  const problems = groupProblems(`shard ${o.shard}`, produced, m);
  if (problems.length) throw new Error(`the groups do not match the job; nothing was uploaded:\n  - ${problems.join('\n  - ')}`);
  const only: ProposalsFile = { version: file.version, area: file.area, groups: produced };
  const uploads: [string, Buffer, string][] = [['proposals.json', Buffer.from(prettyJson(only)), 'application/json; charset=utf-8'], ['report.md', readFileSync(report), 'text/markdown; charset=utf-8']];
  if (existsSync(known)) uploads.push(['seeds.json', readFileSync(known), 'application/json; charset=utf-8']);
  const files: ExploreIndex['files'] = [];
  for (const [name, data, type] of uploads) {
    const key = jobKey(o.job, 'explore', o.shard, name);
    await store.put(key, data, type);
    files.push({ name, key, sha256: sha256(data), size: data.length });
    log(`uploaded ${key} (${data.length} bytes)`);
  }
  const index: ExploreIndex = { schema: 1, kind: 'explore', job: o.job, shard: o.shard, area, args: o.args, groups: ids, complete: true, fingerprint: m.simulator.fingerprint, updatedAt: new Date().toISOString(), files };
  await putJson(store, indexKey(o.job, o.shard), index);
  log(`shard ${o.shard}: complete (group ${ids.join(', ')})`);
  return index;
}

export interface ExploreFetchOptions { job: string; shards: string[]; out: string; seeds: boolean; report: boolean }

export async function exploreFetch(ctx: Ctx, o: ExploreFetchOptions): Promise<{ groups: string[]; seedsMerged: boolean }> {
  const { root, area, store, log } = ctx;
  const m = await loadManifest(store, o.job);
  if (m.area !== area) throw new Error(`job ${o.job} is for area ${m.area}, not ${area}`);
  const bin = ctx.env.EXPLORE_BIN ? resolve(ctx.env.EXPLORE_BIN) : join(root, 'target/release/explore');
  if (o.seeds && !existsSync(bin)) throw new Error(`${bin} is not built (needed to merge the known packages); run: cargo build --release -p traffic-sim --bins, or give --no-seeds`);
  const problems: string[] = [];
  const got: { shard: string; index: ExploreIndex; file: ProposalsFile; report: string }[] = [];
  for (const shard of o.shards) {
    const index = await getJson<ExploreIndex>(store, indexKey(o.job, shard));
    if (!index) { problems.push(`shard ${shard}: no index in the bucket (it has not finished)`); continue; }
    if (index.kind !== 'explore' || index.job !== o.job || index.shard !== shard) { problems.push(`shard ${shard}: the index belongs to ${index.kind} shard ${index.shard} of job ${index.job}`); continue; }
    if (!index.complete) { problems.push(`shard ${shard}: not complete`); continue; }
    if (index.fingerprint !== m.simulator.fingerprint) problems.push(`shard ${shard}: ran on simulator ${short(index.fingerprint)}, the job expects ${short(m.simulator.fingerprint)}`);
    const body: Record<string, Buffer> = {};
    for (const f of index.files) {
      const data = await store.get(f.key);
      if (!data) { problems.push(`shard ${shard}: ${f.key} is not in the bucket`); continue; }
      if (sha256(data) !== f.sha256) { problems.push(`shard ${shard}: ${f.name} does not match the hash in its index`); continue; }
      body[f.name] = data;
    }
    if (!body['proposals.json']) { problems.push(`shard ${shard}: no proposals file`); continue; }
    let file: ProposalsFile;
    try { file = JSON.parse(body['proposals.json'].toString('utf8')); } catch { problems.push(`shard ${shard}: the proposals file is not valid JSON`); continue; }
    if (file.version !== 5 || file.area !== area || !Array.isArray(file.groups)) problems.push(`shard ${shard}: the proposals file is version ${file.version} for ${file.area}, expected version 5 for ${area}`);
    else if (JSON.stringify(file.groups.map((g) => g.id).sort()) !== JSON.stringify([...index.groups].sort())) problems.push(`shard ${shard}: the proposals file holds groups ${file.groups.map((g) => g.id).join(', ')}, its index says ${index.groups.join(', ')}`);
    else got.push({ shard, index, file, report: body['report.md']?.toString('utf8') ?? '' });
  }
  const owner = new Map<string, string>();
  for (const s of got) for (const g of s.file.groups) {
    if (owner.has(g.id)) problems.push(`group ${g.id} was produced by both shard ${owner.get(g.id)} and shard ${s.shard}`);
    owner.set(g.id, s.shard);
    problems.push(...groupProblems(`shard ${s.shard}`, [g], m));
  }
  for (const k of SHARED) {
    const vals = new Map<string, string[]>();
    for (const s of got) for (const g of s.file.groups) { const v = String(g.computed?.[k]); (vals.get(v) ?? vals.set(v, []).get(v)!).push(`${s.shard}/${g.id}`); }
    if (vals.size > 1) problems.push(`the groups differ in ${k}: ${[...vals].map(([v, who]) => `${short(v)} (${who.join(', ')})`).join(' and ')}`);
  }
  if (problems.length) throw new Error(`cannot merge job ${o.job}; nothing was written:\n  - ${problems.join('\n  - ')}`);

  const order = profileOrder(root, area);
  const outPath = resolve(root, o.out);
  let existing: ProposalsFile | null = null;
  if (existsSync(outPath)) {
    existing = JSON.parse(readFileSync(outPath, 'utf8')) as ProposalsFile;
    if (![2, 3, 4, 5].includes(existing.version) || existing.area !== area || !Array.isArray(existing.groups)) throw new Error(`${o.out} is version ${existing.version} for ${existing.area}; the merge needs a version 2 to 5 file of ${area}. Move it aside to start a new file.`);
  }
  const produced = got.flatMap((s) => s.file.groups);
  const wholeList = wholeList0(got);
  const first = produced[0].computed ?? {};
  for (const g of wholeList ? [] : existing?.groups ?? []) if (!owner.has(g.id)) {
    const diff = SHARED.filter((k) => g.computed?.[k] !== first[k]);
    if (diff.length) log(`warning: kept group ${g.id} of ${o.out} differs from the new groups in ${diff.join(', ')}; it is stale until it is computed again`);
  }
  // Without --profile a search is the whole list, so it replaces the file; searches under named profiles are merged by group.
  const merged: ProposalsFile = { version: 5, area, groups: wholeList ? produced : mergeGroups(existing?.groups ?? [], produced, order) };
  writeFileAtomic(outPath, prettyJson(merged));
  log(`${o.out}: groups ${merged.groups.map((g) => g.id).join(', ')} (new or replaced: ${[...owner.keys()].join(', ')})`);

  if (o.report) {
    const rp = join(root, `data/proposals/${area}.md`);
    mkdirSync(join(root, 'data/proposals'), { recursive: true });
    writeFileAtomic(rp, mergeReports(existsSync(rp) && !wholeList ? readFileSync(rp, 'utf8') : null, got.map((s) => ({ text: s.report, ids: s.file.groups.map((g) => g.id) })), area, order));
    log(`data/proposals/${area}.md: sections for ${[...owner.keys()].join(', ')} replaced`);
  }
  let seedsMerged = false;
  if (o.seeds) {
    const scratch = join(root, 'target/shard', o.job);
    mkdirSync(scratch, { recursive: true });
    const only = join(scratch, `${area}.produced.proposals.json`);
    writeFileSync(only, prettyJson({ version: 5, area, groups: produced }));
    const r = spawnSync(bin, ['--area', area, '--seed-proposals', only], { cwd: root, env: ctx.env, stdio: ['ignore', 'inherit', 'inherit'] });
    if (r.status !== 0) throw new Error(`explore --seed-proposals failed, exit ${r.status}; the proposals file and report were already written`);
    seedsMerged = true;
    log(`data/proposals/${area}.seeds.json: the shards' search options added (an option already there keeps its earlier figures)`);
  }
  return { groups: [...owner.keys()], seedsMerged };
}
