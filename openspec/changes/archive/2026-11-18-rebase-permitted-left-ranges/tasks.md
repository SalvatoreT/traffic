## 1. Decision and checks

- [x] 1.1 Record the lead's decision of 2026-11-18 in `design.md`; confirm the simulator fingerprint d45a275dd7be0713cec6a64394b7d8a9 before the change.
- [x] 1.2 Re-verify the traced numbers (b1, per-seed b4 and l1).

## 2. Ranges

- [x] 2.1 Replace `left_limited` by `left_band` built on `permitted_left_cap`; b3, b4, b9 and l1 take source [Fambro1991] and label the 0.8 factor and the pocket assumption.
- [x] 2.2 b4 and l1 report the mean of seeds 1 to 10 and say so in the case text and the report header.
- [x] 2.3 Refresh `cases.json`; remove b4 and l1 from `validation.deviations.json` (they pass); no deviation marked reviewed.

## 3. Evidence

- [x] 3.1 `cargo test --release --workspace` passes; `validate` regenerated; fingerprint unchanged after the change.

## 4. Open follow-up (not done here)

- [ ] 4.1 Simulator fix to bundle with the next simulator change: in `crates/sim/src/sim/lanechange.rs` `try_change`, let an uncommitted lane leader move into a pocket with room. Measured on a trial build: b4 ten-seed mean 814 to 851, l1 676 to 690. It changes the fingerprint.
