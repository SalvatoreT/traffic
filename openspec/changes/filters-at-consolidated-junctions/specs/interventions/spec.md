## RENAMED Requirements
- FROM: `### Requirement: A node filter closes every leg`
- TO: `### Requirement: A node filter closes the legs it names`

## MODIFIED Requirements

### Requirement: A node filter closes the legs it names
A modal filter at an intersection SHALL close every car movement through the node, so cars cannot pass between any two of its legs, unless it names the legs to close. A filter that names legs SHALL stop cars entering or leaving the node by those legs and SHALL leave every other movement open. Legs SHALL be identified by the ids of the links on them, both directions. A filter whose legs match no link at the node SHALL be skipped as invalid and SHALL NOT close the whole junction.

#### Scenario: Merged junction
- **WHEN** a node filter that names no legs is placed where a street crosses another at two offset points a few meters apart that the model merged into one node
- **THEN** cars cannot pass along either street through the merged node

#### Scenario: One street of a merged junction
- **WHEN** a filter names both Martin Street legs at a junction merged from two offset T-junctions
- **THEN** cars cannot enter or leave by either Martin Street leg and can still drive along Ayala Avenue through the node

#### Scenario: Assumed movement through a closed leg
- **WHEN** a flow's assumed movement (via) uses a closed leg
- **THEN** the movement is dropped and the trip takes its alternative or the plain route
