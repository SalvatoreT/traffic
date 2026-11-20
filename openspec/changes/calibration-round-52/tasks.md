## 1. Preparation (container)

- [x] 1.1 Read round 51's change, outcome, evidence and record entry; check how the route stations reach the fit and why the blocks win
- [x] 1.2 Sub-switch `routeWeightPerBlock` in `countFit.throughTargets.simulatedMembership` (`tools/build-demand.ts`, `tools/lib/demand-fit.ts`)
- [x] 1.3 Ceiling scope `outsideStudyArea` (`tools/lib/demand-fit.ts`, `tools/build-demand.ts`), inside nodes that grew in the report
- [x] 1.4 Loop: route weight lines parsed, printed, recorded and checked; each build's fit reports kept; the low-demand line is a reported figure (`tools/lib/membership-loop*.ts`)
- [x] 1.5 Unit tests (`tools/route-weight.test.ts`, `tools/outside-scope.test.ts`, additions in `tools/membership-loop.test.ts`)
- [x] 1.6 Candidate `route-weight` and `apply-candidate.py`
- [x] 1.7 Switch absent: both baseline hashes
- [x] 1.8 Candidate entry, no membership file: periods identical to the baseline
- [x] 1.9 Made-up membership file: route stations take the scaled weight, the Colby Street SB whole-street value moves toward its target, inside-study-area trip ends and total offered demand reported
- [x] 1.10 Write the keep rule, the screen and the confirmation rule (design D4) before any run
- [x] 1.11 Write `runbook.md`, `scripts/confirm.zsh`, `scripts/confirm.cjs`, `scripts/route-lines.cjs`

## 2. Laptop runs (runbook.md)

- [ ] 2.1 Gate: reproduce the baseline hashes and the fingerprint
- [ ] 2.2 Baseline three-seed screen
- [ ] 2.3 Apply the candidate, dry-run the loop, run it (three passes at most, ten seeds, PM and AM, both views)
- [ ] 2.4 Screen the final demand on seeds 1 to 3, with the backlog line
- [ ] 2.5 Validation suite and ten-seed assessment (if the screen passes)
- [ ] 2.6 Fresh-seed confirmation on seeds 11 to 20 with the baseline (if the keep rule passes), automatically
- [ ] 2.7 Commit the evidence under `evidence/`

## 3. Verdict (lead)

- [ ] 3.1 Keep-rule table, confirmation table and the verdict (design D4)
- [ ] 3.2 Record entry in `data/calibration/rockridge.record.md`
- [ ] 3.3 Adoption decision (the project lead's)
- [ ] 3.4 Validate the change and archive
