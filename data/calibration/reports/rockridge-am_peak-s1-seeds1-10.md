# rockridge-am_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 1.10 (min 0.00, max 5.00) | NO |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 8.65 m/s | yes |

**Verdict: not stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 6 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 1.10 | 1.85 | 0.00 | 5.00 | -0.23 to 2.43 |
| health | gridlock removals per hour | veh/h | 1.10 | 1.85 | 0.00 | 5.00 | -0.23 to 2.43 |
| health | entry backlog | % of spawned | 0.03 | 0.03 | 0.00 | 0.11 | 0.01 to 0.06 |
| health | backlog growth in the second half of the run | points of spawned | -0.01 | 0.09 | -0.22 | 0.11 | -0.07 to 0.05 |
| health | completed trips | trips | 20527.00 | 133.46 | 20366.00 | 20714.00 | 20431.54 to 20622.46 |
| health | arterial mean speed | m/s | 8.65 | 0.30 | 8.07 | 9.02 | 8.43 to 8.87 |
| health | arterial mean speed, last 15 min | m/s | 8.46 | 0.40 | 7.80 | 8.90 | 8.18 to 8.75 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 6.89 | 1.75 | 4.29 | 9.79 | 5.64 to 8.14 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 1.8 | 0.5 | 1.2 | 2.5 | 1.4 to 2.1 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 8.76 | 1.97 | 5.66 | 11.65 | 7.35 to 10.17 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 2.2 | 0.5 | 1.5 | 3.0 | 1.9 to 2.6 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 2.80 | 0.63 | 2.00 | 4.00 | 2.35 to 3.25 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 918.30 | 30.86 | 869.00 | 965.00 | 896.23 to 940.37 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 14.80 | 4.05 | 7.00 | 21.00 | 11.90 to 17.70 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 936.80 | 23.80 | 900.00 | 971.00 | 919.78 to 953.82 |
| headline share | Hillegass Avenue NB from freeway | % | 70.7 | 4.0 | 64.9 | 78.1 | 67.9 to 73.5 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 4.1 | 1.8 | 0.9 | 6.2 | 2.7 to 5.4 |
| share | Hillegass Avenue NB to College Avenue | % | 8.3 | 3.3 | 3.8 | 12.6 | 6.0 to 10.6 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 22.3 | 3.6 | 16.7 | 28.4 | 19.6 to 24.9 |
| headline share | Colby Street NB from freeway | % | 80.5 | 2.7 | 74.1 | 83.8 | 78.5 to 82.5 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 6.0 | 1.2 | 4.3 | 7.6 | 5.1 to 6.9 |
| share | Colby Street NB to Telegraph Avenue | % | 17.7 | 3.0 | 12.0 | 21.6 | 15.6 to 19.9 |
| share | Colby Street NB to College Avenue | % | 1.6 | 0.9 | 0.5 | 3.2 | 1.0 to 2.3 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 13.6 | 3.5 | 8.1 | 18.4 | 11.1 to 16.1 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 1.6 | 1.2 | 0.0 | 3.2 | 0.7 to 2.4 |
| share | Hillegass Avenue SB from College Avenue | % | 4.9 | 1.6 | 2.7 | 7.6 | 3.8 to 6.1 |
| headline share | Hillegass Avenue SB to freeway | % | 66.6 | 4.8 | 59.3 | 72.1 | 63.2 to 70.1 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 9.8 | 2.4 | 6.6 | 13.9 | 8.1 to 11.5 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 20.7 | 4.3 | 13.7 | 28.0 | 17.6 to 23.8 |
| share | Colby Street SB from Telegraph Avenue | % | 23.6 | 3.0 | 18.7 | 27.9 | 21.4 to 25.7 |
| headline share | Colby Street SB to freeway | % | 68.9 | 4.1 | 62.9 | 77.7 | 66.0 to 71.8 |
| share | Colby Street SB to Forest Street | % | 11.2 | 3.0 | 6.6 | 16.0 | 9.0 to 13.3 |
| ramp share | onto freeway via College Avenue | % | 14.5 | 1.4 | 11.9 | 16.5 | 13.5 to 15.5 |
| ramp share | onto freeway via Hillegass Avenue | % | 11.3 | 1.7 | 8.7 | 14.8 | 10.1 to 12.5 |
| ramp share | onto freeway via Martin Street | % | 13.1 | 1.4 | 11.7 | 16.4 | 12.1 to 14.0 |
| ramp share | onto freeway via Colby Street | % | 17.9 | 1.0 | 15.9 | 19.3 | 17.2 to 18.6 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 8.6 | 0.7 | 7.9 | 9.9 | 8.2 to 9.1 |
| ramp share | onto freeway via Benvenue Avenue | % | 3.3 | 0.7 | 1.9 | 4.4 | 2.8 to 3.8 |
| ramp share | from freeway via College Avenue | % | 7.0 | 0.6 | 6.4 | 8.0 | 6.6 to 7.5 |
| ramp share | from freeway via Martin Street | % | 17.5 | 1.9 | 14.5 | 20.0 | 16.1 to 18.8 |
| ramp share | from freeway via Colby Street | % | 10.9 | 0.9 | 9.8 | 12.8 | 10.2 to 11.6 |
| ramp share | from freeway via Hillegass Avenue | % | 6.2 | 0.6 | 5.3 | 7.6 | 5.8 to 6.7 |
| ramp share | from freeway via Benvenue Avenue | % | 1.7 | 0.3 | 1.3 | 2.3 | 1.5 to 1.9 |
| corridor flow | Telegraph N median link flow | veh/h | 938.52 | 28.21 | 897.60 | 975.60 | 918.34 to 958.70 |
| corridor flow | Telegraph S median link flow | veh/h | 1000.68 | 49.87 | 920.40 | 1066.80 | 965.00 to 1036.36 |
| corridor flow | College N median link flow | veh/h | 267.72 | 39.91 | 192.00 | 316.80 | 239.17 to 296.27 |
| corridor flow | College S median link flow | veh/h | 380.04 | 25.79 | 342.00 | 424.80 | 361.59 to 398.49 |
| corridor flow | Claremont N median link flow | veh/h | 548.16 | 40.41 | 478.80 | 604.80 | 519.26 to 577.06 |
| corridor flow | Claremont S median link flow | veh/h | 602.88 | 36.02 | 554.40 | 658.80 | 577.11 to 628.65 |
| corridor flow | Alcatraz E median link flow | veh/h | 409.68 | 25.64 | 369.60 | 454.80 | 391.34 to 428.02 |
| corridor flow | Alcatraz W median link flow | veh/h | 405.96 | 19.23 | 384.00 | 444.00 | 392.21 to 419.71 |
| corridor flow | Hillegass N median link flow | veh/h | 72.00 | 4.83 | 64.80 | 78.00 | 68.54 to 75.46 |
| corridor flow | Hillegass S median link flow | veh/h | 98.64 | 12.38 | 84.00 | 128.40 | 89.79 to 107.49 |
| corridor flow | Colby N median link flow | veh/h | 115.56 | 9.00 | 104.40 | 132.00 | 109.12 to 122.00 |
| corridor flow | Colby S median link flow | veh/h | 157.08 | 8.99 | 145.20 | 177.60 | 150.65 to 163.51 |
| corridor flow | Martin E median link flow | veh/h | 127.80 | 20.01 | 103.20 | 171.60 | 113.49 to 142.11 |
| corridor flow | Martin W median link flow | veh/h | 227.88 | 26.22 | 187.20 | 270.00 | 209.12 to 246.64 |

Per-seed detail: `rockridge-am_peak-s1-seed1.md` (seed 1 in full).
