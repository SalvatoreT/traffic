# traffic-simulation Specification

## Purpose
How the simulation models vehicles, intersections and route choice, and which results it reports.

## Requirements

### Requirement: Car-following
Vehicles SHALL accelerate according to the Intelligent Driver Model [Treiber2000] with collision-free ballistic integration [Treiber2015] at a fixed 0.25 s step, with per-driver parameters drawn from documented urban ranges.

#### Scenario: Approaching a stopped leader
- **WHEN** a vehicle approaches a stationary vehicle
- **THEN** it decelerates smoothly and stops with a positive gap, never overlapping

#### Scenario: Free road
- **WHEN** no leader is within range
- **THEN** the vehicle approaches its desired speed, bounded by the link speed limit times its compliance factor

### Requirement: Intersection control
The simulation SHALL model signals, all-way stops, two-way stops, uncontrolled intersections and traffic circles, using gap acceptance [Brilon1999, HCM7, Rodegerdts2010] wherever a movement must yield. A signal SHALL group its approaches into phases by street, so that the opposing approaches of one street share a phase and different streets never do, with at most four phases. A signal SHALL recompute its cycle (within 75 to 120 seconds) and green splits by Webster's method [Webster1958] every five minutes from the approach flows measured over the last window, with a minimum green, and a new plan SHALL start when the running cycle ends.

#### Scenario: Red signal
- **WHEN** a vehicle's approach is red
- **THEN** it stops at the stop line and proceeds after green

#### Scenario: Skewed multi-leg junction
- **WHEN** a signalized junction has five legs on three streets, two of them within 45 degrees of each other
- **THEN** each street has its own phase and approaches of one street share a phase

#### Scenario: Demand imbalance
- **WHEN** one street of a signalized crossing carries four times the flow of the other for several adaptation windows
- **THEN** its green is clearly longer than the other street's

#### Scenario: Stop sign
- **WHEN** a vehicle reaches a stop-controlled approach
- **THEN** it comes to a stop and enters only when conflicting traffic leaves an acceptable gap

#### Scenario: No gridlock from spillback
- **WHEN** the downstream link has no space
- **THEN** the vehicle does not enter the intersection

#### Scenario: Queue on a ramp
- **WHEN** vehicles queue on a motorway-class link whose next link is also motorway class
- **THEN** they wait and are not removed by the gridlock breaker, so the queue stays in the origin backlog

#### Scenario: Banned movement
- **WHEN** the network lists a turn ban for a link pair and the simulation runs in a period the ban applies to
- **THEN** cars never take that movement and route around it

#### Scenario: Lower-class approach without a sign
- **WHEN** a two-way stop node has stop signs on some approaches and an unflagged approach of a lower road class than the best approach
- **THEN** that approach yields like the flagged ones

### Requirement: Congestion-responsive route choice
Vehicles SHALL follow least-time routes using link travel times measured in the simulation, with a share of drivers re-routing periodically [Wardrop1952, Peeta2001].

#### Scenario: Arterial congestion
- **WHEN** an arterial's measured travel time rises above that of a parallel local street
- **THEN** some later drivers choose the local street

### Requirement: Deterministic and reproducible
Given the same network, demand, scenario and seed, the simulation SHALL produce identical results.

#### Scenario: Repeat run
- **WHEN** two runs use identical inputs and seed
- **THEN** their metrics after one simulated hour are identical

### Requirement: Cut-through metrics
The simulation SHALL report through-trip traffic on residential and service links inside the study area, per link and in aggregate. The aggregate headline SHALL be the number of through vehicles, in total and per hour, where a through vehicle is a trip with neither end at a node inside the study area (whatever the extent of the modeled region around it), counted once, the first time it exits a residential or service link inside the study area. The simulation SHALL also report the share of vehicle-distance on those links that is through traffic, and MAY report the through distance for calibration tools.

#### Scenario: Through trip on a local street
- **WHEN** a gate-to-gate trip traverses a residential link in the study area
- **THEN** that link's cut-through flow increases and the aggregate through-vehicle count increases by one

#### Scenario: Several local links
- **WHEN** a gate-to-gate trip exits three residential links
- **THEN** the aggregate through-vehicle count increases by one, not three

