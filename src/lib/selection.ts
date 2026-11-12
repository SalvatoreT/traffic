import type { ControlType, Intervention, Network, NetLink } from '../types';
import { MPS_TO_MPH } from './format';
import { legBearing, nearestOnPolyline, pickLink, pointAlong } from './geom';
import { linkStreet, type NetIndex } from './naming';
import { diverterOptions, pairingKey, type DiverterOption } from './diverter';

/** Where a selection came from. Search results open the menu inline in the Scenario panel; the rest use a pop-up or the sheet. */
export type SelectVia = 'map' | 'search' | 'list';
export type Selection =
  | { kind: 'block'; block: number; /** Local meters of the click, when chosen on the map. */ point: [number, number] | null; /** Directed link nearer the click. */ nearLink: number | null; via: SelectVia }
  | { kind: 'node'; node: number; via: SelectVia };

// Offered values are UI choices, not published recommendations (assumption: common US residential limits and signal cycles).
export const SPEED_LIMITS_MPH = [15, 20, 25];
export const SIGNAL_CYCLES_S = [60, 90, 120];
export const mphToMps = (mph: number) => mph / MPS_TO_MPH;
export const mpsToMph = (mps: number) => Math.round(mps * MPS_TO_MPH);

export const CONTROL_CHOICES: { value: ControlType; label: string }[] = [
  { value: 'all_way_stop', label: 'All-way stop' },
  { value: 'two_way_stop', label: 'Two-way stop' },
  { value: 'signal', label: 'Traffic signal' },
  { value: 'uncontrolled', label: 'Uncontrolled' },
];
export const controlLabel = (c: ControlType): string =>
  CONTROL_CHOICES.find((x) => x.value === c)?.label ?? (c === 'traffic_circle' ? 'Traffic circle' : c);

// ---- hit testing

export type Hit = { kind: 'node'; node: number } | { kind: 'link'; link: number };
export interface HitOptions {
  /** Pick radii in meters (pixel radius times meters per pixel). */
  nodeTolM: number; linkTolM: number;
  /** Nodes that count as intersections; all nodes when absent. */
  nodeIds?: ReadonlySet<number>;
}

/** What a click at a local point hits. An intersection in range beats any street in range. */
export function hitTest(net: Network, x: number, y: number, o: HitOptions): Hit | null {
  let node: number | null = null;
  let best = o.nodeTolM;
  for (const n of net.nodes) {
    if (o.nodeIds && !o.nodeIds.has(n.id)) continue;
    const d = Math.hypot(n.x - x, n.y - y);
    if (d <= best) { best = d; node = n.id; }
  }
  if (node !== null) return { kind: 'node', node };
  const l = pickLink(net, x, y, o.linkTolM);
  return l ? { kind: 'link', link: l.id } : null;
}

// ---- labels

export type Compass = 'North' | 'East' | 'South' | 'West';
/** Cardinal direction of a vector in local meters (x east, y north). */
export function compassOf(dx: number, dy: number): Compass {
  const deg = ((Math.atan2(dx, dy) * 180) / Math.PI + 360) % 360; // 0 = north, clockwise
  if (deg >= 315 || deg < 45) return 'North';
  if (deg < 135) return 'East';
  if (deg < 225) return 'South';
  return 'West';
}
export function linkCompass(l: NetLink, part: 'all' | 'start' | 'end' = 'all'): Compass {
  if (part === 'all') {
    const g = l.geometry;
    return compassOf(g[g.length - 1][0] - g[0][0], g[g.length - 1][1] - g[0][1]);
  }
  // How the street leaves / reaches its node, not the first / last segment (a merged staggered junction draws a connector there).
  const b = (legBearing(l, part === 'start') + (part === 'end' ? 180 : 0)) * Math.PI / 180;
  return compassOf(Math.sin(b), Math.cos(b));
}

