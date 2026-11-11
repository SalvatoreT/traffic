//! Effective network state: baseline network + interventions. Rebuilt on `setInterventions`.

use crate::model::{Control, Intervention, Network};
use crate::params::*;
use crate::topo::*;

pub struct SigPlan {
    pub cycle: f32,
    pub offset: f32,
    /// (start, green) per phase within the cycle.
    pub phases: Vec<(f32, f32)>,
    pub links: Vec<Vec<u32>>,
    pub always_green: bool,
    /// Critical flow ratio sum used by the plan (Webster), for diagnostics.
    pub ysum: f32,
}

pub struct Eff {
    pub closed: Vec<bool>,
    pub limit: Vec<f32>,
    pub humps: Vec<Vec<f32>>,
    pub ctrl: Vec<Control>,
    pub node_filter: Vec<bool>,
    pub mv_ok: Vec<bool>,
    pub mv_cost: Vec<f32>,
    pub mv_vturn: Vec<f32>,
    pub mv_ff: Vec<f32>,
    pub minor: Vec<bool>,
    pub must_stop: Vec<bool>,
    pub plevel: Vec<u8>,
    /// Circle node whose circulating roadway is made of links (ring of circle nodes) rather than the node itself.
    pub ring_node: Vec<bool>,
    pub ff: Vec<f32>,
    /// Perceived-cost weight per link in route choice (street-hierarchy preference; 1.0 on arterials).
    pub route_w: Vec<f32>,
    pub sig: Vec<Option<SigPlan>>,
    pub cycle_override: Vec<Option<f32>>,
}

