# rockridge-am_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 1.00 (min 0.00, max 6.00) | NO |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 8.41 m/s | yes |

**Verdict: not stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 7 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 1.00 | 1.94 | 0.00 | 6.00 | -0.39 to 2.39 |
| health | gridlock removals per hour | veh/h | 1.00 | 1.94 | 0.00 | 6.00 | -0.39 to 2.39 |
| health | entry backlog | % of spawned | 0.20 | 0.23 | 0.00 | 0.68 | 0.04 to 0.37 |
| health | backlog growth in the second half of the run | points of spawned | 0.15 | 0.20 | -0.06 | 0.51 | 0.01 to 0.29 |
| health | completed trips | trips | 20351.40 | 211.55 | 20070.00 | 20706.00 | 20200.08 to 20502.72 |
| health | arterial mean speed | m/s | 8.41 | 0.22 | 8.03 | 8.64 | 8.25 to 8.57 |
| health | arterial mean speed, last 15 min | m/s | 8.31 | 0.29 | 7.70 | 8.63 | 8.11 to 8.52 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 8.26 | 1.49 | 6.28 | 11.10 | 7.20 to 9.33 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 2.2 | 0.4 | 1.8 | 2.9 | 2.0 to 2.5 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 16.77 | 3.60 | 10.05 | 21.95 | 14.20 to 19.35 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 4.5 | 0.8 | 3.0 | 5.4 | 3.9 to 5.1 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 11.40 | 3.31 | 7.00 | 17.00 | 9.03 to 13.77 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 964.30 | 25.60 | 919.00 | 1003.00 | 945.99 to 982.61 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 20.80 | 6.58 | 13.00 | 34.00 | 16.09 to 25.51 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 965.30 | 21.42 | 944.00 | 1005.00 | 949.98 to 980.62 |
| headline share | Hillegass Avenue NB from freeway | % | 63.7 | 4.5 | 57.3 | 70.9 | 60.5 to 66.9 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 2.9 | 2.4 | 0.0 | 6.7 | 1.2 to 4.7 |
| share | Hillegass Avenue NB to College Avenue | % | 6.2 | 2.7 | 3.4 | 11.2 | 4.2 to 8.1 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 16.5 | 4.1 | 12.9 | 26.2 | 13.5 to 19.4 |
| headline share | Colby Street NB from freeway | % | 76.4 | 3.2 | 72.6 | 81.7 | 74.1 to 78.7 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 6.0 | 2.3 | 2.9 | 10.5 | 4.4 to 7.7 |
| share | Colby Street NB to Telegraph Avenue | % | 20.7 | 3.5 | 15.9 | 27.3 | 18.2 to 23.2 |
| share | Colby Street NB to College Avenue | % | 0.6 | 0.5 | 0.0 | 1.5 | 0.2 to 0.9 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 14.7 | 3.3 | 11.0 | 19.8 | 12.3 to 17.1 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 5.0 | 1.9 | 1.9 | 8.8 | 3.6 to 6.3 |
| share | Hillegass Avenue SB from College Avenue | % | 8.8 | 2.5 | 5.3 | 13.2 | 7.0 to 10.6 |
| headline share | Hillegass Avenue SB to freeway | % | 57.3 | 5.3 | 44.3 | 63.0 | 53.5 to 61.0 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 7.4 | 1.2 | 6.0 | 10.1 | 6.6 to 8.3 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 17.6 | 2.0 | 12.4 | 19.3 | 16.1 to 19.0 |
| share | Colby Street SB from Telegraph Avenue | % | 18.4 | 3.6 | 13.0 | 24.3 | 15.8 to 20.9 |
| headline share | Colby Street SB to freeway | % | 68.7 | 3.5 | 62.5 | 73.5 | 66.2 to 71.2 |
| share | Colby Street SB to Forest Street | % | 13.8 | 2.1 | 10.8 | 17.4 | 12.3 to 15.3 |
| ramp share | onto freeway via College Avenue | % | 10.1 | 1.4 | 7.4 | 11.5 | 9.0 to 11.1 |
| ramp share | onto freeway via Hillegass Avenue | % | 9.8 | 1.1 | 7.9 | 11.7 | 9.0 to 10.6 |
| ramp share | onto freeway via Martin Street | % | 9.9 | 1.4 | 7.8 | 11.6 | 9.0 to 10.9 |
| ramp share | onto freeway via Colby Street | % | 19.2 | 1.0 | 18.2 | 21.3 | 18.5 to 19.9 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 6.0 | 1.1 | 4.2 | 7.7 | 5.3 to 6.8 |
| ramp share | onto freeway via Benvenue Avenue | % | 3.9 | 0.6 | 2.4 | 4.6 | 3.5 to 4.4 |
| ramp share | from freeway via College Avenue | % | 4.8 | 0.3 | 4.2 | 5.3 | 4.6 to 5.0 |
| ramp share | from freeway via Martin Street | % | 16.9 | 1.6 | 14.6 | 18.8 | 15.8 to 18.1 |
| ramp share | from freeway via Colby Street | % | 8.9 | 1.0 | 7.3 | 10.2 | 8.2 to 9.6 |
| ramp share | from freeway via Hillegass Avenue | % | 4.2 | 0.5 | 3.5 | 5.0 | 3.8 to 4.5 |
| ramp share | from freeway via Benvenue Avenue | % | 1.8 | 0.2 | 1.6 | 2.2 | 1.7 to 2.0 |
| corridor flow | Telegraph N median link flow | veh/h | 915.48 | 41.09 | 843.60 | 993.60 | 886.09 to 944.87 |
| corridor flow | Telegraph S median link flow | veh/h | 954.60 | 76.37 | 862.80 | 1077.60 | 899.97 to 1009.23 |
| corridor flow | College N median link flow | veh/h | 245.04 | 21.69 | 219.60 | 288.00 | 229.52 to 260.56 |
| corridor flow | College S median link flow | veh/h | 318.00 | 37.79 | 249.60 | 381.60 | 290.97 to 345.03 |
| corridor flow | Claremont N median link flow | veh/h | 571.20 | 29.25 | 532.80 | 630.00 | 550.28 to 592.12 |
| corridor flow | Claremont S median link flow | veh/h | 558.96 | 40.81 | 526.80 | 667.20 | 529.77 to 588.15 |
| corridor flow | Alcatraz E median link flow | veh/h | 366.48 | 27.28 | 332.40 | 422.40 | 346.97 to 385.99 |
| corridor flow | Alcatraz W median link flow | veh/h | 382.80 | 37.30 | 318.00 | 442.80 | 356.12 to 409.48 |
| corridor flow | Hillegass N median link flow | veh/h | 58.92 | 6.94 | 45.60 | 67.20 | 53.96 to 63.88 |
| corridor flow | Hillegass S median link flow | veh/h | 82.80 | 11.29 | 69.60 | 100.80 | 74.73 to 90.87 |
| corridor flow | Colby N median link flow | veh/h | 99.12 | 8.84 | 81.60 | 110.40 | 92.80 to 105.44 |
| corridor flow | Colby S median link flow | veh/h | 163.68 | 18.98 | 135.60 | 189.60 | 150.11 to 177.25 |
| corridor flow | Martin E median link flow | veh/h | 101.88 | 23.10 | 74.40 | 147.60 | 85.36 to 118.40 |
| corridor flow | Martin W median link flow | veh/h | 209.76 | 25.53 | 168.00 | 250.80 | 191.50 to 228.02 |

Per-seed detail: `rockridge-am_peak-s1-seed1.md` (seed 1 in full).
