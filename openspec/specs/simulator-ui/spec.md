# simulator-ui Specification

## Purpose
What the web interface shows and lets people do: watch traffic, edit a scenario, compare it with the baseline and share it.

## Requirements

### Requirement: Live traffic map
The UI SHALL show the study area's streets with moving vehicles, signal states and a per-street overlay selectable between flow, speed and cut-through volume, with OpenStreetMap attribution.

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
- **THEN** cut-through, safety and delay metrics show baseline, scenario and difference

### Requirement: Accessibility
The UI SHALL meet WCAG 2.2 AA: full keyboard operation with visible focus, labeled controls, 4.5:1 text contrast in light and dark themes, color never the sole carrier of meaning, and a text/table alternative for information shown only on the map.

#### Scenario: Screen reader user
- **WHEN** a screen reader user explores results
- **THEN** a table lists streets with their flow, speed and cut-through values and metric updates are announced politely

### Requirement: Sources visible
The UI SHALL provide a page listing the research references and data sources behind the model, and a pointer to the Assumptions tab for the judgment calls.

#### Scenario: Viewing sources
- **WHEN** a user opens "Sources"
- **THEN** they see the bibliography and data provenance with links, and a line pointing to the Assumptions tab

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

### Requirement: Results by mode
Results SHALL show, for baseline and scenario, safety indicators for people walking and biking, pedestrian crossing delay and per-mode trip times, with the change stated in words and the surrogate-indicator caveat visible.

#### Scenario: After adding a modal filter
- **WHEN** a scenario with a modal filter has run for the comparison window
- **THEN** the results show how conflicts with pedestrians and cyclists changed

### Requirement: Assumed volumes are stated
The UI SHALL state that walking and biking volumes are assumptions wherever their metrics appear.

#### Scenario: Viewing walking results
- **WHEN** a user views pedestrian metrics
- **THEN** a note says the walking volumes are assumed, not counted

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
When a scenario has interventions, the map SHALL be able to color each street by the difference between the scenario and the baseline for the selected metric, on a fixed two-sided scale centered on no change. Size of change SHALL show as line thickness, thin near zero and thick at both ends, and as color intensity on a blue-orange diverging ramp whose non-zero steps keep 3:1 contrast against the basemap in both themes. Direction SHALL be conveyed by more than color: signed values in text and arrows on the largest changes. The view covers cars only and SHALL say so. Street values SHALL be averages over the simulated time so far, taken for the baseline and the scenario at the same simulated time, so colors change gradually as evidence accumulates and do not blink; the legend SHALL say so.

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
- **THEN** the legend states that the map shows cars and points to the area-wide walking and biking results, because the simulator reports those only for the whole area

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
The UI SHALL provide a Proposals tab listing the published options in order from fewest interventions to greatest reduction, each with its title, description, interventions, and two like-for-like figures: the reduction in through cars an hour across the area's side streets, as a count first and a percentage second, and the through cars an hour gained on the side-street block that gains the most, averaged over the same periods. Each figure SHALL carry a plain definition of what is counted, where and over which periods. The UI SHALL NOT place an all-traffic number beside a through-car number without naming each, and SHALL show all-traffic changes only in the option's details, in a table titled "All traffic on side-street blocks (through and local trips together)" with a row per period labeled with that period. The tab SHALL state that the search penalizes increases in all traffic on one block. The UI SHALL let the user open any option on the map as a scenario. A group of options computed with an earlier measure SHALL be marked out of date and list no options.

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
- **THEN** it reads "N → M through cars an hour" and shows no distance unit

#### Scenario: Like-for-like side effect
- **WHEN** a block gains through cars beyond run-to-run variation
- **THEN** the card reads "+N through cars an hour on <block>, the block that gains the most" with a definition naming through cars only, both directions of that block, and the periods averaged

#### Scenario: No block gains
- **WHEN** no block gains through cars beyond run-to-run variation
- **THEN** the card says "No block gains through traffic beyond run-to-run variation" and shows no number

#### Scenario: Split of the extra cars
- **WHEN** the details show a block that gains all traffic beyond noise
- **THEN** the table splits its change into through cars and local trips, and a sentence says "Mostly local trips" only when local trips are at least half of the extra cars across the rows that gain

#### Scenario: Older file
- **WHEN** a group in the file reports vehicle-miles, or reports one all-traffic worst block instead of through cars
- **THEN** the tab says it is out of date and does not show its options

### Requirement: Groups of proposals
The Proposals tab SHALL show each group of the proposals file under its own heading and plain-language note, in file order. Each group SHALL have its own ranked list, computed date, exploratory notice and out-of-date notice.