impl Eff {
    pub fn derive(topo: &Topo, net: &Network, ivs: &[Intervention]) -> Eff {
        let nl = topo.n_links;
        let nn = topo.n_nodes;
        let mut closed = vec![false; nl];
        let mut limit: Vec<f32> = net.links.iter().map(|l| l.speed_limit.max(1.0) as f32).collect();
        let mut humps: Vec<Vec<f32>> = net
            .links
            .iter()
            .map(|l| l.humps.iter().map(|&h| (h as f32).clamp(0.0, topo.length[l.id as usize])).collect())
            .collect();
        let mut ctrl: Vec<Control> = net.nodes.iter().map(|n| n.control).collect();
        let mut node_filter = vec![false; nn];
        let mut banned: Vec<(u32, u32)> = Vec::new();
        let mut cycle_override: Vec<Option<f32>> = vec![None; nn];
        let valid_l = |l: Option<u32>| l.filter(|&x| (x as usize) < nl);
        let valid_n = |n: Option<u32>| n.filter(|&x| (x as usize) < nn);
        for iv in ivs {
            match iv.ty.as_str() {
                "modal_filter" => {
                    if let Some(l) = valid_l(iv.link) {
                        closed[l as usize] = true;
                        if let Some(r) = net.links[l as usize].reverse {
                            closed[r as usize] = true;
                        }
                    } else if let Some(n) = valid_n(iv.node) {
                        node_filter[n as usize] = true;
                    }
                }
                "one_way" => {
                    if let Some(l) = valid_l(iv.link) {
                        if let Some(r) = net.links[l as usize].reverse {
                            closed[r as usize] = true;
                        }
                    }
                }
                "speed_limit" => {
                    if let (Some(l), Some(s)) = (valid_l(iv.link), iv.speed) {
                        if s > 0.5 {
                            limit[l as usize] = s as f32;
                            if let Some(r) = net.links[l as usize].reverse {
                                limit[r as usize] = s as f32;
                            }
                        }
                    }
                }
                "speed_hump" => {
                    if let (Some(l), Some(p)) = (valid_l(iv.link), iv.position) {
                        let len = topo.length[l as usize];
                        let p = (p as f32).clamp(0.0, len);
                        humps[l as usize].push(p);
                        // A physical hump slows both directions (design decision; reverse measured from its own start).
                        if let Some(r) = net.links[l as usize].reverse {
                            humps[r as usize].push(topo.length[r as usize] - p.min(topo.length[r as usize]));
                        }
                    }
                }
                "traffic_circle" => {
                    if let Some(n) = valid_n(iv.node) {
                        ctrl[n as usize] = Control::TrafficCircle;
                    }
                }
                "control" => {
                    if let (Some(n), Some(c)) = (valid_n(iv.node), iv.control) {
                        ctrl[n as usize] = c;
                    }
                }
                "signal_timing" => {
                    if let (Some(n), Some(c)) = (valid_n(iv.node), iv.cycle) {
                        cycle_override[n as usize] = Some((c as f32).clamp(30.0, 180.0));
                    }
                }
                "turn_ban" => {
                    if let (Some(a), Some(b)) = (valid_l(iv.from_link), valid_l(iv.to_link)) {
                        banned.push((a, b));
                    }
                }
                _ => {}
            }
        }
        for h in humps.iter_mut() {
            h.sort_by(|a, b| a.partial_cmp(b).unwrap());
            h.dedup_by(|a, b| (*a - *b).abs() < 1.0);
        }

        // Stop control classification.
        let mut minor = vec![false; nl];
        let mut must_stop = vec![false; nl];
        let mut plevel = vec![0u8; nl];
        let mut ring_node = vec![false; nn];
        for n in 0..nn {
            let ins = &topo.ins[n];
            match ctrl[n] {
                Control::AllWayStop => {
                    for &l in ins {
                        must_stop[l as usize] = true;
                    }
                }
                Control::TwoWayStop => {
                    let flagged: Vec<u32> =
                        ins.iter().copied().filter(|&l| net.links[l as usize].stop_at_end).collect();
                    if !flagged.is_empty() {
                        for l in flagged {
                            minor[l as usize] = true;
                        }
                    } else if !ins.is_empty() {
                        // ASSUMPTION: no stop sign flagged -> lowest-class approaches are the minor ones.
                        let maxr = ins.iter().map(|&l| topo.rank[l as usize]).max().unwrap();
                        let minr = ins.iter().map(|&l| topo.rank[l as usize]).min().unwrap();
                        if maxr > minr {
                            for &l in ins {
                                if topo.rank[l as usize] == maxr {
                                    minor[l as usize] = true;
                                }
                            }
                        }
                    }
                    for &l in ins {
                        must_stop[l as usize] = minor[l as usize];
                        plevel[l as usize] = if minor[l as usize] { 10 } else { 0 };
                    }
                }
                Control::Uncontrolled => {
                    for &l in ins {
                        plevel[l as usize] = topo.rank[l as usize];
                    }
                }
                Control::TrafficCircle => {
                    // Roundabouts imported as a ring of circle nodes: ring links (both ends are circle nodes)
                    // have priority over entering links. A single circle node has no ring links, so all
                    // approaches share priority and the circulating-arc rule alone applies.
                    for &l in ins {
                        let ring = ctrl[topo.link_from[l as usize] as usize] == Control::TrafficCircle;
                        ring_node[n] |= ring;
                        plevel[l as usize] = if ring { 0 } else { 10 };
                    }
                }
                _ => {}
            }
        }

        let ff: Vec<f32> = (0..nl)
            .map(|l| topo.length[l] / limit[l] + HUMP_FF_PENALTY * humps[l].len() as f32)
            .collect();

        let nm = topo.mvs.len();
        let mut mv_ok = vec![true; nm];
        let mut mv_cost = vec![0.0; nm];
        let mut mv_vturn = vec![0.0; nm];
        let mut mv_ff = vec![0.0; nm];
        for (i, m) in topo.mvs.iter().enumerate() {
            let n = m.node as usize;
            let dead_end = topo.lm_cnt[m.a as usize] == 1;
            let banned_pair = banned.iter().any(|&(a, b)| a == m.a && b == m.b);
            mv_ok[i] = !(banned_pair
                || node_filter[n]
                || closed[m.b as usize]
                || (m.kind == K_UTURN && !dead_end));
            let vlim = limit[m.a as usize].min(limit[m.b as usize]);
            let vt = if ctrl[n] == Control::TrafficCircle {
                V_CIRCLE.min(vlim)
            } else {
                match m.kind {
                    K_THROUGH => vlim * 1.4, // no node cap beyond the max compliance factor
                    K_RIGHT => V_RIGHT.min(vlim),
                    K_LEFT => V_LEFT.min(vlim),
                    _ => V_UTURN.min(vlim),
                }
            };
            mv_vturn[i] = vt;
            let mut len = m.len;
            if ctrl[n] == Control::TrafficCircle {
                // Arc around the circle (counter-clockwise) from approach to exit.
                let a_in = (m.h_in + std::f64::consts::PI).rem_euclid(std::f64::consts::TAU);
                let a_out = m.h_out.rem_euclid(std::f64::consts::TAU);
                let arc = (a_out - a_in).rem_euclid(std::f64::consts::TAU);
                len = (R_CIRCLE * arc + 4.0).max(10.0) as f32;
            }
            mv_ff[i] = len / vt.min(vlim);
            let mut c = match m.kind {
                K_RIGHT => TURN_RIGHT_S,
                K_LEFT => TURN_LEFT_S,
                K_UTURN => TURN_U_S,
                _ => 0.0,
            };
            c += match ctrl[n] {
                Control::Signal => DELAY_SIGNAL_S,
                Control::AllWayStop => DELAY_ALLWAY_S,
                Control::TwoWayStop => {
                    if minor[m.a as usize] {
                        DELAY_MINOR_S
                    } else {
                        0.0
                    }
                }
                Control::TrafficCircle => DELAY_CIRCLE_S,
                Control::Uncontrolled => 0.0,
            };
            mv_cost[i] = c + mv_ff[i];
        }
        Eff {
            closed,
            limit,
            humps,
            ctrl,
            node_filter,
            mv_ok,
            mv_cost,
            mv_vturn,
            mv_ff,
            minor,
            must_stop,
            plevel,
            ring_node,
            ff,
            route_w: net.links.iter().map(|l| class_weight(l.class, LOCAL_COST_FACTOR)).collect(),
            sig: (0..nn).map(|_| None).collect(),
            cycle_override,
        }
    }

