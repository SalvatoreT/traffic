const ALPHABET = '0123456789bcdefghjkmnpqrstuvwxyz';
const INDEX = new Map([...ALPHABET].map((c, i) => [c, i]));

/** Standard geohash of a point; 10 characters is a cell of about 1 m. */
export function encodeGeohash(lat: number, lon: number, length = 10): string {
  let latLo = -90, latHi = 90, lonLo = -180, lonHi = 180;
  let out = '', bits = 0, ch = 0, even = true;
  while (out.length < length) {
    const [lo, hi, v] = even ? [lonLo, lonHi, lon] : [latLo, latHi, lat];
    const mid = (lo + hi) / 2;
    ch <<= 1;
    if (v >= mid) { ch |= 1; if (even) lonLo = mid; else latLo = mid; } else if (even) lonHi = mid; else latHi = mid;
    even = !even;
    if (++bits === 5) { out += ALPHABET[ch]; bits = 0; ch = 0; }
  }
  return out;
}

export const isGeohash = (s: string) => s.length >= 1 && s.length <= 12 && [...s].every((c) => INDEX.has(c));

/** Center and half-size (degrees) of a geohash cell, or null if the string is not a geohash. */
export function decodeGeohash(hash: string): { lat: number; lon: number; latErr: number; lonErr: number } | null {
  if (!isGeohash(hash)) return null;
  let latLo = -90, latHi = 90, lonLo = -180, lonHi = 180, even = true;
  for (const c of hash) {
    const v = INDEX.get(c)!;
    for (let b = 4; b >= 0; b--) {
      const bit = (v >> b) & 1;
      if (even) { const m = (lonLo + lonHi) / 2; if (bit) lonLo = m; else lonHi = m; }
      else { const m = (latLo + latHi) / 2; if (bit) latLo = m; else latHi = m; }
      even = !even;
    }
  }
  return { lat: (latLo + latHi) / 2, lon: (lonLo + lonHi) / 2, latErr: (latHi - latLo) / 2, lonErr: (lonHi - lonLo) / 2 };
}
