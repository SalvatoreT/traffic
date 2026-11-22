## ADDED Requirements

### Requirement: Explicit signal cycles override baseline observed durations
A valid `signal_timing` intervention SHALL set the signal's executed cycle even when the baseline node has an observed timing for the current period. The scenario SHALL retain the applicable phase topology and allocate greens within the requested cycle using the existing flow-based method [Webster1958], releasing baseline observed green-duration pins. The system SHALL disclose that the scenario retimes the observed plan.

#### Scenario: Retiming an observed signal
- **WHEN** a signal with a feasible observed 79-second baseline cycle receives a valid 100-second cycle intervention
- **THEN** the scenario executes a 100-second cycle, and its phase greens and clearances fit that cycle

#### Scenario: Later adaptation
- **WHEN** traffic flows change and the plan adapts while an explicit valid cycle is active
- **THEN** the cycle stays at the requested duration while green splits may change

#### Scenario: Removing the retiming
- **WHEN** the explicit cycle intervention is removed
- **THEN** the signal uses its applicable validated baseline observation again

### Requirement: Infeasible retiming produces an actionable error
An explicit cycle that cannot accommodate the plan's required greens and clearances SHALL be rejected with a diagnostic identifying the node, period, requested cycle, and required budget. The system SHALL NOT accept the intervention and silently execute a longer cycle.

#### Scenario: Too little time for the phase structure
- **WHEN** the requested cycle is shorter than the phase structure's required duration budget
- **THEN** scenario setup reports the incompatible timing, and no result is presented as having used the requested cycle
