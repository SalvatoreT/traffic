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
- **THEN** the modeled inflow and outflow at the gate are within 10% of the target after the count fit, except where the fit report lists the gate as in conflict with another count

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

### Requirement: Counts win over assumptions
After the count fit, ramp totals at counted ramps SHALL be within 5% of ADT x K, and a counted gate SHALL fall more than 10% below its count only where a count at another place on its paths conflicts with it; the fit report SHALL list every station outside its tolerance and name the assumption that gave way.

#### Scenario: Two gates carrying one street count
- **WHEN** two gates on one street each take the full count of a Caltrans station that lies inside the model area
- **THEN** the station keeps its count, the two gates fall below theirs, and the fit report lists both gates as outside their tolerance

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


### Requirement: Demand is fitted to link counts by assignment
The demand builder SHALL assign every car flow of a period to its free-flow shortest path using the simulator router's generalized cost and scale the origin-destination flows until the assigned volumes match the count targets. Pedestrian and bicycle flows SHALL NOT change, and the method SHALL cite verified entries of `docs/references.md`.

#### Scenario: Router cost
- **WHEN** the builder assigns a flow
- **THEN** the path cost is link time, turn and control penalties and the perceived-cost factor of local streets, and the path respects one-way links and the turn bans of the period

#### Scenario: Station fit table
- **WHEN** the builder finishes
- **THEN** `data/demand/<area>.fit.md` lists, for every period and station, the target, the assigned volume before the fit, after the fit and final, and the ratio

### Requirement: Counts are link targets
Every count the pipeline holds (gate counts, turning-movement legs, Caltrans AADT stations inside the model, ramp ADT) SHALL be a target volume on directed links, or on the trips generated at or absorbed by a gate, with K and the directional split documented as for the gates.

#### Scenario: Ramp station
- **WHEN** a ramp has a published ADT
- **THEN** the volume on its freeway-class link is a target of ADT x K x the period factor

### Requirement: Bounded factors and the median rule
Each flow's cumulative factor SHALL stay within configured bounds, flows that touch no counted link SHALL take the median factor of the counted flows of their type, and the report SHALL give the distribution of the factors and the number of flows at each bound.

#### Scenario: Flows at bounds
- **WHEN** the fit stops
- **THEN** the report gives the factor percentiles, how many flows sit at the lower and the upper bound, which stations no flow crosses, and how much demand each step removed by flow type

#### Scenario: Uncounted flows
- **WHEN** a flow passes no counted link
- **THEN** it takes the volume-weighted median factor of the counted flows of its type (through, local or ramp), and the rule is a config setting

### Requirement: Capacity sanity guard
After the count fit no uncounted link SHALL carry more than 110% of its capacity, taken from the validation suite's measured values per lane or per approach by the control at its end node and held in the area config. Counted links SHALL be exempt and a count SHALL win a conflict with the guard. The report SHALL say the guard is an assumption and list the links that bound.

#### Scenario: Link above capacity
- **WHEN** a free-flow assignment puts 1,200 veh/h on an all-way-stop approach whose capacity entry is 473 veh/h per approach
- **THEN** the flows using it are scaled down toward 520 veh/h unless a count on the same flows prevents it, and the report lists the link, its rule, its capacity and the volume before and after
