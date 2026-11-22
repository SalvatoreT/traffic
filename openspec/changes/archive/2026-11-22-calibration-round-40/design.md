## Context

Round 39 made the four counted through-car figures fit targets (weight 1, membership from ten baseline seeds). PM seeds 1 to 10 (11 to 20), shipped demand 86ec26e0a271: Hillegass Ave SB 125 (129), Colby St SB 116 (120), Hillegass Ave NB 94 (96), Colby St NB 148 (161), against 79 to 120, 39 to 117, 48 to 95 and 102 to 145. Times are Pacific; the round ran on 2026-11-16 and 17.

## Decisions

D1. Lead direction for round 40 (2026-11-16): try in order (1) judging on twenty seeds, (2) a higher weight on the through targets, (3) a data check of the Colby St NB off-ramp group before any route constraint, (4) whether a second membership iteration helps once twenty seeds are pooled. Each step is measured on both seed sets and kept only if the summed distance outside the ranges falls on both and G1 to G5 hold. Stop when all four are inside on both sets or nothing further helps. The midpoints are not chased.

D2. Noise, measured before any new demand (step 1). Over PM seeds 1 to 20 on the round-39 demand, mean and standard error of the mean (standard deviation over the twenty seeds / sqrt 20): Hillegass Ave NB 95.0 (SE 2.0, SD 9.1), Colby St NB 154.4 (3.6, 16.3), Hillegass Ave SB 127.2 (3.2, 14.1), Colby St SB 118.0 (2.7, 12.1). Round 38 on the same seeds: 97.0, 151.0, 144.1, 135.8. A ten-seed mean has a standard error of about 3 to 5 cars an hour, so the gap between the two ten-seed sets on Colby St NB (148 against 161) is about two standard errors of the difference and is noise. From this round the iteration decision uses the twenty-seed mean, and a figure whose twenty-seed mean lies within one standard error of its range is reported as inside within noise and not iterated on. On twenty seeds Hillegass Ave NB (95.0, the upper end) and Colby St SB (118.0, 1.0 above with SE 2.7) are inside within noise; Colby St NB (+9.4) and Hillegass Ave SB (+7.2) are not. Distance on twenty seeds: 17.6 (round 38: 50.9). The assessment's through table gains the standard error.

D3. Colby St NB against data (step 3), from the round-39 assessment runs (PM seeds 1 to 10). Exits at Alcatraz Ave: 130 left (counted 131) and 29 right (counted 32), so the cars leaving Colby St NB match the count. The intent map puts 64 an hour of SR-24 off-ramp traffic bound west or north on Colby St NB against 52 implied (38 to 62); that implied value is the counted 131 left turns times an assumed freeway share (ASSUMPTION), so the 2-car excess over its upper end is not evidence for a route constraint. The data do disagree elsewhere: Colby St NB whole-street cars are 92 simulated against 102 counted, and the turn from Forest St onto Colby St NB carries 86 against 57 counted (1.51 times; a movement station of weight 0.5 in the fit). So the through excess joins Colby St partway, mostly from Forest St, rather than coming up the whole street from the ramps. No route constraint on the off-ramp group is added; the excess is left to the through target and its weight (D5).

D4. Guard rails, carried over from round 39's D8 with the same rules and frozen again before any result of this round. The baseline is now the round-39 shipped demand on the same seeds:
- G1: recent fitted stations within GEH 5 no more than 2 fewer than 75 of 92 on either PM set; AM no fewer than 65 of 77.
- G2: shares within 10 points no fewer than 4 of 4 on either set; mean absolute error no more than 1.5 points above 6.2 (seeds 1 to 10) and 5.7 (11 to 20).
- G3: D16 holds on both sets under the unchanged rules; mean entry backlog no more than 0.15 points above 0.70% and 0.57%.
- G4: PM Telegraph Ave times inside 302 to 420 s and 300 to 376 s; AM northbound inside 280 to 315 s, AM southbound no more than 10 s above 303 s.
- G5: on each Telegraph Ave / Alcatraz Ave leg the GEH rises by no more than 1.5 over round 39 on the same set (seeds 1 to 10: N 7.60, W 13.21, S 7.48, E 6.56; 11 to 20: 8.12, 13.01, 7.67, 5.94).

D5. Steps and stopping rule, frozen with D4.
- Step A (lead items 1 and 4): membership pooled over forty runs (round-38 demand seeds 1 to 20 and round-39 demand seeds 1 to 20), weight 1. This is the second iteration of round 39 with twice the runs per demand.
- Step B (item 2): weights 2, 4 and 8 on the through targets, with the membership of the better of round 39 and step A, each run on seeds 1 to 20. A table gives weight against the four figures, the fit's ramp, share and block-count errors, and G1, G2 and G5.
- Keep rule: a step is kept only if the summed distance outside the ranges falls on seeds 1 to 10 and on seeds 11 to 20 against the current kept state, and every rail holds. Among kept weights, the lowest that brings all four inside within noise (D2) wins; if none does, the kept step with the smallest twenty-seed distance.
- Stop when all four twenty-seed means are inside within noise, or when no step is kept. If a kept step leaves room, one more membership iteration is pooled at its weight.
- The membership prior stays 5 trips (ASSUMPTION). Item 4's question, noise or prior, is answered by step A: with forty runs pooled the prior weighs half as much per pair as with twenty.

D6. Outcome (recorded after the runs). Step A (forty-run membership, weight 1) changed the distance by under 1 car an hour on each set and raised it on twenty seeds: no change beyond noise, so round 39's worse second iteration was noise in the ten-seed shares. Weight 2 cut the distance on both sets (8.5 to 4.9, 29.2 to 12.0; twenty seeds 17.6 to 8.0) with every rail held and is kept. Weight 4 (E leg +1.54) and weight 8 (E leg +1.67, all four figures inside on both sets) break G5 on seeds 11 to 20 at the held-out east leg of Telegraph Ave / Alcatraz Ave. A second iteration at weight 2 (sixty runs) raised the distance on seeds 11 to 20 (12.0 to 17.3) and is not kept. Shipped: weight 2, forty-run membership, demand 930a1d90b2d1. On twenty seeds Hillegass Ave SB (122.4, SE 2.8) is inside within noise and Colby St NB (150.6, SE 3.3) is 5.6 above. The trade at weight 8 is the lead's decision.

## Decisions by the project lead, 2026-11-17

- The published model uses through-target weight 2, the setting that broke no guard rail. Weight 8, which put all four through figures inside their ranges but exceeded G5 on one seed set, is not adopted.
- The site keeps the "not yet calibrated" status until every rule passes, including the count-station rule.
