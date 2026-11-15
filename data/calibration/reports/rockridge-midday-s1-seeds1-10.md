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
| health | entry backlog | % of spawned | 0.00 | 0.01 | 0.00 | 0.03 | -0.00 to 0.01 |
| health | backlog growth in the second half of the run | points of spawned | -0.00 | 0.01 | -0.02 | 0.02 | -0.01 to 0.00 |
| health | completed trips | trips | 16100.10 | 153.76 | 15820.00 | 16331.00 | 15990.12 to 16210.08 |
| health | arterial mean speed | m/s | 10.03 | 0.04 | 9.99 | 10.13 | 10.00 to 10.06 |
| health | arterial mean speed, last 15 min | m/s | 10.10 | 0.06 | 9.99 | 10.23 | 10.05 to 10.14 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 22.87 | 3.47 | 17.56 | 28.33 | 20.39 to 25.35 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 9.1 | 1.1 | 7.4 | 11.0 | 8.3 to 9.9 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 21.62 | 3.58 | 17.89 | 30.45 | 19.06 to 24.18 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 8.6 | 1.2 | 7.2 | 11.5 | 7.8 to 9.5 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 30.00 | 8.08 | 19.00 | 45.00 | 24.22 to 35.78 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 889.10 | 36.67 | 807.00 | 947.00 | 862.87 to 915.33 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 38.80 | 2.97 | 34.00 | 43.00 | 36.67 to 40.93 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 938.40 | 35.33 | 900.00 | 1005.00 | 913.13 to 963.67 |
| headline share | Hillegass Avenue NB from freeway | % | 52.0 | 4.1 | 45.9 | 59.7 | 49.1 to 55.0 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 2.5 | 1.6 | 0.7 | 5.7 | 1.4 to 3.7 |
| share | Hillegass Avenue NB to College Avenue | % | 14.9 | 3.3 | 6.9 | 18.0 | 12.5 to 17.2 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 27.5 | 3.2 | 23.2 | 34.0 | 25.2 to 29.8 |
| headline share | Colby Street NB from freeway | % | 36.3 | 3.2 | 31.5 | 40.2 | 34.0 to 38.6 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 53.8 | 3.7 | 47.2 | 59.7 | 51.2 to 56.5 |
| share | Colby Street NB to Telegraph Avenue | % | 36.5 | 4.6 | 26.1 | 43.4 | 33.2 to 39.8 |
| share | Colby Street NB to College Avenue | % | 6.3 | 1.5 | 3.3 | 8.4 | 5.2 to 7.3 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 28.9 | 3.6 | 22.2 | 33.3 | 26.3 to 31.5 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 3.0 | 1.2 | 2.0 | 6.0 | 2.1 to 3.8 |
| share | Hillegass Avenue SB from College Avenue | % | 14.2 | 3.3 | 9.8 | 19.2 | 11.8 to 16.6 |
| headline share | Hillegass Avenue SB to freeway | % | 55.9 | 4.8 | 48.1 | 64.4 | 52.5 to 59.3 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 21.2 | 3.5 | 15.7 | 25.7 | 18.7 to 23.7 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 17.5 | 2.8 | 13.7 | 22.1 | 15.6 to 19.5 |
| share | Colby Street SB from Telegraph Avenue | % | 16.8 | 2.8 | 12.6 | 21.3 | 14.8 to 18.8 |
| headline share | Colby Street SB to freeway | % | 48.5 | 4.3 | 39.4 | 55.8 | 45.4 to 51.6 |
| share | Colby Street SB to Forest Street | % | 12.3 | 3.1 | 7.3 | 17.1 | 10.1 to 14.5 |
| ramp share | onto freeway via College Avenue | % | 17.6 | 2.0 | 14.3 | 20.1 | 16.2 to 19.0 |
| ramp share | onto freeway via Hillegass Avenue | % | 15.8 | 2.1 | 13.0 | 19.2 | 14.3 to 17.3 |
| ramp share | onto freeway via Martin Street | % | 14.7 | 1.2 | 13.5 | 17.1 | 13.8 to 15.6 |
| ramp share | onto freeway via Colby Street | % | 13.4 | 2.5 | 8.2 | 17.2 | 11.5 to 15.2 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 8.9 | 0.9 | 8.1 | 10.6 | 8.3 to 9.6 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.6 | 1.1 | 3.1 | 6.6 | 3.9 to 5.4 |
| ramp share | from freeway via College Avenue | % | 10.5 | 1.7 | 8.4 | 13.3 | 9.3 to 11.7 |
| ramp share | from freeway via Martin Street | % | 12.2 | 1.8 | 9.3 | 14.5 | 10.8 to 13.5 |
| ramp share | from freeway via Colby Street | % | 10.8 | 1.3 | 8.4 | 13.4 | 9.9 to 11.7 |
| ramp share | from freeway via Hillegass Avenue | % | 7.6 | 1.6 | 5.5 | 10.0 | 6.5 to 8.8 |
| ramp share | from freeway via Benvenue Avenue | % | 2.6 | 1.3 | 1.5 | 4.8 | 1.7 to 3.6 |
| corridor flow | Telegraph N median link flow | veh/h | 611.64 | 40.82 | 550.80 | 672.00 | 582.44 to 640.84 |
| corridor flow | Telegraph S median link flow | veh/h | 419.52 | 24.35 | 374.40 | 463.20 | 402.10 to 436.94 |
| corridor flow | College N median link flow | veh/h | 235.08 | 27.78 | 196.80 | 288.00 | 215.21 to 254.95 |
| corridor flow | College S median link flow | veh/h | 409.56 | 27.21 | 373.20 | 464.40 | 390.10 to 429.02 |
| corridor flow | Claremont N median link flow | veh/h | 285.36 | 24.64 | 255.60 | 330.00 | 267.74 to 302.98 |
| corridor flow | Claremont S median link flow | veh/h | 200.28 | 21.45 | 172.80 | 235.20 | 184.93 to 215.63 |
| corridor flow | Alcatraz E median link flow | veh/h | 393.00 | 30.58 | 338.40 | 444.00 | 371.12 to 414.88 |
| corridor flow | Alcatraz W median link flow | veh/h | 257.64 | 20.51 | 228.00 | 295.20 | 242.97 to 272.31 |
| corridor flow | Hillegass N median link flow | veh/h | 77.76 | 10.44 | 57.60 | 90.00 | 70.29 to 85.23 |
| corridor flow | Hillegass S median link flow | veh/h | 82.20 | 10.15 | 68.40 | 92.40 | 74.94 to 89.46 |
| corridor flow | Colby N median link flow | veh/h | 90.24 | 9.41 | 78.00 | 105.60 | 83.51 to 96.97 |
| corridor flow | Colby S median link flow | veh/h | 74.52 | 13.69 | 58.80 | 97.20 | 64.73 to 84.31 |
| corridor flow | Martin E median link flow | veh/h | 79.08 | 7.49 | 66.00 | 90.00 | 73.72 to 84.44 |
| corridor flow | Martin W median link flow | veh/h | 71.28 | 10.15 | 55.20 | 86.40 | 64.02 to 78.54 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 37 | below |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 18 | below |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 4 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 6 | within |
| Intents listed, together | | 101 (71 to 131) | 66 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 31 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 37.1 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 5.5 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 5.4 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.2 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 3.2 | Claremont Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 2.5 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.5 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 1.6 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 0.8 | none near the study area |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 0.7 | College Avenue then Alcatraz Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 0.6 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.5 | Telegraph Avenue |
| other pairs | | 4.2 | |

