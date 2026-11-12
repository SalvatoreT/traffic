# rockridge-midday-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.95 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.00 | 0.00 | 0.00 | 0.01 | 0.00 to 0.01 |
| health | backlog growth in the second half of the run | points of spawned | 0.00 | 0.01 | -0.01 | 0.01 | -0.00 to 0.01 |
| health | completed trips | trips | 14862.10 | 90.92 | 14718.00 | 15000.00 | 14797.07 to 14927.13 |
| health | arterial mean speed | m/s | 9.95 | 0.07 | 9.89 | 10.07 | 9.90 to 10.00 |
| health | arterial mean speed, last 15 min | m/s | 9.99 | 0.11 | 9.74 | 10.14 | 9.92 to 10.07 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 8.84 | 2.01 | 5.42 | 11.24 | 7.41 to 10.28 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 4.1 | 0.9 | 2.7 | 5.2 | 3.5 to 4.7 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 4.60 | 1.74 | 2.47 | 8.50 | 3.35 to 5.85 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 2.2 | 0.8 | 1.1 | 3.9 | 1.6 to 2.7 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 18.50 | 4.03 | 14.00 | 25.00 | 15.61 to 21.39 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 804.10 | 22.37 | 765.00 | 835.00 | 788.10 to 820.10 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 49.30 | 7.21 | 39.00 | 64.00 | 44.14 to 54.46 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 919.20 | 36.34 | 874.00 | 973.00 | 893.21 to 945.19 |
| headline share | Hillegass Avenue NB from freeway | % | 70.3 | 4.4 | 63.1 | 76.1 | 67.2 to 73.5 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 3.1 | 2.6 | 0.0 | 7.4 | 1.3 to 5.0 |
| share | Hillegass Avenue NB to College Avenue | % | 2.4 | 1.9 | 0.0 | 5.9 | 1.0 to 3.8 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 26.5 | 5.1 | 21.1 | 36.2 | 22.9 to 30.1 |
| headline share | Colby Street NB from freeway | % | 38.1 | 7.2 | 27.5 | 46.0 | 32.9 to 43.2 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 13.6 | 3.4 | 7.8 | 18.0 | 11.1 to 16.0 |
| share | Colby Street NB to Telegraph Avenue | % | 22.4 | 5.5 | 16.4 | 34.0 | 18.5 to 26.3 |
| share | Colby Street NB to College Avenue | % | 7.6 | 4.1 | 1.9 | 14.9 | 4.6 to 10.5 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 20.1 | 2.7 | 16.7 | 24.0 | 18.2 to 22.0 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 9.9 | 3.2 | 4.2 | 15.5 | 7.7 to 12.2 |
| share | Hillegass Avenue SB from College Avenue | % | 21.8 | 2.4 | 18.0 | 25.5 | 20.1 to 23.5 |
| headline share | Hillegass Avenue SB to freeway | % | 59.9 | 4.0 | 54.8 | 67.5 | 57.0 to 62.7 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 13.2 | 4.4 | 7.5 | 20.8 | 10.0 to 16.4 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 33.1 | 3.7 | 28.3 | 38.7 | 30.5 to 35.8 |
| share | Colby Street SB from Telegraph Avenue | % | 33.7 | 5.0 | 24.7 | 39.5 | 30.1 to 37.3 |
| headline share | Colby Street SB to freeway | % | 30.7 | 3.6 | 26.0 | 38.1 | 28.1 to 33.3 |
| share | Colby Street SB to Forest Street | % | 47.6 | 7.3 | 40.7 | 63.2 | 42.4 to 52.8 |
| ramp share | onto freeway via College Avenue | % | 11.5 | 2.0 | 8.0 | 15.9 | 10.1 to 13.0 |
| ramp share | onto freeway via Hillegass Avenue | % | 14.0 | 1.7 | 11.9 | 18.5 | 12.7 to 15.2 |
| ramp share | onto freeway via Martin Street | % | 20.0 | 2.0 | 16.7 | 23.4 | 18.6 to 21.5 |
| ramp share | onto freeway via Colby Street | % | 9.0 | 1.3 | 7.2 | 10.8 | 8.1 to 10.0 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 15.4 | 2.1 | 12.4 | 18.4 | 13.9 to 16.9 |
| ramp share | onto freeway via Benvenue Avenue | % | 5.2 | 0.9 | 3.6 | 6.7 | 4.5 to 5.8 |
| ramp share | from freeway via College Avenue | % | 8.3 | 1.2 | 5.8 | 10.1 | 7.4 to 9.2 |
| ramp share | from freeway via Martin Street | % | 16.1 | 1.0 | 14.5 | 17.5 | 15.3 to 16.8 |
| ramp share | from freeway via Colby Street | % | 9.1 | 0.8 | 8.0 | 10.4 | 8.6 to 9.6 |
| ramp share | from freeway via Hillegass Avenue | % | 6.7 | 0.9 | 5.3 | 8.3 | 6.1 to 7.3 |
| ramp share | from freeway via Benvenue Avenue | % | 2.8 | 0.5 | 2.3 | 4.0 | 2.4 to 3.2 |
| corridor flow | Telegraph N median link flow | veh/h | 585.60 | 35.44 | 529.20 | 650.40 | 560.25 to 610.95 |
| corridor flow | Telegraph S median link flow | veh/h | 713.52 | 56.33 | 646.80 | 777.60 | 673.23 to 753.81 |
| corridor flow | College N median link flow | veh/h | 171.84 | 12.95 | 147.60 | 190.80 | 162.58 to 181.10 |
| corridor flow | College S median link flow | veh/h | 229.80 | 22.29 | 207.60 | 262.80 | 213.85 to 245.75 |
| corridor flow | Claremont N median link flow | veh/h | 470.40 | 25.96 | 429.60 | 507.60 | 451.83 to 488.97 |
| corridor flow | Claremont S median link flow | veh/h | 358.20 | 16.23 | 334.80 | 381.60 | 346.59 to 369.81 |
| corridor flow | Alcatraz E median link flow | veh/h | 355.08 | 17.06 | 320.40 | 373.20 | 342.88 to 367.28 |
| corridor flow | Alcatraz W median link flow | veh/h | 339.60 | 26.38 | 295.20 | 376.80 | 320.73 to 358.47 |
| corridor flow | Hillegass N median link flow | veh/h | 45.12 | 5.10 | 36.00 | 50.40 | 41.47 to 48.77 |
| corridor flow | Hillegass S median link flow | veh/h | 84.84 | 8.78 | 74.40 | 104.40 | 78.56 to 91.12 |
| corridor flow | Colby N median link flow | veh/h | 15.00 | 3.21 | 10.80 | 20.40 | 12.70 to 17.30 |
| corridor flow | Colby S median link flow | veh/h | 60.36 | 8.12 | 49.20 | 72.00 | 54.55 to 66.17 |
| corridor flow | Martin E median link flow | veh/h | 128.76 | 15.25 | 105.60 | 158.40 | 117.85 to 139.67 |
| corridor flow | Martin W median link flow | veh/h | 119.52 | 9.47 | 104.40 | 133.20 | 112.75 to 126.29 |

Per-seed detail: `rockridge-midday-s1-seed1.md` (seed 1 in full).
