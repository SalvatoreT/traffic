//! Opt-in request and passage records for the redistribution diagnostic (change explain-traffic-redistribution, decisions D2, D3, D6).
//!
//! With `Config::trace` set, every car request is recorded with a scenario-independent key (source flow index in the demand period and
//! the ordinal of the arrival within that flow), the attributes a pairing must check, its lifecycle, and the cars it put on each link:
//! one event per link exit, the convention of the published link flows. Recording only reads simulation state: it draws no random
//! numbers and changes nothing a run computes, so a run with tracing gives the same results as one without.
//!
//! Exact per-link exit counts are kept for every request. Detailed events are kept for the requests created while fewer than
//! `Config::trace_detail_max` events are stored; a request created later has none, and the export says how many.

use super::*;
use std::collections::HashMap;

/// Version of the exported layout (`Simulation::trace_requests`, `trace_events`, `trace_summary`).
pub const TRACE_SCHEMA: u32 = 1;
/// Default bound on stored detail events. ASSUMPTION: about 1.8 times the 838,000 events of a Rockridge PM hour with its settle interval, so the
/// representative area is never capped; a run that reaches it reports partial coverage.
pub const TRACE_DETAIL_MAX: u64 = 1_500_000;

/// Stratum of a request.
pub const STRAT_REQUESTED: u8 = 0;
pub const STRAT_INITIAL: u8 = 1;

/// State of a request at the time of export; the states partition the requests.
pub const ST_PENDING: u8 = 0;
pub const ST_ACTIVE: u8 = 1;
pub const ST_COMPLETED: u8 = 2;
pub const ST_UNROUTABLE: u8 = 3;
pub const ST_REMOVED: u8 = 4;

/// Values per request in `Simulation::trace_requests`.
pub const REQ_STRIDE: usize = 14;

pub(super) struct TraceReq {
    src: u32,
    ord: u32,
    stratum: u8,
    uid: u32,
    origin: u32,
    dest: u32,
    t_arr: f64,
    attr: u32,
    t_ins: f64,
    t_end: f64,
    state: u8,
    detail: bool,
    entry_link: u32,
}

pub(super) struct Trace {
    reqs: Vec<TraceReq>,
    by_uid: HashMap<u32, u32>,
    /// Arrivals so far per runtime flow, and per source flow for initial placements.
    ord: Vec<u32>,
    ord_init: HashMap<u32, u32>,
    ev: Vec<[u32; 3]>,
    max: u64,
    /// Link exits at or after time zero per link: requested trips and initial agents.
    exits: Vec<[u32; 2]>,
    events_skipped: u64,
    /// Ending reason set by the caller of `remove_vehicle` (completed, unroutable); anything else is a removal.
    pub(super) reason: u8,
}

/// Hash of what makes two requests the same driver: the driver's parameters and route-noise seed.
fn attr_hash(d: &Drv, noise_seed: u32) -> u32 {
    [d.len, d.fcomp, d.a, d.b, d.t_hw, d.s0, d.gap_f].iter().fold(noise_seed, |h, x| hash32(h, x.to_bits()))
}

impl Trace {
    pub(super) fn new(n_flows: usize, n_links: usize, max: u64) -> Trace {
        Trace { reqs: Vec::new(), by_uid: HashMap::new(), ord: vec![0; n_flows], ord_init: HashMap::new(), ev: Vec::new(), max, exits: vec![[0; 2]; n_links], events_skipped: 0, reason: ST_REMOVED }
    }

    fn push(&mut self, r: TraceReq) {
        self.by_uid.insert(r.uid, self.reqs.len() as u32);
        self.reqs.push(r);
    }

    fn detail_open(&self) -> bool {
        (self.ev.len() as u64) < self.max
    }
}

impl Simulation {
    pub(super) fn trace_init(&mut self) {
        self.trace = self.cfg.trace.then(|| Box::new(Trace::new(self.flows.len(), self.topo.n_links, self.cfg.trace_detail_max.unwrap_or(TRACE_DETAIL_MAX))));
    }

    /// A car request of runtime flow `fi` has arrived (`generate_arrivals`).
    pub(super) fn trace_request(&mut self, fi: usize, trip: &Trip) {
        let src = self.flows[fi].src;
        let Some(tr) = self.trace.as_deref_mut() else { return };
        let ord = tr.ord[fi];
        tr.ord[fi] += 1;
        let detail = tr.detail_open();
        tr.push(TraceReq { src, ord, stratum: STRAT_REQUESTED, uid: trip.uid, origin: trip.origin, dest: trip.dest, t_arr: trip.t_arr, attr: attr_hash(&trip.drv, trip.noise_seed), t_ins: f64::NAN, t_end: f64::NAN, state: ST_PENDING, detail, entry_link: u32::MAX });
    }

    /// A car placed by initial loading (runtime flow `fi`), already on link `link`.
    pub(super) fn trace_initial(&mut self, fi: usize, uid: u32, origin: u32, dest: u32, drv: &Drv, noise_seed: u32, link: u32) {
        let (src, t) = (self.flows[fi].src, self.t);
        let Some(tr) = self.trace.as_deref_mut() else { return };
        let o = tr.ord_init.entry(src).or_insert(0);
        let ord = *o;
        *o += 1;
        let detail = tr.detail_open();
        tr.push(TraceReq { src, ord, stratum: STRAT_INITIAL, uid, origin, dest, t_arr: t, attr: attr_hash(drv, noise_seed), t_ins: t, t_end: f64::NAN, state: ST_ACTIVE, detail, entry_link: link });
    }