By the arterial these cars would otherwise use: Telegraph Avenue 52 veh/h; none near the study area 6 veh/h; Claremont Avenue then College Avenue 3 veh/h; Claremont Avenue 2 veh/h; SR-24 then Claremont Avenue then College Avenue 2 veh/h; College Avenue then Alcatraz Avenue 1 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 11 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 22 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 4 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 11 | within |
| Intents listed, together | | 43 (20 to 68) | 49 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 39 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.8 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 7.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.6 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.2 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.4 | SR-24 then Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 2.0 | SR-24 then Telegraph Avenue |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 1.7 | College Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.6 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 1.3 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.2 | College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.8 | Claremont Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 0.7 | SR-24 |
| other pairs | | 7.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 16 veh/h; SR-24 15 veh/h; SR-24 then Claremont Avenue then College Avenue 4 veh/h; SR-24 then Claremont Avenue 3 veh/h; College Avenue then Alcatraz Avenue 3 veh/h; Claremont Avenue 3 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 25 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 33 | below |
| Intents listed, together | | 87 (78 to 110) | 57 | |
| Other through cars (no intent listed) | | | 14 | |

Model through cars by origin and destination group (largest 12 of 23 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 24.7 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.9 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.0 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.4 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 5.8 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.3 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.3 | Claremont Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.8 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 0.7 | Alcatraz Avenue then Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 0.7 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 0.6 | SR-24 |
| Emeryville and West Oakland streets (55th to 67th Streets) | College Ave from the north (Berkeley) | 0.6 | Claremont Avenue then College Avenue |
| other pairs | | 2.6 | |

By the arterial these cars would otherwise use: Telegraph Avenue 31 veh/h; Claremont Avenue then SR-24 22 veh/h; College Avenue then Claremont Avenue then SR-24 9 veh/h; Claremont Avenue 4 veh/h; College Avenue 2 veh/h; Alcatraz Avenue then College Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 12 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 8 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 26 | within |
| Intents listed, together | | 46 (39 to 72) | 46 | |
| Other through cars (no intent listed) | | | 24 | |

Model through cars by origin and destination group (largest 12 of 39 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.5 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.5 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 10.9 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.7 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.3 | College Avenue then Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.8 | none near the study area |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.6 | SR-24 |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.6 | Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.4 | SR-24 |
| Emeryville and West Oakland streets (55th to 67th Streets) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.2 | Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 1.0 | Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 0.9 | Telegraph Avenue |
| other pairs | | 10.5 | |

By the arterial these cars would otherwise use: Telegraph Avenue 37 veh/h; Claremont Avenue then SR-24 9 veh/h; Claremont Avenue 6 veh/h; SR-24 6 veh/h; College Avenue then Claremont Avenue then SR-24 4 veh/h; none near the study area 4 veh/h.

### Study area, all residential and service streets

Model: 337 through cars per hour.

Model through cars by origin and destination group (largest 12 of 108 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 44.3 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 37.6 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 30.9 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 27.9 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 19.4 | Claremont Avenue then SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 16.8 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 14.2 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 14.2 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 11.9 | Claremont Avenue then College Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.7 | College Avenue then Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 8.8 | none near the study area |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 6.0 | Telegraph Avenue |
| other pairs | | 94.3 | |

By the arterial these cars would otherwise use: Telegraph Avenue 193 veh/h; Claremont Avenue 25 veh/h; SR-24 24 veh/h; Claremont Avenue then SR-24 19 veh/h; none near the study area 17 veh/h; Claremont Avenue then College Avenue 14 veh/h.

By origin group: SR-24 eastbound off-ramps (arriving from Oakland and I-980) 81; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 78; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 42; Telegraph Ave from the north (Berkeley) 35; Claremont Ave and Tunnel Rd toward the hills 22; College Ave from the north (Berkeley) 15; Telegraph Ave to the south (downtown Oakland) 15; Emeryville and West Oakland streets (55th to 67th Streets) 10; West Oakland to the southwest (Adeline St, Market St) 9; Shattuck Ave from the north (Berkeley) 9.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 105; Telegraph Ave from the north (Berkeley) 67; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 42; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 40; Claremont Ave and Tunnel Rd toward the hills 27; Ashby Ave from the west (Emeryville and I-80) 12; College Ave from the north (Berkeley) 10; Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) 5; San Pablo Ave (Emeryville and West Oakland) 5; West Oakland to the southwest (Adeline St, Market St) 4.


Per-seed detail: `rockridge-midday-s1-seed1.md` (seed 1 in full).
