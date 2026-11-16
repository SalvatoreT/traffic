import qrcode from 'qrcode-generator';
import { changeTicks, DEAD_BAND_CUTTHROUGH } from './change';
import { BADGE_STYLE, BADGE_TEXT, ATTRIBUTION } from './mapexport';
import type { Mark, PictureFacts, PictureModel } from './picture';
import { seedsPhrase, signedPct, type Proposal, type ProposalPicture } from './proposals';
import { changeWidthFor, colorForIntensity, divergingStops, mutedColor, widthFor } from './ramps';

/** Layout width of the shared picture in px; it is rasterized at `SHARE_SCALE` times this. Fixed light colors, so it reads the same wherever it is sent. */
export const SHARE_W = 1200;
export const SHARE_SCALE = 1.5;
export const SITE_URL = 'traffic.transit.directory';
export const FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const MARGIN = 36;
const INK = '#1b2430', MUTED = '#4a5565', PAPER = '#ffffff', MAP_BG = '#f1efe8', RULE = '#c9c6bc', BOX = '#eef1f5';
const WIDTH_SCALE = 0.62;

export type Measure = (text: string, size: number, weight: number) => number;

export interface ShareHeadline { label: string; figures: string }

export interface ShareInput {
  areaName: string;
  title: string;
  changes: string[];
  /** The picture's period with its hours, "PM peak (16:00-18:00 weekday)". */
  period: string;
  /** The picture's period, like for like with the map. Null when the card has no result for that period. */
  periodFigure: ShareHeadline | null;
  /** The card's average over the searched periods; null when the picture's period is the only one. */
  averageFigure: ShareHeadline | null;
  caption: string;
  /** Sentences under the legend ramp, in order, each drawn with the swatch of its kind. */
  keys: { kind: 'bar' | 'pin' | 'pin-dashed' | 'text'; text: string }[];
  status: string;
  model: PictureModel;
  /** Absolute address of the proposal on the map; drawn as a QR code. */
  openUrl: string;
}

export interface LaidLine { text: string; x: number; y: number; size: number; width: number }
export interface Section { name: string; left: number; top: number; right: number; bottom: number }
export interface ShareImage { svg: string; width: number; height: number; lines: LaidLine[]; sections: Section[]; qr: { x: number; y: number; size: number; modules: number } }

/** Layout px per QR module: 4.5 px in the JPEG at `SHARE_SCALE` 1.5, enough for a phone camera to read from a screen. Error correction M, quiet zone of 4 modules. */
export const QR_MODULE = 3;
const QR_QUIET = 4;
export function qrMatrix(url: string): boolean[][] {
  const q = qrcode(0, 'M');
  q.addData(url, 'Byte');
  q.make();
  const n = q.getModuleCount();
  return Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => q.isDark(r, c)));
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const n1 = (v: number) => (Math.round(v * 100) / 100).toString();

/** Greedy word wrap to `maxW`; a word wider than the line stands alone. */
export function wrapText(text: string, size: number, weight: number, maxW: number, measure: Measure): string[] {
  const out: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word;
    if (line && measure(next, size, weight) > maxW) { out.push(line); line = word; } else line = next;
  }
  if (line) out.push(line);
  return out;
}

