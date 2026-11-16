## Decisions

**Copy is checked against the code.** Each statement on the page was compared with the specs and the simulator before it was written. Where the outline and the code differed, the code won:

- Cut-through is counted the first time a car leaves a residential or service link inside the study area, so a trip on a bounding street (which is not a side street) is never counted (traffic-simulation spec, "Cut-through metrics").
- Route choice is a perceived-cost model: each driver picks a route at departure from current link times with per-link noise fixed for the trip, and only drivers who follow live guidance change it later, when an alternative is clearly cheaper (traffic-simulation spec; `crates/sim/src/route.rs`). "Some switch" says that without a share.
- The proposal search is a beam search that starts at the blocks and intersections carrying the most cut-through trips and grows packages one change at a time. It does not try every combination. The score is the percent of through cars removed minus a weighted penalty on the largest rise in all cars on any one block (`data/proposals/README.md`, "Search"). It never adds signals.
- "Counts it was not tuned on" is too strong. About a quarter of the count stations are held out of the fit, but earlier tuning rounds looked at their scores, so the calibration record calls them a diagnostic holdout and not independent validation (`data/calibration/README.md`, "Evidence integrity"). The page says that.
- The shortlist is rerun on confirmation seeds that took no part in screening or choosing (`--confirm-seeds`), which are the runs the published figures come from. A seed is explained on the page in one sentence.
- The volunteer count is one hour of one day. The page says "from one day" and names no one.

**Shared copy.** The sentences live in `src/lib/methodology.ts`, the way `copy.ts` serves the other tabs, so the component and `methodologyMd` cannot drift. A test holds the total to 450 to 650 words, rejects equations and the word "owner", and checks the area name and calibration status are read from the area entry.

**Live calibration status.** The Checking section reads the area's `calibration` entry (status text from `calibrationStatusText`, plus its `note`) and states no figure of its own. It links to Assumptions and Sources for detail.

**Nothing area-specific in code.** The area name comes from the bundle. The cut-through diagram is a schematic and not the real outline, so it works for any study area. The data sources named on the page ("city and state counts", "a resident volunteer count") are the first area's; a later area with other sources needs this line to read from its provenance.

**Diagrams.** Inline SVG themed with the app's CSS variables. The step diagrams are drawn twice, in a row from 720 px wide and stacked below it, and CSS shows one of them. Each has `role="img"` with a title and description, and the same steps appear as a numbered list beside it. The three trips differ by line style (solid, dashed, dotted) and number as well as color. Nothing animates.

**Voice.** Prose went through the humanizer skill: short sentences, no equations, no bold labels beyond list lead-ins, no dashes.
