## 1. Preparation (container)

- [x] 1.1 Find where K = 0.09 comes from and every place an ADT x K target is used
- [x] 1.2 Find why the Claremont ramp is already fitted in the shipped view and not in the training view
- [x] 1.3 Add the `countFit.rampK` rule (`tools/lib/ramp-k.ts`, `tools/build-demand.ts`), off by default
- [x] 1.4 Unit tests (`tools/ramp-k.test.ts`)
- [x] 1.5 Write the two candidate fragments and `apply-candidate.py`
- [x] 1.6 One demand build per candidate and view; report the ramp K and the changed targets
- [x] 1.7 Write the keep rule (design D4) and the screen (D6) before any candidate run
- [x] 1.8 Write `runbook.md` for the laptop

## 2. Laptop runs (runbook.md)

- [x] 2.1 Gate: reproduce the baseline hashes with the new code and the three-seed baseline screen
- [x] 2.2 For each candidate: build both views, record hashes, list the changed targets
- [x] 2.3 Screen each candidate on seeds 1 to 3, AM and PM
- [x] 2.4 Validation suite on each candidate that passes the screen (none passed; not run)
- [x] 2.5 Ten-seed assessment of each candidate that passes the screen (none passed; not run)
- [x] 2.6 Commit the evidence under `evidence/` (brought in from the laptop branch `salvatoret/peaceful-fermi-dlwt0u`; signed laptop commits b982cd3 (merge), 7188383, c675a4a, 7cd4ba8, 44d4dee)

## 3. Verdict (lead)

- [x] 3.1 Keep-rule table per candidate, both fills (design D4), and the verdict (both fail screen D6; the keep rule was not reached)
- [x] 3.2 Record entry in `data/calibration/rockridge.record.md`
- [x] 3.3 Adoption, if the project lead decides it (config entry, rebuilt data, new proposal search); not adopted, nothing to do unless reopened
- [x] 3.4 Validate the change and archive
