## REMOVED Requirements

### Requirement: Rules of the objectives
**Reason**: The detour goal no longer subtracts a weighted detour from the search score. The requirement is replaced by "Rules of the four goals".

**Migration**: See "Rules of the four goals" below.

## ADDED Requirements

### Requirement: Rules of the four goals
No street closures SHALL use the search score among packages that close nothing to cars. Least detour for residents SHALL choose the smallest residents' detour in seconds per trip among packages removing at least half of the most removed (an assumption). A detour difference the paired comparison cannot resolve SHALL go to the package removing more through cars, then to the one with fewer changes. Fewest changes SHALL use the search score among packages of at most two changes.

#### Scenario: A closing package cannot hide the best package without closures
- **WHEN** a package with a filter removes more through cars than every package without closures
- **THEN** the best package without closures is still an option, tagged "no street closures"

#### Scenario: Lowest detour that still removes half
- **WHEN** packages remove 73%, 49%, 48% and 46% of through cars with detours of 9.5, 8.3, 4.4 and 0.2 seconds per trip, the last differing from the third on the paired seeds
- **THEN** the option tagged "least detour for residents" is the 46% package

#### Scenario: The floor holds
- **WHEN** a package removes less than half of the most removed
- **THEN** it cannot win least detour, whatever its detour

#### Scenario: Unresolved difference
- **WHEN** two packages above the floor differ in detour by less than the paired interval resolves
- **THEN** the one that removes more through cars wins, then the one with fewer changes

### Requirement: Beam for the detour goal
The beam for least detour SHALL rank a screened package by its detour, lowest first, once its reduction passes half of the best reduction screened so far, and by reduction below that. Every package above that floor SHALL rank ahead of every package below it.

#### Scenario: A low-detour partial package survives
- **WHEN** a partial package passes the floor with a smaller detour than a package that removes more
- **THEN** it ranks ahead of it in the beam for least detour, and a package below the floor ranks behind both

### Requirement: Displacement of untagged options
An option that wins no goal SHALL NOT be published when another published option displaces it: that option removes at least as many through cars or cannot be told from it on the paired comparison, and its largest all-car rise on one block is smaller by more than the noise of the two rises. Goal winners SHALL never be dropped by this rule. Every drop SHALL be recorded with its reason in the group's `computed` and in the report.

#### Scenario: Larger rise, same removal
- **WHEN** an untagged option removes 269 through cars an hour with a largest all-car rise of 208, and a tagged option removes 266 with a largest rise of 56, a difference the paired seeds do not resolve
- **THEN** the untagged option is not published and `computed.displacement.dropped` names it, the tagged option and both rises

#### Scenario: Noise of the rises
- **WHEN** the two rises have paired intervals
- **THEN** the noise is their half widths combined, and a floor labeled as an assumption when either has none

#### Scenario: A rise inside the noise
- **WHEN** the other option's rise is smaller by less than the noise of the two rises
- **THEN** the option stays

#### Scenario: Goal winner
- **WHEN** the option with the large rise is the winner of a goal
- **THEN** it stays

### Requirement: Per-link all cars for the card picture
Each proposal SHALL carry `pictureAll` beside `picture`: for the same period, the same seeds and the same run length, all cars an hour on each link of the side-street blocks the search measures that carries any, today and with the package, as parallel arrays keyed by link id in ascending order. Zeros SHALL be omitted. `explore --annotate` SHALL write it with `picture`, and its arrays SHALL equal those the search writes for the same inputs.

#### Scenario: Search output
- **WHEN** the search writes a group
- **THEN** every package carries a `pictureAll` with the period of its `picture`, and no link outside the measured blocks

#### Scenario: Size
- **WHEN** a group is written
- **THEN** `pictureAll` adds one array triple of at most a few hundred links to each package, and the file stays well under a few hundred kilobytes

#### Scenario: Older file
- **WHEN** a file has `picture` and no `pictureAll`
- **THEN** it is read as before and the card says all cars are not in the file
