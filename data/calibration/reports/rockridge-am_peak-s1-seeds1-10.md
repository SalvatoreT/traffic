# rockridge-am_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 8.98 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.03 | 0.04 | 0.00 | 0.12 | 0.00 to 0.06 |
| health | backlog growth in the second half of the run | points of spawned | 0.01 | 0.06 | -0.09 | 0.12 | -0.04 to 0.05 |
| health | completed trips | trips | 20632.50 | 150.44 | 20420.00 | 20881.00 | 20524.89 to 20740.11 |
| health | arterial mean speed | m/s | 8.98 | 0.17 | 8.76 | 9.33 | 8.85 to 9.10 |
| health | arterial mean speed, last 15 min | m/s | 8.83 | 0.30 | 8.30 | 9.30 | 8.62 to 9.05 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 6.97 | 1.65 | 4.47 | 9.48 | 5.79 to 8.15 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 1.8 | 0.5 | 1.1 | 2.5 | 1.5 to 2.1 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 7.70 | 1.92 | 5.83 | 10.83 | 6.32 to 9.08 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 2.0 | 0.5 | 1.5 | 2.8 | 1.6 to 2.3 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 2.70 | 1.34 | 0.00 | 5.00 | 1.74 to 3.66 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 929.30 | 24.79 | 881.00 | 961.00 | 911.57 to 947.03 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 13.20 | 2.70 | 10.00 | 18.00 | 11.27 to 15.13 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 937.70 | 26.75 | 871.00 | 963.00 | 918.57 to 956.83 |
| headline share | Hillegass Avenue NB from freeway | % | 69.6 | 5.7 | 60.0 | 78.6 | 65.5 to 73.7 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 3.8 | 2.2 | 0.9 | 8.2 | 2.3 to 5.4 |
| share | Hillegass Avenue NB to College Avenue | % | 8.1 | 3.2 | 3.9 | 12.4 | 5.8 to 10.4 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 24.7 | 4.0 | 17.8 | 31.1 | 21.8 to 27.6 |
| headline share | Colby Street NB from freeway | % | 80.5 | 3.0 | 74.7 | 85.7 | 78.3 to 82.6 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 5.1 | 1.8 | 2.3 | 7.3 | 3.8 to 6.3 |
| share | Colby Street NB to Telegraph Avenue | % | 16.7 | 2.6 | 11.7 | 19.4 | 14.8 to 18.6 |
| share | Colby Street NB to College Avenue | % | 2.2 | 1.1 | 0.5 | 4.0 | 1.4 to 3.0 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 13.1 | 3.5 | 9.2 | 18.5 | 10.6 to 15.5 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 1.5 | 1.4 | 0.0 | 3.8 | 0.5 to 2.5 |
| share | Hillegass Avenue SB from College Avenue | % | 5.2 | 1.7 | 2.0 | 8.3 | 4.0 to 6.4 |
| headline share | Hillegass Avenue SB to freeway | % | 66.2 | 5.5 | 58.0 | 73.4 | 62.3 to 70.2 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 9.1 | 1.5 | 6.3 | 11.6 | 8.0 to 10.2 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 19.6 | 4.1 | 13.4 | 25.0 | 16.6 to 22.5 |
| share | Colby Street SB from Telegraph Avenue | % | 20.8 | 2.9 | 16.4 | 24.8 | 18.7 to 22.8 |
| headline share | Colby Street SB to freeway | % | 69.2 | 4.4 | 61.7 | 74.7 | 66.0 to 72.4 |
| share | Colby Street SB to Forest Street | % | 10.3 | 2.1 | 7.2 | 12.9 | 8.9 to 11.8 |
| ramp share | onto freeway via College Avenue | % | 14.7 | 1.5 | 12.6 | 16.8 | 13.7 to 15.8 |
| ramp share | onto freeway via Hillegass Avenue | % | 10.9 | 1.5 | 8.2 | 13.1 | 9.8 to 12.0 |
| ramp share | onto freeway via Martin Street | % | 13.2 | 0.7 | 12.4 | 14.7 | 12.7 to 13.7 |
| ramp share | onto freeway via Colby Street | % | 18.5 | 2.0 | 14.8 | 21.5 | 17.1 to 20.0 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 8.7 | 0.7 | 7.8 | 9.9 | 8.2 to 9.2 |
| ramp share | onto freeway via Benvenue Avenue | % | 3.4 | 0.6 | 2.0 | 4.1 | 2.9 to 3.8 |
| ramp share | from freeway via College Avenue | % | 7.5 | 1.1 | 5.7 | 9.7 | 6.7 to 8.2 |
| ramp share | from freeway via Martin Street | % | 17.3 | 1.5 | 15.3 | 19.7 | 16.2 to 18.3 |
| ramp share | from freeway via Colby Street | % | 11.1 | 1.1 | 9.8 | 13.0 | 10.4 to 11.9 |
| ramp share | from freeway via Hillegass Avenue | % | 6.5 | 0.7 | 5.5 | 7.8 | 5.9 to 7.0 |
| ramp share | from freeway via Benvenue Avenue | % | 1.9 | 0.4 | 1.5 | 2.5 | 1.6 to 2.2 |
| corridor flow | Telegraph N median link flow | veh/h | 965.52 | 34.67 | 901.20 | 1009.20 | 940.72 to 990.32 |
| corridor flow | Telegraph S median link flow | veh/h | 947.28 | 79.38 | 760.80 | 1028.40 | 890.50 to 1004.06 |
| corridor flow | College N median link flow | veh/h | 288.60 | 29.14 | 246.00 | 346.80 | 267.75 to 309.45 |
| corridor flow | College S median link flow | veh/h | 389.76 | 33.63 | 336.00 | 441.60 | 365.70 to 413.82 |
| corridor flow | Claremont N median link flow | veh/h | 563.76 | 30.33 | 524.40 | 618.00 | 542.06 to 585.46 |
| corridor flow | Claremont S median link flow | veh/h | 605.16 | 18.00 | 582.00 | 628.80 | 592.28 to 618.04 |
| corridor flow | Alcatraz E median link flow | veh/h | 409.80 | 39.68 | 336.00 | 470.40 | 381.41 to 438.19 |
| corridor flow | Alcatraz W median link flow | veh/h | 393.12 | 40.02 | 343.20 | 457.20 | 364.49 to 421.75 |
| corridor flow | Hillegass N median link flow | veh/h | 74.16 | 7.98 | 55.20 | 81.60 | 68.45 to 79.87 |
| corridor flow | Hillegass S median link flow | veh/h | 94.08 | 13.26 | 69.60 | 116.40 | 84.60 to 103.56 |
| corridor flow | Colby N median link flow | veh/h | 116.16 | 9.27 | 98.40 | 134.40 | 109.53 to 122.79 |
| corridor flow | Colby S median link flow | veh/h | 161.04 | 11.30 | 141.60 | 177.60 | 152.96 to 169.12 |
| corridor flow | Martin E median link flow | veh/h | 130.68 | 12.55 | 115.20 | 156.00 | 121.70 to 139.66 |
| corridor flow | Martin W median link flow | veh/h | 213.60 | 22.61 | 187.20 | 258.00 | 197.42 to 229.78 |

Per-seed detail: `rockridge-am_peak-s1-seed1.md` (seed 1 in full).
