# simulator-ui Specification

## Purpose
What the web interface shows and lets people do: watch traffic, edit a scenario, compare it with the baseline and share it.

## Requirements

### Requirement: Live traffic map
The UI SHALL show the study area's streets with moving vehicles, signal states and a per-street overlay selectable between flow (all cars) and cut-through volume on the side streets inside the study area, with OpenStreetMap attribution.

#### Scenario: Opening the app
- **WHEN** a user opens the app
- **THEN** the Rockridge network loads and vehicles begin moving without further input

### Requirement: Playback control
Users SHALL be able to pause, resume, change simulation speed, choose the time period and reset. Speeds SHALL be 1x, 5x, 20x, 60x and Max, and a new session SHALL start at 20x. A run SHALL cover one simulated hour of the chosen period and then stop, with the baseline and the scenario covering identical time; the user SHALL be able to run it again.

#### Scenario: Run reaches the end of the hour
- **WHEN** the simulation clock reaches one simulated hour
- **THEN** both runs stop stepping at exactly that time, the clock reads "1:00:00 of 1:00:00", Results are labeled as covering the full hour, "Run finished" is announced politely once, and the play control becomes "Run again"

#### Scenario: Running again
- **WHEN** the user chooses "Run again"
- **THEN** both runs restart from zero with the same seed

#### Scenario: Default and experimental periods
- **WHEN** the app opens without a period in the link
- **THEN** the area's default period is selected, else midday if present, else the first; periods the area marks experimental (or peak periods of an uncalibrated area) carry an "(experimental)" suffix and show a note when selected

#### Scenario: Reduced motion
- **WHEN** the user's system prefers reduced motion
- **THEN** the simulation starts paused and the overlay conveys traffic state without animation

#### Scenario: Max
- **WHEN** the user chooses Max, with or without interventions
- **THEN** both runs advance to the end of the hour without drawing every frame, the progress bar and a status note show how far they are, the page stays responsive, the overlay and results are not redrawn from partial averages on the way, the Results panel and Streets table say in a status message that figures appear when the run finishes instead of showing zeros, and when they finish the map shows the final state with the end-of-run results and overlays

#### Scenario: Stopping a Max run
- **WHEN** the user pauses or chooses another speed during a Max run
- **THEN** stepping stops within a fraction of a second at the time reached and continues from there at the chosen speed

#### Scenario: Same results at any speed
- **WHEN** the same period, demand, seed and scenario run at Max and at 60x
- **THEN** the results and each street's overlay values at the end are identical

#### Scenario: Max and links
- **WHEN** a scenario link is created or opened
- **THEN** it carries no speed and works as before

### Requirement: Intervention editing
Users SHALL be able to add an intervention by first selecting a street block or intersection, on the map or from a searchable list, and then choosing from the interventions that apply to that place, and SHALL be able to review and remove interventions from a list and from the selected place.

#### Scenario: Keyboard-only editing
- **WHEN** a user operates the app with only a keyboard
- **THEN** they can add and remove every intervention type

#### Scenario: Selecting a street on the map
- **WHEN** a user clicks a street block on the map
- **THEN** the block is highlighted and a menu offers the interventions that apply to a street, along with any already on that block

#### Scenario: Selecting an intersection
- **WHEN** a user selects an intersection
- **THEN** the menu offers only interventions that apply to an intersection

#### Scenario: Phone
- **WHEN** a user taps a street on a phone
- **THEN** the choices appear in the bottom sheet, which rises so they are visible

#### Scenario: Dismissing a selection
- **WHEN** a user presses Escape or selects empty map
- **THEN** the selection clears and focus returns to where it was

### Requirement: Baseline comparison
The UI SHALL show the scenario's metrics beside the baseline's for the same period, seed and simulated duration, with the direction and size of change stated in text.

#### Scenario: After adding a modal filter
- **WHEN** a scenario has run for the comparison window
- **THEN** cut-through and close-following conflict metrics show baseline, scenario and difference

### Requirement: Accessibility
The UI SHALL meet WCAG 2.2 AA: full keyboard operation with visible focus, labeled controls, 4.5:1 text contrast in light and dark themes, color never the sole carrier of meaning, and a text/table alternative for information shown only on the map.

#### Scenario: Screen reader user
- **WHEN** a screen reader user explores results
- **THEN** a table lists the side streets inside the study area with their flow and cut-through values and metric updates are announced politely

### Requirement: Sources visible
The UI SHALL provide a page listing the research references and data sources behind the model, and a pointer to the Assumptions tab for the judgment calls. Each source SHALL link as specifically as a verified link allows to the passage, page, file or record the project uses, and a source with several uses SHALL give each its own labeled link. Links SHALL open normally, SHALL be named by their labels and not by their URLs, and SHALL NOT make the page scroll sideways on a phone. A source with no verifiable deeper link SHALL keep its general link or none.

#### Scenario: Viewing sources
- **WHEN** a user opens "Sources"
- **THEN** they see the bibliography and data provenance with links, and a line pointing to the Assumptions tab

#### Scenario: Following a cited table
- **WHEN** a user follows the link of an entry whose use is a table in a PDF or a passage on an HTML page
- **THEN** the link opens that PDF page or highlights that passage, and further uses of the same source appear as labeled links in parentheses after the citation line

#### Scenario: Entry with no deeper link
- **WHEN** no link to the cited content could be verified
- **THEN** the entry shows no new link and the bibliography's notes say why

### Requirement: Location-based scenario links
Shareable scenario links SHALL encode each intervention by geographic location (a 10-character geohash, about 1 m), with a bearing where direction matters, together with the area id and a format version, and SHALL NOT depend on network link or node indices.

#### Scenario: Network regenerated
- **WHEN** a link is opened after the street network has been rebuilt with different link and node indices
- **THEN** each intervention is restored on the same street block or intersection as before

#### Scenario: Location no longer exists
- **WHEN** an intervention's location has no matching street or intersection within tolerance
- **THEN** the rest of the scenario loads and the unplaced intervention is listed with an explanation

#### Scenario: Unreadable link
- **WHEN** a link has an unknown version, an unknown area or a malformed item
- **THEN** the baseline loads and a short dismissible notice says the link couldn't be read

### Requirement: Offering the diagonal diverter
The UI SHALL offer a diagonal diverter when a four-leg intersection is selected, as two choices labeled by the streets that stay connected, and SHALL draw the diverter on the map along its barrier line.

#### Scenario: Four-leg intersection
- **WHEN** a user selects an intersection with four legs
- **THEN** the menu offers two diagonal diverter options, each naming the two pairs of streets that remain connected

