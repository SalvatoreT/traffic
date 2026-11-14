## Why

Round 19 left three problems. The Colby St northbound left turn onto Alcatraz Ave carried 13 veh/h against 131 counted, and the trip table cannot reach it: the router prefers Telegraph Ave, so no flow crosses the movement and the multiplicative fit has nothing to scale. Cars entering Colby St, Hillegass Ave and Dana St from Alcatraz Ave fell from 325 to 136 veh/h (360 counted) when the side rule moved the trips of blocks north of Alcatraz Ave off the boundary corners. The 52nd St and Clifton St off-ramps still split 653 and 1,087 against 1,024 and 617 counted.

The owner decided on 2026-11-14 to force the count of the left turn with an assumed set of trips.

## What Changes

- The demand builder reads `assumedMovementFlows` from the area config. Each entry names a counted movement of the volunteer count. The builder adds flows that must make the movement, chosen from the seed table by a detour rule, with a stated through share, and pins their volume in the fit. Flows carry an optional `via` movement in the demand file.
- The simulator honors `via`: the trip is routed to the entry link, through the movement and on to its destination, and keeps the movement across re-plans.
- Census blocks within a set distance outside the study area take the study-area trip-rate factor (`local.countCalibration.neighborM`, `neighborScale`).
- The cost loop (`tools/cost-loop.ts`) gets an objective for the counted off-ramps (`--objective ramp`).
- The record, the demand README and the demand provenance (the Sources page) label the assumed flows an ASSUMPTION.

## Impact

- `crates/sim/src/model.rs`, `route.rs`, `sim.rs`, `tests.rs`
- `tools/build-demand.ts`, `tools/lib/assumed-movements.ts`, `tools/lib/assign.ts`, `tools/lib/fit-counts.ts`, `tools/lib/demand-fit.ts`, `tools/cost-loop.ts`
- `data/demand/rockridge.config.json`
- The demand file changes (new optional `via` field on flows); the network does not.
