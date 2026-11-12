// Walking and biking demand (design D6). Every share, rate and distance below comes from the demand config and is an
// ASSUMPTION unless the config says otherwise; the only DATA is the optional scaling to Oakland pedestrian and bicycle
// counts at one intersection. Volumes are persons per hour (the flow field keeps the name `vehPerHour`).
export interface ANode {
  id: number;
  x: number;
  y: number;
  gate: boolean;
  canEnter?: boolean;
  canExit?: boolean;
  inStudyArea: boolean;
}
export interface ALink {
  id: number;
  from: number;
  to: number;
  class: string;
  length: number;
  inStudyArea: boolean;
  bikeLane?: boolean;
  bikeRoute?: boolean;
}
export interface ALocal {
  node: number;
  res: number;
  jobs: number;
}
export type Mode = 'pedestrian' | 'bicycle';
export interface AFlow {
  origin: number;
  destination: number;
  vehPerHour: number;
  mode: Mode;
}

interface ModeCfg {
  modeShare: number;
  meanTripM: number;
  maxTripM: number;
  gateShare: number;
  gateMaxM: number;
  periodVolume: Record<string, number>;
  [k: string]: unknown;
}
export interface ActiveCfg {
  pedestrian: ModeCfg & {
    commercialShare: number;
  };
  bicycle: ModeCfg & {
    throughFactor: number;
    throughMinM: number;
    routeBonus: number;
    laneRouteCostFactor: number;
  };
  countScaling: { enabled: boolean };
  commercialClasses: string[];
  commercialJobsRadiusM: number;
  minFlowPerHour: number;
  maxFlows: Record<Mode, number>;
}

export interface ActiveInput {
  nodes: ANode[];
  links: ALink[];
  locals: ALocal[];
  freewayGates: Set<number>;
  periodIds: string[];
  /** Period used for scaling to counts. */
  scalePeriod: string;
  /** Share of a node's trips that start (outbound) or end there, by period, and the per-worker and per-job daily trips. */
  originShare: Record<string, number>;
  destShare: Record<string, number>;
  tripsPerResident: number;
  tripsPerJob: number;
  cfg: ActiveCfg;
  /** Node nearest the counted intersection and observed PM peak-hour totals there. */
  count: { node: number; pedestrian: number | null; bicycle: number | null } | null;
}

export interface ModeReport {
  mode: Mode;
  /** Peak-hour persons passing the counted intersection before scaling (prior) and in the final flow list (after, including the flow cap), the observed value and the applied factor. No clamp: a factor far from 1 is a finding about the prior, not something to hide. */
  prior: number | null;
  observed: number | null;
  after: number | null;
  factor: number;
  perPeriod: Record<string, { total: number; flows: number; candidates: number; toGates: number; toCommercial: number; through: number }>;
}

interface Tree {
  dist: Float64Array;
  via: Int32Array;
}

class Router {
  private adj: { to: number; w: number; link: number }[][];
  private idx = new Map<number, number>();
  private cache = new Map<number, Tree>();
  constructor(
    private nodes: ANode[],
    links: ALink[],
    directed: boolean,
    cost: (l: ALink) => number | null,
  ) {
    nodes.forEach((n, i) => this.idx.set(n.id, i));
    this.adj = nodes.map(() => []);
    links.forEach((l, li) => {
      const w = cost(l);
      if (w === null) return;
      const a = this.idx.get(l.from)!;
      const b = this.idx.get(l.to)!;
      this.adj[a].push({ to: b, w, link: li });
      if (!directed) this.adj[b].push({ to: a, w, link: li });
    });
  }
  tree(src: number): Tree {
    const s = this.idx.get(src)!;
    let t = this.cache.get(s);
    if (t) return t;
    const n = this.nodes.length;
    const dist = new Float64Array(n).fill(Infinity);
    const via = new Int32Array(n).fill(-1);
    const done = new Uint8Array(n);
    dist[s] = 0;
    for (;;) {
      let u = -1;
      for (let i = 0; i < n; i++) if (!done[i] && dist[i] < Infinity && (u < 0 || dist[i] < dist[u])) u = i;
      if (u < 0) break;
      done[u] = 1;
      for (const e of this.adj[u]) {
        if (dist[u] + e.w < dist[e.to]) {
          dist[e.to] = dist[u] + e.w;
          via[e.to] = u;
        }
      }
    }
    t = { dist, via };
    this.cache.set(s, t);
    return t;
  }
  d(a: number, b: number): number {
    return this.tree(a).dist[this.idx.get(b)!];
  }
  /** Node ids on the path from a to b (inclusive), or null. */
  path(a: number, b: number): number[] | null {
    const t = this.tree(a);
    let i = this.idx.get(b)!;
    if (!Number.isFinite(t.dist[i])) return null;
    const out = [this.nodes[i].id];
    while (t.via[i] >= 0) {
      i = t.via[i];
      out.push(this.nodes[i].id);
    }
    return out.reverse();
  }
}

