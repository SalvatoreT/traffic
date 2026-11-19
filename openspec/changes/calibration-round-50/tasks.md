## 1. Preparation (container)

- [x] 1.1 Read round 49's change, outcome, evidence and the laptop's node and share tables
- [x] 1.2 Add `scope` to `countFit.gatePriorTotals` (`tools/lib/demand-fit.ts`, `tools/build-demand.ts`), default `gates`
- [x] 1.3 Fit report: ceilings by kind, non-gate trip ends inside and outside the study area, flow types (`tools/lib/demand-fit.ts`)
- [x] 1.4 Loop driver: per-pass kind, flow-type and trip-end lines, offered share of the static fit, low-demand warning (`tools/lib/membership-loop*.ts`)
- [x] 1.5 Unit tests (`tools/node-prior.test.ts`, `tools/membership-loop.test.ts`)
- [x] 1.6 Candidate `node-ceiling-membership` and `apply-candidate.py`
- [x] 1.7 Builds of both views with the switch absent reproduce both hashes
- [x] 1.8 Entry present, no membership file: periods identical to the baseline
- [x] 1.9 Entry present with a made-up membership file, with and without ceilings: offered demand by type, ceiling lines by kind, trip ends, build time
- [x] 1.10 Write the keep rule and the screen (design D5) before any run
- [x] 1.11 Write `runbook.md` and the node and share scripts for the laptop
- [x] 1.12 Add the round 49 breakdown tables to the archived evidence and correct the record entry

## 2. Laptop runs (runbook.md)

- [ ] 2.1 Gate: reproduce the baseline hashes and the fingerprint
- [ ] 2.2 Baseline three-seed screen
- [ ] 2.3 Apply the candidate, dry-run the loop, run it (three passes at most, ten seeds, PM and AM, both views)
- [ ] 2.4 Screen the final demand on seeds 1 to 3, with the backlog line
- [ ] 2.5 Validation suite and ten-seed assessment (only if the screen passed)
- [ ] 2.6 Commit the evidence under `evidence/`

## 3. Verdict (lead)

- [ ] 3.1 Keep-rule table and the verdict (design D5)
- [ ] 3.2 Record entry in `data/calibration/rockridge.record.md`
- [ ] 3.3 Adoption or not
- [ ] 3.4 Validate the change and archive
