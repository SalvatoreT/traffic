## Context

On 2026-11-17 the user asked to fix the desktop hover jump and land it on `main`. At `f6c573d`, `.pm-read` has only a minimum height and sits above `.pm-lists`. Hovering a street changed its measured height from 144 to about 204 pixels. The `.pm-on` rule also changes street-name font weight.

## Decisions

### D1. Reserve the desktop details panel's space

At the existing desktop breakpoint of 720 pixels, give the panel a stable height in text-relative units, allow internal scrolling, and reserve scrollbar space. Content length and scrollbar appearance must not move the adjacent lists. Keep the panel focusable, named, and visibly focused so keyboard users can read overflowing content. Preserve its live updates and existing selection controls.

Increasing the minimum height alone would still allow longer descriptions to move the list. An overlay could obscure the map or list. The bounded panel keeps those controls available with a small change to the existing layout.

### D2. Keep selection styling independent of text width

Use the existing background treatment and a stronger underline without changing font weight. Bold text can change line wrapping even when the details panel stays fixed. Below the desktop breakpoint, retain the natural-height details panel and stacked street figures.

## Validation

Check list and row geometry before hover, during selection, and after leaving, including long street names and intervention details. Verify stationary-pointer behavior, keyboard selection and Escape, and scrolling overflowing details. Repeat the mobile layout checks and run TypeScript and relevant proposal tests. Browser measurements establish layout behavior; this change does not alter traffic results.

## Implementation and verification

The desktop panel reserves 18rem, scrolls overflowing content, and resets its scroll position when the selected item changes. Selection uses a thicker underline without changing font weight.

Chromium checks passed at 720, 1024, and 1440 pixels: twelve street hovers produced no list, row, or page-scroll movement. Expanded intervention details remained contained, PageDown scrolled the panel, and changing selection returned it to the top. Escape and 200% text sizing passed. At 320 and 390 pixels, mobile rows stayed readable without horizontal overflow and the panel retained its natural height. Restoring the previous CSS reproduced a 59.8-pixel list shift.

The complete layout check used published stored proposal data with the mock live engine because the local WASM build had an older identity; desktop hover also passed with that build. Typecheck and 63 proposal and stored-redistribution unit tests passed. The unit tests used a minimal Vitest configuration without the unrelated Cloudflare development server.

The change passed strict OpenSpec validation before archival. Strict validation of the full `proposals` specification still reports four existing warnings: its placeholder purpose and three long requirements. Comparing against the parent revision confirmed that this change adds no validation issues.
