## Context

Audit base: `415df88`, 2026-11-15. Downloaded network SHA256: `5fe8241a6ba1e3068db2a84bed6cf523f4bcd4057f0234d1cc0e2527aa7d2352`. The current area is explicitly uncalibrated. The findings below concern the reliability of its evidence, not a claim that a calibrated model was shipped at this revision. Existing work in `calibration-round-26` separated the shipped fit from a cross-validation demand and added a suffix guard. This proposal closes gaps in those mechanisms.

The user's decision is to record findings and fix proposals now, leaving implementation for a later agent. Do not apply or archive this change as part of the audit.

## Verified findings

### C1. A held-out direction can be reconstructed from its fitted counterpart

Priority P1; confirmed by data and code. `tools/lib/demand-fit.ts:163-169` creates inward and outward hourly targets from the same AADT, K factor, and assumed directional shares. Their source-record keys differ by `entering`/`leaving`. `markHoldout` at lines 200-204 and `selectHoldout` in `tools/lib/acceptance.ts:63-76` split stations without preserving that source dependency.

The checked-in station file has these PM pairs:

| Source location | Held inward target | Fitted outward target |
| --- | ---: | ---: |
| Ashby, `544,1277` | 952 | 1,163 |
| Tunnel, `734,1282` | 1,094 | 1,337 |
| San Pablo, `-2703,-608` | 830 | 1,015 |
| Ashby gate 265 | 1,134 | 1,386 |

For the first pair, both values come from 23,500 AADT × 0.09, split 0.45/0.55 and rounded. Holding out the inward constraint leaves a fitted constraint that determines its target. Calling these independent held-out observations overstates what the test establishes. This does not establish the size or direction of bias in the reported pass rate.

### C2. Count-derived priors are constructed before the holdout

Priority P1; confirmed control flow. Gate totals are built from TMC and AADT records at `tools/build-demand.ts:242-277`; residual gate totals feed through-trip generation at lines 568-605. `markHoldout` runs only at lines 782-785. The cross-validation and shipped fits both receive `cars` from the same already-constructed `per.flows` at lines 858-877. `tools/lib/demand-fit.ts:185-188` explicitly documents that deduplicated gate constraints retain the source count as the gate's offered start value. Thus withholding a final link constraint does not withhold that observation from the estimator.

The same ordering must be audited for class defaults, local-trip scaling, assumed movement flows, shared ramp totals, and count-derived parameters. The eight currently configured assumed movements do not directly touch the selected held interior blocks; this audit does not claim they are a demonstrated additional leak in this revision. Their preprocessing needs lineage protection when the split changes.

### C3. Whole-street dependency exclusion omits interior blocks

Priority P2; confirmed exclusion gap. `tools/lib/volunteer-count.ts:248` avoids holding out the first and last block of a street. Whole-street stations store only those endpoints in `touches` at line 313; `touchesHeld` at line 338 checks only that array. The resulting route stations survive the exclusion even though their street paths cross held blocks:

| Route | Held blocks on its street path | Endpoint overlap detected |
| --- | --- | --- |
| Colby NB, 2591 → 2605 | 2593, 2601 | none |
| Colby SB, 2606 → 2592 | 2602, 2594 | none |
| Hillegass NB, 2676 → 2670 | 2674 | none |
| Hillegass SB, 2669 → 2675 | 2673 | none |

This is correlated evidence and a gap in the stated spatial-exclusion policy, not proof that each route count numerically contains the held block count. The route feature matches its first and last link and can also match detours. A dependency rule must represent the actual observation and matching semantics; blindly treating the two endpoints as a complete path is insufficient.

### C4. Reused assessments can report incompatible verdicts and sample sizes

Priority P1; reproduced without modifying repository data. `readSeeds` in `tools/lib/assess.ts:29-35` silently skips missing seeds and replaces each report's seed with the requested filename's seed. `tools/assess.ts:69` prints the requested seed count. At lines 89-90 it reads the stability verdict from the summary under `outDir`, not from the selected reused runs. No input fingerprint or duration check ties those artifacts together.

