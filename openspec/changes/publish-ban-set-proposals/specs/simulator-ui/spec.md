## ADDED Requirements

### Requirement: A package with turn bans states its scale on the card
The Proposals card of a package that holds turn bans SHALL show, in its visible part, the number of turn bans as "N turn restrictions around the edge of the area" and the standing caveat that they apply to every driver, residents included, all day, and assume full compliance (ASSUMPTION). A disclosure SHALL list every turn ban grouped by the street it starts on.

#### Scenario: A ban set on the card
- **WHEN** a package holds a ban set of 41 turn bans
- **THEN** the card says "41 turn restrictions around the edge of the area" with the caveat before the map, and one disclosure lists all 41 under the streets they start on

#### Scenario: Few bans
- **WHEN** a package holds two single turn bans
- **THEN** the card still shows the count and the caveat

### Requirement: The card's picture marks turn bans by intersection
From six turn bans in a package, the card's picture SHALL draw one mark for each intersection where bans start: the left-turn sign, the right-turn sign, or a sign with both arrows when both occur there. Below six, each ban SHALL keep its own sign. The card's change list SHALL be the text alternative, and color SHALL NOT be the only signal.

#### Scenario: Forty-one bans
- **WHEN** a package holds 41 turn bans that start at 14 intersections
- **THEN** the picture draws 14 marks

### Requirement: The resident detour is beside the headline on every card
Every Proposals card SHALL show the resident detour, in seconds added per requested resident trip, in the card's head next to the through-car headline, labeled "Resident detour", whatever the package holds. When the file recorded none, the card SHALL say it is unavailable. The Context disclosure SHALL keep the explanation and the interval.

#### Scenario: Two families side by side
- **WHEN** one card holds a ban set and another holds filters only
- **THEN** both show their resident detour at the same place under the headline

### Requirement: Many turn bans are one scenario entry
The scenario panel SHALL fold six or more turn bans of the scenario into one entry, "N turn bans", with one control that removes all of them and an expander that lists them by the street they start on, each selecting its place. Fewer than six SHALL be listed one by one. The panel's count SHALL stay the number of interventions. Opening a package with a ban set on the map SHALL load every ban, and scenario links written before this requirement SHALL decode as before.

#### Scenario: Open a ban package on the map
- **WHEN** a person opens a package of a ban set and five other changes on the map
- **THEN** the panel lists six entries, one of them "41 turn bans" with one "Remove all 41", and the heading counts 46 interventions

#### Scenario: Link length
- **WHEN** the package's scenario link is made
- **THEN** it lists each ban once and stays under 1,500 characters for 41 bans and five other changes
