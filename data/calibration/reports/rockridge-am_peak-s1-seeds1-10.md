# rockridge-am_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Cars cleared from gridlock near the study area (judged zone) | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 8.97 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 7 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.60 | 1.07 | 0.00 | 3.00 | -0.17 to 1.37 |
| health | gridlock removals per hour | veh/h | 0.60 | 1.07 | 0.00 | 3.00 | -0.17 to 1.37 |
| health | entry backlog | % of spawned | 0.11 | 0.12 | 0.00 | 0.34 | 0.03 to 0.20 |
| health | backlog growth in the second half of the run | points of spawned | 0.05 | 0.09 | -0.03 | 0.21 | -0.02 to 0.11 |
| health | completed trips | trips | 23292.70 | 158.51 | 22991.00 | 23515.00 | 23179.31 to 23406.09 |
| health | arterial mean speed | m/s | 8.97 | 0.08 | 8.89 | 9.12 | 8.91 to 9.03 |
| health | arterial mean speed, last 15 min | m/s | 8.99 | 0.21 | 8.71 | 9.30 | 8.84 to 9.13 |
| junction recovery | courtesy admissions per hour | veh/h | 129.90 | 11.69 | 110.00 | 150.00 | 121.54 to 138.26 |
| junction recovery | yield fallback admissions per hour | veh/h | 56.00 | 7.62 | 46.00 | 66.00 | 50.55 to 61.45 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, judged (near the study area, and far ones whose chain reaches it) | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, near the study area | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, farther out | veh/h | 0.60 | 1.07 | 0.00 | 3.00 | -0.17 to 1.37 |
| gridlock by place | cars cleared from gridlock per hour, farther out with a chain into the judged zone | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | trips waiting at origins in the judged zone at the end | trips | 0.40 | 0.70 | 0.00 | 2.00 | -0.10 to 0.90 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 20.01 | 2.76 | 16.11 | 25.09 | 18.04 to 21.99 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 5.9 | 0.8 | 4.9 | 7.5 | 5.3 to 6.5 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 21.58 | 3.56 | 14.48 | 27.45 | 19.04 to 24.13 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 6.3 | 1.0 | 4.3 | 7.8 | 5.6 to 7.1 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 36.80 | 6.75 | 29.00 | 50.00 | 31.97 to 41.63 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1040.50 | 26.90 | 1011.00 | 1099.00 | 1021.26 to 1059.74 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 35.80 | 6.30 | 26.00 | 44.00 | 31.29 to 40.31 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1169.10 | 35.60 | 1128.00 | 1230.00 | 1143.64 to 1194.56 |
| headline share | Hillegass Avenue NB from freeway | % | 50.2 | 4.8 | 44.1 | 60.4 | 46.8 to 53.7 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 10.2 | 1.7 | 7.9 | 12.9 | 8.9 to 11.4 |
| share | Hillegass Avenue NB to College Avenue | % | 15.5 | 3.5 | 10.3 | 21.1 | 13.0 to 18.0 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 32.6 | 4.7 | 26.1 | 39.4 | 29.2 to 36.0 |
| headline share | Colby Street NB from freeway | % | 45.0 | 3.6 | 41.4 | 53.0 | 42.4 to 47.5 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 42.4 | 4.4 | 35.2 | 47.5 | 39.3 to 45.5 |
| share | Colby Street NB to Telegraph Avenue | % | 44.7 | 3.2 | 38.6 | 49.7 | 42.4 to 46.9 |
| share | Colby Street NB to College Avenue | % | 2.5 | 0.8 | 1.2 | 3.7 | 1.9 to 3.0 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 21.1 | 2.9 | 15.5 | 26.7 | 19.0 to 23.2 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 2.4 | 1.8 | 0.0 | 5.4 | 1.0 to 3.7 |
| share | Hillegass Avenue SB from College Avenue | % | 10.7 | 1.9 | 7.8 | 12.8 | 9.4 to 12.1 |
| headline share | Hillegass Avenue SB to freeway | % | 57.5 | 5.3 | 45.9 | 62.5 | 53.7 to 61.3 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 18.6 | 2.8 | 15.1 | 24.1 | 16.7 to 20.6 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 19.2 | 2.8 | 14.8 | 24.5 | 17.2 to 21.1 |
| share | Colby Street SB from Telegraph Avenue | % | 16.4 | 2.5 | 13.3 | 22.0 | 14.6 to 18.2 |
| headline share | Colby Street SB to freeway | % | 34.9 | 3.8 | 31.1 | 42.1 | 32.2 to 37.7 |
| share | Colby Street SB to Forest Street | % | 24.7 | 3.8 | 19.8 | 30.2 | 22.0 to 27.4 |
| ramp share | onto freeway via College Avenue | % | 21.3 | 1.8 | 18.5 | 24.2 | 20.0 to 22.5 |
| ramp share | onto freeway via Hillegass Avenue | % | 16.4 | 1.8 | 13.6 | 19.8 | 15.1 to 17.7 |
| ramp share | onto freeway via Martin Street | % | 13.9 | 2.5 | 10.4 | 17.6 | 12.1 to 15.7 |
| ramp share | onto freeway via Colby Street | % | 12.4 | 2.0 | 10.4 | 16.0 | 11.0 to 13.8 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 9.7 | 1.5 | 7.5 | 11.7 | 8.7 to 10.8 |
| ramp share | onto freeway via Benvenue Avenue | % | 5.7 | 1.0 | 4.0 | 7.3 | 5.0 to 6.4 |
| ramp share | from freeway via College Avenue | % | 10.6 | 0.9 | 9.5 | 12.0 | 10.0 to 11.2 |
| ramp share | from freeway via Martin Street | % | 10.9 | 0.9 | 9.8 | 13.1 | 10.3 to 11.5 |
| ramp share | from freeway via Colby Street | % | 11.3 | 1.1 | 9.4 | 12.8 | 10.5 to 12.1 |
| ramp share | from freeway via Hillegass Avenue | % | 8.2 | 1.2 | 6.3 | 10.1 | 7.3 to 9.0 |
| ramp share | from freeway via Benvenue Avenue | % | 2.7 | 0.5 | 2.0 | 3.5 | 2.3 to 3.0 |
| corridor flow | Telegraph N median link flow | veh/h | 954.36 | 46.10 | 865.20 | 1017.60 | 921.39 to 987.33 |
| corridor flow | Telegraph S median link flow | veh/h | 928.92 | 61.83 | 858.00 | 1071.60 | 884.69 to 973.15 |
| corridor flow | College N median link flow | veh/h | 291.60 | 12.25 | 274.80 | 308.40 | 282.84 to 300.36 |
| corridor flow | College S median link flow | veh/h | 428.52 | 31.92 | 393.60 | 486.00 | 405.69 to 451.35 |
| corridor flow | Claremont N median link flow | veh/h | 428.04 | 27.00 | 397.20 | 474.00 | 408.73 to 447.35 |
| corridor flow | Claremont S median link flow | veh/h | 452.52 | 40.05 | 409.20 | 525.60 | 423.87 to 481.17 |
| corridor flow | Alcatraz E median link flow | veh/h | 360.12 | 19.97 | 320.40 | 386.40 | 345.83 to 374.41 |
| corridor flow | Alcatraz W median link flow | veh/h | 359.88 | 33.84 | 300.00 | 400.80 | 335.67 to 384.09 |
| corridor flow | Hillegass N median link flow | veh/h | 86.76 | 10.31 | 72.00 | 105.60 | 79.39 to 94.13 |
| corridor flow | Hillegass S median link flow | veh/h | 81.84 | 11.78 | 63.60 | 98.40 | 73.41 to 90.27 |
| corridor flow | Colby N median link flow | veh/h | 96.96 | 7.48 | 88.80 | 108.00 | 91.61 to 102.31 |
| corridor flow | Colby S median link flow | veh/h | 116.88 | 14.29 | 94.80 | 142.80 | 106.66 to 127.10 |
| corridor flow | Martin E median link flow | veh/h | 98.88 | 12.25 | 82.80 | 118.80 | 90.12 to 107.64 |
| corridor flow | Martin W median link flow | veh/h | 109.20 | 11.97 | 88.80 | 128.40 | 100.64 to 117.76 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 37 | below |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 26 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 4 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 20 | above |
| Intents listed, together | | 101 (71 to 131) | 87 | |
| Other through cars (no intent listed) | | | 1 | |

