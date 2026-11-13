# rockridge-pm_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.70 (min 0.00, max 3.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 7.94 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 5 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.70 | 0.95 | 0.00 | 3.00 | 0.02 to 1.38 |
| health | gridlock removals per hour | veh/h | 0.70 | 0.95 | 0.00 | 3.00 | 0.02 to 1.38 |
| health | entry backlog | % of spawned | 0.50 | 0.26 | 0.15 | 0.94 | 0.31 to 0.69 |
| health | backlog growth in the second half of the run | points of spawned | 0.39 | 0.26 | 0.06 | 0.88 | 0.20 to 0.57 |
| health | completed trips | trips | 22671.80 | 137.48 | 22486.00 | 22912.00 | 22573.46 to 22770.14 |
| health | arterial mean speed | m/s | 7.94 | 0.19 | 7.57 | 8.13 | 7.81 to 8.07 |
| health | arterial mean speed, last 15 min | m/s | 7.41 | 0.24 | 7.07 | 7.80 | 7.24 to 7.58 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 7.71 | 2.07 | 4.75 | 11.19 | 6.24 to 9.19 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 1.6 | 0.4 | 1.0 | 2.2 | 1.3 to 1.9 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 25.74 | 3.62 | 19.82 | 30.74 | 23.16 to 28.33 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 5.2 | 0.7 | 4.3 | 6.4 | 4.7 to 5.8 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 11.10 | 4.04 | 8.00 | 21.00 | 8.21 to 13.99 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1242.90 | 31.95 | 1189.00 | 1284.00 | 1220.04 to 1265.76 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 18.90 | 4.63 | 11.00 | 25.00 | 15.59 to 22.21 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1011.60 | 35.18 | 967.00 | 1067.00 | 986.43 to 1036.77 |
| headline share | Hillegass Avenue NB from freeway | % | 68.5 | 2.8 | 64.0 | 72.8 | 66.5 to 70.5 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 2.0 | 1.7 | 0.0 | 5.1 | 0.8 to 3.2 |
| share | Hillegass Avenue NB to College Avenue | % | 7.7 | 1.8 | 4.8 | 10.3 | 6.4 to 9.0 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 26.9 | 4.0 | 20.6 | 31.3 | 24.0 to 29.8 |
| headline share | Colby Street NB from freeway | % | 77.0 | 3.1 | 71.1 | 82.2 | 74.8 to 79.2 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 8.2 | 4.4 | 4.7 | 20.1 | 5.1 to 11.4 |
| share | Colby Street NB to Telegraph Avenue | % | 22.8 | 4.7 | 17.9 | 34.2 | 19.4 to 26.2 |
| share | Colby Street NB to College Avenue | % | 1.2 | 0.6 | 0.4 | 1.9 | 0.8 to 1.6 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 9.0 | 2.6 | 5.2 | 12.4 | 7.1 to 10.8 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 2.1 | 0.9 | 1.0 | 3.6 | 1.5 to 2.7 |
| share | Hillegass Avenue SB from College Avenue | % | 6.3 | 1.4 | 3.8 | 8.2 | 5.3 to 7.3 |
| headline share | Hillegass Avenue SB to freeway | % | 78.1 | 3.8 | 71.4 | 82.9 | 75.4 to 80.9 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 9.5 | 2.5 | 6.6 | 14.3 | 7.7 to 11.3 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 28.9 | 3.3 | 24.9 | 33.5 | 26.5 to 31.2 |
| share | Colby Street SB from Telegraph Avenue | % | 21.1 | 3.2 | 15.8 | 26.5 | 18.8 to 23.4 |
| headline share | Colby Street SB to freeway | % | 70.1 | 2.7 | 66.1 | 75.1 | 68.2 to 72.0 |
| share | Colby Street SB to Forest Street | % | 10.6 | 3.0 | 6.6 | 14.2 | 8.4 to 12.7 |
| ramp share | onto freeway via College Avenue | % | 11.6 | 1.1 | 10.1 | 13.8 | 10.9 to 12.4 |
| ramp share | onto freeway via Hillegass Avenue | % | 14.8 | 1.3 | 12.5 | 16.3 | 13.9 to 15.8 |
| ramp share | onto freeway via Martin Street | % | 8.9 | 0.8 | 8.0 | 10.6 | 8.3 to 9.5 |
| ramp share | onto freeway via Colby Street | % | 18.5 | 1.2 | 16.3 | 19.9 | 17.6 to 19.3 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 5.7 | 0.7 | 4.9 | 7.0 | 5.1 to 6.2 |
| ramp share | onto freeway via Benvenue Avenue | % | 3.6 | 0.4 | 2.9 | 4.1 | 3.3 to 3.8 |
| ramp share | from freeway via College Avenue | % | 4.7 | 0.7 | 3.4 | 5.9 | 4.2 to 5.2 |
| ramp share | from freeway via Martin Street | % | 18.9 | 2.3 | 15.8 | 22.5 | 17.3 to 20.6 |
| ramp share | from freeway via Colby Street | % | 13.6 | 1.9 | 11.6 | 17.4 | 12.3 to 15.0 |
| ramp share | from freeway via Hillegass Avenue | % | 7.7 | 1.0 | 6.6 | 10.0 | 7.0 to 8.4 |
| ramp share | from freeway via Benvenue Avenue | % | 1.6 | 0.3 | 1.1 | 2.0 | 1.4 to 1.9 |
| corridor flow | Telegraph N median link flow | veh/h | 1169.16 | 79.15 | 982.80 | 1246.80 | 1112.54 to 1225.78 |
| corridor flow | Telegraph S median link flow | veh/h | 923.64 | 156.95 | 607.20 | 1107.60 | 811.37 to 1035.91 |
| corridor flow | College N median link flow | veh/h | 398.40 | 29.83 | 339.60 | 448.80 | 377.06 to 419.74 |
| corridor flow | College S median link flow | veh/h | 620.88 | 36.32 | 556.80 | 696.00 | 594.90 to 646.86 |
| corridor flow | Claremont N median link flow | veh/h | 588.36 | 45.41 | 523.20 | 656.40 | 555.88 to 620.84 |
| corridor flow | Claremont S median link flow | veh/h | 855.00 | 42.95 | 802.80 | 938.40 | 824.28 to 885.72 |
| corridor flow | Alcatraz E median link flow | veh/h | 517.92 | 52.72 | 459.60 | 625.20 | 480.21 to 555.63 |
| corridor flow | Alcatraz W median link flow | veh/h | 487.44 | 50.40 | 390.00 | 558.00 | 451.39 to 523.49 |
| corridor flow | Hillegass N median link flow | veh/h | 97.44 | 8.69 | 81.60 | 111.60 | 91.23 to 103.65 |
| corridor flow | Hillegass S median link flow | veh/h | 143.88 | 15.58 | 128.40 | 180.00 | 132.74 to 155.02 |
| corridor flow | Colby N median link flow | veh/h | 130.92 | 25.50 | 106.80 | 194.40 | 112.68 to 149.16 |
| corridor flow | Colby S median link flow | veh/h | 187.44 | 21.07 | 160.80 | 224.40 | 172.37 to 202.51 |
| corridor flow | Martin E median link flow | veh/h | 103.68 | 11.12 | 90.00 | 122.40 | 95.73 to 111.63 |
| corridor flow | Martin W median link flow | veh/h | 244.80 | 29.89 | 198.00 | 289.20 | 223.42 to 266.18 |

Per-seed detail: `rockridge-pm_peak-s1-seed1.md` (seed 1 in full).
