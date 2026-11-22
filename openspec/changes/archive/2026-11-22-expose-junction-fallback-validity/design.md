## Context and evidence

Audit date: 2026-11-15. Source revision: `415df88c33224b433abc52e52fbed5132849be63`. Priority P2 for validity diagnostics and preservation of physical constraints. Evidence is a source trace; there is no measured local incidence or demonstrated collision in this finding.

At `crates/sim/src/sim.rs:2117-2123`, `conflict_free` calls `transit_blocks` only while the waiting time is below `CONFLICT_FALLBACK_S`. `begin_crossing` repeats the same conditional at lines 2631-2639. `params.rs` sets that threshold to 120 seconds and describes it as dropping the in-node conflict check. Once the threshold is reached, neither path asks whether an existing crossing vehicle still occupies the relevant conflict point.

At `sim.rs:2124-2127`, the 90-second `YIELD_FALLBACK_S` returns permission without approach-gap or stop-order checks. The 45-second courtesy branch at lines 2173-2177 skips an approaching vehicle when it is moving below queue speed. All three mechanisms are explicit assumptions, but they represent different changes to behavior and must not be combined in one undifferentiated count.

`transit_blocks` at lines 2097-2108 already distinguishes a geometric conflict from occupancy at the same time. It compares clearance of the first vehicle, including its tail, against the second vehicle's arrival at the conflict point with `NODE_SAFE_S` margin. Two crossing paths can therefore be used simultaneously when their occupancy intervals do not overlap. A test that forbids every pair of geometrically conflicting movements would reject valid concurrency and alter capacity unnecessarily.

`check_invariants` at lines 1312-1337 has a comment claiming node-transit bookkeeping checks, but its body inspects lane order, vehicle membership and position only. It never walks `self.transit`. Existing metrics count gridlock removals; they cannot establish how often other recovery mechanisms affected junction discharge.

## Decisions

D1. Count behavior changes at the point they affect a decision. Record separate reasons for courtesy, approach-gap/stop-order fallback, physical-conflict bypass attempts and any replacement recovery. Distinguish eligibility or blocked attempts from admissions that the ordinary rule would reject. Record actual recovery admissions once, with node, incoming/outgoing movement, simulation time, wait and reason. Reports give counts, elapsed-time rates and an explicit exposure denominator for admission shares. Repeated evaluation on successive ticks must not inflate the number of actual admissions. Keep aggregate data always; bound detailed event storage or stream it in diagnostics.

D2. Keep physical conflict exclusion unconditional in production. Courtesy changes who gets priority; it does not make two vehicles able to occupy a conflict point together. Any recovery policy must respect the modeled physical occupancy check and downstream-space constraint. If a policy reroutes or removes a vehicle, report that event as a recovery action and retain its conservation accounting. Silently ignoring the conflict test after a wait is rejected. The existing gap-acceptance framework [Brilon1999] and roundabout treatment [Rodegerdts2010] do not establish the current fallback thresholds as measured behavior.

D3. Audit the actual node state. Check that each alive agent belongs to exactly one valid lane or transit record, that transit flags and movement/node/exit membership agree, and that arrival, progress and exit are consistent. Check conflict-point occupancy intervals using vehicle length, crossing progress and the model's margin. For vehicles held in the node by a blocked exit, use actual occupancy rather than an already-expired planned crossing time. Keep valid simultaneous nonoverlapping movements legal. These are implementation invariants; none depends on a fitted tolerance for the number of physical violations.

D4. Treat fallback dependence as a validity result. Run matched network, demand, scenario, horizon and seeds with the current recovery policy, with behavioral fallback disabled, and with the proposed physically valid recovery policy. Record removals, blocked admissions, backlog, throughput, travel times and safety surrogates beside the fallback events. Distinguish effects during initialization from effects during the measured hour. A run that becomes congested when recovery is disabled is evidence to investigate, not a reason to hide the comparison. No acceptance percentage for fallback use is proposed without an empirical or methodological basis [FHWA-TAT3-2019; TfL-TMG4].

D5. Interpret safety indicators within their coverage. A run that exercises an unsupported physical bypass cannot support an unqualified claim that its junction interactions are valid merely because its rear-end TTC count or removal count is low. Reports must state the recovery policy and its diagnostics. This is not a claim that a modeled conflict is a predicted crash; safety surrogates require their own definitions and validation [Mahmud2017; FHWA-SSAM2008].

## Prospective tests

The following tests are implementation tasks, not tests run during this audit:

