//! Bicycles and the safety surrogates (change multimodal-agents, decisions D3, D5).

use super::*;

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
    /// Cyclist encounters at conflict points that fall inside the supported crash geometry, with their closing-speed severity.
    pub bike_sup: u64,
    pub bike_risk_sum: f64,
    /// Cyclist encounters whose geometry the injury source does not cover: node conflicts with near-parallel paths.
    pub bike_unsup_node: u64,
    /// Passes of a cyclist on a shared link: unsupported geometry, so observed speeds only.
    pub pass_n: u64,
    pub pass_speed_sum: f64,
}

/// Closing speed (m/s) of two road users with speeds `v1`, `v2` along math headings `h1`, `h2`: the magnitude of the difference of their
/// velocity vectors. [Lubbe2022] defines closing speed as the relative speed between the two crash partners; reading that as the
/// vector difference is an ASSUMPTION (full text not accessible when written).
pub fn closing_speed(v1: f32, h1: f64, v2: f32, h2: f64) -> f32 {
    let dx = v1 as f64 * h1.cos() - v2 as f64 * h2.cos();
    let dy = v1 as f64 * h1.sin() - v2 as f64 * h2.sin();
    dx.hypot(dy) as f32
}

/// Smallest angle (rad) between the two paths for a node encounter to count as inside the supported geometry. ASSUMPTION: [Lubbe2022] covers
/// cyclists impacting the front of a car; near-parallel paths (merges, same-direction turns) are not established as that geometry.
/// Same value as the turn-class cutoff in `topo` (30 degrees).
pub const SUPPORTED_MIN_ANGLE_RAD: f64 = 0.52;

/// Direction of travel through a node on movement `mv`: the circular mean of its entry and exit headings (ASSUMPTION; a U-turn uses the entry heading).
pub fn mv_heading(topo: &Topo, mv: u32) -> f64 {
    let m = &topo.mvs[mv as usize];
    let (x, y) = (m.h_in.cos() + m.h_out.cos(), m.h_in.sin() + m.h_out.sin());
    if x.hypot(y) < 1e-6 { m.h_in } else { y.atan2(x) }
}

/// Smallest absolute angle between two math headings.
pub fn heading_angle(h1: f64, h2: f64) -> f64 {
    let d = (h1 - h2).rem_euclid(std::f64::consts::TAU);
    d.min(std::f64::consts::TAU - d)
}

impl Vuln {
    /// The reported safety output: each mode's conditional severity over supported encounters, with the counts behind it.
    pub fn summary(&self) -> Vulnerable {
        let v = self;
        let mean = |sum: f64, n: u64| if n > 0 { Some(sum / n as f64) } else { None };
        let ped_n = v.ped_enc;
        let bike_unsup = v.bike_unsup_node + v.pass_n;
        Vulnerable {
            safety_version: SAFETY_VERSION,
            ped_conflicts: v.ped_conf,
            bike_conflicts: v.bike_conf,
            close_passes: v.close_passes,
            pedestrian: Severity {
                endpoint: "AIS4+",
                source: "Tefft2013",
                encounters: ped_n,
                supported: ped_n,
                unsupported: 0,
                mean_severity: mean(v.ped_risk_sum, ped_n),
                unavailable: if ped_n == 0 { Some("no encounters") } else { None },
            },
            cyclist: CyclistSeverity {
                severity: Severity {
                    endpoint: "MAIS3+F",
                    source: "Lubbe2022",
                    encounters: v.bike_sup + bike_unsup,
                    supported: v.bike_sup,
                    unsupported: bike_unsup,
                    mean_severity: mean(v.bike_risk_sum, v.bike_sup),
                    unavailable: if v.bike_sup > 0 {
                        None
                    } else if bike_unsup > 0 {
                        Some("no encounters in the supported crash geometry")
                    } else {
                        Some("no encounters")
                    },
                },
                passes: Passes { count: v.pass_n, mean_vehicle_speed: mean(v.pass_speed_sum, v.pass_n) },
            },
            mean_vehicle_speed_at_ped_encounter: mean(v.ped_speed_sum, ped_n),
        }
    }

