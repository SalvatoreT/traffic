# rockridge-midday-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.85 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.01 | 0.01 | 0.00 | 0.03 | 0.00 to 0.01 |
| health | backlog growth in the second half of the run | points of spawned | -0.00 | 0.01 | -0.02 | 0.01 | -0.01 to 0.01 |
| health | completed trips | trips | 15986.00 | 120.52 | 15779.00 | 16136.00 | 15899.79 to 16072.21 |
| health | arterial mean speed | m/s | 9.85 | 0.07 | 9.72 | 9.95 | 9.80 to 9.90 |
| health | arterial mean speed, last 15 min | m/s | 9.88 | 0.16 | 9.51 | 10.07 | 9.77 to 10.00 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 4.33 | 1.54 | 2.52 | 6.74 | 3.23 to 5.43 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 1.7 | 0.6 | 1.0 | 2.6 | 1.3 to 2.1 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 7.82 | 1.55 | 5.43 | 10.11 | 6.72 to 8.93 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 3.1 | 0.6 | 2.2 | 4.0 | 2.6 to 3.5 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 7.60 | 2.95 | 3.00 | 14.00 | 5.49 to 9.71 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 855.00 | 28.60 | 818.00 | 904.00 | 834.54 to 875.46 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 5.40 | 1.65 | 3.00 | 8.00 | 4.22 to 6.58 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 794.70 | 26.50 | 759.00 | 834.00 | 775.74 to 813.66 |
| headline share | Hillegass Avenue NB from freeway | % | 56.9 | 5.4 | 50.9 | 70.8 | 53.0 to 60.7 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 2.0 | 1.4 | 0.9 | 5.2 | 1.0 to 3.0 |
| share | Hillegass Avenue NB to College Avenue | % | 3.9 | 2.1 | 0.9 | 6.9 | 2.4 to 5.3 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 23.6 | 5.2 | 15.0 | 33.6 | 19.9 to 27.4 |
| headline share | Colby Street NB from freeway | % | 69.7 | 4.6 | 64.1 | 77.4 | 66.4 to 72.9 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 8.7 | 0.7 | 7.6 | 10.2 | 8.2 to 9.2 |
| share | Colby Street NB to Telegraph Avenue | % | 14.2 | 3.9 | 8.4 | 20.0 | 11.4 to 17.0 |
| share | Colby Street NB to College Avenue | % | 0.8 | 0.7 | 0.0 | 2.3 | 0.3 to 1.3 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 8.4 | 1.8 | 5.5 | 11.7 | 7.1 to 9.7 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 2.8 | 1.2 | 1.0 | 5.2 | 1.9 to 3.7 |
| share | Hillegass Avenue SB from College Avenue | % | 5.0 | 2.0 | 2.1 | 9.0 | 3.6 to 6.5 |
| headline share | Hillegass Avenue SB to freeway | % | 67.5 | 3.9 | 64.1 | 77.4 | 64.7 to 70.3 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 29.4 | 2.7 | 25.8 | 34.0 | 27.4 to 31.3 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 18.7 | 1.9 | 14.7 | 21.5 | 17.3 to 20.1 |
| share | Colby Street SB from Telegraph Avenue | % | 12.2 | 2.5 | 8.2 | 16.0 | 10.4 to 14.0 |
| headline share | Colby Street SB to freeway | % | 64.6 | 3.0 | 59.7 | 70.6 | 62.5 to 66.8 |
| share | Colby Street SB to Forest Street | % | 11.0 | 3.0 | 7.5 | 17.1 | 8.9 to 13.1 |
| ramp share | onto freeway via College Avenue | % | 19.8 | 2.4 | 16.8 | 25.3 | 18.1 to 21.6 |
| ramp share | onto freeway via Hillegass Avenue | % | 16.5 | 2.2 | 13.3 | 20.4 | 14.9 to 18.0 |
| ramp share | onto freeway via Martin Street | % | 20.0 | 2.3 | 15.7 | 23.7 | 18.3 to 21.6 |
| ramp share | onto freeway via Colby Street | % | 20.4 | 3.7 | 15.2 | 26.4 | 17.7 to 23.0 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 7.1 | 1.8 | 4.1 | 9.4 | 5.8 to 8.4 |
| ramp share | onto freeway via Benvenue Avenue | % | 3.8 | 1.3 | 2.2 | 5.8 | 2.8 to 4.7 |
| ramp share | from freeway via College Avenue | % | 5.9 | 0.9 | 4.4 | 6.9 | 5.2 to 6.5 |
| ramp share | from freeway via Martin Street | % | 21.9 | 1.6 | 19.7 | 23.9 | 20.7 to 23.0 |
| ramp share | from freeway via Colby Street | % | 17.0 | 1.0 | 15.6 | 19.2 | 16.3 to 17.8 |
| ramp share | from freeway via Hillegass Avenue | % | 9.1 | 1.2 | 7.0 | 11.1 | 8.3 to 10.0 |
| ramp share | from freeway via Benvenue Avenue | % | 2.1 | 0.5 | 1.3 | 2.9 | 1.8 to 2.5 |
| corridor flow | Telegraph N median link flow | veh/h | 541.56 | 46.76 | 494.40 | 651.60 | 508.11 to 575.01 |
| corridor flow | Telegraph S median link flow | veh/h | 407.04 | 18.35 | 379.20 | 441.60 | 393.91 to 420.17 |
| corridor flow | College N median link flow | veh/h | 210.72 | 20.41 | 181.20 | 241.20 | 196.12 to 225.32 |
| corridor flow | College S median link flow | veh/h | 481.80 | 33.76 | 422.40 | 526.80 | 457.65 to 505.95 |
| corridor flow | Claremont N median link flow | veh/h | 302.88 | 27.07 | 253.20 | 354.00 | 283.52 to 322.24 |
| corridor flow | Claremont S median link flow | veh/h | 246.36 | 40.35 | 174.00 | 316.80 | 217.49 to 275.23 |
| corridor flow | Alcatraz E median link flow | veh/h | 386.40 | 33.91 | 337.20 | 453.60 | 362.14 to 410.66 |
| corridor flow | Alcatraz W median link flow | veh/h | 253.92 | 19.77 | 230.40 | 295.20 | 239.78 to 268.06 |
| corridor flow | Hillegass N median link flow | veh/h | 67.80 | 4.67 | 58.80 | 74.40 | 64.46 to 71.14 |
| corridor flow | Hillegass S median link flow | veh/h | 65.40 | 7.23 | 56.40 | 79.20 | 60.23 to 70.57 |
| corridor flow | Colby N median link flow | veh/h | 82.56 | 8.39 | 68.40 | 94.80 | 76.56 to 88.56 |
| corridor flow | Colby S median link flow | veh/h | 79.20 | 18.46 | 56.40 | 109.20 | 65.99 to 92.41 |
| corridor flow | Martin E median link flow | veh/h | 97.56 | 14.37 | 79.20 | 122.40 | 87.28 to 107.84 |
| corridor flow | Martin W median link flow | veh/h | 125.28 | 9.96 | 110.40 | 142.80 | 118.15 to 132.41 |

Per-seed detail: `rockridge-midday-s1-seed1.md` (seed 1 in full).
