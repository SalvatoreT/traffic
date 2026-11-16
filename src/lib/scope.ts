import type { NetLink } from '../types';

/**
 * The measured streets are the residential and service streets inside the study area. Bounding streets and everything outside it are
 * drawn as plain context and carry no metric.
 */
export const linkMeasured = (l: Pick<NetLink, 'inStudyArea' | 'class'>): boolean =>
  l.inStudyArea && (l.class === 'residential' || l.class === 'service');
export const blockMeasured = (b: { inStudyArea: boolean; cls: string }): boolean =>
  b.inStudyArea && (b.cls === 'residential' || b.cls === 'service');

export const STUDY_ONLY = 'study-area side streets';
