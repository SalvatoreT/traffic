## MODIFIED Requirements

### Requirement: Validation stations are held out and reported separately
When `countFit.validation` is enabled, the build SHALL mark about a quarter of the count stations as validation-only, deterministically, with at least one per corridor, fit once without them, write that fit as the cross-validation demand with the same ramp split and intent annotation as the shipped demand, and ship the demand fitted on every count. The cross-validation demand SHALL be removed when the build skips the cross-validation fit.

#### Scenario: Corridor coverage
- **WHEN** the hold-out is selected
- **THEN** every corridor has at least one validation station and the same stations are chosen on every build

#### Scenario: Same model
- **WHEN** a simulator run uses the cross-validation demand
- **THEN** its off-ramp flows carry the ramp movement and its flows carry their intent, as in the shipped demand

## ADDED Requirements

### Requirement: Derived targets are marked
A count station whose target in a period is another period's count times a factor SHALL list that period in `derived` in the station file. No AM target SHALL be derived.

#### Scenario: Midday
- **WHEN** a station's midday target is its PM count times the period ratio
- **THEN** the station lists `midday` as derived

### Requirement: Uncounted entries are filled for the local trip rates
When an entry or exit of the volunteer count has no count in a period but has one in the other, the trip-end estimate of the period SHALL use the other period's count times the ratio of the totals over the entries counted in both, SHALL NOT count it as zero, and the fit report SHALL list the entries filled and the ratio. The fill is an ASSUMPTION.

#### Scenario: Telegraph Ave entries in the AM
- **WHEN** five Telegraph Ave entries are counted in the PM only
- **THEN** their AM volumes are their PM volumes times the AM-to-PM ratio of the entries counted in both

### Requirement: A counted turn is not overshot by plain flows
After the intent flows are placed, plain seed flows whose best route through an assumed movement costs at most `naturalDetour` times their best route SHALL give up volume until the movement carries no more than its count (what the pinned flows leave of it, not below zero). The report SHALL give the volume before and after.

#### Scenario: Count fully assigned
- **WHEN** the intents of a movement carry its whole count
- **THEN** the plain flows whose best route makes the turn start the fit at zero

### Requirement: Chained freeway links are one ramp
A freeway-class link that starts at a node touched by a surface link SHALL NOT be an off-ramp, and a ramp reached on one path through another ramp's last link SHALL NOT take a part of that flow.

#### Scenario: Ramp that passes a surface node
- **WHEN** a flow's path uses a ramp link and then a second ramp link that starts where the first ends
- **THEN** the flow carries one ramp movement and is not divided

### Requirement: Alternatives belong to through flows
`via.alternatives` SHALL be written only for flows with no end in the study area. A flow with an end in the study area SHALL fall back to its plain route.

#### Scenario: Resident trip
- **WHEN** an intervention blocks a movement used by a flow that starts in the study area
- **THEN** the flow takes its plain route and not the same turn on a parallel street

### Requirement: Movements below the fit minimum are shown as counted
A movement counted below `minMovementVeh` in a period SHALL be reported with its count, SHALL get no assumed trips in that period, and the Assumptions data SHALL give the count and the reason in `belowThreshold`.

#### Scenario: Colby St right turn in the AM
- **WHEN** the count shows 23 veh/h for a movement and the minimum is 25
- **THEN** the data shows 23 and says no trips are assigned because the count is below the fit minimum
