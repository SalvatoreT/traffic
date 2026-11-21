## ADDED Requirements

### Requirement: The simulated-membership entry has a sub-switch for the cars that ended along a street
The `countFit.throughTargets.simulatedMembership` entry SHALL accept an optional boolean `endAlong`. Absent or false, the build SHALL behave as in calibration round 52. A value that is not a boolean SHALL stop the build with an error naming the key.

#### Scenario: Sub-switch absent
- **WHEN** the entry has no `endAlong`
- **THEN** no end-along constraint is built, the fit report has no end-along section or notes, and the demand is the round 52 demand

#### Scenario: Not a boolean
- **WHEN** `endAlong` is a string
- **THEN** the build stops with an error naming `simulatedMembership.endAlong`

### Requirement: The sub-switch needs the shares and a weight
With `endAlong` true the build SHALL require `simulatedMembership.shares` true and a `countFit.endAlong.weight` greater than 0, and SHALL stop with an error naming the missing key otherwise. A `countFit.endAlong` entry without the sub-switch SHALL stop the build.

#### Scenario: Weight missing
- **WHEN** `endAlong` is true and `countFit.endAlong.weight` is absent or not positive
- **THEN** the build stops with an error naming `countFit.endAlong.weight`

#### Scenario: Entry without the sub-switch
- **WHEN** `countFit.endAlong` is present and `endAlong` is absent or false
- **THEN** the build stops with an error saying the entry is read only with the sub-switch

### Requirement: A select-link run's cars that ended along it are a fit constraint
With `endAlong` true, each select-link run of the targets file that lists `endAlongVehPerHour` above 0 for the period SHALL add one constraint of the weight `countFit.endAlong.weight`. Its target is the listed figure. Its value is the sum, over car flows whose destination is a node strictly between the run's first and last nodes, of the flow's volume times the share of the flow's trips that used a link of the run. The weight is an ASSUMPTION and SHALL be labeled as one.

#### Scenario: Node rule
- **WHEN** a run's links form the path through nodes 1, 2, 3 and 4
- **THEN** only destinations 2 and 3 count; a destination at node 1, at node 4 or off the run does not

#### Scenario: Period without a figure
- **WHEN** a run lists no figure, or 0, for the period
- **THEN** it has no constraint in that period

### Requirement: The constraint takes its membership from the simulated block pairs
The share of a flow's trips that used a link of the run SHALL be the pair's simulated share of trips on the run from the block pairs of the membership file, with the static route fraction as a prior worth `priorTrips` trips. A run with no simulated trip in the pairs SHALL take the static route fraction and the report SHALL say `static`.

#### Scenario: Simulated membership
- **WHEN** a pair has 60 simulated trips on the run of 200 offered and a static fraction of 1, with a prior of 5 trips
- **THEN** its share is (60 + 5) / (200 + 5)

#### Scenario: No simulated trip on the run
- **WHEN** the block pairs hold no trip on the run
- **THEN** the constraint takes static routes and the report says `static`

### Requirement: The constraint exists only where the period has block pairs
The constraint SHALL exist only in a period whose membership file carries block pairs. A build without a membership file, a period without runs and the static fit that anchors the ceilings SHALL have none.

#### Scenario: No membership file
- **WHEN** the build has no membership file
- **THEN** no end-along constraint is built and the periods equal those of a build without the sub-switch

#### Scenario: Period without block pairs
- **WHEN** the file has no block pairs for a period
- **THEN** that period has no end-along constraint

### Requirement: The training view leaves out the end-along figure of a run with a held block
The cross-validation (training) build SHALL NOT use the end-along figure of a select-link run when any held block station of the frozen split lies on the run's links, the test the through targets use, and SHALL list the run in a note. The shipped build SHALL use every run. The split file and the stations file SHALL NOT change.

#### Scenario: Held block on the run
- **WHEN** the training view builds and a held block's link is a link of the run
- **THEN** the run has no end-along constraint and the build notes `end-along target <run>: its street run holds a held-out block; left out of the training view`

#### Scenario: Shipped view
- **WHEN** the shipped view builds
- **THEN** every run with a figure for the period has its constraint

### Requirement: The fit report states every end-along constraint
With `endAlong` true and a constraint in a period, the fit report SHALL give a section "Trips that ended along the street (round 53, ASSUMPTION)" with one line per constraint: `End along <period> <run>: simulated|static; target T; weight W; offered O (static routes P); after fit A (static routes B); final F (static routes S); N flows; M nodes (<ids>).`

#### Scenario: Report lines
- **WHEN** a build runs with the sub-switch and block pairs
- **THEN** the report has one `End along` line per run and period with a figure

#### Scenario: Sub-switch absent
- **WHEN** the sub-switch is absent
- **THEN** the report has no `End along` line and no end-along note

### Requirement: The end-along figures are taken at the same volumes on both memberships
The figure on the membership used and the figure on the static routes SHALL be taken at the same volumes. The constraint SHALL NOT count among the stations within tolerance that the report totals.

#### Scenario: Both versions
- **WHEN** a constraint took simulated membership
- **THEN** the report gives its offered, after-fit and final figures on that membership and on the static routes, each pair at the same volume

### Requirement: The loop checks and records the end-along lines
The membership loop SHALL parse the `End along` lines of every build, print and record them, and SHALL stop with an error naming the period when a shipped build from pass 1 has no line for a period while the sub-switch is on.

#### Scenario: Build did not apply the sub-switch
- **WHEN** a shipped build from pass 1 has no `End along` line for a period although the sub-switch is on
- **THEN** the loop stops with an error naming the period

#### Scenario: Static run
- **WHEN** a line says `static`
- **THEN** the loop logs a warning naming the run
