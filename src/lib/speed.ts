/** Below this share of the requested speed the toolbar starts reporting the achieved speed. */
export const SLOW_BELOW = 0.85;
/** Back at or above this share the note is removed (the gap avoids flicker around the threshold). */
export const OK_ABOVE = 0.93;

/**
 * Next achieved speed to display, or null for none. Keeps the previous value unless the new one differs
 * materially, so a polite live region announces a change rarely rather than on every stats tick.
 */
export function nextSpeedShown(prev: number | null, requested: number, achieved: number | null): number | null {
  if (achieved === null || !Number.isFinite(achieved)) return prev;
  if (achieved >= requested * OK_ABOVE) return null;
  if (prev === null) return achieved < requested * SLOW_BELOW ? roundSpeed(achieved) : null;
  const next = roundSpeed(achieved);
  return Math.abs(next - prev) >= Math.max(2, prev * 0.15) ? next : prev;
}

export function roundSpeed(v: number): number {
  return v >= 10 ? Math.round(v) : Math.round(v * 10) / 10;
}

export function speedNoteText(requested: number, shown: number | null): string {
  return shown === null ? '' : `${requested}× requested, running about ${shown}×`;
}

/** Speed value meaning "run to the end of the period without drawing frames". */
export const INSTANT = Infinity;
export const isInstant = (speed: number): boolean => speed === INSTANT;
export const speedLabel = (speed: number): string => (isInstant(speed) ? 'Max' : `${speed}×`);
export const DEFAULT_SPEED = 20;
