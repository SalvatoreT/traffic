## ADDED Requirements

### Requirement: Through cars by intent
The simulator SHALL tally each through car once under the intent of its flow, or under "other", at the moment the through count counts it, and SHALL report cars an hour per intent in `cutThrough.byIntent` (the demand's intents in order, then `other`; they sum to the through count). It SHALL expose the cumulative number of those cars that left each link, per intent. Results SHALL be deterministic for a seed.

#### Scenario: Rows add up
- **WHEN** a run has through cars
- **THEN** the per-intent vehicles sum to `cutThrough.vehicles`
