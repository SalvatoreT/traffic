## Decision

Follows "the map shows all cars" in `2026-11-18-proposals-map-detail-box`: the image and the previews must match the card map, so one helper decides what the map draws.

## Choices

- `cardPicture(p, pic, index)` in `src/lib/picture.ts` returns the kind (`all` or `through`), the picture to draw and the facts for its labels. The card map, Download image and the preview builder all call it, so the scale (dead band 40, top 800 for all cars), the label rule and the rounding (`wholeChange`) are one code path.
- `pictureCaption` and `legendSentence` take the kind. The all-car legend sentence says colors and numbers count all cars on the block and that the headline counts through cars over the whole area. Older files keep the through-car wording.
- Share image: the headline label for the period reads "Through cars on all the area's side streets, <period>" and drops "the period this picture shows" when the map shows all cars. Key lines name the biggest gain (solid) and the biggest drop (dashed) in all cars.
- Preview card: the legend chip reads "All cars: fewer" and "All cars: more". Labeled outlines are drawn through a new `labels: 'pins'` map option that keeps street names off, since the card is small. The image alt text names the two labeled blocks and their numbers. The headline figure, its label ("through cars, PM peak") and the description stay through cars.
- A file without `pictureAll` keeps the through-car map, chip, caption and alt text, and draws no number labels in a preview, as before.
