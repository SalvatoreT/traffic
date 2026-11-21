//! Lane changes along a link (calibration round 32). Lane choice at a link's entry (`pick_lane`) stays; along the link a car may move to
//! an adjacent lane by MOBIL [Kesting2007]: the change must be safe for the new follower (its acceleration after the change at least
//! -`LC_B_SAFE`, eq. 4) and worth it, ã_c - a_c + p (ã_n - a_n + ã_o - a_o) > `LC_THRESHOLD` (eq. 5), with accelerations from the
//! car-following model. A driver whose lane cannot serve its next movement (a left turn into a pocket or a marked left lane, a fork, the
//! turn side it sorts for) changes toward a lane that can whenever the safety criterion holds: the forced-change bias of [Kesting2007] is
//! taken larger than any acceleration difference (ASSUMPTION: the source gives no value). A missing leader counts as a standing vehicle at
//! the stop line for both lanes compared (ASSUMPTION), so two empty lanes give no incentive. The change is instantaneous.

use super::*;

struct LaneBand {
    main: std::ops::Range<usize>,
    pocket: Option<usize>,
}

impl LaneBand {
    fn contains(&self, lane: usize) -> bool {
        self.main.contains(&lane) || self.pocket == Some(lane)
    }

    // Left-turn pockets connect to main lane 0.
    fn distance(&self, lane: usize) -> usize {
        let to_main = if self.main.is_empty() {
            usize::MAX
        } else {
            lane.abs_diff(lane.clamp(self.main.start, self.main.end - 1))
        };
        if self.pocket.is_some() { to_main.min(lane) } else { to_main }
    }
}

impl Simulation {
    pub(super) fn change_lanes(&mut self, occupied: &[usize]) {
        if self.cfg.lane_changes == Some(false) || self.cfg.junction_recovery == JunctionRecovery::Historical || self.step_n % LC_EVERY_STEPS != 0 {
            return;
        }
        let mut ids = std::mem::take(&mut self.scratch);
        for &l in occupied {
            let nl = self.topo.nlanes(l);
            if nl < 2 {
                continue;
            }
            for k in 0..nl {
                ids.clear();
                ids.extend(self.lanes[self.topo.qidx(l, k)].iter().copied());
                for &vid in ids.iter() {
                    self.try_change(l, vid);
                }
            }
        }
        self.scratch = ids;
    }

    /// IDM acceleration of a car at `pos` with speed `v` behind `leader` (rear position, speed), or behind a standing vehicle at the stop line.
    fn lc_acc(&self, l: usize, drv: &Drv, pos: f32, v: f32, leader: Option<(f32, f32)>) -> f32 {
        let v0 = (self.eff.limit[l] * drv.fcomp).max(1.0);
        let (rear, vl) = leader.unwrap_or((self.topo.stop_pos[l] + drv.s0, 0.0));
        let s = rear - pos;
        idm(v, v0, s, v - vl, drv)
    }

    fn rear(&self, id: u32) -> (f32, f32) {
        let v = &self.vehs[id as usize];
        (v.pos - v.drv.len, v.v)
    }

    /// Lanes of link `l` that serve the car's next movement.
    fn lc_allowed(&self, l: usize, vid: u32) -> LaneBand {
        let veh = &self.vehs[vid as usize];
        let main = self.topo.nmain[l];
        let movement = veh.next().and_then(|b| self.topo.find_mv(l as u32, b));
        let here = movement.map(|m| self.topo.mvs[m as usize].kind);
        let pocket = self.pocket_active(l);
        if let Some(m) = movement {
            let (lo, hi) = self.topo.fork_band[m as usize];
            if hi != 255 {
                return LaneBand { main: lo as usize..(hi as usize).min(main), pocket: None };
            }
        }
        if here == Some(K_LEFT) && pocket && self.topo.left_marked[l] {
            return LaneBand { main: 0..0, pocket: Some(main) };
        }
        let kind = self.lane_hint(l as u32, &veh.route[veh.ridx as usize..]);
        let half = (main + 1) / 2;
        let band = match kind {
            Some(K_LEFT) if main >= 2 => 0..half,
            Some(K_RIGHT) if main >= 2 => main - half..main,
            _ => 0..main,
        };
        LaneBand { main: band, pocket: (here == Some(K_LEFT) && pocket).then_some(main) }
    }

