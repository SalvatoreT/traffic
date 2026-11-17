## 1. Reproduction and decisions

- [x] 1.1 Check that `npm run data` reproduces network f9fa09a5726644d7, demand 1c798217e72fb1ba and the cross-validation demand a367850a13850985.
- [x] 1.2 Record the lead's decisions of 2026-11-16 (refit not adopted, backlog check network-wide).
- [x] 1.3 Measure the demand build's peak memory, run alone.

## 2. Telegraph Ave at Alcatraz Ave

- [x] 2.1 Link-by-link comparison of the fit's assigned flows with the ten-seed simulated flows; guidance, coordination and assumed-movement checks.
- [x] 2.2 Reassign the shipped flows on the fit's costs with all, half and zone-only measured delays; compare with the simulation.
- [x] 2.3 `countFit.assignment.measured.weight` (default 1).
- [x] 2.4 Build and simulate the half-weight demand on PM seeds 1 to 10 and 11 to 20; not kept.

## 3. SR-24 mainline gate

- [x] 3.1 Locate the waiting trips and the limit (off-ramp fork, lane drop, gate order).
- [x] 3.2 Validation cases h3 and h4; h4 listed as a deviation, not reviewed.
- [x] 3.3 Engine fix (per-branch waiting) tested on PM seeds 1 to 20 and in the suite; not landed, fingerprint kept.

## 4. Evaluation and record

- [ ] 4.1 Tests, WASM parity and trace identity, validation suite.
- [ ] 4.2 `npm run assess -- --publish --noise`; PM seeds 11 to 20.
- [ ] 4.3 Round 38 in the calibration record; area note and caveat; `tools/import-osm.ts` rerun.
