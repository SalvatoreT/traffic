## ADDED Requirements

### Requirement: The simulated-membership entry has a sub-switch that weighs whole-street route counts by the blocks they span
The `countFit.throughTargets.simulatedMembership` entry SHALL accept an optional boolean `routeWeightPerBlock`. Absent or false, the build SHALL behave as in calibration round 51. A value that is not a boolean SHALL stop the build with an error naming the key.

#### Scenario: Sub-switch absent
- **WHEN** the entry has no `routeWeightPerBlock`
- **THEN** every route station keeps its own weight and the fit report has no route weight lines

#### Scenario: Not a boolean
- **WHEN** `routeWeightPerBlock` is a string
- **THEN** the build stops with an error naming `simulatedMembership.routeWeightPerBlock`

### Requirement: A route station with simulated membership weighs the blocks it spans
With `routeWeightPerBlock` true, a whole-street route station (a volunteer-count route station) that takes simulated membership in a period SHALL have, in that period's fit, its own weight times the number of block stations of the same count on the route's links that are in the fit with a target in that period and view. The multiplier is an ASSUMPTION and SHALL be labeled as one.

#### Scenario: Simulated membership
- **WHEN** a route station takes simulated membership and two block stations on its links are fitted with a target in the period
- **THEN** its weight in the fit is twice its own weight

#### Scenario: Static membership
- **WHEN** the route station has no simulated pair in the period
- **THEN** its weight is its own weight

#### Scenario: Blocks that do not count
- **WHEN** a block on the route is held out, or has no target in the period, or is absent from the view
- **THEN** it is not counted, and a route that spans no fitted block keeps its own weight

#### Scenario: The anchor fit
- **WHEN** the static fit that anchors the ceilings runs
- **THEN** no route station is reweighted, so the anchor equals that of a build without the sub-switch

### Requirement: The report gives the weight of every route station
With `routeWeightPerBlock` true, the fit report SHALL give, for every route station with a target in a period, one line `Route weight <period> <station id>: simulated|static; base B; blocks N; weight W; <label>.` and a note per period naming the weights.

#### Scenario: Report lines
- **WHEN** a build runs with the sub-switch and a membership file with route pairs
- **THEN** the report has a "Route weight" line per route station and period, and the loop prints and records them and stops if the report has none

### Requirement: The ceiling scope outsideStudyArea leaves non-gate nodes inside the study area free
The `scope` of `countFit.gatePriorTotals` SHALL accept `outsideStudyArea`. With it, the ceilings (soft, anchored on the static fit, with the hard projection) SHALL apply to gate directions and to non-gate node directions outside the study area, and SHALL NOT apply to non-gate nodes inside it (the network's `inStudyArea` flag). Any value other than `gates`, `allNodes` or `outsideStudyArea` SHALL stop the build with an error.

#### Scenario: Inside node free
- **WHEN** the scope is `outsideStudyArea` and a non-gate node inside the study area is the origin of a flow
- **THEN** that node has no ceiling station and the projection leaves its total alone

#### Scenario: Gates and outside nodes capped
- **WHEN** the scope is `outsideStudyArea`
- **THEN** every gate direction and every non-gate node direction outside the study area that no gate station holds has its ceiling

#### Scenario: Report
- **WHEN** a build runs with the scope
- **THEN** the report states that nodes inside the study area have no ceiling and counts, per period, the inside non-gate nodes whose origin or destination total grew over the static fit

#### Scenario: Loop guard
- **WHEN** the loop's build offers more than 3% above the static fit
- **THEN** the loop stops before its seed runs, as for the other scopes
