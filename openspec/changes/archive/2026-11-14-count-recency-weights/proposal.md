## Why

Round 23 left the station rule at 69% of fitted PM stations below GEH 5 against 85%. 56 of the 84 failures are the 100 turning-movement stations of the 2010 and 2013 environmental-review counts (44 pass, the model is at 0.82 of them), while the resident volunteer count of February 2025 passes 94 of 107. The fit treats a count from 2010 like one from 2025. The owner decided: "Let's make sure the newer data is more important than the 2010/2013 data".

## What Changes

- Every count station carries its source and count year, derived from the provenance (file name year, count date, ramp release year, Caltrans count year). A source without a year is treated as old.
- The demand fit multiplies a station's weight by a band weight of its age, from `countFit.recency` in the area config. A weight of 0 takes the stations out of the fit and scores them as held out. The weights are an ASSUMPTION and were tested at 1, 0.5, 0.25 and 0.
- An optional annual growth rate per source scales a count from its year to the reference year. No rate is set: the published counts that were checked do not show growth.
- The fit report and the assessment show GEH below 5 per source and count year, fitted and held out, and state the station rule overall and for sources counted in the last five years.
- Ashby Ave and Claremont Ave: a slip link counts on the legs it joins, so the leg stations match the count.

## Impact

- `tools/lib/recency.ts`, `tools/lib/demand-fit.ts`, `tools/lib/intersection-counts.ts`, `tools/lib/demand-ramps.ts`, `tools/lib/assess.ts`, `tools/build-demand.ts`, `tools/assess.ts` and their tests
- `data/demand/rockridge.config.json`, `data/demand/*` reports, `data/calibration/*` (record, assessment), `data/areas/rockridge.json` (`calibration.note`), `docs/references.md`, READMEs