    /// Build fixed-time plans for signalized nodes. `est_flow[l]` is the estimated approach flow (veh/h).
    pub fn plan_signals(&mut self, topo: &Topo, net: &Network, est_flow: &[f32]) {
        let nn = topo.n_nodes;
        for n in 0..nn {
            self.sig[n] = None;
        }
        let is_sig = |s: &Eff, n: usize| s.ctrl[n] == Control::Signal;
        let mut members: Vec<Vec<usize>> = vec![Vec::new(); nn];
        for n in 0..nn {
            if is_sig(self, n) {
                members[n].push(n);
            }
        }
        for root in 0..nn {
            if members[root].is_empty() {
                continue;
            }
            let nodes = members[root].clone();
            let ins: Vec<u32> = nodes
                .iter()
                .flat_map(|&n| topo.ins[n].iter().copied())
                .filter(|&l| !self.closed[l as usize])
                .collect();
            if ins.is_empty() {
                continue;
            }
            let heading = |l: u32| -> f64 {
                if topo.lm_cnt[l as usize] > 0 {
                    topo.mvs[topo.lm_start[l as usize] as usize].h_in
                } else {
                    topo.link_point(l as usize, topo.length[l as usize] as f64, 0.0).1
                }
            };
            let ref_l = *ins.iter().min_by_key(|&&l| (topo.rank[l as usize], l)).unwrap();
            let hr = heading(ref_l);
            let mut groups: [Vec<u32>; 2] = [Vec::new(), Vec::new()];
            for &l in &ins {
                let d = norm_angle(heading(l) - hr).abs();
                let d = if d > std::f64::consts::FRAC_PI_2 { std::f64::consts::PI - d } else { d };
                groups[if d < std::f64::consts::FRAC_PI_4 { 0 } else { 1 }].push(l);
            }
            let groups: Vec<Vec<u32>> = groups.into_iter().filter(|g| !g.is_empty()).collect();
            let split = |g: &Vec<Vec<u32>>, n: usize| -> Vec<Vec<u32>> {
                g.iter().map(|x| x.iter().copied().filter(|&l| topo.link_to[l as usize] as usize == n).collect()).collect()
            };
            if groups.len() < 2 {
                for &n in &nodes {
                    self.sig[n] = Some(SigPlan { cycle: 60.0, offset: 0.0, phases: vec![(0.0, 60.0)], links: split(&groups, n), always_green: true, ysum: 0.0 });
                }
                continue;
            }
            let ys: Vec<f32> = groups
                .iter()
                .map(|g| {
                    g.iter()
                        .map(|&l| est_flow[l as usize] / (SAT_FLOW * net.links[l as usize].lanes.max(1) as f32))
                        .fold(0.0, f32::max)
                })
                .collect();
            let np = groups.len() as f32;
            let lost = np * (YELLOW + ALL_RED); // L = sum of intergreens [Webster1958]
            let ysum: f32 = ys.iter().sum();
            let cycle = if let Some(c) = nodes.iter().find_map(|&n| self.cycle_override[n]) {
                c
            } else {
                let c = if ysum < 0.9 { (1.5 * lost + 5.0) / (1.0 - ysum) } else { CYCLE_MAX }; // [Webster1958]
                ((c.clamp(CYCLE_MIN, CYCLE_MAX) / 5.0).ceil() * 5.0).min(CYCLE_MAX.max(CYCLE_MIN))
            };
            let avail = (cycle - lost).max(np * 5.0);
            let mut green: Vec<f32> = if ysum > 1e-6 {
                ys.iter().map(|&y| avail * y / ysum).collect()
            } else {
                vec![avail / np; groups.len()]
            };
            let minimum = MIN_GREEN.min(avail / np);
            // Enforce the minimum green and re-share the remainder.
            for _ in 0..2 {
                let low: f32 = green.iter().filter(|&&g| g < minimum).count() as f32;
                if low == 0.0 {
                    break;
                }
                let fixed: f32 = low * minimum;
                let rest: f32 = green.iter().filter(|&&g| g >= minimum).sum();
                for g in green.iter_mut() {
                    *g = if *g < minimum { minimum } else if rest > 0.0 { *g * (avail - fixed) / rest } else { *g };
                }
            }
            let mut phases = Vec::new();
            let mut t = 0.0;
            for g in &green {
                phases.push((t, *g));
                t += g + YELLOW + ALL_RED;
            }
            let cyc = t.max(1.0);
            let offset = ((root as f32 * 37.0) % 100.0) / 100.0 * cyc;
            for &n in &nodes {
                self.sig[n] = Some(SigPlan { cycle: cyc, offset, phases: phases.clone(), links: split(&groups, n), always_green: false, ysum });
            }
        }
    }
}

