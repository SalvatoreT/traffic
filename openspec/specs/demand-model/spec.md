# demand-model Specification

## Purpose
How baseline travel demand for a study area is built from public data and what the simulator can rely on in a demand file.

## Requirements

### Requirement: Origin–destination flows
Baseline demand SHALL be expressed as origin–destination vehicle flows per time period following the Demand contract (version 1), including at least a weekday PM peak and a midday period.

#### Scenario: Loading demand
- **WHEN** the simulator loads the Rockridge demand file
- **THEN** every flow references existing nodes and has a non-negative rate

### Requirement: Derived from public data with provenance
Demand SHALL be synthesized from public sources (traffic counts, census commute flows) and the demand file SHALL list each source with URL and a note of how it was used; values that are assumptions rather than data SHALL be labeled as such.

#### Scenario: Count available for a street
- **WHEN** a public traffic count exists for a gate street
- **THEN** the gate's peak inflow is scaled from that count and the provenance entry names the dataset

#### Scenario: No count available
- **WHEN** no count exists for a gate
- **THEN** a per-class default volume is used and recorded as an assumption

### Requirement: Through and local trips
Demand SHALL distinguish trips passing through the area (gate to gate) from trips that start or end inside it.

#### Scenario: Through trip
- **WHEN** a flow has both origin and destination at gates
- **THEN** it is eligible to be counted as cut-through when it uses local streets

### Requirement: Mode per flow
Each demand flow SHALL carry a mode of car, bicycle or pedestrian, defaulting to car when absent.

#### Scenario: Loading older demand
- **WHEN** a demand file has no mode on its flows
- **THEN** all flows are treated as car trips

### Requirement: Walking and biking demand labeled as assumptions
Pedestrian and bicycle flows SHALL be synthesized from public data with every mode share, trip rate and trip-length value exposed in configuration and labeled as an assumption.

#### Scenario: Reading provenance
- **WHEN** someone reads the demand provenance
- **THEN** walking and biking volumes are stated to be assumptions, not counts

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
When `countFit.validation` is enabled, the build SHALL mark about a quarter of the count stations as validation-only, deterministically, with at least one per corridor, fit once without them, write that fit as the cross-validation demand with the same ramp split and intent annotation as the shipped demand, and ship the demand fitted on every count. The cross-validation demand SHALL be removed when the build skips the cross-validation fit.

#### Scenario: Corridor coverage
- **WHEN** the hold-out is selected
- **THEN** every corridor has at least one validation station and the same stations are chosen on every build

#### Scenario: Same model
- **WHEN** a simulator run uses the cross-validation demand
- **THEN** its off-ramp flows carry the ramp movement and its flows carry their intent, as in the shipped demand

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

### Requirement: A count station sits on the street its record counts
A state highway count SHALL constrain the highway's own links on the side of the cross street the record names (back or ahead), and SHALL NOT be applied to the cross street. A gate without a count of its own street SHALL take the class default as an ASSUMPTION.

#### Scenario: Highway count named after a cross street
- **WHEN** a Caltrans record for SR-13 is described as "Claremont Avenue" with an ahead AADT
- **THEN** the station is the block of Ashby Avenue on the ahead side of Claremont Avenue, and the Claremont Avenue gate keeps its class default

### Requirement: Published intersection counts enter the fit as count stations
The demand build SHALL read peak-hour turning-movement counts of intersections from a data file that names each count's source, date, location, legs and volumes by approach and movement. Each leg SHALL become a station for the volume entering and one for the volume leaving, and each left or right turn at or above a configured volume SHALL become a movement constraint at a lower weight. A period without a count SHALL get no target.

#### Scenario: A counted intersection
- **WHEN** the file holds the PM approach volumes of a four-leg intersection inside the model
- **THEN** the fit has an entering and a leaving station for each leg and a movement constraint for each turn of at least the configured volume

#### Scenario: A leg that is not in the network
- **WHEN** no link of the leg's street ends within the configured distance of the count's location on the leg's bearing
- **THEN** that leg's volume is not used and the fit report says so

### Requirement: A counted hour on a ramp replaces its ADT times K
Where a leg of a counted intersection is a freeway ramp that also has a published ADT, the station from the count SHALL replace the station from the ADT times the assumed peak-hour factor, with the ramp weight, and the fit report SHALL state both values. In a period the count does not cover, the ramp SHALL keep its ADT-based target scaled by the ratio of the count to the ADT-based value in the PM peak, labeled as an assumption.

