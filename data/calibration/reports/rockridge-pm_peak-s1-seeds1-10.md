# rockridge-pm_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Cars cleared from gridlock near the study area (judged zone) | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 7.94 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 1 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 4.80 | 2.25 | 0.00 | 7.00 | 3.19 to 6.41 |
| health | gridlock removals per hour | veh/h | 4.80 | 2.25 | 0.00 | 7.00 | 3.19 to 6.41 |
| health | entry backlog | % of spawned | 0.28 | 0.15 | 0.08 | 0.49 | 0.18 to 0.39 |
| health | backlog growth in the second half of the run | points of spawned | 0.14 | 0.11 | 0.01 | 0.30 | 0.07 to 0.22 |
| health | completed trips | trips | 27020.40 | 211.70 | 26790.00 | 27371.00 | 26868.97 to 27171.83 |
| health | arterial mean speed | m/s | 7.94 | 0.11 | 7.73 | 8.14 | 7.86 to 8.02 |
| health | arterial mean speed, last 15 min | m/s | 7.68 | 0.21 | 7.24 | 7.98 | 7.53 to 7.83 |
| junction recovery | courtesy admissions per hour | veh/h | 314.70 | 23.35 | 284.00 | 356.00 | 298.00 to 331.40 |
| junction recovery | yield fallback admissions per hour | veh/h | 173.00 | 15.78 | 154.00 | 201.00 | 161.72 to 184.28 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.10 | 0.32 | 0.00 | 1.00 | -0.13 to 0.33 |
| gridlock by place | cars cleared from gridlock per hour, judged (near the study area, and far ones whose chain reaches it) | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, near the study area | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, farther out | veh/h | 4.80 | 2.25 | 0.00 | 7.00 | 3.19 to 6.41 |
| gridlock by place | cars cleared from gridlock per hour, farther out with a chain into the judged zone | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | trips waiting at origins in the judged zone at the end | trips | 2.60 | 1.71 | 0.00 | 6.00 | 1.37 to 3.83 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 35.55 | 3.96 | 27.32 | 39.55 | 32.72 to 38.39 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 7.8 | 0.9 | 5.9 | 8.7 | 7.1 to 8.4 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 33.06 | 2.63 | 28.93 | 37.59 | 31.18 to 34.94 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 7.2 | 0.7 | 6.4 | 8.4 | 6.7 to 7.7 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 41.60 | 6.04 | 34.00 | 49.00 | 37.28 to 45.92 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1460.40 | 39.16 | 1409.00 | 1524.00 | 1432.39 to 1488.41 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 83.50 | 11.48 | 71.00 | 105.00 | 75.29 to 91.71 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1394.10 | 45.27 | 1326.00 | 1467.00 | 1361.72 to 1426.48 |
| headline share | Hillegass Avenue NB from freeway | % | 48.4 | 3.4 | 40.7 | 51.6 | 46.0 to 50.8 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 1.8 | 0.9 | 0.4 | 3.5 | 1.2 to 2.5 |
| share | Hillegass Avenue NB to College Avenue | % | 22.5 | 2.3 | 18.3 | 26.7 | 20.9 to 24.2 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 26.0 | 2.5 | 21.1 | 29.3 | 24.2 to 27.7 |
| headline share | Colby Street NB from freeway | % | 50.5 | 4.0 | 43.9 | 56.9 | 47.6 to 53.4 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 53.3 | 3.9 | 44.4 | 58.1 | 50.5 to 56.1 |
| share | Colby Street NB to Telegraph Avenue | % | 43.8 | 5.9 | 34.1 | 53.1 | 39.6 to 48.0 |
| share | Colby Street NB to College Avenue | % | 7.5 | 1.1 | 6.0 | 9.2 | 6.7 to 8.3 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 32.3 | 3.4 | 26.7 | 35.7 | 29.9 to 34.7 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 6.4 | 1.6 | 4.0 | 8.8 | 5.2 to 7.5 |
| share | Hillegass Avenue SB from College Avenue | % | 17.5 | 2.8 | 12.4 | 22.4 | 15.5 to 19.5 |
| headline share | Hillegass Avenue SB to freeway | % | 58.1 | 3.5 | 53.5 | 63.9 | 55.6 to 60.5 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 22.8 | 1.6 | 20.9 | 25.0 | 21.7 to 24.0 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 16.8 | 2.6 | 13.1 | 20.6 | 14.9 to 18.7 |
| share | Colby Street SB from Telegraph Avenue | % | 23.0 | 3.7 | 17.4 | 28.9 | 20.4 to 25.7 |
| headline share | Colby Street SB to freeway | % | 41.4 | 4.2 | 36.5 | 46.4 | 38.4 to 44.4 |
| share | Colby Street SB to Forest Street | % | 18.9 | 4.4 | 12.1 | 25.4 | 15.8 to 22.0 |
| ramp share | onto freeway via College Avenue | % | 14.3 | 1.1 | 11.6 | 15.7 | 13.5 to 15.1 |
| ramp share | onto freeway via Hillegass Avenue | % | 17.9 | 1.9 | 14.0 | 19.9 | 16.5 to 19.2 |
| ramp share | onto freeway via Martin Street | % | 12.5 | 1.7 | 9.4 | 14.5 | 11.3 to 13.8 |
| ramp share | onto freeway via Colby Street | % | 15.4 | 1.3 | 13.2 | 17.4 | 14.4 to 16.3 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 13.7 | 0.8 | 12.6 | 15.3 | 13.2 to 14.3 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.6 | 0.6 | 3.9 | 5.6 | 4.2 to 5.0 |
| ramp share | from freeway via College Avenue | % | 9.6 | 1.3 | 7.7 | 12.0 | 8.6 to 10.5 |
| ramp share | from freeway via Martin Street | % | 12.8 | 1.2 | 11.2 | 15.4 | 11.9 to 13.7 |
| ramp share | from freeway via Colby Street | % | 12.8 | 1.7 | 10.8 | 15.9 | 11.7 to 14.0 |
| ramp share | from freeway via Hillegass Avenue | % | 9.2 | 1.5 | 7.3 | 11.8 | 8.1 to 10.2 |
| ramp share | from freeway via Benvenue Avenue | % | 3.0 | 0.7 | 2.3 | 4.3 | 2.6 to 3.5 |
| corridor flow | Telegraph N median link flow | veh/h | 1275.48 | 58.28 | 1160.40 | 1353.60 | 1233.79 to 1317.17 |
| corridor flow | Telegraph S median link flow | veh/h | 1024.56 | 42.39 | 944.40 | 1083.60 | 994.24 to 1054.88 |
| corridor flow | College N median link flow | veh/h | 352.80 | 41.65 | 295.20 | 423.60 | 323.00 to 382.60 |
| corridor flow | College S median link flow | veh/h | 614.64 | 48.56 | 535.20 | 670.80 | 579.91 to 649.37 |
| corridor flow | Claremont N median link flow | veh/h | 502.32 | 37.54 | 448.80 | 584.40 | 475.47 to 529.17 |
| corridor flow | Claremont S median link flow | veh/h | 338.28 | 34.86 | 301.20 | 398.40 | 313.34 to 363.22 |
| corridor flow | Alcatraz E median link flow | veh/h | 486.48 | 37.14 | 441.60 | 547.20 | 459.91 to 513.05 |
| corridor flow | Alcatraz W median link flow | veh/h | 294.96 | 23.56 | 247.20 | 318.00 | 278.11 to 311.81 |
| corridor flow | Hillegass N median link flow | veh/h | 121.68 | 13.38 | 102.00 | 145.20 | 112.11 to 131.25 |
| corridor flow | Hillegass S median link flow | veh/h | 152.40 | 17.45 | 121.20 | 177.60 | 139.92 to 164.88 |
| corridor flow | Colby N median link flow | veh/h | 128.16 | 11.53 | 109.20 | 148.80 | 119.91 to 136.41 |
| corridor flow | Colby S median link flow | veh/h | 141.00 | 16.44 | 112.80 | 166.80 | 129.24 to 152.76 |
| corridor flow | Martin E median link flow | veh/h | 132.72 | 19.23 | 104.40 | 153.60 | 118.97 to 146.47 |
| corridor flow | Martin W median link flow | veh/h | 142.92 | 13.57 | 122.40 | 165.60 | 133.21 to 152.63 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 123 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 57 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 28 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 9 | within |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 23 | above |
| Intents listed, together | | 101 (71 to 131) | 116 | |
| Other through cars (no intent listed) | | | 6 | |

