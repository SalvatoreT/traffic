# rockridge-pm_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Cars cleared from gridlock near the study area (judged zone) | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 7.44 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 0 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 5.90 | 2.88 | 2.00 | 11.00 | 3.84 to 7.96 |
| health | gridlock removals per hour | veh/h | 5.90 | 2.88 | 2.00 | 11.00 | 3.84 to 7.96 |
| health | entry backlog | % of spawned | 1.07 | 0.28 | 0.63 | 1.59 | 0.87 to 1.27 |
| health | backlog growth in the second half of the run | points of spawned | 0.61 | 0.23 | 0.25 | 1.01 | 0.45 to 0.78 |
| health | completed trips | trips | 23824.30 | 232.75 | 23435.00 | 24231.00 | 23657.81 to 23990.79 |
| health | arterial mean speed | m/s | 7.44 | 0.13 | 7.23 | 7.60 | 7.35 to 7.53 |
| health | arterial mean speed, last 15 min | m/s | 7.09 | 0.13 | 6.94 | 7.36 | 7.00 to 7.18 |
| junction recovery | courtesy admissions per hour | veh/h | 339.70 | 39.11 | 269.00 | 418.00 | 311.72 to 367.68 |
| junction recovery | yield fallback admissions per hour | veh/h | 200.70 | 10.25 | 184.00 | 214.00 | 193.37 to 208.03 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.40 | 0.70 | 0.00 | 2.00 | -0.10 to 0.90 |
| gridlock by place | cars cleared from gridlock per hour, judged (near the study area, and far ones whose chain reaches it) | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, near the study area | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, farther out | veh/h | 5.90 | 2.88 | 2.00 | 11.00 | 3.84 to 7.96 |
| gridlock by place | cars cleared from gridlock per hour, farther out with a chain into the judged zone | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | trips waiting at origins in the judged zone at the end | trips | 1.40 | 1.71 | 0.00 | 4.00 | 0.17 to 2.63 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 40.00 | 3.84 | 34.02 | 47.02 | 37.25 to 42.75 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 10.2 | 1.2 | 8.8 | 12.5 | 9.3 to 11.1 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 33.33 | 3.80 | 25.46 | 38.16 | 30.61 to 36.05 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 8.5 | 1.1 | 7.0 | 10.2 | 7.7 to 9.3 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 40.50 | 4.25 | 33.00 | 46.00 | 37.46 to 43.54 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1414.70 | 49.74 | 1351.00 | 1476.00 | 1379.12 to 1450.28 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 71.00 | 10.76 | 62.00 | 92.00 | 63.30 to 78.70 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 991.90 | 44.76 | 928.00 | 1088.00 | 959.88 to 1023.92 |
| headline share | Hillegass Avenue NB from freeway | % | 51.2 | 3.0 | 44.3 | 54.3 | 49.1 to 53.3 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 3.5 | 1.9 | 1.0 | 7.3 | 2.2 to 4.9 |
| share | Hillegass Avenue NB to College Avenue | % | 19.8 | 4.4 | 14.1 | 27.6 | 16.7 to 22.9 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 36.4 | 2.9 | 31.7 | 41.7 | 34.3 to 38.5 |
| headline share | Colby Street NB from freeway | % | 48.0 | 3.3 | 43.1 | 53.6 | 45.6 to 50.3 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 52.6 | 4.0 | 47.4 | 58.1 | 49.7 to 55.4 |
| share | Colby Street NB to Telegraph Avenue | % | 49.5 | 4.8 | 45.1 | 60.4 | 46.1 to 52.9 |
| share | Colby Street NB to College Avenue | % | 7.2 | 1.9 | 3.5 | 9.4 | 5.8 to 8.5 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 35.3 | 3.1 | 29.6 | 39.2 | 33.1 to 37.6 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 11.0 | 2.8 | 5.6 | 15.0 | 9.0 to 13.1 |
| share | Hillegass Avenue SB from College Avenue | % | 18.0 | 2.6 | 15.0 | 23.6 | 16.2 to 19.9 |
| headline share | Hillegass Avenue SB to freeway | % | 60.0 | 5.3 | 49.3 | 67.8 | 56.2 to 63.9 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 26.4 | 3.5 | 22.6 | 34.9 | 23.9 to 29.0 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 25.0 | 4.4 | 18.9 | 30.9 | 21.8 to 28.1 |
| share | Colby Street SB from Telegraph Avenue | % | 30.9 | 3.0 | 26.8 | 35.3 | 28.7 to 33.0 |
| headline share | Colby Street SB to freeway | % | 42.8 | 4.9 | 36.1 | 51.2 | 39.2 to 46.3 |
| share | Colby Street SB to Forest Street | % | 8.7 | 2.3 | 5.8 | 12.9 | 7.0 to 10.3 |
| ramp share | onto freeway via College Avenue | % | 20.2 | 3.1 | 14.2 | 23.6 | 18.0 to 22.4 |
| ramp share | onto freeway via Hillegass Avenue | % | 20.0 | 1.8 | 17.4 | 23.1 | 18.7 to 21.2 |
| ramp share | onto freeway via Martin Street | % | 16.8 | 0.9 | 14.9 | 17.7 | 16.1 to 17.4 |
| ramp share | onto freeway via Colby Street | % | 14.5 | 1.5 | 12.6 | 17.0 | 13.4 to 15.5 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 15.5 | 1.5 | 13.8 | 18.6 | 14.4 to 16.6 |
| ramp share | onto freeway via Benvenue Avenue | % | 6.1 | 1.1 | 3.8 | 7.6 | 5.3 to 6.9 |
| ramp share | from freeway via College Avenue | % | 9.6 | 1.0 | 8.6 | 11.7 | 8.9 to 10.4 |
| ramp share | from freeway via Martin Street | % | 12.1 | 1.1 | 10.8 | 14.2 | 11.3 to 12.9 |
| ramp share | from freeway via Colby Street | % | 12.9 | 1.0 | 11.1 | 14.1 | 12.1 to 13.6 |
| ramp share | from freeway via Hillegass Avenue | % | 9.3 | 0.8 | 7.9 | 10.4 | 8.8 to 9.9 |
| ramp share | from freeway via Benvenue Avenue | % | 2.9 | 0.7 | 2.2 | 4.0 | 2.5 to 3.4 |
| corridor flow | Telegraph N median link flow | veh/h | 1017.12 | 64.31 | 892.80 | 1077.60 | 971.12 to 1063.12 |
| corridor flow | Telegraph S median link flow | veh/h | 855.36 | 89.57 | 734.40 | 1048.80 | 791.29 to 919.43 |
| corridor flow | College N median link flow | veh/h | 326.16 | 28.91 | 288.00 | 380.40 | 305.48 to 346.84 |
| corridor flow | College S median link flow | veh/h | 586.44 | 50.80 | 487.20 | 669.60 | 550.10 to 622.78 |
| corridor flow | Claremont N median link flow | veh/h | 486.84 | 37.41 | 426.00 | 529.20 | 460.08 to 513.60 |
| corridor flow | Claremont S median link flow | veh/h | 441.96 | 28.75 | 405.60 | 477.60 | 421.39 to 462.53 |
| corridor flow | Alcatraz E median link flow | veh/h | 549.12 | 37.77 | 482.40 | 604.80 | 522.11 to 576.13 |
| corridor flow | Alcatraz W median link flow | veh/h | 289.32 | 30.71 | 246.00 | 345.60 | 267.35 to 311.29 |
| corridor flow | Hillegass N median link flow | veh/h | 111.12 | 12.06 | 98.40 | 133.20 | 102.50 to 119.74 |
| corridor flow | Hillegass S median link flow | veh/h | 141.84 | 16.04 | 124.80 | 175.20 | 130.37 to 153.31 |
| corridor flow | Colby N median link flow | veh/h | 138.48 | 15.38 | 117.60 | 166.80 | 127.48 to 149.48 |
| corridor flow | Colby S median link flow | veh/h | 138.00 | 14.23 | 111.60 | 157.20 | 127.82 to 148.18 |
| corridor flow | Martin E median link flow | veh/h | 144.48 | 14.00 | 123.60 | 165.60 | 134.47 to 154.49 |
| corridor flow | Martin W median link flow | veh/h | 158.04 | 17.12 | 133.20 | 195.60 | 145.79 to 170.29 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 148 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 61 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 38 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 9 | within |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 32 | above |
| Intents listed, together | | 101 (71 to 131) | 140 | |
| Other through cars (no intent listed) | | | 9 | |

