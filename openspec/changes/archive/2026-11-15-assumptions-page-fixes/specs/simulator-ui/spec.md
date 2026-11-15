## ADDED Requirements

### Requirement: Assumptions section order and headings
The Assumptions tab SHALL list "Why cars cut through" before "Assumed movement flows". Each of those two section headings SHALL stay visible just under the top bar while its section scrolls, with an opaque themed background, and SHALL release when the next section's heading arrives. Anchors and focused controls SHALL NOT be hidden under the heading. Street-pair subheadings SHALL NOT be sticky.

#### Scenario: Order
- **WHEN** a person opens `/assumptions`
- **THEN** "Why cars cut through" appears above "Assumed movement flows"

#### Scenario: Anchored card
- **WHEN** a person opens `/assumptions#move-<id>` or `/assumptions#reason-<id>`
- **THEN** the card is fully visible below the sticky heading, on desktop and on phones

### Requirement: Figure tags stay with their figure
A tag that qualifies a figure on a movement card SHALL sit inside that figure's cell, under the number, and SHALL wrap instead of overflowing, at every width. A movement counted below the fit's minimum SHALL show "no trips assigned" under its counted figure, and the note below the figures SHALL name the periods in words.

#### Scenario: Narrow card
- **WHEN** a movement card is shown at 390 px with a below-threshold period
- **THEN** the tag is under that period's number, inside its column, and the page has no horizontal scroll

### Requirement: Reason card without a map
When a reason card has no map because the stored baseline is missing, stale or still loading, the card SHALL say so in one plain sentence.

#### Scenario: Stale baseline
- **WHEN** the stored baseline does not match the loaded network, demand or simulator
- **THEN** each reason card says the map is not available yet and why, in one sentence
