## ADDED Requirements

### Requirement: Finite-space search benchmark

The project SHALL provide a benchmark that evaluates every conflict-compatible package up to a declared depth in a frozen candidate set, using production evaluation and objective meanings. It SHALL report the best-score gap and nondominated coverage within that set, retain rejection reasons, and distinguish visited packages from forwarded finalists. Its inputs and protocol SHALL be recorded before scoring.

#### Scenario: Frozen protocol

- **WHEN** a benchmark starts
- **THEN** it records the candidate set, source and method identities, input hashes, run settings, budgets, and tie rules before evaluating candidates

#### Scenario: Search cannot inspect the reference results

- **WHEN** a heuristic is compared with exhaustive evaluation
- **THEN** its decisions use only its own charged evaluations and declared prior inputs, and the exhaustive results are used afterward to assess coverage

#### Scenario: Rejected combination

- **WHEN** an enumerated package fails conflict, access, or simulation checks
- **THEN** its identity and reason are retained, and the report distinguishes enumeration counts from simulation counts

#### Scenario: A bounded claim

- **WHEN** a search reaches the highest score in the benchmark
- **THEN** the result states the candidate set, depth, objective, model inputs, and evaluation settings, without claiming an optimum outside that scope or real-world validation

### Requirement: Candidate coverage is inspectable

A search benchmark SHALL compare its frozen candidates with the production generator by canonical effective intervention and record inclusion or exclusion reasons. Experimental supplementary closure candidates SHALL use the canonical legal movement graph, record their bypass or connectivity evidence, obey current intervention/profile rules, and pass the same package access checks as other candidates. Supplement generation SHALL be bounded and deterministic under recorded settings.

#### Scenario: Quiet bypass

- **WHEN** a legal bypass is absent from the baseline hotspot candidates
- **THEN** the coverage report records that omission and the supplementary generator can consider permitted closure candidates on that bypass without asserting a traffic volume from connectivity alone

#### Scenario: Equivalent intervention representations

- **WHEN** a supplementary candidate and a baseline candidate decode to the same effective intervention
- **THEN** the search evaluates one canonical candidate and records both origins

#### Scenario: Existing type restriction

- **WHEN** a supplementary candidate would violate an existing intervention eligibility rule
- **THEN** it is excluded with that reason unless the rule has been explicitly amended

### Requirement: Supplementary search can revisit pruned choices

The search SHALL support a bounded experimental supplement for deletions, replacements, and coordinated starts, including weak singles and alternative junction designs. It SHALL retain conflict, depth, access, and objective restrictions, deduplicate through the shared canonical package cache, and record its budget, deterministic ordering, evaluation origins, and stop reason.

#### Scenario: Weak alone and useful together

- **WHEN** a valid coordinated start includes an intervention that worsens through traffic alone
- **THEN** the supplement can evaluate the combination within its declared allowance rather than rejecting it solely because of the single-intervention result

#### Scenario: Junction variant depends on its neighbors

- **WHEN** the supplement proposes replacing an intervention with another permitted design at that junction
- **THEN** the candidate package can be evaluated even if the replacement lost the initial same-place ranking, and the package never contains both conflicting designs

#### Scenario: Deleting a change

- **WHEN** the supplement evaluates a finalist with one intervention removed
- **THEN** the smaller package uses the ordinary evaluator and can compete for the same eligible objectives

### Requirement: Search improvements use declared comparison budgets

A proposed production search change SHALL be evaluated against the unchanged search under a comparison protocol frozen before scoring. The protocol SHALL declare benchmark cases, prior known packages, budget allocation, charged simulation work, tie rules, and practical quality/runtime acceptance criteria. Cold discovery and known-package runs SHALL be reported separately. Exact reference evaluation MAY use more work but SHALL be labeled as the quality reference, not an equal-budget competitor.

#### Scenario: Added exploration costs more

- **WHEN** a supplementary method uses evaluations beyond the original search's allowance
- **THEN** the report labels that comparison as extra budget and includes an equal-budget comparison before claiming an algorithmic improvement

#### Scenario: Known packages differ

- **WHEN** two competitors receive different prior packages
- **THEN** the comparison is identified as differing prior information and is not presented as an equal-input search comparison

#### Scenario: Challenger fails the declared criteria

- **WHEN** a challenger does not meet the frozen quality/runtime criteria
- **THEN** production defaults remain unchanged and the result is retained with the benchmark evidence

### Requirement: Screening fidelity is measured separately

A search-method evaluation SHALL distinguish candidate omission, pruning, and screening versus full-hour ordering. Screening duration or seed-count changes SHALL record simulation cost and compare finalist retention and ordering against full-hour selection on unchanged inputs. Independent confirmation SHALL freeze the shortlist before reading unused seeds and retain every outcome under the existing paired-evidence contract.

#### Scenario: Screening and confirmation reverse two packages

- **WHEN** the screening winner has a lower score than another frozen package in confirmation
- **THEN** the report preserves both results, identifies the runs used for selection, and does not infer the best full-hour package across unconfirmed candidates

#### Scenario: Through difference remains unresolved

- **WHEN** paired confirmation cannot resolve the through-traffic difference between packages with different worst-block increases
- **THEN** the report states that uncertainty and the street-level tradeoffs without claiming equivalent through effects or improvement on every street

#### Scenario: Network extent changes

- **WHEN** a benchmark is repeated on another network extent or input identity
- **THEN** it has separate provenance and results, and the prior benchmark's numerical findings are not assigned to the new model
