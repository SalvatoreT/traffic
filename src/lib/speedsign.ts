import { MPS_TO_MPH } from './format';

/** The one speed-limit sign (US style: white, thin black border, bold black number) that every map, card, picture and key draws. */
export const SIGN_ASPECT = 0.8;
/** Below this height in CSS px the words "SPEED LIMIT" are left off and only the number stays. */
export const SIGN_WORDS_MIN_H = 26;
const FONT = 'Arial, Helvetica, sans-serif';

export const limitMph = (mps: number): number => Math.round(mps * MPS_TO_MPH);
/** The number on the sign; a key that stands for any limit passes a placeholder string instead. */
export const signNumber = (mph: number | string): string => (typeof mph === 'string' ? mph : String(Math.max(0, Math.round(mph))));

export interface SignLayout {
  w: number; h: number; corner: number; border: number; inset: number;
  number: { text: string; size: number; y: number };
  words: { lines: [string, string]; size: number; ys: [number, number] } | null;
}

/** Geometry centered on (0, 0) for a sign `h` tall. */
export function signLayout(mph: number | string, h: number): SignLayout {
  const w = h * SIGN_ASPECT, text = signNumber(mph), withWords = h >= SIGN_WORDS_MIN_H;
  const fit = (base: number) => Math.min(base, (w * 0.84) / (0.62 * text.length));
  const size = fit(withWords ? 0.4 * h : 0.52 * h);
  return {
    w, h, corner: 0.1 * h, border: Math.max(0.035 * h, 0.8), inset: 0.07 * h,
    number: { text, size, y: withWords ? 0.15 * h : 0.02 * h },
    words: withWords ? { lines: ['SPEED', 'LIMIT'], size: 0.135 * h, ys: [-0.32 * h, -0.18 * h] } : null,
  };
}

const n2 = (v: number) => (Math.round(v * 100) / 100).toString();
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The sign as an SVG group centered on (0, 0), `h` tall in the units of the surrounding drawing. A 1 px dark outline keeps it readable on a light map. */
export function speedSignSvg(mph: number | string, h: number, opts: { title?: string; outline?: number } = {}): string {
  const L = signLayout(mph, h), o = opts.outline ?? 1;
  const inner = L.w - 2 * L.inset, innerH = L.h - 2 * L.inset;
  const t = (s: string, size: number, y: number) => `<text x="0" y="${n2(y)}" text-anchor="middle" dominant-baseline="central" font-family="${FONT}" font-size="${n2(size)}" font-weight="700" fill="#111">${s}</text>`;
  return `<g class="speed-sign">${opts.title ? `<title>${esc(opts.title)}</title>` : ''}`
    + `<rect x="${n2(-L.w / 2)}" y="${n2(-L.h / 2)}" width="${n2(L.w)}" height="${n2(L.h)}" rx="${n2(L.corner)}" fill="#fff" stroke="#111" stroke-width="${n2(o)}"/>`
    + `<rect x="${n2(-inner / 2)}" y="${n2(-innerH / 2)}" width="${n2(inner)}" height="${n2(innerH)}" rx="${n2(L.corner * 0.6)}" fill="none" stroke="#111" stroke-width="${n2(L.border)}"/>`
    + (L.words ? L.words.lines.map((s, i) => t(s, L.words!.size, L.words!.ys[i])).join('') : '')
    + t(esc(L.number.text), L.number.size, L.number.y) + '</g>';
}

/** A standalone <svg> of the sign for DOM use. */
export function speedSignElement(mph: number | string, h: number): string {
  const L = signLayout(mph, h), pad = 1.5, w = L.w + 2 * pad, hh = h + 2 * pad;
  return `<svg width="${n2(w)}" height="${n2(hh)}" viewBox="${n2(-w / 2)} ${n2(-hh / 2)} ${n2(w)} ${n2(hh)}" focusable="false" aria-hidden="true">${speedSignSvg(mph, h)}</svg>`;
}

/** The same sign on a canvas, for the exported map image and its key. */
export function drawSpeedSign(g: CanvasRenderingContext2D, cx: number, cy: number, mph: number | string, h: number) {
  const L = signLayout(mph, h), inner = L.w - 2 * L.inset, innerH = L.h - 2 * L.inset;
  const rr = (x: number, y: number, w: number, hh: number, r: number) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + hh, r); g.arcTo(x + w, y + hh, x, y + hh, r); g.arcTo(x, y + hh, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
  g.save();
  rr(cx - L.w / 2, cy - L.h / 2, L.w, L.h, L.corner);
  g.fillStyle = '#fff'; g.fill(); g.lineWidth = 1; g.strokeStyle = '#111'; g.stroke();
  rr(cx - inner / 2, cy - innerH / 2, inner, innerH, L.corner * 0.6);
  g.lineWidth = L.border; g.stroke();
  g.fillStyle = '#111'; g.textAlign = 'center'; g.textBaseline = 'middle';
  if (L.words) { g.font = `700 ${L.words.size}px ${FONT}`; L.words.lines.forEach((s, i) => g.fillText(s, cx, cy + L.words!.ys[i])); }
  g.font = `700 ${L.number.size}px ${FONT}`; g.fillText(L.number.text, cx, cy + L.number.y);
  g.restore();
}

/** Where a sign sits beside its street so it never covers the street's own marks: the offset from the street line in the drawing's px, given the street's heading (radians, x east, y north). */
export function signOffset(heading: number, h: number): { dx: number; dy: number } {
  let px = Math.sin(heading), py = Math.cos(heading);
  if (py > 1e-9 || (Math.abs(py) <= 1e-9 && px < 0)) { px = -px; py = -py; }
  const dist = 8 + Math.abs(py) * (h / 2) + (Math.abs(px) * h * SIGN_ASPECT) / 2;
  return { dx: px * dist, dy: py * dist };
}