Model through cars by origin and destination group (largest 12 of 28 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 36.5 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 16.8 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 11.7 | Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 4.3 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 4.3 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 4.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.1 | SR-24 then Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.8 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 1.3 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 0.9 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 0.8 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 0.5 | Claremont Avenue |
| other pairs | | 3.1 | |

By the arterial these cars would otherwise use: Telegraph Avenue 64 veh/h; Claremont Avenue then College Avenue 12 veh/h; Claremont Avenue 6 veh/h; SR-24 then Claremont Avenue 2 veh/h; SR-24 1 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 22 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 22 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 7 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 20 | above |
| Intents listed, together | | 43 (20 to 68) | 70 | |
| Other through cars (no intent listed) | | | 6 | |

Model through cars by origin and destination group (largest 12 of 35 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 14.3 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 11.7 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 10.4 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 5.7 | SR-24 then Claremont Avenue then College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.2 | Telegraph Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.1 | Claremont Avenue then Alcatraz Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.3 | SR-24 then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 3.2 | Claremont Avenue then College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 2.1 | none near the study area |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 2.0 | SR-24 |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.8 | SR-24 then Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.6 | Claremont Avenue |
| other pairs | | 8.6 | |

By the arterial these cars would otherwise use: Telegraph Avenue 33 veh/h; SR-24 14 veh/h; SR-24 then Claremont Avenue then College Avenue 6 veh/h; Claremont Avenue then Alcatraz Avenue 6 veh/h; Claremont Avenue 5 veh/h; SR-24 then Claremont Avenue 4 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 15 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 24 | below |
| Intents listed, together | | 87 (78 to 110) | 40 | |
| Other through cars (no intent listed) | | | 26 | |

Model through cars by origin and destination group (largest 12 of 30 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 19.2 | Alcatraz Avenue then College Avenue then Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.7 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.2 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.5 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Claremont Ave and Tunnel Rd toward the hills | 0.7 | Alcatraz Avenue then Claremont Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | College Ave from the north (Berkeley) | 0.7 | Alcatraz Avenue then College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 0.6 | none near the study area |
| College Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 0.6 | College Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 0.5 | Alcatraz Avenue then College Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.5 | Alcatraz Avenue then College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 0.4 | Alcatraz Avenue then College Avenue |
| other pairs | | 3.8 | |

By the arterial these cars would otherwise use: Alcatraz Avenue then College Avenue then Claremont Avenue 19 veh/h; Claremont Avenue then SR-24 18 veh/h; Telegraph Avenue 15 veh/h; College Avenue then Claremont Avenue then SR-24 6 veh/h; Alcatraz Avenue then College Avenue 2 veh/h; Alcatraz Avenue then Claremont Avenue 2 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 14 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 17 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 8 | below |
| Intents listed, together | | 46 (39 to 72) | 40 | |
| Other through cars (no intent listed) | | | 34 | |

Model through cars by origin and destination group (largest 12 of 51 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 18.4 | Alcatraz Avenue then College Avenue then Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.6 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.6 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 4.3 | SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.7 | none near the study area |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.4 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.3 | SR-24 |
| Alcatraz Ave from the west (Emeryville side) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.1 | SR-24 |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 1.7 | SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 1.7 | Claremont Avenue then SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | Emeryville and West Oakland streets (55th to 67th Streets) | 1.2 | Claremont Avenue then Alcatraz Avenue |
| other pairs | | 14.1 | |

By the arterial these cars would otherwise use: Telegraph Avenue 20 veh/h; Alcatraz Avenue then College Avenue then Claremont Avenue 18 veh/h; none near the study area 12 veh/h; SR-24 11 veh/h; Claremont Avenue then Alcatraz Avenue 2 veh/h; Alcatraz Avenue then Claremont Avenue 2 veh/h.

### Study area, all residential and service streets

Model: 447 through cars per hour.

Model through cars by origin and destination group (largest 12 of 97 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 52.5 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 50.4 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 46.4 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 32.4 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 25.5 | Claremont Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.1 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 23.4 | Claremont Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.4 | Claremont Avenue then SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 13.4 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 12.7 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 11.8 | SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 9.9 | Telegraph Avenue |
| other pairs | | 129.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 259 veh/h; Claremont Avenue 44 veh/h; none near the study area 27 veh/h; Claremont Avenue then College Avenue 26 veh/h; SR-24 26 veh/h; Claremont Avenue then SR-24 14 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 120; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 90; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 78; Telegraph Ave from the north (Berkeley) 38; Telegraph Ave to the south (downtown Oakland) 22; Claremont Ave and Tunnel Rd toward the hills 18; College Ave from the north (Berkeley) 10; West Oakland to the southwest (Adeline St, Market St) 10; San Pablo Ave (Emeryville and West Oakland) 10; Ashby Ave from the west (Emeryville and I-80) 9.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 95; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 90; Telegraph Ave from the north (Berkeley) 83; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 62; Claremont Ave and Tunnel Rd toward the hills 27; Ashby Ave from the west (Emeryville and I-80) 25; San Pablo Ave (Emeryville and West Oakland) 13; College Ave from the north (Berkeley) 11; Emeryville and West Oakland streets (55th to 67th Streets) 8; SR-24 eastbound on-ramps (toward the Caldecott Tunnel) 8.


Per-seed detail: `rockridge-am_peak-s1-seed1.md` (seed 1 in full).