    pub(super) fn trace_enter(&mut self, uid: u32, link: u32) {
        let t = self.t;
        let Some(tr) = self.trace.as_deref_mut() else { return };
        if let Some(&i) = tr.by_uid.get(&uid) {
            let r = &mut tr.reqs[i as usize];
            r.t_ins = t;
            r.state = ST_ACTIVE;
            r.entry_link = link;
        }
    }

    /// The request of `uid` ended with `state` (a request never entered when it is dropped from its origin backlog).
    pub(super) fn trace_end(&mut self, uid: u32, state: u8) {
        let t = self.t;
        let Some(tr) = self.trace.as_deref_mut() else { return };
        if let Some(&i) = tr.by_uid.get(&uid) {
            let r = &mut tr.reqs[i as usize];
            if r.state == ST_PENDING || r.state == ST_ACTIVE {
                r.t_end = t;
                r.state = state;
            }
        }
    }

    /// `remove_vehicle` hook: the reason its caller set, else a removal.
    pub(super) fn trace_removed(&mut self, uid: u32) {
        let Some(tr) = self.trace.as_deref_mut() else { return };
        let reason = std::mem::replace(&mut tr.reason, ST_REMOVED);
        self.trace_end(uid, reason);
    }

    pub(super) fn trace_reason(&mut self, state: u8) {
        if let Some(tr) = self.trace.as_deref_mut() {
            tr.reason = state;
        }
    }

    /// A car left link `l` (`record_link_exit`).
    pub(super) fn trace_exit(&mut self, uid: u32, l: usize) {
        let t = self.t;
        let Some(tr) = self.trace.as_deref_mut() else { return };
        let Some(&i) = tr.by_uid.get(&uid) else { return };
        let r = &tr.reqs[i as usize];
        if t >= 0.0 {
            tr.exits[l][(r.stratum == STRAT_INITIAL) as usize] += 1;
        }
        if r.detail {
            tr.ev.push([i, l as u32, (t as f32).to_bits()]);
        } else {
            tr.events_skipped += 1;
        }
    }

    /// Requests in creation order, `REQ_STRIDE` values each: source flow, ordinal, stratum, uid, origin, destination, requested arrival
    /// (s), attribute hash, entry time (NaN before entry), end time (NaN while open), state, detail kept (0/1), entry link (-1 before
    /// entry), and the link an active car is on or crossing onto (-1 otherwise). Empty without `Config::trace`.
    pub fn trace_requests(&self) -> Vec<f64> {
        let Some(tr) = self.trace.as_deref() else { return Vec::new() };
        let on: HashMap<u32, u32> = self
            .vehs
            .iter()
            .filter(|v| v.alive && v.kind == KIND_CAR)
            .map(|v| (v.uid, if v.in_transit { v.route.get((v.ridx as usize).wrapping_sub(1)).copied().unwrap_or(v.link) } else { v.link }))
            .collect();
        let mut out = Vec::with_capacity(tr.reqs.len() * REQ_STRIDE);
        for r in &tr.reqs {
            let entry = if r.entry_link == u32::MAX { -1.0 } else { r.entry_link as f64 };
            let cur = if r.state == ST_ACTIVE { on.get(&r.uid).map_or(-1.0, |&l| l as f64) } else { -1.0 };
            out.extend_from_slice(&[r.src as f64, r.ord as f64, r.stratum as f64, r.uid as f64, r.origin as f64, r.dest as f64, r.t_arr, r.attr as f64, r.t_ins, r.t_end, r.state as f64, r.detail as u8 as f64, entry, cur]);
        }
        out
    }

    /// Link exits of the requests with detail, in time order, three values each: request index, link, time (f32 bits). Includes exits
    /// before time zero (settle interval), so a path can be complete; window counts use time >= 0.
    pub fn trace_events(&self) -> Vec<u32> {
        let Some(tr) = self.trace.as_deref() else { return Vec::new() };
        tr.ev.iter().flat_map(|e| e.iter().copied()).collect()
    }

    /// Exact counts behind the records, as JSON: schema, horizon, request counts by stratum and state, stored and skipped events, the
    /// detail bound, and per link the exits at or after time zero of requested trips and of initial agents.
    pub fn trace_summary(&self) -> String {
        let Some(tr) = self.trace.as_deref() else { return "null".into() };
        let mut states = [[0u64; 5]; 2];
        let mut detail = [0u64; 2];
        for r in &tr.reqs {
            states[r.stratum as usize][r.state as usize] += 1;
            detail[r.stratum as usize] += r.detail as u64;
        }
        let names = ["pending", "active", "completed", "unroutable", "removed"];
        let by = |s: usize| serde_json::Value::Object(names.iter().enumerate().map(|(k, n)| (n.to_string(), states[s][k].into())).collect());
        serde_json::json!({
            "schema": TRACE_SCHEMA,
            "mode": "car",
            "time": self.t,
            "requests": { "requested": by(0), "initial": by(1) },
            "detail": { "maxEvents": tr.max, "storedEvents": tr.ev.len(), "skippedEvents": tr.events_skipped, "requestsWithDetail": detail[0] + detail[1], "requests": tr.reqs.len() },
            "exitsRequested": tr.exits.iter().map(|e| e[0]).collect::<Vec<_>>(),
            "exitsInitial": tr.exits.iter().map(|e| e[1]).collect::<Vec<_>>(),
        })
        .to_string()
    }
}
