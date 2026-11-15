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
