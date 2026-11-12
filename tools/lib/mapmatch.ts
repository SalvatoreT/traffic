// Hidden Markov map matching of a transit shape to directed network links [Newson2009].
import { cumulative, dist, distToSegment, type Pt } from './geo';

export interface MLink {
  id: number;
  from: number;
  to: number;
  geometry: Pt[];
  length: number;
  cls?: string;
}

export interface MatchParams {
  /** Candidate search radius from a shape point to a link (m). */
  radiusM: number;
  /** Shape sample spacing (m). */
  stepM: number;
  /** Emission spread: the shape is assumed to lie within roughly this many meters of the true path. */
  sigmaM: number;
  /** Transition spread: tolerated mismatch between shape distance and route distance (m). */
  betaM: number;
  /** Largest detour (m) bridged between consecutive candidates. */
  maxBridgeM: number;
  /** Largest heading difference (deg) between the shape and a candidate link. */
  maxHeadingDeg: number;
  maxCandidates: number;
}

export const DEFAULT_MATCH: MatchParams = { radiusM: 25, stepM: 12, sigmaM: 8, betaM: 10, maxBridgeM: 150, maxHeadingDeg: 70, maxCandidates: 6 };

interface Cand {
  link: MLink;
  dist: number;
  along: number;
}

const CELL = 50;

export class LinkIndex {
  private grid = new Map<string, { link: MLink; seg: number; cum: number[] }[]>();
  private out = new Map<number, MLink[]>();
  private cum = new Map<number, number[]>();
  constructor(readonly links: MLink[]) {
    for (const l of links) {
      const cum = cumulative(l.geometry);
      this.cum.set(l.id, cum);
      for (let i = 1; i < l.geometry.length; i++) {
        const [a, b] = [l.geometry[i - 1], l.geometry[i]];
        const x0 = Math.floor(Math.min(a[0], b[0]) / CELL);
        const x1 = Math.floor(Math.max(a[0], b[0]) / CELL);
        const y0 = Math.floor(Math.min(a[1], b[1]) / CELL);
        const y1 = Math.floor(Math.max(a[1], b[1]) / CELL);
        for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) (this.grid.get(`${x},${y}`) ?? this.grid.set(`${x},${y}`, []).get(`${x},${y}`)!).push({ link: l, seg: i, cum });
      }
      (this.out.get(l.from) ?? this.out.set(l.from, []).get(l.from)!).push(l);
    }
  }

  /** Nearest points of links within `r` of p, one per link, with the segment bearing at that point. */
  near(p: Pt, r: number): (Cand & { bearing: number })[] {
    const best = new Map<number, Cand & { bearing: number }>();
    const x0 = Math.floor((p[0] - r) / CELL);
    const x1 = Math.floor((p[0] + r) / CELL);
    const y0 = Math.floor((p[1] - r) / CELL);
    const y1 = Math.floor((p[1] + r) / CELL);
    for (let x = x0; x <= x1; x++) {
      for (let y = y0; y <= y1; y++) {
        for (const { link, seg, cum } of this.grid.get(`${x},${y}`) ?? []) {
          const a = link.geometry[seg - 1];
          const b = link.geometry[seg];
          const d = distToSegment(p, a, b);
          if (d > r) continue;
          const prev = best.get(link.id);
          if (prev && prev.dist <= d) continue;
          const l2 = (b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2;
          const t = l2 === 0 ? 0 : Math.max(0, Math.min(1, ((p[0] - a[0]) * (b[0] - a[0]) + (p[1] - a[1]) * (b[1] - a[1])) / l2));
          best.set(link.id, { link, dist: d, along: cum[seg - 1] + t * (cum[seg] - cum[seg - 1]), bearing: Math.atan2(b[0] - a[0], b[1] - a[1]) });
        }
      }
    }
    return [...best.values()];
  }

  outgoing(node: number): MLink[] {
    return this.out.get(node) ?? [];
  }

  /** Shortest directed path between nodes, bounded by `limit` meters. Returns link ids, or null. */
  path(from: number, to: number, limit: number): { links: MLink[]; length: number } | null {
    if (from === to) return { links: [], length: 0 };
    const distTo = new Map<number, number>([[from, 0]]);
    const via = new Map<number, MLink>();
    const open: [number, number][] = [[0, from]];
    const done = new Set<number>();
    while (open.length) {
      let k = 0;
      for (let i = 1; i < open.length; i++) if (open[i][0] < open[k][0]) k = i;
      const [d, u] = open.splice(k, 1)[0];
      if (done.has(u)) continue;
      done.add(u);
      if (u === to) {
        const links: MLink[] = [];
        for (let n = to; n !== from; ) {
          const l = via.get(n)!;
          links.push(l);
          n = l.from;
        }
        return { links: links.reverse(), length: d };
      }
      for (const l of this.outgoing(u)) {
        const nd = d + l.length;
        if (nd > limit || nd >= (distTo.get(l.to) ?? Infinity)) continue;
        distTo.set(l.to, nd);
        via.set(l.to, l);
        open.push([nd, l.to]);
      }
    }
    return null;
  }
}

