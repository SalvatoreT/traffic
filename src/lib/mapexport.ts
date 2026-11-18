import type { Intervention } from '../types';
import { changeMagnitude } from './change';
import { formatClock } from './format';
import { badgeKey, type LegendModel, type MapSymbols } from './legend';
import { RUN_SECONDS } from './run';
import { SLOW_STREET_MPH } from './slowstreet';
import { drawPicto, PICTO_PX, type PictoId } from './signs';
import { drawSpeedSign } from './speedsign';

export const ATTRIBUTION = '© OpenStreetMap contributors';
export type ImageFormat = 'png' | 'jpeg';
export const FORMATS: Record<ImageFormat, { mime: string; ext: string; label: string }> = {
  png: { mime: 'image/png', ext: 'png', label: 'PNG' },
  jpeg: { mime: 'image/jpeg', ext: 'jpg', label: 'JPEG' },
};
/** Export pixels per CSS pixel. */
export const EXPORT_SCALE = 2;

export interface CaptionInput {
  area: string; period: string; time: number;
  /** What the lines on the map show: the baseline's values, the scenario's, or the change between them. */
  shows: 'baseline' | 'scenario' | 'change';
  overlayName: string;
  interventions: string[];
}
export interface Caption { title: string; lines: string[] }

const SHOWS = { baseline: 'Baseline (today)', scenario: 'Scenario', change: 'Change from baseline' };
const MAX_LISTED = 4;

export function captionOf(c: CaptionInput): Caption {
  const scenario = c.interventions.length === 0
    ? 'No interventions (today\'s streets)'
    : `${c.interventions.length} intervention${c.interventions.length === 1 ? '' : 's'}: ${c.interventions.slice(0, MAX_LISTED).join('; ')}${c.interventions.length > MAX_LISTED ? `; and ${c.interventions.length - MAX_LISTED} more` : ''}`;
  return {
    title: `${c.area}, ${c.period}`,
    lines: [
      `Simulated time ${formatClock(Math.min(RUN_SECONDS, c.time))} of ${formatClock(RUN_SECONDS)}. Map shows: ${SHOWS[c.shows]}, ${c.overlayName}.`,
      scenario,
    ],
  };
}

export function exportFileName(area: string, period: string, time: number, fmt: ImageFormat): string {
  const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const t = Math.min(RUN_SECONDS, Math.max(0, Math.floor(time)));
  const clock = `${Math.floor(t / 3600)}h${String(Math.floor((t % 3600) / 60)).padStart(2, '0')}m${String(t % 60).padStart(2, '0')}s`;
  return `${[slug(area), slug(period), clock].filter(Boolean).join('-')}.${FORMATS[fmt].ext}`;
}

/** Greedy word wrap; a single word wider than the line stays whole. */
export function wrapText(measure: (s: string) => number, text: string, maxWidth: number): string[] {
  const out: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word;
    if (line && measure(next) > maxWidth) { out.push(line); line = word; } else line = next;
  }
  if (line) out.push(line);
  return out;
}

/** A speed limit and a Slow Street are drawn as the speed-limit sign (`speedsign.ts`) with their number in mph; every other kind is a picture from `signs.ts`. */
export type SignType = 'speed_limit' | 'slow_street';
export const BADGE_NAME: Record<Intervention['type'], string> = {
  modal_filter: 'modal filter', speed_hump: 'speed hump', speed_limit: 'a block with its own speed limit (the number is the new limit in mph)', slow_street: `Slow Street (speed limit ${SLOW_STREET_MPH} mph on the whole street)`, traffic_circle: 'traffic circle', control: 'intersection control',
  signal_timing: 'signal timing', one_way: 'one-way street', turn_ban: 'turn ban', diagonal_diverter: 'diagonal diverter',
};

