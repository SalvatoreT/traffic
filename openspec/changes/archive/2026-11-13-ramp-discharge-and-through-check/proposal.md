## Why

The 52nd St off-ramp carried 544 veh/h in the PM peak against 1,024 counted, and Clifton St 1,216 against 617. Traces of seed 1 show the ramp lane that holds left-turners standing 50 cars deep for most of the hour, while the through lanes at Shattuck Ave and 52nd St were empty during their green. The left lane at the signal discharged about 230 veh/h in 33.5 s of protected green. The cause is the room rule at a node crossing: each vehicle still crossing reserved its length plus a gap on the exit lane until it emerged. A 12 m left turn into a 32 m single-lane link then discharged one car per 3 to 4 s.

The lead also asked for a standing check of modeled through cars on the counted Hillegass Ave and Colby St blocks against observed volume times the observed freeway share, so the through definition cannot drift unnoticed.

## What Changes

- The simulator no longer reserves exit-lane room for vehicles that are already crossing a node (`RESERVE_EXIT_ROOM` false). `update_transit` still holds a vehicle in the node when the lane has no physical room.
- The calibrate report gets a section "Through cars on the counted blocks" and a `throughCheck` entry in its JSON. Each select-link target in the targets file may carry `observedVehPerHour` by period.
- Golden metrics of two small networks move in the third digit and are updated. Validation case c2 now passes and leaves the known deviations.

## Impact

- `crates/sim/src/sim.rs`, `params.rs`, `tests.rs`, `tests/validate.rs`; `crates/sim/src/bin/calibrate.rs`
- `data/calibration/rockridge.targets.json` (observed block volumes), `data/calibration/validation.md`, reports and assessment
- No network or demand change; hashes stay.
