# rockridge-am_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.29 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.03 | 0.04 | 0.00 | 0.13 | -0.00 to 0.06 |
| health | backlog growth in the second half of the run | points of spawned | 0.01 | 0.04 | -0.02 | 0.09 | -0.01 to 0.04 |
| health | completed trips | trips | 22623.00 | 159.33 | 22379.00 | 22930.00 | 22509.03 to 22736.97 |
| health | arterial mean speed | m/s | 9.29 | 0.09 | 9.13 | 9.42 | 9.22 to 9.36 |
| health | arterial mean speed, last 15 min | m/s | 9.32 | 0.14 | 9.09 | 9.48 | 9.22 to 9.42 |
| junction recovery | courtesy admissions per hour | veh/h | 126.30 | 21.06 | 90.00 | 165.00 | 111.24 to 141.36 |
| junction recovery | yield fallback admissions per hour | veh/h | 41.10 | 6.42 | 31.00 | 49.00 | 36.51 to 45.69 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 21.20 | 2.95 | 16.43 | 25.78 | 19.09 to 23.31 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 5.8 | 0.8 | 4.6 | 7.0 | 5.3 to 6.4 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 21.30 | 2.98 | 17.93 | 27.17 | 19.17 to 23.43 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 5.9 | 0.8 | 4.9 | 7.4 | 5.3 to 6.4 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 34.80 | 4.52 | 29.00 | 42.00 | 31.57 to 38.03 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1013.10 | 19.76 | 975.00 | 1048.00 | 998.96 to 1027.24 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 28.30 | 6.83 | 18.00 | 38.00 | 23.41 to 33.19 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1269.40 | 34.52 | 1224.00 | 1350.00 | 1244.71 to 1294.09 |
| headline share | Hillegass Avenue NB from freeway | % | 51.4 | 2.8 | 47.4 | 57.0 | 49.4 to 53.4 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 7.9 | 1.6 | 5.5 | 10.4 | 6.8 to 9.0 |
| share | Hillegass Avenue NB to College Avenue | % | 11.6 | 3.5 | 6.9 | 17.5 | 9.2 to 14.1 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 31.5 | 3.4 | 25.7 | 37.2 | 29.1 to 33.9 |
| headline share | Colby Street NB from freeway | % | 42.3 | 2.9 | 38.2 | 46.2 | 40.2 to 44.3 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 46.3 | 5.7 | 36.0 | 58.4 | 42.2 to 50.4 |
| share | Colby Street NB to Telegraph Avenue | % | 42.1 | 5.2 | 30.5 | 50.0 | 38.4 to 45.9 |
| share | Colby Street NB to College Avenue | % | 2.5 | 1.4 | 1.1 | 4.6 | 1.5 to 3.5 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 16.0 | 3.6 | 8.3 | 21.5 | 13.4 to 18.6 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 1.6 | 1.1 | 0.0 | 3.6 | 0.8 to 2.4 |
| share | Hillegass Avenue SB from College Avenue | % | 11.0 | 2.8 | 5.5 | 14.5 | 9.0 to 13.1 |
| headline share | Hillegass Avenue SB to freeway | % | 57.6 | 3.6 | 53.9 | 62.7 | 55.0 to 60.1 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 20.8 | 2.4 | 17.3 | 25.8 | 19.1 to 22.5 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 7.3 | 1.2 | 5.4 | 9.5 | 6.4 to 8.2 |
| share | Colby Street SB from Telegraph Avenue | % | 19.3 | 2.8 | 12.1 | 22.2 | 17.3 to 21.3 |
| headline share | Colby Street SB to freeway | % | 44.6 | 3.7 | 38.6 | 49.8 | 42.0 to 47.3 |
| share | Colby Street SB to Forest Street | % | 16.2 | 5.3 | 11.9 | 30.3 | 12.4 to 20.0 |
| ramp share | onto freeway via College Avenue | % | 15.5 | 1.1 | 13.7 | 17.4 | 14.8 to 16.3 |
| ramp share | onto freeway via Hillegass Avenue | % | 13.1 | 1.7 | 10.5 | 16.2 | 11.9 to 14.3 |
| ramp share | onto freeway via Martin Street | % | 13.5 | 0.8 | 12.1 | 14.4 | 12.9 to 14.1 |
| ramp share | onto freeway via Colby Street | % | 14.2 | 1.0 | 13.0 | 15.7 | 13.5 to 14.9 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 8.1 | 0.9 | 6.8 | 9.6 | 7.4 to 8.8 |
| ramp share | onto freeway via Benvenue Avenue | % | 3.7 | 0.8 | 2.7 | 5.3 | 3.2 to 4.3 |
| ramp share | from freeway via College Avenue | % | 9.6 | 1.3 | 8.1 | 12.1 | 8.7 to 10.6 |
| ramp share | from freeway via Martin Street | % | 11.2 | 0.7 | 9.8 | 12.5 | 10.7 to 11.8 |
| ramp share | from freeway via Colby Street | % | 9.8 | 1.2 | 7.9 | 11.6 | 9.0 to 10.7 |
| ramp share | from freeway via Hillegass Avenue | % | 8.3 | 0.6 | 7.2 | 9.1 | 7.9 to 8.8 |
| ramp share | from freeway via Benvenue Avenue | % | 2.2 | 0.6 | 1.4 | 3.1 | 1.8 to 2.6 |
| corridor flow | Telegraph N median link flow | veh/h | 806.16 | 25.28 | 765.60 | 846.00 | 788.07 to 824.25 |
| corridor flow | Telegraph S median link flow | veh/h | 859.80 | 24.87 | 829.20 | 902.40 | 842.01 to 877.59 |
| corridor flow | College N median link flow | veh/h | 249.60 | 26.22 | 214.80 | 291.60 | 230.84 to 268.36 |
| corridor flow | College S median link flow | veh/h | 449.52 | 24.25 | 414.00 | 490.80 | 432.18 to 466.86 |
| corridor flow | Claremont N median link flow | veh/h | 301.32 | 10.96 | 283.20 | 318.00 | 293.48 to 309.16 |
| corridor flow | Claremont S median link flow | veh/h | 403.80 | 26.06 | 374.40 | 451.20 | 385.16 to 422.44 |
| corridor flow | Alcatraz E median link flow | veh/h | 431.88 | 37.97 | 374.40 | 488.40 | 404.72 to 459.04 |
| corridor flow | Alcatraz W median link flow | veh/h | 355.68 | 12.45 | 337.20 | 379.20 | 346.78 to 364.58 |
| corridor flow | Hillegass N median link flow | veh/h | 97.92 | 8.38 | 86.40 | 111.60 | 91.93 to 103.91 |
| corridor flow | Hillegass S median link flow | veh/h | 78.96 | 12.75 | 61.20 | 106.80 | 69.84 to 88.08 |
| corridor flow | Colby N median link flow | veh/h | 109.44 | 8.58 | 98.40 | 128.40 | 103.31 to 115.57 |
| corridor flow | Colby S median link flow | veh/h | 134.04 | 12.13 | 117.60 | 152.40 | 125.36 to 142.72 |
| corridor flow | Martin E median link flow | veh/h | 111.72 | 6.29 | 99.60 | 118.80 | 107.22 to 116.22 |
| corridor flow | Martin W median link flow | veh/h | 101.76 | 8.89 | 87.60 | 112.80 | 95.40 to 108.12 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 36 | below |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 21 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 3 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 30 | above |
| Intents listed, together | | 101 (71 to 131) | 90 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 32 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 36.1 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 27.8 | College Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 10.9 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 2.5 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 2.4 | College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 1.9 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 1.6 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.3 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 1.2 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 1.0 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | College Ave from the north (Berkeley) | 0.5 | Telegraph Avenue |
| other pairs | | 3.8 | |

