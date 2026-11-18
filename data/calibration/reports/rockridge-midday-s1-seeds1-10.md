# rockridge-midday-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Cars cleared from gridlock near the study area (judged zone) | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 10.05 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.01 | 0.01 | 0.00 | 0.02 | 0.00 to 0.01 |
| health | backlog growth in the second half of the run | points of spawned | -0.00 | 0.02 | -0.03 | 0.02 | -0.01 to 0.01 |
| health | completed trips | trips | 16353.70 | 115.69 | 16158.00 | 16530.00 | 16270.95 to 16436.45 |
| health | arterial mean speed | m/s | 10.05 | 0.05 | 9.98 | 10.12 | 10.02 to 10.09 |
| health | arterial mean speed, last 15 min | m/s | 10.11 | 0.12 | 9.86 | 10.28 | 10.02 to 10.19 |
| junction recovery | courtesy admissions per hour | veh/h | 17.00 | 6.00 | 10.00 | 26.00 | 12.71 to 21.29 |
| junction recovery | yield fallback admissions per hour | veh/h | 7.20 | 2.94 | 2.00 | 12.00 | 5.10 to 9.30 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, judged (near the study area, and far ones whose chain reaches it) | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, near the study area | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, farther out | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, farther out with a chain into the judged zone | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | trips waiting at origins in the judged zone at the end | trips | 0.40 | 0.70 | 0.00 | 2.00 | -0.10 to 0.90 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 25.32 | 1.96 | 21.65 | 27.85 | 23.92 to 26.72 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 9.7 | 1.0 | 7.9 | 10.7 | 9.0 to 10.4 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 22.26 | 4.29 | 17.15 | 28.09 | 19.19 to 25.33 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 8.5 | 1.5 | 6.6 | 10.5 | 7.4 to 9.5 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 27.20 | 5.37 | 22.00 | 37.00 | 23.36 to 31.04 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 833.80 | 26.01 | 789.00 | 869.00 | 815.20 to 852.40 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 47.00 | 6.02 | 37.00 | 56.00 | 42.69 to 51.31 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 987.40 | 33.37 | 933.00 | 1048.00 | 963.53 to 1011.27 |
| headline share | Hillegass Avenue NB from freeway | % | 48.4 | 2.4 | 45.5 | 52.8 | 46.7 to 50.2 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 4.5 | 0.7 | 3.4 | 5.5 | 4.0 to 5.0 |
| share | Hillegass Avenue NB to College Avenue | % | 12.9 | 3.1 | 7.8 | 16.7 | 10.7 to 15.1 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 32.6 | 3.9 | 28.4 | 39.9 | 29.8 to 35.4 |
| headline share | Colby Street NB from freeway | % | 48.4 | 3.0 | 43.9 | 53.0 | 46.2 to 50.5 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 49.8 | 3.6 | 43.4 | 56.9 | 47.2 to 52.4 |
| share | Colby Street NB to Telegraph Avenue | % | 40.6 | 3.4 | 35.5 | 46.8 | 38.2 to 43.0 |
| share | Colby Street NB to College Avenue | % | 5.7 | 2.1 | 2.5 | 8.9 | 4.1 to 7.2 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 40.3 | 5.6 | 30.8 | 47.7 | 36.2 to 44.3 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 5.4 | 1.9 | 1.0 | 7.3 | 4.0 to 6.7 |
| share | Hillegass Avenue SB from College Avenue | % | 25.6 | 3.8 | 17.1 | 30.3 | 22.9 to 28.4 |
| headline share | Hillegass Avenue SB to freeway | % | 57.8 | 4.3 | 49.5 | 65.1 | 54.7 to 60.9 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 26.2 | 3.3 | 20.9 | 30.9 | 23.9 to 28.6 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 20.7 | 3.7 | 13.2 | 27.1 | 18.0 to 23.4 |
| share | Colby Street SB from Telegraph Avenue | % | 21.4 | 4.1 | 14.9 | 28.9 | 18.5 to 24.3 |
| headline share | Colby Street SB to freeway | % | 41.6 | 2.8 | 37.2 | 46.3 | 39.6 to 43.6 |
| share | Colby Street SB to Forest Street | % | 18.8 | 3.2 | 12.9 | 24.7 | 16.5 to 21.0 |
| ramp share | onto freeway via College Avenue | % | 20.3 | 1.7 | 17.2 | 22.8 | 19.1 to 21.5 |
| ramp share | onto freeway via Hillegass Avenue | % | 16.9 | 1.7 | 14.2 | 19.4 | 15.6 to 18.1 |
| ramp share | onto freeway via Martin Street | % | 17.8 | 1.7 | 14.7 | 20.0 | 16.5 to 19.0 |
| ramp share | onto freeway via Colby Street | % | 14.4 | 1.5 | 12.3 | 17.7 | 13.3 to 15.4 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 12.4 | 1.8 | 9.5 | 15.1 | 11.1 to 13.7 |
| ramp share | onto freeway via Benvenue Avenue | % | 5.0 | 1.1 | 3.7 | 6.6 | 4.3 to 5.8 |
| ramp share | from freeway via College Avenue | % | 10.0 | 1.4 | 8.0 | 12.1 | 9.0 to 11.0 |
| ramp share | from freeway via Martin Street | % | 13.5 | 1.5 | 11.4 | 15.6 | 12.4 to 14.5 |
| ramp share | from freeway via Colby Street | % | 11.4 | 2.0 | 8.3 | 15.3 | 10.0 to 12.9 |
| ramp share | from freeway via Hillegass Avenue | % | 8.7 | 1.1 | 6.0 | 10.2 | 8.0 to 9.5 |
| ramp share | from freeway via Benvenue Avenue | % | 3.3 | 1.0 | 2.0 | 4.6 | 2.6 to 4.0 |
| corridor flow | Telegraph N median link flow | veh/h | 640.44 | 27.43 | 596.40 | 675.60 | 620.82 to 660.06 |
| corridor flow | Telegraph S median link flow | veh/h | 581.28 | 26.72 | 536.40 | 610.80 | 562.17 to 600.39 |
| corridor flow | College N median link flow | veh/h | 183.72 | 23.20 | 150.00 | 225.60 | 167.13 to 200.31 |
| corridor flow | College S median link flow | veh/h | 529.68 | 23.23 | 504.00 | 570.00 | 513.06 to 546.30 |
| corridor flow | Claremont N median link flow | veh/h | 278.76 | 24.30 | 237.60 | 316.80 | 261.38 to 296.14 |
| corridor flow | Claremont S median link flow | veh/h | 197.40 | 21.01 | 169.20 | 225.60 | 182.37 to 212.43 |
| corridor flow | Alcatraz E median link flow | veh/h | 348.36 | 17.45 | 327.60 | 380.40 | 335.88 to 360.84 |
| corridor flow | Alcatraz W median link flow | veh/h | 236.64 | 21.01 | 188.40 | 273.60 | 221.61 to 251.67 |
| corridor flow | Hillegass N median link flow | veh/h | 75.36 | 5.54 | 69.60 | 86.40 | 71.40 to 79.32 |
| corridor flow | Hillegass S median link flow | veh/h | 69.84 | 9.19 | 55.20 | 85.20 | 63.27 to 76.41 |
| corridor flow | Colby N median link flow | veh/h | 88.92 | 9.52 | 76.80 | 102.00 | 82.11 to 95.73 |
| corridor flow | Colby S median link flow | veh/h | 89.04 | 7.56 | 78.00 | 98.40 | 83.63 to 94.45 |
| corridor flow | Martin E median link flow | veh/h | 86.16 | 5.95 | 78.00 | 97.20 | 81.90 to 90.42 |
| corridor flow | Martin W median link flow | veh/h | 83.52 | 10.43 | 68.40 | 102.00 | 76.06 to 90.98 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 42 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 23 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 5 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 9 | within |
| Intents listed, together | | 101 (71 to 131) | 80 | |
| Other through cars (no intent listed) | | | 3 | |