#### Scenario: Other intersections
- **WHEN** a user selects an intersection with three or five legs
- **THEN** the diagonal diverter is not offered

#### Scenario: Shared link
- **WHEN** a link containing a diagonal diverter is opened
- **THEN** the diverter is restored at the same intersection with the same orientation

### Requirement: Modes on the map
The map SHALL draw cars, bicycles and pedestrians with distinct shapes as well as colors, explain them in the legend, and let people show or hide each mode.

#### Scenario: Hiding cars
- **WHEN** a user turns off cars
- **THEN** only bicycles and pedestrians are drawn and the legend reflects the choice

### Requirement: Map limited to the study area
The map SHALL draw streets, traffic, agents, signals and markers only within the study area and a fixed buffer around it, SHALL keep the camera within that region, and SHALL leave the simulation and its results covering the whole network.

#### Scenario: Zooming out
- **WHEN** a user zooms out or pans as far as the map allows
- **THEN** the view stays within the study area and its buffer, and nothing is drawn beyond it

#### Scenario: Intervention outside the region
- **WHEN** a shared link contains an intervention outside the visible region
- **THEN** the intervention is applied, listed as outside the map and shown without a marker

### Requirement: Fixed overlay scales
Each traffic overlay SHALL use a fixed scale whose top value does not change while the simulation runs, SHALL show values above the top in the top color, and SHALL label the top with a plus sign; a top value that is not backed by a verified source SHALL be labeled an assumption.

#### Scenario: Traffic builds up
- **WHEN** traffic on a street rises during a run
- **THEN** the street's color moves along a scale whose labels stay the same

### Requirement: Opening period
On first load the app SHALL select a period that is not marked experimental when one exists, and a shared link that names a period SHALL open on that period.

#### Scenario: First visit
- **WHEN** a user opens the app without a link
- **THEN** the selected period is not marked experimental

### Requirement: Change from baseline on the map
When a scenario has interventions, the map SHALL be able to color each street by the difference between the scenario and the baseline for the selected metric, on a fixed two-sided scale centered on no change. Size of change SHALL show as line thickness, thin near zero and thick at both ends, and as color intensity on a blue-orange diverging ramp whose non-zero steps keep 3:1 contrast against the basemap in both themes. Direction SHALL be conveyed by more than color: signed values in text and arrows on the largest changes. The view covers cars only and SHALL say so, and colors only the side streets inside the study area. Street values SHALL be averages over the simulated time so far, taken for the baseline and the scenario at the same simulated time, so colors change gradually as evidence accumulates and do not blink; the legend SHALL say so.

#### Scenario: Adding the first intervention
- **WHEN** a user adds an intervention to an empty scenario
- **THEN** the map switches to the change view and the legend shows a two-sided scale with signed labels and a bar that thickens toward both ends

#### Scenario: Reading one street
- **WHEN** a user selects a street while the change view is on
- **THEN** its baseline value, scenario value and signed change are shown as text

#### Scenario: No interventions
- **WHEN** the scenario has no interventions
- **THEN** the change view is not offered and the map shows the scenario's values

#### Scenario: Small differences
- **WHEN** a street's difference is within the noise band
- **THEN** it is drawn as no change, thin and neutral gray, and a difference just beyond the band is drawn only slightly away from it

#### Scenario: Large changes
- **WHEN** a street's change, measured beyond the noise band, is at or above three quarters of the scale on the square-root scale
- **THEN** it is drawn thick in a dark (light theme) or bright (dark theme) end color with an arrow, up for an increase and down for a decrease

#### Scenario: Walking and biking
- **WHEN** the change view is on
- **THEN** the legend states that the map shows cars and the side streets inside the study area only

#### Scenario: Steady colors
- **WHEN** the run is past its first five minutes and a street carries a few vehicles an hour
- **THEN** its color changes in small steps from one update to the next and never switches between a color and gray

### Requirement: Through-route check without simulation
The UI SHALL report, without running the simulation and updated whenever the scenario changes, how many routes still let a car cross the interior of the study area between perimeter streets, SHALL let the user see those routes and the cells of mutually reachable interior streets on the map, and SHALL state that the check is a screening aid that ignores traffic volumes.

#### Scenario: Baseline
- **WHEN** the scenario has no interventions
- **THEN** the panel shows the number of through routes in today's street network

#### Scenario: Adding a filter
- **WHEN** a user adds a filter that cuts a through route
- **THEN** the count drops at once, before any simulation result changes

#### Scenario: Watertight scheme
- **WHEN** no through route remains
- **THEN** the panel says no car can cross the area on interior streets

#### Scenario: Viewing routes
- **WHEN** a user asks to see the remaining routes
- **THEN** each route is listed by the streets it uses and can be highlighted on the map

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

### Requirement: Persistent search results
The search result list SHALL stay visible after the input loses focus while the query is not empty and there are results. It SHALL close when the query is cleared, Escape is pressed or a result is chosen, and SHALL reopen when the query changes.

#### Scenario: Moving the pointer to a result
- **WHEN** a user types a query and then clicks elsewhere or moves to the list
- **THEN** the results remain listed and can be hovered or chosen

### Requirement: Proposals tab
The UI SHALL provide a Proposals tab listing the published options as one list, ordered by through cars removed an hour, largest first (ties: fewer changes, then the smaller largest all-car rise), numbered in that order. The UI SHALL enforce the order when it reads a file, whatever order the file has. A card SHALL lead with through cars an hour before and after on the area's side streets, with what the figure is (the area's side streets, the periods, the mean of how many runs) and its 95% interval. It SHALL show next the largest rise in all cars on any one side-street block, with the split into through cars and local trips and its interval, and then the list of changes, the option's variants and the controls to open it on the map, copy its link and open Where traffic goes. Everything else, including the summary in words, where the figures come from, the comparison with the next option, the through-route count, the largest rise in through cars on one block, the tables by period, the bounding streets and the figures inside the area, SHALL be under a More detail disclosure. The UI SHALL NOT place an all-traffic number beside a through-car number without naming each. The tab SHALL state that the search penalizes increases in all traffic on one block, in the details. The UI SHALL let the user open any option on the map as a scenario. A group of options computed with an earlier measure SHALL be marked out of date and list no options.

#### Scenario: Opening an option
- **WHEN** a user chooses to open a proposal
- **THEN** the map view loads that proposal's interventions as the current scenario

#### Scenario: Uncalibrated baseline
- **WHEN** the baseline's calibration status is not calibrated
- **THEN** the tab states that the proposals are exploratory and why

