# simulator-ui delta

## MODIFIED Requirements

### Requirement: Tab URLs
The path SHALL name the tab: `/` is the Map, and `/proposals`, `/methodology`, `/assumptions` and `/sources` are the others, each derived from the tab's id. Loading any of those paths SHALL open that tab. A path that names no tab SHALL open the Map and the address SHALL be corrected to `/`, keeping a scenario fragment. The retired `/streets` path is such a path.

#### Scenario: Direct load
- **WHEN** a person opens `/assumptions` directly
- **THEN** the Assumptions tab is open, its link is marked as the current page and the title starts with "Assumptions"

#### Scenario: Old Streets link
- **WHEN** a person opens `/streets` or `/streets#v1;a=rockridge;s=…`
- **THEN** the Map is open without an error, the scenario in the fragment is applied, and the address reads `/` followed by the fragment

#### Scenario: Unknown path
- **WHEN** a person opens `/nope`
- **THEN** the Map is open and the address reads `/`

### Requirement: Tab links
The tabs SHALL be links to their paths. A plain click SHALL stay in the page and add a history entry, so Back and Forward move between tabs; a click with a modifier key or another button SHALL be left to the browser. The current tab's link SHALL carry `aria-current="page"`.

#### Scenario: Back and Forward
- **WHEN** a person opens Proposals, then Methodology, then presses Back
- **THEN** Proposals is open and the address is `/proposals`; Forward returns to Streets

#### Scenario: Open in a new tab
- **WHEN** a person middle-clicks the Sources link
- **THEN** the browser opens `/sources` in a new tab and the current page does not change

### Requirement: Section anchors
Every section heading on the Proposals, Assumptions and Sources tabs SHALL have an id that is a slug of its heading or a data id, unique on the page and stable across reloads and data rebuilds. A proposal card SHALL use its group's id and the proposal's id, a reason card its reason id, a movement card its movement id and a source its citation key. Ids used before this change (`ref-intents`, `ref-movements`, `ref-calibration`, `ref-<citation key>`) SHALL still reach their sections.

#### Scenario: Old id
- **WHEN** a person opens `/assumptions#ref-intents`
- **THEN** the address is corrected to `#why-cars-cut-through` and that section is shown

### Requirement: Tab pages use the screen width

The Proposals, Methodology, Assumptions and Sources pages SHALL fill a fluid container centered on the screen, up to 1760 px wide, with side margins of at least 1rem. Running prose SHALL keep a measure of about 80 characters or less. The pages SHALL NOT scroll horizontally at any width from 320 CSS px up.

#### Scenario: Large screen

- **WHEN** a page is shown on a 1920 px wide screen
- **THEN** its content spans the container, long text lines stay at most about 80 characters, and Methodology sections and Sources entries flow into two columns

#### Scenario: Phone

- **WHEN** a page is shown at 360 px
- **THEN** it is one column with no horizontal page scroll

