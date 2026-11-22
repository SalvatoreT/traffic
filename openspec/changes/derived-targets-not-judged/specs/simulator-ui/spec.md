## MODIFIED Requirements

### Requirement: Assumptions section order and headings
The Assumptions tab SHALL list "Why cars cut through" before "Assumed movement flows", and "Targets derived from daily totals", when the data lists any, after both. Each of those section headings SHALL stay visible just under the top bar while its section scrolls, with an opaque themed background, and SHALL release when the next section's heading arrives. Anchors and focused controls SHALL NOT be hidden under the heading. Street-pair subheadings SHALL NOT be sticky.

#### Scenario: Order
- **WHEN** a person opens `/assumptions`
- **THEN** "Why cars cut through" appears above "Assumed movement flows"

#### Scenario: Anchored card
- **WHEN** a person opens `/assumptions#move-<id>` or `/assumptions#reason-<id>`
- **THEN** the card is fully visible below the sticky heading, on desktop and on phones

## ADDED Requirements

### Requirement: Derived targets section
When the assumptions data lists derived targets, the Assumptions tab SHALL have a section "Targets derived from daily totals". It SHALL say in plain words what they are, that they stay in the fit as inputs, that they are never held back to test the model and that the calibration check does not count them.

#### Scenario: Data lists derived targets
- **WHEN** the assumptions file has a `derivedTargets` list
- **THEN** the tab shows the section after the assumed movement flows

#### Scenario: Data from before the change
- **WHEN** the assumptions file has no `derivedTargets`
- **THEN** the tab and the text pages look as they did before

### Requirement: Derived targets state their factors and stations
The section SHALL state the assumed factors from the data (K for streets and for ramps, the assumed directional split and the period factors) and SHALL list each station with its source, count year and hourly target in every period, each marked "derived from a daily total, not judged". The text pages for language models SHALL carry the same words.

#### Scenario: Factors
- **WHEN** the section is shown
- **THEN** it gives K for streets and ramps and the PM inbound and outbound shares as percentages read from the file

### Requirement: The derived targets table is accessible
The list SHALL be a table with a caption and column and row headers, inside a scroll region that takes keyboard focus. The status SHALL be words, and color SHALL NOT carry meaning alone.

#### Scenario: Phone
- **WHEN** the section is shown at 390 px
- **THEN** the table scrolls inside its own region, which the keyboard can reach and scroll, and the page has no horizontal scroll