#### Scenario: Trips that do not count
- **WHEN** a trip starts or ends inside the study area, or a gate-to-gate trip stays on arterials
- **THEN** the aggregate through-vehicle count does not change

#### Scenario: Rate
- **WHEN** the elapsed simulated time is t seconds, at least one
- **THEN** the through vehicles per hour equal the count times 3600 divided by t

### Requirement: Safety surrogate metrics
The simulation SHALL report, for residential links in the study area, mean and 85th-percentile speed, the share of vehicle-time above 20 mph and 25 mph, and counts of car-following conflicts with time-to-collision below 1.5 s [Hayward1972, Mahmud2017], labeled as surrogates rather than crash predictions.

#### Scenario: Speeding on a local street
- **WHEN** vehicles travel a residential link above 25 mph
- **THEN** the share-above-25 metric rises

### Requirement: Network performance metrics
The simulation SHALL report completed trips, mean trip time and delay versus free flow, vehicles in network, and per-link flow, mean speed and density.

#### Scenario: Reading metrics
- **WHEN** the UI requests metrics
- **THEN** it receives a JSON document with these fields for the elapsed simulation window

### Requirement: Bicycles
The simulation SHALL model cyclists as agents with their own desired speeds that obey intersection control, use bike lanes where present, share the lane otherwise, and pass through modal filters.

#### Scenario: Shared street
- **WHEN** a car catches a cyclist on a two-way street with no bike lane and oncoming traffic
- **THEN** the car follows at the cyclist's speed until a gap in oncoming traffic lets it pass

#### Scenario: Modal filter
- **WHEN** a modal filter closes a street to cars
- **THEN** cyclists still travel through it

### Requirement: Pedestrians and crossings
The simulation SHALL model pedestrians walking beside links and crossing at intersections and marked crossings, crossing with the parallel phase at signals and otherwise relying on driver yielding or gaps, with yielding rates cited from the literature.

#### Scenario: Driver yields
- **WHEN** a pedestrian waits at an unsignalized marked crossing and an approaching driver yields
- **THEN** the vehicle stops before the crossing until the pedestrian has cleared it

#### Scenario: Signalized crossing
- **WHEN** a pedestrian reaches a signalized intersection
- **THEN** the pedestrian waits and crosses during the phase parallel to the crossing

### Requirement: Safety metrics for people walking and biking
The simulation SHALL report conflicts between cars and pedestrians or cyclists by post-encroachment time [Hayward1972, Mahmud2017], close passes of cyclists, and an injury-risk index from vehicle speed at each encounter ([Tefft2013] for pedestrians, [Lubbe2022] for cyclists), labeled as surrogate indicators.

#### Scenario: Slower traffic past a crossing
- **WHEN** an intervention lowers vehicle speeds at a crossing that pedestrians use
- **THEN** the pedestrian injury-risk index falls

### Requirement: Per-mode performance metrics
The simulation SHALL report agents in the network, completed trips and mean trip time per mode and mean pedestrian crossing delay, while existing aggregate metrics continue to count cars only.

#### Scenario: Reading metrics
- **WHEN** the UI requests metrics
- **THEN** the document contains the per-mode and vulnerable-road-user sections

### Requirement: Run-averaged link statistics
The simulator SHALL be able to report, for each link, flow, cut-through flow and mean speed averaged over the simulated time since the start of the run (not including the settle interval), so a link's reported values change gradually as the run goes on.

#### Scenario: Quiet street
- **WHEN** a link has carried at least one vehicle since the start of the run
- **THEN** its reported flow stays above zero for the rest of the run and changes by at most the effect of the new evidence divided by elapsed time

### Requirement: Merges onto a multilane exit keep a time gap only
Two movements that merge onto the same multilane exit link SHALL be allowed to cross the node together once the first will have cleared the merge area by the time the second reaches it, while a merge onto a single-lane exit SHALL block until the vehicle has left the node.

#### Scenario: Two approaches, two exit lanes
- **WHEN** two saturated single-lane approaches merge at an uncontrolled node onto a two-lane exit
- **THEN** the exit passes at least 20% more vehicles than the same merge onto a single-lane exit

