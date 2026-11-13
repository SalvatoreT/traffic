# rockridge-midday-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.96 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.00 | 0.01 | 0.00 | 0.01 | -0.00 to 0.01 |
| health | backlog growth in the second half of the run | points of spawned | -0.00 | 0.01 | -0.01 | 0.01 | -0.01 to 0.00 |
| health | completed trips | trips | 15731.70 | 114.66 | 15526.00 | 15895.00 | 15649.69 to 15813.71 |
| health | arterial mean speed | m/s | 9.96 | 0.09 | 9.82 | 10.09 | 9.90 to 10.03 |
| health | arterial mean speed, last 15 min | m/s | 9.93 | 0.16 | 9.68 | 10.20 | 9.81 to 10.05 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 6.96 | 1.75 | 4.29 | 9.34 | 5.70 to 8.21 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 2.4 | 0.5 | 1.5 | 3.0 | 2.0 to 2.8 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 5.97 | 1.42 | 3.56 | 7.98 | 4.96 to 6.99 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 2.1 | 0.5 | 1.2 | 2.9 | 1.7 to 2.4 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 8.30 | 2.98 | 5.00 | 14.00 | 6.17 to 10.43 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 752.40 | 34.95 | 701.00 | 803.00 | 727.40 to 777.40 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 6.10 | 3.18 | 1.00 | 11.00 | 3.83 to 8.37 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 809.50 | 40.24 | 763.00 | 897.00 | 780.71 to 838.29 |
| headline share | Hillegass Avenue NB from freeway | % | 64.9 | 3.3 | 58.2 | 69.8 | 62.5 to 67.2 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 1.4 | 1.2 | 0.0 | 3.8 | 0.6 to 2.3 |
| share | Hillegass Avenue NB to College Avenue | % | 5.7 | 3.9 | 1.1 | 14.9 | 2.9 to 8.5 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 27.9 | 6.3 | 17.7 | 38.7 | 23.4 to 32.4 |
| headline share | Colby Street NB from freeway | % | 76.6 | 4.9 | 66.9 | 83.2 | 73.1 to 80.1 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 5.1 | 3.1 | 1.6 | 11.0 | 2.9 to 7.3 |
| share | Colby Street NB to Telegraph Avenue | % | 18.6 | 4.0 | 13.1 | 26.8 | 15.7 to 21.5 |
| share | Colby Street NB to College Avenue | % | 1.0 | 1.2 | 0.0 | 3.9 | 0.2 to 1.9 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 8.0 | 2.6 | 3.8 | 12.5 | 6.1 to 9.8 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 1.9 | 1.1 | 0.7 | 3.7 | 1.1 to 2.6 |
| share | Hillegass Avenue SB from College Avenue | % | 5.3 | 1.9 | 3.0 | 9.4 | 4.0 to 6.7 |
| headline share | Hillegass Avenue SB to freeway | % | 75.5 | 2.4 | 73.4 | 80.5 | 73.8 to 77.3 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 14.5 | 3.3 | 8.0 | 19.7 | 12.2 to 16.9 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 27.6 | 3.7 | 22.4 | 34.4 | 25.0 to 30.3 |
| share | Colby Street SB from Telegraph Avenue | % | 21.7 | 3.5 | 17.4 | 26.8 | 19.2 to 24.2 |
| headline share | Colby Street SB to freeway | % | 69.9 | 3.8 | 62.9 | 76.1 | 67.2 to 72.6 |
| share | Colby Street SB to Forest Street | % | 9.3 | 2.6 | 5.5 | 15.2 | 7.4 to 11.2 |
| ramp share | onto freeway via College Avenue | % | 15.6 | 1.9 | 11.7 | 17.9 | 14.3 to 16.9 |
| ramp share | onto freeway via Hillegass Avenue | % | 15.0 | 1.3 | 12.7 | 16.5 | 14.0 to 15.9 |
| ramp share | onto freeway via Martin Street | % | 18.1 | 1.5 | 15.3 | 20.3 | 17.0 to 19.2 |
| ramp share | onto freeway via Colby Street | % | 15.7 | 2.3 | 13.5 | 20.9 | 14.0 to 17.3 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 8.1 | 1.6 | 5.2 | 10.3 | 7.0 to 9.2 |
| ramp share | onto freeway via Benvenue Avenue | % | 3.6 | 0.9 | 2.1 | 5.2 | 2.9 to 4.3 |
| ramp share | from freeway via College Avenue | % | 5.7 | 1.0 | 4.4 | 7.3 | 5.0 to 6.4 |
| ramp share | from freeway via Martin Street | % | 16.2 | 1.5 | 13.4 | 19.0 | 15.1 to 17.3 |
| ramp share | from freeway via Colby Street | % | 11.7 | 1.2 | 9.7 | 13.6 | 10.9 to 12.6 |
| ramp share | from freeway via Hillegass Avenue | % | 7.2 | 0.9 | 5.4 | 8.4 | 6.6 to 7.9 |
| ramp share | from freeway via Benvenue Avenue | % | 1.4 | 0.4 | 0.8 | 1.9 | 1.1 to 1.7 |
| corridor flow | Telegraph N median link flow | veh/h | 594.36 | 42.39 | 538.80 | 657.60 | 564.04 to 624.68 |
| corridor flow | Telegraph S median link flow | veh/h | 611.76 | 26.68 | 556.80 | 660.00 | 592.68 to 630.84 |
| corridor flow | College N median link flow | veh/h | 145.32 | 11.43 | 129.60 | 164.40 | 137.14 to 153.50 |
| corridor flow | College S median link flow | veh/h | 321.72 | 29.65 | 276.00 | 361.20 | 300.51 to 342.93 |
| corridor flow | Claremont N median link flow | veh/h | 419.04 | 21.81 | 394.80 | 460.80 | 403.44 to 434.64 |
| corridor flow | Claremont S median link flow | veh/h | 439.80 | 38.48 | 370.80 | 504.00 | 412.27 to 467.33 |
| corridor flow | Alcatraz E median link flow | veh/h | 368.28 | 27.89 | 331.20 | 400.80 | 348.33 to 388.23 |
| corridor flow | Alcatraz W median link flow | veh/h | 328.80 | 20.52 | 292.80 | 364.80 | 314.12 to 343.48 |
| corridor flow | Hillegass N median link flow | veh/h | 61.56 | 7.31 | 51.60 | 75.60 | 56.33 to 66.79 |
| corridor flow | Hillegass S median link flow | veh/h | 87.84 | 8.85 | 72.00 | 100.80 | 81.51 to 94.17 |
| corridor flow | Colby N median link flow | veh/h | 82.20 | 9.25 | 67.20 | 94.80 | 75.59 to 88.81 |
| corridor flow | Colby S median link flow | veh/h | 100.32 | 15.17 | 81.60 | 133.20 | 89.47 to 111.17 |
| corridor flow | Martin E median link flow | veh/h | 128.52 | 10.84 | 117.60 | 151.20 | 120.76 to 136.28 |
| corridor flow | Martin W median link flow | veh/h | 136.68 | 14.08 | 115.20 | 153.60 | 126.61 to 146.75 |

Per-seed detail: `rockridge-midday-s1-seed1.md` (seed 1 in full).
