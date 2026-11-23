## MODIFIED Requirements

### Requirement: Proposals tab
The UI SHALL provide a Proposals tab listing the published options as one list, ordered by through cars removed an hour, largest first (ties: fewer changes, then the smaller largest all-car rise), numbered in that order. The UI SHALL enforce the order when it reads a file, whatever order the file has. By default a card SHALL show only its number and title, the headline figure (through cars an hour before and after on the area's side streets, with the change in cars an hour and in percent), a line with the overall change in through cars an hour (cars an hour, with its before and after, and the percent beside it in small text), marked in the accent color and placed before the largest rise, one line naming the side-street block with the largest rise in all cars an hour with its before and after, the map of the change, any failed validity check, and the controls to open it on the map, copy its link and download its image. A card SHALL NOT offer a button or dialog that runs a live trace of where traffic goes. Everything else SHALL be in native `details` disclosures, closed by default, each with a summary that says what it holds: the list of changes when it has more than three (a short list MAY stay visible), the summary in words with what the headline figure counts and its 95% interval and where the figures come from, the comparison with the next option, the tables by period, the split of the largest rise in all cars into through cars and local trips with its interval and the search's ranking penalty, the largest rise in through cars on one block, the through-route count, the resident detour, the option's variants, the map's street list and key, and a disclosure named Where filtered traffic goes that lists, for each change that closes a car movement, the through cars an hour that used it and where most of them go, from the stored redirect data. Nothing a card showed before SHALL be removed: every figure and note SHALL stay reachable by opening a disclosure. The UI SHALL NOT place an all-traffic number beside a through-car number without naming each. The tab SHALL state that the search penalizes increases in all traffic on one block, in the details. The UI SHALL let the user open any option on the map as a scenario. A group of options computed with an earlier measure SHALL be marked out of date and list no options.

#### Scenario: Opening an option
- **WHEN** a user chooses to open a proposal
- **THEN** the map view loads that proposal's interventions as the current scenario

#### Scenario: Collapsed card
- **WHEN** the tab is first shown with a published file
- **THEN** each card shows its title, its headline figure, the one-line overall cut-through change, the one-line largest rise in all cars, the map and the open, copy and download controls, and every `details` element on the card is closed

#### Scenario: Reaching a figure
- **WHEN** a user opens "Through cars an hour, by period" on a card
- **THEN** the table of before, after, change and interval for each period is shown, with the period names

#### Scenario: Uncalibrated baseline
- **WHEN** the baseline's calibration status is not calibrated
- **THEN** the tab states, outside any disclosure, that the proposals are exploratory and why

#### Scenario: Out-of-date proposals
- **WHEN** the proposals were computed on a different network or demand than the one loaded
- **THEN** the tab says, outside any disclosure, that they are out of date

#### Scenario: Page introduction
- **WHEN** the tab is shown
- **THEN** one or two sentences of introduction are visible, and the rest of the introduction, the through-route caveat, the computed date and the provenance are under "How to read these cards, and where the figures come from"

#### Scenario: No proposals published
- **WHEN** no proposals file exists for the area
- **THEN** the tab explains that none have been computed yet

#### Scenario: Count in view
- **WHEN** an option is listed
- **THEN** its headline figure reads "N → M through cars an hour" with the change beside it and shows no distance unit

#### Scenario: Largest rise in all cars
- **WHEN** an option is listed
- **THEN** the card's second line names the block with the largest rise in all cars an hour in any period and its before and after, and the split of the rise into through cars and local trips is under "All cars on the worst block, and the search's ranking penalty"

#### Scenario: Like-for-like side effect
- **WHEN** a block gains through cars beyond run-to-run variation
- **THEN** "Context: through cars on one block, through routes, resident detour" reads "+N through cars an hour on <block>, the block with the largest increase" with a definition naming through cars only, both directions of that block, and the periods averaged

#### Scenario: No block gains
- **WHEN** no block gains through cars on average
- **THEN** that disclosure says no block gains through cars on average, names the largest change, and shows no rise

#### Scenario: Split of the extra cars
- **WHEN** the all-cars disclosure shows a block that gains all traffic beyond noise
- **THEN** the table splits its change into through cars and local trips, and a sentence says "Mostly local trips" only when local trips are at least half of the extra cars across the rows that gain

#### Scenario: Older file
- **WHEN** a group in the file reports vehicle-miles, or reports one all-traffic worst block instead of through cars
- **THEN** the tab says it is out of date and does not show its options

#### Scenario: Unsorted file
- **WHEN** a file lists its options in another order
- **THEN** the tab shows them by through cars removed, largest first, and numbers them in that order

### Requirement: Scenario links carry the closed legs
Scenario links SHALL write the closed legs of a node filter as bearings after the geohash, and a link without them SHALL mean the whole junction.

#### Scenario: Old link
- **WHEN** a link written before legs existed holds a node filter
- **THEN** the filter closes the whole junction

#### Scenario: Round trip
- **WHEN** a scenario with a per-street filter is copied as a link and opened on a rebuilt network
- **THEN** the filter closes the same street's legs

#### Scenario: Street no longer meets the junction
- **WHEN** a link names a bearing that no leg at the nearest intersection matches
- **THEN** that filter is listed as unplaced and the rest of the scenario loads

### Requirement: Picture on each proposal card
Each proposal card whose proposal carries picture data SHALL show a map of the change in through cars an hour on each block in the picture's period, package minus today, drawn as inline SVG from the network geometry and not as an image, after the card's headline through-car figures and before the card's largest all-car rise, changes and variants. It SHALL color only the side streets inside the study area on the scale of the map's Change in cut-through view, draw other streets as faint context, draw the package's changes in place, give thicker lines to larger changes, and keep the OpenStreetMap attribution visible. It SHALL be drawn when the card nears the screen. The card SHALL NOT make a picture file on load. A Download image button on the card SHALL draw, on press, a landscape JPEG of the same content and save it with a filename from the area, title and period. That picture SHALL be at most 450 KB, use light colors in either theme, put the name, title, changes and figures in a left column of about 40% of the width and the map in a right column with the QR code in a corner clear of streets, and carry the legend, status, attribution and site in a band under both. Its height SHALL be capped; past the cap the change lines SHALL be shortened to their first clause, then replaced by "and N more". The text of the picture SHALL be at least 16 layout pixels at a width of 1,200.

#### Scenario: Card with a picture
- **WHEN** a proposal carries picture data
- **THEN** its card shows the title, the through-car figures, the map, the largest all-car rise, the changes, the variants, then the buttons Open on the map, Copy link and Download image

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

### Requirement: Street facts on the card's map
Moving the pointer over, focusing, or tapping a measured street on a card's map SHALL show its name and block, its through cars an hour today and with the proposal in the picture's period, the change, and the runs it is a mean over. It SHALL say when the change is within run-to-run variation. When the file has all-car figures for the proposal (`pictureAll`), it SHALL show all cars on the block today and with the proposal beside the through cars, split into through cars and local trips, in the street panel and the hover tip, and the "Streets that change" table SHALL carry an all-cars column. When the file has none, it SHALL give all cars only for a block whose all-car figures the file records, and otherwise say they are not in the file.

#### Scenario: Street hover
- **WHEN** the pointer is over a side street whose through cars go from 5 to 34
- **THEN** the card names the block and says 5 to 34 through cars an hour in the period, up 29, through cars only, with the runs

#### Scenario: Street hover with all cars
- **WHEN** the pointer is over a side street whose through cars go from 5 to 99 and whose all cars go from 70 to 278, and the file has `pictureAll`
- **THEN** the card names the block, says 5 to 99 through cars an hour, and says 70 to 278 all cars an hour, up 208, with the through and local split

#### Scenario: Street hover without all cars
- **WHEN** the file has no `pictureAll` and the street is not the block with the largest rise
- **THEN** the card says all cars on the block are not in the file

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
- **THEN** the hover says the redirect data is not available, and says why when it is out of date

### Requirement: Tab pages use the screen width

The Proposals, Methodology, Assumptions and Sources pages SHALL fill a fluid container centered on the screen, up to 1760 px wide, with side margins of at least 1rem. Running prose SHALL keep a measure of about 80 characters or less. The pages SHALL NOT scroll horizontally at any width from 320 CSS px up.

#### Scenario: Large screen

- **WHEN** a page is shown on a 1920 px wide screen
- **THEN** its content spans the container, long text lines stay at most about 80 characters, and Methodology sections and Sources entries flow into two columns

#### Scenario: Phone

- **WHEN** a page is shown at 360 px
- **THEN** it is one column with no horizontal page scroll

### Requirement: Proposal card arrangements

A proposal card SHALL arrange its content by its own width: one column under 44rem; two columns from 44rem (the map, then the readout, the card's buttons, the closed disclosure holding the street list and the key, the Where filtered traffic goes disclosure and the card's other disclosures). From 44rem the overall cut-through line and the largest-rise line SHALL sit side by side. The street table SHALL show stacked labeled rows in any column narrower than 38rem and a table otherwise. Keyboard order SHALL follow the visual order in each arrangement.

#### Scenario: Wide card
- **WHEN** a card is 44rem or wider
- **THEN** the map and the readout are visible together, and the street list, the filter list and the key are one closed disclosure beside the map