### Requirement: Right turn on red after a stop
A car whose next movement is a right turn and that has stood at the stop line of a signalized approach on red for the stop dwell SHALL be allowed to turn when no conflicting vehicle is in the node or within the critical gap of the minor-right turn, yielding to every conflicting movement. The rule is an ASSUMPTION (permitted at every signal; the legal text could not be read) and `Config::no_right_turn_on_red` turns it off.

#### Scenario: Light cross traffic
- **WHEN** a one-lane approach of right-turners faces 100 veh/h per lane of cross traffic
- **THEN** its discharge is above the no-turn-on-red discharge by the amount the red time and the two-way-stop right-turn follow-up headway allow (validation case b10)

### Requirement: A queue spilled back to an unsignalized merge counts as signal demand
The standing queue credited to a signalized approach in the adaptive plan SHALL include the standing vehicles of every link feeding an unsignalized merge that the queue has reached, up to the spill hop limit.

#### Scenario: Off-ramp merging ahead of a signal
- **WHEN** an off-ramp and a street merge into the approach of a signal and the approach queue reaches the merge
- **THEN** the ramp's standing vehicles count toward the approach's measured demand

### Requirement: Drivers keep their route unless an alternative is clearly better or the route is blocked
A car SHALL choose its route at departure from current measured link times and afterwards change it only when the route is blocked, or when it follows live guidance and an alternative is cheaper than the remaining route by more than the indifference band. Costs use current link times and the driver's own per-link noise, fixed for the trip. The guidance share (`Config::guided_share`, [Guin2021]) replaces any flat re-route share; the band and limits are ASSUMPTIONS in `params.rs`.

#### Scenario: Near-equal routes
- **WHEN** a driver following guidance faces an alternative cheaper by less than the band or the absolute floor
- **THEN** it keeps its route at every epoch

#### Scenario: Clearly better route
- **WHEN** an alternative without backtracking is cheaper by more than the band and the floor
- **THEN** the driver switches once and does not switch again within the minimum gap, and never more than the cap

#### Scenario: Backtracking
- **WHEN** the only cheaper alternative reverses onto the link just left or revisits a node of the trip and the current route is open
- **THEN** the driver keeps its route; if the route is closed the driver may backtrack

#### Scenario: Blocked route
- **WHEN** an intervention closes a link on the remaining route of a car, or its next link has had no room for the blocked-wait limit
- **THEN** the car re-plans, guided or not, and cars whose route is unaffected keep theirs

### Requirement: Wandering metrics of completed trips
When `Config::record_trips` is set the simulator SHALL record each completed car trip (links entered, en-route route changes, guidance flag) and report per trip the detour ratio against the shortest network distance and against the free-flow time-shortest route, repeated links and nodes, and reversals within 200 m.

#### Scenario: Toy network
- **WHEN** a trip follows the shortest route
- **THEN** its detour ratio is 1 and it has no loop or reversal; a trip that leaves along a link, returns by its reverse and takes another branch has a detour ratio above 1.3, a reversal and a repeated node

### Requirement: Runs start with agents already en route
Unless `Config::initial_load` is false (default true), the simulator SHALL place agents already en route at construction and at every reset. For each flow of the active period the number placed is Poisson with mean rate times the expected free-flow trip time (control delay included) times `INITIAL_CONGESTION`, an assumption. Each agent takes a position drawn uniformly by travel time along its own route, with the rest of its route intact. The result depends only on the seed and the inputs.

#### Scenario: Traffic at time zero
- **WHEN** a simulation is constructed or reset with initial loading on
- **THEN** its clock reads 0, it already holds agents on the network, and `initialAgents` and `initialSkipped` report how many were placed and how many found no room

#### Scenario: Count follows rate and trip time
- **WHEN** one flow runs over a route with a free-flow time T and rate r, over many seeds
- **THEN** the mean number placed is r x T x `INITIAL_CONGESTION` within Poisson noise

#### Scenario: Same seed, same state
- **WHEN** two simulations are built from the same inputs and seed, or one is reset
- **THEN** their initial states are identical

