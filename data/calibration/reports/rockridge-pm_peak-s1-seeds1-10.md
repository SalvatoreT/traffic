# rockridge-pm_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 3.60 (min 1.00, max 6.00) | NO |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 7.91 m/s | yes |

**Verdict: not stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 0 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 3.60 | 1.78 | 1.00 | 6.00 | 2.33 to 4.87 |
| health | gridlock removals per hour | veh/h | 3.60 | 1.78 | 1.00 | 6.00 | 2.33 to 4.87 |
| health | entry backlog | % of spawned | 0.18 | 0.17 | 0.03 | 0.50 | 0.06 to 0.30 |
| health | backlog growth in the second half of the run | points of spawned | 0.11 | 0.14 | -0.09 | 0.36 | 0.01 to 0.21 |
| health | completed trips | trips | 24570.40 | 198.80 | 24089.00 | 24758.00 | 24428.20 to 24712.60 |
| health | arterial mean speed | m/s | 7.91 | 0.15 | 7.70 | 8.22 | 7.80 to 8.02 |
| health | arterial mean speed, last 15 min | m/s | 7.70 | 0.27 | 7.37 | 8.24 | 7.51 to 7.89 |
| junction recovery | courtesy admissions per hour | veh/h | 416.20 | 33.37 | 354.00 | 465.00 | 392.33 to 440.07 |
| junction recovery | yield fallback admissions per hour | veh/h | 191.70 | 24.13 | 156.00 | 224.00 | 174.44 to 208.96 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.30 | 0.48 | 0.00 | 1.00 | -0.05 to 0.65 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 42.25 | 4.29 | 33.27 | 47.68 | 39.18 to 45.32 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 7.2 | 0.8 | 5.6 | 8.0 | 6.6 to 7.7 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 34.30 | 4.29 | 27.52 | 40.01 | 31.23 to 37.36 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 5.8 | 0.8 | 4.7 | 6.9 | 5.2 to 6.4 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 48.20 | 6.39 | 38.00 | 59.00 | 43.63 to 52.77 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1308.60 | 34.41 | 1238.00 | 1357.00 | 1283.99 to 1333.21 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 94.70 | 10.70 | 77.00 | 108.00 | 87.05 to 102.35 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1494.40 | 56.94 | 1372.00 | 1568.00 | 1453.67 to 1535.13 |
| headline share | Hillegass Avenue NB from freeway | % | 52.8 | 3.0 | 48.1 | 58.8 | 50.6 to 54.9 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 4.2 | 1.5 | 1.9 | 6.9 | 3.1 to 5.3 |
| share | Hillegass Avenue NB to College Avenue | % | 17.3 | 3.6 | 10.0 | 21.5 | 14.8 to 19.9 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 21.6 | 4.0 | 14.3 | 25.7 | 18.7 to 24.4 |
| headline share | Colby Street NB from freeway | % | 37.8 | 3.2 | 32.8 | 43.1 | 35.5 to 40.1 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 46.6 | 2.9 | 41.2 | 50.6 | 44.5 to 48.7 |
| share | Colby Street NB to Telegraph Avenue | % | 46.1 | 3.6 | 41.6 | 52.5 | 43.5 to 48.7 |
| share | Colby Street NB to College Avenue | % | 5.6 | 1.6 | 3.3 | 7.8 | 4.4 to 6.8 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 25.6 | 3.0 | 20.9 | 30.6 | 23.4 to 27.7 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 4.8 | 1.4 | 2.5 | 7.3 | 3.8 to 5.8 |
| share | Hillegass Avenue SB from College Avenue | % | 14.4 | 2.8 | 8.9 | 19.0 | 12.5 to 16.4 |
| headline share | Hillegass Avenue SB to freeway | % | 47.1 | 1.7 | 43.7 | 50.4 | 45.9 to 48.4 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 26.4 | 3.3 | 22.4 | 32.2 | 24.0 to 28.8 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 16.5 | 1.1 | 15.2 | 18.2 | 15.7 to 17.2 |
| share | Colby Street SB from Telegraph Avenue | % | 33.2 | 2.8 | 29.8 | 40.3 | 31.2 to 35.2 |
| headline share | Colby Street SB to freeway | % | 31.1 | 5.4 | 21.5 | 37.9 | 27.2 to 34.9 |
| share | Colby Street SB to Forest Street | % | 23.1 | 3.5 | 16.6 | 28.1 | 20.6 to 25.6 |
| ramp share | onto freeway via College Avenue | % | 13.0 | 1.8 | 10.4 | 16.1 | 11.7 to 14.2 |
| ramp share | onto freeway via Hillegass Avenue | % | 15.9 | 1.7 | 13.6 | 19.4 | 14.6 to 17.1 |
| ramp share | onto freeway via Martin Street | % | 13.1 | 2.0 | 9.9 | 17.7 | 11.6 to 14.5 |
| ramp share | onto freeway via Colby Street | % | 11.9 | 1.5 | 9.4 | 14.5 | 10.9 to 13.0 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 15.1 | 1.5 | 13.3 | 18.0 | 14.1 to 16.1 |
| ramp share | onto freeway via Benvenue Avenue | % | 2.1 | 0.5 | 0.9 | 2.8 | 1.7 to 2.5 |
| ramp share | from freeway via College Avenue | % | 10.4 | 0.9 | 9.1 | 12.2 | 9.7 to 11.0 |
| ramp share | from freeway via Martin Street | % | 12.5 | 1.2 | 11.3 | 14.2 | 11.7 to 13.4 |
| ramp share | from freeway via Colby Street | % | 12.8 | 1.1 | 10.7 | 13.9 | 12.0 to 13.5 |
| ramp share | from freeway via Hillegass Avenue | % | 8.1 | 1.2 | 6.8 | 10.4 | 7.3 to 9.0 |
| ramp share | from freeway via Benvenue Avenue | % | 3.0 | 1.0 | 2.0 | 5.8 | 2.3 to 3.8 |
| corridor flow | Telegraph N median link flow | veh/h | 967.32 | 59.18 | 895.20 | 1072.80 | 924.99 to 1009.65 |
| corridor flow | Telegraph S median link flow | veh/h | 954.36 | 92.51 | 852.00 | 1098.00 | 888.19 to 1020.53 |
| corridor flow | College N median link flow | veh/h | 420.12 | 37.50 | 356.40 | 486.00 | 393.30 to 446.94 |
| corridor flow | College S median link flow | veh/h | 617.28 | 82.78 | 448.80 | 745.20 | 558.07 to 676.49 |
| corridor flow | Claremont N median link flow | veh/h | 495.00 | 48.29 | 399.60 | 558.00 | 460.46 to 529.54 |
| corridor flow | Claremont S median link flow | veh/h | 383.52 | 35.48 | 333.60 | 439.20 | 358.14 to 408.90 |
| corridor flow | Alcatraz E median link flow | veh/h | 467.40 | 16.03 | 448.80 | 490.80 | 455.93 to 478.87 |
| corridor flow | Alcatraz W median link flow | veh/h | 347.76 | 31.70 | 295.20 | 406.80 | 325.08 to 370.44 |
| corridor flow | Hillegass N median link flow | veh/h | 127.68 | 13.20 | 110.40 | 145.20 | 118.24 to 137.12 |
| corridor flow | Hillegass S median link flow | veh/h | 213.00 | 25.76 | 177.60 | 256.80 | 194.58 to 231.42 |
| corridor flow | Colby N median link flow | veh/h | 168.00 | 15.80 | 147.60 | 198.00 | 156.70 to 179.30 |
| corridor flow | Colby S median link flow | veh/h | 213.48 | 15.72 | 190.80 | 249.60 | 202.23 to 224.73 |
| corridor flow | Martin E median link flow | veh/h | 165.12 | 21.56 | 122.40 | 194.40 | 149.70 to 180.54 |
| corridor flow | Martin W median link flow | veh/h | 173.16 | 33.45 | 110.40 | 206.40 | 149.23 to 197.09 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 159 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 62 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 50 | above |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 9 | within |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 35 | above |
| Intents listed, together | | 101 (71 to 131) | 155 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 38 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 61.6 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 29.2 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 19.5 | Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 8.1 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 7.4 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 6.6 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.9 | SR-24 then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 4.2 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 4.1 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 2.7 | SR-24 then Claremont Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.7 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 1.5 | College Avenue then Alcatraz Avenue |
| other pairs | | 6.8 | |

