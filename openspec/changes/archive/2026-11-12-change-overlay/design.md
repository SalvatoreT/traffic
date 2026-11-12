## Context

Requested by the user on 2026-11-12: with interventions in place, show increases and
decreases in the metrics on the map.

## Decisions

### D1 A view switch, not a fourth overlay
The overlay keeps its three metrics. A separate switch chooses between "Scenario" and
"Change from baseline". Adding change versions of each metric to the selector would
double it and hide the fact that they are the same measure.

### D2 On by default once there is something to compare
Adding the first intervention switches to the change view, since that is what the person
just asked the model. Their later choice is remembered. With no interventions the switch
is not shown.

### D3 A fixed two-sided scale
The scale is symmetric about zero with the same fixed tops as the one-sided scales, so
colors mean the same thing throughout a run. Decrease and increase use two hues that
stay distinguishable for color-blind readers, and the direction is also carried by a
sign in the legend and in the street's readout. The colors say less and more, not better
and worse: more speed on a residential street is not an improvement.

### D4 A dead band for noise
Baseline and scenario share a seed, but a change in one place reshuffles arrivals
everywhere, so small differences appear on streets the intervention never touched.
Differences inside a small band around zero draw as no change, and the existing caution
about the first ten simulated minutes applies to this view too.
