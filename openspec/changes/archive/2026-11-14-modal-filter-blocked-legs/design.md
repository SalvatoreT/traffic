## Context

A node modal filter sets `node_filter` in `crates/sim/src/eff.rs`: every movement through the node is disallowed for cars, including turns between any two legs. Where the importer merged several OSM nodes into one junction (an offset crossing), the filter therefore also closes the street that runs between the original nodes.

## Decisions

D1. Owner decision, 2026-11-14 (lead): show on the map which street segments a filter blocks, at the mouth of each leg, with a bar across the street plus the existing badge; name the blocked legs in the Scenario list and pop-up; say that the filter covers a whole consolidated junction.

D2. Legs come from the existing `nodeLegs` (one leg per street approach, two directions merged) and compass words from `legDirections`. Two legs that share a name and a compass word are numbered. Legs are listed by street name, then clockwise from north.

D3. Merged-junction detection uses what the network carries. It does not carry the merged OSM node count, so a junction is called merged when any leg's street mouth lies more than 3 m from the node point (the importer keeps a leg's real mouth in its geometry), or it has more than four legs, or more than two named streets. The text gives the farthest mouth-to-mouth distance rounded to 5 m. Writing the merged count into the network would need a data rebuild and is left for later.

D4. A leg mark sits at the mouth, pushed out along the leg so it clears the badge (at least 36 CSS px from the node, recomputed on zoom). Mark shape is a black bar with yellow dashes and a white halo, the same barrier look as the diagonal diverter, so it reads without color. A block filter is drawn as the same striped tape along the block. Text carries the same information (WCAG 2.2 AA). No animation.

D5. `describeIntervention` stays short (used in remove labels and messages). `describeInterventionFull` and `filterText` add the closed legs. Proposal cards keep their stored labels.

## Measurement

PM peak, seeds 1 to 3, 60 min, 10 min warm-up. With the owner's six filters, 57th St Vicente to Ayala fell from 128 to 20 veh/h and Ayala Ave Hermann to Martin from 136 to 17; Telegraph Ave rose 100 to 200 veh/h. Ayala Ave and 57th St lose traffic because Ayala Ave & Martin St is filtered; the only open path from them to Claremont Ave goes out to Telegraph Ave.
