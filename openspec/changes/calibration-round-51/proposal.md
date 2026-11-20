## Why

Rounds 48, 49 and 50 (simulated station membership, then gate ceilings, then node ceilings) all end with the PM held out at 13 of 24 and the D5 headline shares at 2 of 4. The two southbound to-freeway shares fall short in the simulator: in round 50 Hillegass Ave SB 68 observed against 51.3 modeled, Colby St SB 45 against 34.7.

The demand fit treats the two kinds of constraint differently. Count stations take each pair's membership from the simulator's own routes (rounds 48 to 50). The observed route shares do not. `tools/lib/share-targets.ts` (`routeShareTally`, called from `load()` in `tools/lib/demand-fit.ts`) builds them from the static assignment's sampled routes and never reads `countFit.throughTargets.measured`. The through-car targets keep static membership as well, because the loop writes `hits: {}` and `runs: 0` into the top level of its membership file. So the fit balances the shares on routes the simulator does not use, while the counts are balanced on the routes it does use.

The lead's hypothesis, not a finding: that mismatch causes the D5 failures, because the fit meets its share targets on the static routes while the simulator's share, on its own routes, is a different number.

One fact found while preparing: no through-car target exists in the shipped config. Commit c503d84 removed `fitThrough` and `observedCorridorThroughVehPerHour` from the targets file, so `countFit.throughTargets` builds no target (the fit report says "No comparable unique-corridor through counts enter this fit"). The through half of this round is built and tested, but on the shipped data only the share half can change the model.

## What changes

- The loop pools the `blocks` of the collected `sod-<period>-<seed>.json` files (per select-link run, the origin-destination pairs of every trip that used a link of the run) in each pass and writes them into the membership file it already writes. Two pools: the through-car pool (trips with an end in the study area left out, the existing `pooledMembership`) goes to the top level of each period, where `demand-fit.ts` already reads it; the share pool (every trip) goes under `blocks`. Same equal-weight pooling over passes, same evidence checks and same leak guards as for stations.
- Select-link share constraints may take simulated membership. A share's denominator membership of a pair is the pair's simulated share of trips that hit the block, with the static fraction as a prior worth `priorTrips` trips (the stations' rule). Its numerator is the same for pairs whose origin ("from") or destination ("to") is a freeway node, and 0 for the others, which is the definition the report binary scores the share on. Ramp via-street shares stay on static routes because nothing exports them per pair. A share whose block has no simulated hit keeps static routes and is listed.
- Two sub-switches in the candidate's `simulatedMembership` entry, `throughTargets` and `shares`. Absent, rounds 48 to 50 run unchanged.
- The fit report gives, for every share and every through target, the fit's own figure on simulated membership and on the static routes, against its target. The loop prints the same per build and writes them to its report.
- One candidate, `shares-membership`: the round 50 node ceilings exactly (`allNodes`, static-fit anchor, tolerance 0, weight 10) with simulated membership for stations, through targets and shares. The loop, the three-seed screen, and ten seeds if the screen passes.
- A runbook for the laptop. The keep rule, the screen, the 3% abort and the 10%-below warning stay as in round 50.
- No simulator, network or split change, and no edit to `calibrate.rs`.

## Impact

Tools only. The simulator fingerprint stays d45a275dd7be0713cec6a64394b7d8a9 and the network 53c823f20d9165ed. With the entry absent the shipped demand stays 9cdebdabf05c4460 and the training demand 2f9ae152b9bbf78e. With the entry present the config hash changes (so the provenance in the demand files does), and the demand periods stay the baseline's until a membership file is in use. D5 shares are both fit targets and keep-rule criteria, as they are in the baseline (weight 3). Passing D5 would show that the fit can now reach its own share targets in the simulator. The held-out station counts remain the independent check. If the candidate is adopted, the published proposals, results and redistribution files need a new search. If it fails the keep rule, nothing published changes.
