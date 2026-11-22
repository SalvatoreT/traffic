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
- [x] 4.3 Recompute the published Rockridge packages with the new final-comparison method; record changed estimates/classifications and all run failures.
  Closed 2026-11-22: the published Rockridge packages were recomputed with the paired method and the frozen-shortlist confirmation. `public/data/rockridge.proposals.json` is version 5; its group `computed` records `reportMethod` paired-t-3, simulator 6b886c8f52ee07397773ddd0ebbcb447, network 53c823f20d9165ed, demand 2d16d8f8eb0950ca, search seeds 1 to 3 and confirmation seeds 101 to 110 (role `confirmation`), and `data/proposals/rockridge.md` states the interval method. The classifications and every run failure are recorded in the evidence of the search that published the set: `openspec/changes/archive/2026-11-20-calibration-round-52/evidence/search/README.md` (all five comparisons between neighboring options resolved, where the earlier search left one unresolved; the finalist screens rejected 10 of 39 packages, all for unroutable PM trips, against 8 of 40 and 8 of 38 in the two earlier searches) and `compare.md` beside it. The 2026-11-21 republish reran the same search on the faster simulator with identical options and figures (`data/calibration/rockridge.record.md`, "Published set regenerated on the faster simulator").
- [x] 4.4 Run Rust and TypeScript tests relevant to proposal generation/readers, validate this OpenSpec, and inspect the rendered cards and exports.
- [x] 4.5 Apply the humanizer skill to final prose, document the resulting contract, and archive only after implementation and verification.
  Closed 2026-11-22: the contract is documented in `data/proposals/README.md` (provenance fields, `reportMethod`, annotate checks, the paired and confirmation estimates, the raw maximum next to the penalty block). The change prose was read against `.claude/skills/humanizer/SKILL.md` with no tells to fix. Of the ten delta requirements, five are ADDED and new; the four MODIFIED requirements "Published with provenance", "Annotating an existing file", "Search for low-harm packages" and "Stable options" still equal the main text this change replaced, so they apply unchanged. The fifth, "A looser search is never worse than a stricter one", had been generalized in main after this change was written (profile-neutral wording and scenarios), so the delta was hand-merged: it now carries the main text with the one change this change makes (a seeded package is not dropped for failing to beat a simpler package, replacing "within noise of"). Validated strictly, then archived.
