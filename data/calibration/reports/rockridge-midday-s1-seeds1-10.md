# rockridge-midday-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.89 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.00 | 0.00 | 0.00 | 0.01 | -0.00 to 0.00 |
| health | backlog growth in the second half of the run | points of spawned | -0.00 | 0.01 | -0.01 | 0.01 | -0.01 to 0.00 |
| health | completed trips | trips | 15015.60 | 73.28 | 14895.00 | 15144.00 | 14963.18 to 15068.02 |
| health | arterial mean speed | m/s | 9.89 | 0.11 | 9.63 | 10.03 | 9.81 to 9.97 |
| health | arterial mean speed, last 15 min | m/s | 9.86 | 0.13 | 9.61 | 10.01 | 9.77 to 9.95 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 10.36 | 2.01 | 6.57 | 14.03 | 8.92 to 11.80 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 3.5 | 0.7 | 2.3 | 4.9 | 3.0 to 3.9 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 4.64 | 1.88 | 2.81 | 7.92 | 3.29 to 5.99 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 1.5 | 0.6 | 0.9 | 2.7 | 1.1 to 2.0 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 3.10 | 1.66 | 1.00 | 5.00 | 1.91 to 4.29 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 937.30 | 30.14 | 880.00 | 981.00 | 915.74 to 958.86 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 10.00 | 5.01 | 4.00 | 18.00 | 6.42 to 13.58 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 812.00 | 34.29 | 780.00 | 892.00 | 787.47 to 836.53 |
| headline share | Hillegass Avenue NB from freeway | % | 68.1 | 4.7 | 61.0 | 77.3 | 64.7 to 71.5 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 1.7 | 1.2 | 0.9 | 4.2 | 0.8 to 2.6 |
| share | Hillegass Avenue NB to College Avenue | % | 5.8 | 1.6 | 3.6 | 8.2 | 4.7 to 7.0 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 22.5 | 4.3 | 16.5 | 30.9 | 19.5 to 25.6 |
| headline share | Colby Street NB from freeway | % | 79.3 | 3.7 | 73.9 | 84.8 | 76.6 to 82.0 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 6.5 | 2.6 | 3.4 | 12.6 | 4.7 to 8.4 |
| share | Colby Street NB to Telegraph Avenue | % | 19.9 | 4.0 | 13.6 | 25.6 | 17.1 to 22.8 |
| share | Colby Street NB to College Avenue | % | 1.0 | 1.0 | 0.0 | 3.0 | 0.3 to 1.7 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 11.8 | 1.9 | 9.7 | 15.7 | 10.5 to 13.1 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 2.9 | 1.4 | 1.6 | 6.2 | 1.9 to 3.8 |
| share | Hillegass Avenue SB from College Avenue | % | 7.5 | 2.1 | 3.2 | 10.4 | 6.0 to 8.9 |
| headline share | Hillegass Avenue SB to freeway | % | 74.9 | 3.2 | 69.3 | 79.3 | 72.6 to 77.2 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 13.8 | 2.5 | 10.3 | 19.8 | 12.0 to 15.6 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 19.6 | 3.3 | 15.5 | 24.8 | 17.2 to 21.9 |
| share | Colby Street SB from Telegraph Avenue | % | 25.7 | 4.6 | 19.1 | 32.7 | 22.4 to 29.0 |
| headline share | Colby Street SB to freeway | % | 65.6 | 4.2 | 61.5 | 73.6 | 62.6 to 68.6 |
| share | Colby Street SB to Forest Street | % | 8.8 | 1.9 | 5.9 | 11.7 | 7.5 to 10.2 |
| ramp share | onto freeway via College Avenue | % | 13.8 | 1.8 | 11.2 | 16.4 | 12.6 to 15.1 |
| ramp share | onto freeway via Hillegass Avenue | % | 15.4 | 1.8 | 12.7 | 18.2 | 14.1 to 16.7 |
| ramp share | onto freeway via Martin Street | % | 16.4 | 2.0 | 13.3 | 19.2 | 14.9 to 17.9 |
| ramp share | onto freeway via Colby Street | % | 15.4 | 2.3 | 12.7 | 20.1 | 13.7 to 17.0 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 10.4 | 1.6 | 7.5 | 13.2 | 9.3 to 11.5 |
| ramp share | onto freeway via Benvenue Avenue | % | 3.4 | 0.5 | 2.7 | 4.2 | 3.1 to 3.8 |
| ramp share | from freeway via College Avenue | % | 5.7 | 0.8 | 4.4 | 6.9 | 5.1 to 6.2 |
| ramp share | from freeway via Martin Street | % | 16.9 | 1.6 | 14.5 | 19.9 | 15.8 to 18.1 |
| ramp share | from freeway via Colby Street | % | 12.3 | 1.9 | 10.1 | 15.1 | 11.0 to 13.7 |
| ramp share | from freeway via Hillegass Avenue | % | 7.8 | 0.7 | 6.1 | 8.8 | 7.3 to 8.4 |
| ramp share | from freeway via Benvenue Avenue | % | 2.2 | 0.4 | 1.4 | 2.8 | 2.0 to 2.5 |
| corridor flow | Telegraph N median link flow | veh/h | 622.08 | 32.44 | 556.80 | 662.40 | 598.87 to 645.29 |
| corridor flow | Telegraph S median link flow | veh/h | 591.60 | 77.97 | 435.60 | 668.40 | 535.82 to 647.38 |
| corridor flow | College N median link flow | veh/h | 167.52 | 14.55 | 141.60 | 186.00 | 157.12 to 177.92 |
| corridor flow | College S median link flow | veh/h | 291.72 | 21.39 | 253.20 | 330.00 | 276.42 to 307.02 |
| corridor flow | Claremont N median link flow | veh/h | 555.36 | 28.79 | 520.80 | 589.20 | 534.76 to 575.96 |
| corridor flow | Claremont S median link flow | veh/h | 451.44 | 33.10 | 404.40 | 508.80 | 427.76 to 475.12 |
| corridor flow | Alcatraz E median link flow | veh/h | 405.96 | 24.66 | 367.20 | 453.60 | 388.32 to 423.60 |
| corridor flow | Alcatraz W median link flow | veh/h | 297.12 | 22.08 | 271.20 | 332.40 | 281.33 to 312.91 |
| corridor flow | Hillegass N median link flow | veh/h | 65.64 | 6.30 | 54.00 | 74.40 | 61.13 to 70.15 |
| corridor flow | Hillegass S median link flow | veh/h | 93.72 | 14.73 | 76.80 | 123.60 | 83.18 to 104.26 |
| corridor flow | Colby N median link flow | veh/h | 79.92 | 12.96 | 60.00 | 103.20 | 70.65 to 89.19 |
| corridor flow | Colby S median link flow | veh/h | 100.56 | 16.74 | 87.60 | 145.20 | 88.59 to 112.53 |
| corridor flow | Martin E median link flow | veh/h | 123.96 | 11.58 | 103.20 | 141.60 | 115.68 to 132.24 |
| corridor flow | Martin W median link flow | veh/h | 144.60 | 18.74 | 122.40 | 175.20 | 131.20 to 158.00 |

Per-seed detail: `rockridge-midday-s1-seed1.md` (seed 1 in full).