Model through cars by origin and destination group (largest 12 of 37 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 56.8 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 14.9 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 8.1 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 6.6 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 5.6 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 5.1 | SR-24 then Claremont Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 4.8 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 2.6 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.4 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.4 | Telegraph Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 1.9 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 1.6 | Claremont Avenue |
| other pairs | | 9.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 98 veh/h; Claremont Avenue 9 veh/h; none near the study area 6 veh/h; SR-24 then Claremont Avenue then College Avenue 5 veh/h; College Avenue 2 veh/h; College Avenue then Alcatraz Avenue 1 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 87 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 24 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 34 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 7 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 14 | above |
| Intents listed, together | | 43 (20 to 68) | 78 | |
| Other through cars (no intent listed) | | | 9 | |

Model through cars by origin and destination group (largest 12 of 44 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 20.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 17.9 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 6.9 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.2 | SR-24 then Claremont Avenue |
| College Ave from the north (Berkeley) | Shattuck Ave from the north (Berkeley) | 5.0 | College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.7 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 3.1 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 2.1 | none near the study area |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.9 | SR-24 then Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.5 | Claremont Avenue |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 1.3 | College Avenue then Alcatraz Avenue |
| other pairs | | 13.3 | |

By the arterial these cars would otherwise use: Telegraph Avenue 29 veh/h; SR-24 21 veh/h; SR-24 then Claremont Avenue then College Avenue 7 veh/h; SR-24 then Claremont Avenue 6 veh/h; College Avenue then Alcatraz Avenue 6 veh/h; College Avenue 5 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 136 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 43 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 53 | within |
| Intents listed, together | | 87 (78 to 110) | 96 | |
| Other through cars (no intent listed) | | | 40 | |

Model through cars by origin and destination group (largest 12 of 40 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 41.6 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 25.3 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 24.2 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 15.8 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.4 | College Avenue then Claremont Avenue then SR-24 |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | College Ave from the north (Berkeley) | 5.0 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 2.8 | Telegraph Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.1 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 1.7 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.1 | Claremont Avenue |
| Shattuck Ave from the north (Berkeley) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.7 | College Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 0.7 | Telegraph Avenue |
| other pairs | | 5.2 | |

By the arterial these cars would otherwise use: Telegraph Avenue 96 veh/h; Claremont Avenue then SR-24 18 veh/h; College Avenue then Claremont Avenue then SR-24 9 veh/h; College Avenue 6 veh/h; none near the study area 2 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 127 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 20 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 21 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 29 | within |
| Intents listed, together | | 46 (39 to 72) | 70 | |
| Other through cars (no intent listed) | | | 57 | |

Model through cars by origin and destination group (largest 12 of 48 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 26.3 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 16.5 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.7 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.4 | Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.4 | none near the study area |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | College Ave from the north (Berkeley) | 6.0 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 5.5 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.0 | College Avenue then Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 3.6 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 3.2 | none near the study area |
| Emeryville and West Oakland streets (55th to 67th Streets) | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.8 | none near the study area |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.5 | SR-24 |
| other pairs | | 22.8 | |

By the arterial these cars would otherwise use: Telegraph Avenue 69 veh/h; none near the study area 18 veh/h; Claremont Avenue then SR-24 10 veh/h; SR-24 8 veh/h; College Avenue 7 veh/h; College Avenue then Claremont Avenue then SR-24 5 veh/h.

### Study area, all residential and service streets

Model: 729 through cars per hour.

Model through cars by origin and destination group (largest 12 of 110 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 87.3 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 69.1 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 67.8 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 53.4 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 49.8 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 25.5 | Claremont Avenue then College Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 23.7 | Claremont Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 23.0 | Claremont Avenue then SR-24 |
| Emeryville and West Oakland streets (55th to 67th Streets) | SR-24 westbound on-ramps (toward Oakland and I-980) | 20.7 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 20.1 | SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 19.6 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 19.6 | Telegraph Avenue |
| other pairs | | 249.8 | |

By the arterial these cars would otherwise use: Telegraph Avenue 421 veh/h; none near the study area 77 veh/h; Claremont Avenue 75 veh/h; SR-24 30 veh/h; Claremont Avenue then College Avenue 26 veh/h; Claremont Avenue then SR-24 25 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 179; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 125; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 113; Telegraph Ave from the north (Berkeley) 78; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 30; San Pablo Ave (Emeryville and West Oakland) 30; Claremont Ave and Tunnel Rd toward the hills 27; Emeryville and West Oakland streets (55th to 67th Streets) 27; Telegraph Ave to the south (downtown Oakland) 26; College Ave from the north (Berkeley) 26.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 225; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 113; Telegraph Ave from the north (Berkeley) 110; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 85; Claremont Ave and Tunnel Rd toward the hills 71; Telegraph Ave to the south (downtown Oakland) 29; College Ave from the north (Berkeley) 27; Shattuck Ave from the north (Berkeley) 22; SR-24 eastbound on-ramps (toward the Caldecott Tunnel) 8; Ashby Ave from the west (Emeryville and I-80) 8.


Per-seed detail: `rockridge-pm_peak-s1-seed1.md` (seed 1 in full).
