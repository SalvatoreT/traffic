## 1. Preparation (container)

- [x] 1.1 Read round 48's change, evidence summary and the fit code (`tools/lib/fit-counts.ts`, `tools/lib/demand-fit.ts`, `tools/build-demand.ts`)
- [x] 1.2 First version: ceilings on the pre-fit total; container builds showed the anchor sits above the baseline's totals (design.md, "Why the anchor moved")
- [x] 1.3 Revised design (lead, 2026-11-19): anchor on the static fit, ceiling stations only cap, no ceilings without membership
- [x] 1.4 Add the `countFit.gatePriorTotals` switch (`tools/lib/demand-fit.ts`, `tools/lib/fit-counts.ts`, `tools/build-demand.ts`), off by default
- [x] 1.5 Fit report section (ceilings, flow types) and the loop driver's per-pass ceiling figures (`tools/lib/membership-loop*.ts`)
- [x] 1.6 Unit tests (`tools/gate-prior.test.ts`)
- [x] 1.7 Write the candidate and `apply-candidate.py`
- [x] 1.8 Builds of both views with the switch absent reproduce both hashes
- [x] 1.9 Entry present, no membership file: periods identical to the baseline
- [x] 1.10 Entry present with a made-up membership file, with and without ceilings: offered demand, ceiling report, gate sums, flow types
- [x] 1.13 Hard projection onto the ceilings and its report lines (design D3'')
- [x] 1.14 Loop abort when offered demand exceeds the static fit by more than 3% (design D11'), tested with the fake build
- [x] 1.11 Write the keep rule and the screen (design D6) before any run
- [x] 1.12 Write `runbook.md` for the laptop

## 2. Laptop runs (runbook.md)

- [ ] 2.1 Gate: reproduce the baseline hashes and the fingerprint
- [ ] 2.2 Baseline three-seed screen
- [ ] 2.3 Apply the candidate, dry-run the loop, run it (three passes at most, ten seeds, PM and AM, both views)
- [ ] 2.4 Screen the final demand on seeds 1 to 3, with the backlog line
- [ ] 2.5 Validation suite and ten-seed assessment if the screen passes
- [ ] 2.6 Commit the evidence under `evidence/`

## 3. Verdict (lead)

- [ ] 3.1 Keep-rule table and the verdict (design D6)
- [ ] 3.2 Record entry in `data/calibration/rockridge.record.md`
- [ ] 3.3 Adoption, if the project lead decides it
- [ ] 3.4 Validate the change and archive
