import type { Network } from '../types';
import { pointAlong, polylineLength } from './geom';
import { compassWord } from './naming';
import { turnGeometry, type TurnKind } from './turnkind';
import { buildBaseMap, type BaseMap, type StreetName } from './picture';


/** The static map of one turn is this many meters wide and 0.7 times as high, centered on the junction. ASSUMPTION: display scale. */
export const TURN_VIEW_M = 340;
const ASPECT = 0.75;
/** Nominal drawing width the stroke widths and fonts are scaled to (px); the same convention as the reason maps' `NOMINAL_PX`. */
const NOMINAL = 340;
const NOMINAL_OVERVIEW = 400;
/** How far the arrow reaches back along the approach and forward along the exit, in drawing units. */
const REACH = 62;
const FONT = 11.5;
const CHAR_W = 0.56;
type XY = [number, number];
const fmt = (v: number) => (Math.round(v * 10) / 10).toString();
const pathOf = (g: XY[]) => g.map(([x, y], i) => `${i ? 'L' : 'M'}${fmt(x)} ${fmt(-y)}`).join('');
const norm = (a: number) => { let r = a; while (r > 90) r -= 180; while (r <= -90) r += 180; return r; };

const SHORT: [RegExp, string][] = [[/\bStreet\b/g, 'St'], [/\bAvenue\b/g, 'Ave'], [/\bBoulevard\b/g, 'Blvd'], [/\bRoad\b/g, 'Rd'], [/\bDrive\b/g, 'Dr']];
export const shortStreet = (name: string): string => SHORT.reduce((s, [re, t]) => s.replace(re, t), name.trim());

export interface TurnLabel { kind: 'from' | 'to'; text: string; x: number; y: number; angle: number }
export interface TurnMapModel extends BaseMap {
  turn: TurnKind; from: number; to: number;
  approach: string; departure: string;
  arrow: { d: string; head: { x: number; y: number; angle: number } };
  junction: { x: number; y: number };
  labels: TurnLabel[];
  fontSize: number;
  /** The turn in words, for the map's text alternative: "Colby Street northbound, left onto Alcatraz Avenue westbound". */
  words: string;
}

const streetOf = (net: Network, link: number) => net.links[link].name.trim() || 'an unnamed street';
const sideWord = (t: TurnKind) => (t === 'u-turn' ? 'U-turn onto' : t === 'straight' ? 'straight on to' : `${t} onto`);

export function turnWords(net: Network, from: number, to: number, turn: TurnKind): string {
  return `${streetOf(net, from)} ${compassWord(net, from)}, ${sideWord(turn)} ${streetOf(net, to)} ${compassWord(net, to)}`;
}

/** The map of one turn: a window around the junction with the quiet streets and the outline of the study area, the approach and exit links, a curved arrow through the junction and the two street names. */
export function buildTurnMap(net: Network, from: number, to: number, base: BaseMap = buildBaseMap(net)): TurnMapModel {
  const w = TURN_VIEW_M, h = TURN_VIEW_M * ASPECT, unit = w / NOMINAL;
  const g = turnGeometry(net, from, to, REACH * unit);
  const la = net.links[from], lb = net.links[to];
  const size = FONT * unit;
  const side = g.turn === 'left' ? -1 : 1;
  const ends: XY[] = [g.corner];
  const place = (kind: 'from' | 'to'): TurnLabel => {
    const l = kind === 'from' ? la : lb;
    const text = `${shortStreet(streetOf(net, kind === 'from' ? from : to))} ${compassWord(net, kind === 'from' ? from : to)}`;
    const len = polylineLength(l.geometry);
    const half = (text.length * CHAR_W * size) / 2;
    const want = REACH * unit + half + 4 * unit;
    const s = Math.min(want, 0.97 * len);
    const along = kind === 'from' ? len - s : s;
    const q = pointAlong(l.geometry, Math.max(0, Math.min(len, along)));
    const nx = -Math.sin(q.heading) * side, ny = Math.cos(q.heading) * side;
    const off = 6.5 * unit + 0.38 * size;
    const cx = q.x + nx * off, cy = q.y + ny * off;
    ends.push([cx + Math.cos(q.heading) * half, cy + Math.sin(q.heading) * half], [cx - Math.cos(q.heading) * half, cy - Math.sin(q.heading) * half]);
    return { kind, text, x: cx, y: -cy, angle: norm(-(q.heading * 180) / Math.PI) };
  };
  const labels = [place('from'), place('to')];
  const xs = ends.map((e) => e[0]), ys = ends.map((e) => e[1]);
  const view = { x: (Math.min(...xs) + Math.max(...xs)) / 2 - w / 2, y: -(Math.min(...ys) + Math.max(...ys)) / 2 - h / 2, w, h };
  const inside = (x: number, y: number) => x > view.x + 0.06 * w && x < view.x + 0.94 * w && y > view.y + 0.06 * h && y < view.y + 0.94 * h;
  const streets = new Set([streetOf(net, from), streetOf(net, to)]);
  const names: StreetName[] = base.names.filter((n) => !streets.has(n.text) && inside(n.x, n.y)
    && !labels.some((l) => Math.hypot(l.x - n.x, l.y - n.y) < 70 * unit));
  const head = { x: g.end[0], y: -g.end[1], angle: (g.headingOut * -180) / Math.PI };
  const q = `M${fmt(g.start[0])} ${fmt(-g.start[1])}Q${fmt(g.corner[0])} ${fmt(-g.corner[1])} ${fmt(g.end[0])} ${fmt(-g.end[1])}`;
  return {
    ...base, view, unit, names, turn: g.turn, from, to,
    approach: pathOf(la.geometry), departure: pathOf(lb.geometry),
    arrow: { d: q, head }, junction: { x: g.corner[0], y: -g.corner[1] }, labels, fontSize: size,
    words: turnWords(net, from, to, g.turn),
  };
}

