## MODIFIED Requirements

### Requirement: Proposals tab
The UI SHALL provide a Proposals tab listing the published options in order from fewest interventions to greatest reduction, each with its title, description, interventions, and two like-for-like figures: the reduction in through cars an hour across the area's side streets, as a count first and a percentage second, and the through cars an hour gained on the side-street block that gains the most, averaged over the same periods. Each figure SHALL carry a plain definition of what is counted, where and over which periods. The UI SHALL NOT place an all-traffic number beside a through-car number without naming each, and SHALL show all-traffic changes only in the option's details, in a table titled "All traffic on side-street blocks (through and local trips together)" with a row per period labeled with that period. The tab SHALL state that the search penalizes increases in all traffic on one block. The UI SHALL let the user open any option on the map as a scenario. A group of options computed with an earlier measure SHALL be marked out of date and list no options.

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
- **THEN** it reads "N → M through cars an hour" and shows no distance unit

#### Scenario: Like-for-like side effect
- **WHEN** a block gains through cars beyond run-to-run variation
- **THEN** the card reads "+N through cars an hour on <block>, the block that gains the most" with a definition naming through cars only, both directions of that block, and the periods averaged

#### Scenario: No block gains
- **WHEN** no block gains through cars beyond run-to-run variation
- **THEN** the card says "No block gains through traffic beyond run-to-run variation" and shows no number

#### Scenario: Split of the extra cars
- **WHEN** the details show a block that gains all traffic beyond noise
- **THEN** the table splits its change into through cars and local trips, and a sentence says "Mostly local trips" only when local trips are at least half of the extra cars across the rows that gain

#### Scenario: Older file
- **WHEN** a group in the file reports vehicle-miles, or reports one all-traffic worst block instead of through cars
- **THEN** the tab says it is out of date and does not show its options
