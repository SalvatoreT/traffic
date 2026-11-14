import type { Network } from '../types';
import { WIDTH_MAX, WIDTH_MIN } from './ramps';
import { pointAlong } from './geom';
import { legDirections, nodeLegs } from './diverter';
import { UNNAMED, type NetIndex } from './naming';

/** A leg whose street mouth lies farther than this from the node point joins the node through a merged (offset) junction (m). */
export const MERGED_OFFSET_M = 3;
/** Bar length and thickness as multiples of the drawn base road casing width at the same zoom (design choice, not calibrated). */
export const BAR_LEN_X = 2.2;
export const BAR_THICK_X = 0.6;
/** Flow-line width the bar is sized against: halfway between the thinnest and thickest drawn street. */
export const BAR_REF_W = (WIDTH_MIN + WIDTH_MAX) / 2;
/** How far past the mouth of a closed leg its bar sits, along the street (m). */
export const BAR_AT_M = 8;

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
  /** The street leaving the mouth, local meters, mouth first. */
  path: [number, number][];
  /** Every link on this leg, entering and leaving (what a modal filter's `legs` holds). */
  links: number[];
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
    return { street, direction: dirs[i], bearing: l.bearing, mouth, offsetM: Math.hypot(mouth[0] - n.x, mouth[1] - n.y), path: (out ? g : [...g].reverse()) as [number, number][], links: [...l.ins, ...l.outs] };
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

/** The legs a filter closes: all of them, or those carrying a link in `legs`. */
export function closedLegs(f: FilterLegs, legs?: number[]): FilterLeg[] {
  return legs === undefined ? f.legs : f.legs.filter((l) => l.links.some((k) => legs.includes(k)));
}

export interface StreetFilter {
  street: string;
  legs: FilterLeg[];
  /** Link ids for the intervention's `legs`. */
  links: number[];
}

/** One option per street whose legs can be closed while at least two other legs stay connected; empty when the filter would be the whole junction anyway. */
export function streetFilters(f: FilterLegs): StreetFilter[] {
  const by = new Map<string, FilterLeg[]>();
  for (const l of f.legs) by.set(l.street, [...(by.get(l.street) ?? []), l]);
  if (by.size < 2) return [];
  return [...by].filter(([, ls]) => f.legs.length - ls.length >= 2).map(([street, legs]) => ({ street, legs, links: legs.flatMap((l) => l.links) }));
}

/** "Martin Street" when the closed legs are all the legs of their streets, else the legs by name. */
export function closedLegsLabel(f: FilterLegs, shut: FilterLeg[]): string {
  const whole = [...new Set(shut.map((l) => l.street))].every((st) => f.legs.filter((l) => l.street === st).every((l) => shut.includes(l)));
  return list(whole ? [...new Set(shut.map((l) => l.street))] : shut.map((l) => l.text));
}

export interface FilterChoices {
  /** Whole-junction filter is on offer (none placed yet). */
  whole: boolean;
  /** Per-street filters on offer, leaving at least two other legs connected. */
  streets: (StreetFilter & { label: string; closed: string })[];
  merged: boolean;
  /** Why per-street filters are suggested first at a consolidated junction. */
  why: string | null;
  /** Closed-leg preview of the whole-junction filter. */
  wholeClosed: string;
}

/** The modal filters the app offers at an intersection, given what is already placed there. */
export function filterChoices(net: Network, idx: NetIndex, node: number, ivs: { type: string; node?: number; legs?: number[] }[]): FilterChoices {
  const f = filterLegs(net, idx, node);
  const here = ivs.filter((iv) => iv.type === 'modal_filter' && iv.node === node);
  const hasWhole = here.some((iv) => iv.legs === undefined);
  const placed = new Set(here.filter((iv) => iv.legs).map((iv) => [...iv.legs!].sort((a, b) => a - b).join('.')));
  const streets = hasWhole ? [] : streetFilters(f)
    .filter((o) => !placed.has([...o.links].sort((a, b) => a - b).join('.')))
    .map((o) => {
      const t = filterText({ type: 'modal_filter', node, legs: o.links }, net, idx);
      return { ...o, links: [...o.links].sort((a, b) => a - b), label: `Filter ${o.street} here`, closed: t?.closed ?? '' };
    });
  const all = streetFilters(f).length > 0;
  const near = f.spreadM > 0 ? `, which meet up to about ${f.spreadM} m apart` : '';
  const why = f.merged && all
    ? `This junction combines ${list(f.streets)}${near}. A filter on one street closes only that street's legs; the others stay connected.`
    : null;
  return { whole: !hasWhole, streets, merged: f.merged, why, wholeClosed: filterText({ type: 'modal_filter', node }, net, idx)?.closed ?? '' };
}

export interface FilterText {
  /** "Cars cannot pass through this intersection." */
  lead: string;
  /** "Closed to through cars: Ayala Avenue (north), ..." */
  closed: string;
  /** Present for a merged junction: what it combines and which part the filter covers. */
  junction: string | null;
  /** Said once: walking and cycling are unaffected. */
  people: string;
}

const list = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

