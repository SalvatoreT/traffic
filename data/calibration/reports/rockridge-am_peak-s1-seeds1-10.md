# rockridge-am_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.40 (min 0.00, max 1.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.00 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 6 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.40 | 0.52 | 0.00 | 1.00 | 0.03 to 0.77 |
| health | gridlock removals per hour | veh/h | 0.40 | 0.52 | 0.00 | 1.00 | 0.03 to 0.77 |
| health | entry backlog | % of spawned | 1.00 | 0.29 | 0.57 | 1.65 | 0.79 to 1.21 |
| health | backlog growth in the second half of the run | points of spawned | 0.74 | 0.40 | 0.32 | 1.57 | 0.45 to 1.03 |
| health | completed trips | trips | 19775.30 | 143.24 | 19549.00 | 19965.00 | 19672.84 to 19877.76 |
| health | arterial mean speed | m/s | 9.00 | 0.18 | 8.74 | 9.22 | 8.87 to 9.13 |
| health | arterial mean speed, last 15 min | m/s | 8.86 | 0.26 | 8.47 | 9.27 | 8.68 to 9.05 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 8.37 | 1.63 | 4.76 | 10.44 | 7.20 to 9.53 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 3.0 | 0.6 | 1.8 | 3.7 | 2.6 to 3.4 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 5.96 | 1.71 | 3.47 | 9.61 | 4.73 to 7.18 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 2.1 | 0.6 | 1.2 | 3.5 | 1.7 to 2.6 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 22.50 | 3.84 | 17.00 | 28.00 | 19.76 to 25.24 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1055.40 | 26.39 | 1027.00 | 1095.00 | 1036.53 to 1074.27 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 41.60 | 4.45 | 33.00 | 47.00 | 38.42 to 44.78 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1061.10 | 32.07 | 1021.00 | 1106.00 | 1038.16 to 1084.04 |
| headline share | Hillegass Avenue NB from freeway | % | 70.9 | 4.4 | 61.4 | 76.0 | 67.7 to 74.0 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 1.8 | 1.7 | 0.0 | 5.0 | 0.6 to 3.1 |
| share | Hillegass Avenue NB to College Avenue | % | 2.3 | 1.4 | 0.0 | 4.2 | 1.3 to 3.4 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 24.7 | 4.8 | 13.9 | 30.8 | 21.3 to 28.1 |
| headline share | Colby Street NB from freeway | % | 34.2 | 5.6 | 26.5 | 43.1 | 30.2 to 38.2 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 17.1 | 2.9 | 13.9 | 20.9 | 15.0 to 19.1 |
| share | Colby Street NB to Telegraph Avenue | % | 24.5 | 4.3 | 19.1 | 34.3 | 21.4 to 27.6 |
| share | Colby Street NB to College Avenue | % | 11.4 | 5.0 | 4.5 | 22.2 | 7.8 to 14.9 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 24.0 | 2.6 | 19.9 | 28.0 | 22.1 to 25.9 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 9.2 | 3.1 | 5.3 | 13.6 | 6.9 to 11.4 |
| share | Hillegass Avenue SB from College Avenue | % | 15.2 | 3.9 | 7.8 | 19.8 | 12.4 to 17.9 |
| headline share | Hillegass Avenue SB to freeway | % | 58.0 | 4.0 | 52.3 | 63.3 | 55.1 to 60.8 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 13.0 | 2.8 | 8.9 | 16.9 | 11.0 to 15.0 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 37.1 | 4.2 | 30.3 | 42.2 | 34.1 to 40.1 |
| share | Colby Street SB from Telegraph Avenue | % | 33.5 | 3.3 | 25.3 | 35.9 | 31.1 to 35.8 |
| headline share | Colby Street SB to freeway | % | 27.0 | 3.1 | 23.4 | 32.9 | 24.7 to 29.2 |
| share | Colby Street SB to Forest Street | % | 46.0 | 3.4 | 41.4 | 53.2 | 43.6 to 48.4 |
| ramp share | onto freeway via College Avenue | % | 12.9 | 2.1 | 9.9 | 17.2 | 11.3 to 14.4 |
| ramp share | onto freeway via Hillegass Avenue | % | 13.6 | 0.9 | 12.2 | 15.0 | 12.9 to 14.2 |
| ramp share | onto freeway via Martin Street | % | 17.4 | 1.9 | 14.3 | 19.9 | 16.0 to 18.8 |
| ramp share | onto freeway via Colby Street | % | 8.0 | 0.8 | 6.9 | 9.6 | 7.4 to 8.6 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 13.2 | 1.0 | 11.5 | 14.9 | 12.5 to 13.9 |
| ramp share | onto freeway via Benvenue Avenue | % | 5.2 | 1.3 | 3.4 | 6.9 | 4.2 to 6.2 |
| ramp share | from freeway via College Avenue | % | 8.3 | 1.3 | 6.4 | 11.1 | 7.4 to 9.3 |
| ramp share | from freeway via Martin Street | % | 16.7 | 1.2 | 14.7 | 18.6 | 15.9 to 17.6 |
| ramp share | from freeway via Colby Street | % | 10.8 | 1.3 | 8.4 | 13.4 | 9.9 to 11.7 |
| ramp share | from freeway via Hillegass Avenue | % | 5.9 | 1.2 | 3.7 | 7.7 | 5.0 to 6.7 |
| ramp share | from freeway via Benvenue Avenue | % | 2.7 | 0.4 | 2.1 | 3.4 | 2.4 to 3.0 |
| corridor flow | Telegraph N median link flow | veh/h | 769.32 | 39.57 | 710.40 | 830.40 | 741.01 to 797.63 |
| corridor flow | Telegraph S median link flow | veh/h | 1080.36 | 97.30 | 945.60 | 1246.80 | 1010.76 to 1149.96 |
| corridor flow | College N median link flow | veh/h | 242.04 | 37.09 | 206.40 | 339.60 | 215.51 to 268.57 |
| corridor flow | College S median link flow | veh/h | 324.84 | 45.75 | 265.20 | 403.20 | 292.12 to 357.56 |
| corridor flow | Claremont N median link flow | veh/h | 642.72 | 17.85 | 621.60 | 679.20 | 629.95 to 655.49 |
| corridor flow | Claremont S median link flow | veh/h | 484.80 | 15.94 | 453.60 | 508.80 | 473.40 to 496.20 |
| corridor flow | Alcatraz E median link flow | veh/h | 336.72 | 13.94 | 315.60 | 363.60 | 326.75 to 346.69 |
| corridor flow | Alcatraz W median link flow | veh/h | 453.36 | 24.64 | 422.40 | 482.40 | 435.74 to 470.98 |
| corridor flow | Hillegass N median link flow | veh/h | 51.48 | 5.86 | 40.80 | 57.60 | 47.29 to 55.67 |
| corridor flow | Hillegass S median link flow | veh/h | 104.16 | 7.35 | 91.20 | 115.20 | 98.90 to 109.42 |
| corridor flow | Colby N median link flow | veh/h | 23.28 | 3.93 | 15.60 | 28.80 | 20.47 to 26.09 |
| corridor flow | Colby S median link flow | veh/h | 95.28 | 13.26 | 80.40 | 118.80 | 85.80 to 104.76 |
| corridor flow | Martin E median link flow | veh/h | 135.96 | 15.88 | 106.80 | 153.60 | 124.60 to 147.32 |
| corridor flow | Martin W median link flow | veh/h | 177.72 | 14.55 | 154.80 | 196.80 | 167.31 to 188.13 |

Per-seed detail: `rockridge-am_peak-s1-seed1.md` (seed 1 in full).
