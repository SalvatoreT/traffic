## Decisions

- Requested by the project lead (2026-11-22): show the overall cut-through reduction like the largest-rise line, in blue, before it; abbreviate or drop street-type words.
- Abbreviate, not drop. "Claremont Ave" and "Claremont Blvd" are different streets in the study area, so dropping the word would make names ambiguous.
- The shortening is a display function (`shortStreets`) applied to a copy of the proposal inside the card. The map component still gets the original, because it matches block names in the file against the network's names.
- A word is shortened only after a capitalized name or an ordinal, so "Slow Streets" and "side street" stay as written. The list of words is general US usage, nothing specific to one study area.
- The line leads with the percent because the header already gives the before and after in cars an hour. An increase reads "Cut-through increase".
