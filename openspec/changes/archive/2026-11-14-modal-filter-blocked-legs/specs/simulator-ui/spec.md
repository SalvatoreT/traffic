## ADDED Requirements

### Requirement: Modal filters show what they close
The map SHALL mark every street a modal filter closes to through cars, by shape and pattern as well as color, and the Scenario list, selection pop-up and tooltip SHALL say in words which legs are closed.

#### Scenario: Text matches the map
- **WHEN** a filter is placed
- **THEN** the text names the closed legs by street and compass word, says once that people walking and cycling still pass, and previews the legs before the filter is added at an intersection

#### Scenario: Four-leg intersection
- **WHEN** a node filter is placed at a four-leg intersection
- **THEN** four bars appear, one on each leg, and the list names the four legs

#### Scenario: Offset junction
- **WHEN** the filter is at a junction whose legs begin up to 20 m apart
- **THEN** each bar sits on its own street mouth and the text says the junction combines the streets and the filter closes all of its legs

#### Scenario: Block filter
- **WHEN** a filter is on a block
- **THEN** striped tape runs along the block and the text names the block
