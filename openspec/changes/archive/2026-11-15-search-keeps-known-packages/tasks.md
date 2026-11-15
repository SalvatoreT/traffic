## 1. Diagnosis
- [x] 1.1 `explore --check LINK [--check-subsets] [--check-singles]`: profile, candidate list, access check, screening and full recheck of given packages
- [x] 1.2 Evaluate the six-filter package and every subset; record the cause in design.md

## 2. Seeds
- [x] 2.1 `explore/seeds.rs`: file format, canonical key, record, cap, decode, sub-packages
- [x] 2.2 Adopt seeds like warm-start packages (profile, clash, access, duplicates) with reasons
- [x] 2.3 Recheck every seed in full; screen seeds and sub-packages; start a beam from them
- [x] 2.4 Binary: load and record the seeds file, `--known`, `--no-known`, `--add-seed`, `--seed-proposals`, `--seed-labels`

## 3. Search
- [x] 3.1 Phased harm weight for ranking partial packages; one variant per place; line stops on the ranking at the new level's weight; no package larger than the depth
- [x] 3.2 Stable options and lightest option in `select_options`
- [x] 3.3 Provenance in the proposals file and the report; `computed.knownPackages`

## 4. Tests
- [x] 4.1 Seeds decode, forbid, dedupe, cap
- [x] 4.2 Seeds always rechecked and eligible; sub-package starts
- [x] 4.3 Stability preference; provenance fields
- [x] 4.4 Unconstrained offers everything charter does and is never worse

## 5. Run
- [x] 5.1 Seed the file from the six-filter link, the current and previous proposals and the report history
- [x] 5.2 Charter search, then unconstrained, on the real files; annotate
- [x] 5.3 Archive