export function densify(shape: Pt[], step: number): { p: Pt; bearing: number }[] {
  const out: { p: Pt; bearing: number }[] = [];
  let carry = 0;
  for (let i = 1; i < shape.length; i++) {
    const a = shape[i - 1];
    const b = shape[i];
    const len = dist(a, b);
    if (len === 0) continue;
    const bearing = Math.atan2(b[0] - a[0], b[1] - a[1]);
    for (let s = carry; s < len; s += step) out.push({ p: [a[0] + ((b[0] - a[0]) * s) / len, a[1] + ((b[1] - a[1]) * s) / len], bearing });
    carry = (carry + Math.ceil((len - carry) / step) * step) - len;
  }
  return out;
}

const angDiff = (a: number, b: number) => {
  const d = Math.abs(a - b) % (2 * Math.PI);
  return d > Math.PI ? 2 * Math.PI - d : d;
};

export interface Matched {
  /** Ordered, connected link ids. */
  links: number[];
  /** Total length of the matched links (m). */
  length: number;
}

/**
 * Matches a shape to the network. The shape may leave and re-enter the model; each contiguous in-model stretch is
 * matched on its own and returned as a separate path. Within a path, consecutive links share a node.
 */
export function matchShape(index: LinkIndex, shape: Pt[], params: MatchParams = DEFAULT_MATCH): Matched[] {
  const pts = densify(shape, params.stepM);
  const cands = pts.map(({ p, bearing }) =>
    index
      .near(p, params.radiusM)
      .filter((c) => angDiff(c.bearing, bearing) <= (params.maxHeadingDeg * Math.PI) / 180)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, params.maxCandidates),
  );
  const stretches: [number, number][] = [];
  let start = -1;
  cands.forEach((c, i) => {
    if (c.length && start < 0) start = i;
    if (!c.length && start >= 0) (stretches.push([start, i - 1]), (start = -1));
  });
  if (start >= 0) stretches.push([start, cands.length - 1]);

  const out: Matched[] = [];
  const bridge = new Map<string, { links: MLink[]; length: number } | null>();
  const bridgeOf = (a: number, b: number) => {
    const k = `${a}>${b}`;
    if (!bridge.has(k)) bridge.set(k, index.path(a, b, params.maxBridgeM));
    return bridge.get(k)!;
  };
  for (const [s, e] of stretches) {
    const n = e - s + 1;
    const cost: number[][] = [];
    const back: number[][] = [];
    cost.push(cands[s].map((c) => (c.dist / params.sigmaM) ** 2 / 2));
    back.push(cands[s].map(() => -1));
    for (let i = 1; i < n; i++) {
      const cs = cands[s + i];
      const pv = cands[s + i - 1];
      const step = dist(pts[s + i].p, pts[s + i - 1].p);
      const row: number[] = [];
      const bk: number[] = [];
      cs.forEach((c) => {
        let best = Infinity;
        let arg = -1;
        pv.forEach((q, j) => {
          let route: number;
          if (q.link.id === c.link.id) {
            if (c.along < q.along - 2) return;
            route = c.along - q.along;
          } else {
            const br = bridgeOf(q.link.to, c.link.from);
            if (!br) return;
            route = q.link.length - q.along + br.length + c.along;
          }
          const t = cost[i - 1][j] + Math.abs(route - step) / params.betaM;
          if (t < best) (best = t), (arg = j);
        });
        row.push(best + (c.dist / params.sigmaM) ** 2 / 2);
        bk.push(arg);
      });
      // No reachable predecessor: the path is broken here, so start a fresh chain at this point.
      if (row.every((v) => !Number.isFinite(v))) {
        cs.forEach((c, j) => ((row[j] = (c.dist / params.sigmaM) ** 2 / 2), (bk[j] = -1)));
      }
      cost.push(row);
      back.push(bk);
    }
    const argmin = (r: number[]) => r.reduce((bi, v, i, arr) => (v < arr[bi] ? i : bi), 0);
    const chains: { link: MLink }[][] = [];
    let cur: { link: MLink }[] = [];
    let k = argmin(cost[n - 1]);
    for (let i = n - 1; i >= 0; i--) {
      cur.push({ link: cands[s + i][k].link });
      const pk = back[i][k];
      if (pk < 0) {
        chains.push(cur.reverse());
        cur = [];
        if (i > 0) k = argmin(cost[i - 1]);
      } else k = pk;
    }
    for (const chain of chains.reverse()) {
      const links: MLink[] = [];
      for (const { link } of chain) {
        const last = links.at(-1);
        if (last && last.id === link.id) continue;
        if (last && last.to !== link.from) {
          const br = bridgeOf(last.to, link.from);
          if (!br) {
            if (links.length) out.push(finish(links));
            links.length = 0;
          } else links.push(...br.links);
        }
        links.push(link);
      }
      if (links.length) out.push(finish(links));
    }
  }
  return out;
}

const finish = (links: MLink[]): Matched => ({ links: links.map((l) => l.id), length: links.reduce((a, l) => a + l.length, 0) });
