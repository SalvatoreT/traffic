//! Request and passage records (change explain-traffic-redistribution, tasks 2.2, 2.5, 4.1, 4.2).

use super::*;
use crate::sim::trace::REQ_STRIDE;

fn bits(v: &[f32]) -> Vec<u32> {
    v.iter().map(|x| x.to_bits()).collect()
}

/// Corridor with car, bicycle and local flows, interventions in force from the start, initial loading on.
fn traced(trace: bool, max: Option<u64>, ivs: &str, secs: f64) -> Simulation {
    let (net, c) = corridor(13.4, Control::AllWayStop);
    let mut dem = demand(&[(c.l[0], c.a[3], 240.0), (c.l[3], c.a[0], 240.0), (c.a[0], c.a[3], 600.0), (c.a[3], c.l[1], 400.0), (c.a[0], c.l[2], 400.0), (c.a[3], c.a[0], 500.0)]);
    dem.periods[0].flows.push(Flow { origin: c.a[0], destination: c.a[3], veh_per_hour: 60.0, mode: FlowMode::Bicycle, via: None, intent: None });
    let cfg = Config { trace, trace_detail_max: max, interventions: serde_json::from_str(ivs).unwrap(), ..cfg(3, 1.0) };
    let mut s = Simulation::from_parts(net, dem, cfg).unwrap();
    step_n(&mut s, secs);
    s
}

fn closure() -> String {
    let (_, c) = corridor(13.4, Control::AllWayStop);
    format!(r#"[{{"type":"modal_filter","link":{}}}]"#, c.conn[1].0)
}

fn summary(s: &Simulation) -> serde_json::Value {
    serde_json::from_str(&s.trace_summary()).unwrap()
}

#[test]
fn arrivals_due_in_the_same_step_keep_flow_order() {
    let (net, c) = corridor(13.4, Control::AllWayStop);
    let demand = demand(&[(c.a[0], c.a[3], 18_000.0), (c.a[3], c.a[0], 18_000.0)]);
    let config = Config { trace: true, ..cfg_empty(3, 1.0) };
    let mut sim = Simulation::from_parts(net, demand, config).unwrap();
    sim.step(8.0);
    let requests = sim.trace_requests();
    let mut previous = None;
    let mut crossed_in_time = false;
    let mut repeated_flow = false;
    for request in requests.chunks_exact(REQ_STRIDE) {
        let (flow, time) = (request[0] as usize, request[6]);
        let step = (time / DT).ceil() as i64;
        if let Some((last_step, last_flow, last_time)) = previous {
            assert!((step, flow) >= (last_step, last_flow));
            if step == last_step {
                crossed_in_time |= time < last_time;
                repeated_flow |= flow == last_flow;
            }
        }
        previous = Some((step, flow, time));
    }
    assert!(crossed_in_time && repeated_flow);
}

#[test]
fn tracing_changes_nothing_a_run_computes() {
    for ivs in ["[]".to_string(), closure()] {
        let (a, b) = (traced(false, None, &ivs, 1200.0), traced(true, None, &ivs, 1200.0));
        assert_eq!(a.metrics_json(), b.metrics_json());
        assert_eq!(bits(&a.vehicles()), bits(&b.vehicles()));
        assert_eq!(bits(&a.run_link_stats()), bits(&b.run_link_stats()));
        assert_eq!(bits(&a.intent_links()), bits(&b.intent_links()));
        assert!(a.trace_requests().is_empty() && a.trace_events().is_empty());
        assert!(!b.trace_requests().is_empty() && !b.trace_events().is_empty());
    }
}

#[test]
fn trace_states_partition_requests_and_exits_reconcile_with_link_counts() {
    let s = traced(true, None, "[]", 1500.0);
    let req = s.trace_requests();
    let n = req.len() / REQ_STRIDE;
    let sm = summary(&s);
    let total: u64 = ["requested", "initial"].iter().map(|k| sm["requests"][k].as_object().unwrap().values().map(|v| v.as_u64().unwrap()).sum::<u64>()).sum();
    assert_eq!(total as usize, n);
    // Exact per-link exits since time zero equal the simulator's own counter, and the stored events reproduce them.
    let d = s.diagnostics();
    let (er, ei) = (&sm["exitsRequested"], &sm["exitsInitial"]);
    let ev = s.trace_events();
    let mut from_ev = vec![0u64; s.n_links()];
    for e in ev.chunks(3) {
        if f32::from_bits(e[2]) >= 0.0 {
            from_ev[e[1] as usize] += 1;
        }
    }
    for l in 0..s.n_links() {
        let t = er[l].as_u64().unwrap() + ei[l].as_u64().unwrap();
        assert_eq!(t, d.link_exits[l] as u64, "link {l}");
        assert_eq!(from_ev[l], t, "link {l}");
    }
    // Completed requests ending at or after time zero are the completed car trips of the metrics.
    let done = req.chunks(REQ_STRIDE).filter(|r| r[10] == 2.0 && r[9] >= 0.0).count() as u64;
    assert_eq!(done, s.metrics().modes.car.completed_trips);
    // Keys are unique within a stratum.
    let mut keys: Vec<(u64, u64, u64)> = req.chunks(REQ_STRIDE).map(|r| (r[2] as u64, r[0] as u64, r[1] as u64)).collect();
    keys.sort();
    keys.dedup();
    assert_eq!(keys.len(), n);
}

#[test]
fn capped_detail_keeps_exact_counts_and_says_what_was_dropped() {
    let full = traced(true, None, "[]", 900.0);
    let capped = traced(true, Some(500), "[]", 900.0);
    let (a, b) = (summary(&full), summary(&capped));
    assert_eq!(a["exitsRequested"], b["exitsRequested"]);
    assert_eq!(a["exitsInitial"], b["exitsInitial"]);
    let stored = b["detail"]["storedEvents"].as_u64().unwrap();
    assert!(stored >= 500 && stored < a["detail"]["storedEvents"].as_u64().unwrap());
    assert_eq!(stored + b["detail"]["skippedEvents"].as_u64().unwrap(), a["detail"]["storedEvents"].as_u64().unwrap());
    assert!(b["detail"]["requestsWithDetail"].as_u64().unwrap() < b["detail"]["requests"].as_u64().unwrap());
    assert_eq!(capped.metrics_json(), full.metrics_json());
}

#[test]
fn requested_keys_and_attributes_match_across_scenarios() {
    let base = traced(true, None, "[]", 900.0);
    let scen = traced(true, None, &closure(), 900.0);
    let key = |r: &[f64]| (r[0] as u64, r[1] as u64);
    let sreq = scen.trace_requests();
    let smap: HashMap<(u64, u64), &[f64]> = sreq.chunks(REQ_STRIDE).filter(|r| r[2] == 0.0).map(|r| (key(r), r)).collect();
    let mut n = 0;
    for r in base.trace_requests().chunks(REQ_STRIDE).filter(|r| r[2] == 0.0) {
        let s = smap.get(&key(r)).expect("every requested trip of the baseline is requested in the scenario");
        for k in [3, 4, 5, 6, 7] {
            assert_eq!(r[k].to_bits(), s[k].to_bits(), "field {k}");
        }
        n += 1;
    }
    assert!(n > 100, "{n}");
}
