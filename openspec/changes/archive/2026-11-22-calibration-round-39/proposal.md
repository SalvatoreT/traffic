> Round 39 ran on 2026-11-17 (`data/calibration/rockridge.record-archive-*.md`). Archived late, on 2026-11-22; its requirements were merged into the specs by hand first, so the archive ran with --skip-specs.

## Why

On 2026-11-16 the project lead decided ("Yes, fit to the cut-through counts") that the four counted through-car figures on Hillegass Ave and Colby St (each direction, PM peak, resident volunteer count of Feb 25, 2025) become targets of the demand fit. The app exists to give cut-through numbers for these streets. Three rounds of targeted fixes and a compact-extent model left all four above or at the top of their ranges. The cost: the figures stop being an independent check.

## What Changes

- A calibration target type: through cars on a named street run. Any select-link block of an area's targets file marked `fitThrough` becomes a fit target, its range taken from the whole-street cars, the block volume and the cars ending along the street; the target is the middle of the range.
- The fit counts a flow's proportion on the run from simulated trips (`calibrate --select-od`, ten seeds, pooled over iterations by successive averages), with the static route share as a prior. A new route feature (`any`) gives the static share. `tools/through-membership.ts` writes the pooled file.
- AM and midday take the PM range times the period volume factor as a one-sided upper limit (ASSUMPTION).
- Guard rails and a stopping rule, frozen in `design.md` before results.
- Round 39 in the calibration record; the calibration README, spec, area note and caveat, and site copy say the four figures are fitted and name the checks that stay independent.

## Capabilities

### New Capabilities

### Modified Capabilities

- `demand-model`: through-car targets on street runs enter the fit, with simulated membership.
- `calibration`: the four through-car figures are fitted targets; the independent checks are named.

## Impact

- `tools/lib/assign.ts`, `tools/lib/fit-counts.ts`, `tools/lib/demand-fit.ts`, `tools/build-demand.ts`, `tools/through-membership.ts`, `tools/lib/through-membership.ts`; tests.
- `data/demand/rockridge.config.json`, `data/calibration/rockridge.targets.json`, `data/demand/rockridge.through-membership.json`; the shipped demand.
- No change to the simulator engine (fingerprint f0df1aabc323). A demand change makes the published proposals out of date for a new search, which this round does not run.
