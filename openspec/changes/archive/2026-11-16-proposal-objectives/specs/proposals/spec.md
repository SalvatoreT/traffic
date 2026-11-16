## ADDED Requirements

### Requirement: Options are chosen for named objectives
The search SHALL choose the published options for four objectives, each a documented rule with its weights labeled assumptions: most cut-through removed, no street closures, least detour for residents and fewest changes. Each objective SHALL grow its own beam over the shared screening cache, finalists SHALL be pooled and rechecked together, and each option SHALL name the objectives it is the best for. The list SHALL stay one list, largest through-car removal first.

#### Scenario: One package, two objectives
- **WHEN** the same package is the best for most cut-through removed and for fewest changes
- **THEN** it appears once, with both tags

#### Scenario: Remaining places
- **WHEN** fewer options than the list size are objective winners
- **THEN** the rest are the best remaining by through cars removed that are not similar to an option already chosen

### Requirement: Rules of the objectives
No street closures SHALL use the search score among packages made only of Slow Streets, one-ways, all-way stops, traffic circles, speed humps and turn bans. Least detour for residents SHALL subtract a light weight times the added trip time of trips that start or end inside the study area and SHALL NOT lift a package that removes less than half of the most removed. Fewest changes SHALL use the search score among packages of at most two changes.

#### Scenario: A closing package cannot hide the best package without closures
- **WHEN** a package with a filter removes more through cars than every package without closures
- **THEN** the best package without closures is still an option, tagged "no street closures"

#### Scenario: The detour weight is light
- **WHEN** the least-detour objective chooses between packages
- **THEN** it may reorder packages with similar reductions and it never lifts a package that removes less than half of the most removed

### Requirement: Residents' detour
Each published option SHALL report residents' detour: the added mean trip time, in seconds per trip, of completed car trips that start or end inside the study area, scenario minus baseline on the same seed, averaged over the searched periods, with its interval over runs, and the same trips' added time in vehicle-minutes an hour. Trips that do not complete in the run SHALL NOT be timed, and the documentation SHALL say so.

#### Scenario: Reading the detour
- **WHEN** a reader opens an option
- **THEN** it shows seconds per resident trip with its interval beside through cars before and after and the largest all-car rise

### Requirement: Older files are still read
A proposals file written before objectives SHALL be read as options with no tags and no residents' detour, and shown without them.

#### Scenario: Older file
- **WHEN** the app loads a version 5 file with no `objectives` fields
- **THEN** the cards show no "Best for" row and no detour line