The bounded probe copies the assessment script into a temporary root, supplies only seed 1 with its removals changed to 9,999, and reads the existing ten-seed summary. The output says:

> 10 seeds (1-10, none chosen)
>
> Stability rule (D16): holds. Mean removals 9999.00 per hour … backlog under 2% in 1 of 1 seeds … old rule … passes in 9 of 1 seeds.

It also says `experimental periods: none`. This synthetic example demonstrates a reporting failure; it is not an allegation that the published assessment contains the injected values. With a single loaded sample, `seedStat` produces zero width around the mean, compounding the misleading ten-seed header.

### C5. A suffix does not isolate all outputs

Priority P2; confirmed write paths. `tools/assess.ts:28` sets `outDir` independently of `suffix`. At line 73 a suffixed variant still passes that directory to native calibration, replacing the usual summaries. At lines 212-214, `--noise` writes `public/data/<area>.noise.json` regardless of the suffix. The guard therefore protects the assessment filename but not all published evidence. Test this with temporary destinations and a stub producer; do not run a destructive demonstration on the main reports.

### C6. Regression exceptions do not enter the calibration verdict

Priority P2; confirmed evidence gap. `data/calibration/validation.md` records signal start-up lost time of 0.20 s against 1 to 3 s [FHWA-STM2008]. `crates/sim/tests/validate.rs:7` permits this and eight other known deviations so the regression check detects new failures. `tools/assess.ts` and `tools/lib/verdict.ts` take no primitive-validation result as input. A passing regression test and a flow-fit verdict therefore do not show that all relevant primitives passed their evidence ranges. These are documented limitations, but the final assessment should carry them and explain whether they affect the proposed comparisons. This proposal does not assert a numerical effect on any Rockridge intervention.

## Decisions

### D1. Split at the observation level before building demand

Assign stable observation IDs to raw records and derive every target, prior component, and shared total from those IDs. Save an explicit split manifest before fitting. Derivatives of one AADT record, including both directions and every period, belong to the same group. A withheld group is unavailable to all count-derived stages of the cross-validation pipeline. Rebuild priors and any data-derived parameters from the training set, with documented fallback assumptions where training data are absent.

This follows the calibration/validation distinction described in [WebTAG-M3.1], appendix C, already cited by the project's holdout configuration. The dependency manifest and invariance tests are engineering requirements, not claims that the guidance prescribes this particular algorithm. Splitting final station IDs alone was rejected because C1 and C2 show numerical reuse before and across those IDs.

Freeze membership while testing held-value perturbations: altering a withheld observation may change its scoring target but must not change training inputs, fitted cross-validation demand, or predictions. A deterministic split may be chosen from stable metadata; choosing it afresh from altered target magnitudes defeats this test.

### D2. Distinguish diagnostic holdouts from independent validation

State which quantities were withheld, which observations remain shared, and whether model design or parameter selection previously used the evaluation evidence. Retrospectively resplitting data used across many calibration rounds produces a useful diagnostic, but cannot erase that history. Independent validation requires a frozen model and genuinely unused observations, or an outer evaluation split that includes the model-selection procedure. Evidence from one counting day does not establish performance on other days [FHWA-TAT3-2019].

For spatial exclusion, use the observation's complete dependency definition, including aggregate counts and the path-feature semantics in C3. Report retained overlapping evidence where independence is not possible. Do not silently drop difficult stations, relabel old results as independent, or raise the pass rate by changing the evaluation population after seeing results.

### D3. Assess one compatible run set

Write manifests containing simulator fingerprint and revision, network/demand/config/target/station hashes, period, demand scale, seed, duration, initialization, and measurement window. Include the source split and count-derived preprocessing version for cross-validation runs. Require the exact requested seed set, without duplicate IDs, and require compatible manifests. Main and cross-validation demand hashes may differ by design, but their recorded roles and evaluation setup must match.

Recompute stability from those runs, or verify a summary against their exact content hashes before use. Missing or incompatible evidence stops authoritative output and lists the problem. An explicitly requested partial diagnostic may show the available observations with its actual sample count and no pass verdict. Historical reports without manifests remain readable as legacy evidence; their provenance is unknown until regenerated. Silent filename-based trust was rejected because the bounded C4 probe produces an internally contradictory verdict.

