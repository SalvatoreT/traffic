## ADDED Requirements

### Requirement: Assumptions tab
The app SHALL have a top-level Assumptions tab between Streets and Sources. It SHALL open by saying its contents are the judgment calls in the model, the parts that rest on reasoning and not on a count, that they are the first things to question and that changing them would change the results, and it SHALL link to Sources for the measured inputs.

#### Scenario: Tab order
- **WHEN** the navigation is read in order
- **THEN** it lists Map, Proposals, Streets, Assumptions, Sources, and all five fit on a phone without a horizontal page scroll

#### Scenario: Pointer from Sources
- **WHEN** a person opens Sources
- **THEN** a line says the judgment calls are on the Assumptions tab and links to it, and the assumed-movement provenance entry is not listed there

### Requirement: Assumed movement flows table
The Assumptions tab SHALL explain in one short paragraph what an assumed movement is, why it exists and what its trips do when a change blocks the turn. It SHALL list one row per movement: the turn in plain words, counted cars an hour per period (a period without a count marked scaled), cars an hour assigned, how many are through cars, and who the cars are assumed to be with their shares.

#### Scenario: Counted and assumed are distinguishable
- **WHEN** a person reads the table
- **THEN** the counted columns, the scaled midday column and the assumed columns are labeled as such in text, and on a phone each row stacks as labeled lines

#### Scenario: Numbers come from data
- **WHEN** the table is built
- **THEN** its figures are read from a generated file made from the demand config and fit report, and the page says when that file was made for a different demand file than the one loaded

#### Scenario: Wording
- **WHEN** any user-facing text is searched
- **THEN** the word "owner" does not appear

### Requirement: Reason cards
The Assumptions tab SHALL show one card per demand intent under "Why cars cut through": its label, its basis in text (Observed counts or Assumed), its note, the arterial it bypasses and the baseline through cars an hour for each period. Cards SHALL stack one per row on phones and sit two or three per row on wide screens.

#### Scenario: Cards from a matching baseline
- **WHEN** the stored baseline's network hash, demand hash and simulator fingerprint match what is loaded
- **THEN** each card shows its cars an hour per period and its map

#### Scenario: Missing or stale baseline
- **WHEN** the stored baseline is absent or was made for other inputs
- **THEN** the cards show their text and a short note, with no empty map space

### Requirement: Reason maps
Each reason card SHALL show a static map of that reason's typical path in the baseline of the default period, and say so. The map SHALL show the study area outline, quiet streets and the boundary street names, the path as the live highlight's dashed violet line with width by cars an hour, arrowheads for direction and labeled start and end, with an img role, a text alternative, and the OpenStreetMap attribution, in light and dark themes.

#### Scenario: Map matches its text
- **WHEN** a card shows a map
- **THEN** the one-sentence description under it is the one the Results panel gives for the same path, and the arrows agree with it

## MODIFIED Requirements

### Requirement: Sources visible
The UI SHALL provide a page listing the research references and data sources behind the model, and a pointer to the Assumptions tab for the judgment calls.

#### Scenario: Viewing sources
- **WHEN** a user opens "Sources"
- **THEN** they see the bibliography and data provenance with links, and a line pointing to the Assumptions tab

### Requirement: Why cars cut through
The Results panel SHALL show one row per intent plus Other, each with a text basis badge, baseline and scenario cars an hour and the change, rows adding to the through-car total. A short paragraph SHALL say these are hypotheses and a link, "About these reasons", SHALL open the Assumptions tab at the section that lists each reason.

#### Scenario: Rows add up
- **WHEN** the panel shows a run
- **THEN** the rows sum to the through cars shown in the card above

#### Scenario: About these reasons
- **WHEN** a person follows the link
- **THEN** the Assumptions tab opens at "Why cars cut through"
