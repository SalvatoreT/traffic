## Why

Round 22 left four items open: the PM peak removals were 1.10 per hour on seeds 1 to 10 (rule D16: under 1.0), ten assumed-movement flows (66 veh/h) had no alternative movement, the 52nd St and Clifton St off-ramps carried 683 and 986 veh/h against 1,024 and 617 counted, and 68% of the fitted count stations passed GEH 5 against the 85% rule. Tracing the removals and the 52nd St ramp led to one cause: the observed signal plan at 52nd St and Shattuck Ave (a Synchro worksheet) gives the eastbound through 57.2 s of green and the westbound 27.6 s, and the model showed the eastbound approach only the 33.5 s of its protected left. That approach carries the ramp, so it held the ramp's queue and the removals, and it passed 833 veh/h against 1,427 counted.

## What Changes

- Observed signal timing can name the approach an approach also has green with (`runsWithHeading` in the area config, `runsWith` in the network). The approach then has a phase alone for its whole through green less the partner's green, and the partner's phase with it. A node whose approach is in two phases shows the better of the two states.
- The three observations at 52nd St and Shattuck Ave use it: eastbound 57.2 s (AM 37.7 s) with the westbound 27.6 s (AM 19.4 s).
- Observed plans for signals on Telegraph Ave, Claremont Ave and College Ave from the two traffic studies already in `docs/references.md` (PM peak only): cycle and the green of the cross street or the split phases, as measured in the worksheets.
- `withAlternatives` matches movements on the origin and destination groups of the flow's pair and not on the names of the intents, so intents that name a set and one of its members (`west-side` and `west-side-other`) are alternatives of each other. Volumes do not change.
- `calibrate` can write the ramp used by every completed trip (`CAL_DUMP_RAMP_TRIPS`, a debugging aid like `CAL_DUMP_TRIPS`).

## Impact

- `crates/sim/src/model.rs`, `eff.rs`, `sim.rs`, `tests.rs`, `bin/calibrate.rs`
- `tools/lib/signal-obs.ts`, `tools/lib/types.ts`, `tools/lib/assumed-movements.ts` and their tests
- `data/areas/rockridge.json` (signal observations), `public/data/*` (network and demand rebuilt, not committed)
- `data/calibration/rockridge.record.md` (round 23; rounds 11 to 15 moved to the archive file), assessment and reports
