// Builds <area>.demand.json from the network, public counts and LODES. Node built-ins only.
// Usage: npx tsx tools/build-demand.ts [data/demand/<area>.config.json]
// Method and provenance: data/demand/README.md. Steps are tagged DATA or ASSUMPTION.
// Methods: Furness/IPF balancing of the gate-to-gate matrix; gravity seeding; LODES [LODES]; freeway-ramp demand (DATA ramp ADT, ASSUMPTION destination choice).
import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { buildActiveFlows, parseActiveCounts, type AFlow } from './lib/demand-active';
import { discoverRamps, matchRampVolumes, type Ramp, type RampRow, type RampVolume } from './lib/demand-ramps';
import { linkMetrics, perimeterGap, perimeterLength, perimeterPos, relevanceOf, Router, routeStat, sideOf, type Rect, type Relevance, type RouteStat } from './lib/demand-audit';
import { makeProjection } from './lib/geo';
import { buildStations, fitPeriod, fitReport, type FitConfig, type NetLinkIn, type PeriodResult } from './lib/demand-fit';
import type { FlowType } from './lib/fit-counts';

const cfgPath = process.argv[2] ?? 'data/demand/rockridge.config.json';
const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));

interface Node { id: number; x: number; y: number; gate: boolean; canEnter?: boolean; canExit?: boolean; inStudyArea: boolean }
interface Link { id: number; from: number; to: number; name: string; class: string; length: number; lanes?: number; speedLimit?: number; geometry?: [number, number][]; inStudyArea: boolean; bikeLane?: boolean; bikeRoute?: boolean; humps?: number[]; stopAtEnd?: boolean }
interface Network { id: string; origin: { lon: number; lat: number }; studyArea: [number, number][]; nodes: (Node & { control: string })[]; links: Link[]; turnBans?: { from: number; to: number; periods?: string[] }[] }
// `mode` is absent on car flows (default car). Pedestrian and bicycle flows are persons per hour in the same field.
interface Flow { origin: number; destination: number; vehPerHour: number; mode?: 'car' | 'bicycle' | 'pedestrian' }

const missing = [cfg.network, cfg.raw.lodes, cfg.raw.caltrans, cfg.raw.caltransRamps, cfg.raw.oaklandTmc].filter((f: string) => !existsSync(f));
if (missing.length) {
  console.error(`Missing input files:\n  ${missing.join('\n  ')}\nRaw demand data: run \`npx tsx tools/fetch-demand.ts\` (or \`npm run data:pull\`); network: run tools/import-osm.ts.`);
  process.exit(1);
}
const net: Network = JSON.parse(readFileSync(cfg.network, 'utf8'));
const periodIds: string[] = cfg.periods.map((p: { id: string }) => p.id);
const lastPeriod = 'pm_peak';

const M_LAT = 110540;
const mLon = (lat: number) => 111320 * Math.cos((lat * Math.PI) / 180);
const toXY = (lat: number, lon: number): [number, number] => [(lon - net.origin.lon) * mLon(net.origin.lat), (lat - net.origin.lat) * M_LAT];

// Study-area center (metres) from the polygon, else mean of in-area nodes.
const poly = net.studyArea?.map(([lon, lat]) => toXY(lat, lon)) ?? [];
const center: [number, number] = poly.length
  ? [poly.reduce((s, p) => s + p[0], 0) / poly.length, poly.reduce((s, p) => s + p[1], 0) / poly.length]
  : (() => { const n = net.nodes.filter((q) => q.inStudyArea); return [n.reduce((s, q) => s + q.x, 0) / n.length, n.reduce((s, q) => s + q.y, 0) / n.length] as [number, number]; })();
const bearing = (x: number, y: number, cx = center[0], cy = center[1]) => ((Math.atan2(x - cx, y - cy) * 180) / Math.PI + 360) % 360;
const angDiff = (a: number, b: number) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
const SECTORS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
const sectorOf = (deg: number) => SECTORS[Math.round(deg / 45) % 8];
const legOf = (deg: number) => ['N', 'E', 'S', 'W'][Math.round(deg / 90) % 4];

// ---------- node/link indexing ----------
const incident = new Map<number, Link[]>();
for (const l of net.links) for (const n of [l.from, l.to]) (incident.get(n) ?? incident.set(n, []).get(n)!).push(l);
const classRank: Record<string, number> = { motorway: 6, primary: 5, secondary: 4, tertiary: 3, residential: 2, service: 1 };

function streetKey(name: string): string | null {
  const n = (name ?? '').toLowerCase();
  for (const [key, pats] of Object.entries<string[]>(cfg.streetMatch)) if (key[0] !== '_' && pats.some((p) => n.includes(p))) return key;
  return null;
}

// ---------- DATA: Oakland turning-movement counts (one entry per counted intersection) ----------
interface LegVol { entering: number; leaving: number; files: number }
interface Count { id: string; legs: Record<string, LegVol>; files: string[]; peakHours: string[]; x: number; y: number; legStreets: Record<string, string>; maxLegDistM: number }
function readTmc(sc: { source: string; filePattern: string | string[]; intersection: { lat: number; lon: number }; legStreets: Record<string, string>; maxLegDistM?: number }): Count | null {
  const dir = cfg.raw[sc?.source];
  if (!sc || !dir || !existsSync(dir)) return null;
  const pats = Array.isArray(sc.filePattern) ? sc.filePattern : [sc.filePattern];
  const files = readdirSync(dir).filter((f) => pats.some((p) => f.includes(p)) && f.endsWith('.csv'));
  const legs: Record<string, LegVol> = {};
  const map: Record<string, [string, string]> = { N: ['SBEntering', 'NBLeaving'], S: ['NBEntering', 'SBLeaving'], E: ['WBEntering', 'EBLeaving'], W: ['EBEntering', 'WBLeaving'] };
  const peakHours: string[] = [];
  for (const f of files) {
    const lines = readFileSync(join(dir, f), 'utf8').replace(/^﻿/, '').split(/\r?\n/);
    const i = lines.findIndex((l) => /^PEAK-HOUR VOLUMES,*$/.test(l.trim()));
    if (i < 0) continue;
    const h = lines[i + 1].split(',');
    const v = lines[i + 2].split(',');
    const get = (k: string) => +v[h.indexOf(k)];
    const ph = lines.find((l) => l.startsWith('PEAK HOUR START'))?.split(',')[1];
    if (ph) peakHours.push(`${f}: ${ph}`);
    for (const [leg, [inK, outK]] of Object.entries(map)) {
      const r = (legs[leg] ??= { entering: 0, leaving: 0, files: 0 });
      r.entering += get(inK); r.leaving += get(outK); r.files++;
    }
  }
  for (const r of Object.values(legs)) { r.entering /= r.files; r.leaving /= r.files; }
  const [x, y] = toXY(sc.intersection.lat, sc.intersection.lon);
  return Object.keys(legs).length ? { id: pats[0], legs, files, peakHours, x, y, legStreets: sc.legStreets, maxLegDistM: sc.maxLegDistM ?? 2500 } : null;
}
const tmcs: Count[] = (cfg.streetCounts ?? []).map(readTmc).filter((c: Count | null): c is Count => c !== null);
// The first count (Telegraph Ave & Alcatraz Ave) is also the pedestrian and bicycle scaling point.
const tmc = tmcs[0] ?? null;
const [tx, ty] = tmc ? [tmc.x, tmc.y] : [0, 0];

// ---------- gates: peak targets per period ----------
interface Gate { id: number; street: string | null; cls: string; deg: number; source: string; kind: 'DATA' | 'DATA(adt)' | 'ASSUMPTION'; adt: number | null; pmIn: number; pmOut: number; inT: Record<string, number>; outT: Record<string, number>; locIn: Record<string, number>; locOut: Record<string, number> }
const gates: Gate[] = [];
const pf = cfg.periodFactors;
const pct = (a: number, b: number) => `${((100 * a) / (b || 1)).toFixed(0)}%`;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

