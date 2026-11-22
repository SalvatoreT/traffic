import type { ControlType, Intervention, Network } from '../types';
import { turnKindOf, type TurnKind } from './turnkind';

/**
 * The sign-style pictures that mark an intervention on the map, in the scenario list, in the legend, in a proposal's picture and in the exported image.
 * Each picture is one list of shapes in a 32-unit box centered on (0, 0); the SVG string and the canvas drawing both read it, so they cannot drift apart.
 * Shape and pattern differ for every picture, so color is never the only signal. ASSUMPTION: the pictures follow common US road-sign conventions
 * (octagonal stop, yellow warning diamond, regulatory one-way and turn-prohibition signs) but are simplified for 20 to 30 px; none claims to be an official sign.
 */
export type PictoId =
  | 'stop' | 'all_way_stop' | 'signal' | 'uncontrolled' | 'signal_timing' | 'speed_hump' | 'traffic_circle' | 'one_way' | 'turn_ban_left' | 'turn_ban_right' | 'turn_ban_both' | 'turn_ban'
  | 'modal_filter' | 'diagonal_diverter';

/** The pictures a map or a proposal's picture draws as marks; a modal filter is a bar and a diverter a striped line there, and only the scenario list uses their small pictures. */
export type MapPicto = Exclude<PictoId, 'modal_filter' | 'diagonal_diverter'>;

export const PICTO_BOX = 32;
/** Height in CSS px of a picture on the map. */
export const PICTO_PX = 28;
/** Below this height in CSS px the word on a stop sign is left off and the plain red octagon stays. */
export const PICTO_WORDS_MIN_H = 24;
const FONT = 'Arial, Helvetica, sans-serif';

export interface PictoShape { d: string; fill?: string; stroke?: string; sw?: number; cap?: 'butt' | 'round'; dash?: number[] }
export interface PictoText { text: string; x: number; y: number; size: number; fill: string }
export interface PictoGeometry { shapes: PictoShape[]; texts: PictoText[] }

const r1 = (v: number) => Math.round(v * 100) / 100;
const circle = (cx: number, cy: number, r: number) => `M${r1(cx + r)} ${r1(cy)}A${r} ${r} 0 1 0 ${r1(cx - r)} ${r1(cy)}A${r} ${r} 0 1 0 ${r1(cx + r)} ${r1(cy)}Z`;
const rect = (x: number, y: number, w: number, h: number, rx = 0) => rx === 0
  ? `M${x} ${y}h${w}v${h}h${-w}Z`
  : `M${x + rx} ${y}h${w - 2 * rx}a${rx} ${rx} 0 0 1 ${rx} ${rx}v${h - 2 * rx}a${rx} ${rx} 0 0 1 ${-rx} ${rx}h${-(w - 2 * rx)}a${rx} ${rx} 0 0 1 ${-rx} ${-rx}v${-(h - 2 * rx)}a${rx} ${rx} 0 0 1 ${rx} ${-rx}Z`;
const polygon = (pts: [number, number][]) => `M${pts.map(([x, y]) => `${r1(x)} ${r1(y)}`).join('L')}Z`;
const octagon = (cx: number, cy: number, r: number) => polygon(Array.from({ length: 8 }, (_, k): [number, number] => {
  const a = (Math.PI / 180) * (22.5 + 45 * k);
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}));

const INK = '#111';
const RED = '#c92a2a';
const WHITE = '#fff';

/** A stop-sign octagon: a dark hairline outside a white border, a red field and a thin white inner line. */
function stopOctagon(cx: number, cy: number, r: number, field: string): PictoShape[] {
  return [
    { d: octagon(cx, cy, r), fill: WHITE, stroke: INK, sw: 1 },
    { d: octagon(cx, cy, r * 0.88), fill: field },
    { d: octagon(cx, cy, r * 0.76), stroke: WHITE, sw: Math.max(0.7, r * 0.07) },
  ];
}

