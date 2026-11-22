## ADDED Requirements

### Requirement: Model extent from the area config
An area config SHALL be able to state how far the simulated network reaches beyond the study area with `extent`: a polygon (lon, lat ring), a buffer distance in meters along the network from the study area, and ways or nodes that must be in the model. A node SHALL be in the model when it lies in the bounding box and in the polygon, within the buffer, or on a listed way or node. Without `extent` the importer SHALL build the same network as before, byte for byte.

#### Scenario: Area without an extent
- **WHEN** an area config has no `extent`
- **THEN** the network file is identical to the one built before this requirement

#### Scenario: Ramp kept by an include
- **WHEN** a freeway ramp the area needs lies partly outside the polygon and its way is listed in `extent.include.ways`
- **THEN** the whole ramp way is in the model

### Requirement: Gates where the extent cuts a street
Where a way segment leaves the extent polygon, the importer SHALL insert a node on the polygon edge and make it the gate, so that the gate sits where the extent cuts the street.

#### Scenario: Street cut mid-block
- **WHEN** a residential street leaves the extent polygon halfway between two junctions
- **THEN** the network ends at a new gate node on the polygon edge, not at the last junction inside
