## 1. Classification and split (container)

- [x] 1.1 `tools/lib/derived-targets.ts`: source kinds, `isDerivedTarget`, the shared wording, `derivedGroupProblems`
- [x] 1.2 `tools/lib/lineage.ts`: `isDailyTotalObservation`, `isDerivedGroup`, `isHeldGroup`; `heldStationIds`, `withheldObservations` and `withheldStationIds` apply the rule on top of the draw; `drawnHeldStationIds` for the stations file; `withheldDigest`
- [x] 1.3 `tools/build-demand.ts`: stop on a disagreement between split groups and source kinds; `build.withheld` and `evidence.withheld` in the training view only; notes in the fit report
- [x] 1.4 `crates/sim/src/bin/calibrate.rs`: the training view's withheld set follows the same rule, with a unit test
- [x] 1.5 `tools/lib/run-manifest.ts`, `tools/lib/through-membership.ts`: the training demand and its membership file must carry the digest of the current withheld set
- [x] 1.6 `tools/derived-targets-report.ts`: the stations per period, the groups that change side, and the check that no other station does

## 2. Scoring and reports (container)

- [x] 2.1 `tools/lib/assess.ts`: `scoreStations` leaves derived targets out of fitted, held, interior and other, and returns `derivedTargets` and `legacy`; `derivedTargetLines`
- [x] 2.2 `tools/lib/recency.ts`: `ruleSplit` has `dailyTotal` and `legacy`; `scopeComparisonLines`; the rule text names derived targets
- [x] 2.3 `tools/assess.ts`, `tools/lib/shard-assess.ts`: the period has counts only when it has hourly counts; the derived table per period; the scope table in the verdict; the rule in the verdict text
- [x] 2.4 `tools/lib/validation-scope.ts`: the scope text counts effective held groups and states the rule
- [x] 2.5 `tools/lib/demand-fit.ts`: the fit report's source and year lines carry the flag
- [x] 2.6 `tools/derived-rescore.ts`, `tools/derived-assessment-summary.ts`

## 3. Site text and docs (container)

- [x] 3.1 `src/lib/assumptions.ts`, `src/lib/copy.ts`, `src/components/Assumptions.tsx`, `assumptions.css`: the section, shown only when the data lists derived targets
- [x] 3.2 `tools/lib/assumptions-data.ts`, `tools/build-assumptions.ts`, `tools/lib/llms-docs.ts`: the data and the text page section
- [x] 3.3 `data/demand/README.md`, `data/calibration/README.md`
- [x] 3.4 Humanizer pass over the prose

## 4. Container checks

- [x] 4.1 Unit tests: classification, split invariance, scoring exclusion, the old-scope line, membership evidence, Assumptions data and copy
- [x] 4.2 Shipped demand builds to `2d16d8f8eb0950ca` with the published membership files and the committed stations file, which comes out byte-identical
- [x] 4.3 Re-freezing the split reproduces the committed groups and held flags
- [x] 4.4 Re-score of the published assessment under both scopes (arithmetic on the committed tables)
- [x] 4.5 `npx vitest run tools/ worker/ src/lib`, `npx tsc --noEmit`, `cargo test` of `calibrate`

## 5. Laptop run (project lead's session, after review of this change)

- [ ] 5.1 `laptop/a.zsh`: baseline hashes, candidate worktree, builds, tests, split, dry run
- [ ] 5.2 `laptop/b.zsh`: membership loop, both demand builds, identity checks
- [ ] 5.3 `laptop/c.zsh`: validation suite, ten-seed assessments on seeds 1 to 10 and 11 to 20
- [ ] 5.4 `laptop/pack.zsh`: candidate outputs as gzip parts on the development branch

## 6. Adoption (after the project lead has reviewed the figures)

- [ ] 6.1 Reassemble the parts, verify checksums, replace the training membership file, the cross-validation demand, the fit reports and the Assumptions data
- [ ] 6.2 Run `data:llms` and `data:previews`, then `data:push`; the shipped demand, proposals, results and redistribution are unchanged
- [ ] 6.3 Update `data/areas/rockridge.json` (calibration note and caveat) by the documented procedure from the new assessment
- [ ] 6.4 Record entry in `data/calibration/rockridge.record.md`; archive this change
