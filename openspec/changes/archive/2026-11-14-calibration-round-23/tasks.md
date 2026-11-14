## 1. Housekeeping
- [x] 1.1 Move rounds 11 to 15 of the record to the archive file (record 181 KB to 105 KB)
## 2. Simulator and importer
- [x] 2.1 `ApproachGreen.runs_with`, two-phase membership in `own_phases` and `plan_with_observation`, best state per link in `update_signals`
- [x] 2.2 `runsWithHeading` in `signal-obs.ts` and the network types
- [x] 2.3 Tests: lead-lag plan and green time in the simulator, partner lookup and missing partner in the importer
- [x] 2.4 `CAL_DUMP_RAMP_TRIPS` in `calibrate`
## 3. Demand builder
- [x] 3.1 `withAlternatives` matches on the pair; test
- [x] 3.2 Rebuild the demand; volumes identical, 455 of 455 PM flows with an alternative
## 4. Config
- [x] 4.1 52nd St and Shattuck Ave observations: eastbound through green and `runsWithHeading`
- [x] 4.2 `npm run data` regenerates `public/data` (network 5fe8241a6ba1e306, demand 222fb062e8e5dc1c)
## 5. Measure
- [x] 5.1 Removals over seeds 1 to 20, every site; PM ten seeds, AM and midday before and after
- [x] 5.2 Ramp split diagnosis, station classification
- [x] 5.3 Observed plans for 14 signals tried in three groups, none kept
- [x] 5.4 Owner's scenario check
## 6. Record
- [x] 6.1 Round 23 in the record, README and reference notes, calibration note in the area config
- [x] 6.2 `npm test`, archive
