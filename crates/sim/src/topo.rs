//! Static topology derived from the network: link geometry, movements (in-link -> out-link
//! pairs at a node), movement paths and the movement conflict matrices.

use crate::model::{Control, Network, RoadClass};
use crate::params::{FORK_LANES, POCKET_MIN_LINK_M, SHARP_TURN_MAX};
use std::f64::consts::PI;

/// Half-extent of the node area along each link (m): stop line is this far before the node center
/// and vehicles emerge this far after it. ASSUMPTION: typical half-width of a two-lane street junction.
pub const R_NODE: f64 = 6.0;
/// Lateral offset of lane 0 to the right of the link centerline (m). ASSUMPTION (rendering only).
pub const LANE_OFFSET0: f64 = 1.8;
pub const LANE_WIDTH: f64 = 3.2;

pub const K_THROUGH: u8 = 0;
/// Fraction of a movement's path after which a merge onto a multilane exit link no longer conflicts with the other merging movement.
/// ASSUMPTION (the vehicles take different exit lanes; the full block of a single-lane merge ends where the lanes separate).
const MERGE_MULTILANE_POS: f32 = 0.85;
pub const K_LEFT: u8 = 1;
pub const K_RIGHT: u8 = 2;
pub const K_UTURN: u8 = 3;

pub struct LinkGeo {
    pub pts: Vec<[f64; 2]>,
    pub cum: Vec<f64>,
    pub scale: f64, // link.length / geometric length
}

#[derive(Clone, Debug)]
pub struct Mv {
    pub a: u32,
    pub b: u32,
    pub node: u32,
    pub kind: u8,
    pub p0: [f64; 2],
    pub x: [f64; 2],
    pub p1: [f64; 2],
    pub len: f32,
    pub h_in: f64,
    pub h_out: f64,
}

pub struct Topo {
    pub n_nodes: usize,
    pub n_links: usize,
    pub link_from: Vec<u32>,
    pub link_to: Vec<u32>,
    pub length: Vec<f32>,
    pub stop_pos: Vec<f32>,
    pub emerge_pos: Vec<f32>,
    pub geo: Vec<LinkGeo>,
    pub ins: Vec<Vec<u32>>,
    pub outs: Vec<Vec<u32>>,
    pub mvs: Vec<Mv>,
    /// Movements of link `a` are `lm_start[a] .. lm_start[a] + lm_cnt[a]`.
    pub lm_start: Vec<u32>,
    pub lm_cnt: Vec<u32>,
    /// Movements of node `n` are `mbase[n] .. mbase[n] + mcount[n]`.
    pub mbase: Vec<u32>,
    pub mcount: Vec<u32>,
    pub cbase: Vec<usize>,
    /// Symmetric geometric conflict between movements (indexed within a node).
    pub conf_geo: Vec<bool>,
    /// Directional circulating conflict: `[i*cnt+j]` = entering movement i must wait for in-node movement j.
    pub conf_circ: Vec<bool>,
    /// Where conflict (i, j) happens along movement j's path, as a fraction 0..1 (-1: the whole crossing blocks, as for a merge onto
    /// the same exit lane). Parallel to `conf_geo` and `conf_circ`.
    pub conf_pos_geo: Vec<f32>,
    pub conf_pos_circ: Vec<f32>,
    pub preds: Vec<Vec<u32>>,
    pub lane_base: Vec<u32>,
    pub n_lanes: usize,
    /// Through lanes of each link (`Link::lanes`, at least 1). Lane 0 is the innermost (left-most), `nmain-1` the outer (right-most).
    pub nmain: Vec<usize>,
    /// Link ends in a left-turn pocket: one extra lane (index `nmain`) reserved for left-turners, with limited storage.
    pub pocket: Vec<bool>,
    /// Per movement: lanes [lo, hi) a vehicle taking it uses on the approach, set where a link forks into two or more straight-ahead branches (`(0, 255)` elsewhere).
    pub fork_band: Vec<(u8, u8)>,
    pub rank: Vec<u8>,
    pub is_local: Vec<bool>,        // residential/service inside the study area (cut-through domain)
    pub is_res_study: Vec<bool>,    // residential inside the study area (safety domain)
    pub is_arterial: Vec<bool>,
}

/// Math heading (radians, counterclockwise from east) of a compass bearing (degrees clockwise from north).
pub fn bearing_heading(bearing: f64) -> f64 {
    norm_angle((90.0 - bearing).to_radians())
}

pub fn norm_angle(mut a: f64) -> f64 {
    while a > PI {
        a -= 2.0 * PI;
    }
    while a <= -PI {
        a += 2.0 * PI;
    }
    a
}

