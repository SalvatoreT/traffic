import type { PictureModel } from '../../src/lib/picture';
import { mapSvg, wrapText, type Measure } from '../../src/lib/shareimage';
import { rampStops } from '../../src/lib/ramps';

/** The standard large link-preview card. Chat apps show it about 500 px wide, so nothing on it is set under 28 px. */
export const CARD_W = 1200;
export const CARD_H = 630;
export const MIN_TEXT_PX = 28;
export const CARD_FONT = "Inter, system-ui, 'Segoe UI', Roboto, Arial, sans-serif";

const PANEL = 560;
const PAD_X = 44, PAD_RIGHT = 32, TOP = 38, BOTTOM = 34;
const TEXT_W = PANEL - PAD_X - PAD_RIGHT;
const INK = '#1b2430', MUTED = '#3d4757', RULE = '#c9c6bc', MAP_BG = '#f1efe8';
const TONE = { down: '#14509a', up: '#9a4000', flat: INK, today: INK } as const;

export type Tone = keyof typeof TONE;

export interface CardInput {
  /** Small line above the title: the area and what the card is. */
  kicker: string;
  title: string;
  /** The one figure the card is about, set large. */
  big: { figure: string; label: string; tone: Tone } | null;
  /** Plain lines under the figure, wrapped. */
  lines: string[];
  /** Pinned to the bottom of the text panel. */
  footer: string[];
  map: { model: PictureModel; sequential: boolean; boost: number; key: 'change' | 'today' | 'none' };
}

export interface LaidText { text: string; size: number; x: number; y: number; width: number }
export interface Card { svg: string; texts: LaidText[]; fits: boolean; contentBottom: number; footerTop: number }

const n1 = (v: number) => (Math.round(v * 100) / 100).toString();
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The first `max` wrapped lines, the last ending in an ellipsis when text was cut. */
function clampLines(lines: string[], max: number, size: number, weight: number, maxW: number, measure: Measure): string[] {
  if (lines.length <= max) return lines;
  const kept = lines.slice(0, max);
  let last = kept[max - 1];
  while (last.length > 1 && measure(`${last}…`, size, weight) > maxW) last = last.slice(0, -1).trimEnd();
  kept[max - 1] = `${last}…`;
  return kept;
}

