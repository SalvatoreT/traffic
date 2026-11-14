/**
 * MockSimulation: a tiny stand-in with the same interface as the WASM `Simulation`, used with `?mock=1` or
 * when WASM fails to initialize. Vehicles drift along links; it is NOT a traffic model.
 */
import type { Demand, Intervention, Metrics, Network } from '../types';
import { KIND_BIKE, KIND_PED } from '../types';
import { pointAlong } from '../lib/geom';
import { bannedMoves } from '../lib/diverter';
import type { SimLike } from './protocol';

interface V { link: number; s: number; v: number; ct: boolean; ctCounted?: boolean; trip: number; born: number }
/** Non-car agent: kind is KIND_BIKE or KIND_PED. */
interface A { kind: number; link: number; s: number; v: number; born: number }

// Mock-only numbers: plausible magnitudes so the UI can be built, not a model.
const MOCK_AGENTS = { bike: 140, ped: 1200 };
const MOCK_END_P = { bike: 0.04, ped: 0.05 };

export class MockSimulation implements SimLike {
  private net: Network;
  private cfg: { seed: number; period: string; demandScale: number; interventions?: Intervention[] };
  private demandFlow = 0;
  private t = 0;
  private rng = 1;
  private veh: V[] = [];
  private closed = new Set<number>();
  /** Car movements `from-to` removed by diagonal diverters (cyclists and walkers are not held by the mock). */
  private banned = new Set<string>();
  private limitScale = new Map<number, number>();
  private slow = new Set<number>();
  private cross: Float64Array;
  private ctCross: Float64Array;
  private speedTime: Float64Array;
  private vehTime: Float64Array;
  private dist = 0;
  private ctDist = 0;
  private ctVehicles = 0;
  private completed = 0;
  private tripTimeSum = 0;
  private spawned = 0;
  private target = 0;
  private out: number[][];
  private ttc = 0;
  private agents: A[] = [];
  private initialAgents = 0;
  private carsOn: Uint16Array;
  private pedsOn: Uint16Array;
  private mm = {
    bike: { trips: 0, timeSum: 0 },
    ped: { trips: 0, timeSum: 0, delaySum: 0, delayN: 0 },
    pedConf: 0, bikeConf: 0, close: 0, pedRisk: 0, bikeRisk: 0, pedEnc: 0, pedEncSpeed: 0,
  };

  constructor(network: string, demand: string, config: string) {
    this.net = JSON.parse(network) as Network;
    const dem = JSON.parse(demand) as Demand;
    this.cfg = JSON.parse(config);
    const p = dem.periods.find((x) => x.id === this.cfg.period) ?? dem.periods[0];
    this.demandFlow = p ? p.flows.reduce((a, f) => a + f.vehPerHour, 0) : 500;
    const L = this.net.links.length;
    this.cross = new Float64Array(L); this.ctCross = new Float64Array(L);
    this.speedTime = new Float64Array(L); this.vehTime = new Float64Array(L);
    this.carsOn = new Uint16Array(L); this.pedsOn = new Uint16Array(L);
    this.out = Array.from({ length: this.net.nodes.length }, () => []);
    for (const l of this.net.links) this.out[l.from].push(l.id);
    this.target = Math.min(3000, Math.round(this.demandFlow * 0.12 * this.cfg.demandScale) + 30);
    // Like the engine, start with the scenario in force and traffic already on the streets (reset places the agents).
    if (this.cfg.interventions?.length) this.setInterventions(JSON.stringify(this.cfg.interventions));
    this.reset();
  }

  private rand() { this.rng = (this.rng * 1664525 + 1013904223) >>> 0; return this.rng / 4294967296; }

