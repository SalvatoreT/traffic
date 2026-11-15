import type { Calibration } from '../types';

/** The area's stated limits of its calibration (`caveat` in the area config, copied into `areas.json`), or null. */
export function calibrationCaveat(cal: Calibration | undefined): string | null {
  const c = (cal as (Calibration & { caveat?: string }) | undefined)?.caveat;
  return typeof c === 'string' && c.trim() ? c.trim() : null;
}

/** A calibrated area with a caveat still shows its banner, so the limits stay visible. */
export const showCalibrationBanner = (cal: Calibration | undefined): boolean => (cal?.status ?? 'uncalibrated') !== 'calibrated' || calibrationCaveat(cal) !== null;

/** The short status the app and the pictures it makes show beside the figures. */
export const calibrationStatusText = (cal: Calibration | undefined): string => ((cal?.status ?? 'uncalibrated') === 'calibrated' ? 'Calibrated, with limits.' : 'Preview, not yet calibrated.');
