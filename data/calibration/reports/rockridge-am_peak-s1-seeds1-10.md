# rockridge-am_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.10 (min 0.00, max 1.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.27 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 9 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.10 | 0.32 | 0.00 | 1.00 | -0.13 to 0.33 |
| health | gridlock removals per hour | veh/h | 0.10 | 0.32 | 0.00 | 1.00 | -0.13 to 0.33 |
| health | entry backlog | % of spawned | 0.03 | 0.03 | 0.00 | 0.10 | 0.01 to 0.05 |
| health | backlog growth in the second half of the run | points of spawned | 0.01 | 0.03 | -0.06 | 0.06 | -0.02 to 0.03 |
| health | completed trips | trips | 19858.70 | 166.78 | 19581.00 | 20176.00 | 19739.40 to 19978.00 |
| health | arterial mean speed | m/s | 9.27 | 0.23 | 8.81 | 9.59 | 9.10 to 9.43 |
| health | arterial mean speed, last 15 min | m/s | 9.00 | 0.33 | 8.34 | 9.41 | 8.77 to 9.24 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 8.75 | 2.52 | 5.27 | 13.74 | 6.95 to 10.55 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 2.2 | 0.6 | 1.4 | 3.4 | 1.8 to 2.6 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 12.22 | 2.43 | 9.16 | 17.01 | 10.48 to 13.96 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 3.1 | 0.6 | 2.4 | 4.3 | 2.7 to 3.6 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 8.80 | 2.49 | 6.00 | 15.00 | 7.02 to 10.58 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 852.30 | 38.87 | 758.00 | 897.00 | 824.50 to 880.10 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 12.00 | 4.40 | 7.00 | 21.00 | 8.85 to 15.15 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1004.40 | 32.31 | 945.00 | 1043.00 | 981.29 to 1027.51 |
| headline share | Hillegass Avenue NB from freeway | % | 67.8 | 6.4 | 60.2 | 74.7 | 63.3 to 72.4 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 3.5 | 2.2 | 0.0 | 6.2 | 1.9 to 5.0 |
| share | Hillegass Avenue NB to College Avenue | % | 5.8 | 2.8 | 2.7 | 10.9 | 3.8 to 7.8 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 23.5 | 4.7 | 15.5 | 30.2 | 20.2 to 26.9 |
| headline share | Colby Street NB from freeway | % | 78.4 | 1.9 | 75.5 | 81.8 | 77.0 to 79.8 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 5.5 | 1.4 | 3.6 | 7.3 | 4.5 to 6.6 |
| share | Colby Street NB to Telegraph Avenue | % | 17.3 | 2.8 | 12.7 | 21.9 | 15.3 to 19.3 |
| share | Colby Street NB to College Avenue | % | 1.4 | 1.0 | 0.0 | 2.7 | 0.6 to 2.1 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 11.7 | 2.9 | 8.0 | 17.3 | 9.6 to 13.7 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 2.4 | 0.9 | 1.3 | 3.8 | 1.8 to 3.1 |
| share | Hillegass Avenue SB from College Avenue | % | 4.6 | 1.9 | 1.9 | 7.7 | 3.3 to 6.0 |
| headline share | Hillegass Avenue SB to freeway | % | 71.8 | 4.7 | 60.9 | 76.0 | 68.4 to 75.1 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 9.4 | 1.9 | 7.1 | 12.6 | 8.1 to 10.8 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 15.4 | 2.9 | 11.9 | 21.0 | 13.4 to 17.5 |
| share | Colby Street SB from Telegraph Avenue | % | 17.0 | 4.1 | 11.0 | 23.7 | 14.1 to 20.0 |
| headline share | Colby Street SB to freeway | % | 71.3 | 4.4 | 62.0 | 78.4 | 68.2 to 74.4 |
| share | Colby Street SB to Forest Street | % | 11.1 | 3.5 | 7.6 | 19.6 | 8.6 to 13.6 |
| ramp share | onto freeway via College Avenue | % | 12.2 | 1.3 | 10.4 | 14.6 | 11.2 to 13.2 |
| ramp share | onto freeway via Hillegass Avenue | % | 12.2 | 1.2 | 10.2 | 14.0 | 11.4 to 13.1 |
| ramp share | onto freeway via Martin Street | % | 14.4 | 1.2 | 12.4 | 16.0 | 13.5 to 15.3 |
| ramp share | onto freeway via Colby Street | % | 19.2 | 1.3 | 16.9 | 21.4 | 18.3 to 20.2 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 6.6 | 1.4 | 4.2 | 9.2 | 5.6 to 7.6 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.1 | 0.5 | 3.4 | 4.9 | 3.8 to 4.5 |
| ramp share | from freeway via College Avenue | % | 6.1 | 0.7 | 4.8 | 7.2 | 5.6 to 6.6 |
| ramp share | from freeway via Martin Street | % | 16.7 | 1.7 | 14.7 | 19.7 | 15.6 to 17.9 |
| ramp share | from freeway via Colby Street | % | 12.3 | 1.2 | 10.8 | 14.5 | 11.5 to 13.1 |
| ramp share | from freeway via Hillegass Avenue | % | 7.6 | 1.2 | 5.8 | 9.4 | 6.8 to 8.4 |
| ramp share | from freeway via Benvenue Avenue | % | 2.0 | 0.5 | 1.4 | 2.9 | 1.7 to 2.4 |
| corridor flow | Telegraph N median link flow | veh/h | 877.08 | 50.76 | 817.20 | 993.60 | 840.77 to 913.39 |
| corridor flow | Telegraph S median link flow | veh/h | 869.76 | 82.12 | 679.20 | 964.80 | 811.02 to 928.50 |
| corridor flow | College N median link flow | veh/h | 260.04 | 18.88 | 236.40 | 300.00 | 246.53 to 273.55 |
| corridor flow | College S median link flow | veh/h | 330.96 | 36.03 | 292.80 | 409.20 | 305.18 to 356.74 |
| corridor flow | Claremont N median link flow | veh/h | 594.00 | 30.58 | 542.40 | 638.40 | 572.12 to 615.88 |
| corridor flow | Claremont S median link flow | veh/h | 483.00 | 26.02 | 446.40 | 528.00 | 464.39 to 501.61 |
| corridor flow | Alcatraz E median link flow | veh/h | 364.44 | 33.44 | 327.60 | 440.40 | 340.52 to 388.36 |
| corridor flow | Alcatraz W median link flow | veh/h | 352.20 | 28.07 | 288.00 | 381.60 | 332.12 to 372.28 |
| corridor flow | Hillegass N median link flow | veh/h | 85.32 | 11.79 | 70.80 | 105.60 | 76.89 to 93.75 |
| corridor flow | Hillegass S median link flow | veh/h | 93.12 | 10.90 | 73.20 | 108.00 | 85.32 to 100.92 |
| corridor flow | Colby N median link flow | veh/h | 117.60 | 14.65 | 87.60 | 144.00 | 107.12 to 128.08 |
| corridor flow | Colby S median link flow | veh/h | 163.20 | 18.10 | 139.20 | 199.20 | 150.25 to 176.15 |
| corridor flow | Martin E median link flow | veh/h | 127.32 | 16.98 | 102.00 | 153.60 | 115.17 to 139.47 |
| corridor flow | Martin W median link flow | veh/h | 195.36 | 16.38 | 171.60 | 230.40 | 183.64 to 207.08 |

Per-seed detail: `rockridge-am_peak-s1-seed1.md` (seed 1 in full).
