import type { Intervention, Network } from '../types';
import { DEAD_BAND_CUTTHROUGH, softChange } from './change';
import { barPx, blockBar, filterLegs, legBars } from './blocked';
import { pointAlong } from './geom';
import { pointAtLinkMeters } from './junctionends';
import type { NetIndex } from './naming';
import { makeProjection } from './projection';
import { signedNum, type Proposal, type ProposalPicture } from './proposals';

/** Width of the picture in nominal CSS pixels: line widths, bars and type are sized for this and scale with the drawing. */
export const NOMINAL_PX = 400;
/** Zoom the barrier bars are sized for (the map's own bar-to-road ratio at a typical neighborhood zoom). */
const BAR_ZOOM = 15.5;
const PAD_FRACTION = 0.06;

export interface BlockChange { block: number; label: string; base: number; scen: number; delta: number }

/** Per block (both directions together, the way the card counts), through cars an hour today and with the package. */
export function blockChanges(pic: ProposalPicture, index: NetIndex): BlockChange[] {
  const by = new Map<number, BlockChange>();
  pic.links.forEach((id, i) => {
    const b = index.blockOfLink[id];
    if (b === undefined || b < 0) return;
    const c = by.get(b) ?? { block: b, label: index.blocks[b].label, base: 0, scen: 0, delta: 0 };
    c.base += pic.base[i]; c.scen += pic.scen[i]; c.delta = c.scen - c.base;
    by.set(b, c);
  });
  return [...by.values()];
}

/** Intensity -1..1 of a block's change: the same soft dead band and top as the map's cut-through change layer. */
export const blockIntensity = (delta: number): number => softChange(delta, 'cutthrough');

export interface PictureFacts {
  /** The block the card names as gaining the most, as the picture's period sees it; null when the card names none or the name is not on this network. */
  named: BlockChange | null;
  /** Largest drop and largest gain in the picture's period; null when no block moves that way. */
  drop: BlockChange | null;
  gain: BlockChange | null;
}

export function pictureFacts(p: Proposal, pic: ProposalPicture, index: NetIndex): PictureFacts {
  const changes = blockChanges(pic, index);
  const drop = changes.reduce<BlockChange | null>((m, c) => (Math.round(c.delta) < 0 && (!m || c.delta < m.delta) ? c : m), null);
  const gain = changes.reduce<BlockChange | null>((m, c) => (Math.round(c.delta) > 0 && (!m || c.delta > m.delta) ? c : m), null);
  const t = p.harm.through;
  let named: BlockChange | null = null;
  if (t.blocksAboveNoise > 0 && Math.round(t.increaseVehPerHour) > 0 && t.worstBlock) {
    const ids = index.blocks.flatMap((b, i) => (b.label === t.worstBlock ? [i] : []));
    const hit = ids.map((i) => changes.find((c) => c.block === i)).find((c) => c);
    const first = ids[0];
    named = hit ?? (first === undefined ? null : { block: first, label: index.blocks[first].label, base: 0, scen: 0, delta: 0 });
  }
  return { named, drop, gain };
}

export function pictureCaption(periodLabel: string): string {
  return `${periodLabel}, change in through cars an hour on each block, proposal vs. today`;
}

/** Said once per card: the figures average the searched periods and the picture shows one. Empty when only that one period was searched. */
export function periodNote(periodLabels: string[], pictureLabel: string): string {
  if (periodLabels.length <= 1) return '';
  const list = `${periodLabels.slice(0, -1).join(', ')} and ${periodLabels[periodLabels.length - 1]}`;
  return `The figures on this card average ${list}. This picture shows the ${pictureLabel} only.`;
}

/** Where the picture and the card's named block disagree, said plainly instead of hidden. Empty when they agree or the card names no block. */
export function mismatchNote(f: PictureFacts, pictureLabel: string): string {
  if (!f.named) return '';
  const n = f.named;
  const here = Math.round(n.delta) > 0
    ? `gains ${signedNum(n.delta, 'cars an hour', 0)} in the ${pictureLabel}`
    : `does not gain through cars in the ${pictureLabel}`;
  if (f.gain && f.gain.block !== n.block && f.gain.delta > n.delta + DEAD_BAND_CUTTHROUGH / 2) {
    return `${n.label}, the block the card names, gains the most when the periods are averaged. In the ${pictureLabel} it ${here}, and the biggest gain is on ${f.gain.label}, ${signedNum(f.gain.delta, 'cars an hour', 0)}.`;
  }
  return '';
}

