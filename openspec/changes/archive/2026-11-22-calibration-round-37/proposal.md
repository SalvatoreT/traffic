> Round 37 ran 2026-11-16 to 2026-11-17 (`data/calibration/rockridge.record-archive-3.md`). Archived late, on 2026-11-22, with the specs already current; no spec sync was run.

## Why

Round 36 traced the gridlock that keeps the delay-feedback fit rejected to the all-way stop at Claremont Ave / Russell St and the Berkeley hills streets north of Ashby Ave, more than a kilometer from the Rockridge Trapezoid, where the model has few counts. The PM peak's stability rule (D16, at most 1 car an hour cleared from gridlock) counted those clearings the same as ones on the study area's streets. On 2026-11-16 the project lead confirmed from a resident's field observation that Claremont Ave / Russell St is an all-way stop, so the network there is right, and chose to judge gridlock near the Trapezoid: the limit applies to the study area, its bounding streets and the junctions on them, and gridlock farther out is reported apart as a known weakness at the model's edges.

## What changes

- The area config records the field observation at Claremont Ave / Russell St (an override that states `stop=all` on the node the map already tags as a stop; the network does not change) and a judged zone: the study area plus nodes within a buffer distance of it along the network (`judgedZone.bufferM`, 200 m, ASSUMPTION).
- `calibrate` reports, for every seed, where each car cleared from gridlock was held: near (in the zone) or far, and whether a far one's chain of vehicles held by a full exit reached the zone. It also reports the judged count at half and double the buffer, the trips waiting at origins in the zone, and the longest standing queue on each bounding street. The binary observes the simulation between steps, so runs and the simulator fingerprint do not change.
- D16 judges near clearings plus far clearings whose chain reaches the zone, in the ten-seed summary, `tools/assess.ts`, and the cost loop's acceptance rule. Everything else in the rule is unchanged. Without a judged zone, or for a report without the split, every clearing counts.
- The delay-feedback fit is replayed under the re-scoped rule, and the result is assessed on all periods and both PM seed sets and recorded as round 37.

## Capabilities

### New Capabilities

### Modified Capabilities

- `calibration`: the stability rule's gridlock limit applies to the study area's judged zone, with far gridlock reported separately and counted when it reaches the zone.

## Impact

- `crates/sim/src/bin/calibrate.rs`, `crates/sim/src/bin/calibrate/zone.rs` (new), `crates/sim/src/bin/calibrate/multi.rs`; `tools/lib/verdict.ts`, `tools/lib/assess.ts`, `tools/lib/acceptance.ts`, `tools/assess.ts`, `tools/cost-loop.ts`, `tools/lib/types.ts`; tests.
- `data/areas/rockridge.json` and its README, `data/calibration/README.md`, `openspec/specs/calibration/spec.md`, the calibration record, the assessment and the cost-loop table.
- The simulator's module tree is untouched: fingerprint f0df1aabc323 stays, and the published proposals stay current. Network and link numbering unchanged; frozen split unchanged.