const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);

export function buildActiveFlows(inp: ActiveInput): { flows: Record<string, AFlow[]>; reports: ModeReport[] } {
  const { cfg } = inp;
  const nodeById = new Map(inp.nodes.map((n) => [n.id, n]));
  const surface = inp.links.filter((l) => l.class !== 'motorway');
  const walk = new Router(inp.nodes, surface, false, (l) => l.length);
  const bikeCost = (l: ALink) => l.length * (l.bikeLane ? cfg.bicycle.laneRouteCostFactor : l.bikeRoute ? (1 + cfg.bicycle.laneRouteCostFactor) / 2 : 1);
  const bike = new Router(inp.nodes, surface, true, bikeCost);
  const bikeLen = new Router(inp.nodes, surface, true, (l) => l.length);

  const touchesSurface = new Set(surface.flatMap((l) => [l.from, l.to]));
  const gates = inp.nodes.filter((n) => n.gate && !inp.freewayGates.has(n.id) && touchesSurface.has(n.id));
  const locals = inp.locals.filter((b) => touchesSurface.has(b.node));
  const commercial = new Set<number>();
  for (const l of surface) if (l.inStudyArea && cfg.commercialClasses.includes(l.class)) (commercial.add(l.from), commercial.add(l.to));
  const commercialNodes = [...commercial].map((id) => nodeById.get(id)!).filter((n) => n.inStudyArea && !n.gate);
  const jobsNear = (n: ANode) => sum(locals.filter((b) => Math.hypot(nodeById.get(b.node)!.x - n.x, nodeById.get(b.node)!.y - n.y) <= cfg.commercialJobsRadiusM).map((b) => b.jobs));

  const acc = (m: Map<string, number>, o: number, d: number, v: number) => {
    if (o !== d && v > 0 && Number.isFinite(v)) m.set(`${o}>${d}`, (m.get(`${o}>${d}`) ?? 0) + v);
  };
  const spread = (m: Map<string, number>, total: number, cands: { o: number; d: number; w: number }[], tag?: Map<string, number>, key?: string) => {
    const ws = sum(cands.map((c) => c.w));
    if (!(ws > 0) || !(total > 0)) return 0;
    for (const c of cands) acc(m, c.o, c.d, (total * c.w) / ws);
    if (tag && key) tag.set(key, (tag.get(key) ?? 0) + total);
    return total;
  };

  type Raw = { flows: Map<string, number>; toGates: number; toCommercial: number; through: number };
  const rawFor = (mode: Mode, p: string): Raw => {
    const mc = cfg[mode];
    const flows = new Map<string, number>();
    const stats = { toGates: 0, toCommercial: 0, through: 0 };
    const isWalk = mode === 'pedestrian';
    const R = isWalk ? walk : bike;
    const dd = (a: number, b: number) => R.d(a, b);
    let localOut = 0;
    for (const b of locals) {
      const out = (b.res * inp.tripsPerResident * inp.originShare[p] + b.jobs * inp.tripsPerJob * (1 - inp.destShare[p])) * mc.modeShare;
      const inn = (b.res * inp.tripsPerResident * (1 - inp.originShare[p]) + b.jobs * inp.tripsPerJob * inp.destShare[p]) * mc.modeShare;
      localOut += out;
      const o = b.node;
      const gOut = out * mc.gateShare;
      const internal = out - gOut;
      const comShare = isWalk ? cfg.pedestrian.commercialShare : 0;
      // gates
      const gc = (dir: 'out' | 'in') =>
        gates
          .filter((g) => (dir === 'out' ? g.canExit ?? true : g.canEnter ?? true))
          .map((g) => ({ g, d: dir === 'out' ? dd(o, g.id) : dd(g.id, o) }))
          .filter((x) => x.d <= mc.gateMaxM)
          .map((x) => ({ o: dir === 'out' ? o : x.g.id, d: dir === 'out' ? x.g.id : o, w: Math.exp(-x.d / mc.meanTripM) }));
      stats.toGates += spread(flows, gOut, gc('out')) + spread(flows, inn * mc.gateShare, gc('in'));
      // other locals
      const lc = locals
        .filter((q) => q.node !== o && dd(o, q.node) <= mc.maxTripM)
        .map((q) => ({ o, d: q.node, w: (q.jobs + 0.3 * q.res + 1) * Math.exp(-dd(o, q.node) / mc.meanTripM) }));
      spread(flows, internal * (1 - comShare), lc);
      if (isWalk) {
        const cc = commercialNodes
          .filter((n) => n.id !== o && dd(o, n.id) <= mc.maxTripM)
          .map((n) => ({ o, d: n.id, w: (1 + jobsNear(n)) * Math.exp(-dd(o, n.id) / mc.meanTripM) }));
        stats.toCommercial += spread(flows, internal * comShare, cc);
        if (!cc.length) spread(flows, internal * comShare, lc);
      }
    }
    if (!isWalk) {
      // Through trips between gates, favoring paths that follow bike lanes and routes.
      const bc = cfg.bicycle;
      const pairs: { o: number; d: number; w: number }[] = [];
      const key = new Map<string, ALink>();
      for (const l of surface) if (!key.has(`${l.from}>${l.to}`) || l.length < key.get(`${l.from}>${l.to}`)!.length) key.set(`${l.from}>${l.to}`, l);
      for (const gi of gates.filter((g) => g.canEnter ?? true)) {
        for (const gj of gates.filter((g) => (g.canExit ?? true) && g.id !== gi.id)) {
          const d = bikeLen.d(gi.id, gj.id);
          if (!Number.isFinite(d) || d < bc.throughMinM) continue;
          const path = bike.path(gi.id, gj.id);
          if (!path) continue;
          let onBike = 0;
          let len = 0;
          for (let i = 1; i < path.length; i++) {
            const l = key.get(`${path[i - 1]}>${path[i]}`);
            if (!l) continue;
            len += l.length;
            if (l.bikeLane || l.bikeRoute) onBike += l.length;
          }
          pairs.push({ o: gi.id, d: gj.id, w: (1 + bc.routeBonus * (len ? onBike / len : 0)) * Math.exp(-d / mc.meanTripM) });
        }
      }
      stats.through += spread(flows, localOut * bc.throughFactor, pairs);
    }
    return { flows, ...stats };
  };

  // Persons passing the counted intersection (ends included) on shortest paths.
  const passing = (mode: Mode, flows: Map<string, number>, at: number) => {
    const R = mode === 'pedestrian' ? walk : bike;
    let tot = 0;
    for (const [k, v] of flows) {
      const [o, d] = k.split('>').map(Number);
      if (o === at || d === at || R.path(o, d)?.includes(at)) tot += v;
    }
    return tot;
  };

  const flows: Record<string, AFlow[]> = Object.fromEntries(inp.periodIds.map((p) => [p, []]));
  const reports: ModeReport[] = [];
  for (const mode of ['pedestrian', 'bicycle'] as Mode[]) {
    const mc = cfg[mode];
    const raw = new Map(inp.periodIds.map((p) => [p, rawFor(mode, p)] as const));
    const observed = inp.count?.[mode] ?? null;
    let factor = 1;
    let prior: number | null = null;
    let after: number | null = null;
    const scaling = cfg.countScaling.enabled && inp.count && observed !== null;
    if (scaling) {
      prior = passing(mode, raw.get(inp.scalePeriod)!.flows, inp.count!.node);
      if (prior > 0) factor = observed! / prior;
    }
    const rep: ModeReport = { mode, prior, observed, after, factor, perPeriod: {} };
    const build = (p: string, k0: number) => {
      const r = raw.get(p)!;
      const k = k0 * (mc.periodVolume[p] ?? 1);
      const all = [...r.flows].map(([key, v]) => ({ key, v: v * k }));
      const total = sum(all.map((x) => x.v));
      const list = all.filter((x) => x.v >= cfg.minFlowPerHour).sort((a, b) => b.v - a.v || (a.key < b.key ? -1 : 1)).slice(0, cfg.maxFlows[mode]);
      const kept = sum(list.map((x) => x.v));
      const f = kept > 0 ? total / kept : 1;
      return { r, k, all, total, list, f };
    };
    // The flow cap (and the minimum flow) trims the list and renormalizes it, which moves the volume through the counted node; correct the factor until the final list matches the count.
    if (scaling && prior! > 0) {
      for (let it = 0; it < 6; it++) {
        const b = build(inp.scalePeriod, factor);
        after = passing(mode, new Map(b.list.map((x) => [x.key, x.v * b.f] as const)), inp.count!.node);
        if (after <= 0 || Math.abs(after / observed! - 1) < 0.01) break;
        factor *= observed! / after;
      }
      rep.after = after;
      rep.factor = factor;
    }
    for (const p of inp.periodIds) {
      const { r, k, all, list, f } = build(p, factor);
      const total = sum(all.map((x) => x.v));
      for (const x of list) {
        const [o, d] = x.key.split('>').map(Number);
        flows[p].push({ origin: o, destination: d, vehPerHour: Math.round(x.v * f * 100) / 100, mode });
      }
      rep.perPeriod[p] = { total, flows: list.length, candidates: all.filter((x) => x.v >= cfg.minFlowPerHour).length, toGates: r.toGates * k, toCommercial: r.toCommercial * k, through: r.through * k };
    }
    reports.push(rep);
  }
  return { flows, reports };
}

