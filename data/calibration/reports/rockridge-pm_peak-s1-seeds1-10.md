# rockridge-pm_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 3.40 (min 0.00, max 8.00) | NO |
| Entry backlog | below 2.0% in at least 90% of seeds | 5 of 10 seeds | NO |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | seeds 3 | NO |
| Arterial speed | mean above 4.0 m/s | 7.92 m/s | yes |

**Verdict: not stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 1 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 3.40 | 2.67 | 0.00 | 8.00 | 1.49 to 5.31 |
| health | gridlock removals per hour | veh/h | 3.40 | 2.67 | 0.00 | 8.00 | 1.49 to 5.31 |
| health | entry backlog | % of spawned | 1.88 | 0.46 | 1.09 | 2.41 | 1.55 to 2.21 |
| health | backlog growth in the second half of the run | points of spawned | 1.28 | 0.50 | 0.77 | 2.34 | 0.92 to 1.64 |
| health | completed trips | trips | 22338.40 | 191.23 | 22033.00 | 22617.00 | 22201.61 to 22475.19 |
| health | arterial mean speed | m/s | 7.92 | 0.16 | 7.64 | 8.22 | 7.81 to 8.03 |
| health | arterial mean speed, last 15 min | m/s | 7.48 | 0.25 | 7.22 | 7.95 | 7.30 to 7.66 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 9.55 | 2.18 | 7.13 | 13.46 | 7.99 to 11.11 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 2.7 | 0.6 | 2.0 | 3.8 | 2.3 to 3.2 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 8.91 | 1.06 | 7.58 | 10.77 | 8.15 to 9.67 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 2.6 | 0.4 | 2.2 | 3.1 | 2.3 to 2.8 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 16.90 | 4.25 | 8.00 | 22.00 | 13.86 to 19.94 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1098.20 | 59.74 | 1020.00 | 1214.00 | 1055.47 to 1140.93 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 38.90 | 6.79 | 31.00 | 51.00 | 34.04 to 43.76 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1179.60 | 48.06 | 1095.00 | 1260.00 | 1145.22 to 1213.98 |
| headline share | Hillegass Avenue NB from freeway | % | 65.1 | 4.8 | 58.9 | 70.6 | 61.7 to 68.6 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 2.1 | 1.4 | 0.0 | 4.1 | 1.2 to 3.1 |
| share | Hillegass Avenue NB to College Avenue | % | 2.5 | 2.2 | 0.0 | 6.2 | 0.9 to 4.0 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 28.9 | 5.4 | 21.2 | 38.2 | 25.1 to 32.8 |
| headline share | Colby Street NB from freeway | % | 39.1 | 4.6 | 31.9 | 46.8 | 35.7 to 42.4 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 13.7 | 3.4 | 9.3 | 19.2 | 11.3 to 16.2 |
| share | Colby Street NB to Telegraph Avenue | % | 24.1 | 4.9 | 19.0 | 34.5 | 20.6 to 27.6 |
| share | Colby Street NB to College Avenue | % | 9.4 | 4.1 | 4.1 | 16.4 | 6.4 to 12.3 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 22.6 | 3.4 | 16.8 | 26.1 | 20.1 to 25.0 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 12.1 | 2.3 | 9.0 | 15.0 | 10.4 to 13.7 |
| share | Hillegass Avenue SB from College Avenue | % | 18.5 | 3.6 | 13.2 | 26.0 | 16.0 to 21.1 |
| headline share | Hillegass Avenue SB to freeway | % | 65.4 | 3.3 | 60.4 | 70.2 | 63.0 to 67.8 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 13.0 | 2.1 | 11.0 | 17.1 | 11.5 to 14.6 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 35.8 | 3.8 | 30.1 | 41.7 | 33.1 to 38.5 |
| share | Colby Street SB from Telegraph Avenue | % | 34.0 | 3.8 | 25.6 | 38.8 | 31.2 to 36.7 |
| headline share | Colby Street SB to freeway | % | 30.0 | 3.5 | 23.6 | 35.8 | 27.5 to 32.5 |
| share | Colby Street SB to Forest Street | % | 47.0 | 4.3 | 42.8 | 56.7 | 43.9 to 50.1 |
| ramp share | onto freeway via College Avenue | % | 12.6 | 2.0 | 10.3 | 17.1 | 11.2 to 14.0 |
| ramp share | onto freeway via Hillegass Avenue | % | 13.6 | 1.1 | 12.1 | 16.3 | 12.8 to 14.5 |
| ramp share | onto freeway via Martin Street | % | 14.7 | 1.4 | 12.0 | 16.6 | 13.7 to 15.7 |
| ramp share | onto freeway via Colby Street | % | 7.7 | 0.8 | 6.2 | 8.7 | 7.1 to 8.3 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 12.0 | 1.3 | 10.4 | 15.1 | 11.1 to 12.9 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.6 | 0.7 | 3.4 | 5.6 | 4.1 to 5.1 |
| ramp share | from freeway via College Avenue | % | 8.5 | 1.2 | 6.3 | 9.7 | 7.6 to 9.3 |
| ramp share | from freeway via Martin Street | % | 16.5 | 0.7 | 15.7 | 18.0 | 16.0 to 17.0 |
| ramp share | from freeway via Colby Street | % | 8.9 | 0.9 | 7.5 | 10.1 | 8.3 to 9.6 |
| ramp share | from freeway via Hillegass Avenue | % | 5.9 | 1.1 | 4.6 | 7.5 | 5.1 to 6.7 |
| ramp share | from freeway via Benvenue Avenue | % | 3.0 | 0.5 | 2.2 | 3.9 | 2.6 to 3.3 |
| corridor flow | Telegraph N median link flow | veh/h | 1094.28 | 61.38 | 985.20 | 1220.40 | 1050.38 to 1138.18 |
| corridor flow | Telegraph S median link flow | veh/h | 1041.72 | 41.39 | 990.00 | 1119.60 | 1012.12 to 1071.32 |
| corridor flow | College N median link flow | veh/h | 311.88 | 36.63 | 255.60 | 378.00 | 285.68 to 338.08 |
| corridor flow | College S median link flow | veh/h | 396.84 | 40.30 | 356.40 | 476.40 | 368.01 to 425.67 |
| corridor flow | Claremont N median link flow | veh/h | 679.92 | 67.93 | 577.20 | 784.80 | 631.33 to 728.51 |
| corridor flow | Claremont S median link flow | veh/h | 626.52 | 22.26 | 592.80 | 661.20 | 610.60 to 642.44 |
| corridor flow | Alcatraz E median link flow | veh/h | 442.56 | 26.95 | 402.00 | 480.00 | 423.28 to 461.84 |
| corridor flow | Alcatraz W median link flow | veh/h | 462.72 | 27.21 | 411.60 | 496.80 | 443.25 to 482.19 |
| corridor flow | Hillegass N median link flow | veh/h | 56.64 | 7.46 | 45.60 | 68.40 | 51.31 to 61.97 |
| corridor flow | Hillegass S median link flow | veh/h | 130.44 | 12.50 | 112.80 | 151.20 | 121.50 to 139.38 |
| corridor flow | Colby N median link flow | veh/h | 31.68 | 6.77 | 25.20 | 44.40 | 26.84 to 36.52 |
| corridor flow | Colby S median link flow | veh/h | 99.24 | 9.03 | 88.80 | 120.00 | 92.78 to 105.70 |
| corridor flow | Martin E median link flow | veh/h | 153.36 | 15.10 | 134.40 | 181.20 | 142.56 to 164.16 |
| corridor flow | Martin W median link flow | veh/h | 188.28 | 14.37 | 169.20 | 211.20 | 178.00 to 198.56 |

Per-seed detail: `rockridge-pm_peak-s1-seed1.md` (seed 1 in full).
