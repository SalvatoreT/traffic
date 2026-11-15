/// <reference lib="webworker" />
// The redistribution diagnostic in the browser: the legal-path query at once, and on request the traced baseline, closure and package runs
// for the chosen seeds, analyzed with the same contract as the CLI (src/lib/redistribution.ts).
import * as pkg from './pkg/traffic_sim.js';
import type { Intervention, Network } from '../types';
import { buildIndex } from '../lib/naming';
import { analyzeSeed, geoOf, selectorOf, summarize, type Effect, type GraphQuery, type RedistributionResult, type Role, type SeedAnalysis, type TraceRun, type TraceSummary } from '../lib/redistribution';

export type RedistToWorker =
  | { t: 'graph'; simNetwork: string; period: string; closure: Intervention[]; package: Intervention[] }
  | {
      t: 'run'; simNetwork: string; demand: string; net: Network; period: string; demandScale: number; seeds: number[]; seconds: number;
      closure: Intervention[]; package: Intervention[]; identity: RedistributionResult['identity']; calibration: RedistributionResult['calibration'];
    };
export type RedistFromWorker =
  | { t: 'graph'; closure: GraphQuery; package: GraphQuery }
  | { t: 'progress'; done: number; total: number; label: string }
  | { t: 'result'; result: RedistributionResult }
  | { t: 'error'; message: string };

const ctx = self as unknown as DedicatedWorkerGlobalScope;
const post = (m: RedistFromWorker) => ctx.postMessage(m);
interface Api {
  default(): Promise<unknown>;
  redistributionGraph(network: string, period: string, mode: string, base: string, scen: string): string;
  pairedEffect(d: Float64Array): string;
  Simulation: new (n: string, d: string, c: string) => { step(s: number): void; time(): number; metrics(): string; traceRequests(): Float64Array; traceEvents(): Uint32Array; traceSummary(): string; free?(): void };
}
const api = pkg as unknown as Api;
let ready: Promise<unknown> | null = null;
const load = () => (ready ??= api.default());

function graphs(simNetwork: string, period: string, closure: Intervention[], pk: Intervention[]) {
  const c = JSON.parse(api.redistributionGraph(simNetwork, period, 'car', '[]', JSON.stringify(closure))) as GraphQuery;
  const full = JSON.parse(api.redistributionGraph(simNetwork, period, 'car', '[]', JSON.stringify(pk))) as GraphQuery;
  const mine = new Set(c.closed.map((m) => `${m[0]}>${m[1]}`));
  return { closure: c, package: { ...full, closed: full.closed.filter((m) => mine.has(`${m[0]}>${m[1]}`)), witnesses: full.witnesses.filter((w) => mine.has(`${w.movement[0]}>${w.movement[1]}`)) } };
}

ctx.onmessage = async (ev: MessageEvent<RedistToWorker>) => {
  const m = ev.data;
  try {
    await load();
    if (typeof api.redistributionGraph !== 'function') throw new Error('This build of the simulator has no redistribution diagnostic.');
    if (m.t === 'graph') { post({ t: 'graph', ...graphs(m.simNetwork, m.period, m.closure, m.package) }); return; }
    const g = graphs(m.simNetwork, m.period, m.closure, m.package);
    const geo = geoOf(m.net);
    const centers = g.closure.nodes.map((n) => [m.net.nodes[n].x, m.net.nodes[n].y] as [number, number]);
    const selector = selectorOf(g.closure, 'direct');
    const ivs: Record<Role, Intervention[]> = { baseline: [], closure: m.closure, package: m.package };
    const seeds: SeedAnalysis[] = [];
    const total = m.seeds.length * 3;
    let done = 0;
    for (const seed of m.seeds) {
      const runs = {} as Record<Role, TraceRun>;
      for (const role of ['baseline', 'closure', 'package'] as Role[]) {
        post({ t: 'progress', done, total, label: `seed ${seed}, ${role}` });
        const s = new api.Simulation(m.simNetwork, m.demand, JSON.stringify({ seed, period: m.period, demandScale: m.demandScale, interventions: ivs[role], trace: true }));
        try {
          while (s.time() < m.seconds - 1e-6) s.step(Math.min(60, m.seconds - s.time()));
          runs[role] = { requests: s.traceRequests(), events: s.traceEvents(), summary: JSON.parse(s.traceSummary()) as TraceSummary, metrics: JSON.parse(s.metrics()) as Record<string, unknown> };
        } finally { s.free?.(); }
        done++;
      }
      seeds.push(analyzeSeed({ seed, seconds: m.seconds, runs, selector, centers, geo }));
    }
    const paired = (d: number[]) => JSON.parse(api.pairedEffect(Float64Array.from(d))) as Effect;
    const result = summarize({ seeds, index: buildIndex(m.net), net: m.net, paired, graph: g, identity: m.identity, calibration: m.calibration });
    post({ t: 'result', result });
  } catch (err) {
    post({ t: 'error', message: (err as Error).message ?? String(err) });
  }
};
