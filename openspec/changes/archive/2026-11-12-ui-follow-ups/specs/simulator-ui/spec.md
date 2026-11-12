## MODIFIED Requirements

### Requirement: Change from baseline on the map
When a scenario has interventions, the map SHALL be able to color each street by the difference between the scenario and the baseline for the selected metric, on a fixed two-sided scale centered on no change. Size of change SHALL show as line thickness, thin near zero and thick at both ends, and as color intensity on a blue-orange diverging ramp whose non-zero steps keep 3:1 contrast against the basemap in both themes. Direction SHALL be conveyed by more than color: signed values in text and arrows on the largest changes. The view covers cars only and SHALL say so.

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
- **THEN** it is drawn as no change, thin and neutral gray

#### Scenario: Large changes
- **WHEN** a street's change is at or above three quarters of the scale on the square-root scale
- **THEN** it is drawn thick in a dark (light theme) or bright (dark theme) end color with an arrow, up for an increase and down for a decrease

#### Scenario: Walking and biking
- **WHEN** the change view is on
- **THEN** the legend states that the map shows cars and points to the area-wide walking and biking results, because the simulator reports those only for the whole area

## ADDED Requirements

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
