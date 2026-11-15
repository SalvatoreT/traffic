// `npm run simulate -- --redistribution`: where traffic goes when one closure is added, alone and inside a package (change
// explain-traffic-redistribution). Runs the baseline, the closure alone and the package with tracing on, for each seed, in worker threads,
// and summarizes them with the shared contract in src/lib/redistribution.ts.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { availableParallelism } from 'node:os';
import { Worker } from 'node:worker_threads';
import type { Intervention } from '../../src/types';
import { buildIndex } from '../../src/lib/naming';
import { analyzeSeed, checkStored, geoOf, selectorOf, summarize, type Effect, type GraphQuery, type RedistributionResult, type Role, type SeedAnalysis, type SelectorKind, type TraceRun, type TraceSummary } from '../../src/lib/redistribution';
import { CliError, EXIT, type AreaFiles } from './agent-area';
import { explainLink, linkFragment, resolvePeriod, scenarioFromLink } from './simulate-report';
import { loadEngine } from './run-result';

export interface RedistArgs {
  link?: string; closure?: string; seeds: number[]; jobs: number; cohort: SelectorKind; streets: string[]; out?: string;
  traceMax?: number; graphOnly: boolean; from?: string; period?: string; minutes: number; demand?: number;
}

/** "1-10", "1,2,3" or "4". */
export function parseSeeds(v: string): number[] {
  const out: number[] = [];
  for (const part of v.split(',')) {
    const m = /^\s*(\d+)\s*(?:-\s*(\d+)\s*)?$/.exec(part);
    if (!m) throw new CliError(`--seeds takes numbers and ranges like 1-10 or 1,2,3, not "${v}".`, EXIT.usage);
    const [a, b] = [Number(m[1]), Number(m[2] ?? m[1])];
    if (b < a || b - a > 200) throw new CliError(`--seeds: bad range "${part}".`, EXIT.usage);
    for (let s = a; s <= b; s++) if (!out.includes(s)) out.push(s);
  }
  return out;
}

const log = (s: string) => process.stderr.write(`${s}\n`);
const same = (a: Intervention, b: Intervention) => JSON.stringify(a) === JSON.stringify(b);

export interface Variants { period: string; demandScale: number; closureItem: string; closure: Intervention[]; package: Intervention[]; links: Record<Role, string>; notes: string[] }

/** The three scenarios. The closure is one item of the package link, decoded on its own; anything ambiguous is an error, never a guess. */
export function variants(files: AreaFiles, a: RedistArgs): Variants {
  const area = files.entry.id;
  const notes: string[] = [];
  const pkgFrag = a.link !== undefined ? linkFragment(a.link) : undefined;
  const pkg = a.link !== undefined ? scenarioFromLink(files.network, a.link, area) : undefined;
  if (pkg && pkg.unplaced.length) throw new CliError(`${pkg.unplaced.length} item(s) of the package link could not be placed on this network: ${pkg.unplaced.map((u) => `${u.type} (${u.reason})`).join('; ')}. The diagnostic needs every item.`, EXIT.usage);
  const items = pkgFrag?.split(';').find((t) => t.startsWith('s='))?.slice(2).split('~').filter(Boolean) ?? [];
  let item = a.closure;
  if (item === undefined) {
    if (items.length === 1) item = items[0];
    else throw new CliError(items.length ? `The package has ${items.length} items; name the closure to trace with --closure <item>, one of: ${items.join(' ')}` : 'Give the closure with --closure <item> (a link item such as mn,9q9p3fr7b5; find items with --find) and, optionally, the package with --link.', EXIT.usage);
  }
  item = item.trim().replace(/^s=/, '');
  if (item.includes('~')) throw new CliError('--closure takes one item; the package goes in --link.', EXIT.usage);
  const period = resolvePeriod(files.entry, files.demand, a.period, pkg?.period).id;
  const closureLink = `#v1;a=${area};p=${period};s=${item}`;
  const why = explainLink(linkFragment(closureLink), area);
  const dec = scenarioFromLink(files.network, closureLink, area);
  if (dec.interventions.length !== 1 || dec.unplaced.length) throw new CliError(`The closure item "${item}" does not decode to one intervention on this network${why ? `: ${why}` : ''}.`, EXIT.usage);
  const closure = dec.interventions;
  let pkgIvs = pkg?.interventions ?? closure;
  if (pkg && !pkgIvs.some((iv) => same(iv, closure[0]))) throw new CliError(`The closure "${item}" is not one of the package's items (${items.join(' ')}). The comparison needs the package that contains it.`, EXIT.usage);
  if (!pkg) { notes.push('No package was given: the package scenario is the closure alone.'); pkgIvs = closure; }
  const demandScale = a.demand ?? pkg?.demandScale ?? 1;
  const packageLink = pkgFrag ? `#${pkgFrag}` : closureLink;
  return { period, demandScale, closureItem: item, closure, package: pkgIvs, links: { baseline: `#v1;a=${area};p=${period}`, closure: closureLink, package: packageLink }, notes };
}