export function markSvg(m: Mark, unit: number, bar: { len: number; thick: number }): string {
  if (m.kind === 'bar') {
    const L = bar.len, T = bar.thick, dash = T * 0.5 * 1.5;
    return `<g transform="translate(${n1(m.x)} ${n1(m.y)}) rotate(${n1(m.bearing)})"><rect x="${n1(-L / 2)}" y="${n1(-T / 2)}" width="${n1(L)}" height="${n1(T)}" fill="#fff"/><rect x="${n1(-L / 2)}" y="${n1(-T * 0.375)}" width="${n1(L)}" height="${n1(T * 0.75)}" fill="#111"/><line x1="${n1(-L / 2)}" y1="0" x2="${n1(L / 2)}" y2="0" stroke="#ffd43b" stroke-width="${n1(T * 0.5)}" stroke-dasharray="${n1(dash)} ${n1(dash)}"/></g>`;
  }
  if (m.kind === 'diverter') {
    const h = 9.5 * unit, k = 0.55 * unit;
    const ln = (w: number, c: string, d = '') => `<line x1="0" y1="${n1(-h)}" x2="0" y2="${n1(h)}" stroke="${c}" stroke-width="${n1(w * k)}"${d}/>`;
    return `<g transform="translate(${n1(m.x)} ${n1(m.y)}) rotate(${n1(m.bearing)})">${ln(14, '#fff')}${ln(10, '#111')}${ln(6, '#ffd43b', ` stroke-dasharray="${n1(7 * k)} ${n1(3 * k)}"`)}</g>`;
  }
  if (m.kind === 'arrow') {
    return `<g transform="translate(${n1(m.x)} ${n1(m.y)}) rotate(${n1(m.bearing)}) scale(${n1(unit)})"><path d="M0 -8 L5.5 4.5 L0 2 L-5.5 4.5 Z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round" paint-order="stroke"/></g>`;
  }
  const st = BADGE_STYLE[m.type];
  const label = m.text || BADGE_TEXT[m.type];
  const w = Math.max(17, label.length * 6.4 + 7), h = 15;
  const r = st.radius === 'round' ? h / 2 : Math.min(...st.radius, h / 2);
  return `<g transform="translate(${n1(m.x)} ${n1(m.y)}) scale(${n1(unit)})"><rect x="${n1(-w / 2)}" y="${n1(-h / 2)}" width="${n1(w)}" height="${n1(h)}" rx="${n1(r)}" fill="${st.fill}" stroke="${st.edge}" stroke-width="1.4"/><text x="0" y="0.5" text-anchor="middle" dominant-baseline="central" font-size="8.5" font-weight="700" fill="${st.ink}">${esc(label)}</text></g>`;
}

/** The map as SVG in its own coordinates (meters, y down), light colors. */
export interface MapOptions {
  /** Multiplies every line width, mark and label, for a map that is shown small. */
  boost?: number;
  /** Extra multiplier for the barrier bars alone. */
  barBoost?: number;
  /** Blocks colored on the sequential today scale (value 0..1) instead of the change scale. */
  sequential?: boolean;
  /** Street names and the labeled outlines; off for a map shown small. */
  labels?: boolean;
}
export function mapSvg(model: PictureModel, opts: MapOptions = {}): string {
  const unit = model.unit * (opts.boost ?? 1);
  const bb = (opts.boost ?? 1) * (opts.barBoost ?? 1);
  const bar = { len: model.bar.len * bb, thick: model.bar.thick * bb };
  const names = opts.labels === false ? [] : model.names, pins = opts.labels === false ? [] : model.pins;
  const muted = mutedColor('light');
  const fontSize = 10.5 * unit;
  const parts: string[] = [];
  parts.push(`<rect x="${n1(model.view.x)}" y="${n1(model.view.y)}" width="${n1(model.view.w)}" height="${n1(model.view.h)}" fill="${MAP_BG}"/>`);
  parts.push(`<path d="${model.minor}" fill="none" stroke="${muted}" stroke-width="${n1(unit)}" stroke-linecap="round" stroke-linejoin="round"/>`);
  parts.push(`<path d="${model.major}" fill="none" stroke="${muted}" stroke-width="${n1(2 * unit)}" stroke-linecap="round" stroke-linejoin="round"/>`);
  parts.push(`<path d="${model.outline}" fill="none" stroke="${INK}" stroke-width="${n1(1.4 * unit)}" stroke-dasharray="${n1(6 * unit)} ${n1(4 * unit)}" opacity="0.75"/>`);
  for (const q of pins) parts.push(`<path d="${q.d}" fill="none" stroke="${INK}" stroke-width="${n1(9 * unit)}" stroke-linecap="round" stroke-linejoin="round"${q.dashed ? ` stroke-dasharray="${n1(5 * unit)} ${n1(4 * unit)}"` : ''}/>`);
  for (const q of pins) parts.push(`<path d="${q.d}" fill="none" stroke="${MAP_BG}" stroke-width="${n1(6.5 * unit)}" stroke-linecap="round" stroke-linejoin="round"/>`);
  for (const b of model.blocks) parts.push(`<path d="${b.d}" fill="none" stroke="${colorForIntensity(b.t, 'light', !opts.sequential)}" stroke-width="${n1((opts.sequential ? widthFor(b.t) : changeWidthFor(b.t) * WIDTH_SCALE) * unit)}" stroke-linecap="round" stroke-linejoin="round"/>`);
  for (const nm of names) parts.push(`<text x="0" y="0" transform="translate(${n1(nm.x)} ${n1(nm.y)}) rotate(${n1(nm.angle)})" text-anchor="middle" dy="${n1(-3.5 * unit)}" font-size="${n1(fontSize)}" font-weight="600" fill="${INK}" stroke="${MAP_BG}" stroke-width="${n1(3 * unit)}" paint-order="stroke" stroke-linejoin="round">${esc(nm.text)}</text>`);
  for (const m of model.marks) parts.push(markSvg(m, unit, bar));
  for (const q of pins) parts.push(`<text x="${n1(q.x)}" y="${n1(q.y)}" text-anchor="${q.end ? 'end' : 'start'}" font-size="${n1(fontSize * 1.15)}" font-weight="700" fill="${INK}" stroke="${MAP_BG}" stroke-width="${n1(3.5 * unit)}" paint-order="stroke" stroke-linejoin="round">${esc(q.text)}</text>`);
  return parts.join('');
}

