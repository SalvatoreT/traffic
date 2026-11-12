# Volunteer count of February 25, 2025: additional figures and gaps

Companion to `rockridge.volunteer-count-2025-02-25.json`. It lists figures from the working-group update archive (appendix "Initial Analysis of Manual Traffic Counts") and the data-collection background document. Provenance column: T = body text, TB = text table, IMG = image. Images were later read from the 41-page PDF export of the archive; the JSON sections `blocks`, `accessPoints`, `turningMovements`, `routeDiagrams`, `pedestriansAndBicycles` and `queues` hold what they show, and the sections below explain how.

Access notes: the archive document has one readable tab; its appendix text is identical to the stand-alone analysis document. The text export carries no image descriptions, so the images were read from a PDF export of the archive (41 pages, appendix on pages 16 to 41). No spreadsheet of raw counts is linked from either document, and a Drive search for count, turning-movement and pilot titles found none.

## 1. Entry points (PM unless noted)

The archive has no per-access-point table. The map of the 18 points carries pins only, with no numbers on them. The JSON `accessPoints` section names each pin by intersection and gives a count where the document supports one (stated, or derived and labeled as such).

| Group / street | Access points | Share of PM entering | PM vehicles | AM vehicles | Provenance (section) | Kind |
| --- | --- | --- | --- | --- | --- | --- |
| Claremont plus Forest east of Claremont | 5 | 43% | 498 | not given | Where do most cars enter | TB |
| of which turning off Claremont | - | 33% | 390 | not given | same | TB |
| of which Forest east of Claremont | - | 10% | 108 | not given | same | TB |
| Alcatraz plus Colby/Hillegass north of Alcatraz | 3 | 31% | 360 | not given | same | TB |
| Telegraph and local streets west of Telegraph | 8 | 21% | 248 | 5 of 8 not counted | same | TB |
| College | 2 | 5% | 61 | not given | same | TB |
| Colby at Claremont | - | 36% of Claremont side | 182 | 72 | Claremont table; Example Intersection 3 | TB, T |
| Martin at Claremont | - | 32% of Claremont side | 164 | 147 | same | TB, T |
| Hillegass at Claremont | - | 19% of Claremont side | 94 | 72 | same | TB, T |
| Forest at Claremont | - | 11% of Claremont side | 58 | not given | same | TB |
| 60th at Claremont | - | 1% of Claremont side | 7 | not given | same | TB |

Map of access points (green pins counted AM and PM, orange pins PM only): IMG, read for pin positions only (13 green, 5 orange; see `accessPoints`).

## 2. Blocks

No block volume is available as text. Both block maps are images.

| Street | Between | Direction | AM | PM | Provenance | Kind |
| --- | --- | --- | --- | --- | --- | --- |
| all neighborhood blocks | - | - | 98 directed-block values | 109 directed-block values | Baseline traffic volumes AM / PM Peak (PDF pages 19 and 20) | IMG, transcribed in `blocks` |

Related block-like text figures:

| Segment | Direction | AM | PM | Provenance | Kind |
| --- | --- | --- | --- | --- | --- |
| Martin, Claremont to Telegraph via 58th, full route | toward Telegraph | 70 cars (48%) | not counted | Summary of through routes | TB |
| Colby, full length Claremont to Alcatraz, both directions summed | both | 79 | 141 | Through-route text (141 PM stated; AM sum derived from 33 + 46) | T |
| Hillegass, full length, both directions summed | both | 84 | 113 | Through-route text (113 PM stated; AM sum derived from 48 + 36) | T |

Per-turn route breakdown maps for Colby (4 maps), Hillegass (4 maps) and Martin to Telegraph (1 map): IMG, transcribed in `routeDiagrams` and `turningMovements`.

## 3. Intersections

Turning-movement volumes (cars turning, internal intersections), top six each period:

| Rank | AM intersection | AM cars turning | PM intersection | PM cars turning | Kind |
| --- | --- | --- | --- | --- | --- |
| 1 | Martin-Herman at 58th | 209 | Martin-Herman at 58th | 235 | TB |
| 2 | Canning and 58th | 85 | Ayala and Forest | 132 | TB |
| 3 | Colby and 63rd | 77 | Martin and Ayala | 101 | TB |
| 4 | Dana and 63rd | 77 | Hillegass and 62nd | 71 | TB |
| 5 | Martin and Ayala | 73 | Hillegass and 63rd | 66 | TB |
| 6 | Canning and 63rd | 66 | McAuley and Ayala | 54 | TB |

