# rockridge-midday-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 10.10 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.01 | 0.01 | 0.00 | 0.02 | 0.00 to 0.01 |
| health | backlog growth in the second half of the run | points of spawned | 0.00 | 0.01 | -0.01 | 0.02 | -0.01 to 0.01 |
| health | completed trips | trips | 15993.20 | 123.60 | 15809.00 | 16131.00 | 15904.79 to 16081.61 |
| health | arterial mean speed | m/s | 10.10 | 0.05 | 10.03 | 10.18 | 10.06 to 10.13 |
| health | arterial mean speed, last 15 min | m/s | 10.14 | 0.08 | 10.00 | 10.27 | 10.08 to 10.20 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 3.49 | 1.38 | 1.92 | 5.95 | 2.51 to 4.47 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 1.4 | 0.5 | 0.8 | 2.4 | 1.0 to 1.8 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 7.80 | 1.42 | 5.95 | 9.80 | 6.79 to 8.81 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 3.1 | 0.6 | 2.3 | 4.0 | 2.7 to 3.5 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 7.10 | 2.69 | 4.00 | 13.00 | 5.18 to 9.02 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 854.80 | 28.51 | 820.00 | 900.00 | 834.40 to 875.20 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 6.10 | 2.18 | 3.00 | 11.00 | 4.54 to 7.66 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 796.50 | 26.99 | 758.00 | 830.00 | 777.20 to 815.80 |
| headline share | Hillegass Avenue NB from freeway | % | 56.2 | 4.2 | 50.8 | 65.3 | 53.2 to 59.2 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 1.7 | 0.7 | 0.9 | 2.9 | 1.2 to 2.2 |
| share | Hillegass Avenue NB to College Avenue | % | 4.1 | 1.7 | 1.9 | 7.0 | 2.9 to 5.3 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 25.9 | 3.7 | 17.4 | 30.0 | 23.2 to 28.6 |
| headline share | Colby Street NB from freeway | % | 70.6 | 4.4 | 63.5 | 77.2 | 67.5 to 73.7 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 8.7 | 1.4 | 7.0 | 11.9 | 7.7 to 9.7 |
| share | Colby Street NB to Telegraph Avenue | % | 15.6 | 3.3 | 11.0 | 21.1 | 13.2 to 17.9 |
| share | Colby Street NB to College Avenue | % | 0.4 | 0.6 | 0.0 | 1.5 | 0.0 to 0.8 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 8.9 | 2.5 | 5.8 | 13.9 | 7.0 to 10.7 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 3.4 | 1.6 | 0.9 | 5.8 | 2.2 to 4.5 |
| share | Hillegass Avenue SB from College Avenue | % | 4.4 | 2.0 | 1.0 | 7.0 | 3.0 to 5.8 |
| headline share | Hillegass Avenue SB to freeway | % | 69.2 | 5.5 | 60.6 | 78.6 | 65.3 to 73.2 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 31.4 | 3.2 | 25.2 | 36.7 | 29.1 to 33.7 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 16.1 | 2.9 | 12.8 | 21.0 | 14.0 to 18.1 |
| share | Colby Street SB from Telegraph Avenue | % | 12.7 | 2.8 | 9.3 | 16.1 | 10.8 to 14.7 |
| headline share | Colby Street SB to freeway | % | 64.6 | 3.0 | 59.7 | 67.7 | 62.5 to 66.8 |
| share | Colby Street SB to Forest Street | % | 14.1 | 3.0 | 10.8 | 20.8 | 12.0 to 16.2 |
| ramp share | onto freeway via College Avenue | % | 20.4 | 2.3 | 16.8 | 23.4 | 18.8 to 22.0 |
| ramp share | onto freeway via Hillegass Avenue | % | 17.2 | 1.4 | 15.4 | 20.1 | 16.2 to 18.2 |
| ramp share | onto freeway via Martin Street | % | 19.3 | 2.1 | 15.9 | 23.7 | 17.8 to 20.9 |
| ramp share | onto freeway via Colby Street | % | 19.4 | 2.8 | 13.2 | 23.7 | 17.4 to 21.5 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 5.8 | 1.6 | 3.6 | 8.3 | 4.7 to 6.9 |
| ramp share | onto freeway via Benvenue Avenue | % | 3.8 | 1.3 | 2.2 | 5.9 | 2.9 to 4.8 |
| ramp share | from freeway via College Avenue | % | 5.7 | 0.8 | 4.2 | 6.7 | 5.1 to 6.3 |
| ramp share | from freeway via Martin Street | % | 21.6 | 1.5 | 19.0 | 23.6 | 20.5 to 22.6 |
| ramp share | from freeway via Colby Street | % | 17.2 | 1.3 | 15.9 | 20.2 | 16.2 to 18.1 |
| ramp share | from freeway via Hillegass Avenue | % | 9.3 | 1.1 | 7.3 | 10.8 | 8.5 to 10.1 |
| ramp share | from freeway via Benvenue Avenue | % | 2.0 | 0.5 | 1.1 | 2.9 | 1.6 to 2.4 |
| corridor flow | Telegraph N median link flow | veh/h | 559.92 | 31.79 | 498.00 | 596.40 | 537.18 to 582.66 |
| corridor flow | Telegraph S median link flow | veh/h | 370.56 | 12.37 | 338.40 | 381.60 | 361.72 to 379.40 |
| corridor flow | College N median link flow | veh/h | 209.64 | 18.45 | 180.00 | 250.80 | 196.44 to 222.84 |
| corridor flow | College S median link flow | veh/h | 475.20 | 21.39 | 444.00 | 505.20 | 459.90 to 490.50 |
| corridor flow | Claremont N median link flow | veh/h | 289.92 | 18.18 | 259.20 | 325.20 | 276.91 to 302.93 |
| corridor flow | Claremont S median link flow | veh/h | 238.44 | 32.00 | 194.40 | 297.60 | 215.55 to 261.33 |
| corridor flow | Alcatraz E median link flow | veh/h | 391.56 | 21.95 | 355.20 | 430.80 | 375.86 to 407.26 |
| corridor flow | Alcatraz W median link flow | veh/h | 285.36 | 16.70 | 271.20 | 325.20 | 273.41 to 297.31 |
| corridor flow | Hillegass N median link flow | veh/h | 70.92 | 6.21 | 58.80 | 78.00 | 66.48 to 75.36 |
| corridor flow | Hillegass S median link flow | veh/h | 66.48 | 5.97 | 56.40 | 76.80 | 62.21 to 70.75 |
| corridor flow | Colby N median link flow | veh/h | 80.04 | 9.00 | 63.60 | 90.00 | 73.60 to 86.48 |
| corridor flow | Colby S median link flow | veh/h | 72.84 | 9.35 | 57.60 | 86.40 | 66.15 to 79.53 |
| corridor flow | Martin E median link flow | veh/h | 93.60 | 7.09 | 79.20 | 102.00 | 88.53 to 98.67 |
| corridor flow | Martin W median link flow | veh/h | 124.56 | 10.60 | 103.20 | 139.20 | 116.98 to 132.14 |

Per-seed detail: `rockridge-midday-s1-seed1.md` (seed 1 in full).
