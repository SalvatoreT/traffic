## Context

Integration on 2026-11-11: AM peak at demand scale 1.0 (~12k veh/h) produced gridlock
removals and arterial mean speed near 2 m/s; scale 0.3 ran freely. Only two gates have
count data; the rest use per-class default volumes. Observed route shares are available
for two residential streets and the freeway ramps.

## Decisions

### D1 Measure before tuning
Build the measurement tool first and tune by hand with each change recorded, rather than
an automatic optimiser. With ~10 observed shares and dozens of free parameters an
optimiser would overfit; a short, explained list of adjustments is auditable.

### D2 Select-link analysis in the core
The simulation records, for configured links, each traversing trip's origin, destination
and the named streets used before and after. This mirrors how the observed data was
produced, so modelled and observed shares are directly comparable.

### D3 Tune demand before behaviour
Order of suspicion: default gate volumes (assumptions) → origin/destination distribution
→ intersection capacity parameters marked ASSUMPTION → literature-sourced parameters
(left alone unless clearly mis-applied). Car-following parameters from [Treiber2000] and
calibrated ranges stay fixed.

### D4 Stability criterion
The baseline is "stable" when a 60-minute PM-peak run at scale 1.0 has zero gridlock
removals, backlog below 2% of spawned trips, and arterial mean speed above 4 m/s.

### D5 Fit tolerance
Modelled select-link shares within ±10 percentage points of observed for the headline
shares (freeway origin/destination share on Hillegass and Colby); others reported but
not gated. StreetLight samples are themselves approximate.
