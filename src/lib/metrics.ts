import type { Metrics, Units } from '../types';
import { formatDiff, formatValue, type Diff, type Kind } from './format';

export interface MetricDef {
  id: string; label: string; kind: Kind; lowerIsBetter: boolean | null;
  get(m: Metrics): number;
  hint?: string;
}
export interface CardDef { id: string; title: string; note?: string; metrics: MetricDef[] }

export const CARDS: CardDef[] = [
  {
    id: 'cut', title: 'Cut-through traffic',
    note: 'Gate-to-gate trips on residential and service streets inside the study area.',
    metrics: [
      { id: 'ctKm', label: 'Cut-through distance', kind: 'dist', lowerIsBetter: true, get: (m) => m.cutThrough.vehKm },
      { id: 'ctShare', label: 'Share of local traffic', kind: 'share', lowerIsBetter: true, get: (m) => m.cutThrough.shareOfLocalVehKm },
    ],
  },
  {
    id: 'safety', title: 'Safety indicators',
    note: 'Surrogate indicators, not crash predictions. Local = residential streets in the study area.',
    metrics: [
      { id: 'meanSpeed', label: 'Local mean speed', kind: 'speed', lowerIsBetter: true, get: (m) => m.safety.localMeanSpeed },
      { id: 'p85', label: 'Local 85th-percentile speed', kind: 'speed', lowerIsBetter: true, get: (m) => m.safety.localP85Speed },
      { id: 'a20', label: 'Share above 20 mph', kind: 'share', lowerIsBetter: true, get: (m) => m.safety.shareAbove20mph },
      { id: 'a25', label: 'Share above 25 mph', kind: 'share', lowerIsBetter: true, get: (m) => m.safety.shareAbove25mph },
      { id: 'ttc', label: 'Close-following conflicts (TTC < 1.5 s)', kind: 'count', lowerIsBetter: true, get: (m) => m.safety.ttcConflicts },
    ],
  },
  {
    id: 'delay', title: 'Delay and throughput',
    metrics: [
      { id: 'trip', label: 'Mean trip time', kind: 'minutes', lowerIsBetter: true, get: (m) => m.meanTripTime },
      { id: 'delay', label: 'Mean trip delay', kind: 'minutes', lowerIsBetter: true, get: (m) => m.meanTripDelay },
      { id: 'done', label: 'Completed trips', kind: 'count', lowerIsBetter: false, get: (m) => m.completedTrips },
      { id: 'art', label: 'Arterial mean speed', kind: 'speed', lowerIsBetter: false, get: (m) => m.arterialMeanSpeed },
      { id: 'unr', label: 'Unroutable trips', kind: 'count', lowerIsBetter: true, get: (m) => m.unroutableTrips },
    ],
  },
];

export function summarise(base: Metrics, scen: Metrics, units: Units): string {
  const pick = ['ctKm', 'meanSpeed', 'ttc', 'trip', 'art'];
  const parts: string[] = [];
  for (const c of CARDS) for (const d of c.metrics) {
    if (!pick.includes(d.id)) continue;
    const df: Diff = formatDiff(d.get(base), d.get(scen), d.kind, units, d.lowerIsBetter);
    parts.push(`${d.label} ${df.direction === 'same' ? 'about the same' : `${df.direction === 'up' ? 'up' : 'down'} ${df.pct === null ? '' : Math.abs(df.pct).toFixed(0) + '%'}, ${df.verdict}`} at ${formatValue(d.kind, d.get(scen), units)}`);
  }
  return `Scenario versus baseline after ${Math.round(scen.time / 60)} simulated minutes. ${parts.join('. ')}.`;
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