### Requirement: Placed agents are safe and respect the scenario
Agents SHALL be queued in lane order with a safe gap and a speed consistent with their leader, never beyond a stop line or inside a node. An agent with no room SHALL be shifted back or skipped and counted. The scenario's interventions SHALL be in force before placement, so no agent is placed on a link closed to it.

#### Scenario: Gaps, stop lines and closures
- **WHEN** agents are placed on a signalized network with a link closed by an intervention
- **THEN** consecutive vehicles in a lane are at least a vehicle length plus the standstill gap apart, none is beyond a stop line, and none is on the closed link, at construction and after a reset that carried the scenario

### Requirement: Settle interval before time zero
After placing agents the simulator SHALL step a settle interval (`INITIAL_SETTLE_S`, an assumption) so signals hold queues and speeds are consistent, and the public clock SHALL then read 0.

#### Scenario: Clock after settling
- **WHEN** construction finishes
- **THEN** the clock reads 0 and the first step advances it to the step length

### Requirement: Results count from time zero and placed trips are partial
Metrics, link statistics, diagnostics, select-link records, wandering records, safety and vulnerable-user counters SHALL start at zero at time zero. A placed agent's trip began earlier, so its trip time, delay and detour are partial: it SHALL count in completed trips, flows, vehicle-miles, cut-through, speeds and conflicts but not in the mean trip time, mean trip delay, mean crossing delay or wandering statistics.

#### Scenario: Zero state
- **WHEN** a loaded simulation is read at time zero
- **THEN** spawned, completed trips, removals, vehicle-km, cut-through distance and link flows are all zero

#### Scenario: Partial trips stay out of the means
- **WHEN** placed agents finish their trips on a route whose free-flow time is T
- **THEN** they count as completed trips and the mean trip time stays at or above T, because only trips that began after the placement enter it

### Requirement: The router's control delays are measured in simulation and kept in one file
The control delay the router adds per movement at the end of a link (signal, all-way stop, minor approach at a two-way stop, traffic circle) SHALL be read from `crates/sim/data/node-delays.json` by the simulator and by the demand fit's static assignment. `tools/node-delays.ts` SHALL write that file from simulator runs: the flow-weighted median link delay of each control type less that of links that end at no control, with the table of groups beside the previous values.

#### Scenario: One place
- **WHEN** the file changes
- **THEN** the simulator's route costs and the assignment's route costs both use the new constants

### Requirement: Observed signal timing sets the cycle and the green of an approach
A signalized node MAY carry observed timings (periods, cycle, and the green of named incoming links). In a run of a listed period the plan SHALL use the observed cycle and green, and the other phases SHALL share the rest of the cycle by flow ratio with the usual minimum green; in other periods the Webster plan applies.

#### Scenario: Observed green
- **WHEN** a node has an observed cycle of 79 s and 4 s of green for one approach in the run's period
- **THEN** the plan has a 79 s cycle and a 4 s phase for that approach

#### Scenario: Reported against the observation
- **WHEN** a calibration report is written for a period with an observed timing
- **THEN** it shows the modeled cycle and green beside the observed values and the approach's discharge in vehicles per cycle

### Requirement: Unmarked crosswalks exist only at intersections
A node with two legs is a point along one street and SHALL NOT offer pedestrians a crossing unless it is marked [CVC275]. Nodes with three or more legs keep one crosswalk per leg, and a dead end keeps its way around the end.

#### Scenario: Way split on an arterial
- **WHEN** a pedestrian's walk needs the other side of a street at an unmarked node with two legs
- **THEN** the walk crosses at the next intersection or marked crossing instead

### Requirement: Yielding is bounded and ignores vehicles that cannot come
A driver SHALL NOT wait for a conflicting lane whose head stands at the stop line with no room to leave. After the courtesy wait (45 s, ASSUMPTION) a driver SHALL enter ahead of conflicting vehicles that move slower than queue speed, and a driver yielding to a waiting pedestrian SHALL move on. A conflicting stream at speed SHALL be given a real gap until the fallback wait (90 s, ASSUMPTION).

#### Scenario: Blocked major-street lane
- **WHEN** the head of a major-street lane stands at the line because its exit is full
- **THEN** a minor-street driver whose own exit has room crosses without waiting for it

