## 1. Diagnosis

- [x] 1.1 Add `calibrate --od-costs` (router cost snapshots once a minute; driven, arterial and best routes of each through trip, split into cost terms; slow links).
- [x] 1.2 Repair the trip timings reset at time zero; match records and timings by trip id; extend the initial-load test.
- [x] 1.3 Break down the through cars on Hillegass Ave SB, Colby St SB, 62nd St EB and Forest St EB by group and route class, physical against historical, PM seeds 1 to 4; route-noise sensitivity.

## 2. Removal hot spots

- [x] 2.1 Rank removal nodes over ten PM and AM seeds; check each against OSM tags.
- [x] 2.2 Read the lane count of one-way chains from `turn:lanes` when `lanes` is missing, after chain merging (no link id changes); importer test.
- [x] 2.3 Add `osmTagOverrides` to the area config; correct the northbound lane count of Telegraph Ave north of 55th St (ASSUMPTION pending a field check); importer test.

## 3. Demand

- [x] 3.1 `npm run data` on the repaired network (frozen split unchanged).
- [ ] 3.2 Drop the held-out GEH guard from the cost loop's acceptance rule; run the loop to its stop rule.

## 4. Evaluation and record

- [ ] 4.1 Validation suite, ten-seed `calibrate` summaries of all three periods, Rust and TypeScript tests, WASM parity.
- [ ] 4.2 Write round 30 into the calibration record (round 17 moved to `rockridge.record-archive-2.md`); update the area's `calibration` note; regenerate `public/data/areas.json`.
