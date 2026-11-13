# rockridge-am_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.20 (min 0.00, max 2.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 8.87 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 9 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.20 | 0.63 | 0.00 | 2.00 | -0.25 to 0.65 |
| health | gridlock removals per hour | veh/h | 0.20 | 0.63 | 0.00 | 2.00 | -0.25 to 0.65 |
| health | entry backlog | % of spawned | 0.04 | 0.04 | 0.00 | 0.11 | 0.01 to 0.06 |
| health | backlog growth in the second half of the run | points of spawned | 0.01 | 0.06 | -0.14 | 0.10 | -0.04 to 0.05 |
| health | completed trips | trips | 19881.30 | 130.00 | 19618.00 | 20010.00 | 19788.31 to 19974.29 |
| health | arterial mean speed | m/s | 8.87 | 0.17 | 8.59 | 9.25 | 8.75 to 8.99 |
| health | arterial mean speed, last 15 min | m/s | 8.66 | 0.33 | 8.00 | 9.27 | 8.43 to 8.90 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 9.59 | 2.94 | 5.92 | 16.75 | 7.48 to 11.69 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 2.4 | 0.7 | 1.6 | 4.1 | 1.9 to 2.9 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 7.79 | 1.36 | 5.30 | 10.11 | 6.81 to 8.76 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 2.0 | 0.4 | 1.4 | 2.7 | 1.7 to 2.3 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 4.50 | 2.80 | 0.00 | 9.00 | 2.50 to 6.50 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 949.20 | 25.96 | 906.00 | 981.00 | 930.63 to 967.77 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 10.40 | 3.03 | 3.00 | 13.00 | 8.24 to 12.56 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1017.10 | 32.15 | 980.00 | 1071.00 | 994.10 to 1040.10 |
| headline share | Hillegass Avenue NB from freeway | % | 78.1 | 4.5 | 70.0 | 84.4 | 74.8 to 81.3 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 1.2 | 0.8 | 0.0 | 2.2 | 0.6 to 1.8 |
| share | Hillegass Avenue NB to College Avenue | % | 6.1 | 2.4 | 3.9 | 9.5 | 4.4 to 7.8 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 20.0 | 4.0 | 13.3 | 26.0 | 17.2 to 22.9 |
| headline share | Colby Street NB from freeway | % | 73.6 | 3.6 | 66.3 | 78.0 | 71.0 to 76.1 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 5.2 | 1.3 | 2.4 | 6.6 | 4.3 to 6.1 |
| share | Colby Street NB to Telegraph Avenue | % | 17.0 | 3.5 | 11.4 | 22.5 | 14.5 to 19.4 |
| share | Colby Street NB to College Avenue | % | 0.9 | 0.6 | 0.0 | 2.1 | 0.5 to 1.4 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 10.3 | 1.7 | 8.4 | 12.4 | 9.1 to 11.6 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 3.3 | 1.5 | 0.7 | 5.7 | 2.2 to 4.4 |
| share | Hillegass Avenue SB from College Avenue | % | 5.1 | 1.5 | 2.3 | 7.4 | 4.0 to 6.2 |
| headline share | Hillegass Avenue SB to freeway | % | 69.0 | 2.9 | 62.1 | 71.6 | 66.9 to 71.1 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 14.0 | 3.5 | 8.5 | 20.2 | 11.5 to 16.4 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 16.5 | 1.7 | 14.3 | 19.4 | 15.2 to 17.7 |
| share | Colby Street SB from Telegraph Avenue | % | 23.0 | 5.0 | 17.8 | 34.5 | 19.4 to 26.5 |
| headline share | Colby Street SB to freeway | % | 75.9 | 2.9 | 71.6 | 79.9 | 73.8 to 78.0 |
| share | Colby Street SB to Forest Street | % | 7.8 | 1.4 | 5.4 | 9.5 | 6.8 to 8.8 |
| ramp share | onto freeway via College Avenue | % | 13.9 | 1.8 | 10.0 | 16.4 | 12.6 to 15.2 |
| ramp share | onto freeway via Hillegass Avenue | % | 12.0 | 1.3 | 9.7 | 13.7 | 11.1 to 13.0 |
| ramp share | onto freeway via Martin Street | % | 13.3 | 2.2 | 10.3 | 17.6 | 11.7 to 14.9 |
| ramp share | onto freeway via Colby Street | % | 20.9 | 1.5 | 19.2 | 23.1 | 19.9 to 22.0 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 10.5 | 1.4 | 8.1 | 12.9 | 9.5 to 11.5 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.4 | 0.7 | 2.9 | 5.2 | 3.9 to 4.9 |
| ramp share | from freeway via College Avenue | % | 8.4 | 1.4 | 7.1 | 11.2 | 7.3 to 9.4 |
| ramp share | from freeway via Martin Street | % | 15.9 | 1.3 | 14.0 | 17.9 | 14.9 to 16.8 |
| ramp share | from freeway via Colby Street | % | 11.4 | 1.0 | 9.7 | 13.1 | 10.7 to 12.1 |
| ramp share | from freeway via Hillegass Avenue | % | 7.3 | 0.9 | 6.3 | 9.1 | 6.6 to 7.9 |
| ramp share | from freeway via Benvenue Avenue | % | 2.4 | 0.6 | 1.7 | 3.6 | 2.0 to 2.8 |
| corridor flow | Telegraph N median link flow | veh/h | 870.60 | 44.29 | 806.40 | 927.60 | 838.92 to 902.28 |
| corridor flow | Telegraph S median link flow | veh/h | 1039.20 | 62.04 | 946.80 | 1111.20 | 994.82 to 1083.58 |
| corridor flow | College N median link flow | veh/h | 280.08 | 38.06 | 224.40 | 332.40 | 252.85 to 307.31 |
| corridor flow | College S median link flow | veh/h | 381.60 | 35.46 | 332.40 | 448.80 | 356.24 to 406.96 |
| corridor flow | Claremont N median link flow | veh/h | 615.84 | 25.80 | 577.20 | 651.60 | 597.39 to 634.29 |
| corridor flow | Claremont S median link flow | veh/h | 562.08 | 25.71 | 508.80 | 590.40 | 543.69 to 580.47 |
| corridor flow | Alcatraz E median link flow | veh/h | 412.20 | 29.54 | 367.20 | 459.60 | 391.07 to 433.33 |
| corridor flow | Alcatraz W median link flow | veh/h | 404.88 | 38.80 | 355.20 | 458.40 | 377.12 to 432.64 |
| corridor flow | Hillegass N median link flow | veh/h | 77.16 | 7.44 | 67.20 | 86.40 | 71.84 to 82.48 |
| corridor flow | Hillegass S median link flow | veh/h | 103.20 | 13.01 | 75.60 | 121.20 | 93.89 to 112.51 |
| corridor flow | Colby N median link flow | veh/h | 114.84 | 8.14 | 102.00 | 126.00 | 109.02 to 120.66 |
| corridor flow | Colby S median link flow | veh/h | 175.20 | 15.03 | 140.40 | 188.40 | 164.45 to 185.95 |
| corridor flow | Martin E median link flow | veh/h | 128.16 | 25.78 | 87.60 | 178.80 | 109.72 to 146.60 |
| corridor flow | Martin W median link flow | veh/h | 176.40 | 17.82 | 146.40 | 199.20 | 163.66 to 189.14 |

Per-seed detail: `rockridge-am_peak-s1-seed1.md` (seed 1 in full).
