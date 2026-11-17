import { existsSync, readFileSync } from 'node:fs';
import type { FoundRun } from './assess';

interface PedestrianStation { node: number; period: string; observedPerHour: number; plannedPerHour: number | null }
export interface PedestrianSeedCount {
  node: number; fromMin: number; toMin: number; completedCrossings: number; simulatedPerHour: number;
  observedPerHour: number; plannedPerHourAtScale1: number | null;
}

export function readPedestrianStation(demandFile: string | null): PedestrianStation | null {
  return demandFile && existsSync(demandFile) ? JSON.parse(readFileSync(demandFile, 'utf8')).pedestrianCount ?? null : null;
}

const close = (a: number, b: number) => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= 1e-8 * Math.max(1, Math.abs(b));

/** Only average completed crossings measured at the same station over the same interval. */
export function pedestrianCountLines(view: string, period: string, station: PedestrianStation | null, reports: FoundRun[], seeds: number[]): string[] {
  if (!station || station.period !== period) {
    const unexpected = reports.filter((r) => r.run?.pedestrianCount != null).map((r) => r.seed);
    return unexpected.length ? [`Pedestrian crossings, ${view} demand. No matching observation is configured for ${period}. Readings for seeds ${unexpected.join(', ')} could not be compared.`, ''] : [];
  }
  const requested = [...new Set(seeds)];
  const bySeed = new Map(reports.map((r) => [r.seed, r]));
  const rates: number[] = [], missing: number[] = [], mismatched: number[] = [];
  const windows = new Set<string>();
  for (const seed of requested) {
    const report = bySeed.get(seed), count = report?.run?.pedestrianCount;
    if (!count) { missing.push(seed); continue; }
    const setup = report.manifest?.run, window = setup?.measurementWindow;
    const duration = count.toMin - count.fromMin;
    // Native counters start at the first quarter-second simulation step in the requested window.
    const start = window ? Math.ceil(window.fromMin * 60 * 4) / 4 / 60 : NaN;
    if (!window || setup?.seed !== seed || report.reportSeed !== seed || count.node !== station.node ||
        !close(count.observedPerHour, station.observedPerHour) || (station.plannedPerHour === null ? count.plannedPerHourAtScale1 !== null :
          count.plannedPerHourAtScale1 === null || !close(count.plannedPerHourAtScale1, station.plannedPerHour)) ||
        !Number.isSafeInteger(count.completedCrossings) || count.completedCrossings < 0 || !(duration > 0) ||
        !close(count.toMin, window.toMin) || !close(count.fromMin, start) ||
        !close(count.simulatedPerHour, count.completedCrossings * 60 / duration)) {
      mismatched.push(seed); continue;
    }
    rates.push(count.simulatedPerHour);
    windows.add(`${count.fromMin}–${count.toMin}`);
  }
  const mixed = windows.size > 1;
  const n = mixed ? 0 : rates.length;
  const mean = n ? (rates.reduce((a, b) => a + b, 0) / n).toFixed(1) : 'unavailable';
  const planned = station.plannedPerHour == null ? 'unavailable' : station.plannedPerHour.toFixed(1);
  const details = [
    `Pedestrian crossings at node ${station.node}, ${view} demand (crossings per hour). Observed ${station.observedPerHour.toFixed(1)}, planned at scale 1 ${planned}, seed-mean completed ${mean} (${n} of ${requested.length} requested seed${requested.length === 1 ? '' : 's'}).`,
  ];
  if (missing.length) details.push(`Missing readings for seeds ${missing.join(', ')}.`);
  if (mismatched.length) details.push(`Mismatched readings for seeds ${mismatched.join(', ')}.`);
  if (mixed) details.push(`Measurements span different windows in minutes (${[...windows].join(', ')}).`);
  return [details.join(' '), ''];
}
