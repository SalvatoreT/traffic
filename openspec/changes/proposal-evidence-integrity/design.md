## Context

Reviewed source: `415df88` on 2026-11-15. The user asked for observations and fix proposals committed to `main`, with implementation left to a later agent. This change stays open after the review commit. The audit found the failures below in the reporting contracts; it did not rerun the full Rockridge search or establish that a particular published package changes rank after correction.

## Findings and evidence

### R1. A simulator change does not make proposal figures stale

Priority: P1. Confidence: high; confirmed from the writer, reader, and annotation path.

- `crates/sim/src/explore/report.rs:776` writes date, periods, seeds, run length, network hash, and demand hash into `computed`, but no simulator fingerprint.
- `src/lib/proposals.ts:38` has the same omission. `staleInputs` at line 129 checks only network and demand, and `proposalNotices` at line 137 uses that verdict.
- `crates/sim/src/explore/annotate.rs:37` accepts a file using only those two hashes, then runs the current simulator and replaces `picture` while preserving its numeric headline and the old computation date.
- Stored full-hour results already check a simulator fingerprint (`src/lib/stored-results.ts:85`). The proposal card and its opened simulation therefore have different freshness rules.

The following reader probe was run from the repository with Node's `tsx` import hook:

```sh
node --import tsx --input-type=module <<'JS'
import { proposalNotices } from './src/lib/proposals.ts';
const computed = {
  date: '2026-11-15', periods: ['pm_peak'], seeds: [1, 2, 3],
  networkHash: 'aaaaaaaa', demandHash: 'bbbbbbbb',
  calibration: 'uncalibrated', simulator: 'old-engine'
};
console.log(proposalNotices(computed, {
  network: 'aaaaaaaa', demand: 'bbbbbbbb', simulator: 'new-engine'
}));
JS
```

Observed: `{ exploratory: true, stale: false, staleText: '' }`. The extra simulator fields make the omission visible; neither side of the existing typed API accepts or checks them. This establishes the missing check, not that the currently published files were computed with another engine. A code-only model change can leave the proposal cards unflagged and permit annotation to mix old figures with new pictures.

### R2. The named maximum can be smaller than the actual maximum

Priority: P2. Confidence: high; reproduced by calling the compiled Rust functions and the UI formatter.

