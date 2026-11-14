# rockridge-midday-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 10.03 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.01 | 0.00 | 0.00 | 0.01 | 0.00 to 0.01 |
| health | backlog growth in the second half of the run | points of spawned | 0.00 | 0.01 | -0.01 | 0.01 | -0.00 to 0.01 |
| health | completed trips | trips | 16010.60 | 126.73 | 15805.00 | 16205.00 | 15919.95 to 16101.25 |
| health | arterial mean speed | m/s | 10.03 | 0.05 | 9.94 | 10.08 | 9.99 to 10.06 |
| health | arterial mean speed, last 15 min | m/s | 10.05 | 0.07 | 9.95 | 10.18 | 10.01 to 10.10 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 25.44 | 2.86 | 20.79 | 29.93 | 23.39 to 27.49 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 10.1 | 0.9 | 8.7 | 11.5 | 9.4 to 10.8 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 21.50 | 2.69 | 16.81 | 26.62 | 19.58 to 23.43 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 8.6 | 1.3 | 6.3 | 10.8 | 7.7 to 9.5 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 22.60 | 4.43 | 17.00 | 31.00 | 19.43 to 25.77 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 945.50 | 25.58 | 898.00 | 991.00 | 927.20 to 963.80 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 41.90 | 5.84 | 32.00 | 50.00 | 37.72 to 46.08 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 985.00 | 22.23 | 948.00 | 1028.00 | 969.10 to 1000.90 |
| headline share | Hillegass Avenue NB from freeway | % | 48.9 | 4.0 | 40.3 | 52.8 | 46.1 to 51.8 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 3.3 | 1.6 | 0.0 | 5.6 | 2.1 to 4.5 |
| share | Hillegass Avenue NB to College Avenue | % | 14.6 | 3.9 | 8.0 | 18.6 | 11.8 to 17.4 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 31.9 | 6.5 | 24.3 | 40.9 | 27.3 to 36.5 |
| headline share | Colby Street NB from freeway | % | 37.1 | 4.7 | 31.4 | 45.9 | 33.8 to 40.5 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 66.2 | 3.8 | 59.7 | 72.9 | 63.4 to 68.9 |
| share | Colby Street NB to Telegraph Avenue | % | 34.6 | 3.5 | 30.4 | 40.0 | 32.1 to 37.1 |
| share | Colby Street NB to College Avenue | % | 6.3 | 1.9 | 3.4 | 9.6 | 4.9 to 7.7 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 31.8 | 5.0 | 19.8 | 37.5 | 28.3 to 35.4 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 2.1 | 1.5 | 0.0 | 4.2 | 1.0 to 3.1 |
| share | Hillegass Avenue SB from College Avenue | % | 13.1 | 3.3 | 5.6 | 17.1 | 10.8 to 15.5 |
| headline share | Hillegass Avenue SB to freeway | % | 65.5 | 7.0 | 51.8 | 74.0 | 60.5 to 70.6 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 22.2 | 2.7 | 16.9 | 25.8 | 20.2 to 24.1 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 21.5 | 5.2 | 15.0 | 30.8 | 17.8 to 25.2 |
| share | Colby Street SB from Telegraph Avenue | % | 19.4 | 2.8 | 15.1 | 22.7 | 17.4 to 21.5 |
| headline share | Colby Street SB to freeway | % | 44.5 | 6.2 | 34.8 | 54.7 | 40.1 to 49.0 |
| share | Colby Street SB to Forest Street | % | 15.4 | 3.6 | 11.4 | 21.6 | 12.8 to 17.9 |
| ramp share | onto freeway via College Avenue | % | 19.8 | 2.9 | 14.4 | 23.9 | 17.7 to 21.9 |
| ramp share | onto freeway via Hillegass Avenue | % | 15.7 | 1.6 | 12.8 | 17.6 | 14.5 to 16.8 |
| ramp share | onto freeway via Martin Street | % | 15.4 | 2.4 | 11.5 | 20.4 | 13.7 to 17.1 |
| ramp share | onto freeway via Colby Street | % | 12.7 | 3.3 | 9.6 | 19.4 | 10.4 to 15.1 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 11.1 | 1.2 | 9.2 | 12.8 | 10.2 to 11.9 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.3 | 0.9 | 3.1 | 5.7 | 3.7 to 4.9 |
| ramp share | from freeway via College Avenue | % | 9.9 | 1.1 | 8.7 | 12.4 | 9.1 to 10.7 |
| ramp share | from freeway via Martin Street | % | 13.1 | 1.6 | 10.7 | 15.0 | 11.9 to 14.2 |
| ramp share | from freeway via Colby Street | % | 10.6 | 1.8 | 7.8 | 13.4 | 9.3 to 11.9 |
| ramp share | from freeway via Hillegass Avenue | % | 6.8 | 1.1 | 5.3 | 8.5 | 6.0 to 7.6 |
| ramp share | from freeway via Benvenue Avenue | % | 2.6 | 1.0 | 1.1 | 4.2 | 1.9 to 3.4 |
| corridor flow | Telegraph N median link flow | veh/h | 578.64 | 40.26 | 522.00 | 648.00 | 549.84 to 607.44 |
| corridor flow | Telegraph S median link flow | veh/h | 456.72 | 18.52 | 426.00 | 480.00 | 443.47 to 469.97 |
| corridor flow | College N median link flow | veh/h | 227.76 | 23.91 | 196.80 | 273.60 | 210.66 to 244.86 |
| corridor flow | College S median link flow | veh/h | 407.28 | 22.34 | 382.80 | 448.80 | 391.30 to 423.26 |
| corridor flow | Claremont N median link flow | veh/h | 261.12 | 40.50 | 186.00 | 321.60 | 232.15 to 290.09 |
| corridor flow | Claremont S median link flow | veh/h | 204.72 | 34.31 | 144.00 | 241.20 | 180.18 to 229.26 |
| corridor flow | Alcatraz E median link flow | veh/h | 386.40 | 23.81 | 356.40 | 422.40 | 369.37 to 403.43 |
| corridor flow | Alcatraz W median link flow | veh/h | 226.80 | 13.79 | 198.00 | 243.60 | 216.94 to 236.66 |
| corridor flow | Hillegass N median link flow | veh/h | 71.52 | 5.52 | 60.00 | 79.20 | 67.57 to 75.47 |
| corridor flow | Hillegass S median link flow | veh/h | 64.80 | 5.66 | 58.80 | 72.00 | 60.75 to 68.85 |
| corridor flow | Colby N median link flow | veh/h | 80.52 | 6.58 | 70.80 | 92.40 | 75.81 to 85.23 |
| corridor flow | Colby S median link flow | veh/h | 72.12 | 10.54 | 58.80 | 90.00 | 64.58 to 79.66 |
| corridor flow | Martin E median link flow | veh/h | 92.16 | 15.11 | 68.40 | 117.60 | 81.35 to 102.97 |
| corridor flow | Martin W median link flow | veh/h | 90.48 | 11.39 | 72.00 | 115.20 | 82.33 to 98.63 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 34 | below |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 30 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 9 | within |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 8 | within |
| Intents listed, together | | 101 (71 to 131) | 82 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 37 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 21.9 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 6.8 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 5.8 | SR-24 |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 5.5 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 5.5 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 5.3 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.7 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 4.1 | none near the study area |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Alcatraz Ave from the west (Emeryville side) | 2.8 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 2.7 | SR-24 then Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 2.4 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 2.3 | Claremont Avenue |
| other pairs | | 14.4 | |

