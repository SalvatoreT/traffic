## Why

Round 22 left four items open: PM removals of 1.10 per hour on seeds 1 to 10 (rule D16: under 1.0), 10 assumed-movement flows (66 veh/h) with no alternative movement, the 52nd St and Clifton St off-ramps at 683 and 986 veh/h against 1,024 and 617 counted, and 68% of fitted PM stations below GEH 5 against 85%. Tracing the removals and the 52nd St ramp led to one cause. The Synchro worksheet for 52nd St and Shattuck Ave gives the eastbound through 57.2 s of green and the westbound 27.6 s, and the model gave the eastbound approach 33.5 s, the green of its protected left. That approach carries the ramp, so it held the ramp's queue and most of the removals, and it passed 833 veh/h against 1,427 counted.

## What Changes

- A signal observation can name the approach an approach also has green with (`runsWithHeading` in the area config, `runsWith` in the network). The approach has green alone for its through green less the partner's, then with the partner. A link in two phases shows the better of the two states.
- The three observations at 52nd St and Shattuck Ave use it: eastbound 57.2 s (AM 37.7 s) with the westbound 27.6 s (AM 19.4 s).
- `withAlternatives` matches movements on the origin and destination groups of the flow's pair instead of on the names of the intents, so a set and one of its members match. Volumes do not change.
- `calibrate` can write the ramp used by each completed trip (`CAL_DUMP_RAMP_TRIPS`).
- Observed plans for 14 more signals were tried and not kept (record, round 23).

## Impact

- `crates/sim/src/model.rs`, `eff.rs`, `sim.rs`, `tests.rs`, `bin/calibrate.rs`
- `tools/lib/signal-obs.ts`, `tools/lib/types.ts`, `tools/lib/assumed-movements.ts` and their tests
- `data/areas/rockridge.json`, `data/calibration/*` (record, assessment, reports), `docs/references.md`, READMEs
- Network hash c05a22fc9ebe8816 to 5fe8241a6ba1e306, demand hash 8efd5df07ab6557a to 222fb062e8e5dc1c
