## ADDED Requirements

### Requirement: Off-ramp flows carry the ramp the count fit gave them
When `ramps.choice.enabled` is set, the builder SHALL divide each car flow from a freeway mainline gate to a surface node over the off-ramps its final static assignment uses, in proportion to the shares, and write the ramp movement as the `via` of each part (with `maxDetour` and the flow's other ramps as `alternatives`). The flow's total volume SHALL not change. Config, fit report and README SHALL label the choice an ASSUMPTION, and no street name SHALL appear in code.

#### Scenario: Flow over two ramps
- **WHEN** the final assignment of a flow of 80 veh/h uses ramp A with share 0.75 and ramp B with share 0.25
- **THEN** the builder writes two flows of 60 and 20 veh/h with the movements onto A and B, each listing the other as its alternative

#### Scenario: Ramp below the minimum share
- **WHEN** a ramp carries less of a flow than `minShare` (0.05 against 0.1)
- **THEN** the ramp is dropped and the flow has one part, on the other ramp, at the whole volume, with no alternative

#### Scenario: Flow that uses no ramp
- **WHEN** the assignment of an off-ramp flow touches no off-ramp link, or the flow already has a `via`
- **THEN** the flow keeps its volume and gets no ramp movement

### Requirement: Ramp counts can be exempt from the recency weights
The recency rule SHALL leave the weight of a station at its full value when `countFit.recency.exemptRamps` is set and the station is a Caltrans ramp row or a ramp leg of an intersection count, whatever its age. The reports SHALL still list the station under its source and count year.

#### Scenario: Old ramp leg
- **WHEN** a ramp leg of a 2013 intersection count and a plain leg of the same count are weighted with the 10-year band and an old weight of 0.5
- **THEN** with `exemptRamps` the ramp leg keeps its weight and the plain leg takes 0.5, and without it both take 0.5

### Requirement: An intent can require the whole-street route
An assumed movement MAY name a whole-street route of the volunteer count (`wholeStreet`), and an intent of it MAY set `wholeStreet`. The candidates of such an intent SHALL be the seed flows whose route to the movement enters the route at its first link. The intent's volume SHALL still be split over its candidates by seed volume and the intents of the movement SHALL still add up to at most its counted volume.

#### Scenario: Entry at the first link
- **WHEN** two seed flows can make the movement and only one reaches it over the route's first link
- **THEN** only that flow takes the intent's volume

#### Scenario: No flow enters at the first link
- **WHEN** no candidate enters the route at its first link
- **THEN** the intent has no flows and the report says no candidate drives the whole street
