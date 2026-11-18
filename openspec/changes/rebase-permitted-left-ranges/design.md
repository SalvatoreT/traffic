## Context

After change repair-permissive-left-and-gate-fork the simulator serves permissive left turns by the queue-first rule of [Fambro1991]. Validation cases b4 and l1 fail unreviewed. Their ranges, and those of b3 and b9 (which pass), come from the unsignalized gap formula of [Brilon1999] applied to the hourly opposing flow, with s 1,800 to 1,900, and assume left turns never hold the through lane. The simulator fingerprint is d45a275dd7be0713cec6a64394b7d8a9 before and after this change; `validate.rs`, `bin/` and `data/validation/` are outside what the fingerprint hashes (`crates/sim/fingerprint.rs`).

## Decisions

D1. Decision by the project lead, 2026-11-18 (by card): "Re-base ranges, bundle fix later". The ranges of b3, b4, b9 and l1 are re-based now and b4 is measured as a ten-seed mean. The simulator fix of D6 waits for the next simulator change, so that proposals are searched once. No deviation is marked reviewed here.

D2. Why the old ranges do not fit. The traced investigation behind the decision found that b4's lower bound (918 veh/h, 1,800 x green share) asks the pocketed approach to carry more than a plain through lane. Case b1 (one through lane, no lefts) gives 837 veh/h, the same as b4 at seed 1, and cases a2 and b1 accept s from 1,500 to 2,000 veh/h [FHWA-SIG2004]. The old ranges also use an hourly-flow gap formula, while the simulator waits for the opposing queue to clear before left turns use gaps [Fambro1991].

D3. New range. Per approach lane, the smaller of the permitted-left capacity over the left share and s x green share over the through share. The left capacity is `permitted_left_cap` [Fambro1991] with opposing flow of the case (opposing lanes equal to the approach's), cycle 100 s and green from the case's own green share (the mean over the seeds that the case runs). The band is the one of p1 to p3: critical gap 5.1 s, turning headway 2.57 s, 0.88 sneakers and s 1,500 for the low end; 4.5 s, 2.24 s, 2 sneakers and s 2,000 for the high end. The lower bound keeps the factor 0.8 on the low end. The source of the four cases becomes [Fambro1991]. The figures are computed in code and not stored by hand.

D4. ASSUMPTIONS, stated in the code, the case notes and the report. The 0.8 lower factor is an assumption. The 3-vehicle class-rule pocket is taken not to push capacity below the band. The band is wide: it would also have passed the left-turn rule used before the queue-first model (that rule gave 924 for b4 and 792 for l1 at the old green shares), so a pass here is weak evidence about the left-turn rule itself.

D5. Ten-seed mean. b4 at seed 1 over 12 cycles swings about 5% (753 to 906 across seeds 1 to 10 in this change's re-run). b4 and l1 report the mean of seeds 1 to 10, with their green share averaged the same way, and the case text and the report header say so. b3 and b9 stay on seed 1; they sit well inside their ranges.

D6. Open follow-up, not done here. In `crates/sim/src/sim/lanechange.rs`, `try_change` should let an uncommitted lane leader move into a pocket with room. Measured by the lead's trial: b4 ten-seed mean 814 to 851, l1 676 to 690. It changes the fingerprint, so it is bundled with the next simulator change.

D7. Result. Validation, seed 1 except b4 and l1 (seeds 1 to 10), before and after:

| Case | Before | Range before | After | Range after | Result |
| --- | --- | --- | --- | --- | --- |
| b3 | 888 | 813 to 1,073 | 888 | 678 to 1,129 | pass, pass |
| b4 | 837 (seed 1) | 918 to 1,211 | 814 (mean) | 755 to 1,258 | FAIL, pass |
| b9 | 820 | 809 to 1,067 | 820 | 618 to 1,124 | pass, pass |
| l1 | 646 (seed 1) | 835 to 1,044 | 676 (mean) | 291 to 681 | FAIL, pass |

l1 passes by 5 veh/h/lane at the top of its range. 66 of 74 cases pass (64 before); b4 and l1 leave `validation.deviations.json`. The remaining failures are a3, b13, e2, e3, j6, j8, j9 and j12; b13 is unreviewed, the others are reviewed.
