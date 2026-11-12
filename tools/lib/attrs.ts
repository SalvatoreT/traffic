import type { LinkClass } from './types';

type Tags = Record<string, string>;

const LANE_VALUES = new Set(['lane', 'track', 'opposite_lane', 'opposite_track']);
const SHARED_VALUES = new Set(['shared_lane', 'share_busway', 'shared_busway']);
const NO = new Set(['no', 'none']);
const MARKED = new Set(['marked', 'zebra', 'uncontrolled', 'traffic_signals']);

interface Side {
  lane: boolean;
  /** Lane runs against the way's travel direction on this side. */
  contra: boolean;
}

/** Most specific tag for one side of the way: `cycleway:left|right`, then `cycleway:both`, then `cycleway`. */
function side(t: Tags, s: 'left' | 'right'): Side | null {
  for (const prefix of [`cycleway:${s}`, 'cycleway:both', 'cycleway']) {
    const v = t[prefix];
    const sub = t[`${prefix}:lane`];
    if (v === undefined && sub === undefined) continue;
    const lane = v !== undefined ? LANE_VALUES.has(v) : true;
    return { lane, contra: v?.startsWith('opposite') === true || t[`${prefix}:oneway`] === '-1' };
  }
  return null;
}

export interface BikeTags {
  laneF: boolean;
  laneB: boolean;
  route: boolean;
}

/**
 * Bike lane per direction and signed-route flag from OSM tags.
 * Lanes: cycleway, cycleway:left/right/both and their `:lane` subtags with lane/track values. A lane on the right
 * of the way serves forward travel, on the left backward travel (right-hand traffic); on one-way streets any side
 * serves the one direction unless tagged opposite. Separately mapped cycleways (`separate`) are not links here.
 */
export function bikeTags(t: Tags, fwd: boolean, bwd: boolean): BikeTags {
  const oneway = !(fwd && bwd);
  const laneOn = (which: 'left' | 'right') => {
    const sd = side(t, which);
    return { here: !!sd?.lane, contra: !!sd?.contra };
  };
  let laneF = false;
  let laneB = false;
  const right = laneOn('right');
  const left = laneOn('left');
  if (oneway) {
    if ((right.here && !right.contra) || (left.here && !left.contra)) fwd ? (laneF = true) : (laneB = true);
  } else {
    if (right.here) right.contra ? (laneB = true) : (laneF = true);
    if (left.here) left.contra ? (laneF = true) : (laneB = true);
  }
  if (!fwd) laneF = false;
  if (!bwd) laneB = false;

  const shared = ['cycleway', 'cycleway:left', 'cycleway:right', 'cycleway:both'].some((k) => SHARED_VALUES.has(t[k]));
  const route =
    shared ||
    t.bicycle === 'designated' ||
    t.bicycle_road === 'yes' ||
    t.cyclestreet === 'yes' ||
    ['lcn', 'rcn', 'ncn'].some((k) => t[k] === 'yes') ||
    !!t.lcn_ref ||
    !!t.cycle_network;
  return { laneF, laneB, route };
}

/** Walkable alongside: true except motorway, and false when tagged no (sidewalk or foot). */
export function hasSidewalk(t: Tags, cls: LinkClass): boolean {
  if (cls === 'motorway') return false;
  if (NO.has(t.sidewalk) || NO.has(t['sidewalk:both']) || t.foot === 'no') return false;
  if (NO.has(t['sidewalk:left']) && NO.has(t['sidewalk:right'])) return false;
  return true;
}

export function isMarkedCrossing(t: Tags): boolean {
  if (t.highway !== 'crossing') return false;
  const m = t['crossing:markings'];
  if (m !== undefined) return !NO.has(m);
  return (t.crossing ?? '').split(';').some((c) => MARKED.has(c.trim()));
}
