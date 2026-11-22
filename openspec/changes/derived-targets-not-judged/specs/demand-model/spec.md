## MODIFIED Requirements

### Requirement: Validation stations are held out and reported separately
When `countFit.validation` is enabled, the build SHALL mark about a quarter of the count stations as validation-only, deterministically, with at least one per corridor, fit once without them, write that fit as the cross-validation demand with the same ramp split and intent annotation as the shipped demand, and ship the demand fitted on every count. A station whose target is derived from a daily total SHALL NOT be validation-only (see "Derived targets are fitted in both views"). The cross-validation demand SHALL be removed when the build skips the cross-validation fit.

#### Scenario: Corridor coverage
- **WHEN** the hold-out is selected
- **THEN** every corridor has at least one validation station and the same stations are chosen on every build, except that a corridor made only of derived targets has none

#### Scenario: Same model
- **WHEN** a simulator run uses the cross-validation demand
- **THEN** its off-ramp flows carry the ramp movement and its flows carry their intent, as in the shipped demand

### Requirement: The demand build stops on stale simulated membership
When the demand config has a `countFit.throughTargets.simulatedMembership` entry and the membership file it names for the build's view exists, the build SHALL use the file only if its network and all of its evidence fields (view, network, split, config, count file, stations, targets, simulator fingerprint, station count version, and for the training view the digest of the stations it withholds) equal the build's. Otherwise the build SHALL exit with a non-zero status and a message that names each differing field and says to rerun the membership loop or move the file away. A missing file SHALL still build on static route shares, which the loop's first pass relies on.

#### Scenario: File recorded on another simulator
- **WHEN** the file's `evidence.simulator` differs from the fingerprint of the current simulator
- **THEN** the build exits non-zero and the message names `simulator` with both values

#### Scenario: No file
- **WHEN** the file does not exist
- **THEN** the build uses static route shares and says so in the fit report

#### Scenario: Training file made before derived targets were fitted
- **WHEN** the training membership file has no `evidence.withheld`, or one that differs from the digest of the stations the current rule withholds
- **THEN** the build exits non-zero and the message names `withheld`

## ADDED Requirements

### Requirement: Derived targets are fitted in both views
A split group whose source observations are daily totals (a Caltrans record or a published ramp ADT row) SHALL be fitted, whatever the frozen draw says. The manifest SHALL keep the draw it was frozen with, and the build, the membership loop, `calibrate` and the assessment SHALL apply the rule on top of it. The stations file SHALL keep recording the draw as `held`.

#### Scenario: Only derived stations change side
- **WHEN** the rule is applied to the committed Rockridge split
- **THEN** 13 stations in 7 groups (6 Caltrans AADT link stations, 2 AADT gate stations and 5 ramps) are fitted that the draw held out, and no other station changes side

#### Scenario: The shipped side is untouched
- **WHEN** the shipped demand is built with the committed split, stations file, config and shipped membership file
- **THEN** the demand, the stations file and the shipped membership file are the ones published before the rule

### Requirement: The build stops when the split and the source kinds disagree
The build SHALL stop and name the group when a split group has stations with a derived-target source and stations without one, when a station with a derived-target source is in a group of other observations, or when such a station is in no group.

#### Scenario: A mixed group
- **WHEN** a split group holds both a station with a derived-target source and one without
- **THEN** the build exits non-zero and names the group

### Requirement: The training view records what it withholds
The training demand's `build` SHALL carry `withheld`, a digest of the station ids the training view leaves out, and its membership file's evidence SHALL carry the same digest. The shipped demand's `build` and membership evidence SHALL NOT change. The assessment SHALL refuse a cross-validation demand whose `withheld` is not the digest of the current rule.

#### Scenario: A cross-validation demand from before the rule
- **WHEN** the cross-validation demand has no `build.withheld`
- **THEN** the assessment exits with code 3 and says to rebuild the demand
