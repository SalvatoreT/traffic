// Where the traffic that used each closure of a published proposal goes, for the Proposals cards' hover (change wide-proposal-picture).
//   npm run data:redistribution [-- --area rockridge] [--only <proposal id>] [--jobs 4] [--force]
// Needs the WASM build (`npm run wasm`). For each proposal in public/data/<area>.proposals.json, runs today's traffic and the proposal's package, traced,
// on the proposal's own confirmation seeds and its picture's period, and follows the through cars that drove each closed movement of each of its
// interventions (the accounting of `simulate --redistribution`, `displacement` in src/lib/redistribution.ts). Writes
// public/data/redistribution/<area>/<group>.<proposal>.json (src/lib/stored-redistribution.ts). A file is reused when it was made for the same link,
// seeds and inputs. Run it after the proposal search and before `data:results`.
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Worker } from 'node:worker_threads';
import type { Intervention } from '../src/types';
import { decodeScenario } from '../src/lib/hash';
import { buildIndex } from '../src/lib/naming';
import { displacement, FAR_ROUTE, geoOf, scenarioKey, type GraphQuery, type TraceRun, type TraceSummary } from '../src/lib/redistribution';
import { parseProposals, linkHash, proposalsUrl, type Proposal, type ProposalGroup } from '../src/lib/proposals';
import { canTrace } from '../src/lib/redistribution-view';
import { redistributionUrl, routeProblem, redistributionVerdict, parseRedistribution, STORED_REDIST_METHOD, STORED_REDIST_VERSION, STORED_TOP, type StoredItem, type StoredRedistribution } from '../src/lib/stored-redistribution';
import { DEFAULT_DATA_DIR, fileOf, loadAreaFiles, type AreaFiles } from './lib/agent-area';
import { writeFileAtomic } from './lib/atomic';
import { defaultJobs } from './lib/redistribution-cli';
import { mergeSamples } from './lib/redistribution-samples';

const arg = (k: string, d: string) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : d; };
const flag = (k: string) => process.argv.includes(k);
const log = (s: string) => process.stderr.write(`${s}\n`);

interface Task { key: string; config: Record<string, unknown> }

async function pool(files: AreaFiles, jobs: number, seconds: number, tasks: Task[], done: (key: string, run: TraceRun) => void): Promise<void> {
  if (tasks.length === 0) return;
  let next = 0, n = 0;
  const t0 = Date.now();
  const workers = Array.from({ length: Math.min(jobs, tasks.length) }, () => new Worker(new URL('./lib/redistribution-worker.ts', import.meta.url), { workerData: { network: files.simNetwork, demand: files.demandText }, execArgv: ['--import', 'tsx'] }));
  await new Promise<void>((resolve, reject) => {
    const feed = (w: Worker) => { if (next >= tasks.length) { w.postMessage(null); return; } const id = next++; w.postMessage({ id, config: tasks[id].config, seconds }); };
    for (const w of workers) {
      w.on('message', (m: { id: number; error?: string; requests: Float64Array; events: Uint32Array; summary: string; metrics: string }) => {
        if (m.error) { reject(new Error(m.error)); return; }
        done(tasks[m.id].key, { requests: m.requests, events: m.events, summary: JSON.parse(m.summary) as TraceSummary, metrics: JSON.parse(m.metrics) as Record<string, unknown> });
        log(`  ${++n}/${tasks.length} runs, ${Math.round((Date.now() - t0) / 1000)} s`);
        if (n === tasks.length) resolve(); else feed(w);
      });
      w.on('error', reject);
      feed(w);
    }
  });
  await Promise.all(workers.map((w) => w.terminate()));
}

const r1 = (x: number) => Math.round(x * 10) / 10;