### D4. Isolate the complete output set

Resolve one output namespace for each variant and use it for per-seed files, summaries, assessments, noise, and derived status. Validate all inputs before replacing any output. Published paths require an explicit overwrite operation and compatible evidence. The existing suffix-only assessment guard is insufficient because native summaries and noise use different write paths.

### D5. Carry primitive validity as a separate result

Attach the validation-suite fingerprint, failures, source ranges, known-deviation reasons, and assessment of relevance to the intended use. A known-deviation regression exception remains visible as a failed evidence check. Missing or incompatible primitive evidence prevents an unqualified validity claim. A reviewed exception may support a clearly limited use, with its rationale and follow-up; it must not silently become a passed primitive. Repair and revalidate relevant primitives before adjusting demand to compensate for their defects. The a3 range remains the repository's existing [FHWA-STM2008] reference; no new numeric acceptance range is proposed.

## Verification and risks

Run `node --import tsx openspec/changes/protect-calibration-evidence/evidence.mjs` after installing npm dependencies and downloading the published study-area files. The probe reads repository inputs and writes its synthetic assessment only under a new temporary directory. It prints source pairs, route overlap, the missing-seed result, and the contradictory assessment excerpt.

Source grouping can reduce the number of independent held observations below the current threshold. Report insufficient evidence instead of compensating with weaker group definitions. Rebuilding priors may worsen scores or change the calibration status; neither outcome alone establishes a simulator regression. Full evaluation requires the raw data inputs and can be expensive, so begin with small lineage fixtures and then regenerate the recorded Rockridge assessment once the implementation passes.

## Implementation record (2026-11-15)

The probe was rerun on the audit base before any change. C1, C3 and C4 reproduce exactly as written. C5 was checked by running the unmodified `tools/assess.ts` from `HEAD` against a stub producer in a temporary root: a run with `--suffix variant --noise` replaced the published ten-seed summary and `public/data/<area>.noise.json`. C2 and C6 are code and data traces and read as the audit states them. No finding is disputed.

### How the decisions were realized

