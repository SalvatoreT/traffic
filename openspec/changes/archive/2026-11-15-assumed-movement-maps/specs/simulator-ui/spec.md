## MODIFIED Requirements

### Requirement: Assumed movement flows table
The Assumptions tab SHALL explain in one short paragraph what an assumed movement is, why it exists and what its trips do when a change blocks the turn. It SHALL show one card per movement, with the turn in plain words, counted cars an hour per period (a period without a count marked scaled), cars an hour assigned, how many are through cars, and who the cars are assumed to be with their shares. Cards SHALL sit in a two-column grid on wide screens and one column on phones, with the same figures in the same positions on every card.

#### Scenario: Counted and assumed are distinguishable
- **WHEN** a person reads the cards
- **THEN** the counted figures, the scaled midday figure and the assumed figures are labeled as such in text

#### Scenario: Numbers come from data
- **WHEN** the cards are built
- **THEN** their figures are read from a generated file made from the demand config and fit report, and the page says when that file was made for a different demand file than the one loaded

#### Scenario: Who the cars are on a phone
- **WHEN** the screen is narrower than 720 px
- **THEN** each card's "who the cars are assumed to be" list is collapsed behind a disclosure, and it is open on wider screens

#### Scenario: Wording
- **WHEN** any user-facing text is searched
- **THEN** the word "owner" does not appear

## ADDED Requirements

### Requirement: Assumed movement maps
Each assumed movement card SHALL carry a static map of its turn: muted streets and the study area's outline around the junction, the approach and exit links highlighted, a curved arrow from the approach into the exit that bends the way the cars turn, a numbered marker at the junction and both streets named with their direction. Each map SHALL be an image whose text alternative states the turn in words.

#### Scenario: Left and right
- **WHEN** a movement turns left, or right
- **THEN** its arrow curves left, or right, from the approach into the exit

#### Scenario: Not by color alone
- **WHEN** the highlight color is ignored
- **THEN** the arrow, the street names with direction words and the number still say which turn the map shows

#### Scenario: Data without map fields
- **WHEN** the assumptions file has no link ids for the movements
- **THEN** the cards show their figures without maps or subheadings and the overview is omitted

#### Scenario: Link ids
- **WHEN** `npm run data:assumptions` runs
- **THEN** each movement carries its approach link, exit link and junction node, and neither the demand file nor the network file is written

### Requirement: Assumed movement overview
The section SHALL open with an overview map that shows every assumed turn as a marker with its card's number, and the cards SHALL be grouped under a subheading naming the pair of streets the turns connect.

#### Scenario: Numbers match
- **WHEN** a person finds marker 6 on the overview
- **THEN** card 6 describes the turn at that junction
