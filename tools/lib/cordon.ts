// Cordon extraction for a sub-area model (change compact-model-extent, design D8): where the routes of a parent model cross the extent of a
// child model, and which child gate or node each crossing or trip end becomes. Standard sub-area (cordon) extraction of a trip table. No I/O.
import { makeProjection, pointInPolygon, type Pt } from './geo';
import { firstCrossing } from './network';

export interface CNode { id: number; x: number; y: number; gate: boolean; canEnter?: boolean; canExit?: boolean }
export interface CLink { id: number; from: number; to: number; class: string; geometry: Pt[] }
export interface CNet { origin: { lon: number; lat: number }; nodes: CNode[]; links: CLink[] }

/** Largest distance (m) from a crossing to the child gate it is assigned to; freeway gates are merged from stubs, so they get more room. */
export const GATE_SNAP_M = { surface: 40, motorway: 120 };
/** Largest distance (m) from a parent trip end inside the extent to the child node it becomes. */
export const NODE_SNAP_M = 60;

export interface Cordon {
  /** Per parent node: inside the child extent. */
  inside: Uint8Array;
  /** Child gate for a parent link that enters (from outside to inside) or leaves the extent; null when none lies within the snap distance. */
  gateOf(link: number): number | null;
  /** Child node for a parent node inside the extent (nearest non-gate node), or null. */
  nodeOf(node: number): number | null;
}

/**
 * `polygon` (lon, lat) is the child's extent polygon; without one a parent node is inside when a child node lies within 3 m of it (an extent
 * given only by a buffer or by includes).
 */
export function buildCordon(parent: CNet, child: CNet, polygon: [number, number][] | null): Cordon {
  const pp = makeProjection(parent.origin.lon, parent.origin.lat), cp = makeProjection(child.origin.lon, child.origin.lat);
  const toChild = (p: Pt): Pt => { const [lon, lat] = pp.inv(p[0], p[1]); return cp.fwd(lon, lat); };
  const poly: Pt[] | null = polygon?.length ? polygon.map(([lon, lat]) => pp.fwd(lon, lat)) : null;
  const cell = 50;
  const grid = new Map<string, CNode[]>();
  for (const n of child.nodes) { const k = `${Math.floor(n.x / cell)},${Math.floor(n.y / cell)}`; (grid.get(k) ?? grid.set(k, []).get(k)!).push(n); }
  const near = (p: Pt, r: number, ok: (n: CNode) => boolean): CNode | null => {
    let best: CNode | null = null, bd = r;
    const cx = Math.floor(p[0] / cell), cy = Math.floor(p[1] / cell), s = Math.ceil(r / cell);
    for (let i = cx - s; i <= cx + s; i++) for (let j = cy - s; j <= cy + s; j++) for (const n of grid.get(`${i},${j}`) ?? []) {
      const d = Math.hypot(n.x - p[0], n.y - p[1]);
      if (d <= bd && ok(n)) { bd = d; best = n; }
    }
    return best;
  };
  const inside = new Uint8Array(parent.nodes.length);
  parent.nodes.forEach((n, i) => { inside[i] = (poly ? pointInPolygon([n.x, n.y], poly) : !!near(toChild([n.x, n.y]), 3, () => true)) ? 1 : 0; });
  const gateCache = new Map<number, number | null>();
  const gateOf = (l: number): number | null => {
    if (gateCache.has(l)) return gateCache.get(l)!;
    const k = parent.links[l];
    const entering = !inside[k.from] && !!inside[k.to];
    const g = k.geometry;
    // The crossing point: where the link's geometry meets the polygon edge, else the link's inside end.
    let at: Pt = entering ? g[g.length - 1] : g[0];
    if (poly) {
      const seq = entering ? [...g].reverse() : g; // walk from the inside end outward
      for (let i = 1; i < seq.length; i++) { const t = firstCrossing(seq[i - 1], seq[i], poly); if (t !== null) { at = [seq[i - 1][0] + t * (seq[i][0] - seq[i - 1][0]), seq[i - 1][1] + t * (seq[i][1] - seq[i - 1][1])]; break; } }
    }
    const r = k.class === 'motorway' ? GATE_SNAP_M.motorway : GATE_SNAP_M.surface;
    const hit = near(toChild(at), r, (n) => n.gate && (entering ? n.canEnter !== false : n.canExit !== false));
    gateCache.set(l, hit ? hit.id : null);
    return hit ? hit.id : null;
  };
  const nodeOf = (id: number): number | null => near(toChild([parent.nodes[id].x, parent.nodes[id].y]), NODE_SNAP_M, (n) => !n.gate)?.id ?? null;
  return { inside, gateOf, nodeOf };
}

export type Cut = { o: number; d: number } | { lost: 'gate' | 'node' };

/**
 * The stretches of one parent route inside the extent, as child trips: from the entry gate (or the origin, when it is inside) to the exit gate
 * (or the destination). A route that leaves and comes back gives one trip per stretch. Links are parent link ids in route order.
 */
export function cutRoute(c: Cordon, links: CLink[], route: number[], origin: number, dest: number): Cut[] {
  const out: Cut[] = [];
  let start: number | undefined;
  if (c.inside[origin]) {
    const s = c.nodeOf(origin);
    if (s === null) out.push({ lost: 'node' });
    else start = s;
  }
  for (const l of route) {
    const k = links[l];
    const a = !!c.inside[k.from], b = !!c.inside[k.to];
    if (!a && b) {
      const g = c.gateOf(l);
      if (g === null) out.push({ lost: 'gate' });
      start = g ?? undefined;
    } else if (a && !b && start !== undefined) {
      const g = c.gateOf(l);
      if (g === null) out.push({ lost: 'gate' });
      else if (g !== start) out.push({ o: start, d: g });
      start = undefined;
    }
  }
  if (start !== undefined && c.inside[dest]) {
    const e = c.nodeOf(dest);
    if (e === null) out.push({ lost: 'node' });
    else if (e !== start) out.push({ o: start, d: e });
  }
  return out;
}