1. Build a synthetic node state with an active transit record for which `transit_blocks` returns true. Place another head vehicle at or above the current 120-second wait threshold, with a legal turn and downstream room. Both permission and final admission must remain blocked under the production recovery policy. Change only crossing progress until the conflict point clears; admission may then proceed if the other rules allow it.
2. Use two paths that geometrically conflict but have separated occupancy intervals. The invariant checker must accept them and the admission rule must retain the legitimate capacity benefit.
3. Hold a crossing vehicle at its exit after its planned crossing time has elapsed. The checker must use the occupied part of the crossing and must not treat the vehicle as gone.
4. Corrupt a fixture with duplicate transit membership, inconsistent movement ownership or simultaneous lane/transit membership. Each must fail with an actionable diagnostic; valid bookkeeping must pass.
5. Repeatedly evaluate an eligible waiting head without admitting it. Attempt counters may rise according to their documented definition, but actual admission and recovery-event counts must remain unchanged until the transition occurs.

## Dependencies and limits

Add diagnostics before changing the policy so the current model's dependence can be measured. Coordinate validity summaries with other review proposals; use one event vocabulary across native, WASM, CLI and stored results. Measurement fixes in `repair-local-trip-measurement-integrity` should precede interpretation of travel-time or exposure changes in the sensitivity comparison.

This proposal cannot establish an observed local failure rate from source code. The first implementation report must supply those measurements, including zero counts when the fallback is unused. Tasks remain unchecked and the proposal remains open until a later implementation is tested.

## Implementation, 2026-11-15

### What the diagnostics found

The audit's source trace holds. Under the old engine, `conflict_free` and `begin_crossing` skipped `transit_blocks` once a head had waited `CONFLICT_FALLBACK_S`, and `check_invariants` never read `self.transit`.

The bypass itself is rare. In PM peak seeds 1 to 3 the old engine admitted 13.3 vehicles an hour past an occupied conflict point, out of about 795,000 node entries. Courtesy admitted 149 and the approach-gap/stop-order fallback 80 (table below).

The new invariant checker found a larger defect in the same code path. A vehicle that finished its crossing without room on its exit lane kept its planned exit speed. It entered only when the gap behind the lane's last vehicle covered braking from that speed at 4 m/s², which a standing queue never frees. Its planned crossing time had expired, so `transit_blocks` treated it as gone, and `pick_lane` did not count it on the exit lane. More vehicles crossed toward the same lane and waited in the node with it. At the end of a PM hour the old engine held 677 to 791 vehicles this way (seeds 1 to 3), some for the whole hour. The largest groups were at 60th St/Market St (229 vehicles on one movement), Sacramento St, the Warren Freeway merge (183 on one movement), San Pablo Ave and Shattuck Ave. AM held 222 to 300 and midday 46 to 67. These vehicles never finished their trips, were never removed, and are absent from `gridlockRemoved`, which was 0 in every old-engine baseline run. The low removal count was therefore not evidence of valid junction operation, which is the concern in D5.

### Decisions

D6. Policies. `Config::junction_recovery` selects `physical` (the default), `no_behavioral` or `historical`. `historical` reproduces the old engine bit for bit (checked against the pre-change PM seed 1 run) and exists only for the comparison in D4. `no_behavioral` drops courtesy and the approach-gap/stop-order fallback.

D7. Physical exclusion. Under `physical` and `no_behavioral`, an occupied conflict point blocks permission and admission at any wait. A head that would have used the bypass is counted under `conflictBypass` as invoked and blocked; admissions stay zero. Courtesy (`YIELD_COURTESY_S`) and the yield fallback (`YIELD_FALLBACK_S`) keep their values and change priority only. Their thresholds remain assumptions with no measured basis; [Brilon1999] supplies the gap-acceptance framework, not these waits.

D8. Vehicles held at a node exit. Each of the following is labeled ASSUMPTION in code:
- A vehicle that reaches the end of its path enters as soon as the gap behind the lane's last vehicle is 0.5 m, at no more than the speed that lets it stop behind that vehicle at 4 m/s², the deceleration the old emergence rule already assumed. It is held only while the lane is physically full.
- While a vehicle stands at a lane's entry, that lane offers no room to admissions from upstream.
- A vehicle that would reach a conflict point covered by another vehicle in the node (one held after this vehicle was admitted) stands short of the point.
- A vehicle held in the node for `GRIDLOCK_REMOVE_S` is removed and counted in `gridlockRemoved` and `heldRemovals`, so conservation accounting includes it. As with `waits_on_motorway`, movements from one motorway link to another wait instead.

