## ADDED Requirements

### Requirement: The cap on loop passes is an option and the default is three
The membership loop SHALL take the largest number of passes as an option (`--iterations`). Without it the loop SHALL run at most three passes, as in calibration rounds 48 to 53. A larger cap SHALL NOT change the builds, the seed runs, the pooling or the stop rule of the passes before it: the first three passes of a run with a larger cap SHALL be those of a run with the default, and the build after pass 2 SHALL be the final build of the default run.

#### Scenario: Default
- **WHEN** the loop runs without `--iterations`
- **THEN** it runs at most three passes and its dry-run plan lists the steps of rounds 48 to 53

#### Scenario: A larger cap
- **WHEN** the loop runs with `--iterations 8` and the stop rule has not held
- **THEN** passes 0 to 2 build the same demands as with the default, and the build of pass 3 uses the pool of passes 0 to 2

### Requirement: The loop says which lines block its stop rule
After each pass from the second on, the loop SHALL log the views and periods whose flow or membership change exceeds the stop limit, with their ratios. When it ends at its cap with the rule unmet, it SHALL say so, name the lines of the last pass that blocked it, and record that in its report. The stop limit and the rule SHALL NOT change.

#### Scenario: One line above the limit
- **WHEN** every view and period is at or below the limit except the training view in one period
- **THEN** the loop runs another pass and logs that line

#### Scenario: Cap reached
- **WHEN** the cap is reached with the rule unmet
- **THEN** the report says the rule was not met by the cap and lists the blocking lines

### Requirement: Per-pass diagnostics are report only
The loop SHALL write a diagnostics report after each pass. The diagnostics SHALL NOT enter station selection, the pooled files, any build or the stop rule, and a failure to compute them SHALL NOT stop the loop.

#### Scenario: Diagnostics fail
- **WHEN** a diagnostic cannot be computed
- **THEN** the loop logs a warning and carries on

#### Scenario: No effect on the pool
- **WHEN** the loop runs with and without a watch file
- **THEN** the pooled membership files and the demands are byte-identical

### Requirement: The diagnostics report convergence and the judged stations
The diagnostics SHALL give, per pass, view and period, the flow and membership change over the seed standard error, the offered car demand and its share of the static fit, and the recent judged stations within GEH 5 on the pass's own seeds: fitted in the shipped view, held out in the training view. Judged stations SHALL be link stations with an hourly count of a recent year that is neither a daily total nor a scaled copy of another period.

#### Scenario: Held-out side
- **WHEN** the diagnostics count stations in the training view
- **THEN** only the effective held-out stations are counted, on the simulated flow of that view

### Requirement: A watch file names stations to follow
The loop SHALL accept an optional watch file naming stations by id and period. For each, per pass, the diagnostics SHALL list the counted value, the shipped fit's final value and the simulated seed mean on the shipped and the training demand. The code SHALL name no street, and a station missing from the stations file SHALL be left out.

#### Scenario: Missing station
- **WHEN** the watch file names a station that is not in the stations file
- **THEN** it is left out of the table and the loop carries on

### Requirement: The loop keeps a copy of each pass's pooled files
After each pass the loop SHALL copy the pooled membership file of each view into the loop folder under the pass number, so that the pool of any pass can be compared with a published file.

#### Scenario: Pool after pass 2
- **WHEN** the loop has finished pass 2
- **THEN** the loop folder holds the pooled file of each view for passes 0, 1 and 2, and the last equals the file the final build reads when the loop stops after pass 2