    /// A vehicle passed a crosswalk conflict point with post-encroachment time `pet` (s) while at speed `speed` (m/s).
    /// A vehicle that stopped for the pedestrian passes the crosswalk afterwards: exposure at its (low) speed, never a conflict.
    pub fn ped_exposure(&mut self, speed: f32) {
        self.ped_enc += 1;
        self.ped_risk_sum += injury_risk(speed) as f64;
        self.ped_speed_sum += speed as f64;
    }

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

    /// A node conflict between a car and a cyclist. `closing` is the source-compatible closing speed, or None when the paths' geometry is unsupported.
    pub fn bike_encounter(&mut self, pet: f32, closing: Option<f32>, moving: bool) {
        if pet < PET_ENCOUNTER_S {
            match closing {
                Some(c) => {
                    self.bike_sup += 1;
                    self.bike_risk_sum += injury_risk_bike(c) as f64;
                }
                None => self.bike_unsup_node += 1,
            }
            if pet < PET_THRESHOLD && moving {
                self.bike_conf += 1;
            }
        }
    }

    /// A car passed a cyclist on a shared link at car speed `speed` (m/s). Not a frontal-crash geometry: counted, never scored.
    pub fn bike_pass(&mut self, speed: f32, close: bool) {
        self.pass_n += 1;
        self.pass_speed_sum += speed as f64;
        if close {
            self.close_passes += 1;
        }
    }
}

/// Severe-injury risk (0..1) of a pedestrian struck at `v` m/s: piecewise-linear through the points of [Tefft2013] (see
/// `params::TEFFT_AIS4` for the interpolation rules).
pub fn injury_risk(v: f32) -> f32 {
    risk_from_points(&TEFFT_AIS4, v)
}

/// At-least-serious injury risk (0..1) of a cyclist struck at `v` m/s, through the points of [Lubbe2022] (`params::LUBBE_BIKE_MAIS3`).
pub fn injury_risk_bike(v: f32) -> f32 {
    risk_from_points(&LUBBE_BIKE_MAIS3, v)
}

fn risk_from_points(p: &[(f32, f32); 5], v: f32) -> f32 {
    let mph = v * 2.236_936;
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
    /// Distance to a virtual standing obstacle (the stop line of a mid-block crosswalk).
    pub obstacle: Option<f32>,
    /// A cyclist ahead on a shared link that the driver follows: (gap to its rear, its speed).
    pub bike_lead: Option<(f32, f32)>,
    /// Start passing this cyclist (uid), and whether the pass leaves little lateral room.
    pub begin_pass: Option<(u32, bool)>,
    /// The vehicle's front reached the rear of the cyclist it is passing: score the pass (speed difference, speed).
    pub score_pass: Option<(f32, f32)>,
    pub end_pass: bool,
    /// The vehicle is being held by a pedestrian at a mid-block crosswalk.
    pub ped_held: bool,
}

