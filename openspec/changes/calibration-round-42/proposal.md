## Why

After round 40 the one status rule that still fails in the PM peak is the count-station rule: GEH below 5 at more than 85% of recent stations. PM fitted stations pass at 82% and held-out stations at 54%; AM held-out stations pass at 74%. The project lead asked for a round that finds the causes of the failing stations and fixes them, with the rule and its ranges left as they are.

## What Changes

- A diagnosis of every recent PM and AM station that fails GEH 5, with the fit's own assigned flow, the simulated flow over twenty seeds, its location and a class for the miss.
- `calibrate --select-od` also writes the origin-destination pairs of every link station. Link stations named in `countFit.throughTargets.measuredStations` can take their membership from simulated trips, as the through targets and the movement stations do. The training view can take that membership from runs of its own demand (`measuredStationsTraining`), so held-out stations stay out of sample.
- The mechanism tried on the stations the diagnosis points to, one cause at a time, under guard rails frozen before results.
- A look at the AM Telegraph Ave southbound travel time.
- Round 42 in the calibration record; the project lead's decisions of 2026-11-17 recorded.

## Capabilities

### New Capabilities

### Modified Capabilities

- `demand-model`: named link stations can take simulated membership; the training view can use its own membership file.

## Impact

- `crates/sim/src/bin/calibrate.rs` (report binary only; the engine and the fingerprint f0df1aabc323 are unchanged), `tools/lib/demand-fit.ts`, `tools/lib/through-membership.ts`, `tools/through-membership.ts`, `tools/build-demand.ts`; the demand config, the membership file and the shipped demand if a step is kept.
