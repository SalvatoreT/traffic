// Static free-flow assignment for the demand builder. No I/O.
// Mirrors the simulator's router (crates/sim/src/route.rs, eff.rs, topo.rs, params.rs): a link-based shortest path whose cost is
//   link time (length / speed limit + hump penalty) x class weight  +  per movement: turn penalty + control delay + traversal time.
// Approximations: the simulator's per-driver noise multiplies the cost-to-go of a candidate link; here each of `draws` assignments perturbs
// every link cost by a seeded factor in 1 +/- noise and the flow is split equally over the draws (draws = 1, noise = 0 gives all-or-nothing).
// Movement length uses the same corner/Bezier estimate as the simulator; the signal and stop delays are the fixed free-flow constants.
export type Pt = [number, number];
export interface ALink { id: number; from: number; to: number; length: number; speedLimit: number; geometry?: Pt[]; class: string; humps?: number[]; stopAtEnd?: boolean }
export interface ANode { id: number; x: number; y: number; control: string }
export interface ATurnBan { from: number; to: number; periods?: string[] }

/** Constants copied from crates/sim/src/params.rs (each is an ASSUMPTION there too). */
export interface RouteParams {
  localCostFactor: number; turnRightS: number; turnLeftS: number; turnUS: number;
  delaySignalS: number; delayAllwayS: number; delayMinorS: number; delayCircleS: number;
  humpPenaltyS: number; vRight: number; vLeft: number; vUturn: number; vCircle: number; rCircle: number; rNode: number;
}
export const SIM_ROUTE_PARAMS: RouteParams = {
  localCostFactor: 1.25, turnRightS: 1, turnLeftS: 4, turnUS: 25, delaySignalS: 10, delayAllwayS: 6, delayMinorS: 5, delayCircleS: 3,
  humpPenaltyS: 3, vRight: 4, vLeft: 5, vUturn: 3, vCircle: 5, rCircle: 7, rNode: 6,
};

const RANK: Record<string, number> = { motorway: 0, primary: 1, secondary: 2, tertiary: 3, residential: 4, service: 5 };
const normAngle = (a: number) => { while (a > Math.PI) a -= 2 * Math.PI; while (a <= -Math.PI) a += 2 * Math.PI; return a; };

interface Geo { pts: Pt[]; cum: number[]; scale: number }
export interface Graph {
  nLinks: number;
  length: Float64Array; to: Int32Array; from: Int32Array;
  /** link cost seconds, already weighted: (length / limit + humps) x class weight */
  cost: Float64Array;
  /** CSR adjacency over links: movements of link a are mvStart[a] .. mvStart[a+1] */
  mvStart: Int32Array; mvTo: Int32Array; mvCost: Float64Array; mvFrom: Int32Array;
  /** node id -> indices (positions in the link list given to `buildGraph`) of its outgoing / incoming links */
  outLinks: Map<number, number[]>; inLinks: Map<number, number[]>;
  /** movements removed by turn bans in this period */
  banned: number;
  /** approaches that yield at a two-way stop (same rule as the simulator) */
  minor: boolean[];
}

function linkPoint(g: Geo, s: number, off: number): { p: Pt; h: number } {
  const gs = Math.min(Math.max(s / g.scale, 0), g.cum[g.cum.length - 1]);
  let i = 0;
  while (i + 2 < g.pts.length && g.cum[i + 1] < gs) i++;
  const p0 = g.pts[i], p1 = g.pts[i + 1];
  const seg = Math.max(g.cum[i + 1] - g.cum[i], 1e-9);
  const u = Math.min(Math.max((gs - g.cum[i]) / seg, 0), 1);
  const dx = p1[0] - p0[0], dy = p1[1] - p0[1], h = Math.atan2(dy, dx);
  return { p: [p0[0] + dx * u + off * Math.sin(h), p0[1] + dy * u - off * Math.cos(h)], h };
}

