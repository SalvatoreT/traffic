// Source-observation lineage and the frozen validation split (change protect-calibration-evidence, findings C1 to C3). No I/O.
// A station is a derivative of one or more source observations (a count row, a Caltrans AADT record, a turning-movement leg, a ramp ADT row). Stations that share an
// observation form one dependency group: the group is held out or kept as a whole, so no fitted station can reconstruct a held one. The split is chosen from ids and
// corridors only (never from count values) and is saved as a manifest before any count-derived preprocessing; the validation split design follows [WebTAG-M3.1] appendix C
// as already cited by the holdout configuration. The dependency and invariance rules here are engineering requirements, not a published algorithm.
import { createHash } from 'node:crypto';

export const SPLIT_VERSION = 1;

/** Direction suffix of a record key: `tmc A|N|entering` and `tmc A|N|leaving` are two derivatives of the observation `tmc A|N`. */
export const observationOfKey = (key: string): string => key.replace(/\|(entering|leaving)$/, '');

export const tmcObservation = (countId: string, leg: string): string => `tmc ${countId}|${leg}`;
const OVERRIDE_PREFIX = 'ov ', RAMP_ROW_PREFIX = 'ramp-row ';
export const overrideObservation = (source: string): string => `${OVERRIDE_PREFIX}${source}`;
export const rampRowObservation = (route: string, postmile: string, desc: string): string => `${RAMP_ROW_PREFIX}${route} PM ${postmile} "${desc}"`;
/** Observations that are daily totals: a Caltrans AADT record or a published ramp ADT row. Their stations are derived targets (derived-targets.ts). */
export const isDailyTotalObservation = (o: string): boolean => o.startsWith(OVERRIDE_PREFIX) || o.startsWith(RAMP_ROW_PREFIX);
export const blockObservation = (link: number): string => `count block ${link}`;
/** Station ids of an intersection count are `ix <name> <leg or move> ...`: its published table is one source. */
export const intersectionObservation = (stationId: string): string => `ix ${stationId.split(' ')[1]}`;

/** What the split needs to know about a station: no values. */
export interface SplitStation {
  id: string;
  corridor: string;
  /** Source observations the station derives from; defaults to its record keys without direction. */
  observations: string[];
  /** Validation membership fixed by the station family itself (volunteer-count blocks, which carry their own structural rule). */
  preset?: boolean;
  /** An aggregate count (turning movement, whole-street route) with the directed links its support covers. It is never scored; it is left out of training when its support overlaps a held block. */
  aggregate?: { supportLinks: number[]; reason: string };
  /** The directed link of a block station, for the overlap rule. */
  blockLink?: number;
}

export interface SplitRule {
  name: string;
  fraction: number;
  minPerCorridor: number;
  /** Salt of the ordering hash. Ordering uses group ids only. */
  salt: string;
}

export interface SplitGroup { id: string; corridor: string; observations: string[]; stations: string[]; held: boolean }
export interface SplitManifest {
  version: number;
  area: string;
  rule: SplitRule;
  groups: SplitGroup[];
  /** Aggregate stations left out of the training fit and of every count-derived preprocessing step: their support overlaps a held block. */
  withheldAggregates: { station: string; reason: string; blocks: number[] }[];
  /** Dependencies the split cannot remove, stated for the reader of an assessment. */
  retained: string[];
}

/** Union-find over shared observations: station id to group id (the smallest member observation, a stable name). */
export function dependencyGroups(stations: Pick<SplitStation, 'id' | 'observations'>[]): Map<string, string[]> {
  const parent = new Map<string, string>();
  const find = (x: string): string => { let r = x; while (parent.get(r) !== r) r = parent.get(r)!; let c = x; while (parent.get(c) !== r) { const n = parent.get(c)!; parent.set(c, r); c = n; } return r; };
  const union = (a: string, b: string) => { const ra = find(a), rb = find(b); if (ra !== rb) parent.set(ra > rb ? ra : rb, ra > rb ? rb : ra); };
  for (const s of stations) {
    const keys = s.observations.length ? s.observations : [`station ${s.id}`];
    for (const k of keys) if (!parent.has(k)) parent.set(k, k);
    for (let i = 1; i < keys.length; i++) union(keys[0], keys[i]);
  }
  const out = new Map<string, string[]>();
  for (const s of stations) {
    const g = find((s.observations.length ? s.observations : [`station ${s.id}`])[0]);
    (out.get(g) ?? out.set(g, []).get(g)!).push(s.id);
  }
  return out;
}