By the arterial these cars would otherwise use: Telegraph Avenue 52 veh/h; College Avenue then Alcatraz Avenue 28 veh/h; Claremont Avenue 6 veh/h; College Avenue 2 veh/h; SR-24 2 veh/h; Alcatraz Avenue then College Avenue 0 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 19 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 23 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 5 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 19 | above |
| Intents listed, together | | 43 (20 to 68) | 66 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 39 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 12.6 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 12.2 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 11.4 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.1 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.9 | SR-24 then Claremont Avenue then College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.5 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 2.1 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 1.6 | SR-24 |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 1.4 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.1 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Shattuck Ave from the north (Berkeley) | 1.1 | SR-24 then Telegraph Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | College Ave from the north (Berkeley) | 1.1 | Telegraph Avenue |
| other pairs | | 10.1 | |

By the arterial these cars would otherwise use: Telegraph Avenue 30 veh/h; SR-24 14 veh/h; SR-24 then Claremont Avenue 5 veh/h; SR-24 then Claremont Avenue then College Avenue 5 veh/h; Claremont Avenue 4 veh/h; SR-24 then Telegraph Avenue 3 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 15 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 20 | below |
| Intents listed, together | | 87 (78 to 110) | 35 | |
| Other through cars (no intent listed) | | | 38 | |