export function buildCard(inp: CardInput, measure: Measure): Card {
  const texts: LaidText[] = [];
  const out: string[] = [];
  const put = (t: string, x: number, base: number, size: number, weight: number, fill: string) => {
    texts.push({ text: t, size, x, y: base, width: measure(t, size, weight) });
    out.push(`<text x="${n1(x)}" y="${n1(base)}" font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(t)}</text>`);
  };

  const footerSize = 28, footerLead = 36;
  const footerTop = CARD_H - BOTTOM - footerSize - (inp.footer.length - 1) * footerLead;
  const limit = footerTop - 14;

  const stack = (titleSize: number, titleMax: number, bigMax: number) => {
    const body: (() => void)[] = [];
    let y = TOP;
    const kick = clampLines(wrapText(inp.kicker, 28, 700, TEXT_W, measure), 2, 28, 700, TEXT_W, measure);
    kick.forEach((l, i) => { const b = y + 26 + i * 34; body.push(() => put(l, PAD_X, b, 28, 700, MUTED)); });
    y += kick.length * 34 + 8;
    const tl = clampLines(wrapText(inp.title, titleSize, 700, TEXT_W, measure), titleMax, titleSize, 700, TEXT_W, measure);
    tl.forEach((l, i) => { const b = y + titleSize * 0.92 + i * titleSize * 1.14; body.push(() => put(l, PAD_X, b, titleSize, 700, INK)); });
    y += tl.length * titleSize * 1.14 + 12;
    if (inp.big) {
      let size = bigMax;
      while (size > 56 && measure(inp.big.figure, size, 700) > TEXT_W) size -= 4;
      const b = y + size * 0.82;
      const { figure, tone } = inp.big;
      body.push(() => put(figure, PAD_X - 4, b, size, 700, TONE[tone]));
      y += size * 0.98 + 2;
      const lab = wrapText(inp.big.label, 30, 400, TEXT_W, measure);
      lab.forEach((l, i) => { const bb = y + 27 + i * 38; body.push(() => put(l, PAD_X, bb, 30, 400, INK)); });
      y += lab.length * 38 + 8;
    }
    for (const line of inp.lines) {
      const ls = wrapText(line, 30, 400, TEXT_W, measure);
      ls.forEach((l, i) => { const bb = y + 27 + i * 38; body.push(() => put(l, PAD_X, bb, 30, 400, MUTED)); });
      y += ls.length * 38 + 6;
    }
    return { body, bottom: y };
  };

  const tries: [number, number, number][] = inp.big ? [[44, 3, 120], [40, 4, 108], [36, 4, 96], [32, 5, 88]] : [[58, 3, 120], [48, 3, 120], [40, 4, 120]];
  let chosen = stack(...tries[0]);
  for (const t of tries) { chosen = stack(...t); if (chosen.bottom <= limit) break; }
  // A title longer than any tier holds is cut to the lines that fit, never allowed over the footer.
  for (let lines = tries[tries.length - 1][1] - 1; chosen.bottom > limit && lines >= 1; lines--) chosen = stack(tries[tries.length - 1][0], lines, tries[tries.length - 1][2]);
  chosen.body.forEach((f) => f());
  inp.footer.forEach((l, i) => put(l, PAD_X, footerTop + footerSize * 0.9 + i * footerLead, footerSize, i === 0 ? 700 : 400, i === 0 ? INK : MUTED));

  const m = inp.map.model, v = m.view;
  const mapX = PANEL, mapW = CARD_W - PANEL;
  const chipRows = inp.map.key === 'none' ? [] : inp.map.key === 'change' ? [['#14509a', 'Fewer through cars'], ['#bd5a0a', 'More through cars']] : [['ramp', 'Darker: more through cars']];
  const chipW = Math.max(0, ...chipRows.map((r) => measure(r[1], 28, 700))) + 24 + 44 + 16;
  const chipH = chipRows.length * 42 + 20;
  const chipX = CARD_W - 20 - chipW, chipY = CARD_H - 20 - chipH;
  const ramp = rampStops('light');
  const chip: string[] = chipRows.length === 0 ? [] : [`<rect x="${n1(chipX)}" y="${n1(chipY)}" width="${n1(chipW)}" height="${chipH}" rx="12" fill="#ffffff" fill-opacity="0.94" stroke="${RULE}"/>`];
  chipRows.forEach(([color, text], i) => {
    const cy = chipY + 10 + i * 42;
    if (color === 'ramp') {
      chip.push(`<defs><linearGradient id="chiprmp" x1="0" x2="1">${ramp.map((c, k) => `<stop offset="${k * 25}%" stop-color="${c}"/>`).join('')}</linearGradient></defs>`);
      chip.push(`<rect x="${n1(chipX + 14)}" y="${n1(cy + 9)}" width="44" height="22" rx="4" fill="url(#chiprmp)" stroke="${RULE}"/>`);
    } else chip.push(`<rect x="${n1(chipX + 14)}" y="${n1(cy + 6)}" width="44" height="28" rx="4" fill="${color}"/>`);
    const w = measure(text, 28, 700);
    texts.push({ text, size: 28, x: chipX + 70, y: cy + 29, width: w });
    chip.push(`<text x="${n1(chipX + 70)}" y="${n1(cy + 29)}" font-size="28" font-weight="700" fill="${INK}">${esc(text)}</text>`);
  });

  const map = `<clipPath id="mapclip"><rect x="${mapX}" y="0" width="${mapW}" height="${CARD_H}"/></clipPath>`
    + `<g clip-path="url(#mapclip)"><rect x="${mapX}" y="0" width="${mapW}" height="${CARD_H}" fill="${MAP_BG}"/>`
    + `<svg x="${mapX}" y="0" width="${mapW}" height="${CARD_H}" viewBox="${n1(v.x)} ${n1(v.y)} ${n1(v.w)} ${n1(v.h)}" preserveAspectRatio="xMidYMid meet">${mapSvg(m, { boost: inp.map.boost, barBoost: 1.7, sequential: inp.map.sequential, labels: false })}</svg></g>`
    + `<line x1="${mapX}" y1="0" x2="${mapX}" y2="${CARD_H}" stroke="${RULE}" stroke-width="2"/>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_W}" height="${CARD_H}" viewBox="0 0 ${CARD_W} ${CARD_H}" font-family="${esc(CARD_FONT)}"><rect width="${CARD_W}" height="${CARD_H}" fill="#ffffff"/>${map}${chip.join('')}${out.join('')}</svg>`;
  return { svg, texts, fits: chosen.bottom <= limit, contentBottom: chosen.bottom, footerTop };
}

/** Words for `og:image:alt`: what the card says and what its map shows. */
export const cardAlt = (parts: string[]): string => parts.filter(Boolean).join(' ');