/** Longest the picture may grow before the changes list is shortened, in layout px (the width is `SHARE_W`). */
export const SHARE_MAX_H = 1080;
/** A change label up to its first comma: the long ones go on to say which legs a diverter joins. */
export const firstClause = (label: string): string => label.replace(/,.*$/, '');

const LEAD = 1.3;
const COL_GAP = 32;
const BAND_LEFT = 400;
const MIN_ZONE = 560;
const QR_EDGE = 10;
const QR_NOTE = 'Scan to open';

interface Sink { out: string[]; lines: LaidLine[] }
const makeText = (sink: Sink, measure: Measure) => {
  const text = (t: string, x: number, baseline: number, size: number, weight: number, fill: string, anchor = 'start') => {
    const w = measure(t, size, weight);
    sink.lines.push({ text: t, x: anchor === 'end' ? x - w : anchor === 'middle' ? x - w / 2 : x, y: baseline, size, width: w });
    sink.out.push(`<text x="${n1(x)}" y="${n1(baseline)}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(t)}</text>`);
  };
  /** Wrapped paragraph from `y`; returns the height used. */
  const para = (t: string, x: number, y: number, maxW: number, size: number, weight: number, fill: string, lead = LEAD): number => {
    const ls = wrapText(t, size, weight, maxW, measure);
    ls.forEach((l, i) => text(l, x, y + size * 0.95 + i * size * lead, size, weight, fill));
    return ls.length * size * lead;
  };
  return { text, para };
};

interface Box { x: number; y: number; w: number; h: number }

