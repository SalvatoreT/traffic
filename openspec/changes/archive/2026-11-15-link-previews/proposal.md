## Why

Every shared link to the site, including proposal links, unfurls in chats with the same bare default, because preview crawlers run no JavaScript and never see the URL fragment. The project lead asked: "Make the preview links you share look nicer. If there's a known 'open on the map' proposal, show the map for it in the preview. Make something that looks nicer and is more helpful than the default."

## What Changes

- Each published proposal gets a stable share path `/p/<slug>`; the app opens it on the Map with that proposal's scenario and period.
- Every place the site hands out a link to a published proposal uses the share path.
- `npm run data:previews` writes a 1200x630 JPEG card and preview text for the home page, each tab and each proposal.
- The Worker puts the matching tags in the app shell's head and serves the cards from the bucket.

## Impact

Specs: simulator-ui, agent-access. New dev dependencies: `@resvg/resvg-js`, `jpeg-js`, `opentype.js`; a bundled Inter subset (OFL).
