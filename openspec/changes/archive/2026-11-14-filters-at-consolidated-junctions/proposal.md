## Why

The owner found that a modal filter at a junction the importer merged (Ayala Avenue and Martin Street, two OSM nodes about 20 m apart, one per half of Martin Street; Howell Street and McAuley Street, about 30 m apart) closes every movement through the merged node. That includes straight travel along the main street between the two T-junctions, which a real filter on one side street would not close. The Ayala and Martin filter appears in most published proposals, so the distortion reaches the results the model exists for: through cars on residential streets inside the study area.

## What Changes

- A node modal filter gains an optional list of closed legs. Cars cannot enter or leave the junction by those legs; every other movement stays open. Without the list the filter closes the whole junction, as before.
- The leg identity in the simulator is the ids of the links on each closed leg. Scenario links write the closed legs as bearings after the geohash, so old links keep their meaning and a rebuilt network restores the same streets.
- The intersection menu offers "Filter the whole intersection" and, per street, "Filter <street> here". At a consolidated junction the per-street options come first, open by default, with a line that says why.
- Leg marks, the Scenario list, the pop-up and the exported map show only the legs a filter closes.
- The proposal search offers a per-street filter next to the whole-junction filter at every intersection where the whole-junction filter is a candidate and closing one street leaves at least two other legs connected. Labels read "Modal filter on Martin Street at Ayala Avenue". A reference package can name the street with `"street"`.

## Impact

- `crates/sim/src/eff.rs`, `model.rs`, `explore/cands.rs`, `explore/naming.rs`, `explore/link.rs`, `explore/refs.rs`
- `src/types.ts`, `src/lib/blocked.ts`, `hash.ts`, `describe.ts`, `scenario.ts`, `selection.ts`, `throughroutes.ts`, `src/sim/mock.ts`, `src/components/SelectionMenu.tsx`, `MapView.tsx`
- No change to the network, the demand or any calibrated behavior: the consolidated node keeps its traffic control and geometry.
