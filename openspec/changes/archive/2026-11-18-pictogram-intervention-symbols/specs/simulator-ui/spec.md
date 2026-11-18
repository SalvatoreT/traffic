## ADDED Requirements

### Requirement: Intervention pictures
Every surface that marks an intervention SHALL mark a control change, a signal timing change, a speed hump, a traffic circle, a one-way street and a turn ban with a small sign-style picture, never with letters. The pictures SHALL differ in shape and pattern, not only in color, and every surface SHALL draw each from the same shape data. Marks keep their text alternatives, keyboard operation and visible focus.

#### Scenario: Which picture
- **WHEN** interventions are drawn
- **THEN** a two-way stop is a stop sign, an all-way stop the same sign with an ALL plaque, a signal a traffic light, an uncontrolled intersection a gray stop sign with a slash, signal timing a traffic light with a clock, a speed hump a yellow diamond with a bump, a traffic circle (or a control that becomes one) a blue disc with circling arrows, a one-way street a black sign with a white arrow, and a turn ban a turn arrow in a red slashed circle

#### Scenario: Control variants
- **WHEN** a scenario holds an all-way stop and a signal
- **THEN** the map shows a stop sign with an ALL plaque and a traffic light, and the legend lists those two pictures and no other control picture

#### Scenario: One-way direction
- **WHEN** a one-way street is placed on a street running north to south
- **THEN** its sign points south along the street

## MODIFIED Requirements

### Requirement: Map image export
The UI SHALL let people download the map as a PNG, and as a JPEG from the context menu, at twice the screen's pixel size when the screen is smaller. The image SHALL contain the basemap, overlay lines, vehicles, signals, intervention pictures, the study-area outline, the current legend, a caption with the area name, period, simulated time and a scenario summary, and the text "© OpenStreetMap contributors".

#### Scenario: Image contents
- **WHEN** a user downloads the map image
- **THEN** it shows what the map shows, with the legend and caption around it and the OpenStreetMap credit

### Requirement: Legend keys
The on-screen legend and the exported map image SHALL include keys for filter bars, diverters, intervention pictures, speed-limit signs and the reason line when they are drawn, and SHALL list no cars when none are drawn. Each picture key SHALL name the picture in words and say what it means, and SHALL appear only for the variants present.

#### Scenario: Stored result export
- **WHEN** a stored result is exported
- **THEN** the key row has no "Cars" entry

#### Scenario: Keys in words
- **WHEN** a scenario holds a turn ban
- **THEN** the key reads "Turn arrow in a red slashed circle: turn banned" and shows no letters
