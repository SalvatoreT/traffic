import type { NetIndex } from './naming';

/** A transient pointer or focus highlight on the map. It never changes the selection or the camera. */
export type Hover = { kind: 'block'; block: number } | { kind: 'node'; node: number };

export const sameHover = (a: Hover | null, b: Hover | null): boolean =>
  a === b || (!!a && !!b && a.kind === b.kind && (a.kind === 'block' ? a.block === (b as typeof a).block : a.node === (b as typeof a).node));

/** Links to outline and the intersection to ring for a highlight. */
export function hoverTargets(idx: NetIndex, h: Hover | null): { links: number[]; node: number | null } {
  if (!h) return { links: [], node: null };
  return h.kind === 'block' ? { links: idx.blocks[h.block]?.links ?? [], node: null } : { links: [], node: h.node };
}

export interface HoverHandlers { onMouseEnter(): void; onMouseLeave(): void; onFocus(): void; onBlur(): void }

/** Pointer and focus handlers that set a highlight on entry and clear it on exit. */
export function hoverHandlers(set: (h: Hover | null) => void, h: Hover): HoverHandlers {
  const on = () => set(h), off = () => set(null);
  return { onMouseEnter: on, onMouseLeave: off, onFocus: on, onBlur: off };
}
