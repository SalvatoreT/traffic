import { eachCsvRow } from './csv';

export interface GtfsStop {
  id: string;
  name: string;
  lon: number;
  lat: number;
}
export interface GtfsTrip {
  id: string;
  route: string;
  service: string;
  dir: number;
  shape: string;
}
export interface Gtfs {
  feed: Record<string, string>;
  routes: Map<string, { id: string; name: string; longName: string }>;
  stops: Map<string, GtfsStop>;
  trips: Map<string, GtfsTrip>;
  /** [lon, lat] vertices in sequence order. */
  shapes: Map<string, [number, number][]>;
  /** Departure (or arrival) seconds after midnight of the service day, in stop sequence order. */
  stopTimes: Map<string, { stop: string; t: number }[]>;
  calendar: { service: string; days: boolean[]; start: string; end: string }[];
  calendarDates: { service: string; date: string; type: number }[];
}

export const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export function parseTime(s: string): number | null {
  const m = /^\s*(\d+):(\d{2}):(\d{2})\s*$/.exec(s);
  return m ? +m[1] * 3600 + +m[2] * 60 + +m[3] : null;
}

/** Parses the GTFS tables other than stop_times, which can be large and is filtered by trip (see `addStopTimes`). */
export function parseGtfs(read: (file: string) => string | undefined): Gtfs {
  const g: Gtfs = { feed: {}, routes: new Map(), stops: new Map(), trips: new Map(), shapes: new Map(), stopTimes: new Map(), calendar: [], calendarDates: [] };
  const each = (file: string, f: (r: Record<string, string>) => void) => {
    const t = read(file);
    if (t) eachCsvRow(t, f);
  };
  each('feed_info.txt', (r) => Object.assign(g.feed, r));
  each('routes.txt', (r) => g.routes.set(r.route_id, { id: r.route_id, name: r.route_short_name || r.route_long_name || r.route_id, longName: r.route_long_name ?? '' }));
  each('stops.txt', (r) => g.stops.set(r.stop_id, { id: r.stop_id, name: r.stop_name, lon: +r.stop_lon, lat: +r.stop_lat }));
  each('trips.txt', (r) => g.trips.set(r.trip_id, { id: r.trip_id, route: r.route_id, service: r.service_id, dir: +(r.direction_id || 0), shape: r.shape_id ?? '' }));
  const raw = new Map<string, { seq: number; p: [number, number] }[]>();
  each('shapes.txt', (r) => {
    const a = raw.get(r.shape_id) ?? raw.set(r.shape_id, []).get(r.shape_id)!;
    a.push({ seq: +r.shape_pt_sequence, p: [+r.shape_pt_lon, +r.shape_pt_lat] });
  });
  for (const [id, a] of raw) g.shapes.set(id, a.sort((x, y) => x.seq - y.seq).map((v) => v.p));
  each('calendar.txt', (r) => g.calendar.push({ service: r.service_id, days: DAY_NAMES.map((d) => r[d] === '1'), start: r.start_date, end: r.end_date }));
  each('calendar_dates.txt', (r) => g.calendarDates.push({ service: r.service_id, date: r.date, type: +r.exception_type }));
  return g;
}

export function addStopTimes(g: Gtfs, text: string, tripIds: Set<string>): void {
  const rows = new Map<string, { seq: number; stop: string; t: number }[]>();
  eachCsvRow(text, (r) => {
    if (!tripIds.has(r.trip_id)) return;
    const t = parseTime(r.departure_time) ?? parseTime(r.arrival_time);
    if (t === null) return;
    (rows.get(r.trip_id) ?? rows.set(r.trip_id, []).get(r.trip_id)!).push({ seq: +r.stop_sequence, stop: r.stop_id, t });
  });
  for (const [id, a] of rows) g.stopTimes.set(id, a.sort((x, y) => x.seq - y.seq).map(({ stop, t }) => ({ stop, t })));
}

const ymd = (d: Date) => `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;

/** Service ids running on a date (YYYYMMDD): calendar rows plus calendar_dates additions, minus removals. */
export function activeServices(g: Gtfs, date: string): Set<string> {
  const dow = new Date(Date.UTC(+date.slice(0, 4), +date.slice(4, 6) - 1, +date.slice(6, 8))).getUTCDay();
  const on = new Set<string>();
  for (const c of g.calendar) if (c.days[dow] && c.start <= date && date <= c.end) on.add(c.service);
  for (const e of g.calendarDates) if (e.date === date) (e.type === 1 ? on.add(e.service) : on.delete(e.service));
  return on;
}

/**
 * A representative weekday: the Wednesday within the feed's validity with the most scheduled trips (earliest on a
 * tie), which skips holiday and transition days. An explicit date wins.
 */
export function referenceDate(g: Gtfs, explicit?: string): string {
  if (explicit) return explicit;
  const dates = [...g.calendar.flatMap((c) => [c.start, c.end]), ...g.calendarDates.map((e) => e.date)].filter(Boolean).sort();
  if (!dates.length) throw new Error('GTFS feed has no calendar');
  const parse = (s: string) => new Date(Date.UTC(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8)));
  const perService = new Map<string, number>();
  for (const t of g.trips.values()) perService.set(t.service, (perService.get(t.service) ?? 0) + 1);
  let best = '';
  let bestN = -1;
  for (let d = parse(dates[0]); ymd(d) <= dates.at(-1)!; d = new Date(d.getTime() + 86400000)) {
    if (d.getUTCDay() !== 3) continue;
    const date = ymd(d);
    let n = 0;
    for (const s of activeServices(g, date)) n += perService.get(s) ?? 0;
    if (n > bestN) (best = date), (bestN = n);
  }
  return best;
}
