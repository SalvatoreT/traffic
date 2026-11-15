import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import jpeg from 'jpeg-js';
import opentype, { type Font } from 'opentype.js';
import type { Measure } from '../../src/lib/shareimage';

const dir = join(import.meta.dirname, '..', 'fonts');
export const FONT_FILES = [join(dir, 'Inter-Regular.subset.otf'), join(dir, 'Inter-Bold.subset.otf')];
export const FONT_FAMILY = 'Inter';

const open = (file: string): Font => {
  const b = readFileSync(file);
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer);
};

/** Text width in px from the bundled font's own advances, so a line laid out here is the width resvg draws. Weights from 600 up use Bold. */
export function fontMeasure(): Measure {
  const regular = open(FONT_FILES[0]), bold = open(FONT_FILES[1]);
  return (text, size, weight) => (weight >= 600 ? bold : regular).getAdvanceWidth(text, size, { kerning: true });
}

export interface Raster { width: number; height: number; jpeg: Buffer }

/**
 * SVG to a JPEG at its own pixel size, with the bundled fonts only (no system fonts, so the output does not depend on the machine).
 * JPEG, not PNG: a map card as PNG is about 10 times larger and chat apps skip images over a few hundred kilobytes.
 */
export function svgToJpeg(svg: string, quality = 82): Raster {
  const r = new Resvg(svg, {
    background: '#ffffff',
    font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: FONT_FAMILY },
    shapeRendering: 2, textRendering: 1, imageRendering: 0,
  });
  const img = r.render();
  const out = jpeg.encode({ data: img.pixels, width: img.width, height: img.height }, quality);
  return { width: img.width, height: img.height, jpeg: out.data };
}
