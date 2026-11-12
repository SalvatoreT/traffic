## Context

Requested by the user on 2026-11-12: select the street or intersection first, then pick
the intervention from the side panel or a pop-up.

## Decisions

### D1 One menu, three placements
A single selection menu component lists the selected place's name, the interventions
that apply and any already there. It renders in a pop-up anchored to the selection on
desktop, in the bottom sheet on phones (the sheet rises to half height), and inline in
the Scenario panel when the place was chosen from the search list. A pop-up alone was
rejected because it is cramped on a phone and unreachable without the map.

### D2 What applies where
Street block: modal filter, speed hump at the clicked point (block midpoint when chosen
from the list), speed limit with a value, one-way with a direction. Intersection: modal
filter, traffic circle, control type, signal cycle when the intersection is signalized or
being changed to a signal, turn ban with a from and a to street. Options that would do
nothing are left out: no one-way on a street that is already one-way in that direction,
no traffic circle where one exists.

### D3 Selection is visible and dismissible
The selected block or intersection is highlighted on the map with more than color.
Escape, a click on empty map or the menu's close button clears it. Opening the menu moves
focus into it and closing returns focus to where it came from.

### D4 Search finds both kinds
One search box returns street blocks and intersections together, grouped, in place of a
list that changes with the chosen tool.
