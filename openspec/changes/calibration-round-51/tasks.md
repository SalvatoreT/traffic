## 1. Preparation (container)

- [x] 1.1 Read round 50's change, outcome, evidence and record entry; check how the shares and through targets reach the fit
- [x] 1.2 Sub-switches `throughTargets` and `shares` in `countFit.throughTargets.simulatedMembership` (`tools/build-demand.ts`, `tools/lib/demand-fit.ts`)
- [x] 1.3 Share constraints on simulated block membership with the freeway-end numerator (`tools/lib/share-targets.ts`, `tools/lib/demand-fit.ts`)
- [x] 1.4 Loop: pool the block export for the through targets and the shares, zero-hit lists, share and through lines per build, shares note check (`tools/lib/membership-loop*.ts`)
- [x] 1.5 Fit report lines and notes for shares and through targets
- [x] 1.6 Unit tests (`tools/block-membership.test.ts`, additions in `tools/membership-loop.test.ts`)
- [x] 1.7 Candidate `shares-membership` and `apply-candidate.py`
- [x] 1.8 Switch absent: both baseline hashes
- [x] 1.9 Candidate entry, no membership file: periods identical to the baseline
- [x] 1.10 Made-up membership file with through hits and block pairs: the build takes the simulated path for through targets and shares, the report says so
- [x] 1.11 Write the keep rule and the screen (design D6) before any run
- [x] 1.12 Write `runbook.md` for the laptop

## 2. Laptop runs (runbook.md)

- [ ] 2.1 Gate: reproduce the baseline hashes and the fingerprint
- [ ] 2.2 Baseline three-seed screen
- [ ] 2.3 Apply the candidate, dry-run the loop, run it (three passes at most, ten seeds, PM and AM, both views)
- [ ] 2.4 Screen the final demand on seeds 1 to 3, with the backlog line
- [ ] 2.5 Validation suite and ten-seed assessment (if the screen passes)
- [ ] 2.6 Commit the evidence under `evidence/`

## 3. Verdict (lead)

- [ ] 3.1 Keep-rule table and the verdict (design D6)
- [ ] 3.2 Record entry in `data/calibration/rockridge.record.md`
- [ ] 3.3 Adoption decision
- [ ] 3.4 Validate the change and archive
