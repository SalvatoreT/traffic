import { SAFETY_VERSION, type Metrics, type Network, type SeveritySummary } from '../types';
import { linkMeasured } from './scope';
import { formatDiff, formatValue, type Diff, type Kind } from './format';

export interface MetricDef {
  id: string; label: string; kind: Kind; lowerIsBetter: boolean | null;
  get(m: Metrics): number;
  hint?: string;
  /** Why the value is unavailable, when it is. */
  why?(m: Metrics): string | null;
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
    id: 'safety', title: 'Safety indicators',
    note: 'Surrogate indicators, not crash predictions. Local = residential streets inside the study area; streets outside it are not counted.',
    metrics: [
      { id: 'meanSpeed', label: 'Local mean speed', kind: 'speed', lowerIsBetter: true, get: (m) => m.safety.localMeanSpeed },
      { id: 'p85', label: 'Local 85th-percentile speed', kind: 'speed', lowerIsBetter: true, get: (m) => m.safety.localP85Speed },
      { id: 'a20', label: 'Share above 20 mph', kind: 'share', lowerIsBetter: true, get: (m) => m.safety.shareAbove20mph },
      { id: 'a25', label: 'Share above 25 mph', kind: 'share', lowerIsBetter: true, get: (m) => m.safety.shareAbove25mph },
      { id: 'ttc', label: 'Close-following conflicts (TTC < 1.5 s)', kind: 'count', lowerIsBetter: true, get: (m) => m.safety.ttcConflicts },
    ],
  },
];

/** Read a multimodal field; NaN renders as "—" and "not available yet" when the sim build lacks it. */
const mv = (f: (m: Metrics) => number | undefined) => (m: Metrics): number => {
  const v = f(m);
  return v === undefined ? NaN : v;
};

/** The safety block in the current meaning; legacy results (no version, or an older one) read as unavailable. */
export const currentSafety = (m: Metrics | null | undefined) => (m?.vulnerable?.safetyVersion === SAFETY_VERSION ? m.vulnerable : null);
export const isLegacySafety = (m: Metrics | null | undefined): boolean => !!m?.vulnerable && m.vulnerable.safetyVersion !== SAFETY_VERSION;

const sev = (pick: (v: NonNullable<ReturnType<typeof currentSafety>>) => SeveritySummary) => ({
  mean: mv((m) => { const v = currentSafety(m); return v ? pick(v).meanSeverity ?? NaN : undefined; }),
  count: (f: (s: SeveritySummary) => number) => mv((m) => { const v = currentSafety(m); return v ? f(pick(v)) : undefined; }),
  why: (m: Metrics): string | null => {
    if (isLegacySafety(m)) return 'computed with an older safety definition';
    const v = currentSafety(m);
    return v ? pick(v).unavailable : null;
  },
});
const pedSev = sev((v) => v.pedestrian), bikeSev = sev((v) => v.cyclist);

