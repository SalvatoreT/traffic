## 1. Reproduction

- [x] 1.1 Check that `npm run data` reproduces network f9fa09a5726644d7, demand 1c798217e72fb1ba and the cross-validation demand a367850a13850985 of round 36.

## 2. Field observation and judged zone (area config)

- [x] 2.1 Claremont Ave / Russell St as an all-way stop from the resident's field observation (`osmTagOverrides`, `stop=all`); network unchanged.
- [x] 2.2 `judgedZone.bufferM` (200 m, ASSUMPTION) with its justification; README row and type.

## 3. Reporting layer (no simulator change)

- [x] 3.1 `calibrate`: per-seed near/far split, far chains into the zone, sensitivity at half and double the buffer, far places, zone backlog, bounding-street queues (`calibrate/zone.rs`); runs identical, fingerprint f0df1aabc323 unchanged.
- [x] 3.2 Ten-seed summary judges D16 on the judged count.
- [x] 3.3 `tools/lib/verdict.ts`, `tools/lib/assess.ts`, `tools/assess.ts`: judged count, near/far text, zone backlog, queues.
- [x] 3.4 `tools/cost-loop.ts`: stability from the runs on the judged count; acceptance extracted to `keptIteration` with the rule otherwise unchanged.
- [x] 3.5 Tests: zone definition, split, chain guard, acceptance, assessment text.
- [x] 3.6 D16 text in `openspec/specs/calibration/spec.md` and `data/calibration/README.md` (the main spec is synced now, so archiving later needs `--skip-specs`).

## 4. Fit and evaluation

- [x] 4.1 Delay-feedback loop to convergence under the re-scoped rule; every PM run checked against the stored runs of round 33/35.
- [x] 4.2 Tests, WASM parity and trace identity, validation suite.
- [x] 4.3 PM seeds 1 to 10 and 11 to 20, AM and midday seeds 1 to 10 (`npm run assess -- --publish --noise`), `--od-costs`.

## 5. Record

- [x] 5.1 Round 37 in the calibration record; area `calibration` note and caveat; `tools/import-osm.ts` rerun.
