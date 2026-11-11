import type { Intervention, Metrics } from '../types';

export interface SimStats {
  metrics: Metrics | null;
  linkStats: Float32Array | null;
}

export type ToWorker =
  | {
      t: 'init'; network: string; demand: string; mock: boolean; period: string; demandScale: number;
      seed: number; interventions: Intervention[]; speed: number; running: boolean;
    }
  | { t: 'run'; running: boolean }
  | { t: 'speed'; speed: number }
  | { t: 'config'; period: string; demandScale: number }
  | { t: 'interventions'; list: Intervention[] }
  | { t: 'reset' };

export type FromWorker =
  | { t: 'ready'; engine: 'wasm' | 'mock'; reason?: string }
  | { t: 'frame'; time: number; vehicles: Float32Array; signals: Uint8Array }
  | { t: 'stats'; time: number; comparing: boolean; scenario: SimStats; baseline: SimStats }
  | { t: 'error'; message: string };

/** Shape shared by the WASM `Simulation` class and the TS mock. */
export interface SimLike {
  setInterventions(json: string): void;
  step(seconds: number): void;
  time(): number;
  vehicles(): Float32Array;
  signals(): Uint8Array;
  linkStats(): Float32Array;
  metrics(): string;
  reset(): void;
  free?(): void;
}
export interface SimCtor { new (network: string, demand: string, config: string): SimLike }
export const VEHICLE_STRIDE = 6;
