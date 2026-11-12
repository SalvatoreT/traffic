## MODIFIED Requirements

### Requirement: Intersection control changes
Users SHALL be able to change a node's control type and a signal's cycle length. A cycle length set by the user SHALL stay fixed while the green splits keep adapting to measured flows.

#### Scenario: Stop to signal
- **WHEN** a two-way stop is changed to a signal
- **THEN** the node runs a Webster-derived plan whose splits adapt to measured flows

#### Scenario: Pinned cycle
- **WHEN** a user sets a signal's cycle to 100 seconds
- **THEN** the cycle stays 100 seconds after later adaptations
