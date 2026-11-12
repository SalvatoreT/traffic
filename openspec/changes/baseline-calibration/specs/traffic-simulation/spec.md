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
