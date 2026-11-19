## 1. Preparation (container)

- [x] 1.1 Read the membership mechanism of rounds 39 to 42, the evidence check of the build, and the report binary's export
- [x] 1.2 Choose how a per-seed select-OD path is solved (driver, one process per seed) and record it
- [x] 1.3 Add the `simulatedMembership` switch (`tools/build-demand.ts`, `tools/lib/demand-fit.ts`), off by default
- [x] 1.4 Station rule, pooling, stop rule, report check and leak guards (`tools/lib/membership-loop.ts`, `tools/lib/membership-loop-run.ts`)
- [x] 1.5 The driver with a dry-run mode (`tools/membership-loop.ts`)
- [x] 1.6 Unit tests with fixture data (`tools/membership-loop.test.ts`)
- [x] 1.7 Write the candidate fragments and `apply-candidate.py`
- [x] 1.8 Demand builds with the switch off reproduce both hashes; one build with a made-up membership file shows the switch on takes the new path
- [x] 1.9 Write the keep rule (design D7) and the screen before any run
- [x] 1.10 Write `runbook.md` for the laptop

## 2. Laptop runs (runbook.md)

- [x] 2.1 Gate: reproduce the baseline hashes and the fingerprint
- [x] 2.2 Baseline three-seed screen
- [x] 2.3 Apply the candidate, dry-run the loop, run it (three passes at most, ten seeds, PM and AM, both views)
- [x] 2.4 Screen the final demand on seeds 1 to 3
- [x] 2.5 Validation suite and ten-seed assessment if the screen passes
- [ ] 2.6 Optional: the loop again with the prior worth 20 trips (step H, not run)
- [x] 2.7 Commit the evidence under `evidence/` (laptop commits 6a50e3e and 71af51a, now on main)

## 3. Verdict (lead)

- [x] 3.1 Keep-rule table and the verdict (design D7): fails
- [x] 3.2 Record entry in `data/calibration/rockridge.record.md`
- [ ] 3.3 Adoption, if the project lead decides it: not applicable, not adopted
- [x] 3.4 Validate the change and archive