const orderKey = (salt: string, id: string): string => createHash('sha256').update(`${salt}|${id}`).digest('hex');

export const DEFAULT_RULE: SplitRule = { name: 'group-every-kth-by-hash', fraction: 0.25, minPerCorridor: 1, salt: 'rockridge-split-v1' };

/**
 * Group-level hold-out. Within each corridor the groups are ordered by a hash of their id and every k-th (k = round(1 / fraction)) is held, starting at position 1;
 * a corridor keeps at least `minPerCorridor` held groups. Nothing here reads a count value, so changing a held value cannot move any station between the sets.
 */
export function selectGroupHoldout(groups: { id: string; corridor: string }[], rule: SplitRule): Set<string> {
  const k = Math.max(2, Math.round(1 / rule.fraction));
  const by = new Map<string, { id: string; corridor: string }[]>();
  for (const g of groups) (by.get(g.corridor) ?? by.set(g.corridor, []).get(g.corridor)!).push(g);
  const held = new Set<string>();
  for (const list of by.values()) {
    list.sort((a, b) => orderKey(rule.salt, a.id).localeCompare(orderKey(rule.salt, b.id)) || a.id.localeCompare(b.id));
    const picked = list.filter((_, i) => i % k === 1);
    for (let i = list.length - 1; picked.length < Math.min(rule.minPerCorridor, list.length) && i >= 0; i--) if (!picked.includes(list[i])) picked.push(list[i]);
    for (const g of picked) held.add(g.id);
  }
  return held;
}

export const RETAINED_NOTES = [
  'Legs and movements of one intersection obey flow conservation. They remain correlated when their source rows belong to different groups.',
  'Several observations were taken on one day or in one environmental study; evidence from one counting day does not establish performance on other days [FHWA-TAT3-2019].',
];

/** Freeze the split from structure. `stations` carries no count values; the volunteer-count blocks come with their own `preset` membership. */
export function freezeSplit(area: string, stations: SplitStation[], rule: SplitRule = DEFAULT_RULE): SplitManifest {
  const scored = stations.filter((s) => !s.aggregate);
  const byGroup = dependencyGroups(scored);
  const stById = new Map(scored.map((s) => [s.id, s]));
  const groups: SplitGroup[] = [...byGroup].map(([id, ids]) => {
    const members = ids.map((x) => stById.get(x)!);
    const corridors = [...new Set(members.map((m) => m.corridor))].sort();
    return { id, corridor: corridors[0], observations: [...new Set(members.flatMap((m) => m.observations))].sort(), stations: [...ids].sort(), held: false };
  }).sort((a, b) => a.id.localeCompare(b.id));
  const preset = groups.filter((g) => g.stations.some((x) => stById.get(x)!.preset !== undefined));
  for (const g of preset) g.held = g.stations.some((x) => stById.get(x)!.preset === true);
  const free = groups.filter((g) => !preset.includes(g));
  const held = selectGroupHoldout(free, rule);
  for (const g of free) g.held = held.has(g.id);
  const heldLinks = new Map<number, string>();
  for (const g of groups) if (g.held) for (const x of g.stations) { const s = stById.get(x)!; if (s.blockLink !== undefined) heldLinks.set(s.blockLink, x); }
  const withheldAggregates = stations.filter((s) => s.aggregate).flatMap((s) => {
    const blocks = [...new Set(s.aggregate!.supportLinks.filter((l) => heldLinks.has(l)))].sort((a, b) => a - b);
    return blocks.length ? [{ station: s.id, reason: s.aggregate!.reason, blocks }] : [];
  }).sort((a, b) => a.station.localeCompare(b.station));
  return { version: SPLIT_VERSION, area, rule, groups, withheldAggregates, retained: RETAINED_NOTES };
}

/**
 * The manifest holds the structural draw: hash order within each corridor, no value read, frozen before any count-derived step. Derived targets are never held out
 * (change derived-targets-not-judged), so a group of daily-total observations is fitted whatever the draw says. The rule is applied here, on top of the draw, because the
 * shipped demand records the manifest's hash: re-freezing the file for it would change the shipped demand and everything stamped with it. The draw itself did not move.
 */
