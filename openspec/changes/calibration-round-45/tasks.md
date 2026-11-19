## 1. Preparation (container)

- [x] 1.1 Find the mechanism: `signalObservations` with `heading` already sets one approach's green and the simulator holds it fixed; no code change
- [x] 1.2 Write the three candidate fragments and `apply-candidate.py`
- [x] 1.3 Check that a candidate builds a network that differs from the baseline in one node and that the fingerprint is unchanged
- [x] 1.4 Test that each fragment joins the observed Colby St timing and fits the 79 s cycle (`tools/signal-obs.test.ts`)
- [x] 1.5 Write the keep rule (design D4) and the screen (D5) before any candidate run
- [x] 1.6 Write `runbook.md` for the laptop

## 2. Laptop runs (runbook.md)

- [ ] 2.1 Gate: reproduce the baseline hashes and the three-seed baseline screen
- [ ] 2.2 For each candidate: build network and demand (shipped and training), record hashes, check the flows equal the baseline's
- [ ] 2.3 Screen each candidate on seeds 1 to 3, AM and PM
- [ ] 2.4 Validation suite on each candidate that passes the screen
- [ ] 2.5 Ten-seed assessment of each candidate that passes the screen
- [ ] 2.6 Commit the evidence under `evidence/` on `salvatoret/peaceful-fermi-dlwt0u`

## 3. Verdict (lead)

- [ ] 3.1 Keep-rule table per candidate (design D4) and the verdict
- [ ] 3.2 Record entry in `data/calibration/rockridge.record.md`
- [ ] 3.3 If a candidate is kept and the project lead adopts it: config entry, rebuilt data, new proposal search, area note and caveat. If none is kept: record only
- [ ] 3.4 `npm test`, validate the change, archive
