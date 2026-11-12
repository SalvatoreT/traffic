//! Buses, bicycles and the safety surrogates (change multimodal-agents, decisions D2, D3, D5).

use super::*;

// ---------------------------------------------------------------------------------------------------- buses

pub(super) struct StopRt {
    /// Index into the route's link list of the link the stop is on.
    pub link_idx: u32,
    pub pos: f32,
    pub dwell: f32,
}

pub(super) struct BusRt {
    pub links: Vec<u32>,
    pub stops: Vec<StopRt>,
    pub headway: f64,
    pub next_t: f64,
    pub len_m: f32,
}

// ------------------------------------------------------------------------------------------------- safety

/// One recent node crossing, for bicycle-vehicle post-encroachment time.
#[derive(Clone, Copy)]
pub(super) struct LogEnt {
    pub t_out: f64,
    pub mv: u32,
    pub bike: bool,
    /// Speed of the vehicle when it entered the node.
    pub speed: f32,
}

#[derive(Default)]
pub(super) struct Vuln {
    pub ped_conf: u64,
    pub bike_conf: u64,
    pub close_passes: u64,
    pub ped_enc: u64,
    pub ped_risk_sum: f64,
    pub ped_speed_sum: f64,
    pub bike_enc: u64,
    pub bike_risk_sum: f64,
}

impl Vuln {
    /// A vehicle passed a crosswalk conflict point with post-encroachment time `pet` (s) while at speed `speed` (m/s).
    pub fn ped_encounter(&mut self, pet: f32, speed: f32) {
        if pet < PET_ENCOUNTER_S {
            self.ped_enc += 1;
            self.ped_risk_sum += injury_risk(speed) as f64;
            self.ped_speed_sum += speed as f64;
            if pet < PET_THRESHOLD {
                self.ped_conf += 1;
            }
        }
    }

    pub fn bike_encounter(&mut self, pet: f32, speed: f32) {
        if pet < PET_ENCOUNTER_S {
            self.bike_enc += 1;
            self.bike_risk_sum += injury_risk(speed) as f64;
            if pet < PET_THRESHOLD {
                self.bike_conf += 1;
            }
        }
    }

    pub fn bike_pass(&mut self, speed: f32, close: bool) {
        self.bike_enc += 1;
        self.bike_risk_sum += injury_risk(speed) as f64;
        if close {
            self.close_passes += 1;
        }
    }
}

/// Severe-injury risk (0..1) of a pedestrian struck at `v` m/s: piecewise-linear through the points of [Tefft2013] (see
/// `params::TEFFT_AIS4` for the interpolation rules). Used as an ASSUMPTION proxy for cyclists (no cyclist-specific source in
/// docs/references.md).
pub fn injury_risk(v: f32) -> f32 {
    let mph = v * 2.236_936;
    let p = &TEFFT_AIS4;
    if mph <= 0.0 {
        return 0.0;
    }
    if mph < p[0].0 {
        return p[0].1 * mph / p[0].0;
    }
    for w in p.windows(2) {
        if mph <= w[1].0 {
            let u = (mph - w[0].0) / (w[1].0 - w[0].0);
            return w[0].1 + u * (w[1].1 - w[0].1);
        }
    }
    let (a, b) = (p[p.len() - 2], p[p.len() - 1]);
    (b.1 + (mph - b.0) * (b.1 - a.1) / (b.0 - a.0)).min(1.0)
}

// ---------------------------------------------------------------------------------------- per-step extras

/// Extra longitudinal constraints on a vehicle beyond its queue leader and node control.
#[derive(Default)]
pub(super) struct Extra {
    /// Distance to a virtual standing obstacle (bus stop mark, crosswalk stop line).
    pub obstacle: Option<f32>,
    /// A cyclist ahead on a shared link that the driver follows: (gap to its rear, its speed).
    pub bike_lead: Option<(f32, f32)>,
    /// Start passing this cyclist (uid), and whether the pass leaves little lateral room.
    pub begin_pass: Option<(u32, bool)>,
    /// The vehicle's front reached the rear of the cyclist it is passing: score the pass (speed difference, speed).
    pub score_pass: Option<(f32, f32)>,
    pub end_pass: bool,
    /// Bus: begin dwelling now (dwell seconds).
    pub dwell: Option<f32>,
    /// Bus: the stop was passed without dwelling; move on to the next one.
    pub skip_stop: bool,
}

