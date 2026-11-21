// What the held-out figures of an assessment can and cannot show (change protect-calibration-evidence, D2). The split is a diagnostic holdout of observations that earlier
// calibration rounds already consulted; it is not independent validation. Sources: [WebTAG-M3.1] appendix C (calibration and validation are distinct; validation data must
// not have been used to calibrate) and [FHWA-TAT3-2019] (one counting day does not establish performance on other days). No I/O.
import { isDerivedGroup } from './lineage';
import { DERIVED_TARGET_RULE } from './derived-targets';

export interface ScopeInput { cvDemand: boolean; splitSha: string | null; minHeld: number; /** The frozen split manifest, when there is one: counts and the retained overlaps are listed from it. */ split?: { groups: { held: boolean; stations: string[]; observations?: string[] }[]; withheldAggregates: { station: string; blocks: number[] }[]; retained: string[] } | null }

export function scopeLines(i: ScopeInput): string[] {
  const split = i.splitSha ? `frozen split \`${i.splitSha.slice(0, 12)}\`` : 'no frozen split manifest';
  return [
    '### What the held-out figures show, and what they do not',
    '',
    `The held-out scores below are a **diagnostic holdout**, not independent validation. ${i.cvDemand ? `The held stations are those of the ${split}: whole dependency groups (every derivative of a withheld source observation, both directions and every period), chosen from station ids and corridors without reading any count value, and their observations are removed from the cross-validation demand's gate totals, ramp volumes, trip ends, assumed movements and fit.` : 'No cross-validation demand was run, so there are no held-out scores.'}`,
    '',
    '- Earlier calibration rounds chose demand settings while reading station-level scores, held-out ones included (`data/calibration/rockridge.record.md`). Splitting the same observations again produces a useful diagnostic but cannot undo that history, and parameters tuned in those rounds (rates, factors, class defaults, weights) were not re-chosen without the held observations.',
    '- Independent validation needs a frozen model and observations that no calibration round consulted (new counts, or other days), or an outer evaluation split that contains the whole model-selection procedure [WebTAG-M3.1] appendix C. A count from one day does not establish performance on other days [FHWA-TAT3-2019]; most recent stations here come from one counting day (see the source line in the verdict).',
    '- Evidence that stays shared and is reported, not removed: the legs and movements of one intersection remain correlated through flow conservation. The training demand excludes whole-street counts covering a held block and their route diagrams. The current whole-street measurement requires a continuous traversal of the counted street.',
    `- Fewer than ${i.minHeld} recent held-out stations are too few to judge; the population is not enlarged or filtered after seeing results.`,
    ...(i.split?.groups ? (() => {
      const gs = i.split!.groups, held = gs.filter((g) => g.held && !isDerivedGroup({ observations: g.observations ?? [] })), moved = gs.filter((g) => g.held && isDerivedGroup({ observations: g.observations ?? [] }));
      return [`- The split holds ${held.length} of ${gs.length} dependency groups (${held.reduce((a, g) => a + g.stations.length, 0)} stations). Aggregate counts left out of the cross-validation demand because they cover a held block: ${i.split!.withheldAggregates.length ? i.split!.withheldAggregates.map((a) => `${a.station} (blocks ${a.blocks.join(', ')})`).join('; ') : 'none'}. Overlap notes recorded when the split was frozen: ${i.split!.retained.join(' ')}`,
        `- ${DERIVED_TARGET_RULE} The frozen draw also picked ${moved.length} groups (${moved.reduce((a, g) => a + g.stations.length, 0)} stations) of daily-total observations; they are fitted in both views and are reported apart, and no other group changed sides.`];
    })() : []),
    '',
  ];
}
