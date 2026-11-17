## ADDED Requirements

### Requirement: Census blocks outside the model extent are left out
When the area config states a model extent, the demand build SHALL load only census blocks whose centroid lies in the extent polygon (or, for an extent without a polygon, within the local spread radius of a node of the network). Trips of blocks outside the extent SHALL reach the model only through its gates, at the volumes the gates take from counts or class defaults.

#### Scenario: Block beyond a gate
- **WHEN** a census block lies 300 m outside the extent polygon of a compact model
- **THEN** it loads no node, and the gate volume on the street that leads to it is set as for any other gate

#### Scenario: Area without an extent
- **WHEN** the area config has no `extent`
- **THEN** the blocks loaded are the same as before this requirement and the demand file is unchanged

### Requirement: A sub-area model can take its trip table from a parent model
When an area's extent names a parent area, `tools/cordon-prior.ts` SHALL assign the parent's car flows on the parent's own fit settings and cut every route where it crosses the extent, one trip table per period, and the demand build SHALL use that table in place of its own gate and local trips before the count fit.

#### Scenario: Gate provenance
- **WHEN** the build uses a cordon prior
- **THEN** a gate no parent route crosses keeps its class-default trips, a gate is scaled to its count only when the count was taken within `cordonPrior.ownCountM` of it, and the build reports per gate whether its trips come from a count, the parent or a class default

#### Scenario: Route across the extent
- **WHEN** a parent flow's route enters the extent on one street and leaves it on another
- **THEN** the prior holds a trip between the two gates on those streets with the route's share of the flow

#### Scenario: Route that starts inside
- **WHEN** a parent flow starts at a node inside the extent and leaves it
- **THEN** the prior holds a trip from the nearest child node to the exit gate
