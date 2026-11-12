## ADDED Requirements

### Requirement: Mode per flow
Each demand flow SHALL carry a mode of car, bicycle or pedestrian, defaulting to car when absent.

#### Scenario: Loading older demand
- **WHEN** a demand file has no mode on its flows
- **THEN** all flows are treated as car trips

### Requirement: Walking and biking demand labeled as assumptions
Pedestrian and bicycle flows SHALL be synthesized from public data with every mode share, trip rate and trip-length value exposed in configuration and labeled as an assumption.

#### Scenario: Reading provenance
- **WHEN** someone reads the demand provenance
- **THEN** walking and biking volumes are stated to be assumptions, not counts
