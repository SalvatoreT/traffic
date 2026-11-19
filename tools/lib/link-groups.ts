// Link-group stations (round 47): several stations that carry one source row become one station whose target constrains the sum of the flows over all their links.
// No I/O, no street names. The groups come from `countFit.linkGroups` in the area's demand config; with no entry nothing changes.
import { stationObservations, type Station } from './demand-fit';

export interface LinkGroupConfig {
  /** Ids of the stations to merge, as the build produces them before the merge. */
  stations: string[];
  /** Id of the merged station; default is the member ids joined with " + ". */
  id?: string;
  _note?: string;
}

export interface LinkGroupResult { stations: Station[]; notes: string[] }

const sumBy = (members: Station[], f: (s: Station) => Record<string, number> | undefined, periodIds: string[]) => Object.fromEntries(periodIds.map((p) => [p, members.reduce((a, s) => a + (f(s)?.[p] ?? 0), 0)]));

/**
 * Replace each group's member stations by one station: links and detectors are the members' in order, the target of every period is the sum of the member targets,
 * and the fit and the scoring read it as one count over the sum of the flows on those links (`assigned` and `stationFlow` already sum over `links`).
 * Run after the frozen split is applied. The split names the members, so the merged station inherits one side of it: members on different sides, a member that is
 * missing while another is present, a member with a route feature, links in two members, or members that share no source observation make the build stop.
 * A group none of whose members is in the view (the training view of a split that withholds its row) is left out and noted.
 */
export function mergeLinkGroups(stations: Station[], groups: LinkGroupConfig[] | undefined, periodIds: string[]): LinkGroupResult {
  if (!groups?.length) return { stations, notes: [] };
  const notes: string[] = [];
  const byId = new Map(stations.map((s) => [s.id, s]));
  const claimed = new Set<string>();
  const replace = new Map<string, Station | null>();
  for (const g of groups) {
    const where = `linkGroups [${g.stations.join(', ')}]`;
    if (!Array.isArray(g.stations) || g.stations.length < 2) throw new Error(`${where}: a group needs at least two stations`);
    if (new Set(g.stations).size !== g.stations.length) throw new Error(`${where}: a station is listed twice`);
    for (const id of g.stations) { if (claimed.has(id)) throw new Error(`${where}: station ${id} is in two groups`); claimed.add(id); }
    const present = g.stations.filter((id) => byId.has(id));
    if (!present.length) { notes.push(`link group ${g.id ?? g.stations.join(' + ')}: none of its stations is in this view; left out`); continue; }
    if (present.length < g.stations.length) throw new Error(`${where}: ${g.stations.filter((id) => !byId.has(id)).join(', ')} is missing while ${present.join(', ')} is present; the members are on different sides of the split or one was not built`);
    const ms = g.stations.map((id) => byId.get(id)!);
    if (ms.some((s) => !!s.held !== !!ms[0].held)) throw new Error(`${where}: members are on different sides of the split (${ms.map((s) => `${s.id} ${s.held ? 'held out' : 'fitted'}`).join(', ')}); the split is not re-frozen, so the group cannot be merged`);
    if (ms.some((s) => s.feature || !s.links.length)) throw new Error(`${where}: every member must be a link station`);
    if (ms.some((s) => s.kind !== ms[0].kind)) throw new Error(`${where}: members are of different kinds`);
    if (ms.some((s) => !!s.detectors !== !!ms[0].detectors)) throw new Error(`${where}: members differ in having detectors`);
    const links = ms.flatMap((s) => s.links);
    if (new Set(links).size !== links.length) throw new Error(`${where}: a link is in two members`);
    const obs = ms.map((s) => new Set(stationObservations(s)));
    if (obs.slice(1).some((o) => ![...o].some((k) => obs[0].has(k)))) throw new Error(`${where}: members do not share a source observation`);
    const weights = ms.map((s) => s.weight);
    const target = sumBy(ms, (s) => s.target, periodIds);
    const weightByPeriod = ms.some((s) => s.weightByPeriod) ? Object.fromEntries(periodIds.map((p) => [p, Math.max(...ms.map((s) => s.weightByPeriod?.[p] ?? s.weight))])) : undefined;
    const merged: Station = {
      id: g.id ?? g.stations.join(' + '),
      kind: ms[0].kind,
      label: `${ms.map((s) => s.label).join(' + ')}, sum`,
      basis: `${[...new Set(ms.map((s) => s.basis))].join(' + ')}; one target over the sum of the members' flows (link group; ASSUMPTION: the row's flow need not divide evenly over its links)`,
      links,
      ...(ms[0].detectors ? { detectors: ms.flatMap((s) => s.detectors!) } : {}),
      target,
      weight: Math.max(...weights),
      ...(weightByPeriod ? { weightByPeriod } : {}),
      tolPct: Math.max(...ms.map((s) => s.tolPct)),
      records: ms.flatMap((s) => s.records),
      held: ms[0].held,
      derived: [...new Set(ms.flatMap((s) => s.derived ?? []))],
      corridor: ms[0].corridor,
      source: ms[0].source,
      year: ms[0].year ?? null,
      ramp: ms.some((s) => s.ramp) || undefined,
      observations: [...new Set(ms.flatMap((s) => stationObservations(s)))],
    };
    if (ms.some((s) => s.source !== ms[0].source || (s.year ?? null) !== (ms[0].year ?? null))) throw new Error(`${where}: members differ in source or count year`);
    if (merged.derived!.length === 0) delete merged.derived;
    for (const k of Object.keys(merged) as (keyof Station)[]) if (merged[k] === undefined) delete merged[k];
    ms.forEach((s, i) => replace.set(s.id, i === 0 ? merged : null));
    notes.push(`link group ${merged.id}: ${ms.length} stations of one source row become one station over links ${links.join(', ')}; the target is the sum (${periodIds.map((p) => `${p} ${Math.round(target[p])}`).join(', ')} veh/h, members ${ms.map((s) => periodIds.map((p) => Math.round(s.target[p] ?? 0)).join('/')).join(' and ')}), weight ${merged.weight} (the larger member weight, ${ms.length} counts becoming one)`);
  }
  return { stations: stations.flatMap((s) => (replace.has(s.id) ? (replace.get(s.id) ? [replace.get(s.id)!] : []) : [s])), notes };
}
