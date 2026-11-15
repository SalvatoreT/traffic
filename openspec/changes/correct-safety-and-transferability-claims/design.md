## Context

Reviewed commit: `415df88`, 2026-11-15. Findings below concern the meaning of computed values and the evidence supporting statements about them. The model already warns that its baseline is uncalibrated and its safety measures are surrogates. Those warnings should remain, but they do not resolve mismatched variables or combined injury endpoints.

## Findings and evidence

### SAF-1: Cyclist curve input does not match its source

Priority: P2. Confidence: high from source and code inspection. The numerical effect on a particular Rockridge proposal has not been measured.

`crates/sim/src/params.rs:187` describes [Lubbe2022] as a curve against closing speed for a cyclist impacting the front of a passenger car. `crates/sim/src/sim/modes.rs:375-377` passes only the motor vehicle's speed into `bike_encounter`, regardless of the cyclist's velocity. The passing calculation at `modes.rs:195-196` computes both relative longitudinal speed and car speed, but `crates/sim/src/sim.rs:2226-2230` sends car speed to `bike_pass`. `bike_pass` applies the same injury curve even for passing encounters.

The primary journal abstract explicitly defines closing speed as relative speed between crash partners and limits its sample to crashes involving the front of another passenger car. It does not validate a car-speed-only score across crossing and lateral passing geometries.

Reproduction by inspection: keep a passing car's speed fixed and vary the cyclist's speed. `bike_pass(speed, close)` receives the same `speed`, so its severity score is unchanged. The longitudinal closing speed used elsewhere in the passing logic changes. This demonstrates the input mismatch; it does not establish that this curve is valid for overtaking crashes.

### SAF-2: The summary adds incompatible injury endpoints and hides exposure

Priority: P2. Confidence: high.

`src/lib/metrics.ts:104` sums `pedInjuryRiskIndex` and `bikeInjuryRiskIndex`; line 105 labels the result a combined injury-risk index. The pedestrian curve represents AIS4+ [Tefft2013], while the cyclist curve represents MAIS3+ [Lubbe2022]. The sum assigns equal weight to two means without a common endpoint or a documented aggregation model.

`crates/sim/src/sim/modes.rs:406-407` divides each accumulated score by its encounter count and emits zero for no encounters. Encounter counts are not in the public `Vulnerable` output. Consequently, a mean score of 0.1 from one encounter and a mean score of 0.1 from 1,000 encounters look identical; an empty sample looks like a measured zero. A reader cannot assess how much exposure supports either mean or whether a change reflects sample composition.

Reproduction: construct two summaries whose pedestrian and cyclist scores are exchanged, or set both components to the same means while changing the encounter count. The combined summary loses the endpoint allocation; the output contract loses the counts. This is independent of the simulation's random seed.

### EVD-1: External averages and a fixed-demand run are assigned stronger meanings than established

Priority: P2. Confidence: high for the statements; no claim that runtime demand fitting actually uses the London target.

`docs/references.md:438` calls [Thomas2024] an empirical target and says internal volume should fall by roughly half and boundary roads should be neutral on average. Its recommended-stack table also calls these intervention targets. `docs/simulator-audit.md:131,680` calls fixed-demand displacement an upper bound.

The paper reports monitoring data from London schemes in a particular period. Its observations do not identify a Rockridge-specific expected effect. Its traffic counts also differ from this app's headline, which counts distinct through cars using any study-area side street during a modeled hour. Neither the paper nor this implementation establishes that reducing demand makes every link's volume or delay decrease monotonically after routing changes. Therefore fixed total trip demand alone is insufficient support for a link-specific worst-case claim.

This finding is narrower than a criticism of fixed-demand experiments. Holding demand fixed is a defined conditional calculation. The defect is describing that calculation as a verified bound or using an external mean as a local correctness target without a transfer argument.

## Source checks

Existing bibliography keys are sufficient. These checks do not upgrade unread equations or establish new calibration evidence.

