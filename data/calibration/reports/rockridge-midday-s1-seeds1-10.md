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
| health | entry backlog | % of spawned | 0.00 | 0.00 | 0.00 | 0.01 | 0.00 to 0.00 |
| health | backlog growth in the second half of the run | points of spawned | -0.00 | 0.01 | -0.01 | 0.01 | -0.01 to 0.00 |
| health | completed trips | trips | 16050.00 | 134.30 | 15810.00 | 16213.00 | 15953.93 to 16146.07 |
| health | arterial mean speed | m/s | 10.02 | 0.04 | 9.97 | 10.07 | 10.00 to 10.05 |
| health | arterial mean speed, last 15 min | m/s | 10.01 | 0.07 | 9.90 | 10.10 | 9.96 to 10.06 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 2.94 | 1.00 | 1.16 | 4.55 | 2.22 to 3.65 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 1.2 | 0.4 | 0.5 | 1.8 | 0.9 to 1.4 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 6.43 | 1.65 | 4.58 | 9.75 | 5.25 to 7.61 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 2.5 | 0.6 | 1.9 | 3.6 | 2.1 to 2.9 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 12.70 | 3.33 | 8.00 | 19.00 | 10.31 to 15.09 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 928.60 | 20.19 | 899.00 | 967.00 | 914.16 to 943.04 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 6.10 | 2.02 | 3.00 | 9.00 | 4.65 to 7.55 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 940.50 | 25.31 | 911.00 | 992.00 | 922.40 to 958.60 |
| headline share | Hillegass Avenue NB from freeway | % | 54.4 | 4.6 | 45.5 | 60.4 | 51.1 to 57.7 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 2.7 | 1.6 | 0.0 | 5.6 | 1.5 to 3.9 |
| share | Hillegass Avenue NB to College Avenue | % | 4.0 | 2.1 | 0.9 | 7.5 | 2.5 to 5.5 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 24.2 | 3.7 | 19.5 | 30.2 | 21.6 to 26.9 |
| headline share | Colby Street NB from freeway | % | 37.7 | 3.6 | 32.2 | 42.4 | 35.2 to 40.3 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 66.7 | 3.8 | 61.2 | 71.3 | 64.0 to 69.5 |
| share | Colby Street NB to Telegraph Avenue | % | 40.0 | 3.6 | 34.6 | 46.2 | 37.5 to 42.6 |
| share | Colby Street NB to College Avenue | % | 2.8 | 2.0 | 0.0 | 6.6 | 1.4 to 4.2 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 3.7 | 1.9 | 0.8 | 6.1 | 2.3 to 5.1 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 0.8 | 0.6 | 0.0 | 1.6 | 0.4 to 1.2 |
| share | Hillegass Avenue SB from College Avenue | % | 1.8 | 1.0 | 0.0 | 3.0 | 1.1 to 2.5 |
| headline share | Hillegass Avenue SB to freeway | % | 56.7 | 4.7 | 52.6 | 65.8 | 53.3 to 60.1 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 15.5 | 2.0 | 12.8 | 18.3 | 14.1 to 17.0 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 14.2 | 2.6 | 10.2 | 18.4 | 12.3 to 16.1 |
| share | Colby Street SB from Telegraph Avenue | % | 11.9 | 1.9 | 8.7 | 14.8 | 10.6 to 13.3 |
| headline share | Colby Street SB to freeway | % | 41.7 | 5.7 | 32.7 | 55.1 | 37.7 to 45.8 |
| share | Colby Street SB to Forest Street | % | 17.1 | 2.9 | 12.9 | 20.5 | 15.1 to 19.2 |
| ramp share | onto freeway via College Avenue | % | 18.4 | 2.8 | 13.9 | 21.5 | 16.3 to 20.4 |
| ramp share | onto freeway via Hillegass Avenue | % | 15.8 | 1.4 | 13.9 | 17.8 | 14.8 to 16.8 |
| ramp share | onto freeway via Martin Street | % | 16.0 | 3.1 | 10.3 | 21.0 | 13.7 to 18.2 |
| ramp share | onto freeway via Colby Street | % | 11.0 | 3.2 | 5.5 | 16.8 | 8.7 to 13.2 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 5.3 | 0.8 | 3.7 | 6.5 | 4.7 to 5.9 |
| ramp share | onto freeway via Benvenue Avenue | % | 3.7 | 0.8 | 2.7 | 5.2 | 3.2 to 4.3 |
| ramp share | from freeway via College Avenue | % | 9.0 | 1.3 | 7.2 | 11.8 | 8.1 to 9.9 |
| ramp share | from freeway via Martin Street | % | 13.0 | 1.6 | 11.1 | 15.4 | 11.8 to 14.1 |
| ramp share | from freeway via Colby Street | % | 11.5 | 2.8 | 8.9 | 18.7 | 9.5 to 13.5 |
| ramp share | from freeway via Hillegass Avenue | % | 6.5 | 1.1 | 4.8 | 8.5 | 5.7 to 7.2 |
| ramp share | from freeway via Benvenue Avenue | % | 3.2 | 1.0 | 1.8 | 4.9 | 2.5 to 3.9 |
| corridor flow | Telegraph N median link flow | veh/h | 571.08 | 47.18 | 516.00 | 664.80 | 537.33 to 604.83 |
| corridor flow | Telegraph S median link flow | veh/h | 470.16 | 51.92 | 393.60 | 552.00 | 433.02 to 507.30 |
| corridor flow | College N median link flow | veh/h | 217.56 | 27.67 | 175.20 | 265.20 | 197.77 to 237.35 |
| corridor flow | College S median link flow | veh/h | 410.16 | 18.54 | 380.40 | 441.60 | 396.90 to 423.42 |
| corridor flow | Claremont N median link flow | veh/h | 295.92 | 40.96 | 201.60 | 339.60 | 266.62 to 325.22 |
| corridor flow | Claremont S median link flow | veh/h | 211.56 | 25.23 | 165.60 | 240.00 | 193.51 to 229.61 |
| corridor flow | Alcatraz E median link flow | veh/h | 369.60 | 28.86 | 320.40 | 398.40 | 348.96 to 390.24 |
| corridor flow | Alcatraz W median link flow | veh/h | 215.76 | 13.69 | 193.20 | 242.40 | 205.97 to 225.55 |
| corridor flow | Hillegass N median link flow | veh/h | 57.84 | 8.27 | 45.60 | 67.20 | 51.92 to 63.76 |
| corridor flow | Hillegass S median link flow | veh/h | 61.80 | 6.55 | 49.20 | 70.80 | 57.11 to 66.49 |
| corridor flow | Colby N median link flow | veh/h | 79.56 | 10.67 | 61.20 | 94.80 | 71.92 to 87.20 |
| corridor flow | Colby S median link flow | veh/h | 64.44 | 8.65 | 46.80 | 74.40 | 58.25 to 70.63 |
| corridor flow | Martin E median link flow | veh/h | 96.24 | 14.14 | 73.20 | 116.40 | 86.13 to 106.35 |
| corridor flow | Martin W median link flow | veh/h | 94.32 | 10.26 | 82.80 | 111.60 | 86.98 to 101.66 |

Per-seed detail: `rockridge-midday-s1-seed1.md` (seed 1 in full).