#### Scenario: Out-of-date proposals
- **WHEN** the proposals were computed on a different network or demand than the one loaded
- **THEN** the tab says they are out of date

#### Scenario: No proposals published
- **WHEN** no proposals file exists for the area
- **THEN** the tab explains that none have been computed yet

#### Scenario: Count in view
- **WHEN** an option is listed
- **THEN** its lead figure reads "N → M through cars an hour" with the change beside it and shows no distance unit

#### Scenario: Largest rise in all cars
- **WHEN** an option is listed
- **THEN** the card's second figure names the block with the largest rise in all cars an hour in any period, its before and after, and how much of the rise is through cars and how much is local trips

#### Scenario: Like-for-like side effect
- **WHEN** a block gains through cars beyond run-to-run variation
- **THEN** More detail reads "+N through cars an hour on <block>, the block with the largest increase" with a definition naming through cars only, both directions of that block, and the periods averaged

#### Scenario: No block gains
- **WHEN** no block gains through cars on average
- **THEN** More detail says no block gains through cars on average, names the largest change, and shows no rise

#### Scenario: Split of the extra cars
- **WHEN** the details show a block that gains all traffic beyond noise
- **THEN** the table splits its change into through cars and local trips, and a sentence says "Mostly local trips" only when local trips are at least half of the extra cars across the rows that gain

#### Scenario: Older file
- **WHEN** a group in the file reports vehicle-miles, or reports one all-traffic worst block instead of through cars
- **THEN** the tab says it is out of date and does not show its options

#### Scenario: Unsorted file
- **WHEN** a file lists its options in another order
- **THEN** the tab shows them by through cars removed, largest first, and numbers them in that order

### Requirement: Groups of proposals
The Proposals tab SHALL NOT show group headings or notes. It SHALL show the options of every group of the file as one list, sorted as the tab requires, with a package that two groups both list (the same scenario link) shown once. A status block with the computed date, the exploratory notice and the out-of-date notice SHALL appear once for each distinct provenance among the groups that list options.

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

### Requirement: Straight streets through merged junctions
Streets and the vehicles on them SHALL run straight into a merged staggered junction, without a connector zigzag, and link lengths and network topology SHALL not change.

#### Scenario: Staggered T-junctions
- **WHEN** a cross street meets a street at two offset points that the importer merged into one node
- **THEN** each leg ends on its own line near the node and vehicles follow it

### Requirement: Keyboard access to scrollable regions
Every scrollable region SHALL be reachable by keyboard, either by containing focusable content or by being focusable with an accessible name, at every layout width. The Streets table SHALL be one tab stop, with arrow keys, Page Up, Page Down, Home and End moving between rows.

#### Scenario: Tablet width
- **WHEN** the window is 768 px wide
- **THEN** no scrollable region lacks focusable content or a focusable name

#### Scenario: Tabbing through Streets
- **WHEN** a user tabs into the Streets table and presses the down arrow
- **THEN** focus moves to the next row and its block is outlined on the map, and the next Tab leaves the table

### Requirement: Revealing more rows
Choosing "Show more" in a list SHALL reveal the new rows with a short height and opacity transition (none under reduced motion), move focus to the first new row and announce how many rows appeared.

#### Scenario: Show more in Streets
- **WHEN** a user chooses "Show more" in the Streets table
- **THEN** the new rows fade in, focus is on the first of them and a polite message gives the count

### Requirement: Steady street values without interventions
The plain overlays (flow and cut-through) SHALL show each street's average over the simulated time so far, and a street that has carried traffic SHALL NOT return to the "no traffic" color during the run. The legend SHALL say the values are averages over the simulated time so far.

#### Scenario: Quiet street
- **WHEN** a street carries one vehicle every few minutes
- **THEN** its line stays drawn and changes in small steps

### Requirement: Map image export
The UI SHALL let people download the map as a PNG, and as a JPEG from the context menu, at twice the screen's pixel size when the screen is smaller. The image SHALL contain the basemap, overlay lines, vehicles, signals, intervention pictures, the study-area outline, the current legend, a caption with the area name, period, simulated time and a scenario summary, and the text "© OpenStreetMap contributors".

#### Scenario: Image contents
- **WHEN** a user downloads the map image
- **THEN** it shows what the map shows, with the legend and caption around it and the OpenStreetMap credit

### Requirement: Reaching map export
Export SHALL be available from a "Download map image" button in the playback controls and from a context menu on the map that opens with a right click, the Menu key or Shift+F10.

#### Scenario: Right-clicking the map
- **WHEN** a user right-clicks the map
- **THEN** a menu offers "Download map as PNG" and "Download map as JPEG" and the browser's own menu does not appear

#### Scenario: Keyboard
- **WHEN** a user focuses the map and presses Shift+F10 or the Menu key
- **THEN** the same menu opens with its first item focused, arrow keys move between items, Escape closes it and focus returns to the map

#### Scenario: Elsewhere on the page
- **WHEN** a user right-clicks anywhere other than the map surface
- **THEN** the browser's own context menu appears

#### Scenario: Announcing the result
- **WHEN** a download starts or fails
- **THEN** a polite message says which

### Requirement: Cut-through results
The Results panel SHALL show cut-through as "Cut-through vehicles" in veh/h for baseline and scenario with the difference, defined as trips with neither end inside the study area that use at least one residential or service street inside it, counted once each. Distance units SHALL NOT appear in user-facing copy. A secondary row MAY show the through share of side-street driving, labeled so that it does not read as the headline.

#### Scenario: Comparing a scenario
- **WHEN** a scenario has run
- **THEN** the cut-through card shows vehicles per hour for baseline and scenario, the change, and the definition

### Requirement: Hover readout of the legend metric
Hovering a street on the map SHALL show, under the block's name, the metric the legend shows once and then one row per direction of the block, each with a color swatch, the value with unit and the direction, for the legend's current overlay and view. Each line's value SHALL belong to its own direction, and each line SHALL name its direction when the block has two. The metric and value SHALL be text, the swatch SHALL be decorative with a border that keeps 3:1 contrast, and the line SHALL update as statistics update.

#### Scenario: Hovering a street while flow is shown
- **WHEN** a user hovers a street and the legend shows flow
- **THEN** the line reads "All cars on this block: N cars an hour" with a swatch in the color the map draws for that street

#### Scenario: Hovering in the change view
- **WHEN** a user hovers a street in the change view
- **THEN** the line shows the baseline value, the scenario value and the signed change, with a swatch from the diverging ramp

#### Scenario: Before statistics exist
- **WHEN** a user hovers a street before the run has produced statistics
- **THEN** the line reads "No data yet" and shows no number

