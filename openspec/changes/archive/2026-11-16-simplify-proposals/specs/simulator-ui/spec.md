## MODIFIED Requirements

### Requirement: Proposals tab
The UI SHALL provide a Proposals tab listing the published options as one list, ordered by through cars removed an hour, largest first (ties: fewer changes, then the smaller largest all-car rise), numbered in that order. The UI SHALL enforce the order when it reads a file, whatever order the file has. A card SHALL lead with through cars an hour before and after on the area's side streets, with what the figure is (the area's side streets, the periods, the mean of how many runs) and its 95% interval. It SHALL show next the largest rise in all cars on any one side-street block, with the split into through cars and local trips and its interval, and then the list of changes, the option's variants and the controls to open it on the map, copy its link and open Where traffic goes. Everything else, including the summary in words, where the figures come from, the comparison with the next option, the through-route count, the largest rise in through cars on one block, the tables by period, the bounding streets and the figures inside the area, SHALL be under a More detail disclosure. The UI SHALL NOT place an all-traffic number beside a through-car number without naming each. The tab SHALL state that the search penalizes increases in all traffic on one block, in the details. The UI SHALL let the user open any option on the map as a scenario. A group of options computed with an earlier measure SHALL be marked out of date and list no options.

#### Scenario: Opening an option
- **WHEN** a user chooses to open a proposal
- **THEN** the map view loads that proposal's interventions as the current scenario

#### Scenario: Uncalibrated baseline
- **WHEN** the baseline's calibration status is not calibrated
- **THEN** the tab states that the proposals are exploratory and why

#### Scenario: Out-of-date proposals
- **WHEN** the proposals were computed on a different network or demand than the one loaded
- **THEN** the tab says they are out of date

#### Scenario: No proposals published
- **WHEN** no proposals file exists for the area
- **THEN** the tab explains that none have been computed yet

#### Scenario: Count in view
- **WHEN** an option is listed
- **THEN** its lead figure reads "N → M through cars an hour" with the change beside it and shows no distance unit

#### Scenario: Largest rise in all cars
- **WHEN** an option is listed
- **THEN** the card's second figure names the block with the largest rise in all cars an hour in any period, its before and after, and how much of the rise is through cars and how much is local trips

#### Scenario: Like-for-like side effect
- **WHEN** a block gains through cars beyond run-to-run variation
- **THEN** More detail reads "+N through cars an hour on <block>, the block with the largest increase" with a definition naming through cars only, both directions of that block, and the periods averaged

#### Scenario: No block gains
- **WHEN** no block gains through cars on average
- **THEN** More detail says no block gains through cars on average, names the largest change, and shows no rise

#### Scenario: Split of the extra cars
- **WHEN** the details show a block that gains all traffic beyond noise
- **THEN** the table splits its change into through cars and local trips, and a sentence says "Mostly local trips" only when local trips are at least half of the extra cars across the rows that gain

#### Scenario: Older file
- **WHEN** a group in the file reports vehicle-miles, or reports one all-traffic worst block instead of through cars
- **THEN** the tab says it is out of date and does not show its options

#### Scenario: Unsorted file
- **WHEN** a file lists its options in another order
- **THEN** the tab shows them by through cars removed, largest first, and numbers them in that order

### Requirement: Groups of proposals
The Proposals tab SHALL NOT show group headings or notes. It SHALL show the options of every group of the file as one list, sorted as the tab requires, with a package that two groups both list (the same scenario link) shown once. A status block with the computed date, the exploratory notice and the out-of-date notice SHALL appear once for each distinct provenance among the groups that list options.

#### Scenario: Older file with two groups
- **WHEN** the file holds two groups, one under the 2025 neighborhood pilot's limits and one without
- **THEN** the tab shows one list with every package once, with no heading or note for either group

#### Scenario: Earlier file format
- **WHEN** the file has one list and no groups
- **THEN** the tab shows it as a single list

#### Scenario: Two groups
- **WHEN** the file holds two groups that list different packages
- **THEN** the tab shows one list with all of them, sorted

#### Scenario: Empty group
- **WHEN** a group holds no options
- **THEN** it adds nothing to the list, and the tab says none were found when no group lists any

## ADDED Requirements

### Requirement: Variants on the card
A card whose option has variants SHALL list them under its changes in plain text, with a control on each that opens the variant on the map. A variant SHALL NOT be drawn in the card's picture, the exported image or the preview card.

#### Scenario: A variant line
- **WHEN** a variant has figures
- **THEN** its line says what differs from the option and its through cars an hour before and after with the runs behind them

#### Scenario: Three or fewer
- **WHEN** an option has three variants
- **THEN** all three are visible without opening anything

#### Scenario: More than three
- **WHEN** an option has five variants
- **THEN** three are visible and "2 more variants" opens the rest

#### Scenario: Replacing the person's scenario
- **WHEN** a person who has built a scenario opens a variant
- **THEN** the card asks whether to replace it, and focus returns to the control if they cancel

#### Scenario: Unreadable variant
- **WHEN** a variant in the file has no link or no description
- **THEN** it is left out and the option's other variants stay