Model through cars by origin and destination group (largest 12 of 36 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 60.7 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 21.9 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 13.7 | Claremont Avenue then College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 9.7 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 5.9 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 4.5 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.5 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 4.1 | Claremont Avenue |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 3.9 | College Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.6 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.3 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 1.4 | SR-24 |
| other pairs | | 11.3 | |

By the arterial these cars would otherwise use: Telegraph Avenue 106 veh/h; Claremont Avenue then College Avenue 14 veh/h; Claremont Avenue 7 veh/h; none near the study area 6 veh/h; College Avenue then Alcatraz Avenue 4 veh/h; SR-24 then Claremont Avenue then College Avenue 4 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 94 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 25 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 30 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 10 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 16 | above |
| Intents listed, together | | 43 (20 to 68) | 81 | |
| Other through cars (no intent listed) | | | 13 | |

Model through cars by origin and destination group (largest 12 of 47 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 19.1 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 16.4 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 7.7 | SR-24 then Claremont Avenue then College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.8 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.4 | SR-24 then Claremont Avenue |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 4.4 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.2 | College Avenue |
| College Ave from the north (Berkeley) | Shattuck Ave from the north (Berkeley) | 4.1 | College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 3.6 | Claremont Avenue then College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 2.2 | none near the study area |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.6 | SR-24 then Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 1.5 | Claremont Avenue |
| other pairs | | 16.6 | |

By the arterial these cars would otherwise use: Telegraph Avenue 30 veh/h; SR-24 17 veh/h; College Avenue 9 veh/h; SR-24 then Claremont Avenue then College Avenue 8 veh/h; College Avenue then Alcatraz Avenue 6 veh/h; SR-24 then Claremont Avenue 5 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 128 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 40 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 50 | within |
| Intents listed, together | | 87 (78 to 110) | 91 | |
| Other through cars (no intent listed) | | | 37 | |

Model through cars by origin and destination group (largest 12 of 50 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 39.2 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 22.4 | College Avenue then Claremont Avenue then SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 13.6 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.2 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 4.6 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.4 | Claremont Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | College Ave from the north (Berkeley) | 2.2 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 2.1 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Claremont Ave and Tunnel Rd toward the hills | 1.6 | Alcatraz Avenue then Claremont Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 1.5 | Alcatraz Avenue then Claremont Avenue |
| Alcatraz Ave from the west (Emeryville side) | Claremont Ave and Tunnel Rd toward the hills | 1.2 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 12.7 | |

By the arterial these cars would otherwise use: Telegraph Avenue 60 veh/h; College Avenue then Claremont Avenue then SR-24 33 veh/h; Claremont Avenue then SR-24 15 veh/h; none near the study area 7 veh/h; Alcatraz Avenue then Claremont Avenue 5 veh/h; College Avenue 3 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 155 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 16 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 22 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 37 | above |
| Intents listed, together | | 46 (39 to 72) | 75 | |
| Other through cars (no intent listed) | | | 80 | |

Model through cars by origin and destination group (largest 12 of 71 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 20.6 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 17.5 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 16.9 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.9 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.6 | none near the study area |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.5 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.7 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 6.3 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 4.8 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Claremont Ave and Tunnel Rd toward the hills | 4.4 | Alcatraz Avenue then Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 3.8 | SR-24 |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 3.4 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 39.2 | |

By the arterial these cars would otherwise use: Telegraph Avenue 82 veh/h; none near the study area 26 veh/h; Alcatraz Avenue then Claremont Avenue 13 veh/h; SR-24 9 veh/h; Claremont Avenue then SR-24 9 veh/h; College Avenue then Claremont Avenue then SR-24 7 veh/h.

### Study area, all residential and service streets

Model: 786 through cars per hour.

Model through cars by origin and destination group (largest 12 of 126 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 75.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 74.4 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 74.2 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 48.2 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 39.5 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 39.4 | Claremont Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 32.4 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 23.1 | Claremont Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 20.4 | Claremont Avenue then SR-24 |
| Emeryville and West Oakland streets (55th to 67th Streets) | Claremont Ave and Tunnel Rd toward the hills | 19.0 | Alcatraz Avenue then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 17.6 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 16.7 | SR-24 |
| other pairs | | 306.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 441 veh/h; none near the study area 94 veh/h; Alcatraz Avenue then Claremont Avenue 45 veh/h; Claremont Avenue 42 veh/h; Claremont Avenue then College Avenue 39 veh/h; SR-24 27 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 168; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 155; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 121; Telegraph Ave from the north (Berkeley) 69; College Ave from the north (Berkeley) 44; Telegraph Ave to the south (downtown Oakland) 42; Ashby Ave from the west (Emeryville and I-80) 32; Emeryville and West Oakland streets (55th to 67th Streets) 30; West Oakland to the southwest (Adeline St, Market St) 24; Claremont Ave and Tunnel Rd toward the hills 23.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 213; Telegraph Ave from the north (Berkeley) 133; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 116; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 69; Claremont Ave and Tunnel Rd toward the hills 65; Telegraph Ave to the south (downtown Oakland) 56; Shattuck Ave from the north (Berkeley) 30; College Ave from the north (Berkeley) 20; Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) 20; Alcatraz Ave from the west (Emeryville side) 17.


Per-seed detail: `rockridge-pm_peak-s1-seed1.md` (seed 1 in full).
