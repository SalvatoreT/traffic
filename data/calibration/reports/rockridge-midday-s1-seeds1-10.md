# rockridge-midday-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 10.17 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.00 | 0.00 | 0.00 | 0.01 | 0.00 to 0.01 |
| health | backlog growth in the second half of the run | points of spawned | -0.01 | 0.01 | -0.03 | 0.01 | -0.02 to 0.00 |
| health | completed trips | trips | 15970.90 | 135.81 | 15739.00 | 16178.00 | 15873.75 to 16068.05 |
| health | arterial mean speed | m/s | 10.17 | 0.03 | 10.13 | 10.22 | 10.15 to 10.19 |
| health | arterial mean speed, last 15 min | m/s | 10.20 | 0.07 | 10.07 | 10.33 | 10.15 to 10.25 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 3.63 | 1.09 | 2.17 | 5.36 | 2.85 to 4.40 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 1.6 | 0.5 | 1.0 | 2.3 | 1.2 to 1.9 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 3.76 | 1.35 | 2.61 | 6.69 | 2.80 to 4.73 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 1.6 | 0.6 | 1.1 | 2.7 | 1.2 to 2.0 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 18.30 | 4.32 | 11.00 | 25.00 | 15.21 to 21.39 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 835.60 | 32.85 | 776.00 | 897.00 | 812.10 to 859.10 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 6.90 | 2.18 | 5.00 | 12.00 | 5.34 to 8.46 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 928.70 | 30.42 | 889.00 | 972.00 | 906.94 to 950.46 |
| headline share | Hillegass Avenue NB from freeway | % | 53.2 | 4.1 | 46.6 | 58.8 | 50.3 to 56.2 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 2.0 | 1.4 | 0.0 | 3.9 | 1.0 to 2.9 |
| share | Hillegass Avenue NB to College Avenue | % | 3.6 | 2.8 | 0.0 | 7.3 | 1.6 to 5.6 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 21.2 | 4.8 | 12.7 | 28.2 | 17.8 to 24.6 |
| headline share | Colby Street NB from freeway | % | 64.2 | 4.5 | 57.3 | 71.0 | 61.0 to 67.4 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 12.6 | 3.1 | 7.3 | 16.9 | 10.4 to 14.8 |
| share | Colby Street NB to Telegraph Avenue | % | 18.3 | 2.9 | 15.3 | 23.1 | 16.2 to 20.4 |
| share | Colby Street NB to College Avenue | % | 1.3 | 1.4 | 0.0 | 4.9 | 0.3 to 2.4 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 5.5 | 3.6 | 1.4 | 13.3 | 2.9 to 8.1 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 3.4 | 2.5 | 0.0 | 8.2 | 1.5 to 5.2 |
| share | Hillegass Avenue SB from College Avenue | % | 2.5 | 2.2 | 0.0 | 7.1 | 0.9 to 4.0 |
| headline share | Hillegass Avenue SB to freeway | % | 66.3 | 6.9 | 51.0 | 73.5 | 61.4 to 71.2 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 16.9 | 3.5 | 10.2 | 20.8 | 14.4 to 19.4 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 16.0 | 2.7 | 12.9 | 20.3 | 14.1 to 17.9 |
| share | Colby Street SB from Telegraph Avenue | % | 17.2 | 5.0 | 11.1 | 27.1 | 13.7 to 20.8 |
| headline share | Colby Street SB to freeway | % | 57.9 | 3.1 | 53.2 | 62.9 | 55.7 to 60.1 |
| share | Colby Street SB to Forest Street | % | 15.9 | 4.5 | 9.5 | 24.3 | 12.7 to 19.1 |
| ramp share | onto freeway via College Avenue | % | 17.6 | 2.2 | 15.1 | 21.5 | 16.1 to 19.2 |
| ramp share | onto freeway via Hillegass Avenue | % | 14.0 | 1.7 | 11.5 | 17.3 | 12.8 to 15.2 |
| ramp share | onto freeway via Martin Street | % | 18.5 | 2.2 | 15.0 | 21.7 | 16.9 to 20.0 |
| ramp share | onto freeway via Colby Street | % | 11.5 | 1.7 | 8.6 | 13.5 | 10.3 to 12.7 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 7.1 | 1.5 | 4.4 | 9.0 | 6.1 to 8.2 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.2 | 0.6 | 3.4 | 4.9 | 3.8 to 4.7 |
| ramp share | from freeway via College Avenue | % | 7.1 | 1.4 | 5.0 | 9.0 | 6.1 to 8.1 |
| ramp share | from freeway via Martin Street | % | 14.3 | 1.1 | 12.9 | 15.9 | 13.5 to 15.0 |
| ramp share | from freeway via Colby Street | % | 12.7 | 1.8 | 9.7 | 16.0 | 11.4 to 14.0 |
| ramp share | from freeway via Hillegass Avenue | % | 7.2 | 1.1 | 5.6 | 9.2 | 6.4 to 8.0 |
| ramp share | from freeway via Benvenue Avenue | % | 2.8 | 0.6 | 1.8 | 3.7 | 2.4 to 3.2 |
| corridor flow | Telegraph N median link flow | veh/h | 516.24 | 36.48 | 459.60 | 583.20 | 490.14 to 542.34 |
| corridor flow | Telegraph S median link flow | veh/h | 391.20 | 28.73 | 354.00 | 435.60 | 370.65 to 411.75 |
| corridor flow | College N median link flow | veh/h | 207.48 | 25.36 | 159.60 | 250.80 | 189.34 to 225.62 |
| corridor flow | College S median link flow | veh/h | 340.92 | 20.73 | 307.20 | 373.20 | 326.09 to 355.75 |
| corridor flow | Claremont N median link flow | veh/h | 317.76 | 28.14 | 278.40 | 363.60 | 297.63 to 337.89 |
| corridor flow | Claremont S median link flow | veh/h | 227.04 | 22.72 | 189.60 | 260.40 | 210.79 to 243.29 |
| corridor flow | Alcatraz E median link flow | veh/h | 398.16 | 22.03 | 358.80 | 421.20 | 382.40 to 413.92 |
| corridor flow | Alcatraz W median link flow | veh/h | 306.12 | 38.31 | 249.60 | 384.00 | 278.71 to 333.53 |
| corridor flow | Hillegass N median link flow | veh/h | 57.72 | 7.21 | 45.60 | 70.80 | 52.56 to 62.88 |
| corridor flow | Hillegass S median link flow | veh/h | 59.04 | 7.02 | 49.20 | 70.80 | 54.02 to 64.06 |
| corridor flow | Colby N median link flow | veh/h | 64.44 | 8.65 | 51.60 | 80.40 | 58.25 to 70.63 |
| corridor flow | Colby S median link flow | veh/h | 56.40 | 8.89 | 43.20 | 72.00 | 50.04 to 62.76 |
| corridor flow | Martin E median link flow | veh/h | 98.16 | 12.37 | 72.00 | 115.20 | 89.32 to 107.00 |
| corridor flow | Martin W median link flow | veh/h | 74.64 | 7.50 | 62.40 | 86.40 | 69.27 to 80.01 |

Per-seed detail: `rockridge-midday-s1-seed1.md` (seed 1 in full).
