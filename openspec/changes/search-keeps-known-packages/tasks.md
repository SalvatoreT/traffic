## 1. Diagnosis
- [x] 1.1 `explore --check LINK [--check-subsets] [--check-singles]`: profile, candidate list, access check, screening and full recheck of given packages
- [x] 1.2 Evaluate the six-filter package and every subset; record the cause in design.md

## 2. Seeds
- [ ] 2.1 `explore/seeds.rs`: file format, canonical key, record, cap, decode, sub-packages
- [ ] 2.2 Adopt seeds like warm-start packages (profile, clash, access, duplicates) with reasons
- [ ] 2.3 Recheck every seed in full; screen seeds and sub-packages; start a beam from them
- [ ] 2.4 Binary: load and record the seeds file, `--known`, `--no-known`, `--add-seed`, `--seed-proposals`, `--seed-labels`

## 3. Search
- [ ] 3.1 Phased harm weight for ranking partial packages; line stops on the ranking at the new level's weight
- [ ] 3.2 Stable options and lightest option in `select_options`
- [ ] 3.3 Provenance in the proposals file and the report; `computed.knownPackages`

## 4. Tests
- [ ] 4.1 Seeds decode, forbid, dedupe, cap
- [ ] 4.2 Seeds always rechecked and eligible; sub-package starts
- [ ] 4.3 Stability preference; provenance fields
- [ ] 4.4 Unconstrained offers everything charter does and is never worse

## 5. Run
- [ ] 5.1 Seed the file from the six-filter link, the current and previous proposals and the report history
- [ ] 5.2 Charter search, then unconstrained, on the real files; annotate
- [ ] 5.3 Archive
