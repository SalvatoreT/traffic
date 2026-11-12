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

### Requirement: The fit stops on a criterion and names the stations it cannot meet
The count fit SHALL stop when every count station that can still move is within a configured tolerance, or when the worst error of those stations no longer improves, and the report SHALL give the iterations used, the reason it stopped and the final worst error. A station whose flows sit on the bound it would need to move, or that is held off its target by another station that shares its flows or by the capacity guard, SHALL be listed with the stations that pull the same flows the other way.

#### Scenario: Two counts that cannot both hold
- **WHEN** two stations share most of their flow and their targets differ by more than the tolerance
- **THEN** the fit stops without using the iteration limit and the report lists both with their errors and the volume they share

#### Scenario: A count on a bound
- **WHEN** a station needs flows that already sit on the lower bound
- **THEN** it is excluded from the stopping test and listed with the share of its volume that is pinned

### Requirement: Gates that split one count are one station
Gate nodes of one street that lie close together and take their volume from the same count SHALL be a single station on the group's generated and absorbed trips, so the fit may move volume between them.

#### Scenario: Two gates on one road
- **WHEN** two gate nodes of Tunnel Road 114 m apart take halves of one Caltrans count
- **THEN** the fit has one entering and one leaving station for the pair with the full count as target

### Requirement: Observed route shares are soft constraints
The area's targets file SHALL be able to constrain the fit with the share of trips on a select link that have a freeway origin or destination and the share of trips on the ramps that also use a named street, each as a ratio constraint with a configured weight below the counts. Street names, blocks and sides SHALL come from the targets file, not from code.

#### Scenario: Update rule
- **WHEN** a share's modeled value differs from its target
- **THEN** flows in its numerator are scaled by (target / modeled) and the rest of its denominator by ((1 - target) / (1 - modeled)), each to the power of the constraint weight

#### Scenario: Share and count together
- **WHEN** a count on a link and a share on the same link disagree
- **THEN** the count wins in proportion to its larger weight and the report shows the residual of each

#### Scenario: Report
- **WHEN** the builder finishes
- **THEN** the report gives each share before the fit, after the count-only fit and final, and says so when the shares are disabled

### Requirement: The assignment follows the simulator's route choice and restrains capacity
The static assignment SHALL choose routes like the simulator's drivers (the least cost-to-go over movements, with a per-driver perceived-cost factor on each candidate link) and SHALL be able to average several passes over link costs that grow with volume over capacity (method of successive averages, BPR form of the volume-delay function, capacities from the validation suite), citing verified entries of `docs/references.md`.

#### Scenario: Loaded short route
- **WHEN** a flow's short route is loaded beyond its capacity and a longer route is a little more costly
- **THEN** the averaged assignment puts part of the flow on the longer route and conserves the volume

#### Scenario: Light load
- **WHEN** the volume is far below capacity
- **THEN** the whole flow stays on the short route

### Requirement: Ramp trips are drawn per ramp
The surface end of a freeway-ramp trip SHALL be drawn from the ramp's own volume, bearing and access time (an exponential decay in the router's cost from the surface end to the ramp), and sent to the mainline gate or gates that ramp reaches, so that ramps far apart that share a mainline gate do not share a pool of trips.

#### Scenario: Two ramps on one gate
- **WHEN** two on-ramps 3 km apart both reach the same mainline gate
- **THEN** each draws its trips near itself and the trips of one do not fill the other


### Requirement: A count is used once
Every fit station SHALL name the source records its target comes from (a turning-movement leg or a Caltrans station, with a direction) and the share of the record it carries. When a gate station and a link station carry the same record in the same direction, the link station SHALL be kept and the gate station dropped, with a note. The build SHALL fail when the shares of one record add to more than one across the stations.

#### Scenario: Tunnel Road
- **WHEN** the Caltrans AADT of Tunnel Road is both the count of the Tunnel Road gates and an in-area station
- **THEN** one station remains, on the link, and the gate group has no station of its own

### Requirement: Measured link delays can feed the assignment
When the file named by `countFit.assignment.measured.file` exists for the same network, the static assignment SHALL add the simulator's mean delay per vehicle on each link (less the control delay the router already adds) to the free-flow cost. Without the file it SHALL use free-flow and BPR costs.

