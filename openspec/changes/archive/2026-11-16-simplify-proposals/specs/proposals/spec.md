## MODIFIED Requirements

### Requirement: Constraint profiles
The search MAY accept a named profile from a data file given with `--profiles` that excludes intervention types and, optionally, every intervention on a bounding street or at an intersection with one. No profile SHALL be published: the proposals are one list searched without limits, and the repository holds no profiles file. A run with a profile SHALL write its results as one group of the proposals file, replacing only the group with the same id and keeping the others. A run without a profile SHALL write the unconstrained group alone, replacing the file and the report. The harm definition SHALL NOT depend on the profile.

#### Scenario: Two runs, one file
- **WHEN** the search runs without a profile on a file that holds other groups
- **THEN** the file holds one group, and the report holds one section

#### Scenario: Limits of the 2025 neighborhood pilot
- **WHEN** the search runs with a profile that excludes speed humps, traffic circles and the boundary
- **THEN** no candidate or proposal contains a speed hump or traffic circle, or touches a bounding street or an intersection with one, and the group is written beside the others

#### Scenario: Earlier single-list file
- **WHEN** a profile run merges into a proposals file in the earlier format with one list
- **THEN** that list is kept as the unconstrained group

#### Scenario: Traffic moved onto a bounding street
- **WHEN** a package adds traffic to a bounding street
- **THEN** that increase is not counted as harm and is shown with the other bounding-street figures

#### Scenario: Packages from limited searches
- **WHEN** the seeds file holds packages recorded from a search that used limits
- **THEN** they are rechecked as known packages and compete for the options on equal terms

### Requirement: Consistent chosen options
The options chosen SHALL be listed by through cars removed an hour, largest first, as published to one decimal. Ties SHALL go to the option with fewer changes, then to the smaller largest all-car rise on any block in any period. The order SHALL follow the figures the file publishes, which are the confirmation runs when there are any. A package SHALL be listed only if it cuts through cars by more than every smaller package listed.

#### Scenario: More changes, less effect
- **WHEN** a finalist has more interventions than another finalist and cuts through cars less
- **THEN** it is not listed, and its note says a smaller finalist cuts through cars at least as much

#### Scenario: Order
- **WHEN** options remove 30, 20, 30 and 50 through cars an hour, the first with three changes and the third with two
- **THEN** they are listed 50, 30 (two changes), 30 (three changes), 20, and numbered in that order

#### Scenario: Confirmation reorders
- **WHEN** the confirmation runs rank two options differently from the runs that chose them
- **THEN** the file lists them in the confirmation order

### Requirement: Per-street filter candidates
The search SHALL offer, at each intersection where it offers a whole-junction filter, a filter on each single street when closing that street leaves at least two other legs connected, labeled "Modal filter on <street> at <intersection>". Such a candidate SHALL conflict with every other intervention on the same intersection, and a constraint profile SHALL apply to it as to the whole-junction filter.

#### Scenario: Four-way crossing
- **WHEN** candidates are generated for a crossing of two residential streets
- **THEN** the whole-junction filter and one filter per street are offered, and no package holds two of them

#### Scenario: T-junction
- **WHEN** candidates are generated for a T-junction
- **THEN** only the side street is offered alone, because closing the through street would leave a single leg

#### Scenario: Pilot limits
- **WHEN** a profile excludes intersections with a bounding street or an intervention type
- **THEN** no per-street filter is offered at those intersections or of that type

### Requirement: A looser search is never worse than a stricter one
When a proposals file already holds a group computed on the same network and demand, a search with a profile SHALL start from that group's chosen packages that the profile allows: screen them, extend them in a beam of their own and recheck them with the other finalists. Those packages SHALL always be rechecked, whatever one-seed screening or the screening budget said, and SHALL NOT be dropped as within noise of a simpler package. A profile that does not keep off the boundary SHALL offer every location a profile that does would offer. Within one invocation, a later profile SHALL start from the groups the earlier ones wrote.

#### Scenario: Pilot packages seed the unconstrained search
- **WHEN** a search without limits runs after a search with a profile on the same inputs
- **THEN** every package the limited group chose is rechecked in the later run, and the later group's best option cuts through cars at least as much

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

### Requirement: Near-duplicate options are folded
The search SHALL fold near-duplicate packages into one option before it picks the options, and SHALL keep the lightest option only if it survives the fold. The similarity thresholds are assumptions.

#### Scenario: Same places, other variant
- **WHEN** two finalists act at the same set of places and differ only in the variant at a place, such as the leg a filter sits on
- **THEN** one is kept and the other is recorded as folded into it

#### Scenario: One change apart, not different
- **WHEN** two finalists differ by at most one change (added, dropped or swapped) and neither beats the other under the paired comparison, or by more than the 1% floor when there are too few pairs
- **THEN** one is kept and the other is folded into it

#### Scenario: One change apart, clearly better
- **WHEN** a finalist with one more change beats the smaller one on the paired comparison
- **THEN** both are kept

#### Scenario: Same picture
- **WHEN** the distance between two finalists' through-car changes on the side-street blocks, `sum |a - b| / (sum |a| + sum |b|)` over the blocks averaged over periods and seeds, is at most 0.10
- **THEN** one is kept and the other is folded into it, with the distance recorded

#### Scenario: Which one is kept
- **WHEN** two packages are similar
- **THEN** the one with the larger reduction is kept if it wins the paired comparison, otherwise the one with fewer changes, then the smaller largest all-car rise, then the one an earlier search published, then the earlier finalist

#### Scenario: Nothing disappears silently
- **WHEN** a package is folded
- **THEN** the finalists table notes the package it folded into and why, the report has a "Similar packages" section, and `computed.similarity` lists the fold

### Requirement: Variants on the kept option
Each published option SHALL carry the packages folded into it as `variants`, each with a scenario link, one plain line per difference against the option, why it was folded, its origin, and its through cars an hour before and after with the seeds and role of the runs behind them. A variant SHALL NOT be a proposal: it has no share path, stored result, picture or preview card.

#### Scenario: Swap at one place
- **WHEN** a folded package has a different change at the same place as one of the option's
- **THEN** its line reads "Use <its change> instead of <the option's change>"

#### Scenario: Added or dropped change
- **WHEN** a folded package has one more change than the option, or one fewer
- **THEN** its line reads "Add: <change>" or "Drop: <change>"

#### Scenario: Fold into an unpublished option
- **WHEN** the option a package folded into is not published
- **THEN** the package appears in `computed.similarity` with `intoPublished` false and on no card

### Requirement: The default search is one run
Without arguments for seeds, `explore` SHALL search and recheck on seeds 1 to 3 and then rerun the frozen shortlist on seeds 101 to 110, which took no part in the search, and publish the confirmation runs. `--no-confirm` SHALL turn the confirmation off, and the file SHALL then label its estimates exploratory. The reporting method SHALL change when the selection rules do.

#### Scenario: Default
- **WHEN** `explore` runs with only an area and periods
- **THEN** the file's `computed.seeds` are 101 to 110 and its options' evidence role is `confirmation`

#### Scenario: Overlapping seeds
- **WHEN** `--seeds` includes a confirmation seed
- **THEN** the command stops and says the ranges must not overlap