#### Scenario: Off-ramp with a count
- **WHEN** an off-ramp has an ADT-based PM target of 1,278 veh/h and a counted PM peak hour of 1,024
- **THEN** the fit targets 1,024 on the ramp link and the report notes the replaced value

### Requirement: A census block loads the junctions around it
The demand build SHALL assign the resident workers and jobs of a census block in equal parts to every non-gate node on a residential street within a configured distance of the block's centroid, and to the nearest such node when none is that close. The distance is an assumption.

#### Scenario: Block between four corners
- **WHEN** four residential-street junctions lie within the distance of a block's centroid
- **THEN** each takes a quarter of the block's trip ends

### Requirement: Fit report within the file size limit
The fit report SHALL write the station tables of each period to a file of their own and point to them from the main report.

#### Scenario: Three periods
- **WHEN** the build writes the fit report for three periods
- **THEN** there are three station files and the main report names them

### Requirement: Census blocks load their own side of the study-area boundary
When `local.sideRule` is set, a census block SHALL load only nodes on the same side of the study-area boundary as its centroid, and the trip ends the volunteer count implies SHALL scale only blocks inside the study area.

#### Scenario: Block across a boundary street
- **WHEN** a block lies north of Alcatraz Ave and a study-area corner node is within the spread radius
- **THEN** the block does not load that corner

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

### Requirement: Approach groups name where through cars come from and go to
The area config MAY define `approachGroups`: ordered rules that place each gate outside the study area in a named group by street names, road classes, entry or exit role and compass sector, plus overrides and named sets. Every gate SHALL fall in a group, and a node that is not a gate SHALL take the group of the nearest surface gate. The demand build SHALL write the groups to `data/demand/<area>.groups.json`. No street name SHALL appear in code.

#### Scenario: Gate placed by rule
- **WHEN** a gate carries Telegraph Avenue links and lies in the north sector
- **THEN** it belongs to the first group whose rule matches those names and that sector

#### Scenario: Gate no rule matches
- **WHEN** a gate matches no rule and has no override
- **THEN** the build stops and lists the gate

### Requirement: Assumed movements can carry intents
An assumed movement MAY list `intents`, each with a label, an origin group, a destination group and exactly one of a share of the movement's counted volume or a PM volume in veh/h. The candidates of an intent SHALL be the seed flows between its groups that pass the detour limit and the loop rule, and its volume SHALL be split over them in proportion to their seed volume.

#### Scenario: Intent restricts the pairs
- **WHEN** an intent runs from a Telegraph Ave group to the SR-24 on-ramp groups
- **THEN** only seed flows from nodes of the first group to nodes of the second are given its volume

#### Scenario: Closed movement
- **WHEN** an intervention closes a movement that carries assumed flows
- **THEN** the simulator routes those trips by the plain route (unchanged from round 20)

### Requirement: Intents stay within the count and are not counted twice
The intents of a movement SHALL NOT add up to more than its counted volume. The plain flow of each pair SHALL give up the trips its assumed flow carries, never more than 80% of it, and the report SHALL state the amount.

#### Scenario: Intents exceed the count
- **WHEN** the intents of a 76 veh/h movement add up to 90 veh/h
- **THEN** the build stops with an error

#### Scenario: Same pair, plain and assumed
- **WHEN** an assumed flow of 30 veh/h runs between the origin and destination of a plain flow of 100 veh/h
- **THEN** the plain flow starts the fit at 70 veh/h

### Requirement: Assumed intents are labeled
The configuration, the fit report, the demand provenance and the calibration record SHALL label every intent flow an ASSUMPTION and give each intent's volume, candidates, flows kept and the volume taken from plain flows.

#### Scenario: Fit report
- **WHEN** the demand is built with intents
- **THEN** the fit report has an intents table per movement and period

### Requirement: Assumed flows carry their detour tolerance and alternatives
The demand builder SHALL write `via.maxDetour` on each flow with `via`, equal to the configured `maxDetour` of its movement, and, when the movement has intents, `via.alternatives`: the other configured movements that have an intent whose origin set and destination set (sets expanded) contain the origin group and the destination group of the flow's pair, in configuration order. The match is on the pair, so intents of two streets that name a set and one of its members are alternatives of each other. No street name SHALL appear in code. Config, fit report, provenance and README SHALL label both an ASSUMPTION. Volumes SHALL NOT change.

#### Scenario: Parallel turn family
- **WHEN** two movements on parallel streets have intents with the same origin and destination groups
- **THEN** each flow of one lists the other movement as an alternative

