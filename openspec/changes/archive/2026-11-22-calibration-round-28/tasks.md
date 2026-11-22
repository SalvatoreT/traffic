## 1. Primitives

- [x] 1.1 Rerun the validation suite and trace every failing or moved case to the junction rule that moved it.
- [x] 1.2 Repair the rules that made a primitive wrong (side-by-side starts, entry behind a moving leader), add the lane-drop case, keep physical exclusion; native and WASM parity.
- [x] 1.3 Review every remaining failure in `validation.deviations.json` with relevance and follow-up.
- [x] 1.4 Report the junction recovery policy and its figures in the calibration reports and the assessment.

## 2. Demand

- [x] 2.1 Rebuild network and demand (`npm run data`); mark the AM and midday targets of PM-only turning-count legs `derived`.
- [x] 2.2 Try training-safe demand levers against fitted stations, headline shares, through cars and removals; record each variant and keep none that breaks another rule.

## 3. Assessment and record

- [x] 3.1 Run the ten-seed assessment of all three periods with the cross-validation demand and publish it with the noise file and `calibrate` reports.
- [x] 3.2 Write round 28 into the calibration record and update the area's `calibration` status, note and caveat; regenerate `public/data/areas.json`.
- [x] 3.3 Run the Rust and TypeScript tests and strict OpenSpec validation.