#### Scenario: Heavy cross flow at speed
- **WHEN** a minor through movement or left turn faces 1,000 veh/h per direction on the major street
- **THEN** its capacity is within the range of the gap-acceptance formula [Brilon1999] (validation cases e6 and e9)

### Requirement: Pedestrians at a signal cross in the walk interval of the parallel phase
At a signal each crosswalk SHALL be served with the vehicular phase that runs parallel and adjacent to it, a phase of a neighboring leg that gives the crossed leg no green [FHWA-STM2008]. A pedestrian SHALL step off only in that phase's walk interval: enough green is left to clear the crossing at 1.22 m/s, or the green began less than 7 s ago [FHWA-STM2008].

#### Scenario: Arriving along the street to be crossed
- **WHEN** a pedestrian reaches a signal along the leg whose crosswalk they need
- **THEN** they wait for the cross street's phase and do not step off while the crossed approach has green

#### Scenario: Arriving late in the phase
- **WHEN** a pedestrian reaches the curb after the clearance interval of the parallel phase has begun
- **THEN** they wait for the next walk interval, and the crosswalk is clear when the crossed approach gets green

#### Scenario: No phase without green for the crossed leg
- **WHEN** every neighboring phase also serves the crossed leg
- **THEN** the pedestrian waits for a gap as at an unsignalized crossing

### Requirement: An observed approach can run in a phase of its own
When the observed timing of a signal marks an approach as having its own phase in the run's period, the plan SHALL take that approach out of the phase of its street and give it a phase right after it with the observed green, so that all its movements run while the opposing approach waits [FHWA-STM2008]. A protected left turn that leads or lags is represented this way, as an assumption.

#### Scenario: Split phases
- **WHEN** the eastbound and westbound approaches of a street are both marked with greens of 33.5 s and 27.5 s in a 110 s cycle
- **THEN** the plan has three phases, the two approaches never have green together, and the cross street takes the rest of the cycle

### Requirement: A crosswalk runs with the approach beside it
Where the two approaches that neighbor a crosswalk have different phases, the crosswalk SHALL be served with the phase of the approach that arrives on the next leg clockwise, the traffic that runs beside it [FHWA-STM2008], before the other is considered.

#### Scenario: Protected left turn
- **WHEN** an approach with a phase of its own turns left over a crosswalk
- **THEN** pedestrians use that crosswalk in the opposing approach's phase and the left turn meets no walk interval

### Requirement: Marked left-turn lanes hold their link
A left-turn lane marked along a link [OSMTurnLanes] SHALL store left-turners along the whole link, and left-turners on that link SHALL use no other lane and wait upstream when it is full.

#### Scenario: Marked lane at a signal
- **WHEN** a quarter of the drivers on a four-lane approach with one marked left lane turn left
- **THEN** the three other lanes hold no left-turner

### Requirement: Drivers sort for a turn ahead of it and keep to that side
A driver entering a link SHALL sort for the first left or right turn at a link end that offers a choice within 150 m beyond the end of the link, passing over link ends with a single movement, and SHALL use only the lanes on that side of the road, the middle lane of an odd number included. Both rules are assumptions.

#### Scenario: Ramp joining a street before a signal
- **WHEN** a two-lane ramp joins a street 60 m before a signal where some of its drivers turn left
- **THEN** those drivers take the left lane of the ramp and the others may use both lanes

### Requirement: Local trips start and end along the block
A car trip whose origin is not a gate SHALL enter the curb lane of its first link from a standstill at a position along the block, when the gap rule of gate insertion [Treiber2000] holds toward the vehicles ahead and behind. A trip whose destination is not a gate SHALL leave the road at such a position on its last link. Blocks shorter than 20 m and gates SHALL keep the junction end. The first link SHALL be legal under the current interventions.

#### Scenario: Filter at the origin junction
- **WHEN** a modal filter stands on a junction that is the origin of local trips
- **THEN** those trips start along the adjoining blocks, complete, and no car crosses the junction

#### Scenario: Gate trips
- **WHEN** a trip starts at a gate
- **THEN** it enters at the start of its first link as before, and only gate-to-gate trips count as through vehicles

