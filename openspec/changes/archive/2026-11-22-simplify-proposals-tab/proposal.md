## Why

The Proposals tab shows too much at once. Each card carries two or three figure boxes, a map with its readout, three lists, variants, a table of changes and a long "More detail" block, and the page above the cards adds four paragraphs. People who want the answer (how many through cars the package removes, and what it costs the worst block) have to read past all of it. The Streets tab duplicates what the map shows and what the text pages list, and it costs a tab on a phone where the tab row already scrolls. On phones the tab row gives no sign that more tabs exist, the theme selector takes prime header space, the source link is hidden, and the page can be dragged sideways.

## What Changes

- Remove the Streets tab: its component, styles, tests, sort and column helpers, the text page `streets.md` and its preview card. Old `/streets` links open the Map with their scenario. The block-by-block baseline table moves into the overview page (`/index.md`) because no other page carries it as text.
- Proposals tab: each card shows its title, headline figure, one line on the worst block, the map and the open and copy controls. Everything else sits in closed `details` disclosures with labels that say what is inside. The page introduction shows two sentences and folds the rest.
- Pin each card's header (title and headline figure) at the top of the scroll area, the way the Assumptions headings are pinned.
- Tab row: add a fade and arrow on each edge that has more tabs, center the active tab, and keep the row keyboard and touch reachable.
- Move the Theme control from the header to the footer and make it smaller.
- Show the footer on phones, with the Map tab's bottom sheet sitting above it, so "Source on GitHub" is always reachable.
- Stop sideways panning on phones: check every tab at 320, 375 and 414 px, closed and open, and guard the page and the scroll area against stray overflow.

## Capabilities

### Modified Capabilities
- `simulator-ui`: tabs and URLs, Proposals tab content and arrangement, sticky card headers, tab-row cue, footer, phone layout.
- `agent-access`: the text pages no longer include a Streets page; the overview carries the table.

## Impact

Code: `src/App.tsx`, `src/components/Proposals.tsx`, `ProposalMap.tsx`, `ScrollRow.tsx`, `Sheet.tsx`, `src/lib/route.ts`, `src/lib/overflow.ts`, `src/styles.css`, `tools/lib/llms-docs.ts`, `tools/lib/previews.ts`, `worker/llms.ts`, `wrangler.jsonc`, docs and README.

Generated files that need regenerating and publishing (not done here): `public/data/llms/*` (`streets.md` is gone, `index.md`, `llms.txt`, `llms-full.txt` and `proposals.md` change) and `public/data/og/*` (the Streets card and its `index.json` entry go). The R2 objects `areas/llms/streets.md` and the Streets card can then be deleted.

Out of scope: simulator changes, new figures, changes to what the proposals file records.
