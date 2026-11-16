## Why

The Sources tab gives a reader a general site and leaves the search for the cited table or passage to them. A visitor who wants to check a saturation flow or a validation threshold should land on that passage.

## What Changes

- Each bibliography entry in `docs/references.md` can carry a `Links:` line of `label → URL` pairs, each pointing as specifically as possible at what the project uses: a text fragment on an HTML page, a section anchor, a PDF page, a DOI or a dataset record.
- The Sources tab links the title of an entry to its primary link and lists further uses in parentheses after the citation line. The generated text pages write the same links as markdown.
- The data provenance list links each source name instead of printing its URL, and the build for the demand file points its entries at the specific file or page.
- Every URL was fetched and its target content checked on 2026-11-16. Sources with no verifiable deeper link stay as they were and are listed in the bibliography's notes.

## Impact

- Specs: `simulator-ui` (Sources visible).
- Code: `src/lib/ref-links.ts`, `src/components/Markdown.tsx`, `src/components/Sources.tsx`, `tools/lib/llms-docs.ts`, `tools/build-demand.ts`.
- Docs: `docs/references.md`.