/** The street(s) a link runs toward, e.g. "Alcatraz Avenue". */
export function towardName(net: Network, idx: NetIndex, linkId: number): string {
  const l = net.links[linkId];
  const others = idx.nodeStreets[l.to].filter((s) => s !== linkStreet(l));
  if (others.length === 0) return net.nodes[l.to].gate ? 'the study-area edge' : 'a dead end';
  return others.length <= 2 ? others.join(' / ') : `${others[0]} / ${others[1]} / +${others.length - 2}`;
}
export const oneWayLabel = (net: Network, idx: NetIndex, linkId: number) =>
  `${linkCompass(net.links[linkId])}bound only, toward ${towardName(net, idx, linkId)}`;

// ---- anchors and existing interventions

/** Hump position along the first link of a block: the clicked point projected on it, else mid-block. */
export function humpPosition(net: Network, idx: NetIndex, block: number, point: [number, number] | null): number {
  const l = net.links[idx.blocks[block].links[0]];
  if (!point) return l.length / 2;
  return Math.max(0, Math.min(l.length, nearestOnPolyline(l.geometry, point[0], point[1]).along));
}

/** Local meters for the selection: the click, the block midpoint or the intersection. */
export function selectionAnchor(net: Network, idx: NetIndex, s: Selection): [number, number] {
  if (s.kind === 'node') return [net.nodes[s.node].x, net.nodes[s.node].y];
  if (s.point) return s.point;
  const l = net.links[idx.blocks[s.block].links[0]];
  const p = pointAlong(l.geometry, l.length / 2);
  return [p.x, p.y];
}

/** The place an intervention belongs to, as a selection. */
export function selectionForIntervention(net: Network, idx: NetIndex, iv: Intervention, point: [number, number] | null, via: SelectVia): Selection | null {
  const block = (id: number) => (idx.blockOfLink[id] >= 0 ? idx.blockOfLink[id] : null);
  switch (iv.type) {
    case 'modal_filter': {
      if ('node' in iv) return { kind: 'node', node: iv.node, via };
      const b = block(iv.link); return b === null ? null : { kind: 'block', block: b, point, nearLink: iv.link, via };
    }
    case 'speed_limit': case 'speed_hump': case 'one_way': {
      const b = block(iv.link); return b === null ? null : { kind: 'block', block: b, point, nearLink: iv.link, via };
    }
    case 'turn_ban': { const l = net.links[iv.fromLink]; return l ? { kind: 'node', node: l.to, via } : null; }
    default: return { kind: 'node', node: iv.node, via };
  }
}

/** Indexes of the interventions that sit on the selected place. */
export function interventionsAt(net: Network, idx: NetIndex, s: Selection, ivs: Intervention[]): number[] {
  const out: number[] = [];
  ivs.forEach((iv, i) => {
    if (s.kind === 'block') {
      const links = idx.blocks[s.block].links;
      if (('link' in iv) && links.includes(iv.link)) out.push(i);
    } else if (iv.type === 'turn_ban') {
      if (net.links[iv.fromLink]?.to === s.node) out.push(i);
    } else if ('node' in iv && iv.node === s.node) out.push(i);
  });
  return out;
}

export function effectiveControl(net: Network, node: number, ivs: Intervention[]): ControlType {
  let c = net.nodes[node].control;
  for (const iv of ivs) {
    if (iv.type === 'control' && iv.node === node) c = iv.control;
    else if (iv.type === 'traffic_circle' && iv.node === node) c = 'traffic_circle';
  }
  return c;
}

// ---- which actions apply (design D2)

export interface BlockActions {
  modalFilter: boolean;
  /** 'move' when the block already has a hump somewhere else. */
  hump: 'add' | 'move' | null;
  speedLimit: { currentMph: number; choices: number[] };
  /** Direction choices, the one nearer the click first. */
  oneWay: { link: number; label: string; switching: boolean }[];
}

