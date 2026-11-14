import type { Network } from '../types';
import { legDirections, nodeLegs } from './diverter';
import { UNNAMED, type NetIndex } from './naming';

/** A leg whose street mouth lies farther than this from the node point joins the node through a merged (offset) junction (m). */
export const MERGED_OFFSET_M = 3;
/** Closest a leg mark sits to the filter badge on screen, and the step it moves out from the mouth (CSS px). */
export const MARK_MIN_PX = 36;
export const MARK_STEP_PX = 6;

export interface FilterLeg {
  /** Street name; an unnamed road is described by what it is off. */
  street: string;
  /** Compass word of the way the leg leaves the junction. */
  direction: string;
  /** "Ayala Avenue (north)". */
  text: string;
  /** Degrees clockwise from north, in [0, 360). */
  bearing: number;
  /** Where the street begins, local meters (on the node itself, or a few meters along the other street at a merged junction). */
  mouth: [number, number];
  /** Distance from the node point to the mouth (m). */
  offsetM: number;
}

export interface FilterLegs {
  legs: FilterLeg[];
  /** Named streets that meet here, in the order they are listed. */
  streets: string[];
  /** Several junctions are modeled as one: offset legs, more than four legs, or more than two streets. */
  merged: boolean;
  /** Farthest apart two mouths are, rounded to 5 m; 0 when every leg starts at the node. */
  spreadM: number;
}

const round5 = (v: number) => Math.round(v / 5) * 5;

/** The legs a node filter closes to through cars, with where each one starts. */
export function filterLegs(net: Network, idx: NetIndex, node: number): FilterLegs {
  const n = net.nodes[node];
  const raw = nodeLegs(net, idx, node);
  const dirs = legDirections(raw);
  const base = raw.map((l, i) => {
    const out = l.outs[0] !== undefined;
    const link = net.links[out ? l.outs[0] : l.ins[0]];
    const g = link.geometry;
    const mouth = (out ? g[0] : g[g.length - 1]) as [number, number];
    const street = l.street === UNNAMED ? idx.linkName[link.id] : l.street;
    return { street, direction: dirs[i], bearing: l.bearing, mouth, offsetM: Math.hypot(mouth[0] - n.x, mouth[1] - n.y) };
  });
  base.sort((p, q) => p.street.localeCompare(q.street) || ((p.bearing + 45) % 360) - ((q.bearing + 45) % 360));
  const seen = new Map<string, number>();
  base.forEach((l) => seen.set(`${l.street}|${l.direction}`, (seen.get(`${l.street}|${l.direction}`) ?? 0) + 1));
  const used = new Map<string, number>();
  const legs: FilterLeg[] = base.map((l) => {
    const k = `${l.street}|${l.direction}`;
    const total = seen.get(k) ?? 1;
    const nth = (used.get(k) ?? 0) + 1;
    used.set(k, nth);
    return { ...l, text: `${l.street} (${l.direction}${total > 1 ? `, ${nth} of ${total}` : ''})` };
  });
  const streets = [...new Set(base.map((l) => l.street).filter((s) => !s.startsWith('Unnamed ')))];
  let spread = 0;
  for (const a of legs) for (const b of legs) spread = Math.max(spread, Math.hypot(a.mouth[0] - b.mouth[0], a.mouth[1] - b.mouth[1]));
  const offset = legs.some((l) => l.offsetM > MERGED_OFFSET_M);
  return { legs, streets, merged: offset || legs.length > 4 || streets.length > 2, spreadM: offset ? Math.max(5, round5(spread)) : 0 };
}

export interface FilterText {
  /** "Cars cannot pass through this intersection." */
  lead: string;
  /** "Closed to through cars: Ayala Avenue (north), ..." */
  closed: string;
  /** Present for a merged junction: what it combines and that the filter covers all of it. */
  junction: string | null;
  /** Said once: walking and cycling are unaffected. */
  people: string;
}

const list = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

/** Plain-words account of what a modal filter closes; null for any other intervention. */
export function filterText(
  iv: { type: string; node?: number; link?: number },
  net: Network, idx: NetIndex,
): FilterText | null {
  if (iv.type !== 'modal_filter') return null;
  const people = 'People walking and cycling still pass.';
  if (iv.node === undefined) {
    const blk = iv.link === undefined ? undefined : idx.blocks[idx.blockOfLink[iv.link]];
    const both = blk && blk.links.length > 1 ? ', in both directions' : '';
    return { lead: 'Cars cannot drive along this block.', closed: `Closed to through cars: ${blk?.label ?? 'this block'}${both}.`, junction: null, people };
  }
  const f = filterLegs(net, idx, iv.node);
  const n = f.legs.length;
  const near = f.spreadM > 0 ? `, which meet up to about ${f.spreadM} m apart` : '';
  const junction = f.merged
    ? `This junction combines ${list(f.streets)}${near}. The filter covers the whole junction and closes ${n === 2 ? 'both legs' : `all ${n} legs`} to through cars.`
    : null;
  return { lead: 'Cars cannot pass through this intersection.', closed: `Closed to through cars: ${f.legs.map((l) => l.text).join(', ')}.`, junction, people };
}

export const filterSentence = (t: FilterText): string => [t.lead, t.closed, t.junction, t.people].filter(Boolean).join(' ');

/** Where a leg mark sits, in CSS px from the node's screen position: at the mouth, pushed out along the leg so it clears the badge. */
export function markOffset(mouthPx: [number, number], dir: [number, number], minPx = MARK_MIN_PX, stepPx = MARK_STEP_PX): [number, number] {
  const gap = Math.max(stepPx, minPx - Math.hypot(mouthPx[0], mouthPx[1]));
  return [mouthPx[0] + dir[0] * gap, mouthPx[1] + dir[1] * gap];
}

/** Unit screen vector (x right, y down) of a compass bearing. */
export const bearingVector = (bearing: number): [number, number] => {
  const r = (bearing * Math.PI) / 180;
  return [Math.sin(r), -Math.cos(r)];
};
