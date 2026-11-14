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
| health | backlog growth in the second half of the run | points of spawned | 0.00 | 0.00 | -0.01 | 0.01 | -0.00 to 0.01 |
| health | completed trips | trips | 15999.70 | 121.47 | 15819.00 | 16176.00 | 15912.81 to 16086.59 |
| health | arterial mean speed | m/s | 10.03 | 0.06 | 9.94 | 10.09 | 9.99 to 10.07 |
| health | arterial mean speed, last 15 min | m/s | 10.06 | 0.09 | 9.93 | 10.16 | 10.00 to 10.12 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 25.12 | 3.62 | 18.45 | 29.19 | 22.53 to 27.71 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 10.1 | 1.1 | 8.0 | 11.5 | 9.3 to 10.9 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 21.14 | 2.64 | 16.26 | 26.09 | 19.26 to 23.03 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 8.5 | 1.2 | 6.2 | 10.8 | 7.6 to 9.4 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 23.20 | 4.32 | 20.00 | 31.00 | 20.11 to 26.29 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 943.40 | 24.77 | 902.00 | 985.00 | 925.68 to 961.12 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 40.40 | 4.88 | 32.00 | 47.00 | 36.91 to 43.89 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 984.00 | 23.79 | 947.00 | 1029.00 | 966.99 to 1001.01 |
| headline share | Hillegass Avenue NB from freeway | % | 49.0 | 4.2 | 38.1 | 52.8 | 45.9 to 52.0 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 3.1 | 1.1 | 0.7 | 4.7 | 2.3 to 4.0 |
| share | Hillegass Avenue NB to College Avenue | % | 14.1 | 4.2 | 7.0 | 18.1 | 11.1 to 17.1 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 30.8 | 6.1 | 24.5 | 39.9 | 26.5 to 35.2 |
| headline share | Colby Street NB from freeway | % | 37.2 | 3.8 | 32.0 | 43.8 | 34.5 to 40.0 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 66.2 | 3.8 | 58.1 | 70.5 | 63.5 to 69.0 |
| share | Colby Street NB to Telegraph Avenue | % | 34.3 | 2.7 | 30.1 | 38.9 | 32.3 to 36.2 |
| share | Colby Street NB to College Avenue | % | 6.6 | 1.4 | 5.1 | 9.7 | 5.6 to 7.6 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 31.1 | 5.1 | 19.0 | 36.5 | 27.5 to 34.7 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 1.6 | 1.2 | 0.0 | 3.5 | 0.8 to 2.5 |
| share | Hillegass Avenue SB from College Avenue | % | 13.0 | 3.1 | 5.3 | 15.8 | 10.7 to 15.2 |
| headline share | Hillegass Avenue SB to freeway | % | 64.5 | 6.2 | 50.9 | 72.0 | 60.1 to 68.9 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 21.2 | 3.1 | 15.0 | 25.7 | 19.0 to 23.4 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 21.6 | 4.9 | 16.0 | 30.3 | 18.1 to 25.2 |
| share | Colby Street SB from Telegraph Avenue | % | 18.4 | 2.4 | 15.6 | 21.5 | 16.7 to 20.1 |
| headline share | Colby Street SB to freeway | % | 44.5 | 7.0 | 37.1 | 59.4 | 39.6 to 49.5 |
| share | Colby Street SB to Forest Street | % | 15.6 | 3.8 | 9.2 | 22.9 | 12.9 to 18.3 |
| ramp share | onto freeway via College Avenue | % | 19.8 | 3.2 | 13.6 | 24.2 | 17.5 to 22.0 |
| ramp share | onto freeway via Hillegass Avenue | % | 15.5 | 1.7 | 12.7 | 17.6 | 14.3 to 16.8 |
| ramp share | onto freeway via Martin Street | % | 16.2 | 2.6 | 12.1 | 19.9 | 14.3 to 18.0 |
| ramp share | onto freeway via Colby Street | % | 12.7 | 4.0 | 9.2 | 22.9 | 9.9 to 15.5 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 11.1 | 1.2 | 8.9 | 13.4 | 10.2 to 12.0 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.3 | 0.8 | 3.0 | 5.5 | 3.7 to 4.8 |
| ramp share | from freeway via College Avenue | % | 10.1 | 1.0 | 8.8 | 12.3 | 9.5 to 10.8 |
| ramp share | from freeway via Martin Street | % | 11.9 | 1.9 | 9.1 | 15.1 | 10.6 to 13.3 |
| ramp share | from freeway via Colby Street | % | 11.2 | 2.0 | 8.7 | 14.4 | 9.8 to 12.6 |
| ramp share | from freeway via Hillegass Avenue | % | 7.4 | 1.2 | 5.9 | 9.5 | 6.5 to 8.3 |
| ramp share | from freeway via Benvenue Avenue | % | 2.7 | 1.0 | 1.4 | 4.7 | 2.0 to 3.4 |
| corridor flow | Telegraph N median link flow | veh/h | 562.92 | 35.82 | 523.20 | 636.00 | 537.30 to 588.54 |
| corridor flow | Telegraph S median link flow | veh/h | 436.32 | 33.44 | 382.80 | 499.20 | 412.40 to 460.24 |
| corridor flow | College N median link flow | veh/h | 222.36 | 15.31 | 195.60 | 244.80 | 211.41 to 233.31 |
| corridor flow | College S median link flow | veh/h | 415.20 | 25.81 | 374.40 | 462.00 | 396.74 to 433.66 |
| corridor flow | Claremont N median link flow | veh/h | 274.08 | 33.01 | 205.20 | 315.60 | 250.46 to 297.70 |
| corridor flow | Claremont S median link flow | veh/h | 204.84 | 37.75 | 124.80 | 250.80 | 177.83 to 231.85 |
| corridor flow | Alcatraz E median link flow | veh/h | 379.44 | 28.85 | 345.60 | 421.20 | 358.80 to 400.08 |
| corridor flow | Alcatraz W median link flow | veh/h | 218.76 | 10.34 | 196.80 | 232.80 | 211.36 to 226.16 |
| corridor flow | Hillegass N median link flow | veh/h | 73.92 | 7.16 | 64.80 | 88.80 | 68.80 to 79.04 |
| corridor flow | Hillegass S median link flow | veh/h | 66.12 | 6.49 | 57.60 | 80.40 | 61.48 to 70.76 |
| corridor flow | Colby N median link flow | veh/h | 80.28 | 7.49 | 69.60 | 91.20 | 74.92 to 85.64 |
| corridor flow | Colby S median link flow | veh/h | 70.08 | 7.92 | 61.20 | 86.40 | 64.41 to 75.75 |
| corridor flow | Martin E median link flow | veh/h | 97.68 | 11.75 | 84.00 | 112.80 | 89.28 to 106.08 |
| corridor flow | Martin W median link flow | veh/h | 84.00 | 9.81 | 73.20 | 102.00 | 76.98 to 91.02 |

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

