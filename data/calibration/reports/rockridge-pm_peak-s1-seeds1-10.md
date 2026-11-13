# rockridge-pm_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.30 (min 0.00, max 1.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.24 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 7 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.30 | 0.48 | 0.00 | 1.00 | -0.05 to 0.65 |
| health | gridlock removals per hour | veh/h | 0.30 | 0.48 | 0.00 | 1.00 | -0.05 to 0.65 |
| health | entry backlog | % of spawned | 0.06 | 0.06 | 0.01 | 0.23 | 0.01 to 0.10 |
| health | backlog growth in the second half of the run | points of spawned | 0.03 | 0.06 | -0.02 | 0.17 | -0.02 to 0.07 |
| health | completed trips | trips | 23959.10 | 101.05 | 23830.00 | 24138.00 | 23886.82 to 24031.38 |
| health | arterial mean speed | m/s | 9.24 | 0.04 | 9.20 | 9.31 | 9.22 to 9.27 |
| health | arterial mean speed, last 15 min | m/s | 9.14 | 0.10 | 8.95 | 9.25 | 9.07 to 9.21 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 7.33 | 1.67 | 4.56 | 10.46 | 6.14 to 8.53 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 1.7 | 0.4 | 1.1 | 2.4 | 1.4 to 2.0 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 7.68 | 1.79 | 5.10 | 11.04 | 6.40 to 8.96 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 1.8 | 0.4 | 1.2 | 2.6 | 1.5 to 2.1 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 18.10 | 3.90 | 12.00 | 25.00 | 15.31 to 20.89 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1275.80 | 53.57 | 1214.00 | 1372.00 | 1237.48 to 1314.12 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 14.30 | 2.83 | 9.00 | 20.00 | 12.28 to 16.32 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1419.70 | 29.96 | 1370.00 | 1474.00 | 1398.27 to 1441.13 |
| headline share | Hillegass Avenue NB from freeway | % | 52.3 | 3.2 | 47.0 | 57.0 | 50.0 to 54.6 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 0.8 | 0.6 | 0.0 | 1.9 | 0.4 to 1.2 |
| share | Hillegass Avenue NB to College Avenue | % | 2.6 | 1.3 | 0.5 | 5.0 | 1.6 to 3.5 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 23.5 | 2.9 | 17.9 | 26.7 | 21.4 to 25.6 |
| headline share | Colby Street NB from freeway | % | 74.1 | 2.9 | 69.4 | 79.4 | 72.0 to 76.2 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 11.6 | 2.9 | 7.6 | 16.2 | 9.5 to 13.6 |
| share | Colby Street NB to Telegraph Avenue | % | 13.9 | 2.4 | 9.7 | 18.5 | 12.2 to 15.7 |
| share | Colby Street NB to College Avenue | % | 1.8 | 0.9 | 0.5 | 3.1 | 1.1 to 2.4 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 2.3 | 1.3 | 0.0 | 3.8 | 1.4 to 3.2 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 0.8 | 0.8 | 0.0 | 2.6 | 0.3 to 1.4 |
| share | Hillegass Avenue SB from College Avenue | % | 1.5 | 1.5 | 0.0 | 5.0 | 0.5 to 2.6 |
| headline share | Hillegass Avenue SB to freeway | % | 56.1 | 3.4 | 51.0 | 62.4 | 53.7 to 58.6 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 37.9 | 3.2 | 32.1 | 41.6 | 35.6 to 40.2 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 14.5 | 2.5 | 9.0 | 17.4 | 12.7 to 16.2 |
| share | Colby Street SB from Telegraph Avenue | % | 16.6 | 2.1 | 12.5 | 19.8 | 15.1 to 18.1 |
| headline share | Colby Street SB to freeway | % | 64.9 | 3.0 | 58.6 | 68.1 | 62.8 to 67.1 |
| share | Colby Street SB to Forest Street | % | 8.7 | 2.1 | 5.8 | 13.1 | 7.2 to 10.1 |
| ramp share | onto freeway via College Avenue | % | 19.4 | 1.6 | 16.3 | 21.2 | 18.2 to 20.5 |
| ramp share | onto freeway via Hillegass Avenue | % | 17.2 | 1.8 | 13.0 | 19.6 | 15.9 to 18.4 |
| ramp share | onto freeway via Martin Street | % | 21.6 | 1.9 | 17.8 | 24.6 | 20.3 to 23.0 |
| ramp share | onto freeway via Colby Street | % | 23.9 | 1.5 | 20.8 | 26.1 | 22.8 to 25.0 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 7.4 | 1.2 | 5.7 | 9.0 | 6.5 to 8.2 |
| ramp share | onto freeway via Benvenue Avenue | % | 1.7 | 0.5 | 0.9 | 2.6 | 1.3 to 2.0 |
| ramp share | from freeway via College Avenue | % | 6.3 | 1.1 | 5.1 | 8.7 | 5.5 to 7.0 |
| ramp share | from freeway via Martin Street | % | 19.8 | 1.7 | 17.4 | 22.3 | 18.5 to 21.0 |
| ramp share | from freeway via Colby Street | % | 19.2 | 1.2 | 18.0 | 20.7 | 18.4 to 20.1 |
| ramp share | from freeway via Hillegass Avenue | % | 8.4 | 0.5 | 7.5 | 9.1 | 8.0 to 8.8 |
| ramp share | from freeway via Benvenue Avenue | % | 1.6 | 0.6 | 0.9 | 2.9 | 1.1 to 2.0 |
| corridor flow | Telegraph N median link flow | veh/h | 1122.96 | 45.93 | 1088.40 | 1213.20 | 1090.11 to 1155.81 |
| corridor flow | Telegraph S median link flow | veh/h | 710.88 | 62.95 | 624.00 | 806.40 | 665.85 to 755.91 |
| corridor flow | College N median link flow | veh/h | 366.36 | 35.56 | 307.20 | 438.00 | 340.93 to 391.79 |
| corridor flow | College S median link flow | veh/h | 608.88 | 35.76 | 544.80 | 657.60 | 583.30 to 634.46 |
| corridor flow | Claremont N median link flow | veh/h | 375.60 | 48.25 | 292.80 | 458.40 | 341.08 to 410.12 |
| corridor flow | Claremont S median link flow | veh/h | 401.28 | 20.14 | 357.60 | 420.00 | 386.88 to 415.68 |
| corridor flow | Alcatraz E median link flow | veh/h | 475.44 | 26.30 | 432.00 | 511.20 | 456.63 to 494.25 |
| corridor flow | Alcatraz W median link flow | veh/h | 395.40 | 31.05 | 343.20 | 439.20 | 373.19 to 417.61 |
| corridor flow | Hillegass N median link flow | veh/h | 98.76 | 14.52 | 76.80 | 121.20 | 88.37 to 109.15 |
| corridor flow | Hillegass S median link flow | veh/h | 115.44 | 7.73 | 103.20 | 127.20 | 109.91 to 120.97 |
| corridor flow | Colby N median link flow | veh/h | 148.68 | 9.72 | 133.20 | 160.80 | 141.72 to 155.64 |
| corridor flow | Colby S median link flow | veh/h | 149.16 | 13.61 | 132.00 | 170.40 | 139.42 to 158.90 |
| corridor flow | Martin E median link flow | veh/h | 133.08 | 10.24 | 121.20 | 148.80 | 125.76 to 140.40 |
| corridor flow | Martin W median link flow | veh/h | 169.20 | 20.87 | 138.00 | 196.80 | 154.27 to 184.13 |

Per-seed detail: `rockridge-pm_peak-s1-seed1.md` (seed 1 in full).
