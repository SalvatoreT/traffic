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

### Requirement: A second switch seeds the pairs that end along a street
`countFit.endAlong` SHALL accept an optional boolean `seedPairs`; a non-boolean SHALL stop the build with an error naming the key. Absent or false, the build SHALL be the end-along build without seeding. With it true, a shipped build SHALL seed each period that has block pairs before the fit.

#### Scenario: Switch absent
- **WHEN** `seedPairs` is absent
- **THEN** the seed table and the demand are those of the end-along build without seeding

### Requirement: Seeding adds the missing end-along pairs
For each end-along run whose static-route end-along flow in the seed table is below its target, seeding SHALL add pairs from origins to the run's interior nodes until the run starts at its target. The proportions are ASSUMPTIONS; the targets are DATA.

#### Scenario: Shortfall
- **WHEN** a run's seed end-along flow is 40 and its target 70
- **THEN** after seeding its static-route end-along flow is 70, unless the cap binds, and the report gives the capped volume

#### Scenario: Target already met
- **WHEN** the seed end-along flow is at or above the target
- **THEN** the run adds nothing and the table is unchanged

### Requirement: Seeding chooses origins and destinations by fixed proportions
Origins SHALL be weighted by their flow on the run's first block (the pair's membership on the run, limited by its static first-block share) and destinations by their existing volume. A pair whose static routes enter by the first block less than half of the time SHALL be dropped and the weights renormalized.

#### Scenario: Pair by another street
- **WHEN** a candidate pair's static routes use the run's first block in under half of the draws
- **THEN** the pair is dropped

### Requirement: Seeding keeps every node's destination total
The added volume SHALL be taken from the other inbound pairs of the same node, pro rata and at most 80% of them (ASSUMPTION), so each node's destination total is unchanged. Where the node has less to give, the addition SHALL be capped and the report SHALL give the capped volume.

#### Scenario: Conservation
- **WHEN** seeding adds pairs ending at a node
- **THEN** the node's destination total before and after seeding is equal

#### Scenario: Cap
- **WHEN** the volume to add at a node exceeds 80% of its other inbound volume
- **THEN** the addition is cut to 80% and the difference is reported as capped

### Requirement: Seeded pairs keep static membership until a simulated run contains them
A pair that seeding added and that no simulated run of the pooled file contains SHALL take the static route share in every membership of the fit. The training view SHALL NOT seed.

#### Scenario: New pair
- **WHEN** a seeded pair is absent from the pooled trips
- **THEN** its membership on the run is its static share, not a simulated zero

#### Scenario: Training view
- **WHEN** the training view builds
- **THEN** no run is seeded and its periods equal those of the build without the end-along switches

### Requirement: The report and the loop state what seeding did
With `seedPairs` true the fit report SHALL give a section "End-along seeding" with, per period and run, the target, the seed flow before, the added and capped volume, the flow after, the fit's offered and final figures, and the destination totals of the interior nodes before and after, in lines `End along seed <period> <run>: ...`. The loop SHALL stop with an error naming the period when a shipped build from pass 1 has no such line.

#### Scenario: Missing seed line
- **WHEN** a shipped build from pass 1 has no `End along seed` line for a period although `seedPairs` is on
- **THEN** the loop stops with an error naming the period

### Requirement: The published model leaves both end-along switches off
The committed demand config SHALL NOT contain `simulatedMembership.endAlong`, `countFit.endAlong` or `countFit.endAlong.seedPairs`. The end-along target and the seeding exist in the code as switches that are off in the published model, which stays the calibration round 52 model (config hash 2405ff02c92b2837). A candidate that turns them on lives outside the committed config.

#### Scenario: Committed config
- **WHEN** the demand is built from the committed config with the published membership files
- **THEN** the shipped demand is 2d16d8f8eb0950ca, the cross-validation demand is 1c3b1666f24156f1, and the fit report has no end-along section