Source: "Which intersections have the highest volume of car turning movements". Canning and 58th was not recorded PM. Ayala and Forest was not recorded AM. Entry and exit points are excluded from this table.

New rows versus the JSON: Canning and 58th (AM 85), Dana and 63rd (AM 77), Canning and 63rd (AM 66), McAuley and Ayala (PM 54).

Total through-volume ranking (all straight and turning movements), ranks only, no numbers given (TB):

| Rank | AM | PM |
| --- | --- | --- |
| 1 | Colby and 60th | Colby and McAuley |
| 2 | Colby and 61st | Colby and 60th |
| 3 | Colby and 62nd | Colby and 61st |
| 4 | Colby and McAuley | Colby and 62nd |
| 5 | Colby and 63rd | Martin and Ayala |
| 6 | Martin and Ayala | Colby and 63rd |

Per-movement tables for individual intersections: not present as text. The four example intersections have diagrams (IMG), transcribed in `turningMovements` (source field names the page).

Example intersection findings (T, "Example Intersection" sections):

| Intersection | Figure | Period |
| --- | --- | --- |
| Claremont-Colby-Forest | 103 cars to Forest and 95 from Forest on the far side of Claremont | AM |
| Claremont-Colby-Forest | 83% of cars entering Colby did not drive the full length (turned off or parked) | AM |
| Claremont and Martin | 49% of cars entering at Martin exit via 58th and Telegraph; 35% turn off 58th onto Canning | AM |
| Claremont and Martin | fewer than 10 pedestrians entering or exiting Martin over the hour; no crosswalk | AM |
| Alcatraz at Hillegass and Colby | 43% (76 cars) of southbound Hillegass full-route entrants turned right from Alcatraz onto Hillegass | PM |
| Alcatraz at Hillegass and Colby | southbound entry onto Hillegass exceeds Colby, driven by left turns off Alcatraz (no count given) | PM |
| Peralta Elementary (Alcatraz, Dana, 63rd) | sharp peak 8:15 to 8:30 toward school, movement away 8:30 to 8:45 | AM |

## 4. Pedestrians and bicycles

| Location | Figure | Period | Kind |
| --- | --- | --- | --- |
| Colby exiting at Claremont | 88 pedestrians (about half the car count exiting) | AM | T |
| Forest to Colby crossing | 25 additional pedestrians | AM | T |
| Martin at Claremont | fewer than 10 pedestrians in the hour | AM | T |
| Canning, full length | "relatively high", increasing toward 63rd; volumes per segment on a map | AM | IMG, transcribed in `pedestriansAndBicycles` |
| Peralta Elementary crossings | highest pedestrian crossings in the neighborhood; largest flow from the Telegraph and Canning direction on 63rd; no counts in text | AM | T |
| Bicycles | Canning map only; no bicycle figures in text | AM | IMG, transcribed in `pedestriansAndBicycles` |

Pedestrian intersection ranking chart: not present as text.

## 5. Queues and signal (Colby at Claremont and Forest)

| Item | Value | Period | Kind |
| --- | --- | --- | --- |
| Full signal cycle | 79 s (1 min 19 s) | 8-9 AM | T |
| Green for exiting Colby | 4 s | 8-9 AM | T |
| Red | 75 s (1 min 15 s) | 8-9 AM | T |
| Cycle after 9 AM | 147 s total, red 137 s, green 10 s | from 9 AM | T |
| Cars exiting per cycle, min / median / max / mode | 1 / 4 / 7 / 4 | AM | TB |
| Cars exiting per cycle, min / median / max / mode | 0 / 3.5 / 5 / 4 | PM | TB |
| Average cars exiting per cycle | 3.3 | observation period | T |
| Average queue length | 3.3 cars | observation period | T |
| Maximum queue | 13 cars | observation period | T |
| Red-light runners | 8 cars | observation period | T |
| Queue over time charts (AM, PM) | 46 AM and 44 PM per-cycle values recovered | both | IMG, transcribed in `queues` |
| Cars exiting per cycle charts | the text table (min, median, max, mode) is all the page shows | both | TB |

Observers also reported high speeds on Claremont and "very fast" left turns from Claremont onto Colby (T, no speed values).

## 6. Through-traffic findings

