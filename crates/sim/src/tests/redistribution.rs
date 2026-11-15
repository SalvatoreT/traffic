//! Requested-trip identity across scenarios (change explain-traffic-redistribution, task 1.2).

use super::*;
use crate::sim::TripTiming;

/// Corridor with local trips from the residential row to both gates and gate-to-gate traffic; a closure in the residential row changes
/// the initial population (initial routes and their expected times change), as a real closure does.
fn identity_runs(seed: u64) -> (Vec<TripTiming>, Vec<TripTiming>, u64, u64) {
    let (net, c) = corridor(13.4, Control::Uncontrolled);
    let dem = demand(&[(c.l[0], c.a[3], 240.0), (c.l[3], c.a[0], 240.0), (c.a[0], c.a[3], 300.0), (c.a[3], c.l[1], 400.0), (c.a[0], c.l[2], 400.0)]);
    let run = |ivs: &str| {
        let cfg = Config { record_trips: true, interventions: serde_json::from_str(&iv(ivs)).unwrap(), ..cfg(seed, 1.0) };
        let mut s = Simulation::from_parts(net.clone(), dem.clone(), cfg).unwrap();
        step_n(&mut s, 900.0);
        (s.trip_timings().to_vec(), s.metrics().initial_agents)
    };
    let (base, nb) = run("[]");
    let (scen, ns) = run(&format!(r#"[{{"type":"modal_filter","link":{}}}]"#, c.conn[1].0));
    (base, scen, nb, ns)
}

/// Ordinary requests matched by flow, origin, destination and requested arrival (all scenario-independent draws).
fn matched(base: &[TripTiming], scen: &[TripTiming]) -> Vec<(TripTiming, TripTiming)> {
    let mut out = Vec::new();
    for b in base {
        if let Some(s) = scen.iter().find(|s| s.origin == b.origin && s.dest == b.dest && s.t_arr.to_bits() == b.t_arr.to_bits()) {
            out.push((b.clone(), s.clone()));
        }
    }
    out
}

#[test]
fn ordinary_requests_keep_their_identity_when_the_initial_population_differs() {
    let mut differing_init = 0;
    for seed in 1..=4 {
        let (base, scen, nb, ns) = identity_runs(seed);
        if nb != ns {
            differing_init += 1;
        }
        let pairs = matched(&base, &scen);
        assert!(pairs.len() > 20, "seed {seed}: {} matched trips", pairs.len());
        for (b, s) in &pairs {
            assert_eq!(b.uid, s.uid, "seed {seed}: the same request has another identity ({} initial agents against {nb}... {ns})", nb);
            // A local origin on the same block starts at the same place in both runs.
            if b.entry_link == s.entry_link {
                assert_eq!(b.entry_pos.to_bits(), s.entry_pos.to_bits(), "seed {seed}: {b:?} {s:?}");
            }
        }
    }
    assert!(differing_init > 0, "the fixture must change the initial population in some seed");
}
