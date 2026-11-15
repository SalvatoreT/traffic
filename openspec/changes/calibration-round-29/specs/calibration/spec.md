## ADDED Requirements

### Requirement: Calibration runs can select the junction recovery policy
The calibration command SHALL accept `--junction-recovery physical|no_behavioral|historical` (default `physical`), pass it to every seed of a multi-seed run, and record it in the run settings of the report manifest. Under `historical` the end-of-run node invariant check SHALL be skipped, because that policy lets vehicles share a conflict point by design.

#### Scenario: Comparing the repaired and the old junction engine
- **WHEN** a contributor runs `calibrate --seeds 1-4 --junction-recovery historical`
- **THEN** every seed runs under the historical policy, the reports carry the policy in their settings and junction recovery section, and the run is not stopped by the conflict-point invariant
