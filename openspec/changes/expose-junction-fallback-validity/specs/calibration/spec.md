## ADDED Requirements

### Requirement: Calibration reports show dependence on junction recovery
Calibration and scenario-validation reports SHALL state the recovery policy and report counts by reason, node and time, elapsed-time rates and explicit denominators for admission shares. They SHALL distinguish initialization from the measured interval and report throughput, backlog, removals and affected time/safety measures together [FHWA-TAT3-2019; TfL-TMG4].

#### Scenario: Fallback is unused
- **WHEN** no recovery decision affects a measured run
- **THEN** the report states zero affected admissions and names the policy and interval tested

#### Scenario: Recovery changes the outcome
- **WHEN** changing recovery affects throughput, backlog or scenario comparisons
- **THEN** the report identifies those differences with the recovery events and seed variation, without silently retuning demand to erase them

### Requirement: Recovery policy changes have matched sensitivity checks
Before accepting a recovery policy change, reports SHALL compare matched network, demand, scenario, horizon and seeds under current behavior, disabled behavioral fallback and a physically valid proposed recovery policy [FHWA-TAT3-2019; TfL-TMG4].

#### Scenario: Candidate recovery policy
- **WHEN** a new recovery policy is evaluated
- **THEN** the report includes all three policy variants with matched inputs and identifies any run that could not finish or remained congested

### Requirement: Validity claims reflect physical recovery diagnostics
A report SHALL NOT infer physically valid junction interactions solely from low removal counts or low rear-end TTC counts. It SHALL disclose any physical-constraint bypass recorded in a diagnostic policy and qualify affected results. It SHALL distinguish modeled validity checks from predictions of crashes [Mahmud2017; FHWA-SSAM2008].

#### Scenario: Historical bypass policy
- **WHEN** a diagnostic run uses the historical policy and records admissions that bypass a physical-conflict check
- **THEN** its report states that limitation and does not present the run as having passed physical junction validity
