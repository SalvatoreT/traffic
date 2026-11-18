## Why

Two defects show on the Proposals tab.

- A route drawn for "where the through cars go" can cut straight across a block. In the published files 11 routes have link lists with gaps (5 of 24 in p1, 5 of 20 in p2, 1 of 20 in p4). The trace is complete; `localPart` kept only the links with an end inside 400 m of the closed junctions, so a route that left that radius and came back lost its middle links and its street names.
- Block names such as "61st Street between Colby Street and a dead end" appear for the Colby Park loop, which is not a dead end. `endText` said "a dead end" for any node where no other street meets the block, including nodes where the same street simply goes on.

## What Changes

- `localPart` keeps every link from the first to the last link within the radius, so a stored route is a connected path and its street list names every street driven.
- The map splits a drawn line wherever consecutive links are not adjacent, and the generator refuses to write a route that is disconnected or whose street list misses a street.
- The stored redirect method becomes `displacement-2`, so files made before the fix are regenerated.
- Block naming follows the same street past a node with no other street, up to the next cross streets, in `src/lib/naming.ts` and `crates/sim/src/explore/naming.rs`. "A dead end" stays for a real dead end.

## Impact

- No simulator change; the fingerprint is unchanged.
- Stored redirect files and the proposals file and report (their text embeds block names) need regenerating.
