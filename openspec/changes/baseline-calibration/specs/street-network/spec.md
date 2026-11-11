## ADDED Requirements

### Requirement: Roundabout rings collapse to one node
The importer SHALL represent a roundabout or traffic circle mapped as a ring of ways as a single `traffic_circle` node.

#### Scenario: Ring in the extract
- **WHEN** OSM maps a traffic circle as a closed ring with four arms
- **THEN** the network has one traffic-circle node with four approaches

### Requirement: Gate direction flags
The importer SHALL record for each gate whether trips can enter and whether they can leave through it.

#### Scenario: One-way exit
- **WHEN** a gate lies on a one-way street leaving the model
- **THEN** it is flagged as exit-only