Three alternatives were tried on PM seed 1 and rejected. Removing held vehicles without stopping the accumulation turned the 700-odd trapped vehicles into 714 removals. Counting every vehicle in transit, held or not, against the exit lane's room held back normal platoon discharge into short junction links. Letting a held vehicle brake at its comfortable deceleration `b` before entering cut left-turn and roundabout entry capacity in the validation suite more than the rule above does.

D9. Diagnostics. `Metrics::junctionRecovery` reports the policy, node entries (the denominator), and for each reason the head-seconds invoked, the head-seconds blocked, and admissions. Measured totals start at t = 0; settle-interval totals are kept separately. An admission is counted once, when the crossing starts. Repeated evaluation adds head-seconds only (test `repeated_evaluation_of_a_blocked_head_counts_time_not_admissions`). `Simulation::recovery_events` keeps up to `RECOVERY_LOG_MAX` events with time, node, movement, wait and reason, and counts the rest in `eventsDropped`. `recovery_by_node` gives per-node totals.

D10. Invariants. `check_invariants` now checks that every live car and cyclist is in exactly one lane or one transit record, and that the record agrees with the vehicle's link, movement and flags. It also checks that no two vehicles in a node cover a shared conflict point at the same moment, using the occupied part of each path with progress capped at the end of the path for held vehicles. Merges onto different lanes of a multilane exit are legal. Vehicles following each other on one movement are not checked against each other, because the node has no car-following model. Under `physical` the check passed at every 5 s sample of a full PM hour (seed 2) and of an AM hour with the three-filter scenario; under `historical` it failed at 547 of the 720 samples of PM seed 1, mostly where a vehicle held at its exit still covered a conflict point.

### Matched sensitivity comparison (tasks 3.1, 3.2)

Native runs of one simulated hour after the 120 s settle, the published network and demand (network hash `5fe8241a6ba1e306`), seeds as listed, mean ± sample standard deviation across seeds. "iv3" is the published three-filter package `#v1;a=rockridge;p=pm_peak;s=mn,9q9p642ut2,175.355~mn,9q9p3fr7b5~mn,9q9p3cq6m9`. Street columns give through cars an hour on the busiest study-area block of each street and direction. Admission counts are per hour from t = 0.

| Period | Scenario | Policy | Through cars/h | Removed | Mean delay, s | Backlog | Courtesy | Yield fallback | Bypass | Held removals | Bypass blocked, head-s | TTC | Hillegass N/S, Colby N/S |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| PM | baseline | historical | 630 ± 44 | 0 | 126.5 ± 4.8 | 6 | 149 | 80 | 13.3 | 0 | 0 | 9.7 | 68/107, 119/76 |
| PM | baseline | no_behavioral | 1168 ± 95 | 79 | 182.7 ± 9.4 | 497 | 0 | 0 | 0 | 7.3 | 3677 | 55.7 | 73/218, 155/156 |
| PM | baseline | physical | 1183 ± 175 | 8.3 | 184.8 ± 10.7 | 473 | 461 | 193 | 0 | 1.7 | 248 | 33.7 | 74/232, 134/171 |
| PM | iv3 | historical | 266 ± 7 | 0.3 | 131.6 ± 5.3 | 5 | 173 | 90 | 28.0 | 0 | 0 | 1.7 | 9/0, 45/28 |
| PM | iv3 | no_behavioral | 617 ± 84 | 101 | 189.0 ± 10.9 | 547 | 0 | 0 | 0 | 7.3 | 4686 | 27.3 | 16/6, 89/59 |
| PM | iv3 | physical | 719 ± 77 | 7.3 | 192.8 ± 13.0 | 505 | 466 | 207 | 0 | 2.0 | 265 | 41.3 | 22/9, 100/77 |
| AM | baseline | historical | 425 ± 10 | 0 | 105.1 ± 6.3 | 4.5 | 126 | 51 | 13.5 | 0 | 0 | 6.0 | 69/67, 66/56 |
| AM | baseline | no_behavioral | 542 ± 0 | 31 | 135.1 ± 14.7 | 203 | 0 | 0 | 0 | 0 | 3058 | 6.5 | 62/84, 72/82 |
| AM | baseline | physical | 563 ± 27 | 4.0 | 136.1 ± 7.5 | 203 | 259 | 97 | 0 | 1.5 | 90 | 6.0 | 64/82, 71/77 |
| Midday | baseline | historical | 368 ± 26 | 0 | 71.6 ± 0.6 | 1.0 | 46 | 8.5 | 1.5 | 0 | 0 | 5.0 | 50/74, 68/56 |
| Midday | baseline | no_behavioral | 427 ± 6 | 2.5 | 75.4 ± 3.1 | 1.0 | 0 | 0 | 0 | 0 | 490 | 3.5 | 47/80, 70/64 |
| Midday | baseline | physical | 428 ± 1 | 0 | 74.7 ± 1.4 | 2.0 | 61 | 13 | 0 | 0 | 0.2 | 1.0 | 48/77, 70/64 |

