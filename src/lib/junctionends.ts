import type { NetLink, Network } from '../types';
import { pointAlong, polylineLength } from './geom';

type Pt = [number, number];

/** A leg whose first segment points this far off its street bearing is taken to run through a join connector. */
export const CONNECTOR_DEVIATION_DEG = 10;
/** Ignore corrections that would move an end by less than this (m), so ordinary links stay as they are. */
const MIN_MOVE_M = 1;
/** Corrections larger than this (m) are not a staggered-junction offset; leave the link alone. */
const MAX_MOVE_M = 40;

const bearingOf = (a: Pt, b: Pt): number => ((((Math.atan2(b[0] - a[0], b[1] - a[1]) * 180) / Math.PI) % 360) + 360) % 360;
const angleBetween = (a: number, b: number): number => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

/**
 * `pts` runs away from the node. Where a junction join moved its first point to the cluster centroid, the first segment is a connector
 * that leaves the street's own bearing. Return the points with that end replaced by the foot of the centroid on the street's line through
 * the second point, so the street runs straight into the junction. The same pts are returned when nothing needs fixing.
 */
export function straightenEnd(pts: Pt[], bearingOut: number): Pt[] {
  if (pts.length < 3) return pts;
  const [g0, g1] = pts;
  if (Math.hypot(g1[0] - g0[0], g1[1] - g0[1]) < 0.5) return pts;
  if (angleBetween(bearingOf(g0, g1), bearingOut) <= CONNECTOR_DEVIATION_DEG) return pts;
  const ux = Math.sin((bearingOut * Math.PI) / 180), uy = Math.cos((bearingOut * Math.PI) / 180);
  const t = (g0[0] - g1[0]) * ux + (g0[1] - g1[1]) * uy;
  if (t > -0.5) return pts;
  const foot: Pt = [g1[0] + t * ux, g1[1] + t * uy];
  const move = Math.hypot(foot[0] - g0[0], foot[1] - g0[1]);
  if (move < MIN_MOVE_M || move > MAX_MOVE_M) return pts;
  return [foot, ...pts.slice(1)];
}

/** Drawn geometry of one link, ends straightened. `length` is not touched. */
export function straightenLink(l: Pick<NetLink, 'geometry' | 'fromBearing' | 'toBearing'>): Pt[] {
  let g = l.geometry;
  if (l.fromBearing !== undefined) g = straightenEnd(g, l.fromBearing);
  if (l.toBearing !== undefined) g = straightenEnd([...g].reverse() as Pt[], (l.toBearing + 180) % 360).reverse();
  return g;
}

/**
 * The network with merged-junction connectors removed from link geometry, so streets and the vehicles driven along them run straight
 * through a merged staggered junction instead of zigzagging. Links, ids, lengths and bearings are unchanged; `changed` counts links edited.
 */
export function straightenJunctionEnds(net: Network): { network: Network; changed: number } {
  let changed = 0;
  const links = net.links.map((l) => {
    const geometry = straightenLink(l);
    const same = geometry.length === l.geometry.length && geometry.every((p, i) => p === l.geometry[i]);
    if (same) return l;
    changed++;
    return { ...l, geometry };
  });
  return changed === 0 ? { network: net, changed } : { network: { ...net, links }, changed };
}

/** Point at `s` meters of the link's own length, mapped onto its drawn geometry (which may be shorter than `length` after straightening). */
export function pointAtLinkMeters(l: Pick<NetLink, 'geometry' | 'length'>, s: number): { x: number; y: number; heading: number } {
  const len = polylineLength(l.geometry);
  return pointAlong(l.geometry, l.length > 0 && len > 0 ? Math.min(s, l.length) * (len / l.length) : s);
}