// ---------- freeway topology (generic: freeway-class links, ramps = surface nodes touched by them) ----------
const { ramps, freewayGates: freewayIds } = discoverRamps(net.nodes, net.links, new Set<string>(cfg.freewayClasses ?? []));
const nodeById = new Map(net.nodes.map((n) => [n.id, n]));
const legGroups = new Map<string, { orig: number; dest: number }>();
// Origins must be enterable gates (canEnter), destinations exitable (canExit); falls back to link topology.
const caps = (id: number) => {
  const ls = incident.get(id) ?? [];
  const n = nodeById.get(id)!;
  return { canIn: n.canEnter ?? ls.some((l) => l.from === id), canOut: n.canExit ?? ls.some((l) => l.to === id) };
};
// Node-level forward reachability (ignores turn restrictions; the sim reports any residual unroutable trips).
const outAdj = new Map<number, number[]>();
for (const l of net.links) (outAdj.get(l.from) ?? outAdj.set(l.from, []).get(l.from)!).push(l.to);
const reachCache = new Map<number, Set<number>>();
const reachFrom = (o: number) => {
  let r = reachCache.get(o);
  if (!r) {
    r = new Set([o]);
    const st = [o];
    while (st.length) for (const v of outAdj.get(st.pop()!) ?? []) if (!r.has(v)) (r.add(v), st.push(v));
    reachCache.set(o, r);
  }
  return r;
};
const routable = (o: number, d: number) => o !== d && reachFrom(o).has(d);
// One-way gate pairing: an enter-only gate and an exit-only gate within PAIR_M metres that share a street name.
const PAIR_M = 250;
const linkNames = (id: number) => new Set((incident.get(id) ?? []).filter((l) => l.name && l.class !== 'motorway').map((l) => l.name.toLowerCase()));
function hasGatePartner(n: Node, nIsIn: boolean): boolean {
  const names = linkNames(n.id);
  return net.nodes.some((q) => {
    if (!q.gate || q.id === n.id || freewayIds.has(q.id)) return false;
    const c = caps(q.id);
    if (c.canIn && c.canOut) return false;
    if (nIsIn ? !c.canOut : !c.canIn) return false;
    if (Math.hypot(q.x - n.x, q.y - n.y) > PAIR_M) return false;
    return [...linkNames(q.id)].some((nm) => names.has(nm));
  });
}
// Gates on the same street within PAIR_M of each other: two-way gates count one each, an enter-only/exit-only pair counts one.
function streetGroupSize(n: Node): number {
  const names = linkNames(n.id);
  if (!names.size) return 1;
  let both = 0, ins = 0, outs = 0;
  for (const q of surfaceGates) {
    if (Math.hypot(q.x - n.x, q.y - n.y) > PAIR_M || ![...linkNames(q.id)].some((nm) => names.has(nm))) continue;
    const c = caps(q.id);
    if (c.canIn && c.canOut) both++; else if (c.canIn) ins++; else outs++;
  }
  return Math.max(1, both + Math.max(ins, outs));
}
// DATA assignment: a gate takes the leg volume of the nearest counted intersection whose leg street and compass direction match the gate's street and bearing.
function countFor(n: Node, street: string | null): { c: Count; leg: string } | null {
  if (!street) return null;
  let best: { c: Count; leg: string; d: number } | null = null;
  for (const c of tmcs) {
    const leg = legOf(bearing(n.x, n.y, c.x, c.y));
    const d = Math.hypot(n.x - c.x, n.y - c.y);
    if (c.legStreets[leg] === street && c.legs[leg] && d <= c.maxLegDistM && (!best || d < best.d)) best = { c, leg, d };
  }
  return best;
}
const surfaceGates = net.nodes.filter((q) => q.gate && !freewayIds.has(q.id));
const proj = makeProjection(net.origin.lon, net.origin.lat);
const rect: Rect = (() => { const [a, b] = proj.fwd(cfg.bbox[0], cfg.bbox[1]), [c, d] = proj.fwd(cfg.bbox[2], cfg.bbox[3]); return { minX: a, minY: b, maxX: c, maxY: d }; })();
const polyP = net.studyArea.map(([lon, lat]) => proj.fwd(lon, lat));
const router = new Router(net.links);
const lmet = linkMetrics(net.links, nodeById, polyP, rect);
const NEAR_M: number = cfg.audit?.nearM ?? 400;
const cordon = cfg.cordon ?? { signalizedVehPerHourPerLane: 837, freewayVehPerHourPerLane: 2184 };
const laneSum = (id: number, dir: 'from' | 'to') => (incident.get(id) ?? []).filter((l) => l[dir] === id).reduce((a, l) => a + (l.lanes ?? 1), 0);
const perimTotal = perimeterLength(rect);
const statCache = new Map<number, RouteStat | null>();
const statOf = (o: number, d: number): RouteStat | null => {
  const k = o * 100003 + d;
  if (statCache.has(k)) return statCache.get(k)!;
  const r = router.route(o, d);
  const v = r ? routeStat(r, lmet) : null;
  statCache.set(k, v);
  return v;
};

const gateStreet = (n: Node) => (incident.get(n.id) ?? []).map((l) => streetKey(l.name)).find(Boolean) ?? null;
const gateClass = (n: Node) => (incident.get(n.id) ?? []).reduce((a, l) => (classRank[l.class] > (classRank[a] ?? 0) ? l.class : a), '') || 'residential';
const nearestOverride = (n: Node, street: string | null) => {
  const cands = (cfg.adtOverrides ?? []).filter((o: { street: string }) => o.street === street);
  const dOf = (o: { lat?: number; lon?: number }) => (o.lat === undefined ? 0 : Math.hypot(...(toXY(o.lat, o.lon!).map((v, i) => v - (i ? n.y : n.x)) as [number, number])));
  return cands.sort((a: object, b: object) => dOf(a) - dOf(b))[0] as { adt: number; factor?: number; source: string } | undefined;
};
// Class-default ADT (step 4 of the fifth-round calibration): the median ADT of the counted streets of that class when at least `minStreets` exist (DATA-derived), else the documented value.
// A counted street's ADT is its count-based two-way volume: a TMC leg's peak-hour entering + leaving volume divided by K, or the Caltrans station ADT (times its factor).
const classAdt: Record<string, number> = { ...cfg.classDefaultAdt };
const classAdtLog: string[] = [];
if (cfg.classDefaultFromCounts) {
  const byClass = new Map<string, Map<string, Map<string, number>>>();
  for (const n of surfaceGates) {
    const street = gateStreet(n);
    if (!street) continue;
    const cls = gateClass(n), hit = countFor(n, street), ov = hit ? undefined : nearestOverride(n, street);
    const src = hit ? `${hit.c.id}|${hit.leg}` : ov ? `ov|${ov.source}` : null;
    const adt = hit ? (hit.c.legs[hit.leg].entering + hit.c.legs[hit.leg].leaving) / cfg.kFactor : ov ? ov.adt * (ov.factor ?? 1) : null;
    if (src === null || adt === null) continue;
    const streets = byClass.get(cls) ?? byClass.set(cls, new Map()).get(cls)!;
    (streets.get(street) ?? streets.set(street, new Map()).get(street)!).set(src, adt);
  }
  const median = (v: number[]) => { const a = [...v].sort((x, y) => x - y), m = a.length >> 1; return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2; };
  for (const cls of Object.keys(cfg.classDefaultAdt)) {
    if (cls[0] === '_') continue;
    const streets = [...(byClass.get(cls) ?? new Map<string, Map<string, number>>())].map(([st, m]) => [st, [...m.values()].reduce((a, b) => a + b, 0) / m.size] as [string, number]);
    if (streets.length >= cfg.classDefaultFromCounts.minStreets) {
      classAdt[cls] = Math.round(median(streets.map((q) => q[1])) / 100) * 100;
      classAdtLog.push(`${cls}: median of ${streets.length} counted streets (${streets.map(([st, v]) => `${st} ${Math.round(v)}`).join(', ')}) = ${classAdt[cls]} (documented ${cfg.classDefaultAdt[cls]})`);
    } else classAdtLog.push(`${cls}: ${streets.length} counted street(s)${streets.length ? ` (${streets.map(([st, v]) => `${st} ${Math.round(v)}`).join(', ')})` : ''}, fewer than ${cfg.classDefaultFromCounts.minStreets}, documented ${cfg.classDefaultAdt[cls]} kept`);
  }
}
for (const n of surfaceGates) {
  const hit = countFor(n, gateStreet(n));
  if (hit) {
    const k = `${hit.c.id}|${hit.leg}`, c = caps(n.id), r = legGroups.get(k) ?? { orig: 0, dest: 0 };
    r.orig += c.canIn ? 1 : 0; r.dest += c.canOut ? 1 : 0; legGroups.set(k, r);
  }
}
for (const n of surfaceGates) {
  const links = incident.get(n.id) ?? [];
  const street = gateStreet(n);
  const cls = gateClass(n);
  const { canIn, canOut } = caps(n.id);
  let pmIn: number, pmOut: number, kind: Gate['kind'], source: string, adt: number | null = null;
  const hit = countFor(n, street);
  if (hit) {
    const grp = legGroups.get(`${hit.c.id}|${hit.leg}`)!;
    pmIn = canIn ? hit.c.legs[hit.leg].entering / Math.max(1, grp.orig) : 0;
    pmOut = canOut ? hit.c.legs[hit.leg].leaving / Math.max(1, grp.dest) : 0;
    kind = 'DATA';
    source = `Oakland TMC ${hit.c.id} ${hit.leg}-leg avg of ${hit.c.legs[hit.leg].files} counts, ${Math.round(Math.hypot(n.x - hit.c.x, n.y - hit.c.y))} m away, shared by ${Math.max(grp.orig, grp.dest)} gate node(s)`;
  } else {
    const ov = nearestOverride(n, street);
    if (ov) { adt = ov.adt * (ov.factor ?? 1); kind = 'DATA(adt)'; source = `Caltrans AADT: ${ov.source}`; }
    else { adt = classAdt[cls] ?? classAdt.residential; kind = 'ASSUMPTION'; source = `class default (${cls})`; }
    const pk = adt! * cfg.kFactor;
    // A two-way street can appear as a pair of one-way gate nodes (one enter-only, one exit-only, same street,
    // close together). BUGFIX: each of the pair takes its directional share of the street volume, not all of it.
    // A one-way gate with no partner (genuinely one-way street) carries the whole volume in its direction.
    const paired = !(canIn && canOut) && hasGatePartner(n, canIn);
    // Several gates of one street close together (a street split into two ways at the extract edge) share the street volume.
    const pkn = pk / streetGroupSize(n);
    const share = pf[lastPeriod].inboundShare;
    pmIn = canIn ? (canOut ? pkn * share : paired ? pkn * share : pkn) : 0;
    pmOut = canOut ? (canIn ? pkn - pmIn : paired ? pkn * (1 - share) : pkn) : 0;
  }
  const g: Gate = { id: n.id, street, cls, deg: bearing(n.x, n.y), source, kind, adt, pmIn, pmOut, inT: {}, outT: {}, locIn: {}, locOut: {} };
  const sPm = pmIn / (pmIn + pmOut || 1);
  for (const p of periodIds) {
    const tot = (pmIn + pmOut) * pf[p].volume;
    const s = canIn && canOut ? clamp(sPm + (pf[p].inboundShare - pf[lastPeriod].inboundShare), 0.2, 0.8) : canIn ? 1 : 0;
    g.inT[p] = tot * s; g.outT[p] = tot * (1 - s);
  }
  gates.push(g);
}
if (!gates.length) { console.error('Network has no gate nodes'); process.exit(1); }

