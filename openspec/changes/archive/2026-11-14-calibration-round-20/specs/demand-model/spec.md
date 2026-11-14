## ADDED Requirements

### Requirement: Assumed movement flows are chosen from the seed table
When `assumedMovementFlows` is enabled, the demand builder SHALL give each configured counted turning movement flows from the seed table whose route through it costs at most the configured detour limit times their best route at free flow, without a loop. It SHALL split the movement's station target over them in proportion to their seed volume.

#### Scenario: Movement the router never picks
- **WHEN** a counted movement of 131 veh/h is crossed by 13 veh/h of the table because the router prefers other routes
- **THEN** the build adds flows through it that total 131 veh/h, each carrying a `via` movement

#### Scenario: Through share
- **WHEN** the movement has a configured through share of 0.62
- **THEN** 62% of its volume goes to candidates with no end in the study area and the rest to candidates with an end inside

#### Scenario: No area-specific code
- **WHEN** the movement is named in the area config
- **THEN** no street name appears in the builder code

### Requirement: Assumed movement flows are held in the fit and labeled
The count fit SHALL hold the volume of every flow that carries `via`, so the other flows are fitted to the counts less the assumed ones. The configuration, the fit report, the demand provenance and the calibration record SHALL label the flows an ASSUMPTION and give the through and local volumes and the largest origins and destinations.

#### Scenario: Fit report
- **WHEN** the demand is built with an assumed movement
- **THEN** the fit report lists the counted volume, the candidates, the assumed flows, the through and local veh/h and the detour of the pairs used

### Requirement: Census blocks next to the study area take the study area's trip-rate factor
When `local.countCalibration.neighborM` is set, census blocks whose loading node lies outside the study area and within that distance of it SHALL take `neighborScale` times the study-area factor on their trip ends, and the report SHALL say so.

#### Scenario: Block across Alcatraz Ave
- **WHEN** a block lies within the neighbor distance of the study area, across its boundary
- **THEN** its trip ends are scaled by the study area's factor times `neighborScale`

### Requirement: The cost loop can keep an iteration for the counted off-ramps
With `--objective ramp` the cost loop SHALL keep an iteration only when the PM peak holds its mean removal limit (below 1.0 per hour over the ten seeds), the counted off-ramps move toward their counts by at least 25 veh/h on average and the headline-share error is not worse by more than 0.5 points. Otherwise it SHALL restore the demand without measured delays, and the report SHALL list the ramp count error of every iteration.

#### Scenario: Unstable iteration
- **WHEN** an iteration with measured delays removes 7.9 vehicles per hour in the PM peak
- **THEN** it is not kept, the delays file is removed and the demand is rebuilt with free-flow and BPR costs
