# rockridge-midday-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 10.02 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.00 | 0.00 | 0.00 | 0.01 | -0.00 to 0.01 |
| health | backlog growth in the second half of the run | points of spawned | -0.00 | 0.01 | -0.01 | 0.01 | -0.01 to 0.00 |
| health | completed trips | trips | 15439.30 | 154.01 | 15266.00 | 15713.00 | 15329.14 to 15549.46 |
| health | arterial mean speed | m/s | 10.02 | 0.09 | 9.87 | 10.14 | 9.95 to 10.08 |
| health | arterial mean speed, last 15 min | m/s | 9.95 | 0.18 | 9.61 | 10.19 | 9.81 to 10.08 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 6.79 | 1.66 | 4.07 | 9.20 | 5.60 to 7.97 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 2.3 | 0.6 | 1.4 | 3.3 | 1.9 to 2.7 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 14.52 | 2.94 | 9.14 | 19.28 | 12.42 to 16.63 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 4.9 | 1.0 | 3.2 | 6.4 | 4.2 to 5.6 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 9.00 | 2.36 | 3.00 | 12.00 | 7.31 to 10.69 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 847.70 | 32.62 | 806.00 | 909.00 | 824.37 to 871.03 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 12.80 | 2.62 | 8.00 | 16.00 | 10.93 to 14.67 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 848.90 | 33.07 | 809.00 | 933.00 | 825.24 to 872.56 |
| headline share | Hillegass Avenue NB from freeway | % | 74.6 | 4.1 | 69.4 | 79.5 | 71.7 to 77.5 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 1.5 | 1.1 | 0.0 | 3.3 | 0.7 to 2.3 |
| share | Hillegass Avenue NB to College Avenue | % | 4.3 | 1.9 | 1.1 | 8.2 | 2.9 to 5.6 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 25.0 | 5.8 | 15.3 | 34.9 | 20.8 to 29.1 |
| headline share | Colby Street NB from freeway | % | 80.5 | 2.5 | 76.6 | 84.2 | 78.7 to 82.2 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 6.0 | 2.2 | 3.8 | 11.2 | 4.5 to 7.6 |
| share | Colby Street NB to Telegraph Avenue | % | 18.6 | 3.1 | 14.4 | 25.6 | 16.3 to 20.8 |
| share | Colby Street NB to College Avenue | % | 0.8 | 0.8 | 0.0 | 2.2 | 0.2 to 1.3 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 9.2 | 2.7 | 4.2 | 12.7 | 7.3 to 11.1 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 3.1 | 2.0 | 0.8 | 7.8 | 1.6 to 4.6 |
| share | Hillegass Avenue SB from College Avenue | % | 7.1 | 3.2 | 2.7 | 11.9 | 4.9 to 9.4 |
| headline share | Hillegass Avenue SB to freeway | % | 69.6 | 4.9 | 63.7 | 79.6 | 66.1 to 73.1 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 10.9 | 1.5 | 9.0 | 13.5 | 9.8 to 12.0 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 25.4 | 3.5 | 21.1 | 33.3 | 22.9 to 28.0 |
| share | Colby Street SB from Telegraph Avenue | % | 22.4 | 6.2 | 13.0 | 31.7 | 17.9 to 26.8 |
| headline share | Colby Street SB to freeway | % | 65.1 | 3.4 | 58.2 | 69.2 | 62.6 to 67.5 |
| share | Colby Street SB to Forest Street | % | 11.5 | 3.8 | 6.8 | 19.9 | 8.8 to 14.2 |
| ramp share | onto freeway via College Avenue | % | 15.3 | 2.4 | 11.9 | 19.9 | 13.6 to 17.1 |
| ramp share | onto freeway via Hillegass Avenue | % | 13.0 | 1.1 | 11.2 | 14.5 | 12.3 to 13.8 |
| ramp share | onto freeway via Martin Street | % | 16.6 | 1.7 | 13.9 | 19.1 | 15.3 to 17.8 |
| ramp share | onto freeway via Colby Street | % | 14.5 | 1.4 | 12.6 | 17.1 | 13.5 to 15.5 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 8.3 | 1.1 | 7.3 | 10.6 | 7.6 to 9.1 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.1 | 0.7 | 3.0 | 5.0 | 3.6 to 4.6 |
| ramp share | from freeway via College Avenue | % | 4.8 | 0.8 | 3.8 | 6.7 | 4.2 to 5.4 |
| ramp share | from freeway via Martin Street | % | 18.3 | 2.0 | 16.2 | 22.4 | 16.8 to 19.7 |
| ramp share | from freeway via Colby Street | % | 12.0 | 0.9 | 10.6 | 13.6 | 11.3 to 12.7 |
| ramp share | from freeway via Hillegass Avenue | % | 8.0 | 1.0 | 6.9 | 10.3 | 7.3 to 8.7 |
| ramp share | from freeway via Benvenue Avenue | % | 1.1 | 0.2 | 0.6 | 1.4 | 1.0 to 1.3 |
| corridor flow | Telegraph N median link flow | veh/h | 653.88 | 45.24 | 595.20 | 758.40 | 621.52 to 686.24 |
| corridor flow | Telegraph S median link flow | veh/h | 602.28 | 64.93 | 501.60 | 724.80 | 555.83 to 648.73 |
| corridor flow | College N median link flow | veh/h | 142.68 | 14.10 | 118.80 | 165.60 | 132.59 to 152.77 |
| corridor flow | College S median link flow | veh/h | 351.72 | 22.25 | 304.80 | 394.80 | 335.80 to 367.64 |
| corridor flow | Claremont N median link flow | veh/h | 410.52 | 28.64 | 366.00 | 450.00 | 390.04 to 431.00 |
| corridor flow | Claremont S median link flow | veh/h | 480.72 | 32.48 | 430.80 | 548.40 | 457.49 to 503.95 |
| corridor flow | Alcatraz E median link flow | veh/h | 340.80 | 35.05 | 272.40 | 386.40 | 315.73 to 365.87 |
| corridor flow | Alcatraz W median link flow | veh/h | 254.88 | 32.77 | 198.00 | 290.40 | 231.44 to 278.32 |
| corridor flow | Hillegass N median link flow | veh/h | 69.36 | 10.12 | 58.80 | 94.80 | 62.12 to 76.60 |
| corridor flow | Hillegass S median link flow | veh/h | 77.76 | 10.50 | 64.80 | 98.40 | 70.25 to 85.27 |
| corridor flow | Colby N median link flow | veh/h | 84.24 | 7.13 | 73.20 | 96.00 | 79.14 to 89.34 |
| corridor flow | Colby S median link flow | veh/h | 90.12 | 13.79 | 72.00 | 110.40 | 80.25 to 99.99 |
| corridor flow | Martin E median link flow | veh/h | 109.32 | 7.64 | 100.80 | 122.40 | 103.85 to 114.79 |
| corridor flow | Martin W median link flow | veh/h | 164.76 | 14.26 | 141.60 | 186.00 | 154.56 to 174.96 |

Per-seed detail: `rockridge-midday-s1-seed1.md` (seed 1 in full).
