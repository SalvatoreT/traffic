// Measured control delay per approach link, for the static assignment of the demand fit (calibration round 44).
// The router adds a control delay per movement at the end of an approach link. Constants by control type (crates/sim/data/node-delays.json) are the default; where the
// simulator's baseline runs carried enough cars on an approach, the approach's own measured delay replaces the constant. No I/O except `readControlDelays`.
import { existsSync, readFileSync } from 'node:fs';
import type { ALink, ANode } from './assign';

/** Mean flow (veh/h over the kept seeds) an approach needs for its delay to count as measured. ASSUMPTION: the 20 veh/h cut that tools/node-delays.ts already uses for the control constants. */
export const MIN_APPROACH_FLOW_VEH_PER_HOUR = 20;

export interface ControlDelayFile {
  schema: 1;
  area: string;
  /** `shipped` or `training`: the demand view the runs were made on. */
  view: string;
  /** SHA-256 of the network file the runs and the approach ids refer to. */
  network: string;
  /** Simulator fingerprint of the runs. */
  simulator: string;
  /** Demand the runs were made on. */
  measuredOn: { file: string; sha256: string };
  seeds: number[];
  minutes: number;
  minFlowVehPerHour: number;
  /** Delay of links that end at no control and carry no hump, flow-weighted median per period (s): the part of a controlled approach's delay that is not control (car following, turn slowdown). */
  baseDelayS: Record<string, number>;
  /** Period -> link id -> control delay (s) of the approach. */
  delayS: Record<string, Record<string, number>>;
  note?: string;
}

export interface LinkRun { flow: ArrayLike<number>; delay: ArrayLike<number> }

/** Flow-weighted median (the middle car's value) of `d` with weights `w`. */
export function weightedMedian(d: number[], w: number[]): number {
  const idx = d.map((_, i) => i).sort((a, b) => d[a] - d[b]);
  const total = w.reduce((a, b) => a + b, 0);
  let acc = 0;
  for (const i of idx) { acc += w[i]; if (acc >= total / 2) return d[i]; }
  return NaN;
}

/** Whether an approach link has a control delay in the router: a signal, an all-way stop, a circle, or the minor approach of a two-way stop. */
export function controlled(node: ANode, minorApproach: boolean): boolean {
  return node.control === 'signal' || node.control === 'all_way_stop' || node.control === 'traffic_circle' || (node.control === 'two_way_stop' && minorApproach);
}

/**
 * Control delay per controlled approach from the seeds of one period: the flow-weighted mean delay per car on the link (stop at its end included) over the seeds,
 * less `baseDelayS`, floored at zero. Approaches under `minFlow` veh/h are left out (the router keeps its constant). Same derivation as the constants of tools/node-delays.ts,
 * but per approach and with the mean instead of the group median.
 */
export function approachDelays(nodes: ANode[], links: ALink[], minor: boolean[], runs: LinkRun[], minFlow = MIN_APPROACH_FLOW_VEH_PER_HOUR): { baseDelayS: number; delayS: Record<string, number> } {
  const nodeBy = new Map(nodes.map((n) => [n.id, n]));
  const nL = links.length;
  const flow = new Float64Array(nL), dsum = new Float64Array(nL);
  for (const r of runs) for (let l = 0; l < nL; l++) { flow[l] += r.flow[l]; dsum[l] += r.flow[l] * r.delay[l]; }
  const bd: number[] = [], bw: number[] = [];
  for (let l = 0; l < nL; l++) {
    const n = nodeBy.get(links[l].to)!;
    if (flow[l] / runs.length < minFlow || links[l].class === 'motorway' || n.control !== 'uncontrolled' || links[l].humps?.length) continue;
    bd.push(dsum[l] / flow[l]); bw.push(flow[l]);
  }
  const base = weightedMedian(bd, bw);
  const out: Record<string, number> = {};
  for (let l = 0; l < nL; l++) {
    if (flow[l] / runs.length < minFlow || links[l].class === 'motorway' || !controlled(nodeBy.get(links[l].to)!, minor[l])) continue;
    out[String(links[l].id)] = Math.round(Math.max(0, dsum[l] / flow[l] - base) * 10) / 10;
  }
  return { baseDelayS: Math.round(base * 100) / 100, delayS: out };
}

export interface ControlDelayExpect { area: string; view: string; network: string; simulator: string }
export type ControlDelayLoad = { used: true; file: ControlDelayFile } | { used: false; reason: string | null };

/** Reads the file if there is one. A file that does not match the build (area, view, network, simulator) is refused with a reason the caller must report; no file is silent. */
export function readControlDelays(path: string | undefined, expect: ControlDelayExpect): ControlDelayLoad {
  if (!path || !existsSync(path)) return { used: false, reason: null };
  const f = JSON.parse(readFileSync(path, 'utf8')) as ControlDelayFile;
  const bad: string[] = [];
  if (f.schema !== 1) bad.push(`schema ${f.schema}`);
  if (f.area !== expect.area) bad.push(`area ${f.area}, build ${expect.area}`);
  if (f.view !== expect.view) bad.push(`view ${f.view}, build ${expect.view}`);
  if (f.network !== expect.network) bad.push(`network ${String(f.network).slice(0, 12)}, build ${expect.network.slice(0, 12)}`);
  if (f.simulator !== expect.simulator) bad.push(`simulator ${String(f.simulator).slice(0, 12)}, build ${expect.simulator.slice(0, 12)}`);
  return bad.length ? { used: false, reason: `${path} does not match this build (${bad.join('; ')}); control delays fall back to the constants` } : { used: true, file: f };
}

/** Per-link array for `buildGraph`: the approach's measured delay, NaN where the constant stays. */
export function controlDelayArray(links: ALink[], period: string, f: ControlDelayFile | undefined): Float64Array | undefined {
  const d = f?.delayS[period];
  if (!d) return undefined;
  return Float64Array.from(links, (l) => d[String(l.id)] ?? NaN);
}