/** `leg` is a closed-to-cars bar across a street, centered on (x, y), `len` by `thick` CSS px, turned so it crosses the street whose bearing is `bearing`. A `picto` is drawn from `signs.ts`, turned `rotate` degrees clockwise; a `speed_sign` shows `mph`. */
export type BadgeMark = { x: number; y: number } & (
  | { type: 'leg'; len?: number; thick?: number; bearing?: number }
  | { type: 'diagonal_diverter'; bearing?: number }
  | { type: 'speed_sign'; mph: number }
  | { type: 'picto'; picto: PictoId; rotate?: number }
);

/** Height of the speed-limit sign on the map, in CSS px. */
export const SIGN_PX = 30;

/** Intervention pictures and diverter barriers as the page shows them, in CSS pixels. */
export function drawBadges(g: CanvasRenderingContext2D, marks: BadgeMark[]) {
  for (const m of marks) {
    if (m.type === 'diagonal_diverter') {
      g.save(); g.translate(m.x, m.y); g.rotate(((m.bearing ?? 0) * Math.PI) / 180); g.lineCap = 'butt';
      const line = (w: number, c: string, dash: number[] = []) => { g.setLineDash(dash); g.lineWidth = w; g.strokeStyle = c; g.beginPath(); g.moveTo(0, -17); g.lineTo(0, 17); g.stroke(); };
      line(14, '#fff'); line(10, '#111'); line(6, '#ffd43b', [7, 3]);
      g.restore();
    } else if (m.type === 'leg') {
      if (m.len === undefined || m.thick === undefined) continue;
      const L = m.len, T = m.thick;
      g.save(); g.translate(m.x, m.y); g.rotate(((m.bearing ?? 0) * Math.PI) / 180);
      g.fillStyle = '#fff'; g.fillRect(-L / 2, -T / 2, L, T);
      g.fillStyle = '#111'; g.fillRect(-L / 2, -T * 0.375, L, T * 0.75);
      g.fillStyle = '#ffd43b';
      const dash = T * 0.5 * 1.5;
      for (let x = -dash * 2.5; x < L / 2 - 1; x += 2 * dash) g.fillRect(x, -T * 0.25, Math.min(dash, L / 2 - x), T * 0.5);
      g.restore();
    } else if (m.type === 'speed_sign') drawSpeedSign(g, m.x, m.y, m.mph, SIGN_PX);
    else {
      g.save(); g.shadowColor = 'rgba(0,0,0,.3)'; g.shadowBlur = 3; g.shadowOffsetY = 1;
      drawPicto(g, m.x, m.y, m.picto, PICTO_PX, m.rotate);
      g.restore();
    }
  }
}

export interface Theme { surface: string; text: string; muted: string; border: string }
export interface Keys {
  car: boolean; bicycle: boolean; pedestrian: boolean; agents: { car: string; bike: string; ped: string; ring: string };
  /** Marks drawn on this image besides the colored streets, and the color of the reason line. */
  symbols: MapSymbols; reasonColor: string;
}

export interface ComposeInput {
  /** The map as pixels, already `EXPORT_SCALE` times its CSS size. */
  base: CanvasImageSource;
  width: number; height: number;
  /** Draws everything that sits on top of the map, in CSS pixels. */
  paintOnMap(g: CanvasRenderingContext2D): void;
  caption: Caption;
  legend: LegendModel;
  keys: Keys;
  theme: Theme;
  scale?: number;
}

const CHANGE_NOTE = 'Cars only. Thicker line: bigger change. Arrows: largest increase (up) or decrease (down).';
const FLAT_NOTE = 'Thin gray lines carry no vehicles.';
const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

