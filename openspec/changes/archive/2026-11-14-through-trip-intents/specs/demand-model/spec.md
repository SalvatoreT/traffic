## ADDED Requirements

### Requirement: Approach groups name where through cars come from and go to
The area config MAY define `approachGroups`: ordered rules that place each gate outside the study area in a named group by street names, road classes, entry or exit role and compass sector, plus overrides and named sets. Every gate SHALL fall in a group, and a node that is not a gate SHALL take the group of the nearest surface gate. The demand build SHALL write the groups to `data/demand/<area>.groups.json`. No street name SHALL appear in code.

#### Scenario: Gate placed by rule
- **WHEN** a gate carries Telegraph Avenue links and lies in the north sector
- **THEN** it belongs to the first group whose rule matches those names and that sector

#### Scenario: Gate no rule matches
- **WHEN** a gate matches no rule and has no override
- **THEN** the build stops and lists the gate

### Requirement: Assumed movements can carry intents
An assumed movement MAY list `intents`, each with a label, an origin group, a destination group and exactly one of a share of the movement's counted volume or a PM volume in veh/h. The candidates of an intent SHALL be the seed flows between its groups that pass the detour limit and the loop rule, and its volume SHALL be split over them in proportion to their seed volume.

#### Scenario: Intent restricts the pairs
- **WHEN** an intent runs from a Telegraph Ave group to the SR-24 on-ramp groups
- **THEN** only seed flows from nodes of the first group to nodes of the second are given its volume

#### Scenario: Closed movement
- **WHEN** an intervention closes a movement that carries assumed flows
- **THEN** the simulator routes those trips by the plain route (unchanged from round 20)

### Requirement: Intents stay within the count and are not counted twice
The intents of a movement SHALL NOT add up to more than its counted volume. The plain flow of each pair SHALL give up the trips its assumed flow carries, never more than 80% of it, and the report SHALL state the amount.

#### Scenario: Intents exceed the count
- **WHEN** the intents of a 76 veh/h movement add up to 90 veh/h
- **THEN** the build stops with an error

#### Scenario: Same pair, plain and assumed
- **WHEN** an assumed flow of 30 veh/h runs between the origin and destination of a plain flow of 100 veh/h
- **THEN** the plain flow starts the fit at 70 veh/h

### Requirement: Assumed intents are labeled
The configuration, the fit report, the demand provenance and the calibration record SHALL label every intent flow an ASSUMPTION and give each intent's volume, candidates, flows kept and the volume taken from plain flows.

#### Scenario: Fit report
- **WHEN** the demand is built with intents
- **THEN** the fit report has an intents table per movement and period
