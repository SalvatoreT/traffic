## ADDED Requirements

### Requirement: A looser search is never worse than a stricter one
When a proposals file already holds a group computed on the same network and demand, a search with a profile SHALL start from that group's chosen packages that the profile allows: screen them, extend them in a beam of their own and recheck them with the other finalists. A profile that does not keep off the boundary SHALL offer every location a profile that does would offer. Within one invocation, a later profile SHALL start from the groups the earlier ones wrote.

#### Scenario: Pilot packages seed the unconstrained search
- **WHEN** the unconstrained search runs after the pilot profile on the same inputs
- **THEN** every package the pilot group chose is rechecked in the unconstrained run, and the unconstrained group's best option cuts through cars at least as much as the pilot group's

#### Scenario: Package that breaks the limits
- **WHEN** a seed package holds an intervention the current profile excludes, or one on a bounding street
- **THEN** that package is left out of the start and a line on stderr says why

#### Scenario: Different inputs
- **WHEN** the file's group was computed on another network or demand hash
- **THEN** its packages are not used

#### Scenario: Candidate cap
- **WHEN** the busiest locations include many on bounding streets
- **THEN** the unconstrained candidate list still holds the top locations that are off the boundary

### Requirement: Consistent chosen options
The options chosen for a group SHALL be listed from fewest interventions to most, and a package SHALL be listed only if it cuts through cars by more than every smaller package listed.

#### Scenario: More changes, less effect
- **WHEN** a finalist has more interventions than another finalist and cuts through cars less
- **THEN** it is not listed, and its note says a smaller finalist cuts through cars at least as much
