// Derived targets (change derived-targets-not-judged). A station whose hourly target is a daily total (a Caltrans AADT or a ramp ADT) times an assumed peak-hour factor
// is not an hourly count: K and the directional split are ASSUMPTIONs, and design-hour volume = AADT x K x D is the textbook form [FHWA-TMG2022]. Such a target stays in
// every fit as an input and is reported separately; the held-out and fitted checks are judged on hourly counts. A station is identified by its own provenance, the source
// kind the demand build records on it, never by a list of streets. No I/O.
import { isDerivedGroup, type SplitManifest } from './lineage';

/** Source kinds whose target is a daily total times assumed factors: Caltrans AADT stations and gates [CaltransAADT], Caltrans ramp ADT rows. */
export const SOURCE_CALTRANS_AADT = 'caltrans-aadt';
export const SOURCE_CALTRANS_RAMP = 'caltrans-ramp';
export const DAILY_TOTAL_SOURCES: ReadonlySet<string> = new Set([SOURCE_CALTRANS_AADT, SOURCE_CALTRANS_RAMP]);

/** The words the reports and the site use for these targets. */
export const DERIVED_TARGET_PHRASE = 'derived from a daily total, not judged';

/** True for a station whose target is derived from a daily total. */
export const isDerivedTarget = (s: { source?: string | null }): boolean => DAILY_TOTAL_SOURCES.has(s.source ?? '');

/** The rule in one paragraph, shared by the reports. */
export const DERIVED_TARGET_RULE = 'A target computed from a daily total (a Caltrans AADT or ramp ADT) times an assumed peak-hour factor and directional split is not an hourly count. It stays in the demand fit as an input, in every view, and it is never held out. It is reported in its own table and is not counted in the fitted or held-out pass rates, which are judged on hourly counts only.';

/**
 * The split recognizes a derived target by its source observation (an `ov` Caltrans record or a `ramp-row`), the stations by their source kind. The two must agree: a group
 * with a derived station and another station is a mixed group, and a derived station outside a derived group would be held out. Empty when they agree; only stations the
 * build has (the training view has fewer) are compared.
 */
export function derivedGroupProblems(m: SplitManifest, stations: { id: string; source?: string | null }[]): string[] {
  const bySt = new Map(stations.map((s) => [s.id, s]));
  const problems: string[] = [];
  for (const g of m.groups) {
    const present = g.stations.flatMap((id) => (bySt.has(id) ? [bySt.get(id)!] : []));
    const derived = present.filter(isDerivedTarget).length;
    if (isDerivedGroup(g) ? derived !== present.length : derived > 0) problems.push(`group ${g.id}: its observations ${isDerivedGroup(g) ? 'are daily totals' : 'are not daily totals'} but ${derived} of its ${present.length} stations have a derived-target source`);
  }
  const inGroup = new Set(m.groups.flatMap((g) => g.stations));
  for (const s of stations) if (isDerivedTarget(s) && !inGroup.has(s.id)) problems.push(`${s.id}: a derived target in no split group (an aggregate or a station added after the split was frozen)`);
  return problems;
}
