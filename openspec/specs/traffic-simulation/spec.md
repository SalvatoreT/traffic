# traffic-simulation Specification

## Purpose
How the simulation models vehicles, intersections and route choice, and which results it reports.

## Requirements

### Requirement: Car-following
Vehicles SHALL accelerate according to the Intelligent Driver Model [Treiber2000] with collision-free ballistic integration [Treiber2015] at a fixed 0.25 s step, with per-driver parameters drawn from documented urban ranges.

#### Scenario: Approaching a stopped leader
- **WHEN** a vehicle approaches a stationary vehicle
- **THEN** it decelerates smoothly and stops with a positive gap, never overlapping

#### Scenario: Free road
- **WHEN** no leader is within range
- **THEN** the vehicle approaches its desired speed, bounded by the link speed limit times its compliance factor

### Requirement: Intersection control
The simulation SHALL model signals (fixed-time plans derived by Webster's method [Webster1958]), all-way stops, two-way stops, uncontrolled intersections and traffic circles, using gap acceptance [Brilon1999, HCM7, Rodegerdts2010] wherever a movement must yield.

#### Scenario: Red signal
- **WHEN** a vehicle's approach is red
- **THEN** it stops at the stop line and proceeds after green

#### Scenario: Stop sign
- **WHEN** a vehicle reaches a stop-controlled approach
- **THEN** it comes to a stop and enters only when conflicting traffic leaves an acceptable gap

#### Scenario: No gridlock from spillback
- **WHEN** the downstream link has no space
- **THEN** the vehicle does not enter the intersection

### Requirement: Congestion-responsive route choice
Vehicles SHALL follow least-time routes using link travel times measured in the simulation, with a share of drivers re-routing periodically [Wardrop1952, Peeta2001].

#### Scenario: Arterial congestion
- **WHEN** an arterial's measured travel time rises above that of a parallel local street
- **THEN** some later drivers choose the local street

### Requirement: Deterministic and reproducible
Given the same network, demand, scenario and seed, the simulation SHALL produce identical results.

#### Scenario: Repeat run
- **WHEN** two runs use identical inputs and seed
- **THEN** their metrics after one simulated hour are identical

### Requirement: Cut-through metrics
The simulation SHALL report through-trip traffic on residential and service links inside the study area, per link and in aggregate (vehicle-km and share of local-street traffic).

#### Scenario: Through trip on a local street
- **WHEN** a gate-to-gate trip traverses a residential link in the study area
- **THEN** that link's cut-through flow and the aggregate cut-through vehicle-km increase

### Requirement: Safety surrogate metrics
The simulation SHALL report, for residential links in the study area, mean and 85th-percentile speed, the share of vehicle-time above 20 mph and 25 mph, and counts of car-following conflicts with time-to-collision below 1.5 s [Hayward1972, Mahmud2017], labeled as surrogates rather than crash predictions.

#### Scenario: Speeding on a local street
- **WHEN** vehicles travel a residential link above 25 mph
- **THEN** the share-above-25 metric rises

### Requirement: Network performance metrics
The simulation SHALL report completed trips, mean trip time and delay versus free flow, vehicles in network, and per-link flow, mean speed and density.

#### Scenario: Reading metrics
- **WHEN** the UI requests metrics
- **THEN** it receives a JSON document with these fields for the elapsed simulation window

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