/** Peak-hour pedestrian crosswalk volumes and bicycle movement volumes from an Oakland/Quality Counts CSV report. */
export function parseActiveCounts(text: string): { pedestrian: number; bicycle: number } | null {
  const lines = text.replace(/^﻿/, '').split(/\r?\n/);
  const numbers = (l: string) => l.split(',').slice(1).map((c) => c.trim()).filter((c) => c !== '' && !Number.isNaN(+c)).map(Number);
  const section = (header: RegExp, row: (l: string) => boolean) => {
    const i = lines.findIndex((l) => header.test(l));
    if (i < 0) return null;
    for (let j = i + 1; j < Math.min(lines.length, i + 6); j++) {
      if (/^,*$/.test(lines[j].trim())) break;
      if (row(lines[j]) && numbers(lines[j]).length >= 2) return sum(numbers(lines[j]));
    }
    return null;
  };
  const ped = section(/^PEAK-HOUR VOLUMES - PEDESTRIANS/, (l) => l.startsWith(','));
  const bik = section(/^PEAK-HOUR VOLUMES - (BICYCLES|MICROMOBILITY)/, (l) => l.startsWith(',') || l.startsWith('Bicycles'));
  return ped === null || bik === null ? null : { pedestrian: ped, bicycle: bik };
}