pub(super) struct Ctx<'a> {
    pub topo: &'a Topo,
    pub eff: &'a Eff,
    pub net: &'a Network,
    pub lanes: &'a [VecDeque<u32>],
    pub vehs: &'a [Veh],
    pub world: &'a PedWorld,
    pub buses: &'a [BusRt],
    pub ped_on: bool,
    pub bike_on: bool,
    pub lane_w: f32,
}

impl Ctx<'_> {
    /// Oncoming lane clear enough to pass a cyclist at position `pos` of link `l` using the opposing lane?
    fn oncoming_clear(&self, l: usize, veh: &Veh, gap: f32) -> bool {
        let Some(r) = self.net.links[l].reverse else { return true };
        let r = r as usize;
        if self.eff.closed[r] {
            return true;
        }
        let len = self.topo.length[l];
        let lr = self.topo.length[r];
        for k in 0..self.topo.nlanes(r) {
            for &o in &self.lanes[self.topo.lane_base[r] as usize + k] {
                let ov = &self.vehs[o as usize];
                // Front of the oncoming vehicle in this link's coordinates.
                let x = len - ov.pos * (len / lr);
                let dist = x - veh.pos;
                if dist < -ov.drv.len {
                    continue;
                }
                // The driver first closes the gap to the cyclist, then needs the passing distance beyond it.
                let closing = (veh.v + ov.v).max(0.5);
                if dist < gap + PASS_MIN_CLEAR_M || dist / closing < PASS_TIME_S + gap / veh.v.max(2.0) {
                    return false;
                }
            }
        }
        true
    }

    pub fn extras(&self, vid: u32, l: usize, k: usize) -> Extra {
        let veh = &self.vehs[vid as usize];
        let mut ex = Extra::default();
        let mut obstacle = f32::INFINITY;

        if veh.kind == KIND_BUS {
            let rt = &self.buses[veh.bus_route as usize];
            if let Some(stop) = rt.stops.get(veh.next_stop as usize) {
                if stop.link_idx == veh.ridx {
                    if veh.pos > stop.pos + BUS_SETTLE_M + 1.0 {
                        ex.skip_stop = true;
                    } else {
                        if veh.v < 0.3 && (stop.pos - veh.pos).abs() < BUS_SETTLE_M + veh.drv.s0 {
                            ex.dwell = Some(stop.dwell);
                        }
                        obstacle = obstacle.min((stop.pos + veh.drv.s0 - veh.pos).max(0.1));
                    }
                } else if stop.link_idx < veh.ridx {
                    ex.skip_stop = true;
                }
            }
        }

        if self.ped_on {
            for &(xp, xw) in &self.world.mid[l] {
                if veh.pos >= xp - 0.3 {
                    continue;
                }
                let x = &self.world.xws[xw as usize];
                let s = (xp - XW_STOP_M) - veh.pos;
                let stoppable = veh.v * veh.v / (2.0 * PED_EMERGENCY_B) <= s.max(0.0) + 0.5;
                let yielding = x.yields(xw, veh.uid, veh.v, s);
                if (x.crossing > 0 && stoppable) || yielding {
                    obstacle = obstacle.min(s.max(0.1));
                }
            }
        }
        if obstacle.is_finite() {
            ex.obstacle = Some(obstacle);
        }

        if self.bike_on && veh.kind != KIND_BIKE && k < self.topo.nmain[l] && k + 1 == self.topo.nmain[l] && !self.net.links[l].bike_lane {
            let bq = &self.lanes[self.topo.qidx(l, self.topo.nlanes(l))];
            // Nearest cyclist ahead (queue front = furthest ahead).
            let mut ahead: Option<&Veh> = None;
            for &b in bq.iter() {
                let bv = &self.vehs[b as usize];
                if bv.pos > veh.pos {
                    ahead = Some(bv);
                } else {
                    break;
                }
            }
            if let Some(b) = ahead {
                let gap = b.pos - b.drv.len - veh.pos;
                if veh.passing == b.uid {
                    if !veh.pass_scored && gap <= veh.v * DT as f32 + 0.1 {
                        ex.score_pass = Some((veh.v - b.v, veh.v));
                    }
                } else if gap < PASS_DECISION_GAP {
                    let nmain = self.topo.nmain[l];
                    let one_way = self.net.links[l].reverse.map_or(true, |r| self.eff.closed[r as usize]);
                    let v0 = (self.eff.limit[l] * veh.drv.fcomp).max(1.0);
                    let wants = v0 > b.v + PASS_MIN_DV;
                    let mut pass = None;
                    if wants {
                        if nmain >= 2 {
                            pass = Some(false);
                        } else if one_way {
                            let clearance = self.lane_w - CAR_WIDTH_M - BIKE_WIDTH_M;
                            if clearance >= PASS_MIN_LATERAL_M {
                                pass = Some(clearance < CLOSE_PASS_CLEAR_M);
                            }
                        } else if self.oncoming_clear(l, veh, gap) {
                            pass = Some(false);
                        }
                    }
                    match pass {
                        Some(close) => ex.begin_pass = Some((b.uid, close)),
                        None => ex.bike_lead = Some((gap, b.v)),
                    }
                }
            } else if veh.passing != NONE_UID {
                ex.end_pass = true;
            }
        } else if veh.passing != NONE_UID {
            ex.end_pass = true;
        }
        ex
    }
}

