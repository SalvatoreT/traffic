## MODIFIED Requirements

### Requirement: Through cars by intent
The simulator SHALL tally each through car once under the first demand intent that fits it, or under "other", at the moment the through count counts it, and SHALL report cars an hour per intent in `cutThrough.byIntent` (the demand's intents in order, then `other`; they sum to the through count). An intent fits a car by the freeway on-ramp on its planned route, by the off-ramp among the links it has driven, or, for an intent that names no ramp, by the intent its flow carries. It SHALL expose the cumulative number of those cars that left each link, per intent, and the cars per intent, origin and destination. Results SHALL be deterministic for a seed.

#### Scenario: Rows add up
- **WHEN** a run has through cars
- **THEN** the per-intent vehicles sum to `cutThrough.vehicles`

## ADDED Requirements

### Requirement: Through cars are grouped by the freeway ramp they use
A demand MAY list freeway ramps (an id, a kind `on` or `off`, and the freeway-class links of the chain) and intents that match on `onRamp` or `offRamp`, a ramp id or `other` (any ramp of that kind no intent lists). The first intent in order that fits a car SHALL take it. A car that uses no ramp SHALL fall to the intents that name none. A demand without ramps SHALL tally as before.

#### Scenario: On-ramp from the planned route
- **WHEN** a through car is counted and its planned route ahead enters a listed on-ramp
- **THEN** it is tallied under the intent that names that on-ramp, and under the intent for other on-ramps when no listed intent names the ramp it will use

#### Scenario: Off-ramp from the links driven
- **WHEN** a through car that came off a listed off-ramp is counted
- **THEN** it is tallied under the intent that names that off-ramp

#### Scenario: First match wins
- **WHEN** an origin-and-destination intent is listed before the ramp intents
- **THEN** a car of a flow that carries it is tallied there, not under its ramp

### Requirement: The simulator reports how often a planned on-ramp is not the one driven
The simulator SHALL count, for counted through cars that planned an on-ramp and finished their trip, how many drove another ramp or none.

#### Scenario: Static costs
- **WHEN** route costs do not change a planned ramp
- **THEN** the count of cars that drove another ramp is zero

### Requirement: A flow can make two movements in order
A flow's movement MAY carry a second movement (`then`) with its own tolerance and alternatives. A trip SHALL make the first movement, then the second, each chosen and kept by the rules of an assumed movement; a stage that does not count SHALL fall back on its own (the first on its alternatives or the plain route, the second on its alternatives or the plain route from the first's exit). Placement SHALL carry the stage a car has still to make.

#### Scenario: Ramp, then turn
- **WHEN** a flow's first movement is an off-ramp and its second a turn at the ramp's terminal
- **THEN** every trip makes the ramp and then the turn, in that order

#### Scenario: Second movement banned
- **WHEN** the second movement is banned
- **THEN** the trips still make the first and take their plain route on

#### Scenario: Placed between the stages
- **WHEN** a car is placed after the first movement and before the second
- **THEN** it carries the second as its pending movement