// ---------- freeway gates: ramp volumes (DATA: Caltrans ramp ADT; peak-hour factors ASSUMPTION) ----------
const rampRows: RampRow[] = JSON.parse(readFileSync(cfg.raw.caltransRamps, 'utf8')).rows;
const rc = cfg.ramps;
const rampVol = matchRampVolumes(ramps, rampRows, cfg.streetMatch, streetKey, rc.defaultAdt, 'Caltrans ramp ADT', (rc.aliases ?? []).map((a: { lat?: number; lon?: number }) => ({ ...a, at: a.lat === undefined ? undefined : toXY(a.lat, a.lon!) })), rc.excludeRows ?? [], (id) => [nodeById.get(id)!.x, nodeById.get(id)!.y]);
const rampVeh = (r: Ramp, p: string) => (rampVol.get(r)!.adt * rc.kFactor * pf[p].volume) / r.gates.length;
interface FwGate { id: number; deg: number; inT: Record<string, number>; outT: Record<string, number> }
const fwGates: FwGate[] = [...freewayIds].map((id) => {
  const n = nodeById.get(id)!;
  const f: FwGate = { id, deg: bearing(n.x, n.y), inT: {}, outT: {} };
  for (const p of periodIds) {
    f.inT[p] = ramps.filter((r) => r.kind === 'off' && r.gates.includes(id)).reduce((a, r) => a + rampVeh(r, p), 0);
    f.outT[p] = ramps.filter((r) => r.kind === 'on' && r.gates.includes(id)).reduce((a, r) => a + rampVeh(r, p), 0);
  }
  return f;
});
const gateName = (id: number) => (incident.get(id) ?? []).find((l) => l.name && l.class !== 'motorway')?.name || '(unnamed)';

// ---------- LODES blocks -> local origin/destination nodes ----------
const lodes = existsSync(cfg.raw.lodes) ? JSON.parse(readFileSync(cfg.raw.lodes, 'utf8')) : null;
// Blocks anywhere in the model area map to the nearest non-gate node on a residential street (the whole network, not only the study area).
const resNodes = net.nodes.filter((n) => !n.gate && (incident.get(n.id) ?? []).some((l) => l.class === 'residential'));
const candNodes = resNodes.length ? resNodes : net.nodes.filter((n) => !n.gate && (incident.get(n.id) ?? []).every((l) => l.class !== 'motorway'));
const nearest = (x: number, y: number) => { let b = candNodes[0], bd = Infinity; for (const n of candNodes) { const d = (n.x - x) ** 2 + (n.y - y) ** 2; if (d < bd) { bd = d; b = n; } } return b; };

interface LocalBlock { node: number; x: number; y: number; res: number; jobs: number; outSectors: Record<string, number>; inSectors: Record<string, number> }
const localNodes = new Map<number, LocalBlock>();
const lo = cfg.local;
if (lodes) {
  const byBlock = new Map<string, { out: Record<string, number>; in: Record<string, number> }>();
  for (const e of lodes.external) {
    const r = byBlock.get(e.block) ?? byBlock.set(e.block, { out: {}, in: {} }).get(e.block)!;
    const m = e.dir === 'out' ? r.out : r.in;
    m[e.sector] = (m[e.sector] ?? 0) + e.n;
  }
  const inBbox = (b: { lat: number; lon: number }) => b.lon >= cfg.bbox[0] && b.lon <= cfg.bbox[2] && b.lat >= cfg.bbox[1] && b.lat <= cfg.bbox[3];
  for (const b of lodes.blocks) {
    if ((!b.resWorkers && !b.jobs) || !inBbox(b)) continue; // blocks outside the model area (the raw file was cut for a larger one) would map to the nearest edge node
    const [x, y] = toXY(b.lat, b.lon);
    const nd = nearest(x, y);
    const agg = localNodes.get(nd.id) ?? localNodes.set(nd.id, { node: nd.id, x: nd.x, y: nd.y, res: 0, jobs: 0, outSectors: {}, inSectors: {} }).get(nd.id)!;
    agg.res += b.resWorkers; agg.jobs += b.jobs;
    const ex = byBlock.get(b.id);
    for (const [s, n] of Object.entries(ex?.out ?? {})) agg.outSectors[s] = (agg.outSectors[s] ?? 0) + (n as number);
    for (const [s, n] of Object.entries(ex?.in ?? {})) agg.inSectors[s] = (agg.inSectors[s] ?? 0) + (n as number);
  }
}

// Sector -> gate weights: angular proximity (sigma 45 deg) x gate capacity target.
const sectorDeg: Record<string, number> = Object.fromEntries(SECTORS.map((s, i) => [s, i * 45]));
function gateWeights(sector: string, p: string, dir: 'in' | 'out') {
  const w = gates.map((g) => Math.exp(-((angDiff(g.deg, sectorDeg[sector]) / 45) ** 2)) * (dir === 'in' ? g.inT[p] : g.outT[p]));
  const s = w.reduce((a, b) => a + b, 0) || 1;
  return w.map((v) => v / s);
}

// ---------- per period ----------
const outPeriods: { id: string; label: string; flows: Flow[] }[] = [];
const summary: { id: string; total: number; through: number; local: number; ramp: number; rampLocal: number; localInternal: number; dropped: number; fw: Map<number, { out: number; in: number }>; rampDest: Map<number, number> }[] = [];

// Per-period totals by type from a final flow list (car flows only).
function summarizeFlows(flows: Flow[]) {
  const gateIds = new Set(gates.map((g) => g.id));
  let thrOut = 0, locOut = 0, rampOut = 0, rampLocal = 0;
  const fwPer = new Map<number, { out: number; in: number }>(fwGates.map((g) => [g.id, { out: 0, in: 0 }] as const));
  const rampDest = new Map<number, number>(); // PM-style destination table: surface gate or local node id -> ramp-off veh/h
  for (const fl of flows) {
    if (fl.mode) continue;
    const fo = fwPer.get(fl.origin), fd = fwPer.get(fl.destination);
    if (fo || fd) {
      rampOut += fl.vehPerHour;
      if (fo) { fo.out += fl.vehPerHour; rampDest.set(fl.destination, (rampDest.get(fl.destination) ?? 0) + fl.vehPerHour); }
      if (fd) fd.in += fl.vehPerHour;
      if (!gateIds.has(fo ? fl.destination : fl.origin)) rampLocal += fl.vehPerHour;
    } else if (gateIds.has(fl.origin) && gateIds.has(fl.destination)) thrOut += fl.vehPerHour;
    else locOut += fl.vehPerHour;
  }
  return { total: thrOut + locOut + rampOut, through: thrOut, local: locOut, ramp: rampOut, rampLocal, fw: fwPer, rampDest };
}
let throughDebug: string[] = [];
const periLog: string[] = [];
let unroutableDropped = 0;

