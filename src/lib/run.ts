import type { AreaEntry, DemandPeriod } from '../types';

/** One run covers one simulated hour of the chosen period. */
export const RUN_SECONDS = 3600;
const EPS = 1e-6;

export interface RunState { running: boolean; finished: boolean; time: number }
export type RunAction =
  | { type: 'time'; time: number }
  | { type: 'toggle' }
  /** Period, demand, scenario or reset changed: both runs restart from t=0. A finished run starts playing again. */
  | { type: 'restart' };

export const initialRun = (running: boolean): RunState => ({ running, finished: false, time: 0 });
export const isFinishedAt = (t: number): boolean => t >= RUN_SECONDS - EPS;

export function runReducer(s: RunState, a: RunAction): RunState {
  switch (a.type) {
    case 'time': {
      const time = Math.min(RUN_SECONDS, Math.max(0, a.time));
      return isFinishedAt(time) ? { running: false, finished: true, time: RUN_SECONDS } : { ...s, time };
    }
    case 'toggle': return s.finished ? { running: true, finished: false, time: 0 } : { ...s, running: !s.running };
    case 'restart': return { running: s.finished ? true : s.running, finished: false, time: 0 };
  }
}

/** Seconds the worker may step now so the clock never passes the end of the run. */
export const clampStep = (time: number, want: number): number => Math.max(0, Math.min(want, RUN_SECONDS - time));

/** The area's `defaultPeriod`, else `midday`, else the first period. */
export function defaultPeriod(entry: Pick<AreaEntry, 'defaultPeriod'>, periods: Pick<DemandPeriod, 'id'>[]): string {
  const ids = periods.map((p) => p.id);
  if (entry.defaultPeriod && ids.includes(entry.defaultPeriod)) return entry.defaultPeriod;
  return ids.includes('midday') ? 'midday' : ids[0] ?? '';
}

/** Periods named in `experimentalPeriods`; without that field, ids containing "peak" until the area is calibrated. */
export function isExperimentalPeriod(entry: Pick<AreaEntry, 'experimentalPeriods' | 'calibration'>, id: string): boolean {
  if (entry.experimentalPeriods) return entry.experimentalPeriods.includes(id);
  return entry.calibration?.status !== 'calibrated' && id.includes('peak');
}

export const EXPERIMENTAL_NOTE = 'Peak periods are not calibrated yet and overload the network. Compare with care.';