  reset() {
    this.rng = (this.cfg.seed | 0) + 1 || 1;
    this.t = 0; this.veh = []; this.dist = 0; this.ctDist = 0; this.ctVehicles = 0; this.completed = 0; this.tripTimeSum = 0; this.spawned = 0; this.ttc = 0;
    this.cross.fill(0); this.ctCross.fill(0); this.speedTime.fill(0); this.vehTime.fill(0);
    this.mm = {
      bike: { trips: 0, timeSum: 0 },
      ped: { trips: 0, timeSum: 0, delaySum: 0, delayN: 0 },
      pedConf: 0, bikeConf: 0, close: 0, pedRisk: 0, bikeRisk: 0, pedEnc: 0, pedEncSpeed: 0,
    };
    this.agents = [];
    const scale = this.cfg.demandScale;
    const spawn = (kind: number, n: number, pool: Network['links']) => {
      for (let i = 0; i < n && pool.length; i++) {
        const l = pool[Math.floor(this.rand() * pool.length)];
        this.agents.push({ kind, link: l.id, s: this.rand() * l.length, v: 0, born: this.t });
      }
    };
    const walkable = this.net.links.filter((l) => l.class !== 'motorway' && l.sidewalk !== false);
    spawn(KIND_BIKE, Math.round(MOCK_AGENTS.bike * scale), this.net.links.filter((l) => l.class !== 'motorway'));
    spawn(KIND_PED, Math.round(MOCK_AGENTS.ped * scale), walkable);
    const open = this.net.links.filter((l) => !this.closed.has(l.id));
    for (let i = 0; i < this.target && open.length; i++) {
      const l = open[Math.floor(this.rand() * open.length)];
      this.veh.push(this.make(l.id, this.rand() * l.length));
    }
    this.initialAgents = this.veh.length + this.agents.length;
  }

  private make(link: number, s: number): V {
    const l = this.net.links[link];
    return { link, s, v: l.speedLimit * 0.5, ct: l.class === 'residential' && this.rand() < 0.3, trip: 0, born: this.t };
  }

  setInterventions(json: string) {
    const list = JSON.parse(json) as Intervention[];
    this.closed.clear(); this.limitScale.clear(); this.slow.clear(); this.banned.clear();
    for (const iv of list) {
      const rev = (id: number) => this.net.links[id].reverse;
      if (iv.type === 'modal_filter' && 'link' in iv) { this.closed.add(iv.link); const r = rev(iv.link); if (r !== null) this.closed.add(r); }
      else if (iv.type === 'modal_filter' && 'node' in iv) {
        for (const l of this.net.links) if ((l.from === iv.node || l.to === iv.node) && (!iv.legs || iv.legs.includes(l.id))) this.closed.add(l.id);
      } else if (iv.type === 'one_way') { const r = rev(iv.link); if (r !== null) this.closed.add(r); }
      else if (iv.type === 'speed_limit') {
        for (const id of [iv.link, rev(iv.link)]) if (id !== null) this.limitScale.set(id, iv.speed / this.net.links[id].speedLimit);
      } else if (iv.type === 'diagonal_diverter') {
        const inc: number[][] = this.net.nodes.map(() => []);
        for (const l of this.net.links) inc[l.to].push(l.id);
        for (const m of bannedMoves(this.net, { incomingLinks: inc, outgoingLinks: this.out }, iv.node, iv.bearing)) this.banned.add(m);
      } else if (iv.type === 'speed_hump') { this.slow.add(iv.link); const r = rev(iv.link); if (r !== null) this.slow.add(r); }
    }
    this.veh = this.veh.filter((v) => !this.closed.has(v.link));
  }