export const MODE_CARDS: CardDef[] = [
  {
    id: 'vulnerable', title: 'People walking and biking',
    note: 'Surrogate indicators, not crash predictions. Walking and biking volumes are assumed, not counted. Severity is the average injury probability the cited study gives for an encounter, over the encounters its crash geometry covers. Walking (serious injury, AIS 4+; Tefft 2013) and biking (at least serious injury, MAIS 3+; Lubbe 2022) are different injury levels, so they are never added together. A mean does not show how many encounters there were: read it with the counts. Biking passes on shared streets are not a crash geometry the study covers, so they are counted but not scored.',
    metrics: [
      { id: 'pedConf', label: 'Conflicts with vehicles, walking', kind: 'count', lowerIsBetter: true, get: mv((m) => m.vulnerable?.pedConflicts) },
      { id: 'bikeConf', label: 'Conflicts with vehicles, biking', kind: 'count', lowerIsBetter: true, get: mv((m) => m.vulnerable?.bikeConflicts) },
      { id: 'close', label: 'Close passes of cyclists', kind: 'count', lowerIsBetter: true, get: mv((m) => m.vulnerable?.closePasses) },
      { id: 'pedEnc', label: 'Encounters scored, walking', kind: 'count', lowerIsBetter: null, get: pedSev.count((s) => s.supported) },
      { id: 'pedSev', label: 'Injury severity per encounter, walking (AIS 4+)', kind: 'index', lowerIsBetter: null, get: pedSev.mean, why: pedSev.why },
      { id: 'bikeEnc', label: 'Encounters scored, biking (crossing paths)', kind: 'count', lowerIsBetter: null, get: bikeSev.count((s) => s.supported) },
      { id: 'bikeUnsup', label: 'Encounters not scored, biking (passes and near-parallel paths)', kind: 'count', lowerIsBetter: null, get: bikeSev.count((s) => s.unsupported) },
      { id: 'bikeSev', label: 'Injury severity per scored encounter, biking (MAIS 3+)', kind: 'index', lowerIsBetter: null, get: bikeSev.mean, why: bikeSev.why },
      { id: 'encSpeed', label: 'Vehicle speed at pedestrian encounters', kind: 'speed', lowerIsBetter: true, get: mv((m) => m.vulnerable?.meanVehicleSpeedAtPedEncounter ?? (m.vulnerable ? NaN : undefined)) },
      { id: 'xdelay', label: 'Pedestrian crossing delay', kind: 'seconds', lowerIsBetter: true, get: mv((m) => m.modes?.pedestrian.meanCrossingDelay) },
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

export type ModeCardId = 'vulnerable' | 'modetrips';

/** True when this metrics object comes from a multimodal sim build. */
export const hasModes = (m: Metrics | null | undefined): boolean => !!m?.modes && !!m.vulnerable;

/** Which agent group a card describes, for the "no agents of this mode" state. */
export function emptyMode(card: ModeCardId, ms: (Metrics | null)[]): string | null {
  const live = ms.filter((m): m is Metrics => !!m?.modes);
  if (!live.length) return null;
  const none = (f: (m: Metrics) => number) => live.every((m) => f(m) === 0);
  if (card === 'vulnerable' && none((m) => m.modes!.pedestrian.inNetwork + m.modes!.bicycle.inNetwork + m.modes!.pedestrian.completedTrips + m.modes!.bicycle.completedTrips)) {
    return 'No people walking or biking are in the model for this area, so there are no safety indicators.';
  }
  return null;
}

function phrase(label: string, d: Diff): string {
  if (d.direction === 'same') return `${label} about the same`;
  return `${label} ${d.direction === 'up' ? 'up' : 'down'}${d.pct === null ? '' : ` ${Math.abs(d.pct).toFixed(0)}%`}, ${d.verdict}`;
}

const sevText = (label: string, endpoint: string, b: SeveritySummary, s: SeveritySummary): string => {
  const n = (x: SeveritySummary) => `${x.supported} scored`;
  if (b.meanSeverity === null || s.meanSeverity === null) {
    return `${label} severity (${endpoint}) unavailable where no encounter was scored (baseline ${n(b)}, scenario ${n(s)})`;
  }
  const d = formatDiff(b.meanSeverity, s.meanSeverity, 'index', null);
  const change = d.direction === 'same' ? 'about the same' : `${d.direction === 'up' ? 'up' : 'down'}${d.pct === null ? '' : ` ${Math.abs(d.pct).toFixed(0)}%`}`;
  return `${label} severity per scored encounter (${endpoint}) ${change} (baseline ${n(b)}, scenario ${n(s)} encounters)`;
};

/** One sentence on walking and biking safety, or '' when the sim build or run lacks the numbers or has the older safety meaning. */
export function vulnerableSentence(base: Metrics, scen: Metrics): string {
  const b = currentSafety(base), s = currentSafety(scen);
  if (!b || !s) return '';
  const ped = formatDiff(b.pedConflicts, s.pedConflicts, 'count', true);
  const bike = formatDiff(b.bikeConflicts, s.bikeConflicts, 'count', true);
  return `For people walking and biking: ${phrase('pedestrian conflicts', ped)}; ${phrase('cyclist conflicts', bike)}; ${sevText('walking', 'AIS 4+', b.pedestrian, s.pedestrian)}; ${sevText('biking', 'MAIS 3+', b.cyclist, s.cyclist)}; the two injury levels are not combined (surrogate indicators, assumed volumes).`;
}

export function summarize(base: Metrics, scen: Metrics): string {
  const pick = ['ctVeh', 'meanSpeed', 'ttc'];
  const parts: string[] = [];
  for (const c of CARDS) for (const d of c.metrics) {
    if (!pick.includes(d.id)) continue;
    const df: Diff = formatDiff(d.get(base), d.get(scen), d.kind, d.lowerIsBetter);
    parts.push(`${d.label} ${df.direction === 'same' ? 'about the same' : `${df.direction === 'up' ? 'up' : 'down'} ${df.pct === null ? '' : Math.abs(df.pct).toFixed(0) + '%'}, ${df.verdict}`} at ${formatValue(d.kind, d.get(scen))}`);
  }
  return `Scenario versus baseline after ${Math.round(scen.time / 60)} simulated minutes, inside the study area only. ${parts.join('. ')}.`;
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

/** Vehicle-time-weighted mean speed (m/s) over the study-area streets that are not side streets, from link stats (stride 4: flow veh/h, speed m/s, cut, density); NaN when none carries traffic. */
export function boundingMeanSpeed(net: Network, stats: Float32Array | null): number {
  if (!stats) return NaN;
  let w = 0, ws = 0;
  for (const l of net.links) {
    if (!linkMeasured(l) || l.class === 'residential' || l.class === 'service') continue;
    const flow = stats[l.id * 4], v = stats[l.id * 4 + 1];
    if (!(flow > 0) || !(v > 0)) continue;
    const t = (flow * l.length) / v;
    w += t; ws += t * v;
  }
  return w > 0 ? ws / w : NaN;
}
