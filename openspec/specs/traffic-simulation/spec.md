# traffic-simulation Specification

## Purpose
TBD - created by archiving change rockridge-vehicle-microsim. Update Purpose after archive.

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
