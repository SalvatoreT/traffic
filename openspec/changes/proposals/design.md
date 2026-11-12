## Context

Requested by the user on 2026-11-12, who chose: any intervention type except new traffic
signals; harm defined as more traffic on any street inside the Trapezoid; results as a
few ranked options.

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

## Contract

```ts
interface Proposals {
  version: 1; area: string;
  computed: { date: string; periods: string[]; seeds: number[]; networkHash: string; demandHash: string; calibration: string };
  baseline: { cutThroughVehMi: Record<string, number> };
  proposals: {
    id: string; title: string; summary: string;
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
}
```
