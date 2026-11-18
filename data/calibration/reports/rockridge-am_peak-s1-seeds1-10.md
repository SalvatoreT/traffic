# rockridge-am_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Cars cleared from gridlock near the study area (judged zone) | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 8.92 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 4 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 1.80 | 1.87 | 0.00 | 5.00 | 0.46 to 3.14 |
| health | gridlock removals per hour | veh/h | 1.80 | 1.87 | 0.00 | 5.00 | 0.46 to 3.14 |
| health | entry backlog | % of spawned | 0.26 | 0.24 | 0.03 | 0.69 | 0.09 to 0.43 |
| health | backlog growth in the second half of the run | points of spawned | 0.18 | 0.21 | -0.08 | 0.54 | 0.03 to 0.33 |
| health | completed trips | trips | 23611.70 | 190.43 | 23348.00 | 23865.00 | 23475.49 to 23747.91 |
| health | arterial mean speed | m/s | 8.92 | 0.08 | 8.79 | 9.08 | 8.86 to 8.98 |
| health | arterial mean speed, last 15 min | m/s | 8.94 | 0.17 | 8.61 | 9.13 | 8.82 to 9.06 |
| junction recovery | courtesy admissions per hour | veh/h | 126.50 | 19.25 | 100.00 | 166.00 | 112.73 to 140.27 |
| junction recovery | yield fallback admissions per hour | veh/h | 52.00 | 7.59 | 37.00 | 63.00 | 46.57 to 57.43 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.20 | 0.42 | 0.00 | 1.00 | -0.10 to 0.50 |
| gridlock by place | cars cleared from gridlock per hour, judged (near the study area, and far ones whose chain reaches it) | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, near the study area | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, farther out | veh/h | 1.80 | 1.87 | 0.00 | 5.00 | 0.46 to 3.14 |
| gridlock by place | cars cleared from gridlock per hour, farther out with a chain into the judged zone | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | trips waiting at origins in the judged zone at the end | trips | 0.80 | 0.63 | 0.00 | 2.00 | 0.35 to 1.25 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 20.05 | 3.18 | 15.23 | 26.48 | 17.77 to 22.32 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 6.0 | 0.9 | 5.0 | 8.3 | 5.4 to 6.7 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 21.98 | 2.34 | 17.04 | 25.45 | 20.30 to 23.65 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 6.6 | 0.7 | 5.1 | 7.6 | 6.1 to 7.2 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 41.10 | 3.38 | 36.00 | 46.00 | 38.68 to 43.52 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1136.30 | 39.40 | 1061.00 | 1190.00 | 1108.12 to 1164.48 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 37.10 | 3.78 | 33.00 | 43.00 | 34.39 to 39.81 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1182.40 | 33.38 | 1139.00 | 1245.00 | 1158.52 to 1206.28 |
| headline share | Hillegass Avenue NB from freeway | % | 49.3 | 2.1 | 45.8 | 53.1 | 47.8 to 50.8 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 11.0 | 2.3 | 7.4 | 14.3 | 9.3 to 12.6 |
| share | Hillegass Avenue NB to College Avenue | % | 12.7 | 2.9 | 8.8 | 16.7 | 10.7 to 14.7 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 33.7 | 3.7 | 26.5 | 38.5 | 31.0 to 36.3 |
| headline share | Colby Street NB from freeway | % | 44.6 | 2.0 | 40.2 | 46.7 | 43.2 to 46.0 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 45.9 | 5.0 | 39.0 | 53.9 | 42.4 to 49.5 |
| share | Colby Street NB to Telegraph Avenue | % | 41.7 | 4.6 | 35.3 | 50.6 | 38.4 to 45.0 |
| share | Colby Street NB to College Avenue | % | 1.6 | 1.1 | 0.0 | 3.5 | 0.8 to 2.3 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 27.4 | 4.4 | 20.9 | 33.1 | 24.3 to 30.5 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 3.7 | 1.9 | 1.7 | 7.7 | 2.3 to 5.0 |
| share | Hillegass Avenue SB from College Avenue | % | 14.0 | 3.2 | 9.7 | 20.4 | 11.7 to 16.3 |
| headline share | Hillegass Avenue SB to freeway | % | 53.7 | 4.8 | 46.3 | 61.8 | 50.2 to 57.1 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 23.6 | 2.8 | 17.7 | 27.7 | 21.6 to 25.6 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 10.7 | 2.4 | 6.6 | 15.1 | 9.0 to 12.4 |
| share | Colby Street SB from Telegraph Avenue | % | 18.0 | 4.2 | 11.6 | 25.4 | 15.0 to 21.0 |
| headline share | Colby Street SB to freeway | % | 40.5 | 3.6 | 34.6 | 45.1 | 37.9 to 43.1 |
| share | Colby Street SB to Forest Street | % | 22.7 | 3.3 | 17.2 | 28.0 | 20.3 to 25.0 |
| ramp share | onto freeway via College Avenue | % | 21.3 | 2.6 | 17.6 | 24.8 | 19.4 to 23.1 |
| ramp share | onto freeway via Hillegass Avenue | % | 16.0 | 2.1 | 13.4 | 18.9 | 14.6 to 17.5 |
| ramp share | onto freeway via Martin Street | % | 14.1 | 1.8 | 11.8 | 17.8 | 12.8 to 15.4 |
| ramp share | onto freeway via Colby Street | % | 14.4 | 1.9 | 10.6 | 17.3 | 13.0 to 15.8 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 9.8 | 1.8 | 7.9 | 13.2 | 8.5 to 11.1 |
| ramp share | onto freeway via Benvenue Avenue | % | 6.7 | 0.9 | 5.2 | 8.5 | 6.1 to 7.4 |
| ramp share | from freeway via College Avenue | % | 10.0 | 1.4 | 7.5 | 12.4 | 9.0 to 11.0 |
| ramp share | from freeway via Martin Street | % | 11.2 | 0.7 | 9.5 | 11.9 | 10.7 to 11.8 |
| ramp share | from freeway via Colby Street | % | 11.7 | 1.1 | 10.5 | 13.7 | 10.9 to 12.5 |
| ramp share | from freeway via Hillegass Avenue | % | 8.8 | 0.9 | 6.8 | 9.9 | 8.1 to 9.5 |
| ramp share | from freeway via Benvenue Avenue | % | 2.4 | 0.7 | 1.2 | 3.3 | 1.9 to 2.9 |
| corridor flow | Telegraph N median link flow | veh/h | 979.20 | 38.38 | 915.60 | 1035.60 | 951.75 to 1006.65 |
| corridor flow | Telegraph S median link flow | veh/h | 934.92 | 40.24 | 894.00 | 1002.00 | 906.14 to 963.70 |
| corridor flow | College N median link flow | veh/h | 268.08 | 31.54 | 222.00 | 312.00 | 245.52 to 290.64 |
| corridor flow | College S median link flow | veh/h | 443.16 | 17.41 | 417.60 | 478.80 | 430.71 to 455.61 |
| corridor flow | Claremont N median link flow | veh/h | 386.04 | 25.29 | 333.60 | 418.80 | 367.95 to 404.13 |
| corridor flow | Claremont S median link flow | veh/h | 446.40 | 23.03 | 396.00 | 477.60 | 429.93 to 462.87 |
| corridor flow | Alcatraz E median link flow | veh/h | 408.72 | 22.75 | 384.00 | 454.80 | 392.45 to 424.99 |
| corridor flow | Alcatraz W median link flow | veh/h | 345.84 | 20.70 | 296.40 | 378.00 | 331.03 to 360.65 |
| corridor flow | Hillegass N median link flow | veh/h | 95.88 | 5.35 | 87.60 | 104.40 | 92.05 to 99.71 |
| corridor flow | Hillegass S median link flow | veh/h | 84.96 | 6.34 | 75.60 | 96.00 | 80.42 to 89.50 |
| corridor flow | Colby N median link flow | veh/h | 101.64 | 10.21 | 85.20 | 117.60 | 94.33 to 108.95 |
| corridor flow | Colby S median link flow | veh/h | 100.32 | 15.64 | 76.80 | 122.40 | 89.13 to 111.51 |
| corridor flow | Martin E median link flow | veh/h | 105.12 | 20.59 | 78.00 | 150.00 | 90.39 to 119.85 |
| corridor flow | Martin W median link flow | veh/h | 123.48 | 11.49 | 106.80 | 142.80 | 115.26 to 131.70 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 39 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 26 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 4 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 18 | above |
| Intents listed, together | | 101 (71 to 131) | 87 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 21 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 38.8 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 15.7 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 13.1 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 4.9 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 4.6 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 1.8 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.4 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Emeryville and West Oakland streets (55th to 67th Streets) | 1.0 | SR-24 |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 0.7 | SR-24 then Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 0.7 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 0.6 | none near the study area |
| other pairs | | 2.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 67 veh/h; Claremont Avenue 14 veh/h; SR-24 3 veh/h; none near the study area 2 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h; SR-24 then Claremont Avenue then College Avenue 1 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 22 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 32 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 6 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 17 | above |
| Intents listed, together | | 43 (20 to 68) | 77 | |
| Other through cars (no intent listed) | | | 9 | |