impl Topo {
    pub fn new(net: &Network) -> Topo {
        let n_nodes = net.nodes.len();
        let n_links = net.links.len();
        let mut length = Vec::with_capacity(n_links);
        let mut geo = Vec::with_capacity(n_links);
        for l in &net.links {
            let mut pts = l.geometry.clone();
            if pts.len() < 2 {
                let a = &net.nodes[l.from as usize];
                let b = &net.nodes[l.to as usize];
                pts = vec![[a.x, a.y], [b.x, b.y]];
            }
            let mut cum = vec![0.0];
            for w in pts.windows(2) {
                let d = ((w[1][0] - w[0][0]).powi(2) + (w[1][1] - w[0][1]).powi(2)).sqrt();
                cum.push(cum.last().unwrap() + d);
            }
            let glen = (*cum.last().unwrap()).max(1e-6);
            let len = if l.length > 1.0 { l.length } else { glen.max(5.0) };
            length.push(len as f32);
            geo.push(LinkGeo { pts, cum, scale: len / glen });
        }
        let mut ins = vec![Vec::new(); n_nodes];
        let mut outs = vec![Vec::new(); n_nodes];
        for l in &net.links {
            outs[l.from as usize].push(l.id);
            ins[l.to as usize].push(l.id);
        }
        let mut stop_pos = Vec::new();
        let mut emerge_pos = Vec::new();
        for l in 0..n_links {
            let sr = (R_NODE as f32).min(0.25 * length[l]);
            stop_pos.push(length[l] - sr);
            emerge_pos.push(sr);
        }
        let mut t = Topo {
            n_nodes,
            n_links,
            link_from: net.links.iter().map(|l| l.from).collect(),
            link_to: net.links.iter().map(|l| l.to).collect(),
            length,
            stop_pos,
            emerge_pos,
            geo,
            ins,
            outs,
            mvs: Vec::new(),
            lm_start: vec![0; n_links],
            lm_cnt: vec![0; n_links],
            mbase: vec![0; n_nodes],
            mcount: vec![0; n_nodes],
            cbase: vec![0; n_nodes],
            conf_geo: Vec::new(),
            conf_circ: Vec::new(),
            conf_pos_geo: Vec::new(),
            conf_pos_circ: Vec::new(),
            preds: vec![Vec::new(); n_links],
            lane_base: Vec::new(),
            n_lanes: 0,
            nmain: net.links.iter().map(|l| l.lanes.max(1) as usize).collect(),
            pocket: vec![false; n_links],
            fork_band: Vec::new(),
            rank: net.links.iter().map(|l| l.class.rank()).collect(),
            is_local: net
                .links
                .iter()
                .map(|l| l.in_study_area && matches!(l.class, RoadClass::Residential | RoadClass::Service))
                .collect(),
            is_res_study: net
                .links
                .iter()
                .map(|l| l.in_study_area && l.class == RoadClass::Residential)
                .collect(),
            is_arterial: net
                .links
                .iter()
                .map(|l| {
                    matches!(
                        l.class,
                        RoadClass::Motorway | RoadClass::Primary | RoadClass::Secondary | RoadClass::Tertiary
                    )
                })
                .collect(),
        };
        t.build_movements(net);
        t.build_pockets(net);
        t.build_forks();
        let mut nl = 0usize;
        for l in 0..n_links {
            t.lane_base.push(nl as u32);
            nl += t.nmain[l] + t.pocket[l] as usize;
        }
        t.n_lanes = nl;
        t
    }

    /// Index into the lane-queue array of lane `k` of link `l`. `k == nlanes(l)` is the link's bicycle queue, stored after all
    /// motor lanes.
    #[inline]
    pub fn qidx(&self, l: usize, k: usize) -> usize {
        if k < self.nmain[l] + self.pocket[l] as usize {
            self.lane_base[l] as usize + k
        } else {
            self.n_lanes + l
        }
    }

    /// Total lanes of link `l` including a left-turn pocket.
    #[inline]
    pub fn nlanes(&self, l: usize) -> usize {
        self.nmain[l] + self.pocket[l] as usize
    }