| Finding | Figure | Kind |
| --- | --- | --- |
| Cars entering Colby or Hillegass that drive the full route to the far arterial | 43% | T |
| Colby NB PM full route | 102 cars, 56% | TB |
| Colby SB PM full route | 39 cars, 28% | TB |
| Cars on Colby in the evening that only use it as a through route, beyond the southbound morning count | 56 | T |
| Colby full-length cars as share of all 1,175 PM entrants | 141 (12%) | T |
| Hillegass full-length cars as share of all 1,175 PM entrants | 113 (10%) | T |
| Hillegass vs Colby NB AM | 48 vs 33 | T |
| Hillegass vs Colby SB PM | 79 vs 39 | T |
| Matched volumes read as likely commute flow | Colby NB AM 33 vs SB PM 39; Hillegass SB AM 36 vs NB PM 34 | T |
| Martin zig-zag to 58th and Telegraph | 48 to 49% depending on section (70 cars) | TB, T |
| Canning and 58th | not measured PM | T |

The writers say the full-route figures omit cars that turn off partway, so they understate through traffic. They give no reason for the evening Colby northbound excess (possible causes named: freeway exit backups, evening destinations).

## 7. Other numeric context from the background document (T)

| Item | Value |
| --- | --- |
| Planned collection points | 48 aspirational; 16 minimum (all Colby and Hillegass intersections) |
| Actual coverage | 34 AM, 43 PM |
| Published daily volume for Colby | average AADT 2,721 (state dataset, mostly 2019 and 2020 values) |
| City counts on neighborhood streets | most recent for Colby is from 2013; none after; city publishes volumes only for College, Claremont and Alcatraz |
| Other streets in state dataset | none (classified local) |

## Not readable

Everything that was image-only is now transcribed. What remains unreadable or unresolved:

- Per-access-point entry counts: the archive does not give them (pins carry no numbers). Individually known: Alcatraz at Dana, Colby, Hillegass (AM and PM), Claremont at Colby, Martin, Hillegass (AM and PM), Claremont at Forest and at 60th (PM only). Not known individually: AM Claremont at Forest and 60th, both College pins, all Telegraph pins.
- Colby PM southbound at Claremont: the three exit numbers (84, 59, "75" rotated) sum to 218, but the block feeding the node carries 162. The "75" is the doubtful digit pair (19 would give 162, 7 would give 150).
- Colby PM southbound at McAuley: the turn onto Colby reads 6; the table total, the arrow below the node and the map all imply 9.
- Hillegass PM southbound at Claremont: the northeast exit number is rotated and unreadable; 9 is inferred.
- Martin to Telegraph route diagram (rotated, crowded): the totals reconcile, but which movement some small numbers (1, 1, 2, 52) belong to at the Hermann and 58th node is inferred.
- Colby AM southbound: one parenthesized "(1)" near 62nd Street cannot be tied to a block (the printed totals leave it out).
- Canning pedestrian map: each pair of numbers sits just below a marker; it may describe the block south of that cross street instead of the intersection.
- Two block labels in the AM map sit on the line between two candidate blocks (flagged `uncertain` in `blocks`).
- PM Canning Street between 58th and 59th has no southbound label. The flow balance at Canning and 59th (142 in, 96 out) suggests about 46 southbound cars that are not shown.
- No raw spreadsheet or turning-movement table is linked or embedded.

## How the maps were read

Pages: the access-point map is on PDF page 17, the two baseline volume maps on pages 19 (AM) and 20 (PM), the route diagrams on pages 24 to 32, the Canning pedestrian and bike map on page 34, the queue charts on page 36, the example intersections on pages 37 to 40. Pages 1 to 15 are earlier email updates (dates and counts of people only, summarized in `projectContext`). The images were extracted at native size (the block maps are only about 525 by 555 pixels) and enlarged for reading.

Block maps. Direction comes from the color legend printed on the map: green arrow down = southbound, blue arrow up = northbound, purple arrow right = eastbound, orange arrow left = westbound. The label sits beside the street on the right-hand side of the direction of travel, so a pair of numbers around one block gives both directions. The diagonal streets (Martin Street, Ayala Avenue, Forest Street) follow the same colors but run diagonally: Martin Street and Forest Street use blue and green (blue = toward the northwest), Ayala Avenue uses orange and purple (orange = toward the southwest). The `heading` and `toward` fields in `blocks` say which way each arrow points.

