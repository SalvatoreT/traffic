## MODIFIED Requirements

### Requirement: Modal filters show what they close
The map SHALL mark every street a modal filter closes to through cars, and only those streets, with a short bar drawn across the road at a right angle to it, by shape and pattern as well as color. Bars SHALL be map features sized from the drawn road, so they stay on their street and shrink with the roads as the map zooms out. Bars SHALL be visible at every zoom: intervention badges SHALL shrink toward the fitted overview and each leg's bar SHALL sit at least as far along its street as clears the badge, never off the street. Every badge SHALL keep a pointer target of at least 24 by 24 CSS px. The Scenario list, selection pop-up and tooltip SHALL say in words which legs are closed.

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
- **THEN** one bar crosses the block at its midpoint, with no tape along the block, the badge sits beside the bar along the street, and the text names the block

#### Scenario: Zooming out
- **WHEN** the map zooms out to the fitted overview
- **THEN** the bars shrink with the roads, the badges shrink to about 16 px, and each bar stays on its street just outside its badge instead of hiding under it

#### Scenario: Exported image
- **WHEN** the map is exported at any zoom
- **THEN** badges and bars in the image have the sizes and places they have on screen

### Requirement: Picture on each proposal card
Each proposal card whose proposal carries picture data SHALL show an inline vector picture of the change in through cars an hour on each block in the picture's period, package minus today, directly after the card's title and summary and before the figures and the list of changes. The picture SHALL keep its caption, legend, period note and the control for opening the package on the map with it. It SHALL use the scale of the map's Change in cut-through view and draw the package's changes on the streets. It SHALL follow the light and dark themes, fit the card width and use no animation. On wide screens the picture MAY sit beside the figures; on narrow screens it stacks above them. The reading order SHALL match the visual order.

#### Scenario: Card with a picture
- **WHEN** a proposal carries picture data
- **THEN** its card shows the title, the summary, then the picture with its open control, then the figures and changes, with filters drawn as bars across the closed streets

#### Scenario: Phone
- **WHEN** the card is narrower than 720 px
- **THEN** the picture follows the summary in one column with no horizontal overflow

#### Scenario: Same scale as the map
- **WHEN** a block's through cars change by the same amount on the picture and in the map's Change in cut-through view
- **THEN** both use the same color, dead band and top of scale

#### Scenario: Older file
- **WHEN** a proposal has no picture, or its picture arrays are malformed
- **THEN** the card shows no picture and no empty space