impl Simulation {
    // ------------------------------------------------------------------ setup

    pub(super) fn init_modes(&mut self) {
        self.bike_on = self.flows.iter().any(|f| f.mode == FlowMode::Bicycle);
        self.ped_on = self.flows.iter().any(|f| f.mode == FlowMode::Pedestrian);
        if self.ped_on {
            self.world = PedWorld::build(&self.net, &self.topo);
            self.set_yield_probabilities();
        }
        self.buses.clear();
        self.bus_dropped_routes = 0;
        let Some(tf) = self.transit_file.as_ref() else { return };
        let period_id = self
            .demand
            .periods
            .iter()
            .find(|p| p.id == self.cfg.period)
            .or_else(|| self.demand.periods.first())
            .map(|p| p.id.clone())
            .unwrap_or_default();
        let nl = self.topo.n_links as u32;
        for (ri, r) in tf.routes.iter().enumerate() {
            let linked = r.links.len() >= 1
                && r.links.iter().all(|&l| l < nl)
                && r.links.windows(2).all(|w| self.topo.find_mv(w[0], w[1]).is_some());
            if !linked {
                self.bus_dropped_routes += 1;
                continue;
            }
            // No headway for the simulated period: the route does not run (service is data, not a default).
            let Some(hw) = r.headways.iter().find(|h| h.period == period_id && h.seconds > 0.0) else { continue };
            let mut stops: Vec<StopRt> = Vec::new();
            for s in &r.stops {
                let Some(idx) = r.links.iter().position(|&l| l == s.link) else { continue };
                let l = s.link as usize;
                let lo = self.topo.emerge_pos[l] + 1.0;
                let hi = (self.topo.stop_pos[l] - 1.0).max(lo);
                stops.push(StopRt {
                    link_idx: idx as u32,
                    pos: (s.position as f32).clamp(lo, hi),
                    dwell: if s.dwell > 0.0 { s.dwell as f32 } else { BUS_DWELL_DEFAULT_S },
                });
            }
            stops.sort_by(|a, b| (a.link_idx, a.pos).partial_cmp(&(b.link_idx, b.pos)).unwrap());
            let len_m: f32 = r.links.iter().map(|&l| self.topo.length[l as usize]).sum();
            // Deterministic offset so routes do not all depart together.
            let off = (hash32(ri as u32, self.cfg.seed as u32) % 1000) as f64 / 1000.0 * hw.seconds;
            self.buses.push(BusRt { links: r.links.clone(), stops, headway: hw.seconds, next_t: off, len_m });
        }
    }

    /// Dropped transit routes (not linked in the network) and bus runs blocked by interventions.
    pub fn transit_report(&self) -> (usize, u64, u64) {
        (self.buses.len(), self.bus_dropped_routes, self.bus_blocked)
    }

    // ------------------------------------------------------------------ mode views

    #[inline]
    pub(super) fn mv_allowed(&self, kind: u8, mv: u32) -> bool {
        match kind {
            KIND_BUS => self.eff.bus_mv_ok[mv as usize],
            KIND_BIKE => self.eff.bike_mv_ok[mv as usize],
            _ => self.eff.mv_ok[mv as usize],
        }
    }