/** The picture in words: what the drawing shows, for the image's text alternative. */
export function pictureAlt(p: Proposal, pic: ProposalPicture, f: PictureFacts, pictureLabel: string): string {
  const r = p.byPeriod[pic.period]?.cutThrough;
  const b = r ? Math.round(r.baselineVehPerHour) : 0, s = r ? Math.round(r.scenarioVehPerHour) : 0;
  const d = s - b;
  const total = !r ? '' : d === 0 ? `In the area, no change, ${b} through cars an hour. ` : `In the area, through cars on the side streets go from ${b} to ${s} an hour (${signedNum(d, 'cars an hour', 0)}). `;
  const drop = f.drop ? `The biggest drop is on ${f.drop.label}: ${signedNum(f.drop.delta, 'cars an hour', 0)}.` : 'No block drops.';
  const gain = f.gain ? `The biggest gain is on ${f.gain.label}: ${signedNum(f.gain.delta, 'cars an hour', 0)}.` : 'No block gains through cars.';
  const named = f.named && f.named.block !== f.gain?.block ? ` The block the card names, ${f.named.label}, is outlined: ${signedNum(f.named.delta, 'cars an hour', 0)}.` : '';
  return `Map of the area in the ${pictureLabel}, blue where through cars drop and orange where they rise, with this proposal's changes drawn on the streets. ${total}${drop} ${gain}${named}`;
}

// ---------------------------------------------------------------- drawing model (screen meters: x east, y down)

export interface PictureBlockLine { block: number; d: string; delta: number; t: number }
export type Mark =
  | { kind: 'bar'; x: number; y: number; bearing: number }
  | { kind: 'diverter'; x: number; y: number; bearing: number }
  | { kind: 'arrow'; x: number; y: number; bearing: number }
  | { kind: 'badge'; type: Intervention['type']; x: number; y: number; text: string };
export interface StreetName { text: string; x: number; y: number; angle: number }
export interface Pin { x: number; y: number; text: string; end: boolean; d: string; dashed: boolean }

export interface PictureModel {
  view: { x: number; y: number; w: number; h: number };
  /** Meters per nominal CSS pixel. */
  unit: number;
  outline: string;
  major: string;
  minor: string;
  blocks: PictureBlockLine[];
  marks: Mark[];
  names: StreetName[];
  pins: Pin[];
  bar: { len: number; thick: number };
}

const fmt = (v: number) => (Math.round(v * 10) / 10).toString();
const pathOf = (g: [number, number][]) => g.map(([x, y], i) => `${i ? 'L' : 'M'}${fmt(x)} ${fmt(-y)}`).join('');
const FIT = 1.15;
const BOUNDING = new Set(['primary', 'secondary', 'tertiary']);

export interface BaseMap {
  view: PictureModel['view']; unit: number; outline: string; major: string; minor: string; names: StreetName[];
}

