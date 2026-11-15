# rockridge-am_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 2.00 (min 0.00, max 4.00) | NO |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 8.61 m/s | yes |

**Verdict: not stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 1 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 2.00 | 1.25 | 0.00 | 4.00 | 1.11 to 2.89 |
| health | gridlock removals per hour | veh/h | 2.00 | 1.25 | 0.00 | 4.00 | 1.11 to 2.89 |
| health | entry backlog | % of spawned | 0.01 | 0.01 | 0.00 | 0.03 | 0.01 to 0.02 |
| health | backlog growth in the second half of the run | points of spawned | -0.01 | 0.03 | -0.08 | 0.03 | -0.03 to 0.01 |
| health | completed trips | trips | 21905.10 | 204.38 | 21471.00 | 22243.00 | 21758.91 to 22051.29 |
| health | arterial mean speed | m/s | 8.61 | 0.16 | 8.40 | 8.95 | 8.50 to 8.73 |
| health | arterial mean speed, last 15 min | m/s | 8.55 | 0.18 | 8.28 | 8.82 | 8.42 to 8.68 |
| junction recovery | courtesy admissions per hour | veh/h | 261.10 | 39.60 | 192.00 | 310.00 | 232.77 to 289.43 |
| junction recovery | yield fallback admissions per hour | veh/h | 121.60 | 19.75 | 84.00 | 140.00 | 107.47 to 135.73 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 23.47 | 3.17 | 19.45 | 29.94 | 21.21 to 25.74 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 6.2 | 0.7 | 5.3 | 7.4 | 5.7 to 6.8 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 20.50 | 3.28 | 16.34 | 26.51 | 18.15 to 22.85 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 5.5 | 0.8 | 4.0 | 6.9 | 4.9 to 6.1 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 34.40 | 5.93 | 26.00 | 45.00 | 30.16 to 38.64 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1075.40 | 31.91 | 1016.00 | 1115.00 | 1052.57 to 1098.23 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 35.30 | 7.97 | 20.00 | 46.00 | 29.60 to 41.00 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1226.90 | 40.31 | 1158.00 | 1279.00 | 1198.06 to 1255.74 |
| headline share | Hillegass Avenue NB from freeway | % | 52.7 | 3.3 | 46.5 | 58.9 | 50.3 to 55.0 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 8.7 | 2.6 | 5.4 | 15.0 | 6.8 to 10.6 |
| share | Hillegass Avenue NB to College Avenue | % | 12.9 | 1.8 | 9.4 | 15.1 | 11.6 to 14.2 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 26.7 | 3.7 | 22.1 | 35.5 | 24.1 to 29.4 |
| headline share | Colby Street NB from freeway | % | 45.4 | 3.1 | 42.5 | 53.9 | 43.1 to 47.6 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 44.1 | 3.9 | 37.9 | 50.0 | 41.2 to 46.9 |
| share | Colby Street NB to Telegraph Avenue | % | 43.3 | 4.4 | 38.3 | 52.3 | 40.2 to 46.5 |
| share | Colby Street NB to College Avenue | % | 2.8 | 0.8 | 1.7 | 4.4 | 2.2 to 3.4 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 21.8 | 3.6 | 17.4 | 26.8 | 19.2 to 24.4 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 2.1 | 1.7 | 0.7 | 6.3 | 0.9 to 3.4 |
| share | Hillegass Avenue SB from College Avenue | % | 10.3 | 3.2 | 6.0 | 15.8 | 8.0 to 12.5 |
| headline share | Hillegass Avenue SB to freeway | % | 58.2 | 3.7 | 51.9 | 62.9 | 55.5 to 60.8 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 19.8 | 2.8 | 15.8 | 24.9 | 17.8 to 21.8 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 10.9 | 1.6 | 9.0 | 13.8 | 9.7 to 12.0 |
| share | Colby Street SB from Telegraph Avenue | % | 21.4 | 3.6 | 13.5 | 27.2 | 18.9 to 24.0 |
| headline share | Colby Street SB to freeway | % | 48.5 | 2.6 | 44.0 | 53.8 | 46.6 to 50.3 |
| share | Colby Street SB to Forest Street | % | 10.5 | 2.0 | 7.0 | 13.1 | 9.0 to 11.9 |
| ramp share | onto freeway via College Avenue | % | 15.3 | 0.8 | 14.2 | 16.5 | 14.8 to 15.9 |
| ramp share | onto freeway via Hillegass Avenue | % | 13.6 | 1.4 | 11.8 | 15.7 | 12.7 to 14.6 |
| ramp share | onto freeway via Martin Street | % | 16.2 | 1.7 | 13.0 | 18.8 | 15.0 to 17.4 |
| ramp share | onto freeway via Colby Street | % | 16.7 | 1.3 | 14.6 | 18.4 | 15.8 to 17.7 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 11.1 | 1.6 | 8.5 | 13.8 | 9.9 to 12.2 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.6 | 1.0 | 2.4 | 5.9 | 3.9 to 5.3 |
| ramp share | from freeway via College Avenue | % | 11.3 | 1.5 | 8.9 | 13.6 | 10.2 to 12.3 |
| ramp share | from freeway via Martin Street | % | 13.1 | 0.8 | 11.9 | 14.6 | 12.5 to 13.7 |
| ramp share | from freeway via Colby Street | % | 11.9 | 1.0 | 10.9 | 14.4 | 11.2 to 12.6 |
| ramp share | from freeway via Hillegass Avenue | % | 7.0 | 1.2 | 4.5 | 8.2 | 6.2 to 7.9 |
| ramp share | from freeway via Benvenue Avenue | % | 3.0 | 0.7 | 1.8 | 4.2 | 2.5 to 3.5 |
| corridor flow | Telegraph N median link flow | veh/h | 775.56 | 40.96 | 694.80 | 842.40 | 746.26 to 804.86 |
| corridor flow | Telegraph S median link flow | veh/h | 824.88 | 67.97 | 736.80 | 924.00 | 776.26 to 873.50 |
| corridor flow | College N median link flow | veh/h | 216.96 | 13.78 | 190.80 | 234.00 | 207.10 to 226.82 |
| corridor flow | College S median link flow | veh/h | 419.04 | 27.04 | 375.60 | 452.40 | 399.70 to 438.38 |
| corridor flow | Claremont N median link flow | veh/h | 414.84 | 17.08 | 382.80 | 433.20 | 402.62 to 427.06 |
| corridor flow | Claremont S median link flow | veh/h | 430.08 | 25.12 | 386.40 | 477.60 | 412.11 to 448.05 |
| corridor flow | Alcatraz E median link flow | veh/h | 381.12 | 25.55 | 351.60 | 445.20 | 362.84 to 399.40 |
| corridor flow | Alcatraz W median link flow | veh/h | 301.08 | 33.18 | 258.00 | 356.40 | 277.35 to 324.81 |
| corridor flow | Hillegass N median link flow | veh/h | 99.12 | 8.77 | 91.20 | 115.20 | 92.85 to 105.39 |
| corridor flow | Hillegass S median link flow | veh/h | 82.20 | 9.54 | 64.80 | 94.80 | 75.38 to 89.02 |
| corridor flow | Colby N median link flow | veh/h | 119.64 | 6.53 | 106.80 | 127.20 | 114.97 to 124.31 |
| corridor flow | Colby S median link flow | veh/h | 160.32 | 16.13 | 133.20 | 195.60 | 148.78 to 171.86 |
| corridor flow | Martin E median link flow | veh/h | 131.40 | 17.69 | 105.60 | 157.20 | 118.74 to 144.06 |
| corridor flow | Martin W median link flow | veh/h | 103.56 | 7.04 | 92.40 | 116.40 | 98.52 to 108.60 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 34 | below |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 19 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 2 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 18 | above |
| Intents listed, together | | 101 (71 to 131) | 73 | |
| Other through cars (no intent listed) | | | 3 | |

