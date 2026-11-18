## 1. Reproduction and decisions

- [x] 1.1 Confirm the published inputs (network f9fa09a57266, demand e4f199391682) and the simulator fingerprint 4fba23cc4474ee85c5e37d26b57fa4af; reproduce the published ten-seed figures on the baseline binary.
- [x] 1.2 Record the lead's decisions of 2026-11-18 in `design.md`.

## 2. Permissive left turns

- [x] 2.1 PM seeds 1 to 10 with and without the queue-first model on today's network and demand: cars cleared from gridlock by place, judged and far.
- [x] 2.2 Diagnostic build (not kept) that prints, for each car cleared from gridlock, its movement, the control, its total wait and the time it was held by a full exit.
- [x] 2.3 Make the queue-first model the default; `calibrate --no-queue-first-left` for the earlier rule.
- [x] 2.4 Find why b4 now fails (variants with 0, 250 and 500 veh/h opposing).

## 3. Gate fork

- [x] 3.1 Re-implement the round 38 per-branch waiting on the current code; h4 0.64 as in round 38.
- [x] 3.2 Explain the remaining gap (the 512-trip scan) and pass planned trips behind a blocked branch without counting them.

## 4. Evidence

- [x] 4.1 Validation before and after; refresh `cases.json` bounds; deviation list (p2, p3, h4 out, b4 in, unreviewed; l1 note).
- [x] 4.2 Rust and TS tests, WASM parity and trace identity.
- [x] 4.3 Ten seeds of all three periods before and after, shipped and cross-validation demand; PM seeds 11 to 20 before and after.
- [x] 4.4 Record the results in `design.md`; README option.
