import type { Network } from '../types';
import { pointAlong, polylineLength } from './geom';

export type TurnKind = 'left' | 'right' | 'straight' | 'u-turn';

type XY = [number, number];
/** A turn whose heading changes by less than this is straight on, and more than its complement a U-turn (degrees). */
const STRAIGHT_DEG = 25;
const U_DEG = 155;

export interface TurnGeometry {
  turn: TurnKind;
  /** Where the arrow leaves the approach link, the corner it turns round and where it enters the exit link (network coordinates, y up). */
  start: XY; corner: XY; end: XY;
  /** Heading (radians, y up) arriving at the junction on the approach and leaving it on the exit. */
  headingIn: number; headingOut: number;
}

/** The turn from link `from` into link `to`: its direction, and the three points of the curved arrow, the first on the approach link and the last on the exit link. */
export function turnGeometry(net: Network, from: number, to: number, reach: number): TurnGeometry {
  const a = net.links[from], b = net.links[to];
  const ra = Math.min(reach, 0.8 * polylineLength(a.geometry)), rb = Math.min(reach, 0.8 * polylineLength(b.geometry));
  const r = Math.min(ra, rb);
  const pa = pointAlong(a.geometry, polylineLength(a.geometry) - r), ea = a.geometry[a.geometry.length - 1];
  const pb = pointAlong(b.geometry, r), sb = b.geometry[0];
  const start: XY = [pa.x, pa.y], end: XY = [pb.x, pb.y];
  const corner: XY = [(ea[0] + sb[0]) / 2, (ea[1] + sb[1]) / 2];
  const headingIn = Math.atan2(corner[1] - start[1], corner[0] - start[0]);
  const headingOut = Math.atan2(end[1] - corner[1], end[0] - corner[0]);
  let d = ((headingOut - headingIn) * 180) / Math.PI;
  while (d > 180) d -= 360;
  while (d <= -180) d += 360;
  const turn: TurnKind = Math.abs(d) < STRAIGHT_DEG ? 'straight' : Math.abs(d) > U_DEG ? 'u-turn' : d > 0 ? 'left' : 'right';
  return { turn, start, corner, end, headingIn, headingOut };
}

/** The kind of turn from link `from` into link `to`, or null where either link is missing. */
export function turnKindOf(net: Network, from: number, to: number): TurnKind | null {
  return net.links[from] && net.links[to] ? turnGeometry(net, from, to, 30).turn : null;
}
