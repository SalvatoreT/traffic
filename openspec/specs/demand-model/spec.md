# demand-model Specification

## Purpose
TBD - created by archiving change rockridge-vehicle-microsim. Update Purpose after archive.

## Requirements

### Requirement: Origin–destination flows
Baseline demand SHALL be expressed as origin–destination vehicle flows per time period following the Demand contract (version 1), including at least a weekday PM peak and a midday period.

#### Scenario: Loading demand
- **WHEN** the simulator loads the Rockridge demand file
- **THEN** every flow references existing nodes and has a non-negative rate

### Requirement: Derived from public data with provenance
Demand SHALL be synthesized from public sources (traffic counts, census commute flows) and the demand file SHALL list each source with URL and a note of how it was used; values that are assumptions rather than data SHALL be labeled as such.

#### Scenario: Count available for a street
- **WHEN** a public traffic count exists for a gate street
- **THEN** the gate's peak inflow is scaled from that count and the provenance entry names the dataset

#### Scenario: No count available
- **WHEN** no count exists for a gate
- **THEN** a per-class default volume is used and recorded as an assumption

### Requirement: Through and local trips
Demand SHALL distinguish trips passing through the area (gate to gate) from trips that start or end inside it.

#### Scenario: Through trip
- **WHEN** a flow has both origin and destination at gates
- **THEN** it is eligible to be counted as cut-through when it uses local streets
