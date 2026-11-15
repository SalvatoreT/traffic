import type { Network } from '../types';
import { pointAlong } from './geom';
import { pathEnds, pathWidth, type IntentPaths } from './intents';
import type { NetIndex } from './naming';
import { buildBaseMap, type BaseMap } from './picture';

/** Line widths are drawn at this share of the live map's, because the card's map is a few hundred pixels wide. ASSUMPTION: display scale. */
export const MAP_WIDTH_SCALE = 0.6;
/** Links shorter than this get no direction arrow (m). */
const MIN_ARROW_M = 35;
const FONT = 11;
const CHAR_W = 0.56;
const MARGIN = 5;

export interface MapLine { link: number; d: string; w: number; vph: number }
export interface MapArrow { x: number; y: number; angle: number; w: number }
export interface MapEnd { kind: 'from' | 'to'; street: string; text: string; x: number; y: number; anchor: 'start' | 'end'; dot: { x: number; y: number } }
export interface IntentMapModel extends BaseMap { lines: MapLine[]; arrows: MapArrow[]; ends: MapEnd[]; maxVph: number; fontSize: number }

const fmt = (v: number) => (Math.round(v * 10) / 10).toString();
const pathOf = (g: [number, number][]) => g.map(([x, y], i) => `${i ? 'L' : 'M'}${fmt(x)} ${fmt(-y)}`).join('');

interface Box { x0: number; x1: number; y0: number; y1: number }
const endBox = (e: MapEnd, size: number): Box => {
  const w = e.text.length * CHAR_W * size;
  return { x0: e.anchor === 'start' ? e.x : e.x - w, x1: e.anchor === 'start' ? e.x + w : e.x, y0: e.y - size, y1: e.y + 0.25 * size };
};
/** Bounding box of a street name drawn along its street: its text box turned by the street's angle, padded a little. */
const nameBox = (n: { text: string; x: number; y: number; angle: number }, size: number, pad: number): Box => {
  const w = n.text.length * CHAR_W * size * 0.95, h = size * 1.2, a = (n.angle * Math.PI) / 180;
  const hw = (Math.abs(Math.cos(a)) * w + Math.abs(Math.sin(a)) * h) / 2, hh = (Math.abs(Math.sin(a)) * w + Math.abs(Math.cos(a)) * h) / 2;
  return { x0: n.x - hw - pad, x1: n.x + hw + pad, y0: n.y - hh - h * 0.3 - pad, y1: n.y + hh + pad };
};
const overlap = (a: Box, b: Box) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;

/** Boundary street names that would sit under a From or To label are dropped: the label already names its street, and nothing is drawn over anything else. */
export function keepNames<N extends { text: string; x: number; y: number; angle: number }>(names: N[], ends: MapEnd[], unit: number, size: number): N[] {
  const boxes = ends.map((e) => endBox(e, size));
  return names.filter((n) => !ends.some((e) => e.street === n.text || Math.hypot(n.x - e.dot.x, n.y - e.dot.y) <= 45 * unit)
    && !boxes.some((b) => overlap(nameBox(n, size, 2 * unit), b)));
}

/** The static map of one reason's typical path: the area, quiet streets, boundary names, the path with width by cars an hour, arrows for direction and where it starts and ends. */
export function buildIntentMap(net: Network, idx: NetIndex, paths: IntentPaths, base: BaseMap = buildBaseMap(net)): IntentMapModel {
  const { unit, view } = base;
  // Where both directions of a street are on the path and one is less than half the other, the arrows would face each other: keep the heavier.
  const segs = paths.segments.filter((s) => {
    const r = net.links[s.link].reverse;
    const other = r === null ? undefined : paths.segments.find((t) => t.link === r);
    return !other || s.vph >= 0.5 * other.vph;
  });
  const lines: MapLine[] = [...segs].sort((a, b) => a.vph - b.vph || a.link - b.link).map((s) => ({
    link: s.link, d: pathOf(net.links[s.link].geometry), w: pathWidth(s.vph) * MAP_WIDTH_SCALE * unit, vph: s.vph,
  }));
  const arrows: MapArrow[] = [];
  for (const s of segs) {
    const l = net.links[s.link];
    if (l.length < MIN_ARROW_M) continue;
    const q = pointAlong(l.geometry, l.length / 2);
    arrows.push({ x: q.x, y: -q.y, angle: -(q.heading * 180) / Math.PI, w: pathWidth(s.vph) * MAP_WIDTH_SCALE * unit });
  }
  const size = FONT * unit;
  const ends: MapEnd[] = [];
  const e = pathEnds(net, idx, paths);
  const place = (kind: 'from' | 'to', name: string, link: number) => {
    const g = net.links[link].geometry;
    const [px, gy] = kind === 'from' ? g[0] : g[g.length - 1];
    const x = px, y = -gy;
    const text = `${kind === 'from' ? 'From' : 'To'} ${name}`;
    const w = text.length * CHAR_W * size;
    const anchor: 'start' | 'end' = x + w + MARGIN * unit > view.x + view.w ? 'end' : 'start';
    const tx = Math.max(view.x + MARGIN * unit + (anchor === 'end' ? w : 0), Math.min(view.x + view.w - MARGIN * unit - (anchor === 'start' ? w : 0), x + (anchor === 'start' ? 7 : -7) * unit));
    const ty = Math.max(view.y + size + MARGIN * unit, Math.min(view.y + view.h - MARGIN * unit, y - 7 * unit));
    ends.push({ kind, street: name, text, x: tx, y: ty, anchor, dot: { x, y } });
  };
  e.from.slice(0, 1).forEach((f) => place('from', f.name, f.link));
  e.to.slice(0, 1).forEach((t) => place('to', t.name, t.link));
  const names = keepNames(base.names, ends, unit, size);
  return { ...base, names, lines, arrows, ends, maxVph: paths.maxVph, fontSize: size };
}
