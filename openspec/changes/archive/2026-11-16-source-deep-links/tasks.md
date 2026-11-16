## 1. Format and rendering

- [x] 1.1 Define the `Links:` line in `docs/references.md` and parse it in `src/lib/ref-links.ts` with tests.
- [x] 1.2 Render the title link and parenthetical links in the Sources tab; write the links as markdown in `sources.md`.
- [x] 1.3 Link provenance entries by source name and point the demand build at the specific files.

## 2. Links

- [x] 2.1 Inventory every cited source and what the project uses from it.
- [x] 2.2 Find the most specific link for each and verify it by fetching it (text fragment, anchor, PDF page, DOI through Crossref).
- [x] 2.3 Record the links, the check date and the sources with no verifiable deeper link in `docs/references.md`.

## 3. Check

- [x] 3.1 `npx vitest run` and `npx tsc --noEmit` pass.
- [x] 3.2 Look at the Sources tab at desktop and phone widths, light and dark.
