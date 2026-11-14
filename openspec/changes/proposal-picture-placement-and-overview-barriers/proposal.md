## Why

On the map at the fitted overview, a filter's yellow "MF" square covered its bars, which sit 8 m from the junction (2 to 3 px). On a proposal card the picture sat below the figures and could only be read on the page. Owner requests of 2026-11-14: draw filters as perpendicular bars like the proposal pictures, put the picture right after the card title, and make the picture a real image that can be saved and sent with its legend, period and the overall cut-through decrease.

## What Changes

- Modal filters on the simulation map are drawn by their bars alone, no "MF" square, legible at every zoom (minimum bar size), centered on their street and perpendicular to it. An invisible 24 by 24 px focusable control keeps each filter selectable and removable. Other interventions keep their badges. Map image export matches.
- A proposal card shows its picture directly after the title, before the summary, figures and list of changes. Wide screens put it beside the text; phones stack it first.
- The picture is an `<img>` of a PNG, 2x pixel density, with a Download image link. The PNG carries the title, the changes, the period, the legend with non-color cues, the through-car figures for the picture's period and for the card's average, a simulation and calibration note, the area name, attribution and the site address.
- The highlight for a reason in "Why cars cut through" is a dashed violet line, because the orange it used was the change view's orange.

## Impact

- Specs: simulator-ui (filters on the map; picture on proposal cards; why cars cut through highlight).
- Code: `src/components/Proposals.tsx`, `ProposalPicture.tsx`, `MapView.tsx`, `src/lib/blocked.ts`, `shareimage.ts`, `intents.ts`, `src/styles.css`.
