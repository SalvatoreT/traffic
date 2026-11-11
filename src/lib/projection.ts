const R = 6371008.8;
const D2R = Math.PI / 180;

/** Local equirectangular projection about `origin` (x east, y north, meters). */
export function makeProjection(origin: { lon: number; lat: number }) {
  const ky = R * D2R;
  const kx = ky * Math.cos(origin.lat * D2R);
  return {
    toLonLat(x: number, y: number): [number, number] {
      return [origin.lon + x / kx, origin.lat + y / ky];
    },
    toLocal(lon: number, lat: number): [number, number] {
      return [(lon - origin.lon) * kx, (lat - origin.lat) * ky];
    },
  };
}
export type Projection = ReturnType<typeof makeProjection>;

/** Meters per CSS pixel at a MapLibre zoom (512px tiles) and latitude. */
export function metersPerPixel(zoom: number, lat: number): number {
  return (40075016.686 * Math.cos(lat * D2R)) / (512 * Math.pow(2, zoom));
}
