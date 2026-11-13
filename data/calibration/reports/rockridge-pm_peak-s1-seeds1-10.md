# rockridge-pm_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 4.20 (min 0.00, max 13.00) | NO |
| Entry backlog | below 2.0% in at least 90% of seeds | 9 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | seeds 1 | NO |
| Arterial speed | mean above 4.0 m/s | 7.14 m/s | yes |

**Verdict: not stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 2 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 4.20 | 4.10 | 0.00 | 13.00 | 1.26 to 7.14 |
| health | gridlock removals per hour | veh/h | 4.20 | 4.10 | 0.00 | 13.00 | 1.26 to 7.14 |
| health | entry backlog | % of spawned | 0.79 | 0.69 | 0.34 | 2.66 | 0.30 to 1.28 |
| health | backlog growth in the second half of the run | points of spawned | 0.62 | 0.55 | 0.16 | 2.08 | 0.23 to 1.02 |
| health | completed trips | trips | 22470.30 | 186.52 | 22175.00 | 22809.00 | 22336.88 to 22603.72 |
| health | arterial mean speed | m/s | 7.14 | 0.21 | 6.67 | 7.43 | 6.99 to 7.29 |
| health | arterial mean speed, last 15 min | m/s | 6.37 | 0.25 | 5.93 | 6.73 | 6.19 to 6.55 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 14.84 | 5.08 | 9.68 | 25.36 | 11.21 to 18.47 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 2.7 | 0.9 | 1.7 | 4.5 | 2.1 to 3.3 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 12.64 | 4.47 | 8.50 | 20.57 | 9.45 to 15.84 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 2.3 | 0.7 | 1.6 | 3.6 | 1.8 to 2.8 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 11.60 | 6.22 | 4.00 | 23.00 | 7.15 to 16.05 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1211.70 | 56.97 | 1109.00 | 1308.00 | 1170.95 to 1252.45 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 35.60 | 8.67 | 21.00 | 52.00 | 29.40 to 41.80 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1075.50 | 40.61 | 987.00 | 1121.00 | 1046.45 to 1104.55 |
| headline share | Hillegass Avenue NB from freeway | % | 66.7 | 5.3 | 60.5 | 76.2 | 62.9 to 70.5 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 3.0 | 1.5 | 1.6 | 6.0 | 1.9 to 4.1 |
| share | Hillegass Avenue NB to College Avenue | % | 13.1 | 4.5 | 6.5 | 20.8 | 9.9 to 16.3 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 22.3 | 6.1 | 13.1 | 32.0 | 17.9 to 26.6 |
| headline share | Colby Street NB from freeway | % | 74.2 | 3.0 | 68.2 | 78.7 | 72.0 to 76.3 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 13.8 | 6.9 | 6.6 | 28.7 | 8.9 to 18.7 |
| share | Colby Street NB to Telegraph Avenue | % | 25.4 | 4.4 | 20.2 | 33.0 | 22.3 to 28.5 |
| share | Colby Street NB to College Avenue | % | 2.5 | 0.6 | 1.9 | 3.8 | 2.1 to 3.0 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 8.8 | 2.0 | 5.6 | 11.9 | 7.4 to 10.2 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 3.8 | 1.4 | 2.1 | 6.0 | 2.8 to 4.8 |
| share | Hillegass Avenue SB from College Avenue | % | 6.7 | 1.7 | 4.3 | 9.1 | 5.5 to 7.9 |
| headline share | Hillegass Avenue SB to freeway | % | 73.2 | 2.3 | 69.7 | 77.4 | 71.5 to 74.8 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 13.3 | 2.5 | 10.4 | 19.0 | 11.5 to 15.1 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 22.8 | 5.1 | 16.0 | 29.5 | 19.1 to 26.4 |
| share | Colby Street SB from Telegraph Avenue | % | 28.4 | 4.9 | 22.4 | 35.7 | 24.9 to 31.9 |
| headline share | Colby Street SB to freeway | % | 67.0 | 4.0 | 60.6 | 72.2 | 64.1 to 69.9 |
| share | Colby Street SB to Forest Street | % | 14.6 | 3.3 | 9.1 | 19.4 | 12.2 to 16.9 |
| ramp share | onto freeway via College Avenue | % | 10.7 | 1.2 | 9.3 | 12.7 | 9.8 to 11.6 |
| ramp share | onto freeway via Hillegass Avenue | % | 16.7 | 1.3 | 14.5 | 18.7 | 15.7 to 17.7 |
| ramp share | onto freeway via Martin Street | % | 10.4 | 1.4 | 8.6 | 12.8 | 9.4 to 11.5 |
| ramp share | onto freeway via Colby Street | % | 17.6 | 1.3 | 16.1 | 19.8 | 16.7 to 18.5 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 8.7 | 1.3 | 6.3 | 10.6 | 7.8 to 9.6 |
| ramp share | onto freeway via Benvenue Avenue | % | 2.8 | 0.3 | 2.3 | 3.4 | 2.5 to 3.0 |
| ramp share | from freeway via College Avenue | % | 8.5 | 1.6 | 6.4 | 10.8 | 7.3 to 9.7 |
| ramp share | from freeway via Martin Street | % | 19.7 | 2.1 | 16.6 | 23.6 | 18.2 to 21.1 |
| ramp share | from freeway via Colby Street | % | 14.7 | 2.5 | 11.6 | 19.5 | 12.9 to 16.4 |
| ramp share | from freeway via Hillegass Avenue | % | 7.9 | 1.7 | 5.8 | 11.3 | 6.7 to 9.2 |
| ramp share | from freeway via Benvenue Avenue | % | 2.8 | 0.4 | 2.1 | 3.5 | 2.5 to 3.1 |
| corridor flow | Telegraph N median link flow | veh/h | 1066.44 | 104.77 | 896.40 | 1192.80 | 991.50 to 1141.38 |
| corridor flow | Telegraph S median link flow | veh/h | 1045.92 | 117.36 | 752.40 | 1174.80 | 961.97 to 1129.87 |
| corridor flow | College N median link flow | veh/h | 445.68 | 32.67 | 400.80 | 486.00 | 422.31 to 469.05 |
| corridor flow | College S median link flow | veh/h | 744.48 | 34.95 | 687.60 | 788.40 | 719.48 to 769.48 |
| corridor flow | Claremont N median link flow | veh/h | 563.16 | 63.37 | 435.60 | 650.40 | 517.83 to 608.49 |
| corridor flow | Claremont S median link flow | veh/h | 831.36 | 39.45 | 769.20 | 902.40 | 803.14 to 859.58 |
| corridor flow | Alcatraz E median link flow | veh/h | 486.96 | 51.24 | 400.80 | 571.20 | 450.31 to 523.61 |
| corridor flow | Alcatraz W median link flow | veh/h | 426.12 | 45.70 | 381.60 | 528.00 | 393.43 to 458.81 |
| corridor flow | Hillegass N median link flow | veh/h | 114.84 | 18.19 | 86.40 | 139.20 | 101.83 to 127.85 |
| corridor flow | Hillegass S median link flow | veh/h | 182.04 | 13.23 | 158.40 | 201.60 | 172.58 to 191.50 |
| corridor flow | Colby N median link flow | veh/h | 160.44 | 34.63 | 117.60 | 223.20 | 135.67 to 185.21 |
| corridor flow | Colby S median link flow | veh/h | 205.08 | 29.59 | 146.40 | 250.80 | 183.92 to 226.24 |
| corridor flow | Martin E median link flow | veh/h | 121.44 | 22.36 | 88.80 | 159.60 | 105.45 to 137.43 |
| corridor flow | Martin W median link flow | veh/h | 259.32 | 34.92 | 210.00 | 316.80 | 234.34 to 284.30 |

Per-seed detail: `rockridge-pm_peak-s1-seed1.md` (seed 1 in full).
