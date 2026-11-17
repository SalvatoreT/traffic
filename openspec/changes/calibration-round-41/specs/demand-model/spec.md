## ADDED Requirements

### Requirement: Named movement stations can take simulated membership
Movement and route stations listed in `countFit.throughTargets.measuredStations` SHALL, in the periods whose membership file holds their pairs, take each flow's proportion from the pair's simulated trips that made the movement over the trips the pair offered, with the static share as a prior worth `priorTrips` trips (ASSUMPTION). All trips count, not only through trips. Their weight and target SHALL stay those of the station.

#### Scenario: Movement without simulated pairs
- **WHEN** a listed station has no pairs in the membership file for the period
- **THEN** it keeps its static route-share membership
