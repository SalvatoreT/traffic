export type More = 'none' | 'start' | 'end' | 'both';

/** Which edges of a horizontal scroller hide more content. One pixel of slack absorbs fractional layout widths. */
export function moreSides(scrollLeft: number, clientWidth: number, scrollWidth: number): More {
  const start = scrollLeft > 1;
  const end = scrollLeft + clientWidth < scrollWidth - 1;
  return start && end ? 'both' : start ? 'start' : end ? 'end' : 'none';
}

/** The scroll position that centers an item in the scroller, kept inside the scrollable range. */
export function centeredScroll(itemLeft: number, itemWidth: number, clientWidth: number, scrollWidth: number): number {
  const target = itemLeft - (clientWidth - itemWidth) / 2;
  return Math.max(0, Math.min(Math.max(0, scrollWidth - clientWidth), Math.round(target)));
}