interface Engine { graph(network: string, period: string, mode: string, base: string, scen: string): string; paired(d: number[]): Effect; fingerprint: string }
async function engine(): Promise<Engine> {
  let e;
  try { e = await loadEngine(); } catch (err) {
    throw new CliError(`The simulator is not built: ${(err as Error).message.split('\n')[0]}\nBuild it once with \`npm run wasm\`.`, EXIT.wasm);
  }
  const pkg = (await import('../../src/sim/pkg/traffic_sim.js')) as unknown as { redistributionGraph?: Engine['graph']; pairedEffect?: (d: Float64Array) => string };
  if (typeof pkg.redistributionGraph !== 'function' || typeof pkg.pairedEffect !== 'function') throw new CliError('The WASM build is older than the redistribution diagnostic; run `npm run wasm`.', EXIT.wasm);
  return { graph: pkg.redistributionGraph, paired: (d) => JSON.parse(pkg.pairedEffect!(Float64Array.from(d))) as Effect, fingerprint: e.fingerprint };
}

function graphs(e: Engine, files: AreaFiles, v: Variants): { closure: GraphQuery; package: GraphQuery } {
  const closure = JSON.parse(e.graph(files.simNetwork, v.period, 'car', '[]', JSON.stringify(v.closure))) as GraphQuery;
  const full = JSON.parse(e.graph(files.simNetwork, v.period, 'car', '[]', JSON.stringify(v.package))) as GraphQuery;
  // In the package graph, keep the movements the closure closes: the question is whether their bypasses stay legal with the other changes.
  const mine = new Set(closure.closed.map((m) => `${m[0]}>${m[1]}`));
  const pkgView: GraphQuery = { ...full, closed: full.closed.filter((m) => mine.has(`${m[0]}>${m[1]}`)), witnesses: full.witnesses.filter((w) => mine.has(`${w.movement[0]}>${w.movement[1]}`)) };
  return { closure, package: pkgView };
}

/** Runs every (seed, scenario) in `jobs` worker threads; each seed is analyzed as soon as its three runs are in. */
async function runAll(files: AreaFiles, v: Variants, a: RedistArgs, onSeed: (seed: number, runs: Record<Role, TraceRun>) => void): Promise<void> {
  const seconds = Math.round(a.minutes * 60);
  const tasks: { id: number; seed: number; role: Role }[] = [];
  for (const seed of a.seeds) for (const role of ['baseline', 'closure', 'package'] as Role[]) tasks.push({ id: tasks.length, seed, role });
  const pending = new Map<number, Partial<Record<Role, TraceRun>>>();
  let next = 0, done = 0;
  const ivs: Record<Role, Intervention[]> = { baseline: [], closure: v.closure, package: v.package };
  const workers = Array.from({ length: Math.max(1, Math.min(a.jobs, tasks.length)) }, () => new Worker(new URL('./redistribution-worker.ts', import.meta.url), {
    workerData: { network: files.simNetwork, demand: files.demandText }, execArgv: ['--import', 'tsx'],
  }));
  const t0 = Date.now();
  await new Promise<void>((resolve, reject) => {
    const feed = (w: Worker) => {
      if (next >= tasks.length) { w.postMessage(null); return; }
      const t = tasks[next++];
      const config: Record<string, unknown> = { seed: t.seed, period: v.period, demandScale: v.demandScale, interventions: ivs[t.role] };
      if (a.traceMax !== undefined) config.traceDetailMax = a.traceMax;
      w.postMessage({ id: t.id, network: '', demand: '', config, seconds });
    };
    for (const w of workers) {
      w.on('message', (m: { id: number; error?: string; requests: Float64Array; events: Uint32Array; summary: string; metrics: string }) => {
        if (m.error) { reject(new CliError(`A run failed: ${m.error}`, 1)); return; }
        const t = tasks[m.id];
        const run: TraceRun = { requests: m.requests, events: m.events, summary: JSON.parse(m.summary) as TraceSummary, metrics: JSON.parse(m.metrics) as Record<string, unknown> };
        const got = pending.get(t.seed) ?? {};
        got[t.role] = run;
        pending.set(t.seed, got);
        done++;
        log(`  ${done}/${tasks.length} runs (seed ${t.seed}, ${t.role}), ${Math.round((Date.now() - t0) / 1000)} s`);
        if (got.baseline && got.closure && got.package) { pending.delete(t.seed); onSeed(t.seed, got as Record<Role, TraceRun>); }
        if (done === tasks.length) resolve();
        else feed(w);
      });
      w.on('error', (err) => reject(err));
      feed(w);
    }
  });
  await Promise.all(workers.map((w) => w.terminate()));
}

