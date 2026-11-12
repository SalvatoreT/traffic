# rockridge-pm_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 9.40 (min 0.00, max 39.00) | NO |
| Entry backlog | below 2.0% in at least 90% of seeds | 7 of 10 seeds | NO |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | seeds 2 | NO |
| Arterial speed | mean above 4.0 m/s | 7.42 m/s | yes |

**Verdict: not stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 2 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 9.40 | 12.96 | 0.00 | 39.00 | 0.13 to 18.67 |
| health | gridlock removals per hour | veh/h | 9.40 | 12.96 | 0.00 | 39.00 | 0.13 to 18.67 |
| health | entry backlog | % of spawned | 1.60 | 0.75 | 0.90 | 3.31 | 1.06 to 2.13 |
| health | backlog growth in the second half of the run | points of spawned | 0.97 | 0.77 | -0.01 | 2.61 | 0.42 to 1.52 |
| health | completed trips | trips | 22200.40 | 209.65 | 21823.00 | 22452.00 | 22050.44 to 22350.36 |
| health | arterial mean speed | m/s | 7.42 | 0.19 | 7.15 | 7.71 | 7.28 to 7.55 |
| health | arterial mean speed, last 15 min | m/s | 6.89 | 0.27 | 6.42 | 7.20 | 6.70 to 7.09 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 8.45 | 1.90 | 6.20 | 11.44 | 7.09 to 9.81 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 1.7 | 0.4 | 1.2 | 2.5 | 1.4 to 2.1 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 23.61 | 4.48 | 14.98 | 31.99 | 20.40 to 26.81 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 4.8 | 0.8 | 3.3 | 6.2 | 4.2 to 5.4 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 8.20 | 7.10 | 2.00 | 24.00 | 3.12 to 13.28 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1173.80 | 42.92 | 1098.00 | 1226.00 | 1143.10 to 1204.50 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 21.60 | 6.17 | 13.00 | 36.00 | 17.19 to 26.01 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 995.10 | 31.07 | 956.00 | 1036.00 | 972.87 to 1017.33 |
| headline share | Hillegass Avenue NB from freeway | % | 66.6 | 3.3 | 61.3 | 72.4 | 64.2 to 69.0 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 1.6 | 1.1 | 0.8 | 4.2 | 0.9 to 2.4 |
| share | Hillegass Avenue NB to College Avenue | % | 7.0 | 1.5 | 5.1 | 10.2 | 5.9 to 8.1 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 25.6 | 4.4 | 20.3 | 32.8 | 22.4 to 28.7 |
| headline share | Colby Street NB from freeway | % | 74.5 | 2.3 | 71.5 | 77.9 | 72.9 to 76.2 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 7.6 | 2.6 | 5.4 | 14.3 | 5.7 to 9.5 |
| share | Colby Street NB to Telegraph Avenue | % | 22.2 | 3.6 | 19.7 | 30.1 | 19.6 to 24.8 |
| share | Colby Street NB to College Avenue | % | 0.8 | 0.7 | 0.0 | 2.2 | 0.3 to 1.3 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 9.1 | 2.3 | 5.0 | 12.9 | 7.5 to 10.7 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 2.8 | 1.1 | 0.5 | 4.1 | 2.1 to 3.6 |
| share | Hillegass Avenue SB from College Avenue | % | 6.1 | 2.1 | 2.7 | 8.9 | 4.6 to 7.6 |
| headline share | Hillegass Avenue SB to freeway | % | 78.3 | 4.4 | 71.8 | 86.0 | 75.1 to 81.5 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 10.9 | 3.6 | 7.4 | 19.3 | 8.3 to 13.5 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 32.4 | 4.0 | 25.8 | 38.2 | 29.5 to 35.3 |
| share | Colby Street SB from Telegraph Avenue | % | 22.7 | 8.2 | 15.1 | 42.2 | 16.8 to 28.6 |
| headline share | Colby Street SB to freeway | % | 67.3 | 6.9 | 50.6 | 73.7 | 62.3 to 72.3 |
| share | Colby Street SB to Forest Street | % | 12.9 | 4.9 | 3.7 | 21.4 | 9.4 to 16.4 |
| ramp share | onto freeway via College Avenue | % | 11.4 | 0.9 | 10.2 | 12.8 | 10.7 to 12.0 |
| ramp share | onto freeway via Hillegass Avenue | % | 14.4 | 1.7 | 12.3 | 17.7 | 13.2 to 15.6 |
| ramp share | onto freeway via Martin Street | % | 10.8 | 1.4 | 8.5 | 12.6 | 9.8 to 11.8 |
| ramp share | onto freeway via Colby Street | % | 18.0 | 2.3 | 14.6 | 21.8 | 16.4 to 19.6 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 5.6 | 0.8 | 4.4 | 6.6 | 5.0 to 6.2 |
| ramp share | onto freeway via Benvenue Avenue | % | 3.5 | 0.4 | 2.7 | 4.1 | 3.1 to 3.8 |
| ramp share | from freeway via College Avenue | % | 4.3 | 0.6 | 3.2 | 5.2 | 3.8 to 4.7 |
| ramp share | from freeway via Martin Street | % | 17.1 | 1.8 | 14.2 | 19.5 | 15.8 to 18.4 |
| ramp share | from freeway via Colby Street | % | 12.6 | 2.0 | 10.3 | 16.3 | 11.1 to 14.0 |
| ramp share | from freeway via Hillegass Avenue | % | 6.7 | 0.7 | 5.7 | 7.8 | 6.1 to 7.2 |
| ramp share | from freeway via Benvenue Avenue | % | 1.4 | 0.3 | 0.9 | 2.0 | 1.2 to 1.6 |
| corridor flow | Telegraph N median link flow | veh/h | 1205.16 | 91.90 | 1009.20 | 1293.60 | 1139.42 to 1270.90 |
| corridor flow | Telegraph S median link flow | veh/h | 1011.24 | 102.29 | 895.20 | 1239.60 | 938.07 to 1084.41 |
| corridor flow | College N median link flow | veh/h | 356.40 | 32.22 | 301.20 | 406.80 | 333.35 to 379.45 |
| corridor flow | College S median link flow | veh/h | 617.52 | 42.79 | 525.60 | 667.20 | 586.91 to 648.13 |
| corridor flow | Claremont N median link flow | veh/h | 500.52 | 75.81 | 370.80 | 609.60 | 446.29 to 554.75 |
| corridor flow | Claremont S median link flow | veh/h | 873.84 | 51.30 | 776.40 | 949.20 | 837.15 to 910.53 |
| corridor flow | Alcatraz E median link flow | veh/h | 513.00 | 33.33 | 464.40 | 566.40 | 489.16 to 536.84 |
| corridor flow | Alcatraz W median link flow | veh/h | 495.96 | 50.96 | 374.40 | 577.20 | 459.51 to 532.41 |
| corridor flow | Hillegass N median link flow | veh/h | 82.68 | 9.67 | 66.00 | 97.20 | 75.76 to 89.60 |
| corridor flow | Hillegass S median link flow | veh/h | 150.96 | 23.78 | 120.00 | 206.40 | 133.95 to 167.97 |
| corridor flow | Colby N median link flow | veh/h | 123.72 | 22.87 | 97.20 | 172.80 | 107.36 to 140.08 |
| corridor flow | Colby S median link flow | veh/h | 194.64 | 25.81 | 150.00 | 237.60 | 176.18 to 213.10 |
| corridor flow | Martin E median link flow | veh/h | 135.72 | 18.59 | 111.60 | 163.20 | 122.42 to 149.02 |
| corridor flow | Martin W median link flow | veh/h | 210.24 | 27.84 | 174.00 | 264.00 | 190.32 to 230.16 |

Per-seed detail: `rockridge-pm_peak-s1-seed1.md` (seed 1 in full).
