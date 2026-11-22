## ADDED Requirements

### Requirement: Where cars cut through
The Assumptions tab SHALL show a section "Where cars cut through" above "Why cars cut through". It SHALL state that its contents are hypotheses and list today's through cars by corridor and direction as a table with column and row headers, heaviest flow first in the default period, with cars an hour for every period and the share of all through cars. It SHALL fold small flows into one row and state the limit as a presentation choice.

#### Scenario: Headline rows
- **WHEN** the stored baseline matches the loaded model and has a corridor table
- **THEN** each flow at or above the fold share in some period is a row with its corridor, direction, cars an hour per period and shares, and no row is named after a freeway ramp or "Other"

#### Scenario: Smaller flows
- **WHEN** a flow is below 5% of the through cars in every period
- **THEN** it is listed only inside the closed disclosure of one "Smaller flows" row, the last row gives all through cars equal to the sum of the rows, and the page says the totals include every flow

#### Scenario: Notes
- **WHEN** the table is shown
- **THEN** the section says how many through cars drive at least a set share of their side-street distance in a second corridor and how many cross between the west and east bounding streets, and on phones the rows stack without horizontal page scroll

#### Scenario: Reasons stay available
- **WHEN** a person opens "Why these cars are here" under a row
- **THEN** it lists the streets of the corridor and the reasons for that flow with their Observed counts or Assumed labels, cars an hour per period and the arterial each would otherwise use

#### Scenario: Missing or stale baseline
- **WHEN** the stored baseline is absent, stale or has no corridor table
- **THEN** the section shows its text and a short note, with no table

### Requirement: Assumed movements under corridor headings
The Assumptions tab SHALL group the assumed movement flows under the corridor headings of the area, in the area's order, when the data file names corridors, and otherwise under the pair of streets each movement connects. The counted, assigned and through figures SHALL NOT change.

#### Scenario: Grouped by corridor
- **WHEN** a movement's corridor is Hillegass Ave
- **THEN** its card sits under the heading "Hillegass Ave" with the same numbers as before

## MODIFIED Requirements

### Requirement: Reason cards
The Assumptions tab SHALL show one card per demand intent under "Why cars cut through", inside a closed disclosure: its label, its basis in text (Observed counts or Assumed), its note, the arterial it bypasses and the baseline through cars an hour for each period. Cards SHALL stack one per row on phones and sit two or three per row on wide screens.

#### Scenario: Cards from a matching baseline
- **WHEN** the stored baseline's network hash, demand hash and simulator fingerprint match what is loaded
- **THEN** each card shows its cars an hour per period and its map

#### Scenario: Missing or stale baseline
- **WHEN** the stored baseline is absent or was made for other inputs
- **THEN** the cards show their text and a short note, with no empty map space
