## ADDED Requirements

### Requirement: Picture on each proposal card
Each proposal card whose proposal carries picture data SHALL show, next to its control for opening the package on the map, an inline vector picture of the change in through cars an hour on each block in the picture's period, package minus today. It SHALL use the same blue-orange diverging scale, dead band and top as the map's Change in cut-through view, and draw the package's modal filters, diagonal diverters, one-way streets and other changes on the streets. It SHALL follow the light and dark themes, scale to the card width without horizontal page scroll and use no animation.

#### Scenario: Card with a picture
- **WHEN** a proposal carries picture data
- **THEN** its card shows the picture beside the open control, with filters drawn as bars across the closed streets

#### Scenario: Older file
- **WHEN** a proposal has no picture, or its picture arrays are malformed
- **THEN** the card shows no picture and no empty space

### Requirement: Picture is readable without color and honest about its period
The picture SHALL carry a caption naming its period, a legend with numbers, the block the card names as gaining the most outlined and labeled with its change, a text alternative giving the area's through-car change and the biggest drop and gain by block name, and the OpenStreetMap attribution.

#### Scenario: Figures average several periods
- **WHEN** a group searched more than one period
- **THEN** the card says once that its figures average those periods and the picture shows one

#### Scenario: Named block is not the biggest gain in the picture's period
- **WHEN** the block the card names does not gain the most through cars in the picture's period
- **THEN** the card says so, names the block with the biggest gain in that period, and outlines both
