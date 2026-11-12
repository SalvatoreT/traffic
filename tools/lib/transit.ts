// Cuts a GTFS feed to a study area: map-matches route shapes to network links, projects stops, computes headways.
// Shape matching follows [Newson2009] (see tools/lib/mapmatch.ts).
import { cumulative, dist, makeProjection, pointAlong, type Pt } from './geo';
import { activeServices, type Gtfs } from './gtfs';
import { DEFAULT_MATCH, LinkIndex, matchShape, type MatchParams } from './mapmatch';
import type { Network } from './types';

export interface TransitConfig {
  area: string;
  /** Windows over which headways are counted, in hours of the weekday (same ids as the demand periods). */
  periods: { id: string; startHour: number; endHour: number }[];
  dwellSeconds: number;
  /** Routes whose matched path inside the model is shorter than this are dropped (corner clips). */
  minRouteLengthM: number;
  /** A stop farther than this from the matched path is not placed. */
  maxStopDistM: number;
  /** A variant pattern with fewer than this share of its route-direction's trips is dropped. */
  minVariantShare: number;
  referenceDate?: string;
  match?: Partial<MatchParams>;
  feed: { agency: string; page: string; downloadUrl: string };
}

export interface TransitRoute {
  id: string;
  name: string;
  links: number[];
  stops: { link: number; position: number; name: string; dwell: number }[];
  headways: { period: string; seconds: number }[];
}

export interface Transit {
  version: 1;
  area: string;
  routes: TransitRoute[];
  provenance: { source: string; url: string; note: string }[];
}

export interface RouteReport {
  id: string;
  name: string;
  dir: number;
  links: number;
  lengthM: number;
  stops: number;
  trips: number;
  headways: Record<string, number | null>;
}

const round1 = (v: number) => Math.round(v * 10) / 10;

