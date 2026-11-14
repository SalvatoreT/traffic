## ADDED Requirements

### Requirement: Count stations carry the year of their source
Every count station SHALL carry a source id and the count year of its source, derived from provenance (the year in a file name, a count date, the latest year of a published ramp row, the Caltrans count year in the config). A station whose year is not known SHALL have year null and SHALL be treated as old.

#### Scenario: Averaged counts
- **WHEN** a station averages counts of 2018, 2018, 2019 and 2021
- **THEN** its year is the mean, 2019.5

#### Scenario: No known year
- **WHEN** a source has no date in its provenance
- **THEN** the station has year null, the reports say so, and the recency rule uses its last band

### Requirement: The fit weights stations by the age of their count
The demand fit SHALL multiply each station's weight (and period weight) by the weight of the first band of `countFit.recency.bands` whose `maxAgeYears` is at least the station's age, the age being `referenceYear` minus the count year. A band weight of 0 SHALL take the station out of every fit and report it as held out. The reference year, the bands and the weights SHALL come from the area config and be labeled ASSUMPTION. No street, source or area name SHALL appear in code.

#### Scenario: Old counts at half weight
- **WHEN** the last band has weight 0.5 and a station's age exceeds the earlier band edge
- **THEN** its weight is half its configured weight and recent stations keep theirs

#### Scenario: Held-out-only
- **WHEN** the last band has weight 0
- **THEN** those stations are not constraints in the shipped fit or the cross-validation fit and are scored as held out

### Requirement: Growth from the count year only with a published rate
`countFit.recency.growthPerYear` MAY map a source id to an annual rate; the target of each station of that source SHALL be multiplied by (1 + rate) to the power of its age. The config SHALL NOT set a rate without a verified published source for it.

#### Scenario: No rate
- **WHEN** a source has no entry
- **THEN** its counts are used as published

### Requirement: A slip link counts on the legs it joins
For a counted intersection leg, an unnamed one-way link that leaves the leg's street where the leg's approach link starts, or joins it where the leg's exit link ends, with its other end within the node radius of the intersection, SHALL be part of the leg's links. A movement that can use such a link SHALL NOT be a movement constraint, and the report SHALL say so.

#### Scenario: Right-turn slip
- **WHEN** a slip leaves the east leg upstream of the signal and joins the north leg downstream of it
- **THEN** the east entering and north leaving stations include the slip link and the east-to-north movement has no station
