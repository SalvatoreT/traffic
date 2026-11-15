## 1. Define and test the comparison contract

- [ ] 1.1 Define node/movement selectors, baseline/closure/package identities, measurement windows, lifecycle bins, and result schema on top of existing manifests.
- [ ] 1.2 Establish stable requested-trip keys and attribute checks; reproduce UID divergence from scenario-dependent initial loading before relying on any existing identifier.
- [ ] 1.3 Add synthetic fixtures for bypass legality, period bans, partial-leg filters, repeated passages, delayed completion, and unmatched/preplaced requests.

## 2. Add engine diagnostics

- [ ] 2.1 Expose canonical effective movement permissions and verify structural witnesses against them for each mode, period, and scenario.
- [ ] 2.2 Add opt-in request/lifecycle and timestamped passage records, with separate initialization and measurement strata.
- [ ] 2.3 Aggregate cohort routes and mutually exclusive outcomes; reconcile net link/block changes with cohort, other-request, and initial/unmatched contributions.
- [ ] 2.4 Preserve raw all-car counts and valid origin/destination passage classes by direction and period, mark unavailable classifications explicitly, and reuse current paired uncertainty and health reporting.
- [ ] 2.5 Bound route-detail storage with exact aggregate counts and disclosed coverage; measure runtime and memory before choosing limits.

## 3. Expose the diagnostic

- [ ] 3.1 Add local CLI selection and export using the shared diagnostic contract, clear provenance, and actionable errors for incomplete or incompatible evidence.
- [ ] 3.2 Add a closure/proposal entry point, baseline/closure/package comparison, and accessible map/table with possible paths, observed cohort routes, and net all-traffic changes clearly labeled.
- [ ] 3.3 Make all-traffic consequences prominent on proposal cards using current v5 fields; retain unresolved estimates and distinguish missing attribution from zero diversion.
- [ ] 3.4 Version stored diagnostics and refuse incompatible reuse; retain legacy aggregate figures only with their existing evidence status.

## 4. Verify and document

- [ ] 4.1 Verify cohort/outcome conservation, exact passage reconciliation, attribute-mismatch handling, and every truncated/partial result state.
- [ ] 4.2 Prove tracing on/off does not change the final implementation's runs and verify native/WASM diagnostic parity.
- [ ] 4.3 Rerun the historical Colby/North question on the repaired engine and current inputs with the established seed policy; report updated routes, all-car effects, health, and limitations without tuning toward old numbers.
- [ ] 4.4 Verify keyboard, screen-reader, non-color, and narrow-screen use; document CLI commands and diagnostic limits.
- [ ] 4.5 Validate the completed OpenSpec strictly and archive only after implementation and verification.