    /// Left-turn pockets (ASSUMPTION, class rule): approaches of primary/secondary/tertiary links to a signalized node that
    /// offer a left movement and at least one other movement, and are long enough to hold the pocket.
    fn build_pockets(&mut self, net: &Network) {
        for l in 0..self.n_links {
            let link = &net.links[l];
            if !matches!(link.class, RoadClass::Primary | RoadClass::Secondary | RoadClass::Tertiary) {
                continue;
            }
            if net.nodes[link.to as usize].control != Control::Signal || self.length[l] < POCKET_MIN_LINK_M {
                continue;
            }
            let ms = self.lm_start[l] as usize;
            let mc = self.lm_cnt[l] as usize;
            let left = self.mvs[ms..ms + mc].iter().any(|m| m.kind == K_LEFT);
            let other = self.mvs[ms..ms + mc].iter().any(|m| m.kind != K_LEFT && m.kind != K_UTURN);
            self.pocket[l] = left && other;
            // OSM already counts a marked left-turn lane in `lanes`: the pocket takes it (the through lanes stay as tagged).
            if self.pocket[l] && link.left_lanes > 0 && self.nmain[l] > link.left_lanes as usize {
                self.nmain[l] -= 1;
            }
        }
    }

    /// Forks (ASSUMPTION): a multilane link whose end offers two or more straight-ahead branches (a freeway diverge, a Y junction) gives each branch
    /// its own lanes, the leftmost branch the leftmost lanes, in proportion to the branches. Without it a queue for one branch fills every lane and
    /// blocks the other branch's vehicles behind it.
    fn build_forks(&mut self) {
        self.fork_band = vec![(0, 255); self.mvs.len()];
        if !FORK_LANES {
            return;
        }
        for l in 0..self.n_links {
            let lanes = self.nmain[l];
            if lanes < 2 {
                continue;
            }
            let ms = self.lm_start[l] as usize;
            let mc = self.lm_cnt[l] as usize;
            let mut br: Vec<(f64, usize)> = (ms..ms + mc).filter(|&m| self.mvs[m].kind == K_THROUGH).map(|m| (norm_angle(self.mvs[m].h_out - self.mvs[m].h_in), m)).collect();
            let k = br.len();
            if k < 2 {
                continue;
            }
            br.sort_by(|a, b| b.0.partial_cmp(&a.0).unwrap_or(std::cmp::Ordering::Equal));
            for (i, &(_, m)) in br.iter().enumerate() {
                let lo = (i * lanes / k).min(lanes - 1);
                let hi = (((i + 1) * lanes + k - 1) / k).max(lo + 1).min(lanes);
                self.fork_band[m] = (lo as u8, hi as u8);
            }
        }
    }

    /// Point on link `l` at distance `s` (m, link coordinates) offset `off` m to the right. Returns (x, y, heading).
    pub fn link_point(&self, l: usize, s: f64, off: f64) -> ([f64; 2], f64) {
        let g = &self.geo[l];
        let gs = (s / g.scale).clamp(0.0, *g.cum.last().unwrap());
        let mut i = 0;
        while i + 2 < g.pts.len() && g.cum[i + 1] < gs {
            i += 1;
        }
        let p0 = g.pts[i];
        let p1 = g.pts[i + 1];
        let seg = (g.cum[i + 1] - g.cum[i]).max(1e-9);
        let u = ((gs - g.cum[i]) / seg).clamp(0.0, 1.0);
        let dx = p1[0] - p0[0];
        let dy = p1[1] - p0[1];
        let h = dy.atan2(dx);
        let x = p0[0] + dx * u + off * h.sin();
        let y = p0[1] + dy * u - off * h.cos();
        ([x, y], h)
    }

