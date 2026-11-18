## ADDED Requirements

### Requirement: Proposal map selection is described in one detail box

The proposal card SHALL describe a selected street or change in its detail box only, and the card map SHALL NOT show a floating pop-up for it. Hovering, focusing or tapping a street or change on the map, or choosing it from a list, SHALL select it and update the box. The map SHALL keep a visible highlight on the selected street or change. The box SHALL be announced once when the selection changes.

#### Scenario: Hovering a street on the map

- **WHEN** a pointer enters a street on the card map
- **THEN** the street is highlighted, the detail box shows its figures, and no pop-up element is on the page

#### Scenario: Tapping a change marker

- **WHEN** a person taps a change marker on a touch screen
- **THEN** the marker is ringed, the box shows that change, and no pop-up element is on the page

### Requirement: Detail box figures are labeled in a table

The detail box SHALL show figures in a table with header cells, one figure per cell, a caption naming the period and unit once, and like-for-like quantities sharing a row or column. Figures SHALL be right-aligned with tabular numerals and the true minus sign, and the change column SHALL carry a sign. A footnote SHALL define through cars and name the run basis.

#### Scenario: Street columns and rows

- **WHEN** a street block is selected
- **THEN** the columns are today, with this proposal and change, and the rows are through cars plus, when the file has them, local trips and all cars

#### Scenario: Street with all cars

- **WHEN** a street block with published all-car figures is selected
- **THEN** the table has Through cars, Local trips and All cars rows, and each row's change equals its with-proposal figure minus its today figure

#### Scenario: Street without all cars

- **WHEN** a street block has no all-car figures in the file
- **THEN** the table has the Through cars row and the box says all cars are not in the published file

#### Scenario: Narrow screen

- **WHEN** the viewport is 360 px wide
- **THEN** the box fits without horizontal page scroll

### Requirement: Proposal card map shows all cars on each block

When a proposal carries an all-car picture, the card map SHALL color each block, and number the largest gain and drop, by the change in all cars an hour for the shown period, mean of the runs. The legend and the map's text alternative SHALL say so.

#### Scenario: Legend

- **WHEN** the map shows all cars
- **THEN** the legend says colors and numbers are the change in all cars an hour on each block, and that the card headline counts through cars over the whole area

#### Scenario: Map number equals box cell

- **WHEN** a block carries a number on the map
- **THEN** it equals the All cars Change cell of that block's detail box

#### Scenario: Through cars rise less than all cars

- **WHEN** a block's through cars go 20 → 90 and its all cars go 38 → 284
- **THEN** the map colors it by +246 and labels +246, and the box shows Through cars +70, Local trips +176 and All cars +246

#### Scenario: Through cars fall while all cars rise

- **WHEN** a block's through cars fall and its all cars rise
- **THEN** the map colors it as a rise and the box's Through cars row shows the fall

#### Scenario: Older file

- **WHEN** a proposal has no all-car picture
- **THEN** the map is drawn by through cars and the legend says the file has no all-car map

### Requirement: Proposal cards have readable anchors

A proposal card SHALL be addressable by the fragment `proposal-<n>` for option p<n> of the default group, `proposal-<reference id>` for a reference, and `proposal-<group id>-<n or reference id>` for any other group. An address that uses an older card id SHALL open the same card and be rewritten to the new fragment without a reload.

#### Scenario: Default group option

- **WHEN** a person opens `/proposals#proposal-1` or `/proposals#unconstrained-p1`
- **THEN** the page scrolls to card 1 and the address bar shows `#proposal-1`

#### Scenario: Reference proposal

- **WHEN** a reference with id `earlier-62nd-diverters` is listed
- **THEN** its card is `#proposal-earlier-62nd-diverters`