/** Plain-words account of what a modal filter closes; null for any other intervention. */
export function filterText(
  iv: { type: string; node?: number; link?: number; legs?: number[] },
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
  const shut = closedLegs(f, iv.legs);
  const partial = shut.length < f.legs.length;
  const n = shut.length;
  const near = f.spreadM > 0 ? `, which meet up to about ${f.spreadM} m apart` : '';
  const shutStreets = [...new Set(shut.map((l) => l.street))];
  const open = f.streets.filter((s) => !shutStreets.includes(s));
  let junction: string | null = null;
  if (f.merged) {
    junction = partial
      ? `This junction combines ${list(f.streets)}${near}. The filter closes only the legs of ${list(shutStreets)}${open.length ? `; ${list(open)} stays open through the junction` : ''}.`
      : `This junction combines ${list(f.streets)}${near}. The filter covers the whole junction and closes ${n === 2 ? 'both legs' : `all ${n} legs`} to through cars.`;
  }
  const lead = partial ? `Cars cannot enter or leave this intersection on ${list(shutStreets)}.` : 'Cars cannot pass through this intersection.';
  return { lead, closed: `Closed to through cars: ${shut.map((l) => l.text).join(', ')}.`, junction, people };
}

export const filterSentence = (t: FilterText): string => [t.lead, t.closed, t.junction, t.people].filter(Boolean).join(' ');

export interface Bar {
  /** Where the bar crosses the street, local meters. */
  center: [number, number];
  /** Bearing of the street at the bar, degrees clockwise from north; the bar is at a right angle to it. */
  bearing: number;
}

/** A bar across `path` at distance `s` along it. */
export function barAcross(path: [number, number][], s: number): Bar {
  const p = pointAlong(path, Math.max(0, s));
  return { center: [p.x, p.y], bearing: ((90 - (p.heading * 180) / Math.PI) % 360 + 360) % 360 };
}

/** Intervention badge size (CSS px): small at the fitted overview, full size from `BADGE_FULL_ZOOM` (design choice, not calibrated). */
export const BADGE_MIN_PX = 16;
export const BADGE_MAX_PX = 26;
export const BADGE_SMALL_ZOOM = 14;
export const BADGE_FULL_ZOOM = 16.5;
/** Smallest pointer target (CSS px), WCAG 2.2 SC 2.5.8: a small badge gets a transparent hit area of this size. */
export const HIT_PX = 24;
/** Clear space (CSS px) between a badge and the bar it sits beside. */
export const BAR_CLEAR_PX = 2;

export function badgePx(zoom: number): number {
  const t = Math.max(0, Math.min(1, (zoom - BADGE_SMALL_ZOOM) / (BADGE_FULL_ZOOM - BADGE_SMALL_ZOOM)));
  return BADGE_MIN_PX + t * (BADGE_MAX_PX - BADGE_MIN_PX);
}

/** Badge label size and border width (CSS px) for a badge of `size`. */
export function badgeFont(size: number): { font: number; border: number } {
  const t = (size - BADGE_MIN_PX) / (BADGE_MAX_PX - BADGE_MIN_PX);
  return { font: 8.5 + 2.5 * t, border: size < 22 ? 1.5 : 2 };
}

/** The badge of a block filter sits this far (CSS px) along the street from its bar, so the badge does not cover the bar. */
export const blockBadgeGap = (zoom: number): number => (24 * badgePx(zoom)) / BADGE_MAX_PX;
/** Screen offset (x right, y down) of a block filter's badge from its bar, for a street of the given bearing. */
export function blockBadgeOffset(bearing: number, zoom: number = BADGE_FULL_ZOOM): [number, number] {
  const g = blockBadgeGap(zoom);
  return [Math.sin((bearing * Math.PI) / 180) * g, -Math.cos((bearing * Math.PI) / 180) * g];
}

/** Drawn base road casing width (CSS px) at `zoom`: the same stops as the map's casing layer, held flat outside 14 to 18. */
export function casingPx(zoom: number, w = BAR_REF_W): number {
  const t = Math.max(0, Math.min(1, (zoom - 14) / 4));
  return (1.2 + 0.55 * w) + t * ((1.8 + 1.5 * w) - (1.2 + 0.55 * w));
}

/** Bar length and thickness (CSS px) at `zoom`: they follow the drawn road. */
export function barPx(zoom: number): { length: number; thick: number } {
  const c = casingPx(zoom);
  return { length: BAR_LEN_X * c, thick: BAR_THICK_X * c };
}

/** Distance along a leg (m) to its bar at `zoom`: `BAR_AT_M`, or farther when the badge at the junction would cover it. */
export function barAtM(zoom: number, metersPerPx: number): number {
  const clear = badgePx(zoom) / 2 + barPx(zoom).thick / 2 + BAR_CLEAR_PX;
  return Math.max(BAR_AT_M, clear * metersPerPx);
}

/** One bar per closed leg, `atM` along the street from that leg's own mouth. */
export function legBars(f: FilterLegs, legs?: number[], atM: number = BAR_AT_M): Bar[] {
  return closedLegs(f, legs).map((l) => barAcross(l.path, atM));
}

/** The bar of a block filter: across the link at `position` along it, else at its midpoint. */
export function blockBar(link: { geometry: [number, number][]; length: number }, position?: number): Bar {
  return barAcross(link.geometry, position ?? link.length / 2);
}
