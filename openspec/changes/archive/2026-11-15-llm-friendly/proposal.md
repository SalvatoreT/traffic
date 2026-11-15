## Why

The project lead asked: "if you could make the site LLM friendly (without messing with the human experience) so other LLMs could test things out, work out different scenarios, and try the model out locally on their own, that'd be great."

The site is a single-page app, so a fetched page is an empty shell, and the model can only be exercised by clicking.

## What changes

- A generator (`npm run data:llms`) writes `llms.txt`, `llms-full.txt` and text versions of each tab into `public/data/llms/` from the data files and the docs. The Worker serves them from the bucket.
- `index.html` gains a description, an alternate link and a `noscript` note; `robots.txt` points to `llms.txt`; the footer gains a "For AI agents" link.
- `npm run simulate` runs one scenario headless on the app's WASM build and prints JSON; `--find` turns street names into link items. `npm run data:download` fetches the public data files.
- Guides: `docs/scenario-links.md`, `docs/data-files.md`, `docs/run-locally.md`.
- No server-side run endpoint and no new write path.