### Requirement: Proposals tab
The UI SHALL provide a Proposals tab listing the published options as one list, ordered by through cars removed an hour, largest first (ties: fewer changes, then the smaller largest all-car rise), numbered in that order. The UI SHALL enforce the order when it reads a file, whatever order the file has. By default a card SHALL show only its number and title, the headline figure (through cars an hour before and after on the area's side streets, with the change in cars an hour and in percent), one line naming the side-street block with the largest rise in all cars an hour with its before and after, the map of the change, any failed validity check, and the controls to open it on the map, copy its link, download its image and open Where traffic goes. Everything else SHALL be in native `details` disclosures, closed by default, each with a summary that says what it holds: the list of changes when it has more than three (a short list MAY stay visible), the summary in words with what the headline figure counts and its 95% interval and where the figures come from, the comparison with the next option, the tables by period, the split of the largest rise in all cars into through cars and local trips with its interval and the search's ranking penalty, the largest rise in through cars on one block, the through-route count, the resident detour, the option's variants, and the map's street lists, filter list and key. Nothing a card showed before SHALL be removed: every figure and note SHALL stay reachable by opening a disclosure. The UI SHALL NOT place an all-traffic number beside a through-car number without naming each. The tab SHALL state that the search penalizes increases in all traffic on one block, in the details. The UI SHALL let the user open any option on the map as a scenario. A group of options computed with an earlier measure SHALL be marked out of date and list no options.

#### Scenario: Opening an option
- **WHEN** a user chooses to open a proposal
- **THEN** the map view loads that proposal's interventions as the current scenario

#### Scenario: Collapsed card
- **WHEN** the tab is first shown with a published file
- **THEN** each card shows its title, its headline figure, the one-line largest rise in all cars, the map and the open, copy, download and trace controls, and every `details` element on the card is closed

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

### Requirement: Groups of proposals
The Proposals tab SHALL NOT show group headings or notes. It SHALL show the options of every group of the file as one list, sorted as the tab requires, with a package that two groups both list (the same scenario link) shown once. The exploratory notice, the out-of-date notice and any failed-confirmation notice SHALL appear once, outside any disclosure, for each distinct provenance among the groups that list options. The computed date and the provenance line SHALL appear once for each of them under the page-level disclosure.

#### Scenario: Older file with two groups
- **WHEN** the file holds two groups, one under the 2025 neighborhood pilot's limits and one without
- **THEN** the tab shows one list with every package once, with no heading or note for either group

#### Scenario: Earlier file format
- **WHEN** the file has one list and no groups
- **THEN** the tab shows it as a single list

#### Scenario: Two groups
- **WHEN** the file holds two groups that list different packages
- **THEN** the tab shows one list with all of them, sorted

#### Scenario: Empty group
- **WHEN** a group holds no options
- **THEN** it adds nothing to the list, and the tab says none were found when no group lists any

### Requirement: Proposal card arrangements

A proposal card SHALL arrange its content by its own width: one column under 44rem; two columns from 44rem (the map, then the readout and the closed disclosure holding the street list, the filter list and the key). The street table SHALL show stacked labeled rows in any column narrower than 38rem and a table otherwise. Keyboard order SHALL follow the visual order in each arrangement.

#### Scenario: Wide card
- **WHEN** a card is 44rem or wider
- **THEN** the map and the readout are visible together, and the street list, the filter list and the key are one closed disclosure beside the map

### Requirement: Selection stays in view

On cards of two or more columns, on screens at least 640 px tall, the map column and the readout SHALL stay in view, under the card's pinned header, while the card's disclosures scroll, and a focused row SHALL NOT be hidden under them.

#### Scenario: Scrolling the lists

- **WHEN** a row far down the street list is hovered or focused on a two-column card
- **THEN** the map and the readout are still on screen, below the card's header, and show that row's street

## REMOVED Requirements

### Requirement: Streets view on phones
**Reason**: The Streets tab is removed.
**Migration**: Each block's figures are on the map (hover or tap a street) and in the "Street by street" table of `/index.md`.

### Requirement: Streets table columns
**Reason**: The Streets tab is removed.
**Migration**: None. The text table in `/index.md` carries today's figures by period.

### Requirement: Revealing more rows
**Reason**: Its only use was the Streets table, which is removed; no other list reveals rows in steps.
**Migration**: None.

### Requirement: Transient highlight from lists
**Reason**: Reworded now that the Streets tab is removed; its scenarios named that tab.
**Migration**: See "Transient highlight from search results".

### Requirement: Keyboard access to scrollable regions
**Reason**: Reworded now that the Streets tab is removed; its scenarios named that tab.
**Migration**: See "Scrollable regions are keyboard reachable".

### Requirement: Internal links use tab URLs
**Reason**: Reworded now that the Streets tab is removed; its scenarios named that tab.
**Migration**: See "Links use tab URLs".

### Requirement: Measured streets only
**Reason**: Reworded now that the Streets tab is removed; its scenarios named that tab.
**Migration**: See "Measured streets in the map and text pages".

## ADDED Requirements

### Requirement: Transient highlight from search results
The UI SHALL light a street block or intersection on the map while the pointer is over, or keyboard focus is on, its row in the search results, and SHALL stop when the pointer or focus leaves. The highlight SHALL NOT change the selection or move the map, and SHALL use a distinct line style and width as well as color.

#### Scenario: Hovering a result
- **WHEN** a user moves the pointer over a search result
- **THEN** that block or intersection is outlined on the map and the selection is unchanged
- **AND WHEN** the pointer leaves
- **THEN** the outline is removed

#### Scenario: Focusing a result
- **WHEN** keyboard focus moves to a search result
- **THEN** that block or intersection is outlined on the map until focus moves away

### Requirement: Scrollable regions are keyboard reachable
Every scrollable region SHALL be reachable by keyboard, either by containing focusable content or by being focusable with an accessible name, at every layout width.

#### Scenario: Tablet width
- **WHEN** the window is 768 px wide
- **THEN** no scrollable region lacks focusable content or a focusable name

#### Scenario: Wide table in a card
- **WHEN** a table in a proposal card is wider than the card
- **THEN** it scrolls inside its own region, which is focusable and has an accessible name, and the page does not scroll sideways

### Requirement: Links use tab URLs
"About these reasons" SHALL link to `/assumptions#why-cars-cut-through`, citations in Results to `/sources#<key>`, the Sources and Assumptions pointers to each other's paths, and the calibration banner's "Details" to `/sources#calibration`. "Copy link to this scenario" SHALL copy the current tab's path with the scenario fragment. The proposal image's QR code and short URL SHALL still point at `/` with the scenario fragment.

#### Scenario: Copy link on the Map
- **WHEN** a person copies the scenario link on the Map tab
- **THEN** the copied address is `/` followed by the scenario fragment

### Requirement: Measured streets in the map and text pages
Metrics SHALL apply only to the residential and service streets inside the study area. The map shading, hover and tap values, legend, Results cards, text pages and headless report SHALL list and color those streets only and SHALL say so in text. The code SHALL decide this from the link's `inStudyArea` flag and class, not from street names.

#### Scenario: Reading the map
- **WHEN** a user views any map mode
- **THEN** only side streets inside the study area are colored by the ramp, and the legend names them

#### Scenario: Bounding streets
- **WHEN** a user views the map
- **THEN** bounding streets and everything outside the study area are drawn as plain context, with intervention markers still shown, and carry no figure

#### Scenario: Street-by-street text page
- **WHEN** an agent reads `/index.md`
- **THEN** its "Street by street" table lists only side-street blocks inside the study area, and its intro says streets outside it are not measured

### Requirement: Proposal card headers stay in view
Each proposal card SHALL have a header with its number, title and headline figure that stays pinned at the top of the page's scroll area, under the app bar, while any part of the card is on screen, and SHALL release when the card ends. The header SHALL be opaque with a themed background, and focused controls and anchors on the card SHALL NOT be hidden under it.

#### Scenario: Reading an expanded card
- **WHEN** a user opens "All cars on the worst block, and the search's ranking penalty" and scrolls down inside that card
- **THEN** the card's title and headline figure stay at the top of the scroll area until the card ends

#### Scenario: Narrow and zoomed
- **WHEN** the tab is shown at 320 px width or at 200% zoom
- **THEN** the header still pins, wraps its text, and does not scroll the page sideways

#### Scenario: Keyboard focus under the header
- **WHEN** a user tabs to a control that is below the pinned header's edge
- **THEN** the page scrolls so the control is fully visible below the header

### Requirement: Disclosures on the Proposals tab
Disclosures on the Proposals tab SHALL be native `details` elements with a `summary` element that names what is inside, closed by default, operable with Enter and Space, with a visible focus indicator, a marker that does not rely on color, and no animation under reduced motion. A table inside a disclosure that is wider than its container SHALL scroll in its own focusable region with an accessible name.

#### Scenario: Keyboard
- **WHEN** a user tabs to a summary and presses Enter
- **THEN** the disclosure opens, focus stays on the summary, and pressing Enter again closes it

### Requirement: Tab bar overflow cue
When the row of tabs is wider than the screen, the row SHALL scroll sideways and SHALL show a fade into the header color with an arrow on each edge that has more tabs to reach, and no cue on an edge that has none. The cue SHALL update on scroll and resize, work in both themes, take no pointer events and not hide a focused tab, and be removed in forced-colors mode. The active tab SHALL be centered when the tab changes and on load, and the row SHALL stay reachable by keyboard and touch.

#### Scenario: Start of the row
- **WHEN** the Map tab is active on a 375 px screen
- **THEN** an arrow and fade show on the right edge only

#### Scenario: Middle of the row
- **WHEN** the Methodology tab is active on a 375 px screen
- **THEN** it is centered and both edges show the cue

#### Scenario: End of the row
- **WHEN** the Sources tab is active on a 375 px screen
- **THEN** the cue shows on the left edge only

#### Scenario: Wide screen
- **WHEN** every tab fits
- **THEN** no cue is shown

### Requirement: Footer holds the theme control and the source link
The Theme control SHALL be in the footer, beside "For AI agents" and "Source on GitHub", as a small labeled select with the same options, behavior and stored choice as before. The footer SHALL be visible on every tab at every width, including the Map tab on a phone, where the bottom sheet sits above it and never covers it. Its links and control SHALL be at least 24 by 24 CSS px, and its bottom padding SHALL allow for a device's safe area.

#### Scenario: Phone
- **WHEN** any tab is shown at 320, 375 or 414 px
- **THEN** "Source on GitHub", "For AI agents" and the Theme control are visible and reachable without covering or being covered by the bottom sheet

#### Scenario: Theme
- **WHEN** a person chooses Dark in the footer
- **THEN** the app switches to the dark theme and keeps the choice on the next visit

### Requirement: No sideways panning on phones
No tab SHALL be wider than the screen at 320, 375 or 414 px with disclosures closed or open, and dragging sideways on a touch screen SHALL NOT move the page or the scroll area. Wide tables, code and long unbroken text SHALL wrap or scroll inside their own container. The page and the scroll area SHALL also clip any stray horizontal overflow as a guard.

#### Scenario: Dragging sideways
- **WHEN** a person drags sideways on any tab on a 375 px touch screen
- **THEN** the page does not move
