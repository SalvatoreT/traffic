## MODIFIED Requirements

### Requirement: Modal filters show what they close
The map SHALL mark every street a modal filter closes to through cars, and only those streets, with a short bar drawn across the road at a right angle to it, by shape and pattern as well as color. Bars SHALL be map features sized in ground units, so they stay on their street and shrink with the roads as the map zooms out. The Scenario list, selection pop-up and tooltip SHALL say in words which legs are closed.

#### Scenario: Text matches the map
- **WHEN** a filter is placed
- **THEN** the text names the closed legs by street and compass word, says once that people walking and cycling still pass, and previews the legs before the filter is added at an intersection

#### Scenario: Four-leg intersection
- **WHEN** a whole-junction filter is placed at a four-leg intersection
- **THEN** four bars appear, one across each leg a few meters from the junction, and the list names the four legs

#### Scenario: One street
- **WHEN** a filter closes the two legs of one street at a four-leg intersection
- **THEN** two bars appear, one across each of those legs, and the text names them and says which streets stay open

#### Scenario: Offset junction
- **WHEN** the filter is at a junction whose legs begin up to 20 m apart
- **THEN** each bar sits across its own street a few meters from where that street begins, and the text says the junction combines the streets and whether the filter closes all of its legs or only some

#### Scenario: Block filter
- **WHEN** a filter is on a block
- **THEN** one bar crosses the block at its midpoint, with no tape along the block, and the text names the block

#### Scenario: Zooming out
- **WHEN** the map zooms out
- **THEN** the bars shrink with the roads and stay on their streets instead of keeping a fixed screen size
