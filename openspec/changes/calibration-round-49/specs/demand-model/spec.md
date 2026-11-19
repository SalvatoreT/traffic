## ADDED Requirements

### Requirement: Uncounted gate totals can be held by one-sided ceilings
When the area's demand config has a `countFit.gatePriorTotals` entry and the stations of a period take simulated membership, the count fit SHALL first fit that period with static membership and no ceilings, and then add a one-sided ceiling station for each gate direction of a gate node that has trips and that no station of kind `gate` in the fit counts. With no entry every output SHALL be unchanged.

#### Scenario: Entry present with membership
- **WHEN** the config has the entry, the period takes simulated membership and a gate direction has no gate station
- **THEN** the fit holds that direction's total near its static-fit total, and a total below the ceiling is not pulled up

#### Scenario: Entry absent
- **WHEN** the config has no entry
- **THEN** the demand file of each view is byte-identical to the build before this change

#### Scenario: Entry present without membership
- **WHEN** the config has the entry and no membership file is in use for the period
- **THEN** the period's flows are identical to the build without the entry

#### Scenario: Gate with a gate station
- **WHEN** a gate direction is named by a gate station that is in the fit for the period
- **THEN** no ceiling station is made for it

### Requirement: Periods without simulated membership have no ceilings
In a period whose stations take static membership, no second fit SHALL run and no ceiling SHALL apply.

#### Scenario: Midday
- **WHEN** the membership file has no runs for a period
- **THEN** the period has no ceiling stations and its fit is the baseline's

### Requirement: The ceiling is the gate's static-fit total plus a tolerance
The ceiling of a station SHALL be the gate's car total in the static fit of the same view and period times (1 + tolerancePct / 100). The station SHALL act only while the assigned total exceeds the ceiling and SHALL have weight `weight`. Tolerance and weight SHALL be labeled assumptions. A ceiling station SHALL NOT change how flows that touch no count are treated.

#### Scenario: Ceiling value
- **WHEN** a gate has 150 veh/h in the static fit and the tolerance is 0
- **THEN** its ceiling is 150 veh/h

#### Scenario: Unconstrained flow
- **WHEN** a flow's only constraint is a ceiling station
- **THEN** it still takes the median rule for flows that touch no count

### Requirement: The ceilings hold on the final flows
After the fit, the median rule and the guard cut, the fit SHALL scale down the car flows of every ceiling gate direction whose total exceeds its ceiling by more than 0.1%, proportionally and alternating over origin and destination sides until none does, and SHALL report the volume removed and the fitted stations within tolerance before and after.

#### Scenario: Soft ceiling leaks
- **WHEN** a gate direction ends above its ceiling after the soft fit
- **THEN** its final total is at most 0.1% above the ceiling and the report states the volume removed

### Requirement: Ceiling stations read no count and are not scored
A ceiling station SHALL take its ceiling only from the static fit of the view being built. It SHALL NOT appear in the stations output file, in the validation split, among the stations scored by `calibrate` or `assess`, or among the stations the simulated membership rule selects.

#### Scenario: Stations output
- **WHEN** a build runs with the entry present
- **THEN** the stations file is byte-identical to the one the build writes without the entry

### Requirement: The fit report states what the ceilings did
With the entry present, the fit report SHALL list, per period, the number of ceiling stations, how many end above their ceiling, the sum of the excess, the five gates furthest above their ceilings with node and street, and the offered car demand of the static fit and of the final fit, in all and by flow type. It SHALL label the tolerance and the weight as assumptions.

#### Scenario: Report lines
- **WHEN** a build runs with the entry present
- **THEN** the report has one line per period with the ceiling station count, the count above ceiling and the excess in veh/h

### Requirement: The loop stops when offered demand outgrows the static fit
After each build from the second pass on, the loop SHALL stop with a non-zero exit, before running that pass's seeds, if the offered car demand of any view and period exceeds the static fit's by more than 3%.

#### Scenario: Growth past the limit
- **WHEN** a build offers 3.1% more car demand than its static fit
- **THEN** the loop stops before the seed runs and the message names the view, period and figures

### Requirement: The membership loop reports the ceilings
When the fit report carries the ceiling lines, the membership loop SHALL include, in its per-pass lines and its report, the number of ceiling stations, the number above ceiling and the excess sum of each build.

#### Scenario: Loop with ceilings
- **WHEN** the loop runs on a config with the entry
- **THEN** each pass line and the report table show the count above ceiling and the excess
