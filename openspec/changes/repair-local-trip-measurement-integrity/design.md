## Context

Audit date: 2026-11-15. Source revision: `415df88c33224b433abc52e52fbed5132849be63`. Findings below are implementation defects reproduced with synthetic networks. The synthetic values are test inputs, not estimates for Rockridge.

The existing requirement that local trips enter and leave along a block is reasonable as an explicit assumption. The defects concern how those positions, clocks and reference distances are used. Correct these before tuning any parameters to reported delay. Simulation validation should distinguish implementation checks from calibration against observations [FHWA-TAT3-2019]. The integrator remains the existing ballistic scheme [Treiber2015].

## Findings and reproduction

Run from the repository root after `npm run wasm`:

```sh
node openspec/changes/repair-local-trip-measurement-integrity/evidence/local-trips.mjs
```

The script creates a directed, uncontrolled line with one or two 1,000 m residential links, a 10 m/s speed limit, one car flow of 10 vehicles/hour, seed 1 and initial loading disabled. Each run lasts 3,600 seconds. It requires no area data or credentials. Gate endpoints provide a comparison that exercises the same engine without local endpoint placement.

| Endpoints | Links | Completed trips | Mean trip time, s | Mean delay, s | Vehicle-km |
| --- | ---: | ---: | ---: | ---: | ---: |
| Local | 1 | 15 | -0.087133 | -95.013370 | 0 |
| Local | 2 | 15 | 101.496201 | -89.556271 | 15.488019 |
| Gate | 1 | 15 | 93.896201 | -1.030037 | 14.799236 |
| Gate | 2 | 15 | 190.312867 | -0.739604 | 29.776035 |

### E1. Full-link free-flow charges for partial local trips

Priority P1; confirmed. `sim.rs:1740-1746` places a local end inside its link. `try_spawns` uses that position at lines 1819-1825 and marks `mid_start` at line 1851. `update_vehicles` ends a local trip inside its final link at lines 2354-2364. Yet `begin_crossing` adds all of `link_ff_for` at lines 2652-2662 and `finish_trip` does so again for the last link at lines 2564-2576. `mid_start` excludes a partial traversal from measured routing costs; it never adjusts the trip's free-flow reference.

The two-link local run subtracts about 191 seconds of reference time from a trip that takes about 101 seconds. Interventions that change first or last links can therefore change the delay error. The synthetic run establishes the defect, not the size of the error in a published Rockridge proposal.

### E2. A single-link trip has coincident entry and exit positions

Priority P1; confirmed. Both endpoint calls use `mid_block_pos(uid, link)`, whose key has no endpoint role. On a one-link route, the destination position equals the insertion position. The first update reaches the destination, completes the trip and skips movement statistics. The one-link local run completes all 15 generated trips with zero vehicle-distance. This is a deterministic property of the endpoint function, not a rare random coincidence.

A direct-neighbor scan of the downloaded Rockridge demand found 7, 13 and 14 car flows whose local endpoints share a directed link longer than 40 m, totaling 1.20, 1.49 and 2.00 vehicles/hour for AM, midday and PM. These are candidate flows only: the scan does not prove their selected routes use one link. The full model's incidence must be measured during implementation. The larger concern in E1 applies to every partial local endpoint.

### E3. Events can complete before their arrival timestamp; terminal motion is skipped

Priority P2; confirmed. `generate_arrivals` takes arrivals before `t + DT` at lines 1488-1493. `step_once` spawns and advances those agents before advancing `self.t` at lines 1350-1362. `finish_trip` timestamps completion with `self.t` at line 2574. A same-step completion therefore has a negative travel time for an arrival inside that step, as E2 demonstrates.

The local finish branch and the ordinary link-exit branches at lines 2354-2390 return to the loop before `dist` and the time/exposure counters at lines 2397-2445. They discard the terminal movement increment. This is a code-path finding; the probe's zero distance includes both coincident endpoints and this omitted increment. Their separate contributions to full-run exposure were not measured.

## Decisions