Model through cars by origin and destination group (largest 12 of 42 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 34.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 16.4 | Claremont Avenue then College Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 7.7 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 2.9 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 2.7 | College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 1.6 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 1.6 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.6 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.1 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 1.0 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.0 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 0.4 | Claremont Avenue then Alcatraz Avenue |
| other pairs | | 4.7 | |

By the arterial these cars would otherwise use: Telegraph Avenue 47 veh/h; Claremont Avenue then College Avenue then Alcatraz Avenue 16 veh/h; College Avenue 4 veh/h; Claremont Avenue 4 veh/h; SR-24 2 veh/h; Claremont Avenue then Alcatraz Avenue 1 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 14 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 25 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 8 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 15 | above |
| Intents listed, together | | 43 (20 to 68) | 61 | |
| Other through cars (no intent listed) | | | 5 | |

Model through cars by origin and destination group (largest 12 of 49 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.6 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 7.8 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.9 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 5.8 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.4 | SR-24 then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 2.8 | College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.3 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 2.1 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.9 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.6 | SR-24 then Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 1.2 | College Avenue then Alcatraz Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.2 | Claremont Avenue |
| other pairs | | 13.6 | |

By the arterial these cars would otherwise use: Telegraph Avenue 22 veh/h; SR-24 15 veh/h; SR-24 then Claremont Avenue then College Avenue 6 veh/h; SR-24 then Claremont Avenue 5 veh/h; Claremont Avenue 4 veh/h; none near the study area 4 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 15 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 24 | below |
| Intents listed, together | | 87 (78 to 110) | 39 | |
| Other through cars (no intent listed) | | | 40 | |

Model through cars by origin and destination group (largest 12 of 29 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 23.5 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.8 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.7 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.3 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 5.2 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 5.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.8 | Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.3 | Telegraph Avenue |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 0.9 | Alcatraz Avenue then Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 0.5 | College Avenue then Alcatraz Avenue |
| Claremont Ave and Tunnel Rd toward the hills | Emeryville and West Oakland streets (55th to 67th Streets) | 0.5 | Claremont Avenue |
| Shattuck Ave from the north (Berkeley) | Oakland hills to the east (Broadway Terrace, Mountain Blvd, Moraga Ave) | 0.5 | SR-24 |
| other pairs | | 3.3 | |

By the arterial these cars would otherwise use: Telegraph Avenue 50 veh/h; Claremont Avenue then SR-24 18 veh/h; College Avenue then Claremont Avenue then SR-24 5 veh/h; Claremont Avenue 1 veh/h; Alcatraz Avenue then Telegraph Avenue 1 veh/h; College Avenue then Alcatraz Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 13 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 22 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 30 | above |
| Intents listed, together | | 46 (39 to 72) | 65 | |
| Other through cars (no intent listed) | | | 68 | |

Model through cars by origin and destination group (largest 12 of 57 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 30.4 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 28.3 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.5 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.3 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 9.9 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 6.9 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 4.1 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.9 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.2 | SR-24 |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 2.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 1.9 | none near the study area |
| Alcatraz Ave from the west (Emeryville side) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.8 | SR-24 |
| other pairs | | 19.3 | |

By the arterial these cars would otherwise use: Telegraph Avenue 92 veh/h; none near the study area 18 veh/h; SR-24 9 veh/h; Claremont Avenue 5 veh/h; Alcatraz Avenue then College Avenue 2 veh/h; College Avenue then Claremont Avenue 2 veh/h.

### Study area, all residential and service streets

Model: 534 through cars per hour.

Model through cars by origin and destination group (largest 12 of 124 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 67.5 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 66.7 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 43.5 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 32.9 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | SR-24 westbound on-ramps (toward Oakland and I-980) | 26.7 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.6 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 20.2 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 15.8 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.4 | none near the study area |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.7 | Claremont Avenue then SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.7 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 11.5 | Telegraph Avenue |
| other pairs | | 181.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 345 veh/h; Claremont Avenue 44 veh/h; SR-24 34 veh/h; none near the study area 29 veh/h; Claremont Avenue then SR-24 14 veh/h; Telegraph Avenue then Claremont Avenue 12 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 176; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 84; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 69; Telegraph Ave to the south (downtown Oakland) 45; Telegraph Ave from the north (Berkeley) 38; Claremont Ave and Tunnel Rd toward the hills 25; West Oakland to the southwest (Adeline St, Market St) 24; Shattuck Ave from the north (Berkeley) 16; College Ave from the north (Berkeley) 11; Emeryville and West Oakland streets (55th to 67th Streets) 10.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 157; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 100; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 63; Telegraph Ave from the north (Berkeley) 62; Claremont Ave and Tunnel Rd toward the hills 27; West Oakland to the southwest (Adeline St, Market St) 19; College Ave from the north (Berkeley) 17; Telegraph Ave to the south (downtown Oakland) 15; Emeryville and West Oakland streets (55th to 67th Streets) 14; Ashby Ave from the west (Emeryville and I-80) 12.


Per-seed detail: `rockridge-am_peak-s1-seed1.md` (seed 1 in full).