pub(super) struct Ctx<'a> {
    pub topo: &'a Topo,
    pub eff: &'a Eff,
    pub net: &'a Network,
    pub lanes: &'a [VecDeque<u32>],
    pub vehs: &'a [Veh],
    pub world: &'a PedWorld,
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
                    ex.ped_held = true;
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
            for f in self.flows.iter().filter(|f| f.mode == FlowMode::Pedestrian) {
                self.world.register_flow(f.origin, f.dest);
            }
            self.set_yield_probabilities();
        }
    }

    // ------------------------------------------------------------------ mode views

    #[inline]
    pub(super) fn mv_allowed(&self, kind: u8, mv: u32) -> bool {
        match kind {
            KIND_BIKE => self.eff.bike_mv_ok[mv as usize],
            _ => self.eff.mv_ok[mv as usize],
        }
    }

    /// Lane choice on link `l` for an agent of `kind`: cyclists use the link's bicycle queue.
    pub(super) fn pick_lane_for(&self, kind: u8, l: u32, hint: Option<u8>, after: Option<u32>, horizon: f32, x: Cross) -> Option<usize> {
        if kind == KIND_BIKE {
            let k = self.topo.nlanes(l as usize);
            if self.lane_room_ahead(l, k, horizon) >= self.room_need(l as usize) {
                Some(k)
            } else {
                None
            }
        } else {
            self.pick_lane(l, hint, after, horizon, x)
        }
    }

    // ------------------------------------------------------------------ spawning

    pub(super) fn try_spawn_bikes(&mut self) {
        if !self.bike_on {
            return;
        }
        let mut origins = std::mem::take(&mut self.pending_bike_origins);
        origins.sort_unstable();
        for &n in &origins {
            for _ in 0..4 {
                let Some(trip) = self.bike_backlog[n].front() else { break };
                let dest = trip.dest;
                self.bike_router.ensure_m(dest, &self.topo, self.eff.bike_modal(), &self.eff.bike_link_cost);
                let table = self.bike_router.table(dest);
                let mut route = Vec::new();
                let first = route::first_link_m(table, &self.topo, self.eff.bike_modal(), n as u32);
                let ok = first.map_or(false, |b| route::walk_m(table, &self.topo, self.eff.bike_modal(), b, dest, &mut route));
                if !ok {
                    self.bike_backlog[n].pop_front();
                    continue;
                }
                let b = first.unwrap();
                let Some(lane) = self.pick_lane_for(KIND_BIKE, b, None, None, 0.0, NO_CROSS) else { break };
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
        origins.retain(|&n| !self.bike_backlog[n].is_empty());
        self.pending_bike_origins = origins;
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
        if route::walk_m(table, &self.topo, self.eff.bike_modal(), l, dest, &mut route) {
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

    // ------------------------------------------------------------------ safety hooks

    /// A vehicle starts crossing a node on movement `mv`: score encounters with crosswalk users and with cyclists.
    pub(super) fn on_node_cross(&mut self, vid: u32, node: usize, mv: u32, t_total: f32, circle: bool, speed: f32) {
        let kind = self.vehs[vid as usize].kind;
        if self.ped_on && kind != KIND_BIKE {
            let a = self.topo.mvs[mv as usize].a;
            let b = self.topo.mvs[mv as usize].b;
            let (xa, xb) = (self.world.link_xw_in[a as usize], self.world.link_xw_out[b as usize]);
            let uid = self.vehs[vid as usize].uid;
            let held = std::mem::replace(&mut self.vehs[vid as usize].ped_held, false);
            for x in [xa, xb] {
                if x != NONE_UID {
                    self.xw_vehicle_pass(x, uid, speed, held);
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
                        // PET: time between the first user leaving the conflict area and the second arriving [Mahmud2017].
                        let pet = (now - e.t_out).max(0.0) as f32;
                        let h_me = mv_heading(&self.topo, mv);
                        let h_e = mv_heading(&self.topo, e.mv);
                        let closing = (heading_angle(h_me, h_e) >= SUPPORTED_MIN_ANGLE_RAD).then(|| closing_speed(speed, h_me, e.speed, h_e));
                        self.vuln.bike_encounter(pet, closing, (if is_bike { e.speed } else { speed }) >= PET_MOVING_V);
                    }
                }
                log.push(LogEnt { t_out: now + t_total as f64, mv, bike: is_bike, speed });
            }
        }
    }

    // ------------------------------------------------------------------ metrics

    pub(super) fn fill_mode_metrics(&self, m: &mut Metrics) {
        let st = &self.st;
        let cars = self.vehs.iter().filter(|v| v.alive && v.kind == KIND_CAR).count() as u64;
        m.modes.car = CarMode {
            in_network: cars,
            completed_trips: st.car_completed,
            mean_trip_time: if st.car_timed > 0 { st.car_tt_sum / st.car_timed as f64 } else { 0.0 },
        };
        m.modes.bicycle = BikeMode {
            in_network: self.n_bike as u64,
            completed_trips: st.bike_completed,
            mean_trip_time: if st.bike_timed > 0 { st.bike_tt_sum / st.bike_timed as f64 } else { 0.0 },
        };
        m.modes.pedestrian = self.world.mode_metrics();
        m.vulnerable = self.vuln.summary();
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::f64::consts::{FRAC_PI_2, PI};

    #[test]
    fn closing_speed_depends_on_both_velocities() {
        let car = 10.0;
        // Same car speed, cyclist riding the same way at different speeds: relative speed changes.
        let slow = closing_speed(car, 0.0, 2.0, 0.0);
        let fast = closing_speed(car, 0.0, 6.0, 0.0);
        assert!((slow - 8.0).abs() < 1e-5 && (fast - 4.0).abs() < 1e-5);
        // Head-on: speeds add. Perpendicular: root of the sum of squares.
        assert!((closing_speed(car, 0.0, 5.0, PI) - 15.0).abs() < 1e-4);
        assert!((closing_speed(car, 0.0, 5.0, FRAC_PI_2) - 125f32.sqrt()).abs() < 1e-4);
        assert!(injury_risk_bike(closing_speed(car, 0.0, 5.0, PI)) > injury_risk_bike(closing_speed(car, 0.0, 5.0, FRAC_PI_2)));
    }

    #[test]
    fn heading_angle_wraps() {
        assert!((heading_angle(0.1, -0.1) - 0.2).abs() < 1e-12);
        assert!((heading_angle(3.0, -3.0) - (2.0 * PI - 6.0)).abs() < 1e-12);
    }

    #[test]
    fn unsupported_encounters_are_counted_never_scored() {
        let mut v = Vuln::default();
        v.bike_encounter(1.0, None, true);
        v.bike_pass(10.0, true);
        let s = v.summary().cyclist;
        assert_eq!((s.severity.encounters, s.severity.supported, s.severity.unsupported), (2, 0, 2));
        assert_eq!(s.severity.mean_severity, None);
        assert_eq!(s.severity.unavailable, Some("no encounters in the supported crash geometry"));
        assert_eq!(s.passes.count, 1);
        assert_eq!(v.summary().close_passes, 1);
    }

    #[test]
    fn empty_samples_are_unavailable_not_zero() {
        let s = Vuln::default().summary();
        assert_eq!(s.pedestrian.mean_severity, None);
        assert_eq!(s.pedestrian.unavailable, Some("no encounters"));
        assert_eq!(s.cyclist.severity.mean_severity, None);
        assert_eq!(s.cyclist.severity.unavailable, Some("no encounters"));
        assert_eq!(s.mean_vehicle_speed_at_ped_encounter, None);
        assert_eq!(s.safety_version, SAFETY_VERSION);
    }

    #[test]
    fn duplicating_a_sample_doubles_counts_and_keeps_means() {
        let mut once = Vuln::default();
        let mut twice = Vuln::default();
        for (c, p) in [(8.0f32, 3.0f32), (14.0, 9.0), (20.0, 12.0)] {
            once.bike_encounter(1.0, Some(c), true);
            once.ped_encounter(1.0, p);
            for _ in 0..2 {
                twice.bike_encounter(1.0, Some(c), true);
                twice.ped_encounter(1.0, p);
            }
        }
        let (a, b) = (once.summary(), twice.summary());
        assert_eq!(b.cyclist.severity.encounters, 2 * a.cyclist.severity.encounters);
        assert_eq!(b.pedestrian.encounters, 2 * a.pedestrian.encounters);
        assert!((b.cyclist.severity.mean_severity.unwrap() - a.cyclist.severity.mean_severity.unwrap()).abs() < 1e-12);
        assert!((b.pedestrian.mean_severity.unwrap() - a.pedestrian.mean_severity.unwrap()).abs() < 1e-12);
    }

    #[test]
    fn endpoints_stay_separate() {
        let mut v = Vuln::default();
        v.ped_encounter(1.0, 15.0);
        v.bike_encounter(1.0, Some(15.0), true);
        let s = v.summary();
        assert_eq!((s.pedestrian.endpoint, s.cyclist.severity.endpoint), ("AIS4+", "MAIS3+F"));
        assert!(s.pedestrian.mean_severity.unwrap() > s.cyclist.severity.mean_severity.unwrap());
    }
}
