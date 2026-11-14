## MODIFIED Requirements

### Requirement: Modal filters show what they close
The map SHALL mark every street a modal filter closes to through cars, and only those streets, by shape and pattern as well as color, and the Scenario list, selection pop-up and tooltip SHALL say in words which legs are closed.

#### Scenario: Text matches the map
- **WHEN** a filter is placed
- **THEN** the text names the closed legs by street and compass word, says once that people walking and cycling still pass, and previews the legs before the filter is added at an intersection

#### Scenario: Four-leg intersection
- **WHEN** a whole-junction filter is placed at a four-leg intersection
- **THEN** four bars appear, one on each leg, and the list names the four legs

#### Scenario: One street
- **WHEN** a filter closes the two legs of one street at a four-leg intersection
- **THEN** two bars appear, one on each of those legs, and the text names them and says which streets stay open

#### Scenario: Offset junction
- **WHEN** the filter is at a junction whose legs begin up to 20 m apart
- **THEN** each bar sits on its own street mouth and the text says the junction combines the streets and whether the filter closes all of its legs or only some

#### Scenario: Block filter
- **WHEN** a filter is on a block
- **THEN** striped tape runs along the block and the text names the block

## ADDED Requirements

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
