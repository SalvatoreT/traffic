## MODIFIED Requirements

### Requirement: Through cars on the counted blocks
For each select-link target that lists `observedVehPerHour` for the period and a freeway share, the calibration report SHALL list the observed volume, the observed freeway share, the observed freeway-end trips (their product), the modeled through cars per hour (neither trip end in the study area) and the modeled trips per hour with a freeway end, and write the same in the JSON as `throughCheck`. When the target also lists `wholeStreetVehPerHour` the report SHALL give an observed through range from that value up to the block volume less `endAlongVehPerHour`, and say whether the modeled through cars are inside it. When the target is marked `fitThrough`, the figure is a target of the demand fit: the report SHALL say so, mark the row as fitted in the JSON (`fitted: true`), and name the checks that stay independent of it (held-out count stations, headline freeway shares, stability, arterial travel times).

#### Scenario: Colby Street northbound
- **WHEN** the targets file gives Colby Street northbound 174 veh/h, a freeway share of 0.47, 102 whole-street cars and 29 end-along cars
- **THEN** the report row shows 82 observed freeway-end trips, an observed through range of 102 to 145 and the modeled figures

#### Scenario: Fitted through figure
- **WHEN** the Colby Street northbound target is marked `fitThrough`
- **THEN** the row is marked fitted, and the report says the figure is fitted and is no longer an independent check
