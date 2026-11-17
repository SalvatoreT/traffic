# Entry backlog judged near the Trapezoid? Two readings (round 37)

This note gives numbers for a decision the project lead has not made. Should D16's entry-backlog check (backlog under 2% of spawned trips in at least 9 of 10 seeds) be judged network-wide, as it is today (reading A), or only at entries inside the judged zone of round 37 (reading B)? No rule, range or demand changed. The shipped demand is still the round-33 demand (1c798217e72fb1ba). Computed on 2026-11-16, 17:00 to 17:40 Pacific. The model and data are as in round 37: fingerprint f0df1aabc323, network f9fa09a5726644d7, judged zone 200 m.

## Sources

- Shipped demand, PM seeds 1 to 10, AM and midday: the round-37 assessment runs. PM seeds 11 to 20: round 37's separate runs.
- Feedback iterations 1 to 3, PM seeds 1 to 10, and iteration 3, AM and midday seeds 1 to 3: the round-37 cost-loop runs.
- Run here: PM seeds 11 to 20 of iterations 1, 2 and 3, and iteration 3, AM and midday seeds 4 to 10.
  - Iterations 2 and 3 used round 36's stored demands, which reproduce the loop's PM seed 1 bit for bit.
  - Iteration 1's demand was rebuilt from the stored iteration-0 delays, and its PM seed 1 also matches the stored run bit for bit.
- Held-out stations are scored out of sample only for the shipped demand, which has a cross-validation demand. For the iterations they are scored in the fit (in sample) and flagged. Their out-of-sample scores would need a cross-validation build per iteration.
- The script that computes these tables is not committed. It reads the per-seed reports, which keep only the top 10 origins by trips waiting. So the far waiting places are a lower bound, and the shipped demand's PM seeds 11 to 20 have no such table.

## Definitions

