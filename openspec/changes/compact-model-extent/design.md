## Context

The shipped `rockridge` model covers the bounding box of `data/areas/rockridge.json`, 5.7 km by 3.1 km, from Market St to the Caldecott Tunnel. The study area is the Trapezoid, about 0.8 km by 1.1 km. Calibration rounds 33 to 37 (`data/calibration/rockridge.record.md`) traced the gridlock that kept the delay-feedback fit rejected to junctions 1.0 to 1.4 km from the study area: Claremont Ave / Russell St, Ashby Ave / Claremont Ave and Claremont Crescent, Avalon Ave / Claremont Blvd. Few counts constrain the network out there.

Decision by the project lead, 2026-11-16: "Yes, build and compare." Build a compact model alongside the current one without touching what is published, report both side by side, and leave the switch to the project lead.

## Goals and non-goals

Goals: the model extent becomes area data; a compact Rockridge model that uses the same counts, targets, demand method and simulator; an evaluation of it by the rules the current model is judged by; a comparison document.

Non-goals: tuning the compact model toward the four through-car ranges or the held-out stations; changing the simulator engine; changing anything published for `rockridge`; running the proposal search on the compact model.

## Decisions

### D1. The extent is a polygon, a network buffer and explicit includes

`extent.polygon` (lon, lat), `extent.bufferM` (meters along the network from the nodes in or on the edge of the study area) and `extent.include` (OSM way and node ids) are united: a node is in the model when it is in the bounding box and in any of the three. A polygon is what the compact Rockridge model uses, because the edges are chosen street by street to land on counted locations (D2), which a uniform buffer cannot do. The buffer is there for a new area where nobody has drawn edges yet.

Where a way segment runs from inside the polygon to outside it, the importer inserts a node at the crossing and the cut becomes a gate there. Without this the gate would be the last junction inside, and an edge drawn mid-block would still put the gate in a junction (the `Gates sit mid-block` rule). A crossing less than 1 m from the inside node is not split. Cut nodes take negative ids below the roundabout centers, so they cannot collide with OSM ids. Buffer and include cuts stay at nodes.

Without `extent` none of this code runs and the network is byte-identical (verified for `rockridge`: network, basemap and `areas.json`).

### D2. How the compact extent was chosen

Rule (project lead, 2026-11-16): the extent must contain, for every way a through trip can cross the study area, the competing arterial route from where the routes split to where they rejoin: the four bounding streets alongside the area, the SR-24 ramps and the surface streets that join them, and the junctions on the bounding streets with one block beyond. Gates must lie beyond the reach of queues from bounding-street junctions (round 37 measured longest queues of 56 to 90 m; the judged zone uses 200 m). Edges should sit where counts exist. Start from a ring of 300 to 500 m and move each edge to a counted location.

Edge by edge (the full list of cut roads and gates is in `data/calibration/rockridge.extent-comparison.md`):

- North: Ashby Ave and all its junctions from west of Telegraph Ave to Domingo Ave are in; the north-south streets are cut 80 to 110 m north of Ashby Ave. Through trips from Berkeley choose between Telegraph Ave, Hillegass Ave, Colby St, College Ave and Claremont Ave at or north of Ashby Ave, so the split lies on the edge. Ashby Ave carries the Caltrans SR-13 AADT stations at Claremont Ave and Domingo Ave (DATA), and the 2010 worksheet count at Ashby Ave / Claremont Ave is a station inside. Claremont Ave and Claremont Blvd are cut between Ashby Ave and Russell St, which leaves out the Russell St all-way stop and Avalon Ave; Tunnel Rd is cut about 100 m east of the Domingo Ave signal, at the Caltrans station.
- West: the east-west streets are cut halfway between Telegraph Ave and Shattuck Ave (Racine St in, Shattuck Ave out), 130 to 330 m west of Telegraph Ave. The Alcatraz Ave gate is 307 m from the counted Telegraph Ave / Alcatraz Ave junction.
- Southwest: a pocket keeps Telegraph Ave / 51st St and 52nd St (counted turning movements), the Claremont Ave / Telegraph Ave junction, Shattuck Ave / 52nd St (counted) and the SR-24 ramps at 52nd St (Caltrans ramp ADT). Those ramps are the westbound on-ramp and eastbound off-ramp that compete with the Trapezoid's own ramps at Hudson St and Aileen St. The SR-24 mainline is cut at Shattuck Ave; the Martin Luther King Jr Way ramps are out.
- South: Telegraph Ave is cut between 48th St and 49th St, south of the Telegraph Ave / 51st St count; the edge runs northeast one block southeast of Claremont Ave to College Ave south of Forest St (Rockridge BART).
- East: Broadway with the SR-24 ramps at Broadway, Keith Ave and Miles Ave (Caltrans ramp ADT) is in, because College Ave to Broadway is the competing route for SR-24 trips that could cut through to the Telegraph Ave ramps. Side streets are cut one block beyond Broadway; SR-24 is cut east of the Broadway ramps, which leaves out the SR-13 interchange. North of SR-24 the edge runs straight to Tunnel Rd and takes in the hill streets between Claremont Ave and Broadway; these have no counts and their gates use class defaults (ASSUMPTION).

