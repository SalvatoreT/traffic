## ADDED Requirements

### Requirement: The simulated-membership entry has sub-switches for through targets and shares
The `countFit.throughTargets.simulatedMembership` entry SHALL accept two optional booleans, `throughTargets` and `shares`. With both absent or false, the build SHALL behave as in calibration rounds 48 to 50, even when the membership file carries block pairs. A value that is not a boolean SHALL stop the build with an error naming the key.

#### Scenario: Sub-switches absent
- **WHEN** the entry has neither `throughTargets` nor `shares`, and the membership file carries block pairs
- **THEN** the through targets and the shares use the static routes and the flows equal those of a build without block pairs

#### Scenario: Not a boolean
- **WHEN** `shares` is a string
- **THEN** the build stops with an error naming `simulatedMembership.shares`

### Requirement: Through targets take simulated membership
With `throughTargets` true, a through-car target whose block has simulated through trips in the membership file SHALL take each pair's membership from them: the pair's simulated share of trips on the block, with the static share as a prior worth `priorTrips` trips. A target without such trips SHALL keep static routes.

#### Scenario: Through hits present
- **WHEN** `throughTargets` is true and the file has through hits for a target's block
- **THEN** the target's figure is computed on the simulated membership and the fit report marks it as simulated

#### Scenario: Through hits ignored
- **WHEN** `throughTargets` is false and the file has through hits
- **THEN** the target keeps static routes

### Requirement: A select-link share takes its denominator from simulated block trips
With `shares` true, the denominator membership of a pair on a select-link share SHALL be the pair's simulated share of the trips that hit the block, with its static fraction as a prior worth `priorTrips` trips. A pair with simulated trips on the block SHALL enter the constraint even when the static routes miss the block.

#### Scenario: Few simulated trips
- **WHEN** a pair has no simulated trip on the block among a handful of offered trips
- **THEN** its membership stays near its static fraction, by the prior

#### Scenario: Pair the static routes miss
- **WHEN** a pair has simulated trips on the block and no static route that uses it
- **THEN** the pair is a member of the constraint with its simulated share

### Requirement: A select-link share's numerator keeps the pairs with a freeway end
The numerator membership SHALL equal the denominator membership for a pair whose origin (share "from") or destination (share "to") is a freeway node, and 0 for every other pair. A node is a freeway node when a motorway-class link touches it.

#### Scenario: Freeway-end rule
- **WHEN** a block's pairs are pooled from simulated runs and the share is "from the freeway"
- **THEN** only pairs whose origin is a freeway node carry a numerator, equal to their denominator membership

### Requirement: Some shares stay on static routes
Ramp via-street shares SHALL keep static routes. A select-link share whose block has no simulated trip SHALL keep static routes and be named in the fit report.

#### Scenario: Block without a simulated hit
- **WHEN** the file has no trip for a share's block
- **THEN** the share uses the static routes and the report lists it as static

### Requirement: The report shows each share and through figure on both memberships
When any select-link share takes simulated membership, the fit report SHALL give for every share of every period one line with the observed target, the offered and final values on the membership the fit used and on the static routes, and whether the share was simulated or static. For each through target with simulated membership it SHALL give the same in cars per hour. It SHALL note per period how many share constraints took simulated membership and over how many runs.

#### Scenario: Report lines
- **WHEN** a build runs with `shares` true and a membership file with block pairs
- **THEN** the report has a line "Share <period> <label>: simulated; target ..." for each select-link share and a note "select-link shares take simulated membership (N runs; K of M share constraints; ...)"

#### Scenario: Round 50 report
- **WHEN** a fit report has none of these lines
- **THEN** the loop reads it as before and prints no share or through lines

### Requirement: The membership loop pools the block export twice
When `throughTargets` or `shares` is true, the loop SHALL pool the `blocks` of every iteration's seed runs with the same equal weight as the stations. It SHALL write the through pool, with trips that have an end in the study area left out, to the top level of each period of the membership file, and the share pool, with every trip, under `blocks`.

#### Scenario: Both pools
- **WHEN** the switches are on and a block has trips between an in-study node and an outside node
- **THEN** the top-level hits leave the pair out and the `blocks` hits keep it

#### Scenario: Switches off
- **WHEN** neither switch is on
- **THEN** the file has the empty top level of rounds 48 to 50 and no `blocks` entry, and the loop prints no share or through lines

### Requirement: The loop lists blocks without trips and keeps the training view clean
A block with no counted trip SHALL not be written to the file and SHALL be listed per pass. For the training view, pairs SHALL come only from runs of the training demand and the file SHALL name no withheld station.

#### Scenario: Block without a counted trip
- **WHEN** a select-link block has no trip in any pooled run
- **THEN** its hits are absent from the file and the pass report lists it

### Requirement: The loop stops when the shares fall back to static routes
With `shares` true and a membership file whose period has simulated block trips, the loop SHALL fail when the next build's fit report lacks the note that its shares took simulated membership, or names a different number of runs than the file.

#### Scenario: Silent fall back
- **WHEN** the file has simulated block trips and the build's report has no shares note
- **THEN** the loop stops with an error naming the period
