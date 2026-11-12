/** Index to focus next in a one-tab-stop list when `key` is pressed on row `index` of `count`, or null when the key is not a navigation key. */
export function rovingTarget(key: string, index: number, count: number, page = 10): number | null {
  if (count <= 0) return null;
  const last = count - 1;
  switch (key) {
    case 'ArrowDown': return Math.min(last, index + 1);
    case 'ArrowUp': return Math.max(0, index - 1);
    case 'PageDown': return Math.min(last, index + page);
    case 'PageUp': return Math.max(0, index - page);
    case 'Home': return 0;
    case 'End': return last;
    default: return null;
  }
}

/** The row that holds the tab stop: the remembered one if it is still listed, else the first. */
export function tabStop<K>(keys: readonly K[], remembered: K | null): K | null {
  if (keys.length === 0) return null;
  return remembered !== null && keys.includes(remembered) ? remembered : keys[0];
}
