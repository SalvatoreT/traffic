# rockridge-midday-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 10.10 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.00 | 0.00 | 0.00 | 0.01 | -0.00 to 0.00 |
| health | backlog growth in the second half of the run | points of spawned | -0.00 | 0.01 | -0.01 | 0.01 | -0.01 to 0.00 |
| health | completed trips | trips | 15964.30 | 146.83 | 15731.00 | 16193.00 | 15859.27 to 16069.33 |
| health | arterial mean speed | m/s | 10.10 | 0.02 | 10.07 | 10.14 | 10.08 to 10.12 |
| health | arterial mean speed, last 15 min | m/s | 10.13 | 0.08 | 10.04 | 10.26 | 10.07 to 10.19 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 24.97 | 2.75 | 19.88 | 28.59 | 23.00 to 26.94 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 9.8 | 1.0 | 8.3 | 11.3 | 9.1 to 10.5 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 21.27 | 2.58 | 16.43 | 25.15 | 19.43 to 23.12 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 8.4 | 1.0 | 6.4 | 9.8 | 7.7 to 9.1 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 23.60 | 4.35 | 17.00 | 30.00 | 20.49 to 26.71 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 910.10 | 18.83 | 881.00 | 945.00 | 896.63 to 923.57 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 41.80 | 5.14 | 31.00 | 48.00 | 38.12 to 45.48 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 991.50 | 33.03 | 951.00 | 1069.00 | 967.87 to 1015.13 |
| headline share | Hillegass Avenue NB from freeway | % | 50.9 | 3.7 | 46.8 | 57.7 | 48.2 to 53.5 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 3.9 | 1.1 | 2.3 | 6.2 | 3.1 to 4.7 |
| share | Hillegass Avenue NB to College Avenue | % | 14.2 | 3.7 | 8.5 | 18.3 | 11.6 to 16.9 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 30.2 | 5.6 | 22.9 | 38.9 | 26.2 to 34.2 |
| headline share | Colby Street NB from freeway | % | 37.2 | 3.9 | 29.3 | 42.6 | 34.5 to 40.0 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 65.7 | 5.2 | 57.5 | 75.0 | 61.9 to 69.4 |
| share | Colby Street NB to Telegraph Avenue | % | 33.4 | 3.1 | 27.9 | 36.6 | 31.2 to 35.6 |
| share | Colby Street NB to College Avenue | % | 5.4 | 1.8 | 3.4 | 8.4 | 4.2 to 6.7 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 30.1 | 4.1 | 19.8 | 34.8 | 27.2 to 33.1 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 2.0 | 1.0 | 0.0 | 3.5 | 1.3 to 2.8 |
| share | Hillegass Avenue SB from College Avenue | % | 12.6 | 2.9 | 6.2 | 17.1 | 10.5 to 14.7 |
| headline share | Hillegass Avenue SB to freeway | % | 65.5 | 6.1 | 53.8 | 73.2 | 61.1 to 69.8 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 22.1 | 3.7 | 15.5 | 29.5 | 19.5 to 24.8 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 21.2 | 4.1 | 14.6 | 27.2 | 18.2 to 24.1 |
| share | Colby Street SB from Telegraph Avenue | % | 17.9 | 3.9 | 11.5 | 23.0 | 15.1 to 20.7 |
| headline share | Colby Street SB to freeway | % | 45.2 | 5.2 | 37.9 | 55.0 | 41.5 to 48.9 |
| share | Colby Street SB to Forest Street | % | 17.1 | 3.7 | 11.3 | 23.4 | 14.5 to 19.8 |
| ramp share | onto freeway via College Avenue | % | 17.9 | 2.1 | 15.3 | 22.2 | 16.4 to 19.4 |
| ramp share | onto freeway via Hillegass Avenue | % | 15.3 | 1.8 | 12.0 | 17.4 | 14.0 to 16.6 |
| ramp share | onto freeway via Martin Street | % | 15.1 | 2.7 | 11.9 | 20.0 | 13.2 to 17.1 |
| ramp share | onto freeway via Colby Street | % | 11.5 | 1.9 | 8.4 | 13.7 | 10.1 to 12.8 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 10.0 | 1.6 | 7.4 | 12.1 | 8.9 to 11.2 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.4 | 0.8 | 3.2 | 5.8 | 3.8 to 5.0 |
| ramp share | from freeway via College Avenue | % | 9.9 | 0.9 | 8.6 | 11.5 | 9.3 to 10.5 |
| ramp share | from freeway via Martin Street | % | 11.0 | 1.0 | 9.2 | 12.4 | 10.2 to 11.7 |
| ramp share | from freeway via Colby Street | % | 10.4 | 1.8 | 6.9 | 12.5 | 9.1 to 11.6 |
| ramp share | from freeway via Hillegass Avenue | % | 6.9 | 1.0 | 5.8 | 8.6 | 6.2 to 7.6 |
| ramp share | from freeway via Benvenue Avenue | % | 2.6 | 0.9 | 1.4 | 4.1 | 2.0 to 3.2 |
| corridor flow | Telegraph N median link flow | veh/h | 595.08 | 35.82 | 554.40 | 680.40 | 569.45 to 620.71 |
| corridor flow | Telegraph S median link flow | veh/h | 462.00 | 26.25 | 409.20 | 504.00 | 443.22 to 480.78 |
| corridor flow | College N median link flow | veh/h | 207.12 | 19.17 | 174.00 | 236.40 | 193.41 to 220.83 |
| corridor flow | College S median link flow | veh/h | 437.76 | 32.40 | 400.80 | 496.80 | 414.58 to 460.94 |
| corridor flow | Claremont N median link flow | veh/h | 247.44 | 24.72 | 192.00 | 277.20 | 229.76 to 265.12 |
| corridor flow | Claremont S median link flow | veh/h | 227.28 | 25.87 | 183.60 | 261.60 | 208.78 to 245.78 |
| corridor flow | Alcatraz E median link flow | veh/h | 390.60 | 30.77 | 349.20 | 451.20 | 368.59 to 412.61 |
| corridor flow | Alcatraz W median link flow | veh/h | 229.92 | 19.78 | 189.60 | 266.40 | 215.77 to 244.07 |
| corridor flow | Hillegass N median link flow | veh/h | 73.08 | 4.17 | 66.00 | 79.20 | 70.09 to 76.07 |
| corridor flow | Hillegass S median link flow | veh/h | 68.16 | 8.80 | 51.60 | 80.40 | 61.87 to 74.45 |
| corridor flow | Colby N median link flow | veh/h | 82.56 | 3.29 | 78.00 | 87.60 | 80.21 to 84.91 |
| corridor flow | Colby S median link flow | veh/h | 70.08 | 11.55 | 52.80 | 87.60 | 61.82 to 78.34 |
| corridor flow | Martin E median link flow | veh/h | 99.84 | 16.57 | 81.60 | 127.20 | 87.99 to 111.69 |
| corridor flow | Martin W median link flow | veh/h | 85.80 | 11.05 | 74.40 | 114.00 | 77.90 to 93.70 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 34 | below |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 28 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 9 | within |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 8 | within |
| Intents listed, together | | 101 (71 to 131) | 78 | |
| Other through cars (no intent listed) | | | 1 | |

