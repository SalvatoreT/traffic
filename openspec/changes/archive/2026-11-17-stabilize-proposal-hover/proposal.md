## Why

Hovering a proposal's street name expands the details panel above the list. A desktop browser check reproduced a shift of about 60 pixels, which can move the target out from under the pointer. Selected names also become bold and can wrap differently. The mobile table fix did not address either cause.

## What Changes

- Keep the desktop details panel at a stable height and scroll longer content inside it.
- Preserve text dimensions when a street or intervention is selected.
- Make the scrollable panel keyboard accessible while retaining mobile layout and map selection.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `proposals`: stable list geometry during hover and keyboard selection.

## Impact

Changes affect `src/components/ProposalMap.tsx` and `src/styles.css`. No proposal data or simulator behavior changes.

## Out of scope

Proposal search, traffic modeling, data publication, and redesigning the mobile table are outside this fix.
