# rockridge-pm_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Cars cleared from gridlock near the study area (judged zone) | mean per hour below 1.00 | 0.60 (min 0.00, max 4.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 8.26 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 4 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 1.10 | 1.52 | 0.00 | 5.00 | 0.01 to 2.19 |
| health | gridlock removals per hour | veh/h | 1.10 | 1.52 | 0.00 | 5.00 | 0.01 to 2.19 |
| health | entry backlog | % of spawned | 0.71 | 0.25 | 0.34 | 0.96 | 0.53 to 0.89 |
| health | backlog growth in the second half of the run | points of spawned | 0.43 | 0.23 | 0.10 | 0.80 | 0.27 to 0.60 |
| health | completed trips | trips | 25856.60 | 167.63 | 25576.00 | 26071.00 | 25736.69 to 25976.51 |
| health | arterial mean speed | m/s | 8.26 | 0.17 | 8.05 | 8.51 | 8.14 to 8.38 |
| health | arterial mean speed, last 15 min | m/s | 7.99 | 0.27 | 7.61 | 8.62 | 7.79 to 8.18 |
| junction recovery | courtesy admissions per hour | veh/h | 280.80 | 27.97 | 234.00 | 324.00 | 260.79 to 300.81 |
| junction recovery | yield fallback admissions per hour | veh/h | 124.80 | 21.67 | 85.00 | 153.00 | 109.30 to 140.30 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.10 | 0.32 | 0.00 | 1.00 | -0.13 to 0.33 |
| gridlock by place | cars cleared from gridlock per hour, judged (near the study area, and far ones whose chain reaches it) | veh/h | 0.60 | 1.35 | 0.00 | 4.00 | -0.37 to 1.57 |
| gridlock by place | cars cleared from gridlock per hour, near the study area | veh/h | 0.60 | 1.35 | 0.00 | 4.00 | -0.37 to 1.57 |
| gridlock by place | cars cleared from gridlock per hour, farther out | veh/h | 0.50 | 0.53 | 0.00 | 1.00 | 0.12 to 0.88 |
| gridlock by place | cars cleared from gridlock per hour, farther out with a chain into the judged zone | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | trips waiting at origins in the judged zone at the end | trips | 0.90 | 0.88 | 0.00 | 3.00 | 0.27 to 1.53 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 40.82 | 3.76 | 33.47 | 46.47 | 38.13 to 43.50 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 8.2 | 0.7 | 7.1 | 9.4 | 7.7 to 8.7 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 34.37 | 3.40 | 29.18 | 38.93 | 31.94 to 36.80 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 6.9 | 0.7 | 5.9 | 8.2 | 6.4 to 7.4 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 46.10 | 3.98 | 39.00 | 52.00 | 43.25 to 48.95 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1546.70 | 21.35 | 1518.00 | 1593.00 | 1531.43 to 1561.97 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 76.80 | 9.46 | 59.00 | 91.00 | 70.03 to 83.57 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1392.00 | 15.55 | 1370.00 | 1415.00 | 1380.88 to 1403.12 |
| headline share | Hillegass Avenue NB from freeway | % | 52.9 | 3.5 | 46.7 | 58.4 | 50.4 to 55.4 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 3.8 | 1.5 | 2.2 | 7.0 | 2.7 to 4.9 |
| share | Hillegass Avenue NB to College Avenue | % | 16.2 | 1.8 | 13.5 | 19.8 | 14.9 to 17.5 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 28.1 | 2.5 | 23.8 | 31.3 | 26.3 to 29.9 |
| headline share | Colby Street NB from freeway | % | 50.5 | 3.2 | 43.3 | 54.2 | 48.3 to 52.8 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 46.4 | 3.5 | 41.3 | 51.8 | 43.8 to 48.9 |
| share | Colby Street NB to Telegraph Avenue | % | 34.5 | 4.3 | 26.8 | 41.7 | 31.4 to 37.6 |
| share | Colby Street NB to College Avenue | % | 6.2 | 2.0 | 4.1 | 10.4 | 4.8 to 7.7 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 31.2 | 3.0 | 26.4 | 36.3 | 29.0 to 33.3 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 8.0 | 2.5 | 4.3 | 11.7 | 6.2 to 9.7 |
| share | Hillegass Avenue SB from College Avenue | % | 19.2 | 3.7 | 15.2 | 25.2 | 16.6 to 21.9 |
| headline share | Hillegass Avenue SB to freeway | % | 55.1 | 4.6 | 48.1 | 62.4 | 51.8 to 58.4 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 25.8 | 2.1 | 23.2 | 29.4 | 24.3 to 27.4 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 13.3 | 2.0 | 9.6 | 15.6 | 11.9 to 14.7 |
| share | Colby Street SB from Telegraph Avenue | % | 21.6 | 2.6 | 17.3 | 25.0 | 19.7 to 23.5 |
| headline share | Colby Street SB to freeway | % | 37.4 | 3.8 | 31.8 | 42.9 | 34.7 to 40.2 |
| share | Colby Street SB to Forest Street | % | 24.1 | 4.1 | 17.8 | 31.1 | 21.2 to 27.1 |
| ramp share | onto freeway via College Avenue | % | 14.8 | 1.3 | 12.6 | 16.4 | 13.9 to 15.7 |
| ramp share | onto freeway via Hillegass Avenue | % | 15.1 | 1.1 | 12.6 | 16.6 | 14.3 to 15.9 |
| ramp share | onto freeway via Martin Street | % | 13.3 | 1.9 | 10.2 | 15.9 | 12.0 to 14.6 |
| ramp share | onto freeway via Colby Street | % | 11.0 | 1.6 | 8.4 | 13.5 | 9.9 to 12.2 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 11.5 | 1.5 | 9.7 | 14.0 | 10.4 to 12.5 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.9 | 0.7 | 4.1 | 6.4 | 4.4 to 5.5 |
| ramp share | from freeway via College Avenue | % | 9.9 | 1.4 | 7.5 | 11.8 | 8.9 to 10.9 |
| ramp share | from freeway via Martin Street | % | 12.1 | 1.1 | 10.3 | 14.1 | 11.3 to 12.9 |
| ramp share | from freeway via Colby Street | % | 12.8 | 1.5 | 10.8 | 15.1 | 11.8 to 13.9 |
| ramp share | from freeway via Hillegass Avenue | % | 8.2 | 1.0 | 6.8 | 10.3 | 7.5 to 8.9 |
| ramp share | from freeway via Benvenue Avenue | % | 2.4 | 0.7 | 1.5 | 3.6 | 2.0 to 2.9 |
| corridor flow | Telegraph N median link flow | veh/h | 1043.64 | 68.31 | 916.80 | 1170.00 | 994.78 to 1092.50 |
| corridor flow | Telegraph S median link flow | veh/h | 1140.48 | 64.00 | 1044.00 | 1244.40 | 1094.70 to 1186.26 |
| corridor flow | College N median link flow | veh/h | 435.48 | 25.13 | 397.20 | 477.60 | 417.50 to 453.46 |
| corridor flow | College S median link flow | veh/h | 546.36 | 64.20 | 440.40 | 646.80 | 500.44 to 592.28 |
| corridor flow | Claremont N median link flow | veh/h | 506.28 | 33.20 | 459.60 | 579.60 | 482.53 to 530.03 |
| corridor flow | Claremont S median link flow | veh/h | 349.20 | 36.31 | 292.80 | 409.20 | 323.23 to 375.17 |
| corridor flow | Alcatraz E median link flow | veh/h | 505.80 | 49.77 | 444.00 | 580.80 | 470.20 to 541.40 |
| corridor flow | Alcatraz W median link flow | veh/h | 352.32 | 16.08 | 334.80 | 375.60 | 340.82 to 363.82 |
| corridor flow | Hillegass N median link flow | veh/h | 127.56 | 5.96 | 116.40 | 134.40 | 123.30 to 131.82 |
| corridor flow | Hillegass S median link flow | veh/h | 145.44 | 17.87 | 124.80 | 183.60 | 132.66 to 158.22 |
| corridor flow | Colby N median link flow | veh/h | 171.48 | 9.46 | 156.00 | 183.60 | 164.72 to 178.24 |
| corridor flow | Colby S median link flow | veh/h | 163.32 | 15.76 | 142.80 | 188.40 | 152.04 to 174.60 |
| corridor flow | Martin E median link flow | veh/h | 130.32 | 17.09 | 97.20 | 153.60 | 118.10 to 142.54 |
| corridor flow | Martin W median link flow | veh/h | 154.56 | 22.59 | 127.20 | 200.40 | 138.40 to 170.72 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 150 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 65 | above |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 33 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 12 | within |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 37 | above |
| Intents listed, together | | 101 (71 to 131) | 146 | |
| Other through cars (no intent listed) | | | 3 | |

