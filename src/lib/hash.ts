import type { ControlType, Intervention, Network } from '../types';
import { makeProjection } from './projection';
import { nearestOnPolyline, pointAlong, polylineLength } from './geom';

/**
 * Scenario links: `#v2;a=<area>;p=<period>;d=<scale>;s=<item>~<item>`
 * Each item is `code,lon,lat[,param...]` with 5-decimal coordinates and no network indices.
 *   mf  modal filter on a block        mn  modal filter at an intersection
 *   sl  speed limit (m/s)              sh  speed hump (the hump's own point)
 *   tc  traffic circle                 ct  control (s a t u c)
 *   st  signal cycle (s)               ow  one-way (kept direction, bearing in degrees)
 *   tb  turn ban (intersection, inbound bearing, outbound bearing)
 */
export const HASH_VERSION = 'v2';
export const LINK_TOLERANCE_M = 25;
export const NODE_TOLERANCE_M = 30;
export const BEARING_TOLERANCE_DEG = 45;
const MAX_ITEMS = 200;

export interface HashMeta { area?: string; period?: string; demandScale?: number }
export interface Unplaced { type: Intervention['type']; lon: number; lat: number; reason: string }
export interface DecodedScenario { interventions: Intervention[]; unplaced: Unplaced[]; legacy: boolean }
export interface EncodeOptions { area?: string | null; period?: string; demandScale?: number }

const CONTROL_CODE: Record<ControlType, string> = { signal: 's', all_way_stop: 'a', two_way_stop: 't', uncontrolled: 'u', traffic_circle: 'c' };
const CODE_CONTROL = Object.fromEntries(Object.entries(CONTROL_CODE).map(([k, v]) => [v, k])) as Record<string, ControlType>;
const TYPE_OF_CODE: Record<string, Intervention['type']> = {
  mf: 'modal_filter', mn: 'modal_filter', sl: 'speed_limit', sh: 'speed_hump', tc: 'traffic_circle',
  ct: 'control', st: 'signal_timing', ow: 'one_way', tb: 'turn_ban',
};

const num = (v: number, dp: number) => String(+v.toFixed(dp) || 0);
const isNum = (v: number, lo: number, hi: number) => Number.isFinite(v) && v >= lo && v <= hi;

/** Compass bearing (degrees clockwise from north) of a math heading in radians. */
const compass = (rad: number) => (((90 - (rad * 180) / Math.PI) % 360) + 360) % 360;
const angDiff = (a: number, b: number) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
const round5 = (b: number) => (Math.round(b / 5) * 5) % 360;
const headingAt = (g: [number, number][], s: number) => compass(pointAlong(g, s).heading);
const startBearing = (g: [number, number][]) => headingAt(g, 0);
const endBearing = (g: [number, number][]) => headingAt(g, polylineLength(g));

