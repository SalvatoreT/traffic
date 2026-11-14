## Context

The owner's feedback, 2026-11-14, from two phone screenshots in the dark theme:

- "The modal filters should always be perpendicular to the road. This one is running along Ayala." This was the block filter on Ayala Avenue between Howell Street and Forest Street.
- "The barriers should be bound to the road, but it looks like they're painted with the modal filter square. When I zoom out, I expect the barrier lines to get smaller like the roads and stay at the end of the road."

## Decisions

D1. Bar position is geometry in meters. `barAcross` takes a street polyline and a distance along it and returns the point and the street's bearing there; the bar is drawn at a right angle to that bearing. An intersection filter puts one bar per closed leg 8 m along the leg's street from its own mouth (the leg path starts at the street's first point, so a consolidated junction measures from where that street begins, not the merged node). A block filter puts one bar at the link midpoint.

D2. Bars are a GeoJSON point source drawn by a symbol layer with a generated bar image, rotated with the map (`icon-rotation-alignment: map`), so they stay on the street at every zoom. Their size tracks the drawn road, not true ground scale (review follow-up: ground-scale bars were thinner than the roads at z16). Length is 2.2 and thickness 0.6 times the base road casing width, using the casing layer's own zoom stops (14 to 18, flat outside) at a mid-weight street (flow-line width halfway between the thinnest and thickest). The 2.2 and 0.6 are design choices, not calibrated. At z14 the bar is 8.8 x 2.4 px, z15 11.8 x 3.2, z16 14.8 x 4.0, z17 17.8 x 4.9, z18 and up 20.8 x 5.7. The bar is not pushed out in pixels, so under about z15 an intersection bar sits under its MF badge.

D3. The pattern (dark bar, yellow dashes, light halo) is kept so color is not the only signal, with no animation. The layers do not take pointer events, and the MF badge stays the clickable marker.

D4. The 36 px placement and the zoom-time recompute are removed. The image export draws the same bar at the same pixel size for the map's zoom. A block filter's badge sits 24 px along the street from its bar, so the badge does not cover the only bar.

D5. Per-street filters still show only their closed legs. Diagonal diverters and text descriptions are unchanged.