Model through cars by origin and destination group (largest 12 of 33 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 21.8 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 5.8 | SR-24 |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 5.5 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 5.2 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 5.1 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 4.7 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.2 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 4.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 2.9 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Alcatraz Ave from the west (Emeryville side) | 2.8 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 2.7 | SR-24 then Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 2.3 | SR-24 then Claremont Avenue then College Avenue |
| other pairs | | 12.5 | |

By the arterial these cars would otherwise use: Telegraph Avenue 39 veh/h; none near the study area 16 veh/h; Claremont Avenue 7 veh/h; SR-24 6 veh/h; SR-24 then Telegraph Avenue 6 veh/h; SR-24 then Telegraph Avenue then Alcatraz Avenue 3 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 10 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 17 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 7 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 9 | within |
| Intents listed, together | | 43 (20 to 68) | 42 | |
| Other through cars (no intent listed) | | | 3 | |

Model through cars by origin and destination group (largest 12 of 42 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 9.1 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 6.7 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.6 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.5 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.5 | SR-24 then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 1.7 | none near the study area |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.6 | Claremont Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 1.4 | College Avenue then Alcatraz Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.4 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 1.3 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 1.2 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 1.2 | none near the study area |
| other pairs | | 7.4 | |

By the arterial these cars would otherwise use: Telegraph Avenue 13 veh/h; SR-24 10 veh/h; SR-24 then Claremont Avenue then College Avenue 4 veh/h; none near the study area 4 veh/h; Claremont Avenue 4 veh/h; SR-24 then Claremont Avenue 4 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 23 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 31 | below |
| Intents listed, together | | 87 (78 to 110) | 54 | |
| Other through cars (no intent listed) | | | 11 | |

Model through cars by origin and destination group (largest 12 of 25 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 23.2 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.7 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.4 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.9 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 3.8 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.3 | Alcatraz Avenue then College Avenue |
| Alcatraz Ave from the west (Emeryville side) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 1.1 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 0.8 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Claremont Ave and Tunnel Rd toward the hills | 0.5 | Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 0.5 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.5 | Alcatraz Avenue then College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 0.4 | Alcatraz Avenue then College Avenue |
| other pairs | | 2.2 | |

By the arterial these cars would otherwise use: Telegraph Avenue 28 veh/h; Claremont Avenue then SR-24 23 veh/h; College Avenue then Claremont Avenue then SR-24 7 veh/h; Alcatraz Avenue then College Avenue 3 veh/h; SR-24 1 veh/h; Claremont Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 12 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 9 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 22 | within |
| Intents listed, together | | 46 (39 to 72) | 43 | |
| Other through cars (no intent listed) | | | 19 | |

Model through cars by origin and destination group (largest 12 of 36 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.3 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.9 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 9.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.9 | Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.5 | none near the study area |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.9 | College Avenue then Claremont Avenue then SR-24 |
| Alcatraz Ave from the west (Emeryville side) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.6 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 1.6 | Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 1.3 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.3 | SR-24 |
| Emeryville and West Oakland streets (55th to 67th Streets) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.3 | Alcatraz Avenue then College Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.0 | SR-24 |
| other pairs | | 7.4 | |

By the arterial these cars would otherwise use: Telegraph Avenue 32 veh/h; Claremont Avenue then SR-24 8 veh/h; none near the study area 6 veh/h; SR-24 5 veh/h; Alcatraz Avenue then College Avenue 3 veh/h; Claremont Avenue 3 veh/h.

### Study area, all residential and service streets

Model: 364 through cars per hour.

Model through cars by origin and destination group (largest 12 of 104 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 36.8 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 32.6 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 30.7 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 21.7 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 19.6 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 16.8 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 15.1 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 14.8 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 13.6 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 12.9 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 10.1 | Claremont Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.8 | College Avenue then Claremont Avenue then SR-24 |
| other pairs | | 130.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 168 veh/h; Claremont Avenue 83 veh/h; SR-24 24 veh/h; Claremont Avenue then SR-24 20 veh/h; none near the study area 17 veh/h; College Avenue then Claremont Avenue then SR-24 9 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 85; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 64; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 61; Telegraph Ave from the north (Berkeley) 39; Claremont Ave and Tunnel Rd toward the hills 21; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 16; West Oakland to the southwest (Adeline St, Market St) 14; Telegraph Ave to the south (downtown Oakland) 12; Emeryville and West Oakland streets (55th to 67th Streets) 11; College Ave from the north (Berkeley) 10.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 105; Telegraph Ave from the north (Berkeley) 50; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 35; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 32; Claremont Ave and Tunnel Rd toward the hills 32; Alcatraz Ave from the west (Emeryville side) 18; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 18; Ashby Ave from the west (Emeryville and I-80) 17; College Ave from the north (Berkeley) 12; Shattuck Ave from the north (Berkeley) 12.


Per-seed detail: `rockridge-midday-s1-seed1.md` (seed 1 in full).