/** Build the movement graph for one period (`period` selects the time-conditional turn bans). */
export function buildGraph(nodes: ANode[], links: ALink[], bans: ATurnBan[], period: string | null, prm: RouteParams = SIM_ROUTE_PARAMS): Graph {
  const nl = links.length;
  const nodeIdx = new Map(nodes.map((n, i) => [n.id, i]));
  const linkIdx = new Map(links.map((l, i) => [l.id, i]));
  const geo: Geo[] = links.map((l) => {
    let pts = l.geometry && l.geometry.length >= 2 ? l.geometry : null;
    if (!pts) { const a = nodes[nodeIdx.get(l.from)!], b = nodes[nodeIdx.get(l.to)!]; pts = [[a.x, a.y], [b.x, b.y]]; }
    const cum = [0];
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const glen = Math.max(cum[cum.length - 1], 1e-6);
    const len = l.length > 1 ? l.length : Math.max(glen, 5);
    return { pts, cum, scale: len / glen };
  });
  const length = Float64Array.from(links.map((l, i) => (l.length > 1 ? l.length : Math.max(geo[i].cum[geo[i].cum.length - 1], 5))));
  const limit = links.map((l) => Math.max(l.speedLimit, 1));
  const stopPos = links.map((_, i) => length[i] - Math.min(prm.rNode, 0.25 * length[i]));
  const emergePos = links.map((_, i) => Math.min(prm.rNode, 0.25 * length[i]));
  const ins = new Map<number, number[]>(), outs = new Map<number, number[]>();
  links.forEach((l, i) => {
    (outs.get(l.from) ?? outs.set(l.from, []).get(l.from)!).push(i);
    (ins.get(l.to) ?? ins.set(l.to, []).get(l.to)!).push(i);
  });
  // Minor approaches at two-way stops and uncontrolled-priority nodes (eff.rs).
  const minor = new Array<boolean>(nl).fill(false);
  for (const n of nodes) {
    if (n.control !== 'two_way_stop') continue;
    const li = ins.get(n.id) ?? [];
    if (!li.length) continue;
    const flagged = li.filter((l) => links[l].stopAtEnd);
    const rk = (l: number) => RANK[links[l].class] ?? 4;
    if (flagged.length) {
      for (const l of flagged) minor[l] = true;
      const minr = Math.min(...li.map(rk));
      for (const l of li) if (rk(l) > minr) minor[l] = true;
    } else {
      const maxr = Math.max(...li.map(rk)), minr = Math.min(...li.map(rk));
      if (maxr > minr) for (const l of li) if (rk(l) === maxr) minor[l] = true;
    }
  }
  const banSet = new Set<number>();
  for (const b of bans) if (!b.periods?.length || (period !== null && b.periods.includes(period))) {
    const a = linkIdx.get(b.from), c = linkIdx.get(b.to);
    if (a !== undefined && c !== undefined) banSet.add(a * nl + c);
  }
  const mvTo: number[] = [], mvCost: number[] = [], mvFrom: number[] = [], mvStart = new Int32Array(nl + 1);
  let nBanned = 0;
  for (let a = 0; a < nl; a++) {
    mvStart[a] = mvTo.length;
    const node = nodes[nodeIdx.get(links[a].to)!];
    const bs = outs.get(links[a].to) ?? [];
    const deadEnd = bs.length === 1;
    const A = linkPoint(geo[a], stopPos[a], 1.8);
    for (const b of bs) {
      const B = linkPoint(geo[b], emergePos[b], 1.8);
      const d = normAngle(B.h - A.h);
      const kind = Math.abs(d) > 2.6 ? 'u' : d > 0.52 ? 'l' : d < -0.52 ? 'r' : 't';
      if (kind === 'u' && !deadEnd) continue;
      if (banSet.has(a * nl + b)) { nBanned++; continue; }
      const circle = node.control === 'traffic_circle';
      const vlim = Math.min(limit[a], limit[b]);
      const vt = circle ? Math.min(prm.vCircle, vlim) : kind === 't' ? vlim * 1.4 : kind === 'r' ? Math.min(prm.vRight, vlim) : kind === 'l' ? Math.min(prm.vLeft, vlim) : Math.min(prm.vUturn, vlim);
      // Movement length: Bezier control point at the intersection of the in-ray and the out-ray (topo.rs build_movements).
      const cx = Math.cos(A.h), cy = Math.sin(A.h), dx = Math.cos(B.h), dy = Math.sin(B.h);
      const det = cx * -dy - cy * -dx;
      const chord = Math.hypot(B.p[0] - A.p[0], B.p[1] - A.p[1]);
      let x: Pt = [(A.p[0] + B.p[0]) / 2, (A.p[1] + B.p[1]) / 2];
      if (Math.abs(det) > 0.2) {
        const rx = B.p[0] - A.p[0], ry = B.p[1] - A.p[1];
        const s = (rx * -dy - ry * -dx) / det;
        if (Math.abs(s) < 3 * Math.max(chord, 1)) x = [A.p[0] + s * cx, A.p[1] + s * cy];
      }
      const l1 = Math.hypot(x[0] - A.p[0], x[1] - A.p[1]), l2 = Math.hypot(B.p[0] - x[0], B.p[1] - x[1]);
      let len = Math.max((2 * chord + l1 + l2) / 3, 4);
      if (circle) {
        const aIn = (((A.h + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const aOut = ((B.h % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const arc = (((aOut - aIn) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        len = Math.max(prm.rCircle * arc + 4, 10);
      }
      let c = kind === 'r' ? prm.turnRightS : kind === 'l' ? prm.turnLeftS : kind === 'u' ? prm.turnUS : 0;
      c += node.control === 'signal' ? prm.delaySignalS : node.control === 'all_way_stop' ? prm.delayAllwayS : node.control === 'two_way_stop' ? (minor[a] ? prm.delayMinorS : 0) : node.control === 'traffic_circle' ? prm.delayCircleS : 0;
      mvTo.push(b); mvFrom.push(a); mvCost.push(c + len / Math.min(vt, vlim));
    }
  }
  mvStart[nl] = mvTo.length;
  const cost = new Float64Array(nl);
  for (let l = 0; l < nl; l++) {
    const w = links[l].class === 'residential' || links[l].class === 'service' ? prm.localCostFactor : 1;
    cost[l] = (length[l] / limit[l] + prm.humpPenaltyS * (links[l].humps?.length ?? 0)) * w;
  }
  const outLinks = outs, inLinks = ins;
  return { nLinks: nl, length, to: Int32Array.from(links.map((l) => l.to)), from: Int32Array.from(links.map((l) => l.from)), cost, mvStart, mvTo: Int32Array.from(mvTo), mvCost: Float64Array.from(mvCost), mvFrom: Int32Array.from(mvFrom), outLinks, inLinks, banned: nBanned, minor };
}

class MinHeap {
  k: number[] = []; v: number[] = [];
  get size() { return this.k.length; }
  push(key: number, val: number) {
    const { k, v } = this;
    let i = k.length; k.push(key); v.push(val);
    while (i > 0) { const p = (i - 1) >> 1; if (k[p] <= k[i]) break; [k[p], k[i]] = [k[i], k[p]]; [v[p], v[i]] = [v[i], v[p]]; i = p; }
  }
  pop(): [number, number] {
    const { k, v } = this;
    const top: [number, number] = [k[0], v[0]];
    const lk = k.pop()!, lv = v.pop()!;
    if (k.length) {
      k[0] = lk; v[0] = lv;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = l + 1; let m = i;
        if (l < k.length && k[l] < k[m]) m = l;
        if (r < k.length && k[r] < k[m]) m = r;
        if (m === i) break;
        [k[m], k[i]] = [k[i], k[m]]; [v[m], v[i]] = [v[i], v[m]]; i = m;
      }
    }
    return top;
  }
}

/** Seeded per-(draw, link) perceived-cost factor in 1 +/- noise. */
export function linkNoise(draw: number, link: number, noise: number): number {
  let z = (Math.imul(draw + 1, 0x9e3779b1) ^ Math.imul(link + 1, 0x85ebca6b)) | 0;
  z = Math.imul(z ^ (z >>> 15), 0x2c1b3c6d); z = Math.imul(z ^ (z >>> 12), 0x297a2d39); z ^= z >>> 15;
  return 1 + (2 * ((z >>> 0) / 4294967296) - 1) * noise;
}

/** Shortest-path tree from `origin` over link states. Returns per-link arrival cost and predecessor link (-1 for first links). */
export function treeFrom(g: Graph, origin: number, noiseOf: ((l: number) => number) | null): { dist: Float64Array; pred: Int32Array } {
  const dist = new Float64Array(g.nLinks).fill(Infinity), pred = new Int32Array(g.nLinks).fill(-1);
  const heap = new MinHeap();
  const c = (l: number) => g.cost[l] * (noiseOf ? noiseOf(l) : 1);
  for (const l of g.outLinks.get(origin) ?? []) { dist[l] = c(l); heap.push(dist[l], l); }
  while (heap.size) {
    const [d, a] = heap.pop();
    if (d > dist[a]) continue;
    for (let m = g.mvStart[a]; m < g.mvStart[a + 1]; m++) {
      const b = g.mvTo[m], nd = d + g.mvCost[m] + c(b);
      if (nd < dist[b]) { dist[b] = nd; pred[b] = a; heap.push(nd, b); }
    }
  }
  return { dist, pred };
}

export interface OdFlow { origin: number; destination: number }
/** Sparse link shares per flow, CSR: flow k uses links[start[k] .. start[k+1]] with share (0..1] each; unroutable flows have none. */
export interface Assignment { start: Int32Array; link: Int32Array; share: Float32Array; routable: Uint8Array; origin: Int32Array; destination: Int32Array }

/**
 * Assign every flow to its free-flow generalized-cost shortest path(s). Node ids in flows and link `from`/`to` are node ids; link
 * indices in the result are positions in `links` (what `buildGraph` was given).
 */
export function assign(g: Graph, flows: OdFlow[], draws = 1, noise = 0): Assignment {
  const byOrigin = new Map<number, number[]>();
  flows.forEach((f, k) => (byOrigin.get(f.origin) ?? byOrigin.set(f.origin, []).get(f.origin)!).push(k));
  const accum: Map<number, number>[] = flows.map(() => new Map());
  const routable = new Uint8Array(flows.length);
  const ok = new Array<number>(flows.length).fill(0);
  for (let dr = 0; dr < draws; dr++) {
    const nz = noise > 0 ? (l: number) => linkNoise(dr, l, noise) : null;
    for (const [o, ks] of byOrigin) {
      const { dist, pred } = treeFrom(g, o, nz);
      for (const k of ks) {
        const d = flows[k].destination;
        let best = -1, bd = Infinity;
        for (const l of g.inLinks.get(d) ?? []) if (dist[l] < bd) { bd = dist[l]; best = l; }
        if (best < 0 || !isFinite(bd)) continue;
        ok[k]++;
        const m = accum[k];
        for (let l = best; l >= 0; l = pred[l]) m.set(l, (m.get(l) ?? 0) + 1);
      }
    }
  }
  const start = new Int32Array(flows.length + 1);
  const link: number[] = [], share: number[] = [];
  flows.forEach((_, k) => {
    start[k] = link.length;
    if (ok[k] > 0) { routable[k] = 1; for (const [l, c] of accum[k]) { link.push(l); share.push(c / ok[k]); } }
  });
  start[flows.length] = link.length;
  return { start, link: Int32Array.from(link), share: Float32Array.from(share), routable, origin: Int32Array.from(flows.map((f) => f.origin)), destination: Int32Array.from(flows.map((f) => f.destination)) };
}

/** Per-link volume of `v` (per flow) under an assignment. */
export function linkVolumes(a: Assignment, v: ArrayLike<number>, nLinks: number): Float64Array {
  const out = new Float64Array(nLinks);
  for (let k = 0; k < a.routable.length; k++) for (let i = a.start[k]; i < a.start[k + 1]; i++) out[a.link[i]] += v[k] * a.share[i];
  return out;
}