Each label was placed on a block by fitting the map to the network in `public/data/rockridge.network.json` (affine fit on nine intersections, residual under 10 m) and then checking by eye against the street grid. Blocks are named the way `src/lib/naming.ts` names them. All 207 directed values were assigned (98 AM, 109 PM). To check the assignment, vehicles into and out of every intersection with all arms labeled were summed: 30 of 35 intersection-period pairs balance within 15 vehicles (typical error 0 to 10), which would fail if a label were on the wrong block. The route diagrams add a second check: 43 of the 44 directed Colby and Hillegass block values equal a number printed on the route diagrams (15 match the count leaving the upstream intersection, 32 the count arriving at the downstream one, some both).

Uncertain values: a label is flagged `uncertain: true` when it sits between two candidate blocks (AM 22 eastbound on 59th Street, AM 97 westbound on 58th Street). Block-label digits were never guessed; no block label was unreadable. Where a printed total disagrees with the node sums, both are kept and the mismatch is described in a `reconciliation` or `note` field.

Names that do not match the network: 61st Street between Canning Street and Colby Street is split into four links by the park paths (no single block with that name); Colby Street between 63rd Street and 63rd Street is the jog block where the east leg (North Street and 63rd Street) and the west leg of 63rd Street meet Colby about 58 m apart. Blocks that end at a multi-street junction carry the app's joined names (for example Hillegass Avenue between 61st Street and 60th Street / Claremont Avenue). Every other named block exists with the same cross streets.

Route diagrams (pages 24 to 32). There is no legend. Reading: the number beside an arrow between two numbered intersections is the vehicles leaving the previous intersection onto that block; green numbers at an intersection are straight-through and vehicles turning onto the route; red numbers are vehicles turning off; the margin numbers are vehicles joining mid-block (plain) or whose trip ends on that block (in parentheses). With this reading the node sums reproduce the printed table totals (turned off, turned onto, destination along the street) for 6 of 8 Colby and Hillegass routes and the block arrows for all but one block; the exceptions are listed in `reconciliation`.

Queue charts (page 36). The line vertices were traced from the chart image (one point per light cycle, equal spacing; 46 AM points and 44 PM points fit the line with an error below 0.002 cars). Values are integers; the AM maximum (13) matches the text.

## Consistency checks

Access points versus stated totals (PM 1,175; AM 732 on counted entries):

| Check | Result |
| --- | --- |
| PM, group totals as printed (498 + 360 + 248 + 61) | 1,167, which is 8 short of 1,175 |
| PM, five Claremont turn-ins (Colby 182, Martin 164, Hillegass 94, Forest 58, 60th 7) | 505, versus the stated 498 (7 more; 498 is the sum without the 60th Street entry) |
| PM, with 505 in place of 498 | 1,174, which is 1 short of 1,175; 505 / 1,175 = 43.0% matches the printed 43% (498 would be 42.4%) |
| PM, Alcatraz group (Colby 139 + Hillegass 178 + Dana 43) | 360, matches (Dana is derived from the other two) |
| PM, "390 turn off Claremont" | 125 (Colby 121 + 4) + 164 + 94 + 7 = 390 using the route diagram split of Colby |
| AM, six points with an individual count (Dana 45, Colby Alcatraz 109, Hillegass Alcatraz 73, Claremont at Colby 72, Martin 147, Hillegass 72) | 518 of 732 |
| AM, estimates for the rest from other figures (Forest east of Claremont 95, College 40 + 39, Telegraph 40 + 12 + 20, 60th 4) | 250 for a remaining 214, so the AM split cannot be closed from the document |
| AM Colby at Claremont | the text figure 72 excludes the 43 cars crossing from Forest; the route diagram counts 115 entering. PM Colby 182 includes the Forest crossing (121 + 57 + 4). The two periods use different definitions. |

Claremont turn-ins versus 498: see the second row above (505 versus 498, difference 7).

Colby and Hillegass: block volumes at each end versus full-route counts (map values; full-route counts from the existing `fullRoute` rows).