#### Scenario: File absent
- **WHEN** the file does not exist
- **THEN** the assignment uses free-flow and BPR costs

### Requirement: The cost loop averages and stops on a measure
`tools/cost-loop.ts` SHALL average the measured costs across iterations by the method of successive averages, take each iteration's costs as means over several seeds, report the relative gap of the costs and the share of links whose cost changed by under 1%, and stop on a gap threshold or an iteration limit. It SHALL keep an iteration only if it improves the headline-share error while the PM peak stays stable under the stability rule, and skip with a message when the binary is not built.

#### Scenario: No binary
- **WHEN** `target/release/calibrate` does not exist
- **THEN** the loop exits without error and the build keeps its free-flow and BPR costs

#### Scenario: Iteration that loses stability
- **WHEN** an iteration makes the PM peak unstable under the stability rule or does not improve the share error
- **THEN** the loop restores the demand built without measured delays and records why

### Requirement: Validation stations are held out and reported separately
When `countFit.validation` is enabled, the build SHALL mark about a quarter of the count stations as validation-only, deterministically, with at least one per corridor, fit once without them to report their GEH and size-band results as out-of-sample figures, and ship the demand fitted on every count.

#### Scenario: Corridor coverage
- **WHEN** the hold-out is selected
- **THEN** every corridor has at least one validation station and the same stations are chosen on every build

### Requirement: Implied select-link volumes
When the targets file has ramp via-street shares and select-link freeway shares for the same street, the build SHALL derive the street's implied peak-hour volume from the ramp count, the via-street share and the freeway share, compute it under both readings of the ramp share's denominator, print the arithmetic in the fit report, and add the midpoint as a soft volume constraint with weight below the counts, labeled DERIVED.

#### Scenario: Report
- **WHEN** the fit report is generated
- **THEN** each implied volume shows its range, its target and the modeled volume before and after the fit

### Requirement: A resident volunteer count enters the fit as count stations
The demand build SHALL read a manual turning-movement count file and map each counted block, by street name, the names of its two cross streets and its direction, to a directed network link. Mapped blocks SHALL be link stations; turning movements that turn from one street onto another and whole-street route counts SHALL constrain the share of a flow's assigned routes that take them. Unmapped blocks SHALL be listed with the reason.

#### Scenario: Blocks mapped
- **WHEN** the build reads the Rockridge count
- **THEN** the fit report states how many counted block values were mapped, how many stations were fitted and how many were held out, and lists each unmapped block with its reason

#### Scenario: A movement constraint
- **WHEN** a counted movement from street A onto street B is a constraint
- **THEN** the assignment records, for every flow, the share of its routes that go from the link of A directly onto the link of B, and the fit scales the flows that take it toward the counted volume

#### Scenario: Weights follow certainty
- **WHEN** a reading is marked uncertain, or a target is the PM count scaled to midday
- **THEN** its weight is the configured fraction of the weight of a measured block, and the report states the tolerance for one day and one hour

### Requirement: Local trip rates follow the count's trip ends
When the count implies trip ends inside the study area, the build SHALL scale the trip rates of the study-area blocks so that the external ends they offer equal those ends, per counted period, capped at `maxScale`. A period without a count SHALL take the mean of the counted periods' factors and be labeled an assumption.

#### Scenario: Offered ends equal the counted ends
- **WHEN** the count implies 927 destinations inside the study area in the PM peak (vehicles entering less the cars that drive a whole counted street)
- **THEN** the offered external destination ends of the study-area blocks sum to 927 before the fit, and the fit report lists implied ends, offered ends and factors

### Requirement: Interior blocks are held out in a fixed pattern
Every `holdoutEvery`-th counted block along each street and direction, ordered along the street, SHALL be validation-only (not the last block of a run and never a block with an uncertain reading). Movement and route counts that touch a held-out block SHALL be left out of the cross-validation fit. The report SHALL give GEH and size-band shares for interior blocks and for the other stations separately, fitted and held out.

#### Scenario: Out-of-sample interior blocks
- **WHEN** the cross-validation fit runs without the held-out blocks
- **THEN** the held-out interior blocks are scored on that fit, apart from the arterial, ramp and gate stations
