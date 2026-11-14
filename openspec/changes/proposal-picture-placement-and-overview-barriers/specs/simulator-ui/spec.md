## MODIFIED Requirements

### Requirement: Modal filters show what they close
The map SHALL mark every street a modal filter closes to through cars, and only those streets, with a short bar drawn across the road at a right angle to it, by shape and pattern as well as color, and SHALL draw no badge for a modal filter. Bars SHALL be map features centered on their street at a geographic point, sized from the drawn road with a minimum size so they are legible at every zoom. At a junction, a leg's bar SHALL sit at least 8 m out along its street, and farther when the bars of its other legs would touch at the current zoom. Each filter SHALL keep an invisible control of at least 24 by 24 CSS px at its location that is reachable by keyboard, has a visible focus ring and the filter's description as its name, and selects the filter when activated; clicking a bar SHALL select its filter. The Scenario list, selection pop-up and tooltip SHALL say in words which legs are closed.

#### Scenario: Text matches the map
- **WHEN** a filter is placed
- **THEN** the text names the closed legs by street and compass word, says once that people walking and cycling still pass, and previews the legs before the filter is added at an intersection

#### Scenario: Four-leg intersection
- **WHEN** a whole-junction filter is placed at a four-leg intersection
- **THEN** four bars appear, one across each leg, and the list names the four legs

#### Scenario: One street
- **WHEN** a filter closes the two legs of one street at a four-leg intersection
- **THEN** two bars appear, one across each of those legs, and the text names them and says which streets stay open

#### Scenario: Offset junction
- **WHEN** the filter is at a junction whose legs begin up to 20 m apart
- **THEN** each bar sits across its own street out from where that street begins, and the text says the junction combines the streets and whether the filter closes all of its legs or only some

#### Scenario: Block filter
- **WHEN** a filter is on a block
- **THEN** one bar crosses the block at its midpoint, with no badge and no tape along the block, and the text names the block

#### Scenario: Zooming out
- **WHEN** the map is at the fitted overview
- **THEN** every bar is visible at its minimum size, across its own street, with the bars of one junction apart from each other

#### Scenario: Selecting a filter
- **WHEN** a person clicks a bar, or tabs to the filter's control and presses Enter
- **THEN** the filter's intersection or block is selected, where it can be removed

#### Scenario: Exported image
- **WHEN** the map is exported at any zoom
- **THEN** the bars in the image have the sizes and places they have on screen

### Requirement: Picture on each proposal card
Each proposal card whose proposal carries picture data SHALL show, directly after the card's title and before its summary, figures and list of changes, the picture of the change in through cars an hour on each block in the picture's period, package minus today, as an image (`img`) of a PNG that can be saved like any image, with a text alternative and a Download image link. The picture SHALL use the scale of the map's Change in cut-through view and draw the package's changes on the streets. It SHALL follow no animation and look the same in light and dark themes. On wide screens it MAY sit beside the text; on narrow screens it stacks above it. The reading order SHALL match the visual order. The control for opening the package on the map SHALL stay with the picture.

#### Scenario: Card with a picture
- **WHEN** a proposal carries picture data
- **THEN** its card shows the title, then the picture with its download link and open control, then the summary, figures and changes, with filters drawn as bars across the closed streets

#### Scenario: Phone
- **WHEN** the card is narrower than 720 px
- **THEN** the picture follows the title in one column with no horizontal overflow

#### Scenario: Same scale as the map
- **WHEN** a block's through cars change by the same amount on the picture and in the map's Change in cut-through view
- **THEN** both use the same color, dead band and top of scale

#### Scenario: Older file
- **WHEN** a proposal has no picture, or its picture arrays are malformed
- **THEN** the card shows no picture and no empty space

## ADDED Requirements

### Requirement: Picture stands on its own when shared
The picture's PNG SHALL carry the proposal's title, its list of changes, the period it shows with its hours, the legend with numbers and the cues that are not color (the barrier bar, the outlined block), the through cars on all side streets for the picture's period before and after with the percent change, and, when more than one period was searched, the same for the card's average, a note that the figures are a simulation result with the area's calibration status, the area name, the OpenStreetMap attribution, the site address and a QR code, with a short label, that opens the proposal on the map. The title SHALL carry no number. The QR code SHALL encode the absolute link, use error correction M or higher, keep a quiet zone of 4 modules, draw dark modules on white in either theme and take at least 3 px a module in the file, without covering the map, legend or text. No text SHALL overlap or run past the edge, at any number of changes.

#### Scenario: Saved and sent
- **WHEN** a person saves the picture or follows Download image
- **THEN** the file is the same PNG, named for the area, the proposal and the period, and shows everything above

#### Scenario: Scanning
- **WHEN** the QR code in the saved file is decoded
- **THEN** it gives the address the card's Open on the map control uses

#### Scenario: One period searched
- **WHEN** only the picture's period was searched
- **THEN** the image states that period's figure once and has no average line

### Requirement: Why cars cut through highlight is distinct from the traffic scales
The map highlight for a reason SHALL use a color and line pattern that no overlay scale uses, in both themes, so it cannot be read as a traffic value.

#### Scenario: Highlight on the change view
- **WHEN** a reason is highlighted while the map shows change in cut-through
- **THEN** its path is a dashed violet line with a solid casing, apart from the blue and orange of the scale
