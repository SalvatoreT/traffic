## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Live traffic map
The UI SHALL show the study area's streets with moving vehicles, signal states and a per-street overlay selectable between flow (all cars) and cut-through volume on the side streets inside the study area, with OpenStreetMap attribution.

#### Scenario: Opening the app
- **WHEN** a user opens the app
- **THEN** the Rockridge network loads and vehicles begin moving without further input

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

### Requirement: Steady street values without interventions
The plain overlays (flow and cut-through) SHALL show each street's average over the simulated time so far, and a street that has carried traffic SHALL NOT return to the "no traffic" color during the run. The legend SHALL say the values are averages over the simulated time so far.

#### Scenario: Quiet street
- **WHEN** a street carries one vehicle every few minutes
- **THEN** its line stays drawn and changes in small steps

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

### Requirement: Streets table columns
Headers in the Streets table SHALL carry units ("All cars, cars an hour", "Through cars, cars an hour"), SHALL NOT wrap, and SHALL NOT overlap or clip the rows beneath them. The Scenario and Change columns SHALL appear only when a scenario can be compared with the baseline; without one the table SHALL say "Add a change on the Map tab to compare." Figures SHALL show a dash, not zero, while a run's results are withheld.

#### Scenario: No scenario
- **WHEN** no intervention has been added
- **THEN** the table lists base figures only and carries the note, with no columns of dashes

## REMOVED Requirements

### Requirement: Results by mode
**Reason**: The figures cover the whole network, not the study area, and the lead decided the app should show side-street figures only.
**Migration**: None. The simulator still computes them and stored results keep the fields.

### Requirement: Assumed volumes are stated
**Reason**: Walking and biking metrics are no longer shown, so the note has nothing to attach to. Cyclists and pedestrians are still drawn on the map and their volumes are still labeled as assumptions on the Assumptions tab.
**Migration**: None.
