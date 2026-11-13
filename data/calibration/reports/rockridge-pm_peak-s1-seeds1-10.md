# rockridge-pm_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 1.30 (min 0.00, max 3.00) | NO |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 7.83 m/s | yes |

**Verdict: not stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 3 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 1.30 | 1.25 | 0.00 | 3.00 | 0.40 to 2.20 |
| health | gridlock removals per hour | veh/h | 1.30 | 1.25 | 0.00 | 3.00 | 0.40 to 2.20 |
| health | entry backlog | % of spawned | 0.14 | 0.15 | 0.02 | 0.45 | 0.03 to 0.24 |
| health | backlog growth in the second half of the run | points of spawned | 0.06 | 0.13 | -0.04 | 0.39 | -0.04 to 0.15 |
| health | completed trips | trips | 24395.70 | 160.76 | 24137.00 | 24625.00 | 24280.71 to 24510.69 |
| health | arterial mean speed | m/s | 7.83 | 0.12 | 7.67 | 8.05 | 7.75 to 7.92 |
| health | arterial mean speed, last 15 min | m/s | 7.60 | 0.18 | 7.31 | 7.82 | 7.47 to 7.72 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 16.93 | 4.39 | 9.82 | 23.48 | 13.79 to 20.06 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 3.3 | 0.8 | 1.9 | 4.4 | 2.7 to 3.8 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 15.01 | 3.57 | 9.04 | 19.34 | 12.46 to 17.56 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 2.9 | 0.6 | 1.9 | 3.7 | 2.4 to 3.3 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 16.70 | 4.30 | 9.00 | 23.00 | 13.63 to 19.77 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1282.60 | 37.97 | 1196.00 | 1331.00 | 1255.44 to 1309.76 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 19.50 | 5.21 | 11.00 | 27.00 | 15.77 to 23.23 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1225.70 | 40.49 | 1174.00 | 1285.00 | 1196.73 to 1254.67 |
| headline share | Hillegass Avenue NB from freeway | % | 53.2 | 3.0 | 48.9 | 58.9 | 51.0 to 55.3 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 1.3 | 0.7 | 0.0 | 2.5 | 0.8 to 1.7 |
| share | Hillegass Avenue NB to College Avenue | % | 3.6 | 1.4 | 1.8 | 6.7 | 2.6 to 4.6 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 24.7 | 3.2 | 20.0 | 29.3 | 22.4 to 27.0 |
| headline share | Colby Street NB from freeway | % | 63.9 | 2.5 | 60.5 | 68.3 | 62.2 to 65.7 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 14.8 | 3.5 | 9.7 | 20.3 | 12.3 to 17.3 |
| share | Colby Street NB to Telegraph Avenue | % | 24.2 | 2.5 | 19.1 | 27.3 | 22.4 to 26.0 |
| share | Colby Street NB to College Avenue | % | 0.9 | 0.6 | 0.0 | 1.8 | 0.5 to 1.3 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 9.8 | 2.0 | 6.7 | 14.2 | 8.3 to 11.2 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 1.9 | 1.1 | 0.4 | 4.3 | 1.0 to 2.7 |
| share | Hillegass Avenue SB from College Avenue | % | 5.6 | 1.5 | 2.7 | 7.1 | 4.5 to 6.6 |
| headline share | Hillegass Avenue SB to freeway | % | 59.2 | 4.2 | 49.6 | 63.4 | 56.2 to 62.2 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 14.2 | 2.8 | 10.0 | 19.4 | 12.2 to 16.2 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 25.7 | 1.7 | 22.0 | 28.7 | 24.5 to 27.0 |
| share | Colby Street SB from Telegraph Avenue | % | 25.5 | 3.3 | 20.9 | 30.8 | 23.1 to 27.8 |
| headline share | Colby Street SB to freeway | % | 55.8 | 3.1 | 50.9 | 61.2 | 53.5 to 58.0 |
| share | Colby Street SB to Forest Street | % | 11.7 | 3.1 | 8.8 | 19.6 | 9.5 to 14.0 |
| ramp share | onto freeway via College Avenue | % | 17.5 | 3.7 | 13.5 | 24.9 | 14.9 to 20.1 |
| ramp share | onto freeway via Hillegass Avenue | % | 20.9 | 2.4 | 16.5 | 24.2 | 19.2 to 22.6 |
| ramp share | onto freeway via Martin Street | % | 20.7 | 2.1 | 17.3 | 23.4 | 19.2 to 22.2 |
| ramp share | onto freeway via Colby Street | % | 25.0 | 2.9 | 20.7 | 28.9 | 22.9 to 27.0 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 13.0 | 2.7 | 8.8 | 16.5 | 11.0 to 14.9 |
| ramp share | onto freeway via Benvenue Avenue | % | 2.0 | 0.7 | 0.9 | 3.1 | 1.5 to 2.5 |
| ramp share | from freeway via College Avenue | % | 5.3 | 1.1 | 3.7 | 6.6 | 4.6 to 6.1 |
| ramp share | from freeway via Martin Street | % | 25.3 | 2.4 | 21.2 | 27.9 | 23.6 to 27.0 |
| ramp share | from freeway via Colby Street | % | 23.1 | 1.4 | 21.7 | 25.9 | 22.1 to 24.1 |
| ramp share | from freeway via Hillegass Avenue | % | 9.1 | 0.8 | 8.0 | 10.3 | 8.5 to 9.6 |
| ramp share | from freeway via Benvenue Avenue | % | 1.4 | 0.6 | 0.7 | 2.9 | 1.0 to 1.9 |
| corridor flow | Telegraph N median link flow | veh/h | 1079.40 | 55.73 | 998.40 | 1162.80 | 1039.53 to 1119.27 |
| corridor flow | Telegraph S median link flow | veh/h | 862.80 | 74.15 | 732.00 | 985.20 | 809.76 to 915.84 |
| corridor flow | College N median link flow | veh/h | 416.52 | 37.47 | 373.20 | 498.00 | 389.72 to 443.32 |
| corridor flow | College S median link flow | veh/h | 747.12 | 34.85 | 679.20 | 777.60 | 722.19 to 772.05 |
| corridor flow | Claremont N median link flow | veh/h | 460.44 | 29.76 | 430.80 | 522.00 | 439.15 to 481.73 |
| corridor flow | Claremont S median link flow | veh/h | 469.68 | 41.64 | 397.20 | 535.20 | 439.90 to 499.46 |
| corridor flow | Alcatraz E median link flow | veh/h | 441.24 | 58.19 | 320.40 | 517.20 | 399.61 to 482.87 |
| corridor flow | Alcatraz W median link flow | veh/h | 301.32 | 28.68 | 247.20 | 342.00 | 280.80 to 321.84 |
| corridor flow | Hillegass N median link flow | veh/h | 99.12 | 9.45 | 76.80 | 109.20 | 92.36 to 105.88 |
| corridor flow | Hillegass S median link flow | veh/h | 141.96 | 17.84 | 120.00 | 175.20 | 129.20 to 154.72 |
| corridor flow | Colby N median link flow | veh/h | 141.48 | 12.22 | 123.60 | 163.20 | 132.74 to 150.22 |
| corridor flow | Colby S median link flow | veh/h | 170.88 | 12.03 | 142.80 | 189.60 | 162.28 to 179.48 |
| corridor flow | Martin E median link flow | veh/h | 191.52 | 14.26 | 165.60 | 205.20 | 181.32 to 201.72 |
| corridor flow | Martin W median link flow | veh/h | 237.12 | 34.95 | 183.60 | 286.80 | 212.12 to 262.12 |

Per-seed detail: `rockridge-pm_peak-s1-seed1.md` (seed 1 in full).