Model through cars by origin and destination group (largest 12 of 35 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 15.4 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.4 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 9.9 | Telegraph Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 8.0 | Claremont Avenue then Alcatraz Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 6.8 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.9 | SR-24 then Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.6 | Claremont Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 3.7 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 2.0 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.9 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.6 | SR-24 then Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | College Ave from the north (Berkeley) | 1.5 | Claremont Avenue then College Avenue |
| other pairs | | 10.1 | |

By the arterial these cars would otherwise use: Telegraph Avenue 29 veh/h; SR-24 14 veh/h; Claremont Avenue then Alcatraz Avenue 14 veh/h; Claremont Avenue 7 veh/h; SR-24 then Claremont Avenue then College Avenue 7 veh/h; SR-24 then Claremont Avenue 6 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 15 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 26 | below |
| Intents listed, together | | 87 (78 to 110) | 41 | |
| Other through cars (no intent listed) | | | 29 | |

Model through cars by origin and destination group (largest 12 of 28 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 24.5 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.4 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.8 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.4 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.6 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 0.8 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 0.6 | Alcatraz Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 0.5 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 0.4 | none near the study area |
| Alcatraz Ave from the west (Emeryville side) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 0.3 | Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Claremont Ave and Tunnel Rd toward the hills | 0.3 | Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-13 Warren Freeway (via SR-24 east) | 0.3 | none near the study area |
| other pairs | | 3.1 | |

By the arterial these cars would otherwise use: Telegraph Avenue 41 veh/h; Claremont Avenue then SR-24 19 veh/h; College Avenue then Claremont Avenue then SR-24 6 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h; Alcatraz Avenue then College Avenue 1 veh/h; none near the study area 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 13 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 18 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 11 | below |
| Intents listed, together | | 46 (39 to 72) | 42 | |
| Other through cars (no intent listed) | | | 25 | |

Model through cars by origin and destination group (largest 12 of 46 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.9 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.6 | Alcatraz Avenue then College Avenue then Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.6 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 6.1 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 3.6 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 3.2 | SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.9 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.3 | SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.3 | none near the study area |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 1.9 | SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | San Pablo Ave (Emeryville and West Oakland) | 1.7 | Claremont Avenue then Alcatraz Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 1.3 | Telegraph Avenue |
| other pairs | | 15.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 25 veh/h; SR-24 11 veh/h; none near the study area 10 veh/h; Alcatraz Avenue then College Avenue then Claremont Avenue then SR-24 9 veh/h; Claremont Avenue then Alcatraz Avenue 3 veh/h; Alcatraz Avenue then Claremont Avenue 2 veh/h.

### Study area, all residential and service streets

Model: 463 through cars per hour.

Model through cars by origin and destination group (largest 12 of 95 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 49.8 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 43.1 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 38.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 36.1 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 31.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | San Pablo Ave (Emeryville and West Oakland) | 28.0 | Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 24.4 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 16.2 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 14.7 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.6 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Emeryville and West Oakland streets (55th to 67th Streets) | 12.9 | SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.9 | Claremont Avenue then SR-24 |
| other pairs | | 143.2 | |

By the arterial these cars would otherwise use: Telegraph Avenue 247 veh/h; Claremont Avenue 69 veh/h; SR-24 53 veh/h; none near the study area 24 veh/h; Claremont Avenue then Alcatraz Avenue 20 veh/h; Claremont Avenue then SR-24 12 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 111; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 95; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 88; Telegraph Ave from the north (Berkeley) 36; West Oakland to the southwest (Adeline St, Market St) 22; Claremont Ave and Tunnel Rd toward the hills 20; Telegraph Ave to the south (downtown Oakland) 16; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 13; College Ave from the north (Berkeley) 12; Shattuck Ave from the north (Berkeley) 10.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 97; Telegraph Ave from the north (Berkeley) 93; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 79; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 53; Claremont Ave and Tunnel Rd toward the hills 37; San Pablo Ave (Emeryville and West Oakland) 34; Emeryville and West Oakland streets (55th to 67th Streets) 18; College Ave from the north (Berkeley) 12; SR-24 eastbound on-ramps (toward the Caldecott Tunnel) 10; West Oakland to the southwest (Adeline St, Market St) 7.


Per-seed detail: `rockridge-am_peak-s1-seed1.md` (seed 1 in full).