Model through cars by origin and destination group (largest 12 of 32 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 64.6 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 30.8 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 6.5 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 6.4 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 6.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 5.7 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.7 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 4.2 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 4.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 3.7 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 2.1 | SR-24 |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.1 | Telegraph Avenue |
| other pairs | | 7.7 | |

By the arterial these cars would otherwise use: Telegraph Avenue 121 veh/h; Claremont Avenue 12 veh/h; none near the study area 6 veh/h; SR-24 then Claremont Avenue then College Avenue 4 veh/h; Alcatraz Avenue then Claremont Avenue 3 veh/h; SR-24 2 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 97 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 25 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 32 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 6 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 27 | above |
| Intents listed, together | | 43 (20 to 68) | 91 | |
| Other through cars (no intent listed) | | | 7 | |

Model through cars by origin and destination group (largest 12 of 39 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 18.8 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 18.6 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 16.2 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 6.1 | SR-24 then Claremont Avenue then College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.2 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.7 | SR-24 then Claremont Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.4 | Claremont Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.7 | Claremont Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.8 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 1.7 | none near the study area |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 1.5 | SR-24 |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.4 | Claremont Avenue |
| other pairs | | 14.4 | |

By the arterial these cars would otherwise use: Telegraph Avenue 44 veh/h; SR-24 20 veh/h; Claremont Avenue then Alcatraz Avenue 7 veh/h; SR-24 then Claremont Avenue then College Avenue 6 veh/h; Claremont Avenue 5 veh/h; SR-24 then Claremont Avenue 5 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 142 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 40 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 55 | within |
| Intents listed, together | | 87 (78 to 110) | 95 | |
| Other through cars (no intent listed) | | | 47 | |

Model through cars by origin and destination group (largest 12 of 33 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 39.5 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.2 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 18.3 | Alcatraz Avenue then College Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 17.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.5 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 7.5 | Telegraph Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.3 | College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 3.5 | none near the study area |
| College Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.9 | College Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.0 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 1.5 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.4 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 6.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 74 veh/h; Alcatraz Avenue then College Avenue 18 veh/h; Claremont Avenue then SR-24 17 veh/h; College Avenue 11 veh/h; College Avenue then Claremont Avenue then SR-24 10 veh/h; none near the study area 5 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 132 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 14 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 17 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 36 | above |
| Intents listed, together | | 46 (39 to 72) | 68 | |
| Other through cars (no intent listed) | | | 65 | |

Model through cars by origin and destination group (largest 12 of 51 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 20.6 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 18.2 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 14.7 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.3 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.2 | Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.2 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 5.8 | Telegraph Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.1 | College Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.1 | College Avenue then Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 4.0 | none near the study area |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 3.3 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 3.2 | SR-24 |
| other pairs | | 22.4 | |

By the arterial these cars would otherwise use: Telegraph Avenue 57 veh/h; Alcatraz Avenue then College Avenue 18 veh/h; none near the study area 16 veh/h; Claremont Avenue then SR-24 10 veh/h; SR-24 9 veh/h; Alcatraz Avenue then Claremont Avenue 6 veh/h.

### Study area, all residential and service streets

Model: 822 through cars per hour.

Model through cars by origin and destination group (largest 12 of 94 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 95.4 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 77.1 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 75.7 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 62.3 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 48.4 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 42.8 | Alcatraz Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 29.1 | Telegraph Avenue then Claremont Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 24.5 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 23.3 | Claremont Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | SR-24 westbound on-ramps (toward Oakland and I-980) | 22.1 | none near the study area |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 22.1 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 19.9 | none near the study area |
| other pairs | | 279.5 | |

By the arterial these cars would otherwise use: Telegraph Avenue 471 veh/h; none near the study area 75 veh/h; Claremont Avenue 69 veh/h; Alcatraz Avenue then College Avenue 43 veh/h; SR-24 30 veh/h; Telegraph Avenue then Claremont Avenue 29 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 170; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 158; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 123; Telegraph Ave from the north (Berkeley) 73; Ashby Ave from the west (Emeryville and I-80) 62; West Oakland to the southwest (Adeline St, Market St) 45; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 34; Emeryville and West Oakland streets (55th to 67th Streets) 33; Telegraph Ave to the south (downtown Oakland) 32; Claremont Ave and Tunnel Rd toward the hills 26.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 213; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 164; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 140; Telegraph Ave from the north (Berkeley) 107; College Ave from the north (Berkeley) 56; Claremont Ave and Tunnel Rd toward the hills 41; Emeryville and West Oakland streets (55th to 67th Streets) 23; Shattuck Ave from the north (Berkeley) 19; Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) 16; Telegraph Ave to the south (downtown Oakland) 14.


Per-seed detail: `rockridge-pm_peak-s1-seed1.md` (seed 1 in full).
