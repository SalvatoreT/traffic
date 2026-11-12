## ADDED Requirements

### Requirement: Routable flows only
Demand SHALL contain only flows whose destination is reachable from the origin in the baseline network.

#### Scenario: Exit-only gate
- **WHEN** a gate is exit-only
- **THEN** no flow originates there

### Requirement: Demand accounting
Freeway ramp trips SHALL equal the sum of ramp volumes (ADT x K x period factor) at the mainline gates, a Caltrans ramp count SHALL be used once however many network ramps alias to it, and cutting the flow list to its size limit SHALL preserve the volume of every origin and destination within its class (ramp, gate to gate, local).

#### Scenario: Ramp totals
- **WHEN** the demand builder finishes
- **THEN** its log shows the modeled off-ramp and on-ramp trips next to the sums of ramp ADT x K, and they agree within 5%

#### Scenario: Gate inflow
- **WHEN** a gate has a count-based target
- **THEN** the modeled inflow and outflow at the gate are within 12% of the target, and the shortfall is the corner-clipping volume that the builder log reports as dropped

### Requirement: Demand audit
The demand builder SHALL write an audit file that classifies the offered car trips of each period by their relevance to the study area and checks the flow at each side of the model against the lanes there.

#### Scenario: Relevance of trips
- **WHEN** the builder finishes
- **THEN** the audit splits the trips into those whose free-flow route touches the study area or its bounding streets, those that come within 400 m of it, and those that stay farther away

#### Scenario: Gate table
- **WHEN** a contributor opens the audit
- **THEN** every surface gate shows its street, class, basis (DATA or ASSUMPTION), daily volume used, peak target and modeled volume in and out, lane capacity and the share of its trips that come within 400 m of the study area

#### Scenario: Cordon check
- **WHEN** the builder finishes
- **THEN** the audit shows, for each side, the modeled inflow and outflow against the lanes times the measured signalized lane capacity, the gate directions above their own capacity and the volume above it

### Requirement: Peripheral trips stay as background load
Gate-to-gate trips that never come within 400 m of the study area SHALL be kept, and a gate's modeled volume SHALL be capped at the smaller of its target and its lane capacity by removing that gate's peripheral gate-to-gate trips only.

#### Scenario: Gate above its lane capacity
- **WHEN** the volume at a gate exceeds its lane capacity
- **THEN** the excess is taken from the gate's peripheral through trips, and any excess that remains is logged

### Requirement: Corner-clipping pairs are dropped
Through pairs whose gates are less than 600 m apart along the model perimeter, or whose free-flow route stays within 300 m of the model edge, SHALL NOT be generated, and the builder log SHALL state the volume each rule removed.

#### Scenario: Corner clipping
- **WHEN** a through trip enters and leaves the model at gates 300 m apart along the perimeter
- **THEN** it is not generated and its volume is counted in the builder log

### Requirement: Counted and ramp volumes are not reduced to pass
Ramp volumes SHALL equal the ramp counts, and no rule SHALL scale a counted gate or ramp volume below its count except the corner-clipping drop.

#### Scenario: Counted gate that the network cannot serve
- **WHEN** a counted volume does not get through the cordon in the simulation
- **THEN** the demand is unchanged and the calibration record reports it as a network or model finding

### Requirement: Class defaults from counts
The default ADT of a gate class without a count SHALL be the median ADT of the counted streets of that class when at least three exist, and the documented value otherwise; no global factor SHALL scale the assumed gates.

#### Scenario: Class with three counted streets
- **WHEN** three or more counted streets have the class of an uncounted gate
- **THEN** the gate takes their median ADT and the build log lists the streets and values

### Requirement: Counted gates keep their counts in the balancing step
When the through inflow supply and outflow demand differ, the demand builder SHALL scale the assumed gates and leave the counted gates at their targets, unless the counted volume alone exceeds the other side.

#### Scenario: PM peak surplus of outflow
- **WHEN** the residual outflow demand exceeds the inflow supply
- **THEN** the outflow of counted gates stays at the count and the assumed gates' outflow is scaled down

### Requirement: Count scaling without a clamp
The scale factor that fits walking and biking volume to the counts at the counted intersection SHALL NOT be clamped, and SHALL be applied so that the persons passing that intersection in the final flow list equal the count within 2%.

#### Scenario: Prior far from the count
- **WHEN** the unscaled bicycle volume at the counted intersection is ten times the count
- **THEN** the factor is about one tenth and the final flow list matches the count

