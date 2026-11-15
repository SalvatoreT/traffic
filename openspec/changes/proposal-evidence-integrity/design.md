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