for (const p of cfg.periods as { id: string; label: string }[]) {
  const local = new Map<string, number>();
  const add = (o: number, d: number, v: number) => { if (o !== d && v > 0) local.set(`${o}>${d}`, (local.get(`${o}>${d}`) ?? 0) + v); };
  const scale = lo.vehicleModeShare * lo.peakHourShare[p.id];
  const origShare = lo.originShareResidents[p.id], destShare = lo.destShareJobs[p.id];
  const locList = [...localNodes.values()];
  for (const g of gates) { g.locIn[p.id] = 0; g.locOut[p.id] = 0; }
  const rawLocal: { o: number; d: number; v: number; gateO?: Gate; gateD?: Gate }[] = [];
  const blockTrips = (b: LocalBlock) => {
    // Residents: outbound trips (origin = block). ASSUMPTION rates (config local.*)
    const resTrips = b.res * lo.residentsPerWorker * lo.dailyTripsPerResidentWorker * scale;
    const jobTrips = b.jobs * lo.dailyTripsPerJob * scale;
    return { outTotal: resTrips * origShare + jobTrips * (1 - destShare), inTotal: resTrips * (1 - origShare) + jobTrips * destShare };
  };

  // ---- Freeway-ramp trips (ASSUMPTION destination choice; volumes DATA/ASSUMPTION per ramp) ----
  // Surface gate in/out targets are shared with ramp trips: ramp trips count toward the gate's flows and are removed
  // from the residual that the through (Furness) step must fill. Ramp trips with a local end replace part of that
  // block's external trips. Freeway mainline-to-mainline trips are not generated (they never touch surface streets).
  const rampFlows = new Map<string, number>();
  const rampAtGate = new Map<number, { in: number; out: number }>(gates.map((g) => [g.id, { in: 0, out: 0 }] as [number, { in: number; out: number }]));
  const rampAtBlock = new Map<number, { in: number; out: number }>(locList.map((b) => [b.node, { in: 0, out: 0 }] as [number, { in: number; out: number }]));
  const capLeft = new Map(gates.map((g) => [g.id, { in: g.inT[p.id] * rc.maxShareOfGate, out: g.outT[p.id] * rc.maxShareOfGate }] as [number, { in: number; out: number }]));
  const dst = rc.destination;
  // Ramp demand sits at the freeway mainline gates: origin (off-ramp traffic) or destination (on-ramp traffic) is the gate, not a
  // ramp, so the router picks the ramp. A gate's volume is the sum of the shares of the ramps it can reach (ramp ADT split equally
  // among the mainline gates that feed or take the ramp). Its surface ends are drawn with direction plausibility averaged over those
  // ramps weighted by volume, so a ramp's own bearing no longer pins a trip to that ramp.
  for (const fg of fwGates) for (const kind of ['off', 'on'] as const) {
    const rs = ramps.filter((r) => r.kind === kind && r.gates.includes(fg.id));
    const parts = rs.map((r) => ({ r, vol: rampVeh(r, p.id) })).filter((q) => q.vol > 0);
    const vol = parts.reduce((a, q) => a + q.vol, 0);
    const gid = fg.id;
    if (vol <= 0) continue;
    const plaus = (x: number, y: number) => parts.reduce((a, q) => {
      const rn = nodeById.get(q.r.surface)!;
      const pref = bearing(center[0], center[1], rn.x, rn.y); // inward: from the ramp toward the study-area center
      return a + (q.vol / vol) * Math.max(dst.directionFloor, Math.exp(-((angDiff(bearing(x, y, rn.x, rn.y), pref) / dst.directionSigmaDeg) ** 2)));
    }, 0);
    const off = kind === 'off', side = off ? 'out' : 'in'; // ends at surface: gate outflow (off) or gate inflow (on)
    const gc = gates.map((g) => { const n = nodeById.get(g.id)!; return { id: g.id, w: (off ? g.outT[p.id] : g.inT[p.id]) * plaus(n.x, n.y), room: capLeft.get(g.id)![side] }; }).filter((c) => c.w > 0 && c.room > 0 && (off ? routable(gid, c.id) : routable(c.id, gid)));
    const lc = locList.map((b) => ({ id: b.node, w: (off ? blockTrips(b).inTotal : blockTrips(b).outTotal) * plaus(b.x, b.y) })).filter((c) => c.w > 0 && (off ? routable(gid, c.id) : routable(c.id, gid)));
    const lShare = lc.length ? rc.localShare : 0;
    // Gate part: water-filling so no gate exceeds its remaining ramp cap.
    const give = new Map<number, number>();
    let rem = vol * (1 - lShare), act = gc.slice();
    for (let it = 0; it < 50 && rem > 1e-6 && act.length; it++) {
      const sw = act.reduce((a, c) => a + c.w, 0);
      let used = 0;
      const next: typeof act = [];
      for (const c of act) {
        const x = (rem * c.w) / sw, room = c.room - (give.get(c.id) ?? 0), y = Math.min(x, room);
        give.set(c.id, (give.get(c.id) ?? 0) + y); used += y;
        if (x < room - 1e-9) next.push(c);
      }
      rem -= used; act = next;
    }
    const placed = [...give.values()].reduce((a, c) => a + c, 0);
    const lVol = vol - placed; // local share plus any gate part that could not be placed
    for (const [id, v] of give) {
      rampFlows.set(off ? `${gid}>${id}` : `${id}>${gid}`, (rampFlows.get(off ? `${gid}>${id}` : `${id}>${gid}`) ?? 0) + v);
      capLeft.get(id)![side] -= v; rampAtGate.get(id)![side] += v;
    }
    const lw = lc.reduce((a, c) => a + c.w, 0);
    if (lw > 0) for (const c of lc) {
      const v = (lVol * c.w) / lw, k = off ? `${gid}>${c.id}` : `${c.id}>${gid}`;
      rampFlows.set(k, (rampFlows.get(k) ?? 0) + v);
      rampAtBlock.get(c.id)![off ? 'in' : 'out'] += v;
    }
  }

  for (const b of locList) {
    const { outTotal: outT0, inTotal: inT0 } = blockTrips(b);
    const taken = rampAtBlock.get(b.node)!;
    const outTotal = Math.max(0, outT0 - taken.out / lo.externalShareOfResidentTrips), inTotal = Math.max(0, inT0 - taken.in / lo.externalShareOfResidentTrips);
    const sOut = Object.values(b.outSectors).reduce((a, c) => a + c, 0), sIn = Object.values(b.inSectors).reduce((a, c) => a + c, 0);
    const fallbackSec = Object.fromEntries(SECTORS.map((s) => [s, 1]));
    const outS = sOut ? b.outSectors : fallbackSec, inS = sIn ? b.inSectors : fallbackSec;
    const oT = Object.values(outS).reduce((a, c) => a + c, 0), iT = Object.values(inS).reduce((a, c) => a + c, 0);
    // External share of trips: DATA-derived directional mix (LODES), share itself ASSUMPTION.
    for (const [s, n] of Object.entries(outS)) {
      const wOut = gateWeights(s, p.id, 'out');
      gates.forEach((g, i) => { const v = outTotal * lo.externalShareOfResidentTrips * (n / oT) * wOut[i]; if (v > 0 && routable(b.node, g.id)) rawLocal.push({ o: b.node, d: g.id, v, gateD: g }); });
    }
    for (const [s, n] of Object.entries(inS)) {
      const w = gateWeights(s, p.id, 'in');
      gates.forEach((g, i) => { const v = inTotal * lo.externalShareOfResidentTrips * (n / iT) * w[i]; if (v > 0 && routable(g.id, b.node)) rawLocal.push({ o: g.id, d: b.node, v, gateO: g }); });
    }
  }
  // Cap local gate usage at maxLocalShareOfGate of each gate target (leaves room for through trips).
  for (const g of gates) {
    const inSum = rawLocal.filter((r) => r.gateO === g).reduce((a, r) => a + r.v, 0);
    const outSum = rawLocal.filter((r) => r.gateD === g).reduce((a, r) => a + r.v, 0);
    const fi = inSum > g.inT[p.id] * lo.maxLocalShareOfGate ? (g.inT[p.id] * lo.maxLocalShareOfGate) / inSum : 1;
    const fo = outSum > g.outT[p.id] * lo.maxLocalShareOfGate ? (g.outT[p.id] * lo.maxLocalShareOfGate) / outSum : 1;
    for (const r of rawLocal) { if (r.gateO === g) r.v *= fi; if (r.gateD === g) r.v *= fo; }
  }
  for (const r of rawLocal) { add(r.o, r.d, r.v); if (r.gateO) r.gateO.locIn[p.id] += r.v; if (r.gateD) r.gateD.locOut[p.id] += r.v; }

  // Internal-internal local trips: remaining share, gravity by attraction x exp(-d/decay).
  let internalTotal = 0;
  if (locList.length > 1) {
    for (const o of locList) {
      const prod = (o.res * lo.residentsPerWorker * lo.dailyTripsPerResidentWorker * origShare + o.jobs * lo.dailyTripsPerJob * (1 - destShare)) * scale * (1 - lo.externalShareOfResidentTrips);
      const w = locList.map((d) => (d === o ? 0 : (d.jobs + d.res * 0.3 + 1) * Math.exp(-Math.hypot(d.x - o.x, d.y - o.y) / lo.internalDecayM)));
      const ws = w.reduce((a, c) => a + c, 0) || 1;
      locList.forEach((d, i) => { if (w[i] > 0) { add(o.node, d.node, (prod * w[i]) / ws); internalTotal += (prod * w[i]) / ws; } });
    }
  }

  // Through trips: gate inflow minus local = through supply; gate outflow minus local = through demand. Furness balanced.
  const n = gates.length;
  let R = gates.map((g) => Math.max(0, g.inT[p.id] - g.locIn[p.id] - rampAtGate.get(g.id)!.in));
  let C = gates.map((g) => Math.max(0, g.outT[p.id] - g.locOut[p.id] - rampAtGate.get(g.id)!.out));
  const rs = R.reduce((a, b) => a + b, 0), cs = C.reduce((a, b) => a + b, 0);
  const gv = cfg.gravity;
  // Balancing: inflow supply and outflow demand of the residual gate volumes differ (in the PM peak the assumed gates are net exporters, inbound share 0.45; in the AM peak net importers).
  // With `balanceKeepsCounted` the counted gates (DATA) keep both their inflow and outflow and only the assumed gates are scaled on the side with the surplus; if the counted
  // volume alone exceeds the other side, every gate is scaled to it (the earlier behavior, which scaled the outflow of every gate to 0.77 of its target in the PM peak).
  const isCounted = gates.map((g) => g.kind !== 'ASSUMPTION');
  const sideCounted = (v: number[]) => v.reduce((a, c, j) => a + (isCounted[j] ? c : 0), 0);
  const keepCounted = (v: number[], other: number) => !!gv.balanceKeepsCounted && sideCounted(v) <= other && v.reduce((a, c) => a + c, 0) > sideCounted(v);
  if (rs >= cs) {
    if (keepCounted(R, cs)) { const rc = sideCounted(R); R = R.map((r, j) => (isCounted[j] ? r : (r * (cs - rc)) / (rs - rc))); }
    else C = C.map((c) => (c * rs) / (cs || 1));
  } else if (keepCounted(C, rs)) { const cc = sideCounted(C); C = C.map((c, j) => (isCounted[j] ? c : (c * (rs - cc)) / (cs - cc))); }
  else C = C.map((c) => (c * rs) / (cs || 1));
  const peri = cfg.peripheral?.enabled ? cfg.peripheral : null;
  const gpos = gates.map((g) => perimeterPos([nodeById.get(g.id)!.x, nodeById.get(g.id)!.y], rect));
  const isCorner = (i: number, j: number) => {
    if (!peri) return false;
    const st = statOf(gates[i].id, gates[j].id);
    return !!st && (perimeterGap(gpos[i], gpos[j], perimTotal) < peri.cornerClip.minPerimeterGapM || st.maxEdge < peri.cornerClip.edgeBandM);
  };
  const seedOf = (): number[][] => gates.map((gi, i) => gates.map((gj, j) => {
    if (!routable(gi.id, gj.id)) return 0;
    const d = angDiff(gi.deg, gj.deg);
    let f = d >= 135 ? gv.oppositeBonus : d >= 75 ? gv.adjacentFactor : d >= 40 ? gv.adjacentFactor * 0.5 : gv.uTurnPenalty;
    if (gi.street && gi.street === gj.street && d >= 75) f *= gv.sameStreetBonus;
    return f * Math.max(C[j], 1e-6);
  }));
  const furness = (seed: number[][]) => {
    const T = seed.map((r) => r.slice());
    for (let it = 0; it < gv.furnessIterations; it++) {
      for (let i = 0; i < n; i++) { const s = T[i].reduce((a, b) => a + b, 0); if (s > 0) for (let j = 0; j < n; j++) T[i][j] *= R[i] / s; }
      for (let j = 0; j < n; j++) { let s = 0; for (let i = 0; i < n; i++) s += T[i][j]; if (s > 0) for (let i = 0; i < n; i++) T[i][j] *= C[j] / s; }
    }
    return T;
  };
  const sumT = (T: number[][]) => T.reduce((a, r) => a + r.reduce((b, c) => b + c, 0), 0);
  const T0 = furness(seedOf());
  const T = T0.map((r) => r.slice());
  if (peri) {
    // Rule P1: corner-clipping pairs (gates close together along the perimeter, or a route that stays near the model edge) are dropped, not reallocated.
    // Their volume leaves the gates' totals (counted gates included); the accounting below says how much. Reallocating it to other pairs at the same gates
    // was tried and lengthened the trips: the PM peak completed 7% fewer trips at the same offered volume (calibration record, step S2).
    let corner = 0, edge = 0, gap = 0;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (T0[i][j] > 0 && isCorner(i, j)) {
      corner += T0[i][j]; T[i][j] = 0;
      const st = statOf(gates[i].id, gates[j].id)!;
      if (perimeterGap(gpos[i], gpos[j], perimTotal) < peri.cornerClip.minPerimeterGapM) gap += T0[i][j];
      if (st.maxEdge < peri.cornerClip.edgeBandM) edge += T0[i][j];
    }
    // Rule P2: a gate's modeled volume (through + local + ramp) may not exceed min(target, lane capacity); the excess is taken from its peripheral gate-to-gate trips only.
    // Counted gates keep their count: their non-peripheral trips are never reduced, so a counted corridor that the cordon cannot serve is a network finding, not a demand fix.
    let capCut = 0, capShort = 0;
    const capDetail: string[] = [];
    for (let it = 0; it < 3; it++) for (const dir of ['in', 'out'] as const) for (let g = 0; g < n; g++) {
      const gate = gates[g], lanes = laneSum(gate.id, dir === 'in' ? 'from' : 'to');
      const cap = Math.min(dir === 'in' ? gate.inT[p.id] : gate.outT[p.id], lanes * cordon.signalizedVehPerHourPerLane);
      const thr = dir === 'in' ? T[g].reduce((a, c) => a + c, 0) : T.reduce((a, r) => a + r[g], 0);
      const other = dir === 'in' ? gate.locIn[p.id] + rampAtGate.get(gate.id)!.in : gate.locOut[p.id] + rampAtGate.get(gate.id)!.out;
      const excess = thr + other - cap;
      if (excess <= 1e-6) continue;
      const pair = (k: number): [number, number] => (dir === 'in' ? [gate.id, gates[k].id] : [gates[k].id, gate.id]);
      const val = (k: number) => (dir === 'in' ? T[g][k] : T[k][g]);
      const idx = gates.map((_, k) => k).filter((k) => { const st = statOf(...pair(k)); return st && relevanceOf(st, peri.nearM) === 'peripheral' && val(k) > 0; });
      const per = idx.reduce((a, k) => a + val(k), 0);
      const cut = Math.min(excess, per);
      if (per > 0) for (const k of idx) { const c = (cut * val(k)) / per; if (dir === 'in') T[g][k] -= c; else T[k][g] -= c; }
      capCut += cut; if (excess > per) capShort += excess - per;
      if (it === 0 && excess > 5) capDetail.push(`${gate.id} ${gateName(gate.id)} ${dir} target ${(dir === 'in' ? gate.inT[p.id] : gate.outT[p.id]).toFixed(0)}, lane cap ${(lanes * cordon.signalizedVehPerHourPerLane).toFixed(0)}, other ${other.toFixed(0)}, through ${thr.toFixed(0)}, cut ${cut.toFixed(0)}`);
    }
    periLog.push(`${p.id}: P1 dropped ${corner.toFixed(0)} veh/h of ${sumT(T0).toFixed(0)} through veh/h (perimeter gap < ${peri.cornerClip.minPerimeterGapM} m ${gap.toFixed(0)}, route within ${peri.cornerClip.edgeBandM} m of the edge ${edge.toFixed(0)}; the two overlap by ${(gap + edge - corner).toFixed(0)}); P2 cap removed ${capCut.toFixed(0)} veh/h of peripheral trips, ${capShort.toFixed(0)} veh/h above cap with no peripheral trips left${capDetail.length ? '\n    ' + capDetail.join('\n    ') : ''}`);
  }
  let throughTotal = 0;
  const flowsMap = new Map(local);
  const thr = new Map<string, number>();
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (T[i][j] > 0) { thr.set(`${gates[i].id}>${gates[j].id}`, T[i][j]); throughTotal += T[i][j]; }
  if (p.id === lastPeriod) throughDebug = [`through supply ${rs.toFixed(0)} vs demand ${cs.toFixed(0)} veh/h (demand scaled to supply)`];
  for (const [k, v] of thr) flowsMap.set(k, (flowsMap.get(k) ?? 0) + v);
  for (const [k, v] of rampFlows) flowsMap.set(k, (flowsMap.get(k) ?? 0) + v);

  // Prune: drop < min, cap count, renormalize to preserve total.
  for (const k of [...flowsMap.keys()]) { const [o, d] = k.split('>').map(Number); const ok = (nodeById.get(o)!.gate ? caps(o).canIn : true) && (nodeById.get(d)!.gate ? caps(d).canOut : true) && routable(o, d); if (!ok) { unroutableDropped += flowsMap.get(k)!; flowsMap.delete(k); } }
  // Pruning keeps the largest flows; each class (ramp, gate-to-gate through, local) is renormalized to its own pre-pruning total so that the
  // tail cut cannot inflate one class at the expense of the accounting (BUGFIX: a single global factor scaled the ramp volume 23% above ADT x K).
  const fwIds = new Set(fwGates.map((g) => g.id));
  const clsOf = (k: string) => { const [o, d] = k.split('>').map(Number); return fwIds.has(o) || fwIds.has(d) ? 'ramp' : gates.some((g) => g.id === o) && gates.some((g) => g.id === d) ? 'through' : 'local'; };
  const before: Record<string, number> = { ramp: 0, through: 0, local: 0 }, after: Record<string, number> = { ramp: 0, through: 0, local: 0 };
  for (const [k, v] of flowsMap) before[clsOf(k)] += v;
  // Thinning: flows at or above a threshold t are kept; a smaller flow v is kept with probability v/t and then carries t, so every origin's
  // and destination's expected volume is unchanged (t is chosen so that about maxFlows flows remain). Seeded, so the file is reproducible.
  const sorted = [...flowsMap].sort((a, b) => b[1] - a[1]);
  let tLo = 0, tHi = sorted[0]?.[1] ?? 1;
  for (let it = 0; it < 60; it++) { const t = (tLo + tHi) / 2; const n = sorted.reduce((a, [, v]) => a + Math.min(1, v / t), 0); if (n > cfg.maxFlows) tLo = t; else tHi = t; }
  const tcut = Math.max(tHi, cfg.minFlowVehPerHour);
  let seedState = 12345 + p.id.length * 977;
  const rnd = () => { seedState = (seedState + 0x6d2b79f5) | 0; let z = Math.imul(seedState ^ (seedState >>> 15), 1 | seedState); z = (z + Math.imul(z ^ (z >>> 7), 61 | z)) ^ z; return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
  let list: [string, number][] = [];
  for (const [k, v] of sorted) { if (v >= tcut) list.push([k, v]); else if (rnd() < v / tcut) list.push([k, tcut]); }
  for (const [k, v] of list) after[clsOf(k)] += v;
  // Per class, iterative proportional fitting on the retained pairs restores each origin's and destination's pre-pruning volume
  // (a gate's inflow stays equal to its target), then one factor restores the class total.
  const keep = list.map(([k, v]) => ({ k, o: +k.split('>')[0], d: +k.split('>')[1], c: clsOf(k), v }));
  const rowT = new Map<string, number>(), colT = new Map<string, number>();
  for (const [k, v] of flowsMap) { const [o, d] = k.split('>').map(Number), c = clsOf(k); rowT.set(`${c}|${o}`, (rowT.get(`${c}|${o}`) ?? 0) + v); colT.set(`${c}|${d}`, (colT.get(`${c}|${d}`) ?? 0) + v); }
  for (let it = 0; it < 40; it++) {
    for (const side of ['o', 'd'] as const) {
      const sums = new Map<string, number>();
      for (const q of keep) sums.set(`${q.c}|${q[side]}`, (sums.get(`${q.c}|${q[side]}`) ?? 0) + q.v);
      const tgt = side === 'o' ? rowT : colT;
      for (const q of keep) { const s0 = sums.get(`${q.c}|${q[side]}`)!; if (s0 > 0) q.v *= tgt.get(`${q.c}|${q[side]}`)! / s0; }
    }
  }
  const after2: Record<string, number> = { ramp: 0, through: 0, local: 0 };
  for (const q of keep) after2[q.c] += q.v;
  const fac: Record<string, number> = Object.fromEntries(Object.keys(before).map((c) => [c, after2[c] > 0 ? before[c] / after2[c] : 1]));
  if (p.id === lastPeriod) throughDebug.push(`pruning kept ${(100 * (after.ramp + after.through + after.local) / (before.ramp + before.through + before.local)).toFixed(0)}% of the volume; after fitting, class total factors ramp ${fac.ramp.toFixed(3)}, through ${fac.through.toFixed(3)}, local ${fac.local.toFixed(3)}`);
  const flows: Flow[] = keep.map((q) => ({ origin: q.o, destination: q.d, vehPerHour: Math.round(q.v * fac[q.c] * 100) / 100 })).filter((q) => q.vehPerHour > 0);
  summary.push({ id: p.id, ...summarizeFlows(flows), localInternal: internalTotal, dropped: flowsMap.size - list.length });
  outPeriods.push({ id: p.id, label: p.label, flows });
}

const gateById = new Map(gates.map((g) => [g.id, g]));
const fwIdSet = new Set(fwGates.map((g) => g.id));
const typeOf = (o: number, d: number): FlowType => (fwIdSet.has(o) || fwIdSet.has(d) ? 'ramp' : gateById.has(o) && gateById.has(d) ? 'through' : 'local');

// ---------- count-constrained fit (baseline-calibration, seventh round): static assignment, matrix adjustment to link counts, capacity guard ----------
// Offered car trips are assigned to free-flow shortest paths (tools/lib/assign.ts mirrors the simulator's router); every count the pipeline holds becomes a
// target volume on directed links (tools/lib/demand-fit.ts); flows are scaled until assigned volumes match [VanZuylen1980], [Willumsen1981]. Walking and biking are untouched.
let fitText = '';
const fitResults: PeriodResult[] = [];
const fc = cfg.countFit;
if (fc?.enabled) {
  const stationNotes: string[] = [];
  const stations = buildStations({
    nodes: net.nodes as never, links: net.links as NetLinkIn[], periodIds, lastPeriod, periodFactors: pf, kFactor: cfg.kFactor, rampKFactor: rc.kFactor, center,
    inBbox: (x, y) => x >= rect.minX && x <= rect.maxX && y >= rect.minY && y <= rect.maxY,
    streetKey, gates: gates.map((g) => ({ id: g.id, kind: g.kind, street: g.street, source: g.source, inT: g.inT, outT: g.outT })),
    tmcs: tmcs.map((c) => ({ id: c.id, x: c.x, y: c.y, legs: c.legs, legStreets: c.legStreets })),
    ramps: ramps.map((r) => { const v = rampVol.get(r)!; return { kind: r.kind, surface: r.surface, streets: r.streets, adt: v.adt, adtKind: v.kind, source: v.source }; }),
    overrides: (cfg.adtOverrides ?? []).map((o: { street: string; adt: number; factor?: number; lat: number; lon: number; source: string }) => { const [x, y] = toXY(o.lat, o.lon); return { street: o.street, adt: o.adt, factor: o.factor, x, y, source: o.source }; }),
    cfg: { tmcNodeMaxM: fc.tmcNodeMaxM, stationRadiusM: fc.stationRadiusM, weights: fc.weights, tolerancePct: fc.tolerancePct },
  }, stationNotes);
  const fitCfg: FitConfig = {
    fit: { lo: fc.bounds.lo, hi: fc.bounds.hi, byType: fc.bounds.byType, maxIter: fc.maxIter, tol: fc.tol, damping: fc.damping, uncounted: fc.uncounted.rule, volumeWeightedMedian: fc.uncounted.volumeWeighted, stationary: fc.stationary ?? 1e-4 },
    draws: fc.draws, noise: fc.noise, guard: { enabled: fc.capacityGuard.enabled, excessShare: fc.capacityGuard.excessShare, weight: fc.capacityGuard.weight, capacity: fc.capacityGuard.capacity },
  };
  const flowsBy: Record<string, { origin: number; destination: number; vehPerHour: number }[]> = {};
  if (process.env.FIT_DUMP) writeFileSync(process.env.FIT_DUMP, JSON.stringify({ stations, periods: Object.fromEntries(outPeriods.map((q) => { const cars = q.flows.filter((f) => !f.mode); return [q.id, { flows: cars, types: cars.map((f) => typeOf(f.origin, f.destination)) }]; })) }));
  for (const per of outPeriods) {
    const cars = per.flows.filter((q) => !q.mode);
    const types = cars.map((q) => typeOf(q.origin, q.destination));
    const r = fitPeriod(per.id, cars, types, stations, net.nodes as never, net.links as NetLinkIn[], net.turnBans ?? [], fitCfg);
    fitResults.push(r);
    flowsBy[per.id] = cars.map((q) => ({ ...q }));
    per.flows = [...cars.map((q, k) => ({ ...q, vehPerHour: Math.round(r.volume[k] * 100) / 100 })).filter((q) => q.vehPerHour >= 0.01), ...per.flows.filter((q) => q.mode)];
  }
  for (const s of summary) { const per = outPeriods.find((q) => q.id === s.id)!; Object.assign(s, summarizeFlows(per.flows)); }
  fitText = fitReport(cfg.area, fitResults, flowsBy, { fit: fitCfg.fit, draws: fc.draws, noise: fc.noise, guardExcess: fc.capacityGuard.excessShare, guardWeight: fc.capacityGuard.weight, guardOn: fc.capacityGuard.enabled, tolOk: fc.tolerancePct.report }, stationNotes, []);
  if (fc.output) writeFileSync(fc.output, fitText);
}

// ---------- walking and biking (design D6): ASSUMPTION shares and trip lengths; DATA only in the count scaling ----------
interface ActiveSummary { lines: string[] }
const activeSummary: ActiveSummary = { lines: [] };
if (cfg.active) {
  const dir = cfg.raw[cfg.streetCounts?.[0]?.source];
  const counts = dir && existsSync(dir) ? readdirSync(dir).filter((f) => f.includes(cfg.streetCounts[0].filePattern) && f.endsWith('.csv')).map((f) => parseActiveCounts(readFileSync(join(dir, f), 'utf8'))).filter((c) => c !== null) : [];
  const mean = (k: 'pedestrian' | 'bicycle') => (counts.length ? counts.reduce((a, c) => a + c![k], 0) / counts.length : null);
  const countNode = tmc ? net.nodes.reduce((b, n) => (Math.hypot(n.x - tx, n.y - ty) < Math.hypot(b.x - tx, b.y - ty) ? n : b), net.nodes[0]) : null;
  const res = buildActiveFlows({
    nodes: net.nodes, links: net.links, locals: [...localNodes.values()].map((b) => ({ node: b.node, res: b.res, jobs: b.jobs })),
    freewayGates: freewayIds, periodIds, scalePeriod: lastPeriod,
    originShare: lo.originShareResidents, destShare: lo.destShareJobs, tripsPerResident: lo.dailyTripsPerResidentWorker * lo.residentsPerWorker, tripsPerJob: lo.dailyTripsPerJob,
    cfg: cfg.active, count: countNode && counts.length ? { node: countNode.id, pedestrian: mean('pedestrian'), bicycle: mean('bicycle') } : null,
  });
  for (const per of outPeriods) per.flows.push(...(res.flows[per.id] as AFlow[]));
  activeSummary.lines.push(`Pedestrian and bicycle flows (persons/h; ${counts.length} Oakland counts)`);
  for (const r of res.reports) {
    activeSummary.lines.push(`  ${r.mode}: PM peak persons through the counted intersection ${r.prior === null ? 'n/a' : r.prior.toFixed(0)} before scaling, observed ${r.observed === null ? 'n/a' : r.observed.toFixed(0)}, factor ${r.factor.toFixed(3)}, in the final flow list ${r.after === null ? 'n/a' : r.after.toFixed(0)}`);
    for (const per of outPeriods) {
      const q = r.perPeriod[per.id];
      activeSummary.lines.push(`    ${per.id.padEnd(9)} ${q.total.toFixed(0).padStart(5)}/h in ${String(q.flows).padStart(4)} flows of ${q.candidates} (to gates ${q.toGates.toFixed(0)}, to commercial streets ${q.toCommercial.toFixed(0)}, gate-to-gate ${q.through.toFixed(0)})`);
    }
  }
  const tot = outPeriods.map((per) => `${per.id} ${per.flows.length}`).join(', ');
  activeSummary.lines.push(`  flows per period, all modes: ${tot}`);
}

// ---------- demand audit: relevance of every car trip to the study area, and the cordon check ----------
const relSum: Record<string, Record<string, Record<Relevance, number>>> = {};
const gateRel = new Map<number, { in: number; out: number; inNear: number; outNear: number }>(gates.map((g) => [g.id, { in: 0, out: 0, inNear: 0, outNear: 0 }]));
for (const per of outPeriods) {
  const t = (relSum[per.id] = { through: { touches: 0, near: 0, peripheral: 0 }, local: { touches: 0, near: 0, peripheral: 0 }, ramp: { touches: 0, near: 0, peripheral: 0 } });
  for (const fl of per.flows) {
    if (fl.mode) continue;
    const st = statOf(fl.origin, fl.destination);
    if (!st) continue;
    const rel = relevanceOf(st, NEAR_M);
    t[typeOf(fl.origin, fl.destination)][rel] += fl.vehPerHour;
    if (per.id === lastPeriod) {
      const o = gateRel.get(fl.origin), d = gateRel.get(fl.destination);
      if (o) { o.in += fl.vehPerHour; if (rel !== 'peripheral') o.inNear += fl.vehPerHour; }
      if (d) { d.out += fl.vehPerHour; if (rel !== 'peripheral') d.outNear += fl.vehPerHour; }
    }
  }
}
const sideRows = new Map<string, { n: number; inflow: number; outflow: number; capIn: number; capOut: number; over: number; excess: number }>();
const gateRows: string[] = [];
const sideOfGate = (id: number) => sideOf([nodeById.get(id)!.x, nodeById.get(id)!.y], rect);
for (const g of [...gates].sort((a, b) => b.inT[lastPeriod] + b.outT[lastPeriod] - a.inT[lastPeriod] - a.outT[lastPeriod])) {
  const r = gateRel.get(g.id)!;
  const side = sideOfGate(g.id);
  const daily = g.adt ?? (g.pmIn + g.pmOut) / cfg.kFactor;
  const capIn = laneSum(g.id, 'from') * cordon.signalizedVehPerHourPerLane, capOut = laneSum(g.id, 'to') * cordon.signalizedVehPerHourPerLane;
  gateRows.push(`| ${g.id} | ${side} | ${gateName(g.id)} | ${g.cls} | ${g.kind === 'ASSUMPTION' ? 'ASSUMPTION' : 'DATA'} | ${Math.round(daily)} | ${g.inT[lastPeriod].toFixed(0)} / ${r.in.toFixed(0)} | ${capIn.toFixed(0)} | ${g.outT[lastPeriod].toFixed(0)} / ${r.out.toFixed(0)} | ${capOut.toFixed(0)} | ${r.in + r.out > 0 ? Math.round((100 * (r.inNear + r.outNear)) / (r.in + r.out)) : '-'} |`);
  const row = sideRows.get(side) ?? sideRows.set(side, { n: 0, inflow: 0, outflow: 0, capIn: 0, capOut: 0, over: 0, excess: 0 }).get(side)!;
  row.n++; row.inflow += r.in; row.outflow += r.out; row.capIn += capIn; row.capOut += capOut;
  for (const [v, c] of [[r.in, capIn], [r.out, capOut]]) if (v > c) { row.over++; row.excess += v - c; }
}
const fwStat = new Map<string, { in: number; out: number; capIn: number; capOut: number }>();
{
  const pm = outPeriods.find((q) => q.id === lastPeriod)!.flows.filter((q) => !q.mode);
  for (const f of fwGates) {
    const side = sideOfGate(f.id), row = fwStat.get(side) ?? fwStat.set(side, { in: 0, out: 0, capIn: 0, capOut: 0 }).get(side)!;
    row.in += pm.filter((q) => q.origin === f.id).reduce((a, q) => a + q.vehPerHour, 0);
    row.out += pm.filter((q) => q.destination === f.id).reduce((a, q) => a + q.vehPerHour, 0);
    row.capIn += laneSum(f.id, 'from') * cordon.freewayVehPerHourPerLane;
    row.capOut += laneSum(f.id, 'to') * cordon.freewayVehPerHourPerLane;
  }
}
{
  const L: string[] = [];
  const f0 = (v: number) => v.toFixed(0);
  L.push(`# Demand audit: ${cfg.area}`, '', 'Generated by `tools/build-demand.ts` (do not edit). Car trips only, PM peak unless a period is named; veh/h. Free-flow route = shortest path by length / speed limit on the network file, no turn bans.', '');
  L.push(`Relevance of a trip: (i) touches = its route uses a link of the study area or of a bounding street; (ii) near = it comes within ${NEAR_M} m of the study-area polygon; (iii) peripheral = it never comes within ${NEAR_M} m.`, '');
  L.push('## Offered trips by relevance', '', '| Period | Type | Touches | Near | Peripheral | Total | Peripheral share |', '| --- | --- | --- | --- | --- | --- | --- |');
  for (const per of outPeriods) {
    const t = relSum[per.id];
    const tot = { touches: 0, near: 0, peripheral: 0 };
    for (const ty of ['through', 'local', 'ramp'] as const) {
      const r = t[ty], s = r.touches + r.near + r.peripheral;
      for (const k of Object.keys(tot) as Relevance[]) tot[k] += r[k];
      L.push(`| ${per.id} | ${ty} | ${f0(r.touches)} | ${f0(r.near)} | ${f0(r.peripheral)} | ${f0(s)} | ${pct(r.peripheral, s)} |`);
    }
    const s = tot.touches + tot.near + tot.peripheral;
    L.push(`| ${per.id} | **all** | ${f0(tot.touches)} | ${f0(tot.near)} | ${f0(tot.peripheral)} | ${f0(s)} | ${pct(tot.peripheral, s)} |`);
  }
  L.push('', '## Cordon: modeled gate flow against what the corridors can carry', '', `Capacity = lanes of the link at each surface gate x ${cordon.signalizedVehPerHourPerLane} veh/h per lane (measured signalized capacity of the validation suite, cases b1 and b2, green share 0.5); freeway mainline gates use ${cordon.freewayVehPerHourPerLane} veh/h per lane (case i1). Inflow = trips entering the model at the side, outflow = trips leaving it.`, '');
  L.push('A side total hides single corridors: many residential gates have spare capacity that no demand uses. The last two columns therefore count gate directions whose modeled volume exceeds their own capacity, and the volume above it.', '');
  L.push('| Side | Surface gates | Inflow | Inflow capacity | Ratio | Outflow | Outflow capacity | Ratio | Gate directions over capacity | Volume above capacity | Freeway gates in / capacity | Freeway gates out / capacity |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const sd of ['north', 'east', 'south', 'west']) {
    const r = sideRows.get(sd), fw = fwStat.get(sd);
    if (!r && !fw) continue;
    L.push(`| ${sd} | ${r?.n ?? 0} | ${f0(r?.inflow ?? 0)} | ${f0(r?.capIn ?? 0)} | ${r?.capIn ? ((r.inflow / r.capIn)).toFixed(2) : '-'} | ${f0(r?.outflow ?? 0)} | ${f0(r?.capOut ?? 0)} | ${r?.capOut ? (r.outflow / r.capOut).toFixed(2) : '-'} | ${r?.over ?? 0} | ${f0(r?.excess ?? 0)} | ${fw ? `${f0(fw.in)} / ${f0(fw.capIn)}` : '-'} | ${fw ? `${f0(fw.out)} / ${f0(fw.capOut)}` : '-'} |`);
  }
  L.push('', '## Gates (PM peak)', '', 'Daily volume is the ADT used (class default, Caltrans station) or, for count-based gates, the counted two-way peak volume divided by K. In / out are the target and the modeled volume (target / modeled) entering and leaving the model at the gate. Near share = share of the gate\'s modeled trips (in and out) whose route comes within ' + NEAR_M + ' m of the study area.', '');
  L.push('| Gate | Side | Street | Class | Basis | Daily volume | In (target / modeled) | In capacity | Out (target / modeled) | Out capacity | Near share (%) |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |', ...gateRows);
  if (cfg.audit?.output !== null) writeFileSync(cfg.audit?.output ?? `data/demand/${cfg.area}.audit.md`, L.join('\n') + '\n');
}

// ---------- provenance ----------
const provenance = [
  { source: 'Oakland Annual Multi-Modal Counts, Raw Data (OakDOT), Telegraph Ave & Alcatraz Ave PM peak turning movements 2018/2019/2021', url: 'https://data.oaklandca.gov/d/amtg-eh64', note: tmc ? `DATA. Gate peak in/out volumes on Telegraph and Alcatraz legs; ${tmc.files.length} counts averaged (${tmc.peakHours.join('; ')}). Other periods scaled by ASSUMPTION factors (periodFactors).` : 'not available' },
  { source: 'Caltrans Traffic Volumes AADT (SR-13 Claremont Ave, Berkeley)', url: 'https://caltrans-gis.dot.ca.gov/arcgis/rest/services/CHhighway/Traffic_AADT/FeatureServer/0', note: 'DATA used as nearest-count ADT for the Claremont gate with an ASSUMPTION scaling factor; SR-24 AADT is context only.' },
  { source: 'Caltrans Ramp Volumes on the California State Freeway System, District 4 (ramp ADT, SR-24 ramps)', url: 'https://dot.ca.gov/programs/traffic-operations/census', note: `DATA: ramp ADT for the ramps found in the network (count year as listed in the build log; the Claremont and Telegraph ramps were last counted in 2012, no growth applied). ASSUMPTION: ramp peak-hour factor, local share of ramp trips, destination choice (gravity x direction plausibility toward the study area), per-gate ramp share cap. Freeway mainline through trips are excluded.` },
  { source: 'US Census LEHD LODES8 CA OD main JT00 2024 and ca_xwalk', url: 'https://lehd.ces.census.gov/data/lodes/LODES8/ca/', note: 'DATA. Resident workers and jobs per block in the bbox (nearest in-area residential node) and home/work direction mix by compass sector. Trip rates, mode share, peak-hour shares are ASSUMPTIONS.' },
  ...(cfg.active ? [{ source: 'Walking and biking demand (pedestrian and bicycle flows, persons per hour)', url: 'data/demand/README.md', note: 'ASSUMPTION, not counts: synthesized from LODES resident workers and jobs per block with assumed mode shares, trip lengths, gate and commercial-street shares (config `active`). DATA: the volumes are scaled by one factor per mode so that PM peak-hour people passing Telegraph Ave & Alcatraz Ave match the mean of the Oakland pedestrian and bicycle counts there; the spatial pattern elsewhere is uncounted. Calibration against walking and biking counts has not been done.' }] : []),
  { source: 'Assumptions', url: 'data/demand/README.md', note: 'ASSUMPTION: K-factor, period volume factors, per-class default ADT, directional split, trip rates, gravity turning factors, sector-to-gate weights, local trip share capped per gate. Uncalibrated.' }
];

const out = { version: 1, area: cfg.area, periods: outPeriods, provenance };
mkdirSync(dirname(cfg.output), { recursive: true });
writeFileSync(cfg.output, JSON.stringify(out));

// ---------- summary ----------
console.log(`Demand for ${cfg.area}: ${gates.length} surface gates, ${fwGates.length} freeway gates, ${ramps.length} ramps, ${localNodes.size} local nodes (LODES ${lodes ? 'ok' : 'MISSING'}); TMC ${tmc ? 'ok' : 'MISSING'}`);
console.log('\nPeriod        total veh/h  through   local    ramp  (ramp->local)  through%  local%  ramp%  flows  pruned');
for (const s of summary) console.log(`${s.id.padEnd(12)} ${s.total.toFixed(0).padStart(10)} ${s.through.toFixed(0).padStart(8)} ${s.local.toFixed(0).padStart(7)} ${s.ramp.toFixed(0).padStart(7)} ${s.rampLocal.toFixed(0).padStart(14)} ${pct(s.through, s.total).padStart(9)} ${pct(s.local, s.total).padStart(7)} ${pct(s.ramp, s.total).padStart(6)} ${String(outPeriods.find((q) => q.id === s.id)!.flows.length).padStart(6)} ${String(s.dropped).padStart(6)}`);
console.log(throughDebug.join('\n'));
if (classAdtLog.length) console.log('Class defaults:\n  ' + classAdtLog.join('\n  '));
if (periLog.length) console.log('Peripheral rules:\n  ' + periLog.join('\n  '));
if (activeSummary.lines.length) console.log('\n' + activeSummary.lines.join('\n'));
console.log(`Unroutable flows dropped by the final check (all periods, veh/h): ${unroutableDropped.toFixed(1)}`);

console.log('\nFreeway ramps (kind, surface node, surface streets -> freeway gate(s); volume source)');
for (const r of ramps) { const v = rampVol.get(r)!; console.log(`  ${r.kind.padEnd(3)} node ${String(r.surface).padEnd(4)} ${r.streets.join(' / ').padEnd(34)} ${r.kind === 'off' ? 'from' : 'to  '} gate ${r.gates.join(',').padEnd(4)} ADT ${String(Math.round(v.adt)).padStart(6)} ${v.kind}: ${v.source}`); }
console.log('\nFreeway gates, veh/h by period (out = enters the model at the gate, in = leaves it)');
for (const f of fwGates) console.log(`  gate ${String(f.id).padEnd(4)} ${summary.map((s) => `${s.id} out ${s.fw.get(f.id)!.out.toFixed(0)} in ${s.fw.get(f.id)!.in.toFixed(0)}`).join('  |  ')}`);

const lastS = summary.find((s) => s.id === lastPeriod)!;
const offTotal = [...lastS.rampDest.values()].reduce((a, b) => a + b, 0);
const rampXY = ramps.filter((r) => r.kind === 'off').map((r) => nodeById.get(r.surface)!);
const sectorOfNode = (id: number) => { const n = nodeById.get(id)!; return rampXY.length ? sectorOf(bearing(n.x, n.y, rampXY.reduce((a, q) => a + q.x, 0) / rampXY.length, rampXY.reduce((a, q) => a + q.y, 0) / rampXY.length)) : '-'; };
const bySector = new Map<string, number>(), byName = new Map<string, number>();
for (const [id, v] of lastS.rampDest) {
  const loc = !gates.some((g) => g.id === id);
  bySector.set(sectorOfNode(id), (bySector.get(sectorOfNode(id)) ?? 0) + v);
  const nm = loc ? '(in-area local)' : gateName(id);
  byName.set(nm, (byName.get(nm) ?? 0) + v);
}
console.log(`\nFreeway-origin trips (PM peak ${offTotal.toFixed(0)} veh/h) by destination compass sector from the off-ramps: ${[...bySector].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${pct(v, offTotal)}`).join(', ')}`);
console.log(`Freeway-origin trips by destination street (top 10): ${[...byName].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([k, v]) => `${k} ${pct(v, offTotal)}`).join(', ')}`);

console.log('\nSurface gate targets (PM peak, veh/h) vs count data');
console.log('gate  street       class        dir  target_in target_out  kind        data/source');
for (const g of [...gates].sort((a, b) => b.inT[lastPeriod] + b.outT[lastPeriod] - a.inT[lastPeriod] - a.outT[lastPeriod])) {
  console.log(`${String(g.id).padEnd(5)} ${(g.street ?? '-').padEnd(12)} ${g.cls.padEnd(12)} ${String(Math.round(g.deg)).padStart(3)}  ${g.inT[lastPeriod].toFixed(0).padStart(9)} ${g.outT[lastPeriod].toFixed(0).padStart(10)}  ${g.kind.padEnd(11)} ${g.source}${g.adt ? ` ADT ${Math.round(g.adt)}` : ''}`);
}
for (const c of tmcs) {
  console.log(`\nTMC ${c.id} legs (PM peak hour, avg): leg entering leaving`);
  for (const [l, v] of Object.entries(c.legs)) console.log(`  ${l}: ${v.entering.toFixed(0)} ${v.leaving.toFixed(0)}`);
}
// Accounting check (PM peak): modeled flow at each surface gate (origin = enters the model, destination = leaves it) against its target, and ramp totals against ADT x K.
{
  const pm = outPeriods.find((q) => q.id === lastPeriod)!.flows.filter((q) => !q.mode);
  const mi = new Map<number, number>(), mo = new Map<number, number>();
  for (const fl of pm) { mi.set(fl.origin, (mi.get(fl.origin) ?? 0) + fl.vehPerHour); mo.set(fl.destination, (mo.get(fl.destination) ?? 0) + fl.vehPerHour); }
  const kinds = new Map<string, { tIn: number; mIn: number; tOut: number; mOut: number; n: number }>();
  for (const g of gates) { const r = kinds.get(g.kind) ?? kinds.set(g.kind, { tIn: 0, mIn: 0, tOut: 0, mOut: 0, n: 0 }).get(g.kind)!; r.tIn += g.inT[lastPeriod]; r.mIn += mi.get(g.id) ?? 0; r.tOut += g.outT[lastPeriod]; r.mOut += mo.get(g.id) ?? 0; r.n++; }
  console.log('\nGate accounting, PM peak (veh/h): kind, gates, target in / modeled in, target out / modeled out');
  for (const [k, r] of kinds) console.log(`  ${k.padEnd(11)} ${String(r.n).padStart(3)}  in ${r.tIn.toFixed(0).padStart(6)} / ${r.mIn.toFixed(0).padStart(6)}  out ${r.tOut.toFixed(0).padStart(6)} / ${r.mOut.toFixed(0).padStart(6)}`);
  console.log('Counted gates (DATA, DATA(adt)): gate street target_in modeled_in ratio | target_out modeled_out ratio');
  for (const g of gates.filter((q) => q.kind !== 'ASSUMPTION').sort((a, b) => b.inT[lastPeriod] + b.outT[lastPeriod] - a.inT[lastPeriod] - a.outT[lastPeriod])) {
    const ti = g.inT[lastPeriod], to = g.outT[lastPeriod], i = mi.get(g.id) ?? 0, o = mo.get(g.id) ?? 0;
    console.log(`  ${String(g.id).padEnd(5)} ${(g.street ?? '-').padEnd(10)} ${ti.toFixed(0).padStart(5)} ${i.toFixed(0).padStart(5)} ${ti ? (i / ti).toFixed(2) : '-'} | ${to.toFixed(0).padStart(5)} ${o.toFixed(0).padStart(5)} ${to ? (o / to).toFixed(2) : '-'}`);
  }
  const expOff = ramps.filter((r) => r.kind === 'off').reduce((a, r) => a + (rampVol.get(r)!.adt * rc.kFactor * pf[lastPeriod].volume), 0);
  const expOn = ramps.filter((r) => r.kind === 'on').reduce((a, r) => a + (rampVol.get(r)!.adt * rc.kFactor * pf[lastPeriod].volume), 0);
  const fwIn = [...fwGates].reduce((a, g) => a + (mi.get(g.id) ?? 0), 0), fwOut = [...fwGates].reduce((a, g) => a + (mo.get(g.id) ?? 0), 0);
  console.log(`Ramp totals, PM: modeled off-ramp trips (mainline gate origin) ${fwIn.toFixed(0)} vs sum of off-ramp ADT x K ${expOff.toFixed(0)}; on-ramp trips ${fwOut.toFixed(0)} vs ${expOn.toFixed(0)}`);
  const nodeMi = [...mi].filter(([id]) => !gates.some((g) => g.id === id) && !fwGates.some((g) => g.id === id)).reduce((a, [, v]) => a + v, 0);
  console.log(`Origins at local nodes ${nodeMi.toFixed(0)} veh/h`);
}
const byStreet = new Map<string, number>();
for (const g of gates) byStreet.set(g.street ?? 'unnamed', (byStreet.get(g.street ?? 'unnamed') ?? 0) + g.inT[lastPeriod] + g.outT[lastPeriod]);
console.log('\nPM surface-gate two-way volume by street:', [...byStreet].map(([k, v]) => `${k} ${v.toFixed(0)}`).join(', '));