### Requirement: Route costs by turning movement
The simulator SHALL measure the time on a link separately for each movement at its end and SHALL add to a movement's cost the difference between the time of the vehicles that made that movement and the time of the link as a whole, so that the cost of a link and movement together is the larger of the free-flow time and the movement's measured time. Free-flow routing for metrics SHALL not use the measured times.

#### Scenario: Left-turn queue beside free through lanes
- **WHEN** left-turners on a link wait 70 s and through vehicles 15 s
- **THEN** a route that goes straight on is charged about 15 s on that link and a route that turns left about 70 s

### Requirement: A crossing vehicle does not reserve exit-lane room
A vehicle that begins to cross a node SHALL NOT add its length to the room that the next vehicle sees on the exit lane. A vehicle SHALL begin to cross only when the lane has room in front of its tail vehicle, with the leader's motion over `NODE_CROSS_S` credited, and a vehicle that finds no physical room on emerging SHALL stay in the node until there is.

#### Scenario: A left turn into a short single-lane link
- **WHEN** a saturated left-turn lane discharges during a protected green into a single-lane link of 32 m
- **THEN** vehicles begin to cross about every 2 to 3 s while the link is free, instead of every 3 to 4 s

### Requirement: A flow can make a given movement
A demand flow MAY carry `via`, a movement given as the ids of an entry link and an exit link, with an optional `maxDetour` (a ratio, default 1.3, ASSUMPTION) and an optional ordered list of `alternatives`, each an entry link and an exit link (ASSUMPTION: movements of the same turn family on parallel streets). A trip of such a flow SHALL be routed to the entry link, through the movement, and on to its destination, and every re-plan before the movement is made SHALL keep it, while the movement counts. A movement counts only when it is open, its route costs at most `maxDetour` times the plain route to the destination in the current network on free-flow costs (congestion alone does not drop a counted movement), and the route passes no node twice that the plain route does not also pass twice. The primary movement SHALL be taken when it counts, else the cheapest alternative that counts, else the trip SHALL take its plain route. The check SHALL run when the trip starts and at each re-plan before the movement is made. A demand file without `via` SHALL give the same results as before.

#### Scenario: Counted left turn
- **WHEN** a flow of 5 veh/h carries a via movement from the southbound approach of one street to a left turn onto the cross street
- **THEN** its trips take that left turn

#### Scenario: Closed exit
- **WHEN** an intervention closes the exit link of the movement
- **THEN** the trips of the flow take their plain routes unless an alternative counts

#### Scenario: Detour beyond the tolerance
- **WHEN** an intervention makes the route through the movement cost more than `maxDetour` times the plain route
- **THEN** the trips skip the movement and take an alternative that counts or their plain routes

#### Scenario: Blocked primary, open alternative
- **WHEN** the primary movement is banned and an alternative counts
- **THEN** every trip of the flow makes the alternative and none makes the primary

#### Scenario: Loop
- **WHEN** the route through the movement would pass a node twice that the plain route passes once
- **THEN** the movement does not count

### Requirement: An observed approach can have green alone and then with the opposing approach
When an observation lists the approach an approach also runs with, the plan SHALL give it a phase alone of its through green less the partner's green and add it to the partner's phase [FHWA-STM2008]. A link in two phases SHALL show the better signal state. The protected left of a lead-lag is shown this way as an assumption.

#### Scenario: Eastbound through 57.2 s, westbound 27.6 s
- **WHEN** an approach with 57.2 s of green runs with an opposing approach of 27.6 s in a 110 s cycle
- **THEN** the plan has three phases, the first with the approach alone for 29.6 s, the second with both for 27.6 s and the third with the cross street, and the approach has green for 57.2 s of the cycle

### Requirement: Through cars by intent
The simulator SHALL tally each through car once under the intent of its flow, or under "other", at the moment the through count counts it, and SHALL report cars an hour per intent in `cutThrough.byIntent` (the demand's intents in order, then `other`; they sum to the through count). It SHALL expose the cumulative number of those cars that left each link, per intent. Results SHALL be deterministic for a seed.

#### Scenario: Rows add up
- **WHEN** a run has through cars
- **THEN** the per-intent vehicles sum to `cutThrough.vehicles`