export async function redistribution(files: AreaFiles, a: RedistArgs): Promise<unknown> {
  const v = variants(files, a);
  const e = await engine();
  const g = graphs(e, files, v);
  const h16 = (x: string) => x.slice(0, 16);
  const want = { network: files.hashes.network, demand: files.hashes.demand, simulator: e.fingerprint, period: v.period, closure: v.closure, package: v.package };
  if (a.from !== undefined) {
    if (!existsSync(a.from)) throw new CliError(`No such file: ${a.from}`, EXIT.usage);
    let stored: unknown;
    try { stored = JSON.parse(readFileSync(a.from, 'utf8')); } catch { throw new CliError(`${a.from} is not JSON.`, EXIT.usage); }
    const s = checkStored(stored, want);
    if (!s.ok) throw new CliError(`The stored diagnostic cannot be reused here: ${s.reason}. Run the diagnostic again without --from.`, EXIT.data);
    return s.result;
  }
  if (a.graphOnly) {
    return {
      kind: 'redistribution-graph', schema: 1, disclaimer: 'Legal paths on the simulator\'s movement graph. They say a car could go that way, not how many do.',
      identity: { area: files.entry.id, period: v.period, mode: 'car', hashes: { network: h16(files.hashes.network), demand: h16(files.hashes.demand), simulator: e.fingerprint }, scenarios: (['closure', 'package'] as Role[]).map((r) => ({ role: r, link: v.links[r] })), closureItem: v.closureItem },
      graph: g, notes: v.notes,
    };
  }
  const index = buildIndex(files.network);
  const geo = geoOf(files.network);
  const centers = g.closure.nodes.map((n) => [files.network.nodes[n].x, files.network.nodes[n].y] as [number, number]);
  if (!centers.length) throw new CliError(`The closure "${v.closureItem}" removes no car movement in ${v.period}, so there is no cohort to follow.`, EXIT.usage);
  const selector = selectorOf(g.closure, a.cohort);
  const seconds = Math.round(a.minutes * 60);
  log(`Redistribution: ${a.seeds.length} seed(s) x 3 scenarios, ${a.minutes} simulated minutes each, ${a.jobs} at a time...`);
  const seeds: SeedAnalysis[] = [];
  await runAll(files, v, a, (seed, runs) => { seeds.push(analyzeSeed({ seed, seconds, runs, selector, centers, geo })); });
  seeds.sort((x, y) => x.seed - y.seed);
  const cal = files.entry.calibration;
  const result: RedistributionResult = summarize({
    seeds, index, net: files.network, paired: e.paired, graph: g, requestedStreets: a.streets,
    calibration: { status: cal?.status ?? 'uncalibrated', note: cal?.note ?? '' },
    identity: {
      area: files.entry.id, period: v.period, seeds: seeds.map((s) => s.seed), seconds, demandScale: v.demandScale, initialLoad: true, mode: 'car',
      window: { fromS: 0, toS: seconds, counting: 'link exits at or after time zero and before the end of the run, after initial loading and its settle interval' },
      hashes: { network: h16(files.hashes.network), demand: h16(files.hashes.demand), simulator: e.fingerprint },
      scenarios: (['baseline', 'closure', 'package'] as Role[]).map((r) => ({ role: r, link: v.links[r], interventions: r === 'baseline' ? [] : r === 'closure' ? v.closure : v.package })),
      closureItem: v.closureItem, selector: a.cohort, localRadiusM: 400, traceDetailMax: a.traceMax ?? null,
    },
  });
  result.notes.push(...v.notes);
  if (a.out) { writeFileSync(a.out, `${JSON.stringify(result)}\n`); log(`Wrote ${a.out}`); }
  return result;
}

export const defaultJobs = () => Math.max(1, Math.min(4, availableParallelism()));
