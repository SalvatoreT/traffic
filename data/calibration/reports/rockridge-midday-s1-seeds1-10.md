# rockridge-midday-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.90 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.01 | 0.01 | 0.00 | 0.02 | 0.00 to 0.01 |
| health | backlog growth in the second half of the run | points of spawned | 0.00 | 0.01 | -0.01 | 0.02 | -0.00 to 0.01 |
| health | completed trips | trips | 16150.60 | 116.92 | 15874.00 | 16334.00 | 16066.97 to 16234.23 |
| health | arterial mean speed | m/s | 9.90 | 0.04 | 9.83 | 9.96 | 9.87 to 9.93 |
| health | arterial mean speed, last 15 min | m/s | 9.93 | 0.14 | 9.74 | 10.10 | 9.83 to 10.03 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 4.19 | 1.37 | 2.46 | 6.30 | 3.21 to 5.18 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 1.6 | 0.5 | 1.0 | 2.4 | 1.3 to 2.0 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 7.96 | 1.47 | 5.99 | 9.69 | 6.91 to 9.02 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 3.1 | 0.6 | 2.5 | 3.9 | 2.7 to 3.5 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 6.00 | 2.00 | 4.00 | 9.00 | 4.57 to 7.43 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 914.00 | 44.90 | 856.00 | 979.00 | 881.88 to 946.12 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 14.20 | 3.22 | 9.00 | 20.00 | 11.89 to 16.51 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 867.20 | 36.96 | 782.00 | 912.00 | 840.76 to 893.64 |
| headline share | Hillegass Avenue NB from freeway | % | 58.4 | 3.5 | 54.5 | 64.3 | 55.9 to 60.9 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 1.8 | 1.1 | 0.0 | 4.0 | 1.0 to 2.6 |
| share | Hillegass Avenue NB to College Avenue | % | 5.0 | 2.6 | 1.0 | 9.6 | 3.2 to 6.9 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 30.3 | 3.3 | 23.9 | 33.7 | 27.9 to 32.7 |
| headline share | Colby Street NB from freeway | % | 64.7 | 3.4 | 59.7 | 68.7 | 62.3 to 67.1 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 10.2 | 1.7 | 7.6 | 13.4 | 9.0 to 11.5 |
| share | Colby Street NB to Telegraph Avenue | % | 23.5 | 4.9 | 17.5 | 30.6 | 20.0 to 27.1 |
| share | Colby Street NB to College Avenue | % | 1.3 | 1.0 | 0.0 | 2.7 | 0.6 to 2.0 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 8.0 | 2.4 | 5.0 | 11.1 | 6.3 to 9.6 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 1.1 | 0.9 | 0.0 | 2.6 | 0.4 to 1.8 |
| share | Hillegass Avenue SB from College Avenue | % | 1.5 | 1.0 | 0.0 | 2.7 | 0.8 to 2.3 |
| headline share | Hillegass Avenue SB to freeway | % | 58.3 | 3.6 | 52.1 | 63.7 | 55.7 to 60.8 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 19.0 | 3.7 | 13.6 | 24.8 | 16.3 to 21.6 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 13.2 | 2.5 | 8.7 | 17.6 | 11.4 to 14.9 |
| share | Colby Street SB from Telegraph Avenue | % | 17.6 | 5.2 | 11.6 | 25.8 | 13.9 to 21.3 |
| headline share | Colby Street SB to freeway | % | 52.0 | 5.1 | 44.0 | 60.5 | 48.4 to 55.6 |
| share | Colby Street SB to Forest Street | % | 10.0 | 2.5 | 5.5 | 13.3 | 8.2 to 11.8 |
| ramp share | onto freeway via College Avenue | % | 24.0 | 2.5 | 19.2 | 26.6 | 22.2 to 25.7 |
| ramp share | onto freeway via Hillegass Avenue | % | 18.6 | 2.8 | 13.4 | 22.4 | 16.6 to 20.6 |
| ramp share | onto freeway via Martin Street | % | 21.9 | 3.0 | 19.4 | 29.5 | 19.7 to 24.0 |
| ramp share | onto freeway via Colby Street | % | 20.7 | 3.3 | 15.6 | 26.6 | 18.3 to 23.0 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 8.1 | 1.2 | 6.5 | 10.5 | 7.3 to 9.0 |
| ramp share | onto freeway via Benvenue Avenue | % | 3.4 | 0.7 | 1.9 | 4.2 | 2.9 to 3.9 |
| ramp share | from freeway via College Avenue | % | 6.6 | 0.8 | 5.2 | 7.7 | 6.0 to 7.2 |
| ramp share | from freeway via Martin Street | % | 13.1 | 1.6 | 10.3 | 16.0 | 12.0 to 14.3 |
| ramp share | from freeway via Colby Street | % | 18.1 | 1.7 | 15.8 | 20.8 | 16.9 to 19.3 |
| ramp share | from freeway via Hillegass Avenue | % | 9.2 | 1.3 | 7.0 | 11.0 | 8.2 to 10.1 |
| ramp share | from freeway via Benvenue Avenue | % | 2.4 | 0.5 | 1.5 | 3.4 | 2.0 to 2.8 |
| corridor flow | Telegraph N median link flow | veh/h | 541.68 | 34.37 | 504.00 | 612.00 | 517.10 to 566.26 |
| corridor flow | Telegraph S median link flow | veh/h | 410.88 | 32.58 | 373.20 | 481.20 | 387.58 to 434.18 |
| corridor flow | College N median link flow | veh/h | 214.44 | 17.40 | 187.20 | 250.80 | 201.99 to 226.89 |
| corridor flow | College S median link flow | veh/h | 447.48 | 17.73 | 417.60 | 480.00 | 434.80 to 460.16 |
| corridor flow | Claremont N median link flow | veh/h | 314.76 | 25.27 | 267.60 | 356.40 | 296.69 to 332.83 |
| corridor flow | Claremont S median link flow | veh/h | 244.68 | 24.45 | 183.60 | 270.00 | 227.19 to 262.17 |
| corridor flow | Alcatraz E median link flow | veh/h | 372.84 | 18.61 | 337.20 | 400.80 | 359.53 to 386.15 |
| corridor flow | Alcatraz W median link flow | veh/h | 245.88 | 16.87 | 218.40 | 276.00 | 233.81 to 257.95 |
| corridor flow | Hillegass N median link flow | veh/h | 61.80 | 7.42 | 51.60 | 75.60 | 56.49 to 67.11 |
| corridor flow | Hillegass S median link flow | veh/h | 75.36 | 11.02 | 54.00 | 90.00 | 67.47 to 83.25 |
| corridor flow | Colby N median link flow | veh/h | 79.80 | 10.26 | 61.20 | 91.20 | 72.46 to 87.14 |
| corridor flow | Colby S median link flow | veh/h | 75.36 | 11.35 | 56.40 | 90.00 | 67.24 to 83.48 |
| corridor flow | Martin E median link flow | veh/h | 92.88 | 11.36 | 78.00 | 108.00 | 84.75 to 101.01 |
| corridor flow | Martin W median link flow | veh/h | 97.80 | 8.47 | 85.20 | 111.60 | 91.74 to 103.86 |

Per-seed detail: `rockridge-midday-s1-seed1.md` (seed 1 in full).