function trafficLight(cx: number, w: number, lampR: number): PictoShape[] {
  const x = cx - w / 2, top = -14.5, hh = 29;
  const lamp = (y: number, c: string): PictoShape => ({ d: circle(cx, y, lampR), fill: c });
  return [
    { d: rect(x, top, w, hh, 3.5), fill: WHITE, stroke: WHITE, sw: 3 },
    { d: rect(x, top, w, hh, 3.5), fill: '#2b2b2b', stroke: INK, sw: 0.8 },
    lamp(-8.3, '#e03131'), lamp(0, '#fcc419'), lamp(8.3, '#40c057'),
  ];
}

function circulatingArrows(R: number): PictoShape[] {
  const out: PictoShape[] = [];
  const span = 66;
  for (const start of [-90, 30, 150]) {
    const a0 = (Math.PI / 180) * start, a1 = (Math.PI / 180) * (start - span);
    const sx = R * Math.cos(a0), sy = R * Math.sin(a0), ex = R * Math.cos(a1), ey = R * Math.sin(a1);
    // Counterclockwise on the page, the way US traffic circles run.
    out.push({ d: `M${r1(sx)} ${r1(sy)}A${R} ${R} 0 0 0 ${r1(ex)} ${r1(ey)}`, stroke: WHITE, sw: 2.7, cap: 'butt' });
    const tx = Math.sin(a1), ty = -Math.cos(a1), nx = Math.cos(a1), ny = Math.sin(a1);
    out.push({ d: polygon([[ex + tx * 4.4, ey + ty * 4.4], [ex + nx * 3.6, ey + ny * 3.6], [ex - nx * 3.6, ey - ny * 3.6]]), fill: WHITE });
  }
  return out;
}