Model through cars by origin and destination group (largest 12 of 36 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 21.7 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 7.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 6.0 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 5.9 | SR-24 |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 5.4 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 5.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.6 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 4.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 3.0 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Alcatraz Ave from the west (Emeryville side) | 2.8 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 2.7 | SR-24 then Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 2.2 | SR-24 then Claremont Avenue then College Avenue |
| other pairs | | 13.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 40 veh/h; none near the study area 17 veh/h; Claremont Avenue 8 veh/h; SR-24 6 veh/h; SR-24 then Telegraph Avenue 6 veh/h; SR-24 then Telegraph Avenue then Alcatraz Avenue 3 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 10 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 18 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 9 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 9 | within |
| Intents listed, together | | 43 (20 to 68) | 46 | |
| Other through cars (no intent listed) | | | 3 | |

Model through cars by origin and destination group (largest 12 of 33 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 10.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 7.1 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.6 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.5 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.4 | SR-24 then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 2.5 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 2.2 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 2.1 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.9 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Claremont Ave and Tunnel Rd toward the hills | 1.5 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 1.2 | none near the study area |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.1 | Claremont Avenue then Alcatraz Avenue |
| other pairs | | 7.5 | |

By the arterial these cars would otherwise use: Telegraph Avenue 12 veh/h; SR-24 11 veh/h; none near the study area 6 veh/h; SR-24 then Claremont Avenue then College Avenue 5 veh/h; Claremont Avenue 4 veh/h; College Avenue then Alcatraz Avenue 4 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 23 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 31 | below |
| Intents listed, together | | 87 (78 to 110) | 54 | |
| Other through cars (no intent listed) | | | 12 | |

Model through cars by origin and destination group (largest 12 of 28 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 23.2 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.6 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.2 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.9 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 5.6 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.8 | Alcatraz Avenue then College Avenue |
| Alcatraz Ave from the west (Emeryville side) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 1.4 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 0.9 | Claremont Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.9 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 0.6 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.2 | Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Oakland hills to the east (Broadway Terrace, Mountain Blvd, Moraga Ave) | 0.2 | none near the study area |
| other pairs | | 1.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 29 veh/h; Claremont Avenue then SR-24 23 veh/h; College Avenue then Claremont Avenue then SR-24 7 veh/h; Alcatraz Avenue then College Avenue 3 veh/h; Claremont Avenue 2 veh/h; SR-24 2 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 12 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 9 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 24 | within |
| Intents listed, together | | 46 (39 to 72) | 45 | |
| Other through cars (no intent listed) | | | 18 | |

Model through cars by origin and destination group (largest 12 of 39 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.8 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.9 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.5 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 7.7 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.5 | none near the study area |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.6 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 1.6 | Claremont Avenue |
| Alcatraz Ave from the west (Emeryville side) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.4 | Alcatraz Avenue then College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.3 | SR-24 |
| Emeryville and West Oakland streets (55th to 67th Streets) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.3 | Alcatraz Avenue then College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 1.2 | SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.1 | none near the study area |
| other pairs | | 7.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 33 veh/h; Claremont Avenue then SR-24 8 veh/h; none near the study area 6 veh/h; SR-24 5 veh/h; Claremont Avenue 3 veh/h; Alcatraz Avenue then College Avenue 3 veh/h.

### Study area, all residential and service streets

Model: 375 through cars per hour.

Model through cars by origin and destination group (largest 12 of 97 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 37.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 32.6 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 29.1 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 23.6 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 19.4 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 17.4 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 17.3 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 16.3 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 15.3 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 15.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 11.6 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 10.6 | Claremont Avenue |
| other pairs | | 130.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 169 veh/h; Claremont Avenue 93 veh/h; SR-24 25 veh/h; Claremont Avenue then SR-24 19 veh/h; none near the study area 15 veh/h; College Avenue then Claremont Avenue then SR-24 9 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 94; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 62; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 62; Telegraph Ave from the north (Berkeley) 40; Claremont Ave and Tunnel Rd toward the hills 21; West Oakland to the southwest (Adeline St, Market St) 18; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 16; Telegraph Ave to the south (downtown Oakland) 13; Emeryville and West Oakland streets (55th to 67th Streets) 12; College Ave from the north (Berkeley) 11.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 105; Telegraph Ave from the north (Berkeley) 48; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 37; Claremont Ave and Tunnel Rd toward the hills 37; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 33; Ashby Ave from the west (Emeryville and I-80) 22; Alcatraz Ave from the west (Emeryville side) 21; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 17; Shattuck Ave from the north (Berkeley) 13; Telegraph Ave to the south (downtown Oakland) 11.


Per-seed detail: `rockridge-midday-s1-seed1.md` (seed 1 in full).
