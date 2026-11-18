## ADDED Requirements

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

## MODIFIED Requirements

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
