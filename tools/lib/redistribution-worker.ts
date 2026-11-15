// One traced run in a worker thread for `simulate --redistribution`: the same WASM build and construction as `run-result.ts`.
import { parentPort, workerData } from 'node:worker_threads';
import { loadEngine } from './run-result';

interface Job { id: number; network: string; demand: string; config: Record<string, unknown>; seconds: number }

const { network, demand } = workerData as { network: string; demand: string };
const enginePromise = loadEngine();

parentPort!.on('message', async (job: Job | null) => {
  if (job === null) { process.exit(0); }
  try {
    const e = await enginePromise;
    const s = new e.Simulation(network, demand, JSON.stringify({ ...job.config, trace: true })) as unknown as {
      step(x: number): void; time(): number; metrics(): string; traceRequests(): Float64Array; traceEvents(): Uint32Array; traceSummary(): string; free?(): void;
    };
    try {
      while (s.time() < job.seconds - 1e-6) s.step(Math.min(15, job.seconds - s.time()));
      const requests = s.traceRequests();
      const events = s.traceEvents();
      parentPort!.postMessage({ id: job.id, requests, events, summary: s.traceSummary(), metrics: s.metrics() }, [requests.buffer as ArrayBuffer, events.buffer as ArrayBuffer]);
    } finally { s.free?.(); }
  } catch (err) {
    parentPort!.postMessage({ id: job.id, error: (err as Error).message ?? String(err) });
  }
});
