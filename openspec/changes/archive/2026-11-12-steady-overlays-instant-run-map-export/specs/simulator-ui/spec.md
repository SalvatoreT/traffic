## MODIFIED Requirements

### Requirement: Playback control
Users SHALL be able to pause, resume, change simulation speed, choose the time period and reset. Speeds SHALL be 1x, 5x, 20x, 60x and Instant, and a new session SHALL start at 20x. A run SHALL cover one simulated hour of the chosen period and then stop, with the baseline and the scenario covering identical time; the user SHALL be able to run it again.

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

#### Scenario: Instant
- **WHEN** the user chooses Instant, with or without interventions
- **THEN** both runs advance to the end of the hour without drawing every frame, the progress bar and a status note show how far they are, the page stays responsive, and when they finish the map shows the final state with the end-of-run results and overlays

#### Scenario: Stopping an Instant run
- **WHEN** the user pauses or chooses another speed during an Instant run
- **THEN** stepping stops within a fraction of a second at the time reached and continues from there at the chosen speed

#### Scenario: Same results at any speed
- **WHEN** the same period, demand, seed and scenario run at Instant and at 60x
- **THEN** the results and each street's overlay values at the end are identical

#### Scenario: Instant and links
- **WHEN** a scenario link is created or opened
- **THEN** it carries no speed and works as before

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

## ADDED Requirements

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
