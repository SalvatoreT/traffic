## ADDED Requirements

### Requirement: Count lineage and gate direction
The demand builder SHALL exclude held-out route diagrams from every derived training input, including trip-end scaling. A gate matched to a counted leg SHALL map inflow and outflow by the direction of travel at the count and retain its directional source.

#### Scenario: Count outside the modeled boundary
- **WHEN** the south gate lies north of an intersection count on the same street
- **THEN** traffic departing that intersection northbound supplies the gate's inflow

#### Scenario: Held-out route changes
- **WHEN** only the observed volume in a held-out route diagram changes
- **THEN** neither the training trip ends nor the resulting training inputs change

### Requirement: Joint route shares and final assignment
The assignment SHALL count the joint ramp-and-street event on the same sampled route. The fitted demand's counts, shares and route membership SHALL use an assignment of the volumes returned by the fit.

#### Scenario: Disjoint paths
- **WHEN** half of an OD's routes use a ramp and the other half use the measured street
- **THEN** zero of its routes use the street via that ramp

#### Scenario: Final update
- **WHEN** the final OD update changes the routes drivers take
- **THEN** its score and reported shares reflect those new routes

### Requirement: Pedestrian crosswalk count fitting
A pedestrian count at an intersection SHALL fit traversals of its crosswalks on the baseline walking graph. The builder SHALL report route coverage and the simulator SHALL provide actual crossings at the count location for comparison.

#### Scenario: Walk ends at a corner
- **WHEN** a pedestrian reaches an endpoint at the intersection without crossing the road
- **THEN** the trip contributes zero to the crosswalk count

### Requirement: Comparable observations for corridor fits
A fit of distinct through users on any portion of a corridor SHALL require a matching count of distinct trips with both ends outside the study area. Counts of individual blocks and full-length traversals SHALL remain separate. Measured route membership SHALL identify compatible inputs and detector semantics. The builder SHALL use static assignment when that evidence is absent.

#### Scenario: Historical corridor proxy
- **WHEN** the only observations are block counts, whole-street traversals and cars ending along the corridor
- **THEN** the fit uses the comparable observations and leaves the distinct through-user total unconstrained
