// Pooling of simulated select-link trips into per-pair through counts (calibration round 39). No I/O.
import type { ThroughMeasured } from './demand-fit';

/** `calibrate --select-od` output: per counted street run, the trips (origin, destination, count) that used any of its links in one seed run. */
export interface SelectOd { period: string; seed: number; minutes: number; blocks: { label: string; links: number[]; trips: [number, number, number][] }[] }

export const throughTargetId = (label: string) => `through ${label}`;

/**
 * Pools seed runs (each set: the runs of one demand). Only trips with neither end in the study area count. `trips` sums, over every run, the veh/h each pair
 * with a counted trip offers in that run's demand, so hits / trips is the pair's share of trips on the street run. Counts are per hour of run.
 */
export function pooledMembership(sets: { label: string; flows: { origin: number; destination: number; vehPerHour: number }[]; sod: SelectOd[] }[], inStudy: Set<number>): ThroughMeasured {
  const hits: Record<string, Record<string, number>> = {};
  const pairs = new Set<string>();
  let runs = 0;
  const perSet: { vph: Map<string, number>; n: number }[] = [];
  for (const s of sets) {
    const vph = new Map<string, number>();
    for (const f of s.flows) { const q = `${f.origin}>${f.destination}`; vph.set(q, (vph.get(q) ?? 0) + f.vehPerHour); }
    for (const r of s.sod) {
      const perH = 60 / r.minutes;
      for (const b of r.blocks) {
        const h = (hits[throughTargetId(b.label)] ??= {});
        for (const [o, d, n] of b.trips) {
          if (inStudy.has(o) || inStudy.has(d)) continue;
          const q = `${o}>${d}`;
          h[q] = (h[q] ?? 0) + n * perH;
          pairs.add(q);
        }
      }
    }
    runs += s.sod.length;
    perSet.push({ vph, n: s.sod.length });
  }
  const trips: Record<string, number> = {};
  for (const q of [...pairs].sort()) trips[q] = Math.round(perSet.reduce((a, p) => a + p.n * (p.vph.get(q) ?? 0), 0) * 100) / 100;
  for (const h of Object.values(hits)) for (const q of Object.keys(h)) h[q] = Math.round(h[q] * 100) / 100;
  return { runs, source: sets.map((s) => s.label).join('; '), hits, trips };
}
