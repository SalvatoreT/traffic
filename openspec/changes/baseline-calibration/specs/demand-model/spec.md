## ADDED Requirements

### Requirement: Routable flows only
Demand SHALL contain only flows whose destination is reachable from the origin in the baseline network.

#### Scenario: Exit-only gate
- **WHEN** a gate is exit-only
- **THEN** no flow originates there
