//! Cut-through intents: each through vehicle counts once under the intent of its flow, with the links it used.

use super::*;

fn run_intents(secs: f64, flows: &[(usize, usize, f64, Option<u32>)], n_intents: usize) -> (Simulation, Corr) {
    let (net, c) = corridor(1.0, Control::Uncontrolled);
    let mut d = demand(&flows.iter().map(|&(o, t, r, _)| (c.a[o], c.a[t], r)).collect::<Vec<_>>());
    for (f, spec) in d.periods[0].flows.iter_mut().zip(flows) {
        f.intent = spec.3;
    }
    d.intents = (0..n_intents).map(|i| IntentDef { id: format!("i{i}") }).collect();
    let mut sim = Simulation::from_parts(net, d, cfg_empty(3, 1.0)).unwrap();
    run(&mut sim, secs, |_| {});
    (sim, c)
}

#[test]
fn intent_counts_add_up_to_the_through_count() {
    let (sim, _) = run_intents(1800.0, &[(0, 3, 60.0, Some(0)), (3, 0, 40.0, Some(1)), (0, 3, 30.0, None)], 2);
    let m = sim.metrics();
    let by = &m.cut_through.by_intent;
    assert_eq!(by.iter().map(|b| b.id.as_str()).collect::<Vec<_>>(), ["i0", "i1", "other"]);
    assert!(by.iter().all(|b| b.vehicles > 0), "{by:?}");
    assert_eq!(by.iter().map(|b| b.vehicles).sum::<u64>(), m.cut_through.vehicles);
    let rate: f64 = by.iter().map(|b| b.vehicles_per_hour).sum();
    assert!((rate - m.cut_through.vehicles_per_hour).abs() < 1e-9);
    assert!(by[0].vehicles > by[1].vehicles && by[1].vehicles > by[2].vehicles / 2, "{by:?}");
}

#[test]
fn intent_links_follow_the_cars_of_that_intent() {
    let (sim, c) = run_intents(1800.0, &[(0, 3, 60.0, Some(0)), (3, 0, 60.0, Some(1))], 2);
    let m = sim.metrics();
    let rows: Vec<(usize, usize, f32)> = sim.intent_links().chunks(3).map(|r| (r[0] as usize, r[1] as usize, r[2])).collect();
    let on = |i: usize, l: u32| rows.iter().find(|r| r.0 == i && r.1 == l as usize).map_or(0.0, |r| r.2);
    // Eastbound cars use the forward local link and westbound cars the reverse one; neither uses the other's.
    let (fwd, rev) = c.loc[1];
    assert!(on(0, fwd) > 0.0 && on(1, rev) > 0.0, "{rows:?}");
    assert_eq!(on(0, rev), 0.0);
    assert_eq!(on(1, fwd), 0.0);
    assert!(on(0, fwd) <= m.cut_through.by_intent[0].vehicles as f32 + 1.0);
}

#[test]
fn a_demand_without_intents_reports_none() {
    let (sim, _) = run_intents(600.0, &[(0, 3, 60.0, None)], 0);
    assert!(sim.metrics().cut_through.by_intent.is_empty());
    assert!(sim.intent_links().is_empty());
}

#[test]
fn intent_tallies_are_deterministic() {
    let a = run_intents(900.0, &[(0, 3, 120.0, Some(0)), (3, 0, 90.0, Some(1))], 2).0;
    let b = run_intents(900.0, &[(0, 3, 120.0, Some(0)), (3, 0, 90.0, Some(1))], 2).0;
    assert_eq!(a.intent_links(), b.intent_links());
    assert_eq!(a.metrics().cut_through.by_intent.iter().map(|x| x.vehicles).collect::<Vec<_>>(), b.metrics().cut_through.by_intent.iter().map(|x| x.vehicles).collect::<Vec<_>>());
}