#### Scenario: Swatch matches the map
- **WHEN** a user hovers a street with no traffic, or a change inside the noise band
- **THEN** the swatch is the color the map draws, in the current theme: the ramp's lowest color for no traffic, neutral gray for a change inside the band

#### Scenario: Street outside the measured set
- **WHEN** a user hovers or selects a bounding street or a street outside the study area
- **THEN** the label reads "Outside the study area: not measured" and no value is shown

#### Scenario: Two-way block
- **WHEN** a user hovers a two-way block
- **THEN** two lines show, one per direction, each with its own swatch and value and naming its direction, for example "toward Elm St"

### Requirement: Modal filters show what they close
The map SHALL mark every street a modal filter closes to through cars, and only those streets, with a short bar drawn across the road at a right angle to it, by shape and pattern as well as color, and SHALL draw no sign picture for a modal filter. Bars SHALL be map features centered on their street at a geographic point, sized from the drawn road with a minimum size so they are legible at every zoom. A leg's bar SHALL sit 8 m along its street from where the leg begins at every zoom, so zoomed out the bars of a junction overlap into one compact mark no wider than about 22 CSS px at the fitted overview. Each filter SHALL keep an invisible control of at least 24 by 24 CSS px at its location that is reachable by keyboard, has a visible focus ring and the filter's description as its name, and selects the filter when activated; clicking a bar SHALL select its filter. The Scenario list, selection pop-up and tooltip SHALL say in words which legs are closed.

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
- **THEN** one bar crosses the block at its midpoint, with no sign picture and no tape along the block, and the text names the block

#### Scenario: Zooming out
- **WHEN** the map is at the fitted overview
- **THEN** every bar is visible at its minimum size, across its own street at its fixed place, and a junction's bars form one compact mark

#### Scenario: Selecting a filter
- **WHEN** a person clicks a bar, or tabs to the filter's control and presses Enter
- **THEN** the filter's intersection or block is selected, where it can be removed

#### Scenario: Exported image
- **WHEN** the map is exported at any zoom
- **THEN** the bars in the image have the sizes and places they have on screen

### Requirement: Why cars cut through
The Results panel SHALL show one row per intent plus Other, each with a text basis badge, baseline and scenario cars an hour and the change, rows adding to the through-car total. A short paragraph SHALL say these are hypotheses and a link, "About these reasons", SHALL open the Assumptions tab at the section that lists each reason.

#### Scenario: Rows add up
- **WHEN** the panel shows a run
- **THEN** the rows sum to the through cars shown in the card above

#### Scenario: About these reasons
- **WHEN** a person follows the link
- **THEN** the Assumptions tab opens at "Why cars cut through"

### Requirement: Intent highlight on the map
Selecting a row (a button with `aria-pressed`) SHALL draw that intent's typical path with line width by cars an hour and give a text summary of it. A control SHALL turn the highlight off.

#### Scenario: Highlight
- **WHEN** a reason is selected
- **THEN** its heaviest links are drawn and described, and pressing the button again clears them

### Requirement: Filter choices at an intersection
At an intersection the action menu SHALL offer a modal filter on the whole intersection and, where closing one street leaves at least two other legs connected, a filter on each street. Each choice SHALL preview the legs it closes in text and SHALL be operable by keyboard.

#### Scenario: Consolidated junction
- **WHEN** the person selects a junction the importer merged from several nodes, such as Ayala Avenue and Martin Street
- **THEN** "Filter Martin Street here" and "Filter Ayala Avenue here" are listed before "Filter the whole intersection", the list starts open, each choice shows the legs it closes, and a line says the junction combines the streets and a street filter closes only that street

#### Scenario: Plain intersection
- **WHEN** the person selects an ordinary four-way intersection
- **THEN** the whole-intersection choice is listed first, followed by one choice per street

#### Scenario: Already placed
- **WHEN** a filter on one street is in the scenario
- **THEN** that street is no longer offered, and adding the whole-intersection filter replaces the street filters at that intersection

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

### Requirement: Stored result for a shared scenario
When the page opens with a scenario, or the scenario, period or demand changes, and a stored result exists for exactly that scenario, period and 100% demand whose network hash, demand hash and simulator fingerprint all match what the app has loaded, the app SHALL show that result's finished state at once instead of running. The result SHALL stop applying the moment the scenario, period or demand changes. "Run again" SHALL start a live simulation from zero.

#### Scenario: Link to a published proposal
- **WHEN** a user opens a link to a published proposal's scenario and period
- **THEN** the finished state shows within moments, without waiting for the simulation to build

#### Scenario: Changing period
- **WHEN** the user changes the period and a stored result exists for the new period
- **THEN** that period's stored result is shown

#### Scenario: Anything else changes
- **WHEN** the user changes the scenario or the demand level so that no stored result applies
- **THEN** the stored result stops showing at once and a live run starts as before

#### Scenario: Stored inputs differ
- **WHEN** a stored result's network hash, demand hash or simulator fingerprint differs from what the app has loaded, or the app runs on the mock engine
- **THEN** the result is ignored and the app runs live

### Requirement: What a stored result shows
A stored result SHALL show the clock at 1:00:00, Results marked as covering the full hour, the map layers and the "Why cars cut through" numbers filled from the stored values, and the play control reading "Run again". A visible note and the status region SHALL say that this is the stored result of the simulation and that Run again watches it. Cars and signals SHALL NOT be drawn.

#### Scenario: Run again
- **WHEN** the user chooses Run again on a stored result
- **THEN** the stored note goes away, the clock restarts from 0:00, cars are drawn, and running to the end gives the same headline numbers

### Requirement: Running to the end for a link without a stored result
When the page is opened from a link that carries a scenario (or a scenario is opened from the Proposals page) and no valid stored result exists, the app SHALL set the speed to Max and run to the end of the hour, saying "Running to the end of the hour", then show the finished state. Visitors' scenarios SHALL NOT be stored on a server. A link without a scenario SHALL behave as before: 20x and running.

#### Scenario: Link to an unpublished scenario
- **WHEN** a user opens a link whose scenario is not a published proposal
- **THEN** the run starts at Max, results are withheld while it runs, and the finished state appears at the end of the hour

#### Scenario: No scenario
- **WHEN** a user opens the site without a scenario
- **THEN** the simulation starts at 20x as before

### Requirement: Links name their period
A scenario link that carries interventions SHALL name its period. A link without a period SHALL open on the area's default period. Opening a proposal on the map SHALL set the proposal's period (the period of its picture, else the one in its link) and a demand level of 100%.

