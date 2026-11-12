## 1. Search tool
- [x] 1.1 Candidate generation from baseline select-link analysis
- [x] 1.2 Scoring: cut-through goal, worst-block harm, access check
- [x] 1.3 Beam search with shared seeds, parallel evaluation, budget
- [x] 1.4 Full recheck of finalists and choice of options to publish
- [x] 1.5 Proposals file with provenance; tests

## 2. UI
- [x] 2.1 Proposals tab with option cards and open-on-map
- [x] 2.2 Exploratory, out-of-date and empty states
- [x] 2.3 Accessibility check

## 3. Run and publish
- [x] 3.1 Run the search on the current baseline
- [x] 3.2 Review the results and publish

## 4. Constraint profiles (2026-11-12 decision, D7)
- [x] 4.1 Profiles file `data/proposals/<area>.profiles.json`; `explore --profile` and `--profiles`
- [x] 4.2 Candidate filter for excluded types and boundary streets and intersections
- [x] 4.3 Version 2 file with groups; merge into an existing file (version 1 counts as unconstrained); per-profile report sections
- [x] 4.4 UI: one section per group with heading, note, own notices; empty group; version 1 reader
- [x] 4.5 Tests: charter candidates, merge, group parsing and fixtures
- [x] 4.6 Run `explore --profile charter` and republish the proposals data
