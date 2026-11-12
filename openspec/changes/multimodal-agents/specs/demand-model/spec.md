## ADDED Requirements

### Requirement: Mode per flow
Each demand flow SHALL carry a mode of car, bicycle or pedestrian, defaulting to car when absent.

#### Scenario: Loading older demand
- **WHEN** a demand file has no mode on its flows
- **THEN** all flows are treated as car trips

### Requirement: Transit service from published schedules
Bus routes, stops and headways SHALL be derived from the transit agency's published GTFS feed, cut to the model area and recorded with provenance.

#### Scenario: Route crossing the area
- **WHEN** a bus route in the feed runs along a street in the network
- **THEN** the transit file lists its path through the network, its stops and a headway for each period

### Requirement: Walking and biking demand labeled as assumptions
Pedestrian and bicycle flows SHALL be synthesized from public data with every mode share, trip rate and trip-length value exposed in configuration and labeled as an assumption.

#### Scenario: Reading provenance
- **WHEN** someone reads the demand provenance
- **THEN** walking and biking volumes are stated to be assumptions, not counts
