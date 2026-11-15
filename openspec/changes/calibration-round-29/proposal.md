## Why

Round 28 left the Hillegass Ave and Colby St southbound through cars far above the volunteer count's ranges, and found that no demand lever fixes them. The lead's hypothesis for round 29: the arterials around the Rockridge Trapezoid are too slow relative to reality on the repaired engine, because several capacity primitives sit at the floor of their published ranges, so the model diverts too much traffic onto the side streets. This round tests that hypothesis before changing anything, in the record's order: primitives, then signals, then route choice, then demand.

## What changes

- Measurement first. Arterial travel times and delay by approach on Telegraph Ave, College Ave, Claremont Ave and Alcatraz Ave, PM peak, on the current engine and on `junctionRecovery: historical`, against the observed peak-period speeds of [ACTC-LOS2014] and [ACTC-LOS2018] and the signal capacity cases of the validation suite. `calibrate` gains `--junction-recovery` for that comparison.
- Circle entries yield by critical headway. Each circulating vehicle blocks a circle entry for t_c - t_f / 2 = 3.6 s, ending when its tail has passed the entry (the single-lane entry model of [Rodegerdts2007] in the Siegloch form). Validation cases f2 and f3 now pass; the case measures entry against circulating traffic that goes on to a later exit and reports the shared-exit figure in its note.
- Tried and reverted, each with its measured effect: coordinating signals along a street within 800 m or 150 m on a common cycle with simultaneous offsets ([FHWA-STM2008] ch. 6), and the observed 2010 PM timing of the College Ave / Claremont Ave / 62nd St signal ([SafewayCollege-DEIR2011]). Route-choice parameters were varied for sensitivity only.
- The demand is unchanged (83bdd362657a2305), the network is unchanged (a64c2a63399e5423). The ten-seed `calibrate` summaries of all three periods, the validation suite, round 29 of the calibration record and the area's `calibration` note are regenerated.

## Capabilities

### New Capabilities

### Modified Capabilities

- `traffic-simulation`: circle entry by critical headway.
- `calibration`: `calibrate --junction-recovery`.

## Impact

- `crates/sim/src/sim.rs`, `crates/sim/src/params.rs`, `crates/sim/src/validate.rs`, `crates/sim/src/bin/calibrate.rs`: simulator fingerprint changes; native and WASM stay bit-identical.
- `data/calibration/*`, `data/areas/rockridge.json` (calibration note), `public/data/areas.json`, `docs/references.md`.
- Stored proposal results, text pages and previews were made on an older engine and stay stale until the user regenerates them.
