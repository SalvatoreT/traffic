## Why

The project lead asked for through cars to be grouped by the specific freeway ramp they use: two reasons in the Assumptions tab, one for southbound Telegraph Ave and west-side traffic turning off Alcatraz Ave to reach the SR-24 on-ramps and one for Berkeley and College Ave traffic using Hillegass Ave and Colby St to reach the same on-ramps, were too alike to be useful. The same grouping applies to cars coming from specific off-ramps.

## What changes

- The network yields a list of freeway ramps (one definition, `tools/lib/ramps.ts`): a chain of freeway-class links entered from a surface street (on-ramp) or ending at one (off-ramp), with a stable id and a plain label.
- The demand file carries the ramps and the reasons that match on them (`onRamp`, `offRamp`, or `other`). The simulator tallies each through car at the moment it is counted: first match wins, on-ramp from the planned route, off-ramp from the links driven, otherwise the origin-and-destination reasons as before. Per-reason totals still add up to the through count.
- The area config lists the reasons in three sections. One reason is listed per ramp that carries about 3% or more of the PM peak's through cars; the rest go under Other on-ramps and Other off-ramps.
- The Assumptions tab and the results panel show the three headings and the per-ramp reasons. A ramp reason's map marks the ramp with a labeled point. Each card says where its cars mostly start or are bound, computed from the run.
