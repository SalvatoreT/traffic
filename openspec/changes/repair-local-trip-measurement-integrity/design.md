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
