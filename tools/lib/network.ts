import {
  cumulative,
  distToRing,
  makeProjection,
  pointAlong,
  pointInPolygon,
  polylineLength,
  round1,
  type Pt,
} from './geo';
import { bikeTags, hasSidewalk, isMarkedCrossing } from './attrs';
import type {
  AreaConfig,
  LinkClass,
  NetLink,
  NetNode,
  Network,
  NodeControl,
  OsmNode,
  OsmWay,
  Overpass,
} from './types';

export const CLASS_MAP: Record<string, LinkClass> = {
  motorway: 'motorway',
  motorway_link: 'motorway',
  primary: 'primary',
  primary_link: 'primary',
  secondary: 'secondary',
  secondary_link: 'secondary',
  tertiary: 'tertiary',
  tertiary_link: 'tertiary',
  residential: 'residential',
  unclassified: 'residential',
  living_street: 'residential',
  service: 'service',
};

export const DEFAULT_SPEED_MPH: Record<LinkClass, number> = {
  motorway: 65,
  primary: 30,
  secondary: 30,
  tertiary: 25,
  residential: 25,
  service: 15,
};

export const DEFAULT_LANES: Record<LinkClass, number> = {
  motorway: 2,
  primary: 2,
  secondary: 1,
  tertiary: 1,
  residential: 1,
  service: 1,
};

export const PARAMS = {
  rampSpeedMph: 35,
  signalReachM: 30,
  stopReachM: 60,
  gateEdgeM: 60,
  boundaryReachM: 8,
  junctionJoinRadiusM: 20,
  /** A marked crosswalk within this distance of a junction belongs to the junction, not to the link. */
  crossingAtJunctionM: 15,
  minLinkM: 0.5,
  mph: 0.44704,
  kph: 1 / 3.6,
  humpTags: ['hump', 'bump', 'table', 'cushion'],
  skipServices: ['parking_aisle', 'driveway'],
  skipAccess: ['private', 'no'],
};

interface Run {
  way: OsmWay;
  cls: LinkClass;
  nodes: number[];
  xy: Pt[];
  cum: number[];
  fwd: boolean;
  bwd: boolean;
  lanesF: number;
  lanesB: number;
  speedF: number;
  speedB: number;
  name: string;
  bikeF: boolean;
  bikeB: boolean;
  bikeRoute: boolean;
  sidewalk: boolean;
}

interface Link {
  osmWayId: number;
  from: number;
  to: number;
  rev: Link | null;
  name: string;
  cls: LinkClass;
  lanes: number;
  speed: number;
  geometry: Pt[];
  stopAtEnd: boolean;
  humps: number[];
  bikeLane: boolean;
  bikeRoute: boolean;
  sidewalk: boolean;
  crossings: number[];
  alive: boolean;
}

interface Segment {
  run: Run;
  a: number;
  b: number;
  fwdLink?: Link;
  bwdLink?: Link;
}

export interface BuildStats {
  promotedSignals: number;
  stopsIgnoredFar: number;
  stopsUnattributed: number;
  humpsAtJunction: number;
  prunedLinks: number;
  gateCandidates: number;
  merged: number;
  collapsedRings: number;
  joinedClusters: number;
  joinedNodes: number;
  /** One entry per joined cluster: member count and the street names touching it. */
  joinedList: { size: number; streets: string[]; control: string }[];
}

function parseSpeed(v: string | undefined): number | null {
  if (!v) return null;
  const m = /^\s*(\d+(?:\.\d+)?)\s*(mph|km\/h|kph)?\s*$/.exec(v);
  if (!m) return null;
  const n = parseFloat(m[1]);
  return m[2] === 'mph' ? n * PARAMS.mph : n * PARAMS.kph;
}

const int = (v: string | undefined) => {
  const n = parseInt(v ?? '', 10);
  return Number.isFinite(n) && n > 0 ? n : null;
};

export function classify(tags: Record<string, string>): LinkClass | null {
  const hw = tags.highway;
  const cls = CLASS_MAP[hw];
  if (!cls) return null;
  if (hw === 'service' && PARAMS.skipServices.includes(tags.service)) return null;
  if (PARAMS.skipAccess.includes(tags.access) || PARAMS.skipAccess.includes(tags.motor_vehicle)) return null;
  if (tags.area === 'yes') return null;
  return cls;
}

