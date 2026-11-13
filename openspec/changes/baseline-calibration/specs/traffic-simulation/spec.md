## MODIFIED Requirements

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

## ADDED Requirements

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
