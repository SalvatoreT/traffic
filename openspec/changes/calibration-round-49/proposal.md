## Why

Round 48 fitted every eligible station on the simulator's own route choice. Fitted counts rose and the diagonal overshoot in the training view halved. The fit also added 1,200 to 2,100 veh/h of car demand at gates with no count (109 of 123 gates). That demand queued at the SR-24 eastbound entry (node 602), San Pablo Ave (183) and the Claremont gates (1756, 1398), and the candidate failed D16, D5 and PM held out.

Nothing in the fit holds the total of an uncounted gate. `fitToCounts` scales flows multiplicatively, every constraint is soft, and the bounds are only a lower and an upper factor per flow. When a counted station is short and the simulated membership says the missing trips come from an uncounted gate, the fit grows that gate.

This round adds the missing constraint: a one-sided ceiling on the car total of every gate direction that no gate count holds, set from that gate's own total before the fit. It then runs the round 48 loop with the ceiling in place.

## What changes

- A config entry `countFit.gatePriorTotals` (`{ "tolerancePct": 10, "weight": 10 }`), absent by default. With it present, `fitPeriod` appends a one-sided ceiling station (kind `gate-prior`, no links, static membership 1) for each gate direction that no surviving gate station covers, with ceiling = the gate's pre-fit car total times 1.10. The stations live inside the fit only: they are not in the stations output, not scored by `calibrate` or `assess`, not in the split and not eligible for the membership rule.
- A fit report section per period: number of ceiling stations, how many end above their ceiling and by how much (sum and the worst five gates), and offered car demand before and after. The membership loop's per-pass report carries the count above ceiling and the excess sum.
- Two candidates: `gate-ceiling-static` (the ceiling alone, a control) and `gate-ceiling-membership` (the ceiling plus the round 48 simulated membership, three-pass loop).
- A written keep rule and screen. The screen adds a backlog line, because round 48 passed its screen and failed ten seeds on backlog.
- No simulator, network or split change.

## Impact

Tools only. The simulator fingerprint stays d45a275dd7be0713cec6a64394b7d8a9 and the network stays 53c823f20d9165ed. With the entry absent the shipped demand stays 9cdebdabf05c4460 and the training demand 2f9ae152b9bbf78e. With the entry present the demand config's hash changes, so the provenance in the demand files changes, and so does the static baseline fit (the ceiling also acts without simulated membership). If a candidate is adopted, the published proposals, results and redistribution files need a new search. If both fail the keep rule, nothing published changes.