By the arterial these cars would otherwise use: Telegraph Avenue 41 veh/h; none near the study area 17 veh/h; Claremont Avenue 7 veh/h; SR-24 6 veh/h; SR-24 then Telegraph Avenue 6 veh/h; SR-24 then Telegraph Avenue then Alcatraz Avenue 3 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 10 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 17 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 9 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 9 | within |
| Intents listed, together | | 43 (20 to 68) | 44 | |
| Other through cars (no intent listed) | | | 3 | |

Model through cars by origin and destination group (largest 12 of 35 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 9.6 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 7.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.4 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.4 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.2 | SR-24 then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 2.3 | College Avenue then Alcatraz Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 2.1 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 2.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 2.0 | none near the study area |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.6 | Claremont Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | Claremont Ave and Tunnel Rd toward the hills | 1.5 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 1.2 | none near the study area |
| other pairs | | 7.3 | |

By the arterial these cars would otherwise use: Telegraph Avenue 12 veh/h; SR-24 11 veh/h; none near the study area 6 veh/h; SR-24 then Claremont Avenue then College Avenue 4 veh/h; Claremont Avenue 4 veh/h; College Avenue then Alcatraz Avenue 4 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 24 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 31 | below |
| Intents listed, together | | 87 (78 to 110) | 55 | |
| Other through cars (no intent listed) | | | 11 | |

Model through cars by origin and destination group (largest 12 of 27 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 23.3 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.7 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.5 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.9 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 4.4 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.6 | Alcatraz Avenue then College Avenue |
| Alcatraz Ave from the west (Emeryville side) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 1.3 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.0 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 0.8 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.6 | Alcatraz Avenue then College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 0.3 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.3 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 2.2 | |

By the arterial these cars would otherwise use: Telegraph Avenue 29 veh/h; Claremont Avenue then SR-24 23 veh/h; College Avenue then Claremont Avenue then SR-24 7 veh/h; Alcatraz Avenue then College Avenue 2 veh/h; Claremont Avenue 2 veh/h; SR-24 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 14 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 9 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 23 | within |
| Intents listed, together | | 46 (39 to 72) | 46 | |
| Other through cars (no intent listed) | | | 21 | |

Model through cars by origin and destination group (largest 12 of 40 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.4 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.2 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 9.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.5 | Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.5 | none near the study area |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.9 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 2.2 | Claremont Avenue |
| Alcatraz Ave from the west (Emeryville side) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.8 | Alcatraz Avenue then College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.4 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 1.3 | SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-13 Warren Freeway (via SR-24 east) | 1.3 | none near the study area |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.2 | none near the study area |
| other pairs | | 9.7 | |

By the arterial these cars would otherwise use: Telegraph Avenue 32 veh/h; Claremont Avenue then SR-24 8 veh/h; none near the study area 7 veh/h; Claremont Avenue 5 veh/h; SR-24 5 veh/h; Alcatraz Avenue then College Avenue 3 veh/h.

### Study area, all residential and service streets

Model: 381 through cars per hour.

Model through cars by origin and destination group (largest 12 of 100 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 37.6 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 32.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 30.4 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 22.7 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 19.6 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 17.5 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 16.5 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 15.5 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 14.7 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 14.2 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 12.7 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 11.6 | Claremont Avenue |
| other pairs | | 136.1 | |

By the arterial these cars would otherwise use: Telegraph Avenue 173 veh/h; Claremont Avenue 74 veh/h; none near the study area 35 veh/h; SR-24 25 veh/h; Claremont Avenue then SR-24 20 veh/h; College Avenue then Claremont Avenue then SR-24 9 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 91; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 66; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 62; Telegraph Ave from the north (Berkeley) 42; Claremont Ave and Tunnel Rd toward the hills 21; West Oakland to the southwest (Adeline St, Market St) 19; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 16; Telegraph Ave to the south (downtown Oakland) 12; Emeryville and West Oakland streets (55th to 67th Streets) 12; College Ave from the north (Berkeley) 10.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 105; Telegraph Ave from the north (Berkeley) 51; Claremont Ave and Tunnel Rd toward the hills 38; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 37; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 36; Ashby Ave from the west (Emeryville and I-80) 22; Alcatraz Ave from the west (Emeryville side) 20; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 16; Shattuck Ave from the north (Berkeley) 13; Telegraph Ave to the south (downtown Oakland) 12.


Per-seed detail: `rockridge-midday-s1-seed1.md` (seed 1 in full).