D1. Store the physical endpoints used by each trip. Sampling must distinguish origin from destination and define a legal ordering for a trip served by one directed link. Choose and document that ordering policy as an assumption; no observed local driveway distribution is available here. Reset and repeated baseline/scenario runs must preserve the same requested trip endpoints when the same physical links are available. Generating both positions from one hash is rejected because it makes every one-link trip degenerate. Independent samples without a direction check are also insufficient: an exit behind the entry needs a valid route or an explicit placement policy.

D2. Track the actually traversed first and last portions for the free-flow reference. Preserve the current compliance-speed semantics and count only the humps and movements the trip traverses. Do not repair negative delay by clamping it at zero; that would hide the missing-distance error and bias means. The reference must be testable against an unobstructed traversal with the same physical endpoints. Existing ballistic integration [Treiber2015] determines the numerical tolerance; it does not justify charging an untraversed road section.

D3. Pick one within-step event convention and use it everywhere. Either substep arrivals and exits consistently, or quantize arrival eligibility and completion consistently while retaining the requested arrival time for queue delay. An agent must never enter before its requested arrival or finish before entering. Merely changing the displayed average to zero is rejected. Review bicycle and pedestrian completion clocks under the same invariant; the demonstrated negative value is a car case.

D4. Record the terminal portion before unlinking the agent. Use the portion actually driven within the step, bounded at the exit point; do not add a whole step of exposure after a vehicle has left. Test distance and time conservation across ordinary exits, local exits and node transfers. Existing reports of vehicle-distance and exposure depend on this accounting.

D5. Separate measurement repair from calibration. Run all periods with matching seeds before and after the fix, reporting changes in completed trips, endpoint failures, mean delay, distance and the affected proposal comparisons. A changed result is not evidence that the corrected model is calibrated [FHWA-TAT3-2019]. Rebuild WASM, verify native/WASM parity, and regenerate stored reports under the new fingerprint after the implementation is accepted.

## Risks and limits

Endpoint repair can change queues, not just reported means. Initial loading must use the same endpoint semantics, or its placed population will represent different trip lengths from newly arriving traffic. Existing free-flow reference and finite-step errors also appear in the gate examples; the small negative gate delays require a numerical explanation during implementation rather than an assertion that E1 accounts for every negative delay.

This proposal makes no claim about the magnitude or direction of a corrected Rockridge intervention effect. The requested scope is proposal-only: tasks stay unchecked and the change stays open until a later implementation passes its tests.

## Implementation, 2026-11-15

### Confirmation

The evidence script reproduced the audit's table exactly on the engine after `expose-junction-fallback-validity` (local one-link: 15 trips, mean time -0.087 s, mean delay -95.0 s, 0 veh-km; local two-link: delay -89.6 s). E1, E2 and E3 hold as described. The terminal-motion part of E3 was confirmed in source: the local-exit, gate-exit and node-entry branches of `update_vehicles` returned before the motion statistics.

### What changed

D1. `mid_block_pos` takes the end's role, so origin and destination draws differ. The origin draw keeps its old key, so origin positions did not move. When a local trip starts and ends on the same link, the two draws are used in driving order: the upstream one is the entry. This ordering is labeled ASSUMPTION; no observed driveway distribution exists. The exit is stored on the vehicle. Initial loading uses the same positions: a car with a local end is placed only on the part of its first or last link it drives, the time weights of those links shrink to that part, and the control delay of a last link that ends before the stop line is dropped. Endpoints repeat after `reset` and in a paired scenario with the same trips (test `endpoints_repeat_after_a_reset_and_in_a_paired_scenario`).

D2. The free-flow reference counts each link only between the trip's entry or the link's emerge point and its exit or stop line, at the driver's desired speed (limit × compliance), with only the humps inside that part (`link_ff_part`). Node movements count at the lower of the turn speed and the driver's desired speed on the lower link limit (`mv_ff_for`), which keeps the compliance semantics through junctions. The old reference counted every link's full length, so the junction areas between the stop line and the next link's emerge point were counted twice, once in the link and once in the movement. Nothing is clamped.

D3. One convention for events within a step: everything that happens in [t, t + DT) is stamped t, and a requested arrival becomes eligible at the first step that starts at or after it. So requested arrival ≤ entry ≤ completion for cars, cyclists and pedestrians, which share `generate_arrivals`. Trip time still counts from the requested arrival, so a wait to enter is included once.

