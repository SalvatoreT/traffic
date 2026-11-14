## Why

Round 20 forced the Colby St northbound left turn by spreading 131 veh/h over the seed table in proportion to volume. The owner asked a different question about the five counted Alcatraz Ave turn-ins: through cars should be explained and shaped by intent (where the driver comes from, where they are going, which arterial they avoid), such as southbound Telegraph Ave traffic cutting through Colby St to reach SR-24 eastbound, or Berkeley traffic bypassing College Ave by way of Hillegass Ave. The model exists to put numbers on through cars on Hillegass Ave and Colby St, and today nothing says why a modeled through car is there.

## What Changes

- Named approach groups in the area config (`approachGroups`): sets of gates and outside nodes with a resident's label. Membership is derived from the network (gate street names and classes, entry or exit role, compass sector from the study area), with overrides. The demand build writes `data/demand/<area>.groups.json`.
- An intent map in the calibrate report (single run and ten-seed summary): through cars per hour on each counted block and on the study area's residential streets by (origin group, destination group), with the arterial the trip would otherwise use on a free-flow route that avoids the study area's local streets, next to the intents the counts imply (`intentMap` in the targets file; each marked OBSERVED or ASSUMPTION).
- Assumed movements can carry `intents`: {label, fromGroup, toGroup, share or vehPerHour}. Candidates are the seed flows between the intent's groups that pass the detour limit and the loop rule. The plain flow of each pair gives up the trips the assumed flow carries.
- Config for the Colby St northbound left and right, Hillegass Ave northbound turn-outs, and the four southbound turn-ins from Alcatraz Ave, all ASSUMPTION where a number is inferred.

## Impact

- `tools/lib/approach-groups.ts`, `tools/lib/assumed-movements.ts`, `tools/build-demand.ts`
- `crates/sim/src/bin/calibrate.rs`, `calibrate/intent.rs`, `calibrate/multi.rs`
- `data/areas/rockridge.json`, `data/demand/rockridge.config.json`, `data/calibration/rockridge.targets.json`
- The demand file changes; the network and the simulator do not.
