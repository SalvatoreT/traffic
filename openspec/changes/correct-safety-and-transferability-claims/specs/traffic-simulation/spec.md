## MODIFIED Requirements

### Requirement: Safety metrics for people walking and biking
The simulation SHALL report conflicts between cars and pedestrians or cyclists by post-encroachment time [Hayward1972, Mahmud2017] and close passes of cyclists as surrogate indicators. Each source-based injury severity score SHALL identify its injury endpoint, speed definition, population assumptions, and supported encounter geometry. Pedestrian and cyclist endpoints SHALL remain separate [Tefft2013, Lubbe2022]. A cyclist severity score using [Lubbe2022] SHALL use source-compatible relative kinematics; an encounter outside the source's supported geometry SHALL have an explicit unsupported severity status. The output SHALL include total and supported encounter counts and mean severity for each mode. An empty supported sample SHALL produce an unavailable mean with a reason. These conditional severity scores SHALL NOT be represented as crash probabilities or expected injuries.

#### Scenario: Slower traffic past a crossing
- **WHEN** supported pedestrian encounters have identical exposure and geometry but lower impact-speed proxy values
- **THEN** their per-encounter score follows the declared [Tefft2013] curve and its disclosed interpolation rule
- **AND** the output continues to identify the value as a conditional severity surrogate

#### Scenario: Cyclist velocity changes
- **WHEN** two supported cyclist encounters have the same car velocity and different cyclist velocities
- **THEN** their source-compatible closing-speed inputs are calculated from both participants according to the documented [Lubbe2022] definition
- **AND** the scorer does not substitute car speed for closing speed

#### Scenario: Unsupported passing geometry
- **WHEN** an encounter's geometry is outside the adopted injury source's scope
- **THEN** the output records the encounter and its unsupported severity status
- **AND** it does not present a source-based injury score for that encounter

#### Scenario: No supported encounters
- **WHEN** a mode has no supported encounters during a run
- **THEN** its encounter count and support status are reported and its mean severity is unavailable
- **AND** the output does not report a measured zero severity

#### Scenario: Exposure changes without severity changes
- **WHEN** an encounter sample is duplicated without changing its individual scores
- **THEN** its count doubles and its mean stays unchanged
- **AND** both values remain available to reporting clients
