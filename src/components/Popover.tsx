import { type ReactNode, useLayoutEffect, useRef } from 'react';
import type * as maplibregl from 'maplibre-gl';

const GAP = 18, MARGIN = 8, ARROW = 16;
type Side = 'right' | 'left' | 'bottom' | 'top';

export interface Box { w: number; h: number }
export interface Placed { x: number; y: number; side: Side; arrow: number }

/** Choose a side of the anchor where the box fits inside the container; otherwise the roomiest, shifted to stay inside. */
export function placePopover(ax: number, ay: number, box: Box, cw: number, ch: number): Placed {
  const fits = (x: number, y: number) => x >= MARGIN && y >= MARGIN && x + box.w <= cw - MARGIN && y + box.h <= ch - MARGIN;
  const cand: Record<Side, { x: number; y: number }> = {
    right: { x: ax + GAP, y: ay - box.h / 2 },
    left: { x: ax - GAP - box.w, y: ay - box.h / 2 },
    bottom: { x: ax - box.w / 2, y: ay + GAP },
    top: { x: ax - box.w / 2, y: ay - GAP - box.h },
  };
  const clampX = (x: number) => Math.max(MARGIN, Math.min(cw - box.w - MARGIN, x));
  const clampY = (y: number) => Math.max(MARGIN, Math.min(ch - box.h - MARGIN, y));
  const order: Side[] = ['right', 'left', 'bottom', 'top'];
  let side: Side | null = null;
  for (const s of order) {
    const c = cand[s];
    const sx = s === 'right' || s === 'left' ? c.x : clampX(c.x), sy = s === 'right' || s === 'left' ? clampY(c.y) : c.y;
    if (fits(sx, sy)) { side = s; break; }
  }
  if (!side) {
    const room: Record<Side, number> = { right: cw - ax, left: ax, bottom: ch - ay, top: ay };
    side = order.reduce((b, s) => (room[s] > room[b] ? s : b), 'right' as Side);
  }
  const horizontal = side === 'right' || side === 'left';
  const x = horizontal ? cand[side].x : clampX(cand[side].x);
  const y = horizontal ? clampY(cand[side].y) : cand[side].y;
  const arrow = horizontal ? Math.max(ARROW, Math.min(box.h - ARROW, ay - y)) : Math.max(ARROW, Math.min(box.w - ARROW, ax - x));
  return { x: horizontal ? Math.max(side === 'left' ? MARGIN : MARGIN, x) : x, y: horizontal ? y : clampY(y), side, arrow };
}

/** A non-modal pop-up tied to a map point. It follows the map and leaves the map to the pointer. */
export function PopoverFrame({ map, anchor, children }: { map: maplibregl.Map; anchor: [number, number]; children: ReactNode }) {
  const el = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const place = () => {
      const node = el.current, parent = node?.parentElement;
      if (!node || !parent) return;
      const pt = map.project(anchor);
      const p = placePopover(pt.x, pt.y, { w: node.offsetWidth, h: node.offsetHeight }, parent.clientWidth, parent.clientHeight);
      node.style.transform = `translate(${Math.round(p.x)}px, ${Math.round(p.y)}px)`;
      node.dataset.side = p.side;
      node.style.setProperty('--arrow', `${Math.round(p.arrow)}px`);
      node.style.visibility = 'visible';
    };
    place();
    map.on('move', place); map.on('resize', place);
    const ro = new ResizeObserver(place);
    if (el.current) ro.observe(el.current);
    return () => { map.off('move', place); map.off('resize', place); ro.disconnect(); };
  }, [map, anchor[0], anchor[1]]); // eslint-disable-line
  return <div ref={el} className="popover" style={{ visibility: 'hidden' }}>{children}</div>;
}
