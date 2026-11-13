# rockridge-am_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.66 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.02 | 0.01 | 0.00 | 0.03 | 0.01 to 0.02 |
| health | backlog growth in the second half of the run | points of spawned | 0.01 | 0.01 | -0.01 | 0.03 | -0.00 to 0.02 |
| health | completed trips | trips | 21042.00 | 185.13 | 20846.00 | 21361.00 | 20909.57 to 21174.43 |
| health | arterial mean speed | m/s | 9.66 | 0.12 | 9.49 | 9.83 | 9.57 to 9.74 |
| health | arterial mean speed, last 15 min | m/s | 9.67 | 0.13 | 9.45 | 9.90 | 9.57 to 9.76 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 11.89 | 2.50 | 8.54 | 17.03 | 10.10 to 13.68 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 3.3 | 0.7 | 2.4 | 4.7 | 2.8 to 3.8 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 1.69 | 0.81 | 0.67 | 3.17 | 1.11 to 2.27 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 0.5 | 0.2 | 0.2 | 0.9 | 0.3 to 0.6 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 20.10 | 4.28 | 14.00 | 27.00 | 17.04 to 23.16 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1034.60 | 32.14 | 978.00 | 1081.00 | 1011.61 to 1057.59 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 4.00 | 2.91 | 0.00 | 9.00 | 1.92 to 6.08 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 836.30 | 25.39 | 806.00 | 874.00 | 818.14 to 854.46 |
| headline share | Hillegass Avenue NB from freeway | % | 46.3 | 3.6 | 41.3 | 52.6 | 43.7 to 48.8 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 3.2 | 1.5 | 0.0 | 5.3 | 2.1 to 4.3 |
| share | Hillegass Avenue NB to College Avenue | % | 4.9 | 1.7 | 2.5 | 7.4 | 3.7 to 6.1 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 22.0 | 2.7 | 17.5 | 26.6 | 20.0 to 24.0 |
| headline share | Colby Street NB from freeway | % | 59.0 | 1.8 | 56.5 | 61.3 | 57.7 to 60.3 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 14.1 | 2.1 | 10.5 | 16.5 | 12.6 to 15.6 |
| share | Colby Street NB to Telegraph Avenue | % | 21.1 | 3.1 | 14.7 | 25.4 | 18.9 to 23.3 |
| share | Colby Street NB to College Avenue | % | 0.5 | 0.5 | 0.0 | 1.4 | 0.1 to 0.9 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 14.2 | 2.5 | 10.3 | 18.0 | 12.4 to 15.9 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 3.9 | 1.9 | 1.7 | 7.1 | 2.5 to 5.2 |
| share | Hillegass Avenue SB from College Avenue | % | 10.4 | 2.5 | 5.9 | 13.7 | 8.6 to 12.2 |
| headline share | Hillegass Avenue SB to freeway | % | 57.5 | 3.0 | 52.3 | 60.5 | 55.3 to 59.6 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 36.3 | 2.4 | 31.6 | 39.2 | 34.5 to 38.0 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 10.6 | 1.6 | 7.6 | 13.5 | 9.5 to 11.8 |
| share | Colby Street SB from Telegraph Avenue | % | 15.6 | 3.5 | 10.8 | 21.6 | 13.1 to 18.1 |
| headline share | Colby Street SB to freeway | % | 79.7 | 2.5 | 75.6 | 83.3 | 77.9 to 81.5 |
| share | Colby Street SB to Forest Street | % | 4.8 | 1.8 | 0.9 | 7.1 | 3.5 to 6.1 |
| ramp share | onto freeway via College Avenue | % | 16.1 | 1.7 | 13.9 | 18.5 | 14.9 to 17.3 |
| ramp share | onto freeway via Hillegass Avenue | % | 14.4 | 1.6 | 10.9 | 17.1 | 13.2 to 15.5 |
| ramp share | onto freeway via Martin Street | % | 16.2 | 2.0 | 12.6 | 19.1 | 14.8 to 17.6 |
| ramp share | onto freeway via Colby Street | % | 28.6 | 1.8 | 25.6 | 31.7 | 27.3 to 29.9 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 9.6 | 1.5 | 6.1 | 10.8 | 8.5 to 10.6 |
| ramp share | onto freeway via Benvenue Avenue | % | 3.3 | 0.6 | 2.9 | 4.9 | 2.9 to 3.8 |
| ramp share | from freeway via College Avenue | % | 8.4 | 0.8 | 7.6 | 9.7 | 7.9 to 9.0 |
| ramp share | from freeway via Martin Street | % | 19.5 | 1.1 | 18.3 | 21.4 | 18.7 to 20.3 |
| ramp share | from freeway via Colby Street | % | 19.0 | 1.6 | 16.6 | 20.9 | 17.8 to 20.1 |
| ramp share | from freeway via Hillegass Avenue | % | 8.8 | 1.4 | 6.5 | 11.1 | 7.8 to 9.8 |
| ramp share | from freeway via Benvenue Avenue | % | 2.4 | 0.8 | 1.5 | 4.0 | 1.9 to 3.0 |
| corridor flow | Telegraph N median link flow | veh/h | 809.16 | 44.11 | 730.80 | 872.40 | 777.61 to 840.71 |
| corridor flow | Telegraph S median link flow | veh/h | 533.64 | 24.75 | 500.40 | 571.20 | 515.94 to 551.34 |
| corridor flow | College N median link flow | veh/h | 268.44 | 22.68 | 236.40 | 301.20 | 252.22 to 284.66 |
| corridor flow | College S median link flow | veh/h | 387.84 | 16.64 | 367.20 | 416.40 | 375.93 to 399.75 |
| corridor flow | Claremont N median link flow | veh/h | 341.88 | 11.60 | 322.80 | 361.20 | 333.58 to 350.18 |
| corridor flow | Claremont S median link flow | veh/h | 361.20 | 17.36 | 342.00 | 397.20 | 348.78 to 373.62 |
| corridor flow | Alcatraz E median link flow | veh/h | 360.96 | 28.20 | 328.80 | 417.60 | 340.79 to 381.13 |
| corridor flow | Alcatraz W median link flow | veh/h | 530.16 | 20.02 | 502.80 | 556.80 | 515.84 to 544.48 |
| corridor flow | Hillegass N median link flow | veh/h | 80.64 | 9.91 | 64.80 | 97.20 | 73.55 to 87.73 |
| corridor flow | Hillegass S median link flow | veh/h | 68.52 | 5.26 | 60.00 | 75.60 | 64.76 to 72.28 |
| corridor flow | Colby N median link flow | veh/h | 127.92 | 13.90 | 110.40 | 148.80 | 117.97 to 137.87 |
| corridor flow | Colby S median link flow | veh/h | 151.08 | 11.16 | 132.00 | 166.80 | 143.09 to 159.07 |
| corridor flow | Martin E median link flow | veh/h | 122.64 | 15.20 | 96.00 | 146.40 | 111.77 to 133.51 |
| corridor flow | Martin W median link flow | veh/h | 157.68 | 19.19 | 132.00 | 195.60 | 143.95 to 171.41 |

Per-seed detail: `rockridge-am_peak-s1-seed1.md` (seed 1 in full).
