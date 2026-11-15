import type { Intervention, Network } from '../../src/types';
import { encodeScenario } from '../../src/lib/hash';
import { blockActions, nodeActions, mphToMps, controlLabel, type Selection } from '../../src/lib/selection';
import { describeIntervention, describeInterventionFull } from '../../src/lib/describe';
import { filterChoices } from '../../src/lib/blocked';
import { diverterOptions } from '../../src/lib/diverter';
import { UNNAMED, type NetIndex } from '../../src/lib/naming';
import { makeProjection } from '../../src/lib/projection';
import { MPS_TO_MPH } from '../../src/lib/format';

/** One intervention that can be placed at a street block or intersection, with the link item that encodes it. */
export interface PlaceOption {
  type: Intervention['type'];
  /** The app's own words for it. */
  label: string;
  /** One item of a scenario link's `s=` list; join items with `~`. */
  item: string;
  /** The intervention in the JSON list form (network ids; valid for this network file only). */
  intervention: Intervention;
}
export interface BlockPlace {
  kind: 'block'; id: number; label: string; street: string; class: string; inStudyArea: boolean;
  lengthM: number; speedLimitMph: number; twoWay: boolean; links: number[];
  options: PlaceOption[];
}
export interface NodePlace {
  kind: 'node'; id: number; name: string; streets: string[]; control: string; inStudyArea: boolean;
  lon: number; lat: number; options: PlaceOption[];
}
export type Place = BlockPlace | NodePlace;

const ABBREV: Record<string, string> = {
  st: 'street', str: 'street', ave: 'avenue', av: 'avenue', blvd: 'boulevard', rd: 'road', dr: 'drive', ct: 'court', pl: 'place',
  ln: 'lane', hwy: 'highway', pkwy: 'parkway', ter: 'terrace', cir: 'circle', n: 'north', s: 'south', e: 'east', w: 'west',
};
const SEPARATOR = /\s*(?:&|\/|,|\band\b|\bat\b|\bwith\b|\bbetween\b|\bnear\b|\bx\b)\s*/i;

/** Lowercase words of a street name or query with the usual abbreviations spelled out ("Ayala Ave." and "Ayala Avenue" agree). */
export function words(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean).map((w) => ABBREV[w] ?? w);
}

/** A query as its street fragments: "Colby St at 60th St" is two. */
export function queryParts(q: string): string[][] {
  return q.split(SEPARATOR).map(words).filter((p) => p.length > 0);
}

const hasWords = (hay: string[], needle: string[]) => needle.every((w) => hay.includes(w) || hay.some((h) => h.startsWith(w) && w.length >= 3));

const itemOf = (net: Network, iv: Intervention): string | null => {
  const hash = encodeScenario(net, [iv], { area: null });
  const s = hash.split(';').find((t) => t.startsWith('s='));
  return s ? s.slice(2) : null;
};

function option(net: Network, idx: NetIndex, iv: Intervention, label?: string): PlaceOption | null {
  const item = itemOf(net, iv);
  return item ? { type: iv.type, label: label ?? describeInterventionFull(iv, net, idx), item, intervention: iv } : null;
}
const compact = (xs: (PlaceOption | null)[]): PlaceOption[] => xs.filter((x): x is PlaceOption => x !== null);

export function blockPlace(net: Network, idx: NetIndex, block: number): BlockPlace {
  const b = idx.blocks[block];
  const sel: Extract<Selection, { kind: 'block' }> = { kind: 'block', block, point: null, nearLink: null, via: 'list' };
  const a = blockActions(net, idx, sel, []);
  const first = b.links[0];
  const l = net.links[first];
  const options = compact([
    a.modalFilter ? option(net, idx, { type: 'modal_filter', link: first }) : null,
    a.hump ? option(net, idx, { type: 'speed_hump', link: first, position: Math.round(l.length / 2 * 10) / 10 }) : null,
    ...a.speedLimit.choices.map((mph) => option(net, idx, { type: 'speed_limit', link: first, speed: mphToMps(mph) })),
    ...a.oneWay.map((o) => option(net, idx, { type: 'one_way', link: o.link })),
  ]);
  return {
    kind: 'block', id: block, label: b.label, street: b.name, class: b.cls, inStudyArea: b.inStudyArea, lengthM: Math.round(b.lengthM),
    speedLimitMph: a.speedLimit.currentMph, twoWay: b.links.length === 2, links: b.links, options,
  };
}

