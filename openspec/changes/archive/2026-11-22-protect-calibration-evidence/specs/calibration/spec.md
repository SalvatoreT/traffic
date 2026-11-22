## ADDED Requirements

### Requirement: Validation splits preserve observation dependencies
The calibration pipeline SHALL record observation dependencies and freeze its split before count-derived preprocessing. Every derivative of a withheld observation SHALL remain outside cross-validation fitting and prior construction. With the split fixed, changing held values SHALL leave training artifacts and predictions unchanged. Spatially overlapping observations SHALL follow a declared dependency policy covering their complete matching semantics.

#### Scenario: Both directions derive from one daily count
- **WHEN** an AADT observation is withheld and its two directional hourly targets use an assumed split
- **THEN** both targets and every demand-prior contribution derived from that observation are excluded from training

#### Scenario: Held value changes
- **WHEN** withheld raw values change while training observations and the split stay fixed
- **THEN** cross-validation training artifacts and predictions remain identical and only evaluation targets and scores may change

#### Scenario: Whole-street evidence crosses a held block
- **WHEN** a route observation can constrain traffic on a held interior block
- **THEN** the split applies its declared dependency policy to the complete route semantics and reports retained overlap rather than checking only endpoint links

### Requirement: Validation claims state their scope
Assessment reports SHALL distinguish diagnostic holdouts from independent validation under [WebTAG-M3.1] and [FHWA-TAT3-2019]. They SHALL identify the observed population and periods, and disclose prior use of evaluation evidence in preprocessing, parameter selection, model design, or tuning. A retrospective split of previously consulted observations SHALL NOT be described as independent validation.

#### Scenario: Repeatedly consulted holdout
- **WHEN** model choices were informed by a holdout in earlier calibration rounds
- **THEN** its later score is labeled a diagnostic and the report describes the unused evidence or outer evaluation procedure needed for an independent claim

### Requirement: Assessment verdicts require compatible and complete evidence
An authoritative assessment SHALL require the exact requested seed set and compatible manifests. Missing, duplicate, mislabeled, or incompatible runs SHALL prevent an authoritative verdict and be named in the error. Stability SHALL come from the selected runs or a summary bound to their exact hashes. Partial diagnostics SHALL report their actual sample size and SHALL NOT issue a passing calibration or stability verdict.

#### Scenario: One of ten requested seeds is available
- **WHEN** only seed 1 exists for a requested ten-seed assessment
- **THEN** authoritative assessment fails with the missing seeds listed and a partial diagnostic, if requested, reports one sample without a passing verdict

#### Scenario: Reused measurements disagree with a saved summary
- **WHEN** the selected runs differ from those bound to a saved summary
- **THEN** the summary is rejected and its stability verdict is not used

### Requirement: Assessment manifests identify the evaluation setup
Run, summary, and primitive-validation manifests SHALL identify their simulator fingerprint and source revision. Run and summary manifests SHALL also identify network, demand, calibration-input and split hashes, period, scale, duration, initialization, measurement window, and seed identities. A summary SHALL record the content hashes of the runs it summarizes.

#### Scenario: A different demand file has the same area name
- **WHEN** two reports share an area name but their demand hashes differ
- **THEN** the assessment recognizes them as different run sets and combines them only in their explicitly declared main and cross-validation roles

### Requirement: Assessment variants isolate all outputs
A variant assessment SHALL resolve a separate output set for seed files, native summaries, assessment reports, noise files, and derived status. A suffix SHALL protect all published outputs. Replacement of published evidence SHALL require an explicit overwrite operation after compatibility and completeness checks pass.

#### Scenario: Suffixed variant produces noise
- **WHEN** a suffixed variant assessment writes its summaries and noise
- **THEN** their paths belong to the variant output set and all published evidence files remain byte-identical

#### Scenario: Unsuffixed run without an explicit overwrite
- **WHEN** an assessment of the published set is requested without the overwrite option
- **THEN** it stops before writing and names the option, and published evidence is unchanged

#### Scenario: Diagnostic output
- **WHEN** a partial or unverifiable run set is assessed as a diagnostic
- **THEN** the report is labeled a diagnostic with its actual sample size, issues no calibration or stability verdict, and is never written to the published set

### Requirement: Primitive deviations remain visible in validity claims
An assessment SHALL carry the matching primitive-validation results, known deviations, and their documented relevance to its intended comparisons. A known-deviation regression exemption SHALL remain a failed evidence check. Missing or incompatible primitive evidence SHALL prevent an unqualified validity claim. A limited-use exception SHALL name the failed check, supporting rationale, and follow-up rather than report a primitive pass.

#### Scenario: Known regression exception
- **WHEN** a primitive remains outside its cited evidence range but is exempted from the regression test
- **THEN** the assessment displays the failure and its implications for the intended use separately from the regression result and count-fit verdict

## MODIFIED Requirements

### Requirement: Station results are reported by source and count year
The demand fit report and the assessment SHALL list, for each period, the number of stations below GEH 5 per source and count year, fitted and held out. The station rule (more than 85% below GEH 5) SHALL be judged on the hourly counts of the last `recentYears` years before `referenceYear` (both from the area's demand config). The held-out stations SHALL be scored on the cross-validation demand, a fit that left them out, run with the same simulator, seeds and period as the shipped demand, so that their pass rate is out of sample; their pass rate on the shipped demand SHALL be reported as "validation stations, in the shipped fit" and SHALL NOT be judged. The rule SHALL NOT pass on fewer than 10 recent held-out stations; the report SHALL say they are too few to judge. A station target that is a scaled copy of another period's count SHALL NOT be judged, a station target derived from a daily total SHALL NOT be judged (see "Derived targets are left out of the pass counts"), and a period with no hourly counts of its own SHALL be judged on stability only, with the report saying so. The pass rate of older counts and of all counts SHALL be reported beside the recent ones. The calibration note and the Sources page SHALL state that the recent set rests mostly on one source when it does, with the numbers, and SHALL NOT quote pass rates of derived targets as counts. Claims of out-of-sample or independent evidence SHALL satisfy the observation-dependency and validation-scope requirements.

#### Scenario: Recent sources
- **WHEN** a period's stations are scored
- **THEN** the report gives the pass counts of the recent stations, fitted on the shipped demand and held out on the cross-validation demand, with the verdict, and the pass counts of older stations and of all stations beside them

#### Scenario: One dominant source
- **WHEN** most recent stations come from one source counted on one day
- **THEN** the assessment names the source and the count of its stations among the recent ones

#### Scenario: Too few held-out stations
- **WHEN** a period has fewer than 10 recent held-out stations
- **THEN** the report says they are too few to judge and the status is not `calibrated`

#### Scenario: Midday
- **WHEN** every midday target is the PM count times a factor
- **THEN** the verdict says there are no midday counts and midday is checked for stability only

#### Scenario: A period whose only targets are derived
- **WHEN** every target of a period is a scaled copy of another period's count or is derived from a daily total
- **THEN** the verdict says the period has no hourly counts and judges it on stability only