PM and iv3 use seeds 1 to 3; AM and midday use seeds 1 and 2. Node entries are about 780,000 an hour in PM and 710,000 in AM, so every recovery admission share is below 0.1%.

Most of the change comes from D8, not from the bypass. The old engine's bypass decided about 13 entries an hour. The vehicles it kept inside nodes acted as a sink of roughly 700 vehicles an hour in PM, mostly on the west side and at the Warren Freeway merge. Once they stay in the network, queues spill back: the SR-24 gate at Grove Shafter Freeway holds most of the backlog (409 to 490 waiting trips at the end of the PM hour, 244 in AM seed 1), PM mean delay rises by 58 s, and through cars on the Trapezoid's side streets nearly double, mostly southbound on Hillegass Ave and Colby St. Midday, with the fewest trapped vehicles, changes least. Removing courtesy and the fallback (`no_behavioral`) adds about 70 gridlock removals an hour in PM and 27 in AM and leaves the other figures close to `physical`, so those behavioral rules mainly break deadlocks that would otherwise end in removal.

The three-filter package still cuts through traffic, but by less: 39% under `physical` against 58% under `historical`. Its stored and published figures came from the old engine.

These results do not mean the new figures are calibrated. The demand was fitted on an engine that hid about 700 vehicles an hour in PM, so the calibration and every stored result need to be redone before the new engine's figures are interpreted [FHWA-TAT3-2019; TfL-TMG4]. No demand or threshold was changed here.

### Primitive validation

The validation suite moves with the new rules. Under `physical`, b9 (two lanes, 10% left with a pocket, 500 opposing veh/h per lane) discharges 777 veh/h per lane against 812 to 1,071, down from 848. e6 (two-way stop minor through at 1,000 per direction) gives 76.5 against 45 to 76, up from 72. Both are recorded in `data/calibration/validation.deviations.json` as unreviewed deviations. The existing deviations f2 and f3 (roundabout entry) fall further, to 425 and 93 veh/h. b4 and b12 stay inside their ranges. The old values relied on vehicles waiting inside the node, where any number could queue unseen. The order in `data/calibration/rockridge.record.md` applies: these primitives need review before demand is tuned to the new engine.

### Not done here

Task 3.3 (calibration reports, stored results and their user-facing interpretation) waits for the recalibration that the user coordinates. `Metrics` carries the new `junctionRecovery` object, so results produced after this change include it. Pedestrian courtesy in `ped.rs` (a driver stops yielding to a pedestrian who has not stepped off after `YIELD_COURTESY_S`) involves no conflict-point occupancy and is unchanged.

## Primitive review of calibration round 28, 2026-11-15

The validation suite was rerun before any demand tuning, as `data/calibration/rockridge.record.md` requires. To find which rule moved which case, the suite was run with each part of D8 switched back to its `historical` form, one at a time, and over seeds 1 to 5. Two rules caused the new failures; neither is a fault of physical exclusion itself.

D11. Side-by-side starts. Lane choice and the room check looked only at the vehicles already on the exit lane, not at those still crossing toward it. Two vehicles leaving two approach lanes in the same step both picked the lane with most room (lane 0 on a tie) and arrived on top of each other. Under `historical` the second one waited in the node unseen; under `physical` it entered 0.5 m behind the first and braked hard. Now lane choice ranks lanes by their room less the vehicles crossing toward them (length plus s0 = 2 m [Treiber2014]), and a vehicle does not start toward a lane while a vehicle from another approach lane would still be within the needed room when it emerges (its position projected at its exit speed). Followers from the same approach lane are spaced by their queue and are not checked against each other: checking them too cut single-lane discharge from 1,896 to 1,686 veh/h. ASSUMPTION.

