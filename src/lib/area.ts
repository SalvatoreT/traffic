import type { Network } from '../types';
import { makeProjection } from './projection';

/** The map shows, and pickers and tables list, the study area plus everything within this distance of its outline. */
export const REGION_BUFFER_M = 250;

export function ringLocal(net: Network): [number, number][] {
  const ring = net.studyArea;
  if (!ring || ring.length < 3) return [];
  const p = makeProjection(net.origin);
  return ring.map(([lon, lat]) => p.toLocal(lon, lat));
}

export function inRing(ring: [number, number][], x: number, y: number): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export function distToRing(ring: [number, number][], x: number, y: number): number {
  let best = Infinity;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const ax = ring[j][0], ay = ring[j][1], dx = ring[i][0] - ax, dy = ring[i][1] - ay;
    const l2 = dx * dx + dy * dy;
    const t = l2 > 0 ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / l2)) : 0;
    const d = Math.hypot(x - (ax + t * dx), y - (ay + t * dy));
    if (d < best) best = d;
  }
  return best;
}

export interface Focus {
  /** Per node id: in the study area or within the buffer of its outline. */
  node: boolean[];
  /** Per link id: flagged in the study area, or any vertex inside / within the buffer. */
  link: boolean[];
}

/** Which nodes and links belong to the visible region: the study area plus a buffer around its outline. */
export function computeFocus(net: Network, bufferM = REGION_BUFFER_M): Focus {
  const ring = ringLocal(net);
  const near = (x: number, y: number) => ring.length > 0 && (inRing(ring, x, y) || distToRing(ring, x, y) <= bufferM);
  const node = net.nodes.map((n) => n.inStudyArea || near(n.x, n.y));
  const link = net.links.map((l) => l.inStudyArea || node[l.from] || node[l.to] || l.geometry.some(([x, y]) => near(x, y)));
  return { node, link };
}
