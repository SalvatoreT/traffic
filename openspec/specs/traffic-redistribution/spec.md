# traffic-redistribution Specification

## Purpose
Show where the through cars that used a closed movement go. The diagnostic compares today, the closure alone and the full package on matched requested car trips, keeps the evidence behind each figure (coverage, provenance, unmatched trips), and reports all-traffic effects next to the through-car changes.

## Requirements

### Requirement: Bypass witnesses use the effective movement graph
The diagnostic SHALL validate bypasses using canonical simulator movement permissions for the scenario, period, direction, mode, and intervention scope. It SHALL identify the graph, distinguish legal possibilities from simulated usage, and disclose search/display limits. Only exhaustive reachability over the declared graph SHALL establish disconnection.

#### Scenario: Colby and North permit a neighboring bypass
- **WHEN** a selected filter blocks Colby/North movements but the effective graph permits Colby, 63rd, Dana, and Alcatraz in a given direction
- **THEN** the diagnostic can show a legal witness in that direction without interpreting the witness or the number of possible paths as a traffic volume

#### Scenario: Restriction changes with period or movement
- **WHEN** a candidate bypass uses a turn banned in the selected period or a movement excluded by a partial filter or diverter
- **THEN** it is rejected by the same permissions as the simulation, even if an undirected or different-period graph would connect its streets

#### Scenario: Search stops before exhaustion
- **WHEN** a path search or display reaches a configured cap
- **THEN** the result identifies the limit and incomplete coverage rather than asserting that omitted paths do not exist

### Requirement: Attribution pairs comparable requested car trips
The diagnostic SHALL pair car requests by scenario-independent identity and verify requested arrival time, origin/destination, physical endpoint, and routing-relevant driver attributes. Keys SHALL retain mode and immutable demand-source or validated schedule identity. Mismatches SHALL be explicit; initial/preplaced and warm-up agents SHALL have separate strata and pairing coverage. Enabling diagnostics SHALL NOT alter dynamics or consume simulation randomness.

#### Scenario: Initial loading shifts ordinary vehicle UIDs
- **WHEN** two scenarios create different initial populations before the same demand request
- **THEN** the ordinary request is identified independently of the global UID sequence, recycled vehicle slots, or runtime flow positions, and attribution is accepted only after its requested attributes are checked

#### Scenario: Matching requests have different sampled endpoints
- **WHEN** a stable request key matches but physical endpoint or driver attributes differ
- **THEN** the mismatch is counted and labeled rather than presented as the same driver's response to the intervention

#### Scenario: Pairing requires a generator behavior change
- **WHEN** the implementation changes persistent attribute generation to make requests comparable
- **THEN** the behavior change receives updated provenance and before/after validation, and tracing on versus off remains behaviorally identical within the resulting implementation

### Requirement: Cohort accounting retains lifecycle and passage evidence
The cohort SHALL contain baseline car requests traversing the selected intervention's altered directed links or movements within the measurement window. Outcomes SHALL partition requests at the declared horizon. Passage counts SHALL use timestamped link exits and preserve repeats. Gross cohort diversion SHALL remain distinct from net all-car changes; cohort, other-request, and identified initial/unmatched contributions SHALL reconcile those changes.

#### Scenario: Partial filter leaves other turns legal
- **WHEN** a filter affects only selected legs or movements
- **THEN** unrelated baseline turns through the junction are excluded from the directly affected cohort unless the user selects the separately labeled broader cohort

#### Scenario: A detour is unfinished at the horizon
- **WHEN** a baseline cohort member completes in baseline but remains active, pending, removed, or unroutable in a comparison
- **THEN** it remains in mutually exclusive pending, active, completed, unroutable, removed, or unmatched accounting as applicable, with complete versus observed partial paths identified, without silently extending the horizon or counting an unrecorded path as zero diversion

#### Scenario: Equal opposing changes hide diversion
- **WHEN** cohort passages onto a block are offset by other trips leaving that block
- **THEN** gross cohort additions and removals remain visible alongside the zero or small net block change

#### Scenario: A trip crosses a link twice
- **WHEN** a cohort trip exits the same directed link twice during the measurement window
- **THEN** its outcome is counted once and its two passages reconcile with the corresponding link-flow count

### Requirement: Redistribution compares explicit scenario variants
The diagnostic SHALL compare baseline, the exact selected closure alone, and the complete package with identical network, demand, period, requested seeds, horizon, initialization policy, and measurement window. Outputs SHALL identify each scenario and comparison. Package-versus-closure differences SHALL remain conditional comparisons, without assigning additive causal contributions to individual interventions.

#### Scenario: A package contains interacting changes
- **WHEN** a selected closure appears with other interventions in a package
- **THEN** baseline-to-closure and baseline-to-package effects are reported separately, and an optional package-to-closure comparison retains its conditional meaning

#### Scenario: Closure extraction is ambiguous
- **WHEN** the selected intervention cannot be decoded or isolated unambiguously
- **THEN** the diagnostic reports the problem and requires a valid explicit selector instead of constructing an inferred closure-only scenario

### Requirement: Redistribution evidence declares coverage and provenance
Outputs SHALL identify inputs, simulator, scenarios, cohort selector, settings/windows, seeds, schema/method versions, and coverage/limits. Request outcomes and flow reconciliation SHALL remain exact when route details are capped. Route frequencies SHALL use recorded usage and declared denominators. Uncertainty SHALL reuse established paired methods and evidence labels. Run health, removals, and recovery SHALL remain visible.

#### Scenario: Detailed path storage is capped
- **WHEN** route-detail storage or display reaches its limit
- **THEN** exact aggregate counts remain available and omitted detail is identified, including the denominator for any displayed route share, without inferring frequencies from structural path counts or silently extrapolating truncated samples

#### Scenario: Only three historical seeds exist
- **WHEN** the diagnostic presents the preserved pre-repair three-seed example
- **THEN** it labels the numbers historical and descriptive, applies the established minimum-pair and selection/confirmation rules, and does not represent them as predictions from the repaired engine

#### Scenario: Stored aggregate results lack route records
- **WHEN** an older result contains aggregate flows but no matching lifecycle and passage evidence
- **THEN** it can retain its valid aggregate figures under existing provenance rules but reports route attribution as unavailable
