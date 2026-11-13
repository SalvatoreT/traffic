## ADDED Requirements

### Requirement: Hover readout of the legend metric
Hovering a street on the map SHALL show, under the block's name, one line with a color swatch, the metric the legend shows and its value with unit, for the legend's current overlay and view. The value SHALL belong to the hovered direction, and the line SHALL name the direction when the block has two. The metric and value SHALL be text, the swatch SHALL be decorative with a border that keeps 3:1 contrast, and the line SHALL update as statistics update.

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
- **WHEN** a user hovers one direction of a two-way block
- **THEN** the line shows that direction's value and names it, for example "toward Elm St"
