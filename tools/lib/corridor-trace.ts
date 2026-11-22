// One traced hour of today's traffic, read back as the through cars' own routes: for every through car the simulator counted, its reason slot (the simulator's own
// classification, read from the growth of `intentTrips` as the run steps), its trip ends and the links it used, from the trace. Nothing is added to the simulator.
// A car is counted on its first exit from a residential or service street inside the study area at or after time zero, so the counting instant is found in the trace too.
import type { Engine } from './run-result';
import { RUN_SECONDS } from '../../src/lib/run';
import { RESULT_SEED } from '../../src/lib/stored-results';
import type { Metrics } from '../../src/types';

export interface ThroughTrip {
  /** Index into the demand's intents (`intents.length` is Other). */
  slot: number;
  origin: number; dest: number;
  /** Links the car exited, in order, including exits before time zero. */
  links: number[];
}
export interface TraceCheck {
  /** Through cars the simulator counted in the hour, and how many of them this reading matched to a route. */
  counted: number; matched: number;
  /** Cars the simulator counted that no traced route matched (should be 0). */
  unmatched: number;
  /** Steps where two or more counted cars shared the same trip ends and the slots could not tell which route is which (the split between them is arbitrary). */
  ambiguousSteps: number;
  /** Requests whose route events were dropped by the trace's bound (should be 0). */
  skippedEvents: number;
}
export interface TracedHour { trips: ThroughTrip[]; metrics: Metrics; check: TraceCheck }

interface Count { slot: number; o: number; d: number; n: number }
const key = (o: number, d: number) => o * 1_000_003 + d;

interface TraceSim {
  step(x: number): void; time(): number; metrics(): string; intentTrips(): Float32Array;
  traceRequests(): Float64Array; traceEvents(): Uint32Array; traceSummary(): string; free?(): void;
}

/** Step size between reads of the per-reason tally, in seconds. Four simulator steps; a smaller one only costs time. */
const READ_S = 1;
const REQ_STRIDE = 14;
const f32 = (() => { const b = new DataView(new ArrayBuffer(4)); return (bits: number) => { b.setUint32(0, bits); return b.getFloat32(0); }; })();

export function traceThroughHour(e: Engine, network: string, demand: string, period: string, isLocal: (link: number) => boolean, seed = RESULT_SEED): TracedHour {
  const s = new e.Simulation(network, demand, JSON.stringify({ seed, period, demandScale: 1, interventions: [], trace: true })) as unknown as TraceSim;
  try {
    const seen = new Map<string, number>();
    const windows: { t0: number; t1: number; adds: Count[] }[] = [];
    const read = (): Count[] => {
      const a = s.intentTrips();
      const adds: Count[] = [];
      for (let k = 0; k + 3 < a.length; k += 4) {
        const id = `${a[k]}|${a[k + 1]}|${a[k + 2]}`;
        const had = seen.get(id) ?? 0;
        if (a[k + 3] > had) { adds.push({ slot: a[k], o: a[k + 1], d: a[k + 2], n: a[k + 3] - had }); seen.set(id, a[k + 3]); }
      }
      return adds;
    };
    while (s.time() < RUN_SECONDS - 1e-6) {
      const t0 = s.time();
      s.step(Math.min(READ_S, RUN_SECONDS - t0));
      const adds = read();
      if (adds.length) windows.push({ t0, t1: s.time(), adds });
    }
    const metrics = JSON.parse(s.metrics()) as Metrics;
    const summary = JSON.parse(s.traceSummary()) as { detail: { skippedEvents: number } };
    const reqs = s.traceRequests(), ev = s.traceEvents();
    const n = reqs.length / REQ_STRIDE;
    const routes: { link: number; t: number }[][] = Array.from({ length: n }, () => []);
    for (let k = 0; k + 2 < ev.length; k += 3) routes[ev[k]].push({ link: ev[k + 1], t: f32(ev[k + 2]) });
    const byEnds = new Map<number, { req: number; t: number }[]>();
    for (let r = 0; r < n; r++) {
      const hit = routes[r].find((x) => x.t >= 0 && isLocal(x.link));
      if (!hit) continue;
      const k = key(reqs[r * REQ_STRIDE + 4], reqs[r * REQ_STRIDE + 5]);
      (byEnds.get(k) ?? byEnds.set(k, []).get(k)!).push({ req: r, t: hit.t });
    }
    for (const list of byEnds.values()) list.sort((a, b) => a.t - b.t || a.req - b.req);
    const trips: ThroughTrip[] = [];
    let counted = 0, unmatched = 0, ambiguousSteps = 0;
    for (const w of windows) {
      const slots = new Map<number, Set<number>>();
      for (const c of w.adds) {
        counted += c.n;
        const k = key(c.o, c.d);
        (slots.get(k) ?? slots.set(k, new Set()).get(k)!).add(c.slot);
        const list = byEnds.get(k) ?? [];
        for (let i = 0; i < c.n; i++) {
          const at = list.findIndex((x) => x.t >= w.t0 - 1e-6 && x.t < w.t1 - 1e-6);
          if (at < 0) { unmatched++; continue; }
          const [m] = list.splice(at, 1);
          trips.push({ slot: c.slot, origin: c.o, dest: c.d, links: routes[m.req].map((x) => x.link) });
        }
      }
      if ([...slots.values()].some((v) => v.size > 1)) ambiguousSteps++;
    }
    return { trips, metrics, check: { counted, matched: trips.length, unmatched, ambiguousSteps, skippedEvents: summary.detail.skippedEvents } };
  } finally { s.free?.(); }
}
