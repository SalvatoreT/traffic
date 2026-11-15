## 1. Diagnosis
- [x] 1.1 `CAL_DUMP_PATH_TRIPS` in `calibrate`; trails of Colby St northbound (entries, exits, joiners, origin groups)
- [x] 1.2 Off-ramp destination mix, Clifton St terminal movements against the 2010 count, approach delays against the worksheets
- [x] 1.3 Seed flows at the fit bounds by type and pair; static assignment against simulator at the older stations; turns against approach totals
## 2. Demand builder
- [x] 2.1 `exemptRamps` in the recency rule and the `ramp` flag of stations; test
- [x] 2.2 `splitByRamp` and `offRampLinks`, `ramps.choice`; tests
- [x] 2.3 `wholeStreet` on a movement and on an intent; test
- [x] 2.4 Config: ramp choice, ramp weights, Colby St northbound whole-street intents at 0.47 and 0.15; notes label every ASSUMPTION
## 3. Data
- [x] 3.1 `npm run data` (network unchanged, demand 8695ddc28b152c35); the demand still has its intent indexes and per-intent totals sum to the through count
- [x] 3.2 Calibration note and caveat of `data/areas/rockridge.json`; `public/data/areas.json` regenerated
## 4. Measure
- [x] 4.1 PM, AM and midday, seeds 1 to 10, before and after (assessment, reports)
- [x] 4.2 Variants: changes taken apart, lower bound 0.05, local trip rates at 60%
- [x] 4.3 The 63rd St scenario of round 22 and the six-filter scenario: no via-trip loops
## 5. Record
- [x] 5.1 Round 25 in the record, demand README steps 65 to 68, calibration README
- [x] 5.2 `npm test`, archive