async function main() {
  const area = arg('--area', 'rockridge');
  const jobs = Math.max(1, Number(arg('--jobs', String(defaultJobs()))));
  const only = process.argv.includes('--only') ? arg('--only', '') : null;
  const force = flag('--force');
  const files = await loadAreaFiles(DEFAULT_DATA_DIR, area);
  const net = files.network;
  const proposalsPath = fileOf(DEFAULT_DATA_DIR, proposalsUrl(files.entry));
  const proposals = existsSync(proposalsPath) ? parseProposals(readFileSync(proposalsPath, 'utf8')) : null;
  if (!proposals) throw new Error(`No proposals file at ${proposalsPath}; nothing to compute.`);
  const { loadEngine } = await import('./lib/run-result');
  const engine = await loadEngine();
  const pkg = (await import('../src/sim/pkg/traffic_sim.js')) as unknown as { redistributionGraph?(n: string, p: string, m: string, b: string, s: string): string };
  if (typeof pkg.redistributionGraph !== 'function') throw new Error('The WASM build is older than the redistribution diagnostic; run `npm run wasm`.');
  const index = buildIndex(net);
  const geo = geoOf(net);
  const isLocal = net.links.map((l) => l.inStudyArea && (l.class === 'residential' || l.class === 'service'));
  const outDir = join(DEFAULT_DATA_DIR, 'redistribution', area);
  mkdirSync(outDir, { recursive: true });

  interface Want { g: ProposalGroup; p: Proposal; period: string; seeds: number[]; seconds: number; ivs: Intervention[]; path: string }
  const todo: Want[] = [];
  for (const g of proposals.groups) {
    if (g.legacy) continue;
    for (const p of g.proposals) {
      if (only && p.id !== only) continue;
      if (!p.picture) { log(`skip ${g.id}/${p.id}: no picture, so no period`); continue; }
      const d = decodeScenario(net, linkHash(p.link));
      if (d.invalid || d.unplaced.length) { log(`skip ${g.id}/${p.id}: its link no longer places on this network`); continue; }
      if (!files.hashes.network.startsWith(g.computed.networkHash) || !files.hashes.demand.startsWith(g.computed.demandHash)) { log(`skip ${g.id}/${p.id}: computed on another network or demand than the data here`); continue; }
      const seeds = p.evidence?.seeds ?? g.computed.seeds;
      const w: Want = { g, p, period: p.picture.period, seeds, seconds: Math.round((g.computed.minutes ?? 60) * 60), ivs: d.interventions, path: join(outDir, `${g.id}.${p.id}.json`) };
      const old = existsSync(w.path) ? parseRedistribution(readFileSync(w.path, 'utf8')) : null;
      const fresh = !!old && redistributionVerdict(old, { group: g.id, proposal: p.id, link: p.link, period: w.period, seeds, inputs: { networkHash: g.computed.networkHash, demandHash: g.computed.demandHash, simulator: engine.fingerprint }, loaded: { network: files.hashes.network, demand: files.hashes.demand, simulator: engine.fingerprint } }).ok;
      if (fresh && !force) { log(`current ${g.id}/${p.id}`); continue; }
      todo.push(w);
    }
  }
  if (only && todo.length === 0 && !existsSync(join(outDir))) throw new Error(`No proposal with id ${only}`);
  log(`${todo.length} proposal(s) to compute, ${jobs} runs at a time`);
  if (todo.length === 0) return;

  const t0 = Date.now();
  const byPeriodSeed = new Map<string, TraceRun>();
  const baseKeys = [...new Set(todo.flatMap((w) => w.seeds.map((s) => `${w.period}:${s}`)))];
  const seconds = todo[0].seconds;
  if (todo.some((w) => w.seconds !== seconds)) throw new Error('Proposals with different run lengths cannot share baselines.');
  log(`Today's traffic: ${baseKeys.length} runs`);
  await pool(files, jobs, seconds, baseKeys.map((k) => { const [period, seed] = k.split(':'); return { key: k, config: { seed: Number(seed), period, interventions: [] } }; }), (k, r) => byPeriodSeed.set(k, r));

  for (const w of todo) {
    log(`${w.g.id}/${w.p.id}: ${w.ivs.length} interventions, ${w.seeds.length} seeds`);
    const traced = w.ivs.map((iv, i) => ({ iv, i }))
      .filter(({ iv }) => canTrace(iv))
      .flatMap(({ iv, i }) => {
        const g = JSON.parse(pkg.redistributionGraph!(files.simNetwork, w.period, 'car', '[]', JSON.stringify([iv]))) as GraphQuery;
        if (g.closed.length === 0 && g.closedLinks.length === 0) { log(`  intervention ${i} (${iv.type}) closes no car movement in ${w.period}; left out`); return []; }
        const centers = g.nodes.map((n) => [net.nodes[n].x, net.nodes[n].y] as [number, number]);
        const selector = { kind: 'direct' as const, movements: g.closed.map((m) => [m[0], m[1]] as [number, number]), links: g.closedLinks };
        return [{ iv, i, centers, selector }];
      });
    const acc = traced.map(() => ({ used: 0, side: 0, arterial: 0, removed: 0, unroutable: 0, waiting: 0, unmatched: 0, routes: new Map<string, number>(), samples: new Map<number, Map<string, number[]>>(), blocks: new Map<number, number>() }));
    await pool(files, jobs, seconds, w.seeds.map((seed) => ({ key: String(seed), config: { seed, period: w.period, interventions: w.ivs } })), (k, run) => {
      const base = byPeriodSeed.get(`${w.period}:${k}`)!;
      traced.forEach((t, j) => {
        const d = displacement({ baseline: base, scenario: run, selector: t.selector, seconds, geo, centers: t.centers, isLocal, blockOf: index.blockOfLink });
        const a = acc[j];
        a.used += d.displaced; a.side += d.local; a.arterial += d.arterialOnly; a.removed += d.removed; a.unroutable += d.unroutable; a.waiting += d.pending; a.unmatched += d.unmatched;
        for (const [x, n] of d.routes) a.routes.set(x, (a.routes.get(x) ?? 0) + n);
        a.samples.set(Number(k), d.samples);
        for (const [x, n] of d.byBlock) a.blocks.set(x, (a.blocks.get(x) ?? 0) + n);
      });
    });
    const samples = acc.map((a) => mergeSamples(a.samples));
    const perHour = 3600 / seconds / w.seeds.length;
    const items: StoredItem[] = traced.map((t, j) => {
      const a = acc[j];
      return {
        key: scenarioKey([t.iv]), index: t.i, type: t.iv.type, label: w.p.interventions[t.i]?.label ?? t.iv.type,
        usedPerHour: r1(a.used * perHour),
        perHour: { sideStreets: r1(a.side * perHour), stayOnArterials: r1(a.arterial * perHour), removed: r1(a.removed * perHour), unroutable: r1(a.unroutable * perHour), waiting: r1(a.waiting * perHour), unmatched: r1(a.unmatched * perHour) },
        routes: [...a.routes.entries()].filter(([k]) => k !== FAR_ROUTE).sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0])).slice(0, STORED_TOP).map(([streets, n]) => ({ streets, perHour: r1(n * perHour), links: samples[j].get(streets) ?? [] })),
        receiving: [...a.blocks.entries()].sort((x, y) => y[1] - x[1] || x[0] - y[0]).slice(0, STORED_TOP).map(([b, n]) => ({ block: index.blocks[b].label, perHour: r1(n * perHour) })),
      };
    });
    for (const it of items) for (const r of it.routes) {
      const bad = routeProblem(r, geo.linkFrom, geo.linkTo, geo.linkName);
      if (bad) throw new Error(`${w.g.id}/${w.p.id}, "${it.label}", route "${r.streets}": ${bad}. Nothing was written for this proposal.`);
    }
    const out: StoredRedistribution = {
      kind: 'proposal-redistribution', version: STORED_REDIST_VERSION, method: STORED_REDIST_METHOD,
      area, group: w.g.id, proposal: w.p.id, link: w.p.link, period: w.period,
      inputs: { networkHash: w.g.computed.networkHash, demandHash: w.g.computed.demandHash, simulator: engine.fingerprint },
      seeds: w.seeds, seconds, computed: new Date().toISOString(), calibration: w.g.computed.calibration, items,
    };
    await writeFileAtomic(w.path, `${JSON.stringify(out)}\n`);
    log(`  wrote ${redistributionUrl(area, w.g.id, w.p.id)} (${items.length} items), ${Math.round((Date.now() - t0) / 1000)} s so far`);
  }
  log(`Done in ${Math.round((Date.now() - t0) / 1000)} s`);
}

main().catch((e) => { console.error(e); process.exit(1); });
