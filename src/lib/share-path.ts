import type { Intervention, Network } from '../types';
import { decodeMeta, decodeScenario } from './hash';
import { linkHash, staleInputs, type LoadedHashes, type Proposal, type ProposalGroup, type Proposals } from './proposals';
import { canonicalItems } from './stored-results';

/** A published proposal's shareable path. Preview crawlers never see a URL fragment, so the path is what tells a chat which proposal a link is about. */
export const SHARE_PREFIX = '/p/';

/** The slug a path names, lower-cased, or null for any other path. `/p/<slug>` and `/p/<slug>/` are the same address. */
export function slugFromPath(pathname: string): string | null {
  const m = /^\/p\/([A-Za-z0-9-]{1,80})\/?$/.exec(pathname);
  return m ? m[1].toLowerCase() : null;
}
export const pathOfSlug = (slug: string): string => `${SHARE_PREFIX}${slug}`;

/** The link as one comparable string: period, demand scale and the items in sorted order, so item order and token order do not matter. */
export function linkKey(link: string): string {
  const tokens = linkHash(link).slice(1).split(';');
  const get = (k: string) => tokens.find((t) => t.startsWith(`${k}=`))?.slice(k.length + 1) ?? '';
  return `${get('p')}|${get('d')}|${get('s').split('~').filter(Boolean).sort().join('~')}`;
}

/** cyrb53: a 53-bit string hash that needs no crypto API, so the page and the Node tools compute the same value. */
function hash53(str: string): number {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

const HASH_CHARS = 8;
const safe = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'p';

/**
 * Stable name of a package in a group: the group id and eight base-36 characters of a hash of the group and the canonical link.
 * It does not use the proposal's id (p1, p2, ...), which changes when a search ranks the packages differently, so the same package keeps its address.
 */
export function slugOf(groupId: string, link: string): string {
  const h = (hash53(`${groupId}|${linkKey(link)}`) % 36 ** HASH_CHARS).toString(36).padStart(HASH_CHARS, '0');
  return `${safe(groupId)}-${h}`;
}

export interface Published { slug: string; group: ProposalGroup; proposal: Proposal }

/** Every proposal of every group that shows options, once each, in file order. A package listed twice in a group keeps its first entry. Throws if two different packages get one slug. */
export function publishedList(file: Proposals): Published[] {
  const seen = new Map<string, { key: string }>();
  const out: Published[] = [];
  for (const g of file.groups) {
    if (g.legacy) continue;
    for (const p of g.proposals) {
      const slug = slugOf(g.id, p.link);
      const key = `${g.id}|${linkKey(p.link)}`;
      const prior = seen.get(slug);
      if (prior) {
        if (prior.key !== key) throw new Error(`Share paths collide: ${slug}`);
        continue;
      }
      seen.set(slug, { key });
      out.push({ slug, group: g, proposal: p });
    }
  }
  return out;
}

export const findBySlug = (file: Proposals, slug: string): Published | null => {
  try { return publishedList(file).find((x) => x.slug === slug) ?? null; } catch { return null; }
};

/**
 * The published proposal that the map's current scenario is, or null: same interventions as the network sees them, same period and the default demand.
 * Groups whose inputs have changed since they were computed are left out, since their figures are shown as out of date.
 */
export function findPublished(
  net: Network, file: Proposals, loaded: LoadedHashes, interventions: Intervention[], period: string, scale: number, fallbackPeriod: string,
): Published | null {
  if (interventions.length === 0 || scale !== 1) return null;
  const want = canonicalItems(net, interventions);
  let list: Published[];
  try { list = publishedList(file); } catch { return null; }
  for (const x of list) {
    if (staleInputs(x.group.computed, loaded).length > 0) continue;
    const meta = decodeMeta(linkHash(x.proposal.link));
    if ((meta.period ?? fallbackPeriod) !== period || (meta.demandScale ?? 1) !== 1) continue;
    try {
      if (canonicalItems(net, decodeScenario(net, linkHash(x.proposal.link)).interventions) === want) return x;
    } catch { /* not decodable: not a match */ }
  }
  return null;
}
