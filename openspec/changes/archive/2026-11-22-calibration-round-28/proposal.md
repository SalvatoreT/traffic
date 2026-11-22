> Round 28 ran on 2026-11-15 (`data/calibration/rockridge.record-archive-*.md`). Archived late, on 2026-11-22; its requirements were merged into the specs by hand first, so the archive ran with --skip-specs.

## Why

Three engine repairs (expose-junction-fallback-validity, repair-local-trip-measurement-integrity, repair-signal-timing-contracts) changed what the Rockridge baseline does. The old engine hid 677 to 791 vehicles an hour inside junction nodes in the PM peak; with them kept physical, through cars on the Trapezoid's side streets nearly doubled and the validation suite showed new failures. The demand had not been tuned for the new engine, and the published calibration note still described the old one.

## What changes

- Primitives first, as `data/calibration/rockridge.record.md` requires: every failing validation case was traced to the rule that moved it. Two rules of the new junction policy were wrong and are repaired in `crates/sim` (recorded as D11 to D13 of expose-junction-fallback-validity): vehicles from two approach lanes no longer start toward one exit lane side by side, and a vehicle behind a moving leader waits for braking room and enters at its exit speed. A lane-drop case (i5) joins the suite. The remaining failures are reviewed in `data/calibration/validation.deviations.json`.
- Calibration reports and the assessment state the junction recovery policy and its admissions and held-vehicle removals.
- Oakland turning-count legs, counted in the PM only, are marked `derived` for the AM and midday (user decision of 2026-11-15).
- Demand tuning was tried on the training-safe levers (measured-delay feedback, neighbor-block trip rates) and judged on fitted stations, shares, through cars and stability only. No variant was kept; the shipped demand is unchanged.
- The ten-seed assessment of all three periods, the `calibrate` reports, the calibration record (round 28) and the area's `calibration` note are regenerated on the new engine.

## Capabilities

### Modified Capabilities

- `demand-model`: derived targets now include the AM and midday targets of turning-count legs counted in the PM only.

## Impact

- `crates/sim/src/sim.rs`, `crates/sim/src/sim/modes.rs`, `crates/sim/src/validate.rs`, `crates/sim/src/bin/calibrate.rs`, `crates/sim/src/bin/calibrate/multi.rs`: simulator fingerprint changes.
- `tools/build-demand.ts`, `tools/assess.ts`, `tools/lib/assess.ts`, `tools/cost-loop.ts`.
- `data/calibration/*`, `data/areas/rockridge.json`, `public/data/areas.json`. Stored proposal results, text pages and previews are stale until the user regenerates them.
