# rockridge-pm_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 1.80 (min 0.00, max 4.00) | NO |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 7.60 m/s | yes |

**Verdict: not stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 3 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 1.80 | 1.69 | 0.00 | 4.00 | 0.59 to 3.01 |
| health | gridlock removals per hour | veh/h | 1.80 | 1.69 | 0.00 | 4.00 | 0.59 to 3.01 |
| health | entry backlog | % of spawned | 0.54 | 0.22 | 0.13 | 0.86 | 0.38 to 0.70 |
| health | backlog growth in the second half of the run | points of spawned | 0.40 | 0.16 | 0.05 | 0.61 | 0.29 to 0.52 |
| health | completed trips | trips | 22880.50 | 171.96 | 22685.00 | 23269.00 | 22757.49 to 23003.51 |
| health | arterial mean speed | m/s | 7.60 | 0.12 | 7.38 | 7.86 | 7.52 to 7.69 |
| health | arterial mean speed, last 15 min | m/s | 7.15 | 0.21 | 6.91 | 7.48 | 6.99 to 7.30 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 13.80 | 2.74 | 10.80 | 19.53 | 11.84 to 15.76 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 2.6 | 0.5 | 2.0 | 3.6 | 2.3 to 3.0 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 6.86 | 0.89 | 5.47 | 8.33 | 6.23 to 7.50 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 1.3 | 0.2 | 1.0 | 1.6 | 1.2 to 1.4 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 11.70 | 5.40 | 7.00 | 23.00 | 7.84 to 15.56 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1154.90 | 38.94 | 1077.00 | 1208.00 | 1127.04 to 1182.76 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 46.50 | 11.87 | 31.00 | 74.00 | 38.01 to 54.99 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1137.70 | 49.91 | 1056.00 | 1200.00 | 1102.00 to 1173.40 |
| headline share | Hillegass Avenue NB from freeway | % | 71.4 | 5.4 | 62.1 | 80.1 | 67.6 to 75.3 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 1.9 | 0.9 | 0.6 | 3.6 | 1.2 to 2.6 |
| share | Hillegass Avenue NB to College Avenue | % | 9.9 | 3.4 | 5.3 | 15.4 | 7.4 to 12.3 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 15.0 | 2.8 | 9.8 | 19.8 | 13.0 to 17.0 |
| headline share | Colby Street NB from freeway | % | 78.1 | 1.8 | 73.8 | 80.8 | 76.9 to 79.4 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 6.3 | 2.3 | 3.6 | 10.4 | 4.6 to 7.9 |
| share | Colby Street NB to Telegraph Avenue | % | 23.1 | 3.2 | 19.5 | 28.0 | 20.8 to 25.4 |
| share | Colby Street NB to College Avenue | % | 1.1 | 0.7 | 0.4 | 2.6 | 0.7 to 1.6 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 9.6 | 2.0 | 5.1 | 12.1 | 8.2 to 11.1 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 4.4 | 1.9 | 1.0 | 8.1 | 3.0 to 5.7 |
| share | Hillegass Avenue SB from College Avenue | % | 7.2 | 1.4 | 5.3 | 10.3 | 6.2 to 8.2 |
| headline share | Hillegass Avenue SB to freeway | % | 73.4 | 2.9 | 67.0 | 77.0 | 71.3 to 75.5 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 9.3 | 3.0 | 6.0 | 15.1 | 7.2 to 11.5 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 30.7 | 5.5 | 25.5 | 40.8 | 26.8 to 34.7 |
| share | Colby Street SB from Telegraph Avenue | % | 28.0 | 4.0 | 21.1 | 35.4 | 25.1 to 30.9 |
| headline share | Colby Street SB to freeway | % | 60.5 | 3.8 | 54.5 | 66.8 | 57.8 to 63.2 |
| share | Colby Street SB to Forest Street | % | 16.0 | 3.3 | 11.3 | 22.0 | 13.6 to 18.4 |
| ramp share | onto freeway via College Avenue | % | 12.0 | 1.7 | 9.5 | 14.5 | 10.8 to 13.3 |
| ramp share | onto freeway via Hillegass Avenue | % | 18.5 | 1.8 | 15.3 | 21.2 | 17.2 to 19.7 |
| ramp share | onto freeway via Martin Street | % | 13.1 | 2.0 | 10.8 | 16.5 | 11.6 to 14.5 |
| ramp share | onto freeway via Colby Street | % | 17.3 | 1.2 | 15.6 | 19.7 | 16.4 to 18.1 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 8.3 | 1.2 | 5.9 | 10.0 | 7.5 to 9.2 |
| ramp share | onto freeway via Benvenue Avenue | % | 3.4 | 0.7 | 2.4 | 4.6 | 2.9 to 3.9 |
| ramp share | from freeway via College Avenue | % | 6.4 | 1.3 | 4.6 | 9.0 | 5.5 to 7.4 |
| ramp share | from freeway via Martin Street | % | 18.3 | 1.8 | 16.0 | 21.4 | 17.1 to 19.6 |
| ramp share | from freeway via Colby Street | % | 14.4 | 1.7 | 11.8 | 17.1 | 13.1 to 15.6 |
| ramp share | from freeway via Hillegass Avenue | % | 8.2 | 0.9 | 6.6 | 9.7 | 7.5 to 8.8 |
| ramp share | from freeway via Benvenue Avenue | % | 2.0 | 0.4 | 1.4 | 2.7 | 1.7 to 2.3 |
| corridor flow | Telegraph N median link flow | veh/h | 1212.24 | 103.76 | 1018.80 | 1363.20 | 1138.02 to 1286.46 |
| corridor flow | Telegraph S median link flow | veh/h | 865.56 | 54.24 | 753.60 | 952.80 | 826.77 to 904.35 |
| corridor flow | College N median link flow | veh/h | 411.96 | 52.92 | 314.40 | 501.60 | 374.11 to 449.81 |
| corridor flow | College S median link flow | veh/h | 747.36 | 36.20 | 709.20 | 802.80 | 721.46 to 773.26 |
| corridor flow | Claremont N median link flow | veh/h | 592.32 | 50.02 | 508.80 | 684.00 | 556.54 to 628.10 |
| corridor flow | Claremont S median link flow | veh/h | 789.00 | 47.72 | 722.40 | 837.60 | 754.87 to 823.13 |
| corridor flow | Alcatraz E median link flow | veh/h | 523.56 | 44.79 | 466.80 | 604.80 | 491.52 to 555.60 |
| corridor flow | Alcatraz W median link flow | veh/h | 460.44 | 49.76 | 378.00 | 540.00 | 424.84 to 496.04 |
| corridor flow | Hillegass N median link flow | veh/h | 102.72 | 11.20 | 87.60 | 121.20 | 94.71 to 110.73 |
| corridor flow | Hillegass S median link flow | veh/h | 190.08 | 24.40 | 165.60 | 240.00 | 172.63 to 207.53 |
| corridor flow | Colby N median link flow | veh/h | 154.32 | 22.51 | 128.40 | 193.20 | 138.22 to 170.42 |
| corridor flow | Colby S median link flow | veh/h | 200.04 | 21.11 | 174.00 | 228.00 | 184.94 to 215.14 |
| corridor flow | Martin E median link flow | veh/h | 131.16 | 14.85 | 108.00 | 158.40 | 120.54 to 141.78 |
| corridor flow | Martin W median link flow | veh/h | 240.24 | 29.70 | 199.20 | 301.20 | 218.99 to 261.49 |

Per-seed detail: `rockridge-pm_peak-s1-seed1.md` (seed 1 in full).
