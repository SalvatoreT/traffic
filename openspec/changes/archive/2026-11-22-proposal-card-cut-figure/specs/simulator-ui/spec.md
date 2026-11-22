## MODIFIED Requirements

### Requirement: Proposals tab
The UI SHALL provide a Proposals tab listing the published options as one list, ordered by through cars removed an hour, largest first (ties: fewer changes, then the smaller largest all-car rise), numbered in that order. The UI SHALL enforce the order when it reads a file, whatever order the file has. By default a card SHALL show only its number and title, the headline figure (through cars an hour before and after on the area's side streets, with the change in cars an hour and in percent), a line with the overall change in through cars an hour in percent with its before and after, marked in the accent color and placed before the largest rise, one line naming the side-street block with the largest rise in all cars an hour with its before and after, the map of the change, any failed validity check, and the controls to open it on the map, copy its link, download its image and open Where traffic goes. Everything else SHALL be in native `details` disclosures, closed by default, each with a summary that says what it holds: the list of changes when it has more than three (a short list MAY stay visible), the summary in words with what the headline figure counts and its 95% interval and where the figures come from, the comparison with the next option, the tables by period, the split of the largest rise in all cars into through cars and local trips with its interval and the search's ranking penalty, the largest rise in through cars on one block, the through-route count, the resident detour, the option's variants, and the map's street lists, filter list and key. Nothing a card showed before SHALL be removed: every figure and note SHALL stay reachable by opening a disclosure. The UI SHALL NOT place an all-traffic number beside a through-car number without naming each. The tab SHALL state that the search penalizes increases in all traffic on one block, in the details. The UI SHALL let the user open any option on the map as a scenario. A group of options computed with an earlier measure SHALL be marked out of date and list no options.

#### Scenario: Opening an option
- **WHEN** a user chooses to open a proposal
- **THEN** the map view loads that proposal's interventions as the current scenario

#### Scenario: Collapsed card
- **WHEN** the tab is first shown with a published file
- **THEN** each card shows its title, its headline figure, the one-line overall cut-through change, the one-line largest rise in all cars, the map and the open, copy, download and trace controls, and every `details` element on the card is closed

#### Scenario: Reaching a figure
- **WHEN** a user opens "Through cars an hour, by period" on a card
- **THEN** the table of before, after, change and interval for each period is shown, with the period names

#### Scenario: Uncalibrated baseline
- **WHEN** the baseline's calibration status is not calibrated
- **THEN** the tab states, outside any disclosure, that the proposals are exploratory and why

#### Scenario: Out-of-date proposals
- **WHEN** the proposals were computed on a different network or demand than the one loaded
- **THEN** the tab says, outside any disclosure, that they are out of date

#### Scenario: Page introduction
- **WHEN** the tab is shown
- **THEN** one or two sentences of introduction are visible, and the rest of the introduction, the through-route caveat, the computed date and the provenance are under "How to read these cards, and where the figures come from"

#### Scenario: No proposals published
- **WHEN** no proposals file exists for the area
- **THEN** the tab explains that none have been computed yet

#### Scenario: Count in view
- **WHEN** an option is listed
- **THEN** its headline figure reads "N → M through cars an hour" with the change beside it and shows no distance unit

#### Scenario: Largest rise in all cars
- **WHEN** an option is listed
- **THEN** the card's second line names the block with the largest rise in all cars an hour in any period and its before and after, and the split of the rise into through cars and local trips is under "All cars on the worst block, and the search's ranking penalty"

#### Scenario: Like-for-like side effect
- **WHEN** a block gains through cars beyond run-to-run variation
- **THEN** "Context: through cars on one block, through routes, resident detour" reads "+N through cars an hour on <block>, the block with the largest increase" with a definition naming through cars only, both directions of that block, and the periods averaged

#### Scenario: No block gains
- **WHEN** no block gains through cars on average
- **THEN** that disclosure says no block gains through cars on average, names the largest change, and shows no rise

#### Scenario: Split of the extra cars
- **WHEN** the all-cars disclosure shows a block that gains all traffic beyond noise
- **THEN** the table splits its change into through cars and local trips, and a sentence says "Mostly local trips" only when local trips are at least half of the extra cars across the rows that gain

#### Scenario: Older file
- **WHEN** a group in the file reports vehicle-miles, or reports one all-traffic worst block instead of through cars
- **THEN** the tab says it is out of date and does not show its options

#### Scenario: Unsorted file
- **WHEN** a file lists its options in another order
- **THEN** the tab shows them by through cars removed, largest first, and numbers them in that order

## ADDED Requirements

### Requirement: Short street names on the Proposals tab
The Proposals tab SHALL show street-type words that follow a street name in their short form (Street as St, Avenue as Ave, Boulevard as Blvd, and the like) in card titles, change lists, block names, summaries, variants and the card map's labels and readouts. The shortening SHALL be for display only: the data files, links, text pages and downloaded image keep the full names, and words that are not part of a street name (such as "Slow Streets") SHALL NOT be changed.

#### Scenario: Block name on a card
- **WHEN** a card names "60th Street between Claremont Avenue / Hillegass Avenue and Colby Street"
- **THEN** it reads "60th St between Claremont Ave / Hillegass Ave and Colby St"

#### Scenario: Ordinary words
- **WHEN** a change is labeled "Slow Streets on Colby"
- **THEN** the label is unchanged
