# rockridge-am_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.10 (min 0.00, max 1.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 8.78 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 9 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.10 | 0.32 | 0.00 | 1.00 | -0.13 to 0.33 |
| health | gridlock removals per hour | veh/h | 0.10 | 0.32 | 0.00 | 1.00 | -0.13 to 0.33 |
| health | entry backlog | % of spawned | 0.03 | 0.02 | 0.00 | 0.06 | 0.01 to 0.04 |
| health | backlog growth in the second half of the run | points of spawned | 0.01 | 0.03 | -0.04 | 0.05 | -0.01 to 0.02 |
| health | completed trips | trips | 21416.30 | 117.28 | 21146.00 | 21550.00 | 21332.41 to 21500.19 |
| health | arterial mean speed | m/s | 8.78 | 0.13 | 8.54 | 8.92 | 8.68 to 8.87 |
| health | arterial mean speed, last 15 min | m/s | 8.67 | 0.21 | 8.20 | 8.98 | 8.52 to 8.82 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 14.56 | 1.52 | 12.28 | 16.67 | 13.48 to 15.65 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 3.7 | 0.4 | 3.1 | 4.2 | 3.4 to 4.0 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 2.28 | 0.87 | 1.01 | 3.64 | 1.66 to 2.91 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 0.6 | 0.2 | 0.3 | 0.9 | 0.4 to 0.7 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 21.90 | 5.00 | 17.00 | 32.00 | 18.32 to 25.48 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1028.80 | 31.40 | 971.00 | 1081.00 | 1006.34 to 1051.26 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 3.50 | 1.90 | 1.00 | 7.00 | 2.14 to 4.86 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 835.20 | 23.99 | 804.00 | 867.00 | 818.04 to 852.36 |
| headline share | Hillegass Avenue NB from freeway | % | 47.8 | 4.3 | 41.0 | 57.0 | 44.7 to 50.9 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 3.8 | 1.8 | 0.7 | 6.5 | 2.5 to 5.0 |
| share | Hillegass Avenue NB to College Avenue | % | 5.0 | 1.5 | 3.4 | 8.2 | 4.0 to 6.1 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 18.5 | 2.5 | 15.1 | 23.6 | 16.7 to 20.3 |
| headline share | Colby Street NB from freeway | % | 59.6 | 3.9 | 53.5 | 64.5 | 56.8 to 62.3 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 9.6 | 2.6 | 4.1 | 12.9 | 7.8 to 11.5 |
| share | Colby Street NB to Telegraph Avenue | % | 23.7 | 4.0 | 17.0 | 30.2 | 20.9 to 26.6 |
| share | Colby Street NB to College Avenue | % | 0.8 | 0.6 | 0.0 | 1.8 | 0.4 to 1.2 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 19.6 | 2.6 | 15.9 | 24.8 | 17.7 to 21.5 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 7.7 | 2.6 | 3.9 | 12.0 | 5.9 to 9.6 |
| share | Hillegass Avenue SB from College Avenue | % | 13.7 | 3.4 | 9.0 | 18.9 | 11.2 to 16.1 |
| headline share | Hillegass Avenue SB to freeway | % | 52.2 | 2.9 | 48.2 | 58.4 | 50.1 to 54.3 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 33.5 | 2.2 | 29.4 | 36.2 | 31.9 to 35.1 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 17.4 | 2.6 | 13.9 | 22.0 | 15.6 to 19.3 |
| share | Colby Street SB from Telegraph Avenue | % | 19.0 | 2.5 | 14.9 | 24.4 | 17.2 to 20.8 |
| headline share | Colby Street SB to freeway | % | 72.4 | 1.6 | 69.6 | 75.0 | 71.2 to 73.5 |
| share | Colby Street SB to Forest Street | % | 4.3 | 1.3 | 2.5 | 5.7 | 3.4 to 5.2 |
| ramp share | onto freeway via College Avenue | % | 17.6 | 0.8 | 15.8 | 19.1 | 17.0 to 18.3 |
| ramp share | onto freeway via Hillegass Avenue | % | 14.8 | 1.7 | 11.0 | 16.3 | 13.6 to 16.0 |
| ramp share | onto freeway via Martin Street | % | 15.6 | 1.8 | 13.2 | 18.5 | 14.3 to 16.8 |
| ramp share | onto freeway via Colby Street | % | 29.7 | 2.2 | 25.6 | 33.2 | 28.1 to 31.3 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 13.5 | 1.3 | 11.5 | 16.3 | 12.6 to 14.5 |
| ramp share | onto freeway via Benvenue Avenue | % | 3.4 | 0.6 | 2.9 | 4.9 | 3.0 to 3.8 |
| ramp share | from freeway via College Avenue | % | 7.7 | 0.5 | 7.0 | 8.5 | 7.3 to 8.0 |
| ramp share | from freeway via Martin Street | % | 20.6 | 1.3 | 19.0 | 23.2 | 19.7 to 21.5 |
| ramp share | from freeway via Colby Street | % | 18.3 | 1.4 | 15.9 | 20.7 | 17.3 to 19.3 |
| ramp share | from freeway via Hillegass Avenue | % | 8.7 | 1.3 | 6.8 | 10.4 | 7.8 to 9.7 |
| ramp share | from freeway via Benvenue Avenue | % | 2.3 | 0.5 | 1.6 | 3.1 | 2.0 to 2.7 |
| corridor flow | Telegraph N median link flow | veh/h | 839.40 | 30.25 | 788.40 | 903.60 | 817.76 to 861.04 |
| corridor flow | Telegraph S median link flow | veh/h | 622.92 | 50.11 | 531.60 | 704.40 | 587.08 to 658.76 |
| corridor flow | College N median link flow | veh/h | 266.40 | 24.13 | 234.00 | 304.80 | 249.14 to 283.66 |
| corridor flow | College S median link flow | veh/h | 485.76 | 33.70 | 447.60 | 532.80 | 461.65 to 509.87 |
| corridor flow | Claremont N median link flow | veh/h | 340.92 | 13.79 | 312.00 | 357.60 | 331.05 to 350.79 |
| corridor flow | Claremont S median link flow | veh/h | 428.88 | 28.86 | 382.80 | 459.60 | 408.23 to 449.53 |
| corridor flow | Alcatraz E median link flow | veh/h | 363.96 | 35.27 | 314.40 | 416.40 | 338.73 to 389.19 |
| corridor flow | Alcatraz W median link flow | veh/h | 352.68 | 42.98 | 259.20 | 409.20 | 321.93 to 383.43 |
| corridor flow | Hillegass N median link flow | veh/h | 84.12 | 5.75 | 74.40 | 92.40 | 80.00 to 88.24 |
| corridor flow | Hillegass S median link flow | veh/h | 70.68 | 4.78 | 60.00 | 76.80 | 67.26 to 74.10 |
| corridor flow | Colby N median link flow | veh/h | 124.68 | 9.66 | 111.60 | 141.60 | 117.77 to 131.59 |
| corridor flow | Colby S median link flow | veh/h | 178.56 | 11.88 | 163.20 | 194.40 | 170.06 to 187.06 |
| corridor flow | Martin E median link flow | veh/h | 127.68 | 15.00 | 104.40 | 154.80 | 116.95 to 138.41 |
| corridor flow | Martin W median link flow | veh/h | 176.28 | 19.77 | 146.40 | 211.20 | 162.14 to 190.42 |

Per-seed detail: `rockridge-am_peak-s1-seed1.md` (seed 1 in full).
