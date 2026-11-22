## MODIFIED Requirements

### Requirement: Measured link delays can feed the assignment
When the file named by `countFit.assignment.measured.file` exists for the same network, the static assignment SHALL add the simulator's mean delay per vehicle on each link (less the control delay the router already adds), times `countFit.assignment.measured.weight` (1 when omitted), to the free-flow cost. Without the file it SHALL use free-flow and BPR costs.

#### Scenario: File absent
- **WHEN** the file does not exist
- **THEN** the assignment uses free-flow and BPR costs

#### Scenario: Damped step
- **WHEN** the config sets `weight` to 0.5
- **THEN** each link's cost carries half of its measured delay, and the fit report states the weight