export function blockActions(net: Network, idx: NetIndex, s: Extract<Selection, { kind: 'block' }>, ivs: Intervention[]): BlockActions {
  const blk = idx.blocks[s.block];
  const here = (iv: Intervention) => 'link' in iv && blk.links.includes(iv.link);
  const hasFilter = ivs.some((iv) => iv.type === 'modal_filter' && here(iv));
  const pos = humpPosition(net, idx, s.block, s.point);
  const hump = ivs.find((iv): iv is Extract<Intervention, { type: 'speed_hump' }> => iv.type === 'speed_hump' && here(iv));
  const limitIv = ivs.find((iv): iv is Extract<Intervention, { type: 'speed_limit' }> => iv.type === 'speed_limit' && here(iv));
  const currentMph = mpsToMph(limitIv ? limitIv.speed : net.links[blk.links[0]].speedLimit);
  const kept = ivs.find((iv): iv is Extract<Intervention, { type: 'one_way' }> => iv.type === 'one_way' && here(iv));
  let oneWay: BlockActions['oneWay'] = [];
  if (blk.links.length === 2) {
    const order = s.nearLink !== null && blk.links.includes(s.nearLink) ? [s.nearLink, ...blk.links.filter((x) => x !== s.nearLink)] : blk.links;
    oneWay = order.filter((l) => l !== kept?.link).map((l) => ({ link: l, label: oneWayLabel(net, idx, l), switching: !!kept }));
  }
  return {
    modalFilter: !hasFilter,
    hump: hump ? (Math.abs(hump.position - pos) < 1 ? null : 'move') : 'add',
    speedLimit: { currentMph, choices: SPEED_LIMITS_MPH.filter((v) => v !== currentMph) },
    oneWay,
  };
}

export interface TurnOption { link: number; label: string }
export interface NodeActions {
  modalFilter: boolean;
  trafficCircle: boolean;
  control: { current: ControlType; choices: { value: ControlType; label: string }[] };
  /** Null unless the intersection is, or is being changed to, a signal. */
  cycles: number[] | null;
  turnBan: (TurnOption & { to: TurnOption[] })[];
  /** Orientations offered at a four-leg intersection (the one already placed is left out); empty elsewhere. */
  diverter: { options: DiverterOption[]; switching: boolean };
}

export function nodeActions(net: Network, idx: NetIndex, s: Extract<Selection, { kind: 'node' }>, ivs: Intervention[]): NodeActions {
  const node = s.node;
  const current = effectiveControl(net, node, ivs);
  const cycleIv = ivs.find((iv): iv is Extract<Intervention, { type: 'signal_timing' }> => iv.type === 'signal_timing' && iv.node === node);
  const cycles = current === 'signal' ? SIGNAL_CYCLES_S.filter((c) => c !== cycleIv?.cycle) : null;
  const banned = new Set(ivs.flatMap((iv) => (iv.type === 'turn_ban' ? [`${iv.fromLink}-${iv.toLink}`] : [])));
  const turnBan = idx.incomingLinks[node].map((from) => {
    const f = net.links[from];
    const to = idx.outgoingLinks[node]
      .filter((t) => net.links[t].to !== f.from && !banned.has(`${from}-${t}`))
      .map((t) => ({ link: t, label: `${linkCompass(net.links[t], 'start')}bound onto ${idx.linkName[t]}` }));
    return { link: from, label: `${linkCompass(f, 'end')}bound on ${idx.linkName[from]}`, to };
  }).filter((f) => f.to.length > 0);
  const placed = ivs.find((iv): iv is Extract<Intervention, { type: 'diagonal_diverter' }> => iv.type === 'diagonal_diverter' && iv.node === node);
  const placedKey = placed ? pairingKey(net, idx, node, placed.bearing) : null;
  const diverter = { options: diverterOptions(net, idx, node).filter((o) => o.key !== placedKey), switching: !!placed };
  return {
    modalFilter: !ivs.some((iv) => iv.type === 'modal_filter' && 'node' in iv && iv.node === node),
    trafficCircle: current !== 'traffic_circle',
    control: { current, choices: CONTROL_CHOICES.filter((c) => c.value !== current) },
    cycles: cycles && cycles.length ? cycles : null,
    turnBan,
    diverter,
  };
}
