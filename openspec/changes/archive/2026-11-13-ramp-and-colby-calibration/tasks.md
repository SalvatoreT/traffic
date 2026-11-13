## 1. Data
- [x] 1.1 Find and verify public sources; add them to `docs/references.md` with what was read
- [x] 1.2 `data/demand/rockridge.intersection-counts.json` with provenance; demand README, seventeenth round
- [x] 1.3 Travel-time targets in the targets file

## 2. Demand build
- [x] 2.1 `tools/lib/intersection-counts.ts` with tests; stations in the fit; counted ramps replace ADT times K; shared ramp rows
- [x] 2.2 Fit report station tables per period (file size limit)
- [x] 2.3 Local factor bound 10; census blocks spread over nearby junctions; provenance notes

## 3. Network
- [x] 3.1 Signal observations by heading, location and own phase, with tests; timings at two signals
- [x] 3.2 Drive-through ways left out

## 4. Simulator
- [x] 4.1 Own phase of an observed approach; crosswalk with the approach beside it
- [x] 4.2 Marked left lanes, lane sorting ahead, keeping to a side; validation case b12
- [x] 4.3 Route costs by turning movement
- [x] 4.4 Local trips start and end along the block, with tests; goldens updated with the reason

## 5. Assessment and record
- [x] 5.1 Travel-time table in the assessment
- [x] 5.2 Validation suite, ten seeds for three periods, cross-validation assessment, noise file
- [x] 5.3 Area note and period status; record, seventeenth round; known limits

## 6. Specs
- [x] 6.1 Delta specs, validate, archive after `npm test` and `npm run build`
