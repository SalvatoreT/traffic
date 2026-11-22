## MODIFIED Requirements

### Requirement: Stable baseline
The published baseline SHALL be judged over the fixed seed list 1 to 10 on each period's 60-minute run at full demand, with the thresholds read from the area's targets file. It is stable when the mean of the judged cars cleared from gridlock is below 1.0 per hour, the entry backlog is below 2% of spawned trips in at least 9 of 10 seeds, no seed adds more than 2.0 points of spawned trips to the backlog in the second half, and the seed mean of the arterial speed is above 4 m/s. The judged cars cleared from gridlock are those held in the area's judged zone (the study area, its bounding streets and the junctions on them, and every node within the area config's buffer distance of them along the network) and those held farther out whose chain of vehicles held by a full exit reaches a link in the zone. When the area config has no judged zone, or a run carries no near and far split, every car cleared from gridlock is judged.

#### Scenario: Full-demand runs over ten seeds
- **WHEN** the baseline runs for 60 simulated minutes at demand scale 1.0 with seeds 1 to 10
- **THEN** the report states, per check, the result and whether the rule holds, and one removal in one seed does not by itself change the verdict

#### Scenario: Gridlock far from the study area
- **WHEN** cars are cleared from gridlock only at nodes outside the judged zone and no blocking chain of theirs reaches the zone
- **THEN** they do not count against the rule, and the report lists them separately, with their places, as a weakness at the model's edges

#### Scenario: Far gridlock that reaches the study area
- **WHEN** a car cleared from gridlock outside the judged zone was held in a chain of blocked vehicles that includes a link in the zone
- **THEN** it counts against the rule as a near one

## ADDED Requirements

### Requirement: Judged zone reported beside the stability rule
Every per-seed report, ten-seed summary, assessment and cost-loop table SHALL report the cars cleared from gridlock near the study area and farther out separately, the far ones with a chain into the zone, the verdict at half and double the buffer distance, the entry backlog at origins in the zone, and the longest standing queue on each bounding street. The split SHALL be computed by observing the simulation between steps, so a run with it equals a run without it.

#### Scenario: Buffer sensitivity
- **WHEN** an assessment is written for an area with a judged zone
- **THEN** it states the judged mean per hour and whether the rule holds at half, the same and double the buffer