export function buildTransit(net: Network, g: Gtfs, cfg: TransitConfig, refDate: string): { transit: Transit; report: RouteReport[] } {
  const proj = makeProjection(net.origin.lon, net.origin.lat);
  const mlinks = net.links.map((l) => ({ id: l.id, from: l.from, to: l.to, geometry: l.geometry as Pt[], length: l.length, cls: l.class }));
  const index = new LinkIndex(mlinks);
  const byId = new Map(mlinks.map((l) => [l.id, l]));
  const params = { ...DEFAULT_MATCH, ...cfg.match };
  const [bx0, by0] = proj.fwd(net.bbox[0], net.bbox[1]);
  const [bx1, by1] = proj.fwd(net.bbox[2], net.bbox[3]);
  const touchesModel = (shape: Pt[]) => shape.some((p) => p[0] >= bx0 && p[0] <= bx1 && p[1] >= by0 && p[1] <= by1);

  const active = activeServices(g, refDate);
  // route|dir|shape -> trip ids on the reference day
  const groups = new Map<string, string[]>();
  for (const t of g.trips.values()) {
    if (!active.has(t.service) || !g.stopTimes.has(t.id)) continue;
    const k = `${t.route}|${t.dir}|${t.shape}`;
    (groups.get(k) ?? groups.set(k, []).get(k)!).push(t.id);
  }

  interface Entry {
    route: string;
    dir: number;
    links: number[];
    length: number;
    trips: string[];
  }
  const entries = new Map<string, Entry>();
  const shapeCache = new Map<string, ReturnType<typeof matchShape>>();
  for (const [k, trips] of groups) {
    const [route, dir, shapeId] = k.split('|');
    const raw = g.shapes.get(shapeId);
    if (!raw) continue;
    const shape = raw.map(([lon, lat]) => proj.fwd(lon, lat));
    if (!touchesModel(shape)) continue;
    let matched = shapeCache.get(shapeId);
    if (!matched) shapeCache.set(shapeId, (matched = matchShape(index, shape, params)));
    for (const m of matched) {
      if (m.length < cfg.minRouteLengthM) continue;
      const key = `${route}|${dir}|${m.links.join(',')}`;
      const e = entries.get(key) ?? entries.set(key, { route, dir: +dir, links: m.links, length: m.length, trips: [] }).get(key)!;
      e.trips.push(...trips);
    }
  }

  const tripsPerRouteDir = new Map<string, number>();
  for (const e of entries.values()) tripsPerRouteDir.set(`${e.route}|${e.dir}`, (tripsPerRouteDir.get(`${e.route}|${e.dir}`) ?? 0) + e.trips.length);
  const kept = [...entries.values()]
    .filter((e) => e.trips.length >= cfg.minVariantShare * tripsPerRouteDir.get(`${e.route}|${e.dir}`)!)
    .sort((a, b) => (g.routes.get(a.route)!.name.localeCompare(g.routes.get(b.route)!.name, 'en', { numeric: true }) || a.dir - b.dir || b.trips.length - a.trips.length));

  const center: Pt = [(bx0 + bx1) / 2, (by0 + by1) / 2];
  const routes: TransitRoute[] = [];
  const report: RouteReport[] = [];
  const seen = new Map<string, number>();
  for (const e of kept) {
    const rt = g.routes.get(e.route)!;
    const path: Pt[] = [];
    const offsets: number[] = [];
    let off = 0;
    for (const id of e.links) {
      offsets.push(off);
      const geo = byId.get(id)!.geometry;
      path.push(...(path.length ? geo.slice(1) : geo));
      off += byId.get(id)!.length;
    }
    const cum = cumulative(path);

    // Stops of the trip with the most stops, projected onto the path in travel order.
    const rep = e.trips.reduce((b, t) => (g.stopTimes.get(t)!.length > g.stopTimes.get(b)!.length ? t : b));
    let last = -1;
    const placed: { gtfsId: string; link: number; position: number; name: string; at: number }[] = [];
    for (const st of g.stopTimes.get(rep)!) {
      const s = g.stops.get(st.stop);
      if (!s) continue;
      const p = proj.fwd(s.lon, s.lat);
      let best = { d: Infinity, at: 0 };
      for (let i = 1; i < path.length; i++) {
        const a = path[i - 1];
        const b = path[i];
        const l2 = (b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2;
        const u = l2 === 0 ? 0 : Math.max(0, Math.min(1, ((p[0] - a[0]) * (b[0] - a[0]) + (p[1] - a[1]) * (b[1] - a[1])) / l2));
        const at = cum[i - 1] + u * (cum[i] - cum[i - 1]);
        if (at < last - 1) continue;
        const d = Math.hypot(p[0] - (a[0] + u * (b[0] - a[0])), p[1] - (a[1] + u * (b[1] - a[1])));
        if (d < best.d) best = { d, at };
      }
      if (best.d > cfg.maxStopDistM) continue;
      last = best.at;
      let li = offsets.length - 1;
      while (li > 0 && offsets[li] > best.at) li--;
      const link = byId.get(e.links[li])!;
      const position = Math.min(Math.max(best.at - offsets[li], 0.5), link.length - 0.5);
      const prev = placed.at(-1);
      if (prev && prev.link === link.id && Math.abs(prev.position - position) < 10) continue;
      placed.push({ gtfsId: st.stop, link: link.id, position: round1(position), name: s.name, at: best.at });
    }

    // Headways: trips counted at the in-area stop served by most of this pattern's trips (nearest the center on a tie).
    const served = new Map<string, number>();
    for (const t of e.trips) for (const st of g.stopTimes.get(t)!) served.set(st.stop, (served.get(st.stop) ?? 0) + 1);
    const refStop = placed
      .map((p) => ({ p, n: served.get(p.gtfsId) ?? 0, d: dist(pointAlong(path, p.at), center) }))
      .sort((a, b) => b.n - a.n || a.d - b.d)[0]?.p.gtfsId;
    const headways: { period: string; seconds: number }[] = [];
    const hw: Record<string, number | null> = {};
    for (const per of cfg.periods) {
      const lo = per.startHour * 3600;
      const hi = per.endHour * 3600;
      let n = 0;
      if (refStop) {
        for (const t of e.trips) {
          const st = g.stopTimes.get(t)!.find((x) => x.stop === refStop);
          if (st && st.t >= lo && st.t < hi) n++;
        }
      }
      hw[per.id] = n ? Math.round((hi - lo) / n) : null;
      if (n) headways.push({ period: per.id, seconds: Math.round((hi - lo) / n) });
    }

    const base = `${rt.name}-${e.dir}`;
    const nth = (seen.get(base) ?? 0) + 1;
    seen.set(base, nth);
    const id = nth === 1 ? base : `${base}-${nth}`;
    routes.push({
      id,
      name: rt.name,
      links: e.links,
      stops: placed.map((p) => ({ link: p.link, position: p.position, name: p.name, dwell: cfg.dwellSeconds })),
      headways,
    });
    report.push({ id, name: rt.name, dir: e.dir, links: e.links.length, lengthM: Math.round(e.length), stops: placed.length, trips: e.trips.length, headways: hw });
  }

  const f = g.feed;
  const feedDesc = [f.feed_version && `version ${f.feed_version}`, f.feed_start_date && `valid ${f.feed_start_date} to ${f.feed_end_date ?? '?'}`, f.feed_publisher_name].filter(Boolean).join(', ');
  return {
    transit: {
      version: 1,
      area: cfg.area,
      routes,
      provenance: [
        {
          source: `${cfg.feed.agency} GTFS static feed${feedDesc ? ` (${feedDesc})` : ''}`,
          url: cfg.feed.page,
          note: `DATA: routes, shapes, stops and weekday trips of ${refDate}, cut to the model area. Shapes are map-matched to network links [Newson2009]; stops are projected onto those links. Headway = window length / trips of the pattern at one in-area stop, per demand period (windows in the transit config). Dwell of ${cfg.dwellSeconds} s per stop is an ASSUMPTION (no boarding data).`,
        },
      ],
    },
    report,
  };
}