/// Signal state code (1 green, 2 yellow, 3 red) of a phase at time `t`.
pub fn phase_state(p: &SigPlan, phase: usize, t: f64) -> u8 {
    if p.always_green {
        return 1;
    }
    let tc = ((t as f32) + p.offset).rem_euclid(p.cycle);
    let (start, g) = p.phases[phase];
    let rel = (tc - start).rem_euclid(p.cycle);
    if rel < g {
        1
    } else if rel < g + YELLOW {
        2
    } else {
        3
    }
}

/// Route-choice weight of a link class: residential and service streets are perceived as `local_factor` times
/// their travel time [ASSUMPTION], everything else as 1.
pub fn class_weight(class: crate::model::RoadClass, local_factor: f32) -> f32 {
    match class {
        crate::model::RoadClass::Residential | crate::model::RoadClass::Service => local_factor,
        _ => 1.0,
    }
}

impl Eff {
    /// Override the perceived-cost multiplier for residential/service links.
    pub fn set_local_factor(&mut self, net: &Network, f: f32) {
        self.route_w = net.links.iter().map(|l| class_weight(l.class, f)).collect();
    }
}

/// Seconds since the green of a phase ended (0 during green).
pub fn phase_since_green(p: &SigPlan, phase: usize, t: f64) -> f32 {
    if p.always_green {
        return 0.0;
    }
    let tc = ((t as f32) + p.offset).rem_euclid(p.cycle);
    let (start, g) = p.phases[phase];
    ((tc - start).rem_euclid(p.cycle) - g).max(0.0)
}