- **Near backlog.** Trips waiting at the end of the run at origins inside the judged zone. The percent is taken over the car trips the demand offers there (veh/h, as an approximation of the trips spawned there).
- **Reading B.** D16's other checks unchanged, with the backlog check judged on the near backlog.
- **The guard for reading B.** A waiting trip is not a held vehicle with a blocking chain, so the far-linked guard of round 37 cannot be applied as it stands. A planned-route proxy stands in for it, labeled B (route guard):
  - A far trip counts as near when its free-flow route (the network's fastest path from its gate) uses a study-area link.
  - Each far gate's waiting trips are split by the share of its demand whose planned route does that.
  - The denominator adds the trips offered at those gates that would enter the study area.

## Results

Each cell is PM seeds 1 to 10 / PM seeds 11 to 20. AM and midday are seeds 1 to 10, given for the shipped demand and iteration 3.

| | Shipped (iteration 0) | Iteration 1 | Iteration 2 | Iteration 3 (converged) |
| --- | --- | --- | --- | --- |
| Through cars HNB / CNB / HSB / CSB (ranges 48-95 / 102-145 / 79-120 / 39-117) | 97 / 150 / 142 / 132 · 96 / 152 / 146 / 139 | 85 / 130 / 134 / 149 · 77 / 124 / 133 / 137 | 86 / 124 / 129 / 107 · 85 / 133 / 123 / 109 | 91 / 140 / 105 / 93 · 91 / 146 / 104 / 91 |
| Blocks inside the range | 0 of 4 · 0 of 4 | 2 of 4 · 2 of 4 | 3 of 4 · 3 of 4 | 4 of 4 · 3 of 4 (Colby St NB 146) |
| Through cars, all study-area local streets | 822 · 812 | 772 · 715 | 722 · 694 | 717 · 716 |
| Headline shares HNB / CNB / HSB / CSB (47 / 47 / 68 / 45), error, within 10 | 52.9 / 50.5 / 55.1 / 37.4, 7.5, 3 · 6.0, 3 | 53.0 / 48.3 / 55.6 / 43.1, 5.4, 3 · 6.2, 3 | 52.7 / 44.8 / 62.9 / 46.9, 3.7, 4 · 3.7, 4 | 54.9 / 46.6 / 76.8 / 49.9, 5.5, 4 · 4.3, 4 |
| Cars cleared from gridlock/h: near (judged) / far / far linked | 0.60 / 0.50 / 0 · 0.00 / 1.30 / 0 | 0.10 / 24.6 / 0 · 0.40 / 21.1 / 0 | 0.00 / 13.9 / 0 · 0.00 / 13.6 / 0.1 | 0.00 / 10.6 / 0 · 0.00 / 16.0 / 0 |
| Backlog network-wide: mean %, seeds under 2%, trips waiting at the end | 0.71, 10, 185 · 0.57, 10, 150 | 1.07, 10, 289 · 0.97, 10, 260 | 1.75, 6, 437 · 1.57, 8, 395 | 1.86, 5, 461 · 1.51, 10, 375 |
| Near backlog: trips waiting, % of offered there, seeds under 2% | 0.9, 0.05%, 10 · 1.5, 0.08%, 10 | 5.7, 0.35%, 10 · 4.4, 0.27%, 10 | 5.5, 0.32%, 10 · 5.2, 0.30%, 10 | 1.9, 0.11%, 10 · 2.1, 0.13%, 10 |
| Near backlog with the route guard: mean %, seeds under 2% | 0.93, 10 · 0.08, 10 (no far table) | 1.63, 7 · 1.45, 10 | 1.99, 6 · 1.73, 8 | 2.00, 4 · 1.53, 10 |
| Far trips waiting per seed (at least), and how many would have used the study area on their planned route | 184, 23 | 275, 33 · 249, 30 | 426, 42 · 385, 37 | 454, 45 · 369, 34 |
| Longest queue, seed-mean m (samples with a full link): Telegraph / Alcatraz / College / Claremont | 74 (2.9%) / 82 (1.6%) / 87 (3.3%) / 56 (0) | 72 (2.7%) / 108 (8.5%) / 87 (4.9%) / 62 (0) | 68 (1.6%) / 95 (4.6%) / 91 (6.2%) / 60 (0) | 71 (2.3%) / 90 (2.2%) / 93 (1.9%) / 66 (0) |
| Telegraph Ave NB / SB, s (PM ranges 302-420 / 300-376) | 345 / 317 · 340 / 312 | 340 / 383 (too slow) · 340 / 371 | 341 / 345 · 333 / 333 | 347 / 327 · 352 / 313 |
| Flow entering the study area, veh/h: Telegraph Ave / Alcatraz Ave / College Ave / Claremont Ave / Forest St | 2,380 / 554 / 771 / 1,048 / 425 | -335 / +190 / +48 / -26 / -66 against shipped | -668 / +96 / +53 / -51 / -89 | -822 / +192 / -33 / -82 / -98 |
| Counted entries: Telegraph Ave at Alcatraz Ave, N leg (count 1,064) / W leg (547) | 1,307 / 285 | 1,170 / 444 | 882 / 491 | 763 / 548 |
| Recent stations GEH<5, fitted / held out | 75 of 92 (82%) / 13 of 24 (54%, out of sample) | 73 (79%) / 15 (63%, in sample) | 77 (84%) / 17 (71%, in sample) | 73 (79%) / 16 (67%, in sample) |

Far waiting places, trips per seed. The percentage is the share of that gate's trips whose planned route uses the study area.

- Shipped: SR-24 mainline gate (Grove Shafter Freeway, 1,158 m from the study area) 143 (12%); Claremont Ave north-edge gate (1,307 m) 29 (21%); Avalon Ave / Claremont Ave (1,238 m) 8 (3%).
- Iteration 1: Claremont Ave gate 124 (14%); Claremont Blvd gate (1,304 m) 85 (15%); Avalon Ave / Claremont Ave 15; SR-24 gate 15.
- Iteration 2: SR-24 gate 187 (11%); Claremont Ave gate 138 (9%); Claremont Blvd gate 59 (12%).
- Iteration 3: SR-24 gate 204 (11%); Claremont Ave gate 149 (9%); Claremont Blvd gate 57 (10%).

AM and midday:

| | Shipped AM | Iteration 3 AM | Shipped midday | Iteration 3 midday |
| --- | --- | --- | --- | --- |
| Headline shares, error | 50.8 / 43.9 / 59.6 / 47.3, 3.0 | 51.0 / 51.2 / 56.4 / 53.4, 4.3 | 52.6 / 37.2 / 62.8 / 45.5, 5.4 | 54.7 / 35.0 / 60.0 / 49.7, 6.9 |
| Through cars, all study-area local streets | 466 | 426 | 358 | 339 |
| Gridlock/h near / far / linked | 0 / 0.3 / 0 | 0.1 / 1.7 / 0 | 0 / 0 / 0 | 0 / 0.4 / 0 |
| Backlog network-wide %, seeds under 2%; near % | 0.03, 10; 0.03% | 0.22, 10; 0.06% | 0.00, 10; 0.01% | 0.01, 10; 0.05% |
| Telegraph Ave NB / SB, s (AM ranges 280-315 / 245-285) | 294 / 299 (SB too slow) | 323 / 312 (both too slow) | | |
| Recent stations GEH<5 fitted / held out | 67 of 77 (87%) / 14 of 19 (74%, out of sample) | 65 (84%) / 18 (95%, in sample) | no counts | no counts |

## Verdict rule by rule

PM is given as seeds 1 to 10 / 11 to 20. The status needs every rule in every period.

| Demand | D16, reading A | D16, reading B | D16, B with route guard | D5 (PM) | Through cars (PM) | Stations fitted / held out, PM | AM: D16 A / B, stations | Status under A / B |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Shipped | pass / pass | pass / pass | pass / pass | FAIL (3 of 4) | FAIL / FAIL | FAIL / FAIL | pass / pass; fitted pass, held out FAIL | uncalibrated / uncalibrated |
| Iteration 1 | pass / pass | pass / pass | FAIL / pass | FAIL (3 of 4) | FAIL / FAIL | FAIL / FAIL (in sample) | not run (3 seeds only) | uncalibrated / uncalibrated |
| Iteration 2 | FAIL / FAIL (6 and 8 seeds under 2%) | pass / pass | FAIL / FAIL | pass | FAIL / FAIL (HSB) | FAIL / FAIL (in sample) | not run | uncalibrated / uncalibrated |
| Iteration 3 | FAIL / pass (5 and 10 seeds) | pass / pass | FAIL / pass (4 and 10 seeds) | pass | pass / FAIL (CNB 146) | FAIL / FAIL (in sample) | pass / pass; fitted FAIL (84%), held out pass in sample | uncalibrated / uncalibrated |

Midday holds D16 under every reading for both demands and has no counts.

The cost loop's acceptance rule is a separate question; it is unchanged here. Under reading A it rejects every iteration. Under reading B it would still reject them all, on its own backlog clause: each iteration's network-wide mean backlog is above the baseline's 0.71%. Only if that clause were also read near the study area would iteration 3 qualify. Its near backlog is 0.11% against the baseline's 0.05%, so it would still fail by that measure, as would iterations 1 and 2.

## What makes reading B look better than it should

- **Far waiting is large and grows with the fit.** At the end of the hour 184 trips wait outside the zone on the shipped demand and 454 on iteration 3, mostly at the SR-24 mainline gate and the Claremont Ave and Claremont Blvd gates north of Ashby Ave. On their planned routes about 10% of them (23 and 45 trips) would have driven on study-area streets. Reading B ignores them. With the route guard, iteration 3 fails on seeds 1 to 10 (4 of 10 under 2%) and iteration 1 on seeds 1 to 10 (7 of 10).
- **Less traffic reaches the Trapezoid on the iterations.**
  - Flow entering on Telegraph Ave falls by 335 (iteration 1) to 892 veh/h (iteration 3).
  - At the counted Telegraph Ave approach to Alcatraz Ave (N leg, 1,064 counted), iteration 3 carries 763, against 1,307 on the shipped demand.
  - Through cars on all study-area local streets fall from 822 to 717.
  - The trips stuck at far gates explain at most about 45 an hour of that, going by their planned routes. The rest is the fit moving trips onto other routes, which the delay feedback is meant to do.
  - So iteration 3 meeting the four through-car ranges on seeds 1 to 10 comes mainly from rerouting, not from trips that never entered. It still includes some trips that never entered, and it does not hold on seeds 11 to 20 (Colby St NB 146).
- **Telegraph Ave travel times.** In the PM they stay inside the observed ranges on every demand except iteration 1 southbound (383 s on seeds 1 to 10). On iteration 3 in the AM both directions are too slow (323 and 312 s against 280-315 and 245-285), and the shipped demand is already too slow southbound (299 s). Bounding-street queues stay short on every demand (at most 113 m on average, a full link in under 10% of samples), so no far queue is seen reaching the study area.
- **Stations.** Reading B changes no station figure. On every iteration the PM station rule fails fitted (79 to 84%), and the held-out figures are in sample. Iteration 3's AM fitted share drops below 85% (84%).
