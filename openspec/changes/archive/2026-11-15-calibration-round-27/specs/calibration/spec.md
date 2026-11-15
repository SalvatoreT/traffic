## ADDED Requirements

### Requirement: Failing held-out stations are listed
For each period, the assessment SHALL list the recent held-out stations that are at GEH 5 or more on the cross-validation demand, with their counted and modeled flows and GEH there and the same station's modeled flow and GEH on the shipped demand.

#### Scenario: Held-out station fails out of sample
- **WHEN** a recent held-out station scores GEH 5 or more on the cross-validation demand
- **THEN** the verdict section has a row with its counted flow, its cross-validation and shipped flows and both GEH values