Model through cars by origin and destination group (largest 12 of 35 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 41.8 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 9.0 | Claremont Avenue then College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 7.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.2 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 3.1 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 2.9 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.9 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 1.9 | SR-24 then Claremont Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.1 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.9 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave to the south (downtown Oakland) | 0.6 | Claremont Avenue then Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.6 | Telegraph Avenue |
| other pairs | | 5.8 | |

By the arterial these cars would otherwise use: Telegraph Avenue 59 veh/h; Claremont Avenue then College Avenue 9 veh/h; none near the study area 4 veh/h; SR-24 then Claremont Avenue 3 veh/h; Claremont Avenue 2 veh/h; SR-24 then Claremont Avenue then College Avenue 2 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 16 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 26 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 5 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 10 | within |
| Intents listed, together | | 43 (20 to 68) | 58 | |
| Other through cars (no intent listed) | | | 7 | |

Model through cars by origin and destination group (largest 12 of 37 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 12.7 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 11.6 | SR-24 |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.6 | Claremont Avenue then Alcatraz Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.5 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 3.3 | SR-24 then Claremont Avenue then College Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.2 | Claremont Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.2 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.5 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 2.0 | Claremont Avenue then College Avenue |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 1.9 | College Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.3 | SR-24 then Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Claremont Avenue |
| other pairs | | 10.7 | |

By the arterial these cars would otherwise use: Telegraph Avenue 20 veh/h; SR-24 13 veh/h; Claremont Avenue then Alcatraz Avenue 9 veh/h; SR-24 then Claremont Avenue 6 veh/h; Claremont Avenue 4 veh/h; Claremont Avenue then College Avenue 3 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 27 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 35 | below |
| Intents listed, together | | 87 (78 to 110) | 62 | |
| Other through cars (no intent listed) | | | 25 | |

Model through cars by origin and destination group (largest 12 of 31 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 26.8 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 15.1 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.1 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 9.7 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.7 | College Avenue then Claremont Avenue then SR-24 |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.6 | College Avenue |
| San Pablo Ave (Emeryville and West Oakland) | College Ave from the north (Berkeley) | 2.0 | Alcatraz Avenue then College Avenue |
| San Pablo Ave (Emeryville and West Oakland) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.7 | Alcatraz Avenue then College Avenue |
| Shattuck Ave from the north (Berkeley) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.7 | College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.6 | Alcatraz Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.6 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 0.9 | Claremont Avenue |
| other pairs | | 4.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 37 veh/h; Claremont Avenue then SR-24 25 veh/h; College Avenue then Claremont Avenue then SR-24 9 veh/h; Alcatraz Avenue then College Avenue 7 veh/h; College Avenue 6 veh/h; Claremont Avenue 2 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 14 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 9 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 26 | within |
| Intents listed, together | | 46 (39 to 72) | 48 | |
| Other through cars (no intent listed) | | | 39 | |

Model through cars by origin and destination group (largest 12 of 46 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 15.8 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.6 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.3 | Claremont Avenue then SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.0 | Claremont Avenue then SR-24 |
| San Pablo Ave (Emeryville and West Oakland) | College Ave from the north (Berkeley) | 4.9 | Alcatraz Avenue then College Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.7 | College Avenue then Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 3.7 | none near the study area |
| San Pablo Ave (Emeryville and West Oakland) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 3.6 | Alcatraz Avenue then College Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.8 | College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.7 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 1.6 | SR-24 |
| Shattuck Ave from the north (Berkeley) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.4 | College Avenue |
| other pairs | | 14.8 | |

By the arterial these cars would otherwise use: Telegraph Avenue 30 veh/h; Claremont Avenue then SR-24 20 veh/h; Alcatraz Avenue then College Avenue 12 veh/h; College Avenue 5 veh/h; SR-24 5 veh/h; none near the study area 5 veh/h.

### Study area, all residential and service streets

Model: 415 through cars per hour.

Model through cars by origin and destination group (largest 12 of 86 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 47.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 36.1 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 34.4 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 34.1 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 21.2 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 19.3 | Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 18.2 | Telegraph Avenue |
| San Pablo Ave (Emeryville and West Oakland) | College Ave from the north (Berkeley) | 13.7 | Alcatraz Avenue then College Avenue |
| San Pablo Ave (Emeryville and West Oakland) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 12.7 | Alcatraz Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 12.3 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 11.9 | SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.1 | College Avenue then Claremont Avenue then SR-24 |
| other pairs | | 142.8 | |

By the arterial these cars would otherwise use: Telegraph Avenue 209 veh/h; Alcatraz Avenue then College Avenue 35 veh/h; Claremont Avenue 28 veh/h; SR-24 25 veh/h; Claremont Avenue then College Avenue 22 veh/h; Claremont Avenue then SR-24 21 veh/h.

By origin group: SR-24 eastbound off-ramps (arriving from Oakland and I-980) 77; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 74; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 64; Telegraph Ave from the north (Berkeley) 42; San Pablo Ave (Emeryville and West Oakland) 30; West Oakland to the southwest (Adeline St, Market St) 25; Claremont Ave and Tunnel Rd toward the hills 22; Telegraph Ave to the south (downtown Oakland) 21; College Ave from the north (Berkeley) 16; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 10.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 108; Telegraph Ave from the north (Berkeley) 78; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 68; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 68; College Ave from the north (Berkeley) 23; Claremont Ave and Tunnel Rd toward the hills 23; Telegraph Ave to the south (downtown Oakland) 9; San Pablo Ave (Emeryville and West Oakland) 8; Ashby Ave from the west (Emeryville and I-80) 6; SR-24 eastbound on-ramps (toward the Caldecott Tunnel) 5.


Per-seed detail: `rockridge-midday-s1-seed1.md` (seed 1 in full).
