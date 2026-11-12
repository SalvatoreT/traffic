import type { Intervention } from '../types';
import type { FromWorker, SimStats, ToWorker } from './protocol';

export interface Frame { time: number; vehicles: Float32Array; signals: Uint8Array; wall: number; rate: number }
export interface StatsMsg { time: number; comparing: boolean; scenario: SimStats; baseline: SimStats; achievedSpeed: number | null }

/** Messages that restart or rebuild the runs. The worker counts them too and tags its reports, so reports from before one are dropped. */
const RESTARTS: ToWorker['t'][] = ['config', 'interventions', 'reset'];

export class SimClient {
  private worker: Worker;
  frame: Frame | null = null;
  private epoch = 0;
  onFrame: (() => void) | null = null;
  onStats: ((s: StatsMsg) => void) | null = null;
  onProgress: ((time: number) => void) | null = null;
  onReady: ((engine: 'wasm' | 'mock', reason?: string) => void) | null = null;
  onBusy: ((busy: boolean) => void) | null = null;
  onError: ((m: string) => void) | null = null;

  constructor() {
    this.worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
    this.worker.onmessage = (ev: MessageEvent<FromWorker>) => {
      const m = ev.data;
      if (m.t === 'frame') { this.frame = { time: m.time, vehicles: m.vehicles, signals: m.signals, wall: m.wall, rate: m.rate }; this.onFrame?.(); }
      else if (m.t === 'stats') { if (m.epoch === this.epoch) this.onStats?.(m); }
      else if (m.t === 'progress') { if (m.epoch === this.epoch) this.onProgress?.(m.time); }
      else if (m.t === 'ready') this.onReady?.(m.engine, m.reason);
      else if (m.t === 'busy') this.onBusy?.(m.busy);
      else if (m.t === 'error') this.onError?.(m.message);
    };
    this.worker.onerror = (e) => this.onError?.(`Worker failed: ${e.message}`);
  }
  send(m: ToWorker) { if (RESTARTS.includes(m.t)) this.epoch++; this.worker.postMessage(m); }
  setInterventions(list: Intervention[]) { this.send({ t: 'interventions', list }); }
  terminate() { this.worker.terminate(); }
}
