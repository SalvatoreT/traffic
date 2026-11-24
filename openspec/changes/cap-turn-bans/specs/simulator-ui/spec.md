## MODIFIED Requirements

### Requirement: A package with turn bans states its scale on the card
The Proposals card of a package that holds turn bans SHALL show, in its visible part, the number of turn bans as "N turn restrictions at entrances to the area" and the standing caveat that they apply to every driver, residents included, all day, and assume full compliance (ASSUMPTION). A disclosure SHALL list every turn ban grouped by the street it starts on.

#### Scenario: A ban set on the card
- **WHEN** a package holds a ban set of 41 turn bans
- **THEN** the card says "41 turn restrictions at entrances to the area" with the caveat before the map, and one disclosure lists all 41 under the streets they start on

#### Scenario: Few bans
- **WHEN** a package holds two single turn bans
- **THEN** the card still shows the count and the caveat

#### Scenario: A handful of bans
- **WHEN** a package holds a ban set of 3 bans and one single turn ban
- **THEN** the card says "4 turn restrictions at entrances to the area", not that they ring the area, and shows the caveat
