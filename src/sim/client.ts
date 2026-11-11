import type { Intervention } from '../types';
import type { FromWorker, SimStats, ToWorker } from './protocol';

export interface Frame { time: number; vehicles: Float32Array; signals: Uint8Array }
export interface StatsMsg { time: number; comparing: boolean; scenario: SimStats; baseline: SimStats }

export class SimClient {
  private worker: Worker;
  frame: Frame | null = null;
  onFrame: (() => void) | null = null;
  onStats: ((s: StatsMsg) => void) | null = null;
  onReady: ((engine: 'wasm' | 'mock', reason?: string) => void) | null = null;
  onError: ((m: string) => void) | null = null;

  constructor() {
    this.worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
    this.worker.onmessage = (ev: MessageEvent<FromWorker>) => {
      const m = ev.data;
      if (m.t === 'frame') { this.frame = { time: m.time, vehicles: m.vehicles, signals: m.signals }; this.onFrame?.(); }
      else if (m.t === 'stats') this.onStats?.(m);
      else if (m.t === 'ready') this.onReady?.(m.engine, m.reason);
      else if (m.t === 'error') this.onError?.(m.message);
    };
    this.worker.onerror = (e) => this.onError?.(`Worker failed: ${e.message}`);
  }
  send(m: ToWorker) { this.worker.postMessage(m); }
  setInterventions(list: Intervention[]) { this.send({ t: 'interventions', list }); }
  terminate() { this.worker.terminate(); }
}
