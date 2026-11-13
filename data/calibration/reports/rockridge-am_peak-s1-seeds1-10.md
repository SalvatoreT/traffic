# rockridge-am_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.30 (min 0.00, max 1.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 8.67 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 7 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.30 | 0.48 | 0.00 | 1.00 | -0.05 to 0.65 |
| health | gridlock removals per hour | veh/h | 0.30 | 0.48 | 0.00 | 1.00 | -0.05 to 0.65 |
| health | entry backlog | % of spawned | 0.01 | 0.01 | 0.00 | 0.02 | 0.01 to 0.02 |
| health | backlog growth in the second half of the run | points of spawned | -0.01 | 0.02 | -0.04 | 0.02 | -0.02 to 0.01 |
| health | completed trips | trips | 21695.80 | 168.36 | 21450.00 | 22047.00 | 21575.37 to 21816.23 |
| health | arterial mean speed | m/s | 8.67 | 0.09 | 8.54 | 8.79 | 8.60 to 8.73 |
| health | arterial mean speed, last 15 min | m/s | 8.46 | 0.14 | 8.28 | 8.71 | 8.36 to 8.56 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 9.94 | 3.41 | 6.25 | 17.29 | 7.50 to 12.38 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 2.6 | 0.8 | 1.7 | 4.3 | 2.0 to 3.2 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 2.57 | 0.79 | 1.19 | 3.85 | 2.01 to 3.14 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 0.7 | 0.2 | 0.3 | 1.0 | 0.5 to 0.8 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 5.80 | 2.39 | 1.00 | 10.00 | 4.09 to 7.51 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 958.50 | 29.32 | 920.00 | 1011.00 | 937.53 to 979.47 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 18.70 | 5.48 | 12.00 | 29.00 | 14.78 to 22.62 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 966.30 | 28.76 | 915.00 | 1000.00 | 945.73 to 986.87 |
| headline share | Hillegass Avenue NB from freeway | % | 56.1 | 3.4 | 50.8 | 61.1 | 53.6 to 58.5 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 2.5 | 1.6 | 0.7 | 5.4 | 1.4 to 3.6 |
| share | Hillegass Avenue NB to College Avenue | % | 6.2 | 1.9 | 2.2 | 8.2 | 4.8 to 7.5 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 16.1 | 2.7 | 11.5 | 20.5 | 14.2 to 18.1 |
| headline share | Colby Street NB from freeway | % | 58.0 | 3.6 | 51.5 | 62.8 | 55.4 to 60.6 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 10.9 | 1.7 | 7.8 | 14.2 | 9.7 to 12.1 |
| share | Colby Street NB to Telegraph Avenue | % | 19.6 | 3.3 | 13.8 | 23.7 | 17.3 to 22.0 |
| share | Colby Street NB to College Avenue | % | 2.6 | 1.3 | 0.5 | 5.3 | 1.6 to 3.5 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 9.8 | 3.8 | 5.8 | 18.2 | 7.1 to 12.6 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 2.2 | 1.0 | 0.0 | 3.0 | 1.5 to 2.9 |
| share | Hillegass Avenue SB from College Avenue | % | 5.7 | 1.8 | 2.9 | 8.5 | 4.5 to 7.0 |
| headline share | Hillegass Avenue SB to freeway | % | 46.0 | 3.1 | 42.4 | 51.7 | 43.8 to 48.2 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 10.6 | 2.0 | 6.8 | 13.2 | 9.1 to 12.0 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 19.0 | 3.7 | 14.0 | 26.1 | 16.3 to 21.6 |
| share | Colby Street SB from Telegraph Avenue | % | 20.2 | 1.4 | 17.1 | 21.6 | 19.3 to 21.2 |
| headline share | Colby Street SB to freeway | % | 63.5 | 5.0 | 55.4 | 71.0 | 59.9 to 67.1 |
| share | Colby Street SB to Forest Street | % | 7.5 | 1.6 | 5.4 | 9.8 | 6.4 to 8.6 |
| ramp share | onto freeway via College Avenue | % | 16.5 | 1.6 | 14.6 | 19.9 | 15.3 to 17.6 |
| ramp share | onto freeway via Hillegass Avenue | % | 12.8 | 1.5 | 11.0 | 14.8 | 11.8 to 13.9 |
| ramp share | onto freeway via Martin Street | % | 17.3 | 2.9 | 15.0 | 24.8 | 15.2 to 19.4 |
| ramp share | onto freeway via Colby Street | % | 26.9 | 2.6 | 21.9 | 31.3 | 25.0 to 28.7 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 16.2 | 2.5 | 11.8 | 20.9 | 14.5 to 18.0 |
| ramp share | onto freeway via Benvenue Avenue | % | 3.7 | 0.7 | 2.7 | 5.2 | 3.2 to 4.2 |
| ramp share | from freeway via College Avenue | % | 7.0 | 1.1 | 4.5 | 8.2 | 6.3 to 7.8 |
| ramp share | from freeway via Martin Street | % | 20.2 | 1.6 | 17.3 | 22.6 | 19.0 to 21.3 |
| ramp share | from freeway via Colby Street | % | 17.8 | 2.0 | 14.1 | 20.7 | 16.4 to 19.2 |
| ramp share | from freeway via Hillegass Avenue | % | 9.1 | 1.5 | 7.4 | 12.1 | 8.1 to 10.2 |
| ramp share | from freeway via Benvenue Avenue | % | 2.4 | 0.5 | 1.7 | 3.1 | 2.1 to 2.8 |
| corridor flow | Telegraph N median link flow | veh/h | 801.84 | 34.73 | 753.60 | 843.60 | 777.00 to 826.68 |
| corridor flow | Telegraph S median link flow | veh/h | 726.96 | 62.99 | 651.60 | 840.00 | 681.90 to 772.02 |
| corridor flow | College N median link flow | veh/h | 196.56 | 28.82 | 162.00 | 267.60 | 175.95 to 217.17 |
| corridor flow | College S median link flow | veh/h | 524.52 | 34.54 | 471.60 | 588.00 | 499.82 to 549.22 |
| corridor flow | Claremont N median link flow | veh/h | 341.52 | 24.16 | 295.20 | 372.00 | 324.24 to 358.80 |
| corridor flow | Claremont S median link flow | veh/h | 422.88 | 30.47 | 387.60 | 466.80 | 401.08 to 444.68 |
| corridor flow | Alcatraz E median link flow | veh/h | 380.88 | 20.14 | 357.60 | 412.80 | 366.48 to 395.28 |
| corridor flow | Alcatraz W median link flow | veh/h | 326.28 | 35.81 | 255.60 | 386.40 | 300.67 to 351.89 |
| corridor flow | Hillegass N median link flow | veh/h | 81.00 | 8.14 | 67.20 | 92.40 | 75.17 to 86.83 |
| corridor flow | Hillegass S median link flow | veh/h | 90.72 | 7.20 | 79.20 | 98.40 | 85.57 to 95.87 |
| corridor flow | Colby N median link flow | veh/h | 118.32 | 11.64 | 93.60 | 138.00 | 110.00 to 126.64 |
| corridor flow | Colby S median link flow | veh/h | 162.96 | 13.89 | 139.20 | 192.00 | 153.03 to 172.89 |
| corridor flow | Martin E median link flow | veh/h | 142.20 | 20.21 | 118.80 | 189.60 | 127.74 to 156.66 |
| corridor flow | Martin W median link flow | veh/h | 182.16 | 10.34 | 162.00 | 199.20 | 174.77 to 189.55 |

Per-seed detail: `rockridge-am_peak-s1-seed1.md` (seed 1 in full).
