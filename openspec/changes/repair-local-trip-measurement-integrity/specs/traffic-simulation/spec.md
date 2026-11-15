## ADDED Requirements

### Requirement: A local trip has distinct physical endpoints
The simulator SHALL store distinct origin and destination positions for local trips and SHALL use the same positions for insertion, placement, completion and measurement. The sampling policy SHALL distinguish endpoint roles, remain deterministic for the seed and trip, and define how a legal directed route connects the positions. The policy SHALL be documented as an assumption unless supported by observations.

#### Scenario: One-link local trip
- **WHEN** a local trip is assigned distinct physical endpoints on one directed link
- **THEN** it drives the distance between them before completion and contributes that distance to the relevant exposure counters

#### Scenario: Exit behind the entry
- **WHEN** sampled endpoints cannot be served in their order on a directed link
- **THEN** the simulator follows its documented legal placement or routing policy and never completes the trip at its origin merely because the exit lies behind it

#### Scenario: Repeated and paired runs
- **WHEN** a run is reset or a paired scenario uses the same trip and available endpoint links
- **THEN** the physical endpoints are reproducible and remain the same requested locations

### Requirement: Trip delay uses the distance actually traversed
A trip's free-flow reference SHALL use the actual first and last link portions, the applicable driver compliance speed, and only the humps and node movements the trip traverses. The implementation SHALL expose enough information in tests or diagnostics to reconcile the reference with the trip path. Negative values caused by accounting errors SHALL NOT be hidden by clamping the result.

#### Scenario: Partial first and last links
- **WHEN** a local trip traverses only portions of its first and last links
- **THEN** the free-flow reference excludes the untraversed portions and agrees with the documented reference calculation within the integrator's stated numerical tolerance [Treiber2015]

#### Scenario: Hump outside the trip
- **WHEN** a hump lies before the trip's entry or beyond its exit on an endpoint link
- **THEN** that hump contributes no free-flow penalty to the trip

### Requirement: Trip event timestamps are causal
For every mode, the simulator SHALL preserve requested arrival time less than or equal to insertion time less than or equal to completion time. It SHALL use a documented convention for events within its fixed step and SHALL include waiting to enter in the trip-time definition when that definition starts at requested arrival.

#### Scenario: Arrival inside a simulation step
- **WHEN** a request arrives strictly between the start and end of a simulation step and can finish within that step
- **THEN** its completion time is no earlier than its arrival time and its measured duration is nonnegative

#### Scenario: Queue before insertion
- **WHEN** a trip waits for entry space
- **THEN** its requested arrival time is retained and its waiting time is counted once according to the documented trip-time definition

### Requirement: Terminal motion contributes to exposure
The simulator SHALL account for a vehicle's actual terminal distance and time before removing it from a link or completing its trip. Node transfers SHALL count each traveled portion once. The recorded terminal position SHALL be bounded by the physical exit position, with numerical tolerances documented for the ballistic integration [Treiber2015].

#### Scenario: Local completion within a step
- **WHEN** a vehicle reaches its local destination during a step
- **THEN** the distance and exposure from its previous position to the destination are recorded before completion, and no time after exit is charged

#### Scenario: Ordinary link exit
- **WHEN** a vehicle leaves a link for a node or gate
- **THEN** the final on-link increment and node increment are each counted once and their sum reconciles with the path driven
