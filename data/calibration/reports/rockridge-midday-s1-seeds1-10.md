# rockridge-midday-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.10 (min 0.00, max 1.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.87 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 9 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.10 | 0.32 | 0.00 | 1.00 | -0.13 to 0.33 |
| health | gridlock removals per hour | veh/h | 0.10 | 0.32 | 0.00 | 1.00 | -0.13 to 0.33 |
| health | entry backlog | % of spawned | 0.01 | 0.01 | 0.00 | 0.03 | -0.00 to 0.01 |
| health | backlog growth in the second half of the run | points of spawned | -0.00 | 0.02 | -0.04 | 0.02 | -0.01 to 0.01 |
| health | completed trips | trips | 15433.90 | 145.17 | 15257.00 | 15691.00 | 15330.06 to 15537.74 |
| health | arterial mean speed | m/s | 9.87 | 0.09 | 9.72 | 10.00 | 9.80 to 9.93 |
| health | arterial mean speed, last 15 min | m/s | 9.93 | 0.16 | 9.65 | 10.19 | 9.81 to 10.04 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 7.57 | 2.11 | 4.32 | 11.78 | 6.06 to 9.08 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 2.5 | 0.6 | 1.5 | 3.6 | 2.1 to 2.9 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 14.70 | 3.26 | 11.07 | 20.25 | 12.37 to 17.03 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 4.9 | 1.0 | 3.6 | 6.2 | 4.2 to 5.6 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 8.00 | 3.06 | 4.00 | 13.00 | 5.81 to 10.19 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 851.60 | 32.15 | 810.00 | 915.00 | 828.60 to 874.60 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 12.10 | 3.96 | 3.00 | 16.00 | 9.27 to 14.93 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 844.40 | 32.37 | 811.00 | 925.00 | 821.25 to 867.55 |
| headline share | Hillegass Avenue NB from freeway | % | 74.6 | 2.9 | 70.5 | 79.0 | 72.5 to 76.7 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 1.2 | 1.1 | 0.0 | 3.6 | 0.5 to 2.0 |
| share | Hillegass Avenue NB to College Avenue | % | 3.8 | 2.8 | 1.1 | 9.6 | 1.8 to 5.8 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 24.4 | 3.6 | 19.0 | 29.1 | 21.8 to 27.0 |
| headline share | Colby Street NB from freeway | % | 80.3 | 2.2 | 76.4 | 84.7 | 78.7 to 81.9 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 7.4 | 2.6 | 4.5 | 13.0 | 5.5 to 9.3 |
| share | Colby Street NB to Telegraph Avenue | % | 17.9 | 2.1 | 14.8 | 21.9 | 16.4 to 19.4 |
| share | Colby Street NB to College Avenue | % | 0.8 | 0.5 | 0.0 | 1.6 | 0.4 to 1.2 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 9.8 | 2.7 | 5.8 | 15.0 | 7.9 to 11.8 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 3.5 | 1.7 | 0.8 | 7.0 | 2.3 to 4.7 |
| share | Hillegass Avenue SB from College Avenue | % | 8.6 | 2.5 | 5.9 | 13.2 | 6.8 to 10.4 |
| headline share | Hillegass Avenue SB to freeway | % | 68.8 | 5.3 | 62.0 | 80.5 | 65.0 to 72.5 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 11.8 | 3.3 | 8.4 | 17.3 | 9.4 to 14.1 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 26.3 | 2.8 | 22.7 | 31.0 | 24.3 to 28.2 |
| share | Colby Street SB from Telegraph Avenue | % | 22.0 | 4.3 | 16.2 | 28.6 | 19.0 to 25.1 |
| headline share | Colby Street SB to freeway | % | 64.9 | 4.0 | 58.6 | 70.4 | 62.0 to 67.7 |
| share | Colby Street SB to Forest Street | % | 11.7 | 3.7 | 7.8 | 20.1 | 9.0 to 14.3 |
| ramp share | onto freeway via College Avenue | % | 14.4 | 1.9 | 11.7 | 17.2 | 13.0 to 15.7 |
| ramp share | onto freeway via Hillegass Avenue | % | 12.4 | 1.9 | 9.2 | 14.5 | 11.1 to 13.8 |
| ramp share | onto freeway via Martin Street | % | 17.4 | 2.4 | 13.2 | 22.0 | 15.6 to 19.1 |
| ramp share | onto freeway via Colby Street | % | 14.8 | 2.0 | 11.2 | 17.3 | 13.4 to 16.2 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 8.9 | 1.0 | 7.6 | 10.2 | 8.2 to 9.6 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.1 | 0.7 | 3.0 | 5.2 | 3.5 to 4.6 |
| ramp share | from freeway via College Avenue | % | 4.8 | 1.0 | 3.6 | 7.0 | 4.0 to 5.5 |
| ramp share | from freeway via Martin Street | % | 18.4 | 2.0 | 15.4 | 21.2 | 17.0 to 19.9 |
| ramp share | from freeway via Colby Street | % | 11.4 | 0.9 | 10.3 | 12.9 | 10.7 to 12.0 |
| ramp share | from freeway via Hillegass Avenue | % | 7.4 | 0.9 | 6.1 | 8.7 | 6.8 to 8.0 |
| ramp share | from freeway via Benvenue Avenue | % | 1.0 | 0.3 | 0.3 | 1.6 | 0.8 to 1.3 |
| corridor flow | Telegraph N median link flow | veh/h | 691.80 | 24.29 | 630.00 | 723.60 | 674.43 to 709.17 |
| corridor flow | Telegraph S median link flow | veh/h | 677.76 | 60.59 | 592.80 | 757.20 | 634.42 to 721.10 |
| corridor flow | College N median link flow | veh/h | 138.72 | 18.54 | 105.60 | 165.60 | 125.46 to 151.98 |
| corridor flow | College S median link flow | veh/h | 335.28 | 23.08 | 294.00 | 375.60 | 318.77 to 351.79 |
| corridor flow | Claremont N median link flow | veh/h | 396.12 | 27.26 | 363.60 | 439.20 | 376.62 to 415.62 |
| corridor flow | Claremont S median link flow | veh/h | 467.04 | 28.32 | 423.60 | 529.20 | 446.78 to 487.30 |
| corridor flow | Alcatraz E median link flow | veh/h | 343.32 | 30.61 | 288.00 | 384.00 | 321.42 to 365.22 |
| corridor flow | Alcatraz W median link flow | veh/h | 273.60 | 25.42 | 213.60 | 308.40 | 255.41 to 291.79 |
| corridor flow | Hillegass N median link flow | veh/h | 67.20 | 10.21 | 48.00 | 81.60 | 59.89 to 74.51 |
| corridor flow | Hillegass S median link flow | veh/h | 78.00 | 12.57 | 56.40 | 102.00 | 69.01 to 86.99 |
| corridor flow | Colby N median link flow | veh/h | 83.04 | 6.99 | 72.00 | 93.60 | 78.04 to 88.04 |
| corridor flow | Colby S median link flow | veh/h | 93.72 | 14.60 | 76.80 | 120.00 | 83.27 to 104.17 |
| corridor flow | Martin E median link flow | veh/h | 120.36 | 14.83 | 100.80 | 147.60 | 109.75 to 130.97 |
| corridor flow | Martin W median link flow | veh/h | 172.32 | 16.42 | 150.00 | 202.80 | 160.58 to 184.06 |

Per-seed detail: `rockridge-midday-s1-seed1.md` (seed 1 in full).
