## ADDED Requirements

### Requirement: An observation can give only the lane coding
An observation in `signalObservations` MAY give `noLeftTurnLane` with no cycle, no green, no `ownPhase`, no `runsWithHeading` and no clearance. The importer SHALL then mark the matched approach links `noPocket` and SHALL attach no signal timing for it. An observation that gives part of a timing, or a clearance without a timing, SHALL still be reported as unmatched.

#### Scenario: Worksheet lane coding on an approach with no observed phase
- **WHEN** an observation names an approach with `noLeftTurnLane` and nothing else
- **THEN** the approach links carry `noPocket: true` and the signal gets no `signalTiming` from it

#### Scenario: Clearance without a timing
- **WHEN** such an observation also gives `clearanceSeconds`
- **THEN** it is reported as unmatched
