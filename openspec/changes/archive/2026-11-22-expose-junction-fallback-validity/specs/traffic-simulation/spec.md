## ADDED Requirements

### Requirement: Recovery decisions are observable
The simulator SHALL count recovery decisions separately by reason, including courtesy behavior, approach-gap or stop-order fallback, attempts to bypass physical exclusion and any replacement recovery. It SHALL distinguish evaluated eligibility and blocked attempts from actual affected admissions. Actual admissions SHALL be counted once per transition. Diagnostics SHALL identify the node, movement and time and SHALL distinguish initialization from the measured run.

#### Scenario: Repeated blocked evaluations
- **WHEN** a waiting head repeatedly qualifies for a fallback but remains physically blocked
- **THEN** the reported actual-admission count remains unchanged and the diagnostics identify the blocked reason under a documented attempt-count definition

#### Scenario: Admission depends on courtesy
- **WHEN** a vehicle enters under a courtesy rule that changes the ordinary priority decision
- **THEN** one affected admission is attributed to that reason, node, movement and time

### Requirement: Production recovery preserves physical exclusion
Every production recovery policy SHALL preserve modeled conflict-point occupancy exclusion and downstream-space constraints regardless of a vehicle's waiting time. Behavioral courtesy MAY change priority under a documented assumption but SHALL NOT waive physical exclusion. Any reroute or removal used for recovery SHALL be reported and included in conservation accounting.

#### Scenario: Active conflict beyond the wait threshold
- **WHEN** `transit_blocks` reports an active physical conflict for a waiting vehicle whose wait exceeds a behavioral or recovery threshold
- **THEN** both permission and final admission remain blocked until physical occupancy permits passage

#### Scenario: Geometric conflict without temporal overlap
- **WHEN** two movements cross geometrically but their modeled conflict-point occupancy intervals do not overlap and other admission rules allow them
- **THEN** physical exclusion does not prohibit their valid concurrent movement

### Requirement: Invariants cover node transit
The simulator's invariant checker SHALL validate lane/transit membership, movement ownership, crossing progress and conflict-point occupancy intervals, including vehicle length and the model's clearance margin. A vehicle held by a blocked exit SHALL remain represented as occupying its actual position after its planned crossing time ends.

#### Scenario: Invalid membership
- **WHEN** an alive vehicle is simultaneously assigned to a lane and transit, or occurs in multiple transit records
- **THEN** the checker reports the vehicle and inconsistent memberships

#### Scenario: Delayed exit from a node
- **WHEN** an agent cannot leave a node after its planned transit time because its exit is blocked
- **THEN** the checker and admission policy use its actual remaining occupancy and do not assume it has disappeared

### Requirement: Vehicles held at a node exit stay physical
A vehicle that reaches the end of its node crossing behind a standing or crawling vehicle SHALL enter its exit lane as soon as there is physical room, at no more than the speed that lets it stop behind the lane's last vehicle. Without room it SHALL stand at the end of its path; its exit lane SHALL then offer no room to further admissions, and no other vehicle in the node SHALL advance onto a conflict point it still covers. The room margin and deceleration are assumptions.

#### Scenario: Standing queue on the exit
- **WHEN** a crossing vehicle finds a standing vehicle a few meters into its exit lane
- **THEN** it enters behind it at a speed from which it can stop, or stands at the end of its path while the lane is full, and no other vehicle crosses toward that lane while it stands

### Requirement: A vehicle behind a moving leader enters at its exit speed
A vehicle that reaches the end of its node crossing close behind a vehicle that is still moving SHALL wait until it could brake behind that vehicle from its exit speed and then enter at that speed. The speed that separates a moving from a crawling leader is an assumption.

#### Scenario: Moving leader just ahead
- **WHEN** a crossing vehicle reaches its exit lane close behind a vehicle that is still moving
- **THEN** it waits at the end of its path until it could brake behind that vehicle from its exit speed and then enters at that speed

### Requirement: Vehicles do not start toward one exit lane side by side
A vehicle SHALL NOT start crossing a node toward an exit lane while a vehicle from another approach lane that is crossing toward the same exit lane would still be within the room a new vehicle needs when this one emerges. Lane choice among several exit lanes SHALL count the vehicles already crossing toward each lane.

#### Scenario: Lane drop
- **WHEN** two lanes of one road continue as one lane at a node and both lanes are queued
- **THEN** their vehicles enter the single lane in turn, and the flow past the drop stays within the range of validation case i5

#### Scenario: Two exit lanes
- **WHEN** two vehicles leave two approach lanes at the same moment for a two-lane exit with equal room
- **THEN** they take different exit lanes

### Requirement: A vehicle held too long in a node is removed and reported
A vehicle held at the end of its node crossing for the gridlock removal time SHALL be removed, counted among gridlock removals and recovery removals, and logged with its node and movement. Movements between motorway links MAY wait instead, as motorway queues do on links. The removal time is an assumption.

#### Scenario: Exit stays full
- **WHEN** a vehicle has stood at the end of its crossing for the gridlock removal time on a non-motorway movement
- **THEN** it is removed, counted among gridlock removals and recovery removals, and logged with its node and movement
