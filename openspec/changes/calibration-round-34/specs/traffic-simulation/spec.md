## ADDED Requirements

### Requirement: Each phase of an observed plan keeps its own clearance
An observed timing MAY give a clearance interval per approach. The phase that holds an observed approach with its own clearance SHALL use it; the other phases SHALL use the timing's clearance, or `YELLOW + ALL_RED` when none is given. The plan SHALL hold the observed cycle exactly when the greens and these clearances add up to it, and SHALL be reported as an issue otherwise, never stretched. Each clearance SHALL lie between `YELLOW` and three times `YELLOW + ALL_RED`.

#### Scenario: Split phases with a longer arterial clearance
- **WHEN** a 100 s plan gives two split phases of 17.0 s and 17.5 s with 4.5 s of clearance and an arterial phase of 50.5 s with 6.0 s
- **THEN** the plan runs a 100 s cycle with those greens, and each phase starts after the previous phase's green and its own clearance

#### Scenario: Clearances that do not fit
- **WHEN** the same plan gives the arterial phase 7.0 s of clearance
- **THEN** the plan is rejected with its budget (101.0 s) and its source

### Requirement: No pocket on an approach observed to have no left-turn lane
A link marked `noPocket` SHALL get no class-rule left-turn pocket, so its left-turners share the inner lane.

#### Scenario: Worksheet lane coding
- **WHEN** a signalized secondary approach is marked `noPocket`
- **THEN** it has only its tagged lanes and no pocket lane