The rule pushed the north and east edges beyond the starting ring (Ashby Ave lies 550 to 900 m from the study area, the Broadway ramps 900 m). The west and southwest edges stay within it. The nearest gates are 176 m from the study-area polygon (56th St, Aileen St, 57th St, west of Telegraph Ave), farther than the longest measured queue but inside the 200 m judged-zone buffer; this is stated in the comparison.

### D3. The compact area is a second area with copied settings

`data/areas/rockridge-compact.json` is `rockridge.json` with another id and name, the extent and `preview: true`; a test checks that every other key is equal. `data/demand/rockridge-compact.config.json` and `data/calibration/rockridge-compact.targets.json` are copies with the output paths and the area id changed, and the demand config's `bbox` set to the bounding box of the extent polygon. The binaries (`calibrate`, `explore`), `tools/assess.ts` and `tools/cost-loop.ts` find an area's files by its id, so copies let every existing tool run on the compact area without a code change. The cost is that the copies can drift from `rockridge`; if the compact model is kept, an `extends` key or a shared file would replace them. The counts (`intersection-counts`, the volunteer count, the raw Oakland, Caltrans and LODES files) are not copied; the compact config points to the same files.

### D4. Demand: the same build, restricted to the extent

`tools/build-demand.ts` runs unchanged on the compact config apart from one rule: census blocks outside the extent are dropped (before, every block in the demand `bbox` loaded its nearest node, which for a compact model would pile the trips of blocks beyond the gates onto the edge). Gate volumes, the count fit, assumed movements, ramp choice, the local-trip rules and the through-trip definition (neither end at a study-area node) are those of the shipped build. Stations whose links are not in the compact network drop out; the split is frozen anew for the compact area by the same rule and salt (`build-demand.ts --freeze-split` on the compact config), so its held-out set is not the same as `rockridge`'s for the stations both share. The peripheral-trip rules (P1 corner clipping, P2 cap) measure positions on the rectangle of the demand `bbox`, which for the compact model is the bounding box of the polygon (ASSUMPTION: the rectangle stands in for the polygon edge, as it did for the bounding box of the current model).

### D5. What the compact model loses

Gate volumes are fixed by counts and class defaults. Traffic that a change in the Trapezoid pushes off its usual route can only move to roads inside the extent; it cannot move to Shattuck Ave, Martin Luther King Jr Way, Broadway Terrace, SR-13 or the Berkeley streets north of Ashby Ave. Displacement therefore lands on the bounding streets and on Ashby Ave, Broadway and 51st St, and a proposal's effect on those streets is an upper bound. The same holds at the edge of the current model, farther away. The compact area's caveat and the comparison say this.

### D6. Preview areas

The app has no area picker: it opens the area a scenario link names and otherwise the first entry of `areas.json`. The importer lists preview areas after the others, the app's fallback skips them, and `areas.json` carries `preview: true` so other tools can leave them out. A link with `a=rockridge-compact` opens the compact model.

### D7. Evaluation

The compact model is judged by the rules the current model is judged by, with nothing tuned: validation suite (unaffected, the engine is unchanged), PM seeds 1 to 10 and 11 to 20, AM and midday seeds 1 to 10, the assessment to its own output set (`--suffix`), the delay-feedback loop under the unchanged acceptance rule, and three published proposals on both models with `explore --check` (PM, AM and midday, seeds 1 to 3). Results are in `data/calibration/rockridge.extent-comparison.md`.

## Risks

- The copies of the area config, demand config and targets can drift from `rockridge` while both exist.
- The compact split differs from `rockridge`'s, so held-out scores are not on identical station sets; the comparison gives the station counts.
- Fewer counted gates: most compact gates are residential streets at class-default volume (ASSUMPTION), as on the current model's edges.