/** Points of the map that a corner stamp must not cover: colored blocks, marks, labels and pin text, in map meters. */
function inkPoints(model: PictureModel): { x: number; y: number; r: number }[] {
  const pts: { x: number; y: number; r: number }[] = [];
  const num = /(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g;
  const walk = (d: string, r: number) => {
    let prev: [number, number] | null = null;
    for (const m of d.matchAll(num)) {
      const q: [number, number] = [Number(m[1]), Number(m[2])];
      if (prev) { const n = Math.max(1, Math.ceil(Math.hypot(q[0] - prev[0], q[1] - prev[1]) / (4 * model.unit))); for (let i = 1; i < n; i++) pts.push({ x: prev[0] + ((q[0] - prev[0]) * i) / n, y: prev[1] + ((q[1] - prev[1]) * i) / n, r }); }
      pts.push({ x: q[0], y: q[1], r });
      prev = q;
    }
  };
  for (const b of model.blocks) walk(b.d, 4 * model.unit);
  for (const p of model.pins) { walk(p.d, 5 * model.unit); for (let i = 0; i <= 6; i++) pts.push({ x: p.x + (p.end ? -i : i) * 7 * model.unit, y: p.y, r: 8 * model.unit }); }
  for (const m of model.marks) pts.push({ x: m.x, y: m.y, r: 14 * model.unit });
  for (const nm of model.names) { const half = nm.text.length * 0.3 * 10.5 * model.unit; for (let i = -4; i <= 4; i++) pts.push({ x: nm.x + (i / 4) * half, y: nm.y, r: 8 * model.unit }); }
  return pts;
}

/** The corner of the map, in preference order, whose stamp-sized square holds none of the drawn ink; null when none is clear. */
export function freeCorner(model: PictureModel, mapW: number, mapH: number, stampW: number, stampH: number): 'br' | 'tr' | 'bl' | 'tl' | null {
  const v = model.view;
  const sx = v.w / mapW, sy = v.h / mapH;
  const e = QR_EDGE;
  const pts = inkPoints(model);
  const rects: Record<string, Box> = {
    br: { x: v.x + v.w - (e + stampW) * sx, y: v.y + v.h - (e + stampH) * sy, w: stampW * sx, h: stampH * sy },
    tr: { x: v.x + v.w - (e + stampW) * sx, y: v.y + e * sy, w: stampW * sx, h: stampH * sy },
    bl: { x: v.x + e * sx, y: v.y + v.h - (e + stampH) * sy, w: stampW * sx, h: stampH * sy },
    tl: { x: v.x + e * sx, y: v.y + e * sy, w: stampW * sx, h: stampH * sy },
  };
  for (const c of ['br', 'tr', 'bl', 'tl'] as const) {
    const r = rects[c];
    if (!pts.some((p) => p.x + p.r > r.x && p.x - p.r < r.x + r.w && p.y + p.r > r.y && p.y - p.r < r.y + r.h)) return c;
  }
  return null;
}

/**
 * The picture as one self-contained SVG, landscape: the name, changes and through-car figures on the left, the map on the right with the QR code in
 * a clear corner of it, and a band under both with the legend, its non-color cues, status, attribution and site. Text is laid out here with
 * `measure`, so every line fits and no box overlaps. When the changes would make the picture taller than `SHARE_MAX_H`, their lines are shortened
 * to the first clause, then cut to "and N more"; the card keeps the full list.
 */
export function buildShareSvg(inp: ShareInput, measure: Measure): ShareImage {
  const full = layoutShare(inp, inp.changes, measure);
  if (full.height <= SHARE_MAX_H) return full;
  const short = inp.changes.map(firstClause);
  const brief = layoutShare(inp, short, measure);
  if (brief.height <= SHARE_MAX_H) return brief;
  for (let keep = short.length - 1; keep >= 1; keep--) {
    const cut = layoutShare(inp, [...short.slice(0, keep), `and ${short.length - keep} more`], measure);
    if (cut.height <= SHARE_MAX_H || keep === 1) return cut;
  }
  return brief;
}

function layoutShare(inp: ShareInput, changes: string[], measure: Measure, qrBelow = false): ShareImage {
  const v = inp.model.view;
  const asp = v.w / v.h;
  const qrm = qrMatrix(inp.openUrl);
  const qrSize = (qrm.length + 2 * QR_QUIET) * QR_MODULE;
  const stampH = qrSize + 22;

  /** The left column at width `w` from `y0`: returns its height and the boxes it drew. */
  const leftColumn = (sink: Sink, x: number, y0: number, w: number) => {
    const { text, para } = makeText(sink, measure);
    const boxes: Section[] = [];
    let y = y0;
    y += para(inp.areaName, x, y, w, 20, 600, MUTED) + 6;
    y += para(inp.title, x, y, w, 36, 700, INK, 1.18);
    boxes.push({ name: 'title', left: x, top: y0, right: x + w, bottom: y });
    if (changes.length) {
      y += 14; const top = y;
      y += para('Changes in this proposal', x, y, w, 18, 700, MUTED) + 4;
      for (const c of changes) {
        const ls = wrapText(c, 21, 400, w - 24, measure);
        text('•', x + 3, y + 20, 21, 400, INK);
        ls.forEach((l, i) => text(l, x + 24, y + 20 + i * 27, 21, 400, INK));
        y += ls.length * 27 + 3;
      }
      boxes.push({ name: 'changes', left: x, top, right: x + w, bottom: y });
    }
    y += 14; const top = y, pad = 16, boxIdx = sink.out.length;
    y += pad;
    const figure = (f: ShareHeadline, big: boolean) => {
      y += para(f.label, x + pad, y, w - 2 * pad, 17, 400, MUTED) + 2;
      y += para(f.figures, x + pad, y, w - 2 * pad, big ? 30 : 26, 700, INK, 1.2);
    };
    if (inp.periodFigure) figure(inp.periodFigure, true);
    if (inp.averageFigure) { if (inp.periodFigure) y += 10; figure(inp.averageFigure, !inp.periodFigure); }
    y += pad;
    sink.out.splice(boxIdx, 0, `<rect x="${x}" y="${n1(top)}" width="${w}" height="${n1(y - top)}" rx="10" fill="${BOX}"/>`);
    boxes.push({ name: 'figures', left: x, top, right: x + w, bottom: y });
    return { height: y - y0, boxes };
  };

  const avail = (lw: number) => SHARE_W - 2 * MARGIN - COL_GAP - lw;
  let best: { lw: number; zone: number; mapW: number; mapH: number } | null = null;
  for (let lw = Math.round(SHARE_W * 0.38); lw <= Math.round(SHARE_W * 0.44); lw += 8) {
    const h = leftColumn({ out: [], lines: [] }, MARGIN, 0, lw).height + (qrBelow ? stampH + 14 : 0);
    const zone = Math.max(h, MIN_ZONE);
    const mapW = Math.min(zone * asp, avail(lw));
    const mapH = mapW / asp;
    if (!best || mapH > best.mapH + 0.5 || (Math.abs(mapH - best.mapH) <= 0.5 && zone < best.zone)) best = { lw, zone, mapW, mapH };
  }
  const { zone, mapW, mapH } = best!;
  const lw = Math.min(Math.max(SHARE_W - 2 * MARGIN - COL_GAP - mapW, Math.round(SHARE_W * 0.38)), Math.round(SHARE_W * 0.46));
  const corner = qrBelow ? null : freeCorner(inp.model, mapW, mapH, qrSize, stampH);
  if (!qrBelow && corner === null) return layoutShare(inp, changes, measure, true);

  const out: string[] = [];
  const lines: LaidLine[] = [];
  const sink = { out, lines };
  const sections: Section[] = [];
  const { text, para } = makeText(sink, measure);
  const left = leftColumn(sink, MARGIN, MARGIN, lw);
  sections.push(...left.boxes);
  let qr: ShareImage['qr'];
  const drawQr = (qx: number, qy: number) => {
    const qrPath = qrm.flatMap((row, r) => row.map((d, c) => (d ? `M${n1(qx + (c + QR_QUIET) * QR_MODULE)} ${n1(qy + (r + QR_QUIET) * QR_MODULE)}h${QR_MODULE}v${QR_MODULE}h-${QR_MODULE}z` : ''))).join('');
    out.push(`<rect x="${n1(qx)}" y="${n1(qy)}" width="${qrSize}" height="${qrSize}" fill="#fff" stroke="${RULE}"/><path d="${qrPath}" fill="#000" shape-rendering="crispEdges"/>`);
    text(QR_NOTE, qx + qrSize / 2, qy + qrSize + 17, 16, 700, INK, 'middle');
    return { x: qx, y: qy, size: qrSize, modules: qrm.length };
  };
  if (qrBelow) {
    const bottom = left.boxes[left.boxes.length - 1].bottom;
    qr = drawQr(MARGIN, bottom + 14);
    sections.push({ name: 'qr', left: MARGIN, top: bottom + 14, right: MARGIN + qrSize, bottom: bottom + 14 + stampH });
  }

  const mx = SHARE_W - MARGIN - mapW, my = MARGIN;
  out.push(`<clipPath id="mapclip"><rect x="${n1(mx)}" y="${my}" width="${n1(mapW)}" height="${n1(mapH)}" rx="10"/></clipPath>`);
  out.push(`<g clip-path="url(#mapclip)"><svg x="${n1(mx)}" y="${my}" width="${n1(mapW)}" height="${n1(mapH)}" viewBox="${n1(v.x)} ${n1(v.y)} ${n1(v.w)} ${n1(v.h)}" preserveAspectRatio="xMidYMid meet">${mapSvg(inp.model)}</svg></g>`);
  out.push(`<rect x="${n1(mx + 0.5)}" y="${my + 0.5}" width="${n1(mapW - 1)}" height="${n1(mapH - 1)}" rx="10" fill="none" stroke="${RULE}"/>`);
  sections.push({ name: 'map', left: mx, top: my, right: mx + mapW, bottom: my + mapH });
  if (corner) {
    const qx = corner.endsWith('r') ? mx + mapW - QR_EDGE - qrSize : mx + QR_EDGE;
    const qy = corner.startsWith('b') ? my + mapH - QR_EDGE - stampH : my + QR_EDGE;
    qr = drawQr(qx, qy);
  }

  let y = MARGIN + Math.max(zone, left.height) + 14;
  out.push(`<line x1="${MARGIN}" y1="${n1(y)}" x2="${SHARE_W - MARGIN}" y2="${n1(y)}" stroke="${RULE}"/>`);
  y += 14;
  const legendTop = y;
  let ly = y;
  ly += para(inp.caption, MARGIN, ly, BAND_LEFT, 20, 700, INK) + 8;
  const ticks = changeTicks('cutthrough');
  out.push(`<defs><linearGradient id="ramp" x1="0" x2="1" y1="0" y2="0">${divergingStops('light').map((s) => `<stop offset="${((s.t + 1) * 50).toFixed(1)}%" stop-color="${s.color}"/>`).join('')}</linearGradient></defs>`);
  out.push(`<rect x="${MARGIN}" y="${n1(ly)}" width="${BAND_LEFT}" height="16" rx="3" fill="url(#ramp)" stroke="${RULE}"/>`);
  ly += 16 + 19;
  ticks.forEach((t, i) => {
    const x = MARGIN + (BAND_LEFT * i) / (ticks.length - 1);
    text(t, x, ly, 17, 400, INK, i === 0 ? 'start' : i === ticks.length - 1 ? 'end' : 'middle');
  });
  ly += 8;
  ly += para(`Cars an hour. Blue: fewer through cars. Orange: more. Thin gray: within normal run-to-run variation (about ${Math.round(DEAD_BAND_CUTTHROUGH)} cars an hour).`, MARGIN, ly, BAND_LEFT, 17, 400, MUTED);
  sections.push({ name: 'legend', left: MARGIN, top: legendTop, right: MARGIN + BAND_LEFT, bottom: ly });

  const kx = MARGIN + BAND_LEFT + COL_GAP, kw = SHARE_W - MARGIN - kx;
  let ky = legendTop;
  for (const k of inp.keys) {
    const sw = k.kind === 'text' ? 0 : 52;
    const ls = wrapText(k.text, 17, 400, kw - (sw ? sw + 12 : 0), measure);
    const h = ls.length * 22;
    if (k.kind === 'bar') out.push(`<g transform="translate(${kx + 22} ${n1(ky + 11)})"><rect x="-22" y="-6" width="44" height="12" fill="#fff"/><rect x="-22" y="-4.5" width="44" height="9" fill="#111"/><line x1="-22" y1="0" x2="22" y2="0" stroke="#ffd43b" stroke-width="6" stroke-dasharray="9 9"/></g>`);
    if (k.kind === 'pin' || k.kind === 'pin-dashed') {
      const d = k.kind === 'pin-dashed' ? ' stroke-dasharray="7 6"' : '';
      out.push(`<line x1="${kx}" y1="${n1(ky + 11)}" x2="${kx + 44}" y2="${n1(ky + 11)}" stroke="${INK}" stroke-width="12" stroke-linecap="round"${d}/><line x1="${kx}" y1="${n1(ky + 11)}" x2="${kx + 44}" y2="${n1(ky + 11)}" stroke="${colorForIntensity(0.7, 'light', true)}" stroke-width="7" stroke-linecap="round"${d}/>`);
    }
    ls.forEach((l, i) => text(l, kx + (sw ? sw + 12 : 0), ky + 16 + i * 22, 17, 400, MUTED));
    ky += Math.max(h, 24) + 4;
  }
  ky += 4;
  ky += para(`Simulation result, not a forecast. ${inp.status} ${inp.areaName}. ${ATTRIBUTION}.`, kx, ky, kw, 17, 400, MUTED) + 2;
  ky += para(SITE_URL, kx, ky, kw, 20, 700, INK);
  sections.push({ name: 'keys', left: kx, top: legendTop, right: kx + kw, bottom: ky });
  y = Math.max(ly, ky);

  const height = Math.ceil(y + MARGIN - 8);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SHARE_W}" height="${height}" viewBox="0 0 ${SHARE_W} ${height}" font-family="${esc(FONT)}"><rect width="${SHARE_W}" height="${height}" fill="${PAPER}"/>${out.join('')}</svg>`;
  return { svg, width: SHARE_W, height, lines, sections, qr: qr! };
}

