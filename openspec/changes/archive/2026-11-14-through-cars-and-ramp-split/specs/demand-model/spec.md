## ADDED Requirements

### Requirement: Census blocks load their own side of the study-area boundary
When `local.sideRule` is set, a census block SHALL load only nodes on the same side of the study-area boundary as its centroid, and the trip ends the volunteer count implies SHALL scale only blocks inside the study area.

#### Scenario: Block across a boundary street
- **WHEN** a block lies north of Alcatraz Ave and a study-area corner node is within the spread radius
- **THEN** the block does not load that corner
