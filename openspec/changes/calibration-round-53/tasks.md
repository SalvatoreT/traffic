## 1. Preparation (container)

- [x] 1.1 Read round 52's change, outcome, evidence and record entries, and the count's definition of "ended along" (`routeDiagrams` of the volunteer count file)
- [x] 1.2 Sub-switch `endAlong` in `countFit.throughTargets.simulatedMembership` and `countFit.endAlong.weight` (`tools/build-demand.ts`), the node rule and the constraint (`tools/lib/share-targets.ts`, `tools/lib/demand-fit.ts`)
- [x] 1.3 Training view: a run with a held block on it is left out (`tools/build-demand.ts`)
- [x] 1.4 Fit report section and lines; loop parses, prints, records and checks them (`tools/lib/membership-loop*.ts`)
- [x] 1.5 Unit tests (`tools/end-along.test.ts`, additions in `tools/membership-loop.test.ts`)
- [x] 1.6 Candidate `end-along` and `apply-candidate.py`
- [x] 1.7 Switch absent: shipped and cross-validation demand reproduce with the published membership files
- [x] 1.8 Candidate entry, no membership file: periods identical to a static build of the committed config
- [x] 1.9 Candidate entry with the published membership files hand-stamped (scratch copy): end-along figures, Colby Street SB whole-street and block values, trip ends at the interior nodes, offered demand
- [x] 1.9a Diagnose why the seed table has almost no pairs ending along the southbound runs (design.md, Diagnosis)
- [x] 1.9b Seeding behind `countFit.endAlong.seedPairs` (`tools/lib/end-along-seed.ts`, `tools/lib/demand-fit.ts`, `tools/build-demand.ts`), report section and loop check, tests (`tools/end-along-seed.test.ts`)
- [x] 1.9c Container checks again with seeding: published hashes, no-membership identity, hand-stamped wiring check, training view against the published cross-validation demand
- [x] 1.10 Write the keep rule, the screen, the confirmation rule and the improvement test (design D5) before any run
- [x] 1.11 Write `runbook.md` and the scripts (`confirm.zsh`, `confirm.cjs`, `restore.zsh`, `sod.zsh`, `route-lines.cjs`, `end-along-lines.cjs`, `end-along-sim.cjs`, `node-ends.cjs`)

## 2. Laptop runs (runbook.md)

- [ ] 2.1 Gate: reproduce the published hashes and the fingerprint
- [ ] 2.2 Baseline three-seed screen
- [ ] 2.3 Move the published membership files aside, apply the candidate, dry-run the loop, run it (three passes at most, ten seeds, PM and AM, both views)
- [ ] 2.4 Screen the final demand on seeds 1 to 3, with the backlog line
- [ ] 2.5 Validation suite and ten-seed assessment (if the screen passes)
- [ ] 2.6 End-along figures from the ten-seed select-link runs, baseline and candidate
- [ ] 2.7 Fresh-seed confirmation on seeds 11 to 20 with the baseline (if the keep rule passes), automatically
- [ ] 2.8 Restore the published model and verify demand 2d16d8f8eb0950ca and cross-validation demand 1c3b1666f24156f1
- [ ] 2.9 Commit the evidence under `evidence/`

## 3. Verdict (lead)

- [ ] 3.1 Keep-rule table, confirmation table, improvement test and the verdict (design D5)
- [ ] 3.2 Record entry in `data/calibration/rockridge.record.md`
- [ ] 3.3 Adoption decision (the project lead)
- [ ] 3.4 Validate the change and archive