export function decodeMeta(hash: string): HashMeta {
  const out: HashMeta = {};
  const h = hash.replace(/^#/, '');
  const kv = new Map<string, string>();
  if (h.startsWith(`${HASH_VERSION};`) || h === HASH_VERSION) {
    for (const t of h.split(';').slice(1)) { const i = t.indexOf('='); if (i > 0) kv.set(t.slice(0, i), t.slice(i + 1)); }
  } else {
    try { new URLSearchParams(h).forEach((v, k) => kv.set(k, v)); } catch { /* ignore */ }
  }
  const a = kv.get('a'); if (a && /^[\w.-]{1,64}$/.test(a)) out.area = a;
  const p = kv.get('p'); if (p && /^[\w.-]{1,64}$/.test(p)) out.period = p;
  if (kv.has('d')) { const d = Number(kv.get('d')); if (isNum(d, 0.1, 3)) out.demandScale = d; }
  return out;
}

/** Midpoint of a block, taken from whichever direction runs north-to-east (stable for two-way streets). */
function blockPoint(net: Network, id: number): [number, number] | null {
  let l = net.links[id];
  if (!l) return null;
  const rev = l.reverse !== null && l.reverse !== l.id ? net.links[l.reverse] : null;
  const mid = (k: typeof l) => pointAlong(k.geometry, polylineLength(k.geometry) / 2);
  if (rev && headingAt(l.geometry, polylineLength(l.geometry) / 2) >= 180) l = rev;
  const p = mid(l);
  return [p.x, p.y];
}

export function encodeScenario(net: Network, interventions: Intervention[], opts: EncodeOptions = {}): string {
  const proj = makeProjection(net.origin);
  const pt = (xy: [number, number] | null) => {
    if (!xy) return null;
    const [lon, lat] = proj.toLonLat(xy[0], xy[1]);
    return `${num(lon, 5)},${num(lat, 5)}`;
  };
  const nodePt = (id: number) => { const n = net.nodes[id]; return n ? pt([n.x, n.y]) : null; };
  const items: string[] = [];
  for (const iv of interventions) {
    let s: string | null = null;
    switch (iv.type) {
      case 'modal_filter': {
        const p = 'link' in iv ? pt(blockPoint(net, iv.link)) : nodePt(iv.node);
        if (p) s = `${'link' in iv ? 'mf' : 'mn'},${p}`;
        break;
      }
      case 'speed_limit': { const p = pt(blockPoint(net, iv.link)); if (p) s = `sl,${p},${num(iv.speed, 2)}`; break; }
      case 'speed_hump': {
        const l = net.links[iv.link];
        if (l) { const q = pointAlong(l.geometry, iv.position); s = `sh,${pt([q.x, q.y])}`; }
        break;
      }
      case 'traffic_circle': { const p = nodePt(iv.node); if (p) s = `tc,${p}`; break; }
      case 'control': { const p = nodePt(iv.node); if (p) s = `ct,${p},${CONTROL_CODE[iv.control]}`; break; }
      case 'signal_timing': { const p = nodePt(iv.node); if (p) s = `st,${p},${num(iv.cycle, 1)}`; break; }
      case 'one_way': {
        const l = net.links[iv.link];
        if (l) {
          const m = pointAlong(l.geometry, polylineLength(l.geometry) / 2);
          s = `ow,${pt([m.x, m.y])},${round5(compass(m.heading))}`;
        }
        break;
      }
      case 'turn_ban': {
        const a = net.links[iv.fromLink], b = net.links[iv.toLink];
        const p = a ? nodePt(a.to) : null;
        if (a && b && p) s = `tb,${p},${round5(endBearing(a.geometry))},${round5(startBearing(b.geometry))}`;
        break;
      }
    }
    if (s) items.push(s);
  }
  const parts: string[] = [HASH_VERSION];
  const area = opts.area === undefined ? net.id : opts.area;
  if (area) parts.push(`a=${area}`);
  if (opts.period) parts.push(`p=${opts.period}`);
  if (opts.demandScale !== undefined && opts.demandScale !== 1) parts.push(`d=${opts.demandScale}`);
  if (items.length) parts.push(`s=${items.join('~')}`);
  return items.length || parts.length > 2 ? `#${parts.join(';')}` : '';
}

interface LinkHit { id: number; along: number }
function matchLink(net: Network, x: number, y: number, bearing?: number): LinkHit | null {
  let best: LinkHit | null = null;
  let bestScore = Infinity;
  for (const l of net.links) {
    const h = nearestOnPolyline(l.geometry, x, y);
    if (h.dist > LINK_TOLERANCE_M) continue;
    const hd = headingAt(l.geometry, h.along);
    let score = h.dist;
    if (bearing !== undefined) {
      const d = angDiff(hd, bearing);
      if (d > BEARING_TOLERANCE_DEG) continue;
      score += d * 0.01;
    } else if (l.reverse !== null && hd >= 180) {
      score += 0.5; // two-way street: prefer the north-to-east direction so the result is stable
    }
    if (score < bestScore) { bestScore = score; best = { id: l.id, along: h.along }; }
  }
  return best;
}

function nodesNear(net: Network, x: number, y: number): number[] {
  return net.nodes
    .map((n) => ({ id: n.id, d: Math.hypot(n.x - x, n.y - y) }))
    .filter((c) => c.d <= NODE_TOLERANCE_M)
    .sort((p, q) => p.d - q.d)
    .map((c) => c.id);
}

function bestByBearing(net: Network, ids: number[], bearing: number, at: (g: [number, number][]) => number): number | null {
  let best: number | null = null;
  let bd = BEARING_TOLERANCE_DEG;
  for (const id of ids) {
    const d = angDiff(at(net.links[id].geometry), bearing);
    if (d <= bd) { bd = d; best = id; }
  }
  return best;
}

/** Nearest named street to a point, for messages about interventions that could not be placed. */
export function nearestStreetName(net: Network, lon: number, lat: number, maxM = 100): string | null {
  const [x, y] = makeProjection(net.origin).toLocal(lon, lat);
  let best: string | null = null;
  let bd = maxM;
  for (const l of net.links) {
    const name = l.name.trim();
    if (!name) continue;
    const d = nearestOnPolyline(l.geometry, x, y).dist;
    if (d <= bd) { bd = d; best = name; }
  }
  return best;
}

export function decodeScenario(net: Network, hash: string): DecodedScenario {
  const out: DecodedScenario = { interventions: [], unplaced: [], legacy: false };
  const h = hash.replace(/^#/, '');
  if (!h) return out;
  if (!(h === HASH_VERSION || h.startsWith(`${HASH_VERSION};`))) {
    try { out.legacy = new URLSearchParams(h).has('i'); } catch { /* malformed: treat as empty */ }
    return out;
  }
  const sTok = h.split(';').find((t) => t.startsWith('s='));
  if (!sTok) return out;
  const proj = makeProjection(net.origin);
  for (const raw of sTok.slice(2).split('~').slice(0, MAX_ITEMS)) {
    const f = raw.split(',');
    const type = TYPE_OF_CODE[f[0]];
    const lon = Number(f[1]), lat = Number(f[2]);
    if (!type || f.length < 3 || !isNum(lon, -180, 180) || !isNum(lat, -90, 90)) continue;
    const [x, y] = proj.toLocal(lon, lat);
    const miss = (reason: string) => out.unplaced.push({ type, lon, lat, reason });
    const noStreet = `No street within ${LINK_TOLERANCE_M} m of the original spot.`;
    const noNode = `No intersection within ${NODE_TOLERANCE_M} m of the original spot.`;
    const p3 = Number(f[3]);
    switch (f[0]) {
      case 'mf': {
        const m = matchLink(net, x, y);
        if (m) out.interventions.push({ type: 'modal_filter', link: m.id }); else miss(noStreet);
        break;
      }
      case 'sl': {
        if (!isNum(p3, 1, 40)) break;
        const m = matchLink(net, x, y);
        if (m) out.interventions.push({ type: 'speed_limit', link: m.id, speed: p3 }); else miss(noStreet);
        break;
      }
      case 'sh': {
        const m = matchLink(net, x, y);
        if (m) out.interventions.push({ type: 'speed_hump', link: m.id, position: Math.round(m.along * 10) / 10 }); else miss(noStreet);
        break;
      }
      case 'ow': {
        if (!isNum(p3, 0, 360)) break;
        const m = matchLink(net, x, y, p3);
        if (m) out.interventions.push({ type: 'one_way', link: m.id }); else miss(`No street within ${LINK_TOLERANCE_M} m running that way.`);
        break;
      }
      case 'tb': {
        const bi = Number(f[3]), bo = Number(f[4]);
        if (!isNum(bi, 0, 360) || !isNum(bo, 0, 360)) break;
        let found: Intervention | null = null;
        for (const nid of nodesNear(net, x, y)) {
          const inc = net.links.filter((l) => l.to === nid).map((l) => l.id);
          const outg = net.links.filter((l) => l.from === nid).map((l) => l.id);
          const a = bestByBearing(net, inc, bi, endBearing);
          const b = bestByBearing(net, outg, bo, startBearing);
          if (a !== null && b !== null) { found = { type: 'turn_ban', fromLink: a, toLink: b }; break; }
        }
        if (found) out.interventions.push(found); else miss('That turn no longer exists at the nearest intersection.');
        break;
      }
      default: {
        const nid = nodesNear(net, x, y)[0];
        if (nid === undefined) { miss(noNode); break; }
        if (f[0] === 'mn') out.interventions.push({ type: 'modal_filter', node: nid });
        else if (f[0] === 'tc') out.interventions.push({ type: 'traffic_circle', node: nid });
        else if (f[0] === 'ct' && CODE_CONTROL[f[3]]) out.interventions.push({ type: 'control', node: nid, control: CODE_CONTROL[f[3]] });
        else if (f[0] === 'st' && isNum(p3, 20, 240)) out.interventions.push({ type: 'signal_timing', node: nid, cycle: p3 });
      }
    }
  }
  return out;
}