D4. The last step of a vehicle that leaves a link (at a local exit, a gate or into a node) is counted up to the exit point, with the time share of the step it took to get there, before the vehicle is removed or starts crossing (`account_motion`).

`Config::record_trips` now also records `TripTiming` per completed car trip: requested arrival, entry, completion, entry and exit link and position, driven distance and free-flow reference.

A test in `tests::intent` exposed a related classification slip that the new step timing made visible. A through car first counted as it left an on-ramp link was classified as having no on-ramp, because the classification looked only at the links ahead. It now includes the link being left.

### Synthetic fixtures after the change

| Endpoints | Links | Completed trips | Mean trip time, s | Mean delay, s | Vehicle-km |
| --- | ---: | ---: | ---: | ---: | ---: |
| Local | 1 | 15 | 18.83 | 3.86 | 2.37 |
| Local | 2 | 15 | 97.56 | 4.07 | 14.87 |
| Gate | 1 | 15 | 94.15 | 0.36 | 14.82 |
| Gate | 2 | 15 | 190.56 | 1.85 | 29.82 |

Remaining error (task 3.2): a gate trip enters at its desired speed and keeps it, so a lone gate trip's delay stays within two steps of zero. The test bound is -0.5 s; completion is stamped at the start of its step and a crossing starts up to 0.3 m before the stop line. A local trip pulls out from a standstill, and the IDM free-road term [Treiber2000] approaches the desired speed slowly, so a lone local trip loses up to v0 / a (12.7 s for the fastest, least eager drivers). The means above also include later trips that caught up with a slower car ahead. Driven distance matches the path to within 0.3 m per junction crossed.

### Rockridge, matched seeds

Native runs as in `expose-junction-fallback-validity` (network `5fe8241a6ba1e306`, one hour after the 120 s settle), before = that change's `physical` engine, after = this change. Mean over seeds.

| Period | Scenario | Seeds | Through cars/h | Removed | Mean trip time, s | Mean delay, s | Veh-km | Hillegass N/S, Colby N/S |
|---|---|---|---|---|---|---|---|---|
| PM | baseline | 1-3 | 1183 → 1234 | 8.3 → 12.3 | 480.9 → 486.9 | 184.8 → 224.9 | 80,970 → 82,044 | 74/232, 134/171 → 77/227, 140/175 |
| PM | three filters | 1-3 | 719 → 689 | 7.3 → 14.3 | 489.1 → 494.3 | 192.8 → 232.6 | 80,693 → 81,841 | 22/9, 100/77 → 20/6, 86/78 |
| AM | baseline | 1-2 | 563 → 567 | 4.0 → 4.0 | 431.0 → 432.3 | 136.1 → 171.5 | 71,598 → 72,699 | |
| Midday | baseline | 1-2 | 428 → 422 | 0 → 0.5 | 368.3 → 368.5 | 74.7 → 109.4 | 52,754 → 53,582 | |

Trip times move by a few seconds. Mean delay rises by 35 to 40 s in every period, mostly because the reference no longer double-counts junction areas and no longer charges local trips for road they never drove. Vehicle-km rise by 1.3 to 1.6% from the terminal steps now counted. Through cars move within their seed spread (± 114 in PM). The three-filter package now cuts through traffic by 44% against 39% before this change.

The new trip records show the defect's reach. One-link local trips are rare: 1 to 5 per hour in each run, on 1 to 5 flows, consistent with the audit's estimate of 1.2 to 2.0 veh/h of candidate flows. No trip has a negative time. Between 5 and 19 trips per run (of 15,000 to 22,000) have a delay below -0.5 s, the lowest -7.2 s. These are drivers who carry their speed into a link with a lower limit and decelerate gradually, so they drive faster than the reference for a while. They are not clamped.

### Validation suite

g1 (gate-fed single-lane link at 25 mph) moved from 1,608 to 1,590 veh/h against a lower bound of 1,603 when arrivals started entering at the first step at or after them; g2 moved the other way (1,890 to 1,896). It is recorded as an unreviewed deviation in `data/calibration/validation.deviations.json`.

Task 3.5 (regenerating stored results under the new fingerprint) is left to the coordinated regeneration.
