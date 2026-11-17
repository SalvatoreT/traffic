## ADDED Requirements

### Requirement: Tab pages use the screen width

The Proposals, Streets, Methodology, Assumptions and Sources pages SHALL fill a fluid container centered on the screen, up to 1760 px wide, with side margins of at least 1rem. Running prose SHALL keep a measure of about 80 characters or less. The pages SHALL NOT scroll horizontally at any width from 320 CSS px up.

#### Scenario: Large screen

- **WHEN** a page is shown on a 1920 px wide screen
- **THEN** its content spans the container, long text lines stay at most about 80 characters, and Methodology sections and Sources entries flow into two columns

#### Scenario: Phone

- **WHEN** a page is shown at 360 px
- **THEN** it is one column with no horizontal page scroll

### Requirement: Proposal card arrangements

A proposal card SHALL arrange its content by its own width: one column under 44rem; two columns from 44rem (map, then readout and lists); three columns from 76rem (map, then readout and "Streets that change", then "Where filtered traffic goes"). The street table SHALL show stacked labeled rows in any column narrower than 38rem and a table otherwise. Keyboard order SHALL follow the visual order in each arrangement.

#### Scenario: Wide card

- **WHEN** a card is 76rem or wider
- **THEN** the map, the readout, the first street rows and the filter list are visible together

### Requirement: Selection stays in view

On cards of two or more columns, on screens at least 640 px tall, the map column and the readout SHALL stay in view while the lists scroll, and a focused row SHALL NOT be hidden under them.

#### Scenario: Scrolling the lists

- **WHEN** a row far down the lists is hovered or focused on a two-column card
- **THEN** the map and the readout are still on screen and show that row's street

### Requirement: Map tooltip

Hovering, keyboard-focusing or tapping a street or a change SHALL show a tooltip on the card map with its name; for a street, through cars today and with the proposal, the change, and all cars when the file has them; for a change, how many cars used it and where most go. The tooltip SHALL be dismissible with Escape, stay within the visible map, stay while the pointer is over it, hold no focusable content, and be hidden from assistive technology because the readout region carries the same text.

#### Scenario: Hover a street

- **WHEN** a pointer rests on a street of the card map
- **THEN** a tooltip with the street's essential line appears near it and the readout shows the full text

#### Scenario: Escape

- **WHEN** Escape is pressed while a tooltip is shown
- **THEN** the tooltip and the selection clear

### Requirement: Reaching the map from a list when it is not kept in view

On cards without a sticky map, tapping a list row SHALL scroll the map into view (without animation under reduced motion), pin the selection and offer "Back to list", which returns focus to the row. While the map is mostly out of view and a selection exists, a "Show on map" control SHALL be reachable.

#### Scenario: Tap a row on a phone

- **WHEN** a row is tapped and the map is not in view
- **THEN** the map scrolls into view with the selection pinned, and "Back to list" returns focus to that row
