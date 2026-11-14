## Context

Owner request, 2026-11-14: move the card picture up, and make filter bars visible when the map is zoomed out to the fitted overview.

## Decisions

D1. The card body is a grid: summary across the top, then the picture column (picture, caption, legend, button), then the figures and changes. DOM order matches reading order, so screen readers meet the picture right after the summary. Below 720 px the grid is one column. The picture column is on the left from 720 px up so visual and DOM order agree.

D2. Badge size is linear in zoom from 16 px at z14 and below to 26 px at z16.5 and above (ASSUMPTION: design choice, not calibrated). Label size follows, from 8.5 to 11 px. A transparent pseudo-element makes every badge a 24 by 24 px target at least (WCAG 2.2 SC 2.5.8). The badge is `aria-hidden`; the same information is in the Scenario list.

D3. A leg bar sits `max(8 m, (badge/2 + bar thickness/2 + 2 px) at the current meters per pixel)` along its leg from the leg's mouth. Bars are re-placed when the zoom changes by more than 0.04. A bar is therefore on its own street at every zoom, and outside the badge when the badge would otherwise cover it. At zoom 16.5 and above the 8 m rule governs.

D4. A block filter's badge is offset along the street from its bar by 24 px at full size, scaled by the badge size.

D5. Image export uses the same functions at the current zoom (`badgePx`, `barAtM`, `blockBadgeOffset`) so the picture matches the screen. Badges now measure 26 px outer size in both the page and the export; the page was 30 px because of a content-box border.
