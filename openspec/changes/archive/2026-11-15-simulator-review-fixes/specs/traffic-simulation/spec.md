## MODIFIED Requirements

### Requirement: Intersection control
The simulation SHALL model signals, all-way stops, two-way stops, uncontrolled intersections and traffic circles, using gap acceptance [Brilon1999, HCM7, Rodegerdts2010] wherever a movement must yield. A signal SHALL group its approaches into phases by street, so that the opposing approaches of one street share a phase and different streets never do, with at most six phases (ASSUMPTION: a cap; the signals of the Rockridge data need three, and approaches beyond the cap share a phase with the closest axis). A signal SHALL recompute its cycle (within 75 to 120 seconds) and green splits by Webster's method [Webster1958] every five minutes from the approach flows measured over the last window, with a minimum green, and a new plan SHALL start when the running cycle ends.

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

### Requirement: Simulator fingerprint
The simulator SHALL expose a fingerprint computed at build time from what can change a run: the `.rs` sources of its own module tree (names and contents, line endings normalized; the bins, the proposal search, the tests, the WASM glue and the validation and wandering tools excluded), the `data/*.json` files compiled into it, and the `Cargo.lock` entries of the dependencies it uses. The same inputs SHALL give the same value on any machine, and a change to any hashed input SHALL change it. The WASM build SHALL export it as `simulatorFingerprint()`.

#### Scenario: Same sources
- **WHEN** the simulator is built twice from the same sources on different machines
- **THEN** the fingerprint is identical

#### Scenario: Files that cannot change a run
- **WHEN** a file of the proposal search, a bin, a test, a hidden or non-JSON file in `data/`, or a lock entry of a WASM-only dependency changes
- **THEN** the fingerprint does not change

## ADDED Requirements

### Requirement: Native and WASM builds give identical results
Every transcendental function the simulator uses (exponential, logarithm, power, sine, cosine, arctangent, hypotenuse) SHALL come from one deterministic implementation (`libm`), so the native and WASM builds compute the same bits for the same network, demand, scenario and seed.

#### Scenario: One PM hour
- **WHEN** the same PM hour is run natively and in the WASM build
- **THEN** the metrics, the vehicle positions, the link statistics and the per-intent link usage are identical, and `npm run check:wasm` compares them

### Requirement: Placed agents of a flow with an assumed movement make it
Initial placement SHALL route a car of a flow that carries an assumed movement as a trip of that flow would be routed from its origin. A placed car whose position is before the movement's exit link SHALL carry the movement as pending, and the expected number placed SHALL use that route.

#### Scenario: Car on the entry link
- **WHEN** agents are placed for a flow whose movement turns off an arterial at its first junction
- **THEN** every car placed on the entry link has the movement pending and turns off at its end, and no car past the movement has one

### Requirement: A re-plan around a blocked link keeps no movement it skips
A car that re-plans around a blocked next link SHALL drop its pending assumed movement when the new route does not make it. The new route SHALL NOT pass a junction the car has already driven through, and a car with no such way out keeps its route and waits.

#### Scenario: Skipped movement
- **WHEN** a car with a pending assumed movement leaves its blocked route by another link
- **THEN** its route no longer holds the movement and the car carries none

### Requirement: Per-intent link usage counts links left at or after time zero
The per-intent link usage of a through car SHALL credit only links it left at or after t = 0, so that on local links the sum over intents equals the through-car exit counter of the link.

#### Scenario: Placed and settled cars
- **WHEN** through cars were on the network at time zero
- **THEN** on every local link the per-intent usage summed over intents equals the through-car exit counter
