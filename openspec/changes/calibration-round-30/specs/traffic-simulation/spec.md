## ADDED Requirements

### Requirement: Trip records and trip timings cover the same trips
When trips are recorded, the end of the initial-load settle interval SHALL clear both the trip records and the trip timings, so both lists hold the same completed trips in the same order.

#### Scenario: A trip completes during the settle interval
- **WHEN** a recorded run with initial loading completes a trip before time zero
- **THEN** neither `trip_records` nor `trip_timings` contains it, and the two lists have equal length with equal ids at each position