/** The geometry of one picture, `h` CSS px tall: words appear only where they can be read. */
export function pictoGeometry(id: PictoId, h: number): PictoGeometry {
  const words = h >= PICTO_WORDS_MIN_H;
  switch (id) {
    case 'stop':
      return { shapes: stopOctagon(0, 0, 15, RED), texts: words ? [{ text: 'STOP', x: 0, y: 0.5, size: 6.4, fill: WHITE }] : [] };
    case 'all_way_stop':
      return {
        shapes: [
          ...stopOctagon(0, -4.2, 12.4, RED),
          { d: rect(-10, 9.4, 20, 7.2, 1.6), fill: WHITE, stroke: INK, sw: 1 },
        ],
        texts: [{ text: 'ALL', x: 0, y: 13.1, size: 5.6, fill: INK }],
      };
    case 'uncontrolled':
      return {
        shapes: [
          ...stopOctagon(0, 0, 15, '#868e96'),
          { d: 'M-9.5 9.5L9.5 -9.5', stroke: INK, sw: 5, cap: 'round' },
          { d: 'M-9.5 9.5L9.5 -9.5', stroke: WHITE, sw: 2.6, cap: 'round' },
        ],
        texts: [],
      };
    case 'signal':
      return { shapes: trafficLight(0, 17, 4.3), texts: [] };
    case 'signal_timing':
      return {
        shapes: [
          ...trafficLight(-6, 14, 3.5),
          { d: circle(7.5, 6.5, 8.4), fill: WHITE, stroke: INK, sw: 1.6 },
          { d: 'M7.5 1.2V6.5L11.4 9', stroke: INK, sw: 1.8, cap: 'round' },
        ],
        texts: [],
      };
    case 'speed_hump':
      return {
        shapes: [
          { d: polygon([[0, -15.5], [15.5, 0], [0, 15.5], [-15.5, 0]]), fill: '#fcc419', stroke: INK, sw: 1.6 },
          { d: 'M-8.5 5.5C-6 -4 6 -4 8.5 5.5Z', fill: INK },
          { d: 'M-11 5.5H11', stroke: INK, sw: 2, cap: 'butt' },
        ],
        texts: [],
      };
    case 'traffic_circle':
      return {
        shapes: [
          { d: circle(0, 0, 15), fill: WHITE, stroke: INK, sw: 1 },
          { d: circle(0, 0, 13.4), fill: '#1c7ed6' },
          ...circulatingArrows(7.3),
        ],
        texts: [],
      };
    case 'one_way':
      return {
        shapes: [
          { d: rect(-15, -9.5, 30, 19, 2.5), fill: INK, stroke: WHITE, sw: 1.6 },
          { d: rect(-15, -9.5, 30, 19, 2.5), fill: INK, stroke: INK, sw: 0.8 },
          { d: 'M-10.5 -2.6H2.4V-7L11 0L2.4 7V2.6H-10.5Z', fill: WHITE },
        ],
        texts: [],
      };
    case 'turn_ban_left': case 'turn_ban_right': case 'turn_ban': {
      const m = id === 'turn_ban_right' ? -1 : 1, x = (v: number) => r1(m * v);
      const arrow: PictoShape[] = id === 'turn_ban'
        ? [{ d: 'M4 9.5V-0.5A4 4 0 0 0 -4 -0.5V1', stroke: INK, sw: 3.2, cap: 'butt' }, { d: polygon([[-8.6, 0.6], [0.6, 0.6], [-4, 6.8]]), fill: INK }]
        : [{ d: `M${x(3.5)} 9.5V1.5Q${x(3.5)} -3.6 ${x(-1.5)} -3.6H${x(-4)}`, stroke: INK, sw: 3.4, cap: 'butt' }, { d: polygon([[m * -3, -9.4], [m * -10.4, -3.6], [m * -3, 2.2]]), fill: INK }];
      return {
        shapes: [
          { d: circle(0, 0, 15), fill: WHITE, stroke: INK, sw: 1 },
          ...arrow,
          { d: circle(0, 0, 12.3), stroke: RED, sw: 2.8 },
          { d: 'M-8.7 -8.7L8.7 8.7', stroke: RED, sw: 2.8, cap: 'butt' },
        ],
        texts: [],
      };
    }
    case 'turn_ban_both':
      return {
        shapes: [
          { d: circle(0, 0, 15), fill: WHITE, stroke: INK, sw: 1 },
          { d: 'M0 9.5V-3.6M-5 -3.6H5', stroke: INK, sw: 3.2, cap: 'butt' },
          { d: polygon([[-3.4, -9.4], [-10.8, -3.6], [-3.4, 2.2]]), fill: INK },
          { d: polygon([[3.4, -9.4], [10.8, -3.6], [3.4, 2.2]]), fill: INK },
          { d: circle(0, 0, 12.3), stroke: RED, sw: 2.8 },
          { d: 'M-8.7 -8.7L8.7 8.7', stroke: RED, sw: 2.8, cap: 'butt' },
        ],
        texts: [],
      };
    case 'modal_filter':
      return {
        shapes: [
          { d: rect(-15, -5.5, 30, 11), fill: WHITE },
          { d: rect(-15, -4.1, 30, 8.2), fill: INK },
          { d: 'M-15 0H15', stroke: '#ffd43b', sw: 4.2, dash: [6, 6], cap: 'butt' },
        ],
        texts: [],
      };
    case 'diagonal_diverter':
      return {
        shapes: [
          { d: 'M-10.6 10.6L10.6 -10.6', stroke: WHITE, sw: 9, cap: 'butt' },
          { d: 'M-10.6 10.6L10.6 -10.6', stroke: INK, sw: 6.6, cap: 'butt' },
          { d: 'M-10.6 10.6L10.6 -10.6', stroke: '#ffd43b', sw: 3.4, dash: [4.5, 2.5], cap: 'butt' },
        ],
        texts: [],
      };
  }
}

/** Which picture marks an intervention, or null where another drawing does (a speed-limit sign). */
export function pictoOf(iv: { type: Intervention['type']; control?: ControlType; turn?: TurnKind | null }): PictoId | null {
  switch (iv.type) {
    case 'speed_limit': case 'slow_street': return null;
    case 'control':
      switch (iv.control) {
        case 'signal': return 'signal';
        case 'all_way_stop': return 'all_way_stop';
        case 'uncontrolled': return 'uncontrolled';
        case 'traffic_circle': return 'traffic_circle';
        default: return 'stop';
      }
    case 'turn_ban': return iv.turn === 'left' ? 'turn_ban_left' : iv.turn === 'right' ? 'turn_ban_right' : 'turn_ban';
    default: return iv.type;
  }
}

