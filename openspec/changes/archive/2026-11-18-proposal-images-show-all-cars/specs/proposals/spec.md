## ADDED Requirements

### Requirement: Shared images show all cars like the card map

The Download image picture and the link-preview card of a proposal with an all-car picture SHALL color and number blocks by the change in all cars an hour, with the card map's data, scale, label rule and rounding. Captions, legend text and text alternatives SHALL say all cars. The headline SHALL stay the through-car figure, worded so it does not imply the map shows through cars.

#### Scenario: Download image legend

- **WHEN** Download image is pressed for a proposal with an all-car picture
- **THEN** the caption and legend say change in all cars an hour, the key names the biggest gain and drop in all cars, and the legend says the headline counts through cars over the whole area

#### Scenario: Number matches the card

- **WHEN** a block is numbered on the card map, the downloaded image or the preview card
- **THEN** all three show the same number, equal to the All cars Change cell of its detail box

#### Scenario: Preview card

- **WHEN** a preview card is built for a proposal with an all-car picture
- **THEN** the legend chip says all cars, the two labeled outlines are drawn without street names, the headline figure is the through-car figure, and the image alt text names the labeled blocks and their numbers

#### Scenario: Older file

- **WHEN** a proposal has no all-car picture
- **THEN** the image and the preview draw through cars with the through-car legend and alt text