| Key | Primary URL checked on 2026-11-15 | Checked content and limit |
| --- | --- | --- |
| [Lubbe2022] | https://tsr.international/TSR/article/view/23823 | Journal abstract: relative closing speed, crash geometry, injury endpoints, age. This review did not rederive Table 3 coefficients. |
| [Thomas2024] | https://www.sciencedirect.com/science/article/pii/S2213624X23001785 | Publisher-indexed abstract and introduction: London monitoring scope, background-trend comparison, data limitations. Direct opening returned HTTP 403; indexed publisher text was available. Full article also located at the institutional URL below. No local transfer bound is established by those sections. |
| [Thomas2024] | https://westminsterresearch.westminster.ac.uk/download/74b26baccb2dbc0d26f1ca1773b3cdcd08402ef0e79fae1908f79d77c2cb7653/6168872/1-s2.0-S2213624X23001785-main.pdf | Indexed institutional copy identified the journal article and its abstract. Full PDF was not reviewed in this audit. |
| [Tefft2013] | https://pubmed.ncbi.nlm.nih.gov/22935347/ | The repository already records abstract verification and AIS4+ points. This session's fetch returned no usable abstract text, so the coefficient verification remains the prior bibliography check. The endpoint mismatch is also explicit in `params.rs`. |

## Decisions

### D1: Preserve the meaning of the safety inputs before adding precision

Every retained source-based severity score will state its endpoint, speed definition, age assumption, and supported geometry. Supported cyclist events must use source-compatible relative kinematics. For encounters outside the validated source geometry, report the observable speed, separation, and count, with an explicit unsupported severity status. Reusing a frontal-crash curve for all passing events would retain an unverified transfer. Fitting a new curve would need evidence beyond this change. These limits follow [Lubbe2022] and [Tefft2013]; they do not assert that an encounter will become a crash.

Before implementing relative kinematics at crossings, inspect the full source's closing-speed definition and document how the simulator's vectors map to it. Do not substitute a guessed formula. A named car-speed exposure heuristic may be retained for legacy comparison only if it is clearly separated from the source-based severity score and excluded from injury-risk summaries.

### D2: Keep endpoints separate and expose the denominator

Publish encounter count, supported and unsupported counts, and the mean severity score for each mode separately. No supported encounters means unavailable, with a reason, rather than a measured zero. Remove addition of the pedestrian and cyclist means. A summed score would need a common injury endpoint and justified exposure weights, neither of which exists here. Do not label the sum of conditional injury probabilities as expected injuries: the simulator does not estimate crash probability.

Acceptance distinguishes per-encounter severity from encounter frequency. Doubling an otherwise identical sample doubles exposure count and leaves its mean unchanged; the output must show both facts. [Tefft2013] and [Lubbe2022] supply conditional injury endpoints, not an aggregate injury forecast.

### D3: Describe each experiment at its actual scope

Keep fixed-demand results as conditional simulations. Treat [Thomas2024] as external contextual evidence, with its study population and metric stated. Remove local target and guaranteed-bound wording from active documentation and generated copy. The original audit may retain its historical statements only with a nearby correction. A claimed bound would require a stated metric, assumptions, and a proof or validated procedure that establishes it; a successful example cannot establish a universal bound.

A demand-response model is outside scope. No change in software should force a local scenario to reproduce an external mean.

### D4: Record this work as an implementation backlog

The user asked on 2026-11-15 for observations and fix proposals on `main`, so another agent can implement them later. Keep implementation tasks unchecked and leave this change unarchived. Apply the repository's full implementation and archive cycle when those tasks are actually completed.

## Validation and migration

Add deterministic unit cases for cyclist velocity and encounter geometry, separated endpoint summaries, repeated identical encounters, and empty supported samples. Verify serialization, browser reports, headless JSON, proposal text, and stored-result compatibility. Bump the relevant metric/result schema when fields change and prevent old scalar scores from silently acquiring new meanings. Check corrected documentation for remaining active claims that a London average validates a local result or that fixed demand guarantees a worst case.

The proposed implementation can improve the interpretation of safety measures without demonstrating local safety validity. Validation against observed conflicts or crashes remains separate work.
