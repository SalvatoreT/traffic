## ADDED Requirements

### Requirement: Executed signal duration matches its declared plan
For every accepted signal plan, the sum of phase greens and applicable clearance intervals SHALL equal the declared executed cycle within numerical tolerance. The simulator SHALL validate this invariant on initialization and adaptation. Observed timings SHALL distinguish source durations from derived durations and retain source provenance [FHWA-STM2008].

#### Scenario: Incompatible fixed observations
- **WHEN** an observed two-phase plan declares a 50-second cycle, fixed greens of 29 and 13 seconds, and five seconds of clearance after each phase
- **THEN** the plan is rejected with a diagnostic showing the 52-second required budget and its source, rather than executing it as a matching 50-second observation

#### Scenario: Observed timing fits
- **WHEN** observed greens, free-phase allocations, and clearances fit the declared cycle
- **THEN** the plan executes that cycle and preserves the accepted observed green durations

#### Scenario: Observation-specific clearance
- **WHEN** verified observation-specific clearance durations are supported and provided
- **THEN** allocation and validation use those durations consistently and retain their source rather than substituting global defaults

#### Scenario: An invalid plan reaches an output surface
- **WHEN** signal validation rejects a plan during setup or adaptation
- **THEN** the native and browser-facing callers receive its node, period, declared cycle, required budget, and observation source where available, and suppress results that would imply that plan was executed successfully
