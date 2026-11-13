# rockridge-pm_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 2.30 (min 1.00, max 8.00) | NO |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 7.82 m/s | yes |

**Verdict: not stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 0 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 2.30 | 2.21 | 1.00 | 8.00 | 0.72 to 3.88 |
| health | gridlock removals per hour | veh/h | 2.30 | 2.21 | 1.00 | 8.00 | 0.72 to 3.88 |
| health | entry backlog | % of spawned | 0.19 | 0.07 | 0.06 | 0.27 | 0.14 to 0.24 |
| health | backlog growth in the second half of the run | points of spawned | 0.10 | 0.09 | -0.05 | 0.22 | 0.03 to 0.17 |
| health | completed trips | trips | 24118.90 | 184.53 | 23806.00 | 24323.00 | 23986.90 to 24250.90 |
| health | arterial mean speed | m/s | 7.82 | 0.15 | 7.61 | 8.07 | 7.71 to 7.92 |
| health | arterial mean speed, last 15 min | m/s | 7.48 | 0.22 | 7.04 | 7.72 | 7.33 to 7.64 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 15.88 | 3.44 | 9.81 | 19.27 | 13.42 to 18.34 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 3.0 | 0.6 | 1.9 | 3.6 | 2.5 to 3.5 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 13.74 | 4.13 | 7.59 | 20.93 | 10.79 to 16.69 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 2.6 | 0.7 | 1.5 | 3.8 | 2.1 to 3.1 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 23.90 | 6.03 | 16.00 | 37.00 | 19.59 to 28.21 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1256.90 | 50.36 | 1196.00 | 1347.00 | 1220.88 to 1292.92 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 21.30 | 4.35 | 15.00 | 29.00 | 18.19 to 24.41 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1394.20 | 29.63 | 1341.00 | 1435.00 | 1373.01 to 1415.39 |
| headline share | Hillegass Avenue NB from freeway | % | 51.4 | 3.0 | 46.5 | 55.9 | 49.3 to 53.6 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 1.3 | 1.1 | 0.0 | 3.2 | 0.5 to 2.0 |
| share | Hillegass Avenue NB to College Avenue | % | 2.9 | 1.5 | 0.5 | 5.3 | 1.8 to 4.0 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 21.8 | 3.1 | 18.6 | 29.2 | 19.6 to 24.0 |
| headline share | Colby Street NB from freeway | % | 69.1 | 1.5 | 67.4 | 71.4 | 68.0 to 70.1 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 9.9 | 2.0 | 6.5 | 12.9 | 8.5 to 11.3 |
| share | Colby Street NB to Telegraph Avenue | % | 21.6 | 3.7 | 15.1 | 27.5 | 18.9 to 24.2 |
| share | Colby Street NB to College Avenue | % | 1.9 | 0.7 | 0.8 | 3.0 | 1.4 to 2.4 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 5.7 | 1.6 | 3.6 | 8.1 | 4.6 to 6.9 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 2.6 | 1.1 | 1.4 | 4.5 | 1.9 to 3.4 |
| share | Hillegass Avenue SB from College Avenue | % | 3.7 | 1.3 | 2.0 | 5.7 | 2.8 to 4.6 |
| headline share | Hillegass Avenue SB to freeway | % | 50.9 | 3.7 | 44.5 | 55.9 | 48.3 to 53.5 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 35.4 | 1.9 | 33.0 | 38.6 | 34.1 to 36.8 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 16.5 | 2.0 | 12.9 | 19.8 | 15.1 to 17.9 |
| share | Colby Street SB from Telegraph Avenue | % | 28.7 | 2.4 | 24.3 | 32.0 | 27.0 to 30.5 |
| headline share | Colby Street SB to freeway | % | 57.5 | 5.4 | 51.2 | 65.2 | 53.6 to 61.4 |
| share | Colby Street SB to Forest Street | % | 11.1 | 3.6 | 6.8 | 17.1 | 8.5 to 13.7 |
| ramp share | onto freeway via College Avenue | % | 16.1 | 1.2 | 14.3 | 18.4 | 15.2 to 16.9 |
| ramp share | onto freeway via Hillegass Avenue | % | 16.8 | 2.6 | 11.8 | 20.3 | 14.9 to 18.7 |
| ramp share | onto freeway via Martin Street | % | 21.5 | 2.7 | 17.1 | 25.6 | 19.6 to 23.4 |
| ramp share | onto freeway via Colby Street | % | 25.8 | 3.3 | 22.3 | 31.1 | 23.4 to 28.1 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 13.8 | 1.7 | 10.6 | 16.0 | 12.6 to 15.0 |
| ramp share | onto freeway via Benvenue Avenue | % | 1.7 | 0.6 | 1.0 | 2.6 | 1.3 to 2.1 |
| ramp share | from freeway via College Avenue | % | 7.0 | 1.3 | 5.7 | 9.8 | 6.1 to 7.9 |
| ramp share | from freeway via Martin Street | % | 26.8 | 2.2 | 23.7 | 29.8 | 25.2 to 28.4 |
| ramp share | from freeway via Colby Street | % | 19.5 | 0.9 | 18.0 | 20.9 | 18.9 to 20.1 |
| ramp share | from freeway via Hillegass Avenue | % | 8.5 | 0.8 | 7.1 | 9.9 | 7.9 to 9.0 |
| ramp share | from freeway via Benvenue Avenue | % | 2.1 | 0.6 | 1.4 | 3.2 | 1.6 to 2.5 |
| corridor flow | Telegraph N median link flow | veh/h | 1126.08 | 57.02 | 1026.00 | 1191.60 | 1085.30 to 1166.86 |
| corridor flow | Telegraph S median link flow | veh/h | 896.64 | 114.30 | 645.60 | 1062.00 | 814.88 to 978.40 |
| corridor flow | College N median link flow | veh/h | 417.00 | 29.61 | 368.40 | 469.20 | 395.82 to 438.18 |
| corridor flow | College S median link flow | veh/h | 636.96 | 25.49 | 597.60 | 675.60 | 618.73 to 655.19 |
| corridor flow | Claremont N median link flow | veh/h | 420.00 | 58.86 | 328.80 | 518.40 | 377.89 to 462.11 |
| corridor flow | Claremont S median link flow | veh/h | 463.44 | 31.97 | 418.80 | 504.00 | 440.57 to 486.31 |
| corridor flow | Alcatraz E median link flow | veh/h | 456.00 | 48.16 | 381.60 | 537.60 | 421.55 to 490.45 |
| corridor flow | Alcatraz W median link flow | veh/h | 294.48 | 27.96 | 254.40 | 343.20 | 274.48 to 314.48 |
| corridor flow | Hillegass N median link flow | veh/h | 101.28 | 11.83 | 82.80 | 120.00 | 92.82 to 109.74 |
| corridor flow | Hillegass S median link flow | veh/h | 138.72 | 13.63 | 115.20 | 159.60 | 128.97 to 148.47 |
| corridor flow | Colby N median link flow | veh/h | 159.00 | 7.29 | 144.00 | 171.60 | 153.78 to 164.22 |
| corridor flow | Colby S median link flow | veh/h | 201.36 | 30.00 | 162.00 | 256.80 | 179.90 to 222.82 |
| corridor flow | Martin E median link flow | veh/h | 158.64 | 15.53 | 135.60 | 178.80 | 147.53 to 169.75 |
| corridor flow | Martin W median link flow | veh/h | 265.92 | 34.00 | 208.80 | 313.20 | 241.60 to 290.24 |

Per-seed detail: `rockridge-pm_peak-s1-seed1.md` (seed 1 in full).
