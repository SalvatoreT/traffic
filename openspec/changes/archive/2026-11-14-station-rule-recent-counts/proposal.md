## Why

After round 24 the station rule fails on all counts (PM 68% of fitted stations) and holds on counts from the last five years (PM 87%). The owner decided on 2026-11-14 that the rule is judged on recent counts, with the older counts' pass rate reported beside it, and that PM peak is no longer experimental (it passes D16 and D5).

## What Changes

- The station rule is judged on counts of the last `recentYears` years (config: `countFit.recency`). The assessment, the fit report, the Sources page and the calibration note report the older counts' pass rate beside it and state that the recent set rests mostly on one day of volunteer counting.
- The assessment prescribes the status from D16, D5, the station rule on recent counts (fitted and held out) and the through-car check, per period.
- `experimentalPeriods` of Rockridge is empty. The status is set as the assessment prescribes.
- The banner and the Sources page keep the caveat visible for a calibrated area (`calibration.caveat`).

## Impact

- `tools/assess.ts`, `tools/lib/assess.ts`, `tools/lib/recency.ts`, `tools/lib/types.ts`, `src/App.tsx`, `src/components/Sources.tsx`, `src/lib/caveat.ts` and tests
- `data/areas/rockridge.json`, `data/calibration/rockridge.assessment.md`, `data/calibration/rockridge.record.md`, `openspec/specs/calibration/spec.md`
