## ADDED Requirements

### Requirement: Assumed movement flows
When `assumedMovementFlows` is enabled, the demand builder SHALL give each configured counted turning movement flows that must make it, so that the modeled movement matches the count. The movement SHALL be read from the volunteer count by junction, approach and exit, and its volume per period SHALL be the station target of that movement. The flows SHALL be chosen from the seed table: a flow is a candidate when its route through the movement costs at most the configured detour limit times its best route at free flow and the route does not loop, and the volume SHALL be split over the candidates in proportion to their seed volume, with the configured share over flows that have no end in the study area. Each assumed flow SHALL carry a `via` movement, and the count fit SHALL hold its volume. The configuration, the fit report, the demand provenance and the calibration record SHALL label the flows an ASSUMPTION and say how many veh/h are through and how many local.

#### Scenario: Movement the router never picks
- **WHEN** a counted movement of 131 veh/h is crossed by 13 veh/h of the table because the router prefers other routes
- **THEN** the build adds flows through it that total 131 veh/h, the fit leaves them unchanged, and the report lists the through and local volumes and the largest origins and destinations

#### Scenario: No area-specific code
- **WHEN** the movement is named in the area config
- **THEN** no street name appears in the builder code

### Requirement: Census blocks next to the study area take the study area's trip-rate factor
When `local.countCalibration.neighborM` is set, census blocks whose loading node lies outside the study area and within that distance of it SHALL take `neighborScale` times the study-area factor on their trip ends, and the report SHALL say so.

#### Scenario: Block across Alcatraz Ave
- **WHEN** a block lies within the neighbor distance of the study area, across its boundary
- **THEN** its trip ends are scaled by the study area's factor times `neighborScale`
