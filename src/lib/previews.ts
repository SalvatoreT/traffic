/**
 * What a link preview says for one path, written at publish time by `npm run data:previews` (tools/build-previews.ts) into `og/index.json`
 * beside the card images, and read by the Worker, which puts it in the page's head. Link-preview crawlers do not run scripts and never see
 * the URL fragment, so a preview can only differ by path, and its tags must be in the HTML the server sends.
 */
export interface PreviewPage {
  title: string;
  description: string;
  /** Path of the card image on the site, `/og/<name>-<hash>.jpg`. The Worker makes it absolute. */
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
}

export interface PreviewIndex {
  version: 1;
  /** Origin the absolute URLs are built on, from the site config. */
  site: string;
  siteName: string;
  /** Used for every path the index does not list. */
  fallback: PreviewPage;
  /** Keyed by path: `/`, a tab path or `/p/<slug>`. */
  pages: Record<string, PreviewPage>;
}

export const PREVIEW_INDEX_VERSION = 1;
export const PREVIEW_PREFIX = '/og/';
export const PREVIEW_INDEX_FILE = 'index.json';
/** Card files are `<name>-<8 hex>.jpg`: the hash is of the file's bytes, so a changed card is a new URL and a shared link never shows a stale one. */
export const PREVIEW_FILE = /^[a-z0-9][a-z0-9-]{0,80}-[0-9a-f]{8}\.jpg$/;

const isPage = (x: unknown): x is PreviewPage => {
  const p = x as PreviewPage | null;
  return !!p && typeof p.title === 'string' && typeof p.description === 'string' && typeof p.imageAlt === 'string'
    && typeof p.image === 'string' && p.image.startsWith(PREVIEW_PREFIX) && PREVIEW_FILE.test(p.image.slice(PREVIEW_PREFIX.length))
    && Number.isFinite(p.imageWidth) && Number.isFinite(p.imageHeight);
};

/** A well-formed index or null: anything else makes the Worker fall back to the page's own tags. */
export function parsePreviewIndex(text: string): PreviewIndex | null {
  try {
    const f = JSON.parse(text) as PreviewIndex;
    if (f?.version !== PREVIEW_INDEX_VERSION || typeof f.site !== 'string' || typeof f.siteName !== 'string' || !isPage(f.fallback) || typeof f.pages !== 'object' || f.pages === null) return null;
    const pages: Record<string, PreviewPage> = {};
    for (const [k, v] of Object.entries(f.pages)) if (k.startsWith('/') && isPage(v)) pages[k] = v;
    return { ...f, pages };
  } catch { return null; }
}