    fn build_movements(&mut self, net: &Network) {
        for n in 0..self.n_nodes {
            self.mbase[n] = self.mvs.len() as u32;
            let ins = self.ins[n].clone();
            let outs = self.outs[n].clone();
            for &a in &ins {
                self.lm_start[a as usize] = self.mvs.len() as u32;
                let (pa, ha) = self.link_point(a as usize, self.stop_pos[a as usize] as f64, LANE_OFFSET0);
                // The street's direction at the node (`Network::leg_bearing`), not the local geometry: a merged staggered junction draws its
                // side-street links along the through street for the first stretch. The corner path below still follows the geometry.
                let h_arrive = bearing_heading(net.leg_bearing(a, false) + 180.0);
                for &b in &outs {
                    let (pb, hb) = self.link_point(b as usize, self.emerge_pos[b as usize] as f64, LANE_OFFSET0);
                    let h_leave = bearing_heading(net.leg_bearing(b, true));
                    let d = norm_angle(h_leave - h_arrive);
                    let (name_a, name_b) = (&net.links[a as usize].name, &net.links[b as usize].name);
                    let sharp = d.abs() <= SHARP_TURN_MAX && !name_a.is_empty() && !name_b.is_empty() && name_a != name_b;
                    let kind = if d.abs() > 2.6 && !sharp {
                        K_UTURN
                    } else if d > 0.52 {
                        K_LEFT
                    } else if d < -0.52 {
                        K_RIGHT
                    } else {
                        K_THROUGH
                    };
                    // Intersection of the in-ray and out-ray gives the corner / Bezier control point.
                    let (cx, cy) = (ha.cos(), ha.sin());
                    let (dx, dy) = (hb.cos(), hb.sin());
                    let det = cx * (-dy) - cy * (-dx);
                    let chord = ((pb[0] - pa[0]).powi(2) + (pb[1] - pa[1]).powi(2)).sqrt();
                    let mut x = [(pa[0] + pb[0]) * 0.5, (pa[1] + pb[1]) * 0.5];
                    if det.abs() > 0.2 {
                        let rx = pb[0] - pa[0];
                        let ry = pb[1] - pa[1];
                        let s = (rx * (-dy) - ry * (-dx)) / det;
                        let t = (cx * ry - cy * rx) / det; // pa + s*c = pb - t*d  (t>0 means before pb)
                        let _ = t;
                        if s.abs() < 3.0 * chord.max(1.0) {
                            x = [pa[0] + s * cx, pa[1] + s * cy];
                        }
                    }
                    let l1 = ((x[0] - pa[0]).powi(2) + (x[1] - pa[1]).powi(2)).sqrt();
                    let l2 = ((pb[0] - x[0]).powi(2) + (pb[1] - x[1]).powi(2)).sqrt();
                    let len = ((2.0 * chord + l1 + l2) / 3.0).max(4.0);
                    self.preds[b as usize].push(self.mvs.len() as u32);
                    self.mvs.push(Mv { a, b, node: n as u32, kind, p0: pa, x, p1: pb, len: len as f32, h_in: h_arrive, h_out: h_leave });
                }
                self.lm_cnt[a as usize] = self.mvs.len() as u32 - self.lm_start[a as usize];
            }
            self.mcount[n] = self.mvs.len() as u32 - self.mbase[n];
        }
        let _ = net;
        // Conflict matrices.
        for n in 0..self.n_nodes {
            let base = self.mbase[n] as usize;
            let cnt = self.mcount[n] as usize;
            self.cbase[n] = self.conf_geo.len();
            let mut geo = vec![false; cnt * cnt];
            let mut circ = vec![false; cnt * cnt];
            let mut pgeo = vec![-1.0f32; cnt * cnt];
            let mut pcirc = vec![-1.0f32; cnt * cnt];
            for i in 0..cnt {
                for j in 0..cnt {
                    if i == j {
                        continue;
                    }
                    let (mi, mj) = (&self.mvs[base + i], &self.mvs[base + j]);
                    if mi.a == mj.a {
                        continue;
                    }
                    geo[i * cnt + j] = geometric_conflict(mi, mj);
                    circ[i * cnt + j] = circle_conflict(mi, mj);
                    if geo[i * cnt + j] {
                        // A merge onto a multilane exit link: the two streams take different exit lanes, so the entering vehicle only keeps a time gap to
                        // the other at the end of its path instead of waiting until the node is empty (single-lane exits keep the full block).
                        pgeo[i * cnt + j] = if mi.b == mj.b && self.nmain[mi.b as usize] >= 2 { MERGE_MULTILANE_POS } else { conflict_pos(mi, mj) };
                    }
                    if circ[i * cnt + j] {
                        pcirc[i * cnt + j] = circle_pos(mi, mj);
                    }
                }
            }
            self.conf_geo.extend(geo);
            self.conf_circ.extend(circ);
            self.conf_pos_geo.extend(pgeo);
            self.conf_pos_circ.extend(pcirc);
        }
    }

    /// Fraction of movement `j`'s path after which it no longer conflicts with movement `i` at its entry (-1: until it leaves the node).
    #[inline]
    pub fn conflict_pos(&self, i: u32, j: u32, circle: bool) -> f32 {
        let n = self.mvs[i as usize].node as usize;
        let cnt = self.mcount[n] as usize;
        let idx = self.cbase[n] + (i - self.mbase[n]) as usize * cnt + (j - self.mbase[n]) as usize;
        if circle {
            self.conf_pos_circ[idx]
        } else {
            self.conf_pos_geo[idx]
        }
    }

    pub fn find_mv(&self, a: u32, b: u32) -> Option<u32> {
        let s = self.lm_start[a as usize];
        (s..s + self.lm_cnt[a as usize]).find(|&m| self.mvs[m as usize].b == b)
    }

