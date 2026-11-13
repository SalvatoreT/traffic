## ADDED Requirements

### Requirement: Through cars on the counted blocks
For each select-link target that lists `observedVehPerHour` for the period and a freeway share, the calibration report SHALL list the observed volume, the observed freeway share, their product, the modeled through cars per hour (neither trip end in the study area) and the modeled trips per hour with a freeway end, and write the same in the JSON as `throughCheck`.

#### Scenario: Colby Street northbound
- **WHEN** the targets file gives Colby Street northbound an observed 174 veh/h and a freeway share of 0.47
- **THEN** the report row shows 174, 47%, an expected 82 veh/h and the two modeled figures