  private stepAgents(dt: number) {
    const links = this.net.links;
    this.carsOn.fill(0); this.pedsOn.fill(0);
    for (const v of this.veh) this.carsOn[v.link]++;
    for (const a of this.agents) if (a.kind === KIND_PED) this.pedsOn[a.link]++;
    const m = this.mm;
    for (const a of this.agents) {
      const l = links[a.link];
      const lim = l.speedLimit * (this.limitScale.get(a.link) ?? 1);
      const target = a.kind === KIND_BIKE ? Math.min(5, lim) : 1.3;
      a.v += (target - a.v) * 0.2;
      a.s += a.v * dt;
      const cars = this.carsOn[a.link];
      if (cars > 0) {
        // Encounter exposure grows with cars and walkers or cyclists sharing a link; a mock stand-in.
        const carSpeed = lim * 0.7;
        const exp = (cars / Math.max(l.length, 20)) * dt * (a.kind === KIND_PED ? 0.02 : a.kind === KIND_BIKE ? 0.06 : 0);
        if (exp > 0) {
          const risk = Math.pow(carSpeed / 11.2, 2.5);
          if (a.kind === KIND_PED) { m.pedConf += exp; m.pedRisk += exp * risk; m.pedEnc += exp; m.pedEncSpeed += exp * carSpeed; }
          else { m.bikeConf += exp; m.bikeRisk += exp * risk; if (!l.bikeLane) m.close += exp * 0.5; }
        }
      }
      if (a.s < l.length) continue;
      const pick = this.out[l.to];
      const ended = this.rand() < (a.kind === KIND_BIKE ? MOCK_END_P.bike : MOCK_END_P.ped);
      if (ended) {
        const dur = this.t - a.born;
        if (a.kind === KIND_BIKE) { m.bike.trips++; m.bike.timeSum += dur; }
        else { m.ped.trips++; m.ped.timeSum += dur; }
        a.born = this.t;
      }
      if (!pick.length) { a.s = 0; continue; }
      a.link = pick[Math.floor(this.rand() * pick.length)]; a.s = 0;
      if (a.kind === KIND_PED) {
        m.ped.delaySum += Math.min(40, 3 + 2.5 * this.carsOn[a.link]); m.ped.delayN++;
      }
    }
  }

  step(seconds: number) {
    const n = Math.max(1, Math.round(seconds / 0.25));
    const dt = 0.25;
    for (let k = 0; k < n; k++) {
      this.t += dt;
      for (let i = 0; i < this.veh.length; i++) {
        const v = this.veh[i];
        const l = this.net.links[v.link];
        const lim = l.speedLimit * (this.limitScale.get(v.link) ?? 1) * (this.slow.has(v.link) ? 0.6 : 1);
        v.v += (lim * (0.7 + 0.3 * ((i * 7) % 10) / 10) - v.v) * 0.1;
        v.s += v.v * dt;
        this.vehTime[v.link] += dt; this.speedTime[v.link] += v.v * dt;
        this.dist += (v.v * dt) / 1000;
        if (v.ct) this.ctDist += (v.v * dt) / 1000;
        if (v.s >= l.length) {
          this.cross[v.link]++;
          if (v.ct) { this.ctCross[v.link]++; if (!v.ctCounted) { v.ctCounted = true; this.ctVehicles++; } }
          const free = (id: number) => !this.closed.has(id) && !this.banned.has(`${v.link}-${id}`);
          const opts = this.out[l.to].filter((id) => free(id) && this.net.links[id].to !== l.from);
          const pick = opts.length ? opts : this.out[l.to].filter(free);
          if (!pick.length || this.rand() < 0.01) {
            this.completed++; this.tripTimeSum += this.t - v.born;
            const open = this.net.links.filter((x) => !this.closed.has(x.id));
            const nl = open[Math.floor(this.rand() * open.length)];
            this.veh[i] = this.make(nl.id, 0);
          } else { v.link = pick[Math.floor(this.rand() * pick.length)]; v.s = 0; }
        }
      }
      this.stepAgents(dt);
    }
  }

  time() { return this.t; }

  vehicles(): Float32Array {
    const nv = this.veh.length;
    const a = new Float32Array((nv + this.agents.length) * 6);
    this.veh.forEach((v, i) => {
      const p = pointAlong(this.net.links[v.link].geometry, v.s);
      a.set([p.x, p.y, p.heading, v.v, 0, v.ct ? 1 : 0], i * 6);
    });
    this.agents.forEach((g, i) => {
      const p = pointAlong(this.net.links[g.link].geometry, g.s);
      // Walkers use the sidewalk beside the link (right of travel), cyclists the lane edge.
      const off = g.kind === KIND_PED ? 4.5 : g.kind === KIND_BIKE ? 1.6 : 0;
      const ox = Math.sin(p.heading) * off, oy = -Math.cos(p.heading) * off;
      a.set([p.x + ox, p.y + oy, p.heading, g.v, g.kind, 0], (nv + i) * 6);
    });
    return a;
  }

