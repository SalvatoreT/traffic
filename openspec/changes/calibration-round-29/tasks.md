## 1. Measurement

- [x] 1.1 Add `--junction-recovery` to `calibrate` (skip the conflict-point invariant under `historical`).
- [x] 1.2 Measure PM arterial travel times and approach delays on the physical and historical engines, four seeds each, against the observed speeds and the signal primitives.

## 2. Primitives and signals

- [x] 2.1 Repair circle entry (gap acceptance by critical headway) and its validation case; remove f2 and f3 from the deviations.
- [x] 2.2 Try coordination of signals along a street (common cycle, simultaneous offsets) at 800 m and 150 m; revert (worse on Telegraph Ave and removals).
- [x] 2.3 Apply the observed PM timing of College Ave / Claremont Ave / 62nd St; revert (more removals over 20 seeds, through cars within noise).

## 3. Route choice

- [x] 3.1 Sensitivity of the guided share, the switch band and the local cost factor; no change.

## 4. Assessment and record

- [x] 4.1 Rerun the validation suite, the ten-seed `calibrate` summaries of all three periods, the Rust and TypeScript tests and the WASM parity check.
- [x] 4.2 Write round 29 into the calibration record (move round 16 to the archive) and update the area's `calibration` note; regenerate `public/data/areas.json`.