export function nodePlace(net: Network, idx: NetIndex, node: number): NodePlace {
  const n = net.nodes[node];
  const sel: Extract<Selection, { kind: 'node' }> = { kind: 'node', node, via: 'list' };
  const a = nodeActions(net, idx, sel, []);
  const f = filterChoices(net, idx, node, []);
  const options = compact([
    f.whole ? option(net, idx, { type: 'modal_filter', node }) : null,
    ...f.streets.map((o) => option(net, idx, { type: 'modal_filter', node, legs: o.links }, `Modal filter on ${o.street} at ${idx.nodeName[node]}: ${o.closed.charAt(0).toLowerCase()}${o.closed.slice(1)}`)),
    a.trafficCircle ? option(net, idx, { type: 'traffic_circle', node }) : null,
    ...a.control.choices.filter((c) => c.value !== a.control.current).map((c) => option(net, idx, { type: 'control', node, control: c.value }, `${controlLabel(c.value)} at ${idx.nodeName[node]}`)),
    ...(a.cycles ?? []).map((cycle) => option(net, idx, { type: 'signal_timing', node, cycle })),
    ...diverterOptions(net, idx, node).map((d) => option(net, idx, { type: 'diagonal_diverter', node, bearing: d.bearing })),
    ...a.turnBan.flatMap((from) => from.to.map((to) => option(net, idx, { type: 'turn_ban', fromLink: from.link, toLink: to.link }))),
  ]);
  const [lon, lat] = makeProjection(net.origin).toLonLat(n.x, n.y);
  return { kind: 'node', id: node, name: idx.nodeName[node], streets: idx.nodeStreets[node].filter((s) => s !== UNNAMED), control: n.control, inStudyArea: n.inStudyArea, lon: +lon.toFixed(6), lat: +lat.toFixed(6), options };
}

export interface FindOptions { limit?: number; studyOnly?: boolean; includeService?: boolean }

/**
 * Places that match a query, intersections first when it names two streets. Each part of "A & B" must match a street at the intersection,
 * or both parts the label of the block. Abbreviations are spelled out on both sides, so "Colby St" finds "Colby Street".
 */
export function findPlaces(net: Network, idx: NetIndex, query: string, o: FindOptions = {}): Place[] {
  const parts = queryParts(query);
  if (parts.length === 0) return [];
  const limit = o.limit ?? 20;
  const nodes: Place[] = [];
  for (const i of idx.intersections) {
    const names = idx.nodeStreets[i].filter((s) => s !== UNNAMED).map(words);
    if (parts.every((p) => names.some((n) => hasWords(n, p))) && (parts.length > 1 || names.some((n) => hasWords(n, parts[0])))) {
      if (!o.studyOnly || net.nodes[i].inStudyArea) nodes.push(nodePlace(net, idx, i));
    }
  }
  const blocks: Place[] = [];
  idx.blocks.forEach((b, i) => {
    if (!b.inFocus || (b.cls === 'service' && !o.includeService && !o.studyOnly)) return;
    if (o.studyOnly && !b.inStudyArea) return;
    const hay = words(b.label);
    if (parts.every((p) => hasWords(hay, p))) blocks.push(blockPlace(net, idx, i));
  });
  const study = (p: Place) => Number(p.inStudyArea);
  const rank = (xs: Place[]) => xs.sort((a, b) => study(b) - study(a));
  const ordered = parts.length > 1 ? [...rank(nodes), ...rank(blocks)] : [...rank(blocks), ...rank(nodes)];
  return ordered.slice(0, limit);
}

/** A ready link for a list of items. */
export function linkFor(area: string, period: string | undefined, items: string[]): string {
  return `#v1;a=${area}${period ? `;p=${period}` : ''};s=${items.join('~')}`;
}

export const speedMph = (mps: number) => Math.round(mps * MPS_TO_MPH);
export { describeIntervention };