Model through cars by origin and destination group (largest 12 of 24 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 26.8 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.1 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.6 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.8 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.7 | Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.7 | College Avenue |
| Telegraph Ave from the north (Berkeley) | College Ave from the north (Berkeley) | 2.3 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 2.2 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 1.5 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 0.6 | Alcatraz Avenue then College Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 0.5 | Alcatraz Avenue then Claremont Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 0.5 | none near the study area |
| other pairs | | 1.7 | |

By the arterial these cars would otherwise use: Telegraph Avenue 45 veh/h; Claremont Avenue then SR-24 15 veh/h; College Avenue 5 veh/h; College Avenue then Claremont Avenue then SR-24 5 veh/h; none near the study area 1 veh/h; Alcatraz Avenue then College Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 16 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 17 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 10 | below |
| Intents listed, together | | 46 (39 to 72) | 44 | |
| Other through cars (no intent listed) | | | 54 | |

Model through cars by origin and destination group (largest 12 of 43 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 34.8 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.9 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.4 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.1 | none near the study area |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 3.8 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 3.7 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 3.6 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.9 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 2.6 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.6 | none near the study area |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 2.1 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.6 | Telegraph Avenue |
| other pairs | | 11.2 | |

By the arterial these cars would otherwise use: Telegraph Avenue 68 veh/h; none near the study area 11 veh/h; SR-24 10 veh/h; College Avenue then Claremont Avenue then SR-24 1 veh/h; Alcatraz Avenue then Telegraph Avenue 1 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h.

### Study area, all residential and service streets

Model: 503 through cars per hour.

Model through cars by origin and destination group (largest 12 of 92 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 88.8 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 67.6 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 45.6 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 35.1 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 27.1 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 20.8 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 12.7 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 12.5 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 11.3 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 11.1 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 10.9 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.7 | Claremont Avenue then SR-24 |
| other pairs | | 148.6 | |

By the arterial these cars would otherwise use: Telegraph Avenue 353 veh/h; Claremont Avenue 40 veh/h; none near the study area 25 veh/h; SR-24 25 veh/h; Claremont Avenue then SR-24 11 veh/h; Alcatraz Avenue then College Avenue 7 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 142; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 109; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 77; Telegraph Ave from the north (Berkeley) 55; Telegraph Ave to the south (downtown Oakland) 35; Claremont Ave and Tunnel Rd toward the hills 12; West Oakland to the southwest (Adeline St, Market St) 12; Shattuck Ave from the north (Berkeley) 10; Ashby Ave from the west (Emeryville and I-80) 9; Emeryville and West Oakland streets (55th to 67th Streets) 9.

By destination group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 134; SR-24 westbound on-ramps (toward Oakland and I-980) 98; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 93; Telegraph Ave from the north (Berkeley) 66; Claremont Ave and Tunnel Rd toward the hills 21; College Ave from the north (Berkeley) 17; Ashby Ave from the west (Emeryville and I-80) 14; Emeryville and West Oakland streets (55th to 67th Streets) 13; Telegraph Ave to the south (downtown Oakland) 12; Shattuck Ave from the north (Berkeley) 8.


Per-seed detail: `rockridge-am_peak-s1-seed1.md` (seed 1 in full).
