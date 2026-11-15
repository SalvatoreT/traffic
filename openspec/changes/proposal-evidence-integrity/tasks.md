## 1. Provenance

- [x] 1.1 Add simulator fingerprint, reporting-method version, effective run settings, and source revision to proposal group output; define compatibility for legacy groups.
- [x] 1.2 Share freshness semantics across the UI, annotation, text output, and proposal picture export; include code-only changes and unknown provenance.
- [x] 1.3 Make annotation reject incompatible groups before writing; test that numeric figures and pictures cannot acquire different simulator provenance.

## 2. Paired comparison evidence

- [x] 2.1 Retain baseline and scenario output by period and seed through final comparisons; reject missing or mismatched pairs.
- [x] 2.2 Document and verify the statistical method, seed schedule, precision rule, period aggregation, and handling of small samples against a cited source before implementation.
- [x] 2.3 Implement paired effect summaries and option-to-option comparisons; publish mean effect, sample count, interval method/level, and unresolved status.
- [x] 2.4 Separate practical floors from sampling uncertainty and state the limits of fixed-input seed intervals.
- [x] 2.5 Record whether final estimates participated in selection; require a frozen shortlist and unused recorded seeds for independent confirmation claims.
- [x] 2.6 Reconcile option retention and stability in `search-keeps-known-packages` with the new comparison contract.

## 3. Maximum exposure and readers

- [x] 3.1 Separate raw-maximum blocks and values from adjusted-penalty blocks and values for through traffic and per-period all traffic.
- [x] 3.2 Migrate the proposal schema and update cards, detail tables, text pages, and exported pictures; report unresolved increases without calling them absent.
- [x] 3.3 Add the R2 fixture and deterministic ties; verify before/after values come from the selected raw-maximum block.

## 4. Verification and publication

- [x] 4.1 Reproduce the R1 freshness failure and make the new provenance tests pass.
- [x] 4.2 Test identical means with different paired spreads, correlated period outputs, missing pairs, one seed, and unresolved effects.
- [ ] 4.3 Recompute the published Rockridge packages with the new final-comparison method; record changed estimates/classifications and all run failures.
- [x] 4.4 Run Rust and TypeScript tests relevant to proposal generation/readers, validate this OpenSpec, and inspect the rendered cards and exports.
- [ ] 4.5 Apply the humanizer skill to final prose, document the resulting contract, and archive only after implementation and verification.
