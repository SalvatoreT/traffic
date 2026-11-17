## ADDED Requirements

### Requirement: Through cars on a street run are fit targets
With `countFit.throughTargets.enabled` true, each select-link block marked `fitThrough` SHALL be a PM fit target: cars an hour with neither trip end in the study area that use any link of the run, each counted once. The target SHALL be the middle of the range from the whole-street cars to the block volume less the cars ending along the street. Pinned assumed-movement flows SHALL stay pinned and count toward it.

#### Scenario: Range and target
- **WHEN** a block lists 79 whole-street cars, a block volume of 160 and 40 cars ending along it for the PM peak
- **THEN** the PM target is 99.5 cars an hour with the range 79 to 120

### Requirement: Through targets in the other periods are one-sided
In periods other than the PM peak a through target SHALL be the PM range times the period's volume factor, acting only while the period's figure is above the scaled upper end, and SHALL be marked derived (ASSUMPTION).

#### Scenario: AM below the limit
- **WHEN** the AM figure on a street run is below the PM upper end times the AM volume factor
- **THEN** the target does not act in the AM fit

### Requirement: Through targets follow the training-view rule
In the training view a through target whose street run holds a held-out block SHALL be left out. With `enabled` set to `report`, the figures SHALL be reported and the fit SHALL be the one built without them.

#### Scenario: Report only
- **WHEN** `enabled` is `report`
- **THEN** the built demand equals the demand built without through targets, and the fit report lists the through figures

### Requirement: Through-target membership can come from simulated trips
When `countFit.throughTargets.measured.file` exists for the same network, a through flow's proportion on a street run SHALL be its pair's simulated trips counted on the run over the trips the pair offered, pooled over the file's runs, less the pinned flows' static share, with the static route share as a prior worth `priorTrips` trips (ASSUMPTION). Otherwise the static route share SHALL be used.

#### Scenario: Pooled membership reproduces the report
- **WHEN** `tools/through-membership.ts` writes the file from ten seed runs of a demand
- **THEN** the counted trips per hour on each run, summed over pairs and divided by the runs, equal the mean through figure of those runs' calibrate reports

#### Scenario: Network changed
- **WHEN** the file names another network
- **THEN** the build uses static route shares and says so in the fit report
