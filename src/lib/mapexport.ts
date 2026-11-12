import type { Intervention } from '../types';
import { changeMagnitude } from './change';
import { formatClock } from './format';
import type { LegendModel } from './legend';
import { RUN_SECONDS } from './run';

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

const BADGE_TEXT: Record<Intervention['type'], string> = {
  modal_filter: 'MF', speed_hump: 'SH', speed_limit: 'SL', traffic_circle: 'TC', control: 'IC',
  signal_timing: 'ST', one_way: '1W', turn_ban: 'TB', diagonal_diverter: 'DD',
};
// Same fills, outlines and corner shapes as the .iv-badge rules in styles.css.
const BADGE_STYLE: Record<Intervention['type'], { fill: string; edge: string; ink: string; radius: [number, number, number, number] | 'round' }> = {
  modal_filter: { fill: '#ffd43b', edge: '#111', ink: '#111', radius: [4, 4, 4, 4] },
  diagonal_diverter: { fill: '#ffd43b', edge: '#111', ink: '#111', radius: [4, 4, 4, 4] },
  speed_hump: { fill: '#fff', edge: '#c92a2a', ink: '#c92a2a', radius: 'round' },
  speed_limit: { fill: '#fff', edge: '#c92a2a', ink: '#c92a2a', radius: 'round' },
  traffic_circle: { fill: '#d0ebff', edge: '#111', ink: '#111', radius: 'round' },
  control: { fill: '#d3f9d8', edge: '#111', ink: '#111', radius: [3, 12, 3, 12] },
  signal_timing: { fill: '#d3f9d8', edge: '#111', ink: '#111', radius: [3, 12, 3, 12] },
  one_way: { fill: '#e5dbff', edge: '#111', ink: '#111', radius: [12, 4, 4, 12] },
  turn_ban: { fill: '#ffe3e3', edge: '#111', ink: '#111', radius: [4, 12, 4, 4] },
};

export interface BadgeMark { x: number; y: number; type: Intervention['type']; bearing?: number; mph?: number }

function roundedRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: [number, number, number, number]) {
  const [tl, tr, br, bl] = r;
  g.beginPath();
  g.moveTo(x + tl, y); g.lineTo(x + w - tr, y); g.arcTo(x + w, y, x + w, y + tr, tr);
  g.lineTo(x + w, y + h - br); g.arcTo(x + w, y + h, x + w - br, y + h, br);
  g.lineTo(x + bl, y + h); g.arcTo(x, y + h, x, y + h - bl, bl);
  g.lineTo(x, y + tl); g.arcTo(x, y, x + tl, y, tl); g.closePath();
}

/** Intervention badges and diverter barriers as the page shows them, in CSS pixels. */
export function drawBadges(g: CanvasRenderingContext2D, marks: BadgeMark[]) {
  for (const m of marks) {
    if (m.type === 'diagonal_diverter') {
      g.save(); g.translate(m.x, m.y); g.rotate(((m.bearing ?? 0) * Math.PI) / 180); g.lineCap = 'butt';
      const line = (w: number, c: string, dash: number[] = []) => { g.setLineDash(dash); g.lineWidth = w; g.strokeStyle = c; g.beginPath(); g.moveTo(0, -17); g.lineTo(0, 17); g.stroke(); };
      line(14, '#fff'); line(10, '#111'); line(6, '#ffd43b', [7, 3]);
      g.restore();
      continue;
    }
    const st = BADGE_STYLE[m.type];
    const label = m.type === 'speed_limit' && m.mph !== undefined ? String(m.mph) : BADGE_TEXT[m.type];
    g.font = '700 11px system-ui, sans-serif';
    const w = Math.max(26, g.measureText(label).width + 12), h = 26;
    g.save(); g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 4; g.shadowOffsetY = 1;
    roundedRect(g, m.x - w / 2 + 1, m.y - h / 2 + 1, w - 2, h - 2, st.radius === 'round' ? [12, 12, 12, 12] : st.radius);
    g.fillStyle = st.fill; g.fill(); g.restore();
    g.lineWidth = 2; g.strokeStyle = st.edge; g.stroke();
    g.fillStyle = st.ink; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(label, m.x, m.y + 0.5);
  }
}

export interface Theme { surface: string; text: string; muted: string; border: string }
export interface Keys { car: boolean; bicycle: boolean; pedestrian: boolean; agents: { car: string; bike: string; ped: string; ring: string } }

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
  const footH = 78 + noteLines.length * 14 + 22;
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

  drawLegend(g, c, pad, headH + H, noteLines);
  g.fillStyle = c.theme.muted; g.font = `12px ${FONT}`; g.textAlign = 'right';
  g.fillText(ATTRIBUTION, W - pad, headH + H + footH - 8);
  return cv;
}

function drawLegend(g: CanvasRenderingContext2D, c: ComposeInput, x0: number, y0: number, noteLines: string[]) {
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
  // Symbols for the modes drawn on the map, then a note for the change view.
  let kx = x0, ky = y0 + 72;
  g.textAlign = 'left'; g.font = `11px ${FONT}`;
  const A = c.keys.agents;
  const key = (label: string, shape: (x: number, y: number) => void) => {
    shape(kx + 6, ky - 4); g.fillStyle = th.text; g.fillText(label, kx + 16, ky);
    kx += 16 + g.measureText(label).width + 14;
  };
  g.lineWidth = 1; g.strokeStyle = A.ring;
  if (c.keys.car) key('Cars', (x, y) => { g.fillStyle = A.car; g.beginPath(); g.arc(x, y, 4.5, 0, 7); g.fill(); g.stroke(); });
  if (c.keys.bicycle) key('Bikes', (x, y) => { g.fillStyle = A.bike; g.beginPath(); g.moveTo(x, y - 5); g.lineTo(x + 5.5, y + 4); g.lineTo(x - 5.5, y + 4); g.closePath(); g.fill(); g.stroke(); });
  if (c.keys.pedestrian) key('People walking', (x, y) => { g.fillStyle = A.ped; g.fillRect(x - 4, y - 4, 8, 8); g.strokeRect(x - 4, y - 4, 8, 8); });
  g.fillStyle = th.muted;
  noteLines.forEach((l, i) => g.fillText(l, x0, ky + 18 + i * 14));
}