export interface OverviewMarker { n: number; x: number; y: number }
export interface OverviewJunction { node: number; x: number; y: number; lines: string[]; stem: number; anchor: 'start' | 'end'; lx: number; ly: number }
export interface OverviewModel extends BaseMap { markers: OverviewMarker[]; junctions: OverviewJunction[]; fontSize: number; radius: number }

/** The junctions' bounding box fills this share of the overview's width, so the numbered blocks and names have room beside them. ASSUMPTION: display scale. */
const OVERVIEW_SPAN = 0.24;
const OVERVIEW_MIN_M = 520;

/**
 * The area around the assumed turns with each as a numbered marker: those at one junction sit in a small block below it on a leader line, and each junction is named
 * by the streets of its turns. The frame is cropped to the junctions; the study area's outline and boundary names show where they fall.
 */
export function buildOverview(net: Network, turns: { n: number; from: number; to: number }[], base: BaseMap = buildBaseMap(net)): OverviewModel {
  const at = new Map<number, { x: number; y: number; ids: number[]; streets: string[] }>();
  for (const t of turns) {
    const l = net.links[t.from];
    const e = l.geometry[l.geometry.length - 1];
    const k = at.get(l.to) ?? { x: e[0], y: -e[1], ids: [], streets: [] };
    k.ids.push(t.n);
    for (const nm of [streetOf(net, t.from), streetOf(net, t.to)]) if (!k.streets.includes(nm)) k.streets.push(nm);
    at.set(l.to, k);
  }
  const xs = [...at.values()].map((k) => k.x), ys = [...at.values()].map((k) => k.y);
  const spanX = Math.max(...xs) - Math.min(...xs);
  const w = Math.max(OVERVIEW_MIN_M, spanX / OVERVIEW_SPAN), h = 0.62 * w;
  const view = { x: (Math.min(...xs) + Math.max(...xs)) / 2 - w / 2, y: Math.min(...ys) - 0.3 * h, w, h };
  const unit = w / NOMINAL_OVERVIEW, r = 7.5 * unit, step = 2.5 * r, size = 11 * unit;
  const markers: OverviewMarker[] = [], junctions: OverviewJunction[] = [];
  for (const [node, k] of at) {
    const cols = Math.min(2, k.ids.length);
    const top = k.y + 2.4 * r;
    k.ids.forEach((id, j) => {
      const col = j % cols, row = Math.floor(j / cols);
      markers.push({ n: id, x: k.x + (col - (cols - 1) / 2) * step, y: top + r + row * step });
    });
    const names = k.streets.map(shortStreet);
    const lines = names.length > 1 ? [names[0], `and ${names.slice(1).join(' and ')}`] : names;
    const left = k.x < view.x + view.w / 2;
    const rows = Math.ceil(k.ids.length / cols);
    const mid = top + r + ((rows - 1) * step) / 2;
    junctions.push({ node, x: k.x, y: k.y, lines, stem: top, anchor: left ? 'end' : 'start', lx: k.x + (left ? -1 : 1) * (cols * step / 2 + 7 * unit), ly: mid - ((lines.length - 1) * 1.15 * size) / 2 + 0.35 * size });
  }
  const names = base.names.filter((nm) => nm.x > view.x && nm.x < view.x + view.w && nm.y > view.y && nm.y < view.y + view.h);
  return { ...base, view, unit, names, markers, junctions, fontSize: size, radius: r };
}

export { turnGeometry, type TurnKind, type TurnGeometry } from './turnkind';