#### Scenario: Open on the map
- **WHEN** the user opens a proposal from the Proposals page
- **THEN** the map shows its stored result for the picture's period

### Requirement: Picture stands on its own when shared
The picture's JPEG SHALL carry the proposal's title, its list of changes, the period it shows with its hours, the legend with numbers and the cues that are not color (the barrier bar, the outlined block), the through cars on all side streets for the picture's period before and after with the percent change, and, when more than one period was searched, the same for the card's average, a note that the figures are a simulation result with the area's calibration status, the area name, the OpenStreetMap attribution, the site address and a QR code, with a short label, that opens the proposal on the map. The title SHALL carry no number. The QR code SHALL encode the absolute link, use error correction M or higher, keep a quiet zone of 4 modules, draw dark modules on white in either theme and take at least 3 px a module in the file, without covering the map, legend or text. No text SHALL overlap or run past the edge, at any number of changes.

#### Scenario: Saved and sent
- **WHEN** a person saves the picture or follows Download image
- **THEN** the file is the same JPEG, named for the area, the proposal and the period, and shows everything above

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

### Requirement: Streets view on phones
On phones (viewport under 720 px) the Streets tab SHALL be a full-height list with no map and no bottom sheet, each street block a card with a labeled grid of figures and a "Show on map" button that opens the Map tab with that block selected. A "Sort by" menu with a direction button of at least 24 by 24 CSS px SHALL replace header sort buttons, the table SHALL keep its caption and headers for assistive technology, and the page SHALL NOT scroll horizontally.

#### Scenario: Reading the list on a phone
- **WHEN** a user opens Streets on a 412 px wide screen
- **THEN** no map or sheet is drawn, the first card's name is readable in full, and the last card can be scrolled fully into view

#### Scenario: Show on map
- **WHEN** a user chooses "Show on map" on a card
- **THEN** the Map tab opens with that block selected

### Requirement: Streets table columns
Headers in the Streets table SHALL carry units ("All cars, cars an hour", "Through cars, cars an hour"), SHALL NOT wrap, and SHALL NOT overlap or clip the rows beneath them. The Scenario and Change columns SHALL appear only when a scenario can be compared with the baseline; without one the table SHALL say "Add a change on the Map tab to compare." Figures SHALL show a dash, not zero, while a run's results are withheld.

#### Scenario: No scenario
- **WHEN** no intervention has been added
- **THEN** the table lists base figures only and carries the note, with no columns of dashes

### Requirement: Assumptions tab
The app SHALL have a top-level Assumptions tab between Methodology and Sources. It SHALL open by saying its contents are the judgment calls in the model, the parts that rest on reasoning and not on a count, that they are the first things to question and that changing them would change the results, and it SHALL link to Sources for the measured inputs.

#### Scenario: Tab order
- **WHEN** the navigation is read in order
- **THEN** it lists Map, Proposals, Streets, Methodology, Assumptions, Sources, and all six fit on a phone without a horizontal page scroll

#### Scenario: Pointer from Sources
- **WHEN** a person opens Sources
- **THEN** a line says the judgment calls are on the Assumptions tab and links to it, and the assumed-movement provenance entry is not listed there

### Requirement: Assumed movement flows table
The Assumptions tab SHALL explain in one short paragraph what an assumed movement is, why it exists and what its trips do when a change blocks the turn. It SHALL show one card per movement, with the turn in plain words, counted cars an hour per period (a period without a count marked scaled), cars an hour assigned, how many are through cars, and who the cars are assumed to be with their shares. Cards SHALL sit in a two-column grid on wide screens and one column on phones, with the same figures in the same positions on every card.

#### Scenario: Counted and assumed are distinguishable
- **WHEN** a person reads the cards
- **THEN** the counted figures, the scaled midday figure and the assumed figures are labeled as such in text

#### Scenario: Numbers come from data
- **WHEN** the cards are built
- **THEN** their figures are read from a generated file made from the demand config and fit report, and the page says when that file was made for a different demand file than the one loaded

#### Scenario: Who the cars are on a phone
- **WHEN** the screen is narrower than 720 px
- **THEN** each card's "who the cars are assumed to be" list is collapsed behind a disclosure, and it is open on wider screens

#### Scenario: Wording
- **WHEN** any user-facing text is searched
- **THEN** the word "owner" does not appear

### Requirement: Reason cards
The Assumptions tab SHALL show one card per demand intent under "Why cars cut through": its label, its basis in text (Observed counts or Assumed), its note, the arterial it bypasses and the baseline through cars an hour for each period. Cards SHALL stack one per row on phones and sit two or three per row on wide screens.

#### Scenario: Cards from a matching baseline
- **WHEN** the stored baseline's network hash, demand hash and simulator fingerprint match what is loaded
- **THEN** each card shows its cars an hour per period and its map

#### Scenario: Missing or stale baseline
- **WHEN** the stored baseline is absent or was made for other inputs
- **THEN** the cards show their text and a short note, with no empty map space

### Requirement: Reason maps
Each reason card SHALL show a static map of that reason's typical path in the baseline of the default period, and say so. The map SHALL show the study area outline, quiet streets and the boundary street names, the path as the live highlight's dashed violet line with width by cars an hour, arrowheads for direction and labeled start and end, with an img role, a text alternative, and the OpenStreetMap attribution, in light and dark themes.

#### Scenario: Map matches its text
- **WHEN** a card shows a map
- **THEN** the one-sentence description under it is the one the Results panel gives for the same path, and the arrows agree with it

### Requirement: Restarts never show the old run
After a period, demand, scenario or reset change, the UI SHALL show no report from the previous configuration, and the new run SHALL start from zero.

#### Scenario: Period changed after a finished run
- **WHEN** a run has finished and the user chooses another period
- **THEN** the clock reads 0:00:00, the old results are not shown as the new period's full hour, and the new run plays

### Requirement: Cut-through is colored per block
The cut-through and change-in-cut-through layers SHALL color a block from both directions added together, with a dead band of 7.5 and a top of 100 cars an hour, and both directions SHALL be drawn in the same color. Flow and speed SHALL stay per direction. The legend SHALL say which, and hovering SHALL list each direction and the block total.

#### Scenario: Two directions of one block
- **WHEN** a block carries 60 and 40 through cars an hour in its two directions
- **THEN** both directions are drawn in the color for 100, and the hover lists 60, 40 and "both directions" 100

### Requirement: Early figures are labeled
While an unfinished run has covered under five simulated minutes, every rate shown SHALL carry the text label "Early, noisy" or the early note.