/** The map's frame and its quiet layers: the study area's outline, the streets and the names of the bounding arterials. */
export function buildBaseMap(net: Network): BaseMap {
  const proj = makeProjection(net.origin);
  const ring = net.studyArea.map(([lon, lat]) => proj.toLocal(lon, lat));
  const xs = ring.map((q) => q[0]), ys = ring.map((q) => q[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const pad = Math.max(PAD_FRACTION * Math.max(x1 - x0, y1 - y0), 40);
  const view = { x: x0 - pad, y: -(y1 + pad), w: x1 - x0 + 2 * pad, h: y1 - y0 + 2 * pad };
  const unit = view.w / NOMINAL_PX;
  const inView = (g: [number, number][]) => {
    let a = Infinity, b = -Infinity, c = Infinity, d = -Infinity;
    for (const [x, y] of g) { a = Math.min(a, x); b = Math.max(b, x); c = Math.min(c, y); d = Math.max(d, y); }
    return b >= view.x && a <= view.x + view.w && -c >= view.y && -d <= view.y + view.h;
  };
  const major: string[] = [], minor: string[] = [];
  for (const l of net.links) {
    if (l.reverse !== null && l.reverse < l.id) continue;
    if (!inView(l.geometry)) continue;
    (l.class === 'residential' || l.class === 'service' ? minor : major).push(pathOf(l.geometry));
  }
  const at = (x: number, y: number) => ({ x, y: -y });
  const size = 10.5 * unit;
  const names: StreetName[] = [];
  const by = new Map<string, typeof net.links>();
  for (const l of net.links) {
    if (!l.inStudyArea || !BOUNDING.has(l.class) || !l.name.trim()) continue;
    by.set(l.name.trim(), [...(by.get(l.name.trim()) ?? []), l]);
  }
  for (const [name, ls] of by) {
    const best = ls.reduce((m, l) => (l.length > m.length ? l : m));
    const q = pointAlong(best.geometry, best.length / 2);
    const ext = Math.max(...ls.flatMap((l) => l.geometry.map((g) => Math.hypot(g[0] - q.x, g[1] - q.y))));
    const w = name.length * 0.56 * size;
    if (Math.max(best.length, ext) < w * FIT) continue;
    let angle = -(q.heading * 180) / Math.PI;
    if (angle > 90) angle -= 180; else if (angle < -90) angle += 180;
    names.push({ text: name, ...at(q.x, q.y), angle });
  }

  return { view, unit, outline: `${ring.map((q, i) => `${i ? 'L' : 'M'}${fmt(q[0])} ${fmt(-q[1])}`).join('')}Z`, major: major.join(''), minor: minor.join(''), names };
}

export function buildPicture(net: Network, index: NetIndex, p: Proposal, pic: ProposalPicture, ivs: Intervention[], f: PictureFacts): PictureModel {
  const { view, unit, outline, major, minor, names } = buildBaseMap(net);
  const blocks: PictureBlockLine[] = blockChanges(pic, index).map((c) => ({
    block: c.block, d: pathOf(net.links[index.blocks[c.block].links[0]].geometry), delta: c.delta, t: blockIntensity(c.delta),
  })).sort((a, b) => Math.abs(a.t) - Math.abs(b.t));

  const marks: Mark[] = [];
  const at = (x: number, y: number) => ({ x, y: -y });
  const bearingOf = (heading: number) => ((90 - (heading * 180) / Math.PI) % 360 + 360) % 360;
  for (const iv of ivs) {
    switch (iv.type) {
      case 'modal_filter':
        if ('node' in iv) for (const b of legBars(filterLegs(net, index, iv.node), iv.legs)) marks.push({ kind: 'bar', ...at(b.center[0], b.center[1]), bearing: b.bearing });
        else { const l = net.links[iv.link]; if (l) { const b = blockBar(l); marks.push({ kind: 'bar', ...at(b.center[0], b.center[1]), bearing: b.bearing }); } }
        break;
      case 'diagonal_diverter': { const n = net.nodes[iv.node]; if (n) marks.push({ kind: 'diverter', ...at(n.x, n.y), bearing: iv.bearing }); break; }
      case 'one_way': { const l = net.links[iv.link]; if (l) { const q = pointAtLinkMeters(l, l.length / 2); marks.push({ kind: 'arrow', ...at(q.x, q.y), bearing: bearingOf(q.heading) }); } break; }
      case 'speed_limit': case 'speed_hump': {
        const l = net.links[iv.link]; if (!l) break;
        const q = pointAtLinkMeters(l, iv.type === 'speed_hump' ? iv.position : l.length / 2);
        marks.push({ kind: 'badge', type: iv.type, ...at(q.x, q.y), text: iv.type === 'speed_limit' ? String(Math.round(iv.speed * 2.23694)) : '' });
        break;
      }
      case 'traffic_circle': case 'control': case 'signal_timing': { const n = net.nodes[iv.node]; if (n) marks.push({ kind: 'badge', type: iv.type, ...at(n.x, n.y), text: '' }); break; }
      case 'turn_ban': { const a = net.links[iv.fromLink]; const n = a ? net.nodes[a.to] : undefined; if (n) marks.push({ kind: 'badge', type: 'turn_ban', ...at(n.x, n.y), text: '' }); break; }
    }
  }

  const pins: Pin[] = [];
  const pin = (c: BlockChange | null, dashed: boolean) => {
    if (!c) return;
    const l = net.links[index.blocks[c.block].links[0]];
    const q = pointAlong(l.geometry, l.length / 2);
    const px = q.x, py = -q.y;
    const end = px > view.x + view.w * 0.6;
    pins.push({ x: px + (end ? -9 : 9) * unit, y: py - 9 * unit, text: signedNum(c.delta, '', 0).trim(), end, d: pathOf(l.geometry), dashed });
  };
  pin(f.named, false);
  if (f.gain && f.gain.block !== f.named?.block && f.named && f.gain.delta > f.named.delta + DEAD_BAND_CUTTHROUGH / 2) pin(f.gain, true);

  const bp = barPx(BAR_ZOOM);
  return {
    view, unit, outline, major, minor, blocks, marks, names, pins,
    bar: { len: bp.length * unit, thick: bp.thick * unit },
  };
}