export function buildNetwork(cfg: AreaConfig, osm: Overpass): { network: Network; stats: BuildStats } {
  const stats: BuildStats = {
    promotedSignals: 0,
    stopsIgnoredFar: 0,
    stopsUnattributed: 0,
    humpsAtJunction: 0,
    prunedLinks: 0,
    gateCandidates: 0,
    merged: 0,
    collapsedRings: 0,
    joinedClusters: 0,
    joinedNodes: 0,
    joinedList: [],
  };
  const [minLon, minLat, maxLon, maxLat] = cfg.bbox;
  const lon0 = (minLon + maxLon) / 2;
  const lat0 = (minLat + maxLat) / 2;
  const proj = makeProjection(lon0, lat0);

  const nodes = new Map<number, OsmNode>();
  const ways: OsmWay[] = [];
  // Ways in bicycle route relations (the extract may have none; attributes then come from way tags only).
  const routeWays = new Set<number>();
  for (const e of osm.elements) {
    if (e.type === 'node') {
      const prev = nodes.get(e.id);
      nodes.set(e.id, prev ? { ...e, tags: { ...prev.tags, ...e.tags } } : e);
    } else if (e.type === 'way') ways.push(e);
    else if (e.type === 'relation' && e.tags?.route === 'bicycle') {
      for (const m of e.members ?? []) if (m.type === 'way') routeWays.add(m.ref);
    }
  }
  const inside = (n: OsmNode) => n.lat >= minLat && n.lat <= maxLat && n.lon >= minLon && n.lon <= maxLon;
  const nodeXY = new Map<number, Pt>();
  const xyOf = (id: number): Pt => {
    let p = nodeXY.get(id);
    if (!p) {
      const n = nodes.get(id)!;
      p = proj.fwd(n.lon, n.lat);
      nodeXY.set(id, p);
    }
    return p;
  };
  const [bx0, by0] = proj.fwd(minLon, minLat);
  const [bx1, by1] = proj.fwd(maxLon, maxLat);
  const edgeDist = (p: Pt) => Math.min(p[0] - bx0, bx1 - p[0], p[1] - by0, by1 - p[1]);
  const studyPoly: Pt[] = cfg.studyArea.map(([lon, lat]) => proj.fwd(lon, lat));

  // Roundabout rings collapse to one traffic-circle node at the ring centroid. Ring ways are dropped and
  // every other way touching the ring is redirected to the center, so approaches end at the center.
  const isRing = (w: OsmWay) => w.tags.junction === 'roundabout' || w.tags.junction === 'circular';
  const alias = new Map<number, number>();
  const centers = new Set<number>();
  for (const w of ways) {
    if (!isRing(w) || !classify(w.tags)) continue;
    const ring = [...new Set(w.nodes)].filter((id) => nodes.has(id) && !alias.has(id));
    if (ring.length < 2) continue;
    const lat = ring.reduce((a, id) => a + nodes.get(id)!.lat, 0) / ring.length;
    const lon = ring.reduce((a, id) => a + nodes.get(id)!.lon, 0) / ring.length;
    const cid = -w.id;
    nodes.set(cid, { type: 'node', id: cid, lat, lon });
    centers.add(cid);
    for (const id of ring) alias.set(id, cid);
    stats.collapsedRings++;
  }
  const runs: Run[] = [];
  const gateCand = new Set<number>();
  for (let way of ways) {
    const cls = classify(way.tags);
    if (!cls) continue;
    if (alias.size) {
      if (isRing(way) && way.nodes.some((id) => alias.has(id))) continue;
      const mapped = way.nodes.map((id) => alias.get(id) ?? id).filter((id, i, a) => i === 0 || id !== a[i - 1]);
      if (mapped.length !== way.nodes.length || mapped.some((id, i) => id !== way.nodes[i])) way = { ...way, nodes: mapped };
    }
    const ins = way.nodes.map((id) => {
      const n = nodes.get(id);
      return !!n && inside(n);
    });
    ins.forEach((isIn, i) => {
      if (isIn && ((i > 0 && !ins[i - 1]) || (i < ins.length - 1 && !ins[i + 1]))) gateCand.add(way.nodes[i]);
    });
    const t = way.tags;
    let fwd = true;
    let bwd = true;
    const ow = t.oneway;
    if (ow === 'yes' || ow === 'true' || ow === '1') bwd = false;
    else if (ow === '-1' || ow === 'reverse') fwd = false;
    else if (ow === undefined && (t.highway === 'motorway' || t.highway === 'motorway_link')) bwd = false;
    const oneDir = !(fwd && bwd);
    const lanes = (dir: 'forward' | 'backward') => {
      const specific = int(t[`lanes:${dir}`]);
      if (specific) return specific;
      const l = int(t.lanes);
      if (l) return oneDir ? l : Math.max(1, Math.floor(l / 2));
      return DEFAULT_LANES[cls];
    };
    const fallbackMph = t.highway === 'motorway_link' ? PARAMS.rampSpeedMph : DEFAULT_SPEED_MPH[cls];
    const speed = (dir: 'forward' | 'backward') =>
      parseSpeed(t[`maxspeed:${dir}`]) ?? parseSpeed(t.maxspeed) ?? fallbackMph * PARAMS.mph;

    let cur: number[] = [];
    const bike = bikeTags(t, fwd, bwd);
    const flush = () => {
      if (cur.length >= 2) {
        const xy = cur.map(xyOf);
        runs.push({
          way,
          cls,
          nodes: cur,
          xy,
          cum: cumulative(xy),
          fwd,
          bwd,
          lanesF: lanes('forward'),
          lanesB: lanes('backward'),
          speedF: speed('forward'),
          speedB: speed('backward'),
          name: t.name ?? t.ref ?? '',
          bikeF: bike.laneF,
          bikeB: bike.laneB,
          bikeRoute: bike.route || routeWays.has(way.id),
          sidewalk: hasSidewalk(t, cls),
        });
      }
      cur = [];
    };
    way.nodes.forEach((id, i) => {
      if (ins[i]) {
        cur.push(id);
      } else flush();
    });
    flush();
  }

  const occ = new Map<number, { run: Run; idx: number }[]>();
  const count = new Map<number, number>();
  const graph = new Set<number>();
  for (const run of runs) {
    run.nodes.forEach((id, idx) => {
      if (!occ.has(id)) occ.set(id, []);
      occ.get(id)!.push({ run, idx });
      count.set(id, (count.get(id) ?? 0) + 1);
    });
    graph.add(run.nodes[0]);
    graph.add(run.nodes.at(-1)!);
  }
  for (const [id, c] of count) if (c >= 2) graph.add(id);

  for (const id of gateCand) if (occ.has(id)) graph.add(id);

  for (const run of runs) {
    let last = 0;
    for (let i = 1; i < run.nodes.length; i++) {
      if (!graph.has(run.nodes[i])) continue;
      if (run.nodes[i] === run.nodes[last] && i - last >= 2) graph.add(run.nodes[last + Math.floor((i - last) / 2)]);
      last = i;
    }
  }

  const graphDistances = (id: number) => {
    const out: { run: Run; idx: number; prev: { idx: number; d: number } | null; next: { idx: number; d: number } | null }[] = [];
    for (const { run, idx } of occ.get(id) ?? []) {
      let prev: { idx: number; d: number } | null = null;
      let next: { idx: number; d: number } | null = null;
      for (let i = idx; i >= 0; i--) {
        if (graph.has(run.nodes[i])) {
          prev = { idx: i, d: run.cum[idx] - run.cum[i] };
          break;
        }
      }
      for (let i = idx; i < run.nodes.length; i++) {
        if (graph.has(run.nodes[i])) {
          next = { idx: i, d: run.cum[i] - run.cum[idx] };
          break;
        }
      }
      out.push({ run, idx, prev, next });
    }
    return out;
  };
  const nearestGraph = (id: number): { node: number; d: number } | null => {
    let best: { node: number; d: number } | null = null;
    for (const o of graphDistances(id)) {
      for (const c of [o.prev, o.next]) {
        if (c && (!best || c.d < best.d)) best = { node: o.run.nodes[c.idx], d: c.d };
      }
    }
    return best;
  };

  const tagged = (pred: (t: Record<string, string>) => boolean) =>
    [...nodes.values()].filter((n) => n.tags && occ.has(n.id) && pred(n.tags));
  const signalNodes = tagged((t) => t.highway === 'traffic_signals');
  const miniNodes = tagged((t) => t.highway === 'mini_roundabout');
  for (const n of [...signalNodes, ...miniNodes]) {
    if (graph.has(n.id)) continue;
    const near = nearestGraph(n.id);
    if (!near || near.d > PARAMS.signalReachM) {
      graph.add(n.id);
      if (n.tags!.highway === 'traffic_signals') stats.promotedSignals++;
    }
  }

  const signal = new Set<number>();
  const circle = new Set<number>();
  const allWay = new Set<number>();
  for (const n of signalNodes) {
    const near = graph.has(n.id) ? { node: n.id, d: 0 } : nearestGraph(n.id);
    if (near && near.d <= PARAMS.signalReachM) signal.add(near.node);
  }
  for (const n of miniNodes) {
    const near = graph.has(n.id) ? { node: n.id, d: 0 } : nearestGraph(n.id);
    if (near && near.d <= PARAMS.signalReachM) circle.add(near.node);
  }

  const segsByRun = new Map<Run, Segment[]>();
  const links: Link[] = [];
  const mkLink = (run: Run, a: number, b: number, forward: boolean): Link => {
    const idxs: number[] = [];
    for (let i = a; i <= b; i++) idxs.push(i);
    if (!forward) idxs.reverse();
    return {
      osmWayId: run.way.id,
      from: run.nodes[forward ? a : b],
      to: run.nodes[forward ? b : a],
      rev: null,
      name: run.name,
      cls: run.cls,
      lanes: forward ? run.lanesF : run.lanesB,
      speed: forward ? run.speedF : run.speedB,
      geometry: idxs.map((i) => run.xy[i]),
      stopAtEnd: false,
      humps: [],
      bikeLane: forward ? run.bikeF : run.bikeB,
      bikeRoute: run.bikeRoute,
      sidewalk: run.sidewalk,
      crossings: [],
      alive: true,
    };
  };
  for (const run of runs) {
    const segs: Segment[] = [];
    let a = 0;
    for (let i = 1; i < run.nodes.length; i++) {
      if (!graph.has(run.nodes[i])) continue;
      const seg: Segment = { run, a, b: i };
      a = i;
      if (run.cum[seg.b] - run.cum[seg.a] < PARAMS.minLinkM) continue;
      if (run.fwd) {
        seg.fwdLink = mkLink(run, seg.a, seg.b, true);
        links.push(seg.fwdLink);
      }
      if (run.bwd) {
        seg.bwdLink = mkLink(run, seg.a, seg.b, false);
        links.push(seg.bwdLink);
      }
      if (seg.fwdLink && seg.bwdLink) {
        seg.fwdLink.rev = seg.bwdLink;
        seg.bwdLink.rev = seg.fwdLink;
      }
      segs.push(seg);
    }
    segsByRun.set(run, segs);
  }
  const segAt = (run: Run, idx: number, strict: boolean) =>
    segsByRun.get(run)!.find((s) => (strict ? s.a < idx && idx < s.b : s.a <= idx && idx <= s.b));

  for (const n of tagged((t) => PARAMS.humpTags.includes(t.traffic_calming))) {
    for (const { run, idx } of occ.get(n.id)!) {
      if (graph.has(n.id)) {
        stats.humpsAtJunction++;
        continue;
      }
      const seg = segAt(run, idx, true);
      if (!seg) continue;
      const d = run.cum[idx] - run.cum[seg.a];
      const len = run.cum[seg.b] - run.cum[seg.a];
      seg.fwdLink?.humps.push(round1(d));
      seg.bwdLink?.humps.push(round1(len - d));
    }
  }

  // Marked crosswalks: at or near a junction they mark the junction, farther along they are mid-block crossings.
  const marked = new Set<number>();
  for (const n of tagged((t) => isMarkedCrossing(t))) {
    if (graph.has(n.id)) {
      marked.add(n.id);
      continue;
    }
    for (const { run, idx } of occ.get(n.id)!) {
      const seg = segAt(run, idx, true);
      if (!seg) continue;
      const d = run.cum[idx] - run.cum[seg.a];
      const len = run.cum[seg.b] - run.cum[seg.a];
      if (Math.min(d, len - d) <= PARAMS.crossingAtJunctionM) {
        marked.add(run.nodes[d <= len - d ? seg.a : seg.b]);
        continue;
      }
      seg.fwdLink?.crossings.push(round1(d));
      seg.bwdLink?.crossings.push(round1(len - d));
    }
  }

  const stopTargets = new Set<number>();
  const approach = (l: Link | undefined) => {
    if (!l) return;
    l.stopAtEnd = true;
    stopTargets.add(l.to);
  };
  for (const n of tagged((t) => t.highway === 'stop')) {
    const dirTag = n.tags!.direction;
    const all = n.tags!.stop === 'all';
    const before = stopTargets.size;
    const hits: number[] = [];
    const doFwd = (seg: Segment | undefined) => {
      approach(seg?.fwdLink);
      if (seg?.fwdLink) hits.push(seg.fwdLink.to);
    };
    const doBwd = (seg: Segment | undefined) => {
      approach(seg?.bwdLink);
      if (seg?.bwdLink) hits.push(seg.bwdLink.to);
    };
    if (graph.has(n.id)) {
      const occs = occ.get(n.id)!;
      for (const { run, idx } of occs) {
        const segs = segsByRun.get(run)!;
        const prevSeg = segs.find((s) => s.b === idx);
        const nextSeg = segs.find((s) => s.a === idx);
        const isEnd = idx === 0 || idx === run.nodes.length - 1;
        const anyEnd = occs.some((o) => o.idx === 0 || o.idx === o.run.nodes.length - 1);
        if (dirTag === 'forward') doFwd(prevSeg);
        else if (dirTag === 'backward') doBwd(nextSeg);
        else if (dirTag === 'both' || isEnd || !anyEnd) {
          doFwd(prevSeg);
          doBwd(nextSeg);
        }
      }
    } else {
      for (const o of graphDistances(n.id)) {
        if (!o.prev || !o.next) continue;
        const seg = segAt(o.run, o.idx, true);
        if (!seg) continue;
        const nearest = Math.min(o.prev.d, o.next.d);
        if (nearest > PARAMS.stopReachM) {
          stats.stopsIgnoredFar++;
          continue;
        }
        if (dirTag === 'forward') doFwd(seg);
        else if (dirTag === 'backward') doBwd(seg);
        else if (dirTag === 'both') {
          doFwd(seg);
          doBwd(seg);
        } else if (seg.fwdLink && seg.bwdLink) {
          if (o.next.d <= o.prev.d) doFwd(seg);
          else doBwd(seg);
        } else doFwd(seg.fwdLink ? seg : undefined), doBwd(seg.bwdLink ? seg : undefined);
      }
    }
    if (hits.length === 0 && stopTargets.size === before) stats.stopsUnattributed++;
    if (all) for (const h of hits) allWay.add(h);
  }

  // Junction joining: graph nodes that form one real intersection (dual carriageways, offset signal tags, offset T
  // junctions, ramp terminals) become one node at the cluster centroid. Members must be joined by a short non-freeway
  // link and share a street name (or both be signals). Clusters whose internal links are not strongly connected are
  // skipped, so the merged node never allows a movement the members did not allow.
  const joinR = cfg.junctionJoinRadius ?? PARAMS.junctionJoinRadiusM;
  if (joinR > 0) {
    const liveLinks = links.filter((l) => l.alive);
    const touch = new Map<number, Link[]>();
    for (const l of liveLinks) {
      for (const id of [l.from, l.to]) {
        if (!touch.has(id)) touch.set(id, []);
        touch.get(id)!.push(l);
      }
    }
    const eligible = (id: number) =>
      !gateCand.has(id) &&
      !circle.has(id) &&
      edgeDist(xyOf(id)) > PARAMS.gateEdgeM &&
      (touch.get(id) ?? []).some((l) => l.cls !== 'motorway');
    const otherNames = (id: number, other: number) =>
      new Set(
        (touch.get(id) ?? [])
          .filter((l) => !((l.from === id && l.to === other) || (l.from === other && l.to === id)))
          .map((l) => l.name)
          .filter((n) => n),
      );
    const d2 = (a: number, b: number) => Math.hypot(xyOf(a)[0] - xyOf(b)[0], xyOf(a)[1] - xyOf(b)[1]);
    const cands = liveLinks
      .filter((l) => l.cls !== 'motorway' && l.from !== l.to && polylineLength(l.geometry) <= joinR && d2(l.from, l.to) <= joinR)
      .filter((l) => eligible(l.from) && eligible(l.to))
      .filter((l) => {
        if (signal.has(l.from) && signal.has(l.to)) return true;
        const a = otherNames(l.from, l.to);
        return [...otherNames(l.to, l.from)].some((n) => a.has(n));
      })
      .sort((a, b) => polylineLength(a.geometry) - polylineLength(b.geometry));
    const parent = new Map<number, number>();
    const members = new Map<number, number[]>();
    const find = (x: number): number => {
      if (!parent.has(x)) (parent.set(x, x), members.set(x, [x]));
      let r = x;
      while (parent.get(r) !== r) r = parent.get(r)!;
      parent.set(x, r);
      return r;
    };
    const centroidOf = (ids: number[]): Pt => [
      ids.reduce((s, id) => s + xyOf(id)[0], 0) / ids.length,
      ids.reduce((s, id) => s + xyOf(id)[1], 0) / ids.length,
    ];
    for (const l of cands) {
      const ra = find(l.from);
      const rb = find(l.to);
      if (ra === rb) continue;
      const all = [...members.get(ra)!, ...members.get(rb)!];
      const c = centroidOf(all);
      if (all.some((id) => Math.hypot(xyOf(id)[0] - c[0], xyOf(id)[1] - c[1]) > joinR)) continue;
      parent.set(rb, ra);
      members.set(ra, all);
      members.delete(rb);
    }
    const remap = new Map<number, number>();
    // Only strongly connected parts of a candidate cluster are joined (a one-way stub stays a separate node).
    const sccs: number[][] = [];
    for (const all of members.values()) {
      if (all.length < 2) continue;
      const inner = liveLinks.filter((l) => all.includes(l.from) && all.includes(l.to));
      const reach = (s0: number, fwd: boolean) => {
        const seen = new Set([s0]);
        const st = [s0];
        while (st.length) {
          const u = st.pop()!;
          for (const l of inner) {
            const [p, q] = fwd ? [l.from, l.to] : [l.to, l.from];
            if (p === u && !seen.has(q)) (seen.add(q), st.push(q));
          }
        }
        return seen;
      };
      const done = new Set<number>();
      for (const v of all) {
        if (done.has(v)) continue;
        const f = reach(v, true);
        const b = reach(v, false);
        const comp = all.filter((x) => f.has(x) && b.has(x));
        comp.forEach((x) => done.add(x));
        if (comp.length >= 2) sccs.push(comp);
      }
    }
    for (const ids of sccs) {
      const set = new Set(ids);
      const internal = liveLinks.filter((l) => set.has(l.from) && set.has(l.to));
      if (internal.some((l) => l.cls === 'motorway')) continue;
      const c = centroidOf(ids);
      const rep = ids.reduce((b, id) => (Math.hypot(xyOf(id)[0] - c[0], xyOf(id)[1] - c[1]) < Math.hypot(xyOf(b)[0] - c[0], xyOf(b)[1] - c[1]) ? id : b));
      const extIn = liveLinks.filter((l) => set.has(l.to) && !set.has(l.from));
      const covered = extIn.length > 0 && extIn.every((l) => l.stopAtEnd || allWay.has(l.to));
      const isSignal = ids.some((id) => signal.has(id));
      const stopsAll = !isSignal && covered && ids.some((id) => allWay.has(id) || stopTargets.has(id));
      const streets = [...new Set((touch.get(rep) ?? []).concat(...ids.map((id) => touch.get(id) ?? [])).map((l) => l.name).filter((n) => n))].sort();
      const wasMarked = ids.some((id) => marked.has(id));
      for (const id of ids) {
        marked.delete(id);
        signal.delete(id);
        allWay.delete(id);
        stopTargets.delete(id);
        gateCand.delete(id);
        graph.delete(id);
        remap.set(id, rep);
      }
      graph.add(rep);
      if (wasMarked) marked.add(rep);
      if (isSignal) signal.add(rep);
      if (stopsAll) (allWay.add(rep), stopTargets.add(rep));
      else if (extIn.some((l) => l.stopAtEnd)) stopTargets.add(rep);
      nodeXY.set(rep, c);
      stats.joinedClusters++;
      stats.joinedNodes += ids.length;
      stats.joinedList.push({ size: ids.length, streets, control: isSignal ? 'signal' : stopsAll ? 'all_way_stop' : 'other' });
    }
    for (const l of liveLinks) {
      const nf = remap.get(l.from);
      const nt = remap.get(l.to);
      if (nf === undefined && nt === undefined) continue;
      if (nf !== undefined && nt !== undefined && nf === nt) {
        l.alive = false;
        continue;
      }
      const before = polylineLength(l.geometry);
      if (nf !== undefined) {
        l.from = nf;
        l.geometry = [nodeXY.get(nf)!, ...l.geometry.slice(1)];
        const shift = polylineLength(l.geometry) - before;
        l.humps = l.humps.map((h) => round1(Math.max(0.1, h + shift)));
        l.crossings = l.crossings.map((h) => round1(Math.max(0.1, h + shift)));
      }
      if (nt !== undefined) {
        l.to = nt;
        l.geometry = [...l.geometry.slice(0, -1), nodeXY.get(nt)!];
      }
      const len = polylineLength(l.geometry);
      l.humps = l.humps.filter((h) => h < len - 0.1);
      l.crossings = l.crossings.filter((h) => h < len - 0.1);
    }
  }

  const special = new Set<number>([...signal, ...circle, ...stopTargets, ...allWay, ...gateCand]);
  for (const c of centers) if (graph.has(c)) circle.add(c);
  for (const c of circle) special.add(c);

  const sig = (l: Link) => `${l.cls}|${l.name}|${l.lanes}|${l.speed.toFixed(2)}`;
  const outOf = new Map<number, Link[]>();
  const inTo = new Map<number, Link[]>();
  const index = () => {
    outOf.clear();
    inTo.clear();
    for (const l of links) {
      if (!l.alive) continue;
      if (!outOf.has(l.from)) outOf.set(l.from, []);
      if (!inTo.has(l.to)) inTo.set(l.to, []);
      outOf.get(l.from)!.push(l);
      inTo.get(l.to)!.push(l);
    }
  };
  // Merging keeps the topology (and so every id) unchanged: attributes of the merged link are length-weighted.
  const join = (a: Link, b: Link): Link => {
    const la = polylineLength(a.geometry);
    const lb = polylineLength(b.geometry);
    return {
      ...a,
      to: b.to,
      stopAtEnd: b.stopAtEnd,
      geometry: [...a.geometry, ...b.geometry.slice(1)],
      humps: [...a.humps, ...b.humps.map((h) => round1(h + la))],
      bikeLane: (a.bikeLane ? la : 0) + (b.bikeLane ? lb : 0) > (la + lb) / 2,
      bikeRoute: (a.bikeRoute ? la : 0) + (b.bikeRoute ? lb : 0) > (la + lb) / 2,
      sidewalk: (a.sidewalk ? la : 0) + (b.sidewalk ? lb : 0) >= (la + lb) / 2,
      crossings: [...a.crossings, ...(marked.has(a.to) ? [round1(la)] : []), ...b.crossings.map((h) => round1(h + la))],
      rev: null,
      alive: true,
    };
  };
  let changed = true;
  while (changed) {
    changed = false;
    index();
    for (const id of graph) {
      if (special.has(id)) continue;
      const ins = (inTo.get(id) ?? []).filter((l) => l.alive);
      const outs = (outOf.get(id) ?? []).filter((l) => l.alive);
      if (ins.length === 1 && outs.length === 1) {
        const [a] = ins;
        const [b] = outs;
        if (a.rev || b.rev || a === b || a.from === b.to || sig(a) !== sig(b)) continue;
        const m = join(a, b);
        a.alive = b.alive = false;
        links.push(m);
        stats.merged++;
        changed = true;
        break;
      }
      if (ins.length === 2 && outs.length === 2 && ins.every((l) => l.rev) && outs.every((l) => l.rev)) {
        const a = ins[0];
        const b = outs.find((l) => l !== a.rev)!;
        const bRev = b.rev!;
        const aRev = a.rev!;
        if (!b || bRev === a || a.from === b.to || sig(a) !== sig(b) || sig(aRev) !== sig(bRev)) continue;
        const m = join(a, b);
        const mr = join(bRev, aRev);
        m.rev = mr;
        mr.rev = m;
        a.alive = b.alive = aRev.alive = bRev.alive = false;
        links.push(m, mr);
        stats.merged++;
        changed = true;
        break;
      }
    }
  }
  const live = links.filter((l) => l.alive);

  const deg = new Map<number, Set<number>>();
  for (const l of live) {
    for (const [p, q] of [[l.from, l.to], [l.to, l.from]]) {
      if (!deg.has(p)) deg.set(p, new Set());
      deg.get(p)!.add(q);
    }
  }
  const gates = new Set<number>();
  for (const id of deg.keys()) {
    if (gateCand.has(id)) gates.add(id);
    else if (deg.get(id)!.size === 1 && edgeDist(xyOf(id)) <= PARAMS.gateEdgeM) gates.add(id);
  }
  stats.gateCandidates = gates.size;

  const ids = [...deg.keys()];
  const idx = new Map(ids.map((id, i) => [id, i]));
  const adjF: number[][] = ids.map(() => []);
  const adjB: number[][] = ids.map(() => []);
  for (const l of live) {
    adjF[idx.get(l.from)!].push(idx.get(l.to)!);
    adjB[idx.get(l.to)!].push(idx.get(l.from)!);
  }
  const order: number[] = [];
  const seen = new Uint8Array(ids.length);
  for (let s = 0; s < ids.length; s++) {
    if (seen[s]) continue;
    const stack: [number, number][] = [[s, 0]];
    seen[s] = 1;
    while (stack.length) {
      const top = stack[stack.length - 1];
      const nb = adjF[top[0]];
      if (top[1] < nb.length) {
        const v = nb[top[1]++];
        if (!seen[v]) {
          seen[v] = 1;
          stack.push([v, 0]);
        }
      } else {
        order.push(top[0]);
        stack.pop();
      }
    }
  }
  const comp = new Int32Array(ids.length).fill(-1);
  let nc = 0;
  for (let k = order.length - 1; k >= 0; k--) {
    const s = order[k];
    if (comp[s] >= 0) continue;
    const stack = [s];
    comp[s] = nc;
    while (stack.length) {
      const u = stack.pop()!;
      for (const v of adjB[u]) if (comp[v] < 0) (comp[v] = nc), stack.push(v);
    }
    nc++;
  }
  const sizes = new Array(nc).fill(0);
  comp.forEach((c) => sizes[c]++);
  const main = sizes.indexOf(Math.max(...sizes));
  const keep = new Uint8Array(ids.length);
  comp.forEach((c, i) => {
    if (c === main) keep[i] = 1;
  });
  const reach = (adj: number[][], starts: number[], allowed: (i: number) => boolean) => {
    const vis = new Uint8Array(ids.length);
    const st = [...starts];
    st.forEach((s) => (vis[s] = 1));
    while (st.length) {
      const u = st.pop()!;
      for (const v of adj[u]) if (!vis[v] && allowed(v)) (vis[v] = 1), st.push(v);
    }
    return vis;
  };
  const mainNodes = ids.map((_, i) => i).filter((i) => keep[i]);
  const F = reach(adjF, mainNodes, () => true);
  const B = reach(adjB, mainNodes, () => true);
  const outGates = ids.map((id, i) => i).filter((i) => F[i] && !keep[i] && gates.has(ids[i]));
  const inGates = ids.map((id, i) => i).filter((i) => B[i] && !keep[i] && gates.has(ids[i]));
  const kOut = reach(adjB, outGates, (i) => !!F[i] && !keep[i]);
  const kIn = reach(adjF, inGates, (i) => !!B[i] && !keep[i]);
  const keep0 = keep.slice();
  for (let i = 0; i < ids.length; i++) if ((kOut[i] && F[i] && !keep[i]) || (kIn[i] && B[i] && !keep[i])) keep[i] = 1;
  const finalLinks = live.filter((l) => keep[idx.get(l.from)!] && keep[idx.get(l.to)!]);
  stats.prunedLinks = live.length - finalLinks.length;

  const used = new Set<number>();
  for (const l of finalLinks) (used.add(l.from), used.add(l.to));
  const nodeIds = ids.filter((id) => used.has(id));
  const surfaceNodes = new Set(finalLinks.filter((l) => l.cls !== 'motorway').flatMap((l) => [l.from, l.to]));
  const hasOut = new Set(finalLinks.map((l) => l.from));
  const hasIn = new Set(finalLinks.map((l) => l.to));
  // Links on a boundary street count as inside even though their centerline lies on the polygon edge.
  const onBoundary = (l: Link, mid: Pt) =>
    l.cls !== 'motorway' &&
    (cfg.boundary ?? []).some((b) =>
      typeof b === 'string'
        ? l.name === b
        : (b.name === undefined || l.name === b.name) && (b.ref === undefined || l.name === b.ref) && (b.class === undefined || l.cls === b.class),
    ) &&
    distToRing(mid, studyPoly) <= PARAMS.boundaryReachM;
  const boundaryNodes = new Set<number>();
  for (const l of finalLinks) {
    const g = l.geometry;
    if (onBoundary(l, pointAlong(g, polylineLength(g) / 2))) (boundaryNodes.add(l.from), boundaryNodes.add(l.to));
  }
  const nodeIndex = new Map(nodeIds.map((id, i) => [id, i]));
  const linkIndex = new Map(finalLinks.map((l, i) => [l, i]));

  const inLinks = new Map<number, Link[]>();
  for (const l of finalLinks) {
    if (!inLinks.has(l.to)) inLinks.set(l.to, []);
    inLinks.get(l.to)!.push(l);
  }
  const outNodes: NetNode[] = nodeIds.map((id, i) => {
    const ins = inLinks.get(id) ?? [];
    let control: NodeControl;
    if (signal.has(id)) control = 'signal';
    else if (circle.has(id)) control = 'traffic_circle';
    else if (allWay.has(id)) control = 'all_way_stop';
    else {
      const k = ins.filter((l) => l.stopAtEnd).length;
      control = k === 0 ? 'uncontrolled' : k === ins.length ? 'all_way_stop' : 'two_way_stop';
    }
    for (const l of ins) l.stopAtEnd = control === 'all_way_stop' || (control === 'two_way_stop' && l.stopAtEnd);
    const p = xyOf(id);
    const node: NetNode = {
      id: i,
      osmId: id,
      x: round1(p[0]),
      y: round1(p[1]),
      control,
      gate: gates.has(id),
      inStudyArea: surfaceNodes.has(id) && (pointInPolygon(p, studyPoly) || (boundaryNodes.has(id) && distToRing(p, studyPoly) <= PARAMS.boundaryReachM)),
    };
    if (marked.has(id)) node.markedCrossing = true;
    if (node.gate) {
      // Trips can enter at a gate with an outgoing link from which the main network is reachable, and leave at
      // one with an incoming link reachable from it.
      const k = idx.get(id)!;
      node.canEnter = hasOut.has(id) && (!!keep0[k] || !!B[k]);
      node.canExit = hasIn.has(id) && (!!keep0[k] || !!F[k]);
    }
    return node;
  });

  const outLinks: NetLink[] = finalLinks.map((l, i) => {
    const geometry = l.geometry.map((p): [number, number] => [round1(p[0]), round1(p[1])]);
    const length = round1(polylineLength(geometry));
    const mid = pointAlong(geometry, length / 2);
    const link: NetLink = {
      id: i,
      osmWayId: l.osmWayId,
      from: nodeIndex.get(l.from)!,
      to: nodeIndex.get(l.to)!,
      reverse: l.rev && linkIndex.has(l.rev) ? linkIndex.get(l.rev)! : null,
      name: l.name,
      class: l.cls,
      lanes: l.lanes,
      speedLimit: Math.round(l.speed * 100) / 100,
      length,
      geometry,
      stopAtEnd: l.stopAtEnd,
      humps: [...l.humps].sort((a, b) => a - b),
      inStudyArea: l.cls !== 'motorway' && (pointInPolygon(mid, studyPoly) || onBoundary(l, mid)),
      sidewalk: l.sidewalk,
    };
    if (l.bikeLane) link.bikeLane = true;
    if (l.bikeRoute) link.bikeRoute = true;
    const cr = [...new Set(l.crossings.filter((c) => c > 0 && c < length))].sort((a, b) => a - b);
    if (cr.length) link.crossings = cr;
    return link;
  });

  return {
    network: {
      version: 1,
      id: cfg.id,
      name: cfg.name,
      origin: { lon: lon0, lat: lat0 },
      bbox: cfg.bbox,
      studyArea: cfg.studyArea,
      nodes: outNodes,
      links: outLinks,
    },
    stats,
  };
}