#### Scenario: No scenario, first minutes
- **WHEN** a run has covered two simulated minutes
- **THEN** Results, Streets, the map hover and the reasons card show the early label

### Requirement: Scenario links apply fully
Opening a scenario link in an open tab SHALL apply its period and demand as well as its interventions.

#### Scenario: Link with a period
- **WHEN** the address changes to a link naming the midday period and 120% demand
- **THEN** the period and demand switch to those values and the address keeps them

### Requirement: Safe stored results
A stored result that fails validation (encoding, lengths, metrics shape) SHALL be ignored, falling back to a live run. A stored result that arrives after the user started a run SHALL NOT replace it. A link scenario on the synthetic fixture SHALL start running. An error at the app root SHALL show a plain recovery message.

#### Scenario: Damaged file
- **WHEN** a stored result has link statistics of the wrong length
- **THEN** the app runs live and shows no error

### Requirement: Reasons card announcements
The reasons card SHALL announce only when a reason is chosen or cleared. Changing figures SHALL stay out of live regions, and the path sentence SHALL keep a stable order while the run plays.

#### Scenario: Run in progress
- **WHEN** a reason is selected during a run
- **THEN** one short status is announced, and the figures do not re-announce each second

### Requirement: Legend keys
The on-screen legend and the exported map image SHALL include keys for filter bars, diverters, intervention pictures, speed-limit signs and the reason line when they are drawn, and SHALL list no cars when none are drawn. Each picture key SHALL name the picture in words and say what it means, and SHALL appear only for the variants present.

#### Scenario: Stored result export
- **WHEN** a stored result is exported
- **THEN** the key row has no "Cars" entry

#### Scenario: Keys in words
- **WHEN** a scenario holds a turn ban
- **THEN** the key reads "Turn arrow in a red slashed circle: turn banned" and shows no letters

### Requirement: Assumed movement maps
Each assumed movement card SHALL carry a static map of its turn: muted streets and the study area's outline around the junction, the approach and exit links highlighted, a curved arrow from the approach into the exit that bends the way the cars turn, a numbered marker at the junction and both streets named with their direction. Each map SHALL be an image whose text alternative states the turn in words.

#### Scenario: Left and right
- **WHEN** a movement turns left, or right
- **THEN** its arrow curves left, or right, from the approach into the exit

#### Scenario: Not by color alone
- **WHEN** the highlight color is ignored
- **THEN** the arrow, the street names with direction words and the number still say which turn the map shows

#### Scenario: Data without map fields
- **WHEN** the assumptions file has no link ids for the movements
- **THEN** the cards show their figures without maps or subheadings and the overview is omitted

#### Scenario: Link ids
- **WHEN** `npm run data:assumptions` runs
- **THEN** each movement carries its approach link, exit link and junction node, and neither the demand file nor the network file is written

### Requirement: Assumed movement overview
The section SHALL open with an overview map that shows every assumed turn as a marker with its card's number, and the cards SHALL be grouped under a subheading naming the pair of streets the turns connect.

#### Scenario: Numbers match
- **WHEN** a person finds marker 6 on the overview
- **THEN** card 6 describes the turn at that junction

### Requirement: Reasons are grouped under headings and ramp reasons mark the ramp
The results panel and the Assumptions tab SHALL list the reasons under the section headings of the demand, in its order. For a reason keyed by a ramp, the live map and the card's map SHALL mark the ramp with a labeled point beside the path, and the point SHALL be a shape with a text label so that color is not the only signal. Each card SHALL say where its cars mostly start (on-ramp reasons) or are bound (off-ramp reasons) when the stored baseline carries those shares.

#### Scenario: Three headings
- **WHEN** the demand's reasons belong to three sections
- **THEN** the table and the cards show the three headings above their reasons

#### Scenario: A ramp reason on the map
- **WHEN** a person chooses the reason for one on-ramp
- **THEN** the map shows the path and a labeled point at the ramp, and the panel names the ramp

### Requirement: Tab URLs
The path SHALL name the tab: `/` is the Map, and `/proposals`, `/streets`, `/methodology`, `/assumptions` and `/sources` are the others, each derived from the tab's id. Loading any of those paths SHALL open that tab. A path that names no tab SHALL open the Map and the address SHALL be corrected to `/`.

#### Scenario: Direct load
- **WHEN** a person opens `/assumptions` directly
- **THEN** the Assumptions tab is open, its link is marked as the current page and the title starts with "Assumptions"

#### Scenario: Unknown path
- **WHEN** a person opens `/nope`
- **THEN** the Map is open and the address reads `/`

### Requirement: Tab links
The tabs SHALL be links to their paths. A plain click SHALL stay in the page and add a history entry, so Back and Forward move between tabs; a click with a modifier key or another button SHALL be left to the browser. The current tab's link SHALL carry `aria-current="page"`.

#### Scenario: Back and Forward
- **WHEN** a person opens Proposals, then Streets, then presses Back
- **THEN** Proposals is open and the address is `/proposals`; Forward returns to Streets

#### Scenario: Open in a new tab
- **WHEN** a person middle-clicks the Sources link
- **THEN** the browser opens `/sources` in a new tab and the current page does not change

### Requirement: Document title
The document title SHALL name the tab and the area, as in "Proposals · Traffic: Rockridge Trapezoid", and SHALL change with the tab.

#### Scenario: Title follows the tab
- **WHEN** a person moves from the Map to Sources
- **THEN** the title changes from "Map · Traffic: Rockridge Trapezoid" to "Sources · Traffic: Rockridge Trapezoid"

### Requirement: Fragment is the scenario or a section anchor
A fragment that is `#v1` or begins `#v1;` SHALL be a scenario on any tab path, and existing links, QR codes and stored-result keys SHALL work unchanged on `/` and on every tab path. Any other non-empty fragment SHALL be a section anchor on the current tab, and SHALL NOT be reported as a scenario that could not be read. A URL whose fragment is an anchor SHALL open with no scenario.

#### Scenario: Scenario on another tab
- **WHEN** a person opens `/streets#v1;a=rockridge;s=…`
- **THEN** the Streets tab opens with that scenario applied, and switching to Sources and then Map keeps the scenario fragment in the address

#### Scenario: Old link
- **WHEN** a person opens `/#v1;a=rockridge;s=…`
- **THEN** the Map opens with the scenario, as before

#### Scenario: Anchor does not read as a bad link
- **WHEN** a person opens `/assumptions#why-cars-cut-through`
- **THEN** no "link couldn't be read" notice appears and the baseline is shown on the Map tab

