## Why

The Proposals card map now colors and numbers each block by the change in all cars, but the Download image picture and the link-preview cards still drew through cars. A person who saw +246 on the card and then shared the image saw +70 on the same street.

## What Changes

- The Download image picture and the link-preview cards take their map from the same helper as the card map: all cars from `pictureAll` when the file has it, through cars otherwise.
- Colors use the all-car scale, the largest gain and drop carry numbers rounded as in the card, and captions, legend text, key lines and text alternatives say "all cars".
- The headline stays the through-car figure over the whole area. Its label no longer says it is what "this picture shows".
- Preview cards now draw the two labeled outlines (without street names), so the number a link shows matches the card.

## Impact

- Specs: `proposals`.
- Code: `src/lib/picture.ts`, `src/lib/shareimage.ts`, `src/components/DownloadImage.tsx`, `src/components/ProposalMap.tsx`, `tools/lib/previews.ts`, `tools/lib/og-card.ts`.
