## ADDED Requirements

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
