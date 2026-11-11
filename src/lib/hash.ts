import type { Intervention, ControlType } from '../types';

export interface HashState {
  area?: string;
  period?: string;
  demandScale?: number;
  interventions: Intervention[];
}
export interface Limits { nodes: number; links: number }

const CONTROLS: ControlType[] = ['signal', 'all_way_stop', 'two_way_stop', 'uncontrolled', 'traffic_circle'];

function b64urlEncode(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64urlDecode(s: string): string {
  const p = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4);
  const bin = atob(p);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeHash(st: HashState): string {
  const p = new URLSearchParams();
  if (st.area) p.set('a', st.area);
  if (st.period) p.set('p', st.period);
  if (st.demandScale !== undefined && st.demandScale !== 1) p.set('d', String(st.demandScale));
  if (st.interventions.length) p.set('i', b64urlEncode(JSON.stringify(st.interventions)));
  const s = p.toString();
  return s ? `#${s}` : '';
}

const isInt = (v: unknown, max: number): v is number => typeof v === 'number' && Number.isInteger(v) && v >= 0 && v < max;
const isNum = (v: unknown, lo: number, hi: number): v is number => typeof v === 'number' && Number.isFinite(v) && v >= lo && v <= hi;

/** Validate untrusted input; returns null for an invalid entry. */
export function validateIntervention(x: unknown, lim: Limits): Intervention | null {
  if (!x || typeof x !== 'object') return null;
  const o = x as Record<string, unknown>;
  switch (o.type) {
    case 'modal_filter':
      if (isInt(o.link, lim.links)) return { type: 'modal_filter', link: o.link };
      if (isInt(o.node, lim.nodes)) return { type: 'modal_filter', node: o.node };
      return null;
    case 'speed_limit':
      return isInt(o.link, lim.links) && isNum(o.speed, 1, 40) ? { type: 'speed_limit', link: o.link, speed: o.speed } : null;
    case 'speed_hump':
      return isInt(o.link, lim.links) && isNum(o.position, 0, 1e5) ? { type: 'speed_hump', link: o.link, position: o.position } : null;
    case 'traffic_circle':
      return isInt(o.node, lim.nodes) ? { type: 'traffic_circle', node: o.node } : null;
    case 'control':
      return isInt(o.node, lim.nodes) && CONTROLS.includes(o.control as ControlType)
        ? { type: 'control', node: o.node, control: o.control as ControlType } : null;
    case 'signal_timing':
      return isInt(o.node, lim.nodes) && isNum(o.cycle, 20, 240) ? { type: 'signal_timing', node: o.node, cycle: o.cycle } : null;
    case 'one_way':
      return isInt(o.link, lim.links) ? { type: 'one_way', link: o.link } : null;
    case 'turn_ban':
      return isInt(o.fromLink, lim.links) && isInt(o.toLink, lim.links) ? { type: 'turn_ban', fromLink: o.fromLink, toLink: o.toLink } : null;
    default:
      return null;
  }
}

export function decodeHash(hash: string, lim: Limits): HashState {
  const out: HashState = { interventions: [] };
  try {
    const p = new URLSearchParams(hash.replace(/^#/, ''));
    const a = p.get('a'); if (a && /^[\w.-]{1,64}$/.test(a)) out.area = a;
    const per = p.get('p'); if (per && /^[\w.-]{1,64}$/.test(per)) out.period = per;
    const d = Number(p.get('d')); if (p.has('d') && isNum(d, 0.1, 3)) out.demandScale = d;
    const i = p.get('i');
    if (i) {
      const arr = JSON.parse(b64urlDecode(i));
      if (Array.isArray(arr)) {
        for (const x of arr.slice(0, 200)) {
          const v = validateIntervention(x, lim);
          if (v) out.interventions.push(v);
        }
      }
    }
  } catch {
    /* malformed hash: ignore */
  }
  return out;
}
