import { describe, expect, it } from 'vitest';
import { shortStreets, shortStreetsDeep } from './streets';

describe('street name shortening', () => {
  it('shortens the street type after a name or an ordinal', () => {
    expect(shortStreets('Modal filter at 63rd Street & Hillegass Avenue')).toBe('Modal filter at 63rd St & Hillegass Ave');
    expect(shortStreets('60th Street between Claremont Avenue / Hillegass Avenue and Colby Street')).toBe('60th St between Claremont Ave / Hillegass Ave and Colby St');
    expect(shortStreets('Martin Luther King Jr. Way, Claremont Boulevard')).toBe('Martin Luther King Jr. Way, Claremont Blvd');
  });
  it('leaves ordinary words alone', () => {
    expect(shortStreets('Slow Streets on Colby')).toBe('Slow Streets on Colby');
    expect(shortStreets('Street access check failed')).toBe('Street access check failed');
    expect(shortStreets('one side street')).toBe('one side street');
  });
  it('copies an object and skips the named keys', () => {
    const p = { title: 'Colby Street', link: 'Colby Street', n: 3, list: [{ label: 'North Street' }] };
    expect(shortStreetsDeep(p, new Set(['link']))).toEqual({ title: 'Colby St', link: 'Colby Street', n: 3, list: [{ label: 'North St' }] });
    expect(p.title).toBe('Colby Street');
  });
});
