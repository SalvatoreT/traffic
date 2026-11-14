## Context

The owner's feedback, 2026-11-14, from two phone screenshots in the dark theme:

- "The modal filters should always be perpendicular to the road. This one is running along Ayala." This was the block filter on Ayala Avenue between Howell Street and Forest Street.
- "The barriers should be bound to the road, but it looks like they're painted with the modal filter square. When I zoom out, I expect the barrier lines to get smaller like the roads and stay at the end of the road."

## Decisions

D1. Bars are geometry in meters. `barAcross` takes a street polyline and a distance along it and returns the two ends of a bar at a right angle to the local bearing. An intersection filter puts one bar per closed leg 8 m along the leg's street from its own mouth (the leg path starts at the street's first point, so a consolidated junction measures from where that street begins, not the merged node). A block filter puts one bar at the link midpoint.

D2. Bars are a GeoJSON line source in lon/lat with three layers (white halo, dark bar, yellow dashes). The bar length is 12 m, wider than the drawn road (assumption: road width plus margin, not surveyed). Line widths are exponential in zoom with base 2, which is how ground size scales on a Web Mercator map, so 1 m is 2^z / 123,600 px at this latitude. At z18 the bar is about 25 px long and 6 px thick, at z16 about 6 px and 1.5 px, at z14 it is under 2 px. Far out the bars become small along with the roads. That is expected.

D3. The pattern (dark bar, yellow dashes, light halo) is kept so color is not the only signal, with no animation. The layers do not take pointer events, and the MF badge stays the clickable marker.

D4. The 36 px placement and the zoom-time recompute are removed. The image export converts the same bar ends to screen pixels and scales stroke widths by the pixels per meter.

D5. Per-street filters still show only their closed legs. Diagonal diverters and text descriptions are unchanged.
