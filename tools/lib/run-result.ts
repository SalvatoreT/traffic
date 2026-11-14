import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Intervention, Metrics } from '../../src/types';
import type { SimCtor, SimLike } from '../../src/sim/protocol';
import { clampStep, isFinishedAt } from '../../src/lib/run';
import { RESULT_SEED } from '../../src/lib/stored-results';

const root = resolve(import.meta.dirname, '../..');
/** The seconds the worker steps at a time when running to the end at Max. The result does not depend on it. */
const CHUNK = 15;

export interface HourStats { metrics: Metrics; linkStats: Float32Array; intentLinks: Float32Array | null }
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
  return { metrics: JSON.parse(s.metrics()) as Metrics, linkStats: s.linkStats(), intentLinks: il && il.length ? il : null };
};

/** Same construction as the worker's `make`: both runs start loaded, the scenario's interventions in the config. */
export function build(e: Engine, network: string, demand: string, period: string, interventions: Intervention[], demandScale = 1): SimLike {
  return new e.Simulation(network, demand, JSON.stringify({ seed: RESULT_SEED, period, demandScale, interventions }));
}

export function runToEnd(s: SimLike): HourStats {
  while (!isFinishedAt(s.time())) s.step(clampStep(s.time(), CHUNK));
  return statsOf(s);
}

export function runHour(e: Engine, network: string, demand: string, period: string, interventions: Intervention[]): HourStats {
  const s = build(e, network, demand, period, interventions);
  try { return runToEnd(s); } finally { s.free?.(); }
}
