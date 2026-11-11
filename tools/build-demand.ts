// Builds <area>.demand.json from the network, public counts and LODES. Node built-ins only.
// Usage: npx tsx tools/build-demand.ts [data/demand/<area>.config.json]
// Method and provenance: data/demand/README.md. Steps are tagged DATA or ASSUMPTION.
// Methods: Furness/IPF balancing of the gate-to-gate matrix; gravity seeding; LODES [LODES].
import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const cfgPath = process.argv[2] ?? 'data/demand/rockridge.config.json';
const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));

interface Node { id: number; x: number; y: number; gate: boolean; inStudyArea: boolean }
interface Link { id: number; from: number; to: number; name: string; class: string; inStudyArea: boolean }
interface Network { id: string; origin: { lon: number; lat: number }; studyArea: [number, number][]; nodes: Node[]; links: Link[] }
interface Flow { origin: number; destination: number; vehPerHour: number }

const missing = [cfg.network, cfg.raw.lodes, cfg.raw.caltrans, cfg.raw.oaklandTmc].filter((f: string) => !existsSync(f));
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

// Study-area centre (metres) from the polygon, else mean of in-area nodes.
const poly = net.studyArea?.map(([lon, lat]) => toXY(lat, lon)) ?? [];
const centre: [number, number] = poly.length
  ? [poly.reduce((s, p) => s + p[0], 0) / poly.length, poly.reduce((s, p) => s + p[1], 0) / poly.length]
  : (() => { const n = net.nodes.filter((q) => q.inStudyArea); return [n.reduce((s, q) => s + q.x, 0) / n.length, n.reduce((s, q) => s + q.y, 0) / n.length] as [number, number]; })();
const bearing = (x: number, y: number, cx = centre[0], cy = centre[1]) => ((Math.atan2(x - cx, y - cy) * 180) / Math.PI + 360) % 360;
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

// ---------- DATA: Oakland turning-movement counts ----------
interface LegVol { entering: number; leaving: number; files: number }
function readTmc(): { legs: Record<string, LegVol>; files: string[]; peakHours: string[] } | null {
  const sc = cfg.streetCounts?.[0];
  const dir = cfg.raw[sc?.source];
  if (!sc || !dir || !existsSync(dir)) return null;
  const files = readdirSync(dir).filter((f) => f.includes(sc.filePattern) && f.endsWith('.csv'));
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
  return Object.keys(legs).length ? { legs, files, peakHours } : null;
}
const tmc = readTmc();
const [tx, ty] = tmc ? toXY(cfg.streetCounts[0].intersection.lat, cfg.streetCounts[0].intersection.lon) : [0, 0];

// ---------- gates: peak targets per period ----------
interface Gate { id: number; street: string | null; cls: string; deg: number; source: string; kind: 'DATA' | 'DATA(adt)' | 'ASSUMPTION'; adt: number | null; pmIn: number; pmOut: number; inT: Record<string, number>; outT: Record<string, number>; locIn: Record<string, number>; locOut: Record<string, number> }
const gates: Gate[] = [];
const pf = cfg.periodFactors;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

