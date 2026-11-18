## 1. Preserve and reproduce the benchmark

- [x] 1.1 Read `findings.md` and verify the committed evidence manifest and source/input identities before interpreting or rerunning the benchmark.
- [x] 1.2 Add a portable finite-space runner using the production evaluator, canonical intervention decoder, conflict/access checks, objectives, and score. Preserve every rejection and separate visited packages from forwarded finalists.
- [x] 1.3 Test enumeration, deduplication, ties, canonical intervention round trips, isolated search caches, and deterministic replay. Keep exhaustive results inaccessible to competing search decisions.
- [x] 1.4 Support explicitly recorded cold runs and known-package runs, with identical known inputs across competitors and mandatory recheck work reported separately.

## 2. Diagnose and supplement candidate coverage

- [x] 2.1 Record candidate inclusion and exclusion reasons by canonical intervention; reproduce the three Dana omissions on the frozen inputs without assuming current inputs are identical.
- [x] 2.2 Prototype bounded supplementary closure candidates from the existing legal movement graph, recording bypass witnesses and applying current profile, access, and conflict rules.
- [x] 2.3 Test a quiet legal bypass on a synthetic network and prevent street-name or Rockridge-ID special cases. Keep the existing Slow Street eligibility rule unless a separately documented spec amendment is justified.

## 3. Test bounded exploration

- [x] 3.1 Record pruning decisions for positive-single extensions, same-place variants, beam width, repair moves, and stopped lineages.
- [x] 3.2 Add regression fixtures for useful combinations of weak singles and alternative junction designs whose value changes with the surrounding package.
- [x] 3.3 Prototype deletion/replacement moves and coordinated or alternative-variant starts behind an experimental setting, sharing the evaluator/cache and enforcing all package constraints.
- [x] 3.4 Freeze total budgets, budget allocation, tie rules, benchmark cases, and practical quality/runtime acceptance criteria before evaluating challengers. Compare with the unchanged beam at equal charged cost; label extra-budget comparisons separately.
- [x] 3.5 Report best-score gap, exact nondominated coverage where available, finalist coverage, all-car displacement, resident detour, rejection counts, and runtime. Include cold and known-package results and cases beyond the recorded Rockridge candidate set.

## 4. Test screening fidelity and confirm

- [x] 4.1 Preregister a comparison of screening horizons or seed counts with fixed model inputs; charge simulation work consistently and measure shortlist/rank stability against full-hour selection runs.
- [x] 4.2 Freeze the comparative shortlist before independent confirmation; record every selected package and outcome, use unused seeds, and retain unresolved paired comparisons and adverse street-level changes.
- [x] 4.3 Reconcile the existing paired-evidence and redistribution contracts, including raw versus adjusted harm, pointwise maximum intervals, incomplete-trip limits, and separate search-method provenance.
- [x] 4.4 Select production defaults only if the declared quality/cost criteria pass; otherwise retain the current defaults and document the result. Run relevant Rust tests and any affected CLI/schema tests.

## 5. Complete the implementation handoff

- [x] 5.1 Update the implementation record with adopted choices, rejected alternatives, evidence paths, and remaining limits. Keep results for different extents or input hashes separate.
- [x] 5.2 Validate the completed OpenSpec change, archive it with the implementation once checks pass, and commit the resulting specs and code.
