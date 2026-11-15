## ADDED Requirements

### Requirement: Streets view on phones
On phones (viewport under 720 px) the Streets tab SHALL be a full-height list with no map and no bottom sheet, each street block a card with a labeled grid of figures and a "Show on map" button that opens the Map tab with that block selected. A "Sort by" menu with a direction button of at least 24 by 24 CSS px SHALL replace header sort buttons, the table SHALL keep its caption and headers for assistive technology, and the page SHALL NOT scroll horizontally.

#### Scenario: Reading the list on a phone
- **WHEN** a user opens Streets on a 412 px wide screen
- **THEN** no map or sheet is drawn, the first card's name is readable in full, and the last card can be scrolled fully into view

#### Scenario: Show on map
- **WHEN** a user chooses "Show on map" on a card
- **THEN** the Map tab opens with that block selected

### Requirement: Streets table columns
Headers in the Streets table SHALL carry units ("All cars, cars an hour", "Mean speed, mph", "Through cars, cars an hour"), SHALL NOT wrap, and SHALL NOT overlap or clip the rows beneath them. The Scenario and Change columns SHALL appear only when a scenario can be compared with the baseline; without one the table SHALL say "Add a change on the Map tab to compare." Figures SHALL show a dash, not zero, while a run's results are withheld.

#### Scenario: No scenario
- **WHEN** no intervention has been added
- **THEN** the table lists base figures only and carries the note, with no columns of dashes

## MODIFIED Requirements

### Requirement: Transient highlight from lists
The UI SHALL light a street block or intersection on the map while the pointer is over, or keyboard focus is on, its row in the search results or the Streets table, and SHALL stop when the pointer or focus leaves. The highlight SHALL NOT change the selection or move the map, and SHALL use a distinct line style and width as well as color. On phones the Streets tab shows no map, so a Streets row lights nothing there.

#### Scenario: Hovering a result
- **WHEN** a user moves the pointer over a search result
- **THEN** that block or intersection is outlined on the map and the selection is unchanged
- **AND WHEN** the pointer leaves
- **THEN** the outline is removed

#### Scenario: Focusing a table row
- **WHEN** keyboard focus moves to a row in the Streets table on a screen wide enough to show the map
- **THEN** that block is outlined on the map until focus moves away
