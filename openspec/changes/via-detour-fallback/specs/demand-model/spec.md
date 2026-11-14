## ADDED Requirements

### Requirement: Assumed flows carry their detour tolerance and alternatives
The demand builder SHALL write `via.maxDetour` on each flow with `via`, equal to the configured `maxDetour` of its movement, and, when the movement has intents, `via.alternatives`: the other configured movements with an intent of the same origin and destination groups as an intent the flow's pair belongs to, in configuration order. No street name SHALL appear in code. Config, fit report, provenance and README SHALL label both an ASSUMPTION.

#### Scenario: Parallel turn family
- **WHEN** two movements on parallel streets have intents with the same origin and destination groups
- **THEN** each flow of one lists the other movement as an alternative

#### Scenario: Movement without intents
- **WHEN** a movement has no intents
- **THEN** its flows carry `maxDetour` and no alternatives
