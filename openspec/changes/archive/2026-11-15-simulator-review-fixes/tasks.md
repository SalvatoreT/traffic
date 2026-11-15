## 1. Cleanup (behavior preserving)
- [x] 1.1 Remove dead switches, unused variables, the legacy re-route path and the blanket dead-code allowance
- [x] 1.2 Check PM, AM and midday seed 1 metrics are identical before and after

## 2. Behavior fixes
- [x] 2.1 Placed agents of a via flow take the movement (test)
- [x] 2.2 Re-plan around a blocked link drops a skipped via and refuses driven junctions (tests)
- [x] 2.3 Per-intent link usage counts links left at t >= 0 (test)
- [x] 2.4 A leg named by one direction closes both (test)

## 3. Determinism
- [x] 3.1 Route transcendental calls through libm
- [x] 3.2 Parity script and `bin/parity`; full PM hour identical native and WASM

## 4. Proposal search
- [x] 4.1 The search runs the app's run; `computed` records it (test)
- [x] 4.2 Hump candidates survive the link round trip (test)
- [x] 4.3 Stricter-group packages always rechecked, exempt from the noise drop (test)
- [x] 4.4 Reference packages report the access check (test)

## 5. Fingerprint, spec and comments
- [x] 5.1 Fingerprint of result-affecting inputs only (temp-dir test)
- [x] 5.2 Phase cap, `CYCLE_MIN`, link-table and doc comments
- [x] 5.3 Citation or ASSUMPTION label on every listed parameter
