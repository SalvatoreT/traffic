## ADDED Requirements

### Requirement: Scenario as a list of interventions
A scenario SHALL be an ordered list of interventions (Intervention contract) applied on top of the baseline network; an empty list is the baseline.

#### Scenario: Removing an intervention
- **WHEN** an intervention is removed from the list
- **THEN** the simulated network returns to its prior behaviour for that element

### Requirement: Modal filters
A modal filter on a link or node SHALL prevent motor vehicles from passing through it while leaving access to both sides, and routes SHALL adapt.

#### Scenario: Filtered street
- **WHEN** a modal filter is placed on a residential link used by through traffic
- **THEN** no motor vehicle traverses it and affected trips re-route

### Requirement: Traffic calming
Speed humps SHALL reduce vehicle speed locally at the hump, traffic circles SHALL replace a node's control with yield-on-entry at reduced negotiation speed [Rodegerdts2010], and speed-limit changes SHALL change desired speeds on the link; calming parameters SHALL cite their sources.

#### Scenario: Speed hump added
- **WHEN** a hump is added to a link
- **THEN** vehicles slow to the hump crossing speed near it and the link's travel time increases

### Requirement: Intersection control changes
Users SHALL be able to change a node's control type and a signal's cycle length.

#### Scenario: Stop to signal
- **WHEN** a two-way stop is changed to a signal
- **THEN** the node runs a Webster-derived fixed-time plan

### Requirement: One-way and turn restrictions
Users SHALL be able to make a street one-way and ban a specific turn; routing SHALL respect both.

#### Scenario: Turn ban
- **WHEN** a turn from link A to link B is banned
- **THEN** no route uses A followed by B

### Requirement: Fixed demand caveat
Because this version holds demand fixed, results SHALL be presented with a caveat that real-world schemes show some traffic reduction overall [Thomas2024].

#### Scenario: Viewing comparison
- **WHEN** a user views baseline-versus-scenario results
- **THEN** the caveat and its citation are visible