### Requirement: The scenario survives navigation
Switching tabs SHALL keep the scenario fragment in the address whenever a scenario exists. Following an anchor link SHALL replace the fragment with the anchor while the scenario stays in the app, and the scenario fragment SHALL return when the person goes to a tab without an anchor or changes the scenario. Back and Forward between tabs SHALL NOT replace the scenario the app holds with one read from an older history entry.

#### Scenario: Back after an anchor
- **WHEN** a person with a scenario follows an anchor link on Sources and presses Back
- **THEN** the scenario fragment is in the address again and the scenario is unchanged

### Requirement: Section anchors
Every section heading on the Proposals, Assumptions, Sources and Streets tabs SHALL have an id that is a slug of its heading or a data id, unique on the page and stable across reloads and data rebuilds. A proposal card SHALL use its group's id and the proposal's id, a reason card its reason id, a movement card its movement id and a source its citation key. Ids used before this change (`ref-intents`, `ref-movements`, `ref-calibration`, `ref-<citation key>`) SHALL still reach their sections.

#### Scenario: Old id
- **WHEN** a person opens `/assumptions#ref-intents`
- **THEN** the address is corrected to `#why-cars-cut-through` and that section is shown

### Requirement: Opening an anchor
Opening a URL with an anchor SHALL wait for the section to render, scroll its heading to the top of the view below the top bar, respecting `prefers-reduced-motion`, and move focus to the heading. Scrolling SHALL stop when the person scrolls, types or touches the page.

#### Scenario: Cold load on a reason
- **WHEN** a person opens `/assumptions#reason-<id>` on a phone
- **THEN** that reason's heading is in view below the top bar and holds focus

#### Scenario: Cold load on a proposal
- **WHEN** a person opens `/proposals#<group>-<proposal>` before the proposals file has loaded
- **THEN** the page scrolls to that card once it renders

### Requirement: Anchor link control
Each anchored heading SHALL have a link control, named "Link to this section: <heading>", at least 24 by 24 CSS px, shown on hover and focus and always shown on devices without hover. It SHALL set the address to the section, copy the full URL to the clipboard and say "Link copied" in a polite status region. The control SHALL be reachable by keyboard with a visible focus indicator and SHALL NOT shift the layout when it appears.

#### Scenario: Copying a section link
- **WHEN** a person presses the control beside a heading
- **THEN** the address reads `<tab path>#<id>`, the clipboard holds the full URL and "Link copied" is announced

### Requirement: Internal links use tab URLs
"About these reasons" SHALL link to `/assumptions#why-cars-cut-through`, citations in Results to `/sources#<key>`, the Sources and Assumptions pointers to each other's paths, and the calibration banner's "Details" to `/sources#calibration`. "Copy link to this scenario" SHALL copy the current tab's path with the scenario fragment. The proposal image's QR code and short URL SHALL still point at `/` with the scenario fragment.

#### Scenario: Copy link on Streets
- **WHEN** a person copies the scenario link on the Streets tab
- **THEN** the copied address is `/streets` followed by the scenario fragment

### Requirement: Tab paths are served as the app
A direct request for a tab path SHALL return the app with status 200, and so SHALL any other path that is not under `/api/` or `/data/`, after which the app shows the Map and corrects the address. A missing file under `/data/` SHALL still return a 404 JSON body.

#### Scenario: Request for /proposals
- **WHEN** a browser requests `/proposals`
- **THEN** the response is the app page with status 200

### Requirement: Assumptions section order and headings
The Assumptions tab SHALL list "Why cars cut through" before "Assumed movement flows", and "Targets derived from daily totals", when the data lists any, after both. Each of those section headings SHALL stay visible just under the top bar while its section scrolls, with an opaque themed background, and SHALL release when the next section's heading arrives. Anchors and focused controls SHALL NOT be hidden under the heading. Street-pair subheadings SHALL NOT be sticky.

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

### Requirement: Share paths for published proposals
Every published proposal SHALL have a stable path `/p/<slug>` that does not depend on its position in the file. Opening it SHALL open the Map with the proposal's scenario and period as its scenario link does, and an unknown slug SHALL open the Proposals tab with a notice that the proposal is no longer published. Cards, the picture's QR code and the Map's "Copy link to this scenario" for a scenario equal to a published proposal SHALL give the share path.

#### Scenario: Opening a share path
- **WHEN** a person opens `/p/<slug>` of a published proposal
- **THEN** the Map shows that proposal's interventions in its period and the address bar shows the scenario link

#### Scenario: Retired slug
- **WHEN** a person opens a slug that is not in the proposals file
- **THEN** the Proposals tab opens with "That proposal is no longer published."

### Requirement: Link previews
The server SHALL return, for `/`, each tab path and `/p/<slug>`, the app page with a title, description, canonical link, Open Graph tags and a large Twitter card for that path, with an absolute image URL of a 1200x630 JPEG.

#### Scenario: Proposal preview
- **WHEN** a crawler requests a published `/p/<slug>`
- **THEN** the HTML carries the proposal's title, description and card image, with all index text escaped

### Requirement: Previews state what the figures are
A proposal's preview SHALL state its like-for-like through-car figure, its changes and that it is a simulation, not a forecast, and show its map. It SHALL NOT present uncalibrated results as validated, and none SHALL be written for a group computed on inputs other than those now served.

#### Scenario: Stale group
- **WHEN** a group was computed on another network or demand
- **THEN** no card is written for its proposals and the generator lists them as skipped

### Requirement: Variants on the card
A card whose option has variants SHALL list them under its changes in plain text, with a control on each that opens the variant on the map. A variant SHALL NOT be drawn in the card's picture, the exported image or the preview card.

#### Scenario: A variant line
- **WHEN** a variant has figures
- **THEN** its line says what differs from the option and its through cars an hour before and after with the runs behind them

#### Scenario: Three or fewer
- **WHEN** an option has three variants
- **THEN** all three are visible without opening anything

#### Scenario: More than three
- **WHEN** an option has five variants
- **THEN** three are visible and "2 more variants" opens the rest

#### Scenario: Replacing the person's scenario
- **WHEN** a person who has built a scenario opens a variant
- **THEN** the card asks whether to replace it, and focus returns to the control if they cancel

#### Scenario: Unreadable variant
- **WHEN** a variant in the file has no link or no description
- **THEN** it is left out and the option's other variants stay

### Requirement: Measured streets only
Metrics SHALL apply only to the residential and service streets inside the study area. The map shading, hover and tap values, legend, Streets table, Results cards, text pages and headless report SHALL list and color those streets only and SHALL say so in text. The code SHALL decide this from the link's `inStudyArea` flag and class, not from street names.

