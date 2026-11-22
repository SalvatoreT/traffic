## 1. Setup and diagnosis

- [x] 1.1 Reproduce the round-40 demand (930a1d90b2d1) with `npm run data`
- [x] 1.2 Freeze guard rails and keep rule in design.md (D3, D4) before any changed demand is run
- [x] 1.3 `calibrate --select-od` writes the pairs of every link station
- [x] 1.4 Twenty PM seeds of the round-40 demand and of the cross-validation demand with station pairs
- [x] 1.5 Failing-station table (PM and AM) with class and location; conservation check; Forest St and 62nd St feeders

## 2. Mechanism

- [x] 2.1 Link stations take simulated membership (`measuredStations`), tests
- [x] 2.2 Training view takes station membership from `measuredStationsTraining` (checked through the build note of the training view; the loader is in the build script and has no unit test)

## 3. Steps

- [x] 3.1 S1 bounding-street and Telegraph Ave / Alcatraz Ave stations, PM seeds 1 to 20, rails
- [x] 3.2 S2 class (b) interior stations, PM seeds 1 to 20, rails
- [x] 3.3 S3 or AM as D6 allows
- [x] 3.4 AM Telegraph Ave southbound: where the time is

## 4. Evaluation and record

- [x] 4.1 Tests, WASM parity, trace identity, validation suite
- [x] 4.2 `npm run assess -- --publish --noise`; PM seeds 11 to 20
- [x] 4.3 Round 42 in the record, area note and caveat, `tsx tools/import-osm.ts`