    /// Lane choice on link `l` for an agent of `kind`: cyclists use the link's bicycle queue.
    pub(super) fn pick_lane_for(&self, kind: u8, l: u32, hint: Option<u8>, horizon: f32) -> Option<usize> {
        if kind == KIND_BIKE {
            let k = self.topo.nlanes(l as usize);
            if self.lane_room_ahead(l, k, horizon) >= self.room_need(l as usize) {
                Some(k)
            } else {
                None
            }
        } else {
            self.pick_lane(l, hint, horizon)
        }
    }

    // ------------------------------------------------------------------ spawning

    pub(super) fn try_spawn_bikes(&mut self) {
        if !self.bike_on {
            return;
        }
        for n in 0..self.topo.n_nodes {
            for _ in 0..4 {
                let Some(trip) = self.bike_backlog[n].front() else { break };
                let dest = trip.dest;
                self.bike_router.ensure_m(dest, &self.topo, self.eff.bike_modal(), &self.eff.bike_link_cost);
                let table = self.bike_router.table(dest);
                let mut route = Vec::new();
                let first = route::first_link_m(table, &self.topo, self.eff.bike_modal(), n as u32, NO_NOISE);
                let ok = first.map_or(false, |b| route::walk_m(table, &self.topo, self.eff.bike_modal(), b, dest, NO_NOISE, &mut route));
                if !ok {
                    self.bike_backlog[n].pop_front();
                    continue;
                }
                let b = first.unwrap();
                let Some(lane) = self.pick_lane_for(KIND_BIKE, b, None, 0.0) else { break };
                let trip = self.bike_backlog[n].pop_front().unwrap();
                let id = self.alloc_veh();
                self.n_alive -= 1;
                self.n_bike += 1;
                self.vehs[id as usize] = Veh {
                    alive: true,
                    kind: KIND_BIKE,
                    v0_abs: trip.v0_abs,
                    uid: trip.uid,
                    link: b,
                    lane: lane as u8,
                    pos: self.topo.emerge_pos[b as usize],
                    v: trip.v0_abs.min(3.0),
                    drv: trip.drv,
                    origin: trip.origin,
                    dest: trip.dest,
                    route,
                    t_depart: trip.t_arr,
                    t_enter: self.t,
                    ..Veh::blank()
                };
                let idx = self.topo.qidx(b as usize, lane);
                self.lanes[idx].push_back(id);
            }
        }
    }

    pub(super) fn bus_route_ok(&self, bi: usize) -> bool {
        let r = &self.buses[bi];
        !self.eff.oneway_closed[r.links[0] as usize]
            && r.links.windows(2).all(|w| self.topo.find_mv(w[0], w[1]).map_or(false, |m| self.eff.bus_mv_ok[m as usize]))
    }

    pub(super) fn try_spawn_buses(&mut self) {
        for bi in 0..self.buses.len() {
            while self.buses[bi].next_t <= self.t {
                if !self.bus_route_ok(bi) {
                    self.bus_blocked += 1;
                    self.buses[bi].next_t += self.buses[bi].headway;
                    continue;
                }
                let links = &self.buses[bi].links;
                let first = links[0];
                let hint = self.mv_kind(first, links.get(1).copied());
                let Some(lane) = self.pick_lane(first, hint, 0.0) else { break };
                let route: Vec<u32> = links[1..].to_vec();
                let last = *links.last().unwrap();
                let t_sched = self.buses[bi].next_t;
                self.buses[bi].next_t += self.buses[bi].headway;
                let id = self.alloc_veh();
                let uid = self.uid_next;
                self.uid_next += 1;
                let v0 = self.eff.limit[first as usize];
                self.vehs[id as usize] = Veh {
                    alive: true,
                    kind: KIND_BUS,
                    uid,
                    link: first,
                    lane: lane as u8,
                    pos: self.topo.emerge_pos[first as usize],
                    v: v0.min(4.0),
                    drv: Drv::bus(),
                    origin: self.topo.link_from[first as usize],
                    dest: self.topo.link_to[last as usize],
                    route,
                    t_depart: t_sched,
                    t_enter: self.t,
                    bus_route: bi as u32,
                    ..Veh::blank()
                };
                let idx = self.topo.qidx(first as usize, lane);
                self.lanes[idx].push_back(id);
                self.st.spawned += 1;
            }
        }
    }

    // ------------------------------------------------------------------ bus lane changes

