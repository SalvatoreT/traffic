## 1. Preparation (container)

- [x] 1.1 Read round 48's change, evidence summary and the fit code (`tools/lib/fit-counts.ts`, `tools/lib/demand-fit.ts`, `tools/build-demand.ts`)
- [x] 1.2 Add the `countFit.gatePriorTotals` switch and the ceiling stations (`tools/lib/demand-fit.ts`, `tools/build-demand.ts`), off by default
- [x] 1.3 Fit report section and the loop driver's per-pass ceiling figures (`tools/lib/membership-loop*.ts`)
- [x] 1.4 Unit tests (`tools/gate-prior.test.ts`)
- [x] 1.5 Write the two candidates and `apply-candidate.py`
- [x] 1.6 Builds of both views with the switch absent reproduce both hashes and the stations file
- [x] 1.7 Shipped build with a scratch config that has the entry: ceiling stations, excess, offered demand, the 20 gates
- [x] 1.8 Write the keep rule and the screen (design D6) before any run
- [x] 1.9 Write `runbook.md` for the laptop
- [x] 1.10 Record the open question the container builds raised (design.md, "Open question for the lead"): the ceiling sits above the baseline's totals at most uncounted gates

## 2. Laptop runs (runbook.md)

- [ ] 2.1 Gate: reproduce the baseline hashes and the fingerprint
- [ ] 2.2 Baseline three-seed screen
- [ ] 2.3 Stage 1: the static candidate, both views, three-seed screen
- [ ] 2.4 Stage 2: the membership candidate, the three-pass loop, the screen
- [ ] 2.5 Validation suite and ten-seed assessment for the candidates that earn one (design D5)
- [ ] 2.6 Commit the evidence under `evidence/`

## 3. Verdict (lead)

- [ ] 3.1 Keep-rule table and the verdict (design D6)
- [ ] 3.2 Record entry in `data/calibration/rockridge.record.md`
- [ ] 3.3 Adoption, if the project lead decides it
- [ ] 3.4 Validate the change and archive