/** What `pictoOf` and the legend need to know about an intervention: its type, a control's value and a turn ban's side, read from the geometry of the two links (a U-turn or straight-on ban has no side). */
export const symbolOf = (iv: Intervention, net: Network): { type: Intervention['type']; control?: ControlType; turn?: TurnKind | null } => ({
  type: iv.type,
  control: iv.type === 'control' ? iv.control : undefined,
  turn: iv.type === 'turn_ban' ? turnKindOf(net, iv.fromLink, iv.toLink) : undefined,
});

/** Degrees clockwise on the page for a street heading (radians counterclockwise from east, as the network stores it), so the one-way arrow points the way cars may go. */
export const rotationOfHeading = (heading: number): number => Math.round(((-heading * 180) / Math.PI) * 10) / 10 + 0;

const n2 = (v: number) => (Math.round(v * 100) / 100).toString();
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The picture as an SVG group centered on (0, 0), `h` tall in the units of the surrounding drawing, turned `rotate` degrees clockwise. */
export function pictoSvg(id: PictoId, h: number, opts: { title?: string; rotate?: number } = {}): string {
  const G = pictoGeometry(id, h), k = h / PICTO_BOX;
  const attrs = (s: PictoShape) => `d="${s.d}" fill="${s.fill ?? 'none'}"`
    + (s.stroke ? ` stroke="${s.stroke}" stroke-width="${n2(s.sw ?? 1)}" stroke-linejoin="round" stroke-linecap="${s.cap ?? 'round'}"` : '')
    + (s.dash ? ` stroke-dasharray="${s.dash.join(' ')}"` : '');
  const rot = opts.rotate ? `rotate(${n2(opts.rotate)}) ` : '';
  return `<g class="picto picto-${id}" transform="${rot}scale(${n2(k)})">`
    + (opts.title ? `<title>${esc(opts.title)}</title>` : '')
    + G.shapes.map((s) => `<path ${attrs(s)}/>`).join('')
    + G.texts.map((t) => `<text x="${n2(t.x)}" y="${n2(t.y)}" text-anchor="middle" dominant-baseline="central" font-family="${FONT}" font-size="${n2(t.size)}" font-weight="700" fill="${t.fill}">${esc(t.text)}</text>`).join('')
    + '</g>';
}

/** A standalone <svg> of the picture for DOM use; it may overflow its box a little when turned. */
export function pictoElement(id: PictoId, h: number, opts: { rotate?: number } = {}): string {
  const pad = 2, s = h + 2 * pad;
  return `<svg width="${n2(s)}" height="${n2(s)}" viewBox="${n2(-s / 2)} ${n2(-s / 2)} ${n2(s)} ${n2(s)}" focusable="false" aria-hidden="true" overflow="visible">${pictoSvg(id, h, opts)}</svg>`;
}

/** The same picture on a canvas, for the exported map image and its key. */
export function drawPicto(g: CanvasRenderingContext2D, cx: number, cy: number, id: PictoId, h: number, rotate = 0) {
  const G = pictoGeometry(id, h);
  g.save();
  g.translate(cx, cy);
  if (rotate) g.rotate((rotate * Math.PI) / 180);
  g.scale(h / PICTO_BOX, h / PICTO_BOX);
  g.lineJoin = 'round';
  for (const s of G.shapes) {
    const p = new Path2D(s.d);
    if (s.fill) { g.fillStyle = s.fill; g.fill(p); }
    if (s.stroke) { g.setLineDash(s.dash ?? []); g.lineWidth = s.sw ?? 1; g.lineCap = s.cap ?? 'round'; g.strokeStyle = s.stroke; g.stroke(p); }
  }
  g.setLineDash([]);
  g.textAlign = 'center'; g.textBaseline = 'middle';
  for (const t of G.texts) { g.font = `700 ${t.size}px ${FONT}`; g.fillStyle = t.fill; g.fillText(t.text, t.x, t.y); }
  g.restore();
}
