## ADDED Requirements

### Requirement: Observed timing carries a clearance per approach and the lane coding
An observation in `signalObservations` MAY give `clearanceSeconds` that differs from another observation of the same timing; the importer SHALL then write it on that approach's green (`clearanceS`) and keep the timing's clearance from the first observation. An observation that leaves its clearance out while the timing has one SHALL be reported as unmatched. An observation MAY set `noLeftTurnLane`; the importer SHALL then mark the approach links `noPocket`.

#### Scenario: Synchro worksheet with different clearances
- **WHEN** a worksheet gives 4.5 s of clearance after two split phases and 6.0 s after the arterial phase
- **THEN** the node's timing has `clearanceS` 4.5 and the arterial approach's green has `clearanceS` 6

#### Scenario: Approach coded with no left-turn lane
- **WHEN** an observation sets `noLeftTurnLane`
- **THEN** the approach links carry `noPocket: true` in the network file
