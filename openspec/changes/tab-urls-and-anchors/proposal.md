## Why

Every tab lived at the same address, so a link could not point at Proposals, Sources or a single reason card, and Back left the app instead of moving between tabs. The project lead asked: "The tabs should have `/proposals` and such in the URL for other tabs. Each section should have anchor links."

## What changes

- The path names the tab: `/` is the Map, and `/proposals`, `/streets`, `/assumptions` and `/sources` are the others. The tabs are real links, Back and Forward move between them, and loading any of those paths opens that tab. An unknown path opens the Map and the address is corrected.
- The fragment stays the scenario (`#v1;…`) on every tab path, so old links, QR codes and stored-result keys keep working. Any other fragment is a section anchor on the current tab, such as `/assumptions#why-cars-cut-through`.
- Every section heading on Proposals, Assumptions, Sources and Streets has a stable id and a link control that copies the section's address. Proposal cards, reason cards, movement cards and citations use their data ids.
- Internal pointers (About these reasons, Sources and Assumptions, the calibration Details link, citations in Results) are links to the new addresses. "Copy link to this scenario" copies the current tab's path with the scenario fragment.
- The page title names the tab.

The Worker and its asset configuration need no change: the single-page fallback already serves the app for any path that is not `/api/*` or `/data/*`. Tests pin that.
