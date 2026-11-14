## Context

A node modal filter sets `node_filter` in `crates/sim/src/eff.rs`: every movement through the node is disallowed for cars. Where the importer merged OSM nodes into one junction, the node filter also closes the street that runs between them. The owner raised this on 2026-11-14 with two examples: Ayala Avenue and Martin Street (two OSM nodes about 20 m apart, one per half of Martin Street) and Howell Street and McAuley Street (about 30 m apart). A real filter on one side street would leave straight travel along the other street open. The Ayala and Martin filter is in most published proposals, so the distortion reaches the results the model exists for.

## Decisions

D1. Owner decision, 2026-11-14 (lead): keep the consolidated node for traffic control and geometry. Un-merging the network would change calibrated behavior. Make the intervention finer instead.

D2. A modal filter gains an optional `legs`: the ids of the links on each closed leg, both directions. In `Eff` a link whose far end is the node is flagged "cannot enter the junction from here", one whose near end is the node "cannot leave onto here"; a movement is closed if either flag applies. Without `legs` nothing changes (`node_filter`). Link ids are what the simulator indexes, they are unambiguous when two legs go to the same neighbor, and they match how turn bans and block filters already name links. They do not survive a network rebuild, and they do not need to: a scenario link carries bearings (D3), and the intervention list is rebuilt from the link on load.

D3. The scenario link writes the closed legs as whole-degree bearings joined by `.`, after the geohash: `mn,<geohash>,90.270`. Diverters and turn bans already identify legs by bearing, and a bearing survives a rebuild. A link without the field means the whole junction, so every old link keeps its meaning. On load each bearing is matched to the nearest unused leg within 45 degrees; a bearing with no leg is listed as unplaced and the rest of the scenario loads. Closing every leg writes the plain `mn` form, so one filter has one spelling.

D4. A leg-level filter whose links touch no leg of the node is invalid (`invalidInterventions`) and does not widen into a whole-junction filter. Assumed movements (`via`) through a closed leg fall back to their alternatives or the plain route, because they already check `mv_ok`.

D5. UI. The intersection menu offers "Filter the whole intersection" and, where the other legs still connect (at least two remain), "Filter <street> here". At a junction the importer merged (D3 of the earlier blocked-legs change), the per-street choices come first, the list starts open, and a line says the junction combines the streets and a street filter closes only that street. Each choice previews the legs it closes. Adding the whole-intersection filter replaces any street filters at that node; a street that already has its filter is not offered again. Marks and text show only closed legs. Descriptions read "Modal filter on Martin Street at Ayala Avenue".

D6. The proposal search offers a per-street candidate wherever it offers the whole-junction filter (all-local intersections with at least three legs) and closing the street leaves two or more other legs. At a T the side street alone qualifies; at a four-way both streets do. A per-street candidate conflicts with every other intervention on the node. Profiles filter by intervention type and by location, so the pilot limits apply unchanged. References may add `"street": "<name>"` to a node filter.

D7. Spec text for "A node filter closes every leg" is renamed and narrowed to say that a filter closes every leg unless it names legs.

## Measurement

PM peak, seeds 1 to 3, 60 min, 10 min warm-up, current network and demand. Cells are veh/h (both directions, all cars) / through cars per hour, summed over each street's links within 300 m of the two junctions. The last column is the model's study-area through cars per hour over the whole run.

| Variant | 57th St | Ayala Ave | Martin St | Howell St | McAuley St | Study-area through cars/h |
| --- | --- | --- | --- | --- | --- | --- |
| Today (no scenario) | 338 / 112 | 837 / 363 | 436 / 189 | 235 / 140 | 278 / 161 | 598 |
| Ayala & Martin: whole junction | 102 / 8 | 347 / 139 | 26 / 0 | 243 / 126 | 362 / 189 | 512 |
| Ayala & Martin: Martin St legs only | 282 / 93 | 808 / 311 | 35 / 0 | 210 / 115 | 324 / 175 | 555 |
| Ayala & Martin: Ayala Ave legs only | 116 / 17 | 295 / 116 | 422 / 188 | 184 / 105 | 317 / 158 | 573 |
| Howell & McAuley: whole junction | 345 / 113 | 800 / 314 | 423 / 172 | 74 / 51 | 136 / 44 | 576 |
| Howell & McAuley: McAuley St legs only | 330 / 110 | 813 / 327 | 425 / 172 | 286 / 183 | 131 / 47 | 593 |
| Howell & McAuley: Howell St legs only | 349 / 110 | 846 / 338 | 444 / 190 | 57 / 40 | 308 / 182 | 602 |
| Owner scenario: both whole | 99 / 1 | 90 / 0 | 25 / 0 | 3 / 0 | 39 / 0 | 35 |
| Owner scenario: Martin legs, McAuley whole | 100 / 0 | 97 / 0 | 26 / 0 | 2 / 0 | 39 / 0 | 40 |
| Owner scenario: Ayala/Martin whole, McAuley legs | 93 / 0 | 86 / 0 | 26 / 0 | 16 / 0 | 40 / 1 | 37 |
| Owner scenario: Martin legs, McAuley legs | 100 / 1 | 97 / 0 | 27 / 0 | 16 / 0 | 43 / 0 | 41 |
| Owner scenario: Ayala legs, Howell legs | 126 / 12 | 256 / 113 | 525 / 264 | 2 / 0 | 515 / 368 | 277 |
| Owner scenario without either junction filter | 210 / 55 | 455 / 218 | 490 / 248 | 292 / 191 | 426 / 303 | 291 |

What changes, in plain words:

- A single filter at Ayala and Martin matters. The whole-junction filter cuts through cars on Ayala Avenue from 363 to 139 an hour and on 57th Street from 112 to 8, because it also closes straight travel along Ayala between the two halves of Martin Street. A filter on Martin Street alone leaves that movement open: Ayala keeps 311 through cars an hour and 57th Street 93. Martin Street goes to zero through cars either way. A filter on Ayala Avenue alone does the reverse: Martin Street keeps 188 and Ayala falls to 116.
- A single filter at Howell and McAuley matters less. Whole junction: Howell 140 to 51, McAuley 161 to 44. McAuley legs only: McAuley 47 and Howell rises to 183 through cars, because Howell stays connected. Howell legs only: the mirror image. The study-area figure moves by 17 to 26 cars an hour between these variants, within the run-to-run spread (seed standard deviation 25 to 28).
- In the owner's six-filter scenario the choice makes no visible difference: 35, 40, 37 and 41 through cars an hour for the four combinations (spread between seeds 5 to 9), against 291 without either junction filter and 598 today. The other four filters and the block filter already cut every through route that Ayala straight travel served, so the straight movement carries almost nothing (2 trips an hour at the node, against 80 today). Closing the other street instead (Ayala and Howell legs) leaves 277 through cars an hour, almost as many as with no filter at these two junctions.
- Reading: the whole-junction filter overstates the effect of a one-street filter at a consolidated junction when nothing else closes the main street's other connections. The distortion is real but depends on what else is in the scenario.

## Risks

- Link ids are not stable across rebuilds; the link text (bearings) is the stored form. A scenario kept as a list of interventions in memory is only valid for the network it was built on, as before.
- Two legs of one street that leave at nearly the same bearing could be matched to each other on load. The 45 degree window and the one-to-one matching keep the result stable for the junctions in the study area; a junction with such legs would need a finer key.
