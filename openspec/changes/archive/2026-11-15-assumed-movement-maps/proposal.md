## Why

The Assumptions tab lists the assumed movements as a table of turns in words. A reader has to picture where Colby St meets Alcatraz Ave and which way "left onto Alcatraz Ave westbound" goes. The reason cards below already have maps, and the project lead asked for the same here.

## What changes

- Each assumed movement becomes a card with a small static map of the turn, the counted, assigned and through figures, and a "who the cars are assumed to be" list that is collapsed on phones.
- Cards sit under a subheading per pair of streets the turns connect, in a two-column grid on wide screens and one column on phones.
- An overview map at the top of the section shows every assumed turn as a numbered marker; the numbers match the cards.
- `<area>.assumptions.json` carries each movement's approach link, exit link and junction node. Files without them still render, as cards without maps.

## Impact

- `tools/build-assumptions.ts`, `tools/lib/assumptions-data.ts`, `src/lib/assumptions.ts`, `src/lib/turnmap.ts`, `src/components/TurnMap.tsx`, `src/components/Assumptions.tsx`, `src/components/assumptions.css`.
- No change to the demand file, the network file or the simulator.