| Route | Block at start | Block at end | Entering at start (diagram) | Full route | Share |
| --- | --- | --- | --- | --- | --- |
| Colby NB AM | 130 (Claremont end) | 104 (Alcatraz end) | 115 | 33 | 29% |
| Colby NB PM | 189 | 164 | 182 | 102 | 56% |
| Colby SB AM | 109 (Alcatraz end) | 163 (Claremont end) | 109 | 46 | 42% |
| Colby SB PM | 139 | 162 | 139 | 39 | 28% |
| Hillegass NB AM | 74 (Claremont end) | 100 (Alcatraz end) | 72 | 34 by diagram (48 in summary) | 47% (51% in summary) |
| Hillegass NB PM | 114 | 109 | 94 | 48 by diagram (34 in summary) | 51% (47% in summary) |
| Hillegass SB AM | 73 (Alcatraz end) | 87 (Claremont end) | 73 | 36 | 49% |
| Hillegass SB PM | 178 | 152 | 178 | 79 | 44% |

Every full-route count is below the volume of both end blocks. Block-end volumes exceed the entering count where cars join mid-block (Colby NB AM 130 versus 115, Hillegass NB PM 114 versus 94).

Discrepancies found:

1. Hillegass northbound: the summary table on page 21 lists 48 (51%) for AM and 34 (47%) for PM. The route diagrams give AM entering 72 with 34 driving the full route (47%) and PM entering 94 with 48 (51%). The access table (PM 94, AM 72) and the block maps agree with the diagrams, so the AM and PM columns of the summary look swapped for this direction. The existing `fullRoute` rows keep the summary values and carry a note.
2. Claremont group total 498 versus the five printed entries (505), and group totals 1,167 versus 1,175 (above).
3. Hillegass PM southbound route table prints 31 cars turning off; the diagram numbers sum to 59, and 178 - 59 - 40 = 79 matches the printed full-route count, so 31 is likely a typo.
4. Colby PM southbound: turn onto Colby sums to 76 versus table 79; the exit numbers at Claremont sum to 218 versus a block volume of 162.
5. Martin route: turn-ons 16 in the diagram versus 18 in the table.
6. The summary on page 21 for the Colby routes agrees with the diagrams (29%, 42%, 56%, 28%).
7. Alcatraz exits from the PM example intersection (Colby 131/1/32, Hillegass 43/12/54) combine to 64% toward Telegraph, 31.5% toward College and 4.8% straight, against the printed 64%, 32% and 4%.
8. Intersections where block flows into and out of the node differ by more than 15 vehicles: AM Canning and McAuley (123 in, 101 out), AM Ayala and Martin (287 in, 312 out), AM 62nd and Hillegass (215 in, 231 out), PM 63rd and Canning (109 in, 125 out), PM Canning and 59th (142 in, 96 out; the missing southbound label). Differences of this size are plausible from parking, driveways and counts taken at different intersections; they are not treated as reading errors.
9. The update of February 7 says "Monday, February 9th"; February 9, 2025 was a Sunday.

PM volumes on the Colby Street and Hillegass Avenue blocks from Claremont to Alcatraz are in `blocks` (period `pm`); AM volumes are there too.

## Other material in the doc

- Pilot origin: the city transportation department director sponsored a working group of about a dozen residents, community-council board members, a council office representative and city staff. Kickoff was January 28, 2025.
- City's initial proposal (project description v2, January 20, 2025): left-turn diverters at Hillegass/62nd and Colby/62nd (the "diagonal diverters" fallback). A neighborhood alternative was allowed, with a $40,000 quick-build budget. If it was not developed or acceptable, the city option would be installed.
- Stated purpose: reduce cut-through traffic on Colby and Hillegass without relocating impacts to other neighborhood streets. Moving traffic to the arterials is acceptable. Primary goal is reduced volume, with speed reduction secondary.
- Constraints: no part of the neighborhood cut off; no work on Telegraph, Alcatraz, College, Claremont or SR-24; tactical, removable measures only; data limited to human counts and a commercial location-data source.
- The city said the pilot stays in place 120 days, then is removed. It provided no equipment or labor for counting.
- Working-group consensus (March 26, 2025): gateway treatments at the main Claremont and Alcatraz entries (centerline hardening, evening left-turn restriction off Alcatraz, bulb-outs, turn wedges) plus interior calming (extra stop signs, mini traffic circles, speed humps, tables, pinch points). Five gateways were identified on March 12. City engineers were to return a plan; delivery slipped from April 9 to April 30, 2025, and the open house moved from April 16.
- Other inputs named: a university-built traffic model (results not included in the doc).
- Nothing in the doc quantifies what the city said about shifted traffic beyond the "no relocation to other local streets" principle.
- Planned install date was the week of March 31, 2025 before the schedule slipped.
