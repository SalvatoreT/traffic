## Why

Visitors see through-car figures and proposals with no plain account of how either is made. A short methodology page, written for a college freshman, says what the simulation is, how today's traffic is built, what counts as cut-through, how the model is checked, how proposals are found and what the results cannot tell you.

## What changes

- A Methodology tab at `/methodology`, between Streets and Assumptions, with six short sections and three inline SVG diagrams.
- The page copy lives in `src/lib/methodology.ts` and is shared with a generated text page, `/methodology.md`, listed in `llms.txt`, the overview page and the full text file.
- The tab is served by the Worker like the other tabs, has a link-preview card entry and a line in the no-script fallback.

## Impact

- Specs: simulator-ui (Tab URLs, Assumptions tab order, new Methodology tab).
- Code: `src/lib/route.ts`, `src/App.tsx`, `src/components/Methodology.tsx`, `worker/llms.ts`, `wrangler.jsonc`, `tools/lib/llms-docs.ts`, `tools/lib/previews.ts`.
- Needs `npm run data:llms` and `npm run data:previews`, then `npm run data:push`, before the text page and the preview card are live.
