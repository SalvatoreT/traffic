# rockridge-pm_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.30 (min 0.00, max 2.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.44 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 8 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.30 | 0.67 | 0.00 | 2.00 | -0.18 to 0.78 |
| health | gridlock removals per hour | veh/h | 0.30 | 0.67 | 0.00 | 2.00 | -0.18 to 0.78 |
| health | entry backlog | % of spawned | 0.03 | 0.02 | 0.00 | 0.06 | 0.02 to 0.05 |
| health | backlog growth in the second half of the run | points of spawned | 0.01 | 0.02 | -0.02 | 0.03 | -0.00 to 0.02 |
| health | completed trips | trips | 23818.00 | 251.45 | 23297.00 | 24093.00 | 23638.13 to 23997.87 |
| health | arterial mean speed | m/s | 9.44 | 0.07 | 9.30 | 9.53 | 9.39 to 9.49 |
| health | arterial mean speed, last 15 min | m/s | 9.46 | 0.11 | 9.30 | 9.61 | 9.38 to 9.54 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 8.46 | 2.33 | 5.87 | 12.15 | 6.79 to 10.13 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 2.2 | 0.6 | 1.6 | 3.1 | 1.7 to 2.6 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 19.02 | 2.96 | 14.13 | 23.29 | 16.90 to 21.13 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 4.9 | 0.8 | 3.6 | 6.0 | 4.3 to 5.4 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 16.90 | 4.12 | 11.00 | 26.00 | 13.95 to 19.85 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1433.70 | 25.93 | 1391.00 | 1477.00 | 1415.15 to 1452.25 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 8.50 | 2.32 | 5.00 | 12.00 | 6.84 to 10.16 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1497.80 | 34.97 | 1428.00 | 1553.00 | 1472.79 to 1522.81 |
| headline share | Hillegass Avenue NB from freeway | % | 56.8 | 2.8 | 53.0 | 62.5 | 54.8 to 58.8 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 1.5 | 0.9 | 0.6 | 3.0 | 0.9 to 2.1 |
| share | Hillegass Avenue NB to College Avenue | % | 3.6 | 1.6 | 1.3 | 5.7 | 2.4 to 4.8 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 20.8 | 2.4 | 18.0 | 24.8 | 19.1 to 22.4 |
| headline share | Colby Street NB from freeway | % | 51.8 | 3.2 | 47.7 | 56.7 | 49.5 to 54.1 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 14.7 | 2.4 | 10.6 | 19.6 | 13.0 to 16.4 |
| share | Colby Street NB to Telegraph Avenue | % | 28.8 | 4.6 | 17.5 | 33.3 | 25.5 to 32.1 |
| share | Colby Street NB to College Avenue | % | 1.5 | 1.1 | 0.5 | 3.6 | 0.7 to 2.2 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 5.7 | 1.0 | 3.5 | 6.8 | 5.0 to 6.4 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 2.7 | 1.3 | 0.6 | 4.5 | 1.8 to 3.6 |
| share | Hillegass Avenue SB from College Avenue | % | 4.8 | 1.4 | 2.7 | 7.9 | 3.7 to 5.8 |
| headline share | Hillegass Avenue SB to freeway | % | 67.3 | 5.7 | 52.5 | 71.8 | 63.2 to 71.3 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 17.3 | 3.2 | 12.8 | 23.0 | 15.1 to 19.6 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 13.2 | 2.8 | 9.3 | 18.2 | 11.2 to 15.2 |
| share | Colby Street SB from Telegraph Avenue | % | 18.6 | 2.8 | 15.0 | 22.7 | 16.6 to 20.7 |
| headline share | Colby Street SB to freeway | % | 66.4 | 3.7 | 61.2 | 74.3 | 63.7 to 69.0 |
| share | Colby Street SB to Forest Street | % | 15.8 | 3.6 | 9.3 | 19.7 | 13.2 to 18.4 |
| ramp share | onto freeway via College Avenue | % | 20.8 | 2.8 | 16.7 | 27.9 | 18.7 to 22.8 |
| ramp share | onto freeway via Hillegass Avenue | % | 13.8 | 1.6 | 10.3 | 16.4 | 12.7 to 14.9 |
| ramp share | onto freeway via Martin Street | % | 14.6 | 1.2 | 13.2 | 16.3 | 13.8 to 15.4 |
| ramp share | onto freeway via Colby Street | % | 15.9 | 2.8 | 9.9 | 19.4 | 13.9 to 17.9 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 7.2 | 1.6 | 4.7 | 10.3 | 6.0 to 8.4 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.6 | 0.6 | 3.7 | 5.5 | 4.2 to 5.0 |
| ramp share | from freeway via College Avenue | % | 6.6 | 0.9 | 5.6 | 8.4 | 6.0 to 7.3 |
| ramp share | from freeway via Martin Street | % | 14.7 | 0.9 | 12.9 | 15.8 | 14.0 to 15.3 |
| ramp share | from freeway via Colby Street | % | 12.4 | 1.6 | 10.2 | 14.6 | 11.3 to 13.5 |
| ramp share | from freeway via Hillegass Avenue | % | 6.8 | 0.7 | 5.7 | 7.8 | 6.3 to 7.3 |
| ramp share | from freeway via Benvenue Avenue | % | 2.7 | 0.6 | 1.8 | 3.8 | 2.3 to 3.2 |
| corridor flow | Telegraph N median link flow | veh/h | 1047.00 | 74.17 | 921.60 | 1201.20 | 993.95 to 1100.05 |
| corridor flow | Telegraph S median link flow | veh/h | 851.40 | 38.49 | 813.60 | 913.20 | 823.87 to 878.93 |
| corridor flow | College N median link flow | veh/h | 393.72 | 24.56 | 346.80 | 423.60 | 376.15 to 411.29 |
| corridor flow | College S median link flow | veh/h | 744.12 | 38.62 | 685.20 | 805.20 | 716.50 to 771.74 |
| corridor flow | Claremont N median link flow | veh/h | 445.92 | 22.93 | 414.00 | 482.40 | 429.52 to 462.32 |
| corridor flow | Claremont S median link flow | veh/h | 368.88 | 37.76 | 300.00 | 430.80 | 341.87 to 395.89 |
| corridor flow | Alcatraz E median link flow | veh/h | 429.96 | 34.71 | 369.60 | 483.60 | 405.13 to 454.79 |
| corridor flow | Alcatraz W median link flow | veh/h | 450.84 | 26.03 | 405.60 | 480.00 | 432.22 to 469.46 |
| corridor flow | Hillegass N median link flow | veh/h | 81.96 | 15.32 | 64.80 | 105.60 | 71.00 to 92.92 |
| corridor flow | Hillegass S median link flow | veh/h | 91.08 | 12.39 | 68.40 | 108.00 | 82.22 to 99.94 |
| corridor flow | Colby N median link flow | veh/h | 123.12 | 15.48 | 102.00 | 146.40 | 112.04 to 134.20 |
| corridor flow | Colby S median link flow | veh/h | 102.24 | 17.62 | 58.80 | 122.40 | 89.64 to 114.84 |
| corridor flow | Martin E median link flow | veh/h | 119.16 | 10.10 | 97.20 | 129.60 | 111.93 to 126.39 |
| corridor flow | Martin W median link flow | veh/h | 129.00 | 7.27 | 120.00 | 139.20 | 123.80 to 134.20 |

Per-seed detail: `rockridge-pm_peak-s1-seed1.md` (seed 1 in full).
