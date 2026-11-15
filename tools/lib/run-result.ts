import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Intervention, Metrics } from '../../src/types';
import type { SimCtor, SimLike } from '../../src/sim/protocol';
import { RUN_SECONDS, clampStep, isFinishedAt } from '../../src/lib/run';
import { RESULT_SEED } from '../../src/lib/stored-results';

const root = resolve(import.meta.dirname, '../..');
/** The seconds the worker steps at a time when running to the end at Max. The result does not depend on it. */
const CHUNK = 15;

export interface HourStats { metrics: Metrics; linkStats: Float32Array; intentLinks: Float32Array | null; intentTrips: Float32Array | null }
export interface Engine { Simulation: SimCtor; fingerprint: string }

/** The same WASM build the app runs, loaded in Node. Needs `npm run wasm`. */
export async function loadEngine(): Promise<Engine> {
  const pkg = (await import('../../src/sim/pkg/traffic_sim.js')) as unknown as {
    initSync(o: { module: BufferSource }): unknown; Simulation: SimCtor; simulatorFingerprint?: () => string;
  };
  pkg.initSync({ module: readFileSync(resolve(root, 'src/sim/pkg/traffic_sim_bg.wasm')) });
  if (typeof pkg.simulatorFingerprint !== 'function') throw new Error('The WASM build has no simulatorFingerprint; run `npm run wasm`.');
  return { Simulation: pkg.Simulation, fingerprint: pkg.simulatorFingerprint() };
}

export const statsOf = (s: SimLike): HourStats => {
  const il = s.intentLinks?.() ?? null;
  const it = s.intentTrips?.() ?? null;
  return { metrics: JSON.parse(s.metrics()) as Metrics, linkStats: s.linkStats(), intentLinks: il && il.length ? il : null, intentTrips: it && it.length ? it : null };
};

/** Same construction as the worker's `make`: both runs start loaded, the scenario's interventions in the config. */
export function build(e: Engine, network: string, demand: string, period: string, interventions: Intervention[], demandScale = 1, seed = RESULT_SEED): SimLike {
  return new e.Simulation(network, demand, JSON.stringify({ seed, period, demandScale, interventions }));
}

export function runToEnd(s: SimLike): HourStats {
  while (!isFinishedAt(s.time())) s.step(clampStep(s.time(), CHUNK));
  return statsOf(s);
}

export function runHour(e: Engine, network: string, demand: string, period: string, interventions: Intervention[]): HourStats {
  const s = build(e, network, demand, period, interventions);
  try { return runToEnd(s); } finally { s.free?.(); }
}

export interface RunOptions { period: string; interventions: Intervention[]; seed?: number; seconds?: number; demandScale?: number }

/** One run of any length, seed and demand level. At the app's defaults (seed 1, 3600 s, demand 1) it is `runHour`. */
export function runFor(e: Engine, network: string, demand: string, o: RunOptions): HourStats {
  const seconds = o.seconds ?? RUN_SECONDS;
  const s = build(e, network, demand, o.period, o.interventions, o.demandScale ?? 1, o.seed ?? RESULT_SEED);
  try {
    while (s.time() < seconds - 1e-6) s.step(Math.min(CHUNK, seconds - s.time()));
    return statsOf(s);
  } finally { s.free?.(); }
}
