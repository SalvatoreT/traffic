# interventions Specification

## Purpose
The changes a person can apply to a scenario and how each one alters the simulated network.

## Requirements

### Requirement: Scenario as a list of interventions
A scenario SHALL be an ordered list of interventions (Intervention contract) applied on top of the baseline network; an empty list is the baseline.

#### Scenario: Removing an intervention
- **WHEN** an intervention is removed from the list
- **THEN** the simulated network returns to its prior behavior for that element

### Requirement: Modal filters
A modal filter on a link or node SHALL prevent cars from passing through it while leaving access to both sides, and routes SHALL adapt.

#### Scenario: Filtered street
- **WHEN** a modal filter is placed on a residential link used by through traffic
- **THEN** no car traverses it and affected trips re-route

### Requirement: Traffic calming
Speed humps SHALL reduce vehicle speed locally at the hump, traffic circles SHALL replace a node's control with yield-on-entry at reduced negotiation speed [Rodegerdts2010], and speed-limit changes SHALL change desired speeds on the link; calming parameters SHALL cite their sources.

#### Scenario: Speed hump added
- **WHEN** a hump is added to a link
- **THEN** vehicles slow to the hump crossing speed near it and the link's travel time increases

### Requirement: Intersection control changes
Users SHALL be able to change a node's control type and a signal's cycle length. A cycle length set by the user SHALL stay fixed while the green splits keep adapting to measured flows.

#### Scenario: Stop to signal
- **WHEN** a two-way stop is changed to a signal
- **THEN** the node runs a Webster-derived plan whose splits adapt to measured flows

#### Scenario: Pinned cycle
- **WHEN** a user sets a signal's cycle to 100 seconds
- **THEN** the cycle stays 100 seconds after later adaptations

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

### Requirement: Diagonal diverter
A diagonal diverter at a four-leg intersection SHALL let cars turn only between legs on the same side of its barrier line, so that neither street can be driven straight through, while people walking and biking pass in any direction, and routes SHALL adapt.

#### Scenario: Straight through is blocked
- **WHEN** a diagonal diverter is placed at a four-leg intersection
- **THEN** no car crosses the intersection straight ahead on either street, and each approach can only make the one turn the barrier allows

#### Scenario: Access is kept
- **WHEN** a diagonal diverter is in place
- **THEN** every street meeting the intersection can still be reached by cars from one of its neighbors

#### Scenario: Walking and biking
- **WHEN** a cyclist or pedestrian reaches the diverter
- **THEN** they continue in any direction

### Requirement: A node filter closes the legs it names
A modal filter at an intersection SHALL close every car movement through the node, so cars cannot pass between any two of its legs, unless it names the legs to close. A filter that names legs SHALL stop cars entering or leaving the node by those legs and SHALL leave every other movement open. Legs SHALL be identified by the ids of the links on them; naming either direction of a leg SHALL close it in both directions. A filter whose legs match no link at the node SHALL be skipped as invalid and SHALL NOT close the whole junction.

#### Scenario: Merged junction
- **WHEN** a node filter that names no legs is placed where a street crosses another at two offset points a few meters apart that the model merged into one node
- **THEN** cars cannot pass along either street through the merged node

#### Scenario: One street of a merged junction
- **WHEN** a filter names both Martin Street legs at a junction merged from two offset T-junctions
- **THEN** cars cannot enter or leave by either Martin Street leg and can still drive along Ayala Avenue through the node

#### Scenario: One direction named
- **WHEN** a filter names only the link that enters the node on a leg, or only the link that leaves it
- **THEN** cars can neither enter nor leave the node by that leg

#### Scenario: Assumed movement through a closed leg
- **WHEN** a flow's assumed movement (via) uses a closed leg
- **THEN** the movement is dropped and the trip takes its alternative or the plain route

### Requirement: Slow Street
A Slow Street SHALL be one intervention that limits every block of one named street inside the study area to 15 mph. A street SHALL be identified by its name in the study area; where the street has a gap or changes name, only the connected run that contains the chosen block SHALL be limited, and the label SHALL say so. A block already at or below 15 mph SHALL keep its limit. The label SHALL read "Slow Street on <street> (15 mph, <from> to <to>)". The code SHALL NOT name any street or area.

#### Scenario: Whole street
- **WHEN** a user chooses a Slow Street on any block of a street
- **THEN** every block of that street's connected run inside the study area is at 15 mph and the scenario list shows one change

#### Scenario: Split street
- **WHEN** a street's blocks inside the study area are not all connected
- **THEN** only the run that holds the chosen block is limited and the label says it is the connected stretch only

### Requirement: Slow Street scenario link
A scenario link SHALL carry a Slow Street as the item `ss,<geohash>` with no parameter, where the point names any block of the street. The item SHALL be written at the middle of the lowest-numbered block of the run, so one Slow Street is one string. Links written with per-block `sl` items SHALL keep opening and running as before.

#### Scenario: Any block, one link
- **WHEN** a Slow Street is written from two different blocks of the same street
- **THEN** both links are identical

#### Scenario: Old link
- **WHEN** a link holds per-block `sl` items
- **THEN** it decodes to per-block speed limits and runs the same as before this change

### Requirement: Speed limit on a Slow Street, in the editor
Choosing "Set speed limit" on a block SHALL list "Apply to the whole street (Slow Street, 15 mph)" first, with the street's label, and SHALL open with it suggested; the per-block limits SHALL stay available below it, labeled "This block only".

#### Scenario: Choosing the street
- **WHEN** a user opens "Set speed limit" on a named street
- **THEN** the first choice applies a Slow Street to the whole street

### Requirement: What a Slow Street assumes
Documentation and Assumptions-facing copy SHALL say that a Slow Street sets the desired speed of cars on the street to 15 mph on average with the model's own spread, raises the street's free-flow routing time, and assumes full compliance with no enforcement and no physical measure; this SHALL be labeled an ASSUMPTION unless a source in `docs/references.md` supports a compliance rate.

#### Scenario: Reading the assumption
- **WHEN** a reader opens the Slow Street entry in the docs or the text pages
- **THEN** it states the full-compliance assumption