/** Text width in px for a canvas-capable browser, with the same font stack the SVG uses. */
export function canvasMeasure(): Measure {
  const g = document.createElement('canvas').getContext('2d')!;
  return (t, size, weight) => { g.font = `${weight} ${size}px ${FONT}`; return g.measureText(t).width; };
}

/** The picture is kept under this size so it sends easily. */
export const SHARE_MAX_BYTES = 450_000;
/** Tried in order until the file fits: full size first, then lower quality, then fewer pixels. */
export const SHARE_STEPS: { scale: number; quality: number }[] = [
  { scale: SHARE_SCALE, quality: 0.8 }, { scale: SHARE_SCALE, quality: 0.62 }, { scale: 1.5, quality: 0.7 }, { scale: 1.5, quality: 0.5 }, { scale: 1, quality: 0.6 },
];

/** The first encoding that fits `max`, else the smallest one made. */
export async function smallestFit(encode: (step: { scale: number; quality: number }) => Promise<Blob | null>, max = SHARE_MAX_BYTES, steps = SHARE_STEPS): Promise<Blob | null> {
  let best: Blob | null = null;
  for (const step of steps) {
    const b = await encode(step);
    if (!b) continue;
    if (!best || b.size < best.size) best = b;
    if (b.size <= max) return b;
  }
  return best;
}

