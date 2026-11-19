## 1. Preparation (container)

- [x] 1.1 Find the mechanism: `signalObservations` with `heading` already sets one approach's green and the simulator holds it fixed; no code change
- [x] 1.2 Write the three candidate fragments and `apply-candidate.py`
- [x] 1.3 Check that a candidate builds a network that differs from the baseline in one node and that the fingerprint is unchanged
- [x] 1.4 Test that each fragment joins the observed Colby St timing and fits the 79 s cycle (`tools/signal-obs.test.ts`)
- [x] 1.5 Write the keep rule (design D4) and the screen (D5) before any candidate run
- [x] 1.6 Write `runbook.md` for the laptop

## 2. Laptop runs (runbook.md)

- [x] 2.1 Gate: reproduce the baseline hashes and the three-seed baseline screen
- [x] 2.2 For each candidate: build network and demand (shipped and training), record hashes, check the flows equal the baseline's
- [x] 2.3 Screen each candidate on seeds 1 to 3, AM and PM
- [x] 2.4 Validation suite on each candidate that passes the screen
- [x] 2.5 Ten-seed assessment of each candidate that passes the screen
- [x] 2.6 Commit the evidence under `evidence/` (added to the archived change by the lead)

## 3. Verdict (lead)

- [x] 3.1 Keep-rule table per candidate (design D4) and the verdict
- [x] 3.2 Record entry in `data/calibration/rockridge.record.md`
- [ ] 3.3 Adoption (config entry, rebuilt data, new proposal search, area note and caveat): not done. forest-25 passed the keep rule, and the project lead decided on 2026-11-18 not to adopt it (design D9). The record, one sentence in the area caveat and the archive are done
- [x] 3.4 Validate the change and archive; the two affected test files pass (the full `npm test` was not run)
