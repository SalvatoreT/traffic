# rockridge-midday-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Cars cleared from gridlock near the study area (judged zone) | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 10.06 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.01 | 0.01 | 0.00 | 0.02 | 0.00 to 0.01 |
| health | backlog growth in the second half of the run | points of spawned | 0.00 | 0.01 | -0.01 | 0.01 | 0.00 to 0.01 |
| health | completed trips | trips | 16698.50 | 165.04 | 16515.00 | 16990.00 | 16580.44 to 16816.56 |
| health | arterial mean speed | m/s | 10.06 | 0.05 | 9.98 | 10.12 | 10.03 to 10.09 |
| health | arterial mean speed, last 15 min | m/s | 10.06 | 0.08 | 9.92 | 10.21 | 10.00 to 10.11 |
| junction recovery | courtesy admissions per hour | veh/h | 46.60 | 5.95 | 38.00 | 58.00 | 42.35 to 50.85 |
| junction recovery | yield fallback admissions per hour | veh/h | 6.10 | 2.51 | 3.00 | 10.00 | 4.30 to 7.90 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, judged (near the study area, and far ones whose chain reaches it) | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, near the study area | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, farther out | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, farther out with a chain into the judged zone | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | trips waiting at origins in the judged zone at the end | trips | 0.30 | 0.48 | 0.00 | 1.00 | -0.05 to 0.65 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 26.39 | 3.68 | 20.79 | 31.50 | 23.75 to 29.02 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 10.2 | 1.2 | 8.7 | 12.1 | 9.4 to 11.1 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 24.05 | 3.16 | 19.48 | 28.68 | 21.79 to 26.31 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 9.3 | 1.1 | 8.0 | 10.7 | 8.5 to 10.1 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 27.20 | 4.10 | 21.00 | 31.00 | 24.26 to 30.14 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 890.50 | 17.49 | 857.00 | 911.00 | 877.99 to 903.01 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 40.40 | 6.47 | 33.00 | 56.00 | 35.77 to 45.03 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 961.90 | 27.25 | 924.00 | 994.00 | 942.41 to 981.39 |
| headline share | Hillegass Avenue NB from freeway | % | 53.0 | 4.9 | 46.3 | 59.7 | 49.5 to 56.5 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 3.1 | 1.2 | 1.4 | 4.8 | 2.3 to 3.9 |
| share | Hillegass Avenue NB to College Avenue | % | 17.1 | 2.4 | 13.4 | 22.0 | 15.4 to 18.8 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 29.8 | 4.0 | 23.8 | 36.4 | 27.0 to 32.6 |
| headline share | Colby Street NB from freeway | % | 37.8 | 2.8 | 34.0 | 42.4 | 35.8 to 39.8 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 48.3 | 3.6 | 42.3 | 52.3 | 45.7 to 50.9 |
| share | Colby Street NB to Telegraph Avenue | % | 35.2 | 2.7 | 30.7 | 41.0 | 33.2 to 37.1 |
| share | Colby Street NB to College Avenue | % | 7.1 | 2.1 | 4.0 | 11.7 | 5.5 to 8.6 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 31.5 | 5.5 | 21.6 | 40.0 | 27.6 to 35.4 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 5.2 | 2.1 | 1.7 | 9.0 | 3.7 to 6.8 |
| share | Hillegass Avenue SB from College Avenue | % | 17.3 | 4.1 | 10.7 | 21.8 | 14.4 to 20.2 |
| headline share | Hillegass Avenue SB to freeway | % | 62.9 | 5.0 | 56.4 | 72.4 | 59.4 to 66.5 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 21.3 | 2.8 | 16.4 | 25.3 | 19.2 to 23.3 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 21.8 | 2.1 | 17.2 | 24.5 | 20.3 to 23.3 |
| share | Colby Street SB from Telegraph Avenue | % | 19.1 | 2.5 | 14.7 | 22.6 | 17.4 to 20.9 |
| headline share | Colby Street SB to freeway | % | 47.3 | 3.8 | 39.2 | 51.1 | 44.6 to 49.9 |
| share | Colby Street SB to Forest Street | % | 12.5 | 4.2 | 7.1 | 17.7 | 9.5 to 15.4 |
| ramp share | onto freeway via College Avenue | % | 12.6 | 1.5 | 10.3 | 15.2 | 11.5 to 13.6 |
| ramp share | onto freeway via Hillegass Avenue | % | 14.3 | 1.6 | 12.4 | 17.9 | 13.2 to 15.5 |
| ramp share | onto freeway via Martin Street | % | 12.6 | 2.2 | 8.5 | 15.8 | 11.1 to 14.2 |
| ramp share | onto freeway via Colby Street | % | 13.2 | 1.8 | 10.8 | 17.3 | 11.9 to 14.5 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 9.2 | 1.2 | 7.6 | 11.2 | 8.4 to 10.1 |
| ramp share | onto freeway via Benvenue Avenue | % | 5.1 | 0.9 | 3.4 | 6.3 | 4.5 to 5.8 |
| ramp share | from freeway via College Avenue | % | 10.1 | 1.1 | 8.4 | 11.7 | 9.3 to 10.9 |
| ramp share | from freeway via Martin Street | % | 11.2 | 2.4 | 8.8 | 16.3 | 9.4 to 12.9 |
| ramp share | from freeway via Colby Street | % | 11.5 | 1.2 | 9.3 | 13.1 | 10.6 to 12.3 |
| ramp share | from freeway via Hillegass Avenue | % | 8.6 | 1.2 | 6.9 | 10.4 | 7.8 to 9.5 |
| ramp share | from freeway via Benvenue Avenue | % | 2.7 | 0.6 | 1.7 | 3.3 | 2.2 to 3.1 |
| corridor flow | Telegraph N median link flow | veh/h | 613.32 | 38.83 | 547.20 | 674.40 | 585.54 to 641.10 |
| corridor flow | Telegraph S median link flow | veh/h | 644.76 | 29.74 | 589.20 | 688.80 | 623.49 to 666.03 |
| corridor flow | College N median link flow | veh/h | 222.84 | 32.67 | 194.40 | 300.00 | 199.47 to 246.21 |
| corridor flow | College S median link flow | veh/h | 337.68 | 22.64 | 308.40 | 384.00 | 321.49 to 353.87 |
| corridor flow | Claremont N median link flow | veh/h | 260.16 | 29.08 | 208.80 | 310.80 | 239.36 to 280.96 |
| corridor flow | Claremont S median link flow | veh/h | 163.92 | 28.93 | 132.00 | 225.60 | 143.22 to 184.62 |
| corridor flow | Alcatraz E median link flow | veh/h | 391.32 | 19.44 | 350.40 | 412.80 | 377.42 to 405.22 |
| corridor flow | Alcatraz W median link flow | veh/h | 236.88 | 15.37 | 213.60 | 266.40 | 225.89 to 247.87 |
| corridor flow | Hillegass N median link flow | veh/h | 79.20 | 7.33 | 68.40 | 93.60 | 73.96 to 84.44 |
| corridor flow | Hillegass S median link flow | veh/h | 71.52 | 6.53 | 63.60 | 82.80 | 66.85 to 76.19 |
| corridor flow | Colby N median link flow | veh/h | 98.28 | 7.28 | 88.80 | 112.80 | 93.08 to 103.48 |
| corridor flow | Colby S median link flow | veh/h | 74.04 | 8.76 | 62.40 | 86.40 | 67.77 to 80.31 |
| corridor flow | Martin E median link flow | veh/h | 77.28 | 11.36 | 54.00 | 93.60 | 69.15 to 85.41 |
| corridor flow | Martin W median link flow | veh/h | 70.56 | 13.75 | 48.00 | 92.40 | 60.72 to 80.40 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 41 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 14 | below |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 7 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 9 | within |
| Intents listed, together | | 101 (71 to 131) | 72 | |
| Other through cars (no intent listed) | | | 3 | |

