# rockridge-pm_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.33 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.06 | 0.07 | 0.02 | 0.25 | 0.01 to 0.11 |
| health | backlog growth in the second half of the run | points of spawned | 0.01 | 0.02 | -0.01 | 0.05 | -0.01 to 0.02 |
| health | completed trips | trips | 24615.20 | 159.31 | 24397.00 | 24873.00 | 24501.24 to 24729.16 |
| health | arterial mean speed | m/s | 9.33 | 0.07 | 9.27 | 9.50 | 9.28 to 9.38 |
| health | arterial mean speed, last 15 min | m/s | 9.31 | 0.13 | 9.10 | 9.45 | 9.22 to 9.40 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 8.84 | 2.70 | 5.85 | 13.21 | 6.90 to 10.77 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 2.0 | 0.6 | 1.4 | 3.0 | 1.6 to 2.4 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 9.81 | 1.89 | 7.29 | 12.62 | 8.45 to 11.16 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 2.2 | 0.4 | 1.6 | 2.8 | 1.9 to 2.5 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 25.50 | 3.98 | 21.00 | 33.00 | 22.65 to 28.35 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1472.30 | 46.56 | 1382.00 | 1540.00 | 1438.99 to 1505.61 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 4.20 | 1.87 | 1.00 | 6.00 | 2.86 to 5.54 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1350.70 | 38.86 | 1288.00 | 1414.00 | 1322.90 to 1378.50 |
| headline share | Hillegass Avenue NB from freeway | % | 51.7 | 3.3 | 46.0 | 56.0 | 49.4 to 54.0 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 3.7 | 1.4 | 1.0 | 5.5 | 2.7 to 4.7 |
| share | Hillegass Avenue NB to College Avenue | % | 6.2 | 2.4 | 3.5 | 10.3 | 4.4 to 7.9 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 24.4 | 3.9 | 18.4 | 31.2 | 21.6 to 27.2 |
| headline share | Colby Street NB from freeway | % | 37.2 | 3.0 | 32.5 | 43.2 | 35.1 to 39.3 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 54.1 | 4.6 | 48.1 | 60.8 | 50.8 to 57.3 |
| share | Colby Street NB to Telegraph Avenue | % | 33.9 | 4.5 | 27.6 | 40.3 | 30.7 to 37.1 |
| share | Colby Street NB to College Avenue | % | 2.7 | 0.9 | 1.4 | 3.9 | 2.0 to 3.3 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 4.5 | 1.0 | 2.9 | 6.3 | 3.7 to 5.2 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 0.9 | 0.5 | 0.0 | 1.6 | 0.5 to 1.2 |
| share | Hillegass Avenue SB from College Avenue | % | 2.0 | 1.5 | 0.5 | 4.9 | 1.0 to 3.0 |
| headline share | Hillegass Avenue SB to freeway | % | 52.5 | 3.1 | 46.3 | 56.7 | 50.2 to 54.7 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 11.7 | 1.3 | 9.7 | 13.3 | 10.8 to 12.6 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 8.8 | 1.7 | 5.4 | 11.1 | 7.6 to 10.0 |
| share | Colby Street SB from Telegraph Avenue | % | 15.4 | 1.9 | 13.1 | 18.1 | 14.0 to 16.7 |
| headline share | Colby Street SB to freeway | % | 38.2 | 2.9 | 35.0 | 44.4 | 36.2 to 40.3 |
| share | Colby Street SB to Forest Street | % | 17.5 | 1.7 | 15.1 | 20.8 | 16.3 to 18.8 |
| ramp share | onto freeway via College Avenue | % | 14.2 | 1.0 | 12.8 | 15.6 | 13.5 to 14.9 |
| ramp share | onto freeway via Hillegass Avenue | % | 15.6 | 1.8 | 12.0 | 19.3 | 14.3 to 16.9 |
| ramp share | onto freeway via Martin Street | % | 13.2 | 1.4 | 10.5 | 15.0 | 12.2 to 14.2 |
| ramp share | onto freeway via Colby Street | % | 11.1 | 1.4 | 8.8 | 12.9 | 10.1 to 12.2 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 6.9 | 1.1 | 5.3 | 8.6 | 6.1 to 7.7 |
| ramp share | onto freeway via Benvenue Avenue | % | 3.1 | 0.7 | 1.9 | 3.8 | 2.6 to 3.6 |
| ramp share | from freeway via College Avenue | % | 7.8 | 1.2 | 6.7 | 10.5 | 7.0 to 8.7 |
| ramp share | from freeway via Martin Street | % | 13.8 | 2.3 | 11.0 | 19.0 | 12.1 to 15.5 |
| ramp share | from freeway via Colby Street | % | 11.6 | 1.4 | 9.7 | 14.1 | 10.6 to 12.6 |
| ramp share | from freeway via Hillegass Avenue | % | 6.7 | 1.3 | 5.0 | 9.5 | 5.7 to 7.6 |
| ramp share | from freeway via Benvenue Avenue | % | 3.0 | 0.8 | 1.7 | 3.9 | 2.5 to 3.5 |
| corridor flow | Telegraph N median link flow | veh/h | 1107.84 | 27.51 | 1058.40 | 1150.80 | 1088.16 to 1127.52 |
| corridor flow | Telegraph S median link flow | veh/h | 809.04 | 41.65 | 748.80 | 883.20 | 779.25 to 838.83 |
| corridor flow | College N median link flow | veh/h | 384.12 | 24.14 | 362.40 | 432.00 | 366.85 to 401.39 |
| corridor flow | College S median link flow | veh/h | 675.00 | 28.36 | 626.40 | 714.00 | 654.71 to 695.29 |
| corridor flow | Claremont N median link flow | veh/h | 388.08 | 23.98 | 349.20 | 441.60 | 370.93 to 405.23 |
| corridor flow | Claremont S median link flow | veh/h | 303.12 | 29.20 | 250.80 | 346.80 | 282.23 to 324.01 |
| corridor flow | Alcatraz E median link flow | veh/h | 533.88 | 26.10 | 502.80 | 571.20 | 515.21 to 552.55 |
| corridor flow | Alcatraz W median link flow | veh/h | 321.96 | 29.28 | 296.40 | 390.00 | 301.02 to 342.90 |
| corridor flow | Hillegass N median link flow | veh/h | 109.08 | 8.47 | 96.00 | 124.80 | 103.02 to 115.14 |
| corridor flow | Hillegass S median link flow | veh/h | 105.24 | 7.65 | 94.80 | 116.40 | 99.77 to 110.71 |
| corridor flow | Colby N median link flow | veh/h | 153.12 | 11.72 | 132.00 | 169.20 | 144.74 to 161.50 |
| corridor flow | Colby S median link flow | veh/h | 138.60 | 18.42 | 116.40 | 172.80 | 125.42 to 151.78 |
| corridor flow | Martin E median link flow | veh/h | 121.56 | 9.00 | 106.80 | 132.00 | 115.12 to 128.00 |
| corridor flow | Martin W median link flow | veh/h | 134.04 | 19.70 | 110.40 | 165.60 | 119.95 to 148.13 |

Per-seed detail: `rockridge-pm_peak-s1-seed1.md` (seed 1 in full).
