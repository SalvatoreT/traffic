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
- **THEN** both runs advance to the end of the hour without drawing every frame, the progress bar and a status note show how far they are, the page stays responsive, the overlay and results are not redrawn from partial averages on the way, and when they finish the map shows the final state with the end-of-run results and overlays

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
The UI SHALL provide a page listing the research references and data sources behind the model.

#### Scenario: Viewing sources
- **WHEN** a user opens "Sources"
- **THEN** they see the bibliography and data provenance with links

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
The UI SHALL light a street block or intersection on the map while the pointer is over, or keyboard focus is on, its row in the search results or the Streets table, and SHALL stop when the pointer or focus leaves. The highlight SHALL NOT change the selection or move the map, and SHALL use a distinct line style and width as well as color.

#### Scenario: Hovering a result
- **WHEN** a user moves the pointer over a search result
- **THEN** that block or intersection is outlined on the map and the selection is unchanged
- **AND WHEN** the pointer leaves
- **THEN** the outline is removed

#### Scenario: Focusing a table row
- **WHEN** keyboard focus moves to a row in the Streets table
- **THEN** that block is outlined on the map until focus moves away

### Requirement: Persistent search results
The search result list SHALL stay visible after the input loses focus while the query is not empty and there are results. It SHALL close when the query is cleared, Escape is pressed or a result is chosen, and SHALL reopen when the query changes.

#### Scenario: Moving the pointer to a result
- **WHEN** a user types a query and then clicks elsewhere or moves to the list
- **THEN** the results remain listed and can be hovered or chosen

### Requirement: Proposals tab
The UI SHALL provide a Proposals tab listing the published options in order from fewest interventions to greatest reduction, each with its title, description, interventions, reduction in cut-through, worst-affected inside block and the size of its increase, and SHALL let the user open any option on the map as a scenario.

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
