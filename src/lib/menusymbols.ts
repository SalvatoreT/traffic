import type { AreaBundle, Intervention } from '../types';
import { MPS_TO_MPH } from './format';
import { pointAtLinkMeters } from './junctionends';
import { pictoElement, pictoOf, rotationOfHeading, symbolOf, type PictoId } from './signs';
import { SLOW_STREET_MPH } from './slowstreet';
import { speedSignElement } from './speedsign';

/** The picture beside a choice in the add-intervention menu: a sign picture, or a speed-limit sign with its number. */
export type MenuSymbol = { picto: PictoId; rotate?: number } | { mph: number | string };

/** Height in CSS px of a menu picture. */
export const MENU_PICTO_PX = 22;

/** The picture of the mark an intervention would place, so each choice shows what it adds. A one-way choice points the way it opens. */
export function menuSymbol(iv: Intervention, net: AreaBundle['network']): MenuSymbol | null {
  if (iv.type === 'speed_limit') return { mph: Math.round(iv.speed * MPS_TO_MPH) };
  if (iv.type === 'slow_street') return { mph: SLOW_STREET_MPH };
  const picto = pictoOf(symbolOf(iv, net));
  if (!picto) return null;
  if (iv.type === 'one_way') {
    const l = net.links[iv.link];
    return l ? { picto, rotate: rotationOfHeading(pointAtLinkMeters(l, l.length / 2).heading) } : { picto };
  }
  return { picto };
}

export const menuSymbolHtml = (s: MenuSymbol): string => ('picto' in s ? pictoElement(s.picto, MENU_PICTO_PX, { rotate: s.rotate }) : speedSignElement(s.mph, MENU_PICTO_PX));
