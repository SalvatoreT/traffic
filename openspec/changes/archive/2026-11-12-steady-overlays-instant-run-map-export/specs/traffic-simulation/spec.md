## ADDED Requirements

### Requirement: Run-averaged link statistics
The simulator SHALL be able to report, for each link, flow, cut-through flow and mean speed averaged over the simulated time since the start of the run (not including the settle interval), so a link's reported values change gradually as the run goes on.

#### Scenario: Quiet street
- **WHEN** a link has carried at least one vehicle since the start of the run
- **THEN** its reported flow stays above zero for the rest of the run and changes by at most the effect of the new evidence divided by elapsed time
