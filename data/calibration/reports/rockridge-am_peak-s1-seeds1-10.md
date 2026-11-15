# rockridge-am_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.61 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.01 | 0.01 | 0.00 | 0.03 | 0.00 to 0.02 |
| health | backlog growth in the second half of the run | points of spawned | 0.00 | 0.01 | -0.01 | 0.02 | -0.01 to 0.01 |
| health | completed trips | trips | 21796.90 | 140.92 | 21567.00 | 22130.00 | 21696.10 to 21897.70 |
| health | arterial mean speed | m/s | 9.61 | 0.05 | 9.57 | 9.72 | 9.58 to 9.65 |
| health | arterial mean speed, last 15 min | m/s | 9.64 | 0.08 | 9.51 | 9.77 | 9.58 to 9.70 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 19.60 | 2.59 | 15.50 | 22.74 | 17.75 to 21.45 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 6.0 | 0.7 | 4.9 | 6.9 | 5.5 to 6.5 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 20.62 | 3.22 | 17.08 | 27.46 | 18.32 to 22.93 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 6.3 | 0.9 | 5.1 | 8.0 | 5.7 to 6.9 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 34.20 | 5.16 | 26.00 | 43.00 | 30.51 to 37.89 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1081.80 | 29.25 | 1024.00 | 1117.00 | 1060.88 to 1102.72 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 30.90 | 6.57 | 21.00 | 38.00 | 26.20 to 35.60 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1231.60 | 40.60 | 1177.00 | 1290.00 | 1202.56 to 1260.64 |
| headline share | Hillegass Avenue NB from freeway | % | 54.1 | 3.1 | 50.5 | 60.2 | 51.9 to 56.3 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 8.4 | 1.6 | 6.0 | 11.0 | 7.2 to 9.5 |
| share | Hillegass Avenue NB to College Avenue | % | 13.3 | 2.5 | 7.9 | 15.8 | 11.5 to 15.1 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 28.8 | 3.8 | 24.7 | 35.9 | 26.1 to 31.5 |
| headline share | Colby Street NB from freeway | % | 45.5 | 3.3 | 41.2 | 53.3 | 43.2 to 47.9 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 47.3 | 2.4 | 43.1 | 51.2 | 45.5 to 49.0 |
| share | Colby Street NB to Telegraph Avenue | % | 37.1 | 2.9 | 32.9 | 41.5 | 35.0 to 39.1 |
| share | Colby Street NB to College Avenue | % | 3.0 | 1.1 | 0.4 | 4.2 | 2.2 to 3.7 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 22.1 | 4.1 | 17.1 | 27.8 | 19.2 to 25.1 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 1.5 | 0.8 | 0.8 | 2.9 | 0.9 to 2.1 |
| share | Hillegass Avenue SB from College Avenue | % | 9.1 | 3.2 | 3.8 | 13.0 | 6.8 to 11.4 |
| headline share | Hillegass Avenue SB to freeway | % | 65.1 | 3.1 | 60.9 | 72.0 | 62.9 to 67.3 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 20.0 | 2.6 | 16.6 | 23.2 | 18.1 to 21.8 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 7.4 | 1.3 | 5.4 | 9.3 | 6.5 to 8.3 |
| share | Colby Street SB from Telegraph Avenue | % | 14.1 | 3.1 | 9.1 | 18.4 | 11.8 to 16.3 |
| headline share | Colby Street SB to freeway | % | 54.3 | 1.3 | 52.9 | 56.9 | 53.4 to 55.3 |
| share | Colby Street SB to Forest Street | % | 10.6 | 1.7 | 8.4 | 12.9 | 9.4 to 11.8 |
| ramp share | onto freeway via College Avenue | % | 16.6 | 1.6 | 13.7 | 18.6 | 15.5 to 17.8 |
| ramp share | onto freeway via Hillegass Avenue | % | 14.1 | 0.9 | 13.2 | 16.0 | 13.5 to 14.7 |
| ramp share | onto freeway via Martin Street | % | 14.1 | 2.2 | 9.9 | 16.6 | 12.6 to 15.7 |
| ramp share | onto freeway via Colby Street | % | 15.3 | 1.5 | 13.2 | 18.9 | 14.2 to 16.4 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 7.4 | 1.3 | 4.5 | 9.0 | 6.5 to 8.4 |
| ramp share | onto freeway via Benvenue Avenue | % | 5.0 | 1.0 | 2.9 | 6.4 | 4.2 to 5.7 |
| ramp share | from freeway via College Avenue | % | 11.2 | 1.5 | 8.6 | 13.6 | 10.2 to 12.3 |
| ramp share | from freeway via Martin Street | % | 13.1 | 0.8 | 12.1 | 14.7 | 12.6 to 13.7 |
| ramp share | from freeway via Colby Street | % | 12.0 | 1.0 | 10.6 | 13.9 | 11.2 to 12.7 |
| ramp share | from freeway via Hillegass Avenue | % | 6.8 | 1.0 | 5.1 | 7.9 | 6.0 to 7.5 |
| ramp share | from freeway via Benvenue Avenue | % | 3.0 | 0.6 | 2.3 | 4.0 | 2.6 to 3.4 |
| corridor flow | Telegraph N median link flow | veh/h | 790.44 | 34.77 | 748.80 | 864.00 | 765.57 to 815.31 |
| corridor flow | Telegraph S median link flow | veh/h | 666.00 | 39.28 | 609.60 | 738.00 | 637.90 to 694.10 |
| corridor flow | College N median link flow | veh/h | 208.20 | 12.79 | 183.60 | 232.80 | 199.05 to 217.35 |
| corridor flow | College S median link flow | veh/h | 363.12 | 20.91 | 336.00 | 397.20 | 348.16 to 378.08 |
| corridor flow | Claremont N median link flow | veh/h | 401.76 | 12.78 | 370.80 | 416.40 | 392.61 to 410.91 |
| corridor flow | Claremont S median link flow | veh/h | 375.24 | 21.07 | 334.80 | 409.20 | 360.17 to 390.31 |
| corridor flow | Alcatraz E median link flow | veh/h | 389.88 | 29.84 | 345.60 | 433.20 | 368.53 to 411.23 |
| corridor flow | Alcatraz W median link flow | veh/h | 396.48 | 20.95 | 360.00 | 424.80 | 381.49 to 411.47 |
| corridor flow | Hillegass N median link flow | veh/h | 96.84 | 8.80 | 86.40 | 111.60 | 90.54 to 103.14 |
| corridor flow | Hillegass S median link flow | veh/h | 69.84 | 8.58 | 54.00 | 84.00 | 63.71 to 75.97 |
| corridor flow | Colby N median link flow | veh/h | 115.68 | 9.04 | 100.80 | 127.20 | 109.22 to 122.14 |
| corridor flow | Colby S median link flow | veh/h | 120.36 | 5.66 | 111.60 | 128.40 | 116.31 to 124.41 |
| corridor flow | Martin E median link flow | veh/h | 94.44 | 15.85 | 66.00 | 117.60 | 83.10 to 105.78 |
| corridor flow | Martin W median link flow | veh/h | 105.00 | 8.93 | 87.60 | 120.00 | 98.61 to 111.39 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 35 | below |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 19 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 2 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 18 | above |
| Intents listed, together | | 101 (71 to 131) | 74 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 34 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 35.2 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 16.5 | Claremont Avenue then College Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 7.5 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 2.9 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 2.7 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 2.6 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.6 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 1.5 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.2 | College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 0.7 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 0.6 | College Avenue then Alcatraz Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | College Ave from the north (Berkeley) | 0.3 | Telegraph Avenue |
| other pairs | | 2.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 48 veh/h; Claremont Avenue then College Avenue then Alcatraz Avenue 16 veh/h; Claremont Avenue 8 veh/h; College Avenue 1 veh/h; College Avenue then Alcatraz Avenue 1 veh/h; Claremont Avenue then Alcatraz Avenue 0 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 15 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 25 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 8 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 12 | within |
| Intents listed, together | | 43 (20 to 68) | 60 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 45 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.6 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 8.2 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 5.9 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.4 | SR-24 then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 2.4 | College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 2.1 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 1.8 | College Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.7 | SR-24 then Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.7 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.3 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 1.1 | SR-24 |
| other pairs | | 13.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 20 veh/h; SR-24 15 veh/h; SR-24 then Claremont Avenue then College Avenue 6 veh/h; SR-24 then Claremont Avenue 5 veh/h; Claremont Avenue 4 veh/h; none near the study area 3 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 15 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 23 | below |
| Intents listed, together | | 87 (78 to 110) | 38 | |
| Other through cars (no intent listed) | | | 26 | |