    fn try_change(&mut self, l: usize, vid: u32) {
        let (k, pos, v, drv, t_ok, car) = {
            let veh = &self.vehs[vid as usize];
            (veh.lane as usize, veh.pos, veh.v, veh.drv, self.t - veh.lc_t >= LC_MIN_INTERVAL_S, veh.kind == KIND_CAR && !veh.frozen && veh.alive && !veh.in_transit)
        };
        if !car || !t_ok || self.vehs[vid as usize].next().is_none() {
            return;
        }
        let stop = self.topo.stop_pos[l];
        if pos - drv.len < self.topo.emerge_pos[l] + 2.0 || pos > stop - 1.0 {
            return;
        }
        let qi = self.topo.qidx(l, k);
        let Some(i) = self.lanes[qi].iter().position(|&x| x == vid) else { return };
        if i == 0 && stop - pos < DECISION_HORIZON {
            return;
        }
        let main = self.topo.nmain[l];
        let allowed = self.lc_allowed(l, vid);
        let ok_here = allowed.contains(k);
        let pocket_lane = if self.topo.pocket[l] { Some(main) } else { None };
        // Candidate lanes: adjacent ones (the pocket lies beside lane 0).
        let adj = |a: usize, b: usize| -> bool {
            match pocket_lane {
                Some(p) if a == p || b == p => (a == p && b == 0) || (b == p && a == 0),
                _ => a.abs_diff(b) == 1,
            }
        };
        let nl = self.topo.nlanes(l);
        let mut cands = (0..nl).filter_map(|t| {
            if t == k || !adj(k, t) {
                return None;
            }
            let into_pocket = Some(t) == pocket_lane;
            if into_pocket {
                if !allowed.contains(t) {
                    return None;
                }
                if !self.topo.left_marked[l] && (self.lanes[self.topo.qidx(l, t)].len() >= POCKET_VEH || pos < stop - POCKET_LEN - 2.0) {
                    return None;
                }
                Some((t, true))
            } else if !ok_here {
                // Forced: move toward the nearest lane that serves the next movement.
                (Some(k) == pocket_lane || allowed.distance(t) < allowed.distance(k)).then_some((t, true))
            } else {
                allowed.contains(t).then_some((t, false))
            }
        }).peekable();
        if cands.peek().is_none() {
            return;
        }
        let lead_cur = if i > 0 { Some(self.rear(self.lanes[qi][i - 1])) } else { None };
        let a_c = self.lc_acc(l, &drv, pos, v, lead_cur);
        let old_f = self.lanes[qi].get(i + 1).copied();
        let a_o_gain = match old_f {
            Some(o) => {
                let ov = &self.vehs[o as usize];
                let (od, opos, ovv) = (ov.drv, ov.pos, ov.v);
                self.lc_acc(l, &od, opos, ovv, lead_cur) - self.lc_acc(l, &od, opos, ovv, Some((pos - drv.len, v)))
            }
            None => 0.0,
        };
        let mut best: Option<(f32, usize, usize)> = None;
        for (t, forced) in cands {
            let tq = self.topo.qidx(l, t);
            let q = &self.lanes[tq];
            let j = q.partition_point(|&x| self.vehs[x as usize].pos > pos);
            let lead = if j > 0 { Some(self.rear(q[j - 1])) } else { None };
            if let Some((lr, _)) = lead {
                if lr - pos < LC_MIN_GAP_M {
                    continue;
                }
            }
            let fol = q.get(j).copied();
            let mut n_gain = 0.0;
            if let Some(f) = fol {
                let fv = &self.vehs[f as usize];
                let (fd, fpos, fvv) = (fv.drv, fv.pos, fv.v);
                if pos - drv.len - fpos < LC_MIN_GAP_M {
                    continue;
                }
                let a_n_new = self.lc_acc(l, &fd, fpos, fvv, Some((pos - drv.len, v)));
                if a_n_new < -LC_B_SAFE {
                    continue;
                }
                n_gain = a_n_new - self.lc_acc(l, &fd, fpos, fvv, lead);
            }
            let a_c_new = self.lc_acc(l, &drv, pos, v, lead);
            let gain = a_c_new - a_c + LC_POLITENESS * (n_gain + a_o_gain);
            let score = if forced {
                f32::INFINITY
            } else if gain > LC_THRESHOLD && a_c_new > -LC_B_SAFE {
                gain
            } else {
                continue;
            };
            if best.map_or(true, |(s, _, _)| score > s) {
                best = Some((score, t, j));
            }
        }
        let Some((_, t, j)) = best else { return };
        self.lanes[qi].remove(i);
        let tq = self.topo.qidx(l, t);
        self.lanes[tq].insert(j, vid);
        let now = self.t;
        let veh = &mut self.vehs[vid as usize];
        veh.lane = t as u8;
        veh.lc_t = now;
        if j == 0 {
            veh.go = stop - pos > DECISION_HORIZON;
            veh.stop_t = 0.0;
            veh.wait_t = 0.0;
        }
    }
}
