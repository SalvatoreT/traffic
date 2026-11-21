## ADDED Requirements

### Requirement: Stored route samples do not depend on run order
The stored links of each route SHALL come from the lowest seed whose run drove that street list, so the file is the same for any `--jobs` value and any order in which seed results finish. Counts, per-hour figures and shares SHALL NOT depend on the sample.

#### Scenario: Arrival order
- **WHEN** the same seed results arrive in two different orders
- **THEN** the stored routes and their links are identical