    /// A vehicle queued directly behind a dwelling bus moves to another through lane when the link has one with room
    /// (D2: followers queue unless another lane is free).
    pub(super) fn bus_lane_changes(&mut self) {
        if self.buses.is_empty() {
            return;
        }
        let mut moves: Vec<(u32, usize, usize, usize, usize)> = Vec::new();
        for (bid, b) in self.vehs.iter().enumerate() {
            if !b.alive || b.kind != KIND_BUS || b.in_transit || b.dwell_left <= 0.0 {
                continue;
            }
            let l = b.link as usize;
            let nmain = self.topo.nmain[l];
            if nmain < 2 || (b.lane as usize) >= nmain {
                continue;
            }
            let q = &self.lanes[self.topo.lane_base[l] as usize + b.lane as usize];
            let Some(bi) = q.iter().position(|&x| x == bid as u32) else { continue };
            let Some(&fid) = q.get(bi + 1) else { continue };
            let f = &self.vehs[fid as usize];
            if b.pos - b.drv.len - f.pos > 30.0 || f.pos > self.topo.stop_pos[l] - 15.0 {
                continue;
            }
            for k2 in 0..nmain {
                if k2 == b.lane as usize {
                    continue;
                }
                let q2 = &self.lanes[self.topo.lane_base[l] as usize + k2];
                // Insertion index keeps the queue ordered front (largest position) to back.
                let ins = q2.iter().position(|&x| self.vehs[x as usize].pos <= f.pos).unwrap_or(q2.len());
                let lead_ok = ins == 0 || {
                    let a = &self.vehs[q2[ins - 1] as usize];
                    a.pos - a.drv.len - f.pos >= LC_GAP_M
                };
                let back_ok = ins == q2.len() || {
                    let c = &self.vehs[q2[ins] as usize];
                    f.pos - f.drv.len - c.pos >= LC_GAP_M
                };
                let dwelling_ahead = ins > 0 && self.vehs[q2[ins - 1] as usize].dwell_left > 0.0;
                if lead_ok && back_ok && !dwelling_ahead {
                    moves.push((fid, l, b.lane as usize, k2, ins));
                    break;
                }
            }
        }
        for (fid, l, from, to, ins) in moves {
            let qf = self.topo.lane_base[l] as usize + from;
            if let Some(p) = self.lanes[qf].iter().position(|&x| x == fid) {
                self.lanes[qf].remove(p);
                let qt = self.topo.lane_base[l] as usize + to;
                let ins = ins.min(self.lanes[qt].len());
                self.lanes[qt].insert(ins, fid);
                self.vehs[fid as usize].lane = to as u8;
            }
        }
    }

    // ------------------------------------------------------------------ replanning after interventions

    pub(super) fn replan_bike(&mut self, vid: u32) -> bool {
        let (l, dest) = {
            let v = &self.vehs[vid as usize];
            (v.link, v.dest)
        };
        self.bike_router.ensure_m(dest, &self.topo, self.eff.bike_modal(), &self.eff.bike_link_cost);
        let table = self.bike_router.table(dest);
        let mut route = Vec::new();
        if route::walk_m(table, &self.topo, self.eff.bike_modal(), l, dest, NO_NOISE, &mut route) {
            let v = &mut self.vehs[vid as usize];
            v.route = route;
            v.ridx = 0;
            true
        } else {
            self.drop_vehicle_on_link(vid);
            false
        }
    }

    /// Remove a vehicle waiting in a lane (not counted as a gridlock removal).
    pub(super) fn drop_vehicle_on_link(&mut self, vid: u32) {
        let (l, lane) = {
            let v = &self.vehs[vid as usize];
            (v.link as usize, v.lane as usize)
        };
        let qi = self.topo.qidx(l, lane);
        if let Some(p) = self.lanes[qi].iter().position(|&x| x == vid) {
            self.lanes[qi].remove(p);
        }
        self.remove_vehicle(vid);
    }

    /// After a scenario change: a bus whose remaining route has become impossible (turn ban or one-way closure on it) is
    /// dropped and counted. Modal filters do not affect buses (ASSUMPTION: buses pass filters).
    pub(super) fn recheck_buses(&mut self) {
        for vid in 0..self.vehs.len() as u32 {
            let v = &self.vehs[vid as usize];
            if !v.alive || v.kind != KIND_BUS {
                continue;
            }
            let rt = &self.buses[v.bus_route as usize];
            let cur = if v.in_transit { v.ridx.saturating_sub(1) } else { v.ridx } as usize;
            let in_transit = v.in_transit;
            let ok = rt.links[cur..].windows(2).all(|w| self.topo.find_mv(w[0], w[1]).map_or(false, |m| self.eff.bus_mv_ok[m as usize]));
            let node = self.topo.link_to[rt.links[cur] as usize] as usize;
            if !ok {
                if in_transit {
                    if let Some(p) = self.transit[node].iter().position(|t| t.veh == vid) {
                        let t = self.transit[node].remove(p);
                        let qi = self.topo.qidx(t.to_link as usize, t.lane as usize);
                        self.reserved[qi] = (self.reserved[qi] - (BUS_LEN + 2.0)).max(0.0);
                    }
                    self.remove_vehicle(vid);
                } else {
                    self.drop_vehicle_on_link(vid);
                }
                self.bus_blocked += 1;
            }
        }
    }

