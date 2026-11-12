## Context

Requested by the user on 2026-11-12. The user also confirmed that the staggered
Hillegass Avenue / 62nd Street junction is one intersection, so the importer keeps
merging offset legs that fall within the join radius.

## Decisions

### D1 A diverter is an orientation, not a list of banned turns
The intervention stores the node and the compass bearing of the barrier line, rounded to
5 degrees. The simulation works out the permitted movements: a leg may only turn onto a
leg on the same side of the barrier. Storing banned turns instead was rejected because
link ids change when the network is rebuilt and a list of eight bans is not something a
person can read back.

### D2 Four legs only
With four legs the barrier leaves two pairs and the meaning is clear. With three or five
the result depends on geometry in ways people would not predict, so the menu does not
offer it there.

### D3 Two choices, named by what stays connected
For a four-leg intersection the two diagonals give two options. Each is labeled by the
streets that remain connected, with compass directions, for example "Hillegass Avenue
(north) with 62nd Street (west), and Hillegass Avenue (south) with 62nd Street (east)".

### D4 Who can pass
Cars and buses follow the two permitted turns. Cyclists and pedestrians pass through in
any direction, as with modal filters. A bus route that needs a movement the diverter
removes is dropped and counted, the same way turn bans already work.

## Contract addition

```ts
type Intervention =
  | ...
  | { type: 'diagonal_diverter'; node: number; bearing: number }  // barrier line, degrees clockwise from north, 0 to 175
```
Link encoding: item code `dd`, the node's geohash, then the bearing.