    /// Does movement `i` (global index) conflict with in-node movement `j`? `circle` selects the
    /// directional circulating rule.
    #[inline]
    pub fn conflicts(&self, i: u32, j: u32, circle: bool) -> bool {
        let n = self.mvs[i as usize].node as usize;
        let cnt = self.mcount[n] as usize;
        let ii = (i - self.mbase[n]) as usize;
        let jj = (j - self.mbase[n]) as usize;
        let idx = self.cbase[n] + ii * cnt + jj;
        if circle {
            self.conf_circ[idx]
        } else {
            self.conf_geo[idx]
        }
    }
}

fn seg_inter(p: [f64; 2], q: [f64; 2], r: [f64; 2], s: [f64; 2]) -> bool {
    fn orient(a: [f64; 2], b: [f64; 2], c: [f64; 2]) -> f64 {
        (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
    }
    let o1 = orient(p, q, r);
    let o2 = orient(p, q, s);
    let o3 = orient(r, s, p);
    let o4 = orient(r, s, q);
    (o1 * o2 < -1e-9) && (o3 * o4 < -1e-9)
}

fn geometric_conflict(a: &Mv, b: &Mv) -> bool {
    if a.b == b.b {
        return true; // merge onto the same exit link
    }
    // Opposing left turns pass in front of each other without conflict (corner-polyline paths
    // over-estimate this conflict).
    let opposite = norm_angle(b.h_in - a.h_in).abs() > 2.4;
    if a.kind == K_LEFT && b.kind == K_LEFT && opposite {
        return false;
    }
    let sa = [[a.p0, a.x], [a.x, a.p1]];
    let sb = [[b.p0, b.x], [b.x, b.p1]];
    for s1 in &sa {
        for s2 in &sb {
            if seg_inter(s1[0], s1[1], s2[0], s2[1]) {
                return true;
            }
        }
    }
    false
}

/// Counter-clockwise circulation: in-node movement `j` passes the entry of movement `i` if `i`'s
/// approach angle lies inside `j`'s arc. Entering vehicles yield to circulating ones [Rodegerdts2010].
fn circle_conflict(i: &Mv, j: &Mv) -> bool {
    let ang = |h: f64| (h + 2.0 * PI) % (2.0 * PI);
    let ai = ang(i.h_in + PI); // position angle of approach as seen from node center
    let aj = ang(j.h_in + PI);
    let bj = ang(j.h_out);
    let arc = (bj - aj + 2.0 * PI) % (2.0 * PI);
    let arc = if arc < 1e-6 { 2.0 * PI } else { arc };
    let off = (ai - aj + 2.0 * PI) % (2.0 * PI);
    off > 1e-6 && off < arc
}

/// Where path `b` crosses path `a`, as a fraction of `b`'s length; -1 for a merge onto the same exit.
fn conflict_pos(a: &Mv, b: &Mv) -> f32 {
    if a.b == b.b {
        return -1.0;
    }
    let len = |p: [f64; 2], q: [f64; 2]| ((q[0] - p[0]).powi(2) + (q[1] - p[1]).powi(2)).sqrt();
    let sa = [[a.p0, a.x], [a.x, a.p1]];
    let sb = [[b.p0, b.x], [b.x, b.p1]];
    let (l1, l2) = (len(b.p0, b.x), len(b.x, b.p1));
    let tot = (l1 + l2).max(1e-6);
    for s1 in &sa {
        for (k, s2) in sb.iter().enumerate() {
            if seg_inter(s1[0], s1[1], s2[0], s2[1]) {
                // Parameter of the crossing along s2.
                let (d1x, d1y) = (s1[1][0] - s1[0][0], s1[1][1] - s1[0][1]);
                let (d2x, d2y) = (s2[1][0] - s2[0][0], s2[1][1] - s2[0][1]);
                let det = d1x * d2y - d1y * d2x;
                let u = if det.abs() < 1e-9 { 0.5 } else { (((s2[0][0] - s1[0][0]) * d1y - (s2[0][1] - s1[0][1]) * d1x) / det).clamp(0.0, 1.0) };
                let off = if k == 0 { u * l1 } else { l1 + u * l2 };
                return (off / tot) as f32;
            }
        }
    }
    0.5
}

/// Position of entry `i` along circulating movement `j`'s arc, as a fraction.
fn circle_pos(i: &Mv, j: &Mv) -> f32 {
    let ang = |h: f64| (h + 2.0 * PI) % (2.0 * PI);
    let (ai, aj, bj) = (ang(i.h_in + PI), ang(j.h_in + PI), ang(j.h_out));
    let arc = (bj - aj + 2.0 * PI) % (2.0 * PI);
    let arc = if arc < 1e-6 { 2.0 * PI } else { arc };
    let off = (ai - aj + 2.0 * PI) % (2.0 * PI);
    (off / arc) as f32
}
