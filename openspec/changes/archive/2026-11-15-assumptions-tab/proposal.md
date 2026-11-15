## Why

The Sources page mixed measured inputs with the model's judgment calls. The project lead's review found two sections hard to use: "Assumed movement flows" was a dense provenance paragraph, and "Why cars cut through" described each reason in words only. The lead asked for a separate tab, ahead of Sources, for the discretionary parts, with simple maps for the reasons.

## What Changes

- A top-level Assumptions tab before Sources. It opens with a short statement that these are judgment calls, that they are the first things to question, and that changing them changes the results, and it links to Sources for the measured inputs.
- "Assumed movement flows" moves there as a short explanation and a table, one row per turn: counted cars an hour (PM, AM, midday scaled), cars the model assigns, how many are through cars, and who the cars are assumed to be, with shares. The numbers come from the demand config and the fit report, written by `npm run data:assumptions` to `public/data/<area>.assumptions.json`, which is not part of the hashed demand file.
- "Why cars cut through" moves there as one card per reason: label, basis badge in text, note, the arterial it bypasses, baseline through cars an hour per period, and a static map of the reason's typical path in the PM peak baseline.
- `npm run data:results` also writes `public/data/results/<area>/baseline-intents.json` (today's traffic by reason, with the same validity keys as stored results). `--baselines-only` writes just that file.
- Sources keeps a one-line pointer to the tab and no longer lists the assumed-movement provenance entry. The Results panel's "Why cars cut through" links to the tab ("About these reasons").
- Wording: the word "owner" is gone from user-facing text and from the demand builder's provenance, the config notes and the data docs. The builder's provenance entry for assumed movements is now one short note.
- Phones: five tabs fit on one row without a horizontal page scroll. The Worker no longer turns a 304 revalidation of a stored result into a 404.

## Impact

- Specs: simulator-ui (Assumptions tab; Sources visible; Why cars cut through), proposals (baseline-intents file validity).
- Code: `src/components/Assumptions.tsx`, `IntentMap.tsx`, `assumptions.css`, `Sources.tsx`, `IntentPanel.tsx`, `App.tsx`, `src/lib/assumptions.ts`, `baseline-intents.ts`, `intentmap.ts`, `intents.ts`, `picture.ts`, `tools/build-assumptions.ts`, `tools/lib/assumptions-data.ts`, `tools/precompute-results.ts`, `tools/build-demand.ts`, `worker/index.ts`.
- The served demand file is not rebuilt, so its hash and every stored result stay as they are. Its old provenance paragraph is hidden by the UI until the next rebuild.