  signals(): Uint8Array {
    const a = new Uint8Array(this.net.links.length);
    const phase = Math.floor(this.t / 30) % 2;
    for (const l of this.net.links) {
      if (this.net.nodes[l.to].control !== 'signal') continue;
      const horiz = Math.abs(l.geometry[1][0] - l.geometry[0][0]) > Math.abs(l.geometry[1][1] - l.geometry[0][1]);
      const g = horiz === (phase === 0);
      const frac = (this.t % 30) / 30;
      a[l.id] = g ? (frac > 0.9 ? 2 : 1) : 3;
    }
    return a;
  }

  linkStats(): Float32Array {
    const L = this.net.links.length;
    const a = new Float32Array(L * 4);
    const hours = Math.max(this.t, 1) / 3600;
    for (let i = 0; i < L; i++) {
      a[i * 4] = this.cross[i] / hours;
      a[i * 4 + 1] = this.vehTime[i] > 0 ? this.speedTime[i] / this.vehTime[i] : 0;
      a[i * 4 + 2] = this.ctCross[i] / hours;
      a[i * 4 + 3] = this.vehTime[i] / Math.max(this.t, 1) / (this.net.links[i].length / 1000);
    }
    return a;
  }

  metrics(): string {
    let ls = 0, lt = 0, as = 0, at = 0, over20 = 0, over25 = 0;
    for (let i = 0; i < this.net.links.length; i++) {
      const l = this.net.links[i];
      if (l.class === 'residential') { ls += this.speedTime[i]; lt += this.vehTime[i]; if (this.vehTime[i] > 0) { const m = this.speedTime[i] / this.vehTime[i]; if (m > 8.9) over20 += this.vehTime[i]; if (m > 11.2) over25 += this.vehTime[i]; } }
      else { as += this.speedTime[i]; at += this.vehTime[i]; }
    }
    const mm = this.mm;
    const meanLocal = lt > 0 ? ls / lt : 0;
    const m: Metrics = {
      time: this.t, vehiclesInNetwork: this.veh.length, spawned: this.spawned + this.veh.length, completedTrips: this.completed,
      backlog: 0, unroutableTrips: 0,
      meanTripTime: this.completed ? this.tripTimeSum / this.completed : 0,
      meanTripDelay: this.completed ? (this.tripTimeSum / this.completed) * 0.25 : 0,
      vehKm: this.dist,
      cutThrough: { vehicles: this.ctVehicles, vehiclesPerHour: this.ctVehicles * 3600 / Math.max(this.t, 1), vehKm: this.ctDist, shareOfLocalVehKm: this.dist > 0 ? this.ctDist / this.dist : 0 },
      safety: {
        localMeanSpeed: meanLocal, localP85Speed: meanLocal * 1.25,
        shareAbove20mph: lt > 0 ? over20 / lt : 0, shareAbove25mph: lt > 0 ? over25 / lt : 0, ttcConflicts: this.ttc,
      },
      arterialMeanSpeed: at > 0 ? as / at : 0,
      modes: {
        car: { inNetwork: this.veh.length, completedTrips: this.completed, meanTripTime: this.completed ? this.tripTimeSum / this.completed : 0 },
        bicycle: {
          inNetwork: this.agents.filter((g) => g.kind === KIND_BIKE).length, completedTrips: mm.bike.trips,
          meanTripTime: mm.bike.trips ? mm.bike.timeSum / mm.bike.trips : 0,
        },
        pedestrian: {
          inNetwork: this.agents.filter((g) => g.kind === KIND_PED).length, completedTrips: mm.ped.trips,
          meanTripTime: mm.ped.trips ? mm.ped.timeSum / mm.ped.trips : 0,
          meanCrossingDelay: mm.ped.delayN ? mm.ped.delaySum / mm.ped.delayN : 0,
        },
      },
      initialAgents: this.initialAgents, initialSkipped: 0,
      vulnerable: {
        pedConflicts: Math.round(mm.pedConf), bikeConflicts: Math.round(mm.bikeConf), closePasses: Math.round(mm.close),
        pedInjuryRiskIndex: mm.pedRisk, bikeInjuryRiskIndex: mm.bikeRisk,
        meanVehicleSpeedAtPedEncounter: mm.pedEnc > 0 ? mm.pedEncSpeed / mm.pedEnc : 0,
      },
    };
    return JSON.stringify(m);
  }
}
