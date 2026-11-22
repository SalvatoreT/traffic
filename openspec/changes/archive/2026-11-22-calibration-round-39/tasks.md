## 1. Setup and decisions

- [x] 1.1 Worktree inputs from round 38; release `calibrate` and `validate`; baseline PM seeds 1 to 10 reproduce round 38.
- [x] 1.2 Record the lead's decision, the shelved compact model, the definition of the four figures and what the count already gives the fit.
- [x] 1.3 Mechanism alternatives, guard rails and stopping rule frozen in `design.md` before any result.

## 2. Mechanism

- [x] 2.1 Route feature `any`; explicit membership and one-sided targets in the fit.
- [x] 2.2 Through targets in the demand fit (`countFit.throughTargets`), report section, training-view rule.
- [x] 2.3 `tools/through-membership.ts`; tests.

## 3. Iterations

- [x] 3.1 Baseline AM and midday select-od runs; report-only build reproduces the shipped demand.
- [x] 3.2 Iterate build, PM seeds 1 to 10, pool, until the stopping rule; PM seeds 11 to 20.
- [x] 3.3 `npm run data`; frozen split unchanged; no link renumbered.

## 4. Evaluation and record

- [x] 4.1 Tests, WASM parity and trace identity, validation suite.
- [x] 4.2 `npm run assess -- --publish --noise`; PM seeds 11 to 20; `--od-costs` before and after.
- [x] 4.3 Round 39 in the record; README, spec, area note and caveat, site copy; `tools/import-osm.ts` rerun.
