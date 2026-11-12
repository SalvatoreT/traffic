# rockridge-pm_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 2.50 (min 0.00, max 5.00) | NO |
| Entry backlog | below 2.0% in at least 90% of seeds | 0 of 10 seeds | NO |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | seeds 1, 3, 4, 5, 6, 8, 9, 10 | NO |
| Arterial speed | mean above 4.0 m/s | 7.46 m/s | yes |

**Verdict: not stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 0 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 2.50 | 1.90 | 0.00 | 5.00 | 1.14 to 3.86 |
| health | gridlock removals per hour | veh/h | 2.50 | 1.90 | 0.00 | 5.00 | 1.14 to 3.86 |
| health | entry backlog | % of spawned | 3.88 | 1.27 | 2.04 | 6.23 | 2.97 to 4.79 |
| health | backlog growth in the second half of the run | points of spawned | 3.02 | 1.15 | 1.78 | 5.24 | 2.20 to 3.85 |
| health | completed trips | trips | 21882.50 | 291.59 | 21521.00 | 22279.00 | 21673.93 to 22091.07 |
| health | arterial mean speed | m/s | 7.46 | 0.19 | 7.14 | 7.74 | 7.33 to 7.60 |
| health | arterial mean speed, last 15 min | m/s | 7.13 | 0.56 | 5.96 | 8.08 | 6.73 to 7.53 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 7.90 | 2.24 | 4.58 | 11.89 | 6.30 to 9.51 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 1.7 | 0.5 | 1.0 | 2.5 | 1.4 to 2.0 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 15.78 | 1.95 | 13.11 | 18.97 | 14.38 to 17.18 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 3.4 | 0.4 | 2.8 | 3.9 | 3.1 to 3.6 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 9.60 | 4.93 | 3.00 | 18.00 | 6.08 to 13.12 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1139.10 | 48.97 | 1054.00 | 1212.00 | 1104.07 to 1174.13 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 50.40 | 11.14 | 36.00 | 66.00 | 42.43 to 58.37 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1075.40 | 36.86 | 1015.00 | 1132.00 | 1049.03 to 1101.77 |
| headline share | Hillegass Avenue NB from freeway | % | 64.8 | 4.1 | 56.0 | 71.2 | 61.9 to 67.7 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 1.0 | 1.0 | 0.0 | 3.2 | 0.2 to 1.7 |
| share | Hillegass Avenue NB to College Avenue | % | 5.1 | 2.1 | 2.5 | 8.7 | 3.6 to 6.6 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 19.2 | 4.1 | 12.8 | 24.7 | 16.3 to 22.1 |
| headline share | Colby Street NB from freeway | % | 76.4 | 3.4 | 69.2 | 81.0 | 74.0 to 78.9 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 5.3 | 1.7 | 2.0 | 7.3 | 4.1 to 6.5 |
| share | Colby Street NB to Telegraph Avenue | % | 24.9 | 3.3 | 21.0 | 30.3 | 22.5 to 27.2 |
| share | Colby Street NB to College Avenue | % | 1.4 | 0.8 | 0.5 | 3.0 | 0.8 to 2.0 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 12.6 | 2.1 | 8.5 | 15.1 | 11.1 to 14.1 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 4.1 | 1.0 | 2.3 | 5.3 | 3.3 to 4.8 |
| share | Hillegass Avenue SB from College Avenue | % | 11.7 | 2.2 | 8.5 | 15.5 | 10.1 to 13.2 |
| headline share | Hillegass Avenue SB to freeway | % | 69.7 | 4.0 | 63.3 | 76.0 | 66.8 to 72.6 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 9.7 | 1.8 | 6.0 | 11.8 | 8.5 to 11.0 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 35.2 | 3.4 | 30.1 | 40.1 | 32.7 to 37.6 |
| share | Colby Street SB from Telegraph Avenue | % | 19.8 | 3.5 | 14.4 | 27.6 | 17.3 to 22.4 |
| headline share | Colby Street SB to freeway | % | 71.5 | 3.4 | 66.8 | 77.9 | 69.0 to 73.9 |
| share | Colby Street SB to Forest Street | % | 13.4 | 2.8 | 9.2 | 17.1 | 11.4 to 15.5 |
| ramp share | onto freeway via College Avenue | % | 8.5 | 1.6 | 6.5 | 10.8 | 7.4 to 9.7 |
| ramp share | onto freeway via Hillegass Avenue | % | 11.0 | 1.9 | 8.9 | 14.3 | 9.6 to 12.4 |
| ramp share | onto freeway via Martin Street | % | 10.6 | 1.3 | 8.6 | 13.0 | 9.6 to 11.6 |
| ramp share | onto freeway via Colby Street | % | 20.3 | 1.4 | 17.8 | 21.6 | 19.3 to 21.3 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 5.6 | 0.7 | 4.6 | 6.4 | 5.2 to 6.1 |
| ramp share | onto freeway via Benvenue Avenue | % | 2.3 | 0.6 | 1.3 | 3.2 | 1.8 to 2.7 |
| ramp share | from freeway via College Avenue | % | 5.0 | 1.1 | 3.6 | 7.0 | 4.2 to 5.8 |
| ramp share | from freeway via Martin Street | % | 18.7 | 2.6 | 14.7 | 23.3 | 16.8 to 20.5 |
| ramp share | from freeway via Colby Street | % | 8.9 | 1.4 | 7.4 | 11.7 | 7.9 to 9.9 |
| ramp share | from freeway via Hillegass Avenue | % | 3.9 | 0.6 | 3.0 | 4.7 | 3.5 to 4.3 |
| ramp share | from freeway via Benvenue Avenue | % | 1.7 | 0.4 | 1.2 | 2.3 | 1.5 to 2.0 |
| corridor flow | Telegraph N median link flow | veh/h | 1135.68 | 64.26 | 1036.80 | 1225.20 | 1089.72 to 1181.64 |
| corridor flow | Telegraph S median link flow | veh/h | 959.28 | 50.28 | 890.40 | 1026.00 | 923.31 to 995.25 |
| corridor flow | College N median link flow | veh/h | 295.80 | 36.33 | 237.60 | 350.40 | 269.81 to 321.79 |
| corridor flow | College S median link flow | veh/h | 520.08 | 47.59 | 469.20 | 606.00 | 486.04 to 554.12 |
| corridor flow | Claremont N median link flow | veh/h | 454.80 | 36.74 | 392.40 | 501.60 | 428.52 to 481.08 |
| corridor flow | Claremont S median link flow | veh/h | 779.52 | 48.79 | 721.20 | 864.00 | 744.62 to 814.42 |
| corridor flow | Alcatraz E median link flow | veh/h | 486.00 | 40.15 | 417.60 | 531.60 | 457.28 to 514.72 |
| corridor flow | Alcatraz W median link flow | veh/h | 456.96 | 22.10 | 434.40 | 495.60 | 441.15 to 472.77 |
| corridor flow | Hillegass N median link flow | veh/h | 50.88 | 8.06 | 42.00 | 64.80 | 45.11 to 56.65 |
| corridor flow | Hillegass S median link flow | veh/h | 113.52 | 20.70 | 87.60 | 151.20 | 98.71 to 128.33 |
| corridor flow | Colby N median link flow | veh/h | 79.44 | 13.40 | 57.60 | 109.20 | 69.86 to 89.02 |
| corridor flow | Colby S median link flow | veh/h | 211.56 | 23.52 | 171.60 | 241.20 | 194.74 to 228.38 |
| corridor flow | Martin E median link flow | veh/h | 138.84 | 18.92 | 111.60 | 163.20 | 125.30 to 152.38 |
| corridor flow | Martin W median link flow | veh/h | 212.76 | 35.80 | 156.00 | 280.80 | 187.15 to 238.37 |

Per-seed detail: `rockridge-pm_peak-s1-seed1.md` (seed 1 in full).
