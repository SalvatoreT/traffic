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

### Requirement: Junction joining
The importer SHALL join graph nodes that form one real intersection into a single node at their centroid when they lie within `junctionJoinRadius` (default 20 m), are connected by short non-freeway links, and share a street name or are both signals.

#### Scenario: Offset signalized crossing
- **WHEN** two signal-tagged nodes 10 m apart on one street carry the north and south legs of one crossing
- **THEN** the network has one signal node with four approaches and no link between the former nodes

#### Scenario: Distinct intersections on a longer block
- **WHEN** two intersections are more than the join radius apart
- **THEN** they stay separate nodes

#### Scenario: Control and approaches of a joined node
- **WHEN** a cluster is joined
- **THEN** the node is a signal if any member is a signal and an all-way stop only if every remaining approach has a stop, the internal links are dropped, and the remaining approaches keep their stop flags, humps and gates

#### Scenario: No new movements
- **WHEN** the members of a cluster are not strongly connected by their internal links, or the cluster contains a freeway link, a gate or a traffic circle
- **THEN** those members are not joined

### Requirement: Study area from boundary streets
The importer SHALL derive the study-area polygon from an ordered list of boundary streets, following each street's way geometry between the crossings with its neighbors in the list, and SHALL treat links lying on a boundary street as inside the study area, except motorway-class links.

#### Scenario: Freeway edge
- **WHEN** a boundary street is a dual-carriageway freeway
- **THEN** the polygon edge follows the carriageway nearest the area and no vertex lies beyond it
