## ADDED Requirements

### Requirement: Why cars cut through
The Results panel SHALL show one row per intent plus Other, each with a text basis badge, baseline and scenario cars an hour and the change, rows adding to the through-car total. A short paragraph SHALL say these are hypotheses and link to Sources, which lists each reason with its basis and note.

#### Scenario: Rows add up
- **WHEN** the panel shows a run
- **THEN** the rows sum to the through cars shown in the card above

### Requirement: Intent highlight on the map
Selecting a row (a button with `aria-pressed`) SHALL draw that intent's typical path with line width by cars an hour and give a text summary of it. A control SHALL turn the highlight off.

#### Scenario: Highlight
- **WHEN** a reason is selected
- **THEN** its heaviest links are drawn and described, and pressing the button again clears them