`harm_calc` (`crates/sim/src/explore/search.rs:189`) finds the largest increase after subtracting each block's noise band. `through_harm` (`report.rs:148`) then reports that block's raw increase. The per-period all-traffic fields use the same selected block (`report.rs:228`). The UI calls it "the block that gains the most" (`src/lib/proposals.ts:208` and `src/components/Proposals.tsx`'s all-traffic table), while the current specification requires the largest increase.

Rust probe, compiled in a temporary Cargo project with `traffic-sim` as a path dependency:

```rust
use traffic_sim::explore::{search::harm_calc, report::through_harm};
fn main() {
    let h = harm_calc(&[100.0, 50.0], &[40.0, 0.0]);
    let t = through_harm(&[100.0, 50.0], &[40.0, 0.0]);
    println!("{} {} {} {}", h.worst, h.worst_adj, h.n_above, t.increase);
}
```

Observed: `1 40 2 50`. Block A gains 100 cars/hour with a band of 80; block B gains 50 with a band of 10. Both exceed their band, but the function names B. Passing B to `harmHeadline` produces "+50 through cars an hour ... the block that gains the most". These numbers are a synthetic regression fixture, not Rockridge measurements. The adjusted penalty can remain a search choice, but its selected block cannot also stand for the raw maximum without a different label.

### R3. Baseline spread does not measure uncertainty in a scenario difference

Priority: P1 for claims that distinguish or rule out effects; methodological limitation confirmed in the code. Its effect on the current option ordering is unmeasured.

`period_stat` (`search.rs:44`) reduces each set of runs to separate means and standard deviations. Final comparison then uses only baseline block deviations (`report.rs:212`, `214`, `226`) to classify increases. `goal_noise_pct` (`report.rs:285`) uses only baseline variation and the seed count to decide whether options differ enough. The scenario's variability and the covariance of paired runs do not enter either decision. The arrays needed to measure paired differences are discarded before comparison. `base_cv_pct` at line 706 also averages coefficients of variation across periods instead of computing variability of the actual aggregate effect.

For a counterexample, take baseline flows `[100, 100, 100]` and scenario flows `[80, 100, 180]` on one block. The mean increase is 20 cars/hour and baseline spread is zero. `harm_calc(&[20.0], &[0.0])` classifies the increase as above its 10-car floor, regardless of the scenario spread. The paired differences `[-20, 0, 80]` span both signs. The same mean with scenario flows `[120, 120, 120]` gets exactly the same classification despite having constant paired differences. These are diagnostic fixtures, not estimates of observed traffic. Similarly, the executed `goal_noise_pct(0.0, 3)` probe returns the 1% floor for any scenario variability.

A dead band is a valid engineering rule if labeled as such. The current UI says "beyond run-to-run variation" and "No block gains through traffic beyond run-to-run variation" (`src/lib/proposals.ts:201`), which requires evidence about the comparison being reported. Absence of a resolved increase is also different from evidence that increases are negligible. `docs/simulator-audit.md` already records the need for paired final comparisons and enough seeds in C3 and S2; this proposal supplies the missing implementation contract. The supporting guidance is [WebTAG-M3.1, C.3.14 and C.9.1; TfL-TMG4, section 7.5.1], using the existing verified bibliography entries. No new source verification was performed in this review.

The final recheck participates in choosing the published options, and it reuses the search's seed list (`report.rs:173`, `608`). Reported uncertainty therefore also needs an explicit statement about selection. Reusing those runs is acceptable for an exploratory estimate; an independent confirmation claim needs a seed set held out from candidate selection. This is a proposed protection against selection bias, not a measured bias in the current outputs.

## Decisions

### D1. Complete proposal provenance and enforce it at every reuse point

Record the existing simulator fingerprint, a version for the report/uncertainty method, and the effective run settings with every group. The simulator fingerprint intentionally excludes the search/report modules (`crates/sim/fingerprint.rs`), so it cannot identify a change in the estimator or ranking rule by itself. Retain raw input hashes and record any preprocessing version that changes simulation inputs. Expose legacy or unknown provenance as unverified; never silently attach the current fingerprint to old results.

The UI, annotation command, text generator, and picture generator must use a shared definition of current evidence. Annotation may update a picture only when its inputs and engine match the stored figures. Otherwise it stops before writing and names the incompatible group. Recomputing a complete package result is a separate explicit operation.

Alternative considered: use the Git commit as the only identity. That would invalidate results after documentation-only changes and does not express the estimator contract. Keep the source revision as useful provenance, with the relevant fingerprints controlling reuse.

### D2. Retain seed pairs and state what the uncertainty covers

Preserve each baseline and scenario run keyed by period and seed through final comparison. Compute effect summaries from the paired differences, including the actual period aggregation used for the published headline. For option-to-option claims, compare those options on matching seeds rather than applying the baseline's spread to both. Document and test the interval method, seed schedule, handling of small samples, and the rule for unresolved comparisons before implementing selection changes [WebTAG-M3.1; TfL-TMG4].

Use a fixed seed schedule with a documented precision/stopping rule. The earlier audit's ten-seed starting point can guide the initial implementation, but a count alone does not guarantee adequate precision. The implementation design must verify the chosen estimator's statistical reference and numerical examples before presenting intervals as confidence statements. Keep the existing practical floors labeled as assumptions, separate from sampling uncertainty. Model uncertainty, demand uncertainty, and observed day-to-day variation remain outside a fixed-input seed interval and must be stated as such.

Keep candidate discovery and final confirmation distinguishable. If results were used to choose the winner, label the intervals exploratory. To claim independent confirmation, freeze the shortlist and use a recorded seed range excluded from discovery and selection. Revisions based on those confirmation outcomes require a new confirmation set or a stated exploratory status.

Alternative considered: increase the number of seeds while keeping the current baseline-only band. More baseline runs cannot recover the missing variability of scenario effects. Alternative considered: add scenario and baseline variances as if independent. That loses the pairing already available and can misstate precision when their outputs are correlated.

### D3. Separate raw exposure, uncertainty, and the search penalty

Compute the largest raw mean increase directly, for through cars across the stated periods and all cars within each period. Store its block identity and before/after values even when the comparison is unresolved. Store the block and value selected for the adjusted search penalty in separate fields with explicit names. Deterministic tie handling must be consistent across native output and UI formatting.

The UI may say that a result is unresolved under the selected uncertainty method. It must not turn that status into a claim that no block gains traffic. If a threshold for a practically negligible increase is adopted, label it as an assumption and use an explicit equivalence/non-inferiority assessment before making that stronger claim. No threshold for acceptable neighborhood harm is selected by this proposal.

Alternative considered: rename the current field everywhere to "largest gain after the dead band". That would repair the label but leave the raw maximum unavailable for scrutiny. Publish both quantities so readers can inspect the consequence and the search rule separately.

## Implementation order and compatibility

Implement provenance first, then paired result retention and reporting, then raw maximum semantics and reader migration. Update the schema once for the combined contract. Keep legacy packages available as scenario links with visibly unverified evidence; recompute their figures before labeling them current. Reconcile this change with the active `search-keeps-known-packages` change, particularly design D6, without undoing its candidate-retention behavior.

## Validation and remaining limits

Use the R1 and R2 examples as regressions and add R3 fixtures with identical means but different paired spreads, correlated period outputs, one seed, missing pairs, and unresolved differences. Verify same-run provenance across cards, pictures, and text exports. Run the published Rockridge packages through the updated final comparison and record changed classifications without discarding inconvenient cases. This review establishes software/reporting defects and a missing uncertainty method; it does not establish the size or direction of any real-world intervention effect.

## Implementation record (2026-11-15)

### Verification of the audit's claims

Each claim was checked against the code before any change.

- R1 is confirmed. The writer (`report.rs`, the `computed` block) recorded no simulator fingerprint. `staleInputs` and `proposalNotices` compared only network and demand. `annotate` accepted a file on those two hashes, re-simulated with whatever engine was built, replaced the pictures and kept the old figures and date. The audit's reader probe returns `stale: false` for matching hashes and different engines.
- R2 is confirmed, with one refinement. `harm_calc` named the block with the largest gain past its band, and `through_harm` reported that block's raw increase. When no block passed its band the fallback was the raw maximum, so the mislabel appeared only when at least one block passed its band and a different block had the larger raw gain. The audit's fixture (gains 100 and 50, bands 80 and 10) now returns raw block A with 100 and penalty block B with 40, and is a regression test.
- R3 is confirmed. `period_stat` reduced each period to means and baseline-only deviations; the paired arrays did not survive, `goal_noise_pct` and `base_cv_pct` used only baseline spread, and the final recheck shared the search's seed list. The audit's counterexample (baseline spread zero, equal mean effect, scenario spread different) classified both increases the same way under the old band and gets different summaries now.

No claim was rejected.

### The statistical method (task 2.2)

What the cited guidance supports, checked in the source documents on 2026-11-15: [WebTAG-M3.1] C.3.14 asks for the variability across seeds and confidence intervals, and for a demonstration that enough runs were made to tell the interventions apart. C.9.1 gives 10 runs as a starting point, "not intended as an endorsement of a particular number", and forbids picking seeds. C.10.1 asks for the number of runs and the seeds to be documented. [TfL-TMG4] 7.5.1 asks for 20 seeds for validation, a continuous range with a fixed increment, all seeds listed, and the same seeds on the proposed runs, and notes that the number needed can be calculated from a required confidence level. Neither document gives an interval formula, a confidence level, a paired comparison of options or a stopping rule. Those parts are ours.

- Interval: the two-sided 95% Student t interval on the per-seed differences, scenario minus baseline on the same period and seed [NIST-Handbook, 7.2.2.1 for the interval, 1.3.5.3 for forming the pair differences, 1.3.6.7.2 for the critical values; the table is compiled into `paired.rs`]. ASSUMPTION: the 95% level (the guidance names none), and that per-seed differences are close to normal, which was not tested for these outputs. Beyond 60 degrees of freedom the value at 60 is used, which is slightly wide.
- Periods: equal-weight mean of the periods within each seed, then paired by seed. This is the headline's own aggregation, and the correlation between periods inside a seed is part of each difference.
- Percent: the interval of the vph difference divided by the baseline mean. ASSUMPTION: the baseline mean is treated as fixed in the denominator; the pairing already puts the baseline's variation into the numerator.
- Option differences: the two scenarios on the same seeds, scenario against scenario. The baseline cancels.
- Seeds: a fixed schedule, 1 to 10, with at least 10 pairs needed before a status other than `insufficient` is given. ASSUMPTION: 10 as the minimum [WebTAG-M3.1, C.9.1]. There is no adaptive stopping rule. The published interval width is the evidence of precision, as C.3.14 asks. The audit's ten-seed starting point is kept.
- The block with the largest raw increase is selected from many blocks, so its interval is not adjusted for that choice (winner's curse); `computed.estimation.maximum` says so. The count of blocks with a resolved increase is not adjusted for multiple comparisons either.
- Practical floors (the block band and its floor, the 1% reduction floor) stay separate, labeled assumptions, and never appear as intervals.

### Selection and confirmation (task 2.5)

The finalist rechecks both choose the options and estimate them, so their intervals are exploratory and carry `role: selection`. `--confirm-seeds` freezes the chosen options and the references and reruns them, with a baseline, on seeds that must not overlap the discovery seeds. The published figures then come from those runs and carry `role: confirmation`; `computed.seeds` holds the seeds of the published estimates and `computed.estimation.selection` holds the discovery seeds, the confirmation seeds and the shortlist links. If a confirmation run flags a rejection reason it is not used to change the list: that would need a new confirmation range. The search never claims confirmation without the separate seeds.

### Reconciling option retention with `search-keeps-known-packages` (task 2.6)

Its design D6 and its specification used a noise band from the baseline's cut-through spread for three rules: dropping a package that is within noise of a simpler one, keeping a published package over a new one within noise, and dropping a published package for dominance only when the new one wins by more than the band. All three now use one predicate, `beats(a, b)`: the interval of the per-seed difference between the two packages on the same seeds lies on a's side and the mean gap is at least the 1% floor. Without at least 10 paired runs (or with runs that are not the same pairs) only the floor on the means applies, and the output says the evidence is insufficient. A package is also listed as reducing through cars only when its own paired interval is below zero (or the evidence is insufficient and it passes the floor). The stricter group's forced packages, the lightest-option rule, the Pareto-consistent listing and the beam are unchanged. The `proposals` requirement "Stable options" is modified in this change's delta.

### Schema and legacy handling (tasks 3.1, 3.2)

The proposals file is version 5. The reader still accepts versions 2 to 4. A version 4 group keeps its figures and is marked unverified (no simulator, method or settings) and without intervals. Its one worst block is read as the block the search flagged (`adjustedPenalty`, penalty null) and its summary sentence is rewritten to say so; the reader never builds a largest-increase block from it. Groups that lack the through-car measures stay out of date with no options, as before. Text pages, preview cards, exported pictures and the share-path lookup use `evidenceStatus`; a stale group is not drawn as current, an unverified group is drawn with its status in the text. The Rust annotator applies the same rule in `provenance.rs` and refuses a legacy group, so a version 4 file cannot be annotated; it needs a new search.

### Cost

The final comparison needs 10 seeds instead of 3. The recheck runs every finalist, known package and reference over every period and seed, so it costs about 3.3 times more; screening and the beam are unchanged. Measured on 2026-11-15 on a shared 4-core machine (smoke run: one period, beam 2, depth 2, 10 seeds, 20-minute runs): about 0.9 core-seconds per simulated minute under load, and 0.54 in the last published run of 5,578 s on 4 jobs for one group (1,233 screening runs at 20 minutes, about 30 packages rechecked on 3 periods and 3 seeds at 60 minutes). With 10 seeds the same group needs about 54,000 simulated minutes of rechecking instead of 16,200, so roughly 2 hours of rechecking alone and about 3 hours for the group, above the 2-hour limit of one background command. Ways to fit: run each profile in its own command (already supported), lower `--finalists`, `--budget-evals` or the beam, or hold the seeds file below its cap of 20. The smoke run itself took 23 minutes. A staged recheck (three seeds to shortlist, ten for the survivors) would cut the cost further but changes which packages reach the final comparison, so it is left as a decision for the person running the search.

### Remaining limits

The intervals cover seed variability under fixed inputs. They say nothing about calibration error, demand error or real traffic. Task 4.3 (recomputing the published Rockridge packages) is left for after the engine changes land, and the search has not been run in full for this change.