#### Scenario: Two groups
- **WHEN** the file holds a group of packages that follow the 2025 neighborhood pilot's limits and a group without limits
- **THEN** the tab lists the first group, then the second, each with its heading and note

#### Scenario: Empty group
- **WHEN** a group holds no options
- **THEN** its heading and note appear with a message that none were found under those limits

#### Scenario: Earlier file format
- **WHEN** the file has one list and no groups
- **THEN** the tab shows it as a single group without limits

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
The plain overlays (flow, speed, cut-through) SHALL show each street's average over the simulated time so far, and a street that has carried traffic SHALL NOT return to "no traffic" gray during the run. The legend SHALL say the values are averages over the simulated time so far.

#### Scenario: Quiet street
- **WHEN** a street carries one vehicle every few minutes
- **THEN** its line stays drawn and changes in small steps

### Requirement: Map image export
The UI SHALL let people download the map as a PNG, and as a JPEG from the context menu, at twice the screen's pixel size when the screen is smaller. The image SHALL contain the basemap, overlay lines, vehicles, signals, intervention badges, the study-area outline, the current legend, a caption with the area name, period, simulated time and a scenario summary, and the text "© OpenStreetMap contributors".

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
- **THEN** the swatch is the neutral gray the map draws, in the current theme

#### Scenario: Two-way block
- **WHEN** a user hovers a two-way block
- **THEN** two lines show, one per direction, each with its own swatch and value and naming its direction, for example "toward Elm St"

### Requirement: Modal filters show what they close
The map SHALL mark every street a modal filter closes to through cars, and only those streets, with a short bar drawn across the road at a right angle to it, by shape and pattern as well as color, and SHALL draw no badge for a modal filter. Bars SHALL be map features centered on their street at a geographic point, sized from the drawn road with a minimum size so they are legible at every zoom. A leg's bar SHALL sit 8 m along its street from where the leg begins at every zoom, so zoomed out the bars of a junction overlap into one compact mark no wider than about 22 CSS px at the fitted overview. Each filter SHALL keep an invisible control of at least 24 by 24 CSS px at its location that is reachable by keyboard, has a visible focus ring and the filter's description as its name, and selects the filter when activated; clicking a bar SHALL select its filter. The Scenario list, selection pop-up and tooltip SHALL say in words which legs are closed.

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

### Requirement: Picture is readable without color and honest about its period
The picture SHALL carry a caption naming its period, a legend with numbers, the block the card names as gaining the most outlined and labeled with its change, a text alternative giving the area's through-car change and the biggest drop and gain by block name, and the OpenStreetMap attribution.

#### Scenario: Figures average several periods
- **WHEN** a group searched more than one period
- **THEN** the card says once that its figures average those periods and the picture shows one

#### Scenario: Named block is not the biggest gain in the picture's period
- **WHEN** the block the card names does not gain the most through cars in the picture's period
- **THEN** the card says so, names the block with the biggest gain in that period, and outlines both

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

### Requirement: Assumptions tab
The app SHALL have a top-level Assumptions tab between Streets and Sources. It SHALL open by saying its contents are the judgment calls in the model, the parts that rest on reasoning and not on a count, that they are the first things to question and that changing them would change the results, and it SHALL link to Sources for the measured inputs.

#### Scenario: Tab order
- **WHEN** the navigation is read in order
- **THEN** it lists Map, Proposals, Streets, Assumptions, Sources, and all five fit on a phone without a horizontal page scroll

#### Scenario: Pointer from Sources
- **WHEN** a person opens Sources
- **THEN** a line says the judgment calls are on the Assumptions tab and links to it, and the assumed-movement provenance entry is not listed there

### Requirement: Assumed movement flows table
The Assumptions tab SHALL explain in one short paragraph what an assumed movement is, why it exists and what its trips do when a change blocks the turn. It SHALL list one row per movement: the turn in plain words, counted cars an hour per period (a period without a count marked scaled), cars an hour assigned, how many are through cars, and who the cars are assumed to be with their shares.

#### Scenario: Counted and assumed are distinguishable
- **WHEN** a person reads the table
- **THEN** the counted columns, the scaled midday column and the assumed columns are labeled as such in text, and on a phone each row stacks as labeled lines

#### Scenario: Numbers come from data
- **WHEN** the table is built
- **THEN** its figures are read from a generated file made from the demand config and fit report, and the page says when that file was made for a different demand file than the one loaded

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
The on-screen legend and the exported map image SHALL include keys for filter bars, diverters, lettered badges and the reason line when they are drawn, and SHALL list no cars when none are drawn.

#### Scenario: Stored result export
- **WHEN** a stored result is exported
- **THEN** the key row has no "Cars" entry