/** Caption band, map, then a footer with the legend and the OpenStreetMap credit, all as one canvas. */
export function composeImage(c: ComposeInput): HTMLCanvasElement {
  const s = c.scale ?? EXPORT_SCALE, W = c.width, H = c.height, pad = 12;
  const probe = document.createElement('canvas').getContext('2d')!;
  probe.font = `13px ${FONT}`;
  const lines = c.caption.lines.flatMap((l) => wrapText((t) => probe.measureText(t).width, l, W - pad * 2));
  const headH = pad + 20 + lines.length * 18 + 6;
  const note = c.legend.change ? CHANGE_NOTE : FLAT_NOTE;
  probe.font = `11px ${FONT}`;
  const noteLines = wrapText((t) => probe.measureText(t).width, note, W - pad * 2);
  const keyRows = layoutKeys(probe, c, W - pad * 2);
  const footH = 78 + (keyRows.length - 1) * 18 + noteLines.length * 14 + 22;
  const cv = document.createElement('canvas');
  cv.width = Math.round(W * s); cv.height = Math.round((headH + H + footH) * s);
  const g = cv.getContext('2d')!;
  g.scale(s, s);
  g.fillStyle = c.theme.surface; g.fillRect(0, 0, W, headH + H + footH);

  g.textBaseline = 'alphabetic'; g.textAlign = 'left';
  g.fillStyle = c.theme.text; g.font = `700 16px ${FONT}`;
  g.fillText(c.caption.title, pad, pad + 14);
  g.font = `13px ${FONT}`; g.fillStyle = c.theme.text;
  lines.forEach((l, i) => g.fillText(l, pad, pad + 20 + 14 + i * 18));

  g.save(); g.translate(0, headH);
  g.drawImage(c.base, 0, 0, W, H);
  g.beginPath(); g.rect(0, 0, W, H); g.clip();
  c.paintOnMap(g);
  g.restore();
  g.strokeStyle = c.theme.border; g.lineWidth = 1;
  g.beginPath(); g.moveTo(0, headH + H + 0.5); g.lineTo(W, headH + H + 0.5); g.stroke();

  drawLegend(g, c, pad, headH + H, noteLines, keyRows);
  g.fillStyle = c.theme.muted; g.font = `12px ${FONT}`; g.textAlign = 'right';
  g.fillText(ATTRIBUTION, W - pad, headH + H + footH - 8);
  return cv;
}

interface KeyItem { label: string; width: number; extra?: number; shape(g: CanvasRenderingContext2D, x: number, y: number): void }

/** The symbols the image needs a key for, in rows that fit `maxW`. Agents only appear while cars are drawn; a stored result draws none. */
function layoutKeys(g: CanvasRenderingContext2D, c: ComposeInput, maxW: number): KeyItem[][] {
  const A = c.keys.agents, S = c.keys.symbols;
  const items: Omit<KeyItem, 'width'>[] = [];
  if (c.keys.car) items.push({ label: 'Cars', shape: (g2, x, y) => { g2.lineWidth = 1; g2.strokeStyle = A.ring; g2.fillStyle = A.car; g2.beginPath(); g2.arc(x, y, 4.5, 0, 7); g2.fill(); g2.stroke(); } });
  if (c.keys.bicycle) items.push({ label: 'Bikes', shape: (g2, x, y) => { g2.lineWidth = 1; g2.strokeStyle = A.ring; g2.fillStyle = A.bike; g2.beginPath(); g2.moveTo(x, y - 5); g2.lineTo(x + 5.5, y + 4); g2.lineTo(x - 5.5, y + 4); g2.closePath(); g2.fill(); g2.stroke(); } });
  if (c.keys.pedestrian) items.push({ label: 'People walking', shape: (g2, x, y) => { g2.lineWidth = 1; g2.strokeStyle = A.ring; g2.fillStyle = A.ped; g2.fillRect(x - 4, y - 4, 8, 8); g2.strokeRect(x - 4, y - 4, 8, 8); } });
  if (S.bar) items.push({ label: 'Bar: closed to through cars (modal filter)', extra: 10, shape: (g2, x, y) => { g2.fillStyle = '#fff'; g2.fillRect(x - 6, y - 4, 22, 8); g2.fillStyle = '#111'; g2.fillRect(x - 6, y - 3, 22, 6); g2.fillStyle = '#ffd43b'; for (let i = 0; i < 2; i++) g2.fillRect(x - 5 + i * 11, y - 1.5, 5.5, 3); } });
  if (S.diverter) items.push({ label: 'Striped line: diagonal diverter', extra: 10, shape: (g2, x, y) => { g2.save(); g2.translate(x + 5, y); g2.rotate(1); g2.lineCap = 'butt'; for (const [w, col, dash] of [[8, '#fff', []], [6, '#111', []], [3, '#ffd43b', [4, 2]]] as [number, string, number[]][]) { g2.setLineDash(dash); g2.lineWidth = w; g2.strokeStyle = col; g2.beginPath(); g2.moveTo(0, -7); g2.lineTo(0, 7); g2.stroke(); } g2.restore(); } });
  for (const t of S.badges) {
    const k = badgeKey(t);
    if (k.sign !== undefined) { const mph = k.sign; items.push({ label: k.label, extra: 4, shape: (g2, x, y) => drawSpeedSign(g2, x + 2, y, mph, 15) }); continue; }
    const id = k.picto;
    if (id) items.push({ label: k.label, extra: 4, shape: (g2, x, y) => drawPicto(g2, x + 2, y, id, 16) });
  }
  if (S.reason) items.push({ label: 'Violet dashed line: typical path of the chosen reason', extra: 10, shape: (g2, x, y) => { g2.save(); g2.setLineDash([6, 3]); g2.lineWidth = 3; g2.strokeStyle = c.keys.reasonColor; g2.beginPath(); g2.moveTo(x - 6, y); g2.lineTo(x + 16, y); g2.stroke(); g2.restore(); } });
  g.font = `11px ${FONT}`;
  const rows: KeyItem[][] = [[]];
  let used = 0;
  for (const it of items) {
    const width = 16 + (it.extra ?? 0) + g.measureText(it.label).width + 14;
    if (used > 0 && used + width > maxW) { rows.push([]); used = 0; }
    rows[rows.length - 1].push({ ...it, width });
    used += width;
  }
  return rows;
}

