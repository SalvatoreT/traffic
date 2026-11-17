## MODIFIED Requirements

### Requirement: Street facts on the card's map
Moving the pointer over, focusing, or tapping a measured street on a card's map SHALL show its name and block, its through cars an hour today and with the proposal in the picture's period, the change, and the runs it is a mean over. It SHALL say when the change is within run-to-run variation. When the file has all-car figures for the proposal (`pictureAll`), it SHALL show all cars on the block today and with the proposal beside the through cars, split into through cars and local trips, in the street panel and the hover tip, and the "Streets that change" table SHALL carry an all-cars column. When the file has none, it SHALL give all cars only for a block whose all-car figures the file records, and otherwise say they are not in the file.

#### Scenario: Street hover
- **WHEN** the pointer is over a side street whose through cars go from 5 to 34
- **THEN** the card names the block and says 5 to 34 through cars an hour in the period, up 29, through cars only, with the runs

#### Scenario: Street hover with all cars
- **WHEN** the pointer is over a side street whose through cars go from 5 to 99 and whose all cars go from 70 to 278, and the file has `pictureAll`
- **THEN** the card names the block, says 5 to 99 through cars an hour, and says 70 to 278 all cars an hour, up 208, with the through and local split

#### Scenario: Street hover without all cars
- **WHEN** the file has no `pictureAll` and the street is not the block with the largest rise
- **THEN** the card says all cars on the block are not in the file
