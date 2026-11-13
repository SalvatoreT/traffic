//! Initial loading (change baseline-calibration): a run starts with agents already en route instead of an empty network.
//!
//! For every demand flow of the active period the number of agents already on their way at time zero is Poisson with mean
//! rate x expected trip time (Little's law: the mean number in a system is the arrival rate times the mean time spent in it). The
//! expected trip time is the free-flow route time, including the expected control delay at each node, times
//! `INITIAL_CONGESTION`. Each agent gets its own route, driver and position drawn uniformly by travel time along it, is queued in
//! its lane in order with a safe gap, and keeps the rest of its route. A settle interval of `INITIAL_SETTLE_S` is then stepped
//! before the clock starts at zero (the clock runs from `-INITIAL_SETTLE_S`), and every result counts from zero.

use super::*;

/// One agent to place, with its position on `route[at]` (the route holds the links from the first one on).
struct Cand {
    q: usize,
    lane: usize,
    link: u32,
    pos: f32,
    route: Vec<u32>,
    at: usize,
    drv: Drv,
    bike: bool,
    v0_abs: f32,
    origin: u32,
    dest: u32,
    through: bool,
    noise_seed: u32,
    uid: u32,
}

impl Simulation {
    /// Place the agents of the initial load and settle the network; the clock then reads 0 and all results are zeroed.
    pub(super) fn initial_load(&mut self) {
        self.prepopulate();
        let n = (INITIAL_SETTLE_S / DT).round() as usize;
        for _ in 0..n {
            self.step_once();
        }
        self.t = 0.0;
        self.update_costs();
        if self.adapt_interval().is_finite() {
            self.adapt_signals_over(INITIAL_SETTLE_S);
        }
        self.reset_results();
    }

    /// Route costs of a loaded network: a pass with free-flow routes on the network without interventions (so a baseline and a scenario
    /// run with the same seed route their placed agents alike), settled for `INITIAL_SETTLE_S`; its measured link times become the
    /// costs the placement routes on. Free-flow routes put too few cars on the side streets, because drivers move onto them as the
    /// arterials fill.
    pub(super) fn adopt_loaded_costs(&mut self) {
        let mut cfg = self.cfg.clone();
        cfg.interventions = Vec::new();
        let Ok(probe) = Simulation::build(self.net.clone(), self.demand.clone(), cfg, false) else { return };
        self.ema = probe.ema;
        self.mv_ema = probe.mv_ema;
        for l in 0..self.topo.n_links {
            self.link_cost[l] = self.eff.ff[l].max(self.ema[l]);
        }
        self.apply_mv_times();
        self.router.invalidate();
    }

    /// Zero every result so that the run counts from time zero. State that drives the dynamics (queues, signal plans, route costs,
    /// the vehicles themselves) is kept.
    fn reset_results(&mut self) {
        self.st = Stats { hist: vec![0.0; HIST_BINS], ..Default::default() };
        for b in [&mut self.bin_flow, &mut self.bin_ct, &mut self.bin_vt, &mut self.bin_vs] {
            b.iter_mut().for_each(|x| *x = 0.0);
        }
        self.cur_bin = 0;
        self.d_link_stopped.iter_mut().for_each(|x| *x = 0.0);
        self.d_link_delay.iter_mut().for_each(|x| *x = 0.0);
        self.d_link_exits.iter_mut().for_each(|x| *x = 0);
        self.d_node_wait.iter_mut().for_each(|x| *x = 0.0);
        self.d_node_space.iter_mut().for_each(|x| *x = 0.0);
        self.gridlock_log.clear();
        self.trips.clear();
        if let Some(sl) = self.sl.as_mut() {
            sl.records.clear();
        }
        for v in self.vehs.iter_mut().filter(|v| v.alive) {
            v.sl_hits.clear();
        }
        self.vuln = Vuln::default();
        self.world.reset_stats();
    }

    /// Route of an agent from `origin` to `dest`: the first link and the links after it. Cars use the free-flow cost tables with the
    /// driver's perception noise (as at departure), cyclists theirs without noise.
    fn initial_route(&mut self, bike: bool, origin: u32, dest: u32, seed: u32) -> Option<Vec<u32>> {
        let mut route = Vec::new();
        if bike {
            self.bike_router.ensure_m(dest, &self.topo, self.eff.bike_modal(), &self.eff.bike_link_cost);
            let table = self.bike_router.table(dest);
            let b = route::first_link_m(table, &self.topo, self.eff.bike_modal(), origin, NO_NOISE)?;
            route.push(b);
            route::walk_m(table, &self.topo, self.eff.bike_modal(), b, dest, NO_NOISE, &mut route).then_some(route)
        } else {
            self.router.ensure(dest, &self.topo, &self.eff, &self.link_cost);
            let table = self.router.table(dest);
            let mut b = route::first_link(table, &self.topo, &self.eff, origin, seed)?;
            route.push(b);
            if !route::walk(table, &self.topo, &self.eff, b, dest, seed, &mut route) {
                route.clear();
                b = route::first_link(table, &self.topo, &self.eff, origin, NO_NOISE)?;
                route.push(b);
                if !route::walk(table, &self.topo, &self.eff, b, dest, NO_NOISE, &mut route) {
                    return None;
                }
            }
            Some(route)
        }
    }

