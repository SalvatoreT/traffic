export type Snap = 0 | 1 | 2;
export const SNAP_LABELS = ['collapsed', 'half open', 'fully open'] as const;
export const PEEK_PX = 96;
/** Release speed in px/ms above which a drag counts as a flick. */
export const FLICK_PX_PER_MS = 0.5;

/** Sheet heights in px for peek, half and full. */
export function snapHeights(viewportH: number): [number, number, number] {
  return [PEEK_PX, Math.round(viewportH * 0.5), Math.round(viewportH * 0.9)];
}

export function nearestSnap(height: number, heights: readonly number[]): Snap {
  let best = 0;
  for (let i = 1; i < heights.length; i++) if (Math.abs(heights[i] - height) < Math.abs(heights[best] - height)) best = i;
  return best as Snap;
}

/**
 * Snap to choose on release. `velocity` is px/ms with positive meaning the sheet is moving up (growing).
 * A flick goes one position past the nearest one in its direction; otherwise the nearest position wins.
 */
export function decideSnap(height: number, velocity: number, heights: readonly number[]): Snap {
  const n = nearestSnap(height, heights);
  if (Math.abs(velocity) <= FLICK_PX_PER_MS) return n;
  // Dragged past the nearest position in the flick direction already: that position is the target.
  if (velocity > 0) return (height > heights[n] ? Math.min(2, n + 1) : Math.min(2, n + (height === heights[n] ? 1 : 0))) as Snap;
  return (height < heights[n] ? Math.max(0, n - 1) : Math.max(0, n - (height === heights[n] ? 1 : 0))) as Snap;
}

export function stepSnap(s: Snap, key: string): Snap {
  if (key === 'ArrowUp' || key === 'ArrowRight') return Math.min(2, s + 1) as Snap;
  if (key === 'ArrowDown' || key === 'ArrowLeft') return Math.max(0, s - 1) as Snap;
  if (key === 'Home') return 0;
  if (key === 'End') return 2;
  return s;
}

export function cycleSnap(s: Snap): Snap { return ((s + 1) % 3) as Snap; }
