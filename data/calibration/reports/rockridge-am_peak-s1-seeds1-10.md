# rockridge-am_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.65 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.01 | 0.01 | 0.00 | 0.02 | 0.01 to 0.02 |
| health | backlog growth in the second half of the run | points of spawned | -0.00 | 0.02 | -0.04 | 0.01 | -0.02 to 0.01 |
| health | completed trips | trips | 21308.10 | 175.97 | 21084.00 | 21593.00 | 21182.23 to 21433.97 |
| health | arterial mean speed | m/s | 9.65 | 0.05 | 9.56 | 9.71 | 9.62 to 9.69 |
| health | arterial mean speed, last 15 min | m/s | 9.67 | 0.08 | 9.54 | 9.75 | 9.61 to 9.73 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 6.08 | 1.03 | 4.98 | 7.95 | 5.34 to 6.82 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 1.9 | 0.3 | 1.5 | 2.5 | 1.7 to 2.2 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 2.23 | 0.54 | 1.56 | 3.05 | 1.84 to 2.61 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 0.7 | 0.2 | 0.5 | 1.0 | 0.6 to 0.8 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 25.10 | 6.05 | 16.00 | 33.00 | 20.78 to 29.42 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1098.90 | 35.37 | 1042.00 | 1151.00 | 1073.60 to 1124.20 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 7.80 | 3.12 | 3.00 | 14.00 | 5.57 to 10.03 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1054.40 | 39.86 | 991.00 | 1124.00 | 1025.89 to 1082.91 |
| headline share | Hillegass Avenue NB from freeway | % | 53.9 | 3.4 | 49.6 | 61.0 | 51.5 to 56.3 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 4.9 | 1.7 | 3.1 | 8.7 | 3.7 to 6.2 |
| share | Hillegass Avenue NB to College Avenue | % | 8.3 | 2.6 | 5.5 | 14.7 | 6.4 to 10.1 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 26.9 | 2.6 | 22.3 | 30.4 | 25.0 to 28.7 |
| headline share | Colby Street NB from freeway | % | 50.4 | 3.6 | 46.3 | 56.4 | 47.8 to 53.0 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 19.6 | 2.8 | 14.8 | 23.5 | 17.6 to 21.6 |
| share | Colby Street NB to Telegraph Avenue | % | 16.8 | 3.0 | 11.3 | 22.5 | 14.7 to 19.0 |
| share | Colby Street NB to College Avenue | % | 1.1 | 0.7 | 0.0 | 2.3 | 0.6 to 1.6 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 5.7 | 1.5 | 3.3 | 7.8 | 4.6 to 6.8 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 2.8 | 1.7 | 0.8 | 5.6 | 1.6 to 4.0 |
| share | Hillegass Avenue SB from College Avenue | % | 4.0 | 1.9 | 1.9 | 8.3 | 2.6 to 5.4 |
| headline share | Hillegass Avenue SB to freeway | % | 60.5 | 5.5 | 53.0 | 69.2 | 56.6 to 64.4 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 23.3 | 3.1 | 19.3 | 27.6 | 21.1 to 25.6 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 8.7 | 1.6 | 6.6 | 11.9 | 7.6 to 9.9 |
| share | Colby Street SB from Telegraph Avenue | % | 16.5 | 2.4 | 12.4 | 19.5 | 14.7 to 18.2 |
| headline share | Colby Street SB to freeway | % | 68.8 | 2.2 | 65.5 | 72.7 | 67.2 to 70.4 |
| share | Colby Street SB to Forest Street | % | 14.7 | 2.3 | 11.4 | 19.2 | 13.0 to 16.4 |
| ramp share | onto freeway via College Avenue | % | 23.7 | 1.1 | 22.1 | 25.6 | 22.9 to 24.6 |
| ramp share | onto freeway via Hillegass Avenue | % | 13.5 | 1.7 | 9.9 | 16.8 | 12.3 to 14.7 |
| ramp share | onto freeway via Martin Street | % | 15.7 | 1.3 | 14.4 | 18.9 | 14.8 to 16.7 |
| ramp share | onto freeway via Colby Street | % | 16.3 | 1.9 | 13.0 | 19.3 | 15.0 to 17.7 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 7.7 | 1.1 | 6.6 | 10.7 | 6.9 to 8.6 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.4 | 0.8 | 3.4 | 6.1 | 3.8 to 5.0 |
| ramp share | from freeway via College Avenue | % | 8.0 | 0.7 | 6.7 | 8.9 | 7.5 to 8.5 |
| ramp share | from freeway via Martin Street | % | 14.3 | 1.8 | 11.4 | 16.7 | 13.0 to 15.5 |
| ramp share | from freeway via Colby Street | % | 13.1 | 1.0 | 11.6 | 14.6 | 12.3 to 13.8 |
| ramp share | from freeway via Hillegass Avenue | % | 6.6 | 1.2 | 5.1 | 8.9 | 5.8 to 7.5 |
| ramp share | from freeway via Benvenue Avenue | % | 2.8 | 0.4 | 2.2 | 3.2 | 2.5 to 3.1 |
| corridor flow | Telegraph N median link flow | veh/h | 672.96 | 41.75 | 606.00 | 738.00 | 643.10 to 702.82 |
| corridor flow | Telegraph S median link flow | veh/h | 545.16 | 35.54 | 507.60 | 614.40 | 519.74 to 570.58 |
| corridor flow | College N median link flow | veh/h | 247.44 | 11.74 | 230.40 | 265.20 | 239.04 to 255.84 |
| corridor flow | College S median link flow | veh/h | 405.36 | 27.73 | 354.00 | 451.20 | 385.53 to 425.19 |
| corridor flow | Claremont N median link flow | veh/h | 360.72 | 32.22 | 316.80 | 405.60 | 337.67 to 383.77 |
| corridor flow | Claremont S median link flow | veh/h | 428.64 | 17.30 | 399.60 | 448.80 | 416.26 to 441.02 |
| corridor flow | Alcatraz E median link flow | veh/h | 361.08 | 26.13 | 330.00 | 403.20 | 342.39 to 379.77 |
| corridor flow | Alcatraz W median link flow | veh/h | 498.12 | 25.28 | 458.40 | 532.80 | 480.04 to 516.20 |
| corridor flow | Hillegass N median link flow | veh/h | 69.24 | 8.95 | 57.60 | 86.40 | 62.84 to 75.64 |
| corridor flow | Hillegass S median link flow | veh/h | 75.72 | 10.67 | 60.00 | 99.60 | 68.09 to 83.35 |
| corridor flow | Colby N median link flow | veh/h | 102.24 | 10.73 | 87.60 | 121.20 | 94.56 to 109.92 |
| corridor flow | Colby S median link flow | veh/h | 100.80 | 10.58 | 87.60 | 121.20 | 93.23 to 108.37 |
| corridor flow | Martin E median link flow | veh/h | 112.20 | 11.69 | 97.20 | 130.80 | 103.84 to 120.56 |
| corridor flow | Martin W median link flow | veh/h | 126.36 | 16.46 | 104.40 | 147.60 | 114.58 to 138.14 |

Per-seed detail: `rockridge-am_peak-s1-seed1.md` (seed 1 in full).
