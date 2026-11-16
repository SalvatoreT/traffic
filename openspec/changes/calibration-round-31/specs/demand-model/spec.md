## MODIFIED Requirements

### Requirement: The assignment follows the simulator's route choice and restrains capacity
The static assignment SHALL choose routes like the simulator's drivers: each draw samples a perceived cost for every link and movement, normal with mean the cost and variance `dispersion` times the cost (the simulator's route-choice dispersion), and loads every flow on its shortest path on that draw (probit loading [Sheffi1985] ch. 11.2). It SHALL be able to average several passes over link costs that grow with volume over capacity (method of successive averages, BPR form of the volume-delay function, capacities from the validation suite), citing verified entries of `docs/references.md`.

#### Scenario: Loaded short route
- **WHEN** a flow's short route is loaded beyond its capacity and a longer route is a little more costly
- **THEN** the averaged assignment puts part of the flow on the longer route and conserves the volume

#### Scenario: Light load
- **WHEN** the volume is far below capacity and the dispersion is zero
- **THEN** the whole flow stays on the short route
