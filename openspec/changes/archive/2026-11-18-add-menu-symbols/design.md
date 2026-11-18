## Decisions (user, 2026-11-18)

- Show each intervention's picture next to its option in the menu that opens when a person clicks the map to add an intervention, using the same pictures as the map: the bar and striped line for a modal filter and a diverter, the speed-limit sign for a speed limit and a Slow Street, the variant's picture for each control choice. The pictures are decorative, the option text stays the accessible name, and keyboard operation and focus stay as they are.
- A published change number must never be hidden by a picture, so the one-way sign in a proposal's picture is smaller and the label moves.
- A turn ban's picture follows its side.

## Design

- The menu is already a set of buttons (no native select), so it needs no new pattern. Each button gets a 30 px picture column (`.sel-ico`), `aria-hidden`, followed by the text. Choices without a picture, and the first step of a turn ban, leave the column out.
- `menuSymbol(iv, net)` in `src/lib/menusymbols.ts` maps the intervention a choice would add to its picture: it calls the same `pictoOf` the map uses, so the menu cannot disagree with the map. A one-way choice points the way it opens.
- Turn side: `turnkind.ts` holds the turn classification that `turnmap.ts` already used (heading change under 25 degrees is straight, over 155 a U-turn, otherwise left or right by sign). `symbolOf` reads it for a turn ban. Left and right are mirror images; a U-turn or straight-on ban uses a U-turn arrow. ASSUMPTION: a straight-on ban is rare and a U-turn arrow stands for both.
- Numbers and signs: `buildPicture` tries the usual spot for a number label, then the other side and farther above and below, and takes the first whose box touches no picture, speed-limit sign or other label. The one-way sign is drawn 16 px tall in a picture (24 for the rest), near the arrow it replaced. `pinCoversMark` is the check the test uses. The label box is estimated from the digit count (0.62 of the font size per character), an ASSUMPTION about the font.