Model through cars by origin and destination group (largest 12 of 28 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 40.8 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 6.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 5.5 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.3 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 1.7 | SR-24 then Claremont Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.6 | Alcatraz Avenue then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 1.5 | SR-24 |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 1.4 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 0.8 | College Avenue then Alcatraz Avenue |
| San Pablo Ave (Emeryville and West Oakland) | College Ave from the north (Berkeley) | 0.7 | Claremont Avenue then College Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 0.6 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 4.8 | |

By the arterial these cars would otherwise use: Telegraph Avenue 54 veh/h; none near the study area 6 veh/h; SR-24 then Claremont Avenue 4 veh/h; Alcatraz Avenue then Claremont Avenue 2 veh/h; Claremont Avenue 2 veh/h; SR-24 then Claremont Avenue then College Avenue 2 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 15 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 25 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 5 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 6 | within |
| Intents listed, together | | 43 (20 to 68) | 51 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 36 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 12.9 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 12.6 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.7 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.6 | SR-24 then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.7 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.1 | Claremont Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 1.7 | College Avenue then Alcatraz Avenue |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 1.6 | College Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 1.2 | SR-24 |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.0 | SR-24 then Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.9 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 0.8 | none near the study area |
| other pairs | | 7.5 | |

By the arterial these cars would otherwise use: Telegraph Avenue 18 veh/h; SR-24 14 veh/h; SR-24 then Claremont Avenue then College Avenue 5 veh/h; SR-24 then Claremont Avenue 5 veh/h; College Avenue then Alcatraz Avenue 4 veh/h; Claremont Avenue then Alcatraz Avenue 2 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 25 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 33 | below |
| Intents listed, together | | 87 (78 to 110) | 58 | |
| Other through cars (no intent listed) | | | 9 | |

Model through cars by origin and destination group (largest 12 of 22 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 15.8 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.5 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.1 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.4 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.6 | Alcatraz Avenue then Claremont Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.5 | Claremont Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | College Ave from the north (Berkeley) | 0.9 | Claremont Avenue then College Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.6 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 0.5 | Claremont Avenue |
| San Pablo Ave (Emeryville and West Oakland) | College Ave from the north (Berkeley) | 0.5 | Claremont Avenue then College Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.4 | Claremont Avenue |
| other pairs | | 1.3 | |

By the arterial these cars would otherwise use: Telegraph Avenue 27 veh/h; Claremont Avenue then SR-24 25 veh/h; College Avenue then Claremont Avenue then SR-24 7 veh/h; Claremont Avenue 3 veh/h; Alcatraz Avenue then Claremont Avenue 2 veh/h; Claremont Avenue then College Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 13 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 9 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 29 | within |
| Intents listed, together | | 46 (39 to 72) | 51 | |
| Other through cars (no intent listed) | | | 26 | |

Model through cars by origin and destination group (largest 12 of 42 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.1 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.9 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.6 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 8.7 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.3 | College Avenue then Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.2 | none near the study area |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.6 | Claremont Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.3 | Alcatraz Avenue then Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 1.8 | SR-24 |
| San Pablo Ave (Emeryville and West Oakland) | College Ave from the north (Berkeley) | 1.5 | Claremont Avenue then College Avenue |
| Claremont Ave and Tunnel Rd toward the hills | Telegraph Ave to the south (downtown Oakland) | 1.4 | Claremont Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 1.3 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 12.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 35 veh/h; Claremont Avenue then SR-24 11 veh/h; Claremont Avenue 6 veh/h; none near the study area 6 veh/h; College Avenue then Claremont Avenue then SR-24 5 veh/h; Alcatraz Avenue then Claremont Avenue 5 veh/h.

### Study area, all residential and service streets

Model: 359 through cars per hour.

Model through cars by origin and destination group (largest 12 of 84 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 49.1 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 36.5 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 29.6 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 22.5 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 21.5 | Claremont Avenue then SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 17.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 15.9 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 15.2 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.7 | SR-24 |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 10.6 | Alcatraz Avenue then Claremont Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.8 | College Avenue then Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 8.5 | none near the study area |
| other pairs | | 108.3 | |

By the arterial these cars would otherwise use: Telegraph Avenue 196 veh/h; Alcatraz Avenue then Claremont Avenue 27 veh/h; Claremont Avenue 26 veh/h; Claremont Avenue then SR-24 22 veh/h; SR-24 20 veh/h; none near the study area 16 veh/h.

By origin group: SR-24 eastbound off-ramps (arriving from Oakland and I-980) 88; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 68; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 36; Telegraph Ave from the north (Berkeley) 34; Claremont Ave and Tunnel Rd toward the hills 24; Emeryville and West Oakland streets (55th to 67th Streets) 24; San Pablo Ave (Emeryville and West Oakland) 23; Telegraph Ave to the south (downtown Oakland) 16; West Oakland to the southwest (Adeline St, Market St) 14; College Ave from the north (Berkeley) 13.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 105; Telegraph Ave from the north (Berkeley) 62; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 50; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 43; Claremont Ave and Tunnel Rd toward the hills 39; College Ave from the north (Berkeley) 21; Ashby Ave from the west (Emeryville and I-80) 10; Alcatraz Ave from the west (Emeryville side) 6; Telegraph Ave to the south (downtown Oakland) 5; Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) 4.


Per-seed detail: `rockridge-midday-s1-seed1.md` (seed 1 in full).
