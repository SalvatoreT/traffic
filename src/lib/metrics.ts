import type { Metrics } from '../types';
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

/** Read a multimodal field; NaN renders as "—" and "not available yet" when the sim build lacks it. */
const mv = (f: (m: Metrics) => number | undefined) => (m: Metrics): number => {
  const v = f(m);
  return v === undefined ? NaN : v;
};

export const MODE_CARDS: CardDef[] = [
  {
    id: 'vulnerable', title: 'People walking and biking',
    note: 'Surrogate indicators, not crash predictions. Walking and biking volumes are assumed, not counted. Injury-risk index is exposure-weighted from vehicle speed at encounters (unitless, for comparing baseline and scenario).',
    metrics: [
      { id: 'pedConf', label: 'Conflicts with vehicles, walking', kind: 'count', lowerIsBetter: true, get: mv((m) => m.vulnerable?.pedConflicts) },
      { id: 'bikeConf', label: 'Conflicts with vehicles, biking', kind: 'count', lowerIsBetter: true, get: mv((m) => m.vulnerable?.bikeConflicts) },
      { id: 'close', label: 'Close passes of cyclists', kind: 'count', lowerIsBetter: true, get: mv((m) => m.vulnerable?.closePasses) },
      { id: 'pedRisk', label: 'Injury-risk index, walking', kind: 'index', lowerIsBetter: true, get: mv((m) => m.vulnerable?.pedInjuryRiskIndex) },
      { id: 'bikeRisk', label: 'Injury-risk index, biking', kind: 'index', lowerIsBetter: true, get: mv((m) => m.vulnerable?.bikeInjuryRiskIndex) },
      { id: 'encSpeed', label: 'Vehicle speed at pedestrian encounters', kind: 'speed', lowerIsBetter: true, get: mv((m) => m.vulnerable?.meanVehicleSpeedAtPedEncounter) },
      { id: 'xdelay', label: 'Pedestrian crossing delay', kind: 'seconds', lowerIsBetter: true, get: mv((m) => m.modes?.pedestrian.meanCrossingDelay) },
    ],
  },
  {
    id: 'bus', title: 'Buses',
    note: 'Run time and speed through the study area, from the published schedule. Dwell time at stops is an assumption.',
    metrics: [
      { id: 'busTime', label: 'Mean run time through the area', kind: 'minutes', lowerIsBetter: true, get: mv((m) => m.modes?.bus.meanRunTime) },
      { id: 'busSpeed', label: 'Mean bus speed', kind: 'speed', lowerIsBetter: false, get: mv((m) => m.modes?.bus.meanSpeed) },
      { id: 'busRuns', label: 'Completed runs', kind: 'count', lowerIsBetter: false, get: mv((m) => m.modes?.bus.completedRuns) },
    ],
  },
  {
    id: 'modetrips', title: 'Trips by mode',
    note: 'Walking and biking volumes are assumed, not counted.',
    metrics: [
      { id: 'carTrips', label: 'Car trips', kind: 'count', lowerIsBetter: false, get: mv((m) => m.modes?.car.completedTrips) },
      { id: 'carTime', label: 'Car mean trip time', kind: 'minutes', lowerIsBetter: true, get: mv((m) => m.modes?.car.meanTripTime) },
      { id: 'bikeTrips', label: 'Bicycle trips', kind: 'count', lowerIsBetter: false, get: mv((m) => m.modes?.bicycle.completedTrips) },
      { id: 'bikeTime', label: 'Bicycle mean trip time', kind: 'minutes', lowerIsBetter: true, get: mv((m) => m.modes?.bicycle.meanTripTime) },
      { id: 'pedTrips', label: 'Walking trips', kind: 'count', lowerIsBetter: false, get: mv((m) => m.modes?.pedestrian.completedTrips) },
      { id: 'pedTime', label: 'Walking mean trip time', kind: 'minutes', lowerIsBetter: true, get: mv((m) => m.modes?.pedestrian.meanTripTime) },
    ],
  },
];

export type ModeCardId = 'vulnerable' | 'bus' | 'modetrips';

/** True when this metrics object comes from a multimodal sim build. */
export const hasModes = (m: Metrics | null | undefined): boolean => !!m?.modes && !!m.vulnerable;

/** Which agent group a card describes, for the "no agents of this mode" state. */
export function emptyMode(card: ModeCardId, ms: (Metrics | null)[]): string | null {
  const live = ms.filter((m): m is Metrics => !!m?.modes);
  if (!live.length) return null;
  const none = (f: (m: Metrics) => number) => live.every((m) => f(m) === 0);
  if (card === 'bus' && none((m) => m.modes!.bus.inNetwork + m.modes!.bus.completedRuns)) {
    return 'No buses are in the model for this area, so there are no bus results.';
  }
  if (card === 'vulnerable' && none((m) => m.modes!.pedestrian.inNetwork + m.modes!.bicycle.inNetwork + m.modes!.pedestrian.completedTrips + m.modes!.bicycle.completedTrips)) {
    return 'No people walking or biking are in the model for this area, so there are no safety indicators.';
  }
  return null;
}

function phrase(label: string, d: Diff): string {
  if (d.direction === 'same') return `${label} about the same`;
  return `${label} ${d.direction === 'up' ? 'up' : 'down'}${d.pct === null ? '' : ` ${Math.abs(d.pct).toFixed(0)}%`}, ${d.verdict}`;
}

/** One sentence on walking and biking safety, or '' when the sim build or run lacks the numbers. */
export function vulnerableSentence(base: Metrics, scen: Metrics): string {
  const b = base.vulnerable, s = scen.vulnerable;
  if (!b || !s) return '';
  const ped = formatDiff(b.pedConflicts, s.pedConflicts, 'count', true);
  const bike = formatDiff(b.bikeConflicts, s.bikeConflicts, 'count', true);
  const risk = formatDiff(b.pedInjuryRiskIndex + b.bikeInjuryRiskIndex, s.pedInjuryRiskIndex + s.bikeInjuryRiskIndex, 'index', true);
  return `For people walking and biking: ${phrase('pedestrian conflicts', ped)}; ${phrase('cyclist conflicts', bike)}; ${phrase('combined injury-risk index', risk)} (surrogate indicators, assumed volumes).`;
}

export function summarize(base: Metrics, scen: Metrics): string {
  const pick = ['ctKm', 'meanSpeed', 'ttc', 'trip', 'art'];
  const parts: string[] = [];
  for (const c of CARDS) for (const d of c.metrics) {
    if (!pick.includes(d.id)) continue;
    const df: Diff = formatDiff(d.get(base), d.get(scen), d.kind, d.lowerIsBetter);
    parts.push(`${d.label} ${df.direction === 'same' ? 'about the same' : `${df.direction === 'up' ? 'up' : 'down'} ${df.pct === null ? '' : Math.abs(df.pct).toFixed(0) + '%'}, ${df.verdict}`} at ${formatValue(d.kind, d.get(scen))}`);
  }
  const vul = vulnerableSentence(base, scen);
  return `Scenario versus baseline after ${Math.round(scen.time / 60)} simulated minutes. ${parts.join('. ')}.${vul ? ` ${vul}` : ''}`;
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
