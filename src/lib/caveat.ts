import type { Calibration } from '../types';

/** The area's stated limits of its calibration (`caveat` in the area config, copied into `areas.json`), or null. */
export function calibrationCaveat(cal: Calibration | undefined): string | null {
  const c = (cal as (Calibration & { caveat?: string }) | undefined)?.caveat;
  return typeof c === 'string' && c.trim() ? c.trim() : null;
}

/** A calibrated area with a caveat still shows its banner, so the limits stay visible. */
export const showCalibrationBanner = (cal: Calibration | undefined): boolean => (cal?.status ?? 'uncalibrated') !== 'calibrated' || calibrationCaveat(cal) !== null;