- Observation groups (D1). A station derives from source observations: a Caltrans AADT record, a turning-movement count leg, a published ramp row, a volunteer-count block. Both directions and every period of one observation are one group, and so are the gate and link stations that carry the same record. Ramps that share a published row share a group. Groups are built by union-find over shared observation ids (`tools/lib/lineage.ts`). Intersection counts from environmental documents stay one station per published row. Flow conservation between the legs of one intersection is not a shared row and is listed as retained correlated evidence in the manifest.
- Frozen split (D1). `build-demand.ts --freeze-split` writes `data/demand/<area>.split.json` from station ids, corridors and observation ids. No count value is read: groups are ordered inside each corridor by a hash of their id, every fourth is held (at least one per corridor), and the volunteer-count blocks keep their structural rule. Every build refuses to run without the manifest, and the shipped build refuses to run when the manifest no longer matches the stations it would make. The old rule ordered stations by target size, which is why a changed held value could move a station between sets.
- Training view (D1, C2). `build-demand.ts --view training` builds the cross-validation demand as a build of its own, with the held groups' observations removed from every count-derived step: gate totals from turning-movement legs and AADT records, class defaults from counts, ramp volumes, volunteer-count trip ends and local-trip scaling, assumed movements, and the fit. The inner "fit twice" step is gone, so no trip table preprocessed from a held observation reaches the cross-validation fit. A guard stops the build if any station of a withheld group, or any station that derives from a withheld observation, is still present. Fallbacks, all labeled assumptions: a gate whose nearest AADT record is withheld takes the class default instead of another gate's record (using that record twice trips the existing "a count is used once" check), a ramp whose published row is withheld takes `ramps.defaultAdt`, and an assumed movement whose counted movement or whole-street route is withheld is not assumed in that view.
- Aggregate counts and C3. A turning movement covers its two links. A whole-street route covers every directed link of the street that lies on some path of same-named links from the end of its first link to the start of its last (`routeSupportLinks`). An aggregate whose support contains a held block is left out of the training view and is not scored; the manifest lists it with the blocks it overlaps. The path feature in the fit and the simulator matches any route that uses the first link and later the last, so a detour off the street also matches. That part cannot be listed statically and stays a stated limit.
- Perturbation test (1.4). `tools/lineage.test.ts` freezes a split, scales every raw value, and checks that the split, the group membership, the training stations and the withheld set are identical while the held stations' scoring targets change. The full pipeline was also run twice on a copy of the raw inputs with a held observation perturbed; the check is described under verification below.
- Manifests (D3). The calibrate binary writes a `manifest` into every per-seed report and the ten-seed summary: simulator fingerprint (`traffic_sim::FINGERPRINT`, a hash of what can change a run), revision and dirty flag, SHA-256 of the network, demand, targets, stations, split, demand config, area config and groups files, the demand's own build provenance (`build.view`, split hash), period, scale, seed, minutes, warm-up, measurement window, initial load and settings. `tools/lib/run-manifest.ts` checks the requested seeds, the manifest of each run, agreement inside a set, agreement of the inputs with the files on disk, and the roles of the two demands (`shipped` and `training`, same split hash).
- Stability (D3). `computeStability` in `tools/lib/verdict.ts` applies the D16 rule to the runs being assessed. The native summary file is no longer read for any verdict.
- Outputs (D4). `tools/lib/assess-outputs.ts` gives every (duration, suffix) its own summaries directory, seed directories, assessment file and noise file under `target/assess-variants/<name>`; the assessment file keeps its existing name. The published set is written only with `--publish`. `--diagnostic` reports whatever exists, with the real sample size, labeled as a diagnostic with no verdict, and never to the published set.
- Primitive evidence (D5). The validate binary also writes `data/calibration/validation.json` (manifest with the simulator fingerprint and a hash of the suite source, every case, its known-deviation entry). The known deviations moved from a constant in the regression test to `data/calibration/validation.deviations.json`, read by the test, the binary and the assessment. An entry counts as reviewed only with a stated relevance and follow-up. None is reviewed yet, so each of the nine stays an unreviewed failed check, and the assessment states that no unqualified validity claim is made and the status cannot be `calibrated`.
- Scope (D2, 3.1). Every assessment prints a section that labels the held-out scores a diagnostic holdout of observations earlier rounds consulted, names what independent validation would need, and lists the evidence that stays shared.

### Observations that need a decision

- The turning-movement leg stations (kind `tmc`) are scaled from one PM count for the AM and midday periods, as the ADT-based stations are, but only the ADT-based kinds are marked `derived` for those periods. The AM station rule therefore judges scaled copies of the PM leg counts as counts. This change leaves it as is; it is outside the audit and changes which stations are judged.
- Recency can take a station out of the fit (weight 0) while its raw observation still feeds the gate totals. No band has weight 0 today. If one is added, its observations need the same treatment as held groups.

### Verification

The checks below were run on the working tree of 2026-11-15, with all outputs redirected away from the published files.

- Unit and integration tests: `tools/lineage.test.ts` (groups, frozen split, perturbation, route support with detours, the four Rockridge routes on the real network), `tools/assess-integrity.test.ts` (stub producer: missing, mislabeled, stale, legacy, incompatible and foreign-view runs, variant isolation with byte hashes of the published files, stability, primitive evidence), plus the sha-256 vectors in the binaries.
- The freeze on the Rockridge inputs gives 331 scored stations in 313 groups, 76 groups (86 stations) held, and five aggregate counts left out of training (one turning movement and the four whole-street routes). The previous split held 79 stations. Of those, 39 stay held.
- Among the previously held stations, ten have a fitted counterpart in the same dependency group: the inward station of each Caltrans pair (Ashby, Tunnel, San Pablo), `gate 265 in`, `gate 295 in`, `gate 763 in`, and four turning-movement legs. Seven previously held blocks lie under a withheld aggregate count.
