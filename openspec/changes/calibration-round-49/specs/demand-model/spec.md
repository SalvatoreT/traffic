## ADDED Requirements

### Requirement: Uncounted gate totals can be held by one-sided ceilings
When the area's demand config has a `countFit.gatePriorTotals` entry, the count fit SHALL add, for every period and view, a one-sided ceiling station for each gate direction (origin or destination) of a gate node that has trips and that no station of kind `gate` in the fit counts in that period. With no entry the stations, the fit and every output SHALL be unchanged.

#### Scenario: Entry present
- **WHEN** the config has the entry and a gate direction has no gate station
- **THEN** the fit holds that direction's total at most near its ceiling, and a total below the ceiling is not pulled up

#### Scenario: Entry absent
- **WHEN** the config has no entry
- **THEN** the demand file of each view is byte-identical to the build before this change

#### Scenario: Gate with a gate station
- **WHEN** a gate direction is named by a gate station that is in the fit for the period
- **THEN** no ceiling station is made for it

### Requirement: The ceiling is the gate's own pre-fit total plus a tolerance
The ceiling of a station SHALL be the gate's car total before the fit times (1 + tolerancePct / 100). The station SHALL act only while the assigned total exceeds the ceiling and SHALL have weight `weight`. Tolerance and weight SHALL be labeled assumptions.

#### Scenario: Ceiling value
- **WHEN** a gate offers 100 veh/h before the fit and the tolerance is 10
- **THEN** its ceiling is 110 veh/h

### Requirement: Ceiling stations read no count and are not scored
A ceiling station SHALL take its ceiling only from the offered trips of the view being built. It SHALL NOT appear in the stations output file, in the validation split, among the stations scored by `calibrate` or `assess`, or among the stations the simulated membership rule selects.

#### Scenario: Stations output
- **WHEN** a build runs with the entry present
- **THEN** the stations file is byte-identical to the one the build writes without the entry

### Requirement: The fit report states what the ceilings did
With the entry present, the fit report SHALL list, per period, the number of ceiling stations, how many end above their ceiling, the sum of the excess, the five gates furthest above their ceilings with node and street, and the offered car demand before and after the fit. It SHALL label the tolerance and the weight as assumptions.

#### Scenario: Report lines
- **WHEN** a build runs with the entry present
- **THEN** the report has one line per period with the ceiling station count, the count above ceiling and the excess in veh/h

### Requirement: The membership loop reports the ceilings
When the fit report carries the ceiling lines, the membership loop SHALL include, in its per-pass lines and its report, the number of ceiling stations, the number above ceiling and the excess sum of each build.

#### Scenario: Loop with ceilings
- **WHEN** the loop runs on a config with the entry
- **THEN** each pass line and the report table show the count above ceiling and the excess
