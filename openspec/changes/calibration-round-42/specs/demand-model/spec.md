## ADDED Requirements

### Requirement: Named link stations can take simulated membership
Link stations listed in `countFit.throughTargets.measuredStations` SHALL, in the periods whose membership file holds their pairs, take each flow's proportion from the pair's simulated trips on the station's links over the trips the pair offered, with the static share as a prior worth `priorTrips` trips (ASSUMPTION). Weight and target SHALL stay those of the station.

#### Scenario: Trip counted per station link
- **WHEN** `calibrate --select-od` runs and a trip uses two links of one station
- **THEN** the station's pairs count that trip twice, as the station's link flow does

#### Scenario: Link station without simulated pairs
- **WHEN** a listed link station has no pairs in the membership file for the period
- **THEN** it keeps its static link membership

### Requirement: Training view takes station membership from its own runs
When `countFit.throughTargets.measuredStationsTraining` names a file, the training view SHALL take the stations' simulated pairs from that file (runs of the cross-validation demand) instead of the shipped membership file, so no run of a demand fitted to held-out counts informs the cross-validation demand.

#### Scenario: Training file missing
- **WHEN** the training view is built and the named file does not exist
- **THEN** the listed stations keep their static membership in that view and the build notes it