/** Rasterizes the SVG to a JPEG on the paper color (JPEG has no transparency), stepping quality and size down until it is small enough to send. */
export async function svgToPng(img: ShareImage): Promise<Blob> {
  const url = URL.createObjectURL(new Blob([img.svg], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const el = new Image();
    el.decoding = 'async';
    await new Promise<void>((res, rej) => { el.onload = () => res(); el.onerror = () => rej(new Error('The picture could not be drawn.')); el.src = url; });
    const blob = await smallestFit(({ scale, quality }) => {
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
      const g = c.getContext('2d')!;
      g.fillStyle = PAPER; g.fillRect(0, 0, c.width, c.height);
      g.drawImage(el, 0, 0, c.width, c.height);
      return new Promise<Blob | null>((res) => c.toBlob(res, 'image/jpeg', quality));
    });
    if (!blob) throw new Error('The browser could not encode the picture.');
    return blob;
  } finally { URL.revokeObjectURL(url); }
}

const hoursOnly = (label: string) => label.replace(/,\s*hourly rate/i, '');
const through = (b: number, s: number, pct: number) => `${Math.round(b)} → ${Math.round(s)} an hour (${signedPct(pct)})`;

/** The text of a card's shareable picture. `periodLabel` gives a period's full label, with its hours. */
export function shareInputFor(a: {
  areaName: string; status: string; p: Proposal; pic: ProposalPicture; facts: PictureFacts; model: PictureModel; searched: string[];
  periodLabel(id: string): string; shortLabel(id: string): string; caption: string; openUrl: string;
  /** The seeds behind the figures, so the picture says whether they are a mean and over how many runs. */
  runs?: number[];
}): ShareInput {
  const { p, pic, facts } = a;
  const when = hoursOnly(a.periodLabel(pic.period));
  const r = p.byPeriod[pic.period]?.cutThrough;
  const basis = a.runs && a.runs.length > 0 ? `, ${seedsPhrase(a.runs)}` : '';
  const periodFigure = r ? { label: `Through cars on all the area's side streets, ${when}, the period this picture shows${basis}`, figures: through(r.baselineVehPerHour, r.scenarioVehPerHour, r.changePct) } : null;
  const names = a.searched.map(a.shortLabel);
  const list = names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
  const averageFigure = names.length > 1 || (!periodFigure && names.length === 1)
    ? { label: `Average of ${list}, all side streets${basis}`, figures: through(p.cutThrough.baselineVehPerHour, p.cutThrough.scenarioVehPerHour, p.cutThrough.changePct) }
    : null;
  const keys: ShareInput['keys'] = [];
  const kinds = new Set(a.model.marks.map((m) => m.kind));
  if (kinds.has('bar')) keys.push({ kind: 'bar', text: 'Yellow and black bar across a street: closed to through cars.' });
  const pins = a.model.pins;
  if (pins.length > 0 && facts.named) keys.push({ kind: 'pin', text: `Outlined, labeled ${pins[0].text}: ${facts.named.label}, ${facts.namedKind === 'largest' ? 'the block with the largest through-car increase' : "the block the search flagged with an assumed noise band, which need not have the largest increase"}, averaged over the periods searched.` });
  if (pins.length > 1 && facts.gain) keys.push({ kind: 'pin-dashed', text: `Dashed outline, labeled ${pins[1].text}: ${facts.gain.label}, the biggest gain in the ${a.shortLabel(pic.period)}.` });
  if (kinds.has('diverter')) keys.push({ kind: 'text', text: 'Striped line across a junction: diagonal diverter.' });
  if (kinds.has('arrow')) keys.push({ kind: 'text', text: 'Arrow: one-way street, in the direction shown.' });
  return {
    areaName: a.areaName, title: p.title, changes: p.interventions.map((iv) => iv.label),
    period: when, periodFigure, averageFigure, caption: `${when}: change in through cars an hour on each block, proposal vs. today`, keys, status: a.status, model: a.model, openUrl: a.openUrl,
  };
}

/** The picture's text alternative, with the proposal's name and its changes. */
export function shareAlt(title: string, changes: string[], alt: string): string {
  return `${title}. Changes: ${changes.join('; ')}. ${alt}`;
}