    // ------------------------------------------------------------------ safety hooks

    /// A vehicle starts crossing a node on movement `mv`: score encounters with crosswalk users and with cyclists.
    pub(super) fn on_node_cross(&mut self, vid: u32, node: usize, mv: u32, t_total: f32, circle: bool, speed: f32) {
        let kind = self.vehs[vid as usize].kind;
        if self.ped_on && kind != KIND_BIKE {
            let a = self.topo.mvs[mv as usize].a;
            let b = self.topo.mvs[mv as usize].b;
            let (xa, xb) = (self.world.link_xw_in[a as usize], self.world.link_xw_out[b as usize]);
            let uid = self.vehs[vid as usize].uid;
            for x in [xa, xb] {
                if x != NONE_UID {
                    self.xw_vehicle_pass(x, uid, speed);
                }
            }
        }
        if self.bike_on {
            let now = self.t;
            let is_bike = kind == KIND_BIKE;
            {
                let log = &mut self.node_log[node];
                log.retain(|e| now - e.t_out < PET_ENCOUNTER_S as f64);
                for e in log.iter() {
                    if e.bike != is_bike && self.topo.conflicts(mv, e.mv, circle) {
                        // PET: time between the first user leaving the conflict area and the second arriving [Mahmud2017];
                        // the speed that matters is the motor vehicle's, whichever crossed second.
                        let pet = (now - e.t_out).max(0.0) as f32;
                        self.vuln.bike_encounter(pet, if is_bike { e.speed } else { speed });
                    }
                }
                log.push(LogEnt { t_out: now + t_total as f64, mv, bike: is_bike, speed });
            }
        }
    }

    // ------------------------------------------------------------------ metrics

    pub(super) fn fill_mode_metrics(&self, m: &mut Metrics) {
        let st = &self.st;
        let (mut cars, mut buses) = (0u64, 0u64);
        for v in self.vehs.iter().filter(|v| v.alive) {
            match v.kind {
                KIND_CAR => cars += 1,
                KIND_BUS => buses += 1,
                _ => {}
            }
        }
        m.modes.car = CarMode {
            in_network: cars,
            completed_trips: st.car_completed,
            mean_trip_time: if st.car_completed > 0 { st.car_tt_sum / st.car_completed as f64 } else { 0.0 },
        };
        m.modes.bus = BusMode {
            in_network: buses,
            completed_runs: st.bus_completed,
            mean_run_time: if st.bus_completed > 0 { st.bus_tt_sum / st.bus_completed as f64 } else { 0.0 },
            mean_speed: if st.bus_tt_sum > 0.0 { st.bus_dist_sum / st.bus_tt_sum } else { 0.0 },
            bus_runs_blocked: self.bus_blocked,
        };
        m.modes.bicycle = BikeMode {
            in_network: self.n_bike as u64,
            completed_trips: st.bike_completed,
            mean_trip_time: if st.bike_completed > 0 { st.bike_tt_sum / st.bike_completed as f64 } else { 0.0 },
        };
        m.modes.pedestrian = self.world.mode_metrics();
        let v = &self.vuln;
        m.vulnerable = Vulnerable {
            ped_conflicts: v.ped_conf,
            bike_conflicts: v.bike_conf,
            close_passes: v.close_passes,
            ped_injury_risk_index: if v.ped_enc > 0 { v.ped_risk_sum / v.ped_enc as f64 } else { 0.0 },
            bike_injury_risk_index: if v.bike_enc > 0 { v.bike_risk_sum / v.bike_enc as f64 } else { 0.0 },
            mean_vehicle_speed_at_ped_encounter: if v.ped_enc > 0 { v.ped_speed_sum / v.ped_enc as f64 } else { 0.0 },
        };
    }
}
