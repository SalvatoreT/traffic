## Why

Project-lead feedback on the live Assumptions tab pointed at three problems: the "counted, no trips assigned" badges float away from their numbers, the reason maps are missing, and the two long sections are hard to navigate. This change fixes the badges, says plainly when a map cannot be drawn, puts "Why cars cut through" first and makes both section headings sticky.

## What Changes

- The below-threshold tag becomes "no trips assigned", sits inside its figure's cell directly under the number, and wraps instead of overflowing. The note under the card names periods in words.
- A reason card without a map says why in one sentence, and the section note for a missing or stale stored baseline is shorter and plainer.
- "Why cars cut through" comes before "Assumed movement flows". Anchor ids are unchanged.
- Both section headings stick under the top bar while their section scrolls. Anchored cards and focused controls clear the heading.

## Impact

- Specs: simulator-ui (Assumptions tab, Reason cards).
- Code: `src/components/Assumptions.tsx`, `assumptions.css`, `src/lib/assumptions.ts`, `src/styles.css`.