    /// Per link of `route`: (free-flow time on the link, delay in front of its stop line), both in s. The delay is the expected control delay at
    /// the node ahead, scaled up so that the route's total time is `INITIAL_CONGESTION` times its free-flow time with the control delay: the
    /// extra time of a loaded network is queueing at nodes (on a route with no control delay the free-flow time is scaled instead). `bike` is the cyclist's speed.
    fn initial_times(&self, route: &[u32], bike: Option<f32>) -> Vec<(f32, f32)> {
        let mut times: Vec<(f32, f32)> = route
            .iter()
            .enumerate()
            .map(|(i, &l)| {
                let mv = route.get(i + 1).and_then(|&b| self.topo.find_mv(l, b));
                match bike {
                    Some(v) => {
                        let free = self.topo.length[l as usize] / v.min(self.eff.limit[l as usize]).max(1.0);
                        (free, mv.map_or(0.0, |m| self.eff.bike_mv_cost[m as usize]))
                    }
                    None => (self.eff.ff[l as usize], mv.map_or(0.0, |m| (self.eff.mv_static[m as usize] - self.eff.mv_ff[m as usize]).max(0.0))),
                }
            })
            .collect();
        let (free, tail): (f32, f32) = times.iter().fold((0.0, 0.0), |a, t| (a.0 + t.0, a.1 + t.1));
        if tail > 1e-3 {
            let k = 1.0 + (INITIAL_CONGESTION as f32 - 1.0) * (free + tail) / tail;
            times.iter_mut().for_each(|t| t.1 *= k);
        } else {
            times.iter_mut().for_each(|t| t.0 *= INITIAL_CONGESTION as f32);
        }
        times
    }

    pub(super) fn prepopulate(&mut self) {
        let nq = self.lanes.len();
        let mut lane_n = vec![0u32; nq];
        let mut cands: Vec<Cand> = Vec::new();
        let mut placed_peds = 0u64;
        // Grouped by destination so the per-destination cost tables are reused; each flow draws from its own stream.
        let mut order: Vec<usize> = (0..self.flows.len()).collect();
        order.sort_by_key(|&k| (self.flows[k].mode as u8, self.flows[k].dest, k));
        for k in order {
            let (mode, origin, dest, rate, through) = {
                let f = &self.flows[k];
                (f.mode, f.origin, f.dest, f.rate, f.through)
            };
            let mut rng = Rng::stream(self.cfg.seed ^ INITIAL_STREAM, k as u64);
            if mode == FlowMode::Pedestrian {
                placed_peds += self.prepop_peds(&mut rng, origin, dest, rate);
                continue;
            }
            let bike = mode == FlowMode::Bicycle;
            let Some(r0) = self.initial_route(bike, origin, dest, NO_NOISE) else { continue };
            let v_mean = (BIKE_V_MEAN as f32).min(BIKE_COST_V * 1.2);
            let t0: f32 = self.initial_times(&r0, bike.then_some(v_mean)).iter().map(|t| t.0 + t.1).sum();
            let n = rng.poisson(rate * t0 as f64);
            for _ in 0..n {
                let (drv, v0_abs, noise_seed) = if bike {
                    (Drv::bike(&mut rng), bike_speed(&mut rng), NO_NOISE)
                } else {
                    (Drv::sample(&mut rng), 0.0, rng.u32() & 0x7FFF_FFFF)
                };
                let Some(route) = self.initial_route(bike, origin, dest, noise_seed) else { continue };
                let times = self.initial_times(&route, bike.then_some(v0_abs));
                let total: f32 = times.iter().map(|t| t.0 + t.1).sum();
                let mut r = rng.f64() as f32 * total;
                let mut at = route.len() - 1;
                for (i, t) in times.iter().enumerate() {
                    if r < t.0 + t.1 {
                        at = i;
                        break;
                    }
                    r -= t.0 + t.1;
                }
                let l = route[at] as usize;
                let (emerge, stop) = (self.topo.emerge_pos[l], self.topo.stop_pos[l]);
                // Uniform by time over the free-flow part, then the expected control delay in front of the stop line.
                let pos = if r < times[at].0 { emerge + (stop - emerge) * (r / times[at].0.max(1e-3)) } else { stop };
                let nm = self.topo.nmain[l];
                let lane = if bike {
                    self.topo.nlanes(l)
                } else if nm >= 2 {
                    match self.mv_kind(route[at] as u32, route.get(at + 1).copied()) {
                        Some(K_LEFT) => 0,
                        Some(K_RIGHT) => nm - 1,
                        _ => (0..nm).min_by_key(|&k| lane_n[self.topo.qidx(l, k)]).unwrap_or(0),
                    }
                } else {
                    0
                };
                let q = self.topo.qidx(l, lane);
                lane_n[q] += 1;
                let uid = self.uid_next;
                self.uid_next += 1;
                cands.push(Cand { q, lane, link: l as u32, pos, route, at, drv, bike, v0_abs, origin, dest, through, noise_seed, uid });
            }
        }
        // Front of each lane first; ties by uid so the order does not depend on the sort.
        let mut by_lane: Vec<usize> = (0..cands.len()).collect();
        by_lane.sort_by(|&a, &b| {
            let (x, y) = (&cands[a], &cands[b]);
            x.q.cmp(&y.q).then(y.pos.partial_cmp(&x.pos).unwrap_or(std::cmp::Ordering::Equal)).then(x.uid.cmp(&y.uid))
        });
        let mut lead: Option<(usize, f32, f32)> = None; // lane, rear position, speed
        let mut placed = 0u64;
        let mut skipped = 0u64;
        for &i in &by_lane {
            let c = &cands[i];
            let l = c.link as usize;
            if lead.map_or(true, |x| x.0 != c.q) {
                lead = None;
            }
            let (emerge, stop) = (self.topo.emerge_pos[l], self.topo.stop_pos[l]);
            if stop - emerge < 5.0 {
                skipped += 1;
                continue;
            }
            let hi = match lead {
                Some((_, rear, _)) => rear - (c.drv.s0 + INITIAL_GAP_EXTRA_M),
                None => stop - INITIAL_GAP_EXTRA_M,
            };
            let pos = c.pos.min(hi);
            if pos < emerge {
                skipped += 1;
                continue;
            }
            let v = self.initial_speed(c, pos, lead.map(|x| (x.1 - pos, x.2)));
            lead = Some((c.q, pos - c.drv.len, v));
            self.place_initial(i, &mut cands, pos, v);
            placed += 1;
        }
        self.init_agents = placed + placed_peds;
        self.init_skipped = skipped;
    }

