## 1. Preparation (container)

- [x] 1.1 Read the Caldecott Lane finding and the round 46 decision D9
- [x] 1.2 Decide from the split file how the two station ids map (same group, same side)
- [x] 1.3 Add the `countFit.linkGroups` merge (`tools/lib/link-groups.ts`, `tools/build-demand.ts`), off by default
- [x] 1.4 Unit tests (`tools/link-groups.test.ts`)
- [x] 1.5 Write the candidate fragment, `apply-candidate.py`, `targets-changed.mjs`, `denominators.mjs`, `station-table.ts`
- [x] 1.6 Demand builds with the rule off (both hashes) and on (both views); record hashes, denominators, changed stations, static-fit flows
- [x] 1.7 Write the keep rule (design D4) and the screen (D6) before any candidate run
- [x] 1.8 Write `runbook.md` for the laptop

## 2. Laptop runs (runbook.md)

- [x] 2.1 Gate: reproduce the baseline hashes with the new code
- [x] 2.2 Baseline three-seed screen and ten-seed set; read `b` (how many of the two merged stations pass in the baseline)
- [x] 2.3 Build the candidate in both views; record hashes, check the split file is unchanged
- [x] 2.4 Screen on seeds 1 to 3, AM and PM
- [x] 2.5 Validation suite and ten-seed assessment if the screen passes
- [x] 2.6 Commit the evidence under `evidence/` (laptop branch `salvatoret/peaceful-fermi-dlwt0u`; signed laptop commits 511d668 (merge), c605080, a3a2a58, 5cebe93)

## 3. Verdict (lead)

- [x] 3.1 Keep-rule table, both PM fitted fills (design D4), and the verdict
- [x] 3.2 Record entry in `data/calibration/rockridge.record.md`
- [x] 3.3 Adoption, if the project lead decides it (config entry, rebuilt data, new proposal search); not adopted, nothing to do unless reopened
- [x] 3.4 Validate the change and archive
