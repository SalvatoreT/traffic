## MODIFIED Requirements

### Requirement: Assumed flows carry their detour tolerance and alternatives
The demand builder SHALL write `via.maxDetour` on each flow with `via`, equal to the configured `maxDetour` of its movement, and, when the movement has intents, `via.alternatives`: the other configured movements that have an intent whose origin set and destination set (sets expanded) contain the origin group and the destination group of the flow's pair, in configuration order. The match is on the pair, so intents of two streets that name a set and one of its members are alternatives of each other. No street name SHALL appear in code. Config, fit report, provenance and README SHALL label both an ASSUMPTION. Volumes SHALL NOT change.

#### Scenario: Parallel turn family
- **WHEN** two movements on parallel streets have intents with the same origin and destination groups
- **THEN** each flow of one lists the other movement as an alternative

#### Scenario: Intents that name a set and a member
- **WHEN** one movement has an intent from the set `west-side` and the other has intents from `telegraph-north` and `west-side-other`, which together are the members of that set
- **THEN** a flow whose origin is in a member lists the other movement as an alternative

#### Scenario: Movement without intents
- **WHEN** a movement has no intents
- **THEN** its flows carry `maxDetour` and no alternatives