    /// Speed at which an agent enters the world at `pos`: its desired speed, capped by what keeps a safe gap to the leader (the
    /// highest speed whose IDM desired gap fits, as for admission at a gate), or for the lane head by a comfortable stop at the stop line
    /// of a controlled node and the turn speed of its next movement.
    fn initial_speed(&self, c: &Cand, pos: f32, lead: Option<(f32, f32)>) -> f32 {
        let l = c.link as usize;
        let limit = self.eff.limit[l];
        let d = &c.drv;
        let v0 = if c.bike { c.v0_abs.min(limit.max(2.0)) } else { (limit * d.fcomp).max(1.0) };
        match lead {
            Some((gap, vl)) => {
                let root = 2.0 * (d.a * d.b).sqrt();
                let mut v = v0;
                while v > 0.0 {
                    if d.s0 + v * d.t_hw + (v * (v - vl) / root).max(0.0) <= gap {
                        return v;
                    }
                    v -= 0.5;
                }
                0.0
            }
            None => {
                let dd = (self.topo.stop_pos[l] - pos).max(0.0);
                let node = self.topo.link_to[l] as usize;
                let mut v = v0;
                if self.eff.ctrl[node] != Control::Uncontrolled {
                    v = v.min((2.0 * d.b * dd).sqrt());
                }
                if let Some(mv) = c.route.get(c.at + 1).and_then(|&b| self.topo.find_mv(c.link, b)) {
                    let vt = if c.bike { self.eff.bike_mv_vturn[mv as usize] } else { self.eff.mv_vturn[mv as usize] };
                    v = v.min((vt * vt + 2.0 * d.b * dd).sqrt());
                }
                v
            }
        }
    }

    fn place_initial(&mut self, i: usize, cands: &mut [Cand], pos: f32, v: f32) {
        let c = &mut cands[i];
        let id = self.alloc_veh();
        if c.bike {
            self.n_alive -= 1;
            self.n_bike += 1;
        }
        let rest: Vec<u32> = c.route[c.at + 1..].to_vec();
        let guided = !c.bike && self.is_guided(c.noise_seed);
        self.vehs[id as usize] = Veh {
            alive: true,
            kind: if c.bike { KIND_BIKE } else { KIND_CAR },
            v0_abs: c.v0_abs,
            uid: c.uid,
            link: c.link,
            lane: c.lane as u8,
            pos,
            v,
            drv: c.drv,
            origin: c.origin,
            dest: c.dest,
            through: c.through,
            noise_seed: c.noise_seed,
            route: rest,
            guided,
            last_switch_t: self.t - MIN_SWITCH_GAP_S,
            t_depart: self.t,
            t_enter: self.t,
            preplaced: true,
            ..Veh::blank()
        };
        let (q, link, bike) = (c.q, c.link, c.bike);
        self.lanes[q].push_back(id);
        if !bike {
            self.sl_enter(id, link);
        }
    }
}
