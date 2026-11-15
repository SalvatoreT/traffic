## MODIFIED Requirements

### Requirement: Fixed demand caveat
Because this version holds demand fixed, results SHALL be presented as conditional simulations of the specified trips. Any comparison with [Thomas2024] SHALL identify its London monitoring context and distinguish observed traffic counts from the simulator's distinct-through-car metric. External average effects SHALL NOT be used as local correctness targets without a documented transfer argument. Documentation SHALL NOT claim that fixed demand alone establishes an upper bound on a particular road's traffic, delay, or other outcome. A bound claim SHALL identify its metric, assumptions, and supporting proof or validated procedure.

#### Scenario: Viewing comparison
- **WHEN** a user views baseline-versus-scenario results
- **THEN** the fixed-demand caveat and any contextual citation are visible
- **AND** the text states that behavioral demand response is outside that calculation

#### Scenario: Local result differs from an external study average
- **WHEN** a local scenario's result differs from the average in [Thomas2024]
- **THEN** that difference alone is not treated as a simulator validation failure or success
- **AND** any comparison identifies the population, metric, and model-scope differences

#### Scenario: Claiming a worst case
- **WHEN** a report has only the fact that trip demand was held fixed
- **THEN** it describes the result as a fixed-demand scenario
- **AND** it does not label link traffic or delay as a guaranteed upper bound
