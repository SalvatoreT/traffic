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
