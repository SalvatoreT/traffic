## Context

Requested by the user on 2026-11-12, in three messages: show only the trapezoid plus some
buffer, keep the cut-through scale from changing, and open on the non-experimental period.

## Decisions

### D1 Filter what is drawn; leave the model alone
Links, agents, signals and markers outside the buffered study area are not drawn, and the
camera is bounded to that region. Results still come from the whole network. Shrinking
the simulated network back down was rejected: the wider area is what made route shares
on Hillegass and Colby fit without tuning.

### D2 A 250 m buffer
Wide enough to show the bounding streets with both sides of their intersections and the
first block beyond, narrow enough that the trapezoid fills the view.

### D3 Fixed tops for the overlay scales
The top of the cut-through scale is 150 vehicles an hour: 1,500 vehicles a day at a
peak-hour share of 0.10. The daily figure is the level bikeway design guidance is
commonly quoted as preferring for a shared neighborhood street, but it could not be
verified against the guide itself, so the app and the code label it an assumption. Flow
tops out at 800 vehicles an hour, about one signalized lane's capacity in the validation
suite. An adaptive top was tried first and removed because the re-scaling was jarring.

### D4 First period shown
The first load uses the area's default period if it is not experimental, otherwise the
first period that is not experimental. A shared link that names a period still opens on
it, and links leave the period out when it is the default.
