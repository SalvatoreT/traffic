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
| health | entry backlog | % of spawned | 0.01 | 0.01 | 0.00 | 0.03 | 0.00 to 0.01 |
| health | backlog growth in the second half of the run | points of spawned | 0.00 | 0.01 | -0.02 | 0.03 | -0.01 to 0.01 |
| health | completed trips | trips | 16702.50 | 152.67 | 16533.00 | 16963.00 | 16593.29 to 16811.71 |
| health | arterial mean speed | m/s | 10.06 | 0.05 | 9.99 | 10.14 | 10.03 to 10.09 |
| health | arterial mean speed, last 15 min | m/s | 10.09 | 0.10 | 9.90 | 10.28 | 10.02 to 10.16 |
| junction recovery | courtesy admissions per hour | veh/h | 48.90 | 3.60 | 44.00 | 55.00 | 46.32 to 51.48 |
| junction recovery | yield fallback admissions per hour | veh/h | 6.40 | 2.12 | 2.00 | 9.00 | 4.88 to 7.92 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, judged (near the study area, and far ones whose chain reaches it) | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, near the study area | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, farther out | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, farther out with a chain into the judged zone | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | trips waiting at origins in the judged zone at the end | trips | 0.10 | 0.32 | 0.00 | 1.00 | -0.13 to 0.33 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 26.04 | 3.90 | 20.39 | 31.44 | 23.25 to 28.83 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 10.0 | 1.2 | 8.5 | 11.7 | 9.1 to 10.8 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 23.93 | 3.11 | 19.89 | 29.03 | 21.71 to 26.16 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 9.2 | 1.1 | 8.0 | 10.7 | 8.4 to 10.0 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 28.20 | 4.73 | 22.00 | 34.00 | 24.81 to 31.59 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 890.10 | 18.56 | 859.00 | 913.00 | 876.83 to 903.37 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 40.20 | 7.25 | 31.00 | 58.00 | 35.01 to 45.39 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 964.00 | 28.10 | 922.00 | 997.00 | 943.90 to 984.10 |
| headline share | Hillegass Avenue NB from freeway | % | 53.4 | 4.5 | 47.3 | 61.0 | 50.2 to 56.6 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 3.8 | 1.2 | 1.3 | 5.4 | 2.9 to 4.6 |
| share | Hillegass Avenue NB to College Avenue | % | 16.9 | 2.0 | 14.0 | 20.5 | 15.5 to 18.3 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 29.8 | 4.4 | 23.0 | 38.2 | 26.6 to 33.0 |
| headline share | Colby Street NB from freeway | % | 37.5 | 3.3 | 30.8 | 41.3 | 35.1 to 39.8 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 48.1 | 2.5 | 44.6 | 50.7 | 46.3 to 49.9 |
| share | Colby Street NB to Telegraph Avenue | % | 34.8 | 2.8 | 31.6 | 39.3 | 32.8 to 36.8 |
| share | Colby Street NB to College Avenue | % | 7.4 | 1.3 | 5.0 | 9.5 | 6.4 to 8.3 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 31.6 | 4.9 | 22.1 | 39.8 | 28.1 to 35.1 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 5.4 | 2.3 | 1.6 | 10.2 | 3.7 to 7.1 |
| share | Hillegass Avenue SB from College Avenue | % | 17.4 | 4.5 | 8.7 | 22.3 | 14.1 to 20.6 |
| headline share | Hillegass Avenue SB to freeway | % | 62.7 | 4.1 | 55.7 | 68.0 | 59.7 to 65.6 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 20.9 | 3.2 | 16.5 | 26.0 | 18.6 to 23.2 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 22.9 | 1.7 | 20.7 | 25.2 | 21.7 to 24.1 |
| share | Colby Street SB from Telegraph Avenue | % | 18.2 | 2.7 | 14.3 | 22.1 | 16.2 to 20.2 |
| headline share | Colby Street SB to freeway | % | 45.1 | 3.2 | 40.0 | 48.8 | 42.9 to 47.4 |
| share | Colby Street SB to Forest Street | % | 13.0 | 3.9 | 6.2 | 19.7 | 10.2 to 15.7 |
| ramp share | onto freeway via College Avenue | % | 12.5 | 1.1 | 10.4 | 14.2 | 11.7 to 13.3 |
| ramp share | onto freeway via Hillegass Avenue | % | 14.3 | 1.5 | 12.8 | 17.8 | 13.2 to 15.3 |
| ramp share | onto freeway via Martin Street | % | 12.2 | 2.0 | 9.0 | 15.2 | 10.8 to 13.6 |
| ramp share | onto freeway via Colby Street | % | 13.0 | 2.4 | 10.1 | 17.6 | 11.3 to 14.8 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 9.1 | 1.2 | 7.4 | 11.6 | 8.3 to 10.0 |
| ramp share | onto freeway via Benvenue Avenue | % | 5.2 | 0.9 | 3.9 | 6.1 | 4.6 to 5.8 |
| ramp share | from freeway via College Avenue | % | 9.7 | 1.0 | 8.1 | 11.5 | 8.9 to 10.4 |
| ramp share | from freeway via Martin Street | % | 10.9 | 1.6 | 8.1 | 13.7 | 9.8 to 12.0 |
| ramp share | from freeway via Colby Street | % | 11.3 | 1.4 | 8.5 | 13.2 | 10.3 to 12.3 |
| ramp share | from freeway via Hillegass Avenue | % | 8.8 | 1.2 | 7.1 | 10.9 | 8.0 to 9.7 |
| ramp share | from freeway via Benvenue Avenue | % | 2.7 | 0.5 | 1.7 | 3.1 | 2.4 to 3.0 |
| corridor flow | Telegraph N median link flow | veh/h | 613.92 | 29.23 | 552.00 | 649.20 | 593.01 to 634.83 |
| corridor flow | Telegraph S median link flow | veh/h | 644.88 | 20.79 | 590.40 | 664.80 | 630.01 to 659.75 |
| corridor flow | College N median link flow | veh/h | 222.48 | 23.24 | 199.20 | 264.00 | 205.85 to 239.11 |
| corridor flow | College S median link flow | veh/h | 337.20 | 24.47 | 307.20 | 376.80 | 319.70 to 354.70 |
| corridor flow | Claremont N median link flow | veh/h | 257.40 | 21.92 | 226.80 | 289.20 | 241.72 to 273.08 |
| corridor flow | Claremont S median link flow | veh/h | 169.32 | 25.74 | 128.40 | 200.40 | 150.91 to 187.73 |
| corridor flow | Alcatraz E median link flow | veh/h | 386.88 | 10.60 | 368.40 | 403.20 | 379.30 to 394.46 |
| corridor flow | Alcatraz W median link flow | veh/h | 239.04 | 19.52 | 207.60 | 270.00 | 225.08 to 253.00 |
| corridor flow | Hillegass N median link flow | veh/h | 81.00 | 9.82 | 72.00 | 99.60 | 73.98 to 88.02 |
| corridor flow | Hillegass S median link flow | veh/h | 72.60 | 8.16 | 64.80 | 87.60 | 66.76 to 78.44 |
| corridor flow | Colby N median link flow | veh/h | 98.76 | 9.02 | 84.00 | 111.60 | 92.31 to 105.21 |
| corridor flow | Colby S median link flow | veh/h | 77.04 | 10.16 | 63.60 | 96.00 | 69.77 to 84.31 |
| corridor flow | Martin E median link flow | veh/h | 74.28 | 9.09 | 58.80 | 86.40 | 67.77 to 80.79 |
| corridor flow | Martin W median link flow | veh/h | 66.84 | 7.40 | 57.60 | 78.00 | 61.55 to 72.13 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 41 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 15 | below |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 7 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 9 | within |
| Intents listed, together | | 101 (71 to 131) | 72 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 32 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 40.6 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 6.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 5.3 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.2 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.1 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 1.8 | SR-24 then Claremont Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.4 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 1.4 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 1.2 | College Avenue then Alcatraz Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 1.1 | SR-24 |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 0.9 | Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Claremont Ave and Tunnel Rd toward the hills | 0.8 | Telegraph Avenue then Alcatraz Avenue then Claremont Avenue |
| other pairs | | 5.8 | |