export const isDerivedGroup = (g: Pick<SplitGroup, 'observations'>): boolean => g.observations.some(isDailyTotalObservation);
/** Held out of the cross-validation demand: drawn as held and not a derived target. */
export const isHeldGroup = (g: Pick<SplitGroup, 'held' | 'observations'>): boolean => g.held && !isDerivedGroup(g);
/** The stations the draw alone holds, before the derived-target rule (what the stations file records as `held`). */
export const drawnHeldStationIds = (m: SplitManifest): Set<string> => new Set(m.groups.filter((g) => g.held).flatMap((g) => g.stations));
export const heldStationIds = (m: SplitManifest): Set<string> => new Set(m.groups.filter(isHeldGroup).flatMap((g) => g.stations));
export const withheldObservations = (m: SplitManifest): Set<string> => new Set(m.groups.filter(isHeldGroup).flatMap((g) => g.observations));
/** Everything the training view leaves out: held stations and the aggregates that overlap held blocks. */
export const withheldStationIds = (m: SplitManifest): Set<string> => new Set([...heldStationIds(m), ...m.withheldAggregates.map((a) => a.station)]);

/** Problems when a manifest no longer matches the stations the build would produce (empty when it does). */
export function checkManifest(m: SplitManifest, stations: SplitStation[]): string[] {
  const problems: string[] = [];
  if (m.version !== SPLIT_VERSION) problems.push(`manifest version ${m.version}, expected ${SPLIT_VERSION}`);
  const fresh = freezeSplit(m.area, stations, m.rule);
  const a = new Map(m.groups.map((g) => [g.id, g])), b = new Map(fresh.groups.map((g) => [g.id, g]));
  for (const [id, g] of b) {
    const old = a.get(id);
    if (!old) problems.push(`group ${id} (${g.stations.length} station(s)) is not in the manifest`);
    else if (old.stations.join('|') !== g.stations.join('|')) problems.push(`group ${id} has different stations than the manifest`);
    else if (old.held !== g.held) problems.push(`group ${id} is ${old.held ? 'held' : 'fitted'} in the manifest but the rule gives ${g.held ? 'held' : 'fitted'}`);
  }
  for (const id of a.keys()) if (!b.has(id)) problems.push(`manifest group ${id} has no station in this build`);
  const wa = m.withheldAggregates.map((x) => x.station).join('|'), wb = fresh.withheldAggregates.map((x) => x.station).join('|');
  if (wa !== wb) problems.push('the aggregate stations that overlap held blocks differ from the manifest');
  return problems;
}

/** SHA-256 of the station ids the training view leaves out under the current rule; recorded in the training demand and in its membership evidence so that a file built under an earlier rule cannot pass for this one. */
export const withheldDigest = (m: SplitManifest): string => createHash('sha256').update([...withheldStationIds(m)].sort().join('\n')).digest('hex');

/** Stable text of a manifest for hashing and for committing (sorted, one group per line is not needed: groups are sorted by id). */
export const manifestText = (m: SplitManifest): string => JSON.stringify(m, null, 1) + '\n';
export const manifestSha256 = (text: string): string => createHash('sha256').update(text).digest('hex');

// ---------- links on the path of a whole-street route ----------
export interface RouteNet { links: { id: number; from: number; to: number; name: string }[] }

/**
 * Directed links of the street that lie on some path from the end of `first` to the start of `last` along links of the same name: reachable forward from `first`
 * and able to reach `last`. This is the support of the observation "vehicles that drove the whole street" (the count covers every block on its way). The split conservatively includes every possible same-street branch between those ends.
 * The scored whole-street feature uses one ordered, contiguous link sequence.
 */
export function routeSupportLinks(net: RouteNet, first: number, last: number): number[] {
  const byId = new Map(net.links.map((l) => [l.id, l]));
  const f = byId.get(first), l = byId.get(last);
  if (!f || !l) return [];
  const same = net.links.filter((x) => x.name === f.name);
  const out = new Map<number, typeof same>(), inn = new Map<number, typeof same>();
  for (const x of same) { (out.get(x.from) ?? out.set(x.from, []).get(x.from)!).push(x); (inn.get(x.to) ?? inn.set(x.to, []).get(x.to)!).push(x); }
  const fwd = new Set<number>([f.id]);
  for (let queue = [f]; queue.length;) { const cur = queue.pop()!; for (const n of out.get(cur.to) ?? []) if (!fwd.has(n.id)) { fwd.add(n.id); queue.push(n); } }
  const bwd = new Set<number>([l.id]);
  for (let queue = [l]; queue.length;) { const cur = queue.pop()!; for (const n of inn.get(cur.from) ?? []) if (!bwd.has(n.id)) { bwd.add(n.id); queue.push(n); } }
  return [...fwd].filter((x) => bwd.has(x)).sort((a, b) => a - b);
}
