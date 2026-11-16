import type { NetLink } from '../types';

/**
 * Where metrics are shown. `study`: every street the data flags `inStudyArea`, bounding streets included where the study-area outline holds them.
 * `interior`: only the residential and service streets in the study area; bounding streets are context. Preview switch: `?shade=interior`.
 */
export type Scope = 'study' | 'interior';

export const scopeFromSearch = (search: string): Scope => (new URLSearchParams(search).get('shade') === 'interior' ? 'interior' : 'study');
export const SCOPE: Scope = scopeFromSearch(typeof location === 'undefined' ? '' : location.search);

export const linkMeasured = (l: Pick<NetLink, 'inStudyArea' | 'class'>, scope: Scope = SCOPE): boolean =>
  l.inStudyArea && (scope === 'study' || l.class === 'residential' || l.class === 'service');
export const blockMeasured = (b: { inStudyArea: boolean; cls: string }, scope: Scope = SCOPE): boolean =>
  b.inStudyArea && (scope === 'study' || b.cls === 'residential' || b.cls === 'service');

export const STUDY_ONLY = 'study area only';
/** Phrase for text alternatives and notes. */
export const SCOPE_PHRASE = 'inside the study area only';
export const SCOPE_NOTE = 'Streets outside the study area are drawn as plain gray context and are not measured.';
