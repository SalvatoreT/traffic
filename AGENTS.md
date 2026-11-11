# Traffic — agent guide

A web app that simulates neighbourhood traffic as it is today and lets people try
interventions and compare outcomes. First study area: the **Rockridge Trapezoid** in
North Oakland, CA — Telegraph Ave (W), College Ave (E), Claremont Ave (S), Alcatraz Ave (N).
The design must generalise to other areas (nothing Rockridge-specific in code; study
areas are data).

## Layout

| Path | What |
| --- | --- |
| `crates/sim` | Simulation core (Rust). Native lib + WASM build. No I/O, deterministic for a given seed. |
| `src/` | React + TypeScript UI (Vite). MapLibre GL rendering; sim runs in a Web Worker. |
| `worker/` | Cloudflare Worker entry (static assets + `/api/*`). |
| `tools/` | Node/TS data pipeline: OSM import, demand generation. |
| `data/` | Raw source extracts (OSM, counts) with provenance. |
| `public/data/` | Generated study-area files served to the app. |
| `docs/references.md` | Bibliography. Source of truth for citation keys. |
| `openspec/` | Specs (current truth) and changes (decision history). |

## Commands

- `npm run dev` — local dev server (Vite + workerd)
- `npm run build` — WASM build, typecheck, production bundle
- `npm test` — Rust unit tests + TS tests
- `npm run data` — regenerate `public/data/*` from `data/*`
- `npm run deploy` — `wrangler deploy`

## Model delegation

Use the cheapest model that can do the job well. The lead session orchestrates,
decides architecture and reviews; it should not do bulk work itself.

- **Haiku** (`model: "haiku"`): file search, mechanical edits, renames, formatting,
  running commands and summarising output, boilerplate, simple docs.
- **Sonnet** (`model: "sonnet"`): feature implementation against a written spec,
  tests, data wrangling, web/literature research, code review of a diff.
- **Lead (most capable model)**: cross-cutting design, model-science judgement calls,
  interface contracts, debugging that subagents failed at, final review.

Give subagents the spec/contract paths to read rather than restating them, and
run independent work in parallel.

## OpenSpec — run the full cycle automatically

Every non-trivial change goes through OpenSpec **without asking the user**:

1. **Propose**: `npx openspec new change <kebab-name>`, write `proposal.md`,
   `specs/<capability>/spec.md` deltas, `design.md` (decisions + rationale + citation
   keys), `tasks.md`. Validate with `npx openspec validate <name> --strict --no-interactive`.
2. **Apply**: implement, ticking tasks in `tasks.md`.
3. **Archive**: `npx openspec archive <name> --yes` once tests pass; commit the archive
   and updated `openspec/specs/` with the code.

Decisions the user makes in conversation are recorded in the relevant `design.md`.
Trivial fixes (typos, dependency bumps) skip the cycle.

## Research and citations

- Model behaviour must trace to published research. Any equation, parameter value or
  effect size in code or specs cites a key from `docs/references.md`
  (e.g. `[Treiber2000]`) in a comment at the point of use or in the spec.
- Never cite from memory: add an entry to `docs/references.md` only after verifying it
  exists (DOI/URL resolves) and tag its verification status.
- Uncalibrated assumptions are labelled as assumptions in code, specs and UI.

## Git

Commit straight to `main` and push; no pull requests unless the user asks (user decision, 2026-11-11).
Commit messages follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
(`feat(sim): …`, `fix(ui): …`, `docs: …`, `chore: …`; `!` / `BREAKING CHANGE:` for breaking
changes) so release notes can be generated. Scopes: `sim`, `ui`, `worker`, `data`, `spec`.

## Writing

All prose a person will read (README and other docs, UI copy, OpenSpec proposals and
designs, commit bodies) goes through the `humanizer` skill
(https://github.com/blader/humanizer) before it is committed. `npm install` fetches it
into `.claude/skills/humanizer/` (not vendored). Subagents that write prose are told to
load `.claude/skills/humanizer/SKILL.md` and apply it. It must not change facts, numbers,
citation keys, or the required structure of OpenSpec spec files.

## Conventions

- Never put people's names in the repository (code, docs, data, commit messages).
  Published authors in `docs/references.md` citations are the only exception. Describe
  private sources by role ("resident-provided count data"), not by person.
- Minimal comments; citations are the exception.
- SI units internally (m, s, m/s); convert at the UI boundary.
- UI meets WCAG 2.2 AA: keyboard operable, visible focus, reduced-motion respected,
  colour never the only signal, text alternatives for what the map shows.
- Map data © OpenStreetMap contributors (ODbL) — keep attribution visible.
