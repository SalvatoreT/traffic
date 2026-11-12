## Context

Requested by the user on 2026-11-12, who chose: any intervention type except new traffic
signals; harm defined as more traffic on any street inside the Trapezoid; results as a
few ranked options.

On 2026-11-12 the user added that the Proposals tab shows two ranked lists: packages
that follow the 2025 neighborhood pilot's limits first, then packages without those
limits for comparison (D7).

## Decisions

### D1 Goal and harm
Goal: vehicle-miles of cut-through traffic on residential and service streets inside the
study area, averaged over the periods searched. Harm: the largest increase in total
traffic on any single residential or service street block inside the study area, in
vehicles an hour, taken over those periods. A package's harm is its worst block, not an
average, because the user's concern is any one street being made worse. Increases inside
the noise band of the comparison count as zero.

### D2 What a proposal may contain
Modal filters on blocks and intersections, diagonal diverters, one-way conversions, turn
bans, speed humps, traffic circles, lower speed limits, stop-control changes and cycle
changes at existing signals. A proposal never adds a signal. Every block inside the
study area must stay reachable by car from outside, in and out; a package that strands
one is rejected.

### D3 Candidates come from the baseline
Candidate locations are the blocks and intersections that carry the most cut-through in
the baseline, found by select-link analysis, plus the points where those routes enter
from the bounding streets. Searching every block would waste nearly all the compute on
places with nothing to remove.

### D4 Greedy search with a beam, then a careful recheck
The search adds one intervention at a time, keeping the best few partial packages at
each depth (a beam), scored on a shortened run with one seed. Baseline and candidates
share seeds so differences come from the intervention. The finalists are then rerun for
the full hour over all periods and several seeds, and only those results are published.
An exhaustive or evolutionary search was considered: the first is out of reach and the
second spends its budget rediscovering what greedy steps find directly.

### D5 Picking the options to show
From the rechecked finalists, keep the packages no other package beats on both goal and
harm, then pick about five spread from fewest interventions to greatest reduction. Each
is given a plain title and a one-paragraph description generated from its contents.

### D6 Honest framing
Each proposal reports reduction in cut-through, its worst-affected inside block by name
with the size of the increase, how many blocks gain traffic beyond the noise band, and,
for information only, changes on the four bounding streets, in trip time for trips that
start or end inside, and in the walking and biking indicators. The file records the
network and demand it was computed on, the seeds, the date and the baseline's
calibration status, and the tab shows the status. Proposals are recomputed when the
baseline changes.

### D7 Constraint profiles and two lists
Limits on the search are data, not code. A profiles file per area
(`data/proposals/<area>.profiles.json`) lists entries `{id, title, note, excludeTypes,
excludeBoundary}`. `explore --profile <id>` drops candidates before the search starts;
with no `--profile` the run is the unconstrained group (every tool except new signals).
Each run writes only its own group of the proposals file and keeps the others, so the
two lists come from two separate runs. A file in the earlier single-list format counts
as the unconstrained group when a profile run merges into it. The report file gets one
section per profile in the same way. Reference packages are hand-written and are not
filtered, so they stay with the unconstrained group only.

The charter profile is `excludeTypes: [speed_hump, traffic_circle]` and
`excludeBoundary: true`:

- Bounding streets are the non-residential, non-service links inside the study area
  (for Rockridge: Telegraph, Alcatraz, College and Claremont). Their intersections are
  the nodes those links touch. Boundary locations are removed before the top locations
  are ranked, so a constrained search still gets its full candidate count.
- A block counts as at a bounding street's intersection when either end is one, so
  blocks that meet a bounding street get no intervention either. This is the strict
  reading of "intersections"; relaxing it is a profile change plus a small generator
  change, and it would widen the charter list.
- Turn bans are generated only for movements from an arterial onto a local street, all
  of which sit at bounding-street intersections, so the charter list has none.
- ASSUMPTION: modal filters, diagonal diverters, turn bans, one-way streets, stop and
  yield control and speed limits are temporary. Speed humps and traffic circles are
  not. The profile note says so on the tab.
- Harm is unchanged. It is measured on residential and service blocks inside the study
  area only, so traffic that moves onto a bounding street is not harm. Cut-through
  counts the same links. Bounding-street flow stays in the context figures.

The file is version 2: `{version: 2, area, groups: [{id, title, note, computed,
baseline, proposals}]}`, groups in profiles-file order. Each group carries its own
`computed` block because each run has its own date and hashes, and each is checked for
staleness on its own. The reader still accepts version 1.

## Contract

```ts
interface Proposals {
  version: 2; area: string;
  groups: {
    id: string; title: string; note: string;   // id is a profile id; "unconstrained" when no profile was given
    computed: { date: string; periods: string[]; seeds: number[]; networkHash: string; demandHash: string; calibration: string };
    baseline: { cutThroughVehMi: Record<string, number> };
    proposals: {
      id: string; title: string; summary: string;
      kind?: 'search' | 'reference';
      link: string;                         // scenario link fragment, v1 format
      interventions: { type: string; label: string }[];
      cutThrough: { baselineVehMi: number; scenarioVehMi: number; changePct: number };
      harm: { worstBlock: string; worstIncreaseVehPerHour: number; blocksAboveNoise: number };
      context: {
        boundingStreets: { name: string; flowChangePct: number; speedChangeMph: number }[];
        insideTripTimeChangePct: number;
        pedConflictsChangePct: number; bikeConflictsChangePct: number;
      };
      byPeriod: Record<string, { cutThroughChangePct: number; worstIncreaseVehPerHour: number }>;
    }[];
  }[];
}
// Version 1 (one list: computed, baseline and proposals at the top level) is read as one unconstrained group.
```
