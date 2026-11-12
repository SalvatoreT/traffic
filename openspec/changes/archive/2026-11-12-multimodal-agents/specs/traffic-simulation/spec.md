## ADDED Requirements

### Requirement: Bicycles
The simulation SHALL model cyclists as agents with their own desired speeds that obey intersection control, use bike lanes where present, share the lane otherwise, and pass through modal filters.

#### Scenario: Shared street
- **WHEN** a car catches a cyclist on a two-way street with no bike lane and oncoming traffic
- **THEN** the car follows at the cyclist's speed until a gap in oncoming traffic lets it pass

#### Scenario: Modal filter
- **WHEN** a modal filter closes a street to cars
- **THEN** cyclists still travel through it

### Requirement: Pedestrians and crossings
The simulation SHALL model pedestrians walking beside links and crossing at intersections and marked crossings, crossing with the parallel phase at signals and otherwise relying on driver yielding or gaps, with yielding rates cited from the literature.

#### Scenario: Driver yields
- **WHEN** a pedestrian waits at an unsignalized marked crossing and an approaching driver yields
- **THEN** the vehicle stops before the crossing until the pedestrian has cleared it

#### Scenario: Signalized crossing
- **WHEN** a pedestrian reaches a signalized intersection
- **THEN** the pedestrian waits and crosses during the phase parallel to the crossing

### Requirement: Safety metrics for people walking and biking
The simulation SHALL report conflicts between cars and pedestrians or cyclists by post-encroachment time [Hayward1972, Mahmud2017], close passes of cyclists, and an injury-risk index from vehicle speed at each encounter ([Tefft2013] for pedestrians, [Lubbe2022] for cyclists), labeled as surrogate indicators.

#### Scenario: Slower traffic past a crossing
- **WHEN** an intervention lowers vehicle speeds at a crossing that pedestrians use
- **THEN** the pedestrian injury-risk index falls

### Requirement: Per-mode performance metrics
The simulation SHALL report agents in the network, completed trips and mean trip time per mode and mean pedestrian crossing delay, while existing aggregate metrics continue to count cars only.

#### Scenario: Reading metrics
- **WHEN** the UI requests metrics
- **THEN** the document contains the per-mode and vulnerable-road-user sections
