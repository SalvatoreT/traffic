## ADDED Requirements

### Requirement: Census blocks outside the model extent are left out
When the area config states a model extent, the demand build SHALL load only census blocks whose centroid lies in the extent polygon (or, for an extent without a polygon, within the local spread radius of a node of the network). Trips of blocks outside the extent SHALL reach the model only through its gates, at the volumes the gates take from counts or class defaults.

#### Scenario: Block beyond a gate
- **WHEN** a census block lies 300 m outside the extent polygon of a compact model
- **THEN** it loads no node, and the gate volume on the street that leads to it is set as for any other gate

#### Scenario: Area without an extent
- **WHEN** the area config has no `extent`
- **THEN** the blocks loaded are the same as before this requirement and the demand file is unchanged
