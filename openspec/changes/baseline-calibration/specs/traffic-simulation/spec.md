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
