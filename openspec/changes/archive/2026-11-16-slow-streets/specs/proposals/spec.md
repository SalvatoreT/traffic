## ADDED Requirements

### Requirement: Speed reductions are Slow Streets in the search
The proposal search SHALL offer speed reductions only as Slow Streets, one per street whose busiest block carries at least a quarter of the busiest block's through traffic in the baseline, ranked like other candidates. It SHALL NOT generate per-block speed limits. Packages in the seeds file that hold per-block limits SHALL stay loadable.

#### Scenario: Candidates
- **WHEN** the candidate list is generated
- **THEN** it holds Slow Streets and no per-block speed limit

#### Scenario: Filter on a Slow Street
- **WHEN** a package holds a Slow Street and a modal filter on a block of that street
- **THEN** the two do not conflict

### Requirement: Places of a Slow Street
A Slow Street SHALL occupy one place per street name, so it combines with a filter or a one-way on the same street. A Slow Street and per-block limits on the same street SHALL count as the same change in conflict and similarity rules.

#### Scenario: Same street, two forms
- **WHEN** a package holds a Slow Street and another holds per-block limits on the same street
- **THEN** the search treats them as the same place
