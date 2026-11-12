# project-foundation Specification

## Purpose
How the project is built and deployed, and the conventions contributors and agents follow for research citations and workflow.

## Requirements

### Requirement: Deployable as a Cloudflare Worker
The project SHALL build to a single Cloudflare Worker that serves the web app as static assets and reserves `/api/*` for Worker code.

#### Scenario: Production build
- **WHEN** `npm run build` is run on a clean checkout with Rust, wasm-pack and Node installed
- **THEN** the WASM module, the client bundle and the Worker bundle are produced with no type errors

### Requirement: Cited modeling
Every model equation, parameter value and effect size used in code or specs SHALL reference a citation key defined in `docs/references.md`, and each bibliography entry SHALL record how its existence was verified.

#### Scenario: Adding a model parameter
- **WHEN** a contributor adds a parameter taken from the literature
- **THEN** the code at the point of use names a key that exists in `docs/references.md`

### Requirement: Agent workflow conventions
The repository SHALL document, in `AGENTS.md`, the model-delegation policy (Haiku/Sonnet for routine work, lead model for design and review) and the automatic OpenSpec propose → apply → archive cycle.

#### Scenario: New agent session
- **WHEN** an agent session starts in the repository
- **THEN** it loads `AGENTS.md` and follows the delegation and OpenSpec rules without asking the user