const excluded = new Set<string>(cfg.excludeClasses ?? []);
const legGroups = new Map<string, { orig: number; dest: number }>();
const legKey = (street: string | null, leg: string | null) => `${street}|${leg}`;
const caps = (id: number) => {
  const ls = incident.get(id) ?? [];
  return { canIn: ls.some((l) => l.from === id), canOut: ls.some((l) => l.to === id) };
};
const legStreet = tmc ? cfg.streetCounts[0].legStreets : {};
const gateLeg = (n: Node) => (tmc ? legOf(bearing(n.x, n.y, tx, ty)) : null);
for (const n of net.nodes.filter((q) => q.gate)) {
  const street = (incident.get(n.id) ?? []).map((l) => streetKey(l.name)).find(Boolean) ?? null;
  const leg = gateLeg(n);
  if (tmc && street && leg && legStreet[leg] === street && tmc.legs[leg]) {
    const c = caps(n.id), r = legGroups.get(legKey(street, leg)) ?? { orig: 0, dest: 0 };
    r.orig += c.canIn ? 1 : 0; r.dest += c.canOut ? 1 : 0; legGroups.set(legKey(street, leg), r);
  }
}
for (const n of net.nodes.filter((q) => q.gate)) {
  const links = incident.get(n.id) ?? [];
  const street = links.map((l) => streetKey(l.name)).find(Boolean) ?? null;
  const cls = links.reduce((a, l) => (classRank[l.class] > (classRank[a] ?? 0) ? l.class : a), '') || 'residential';
  const { canIn, canOut } = caps(n.id);
  let pmIn: number, pmOut: number, kind: Gate['kind'], source: string, adt: number | null = null;
  const leg = gateLeg(n);
  if (excluded.has(cls)) { pmIn = 0; pmOut = 0; kind = 'ASSUMPTION'; source = `excluded class (${cls}): no demand`; }
  else if (tmc && street && leg && legStreet[leg] === street && tmc.legs[leg]) {
    const grp = legGroups.get(legKey(street, leg))!;
    pmIn = canIn ? tmc.legs[leg].entering / Math.max(1, grp.orig) : 0;
    pmOut = canOut ? tmc.legs[leg].leaving / Math.max(1, grp.dest) : 0;
    kind = 'DATA';
    source = `Oakland TMC ${leg}-leg avg of ${tmc.legs[leg].files} counts, shared by ${Math.max(grp.orig, grp.dest)} gate node(s)`;
  } else {
    const ov = cfg.adtOverrides?.find((o: { street: string }) => o.street === street);
    if (ov) { adt = ov.adt * (ov.factor ?? 1); kind = 'DATA(adt)'; source = 'Caltrans AADT override (scaled)'; }
    else { adt = cfg.classDefaultAdt[cls] ?? cfg.classDefaultAdt.residential; kind = 'ASSUMPTION'; source = `class default (${cls})`; }
    const pk = adt! * cfg.kFactor;
    // One-way gate nodes (only entering or only leaving) carry the whole street volume in that direction.
    pmIn = canIn ? (canOut ? pk * pf[lastPeriod].inboundShare : pk) : 0;
    pmOut = canOut ? (canIn ? pk - pmIn : pk) : 0;
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
const gateById = new Map(gates.map((g) => [g.id, g]));

// ---------- LODES blocks -> local origin/destination nodes ----------
const lodes = existsSync(cfg.raw.lodes) ? JSON.parse(readFileSync(cfg.raw.lodes, 'utf8')) : null;
const resNodes = net.nodes.filter((n) => n.inStudyArea && !n.gate && (incident.get(n.id) ?? []).some((l) => l.class === 'residential'));
const candNodes = resNodes.length ? resNodes : net.nodes.filter((n) => n.inStudyArea && !n.gate);
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
  for (const b of lodes.blocks) {
    if (!b.resWorkers && !b.jobs) continue;
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
const summary: { id: string; total: number; through: number; local: number; localInternal: number; dropped: number }[] = [];
let throughDebug: string[] = [];

for (const p of cfg.periods as { id: string; label: string }[]) {
  const local = new Map<string, number>();
  const add = (o: number, d: number, v: number) => { if (o !== d && v > 0) local.set(`${o}>${d}`, (local.get(`${o}>${d}`) ?? 0) + v); };
  const scale = lo.vehicleModeShare * lo.peakHourShare[p.id];
  const origShare = lo.originShareResidents[p.id], destShare = lo.destShareJobs[p.id];
  const locList = [...localNodes.values()];
  for (const g of gates) { g.locIn[p.id] = 0; g.locOut[p.id] = 0; }
  const rawLocal: { o: number; d: number; v: number; gateO?: Gate; gateD?: Gate }[] = [];

  for (const b of locList) {
    // Residents: outbound trips (origin = block). ASSUMPTION rates (config local.*)
    const resTrips = b.res * lo.residentsPerWorker * lo.dailyTripsPerResidentWorker * scale;
    const jobTrips = b.jobs * lo.dailyTripsPerJob * scale;
    const outFromRes = resTrips * origShare, inToRes = resTrips * (1 - origShare);
    const inToJob = jobTrips * destShare, outFromJob = jobTrips * (1 - destShare);
    const outTotal = outFromRes + outFromJob, inTotal = inToRes + inToJob;
    const sOut = Object.values(b.outSectors).reduce((a, c) => a + c, 0), sIn = Object.values(b.inSectors).reduce((a, c) => a + c, 0);
    const fallbackSec = Object.fromEntries(SECTORS.map((s) => [s, 1]));
    const outS = sOut ? b.outSectors : fallbackSec, inS = sIn ? b.inSectors : fallbackSec;
    const oT = Object.values(outS).reduce((a, c) => a + c, 0), iT = Object.values(inS).reduce((a, c) => a + c, 0);
    // External share of trips: DATA-derived directional mix (LODES), share itself ASSUMPTION.
    for (const [s, n] of Object.entries(outS)) {
      const wOut = gateWeights(s, p.id, 'out');
      gates.forEach((g, i) => { const v = outTotal * lo.externalShareOfResidentTrips * (n / oT) * wOut[i]; if (v > 0) rawLocal.push({ o: b.node, d: g.id, v, gateD: g }); });
    }
    for (const [s, n] of Object.entries(inS)) {
      const w = gateWeights(s, p.id, 'in');
      gates.forEach((g, i) => { const v = inTotal * lo.externalShareOfResidentTrips * (n / iT) * w[i]; if (v > 0) rawLocal.push({ o: g.id, d: b.node, v, gateO: g }); });
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
  const R = gates.map((g) => Math.max(0, g.inT[p.id] - g.locIn[p.id]));
  let C = gates.map((g) => Math.max(0, g.outT[p.id] - g.locOut[p.id]));
  const rs = R.reduce((a, b) => a + b, 0), cs = C.reduce((a, b) => a + b, 0);
  C = C.map((c) => (c * rs) / (cs || 1));
  const gv = cfg.gravity;
  const seed: number[][] = gates.map((gi, i) => gates.map((gj, j) => {
    if (i === j) return 0;
    const d = angDiff(gi.deg, gj.deg);
    let f = d >= 135 ? gv.oppositeBonus : d >= 75 ? gv.adjacentFactor : d >= 40 ? gv.adjacentFactor * 0.5 : gv.uTurnPenalty;
    if (gi.street && gi.street === gj.street && d >= 75) f *= gv.sameStreetBonus;
    return f * Math.max(C[j], 1e-6);
  }));
  const T = seed.map((r) => r.slice());
  for (let it = 0; it < gv.furnessIterations; it++) {
    for (let i = 0; i < n; i++) { const s = T[i].reduce((a, b) => a + b, 0); if (s > 0) for (let j = 0; j < n; j++) T[i][j] *= R[i] / s; }
    for (let j = 0; j < n; j++) { let s = 0; for (let i = 0; i < n; i++) s += T[i][j]; if (s > 0) for (let i = 0; i < n; i++) T[i][j] *= C[j] / s; }
  }
  let throughTotal = 0;
  const flowsMap = new Map(local);
  const thr = new Map<string, number>();
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (T[i][j] > 0) { thr.set(`${gates[i].id}>${gates[j].id}`, T[i][j]); throughTotal += T[i][j]; }
  if (p.id === lastPeriod) throughDebug = [`through supply ${rs.toFixed(0)} vs demand ${cs.toFixed(0)} veh/h (demand scaled to supply)`];
  for (const [k, v] of thr) flowsMap.set(k, (flowsMap.get(k) ?? 0) + v);

  // Prune: drop < min, cap count, renormalise to preserve total.
  const totalBefore = [...flowsMap.values()].reduce((a, b) => a + b, 0);
  let list = [...flowsMap].filter(([, v]) => v >= cfg.minFlowVehPerHour).sort((a, b) => b[1] - a[1]).slice(0, cfg.maxFlows);
  const totalAfter = list.reduce((a, [, v]) => a + v, 0);
  const f = totalAfter > 0 ? totalBefore / totalAfter : 1;
  const flows: Flow[] = list.map(([k, v]) => { const [o, d] = k.split('>').map(Number); return { origin: o, destination: d, vehPerHour: Math.round(v * f * 100) / 100 }; });
  const gateIds = new Set(gates.map((g) => g.id));
  let thrOut = 0, locOut = 0;
  for (const fl of flows) (gateIds.has(fl.origin) && gateIds.has(fl.destination) ? (thrOut += fl.vehPerHour) : (locOut += fl.vehPerHour));
  summary.push({ id: p.id, total: thrOut + locOut, through: thrOut, local: locOut, localInternal: internalTotal * f, dropped: flowsMap.size - list.length });
  outPeriods.push({ id: p.id, label: p.label, flows });
}

// ---------- provenance ----------
const provenance = [
  { source: 'Oakland Annual Multi-Modal Counts, Raw Data (OakDOT), Telegraph Ave & Alcatraz Ave PM peak turning movements 2018/2019/2021', url: 'https://data.oaklandca.gov/d/amtg-eh64', note: tmc ? `DATA. Gate peak in/out volumes on Telegraph and Alcatraz legs; ${tmc.files.length} counts averaged (${tmc.peakHours.join('; ')}). Other periods scaled by ASSUMPTION factors (periodFactors).` : 'not available' },
  { source: 'Caltrans Traffic Volumes AADT (SR-13 Claremont Ave, Berkeley)', url: 'https://caltrans-gis.dot.ca.gov/arcgis/rest/services/CHhighway/Traffic_AADT/FeatureServer/0', note: 'DATA used as nearest-count ADT for the Claremont gate with an ASSUMPTION scaling factor; SR-24 AADT is context only.' },
  { source: 'US Census LEHD LODES8 CA OD main JT00 2024 and ca_xwalk', url: 'https://lehd.ces.census.gov/data/lodes/LODES8/ca/', note: 'DATA. Resident workers and jobs per block in the bbox (nearest in-area residential node) and home/work direction mix by compass sector. Trip rates, mode share, peak-hour shares are ASSUMPTIONS.' },
  { source: 'Assumptions', url: 'data/demand/README.md', note: 'ASSUMPTION: K-factor, period volume factors, per-class default ADT, directional split, trip rates, gravity turning factors, sector-to-gate weights, local trip share capped per gate. Uncalibrated.' }
];

const out = { version: 1, area: cfg.area, periods: outPeriods, provenance };
mkdirSync(dirname(cfg.output), { recursive: true });
writeFileSync(cfg.output, JSON.stringify(out));

// ---------- summary ----------
console.log(`Demand for ${cfg.area}: ${gates.length} gates, ${localNodes.size} local nodes (LODES ${lodes ? 'ok' : 'MISSING'}); TMC ${tmc ? 'ok' : 'MISSING'}`);
console.log('\nPeriod        total veh/h  through  local   through%  flows  pruned');
for (const s of summary) console.log(`${s.id.padEnd(12)} ${s.total.toFixed(0).padStart(10)} ${s.through.toFixed(0).padStart(8)} ${s.local.toFixed(0).padStart(7)} ${((100 * s.through) / s.total).toFixed(0).padStart(9)}% ${String(outPeriods.find((q) => q.id === s.id)!.flows.length).padStart(6)} ${String(s.dropped).padStart(6)}`);
console.log(throughDebug.join('\n'));
console.log('\nGate targets (PM peak, veh/h) vs count data');
console.log('gate  street       class        dir  target_in target_out  kind        data/source');
for (const g of [...gates].sort((a, b) => b.inT[lastPeriod] + b.outT[lastPeriod] - a.inT[lastPeriod] - a.outT[lastPeriod])) {
  console.log(`${String(g.id).padEnd(5)} ${(g.street ?? '-').padEnd(12)} ${g.cls.padEnd(12)} ${String(Math.round(g.deg)).padStart(3)}  ${g.inT[lastPeriod].toFixed(0).padStart(9)} ${g.outT[lastPeriod].toFixed(0).padStart(10)}  ${g.kind.padEnd(11)} ${g.source}${g.adt ? ` ADT ${Math.round(g.adt)}` : ''}`);
}
if (tmc) {
  console.log('\nTelegraph/Alcatraz TMC legs (PM peak hour, avg): leg entering leaving');
  for (const [l, v] of Object.entries(tmc.legs)) console.log(`  ${l}: ${v.entering.toFixed(0)} ${v.leaving.toFixed(0)}`);
}
const byStreet = new Map<string, number>();
for (const g of gates) byStreet.set(g.street ?? 'unnamed', (byStreet.get(g.street ?? 'unnamed') ?? 0) + g.inT[lastPeriod] + g.outT[lastPeriod]);
console.log('\nPM gate two-way volume by street:', [...byStreet].map(([k, v]) => `${k} ${v.toFixed(0)}`).join(', '));
