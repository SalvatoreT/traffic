## Why

On a wide screen a proposal card left most of its width empty: two full-width figure lines, a map on the left, and the disclosures stacked under it. The cut-through line led with a percent while the line beside it is in cars an hour. The Where traffic goes button opened a dialog that ran a live trace, which is more than a card needs.

## What Changes

- The cut-through line leads with cars an hour (−387), with the percent beside it in small text, so it reads in the same unit as the largest rise.
- From 44rem the two figure lines sit side by side, and the buttons and every disclosure sit in the column beside the map.
- The Where traffic goes button and its dialog are gone from proposal cards. Hovering or tapping a change on the card map still shows where its traffic is redirected, and a closed disclosure, Where filtered traffic goes, lists the same stored figures for every closure.
- The Map tab keeps Where traffic goes for a scenario someone builds, since no stored data exists for those.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `simulator-ui`: proposal card content, arrangement and controls.

## Impact

`src/components/Proposals.tsx`, `src/components/ProposalMap.tsx`, `src/lib/proposals.ts`, `src/App.tsx`, `src/styles.css`. No data or simulator change.
