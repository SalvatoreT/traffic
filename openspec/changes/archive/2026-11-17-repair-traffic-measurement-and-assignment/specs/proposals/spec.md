## MODIFIED Requirements

### Requirement: Residents' detour
Each proposal SHALL compare the same resident car requests on the same seed through the same cutoff. Completed trips SHALL contribute their time from request to completion. Other requests SHALL contribute their elapsed time at cutoff. The report SHALL show the difference in seconds per request, the aggregate time difference per hour and completion coverage. Old completed-trip metrics SHALL remain identifiable. A missing or mismatched cohort SHALL be ineligible for the least-detour objective.

#### Scenario: Reading the detour
- **WHEN** a reader opens an option with comparable resident request cohorts
- **THEN** the option gives its difference in seconds per request, interval and completion coverage

#### Scenario: A resident still waits at cutoff
- **WHEN** a resident request finishes in the baseline run and remains unserved in the scenario
- **THEN** both runs include that request in the denominator and the scenario counts its time through cutoff

## ADDED Requirements

### Requirement: Period-specific checks and confirmation
Search and reference checks SHALL evaluate the baseline and proposed movement graph in each searched period. Publication and objective tags SHALL use confirmation health for the frozen shortlist.

#### Scenario: Closure leaves only a timed prohibited turn
- **WHEN** a package cuts the last available access in a searched period
- **THEN** the package fails the access check for that period

#### Scenario: Unhealthy confirmation
- **WHEN** a shortlisted option fails a required confirmation check
- **THEN** it cannot receive a winning objective tag

### Requirement: Reuse measured initial route costs
A search MAY share the baseline's measured initial route costs across packages of the same study, period and seed. Every scenario SHALL build its own initial state and give the same results as an independent warm-up.

#### Scenario: Parallel packages on one seed
- **WHEN** packages share the baseline cost measurement
- **THEN** vehicle states, link measurements and metrics match independently initialized runs