#### Scenario: Intents that name a set and a member
- **WHEN** one movement has an intent from the set `west-side` and the other has intents from `telegraph-north` and `west-side-other`, which together are the members of that set
- **THEN** a flow whose origin is in a member lists the other movement as an alternative

#### Scenario: Movement without intents
- **WHEN** a movement has no intents
- **THEN** its flows carry `maxDetour` and no alternatives

### Requirement: Count stations carry the year of their source
Every count station SHALL carry a source id and the count year of its source, derived from provenance (the year in a file name, a count date, the latest year of a published ramp row, the Caltrans count year in the config). A station whose year is not known SHALL have year null and SHALL be treated as old.

#### Scenario: Averaged counts
- **WHEN** a station averages counts of 2018, 2018, 2019 and 2021
- **THEN** its year is the mean, 2019.0

#### Scenario: No known year
- **WHEN** a source has no date in its provenance
- **THEN** the station has year null, the reports say so, and the recency rule uses its last band

### Requirement: The fit weights stations by the age of their count
The demand fit SHALL multiply each station's weight (and period weight) by the weight of the first band of `countFit.recency.bands` whose `maxAgeYears` is at least the station's age, the age being `referenceYear` minus the count year. A band weight of 0 SHALL take the station out of every fit and report it as held out. The reference year, the bands and the weights SHALL come from the area config and be labeled ASSUMPTION. No street, source or area name SHALL appear in code.

#### Scenario: Old counts at half weight
- **WHEN** the last band has weight 0.5 and a station's age exceeds the earlier band edge
- **THEN** its weight is half its configured weight and recent stations keep theirs

#### Scenario: Held-out-only
- **WHEN** the last band has weight 0
- **THEN** those stations are not constraints in the shipped fit or the cross-validation fit and are scored as held out

### Requirement: Growth from the count year only with a published rate
`countFit.recency.growthPerYear` MAY map a source id to an annual rate; the target of each station of that source SHALL be multiplied by (1 + rate) to the power of its age. The config SHALL NOT set a rate without a verified published source for it.

#### Scenario: No rate
- **WHEN** a source has no entry
- **THEN** its counts are used as published

### Requirement: A slip link counts on the legs it joins
For a counted intersection leg, an unnamed one-way link that leaves the leg's street where the leg's approach link starts, or joins it where the leg's exit link ends, with its other end within the node radius of the intersection, SHALL be part of the leg's links. A movement that can use such a link SHALL NOT be a movement constraint, and the report SHALL say so.

#### Scenario: Right-turn slip
- **WHEN** a slip leaves the east leg upstream of the signal and joins the north leg downstream of it
- **THEN** the east entering and north leaving stations include the slip link and the east-to-north movement has no station

### Requirement: Through intents are data
The area config MAY define `throughIntents`: an ordered list of reasons, each with an id, a label, `fromGroups`, `toGroups`, an optional `avoids`, a basis of `observed` or `assumed`, and a note. The demand build SHALL write the list as `intents` in the demand file and set `intent` (the list index) on each car flow whose origin group and destination group are the first reason's. It SHALL stop on an unknown group, a repeated id or a missing field, and SHALL NOT change any volume.

#### Scenario: First match wins
- **WHEN** a flow's groups fit two reasons
- **THEN** its `intent` is the earlier one

#### Scenario: No match
- **WHEN** no reason fits
- **THEN** the flow has no `intent`