#### Scenario: Reading the map
- **WHEN** a user views any map mode
- **THEN** only side streets inside the study area are colored by the ramp, and the legend names them

#### Scenario: Bounding streets
- **WHEN** a user views the map
- **THEN** bounding streets and everything outside the study area are drawn as plain context, with intervention markers still shown, and carry no figure

#### Scenario: Streets table
- **WHEN** a user opens the Streets tab
- **THEN** every row is a side-street block inside the study area, and the intro says streets outside it are not measured

### Requirement: Context streets differ from streets with no traffic
Streets that are not measured SHALL be drawn as a thin dashed line lighter than the basemap street, with no casing and no ramp color. A measured street with no traffic SHALL take the ramp's lowest color, thin, with a casing. The difference SHALL not rest on color alone, and SHALL hold in light and dark themes.

#### Scenario: Quiet side street beside a bounding street
- **WHEN** a side street with no traffic meets a bounding street
- **THEN** the side street shows a casing in the ramp's lowest color and the bounding street shows a dashed context line

### Requirement: Whole-network figures are not shown
The app, the text pages and the docs SHALL NOT show figures that cover the whole simulated network, such as trip times, delay, trip counts, walking and biking indicators and network counts. An oversaturated run SHALL get one sentence of caution without counts.

#### Scenario: Results after adding a modal filter
- **WHEN** a scenario with a modal filter has run for the comparison window
- **THEN** Results show the through-traffic and close-following conflict cards and a note that bounding streets and outside are not measured

#### Scenario: Net change away from the side streets
- **WHEN** Where traffic goes lists net all-car change by block
- **THEN** it lists side-street blocks inside the study area and one row, "Bounding streets and outside", with the net change on every other street

### Requirement: Methodology tab
The app SHALL have a top-level Methodology tab at `/methodology`, between Streets and Assumptions. It SHALL explain in plain language, in about 450 to 650 words and with no equations, how the simulation and its proposals are made and what the results cannot tell you. It SHALL name the study area and read the calibration status and note from the area data, stating no calibration figure of its own.

#### Scenario: Direct load
- **WHEN** a person opens `/methodology`
- **THEN** the Methodology tab is open and its sections have anchors named after their headings

#### Scenario: Calibration status is read, not written
- **WHEN** the area's calibration status or note changes
- **THEN** the Checking the model section shows the new status and note with no change to the page's copy

#### Scenario: Diagrams
- **WHEN** the page is read
- **THEN** it has three inline SVG diagrams (a four-step pipeline, a schematic of three trips against the study area, a five-step flow), each with `role="img"`, a title and description and the same information in the text beside it, drawn in theme colors with the trips told apart by line style as well as color, with no animation

#### Scenario: Phone
- **WHEN** the page is opened on a phone
- **THEN** the diagrams stack, nothing scrolls sideways and the tab row still scrolls

#### Scenario: Text page
- **WHEN** the text pages are generated
- **THEN** `/methodology.md` carries the same copy and the diagrams' descriptions, and `llms.txt` links it

### Requirement: Objective tags on proposal cards
A proposal card SHALL show a tag row under the title, "Best for: " followed by the objectives the option is best for, in the order most cut-through removed, no street closures, least detour for residents, fewest changes. An option with no tags SHALL show no row. The text pages and the link-preview text SHALL carry the same words.

#### Scenario: Tags
- **WHEN** an option is the best for two objectives
- **THEN** its card shows both after "Best for:"

#### Scenario: Older file
- **WHEN** a file has no objectives
- **THEN** the card shows no tag row

### Requirement: Residents' detour on proposal cards
A proposal card SHALL show residents' detour as seconds per resident trip with its interval. The Methodology page SHALL say in one plain sentence that options are chosen for different goals and tagged.

#### Scenario: Detour line
- **WHEN** an option has a recorded detour
- **THEN** its card shows seconds per resident trip and the interval over runs

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
- **THEN** the hover says the redirect data is not available, says why when it is out of date, and offers the Where traffic goes view

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

### Requirement: Intervention pictures
Every surface that marks an intervention SHALL mark a control change, a signal timing change, a speed hump, a traffic circle, a one-way street and a turn ban with a small sign-style picture, never with letters, each different in shape and pattern and drawn from the same shape data. A turn ban SHALL show a left, right or U-turn arrow from the geometry of its two links. A picture SHALL never cover a published change number in a proposal's picture. Marks keep their text alternatives, keyboard operation and visible focus.

#### Scenario: Which picture
- **WHEN** interventions are drawn
- **THEN** a two-way stop is a stop sign, an all-way stop the same sign with an ALL plaque, a signal a traffic light, an uncontrolled intersection a gray stop sign with a slash, signal timing a traffic light with a clock, a speed hump a yellow diamond with a bump, a traffic circle (or a control that becomes one) a blue disc with circling arrows, a one-way street a black sign with a white arrow, and a turn ban a left-turn, right-turn or U-turn arrow in a red slashed circle

#### Scenario: Control variants
- **WHEN** a scenario holds an all-way stop and a signal
- **THEN** the map shows a stop sign with an ALL plaque and a traffic light, and the legend lists those two pictures and no other control picture

#### Scenario: One-way direction
- **WHEN** a one-way street is placed on a street running north to south
- **THEN** its sign points south along the street

#### Scenario: Turn side
- **WHEN** a turn ban turns from a link onto a link on its right
- **THEN** its picture and its key show a right-turn arrow

#### Scenario: Number stays visible
- **WHEN** a one-way sign sits on the block whose change number a proposal's picture prints
- **THEN** the number is placed where the sign does not cover it

### Requirement: Menu choice pictures
The menu that opens when a street or intersection is selected SHALL show, beside each choice that places a mark, the picture of that mark, in a fixed-width column so the labels line up. The pictures SHALL be decorative: each choice's text stays its accessible name, and its keyboard operation and focus ring stay as they were.

#### Scenario: Which pictures
- **WHEN** the menu lists choices
- **THEN** a modal filter shows the bar, a diverter the striped line, a speed limit or Slow Street the speed-limit sign, a control choice the picture of the control it sets, a turn ban the side it turns, and every other choice its sign picture

#### Scenario: Control choices
- **WHEN** a person opens "Change control" at an intersection
- **THEN** each choice shows its own sign beside its text, with the labels aligned in one column

#### Scenario: Phone width
- **WHEN** the menu is open as a sheet on a phone
- **THEN** the pictures and labels fit without horizontal scrolling

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
