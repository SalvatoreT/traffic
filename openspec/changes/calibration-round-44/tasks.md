## 1. Baseline

- [ ] 1.1 `npm run data` on b1ff0ef: record network, demand and training demand hashes; the committed fit reports reproduce byte for byte
- [ ] 1.2 Validation suite (67 of 74, fingerprint d45a275dd7be0713cec6a64394b7d8a9)
- [ ] 1.3 Ten-seed assessment of b1ff0ef; save its outputs and generated files outside the worktree; commit it with the note and caveat updated
- [ ] 1.4 Write the keep rule (D3) against that assessment before any candidate run

## 2. Mechanism

- [ ] 2.1 `buildGraph` takes a measured control delay per approach link; fallback to the constants
- [ ] 2.2 `tools/lib/control-delays.ts` and `tools/control-delays.ts`: measurement from kept seed reports, provenance file
- [ ] 2.3 Demand build reads the file for its view, checks network, view, area and simulator, falls back loudly
- [ ] 2.4 Tests: a measured delay changes the assigned path, fallback, provenance mismatch

## 3. Schedule (D2)

- [ ] 3.1 Pass 0: delays from the baseline runs (shipped and training demand, every period, seeds 1 to 10); refit
- [ ] 3.2 Pass 1: delays from runs on the pass-0 demands; refit; stop. Report the movement between passes
- [ ] 3.3 Record the hash of each pass's network, demand, training demand and delay files

## 4. Evaluation

- [ ] 4.1 Validation suite, same fingerprint
- [ ] 4.2 Ten-seed assessment of the pass-1 demand
- [ ] 4.3 Three-column table (2026-11-17 published, b1ff0ef baseline, candidate) and the keep-rule verdict
- [ ] 4.4 Adopt (area note, caveat, areas.json, record) or reject (record only), archive, commit
