## MODIFIED Requirements

### Requirement: Cut-through metrics
The simulation SHALL report through-trip traffic on residential and service links inside the study area, per link and in aggregate. The aggregate headline SHALL be the number of through vehicles, in total and per hour, where a through vehicle is a gate-to-gate trip counted once, the first time it exits a residential or service link inside the study area. The simulation SHALL also report the share of vehicle-distance on those links that is through traffic, and MAY report the through distance for calibration tools.

#### Scenario: Through trip on a local street
- **WHEN** a gate-to-gate trip traverses a residential link in the study area
- **THEN** that link's cut-through flow increases and the aggregate through-vehicle count increases by one

#### Scenario: Several local links
- **WHEN** a gate-to-gate trip exits three residential links
- **THEN** the aggregate through-vehicle count increases by one, not three

#### Scenario: Trips that do not count
- **WHEN** a trip starts or ends inside the study area, or a gate-to-gate trip stays on arterials
- **THEN** the aggregate through-vehicle count does not change

#### Scenario: Rate
- **WHEN** the elapsed simulated time is t seconds, at least one
- **THEN** the through vehicles per hour equal the count times 3600 divided by t