Model through cars by origin and destination group (largest 12 of 29 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 17.7 | Alcatraz Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.5 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.6 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.2 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 3.9 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 3.1 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 1.6 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 0.8 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 0.6 | Alcatraz Avenue then College Avenue |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 0.4 | College Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Claremont Ave and Tunnel Rd toward the hills | 0.3 | Telegraph Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | Oakland hills to the east (Broadway Terrace, Mountain Blvd, Moraga Ave) | 0.3 | SR-24 |
| other pairs | | 1.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 20 veh/h; Alcatraz Avenue then College Avenue 18 veh/h; Claremont Avenue then SR-24 18 veh/h; College Avenue then Claremont Avenue then SR-24 5 veh/h; Claremont Avenue 1 veh/h; SR-24 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 13 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 18 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 16 | within |
| Intents listed, together | | 46 (39 to 72) | 47 | |
| Other through cars (no intent listed) | | | 34 | |

Model through cars by origin and destination group (largest 12 of 46 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 15.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.1 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.5 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.4 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 3.9 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 3.6 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.9 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.5 | SR-24 |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 2.2 | SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.2 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.7 | SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.5 | none near the study area |
| other pairs | | 12.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 51 veh/h; none near the study area 11 veh/h; SR-24 10 veh/h; Claremont Avenue 3 veh/h; Alcatraz Avenue then College Avenue 2 veh/h; College Avenue then Claremont Avenue 1 veh/h.

### Study area, all residential and service streets

Model: 404 through cars per hour.

Model through cars by origin and destination group (largest 12 of 108 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 44.5 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 35.8 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 34.4 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 31.2 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.4 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 19.4 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.7 | SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.6 | Claremont Avenue then SR-24 |
| Telegraph Ave to the south (downtown Oakland) | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 11.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 9.7 | Claremont Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.5 | none near the study area |
| other pairs | | 143.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 239 veh/h; Claremont Avenue 38 veh/h; SR-24 34 veh/h; none near the study area 18 veh/h; Claremont Avenue then SR-24 14 veh/h; Telegraph Avenue then Claremont Avenue 12 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 92; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 84; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 70; Telegraph Ave from the north (Berkeley) 32; Telegraph Ave to the south (downtown Oakland) 30; West Oakland to the southwest (Adeline St, Market St) 22; Claremont Ave and Tunnel Rd toward the hills 20; Shattuck Ave from the north (Berkeley) 11; Ashby Ave from the west (Emeryville and I-80) 8; College Ave from the north (Berkeley) 8.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 100; Telegraph Ave from the north (Berkeley) 63; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 61; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 57; Claremont Ave and Tunnel Rd toward the hills 26; College Ave from the north (Berkeley) 15; Ashby Ave from the west (Emeryville and I-80) 14; Shattuck Ave from the north (Berkeley) 12; Emeryville and West Oakland streets (55th to 67th Streets) 10; Telegraph Ave to the south (downtown Oakland) 10.


Per-seed detail: `rockridge-am_peak-s1-seed1.md` (seed 1 in full).