D12. Emergence behind a moving leader. A vehicle that reached its exit close behind a moving leader entered at once at the reduced speed of D8 and then braked toward the IIDM gap, which cost discharge on every straight crossing of a saturated link (g1). It now waits until it could brake behind the leader from its exit speed at 4 m/s², the safe deceleration b_safe of MOBIL [Kesting2007], and enters at that speed; the gap opens within seconds because the leader moves. Behind a leader below `QUEUE_V` (standing or crawling) D8 stands, so a standing queue never traps a vehicle in the node, which was the defect of the old engine. An IIDM-consistent entry speed [Treiber2014] was tried instead and rejected: it held followers until the full desired gap opened and cut saturation flow (a2) from 1,677 to 1,423 veh/h.

D13. New case i5 (lane drop). The SR-24 eastbound off-ramp toward Martin Luther King Jr Way drops from two lanes to one at a node, and with D8 that drop passed about 1,212 veh/h against 1,896 for the same road with one lane throughout. In the PM peak it backed up across the 3-lane off-ramp to the Grove Shafter Freeway gate, which held 347 to 490 waiting trips at the end of the hour. i5 measures the flow past a drop against the single-lane flow, range 0.75 to 1.0 (ASSUMPTION, the merge bound of i4). With D11 and D12 it is 0.81.

Validation suite, seed 1 (veh/h per lane unless a ratio), before round 28 (the head of this change) and after:

| Case | Range | Historical | Physical before | Physical after |
| --- | --- | --- | --- | --- |
| b2 two lanes through | 752 to 1,003 | 837 | 753 | 837 |
| b9 two lanes, 10% left | 812 to 1,072 | 814 | 772 (fail) | 814 |
| b12 protected left | 647 to 1,015 | 717 | 654 | 789 |
| c1 / c2 signals 100 m apart (ratio) | 0.75 to 1.15 | 0.97 / 0.94 | 0.87 / 0.82 | 0.79 / 0.75 |
| e6 two-way stop, minor through at 1,000 | 45.5 to 75.8 | 72.0 | 76.5 (fail) | 72.0 |
| g1 gate-fed link, 25 mph | 1,603 to 1,980 | 1,644 | 1,590 (fail) | 1,668 |
| i5 lane drop (ratio) | 0.75 to 1.0 | not run | 0.64 | 0.81 |
| f2 / f3 circle entry | 496 to 744 / 333 to 499 | 489 / 172 | 432 / 110 | 405 / 138 |

c1 and c2 fell because their reference, the same signals 1,000 m apart, recovered with b2 (2,040 to 2,355 veh/h), not because the 100 m case lost flow (1,428 to 1,452 veh/h on the adaptive plan). The `historical` value of c2 relied on vehicles stored in the node between the two signals. b9 and c2 sit at their lower bounds on seed 1 and fall below them on some other seeds; e6 lies above its range on some seeds under every policy, so it is seed noise around a 76 veh/h flow. f2 and f3 failed before this change and remain reviewed deviations: every traffic circle of the network is outside the study area and, but one in the hills, carries circulating flows in the range of f1, which passes. The reviewed relevance of every remaining failure is in `data/calibration/validation.deviations.json`.

Effect on the Rockridge PM peak, seeds 1 to 4, same demand (hash 83bdd362657a), head of this change against round 28: removals 10.5 to 4.0 an hour, entry backlog 1.73% to 0.18% of spawned trips (under 2% in 2 of 4 seeds before, 4 of 4 after), the Grove Shafter Freeway gate from 403 waiting trips (seed 1) to none in the top list, completed trips 24,157 to 24,652, through cars on the study area's local streets 1,182 to 1,055 an hour. The counted blocks moved less: Hillegass Ave SB 245 to 206, Colby St SB 234 to 210, Colby St NB 161 to 154, Hillegass Ave NB 91 to 84. The southbound blocks stay far above their ranges, so that excess is not mainly a junction-capacity effect.

3.3b, 2026-11-22. The Comparison tab shows a plain-language junction validity note for the scenario and, when comparing, today's traffic (`src/lib/recovery.ts`, `recoverySummary`). It names the policy, states the admissions an hour that courtesy and the yield fallback made with node entries as the denominator, and says the run does not pass the physical junction check when the policy is `historical` or any admission went past an occupied conflict point. No numeric acceptance bound is applied, in line with D4. It labels the waits as assumptions, calls held removals cars cleared from gridlock, and says a low removal count does not establish valid junction operation (D5). A result without the object gets a sentence saying so. Stored files are unchanged; `docs/data-files.md` describes every field of `junctionRecovery`.
