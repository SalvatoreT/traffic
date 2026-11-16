import type { Metrics } from '../types';
import { formatDiff, formatValue, type Diff, type Kind } from './format';

export interface MetricDef {
  id: string; label: string; kind: Kind; lowerIsBetter: boolean | null;
  get(m: Metrics): number;
}
export interface CardDef { id: string; title: string; note?: string; metrics: MetricDef[] }

export const CARDS: CardDef[] = [
  {
    id: 'cut', title: 'Through traffic on side streets',
    note: 'Through cars are trips that neither start nor end in the study area and that use at least one residential or service street inside the study area, counted once each across all those streets together (cars an hour, averaged over the simulated time so far). The share is the part of all the distance driven on those streets, by every car, that is through traffic. It is a different measure from the car counts on a single street in the Streets table and on the map, which count every car on that block.',
    metrics: [
      { id: 'ctVeh', label: 'Through cars on all side streets', kind: 'flow', lowerIsBetter: true, get: (m) => m.cutThrough.vehiclesPerHour },
      { id: 'ctShare', label: 'Through cars\' share of distance driven on side streets', kind: 'share', lowerIsBetter: true, get: (m) => m.cutThrough.shareOfLocalVehKm },
    ],
  },
  {
    id: 'safety', title: 'Close-following conflicts',
    note: 'A surrogate indicator, not a crash prediction. Counted on residential streets inside the study area only.',
    metrics: [
      { id: 'ttc', label: 'Close-following conflicts (TTC < 1.5 s)', kind: 'count', lowerIsBetter: true, get: (m) => m.safety.ttcConflicts },
    ],
  },
];

/** True when this metrics object comes from a sim build with walking and biking agents, which the map can draw. */
export const hasModes = (m: Metrics | null | undefined): boolean => !!m?.modes && !!m.vulnerable;

export function summarize(base: Metrics, scen: Metrics): string {
  const pick = ['ctVeh', 'ttc'];
  const parts: string[] = [];
  for (const c of CARDS) for (const d of c.metrics) {
    if (!pick.includes(d.id)) continue;
    const df: Diff = formatDiff(d.get(base), d.get(scen), d.kind, d.lowerIsBetter);
    parts.push(`${d.label} ${df.direction === 'same' ? 'about the same' : `${df.direction === 'up' ? 'up' : 'down'} ${df.pct === null ? '' : Math.abs(df.pct).toFixed(0) + '%'}, ${df.verdict}`} at ${formatValue(d.kind, d.get(scen))}`);
  }
  return `Scenario versus baseline after ${Math.round(scen.time / 60)} simulated minutes, on the side streets inside the study area only. ${parts.join('. ')}.`;
}

export interface NetworkHealth {
  gridlockRemoved: number; backlog: number; unroutable: number; inNetwork: number;
  oversaturated: boolean;
}
/** Backlog counts trips waiting to enter; "large" is an absolute or relative threshold (heuristic, not calibrated). */
export function networkHealth(m: Metrics): NetworkHealth {
  const gridlockRemoved = m.gridlockRemoved ?? 0;
  const backlog = m.backlog ?? 0;
  const bigBacklog = backlog >= 50 || (m.spawned >= 100 && backlog / m.spawned > 0.1);
  return {
    gridlockRemoved, backlog, unroutable: m.unroutableTrips ?? 0, inNetwork: m.vehiclesInNetwork ?? 0,
    oversaturated: gridlockRemoved > 0 || bigBacklog,
  };
}
