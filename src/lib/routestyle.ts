import type { Mode } from './ramps';

/** Cell bands: Okabe-Ito hues, each cell also gets one of these dash patterns so the cue is not color alone. */
export const CELL_COLORS: Record<Mode, string[]> = {
  light: ['#0072b2', '#d55e00', '#009e73', '#cc79a7', '#8a6d00'],
  dark: ['#56b4e9', '#ff9f5a', '#3ddbb0', '#e8a0c8', '#f0e442'],
};
/** Dash arrays in line-width units; [1, 0] is solid. */
export const CELL_DASHES: number[][] = [[1, 0], [3, 1.5], [1, 1.5], [5, 1.2, 1, 1.2]];
export const ROUTE_COLORS: Record<Mode, { line: string; casing: string; hi: string }> = {
  light: { line: '#c2255c', casing: '#ffffff', hi: '#c2255c' },
  dark: { line: '#ff8fb8', casing: '#0b1118', hi: '#ff8fb8' },
};