By the arterial these cars would otherwise use: Telegraph Avenue 55 veh/h; none near the study area 6 veh/h; SR-24 then Claremont Avenue 4 veh/h; Claremont Avenue 3 veh/h; College Avenue then Alcatraz Avenue 2 veh/h; SR-24 then Claremont Avenue then College Avenue 2 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 15 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 25 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 5 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 6 | within |
| Intents listed, together | | 43 (20 to 68) | 52 | |
| Other through cars (no intent listed) | | | 5 | |

Model through cars by origin and destination group (largest 12 of 42 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.3 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 12.6 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.9 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.8 | SR-24 then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 2.3 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.2 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Claremont Avenue then Alcatraz Avenue |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 1.7 | College Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.4 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 1.2 | SR-24 |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.0 | SR-24 then Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 0.8 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 8.4 | |

By the arterial these cars would otherwise use: Telegraph Avenue 18 veh/h; SR-24 15 veh/h; SR-24 then Claremont Avenue then College Avenue 5 veh/h; SR-24 then Claremont Avenue 5 veh/h; College Avenue then Alcatraz Avenue 5 veh/h; Claremont Avenue then Alcatraz Avenue 2 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 25 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 33 | below |
| Intents listed, together | | 87 (78 to 110) | 58 | |
| Other through cars (no intent listed) | | | 10 | |

Model through cars by origin and destination group (largest 12 of 24 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.1 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 15.9 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.6 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.2 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.4 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.2 | Claremont Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.3 | Alcatraz Avenue then Claremont Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | College Ave from the north (Berkeley) | 0.8 | Claremont Avenue then College Avenue |
| San Pablo Ave (Emeryville and West Oakland) | College Ave from the north (Berkeley) | 0.7 | Claremont Avenue then College Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.6 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 0.5 | Claremont Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | College Ave from the north (Berkeley) | 0.4 | College Avenue |
| other pairs | | 2.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 28 veh/h; Claremont Avenue then SR-24 26 veh/h; College Avenue then Claremont Avenue then SR-24 7 veh/h; Claremont Avenue 4 veh/h; Alcatraz Avenue then Claremont Avenue 2 veh/h; Claremont Avenue then College Avenue 2 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 12 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 9 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 30 | above |
| Intents listed, together | | 46 (39 to 72) | 51 | |
| Other through cars (no intent listed) | | | 31 | |

Model through cars by origin and destination group (largest 12 of 42 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.9 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.0 | Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.7 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 9.7 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.8 | College Avenue then Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.2 | none near the study area |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.9 | Claremont Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.8 | Alcatraz Avenue then Claremont Avenue |
| Claremont Ave and Tunnel Rd toward the hills | Telegraph Ave to the south (downtown Oakland) | 2.0 | Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 1.8 | SR-24 |
| San Pablo Ave (Emeryville and West Oakland) | College Ave from the north (Berkeley) | 1.7 | Claremont Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Claremont Ave and Tunnel Rd toward the hills | 1.3 | Telegraph Avenue then Alcatraz Avenue then Claremont Avenue |
| other pairs | | 14.7 | |

By the arterial these cars would otherwise use: Telegraph Avenue 35 veh/h; Claremont Avenue then SR-24 11 veh/h; Claremont Avenue 8 veh/h; none near the study area 6 veh/h; Alcatraz Avenue then Claremont Avenue 6 veh/h; College Avenue then Claremont Avenue then SR-24 5 veh/h.

### Study area, all residential and service streets

Model: 362 through cars per hour.

Model through cars by origin and destination group (largest 12 of 86 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 49.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 35.5 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 29.7 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 23.4 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 21.6 | Claremont Avenue then SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 17.3 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 15.9 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 14.5 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.8 | SR-24 |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 10.5 | Alcatraz Avenue then Claremont Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.8 | College Avenue then Claremont Avenue then SR-24 |
| San Pablo Ave (Emeryville and West Oakland) | College Ave from the north (Berkeley) | 9.3 | Claremont Avenue then College Avenue |
| other pairs | | 111.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 191 veh/h; Claremont Avenue 29 veh/h; Alcatraz Avenue then Claremont Avenue 28 veh/h; Claremont Avenue then SR-24 22 veh/h; SR-24 20 veh/h; none near the study area 16 veh/h.

By origin group: SR-24 eastbound off-ramps (arriving from Oakland and I-980) 88; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 69; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 34; Telegraph Ave from the north (Berkeley) 33; Emeryville and West Oakland streets (55th to 67th Streets) 26; Claremont Ave and Tunnel Rd toward the hills 25; San Pablo Ave (Emeryville and West Oakland) 24; Telegraph Ave to the south (downtown Oakland) 16; West Oakland to the southwest (Adeline St, Market St) 14; College Ave from the north (Berkeley) 12.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 104; Telegraph Ave from the north (Berkeley) 62; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 50; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 44; Claremont Ave and Tunnel Rd toward the hills 40; College Ave from the north (Berkeley) 22; Ashby Ave from the west (Emeryville and I-80) 9; Alcatraz Ave from the west (Emeryville side) 6; Telegraph Ave to the south (downtown Oakland) 5; Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) 5.


Per-seed detail: `rockridge-midday-s1-seed1.md` (seed 1 in full).
