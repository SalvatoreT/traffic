> Round 40 ran on 2026-11-17 (`data/calibration/rockridge.record-archive-3.md`). Archived late, on 2026-11-22, with the specs already current; no spec sync was run.

## Why

Round 39 brought two of the four fitted through-car figures inside their ranges on seeds 1 to 10; Colby St NB and Hillegass Ave SB stayed above, and the two ten-seed sets disagree by up to 13 cars an hour. The project lead asked for a round that judges on more seeds, raises the targets' weight if that helps, checks the Colby St NB off-ramp traffic against data, and tests a second membership iteration.

## What Changes

- Through figures judged on twenty seeds, with the standard error of each mean in the assessment.
- Membership pooled over more runs; the through targets' weight tried at 2, 4 and 8 under the round-39 guard rails, frozen again before results.
- A data check of Colby St NB (exits, whole-street count, entries) before any route constraint.
- Round 40 in the calibration record; area note and caveat.

## Capabilities

### New Capabilities

### Modified Capabilities

- `calibration`: the assessment gives the standard error of each through figure.

## Impact

- `tools/lib/assess.ts`, `tools/assess.ts`; `data/demand/rockridge.config.json`, `data/demand/rockridge.through-membership.json`; the shipped demand if a step is kept. No simulator engine change.
