## Why

On a proposal card the picture sat below the figures and the list of changes, so people scrolled past the main evidence to see what a package does. On the map at the fitted overview, filter bars sit 8 m from the junction, 2 to 3 px on screen, and the 26 px filter badge covers them completely, so a filter looks like a lone badge.

## What Changes

- The card shows the picture, with its caption, legend, period note and "Open on the map" button, directly after the title and summary and before the two figures and the list of changes. Wide screens put the picture beside the figures; phones stack it first.
- Intervention badges on the map scale with zoom, from 16 px at the overview to full size at z16.5, with a transparent hit area of at least 24 by 24 px.
- A filter bar sits at the larger of 8 m and the ground distance that clears the badge, so it stays on its street, just outside the badge, at every zoom. A block filter's badge offset scales the same way. Exported images match.

## Impact

- Specs: simulator-ui (picture placement; filter bars and badges across zoom).
- Code: `src/components/Proposals.tsx`, `src/components/MapView.tsx`, `src/lib/blocked.ts`, `src/lib/mapexport.ts`, `src/styles.css`.