By the arterial these cars would otherwise use: Telegraph Avenue 104 veh/h; Claremont Avenue then College Avenue 20 veh/h; Claremont Avenue 16 veh/h; none near the study area 7 veh/h; SR-24 then Claremont Avenue 6 veh/h; SR-24 then Claremont Avenue then College Avenue 3 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 84 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 15 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 34 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 6 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 24 | above |
| Intents listed, together | | 43 (20 to 68) | 79 | |
| Other through cars (no intent listed) | | | 5 | |

Model through cars by origin and destination group (largest 12 of 43 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 20.6 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 12.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 9.5 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.6 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 6.0 | SR-24 then Claremont Avenue then College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.9 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 2.8 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 2.0 | Claremont Avenue then College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 1.8 | none near the study area |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Alcatraz Ave from the west (Emeryville side) | 1.6 | SR-24 then Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 1.5 | College Avenue then Alcatraz Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.4 | Telegraph Avenue |
| other pairs | | 13.1 | |

By the arterial these cars would otherwise use: Telegraph Avenue 30 veh/h; SR-24 22 veh/h; SR-24 then Claremont Avenue 7 veh/h; Claremont Avenue 6 veh/h; SR-24 then Claremont Avenue then College Avenue 6 veh/h; none near the study area 3 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 193 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 41 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 58 | within |
| Intents listed, together | | 87 (78 to 110) | 100 | |
| Other through cars (no intent listed) | | | 93 | |

Model through cars by origin and destination group (largest 12 of 51 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 39.7 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 32.2 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 26.7 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 26.2 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 16.2 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.4 | College Avenue then Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 7.4 | College Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.2 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 3.4 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.7 | Alcatraz Avenue then College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.9 | Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.8 | Claremont Avenue |
| other pairs | | 15.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 104 veh/h; Alcatraz Avenue then College Avenue 30 veh/h; Claremont Avenue then SR-24 16 veh/h; College Avenue 15 veh/h; College Avenue then Claremont Avenue then SR-24 12 veh/h; none near the study area 4 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 218 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 14 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 22 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 43 | above |
| Intents listed, together | | 46 (39 to 72) | 79 | |
| Other through cars (no intent listed) | | | 140 | |

Model through cars by origin and destination group (largest 12 of 66 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 70.3 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 26.6 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 18.7 | Alcatraz Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 12.8 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.4 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.1 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 9.1 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.3 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.8 | College Avenue then Claremont Avenue then SR-24 |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.0 | none near the study area |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.9 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 3.1 | Telegraph Avenue |
| other pairs | | 30.1 | |

By the arterial these cars would otherwise use: Telegraph Avenue 138 veh/h; none near the study area 23 veh/h; Alcatraz Avenue then College Avenue 21 veh/h; Claremont Avenue then SR-24 8 veh/h; College Avenue then Claremont Avenue then SR-24 7 veh/h; SR-24 6 veh/h.

### Study area, all residential and service streets

Model: 1070 through cars per hour.

Model through cars by origin and destination group (largest 12 of 131 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 171.6 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 91.5 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 91.1 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 73.6 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 59.7 | Claremont Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 49.4 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 45.0 | Alcatraz Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 38.2 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | SR-24 westbound on-ramps (toward Oakland and I-980) | 33.9 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 32.8 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 32.5 | Telegraph Avenue then Claremont Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 23.4 | Claremont Avenue then SR-24 |
| other pairs | | 327.2 | |

By the arterial these cars would otherwise use: Telegraph Avenue 628 veh/h; none near the study area 91 veh/h; Claremont Avenue 70 veh/h; Claremont Avenue then College Avenue 60 veh/h; Alcatraz Avenue then College Avenue 51 veh/h; SR-24 33 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 304; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 210; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 126; Telegraph Ave from the north (Berkeley) 95; Ashby Ave from the west (Emeryville and I-80) 61; Telegraph Ave to the south (downtown Oakland) 54; West Oakland to the southwest (Adeline St, Market St) 49; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 36; Claremont Ave and Tunnel Rd toward the hills 30; Emeryville and West Oakland streets (55th to 67th Streets) 24.

By destination group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 270; SR-24 westbound on-ramps (toward Oakland and I-980) 263; Telegraph Ave from the north (Berkeley) 151; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 150; College Ave from the north (Berkeley) 57; Claremont Ave and Tunnel Rd toward the hills 48; Emeryville and West Oakland streets (55th to 67th Streets) 37; Telegraph Ave to the south (downtown Oakland) 22; Shattuck Ave from the north (Berkeley) 15; San Pablo Ave (Emeryville and West Oakland) 13.


Per-seed detail: `rockridge-pm_peak-s1-seed1.md` (seed 1 in full).
