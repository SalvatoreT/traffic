## Context

The Sources tab renders `docs/references.md` as is, and the text page `sources.md` includes the same file. Entries cite a source in prose and sometimes name a URL in a code span. A reader has to search the site for the table. The request was to link each source at the highlight on its HTML page when that exists, and otherwise as specifically as possible.

## Decisions

- **One place for the links.** A `Links:` line inside each entry, in the bibliography that both outputs already read. Format: `Links: label → URL · label → URL · checked 2026-11-16`. The first pair is the primary link. Parts without an arrow, such as the check date, are ignored by the parser. Study areas stay data: nothing in the format is specific to one area.
- **Title link plus parentheses.** If the first label occurs verbatim in the entry's first line, that text becomes the link and the other pairs follow in parentheses, one per additional use (for example "3.3.10 to 3.3.12, flow validation, PDF p. 31"). Otherwise every pair is shown in the parentheses. Links open normally, with no forced new tab. Labels are the accessible names, and long URLs are never shown as text, so lines wrap on a phone.
- **Link types, in order.** A text fragment (`#:~:text=`, percent-encoded, `start,end` for long passages, combined with an element anchor where the page has one) on an HTML page. Then a section anchor or the section's own page. For PDFs, `#page=N` with the PDF page index. For articles, a DOI plus an open full text with a page when one exists legitimately (arXiv). For datasets, the dataset page, file or layer.
- **Verification.** Each URL was fetched. A text fragment counts only if its text is in the fetched HTML, a PDF page only if the expected text is on that page, an anchor only if the id exists. DOIs were checked against Crossref because `doi.org` answers 403 from the cloud session. Hosts that block the session, or entries with no online copy, keep no `Links:` line and are listed in the bibliography's notes. No fragment is guessed.
- **Private sources.** Entries described by role, the volunteer count and privately shared material have no link and no new detail. The bibliography has none of these entries, and the provenance list is changed only for public datasets.
- **Provenance list.** The source name is the link. The URL comes from the demand build, so the deeper addresses reach the app the next time the demand file is regenerated.
- **Text pages.** `linkRefs` rewrites `Links:` lines as markdown links for `sources.md`, so the plain-text page shows labels, not bare URLs.

## Risks

- A fragment can stop matching when a publisher edits a page. The check date on each line says when it last matched, and the browser falls back to the top of the page.
- Page numbers are PDF indexes and can differ from printed numbers. The bibliography says so.