### Requirement: Off-ramp flows carry the ramp the count fit gave them
When `ramps.choice.enabled` is set, the builder SHALL divide each car flow from a freeway mainline gate to a surface node over the off-ramps its final static assignment uses, in proportion to the shares, and write the ramp movement as the `via` of each part (with `maxDetour` and the flow's other ramps as `alternatives`). The flow's total volume SHALL not change. Config, fit report and README SHALL label the choice an ASSUMPTION, and no street name SHALL appear in code.

#### Scenario: Flow over two ramps
- **WHEN** the final assignment of a flow of 80 veh/h uses ramp A with share 0.75 and ramp B with share 0.25
- **THEN** the builder writes two flows of 60 and 20 veh/h with the movements onto A and B, each listing the other as its alternative

#### Scenario: Ramp below the minimum share
- **WHEN** a ramp carries less of a flow than `minShare` (0.05 against 0.1)
- **THEN** the ramp is dropped and the flow has one part, on the other ramp, at the whole volume, with no alternative

#### Scenario: Flow that uses no ramp
- **WHEN** the assignment of an off-ramp flow touches no off-ramp link, or the flow already has a `via`
- **THEN** the flow keeps its volume and gets no ramp movement

### Requirement: Ramp counts can be exempt from the recency weights
The recency rule SHALL leave the weight of a station at its full value when `countFit.recency.exemptRamps` is set and the station is a Caltrans ramp row or a ramp leg of an intersection count, whatever its age. The reports SHALL still list the station under its source and count year.

#### Scenario: Old ramp leg
- **WHEN** a ramp leg of a 2013 intersection count and a plain leg of the same count are weighted with the 10-year band and an old weight of 0.5
- **THEN** with `exemptRamps` the ramp leg keeps its weight and the plain leg takes 0.5, and without it both take 0.5

### Requirement: An intent can require the whole-street route
An assumed movement MAY name a whole-street route of the volunteer count (`wholeStreet`), and an intent of it MAY set `wholeStreet`. The candidates of such an intent SHALL be the seed flows whose route to the movement enters the route at its first link. The intent's volume SHALL still be split over its candidates by seed volume and the intents of the movement SHALL still add up to at most its counted volume.

#### Scenario: Entry at the first link
- **WHEN** two seed flows can make the movement and only one reaches it over the route's first link
- **THEN** only that flow takes the intent's volume

#### Scenario: No flow enters at the first link
- **WHEN** no candidate enters the route at its first link
- **THEN** the intent has no flows and the report says no candidate drives the whole street

### Requirement: Derived targets are marked
A count station whose target in a period is another period's count times a factor SHALL list that period in `derived` in the station file. No AM target SHALL be derived.

#### Scenario: Midday
- **WHEN** a station's midday target is its PM count times the period ratio
- **THEN** the station lists `midday` as derived

### Requirement: Uncounted entries are filled for the local trip rates
When an entry or exit of the volunteer count has no count in a period but has one in the other, the trip-end estimate of the period SHALL use the other period's count times the ratio of the totals over the entries counted in both, SHALL NOT count it as zero, and the fit report SHALL list the entries filled and the ratio. The fill is an ASSUMPTION.

#### Scenario: Telegraph Ave entries in the AM
- **WHEN** five Telegraph Ave entries are counted in the PM only
- **THEN** their AM volumes are their PM volumes times the AM-to-PM ratio of the entries counted in both

### Requirement: A counted turn is not overshot by plain flows
After the intent flows are placed, plain seed flows whose best route through an assumed movement costs at most `naturalDetour` times their best route SHALL give up volume until the movement carries no more than its count (what the pinned flows leave of it, not below zero). The report SHALL give the volume before and after.

#### Scenario: Count fully assigned
- **WHEN** the intents of a movement carry its whole count
- **THEN** the plain flows whose best route makes the turn start the fit at zero

### Requirement: Chained freeway links are one ramp
A freeway-class link that starts at a node touched by a surface link SHALL NOT be an off-ramp, and a ramp reached on one path through another ramp's last link SHALL NOT take a part of that flow.

#### Scenario: Ramp that passes a surface node
- **WHEN** a flow's path uses a ramp link and then a second ramp link that starts where the first ends
- **THEN** the flow carries one ramp movement and is not divided

### Requirement: Alternatives belong to through flows
`via.alternatives` SHALL be written only for flows with no end in the study area. A flow with an end in the study area SHALL fall back to its plain route.

#### Scenario: Resident trip
- **WHEN** an intervention blocks a movement used by a flow that starts in the study area
- **THEN** the flow takes its plain route and not the same turn on a parallel street

### Requirement: Movements below the fit minimum are shown as counted
A movement counted below `minMovementVeh` in a period SHALL be reported with its count, SHALL get no assumed trips in that period, and the Assumptions data SHALL give the count and the reason in `belowThreshold`.

#### Scenario: Colby St right turn in the AM
- **WHEN** the count shows 23 veh/h for a movement and the minimum is 25
- **THEN** the data shows 23 and says no trips are assigned because the count is below the fit minimum

### Requirement: The demand lists the freeway ramps and the reasons that name them
The builder SHALL derive the freeway ramps from the network in one place and write them into the demand file with an id, a kind, the surface node, the links and a plain label. The area config's `throughIntents` SHALL list the reasons in ordered sections, a reason MAY name a ramp or `other`, and the build SHALL stop on an unknown ramp or section. Flows SHALL carry an intent only for reasons that name no ramp.

#### Scenario: Chained ramp links
- **WHEN** an off-ramp is two freeway-class links joined at a node that touches no surface street
- **THEN** it is one ramp with both links

#### Scenario: Unknown ramp
- **WHEN** a reason names a ramp the network does not have
- **THEN** the build stops with a message naming the reason

### Requirement: A ramp is a chain of freeway-class links at a surface street
An on-ramp SHALL be a chain of freeway-class links entered from a surface street and an off-ramp one that ends at a surface street. Chained links SHALL be one ramp, and a chain between two surface streets SHALL NOT be a ramp.

#### Scenario: Connector between surface streets
- **WHEN** a freeway-class link runs from one surface street to another
- **THEN** no ramp is derived from it

### Requirement: Flows from a mainline gate that make an assumed movement make the ramp first
When the ramp choice is enabled, a flow from a freeway mainline gate that already carries an assumed movement SHALL be divided over the ramps its assignment uses like any other off-ramp flow, with the ramp as its first movement and its assumed movement as `via.then`.

#### Scenario: Assumed flow from a mainline gate
- **WHEN** an assumed flow from a mainline gate uses one off-ramp in its assignment
- **THEN** its `via` is the ramp movement and its `via.then` is the assumed turn

### Requirement: Count lineage and gate direction
The demand builder SHALL exclude held-out route diagrams from every derived training input, including trip-end scaling. A gate matched to a counted leg SHALL map inflow and outflow by the direction of travel at the count and retain its directional source.

#### Scenario: Count outside the modeled boundary
- **WHEN** the south gate lies north of an intersection count on the same street
- **THEN** traffic departing that intersection northbound supplies the gate's inflow

#### Scenario: Held-out route changes
- **WHEN** only the observed volume in a held-out route diagram changes
- **THEN** neither the training trip ends nor the resulting training inputs change

### Requirement: Joint route shares and final assignment
The assignment SHALL count the joint ramp-and-street event on the same sampled route. The fitted demand's counts, shares and route membership SHALL use an assignment of the volumes returned by the fit.

#### Scenario: Disjoint paths
- **WHEN** half of an OD's routes use a ramp and the other half use the measured street
- **THEN** zero of its routes use the street via that ramp

#### Scenario: Final update
- **WHEN** the final OD update changes the routes drivers take
- **THEN** its score and reported shares reflect those new routes

### Requirement: Pedestrian crosswalk count fitting
A pedestrian count at an intersection SHALL fit traversals of its crosswalks on the baseline walking graph. The builder SHALL report route coverage and the simulator SHALL provide actual crossings at the count location for comparison.

#### Scenario: Walk ends at a corner
- **WHEN** a pedestrian reaches an endpoint at the intersection without crossing the road
- **THEN** the trip contributes zero to the crosswalk count

### Requirement: Comparable observations for corridor fits
A fit of distinct through users on any portion of a corridor SHALL require a matching count of distinct trips with both ends outside the study area. Counts of individual blocks and full-length traversals SHALL remain separate. Measured route membership SHALL identify compatible inputs and detector semantics. The builder SHALL use static assignment when that evidence is absent.

#### Scenario: Historical corridor proxy
- **WHEN** the only observations are block counts, whole-street traversals and cars ending along the corridor
- **THEN** the fit uses the comparable observations and leaves the distinct through-user total unconstrained

### Requirement: Measured control delay replaces the constant per approach
The static assignment SHALL accept a measured control delay per approach link and period. A measured value SHALL replace the constant of the approach's control type in the cost of every movement that leaves the approach. An approach without a value SHALL keep the constant, and an approach with no control delay SHALL ignore a value.

#### Scenario: A measured delay changes the route
- **WHEN** two otherwise equal paths differ only in a signal approach, and the measured delay of that approach is below the signal constant
- **THEN** the assignment loads the path through the signal

#### Scenario: No measurement
- **WHEN** an approach has no measured value
- **THEN** its movements cost what they cost with the constants

### Requirement: Control delay is measured from baseline runs
The measured value SHALL be the flow-weighted mean delay per car on the approach link over the kept seeds, less the flow-weighted median delay of links that end at no control and carry no hump, floored at zero. Only approaches with at least 20 veh/h on average over the seeds SHALL have a value (ASSUMPTION: the cut `tools/node-delays.ts` uses).

#### Scenario: Approach with too few cars
- **WHEN** an approach carries under 20 veh/h on average over the seeds
- **THEN** the file has no value for it and the assignment uses the constant

### Requirement: A control delay file names what it was measured on
A control delay file SHALL record the area, the demand view, the network hash, the demand hash, the simulator fingerprint, the seeds and the run length. The measuring tool SHALL refuse reports whose manifest names another demand or network, or more than one simulator fingerprint.

#### Scenario: Reports of another demand
- **WHEN** a seed report names a demand other than the one given to the tool
- **THEN** the tool stops without writing a file

### Requirement: The demand build checks the control delay file
The demand build SHALL use a file only when its area, view, network hash and simulator fingerprint equal the build's. Otherwise it SHALL use the constants, print a warning and name the mismatch in the fit report. A missing file SHALL change nothing.

#### Scenario: File measured on another network
- **WHEN** the network hash in the file differs from the network the build reads
- **THEN** the build uses the constants, warns, and the fit report states the mismatch

#### Scenario: Training view
- **WHEN** the build is the training view of the validation split
- **THEN** it reads the training file, which was measured on training-view demand only, so no held-out count informs any input

### Requirement: Measured control delay is off unless the area config names a file
The demand build SHALL read a control delay file only when the area's demand config names one under the count fit's assignment settings. Without that entry the build SHALL ignore every control delay file on disk and use the constants of the control types.

#### Scenario: Default build
- **WHEN** the demand config has no control delay entry and delay files exist in the data folder
- **THEN** the build output is the same as a build without those files

### Requirement: Stations that carry one source row can be one station over the sum of their links
When the area's demand config lists a link group, the stations it names SHALL be replaced by one station. Its links and detectors are the members' in order and its target in every period is the sum of the member targets. The fit and the scoring SHALL read it as one count over the sum of the flows on those links. With no link group in the config the stations and every output SHALL be unchanged, and the merge SHALL read no street names.

#### Scenario: One ADT row split over two ramps
- **WHEN** a config lists two on-ramp stations that took halves of one Caltrans row, and both are fitted
- **THEN** the station file has one station over both ramp links with the sum of the two targets, and the fit may place the row's flow on either ramp

### Requirement: A link group respects the frozen split
The merge SHALL run after the frozen validation split is applied and SHALL NOT change the split file. Members SHALL be link stations that share a source observation and have no link in common. The build SHALL stop when the members are on different sides of the split, when only some members are in the view, or when a member does not meet these conditions. A group none of whose members is in the view SHALL be left out with a note.

#### Scenario: Members on different sides of the split
- **WHEN** one listed station is held out and the other is fitted
- **THEN** the build fails with a message that names both and says the split is not re-frozen

#### Scenario: Group withheld in the training view
- **WHEN** the training view withholds the row that both members come from
- **THEN** neither member is in the view and the build notes that the group is left out

### Requirement: Stations the report binary exports can take simulated membership
When the area's demand config has a `countFit.throughTargets.simulatedMembership` entry, every fitted station that `calibrate --select-od` exports SHALL take its route membership from simulated trips in the membership file of its view: link stations with a detector list or counted at the block, and movement and route stations. A station without an export (a gate total) SHALL keep static membership. With no entry the stations, the membership and every output SHALL be unchanged.

#### Scenario: Rule on
- **WHEN** the config has the entry and its membership file matches the build's evidence
- **THEN** the fit report lists, per period of the file, how many fitted stations took simulated membership and how many runs the file pools

#### Scenario: Rule off
- **WHEN** the config has no entry
- **THEN** the demand file of each view is byte-identical to the build before this change

### Requirement: The station set is chosen without reading names or counts
The stations that take simulated membership SHALL be chosen from the stations file and the frozen split alone. The choice SHALL read no street name, station name or count value, and the entry SHALL replace the `measuredStations` list while it is present.

#### Scenario: Renamed stations
- **WHEN** every station is renamed and every target rescaled
- **THEN** the rule selects the same number of stations

### Requirement: The training view's membership comes from training-view runs only
The membership file of the training view SHALL be pooled only from runs of the training demand and SHALL name no station that the frozen split withholds, in its pair lists or in its list of stations without trips. Its pair list SHALL contain only pairs that a kept station used. The loop SHALL NOT change the split file.

#### Scenario: Run of the wrong view
- **WHEN** a seed run made on the shipped demand is offered to the training view's pool
- **THEN** the pool is refused with the view named

#### Scenario: Withheld station in a pooled file
- **WHEN** a pooled training file would name a withheld station
- **THEN** the loop stops before writing it

### Requirement: Station choice and the stop rule read no held-out result
The loop SHALL NOT read an assessment, a held-out score or a count value to choose stations or to stop. Its stop rule SHALL use simulated flows only.

#### Scenario: Stop decision
- **WHEN** the loop decides whether to run another pass
- **THEN** it compares simulated station and pair flows of two passes and reads no score

### Requirement: Iteration runs are pooled with equal weight
The loop SHALL pool the seed runs of every pass with equal weight, using the same number of seeds, at least two, in each pass. A station with no simulated trip in any pooled run SHALL keep its static membership and SHALL be listed in the file and in the loop's report.

#### Scenario: Unequal seed counts
- **WHEN** two passes carry different numbers of seeds
- **THEN** pooling is refused

### Requirement: The loop stops early only on seed noise
From the second pass on, the loop SHALL compare the seed-mean flow of each station, and the seed-mean flow of each pair at the station, with the previous pass, as root mean squares over stations against the combined seed standard errors. It SHALL stop early only when both ratios are at most 1 in every view and period.

#### Scenario: Nothing moved
- **WHEN** two passes differ by no more than their seed standard errors
- **THEN** the loop builds the final demand from the pool of the passes run so far

#### Scenario: A station moved by many standard errors
- **WHEN** one station's flow differs between passes by many combined standard errors
- **THEN** the loop runs the next pass

### Requirement: A build that falls back to static membership stops the loop
After each build the loop SHALL read the fit report. From the second pass on the report SHALL carry the note that names the membership file and the view and, for each period of the file, a note whose run count and station count equal what the file holds. Otherwise the loop SHALL stop with the missing note named. The first pass SHALL build without a file and the report SHALL say so.

#### Scenario: Evidence does not match
- **WHEN** the build reports that the membership file lacks matching evidence
- **THEN** the loop stops instead of continuing on static membership

### Requirement: Uncounted gate totals can be held by one-sided ceilings
When the area's demand config has a `countFit.gatePriorTotals` entry and the stations of a period take simulated membership, the count fit SHALL first fit that period with static membership and no ceilings, and then add a one-sided ceiling station for each gate direction of a gate node that has trips and that no station of kind `gate` in the fit counts. With no entry every output SHALL be unchanged.

#### Scenario: Entry present with membership
- **WHEN** the config has the entry, the period takes simulated membership and a gate direction has no gate station
- **THEN** the fit holds that direction's total near its static-fit total, and a total below the ceiling is not pulled up

#### Scenario: Entry absent
- **WHEN** the config has no entry
- **THEN** the demand file of each view is byte-identical to the build before this change

#### Scenario: Entry present without membership
- **WHEN** the config has the entry and no membership file is in use for the period
- **THEN** the period's flows are identical to the build without the entry

#### Scenario: Gate with a gate station
- **WHEN** a gate direction is named by a gate station that is in the fit for the period
- **THEN** no ceiling station is made for it

### Requirement: Periods without simulated membership have no ceilings
In a period whose stations take static membership, no second fit SHALL run and no ceiling SHALL apply.

#### Scenario: Midday
- **WHEN** the membership file has no runs for a period
- **THEN** the period has no ceiling stations and its fit is the baseline's

### Requirement: The ceiling is the gate's static-fit total plus a tolerance
The ceiling of a station SHALL be the gate's car total in the static fit of the same view and period times (1 + tolerancePct / 100). The station SHALL act only while the assigned total exceeds the ceiling and SHALL have weight `weight`. Tolerance and weight SHALL be labeled assumptions. A ceiling station SHALL NOT change how flows that touch no count are treated.

#### Scenario: Ceiling value
- **WHEN** a gate has 150 veh/h in the static fit and the tolerance is 0
- **THEN** its ceiling is 150 veh/h

#### Scenario: Unconstrained flow
- **WHEN** a flow's only constraint is a ceiling station
- **THEN** it still takes the median rule for flows that touch no count

### Requirement: The ceilings hold on the final flows
After the fit, the median rule and the guard cut, the fit SHALL scale down the car flows of every ceiling gate direction whose total exceeds its ceiling by more than 0.1%, proportionally and alternating over origin and destination sides until none does, and SHALL report the volume removed and the fitted stations within tolerance before and after.

#### Scenario: Soft ceiling leaks
- **WHEN** a gate direction ends above its ceiling after the soft fit
- **THEN** its final total is at most 0.1% above the ceiling and the report states the volume removed

### Requirement: Ceiling stations read no count and are not scored
A ceiling station SHALL take its ceiling only from the static fit of the view being built. It SHALL NOT appear in the stations output file, in the validation split, among the stations scored by `calibrate` or `assess`, or among the stations the simulated membership rule selects.

#### Scenario: Stations output
- **WHEN** a build runs with the entry present
- **THEN** the stations file is byte-identical to the one the build writes without the entry

### Requirement: The fit report states what the ceilings did
With the entry present, the fit report SHALL list, per period, the number of ceiling stations, how many end above their ceiling, the sum of the excess, the five gates furthest above their ceilings with node and street, and the offered car demand of the static fit and of the final fit, in all and by flow type. It SHALL label the tolerance and the weight as assumptions.

#### Scenario: Report lines
- **WHEN** a build runs with the entry present
- **THEN** the report has one line per period with the ceiling station count, the count above ceiling and the excess in veh/h

### Requirement: The loop stops when offered demand outgrows the static fit
After each build from the second pass on, the loop SHALL stop with a non-zero exit, before running that pass's seeds, if the offered car demand of any view and period exceeds the static fit's by more than 3%.

#### Scenario: Growth past the limit
- **WHEN** a build offers 3.1% more car demand than its static fit
- **THEN** the loop stops before the seed runs and the message names the view, period and figures

### Requirement: The membership loop reports the ceilings
When the fit report carries the ceiling lines, the membership loop SHALL include, in its per-pass lines and its report, the number of ceiling stations, the number above ceiling and the excess sum of each build.

#### Scenario: Loop with ceilings
- **WHEN** the loop runs on a config with the entry
- **THEN** each pass line and the report table show the count above ceiling and the excess

### Requirement: The ceilings can cover every node
The `countFit.gatePriorTotals` entry SHALL accept an optional `scope`, `gates` or `allNodes`. Absent or `gates`, the build SHALL behave as before. With `allNodes`, the count fit SHALL add a one-sided ceiling station, anchored on the static fit as for gates, for every node direction with trips in the period, gate or not, that no station of kind `gate` in the fit counts.

#### Scenario: Scope absent
- **WHEN** the entry has no `scope`
- **THEN** only gate directions get ceiling stations and the flows equal those of a build with `scope` set to `gates`

#### Scenario: Scope allNodes
- **WHEN** the entry has `scope` `allNodes`, the period takes simulated membership and a non-gate node is the origin of car flows
- **THEN** that node's origin direction has a ceiling at its static-fit total and its final total is at most 0.1% above it

#### Scenario: Through demand cannot become local demand
- **WHEN** simulated pairs at a counted station would raise the flows of a non-gate origin above its static-fit total
- **THEN** the final total of that origin does not exceed the static-fit total, where with `scope` `gates` it can

#### Scenario: Zero total
- **WHEN** a node direction has a static-fit total of 0
- **THEN** it has no ceiling station

#### Scenario: Unknown scope
- **WHEN** the entry has a `scope` other than `gates` or `allNodes`
- **THEN** the build stops with an error naming the entry

### Requirement: The fit report splits the ceilings by kind and shows where trip ends go
With the entry present, the fit report SHALL state per period the ceiling stations of gates and of non-gate nodes separately (stations, number above ceiling, excess, volume removed by the projection), and the car trip ends at non-gate nodes inside and outside the study area, as origins and as destinations, in the static fit and in the final fit. The existing per-period ceiling line SHALL keep its format.

#### Scenario: Report lines
- **WHEN** a build runs with the entry present and simulated membership
- **THEN** the report has, per period, a line "Ceiling stations by kind" with the gate and non-gate counts and a line "Non-gate node trip ends" with the four static-to-final pairs

### Requirement: The loop reports offered demand against the static fit and warns when it falls far below
The membership loop SHALL read the kind, flow-type and trip-end lines of the report and print them with each build, together with the offered car demand of the build as a percentage of the static fit's. After a final build, if the offered car demand of any view and period is more than 10% below the static fit's, it SHALL print a warning that tells the runner to stop and report. The 10% threshold is an assumption written before any run. The loop SHALL NOT stop on it.

#### Scenario: Final build far below the static fit
- **WHEN** the final build of a view offers 11% less car demand than its static fit in a period
- **THEN** the loop prints a warning naming the view, period and shortfall, and finishes

#### Scenario: Round 49 report
- **WHEN** a fit report has only the round 49 ceiling line
- **THEN** the loop reads it as before and prints no kind or trip-end lines
