## MODIFIED Requirements

### Requirement: A looser search is never worse than a stricter one
When a proposals file already holds a group computed on the same network and demand, a search with a profile SHALL start from that group's chosen packages that the profile allows: screen them, extend them in a beam of their own and recheck them with the other finalists. Those packages SHALL always be rechecked, whatever one-seed screening or the screening budget said, and SHALL NOT be dropped as within noise of a simpler package. A profile that does not keep off the boundary SHALL offer every location a profile that does would offer. Within one invocation, a later profile SHALL start from the groups the earlier ones wrote.

#### Scenario: Pilot packages seed the unconstrained search
- **WHEN** the unconstrained search runs after the pilot profile on the same inputs
- **THEN** every package the pilot group chose is rechecked in the unconstrained run, and the unconstrained group's best option cuts through cars at least as much as the pilot group's

#### Scenario: Budget spent
- **WHEN** the screening budget is exhausted before a stricter group's package is screened
- **THEN** the package is still rechecked

#### Scenario: Package that breaks the limits
- **WHEN** a seed package holds an intervention the current profile excludes, or one on a bounding street
- **THEN** that package is left out of the start and a line on stderr says why

#### Scenario: Different inputs
- **WHEN** the file's group was computed on another network or demand hash
- **THEN** its packages are not used

#### Scenario: Candidate cap
- **WHEN** the busiest locations include many on bounding streets
- **THEN** the unconstrained candidate list still holds the top locations that are off the boundary

## ADDED Requirements

### Requirement: The search measures the run the app makes
Every simulation the search makes SHALL start loaded and settled as the app's does and SHALL measure every figure over the run from t = 0. Published figures SHALL come from rechecks of 60 simulated minutes, and screening runs, which are the same run but shorter, SHALL NOT feed them. Each group's `computed` SHALL state the initial load, settle seconds, minutes, screening minutes, seeds and window.

#### Scenario: Equals a direct run
- **WHEN** the search's run of a scenario, period, seed and length is compared with a `Simulation` built and stepped as the app does
- **THEN** the cut-through rate and the per-link flow and through-car figures are equal

### Requirement: Speed hump candidates survive the link round trip
A speed hump candidate SHALL be at the link and position the link decoder returns for it, and every candidate of every type, written as a link and read back, SHALL give the same effective network.

#### Scenario: Block whose first link runs west
- **WHEN** a hump candidate is generated on a block whose first link runs west
- **THEN** reading its link gives an identical hump on the same links

### Requirement: Reference packages report the access check
A reference package SHALL be checked for stranded blocks like a search package, and the result SHALL be published on the package (`accessProblem`) and in the report. The package SHALL be published either way.

#### Scenario: Reference strands a block
- **WHEN** a reference package closes the only way into a dead-end street
- **THEN** it is rechecked and published with `accessProblem` naming the stranded block
