## Why

Two simulator primitives fail validation with no reviewed exception. Permissive left turns at signals are served too fast against moderate and heavy opposing flow: cases p2 and p3 give 402 and 369 left turns an hour against 157 to 303 and 32 to 167 by the method of [Fambro1991]. The queue-first model that follows the method was built in round 33 and left off because the Rockridge PM peak got less stable with it. And a gate whose first link forks holds trips for a free branch behind trips for a queued one (case h4, 0.43 against 0.9 to 1.1). On 2026-11-18 the project lead decided that p2 and p3 stay unreviewed and get a repair, that l1 and b13 stay unreviewed, and that the h4 fix lands together with the next simulator change so that proposals are searched once.

## What changes

- Diagnosis of why the queue-first model costs stability, on PM seeds 1 to 10 with and without it on today's network and demand: where the extra cars are cleared from gridlock, which movements they were making and how long each had been held by a full exit.
- The queue-first permissive-left model of [Fambro1991] becomes the default (`Config::queue_first_left`, now on unless set to false). `calibrate --no-queue-first-left` restores the earlier rule for A/B checks.
- A trip waiting at a gate waits only behind trips for the same branch of a forking first link (the round 38 patch), and a planned trip passed over behind a blocked branch no longer counts toward the 512-trip scan of the gate.
- Validation: cases.json bounds follow the green shares the adaptive plans now give; p2, p3 and h4 leave the deviation list; b4, which now fails, joins it unreviewed.
- Evidence: validation before and after, tests, WASM parity and trace identity, ten-seed runs of all three periods on the shipped demand and the cross-validation demand before and after. No demand rebuild or refit.

## Capabilities

### New Capabilities

### Modified Capabilities

- `traffic-simulation`: queue-first permissive left turns by default; per-branch waiting at forking gates.

## Impact

- `crates/sim/src/sim.rs`, `crates/sim/src/model.rs`, `crates/sim/src/params.rs`, `crates/sim/src/bin/calibrate.rs`, `crates/sim/src/validate.rs`, `crates/sim/data/validation/cases.json`.
- `data/calibration/validation.md`, `validation.json`, `validation.deviations.json`, `data/calibration/README.md`.
- The simulator fingerprint changes, so every stored proposal result is out of date. Proposals are not searched again in this change.
