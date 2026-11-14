# rockridge-am_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.10 (min 0.00, max 1.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.67 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 9 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.10 | 0.32 | 0.00 | 1.00 | -0.13 to 0.33 |
| health | gridlock removals per hour | veh/h | 0.10 | 0.32 | 0.00 | 1.00 | -0.13 to 0.33 |
| health | entry backlog | % of spawned | 0.01 | 0.01 | 0.00 | 0.02 | 0.01 to 0.01 |
| health | backlog growth in the second half of the run | points of spawned | 0.00 | 0.01 | -0.00 | 0.02 | -0.00 to 0.01 |
| health | completed trips | trips | 21804.90 | 148.34 | 21530.00 | 21988.00 | 21698.79 to 21911.01 |
| health | arterial mean speed | m/s | 9.67 | 0.05 | 9.60 | 9.74 | 9.64 to 9.71 |
| health | arterial mean speed, last 15 min | m/s | 9.73 | 0.12 | 9.46 | 9.89 | 9.64 to 9.81 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 5.44 | 1.60 | 3.65 | 8.55 | 4.29 to 6.58 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 1.6 | 0.5 | 1.1 | 2.5 | 1.2 to 1.9 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 5.77 | 1.57 | 4.10 | 8.53 | 4.64 to 6.89 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 1.7 | 0.4 | 1.2 | 2.4 | 1.4 to 2.0 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 19.80 | 3.94 | 12.00 | 24.00 | 16.98 to 22.62 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 904.80 | 34.03 | 840.00 | 967.00 | 880.46 to 929.14 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 9.80 | 2.04 | 7.00 | 13.00 | 8.34 to 11.26 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1078.70 | 40.01 | 1007.00 | 1131.00 | 1050.08 to 1107.32 |
| headline share | Hillegass Avenue NB from freeway | % | 57.6 | 3.9 | 52.3 | 63.4 | 54.7 to 60.4 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 0.9 | 0.7 | 0.0 | 2.1 | 0.4 to 1.4 |
| share | Hillegass Avenue NB to College Avenue | % | 3.2 | 1.4 | 1.4 | 5.4 | 2.2 to 4.3 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 28.7 | 2.8 | 24.1 | 32.0 | 26.7 to 30.8 |
| headline share | Colby Street NB from freeway | % | 40.9 | 3.4 | 35.6 | 44.7 | 38.5 to 43.3 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 55.3 | 2.5 | 50.9 | 58.0 | 53.6 to 57.1 |
| share | Colby Street NB to Telegraph Avenue | % | 34.3 | 2.2 | 31.4 | 37.3 | 32.8 to 35.9 |
| share | Colby Street NB to College Avenue | % | 2.9 | 0.7 | 1.7 | 4.2 | 2.4 to 3.4 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 8.3 | 2.0 | 4.2 | 10.0 | 6.9 to 9.7 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 1.9 | 0.8 | 0.8 | 2.8 | 1.3 to 2.5 |
| share | Hillegass Avenue SB from College Avenue | % | 5.9 | 1.7 | 3.5 | 8.2 | 4.7 to 7.2 |
| headline share | Hillegass Avenue SB to freeway | % | 66.3 | 3.5 | 60.9 | 72.9 | 63.8 to 68.8 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 14.5 | 1.4 | 12.4 | 16.2 | 13.4 to 15.5 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 8.6 | 2.0 | 5.9 | 12.4 | 7.1 to 10.0 |
| share | Colby Street SB from Telegraph Avenue | % | 16.0 | 1.9 | 13.2 | 18.1 | 14.6 to 17.3 |
| headline share | Colby Street SB to freeway | % | 50.9 | 2.4 | 46.6 | 53.0 | 49.2 to 52.6 |
| share | Colby Street SB to Forest Street | % | 10.2 | 1.7 | 8.3 | 13.3 | 9.0 to 11.4 |
| ramp share | onto freeway via College Avenue | % | 14.1 | 1.3 | 10.9 | 15.6 | 13.1 to 15.0 |
| ramp share | onto freeway via Hillegass Avenue | % | 12.5 | 2.0 | 8.7 | 16.3 | 11.0 to 13.9 |
| ramp share | onto freeway via Martin Street | % | 14.5 | 1.4 | 12.3 | 16.8 | 13.5 to 15.5 |
| ramp share | onto freeway via Colby Street | % | 15.6 | 1.2 | 14.1 | 18.4 | 14.7 to 16.5 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 8.2 | 0.9 | 6.7 | 9.5 | 7.5 to 8.9 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.6 | 0.7 | 3.5 | 5.6 | 4.1 to 5.0 |
| ramp share | from freeway via College Avenue | % | 9.2 | 1.2 | 7.1 | 11.2 | 8.4 to 10.1 |
| ramp share | from freeway via Martin Street | % | 12.7 | 1.2 | 10.4 | 14.2 | 11.9 to 13.5 |
| ramp share | from freeway via Colby Street | % | 12.8 | 1.5 | 10.8 | 15.6 | 11.7 to 13.8 |
| ramp share | from freeway via Hillegass Avenue | % | 6.7 | 1.3 | 4.6 | 8.6 | 5.8 to 7.7 |
| ramp share | from freeway via Benvenue Avenue | % | 2.6 | 0.5 | 1.7 | 3.3 | 2.3 to 3.0 |
| corridor flow | Telegraph N median link flow | veh/h | 760.32 | 39.05 | 718.80 | 829.20 | 732.39 to 788.25 |
| corridor flow | Telegraph S median link flow | veh/h | 645.60 | 24.28 | 613.20 | 685.20 | 628.23 to 662.97 |
| corridor flow | College N median link flow | veh/h | 200.88 | 22.47 | 171.60 | 234.00 | 184.81 to 216.95 |
| corridor flow | College S median link flow | veh/h | 364.92 | 17.55 | 337.20 | 391.20 | 352.37 to 377.47 |
| corridor flow | Claremont N median link flow | veh/h | 360.84 | 24.79 | 307.20 | 387.60 | 343.10 to 378.58 |
| corridor flow | Claremont S median link flow | veh/h | 398.16 | 16.31 | 358.80 | 412.80 | 386.49 to 409.83 |
| corridor flow | Alcatraz E median link flow | veh/h | 345.24 | 22.96 | 312.00 | 385.20 | 328.81 to 361.67 |
| corridor flow | Alcatraz W median link flow | veh/h | 382.20 | 24.92 | 345.60 | 426.00 | 364.37 to 400.03 |
| corridor flow | Hillegass N median link flow | veh/h | 75.60 | 8.84 | 64.80 | 86.40 | 69.28 to 81.92 |
| corridor flow | Hillegass S median link flow | veh/h | 67.92 | 7.34 | 56.40 | 78.00 | 62.67 to 73.17 |
| corridor flow | Colby N median link flow | veh/h | 112.80 | 10.79 | 97.20 | 130.80 | 105.08 to 120.52 |
| corridor flow | Colby S median link flow | veh/h | 123.48 | 10.42 | 104.40 | 139.20 | 116.02 to 130.94 |
| corridor flow | Martin E median link flow | veh/h | 101.88 | 14.94 | 82.80 | 126.00 | 91.19 to 112.57 |
| corridor flow | Martin W median link flow | veh/h | 128.88 | 14.70 | 106.80 | 150.00 | 118.37 to 139.39 |

Per-seed detail: `rockridge-am_peak-s1-seed1.md` (seed 1 in full).
