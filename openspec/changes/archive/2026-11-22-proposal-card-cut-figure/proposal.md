## Why

The overall cut in through cars is the figure the project exists for, and on a card it sat only in the header line. Street names spelled out in full ("60th Street between Claremont Avenue / Hillegass Avenue and Colby Street") make the cards long, most of all on a phone.

## What Changes

- Each proposal card shows the overall change in through cars as its own line (percent, with before and after), styled like the largest-rise line but in the accent blue, and placed before it.
- The Proposals tab shortens street-type words after a street name (St, Ave, Blvd). Display only: data, links, text pages and the downloaded image are unchanged.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `simulator-ui`: the default content of a proposal card gains the cut-through line; street names on the Proposals tab are shortened.

## Impact

`src/components/Proposals.tsx`, `src/components/ProposalMap.tsx`, `src/lib/proposals.ts`, `src/lib/streets.ts`, `src/styles.css`. No data or simulator change.
