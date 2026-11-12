# rockridge-midday-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 10.01 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.00 | 0.00 | 0.00 | 0.01 | -0.00 to 0.01 |
| health | backlog growth in the second half of the run | points of spawned | -0.00 | 0.01 | -0.01 | 0.01 | -0.01 to 0.01 |
| health | completed trips | trips | 14900.90 | 125.12 | 14699.00 | 15082.00 | 14811.40 to 14990.40 |
| health | arterial mean speed | m/s | 10.01 | 0.07 | 9.85 | 10.09 | 9.95 to 10.06 |
| health | arterial mean speed, last 15 min | m/s | 10.03 | 0.15 | 9.81 | 10.26 | 9.92 to 10.14 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 8.79 | 2.43 | 5.04 | 11.45 | 7.05 to 10.53 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 3.0 | 0.8 | 1.8 | 4.0 | 2.4 to 3.5 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 15.17 | 1.59 | 12.76 | 17.32 | 14.04 to 16.31 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 5.1 | 0.5 | 4.4 | 6.1 | 4.7 to 5.5 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 3.80 | 2.53 | 1.00 | 9.00 | 1.99 to 5.61 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 881.90 | 41.73 | 829.00 | 948.00 | 852.05 to 911.75 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 7.70 | 2.71 | 2.00 | 11.00 | 5.76 to 9.64 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 833.40 | 44.42 | 793.00 | 918.00 | 801.63 to 865.17 |
| headline share | Hillegass Avenue NB from freeway | % | 55.8 | 5.0 | 48.1 | 61.8 | 52.2 to 59.4 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 4.1 | 1.9 | 1.4 | 7.4 | 2.8 to 5.5 |
| share | Hillegass Avenue NB to College Avenue | % | 7.9 | 2.7 | 2.6 | 11.1 | 5.9 to 9.8 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 27.4 | 4.4 | 18.8 | 33.8 | 24.2 to 30.6 |
| headline share | Colby Street NB from freeway | % | 72.1 | 3.7 | 64.8 | 76.5 | 69.4 to 74.8 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 8.3 | 2.7 | 4.7 | 12.4 | 6.4 to 10.3 |
| share | Colby Street NB to Telegraph Avenue | % | 27.9 | 6.3 | 16.7 | 35.8 | 23.4 to 32.4 |
| share | Colby Street NB to College Avenue | % | 1.6 | 0.8 | 0.8 | 3.1 | 1.0 to 2.2 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 11.8 | 2.3 | 8.6 | 16.2 | 10.1 to 13.4 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 2.1 | 1.2 | 0.0 | 4.1 | 1.3 to 3.0 |
| share | Hillegass Avenue SB from College Avenue | % | 5.5 | 1.4 | 3.1 | 7.2 | 4.5 to 6.5 |
| headline share | Hillegass Avenue SB to freeway | % | 72.4 | 4.4 | 64.8 | 77.0 | 69.3 to 75.5 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 10.3 | 2.8 | 5.8 | 15.2 | 8.4 to 12.3 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 23.8 | 4.3 | 18.2 | 29.5 | 20.7 to 26.8 |
| share | Colby Street SB from Telegraph Avenue | % | 21.0 | 3.0 | 17.4 | 25.1 | 18.9 to 23.2 |
| headline share | Colby Street SB to freeway | % | 69.3 | 4.1 | 61.4 | 76.5 | 66.4 to 72.3 |
| share | Colby Street SB to Forest Street | % | 14.5 | 4.0 | 7.6 | 18.5 | 11.7 to 17.4 |
| ramp share | onto freeway via College Avenue | % | 11.6 | 1.9 | 8.5 | 15.6 | 10.2 to 12.9 |
| ramp share | onto freeway via Hillegass Avenue | % | 11.6 | 1.6 | 7.7 | 13.0 | 10.4 to 12.7 |
| ramp share | onto freeway via Martin Street | % | 13.1 | 1.6 | 10.8 | 15.9 | 12.0 to 14.3 |
| ramp share | onto freeway via Colby Street | % | 16.0 | 2.0 | 13.8 | 19.8 | 14.5 to 17.4 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 10.4 | 1.3 | 8.0 | 12.3 | 9.5 to 11.4 |
| ramp share | onto freeway via Benvenue Avenue | % | 3.4 | 0.8 | 2.2 | 4.4 | 2.9 to 3.9 |
| ramp share | from freeway via College Avenue | % | 4.8 | 0.8 | 3.9 | 6.1 | 4.2 to 5.4 |
| ramp share | from freeway via Martin Street | % | 20.2 | 1.7 | 16.4 | 22.1 | 19.0 to 21.4 |
| ramp share | from freeway via Colby Street | % | 10.5 | 1.1 | 8.7 | 11.9 | 9.7 to 11.2 |
| ramp share | from freeway via Hillegass Avenue | % | 4.6 | 0.4 | 3.5 | 5.0 | 4.2 to 4.9 |
| ramp share | from freeway via Benvenue Avenue | % | 1.6 | 0.5 | 0.8 | 2.6 | 1.2 to 1.9 |
| corridor flow | Telegraph N median link flow | veh/h | 691.92 | 41.51 | 630.00 | 741.60 | 662.23 to 721.61 |
| corridor flow | Telegraph S median link flow | veh/h | 655.44 | 83.23 | 519.60 | 758.40 | 595.90 to 714.98 |
| corridor flow | College N median link flow | veh/h | 149.40 | 17.18 | 122.40 | 180.00 | 137.11 to 161.69 |
| corridor flow | College S median link flow | veh/h | 296.28 | 34.89 | 256.80 | 367.20 | 271.33 to 321.23 |
| corridor flow | Claremont N median link flow | veh/h | 394.20 | 31.75 | 350.40 | 441.60 | 371.49 to 416.91 |
| corridor flow | Claremont S median link flow | veh/h | 433.08 | 30.52 | 400.80 | 480.00 | 411.25 to 454.91 |
| corridor flow | Alcatraz E median link flow | veh/h | 360.12 | 32.89 | 315.60 | 417.60 | 336.60 to 383.64 |
| corridor flow | Alcatraz W median link flow | veh/h | 314.28 | 21.93 | 272.40 | 338.40 | 298.60 to 329.96 |
| corridor flow | Hillegass N median link flow | veh/h | 50.76 | 6.88 | 38.40 | 60.00 | 45.84 to 55.68 |
| corridor flow | Hillegass S median link flow | veh/h | 73.20 | 11.80 | 51.60 | 90.00 | 64.76 to 81.64 |
| corridor flow | Colby N median link flow | veh/h | 62.64 | 5.36 | 54.00 | 72.00 | 58.81 to 66.47 |
| corridor flow | Colby S median link flow | veh/h | 106.08 | 18.78 | 81.60 | 145.20 | 92.65 to 119.51 |
| corridor flow | Martin E median link flow | veh/h | 107.76 | 12.91 | 88.80 | 122.40 | 98.53 to 116.99 |
| corridor flow | Martin W median link flow | veh/h | 188.64 | 17.76 | 157.20 | 212.40 | 175.94 to 201.34 |

Per-seed detail: `rockridge-midday-s1-seed1.md` (seed 1 in full).
