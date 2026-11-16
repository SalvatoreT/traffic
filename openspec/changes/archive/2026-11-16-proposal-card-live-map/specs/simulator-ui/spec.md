## MODIFIED Requirements

### Requirement: Picture on each proposal card
Each proposal card whose proposal carries picture data SHALL show a map of the change in through cars an hour on each block in the picture's period, package minus today, drawn as inline SVG from the network geometry and not as an image, after the card's headline through-car figures and before the card's largest all-car rise, changes and variants. It SHALL color only the side streets inside the study area on the scale of the map's Change in cut-through view, draw other streets as faint context, draw the package's changes in place, give thicker lines to larger changes, and keep the OpenStreetMap attribution visible. It SHALL be drawn when the card nears the screen. The card SHALL NOT make a picture file on load. A Download image button on the card SHALL draw, on press, a landscape JPEG of the same content and save it with a filename from the area, title and period. That picture SHALL be at most 450 KB, use light colors in either theme, put the name, title, changes and figures in a left column of about 40% of the width and the map in a right column with the QR code in a corner clear of streets, and carry the legend, status, attribution and site in a band under both. Its height SHALL be capped; past the cap the change lines SHALL be shortened to their first clause, then replaced by "and N more". The text of the picture SHALL be at least 16 layout pixels at a width of 1,200.

#### Scenario: Card with a picture
- **WHEN** a proposal carries picture data
- **THEN** its card shows the title, the through-car figures, the map, the largest all-car rise, the changes, the variants, then the buttons Open on the map, Copy link, Where traffic goes and Download image

#### Scenario: Nothing is drawn as an image on load
- **WHEN** the Proposals tab opens
- **THEN** no picture file is drawn; the JPEG is drawn when Download image is pressed

#### Scenario: Landscape picture
- **WHEN** Download image is pressed for a proposal with one change and for one with twelve
- **THEN** the first picture is wider than tall, the second is no taller than the cap, no text or box overlaps another, and the QR code covers no colored street, mark or label

#### Scenario: Phone
- **WHEN** the card is narrower than 720 px
- **THEN** the map spans the card, the readout follows the map, and nothing overflows horizontally

#### Scenario: Same scale as the map
- **WHEN** a block's through cars change by the same amount on the card's map and in the map's Change in cut-through view
- **THEN** both use the same color, dead band and top of scale

#### Scenario: Older file
- **WHEN** a proposal has no picture, or its picture arrays are malformed
- **THEN** the card shows no map and no Download image button

### Requirement: Picture is readable without color and honest about its period
The card's map and the downloaded picture SHALL carry a caption naming the period, a legend with numbers and with a non-color cue (line thickness, labeled outlines, a selected street's halo), the block the card names as gaining the most labeled with its change, a text alternative giving the area's through-car change and the biggest drop and gain by block name, and the OpenStreetMap attribution.

#### Scenario: Figures average several periods
- **WHEN** a group searched more than one period
- **THEN** the card says once that its figures average those periods and the map shows one

#### Scenario: Named block is not the biggest gain in the picture's period
- **WHEN** the block the card names does not gain the most through cars in the picture's period
- **THEN** the card says so and names the block with the biggest gain in that period

## ADDED Requirements

### Requirement: Street facts on the card's map
Moving the pointer over, focusing, or tapping a measured street on a card's map SHALL show its name and block, its through cars an hour today and with the proposal in the picture's period, the change, that the figure counts through cars only, and the runs it is a mean over. It SHALL say when the change is within run-to-run variation. It SHALL give all cars on the block only for a block whose all-car figures the file records, and otherwise say they are not in the file.

#### Scenario: Street hover
- **WHEN** the pointer is over a side street whose through cars go from 5 to 34
- **THEN** the card names the block and says 5 to 34 through cars an hour in the period, up 29, through cars only, with the runs

### Requirement: Where a change sends traffic, and keyboard access
Moving over, focusing, or tapping a drawn change SHALL show, from stored redirect data, how many cars used it, the routes most take with cars an hour, and how many do not newly drive a side street; the routes are drawn as numbered arrows. Every fact on the map SHALL also be reachable by keyboard through a table "Streets that change" and a list "Where filtered traffic goes", and the map SHALL highlight the focused row. Escape SHALL clear a pinned selection.

#### Scenario: Keyboard
- **WHEN** a row of the table or list takes focus
- **THEN** the same text shows and the map highlights that street or change

#### Scenario: Change hover with stored data
- **WHEN** the pointer is over a modal filter and the stored redirect data for the proposal is current
- **THEN** the card says about how many through cars an hour used it, the routes most of them take instead, and how many do not newly drive a side street

#### Scenario: Stored data missing or out of date
- **WHEN** no redirect file exists for the proposal, or it was made for another link, period, seeds, network, demand or simulator
- **THEN** the hover says the redirect data is not available, says why when it is out of date, and offers the Where traffic goes view