function drawLegend(g: CanvasRenderingContext2D, c: ComposeInput, x0: number, y0: number, noteLines: string[], keyRows: KeyItem[][]) {
  const L = c.legend, th = c.theme;
  g.textAlign = 'left'; g.fillStyle = th.text; g.font = `700 12px ${FONT}`;
  g.fillText(L.name, x0, y0 + 20);
  const barX = x0 + 40, barW = Math.min(260, c.width - 2 * x0 - 56), barY = y0 + 30, barH = 12;
  const grad = g.createLinearGradient(barX, 0, barX + barW, 0);
  for (const st of L.stops) grad.addColorStop(Math.min(1, Math.max(0, st.at)), st.color);
  g.fillStyle = grad;
  if (L.change) {
    // Thin at the middle (no change), thick at both ends, like the on-screen bar.
    const n = Math.round(barW);
    for (let i = 0; i < n; i++) {
      const hh = barH * (0.3 + 0.7 * changeMagnitude((2 * (i + 0.5)) / n - 1));
      g.fillRect(barX + i, barY + (barH - hh) / 2, 1.05, hh);
    }
  } else g.fillRect(barX, barY, barW, barH);
  g.fillStyle = th.text; g.font = `11px ${FONT}`;
  g.textAlign = 'right'; g.fillText(L.ticks[0], barX - 4, barY + 10);
  g.textAlign = 'left'; g.fillText(L.ticks[4], barX + barW + 4, barY + 10);
  g.textAlign = 'center';
  for (const i of [1, 2, 3]) g.fillText(L.ticks[i], barX + (barW * i) / 4, barY + barH + 13);
  // Keys for what is drawn on the map, then a note for the change view.
  const ky = y0 + 72;
  g.textAlign = 'left'; g.font = `11px ${FONT}`;
  keyRows.forEach((row, r) => {
    let kx = x0;
    for (const k of row) { k.shape(g, kx + 6, ky + r * 18 - 4); g.fillStyle = th.text; g.textAlign = 'left'; g.fillText(k.label, kx + 16 + (k.extra ?? 0), ky + r * 18); kx += k.width; }
  });
  g.fillStyle = th.muted;
  noteLines.forEach((l, i) => g.fillText(l, x0, ky + (keyRows.length - 1) * 18 + 18 + i * 14));
}
