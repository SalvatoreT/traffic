//! Cut-through intents: each through vehicle counts once under the intent of its flow, with the links it used.

use super::*;

fn run_intents(secs: f64, flows: &[(usize, usize, f64, Option<u32>)], n_intents: usize) -> (Simulation, Corr) {
    let (net, c) = corridor(1.0, Control::Uncontrolled);
    let mut d = demand(&flows.iter().map(|&(o, t, r, _)| (c.a[o], c.a[t], r)).collect::<Vec<_>>());
    for (f, spec) in d.periods[0].flows.iter_mut().zip(flows) {
        f.intent = spec.3;
    }
    d.intents = (0..n_intents).map(|i| IntentDef { id: format!("i{i}"), ..Default::default() }).collect();
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

/// Links a through car left during the settle interval are not credited: on local links the per-intent usage equals the through-car exit counter.
#[test]
fn intent_links_agree_with_the_exit_counter_on_local_links() {
    let (net, c) = corridor(1.0, Control::Uncontrolled);
    let mut d = demand(&[(c.a[0], c.a[3], 400.0), (c.a[3], c.a[0], 300.0)]);
    d.periods[0].flows[0].intent = Some(0);
    d.periods[0].flows[1].intent = Some(1);
    d.intents = (0..2).map(|i| IntentDef { id: format!("i{i}"), ..Default::default() }).collect();
    let mut sim = Simulation::from_parts(net, d, cfg(3, 1.0)).unwrap();
    assert!(sim.metrics().initial_agents > 10);
    run(&mut sim, 900.0, |_| {});
    let mut used = vec![0.0f32; sim.n_links()];
    for r in sim.intent_links().chunks(3) {
        used[r[1] as usize] += r[2];
    }
    let exits = sim.cut_through_exits();
    let mut total = 0.0;
    for &(f, r) in &c.loc {
        for l in [f, r] {
            assert_eq!(used[l as usize], exits[l as usize], "link {l}");
            total += exits[l as usize];
        }
    }
    assert!(total > 20.0, "through cars used the local row: {total}");
}

fn ramp(id: &str, kind: &str, links: &[u32]) -> RampDef {
    RampDef { id: id.into(), kind: kind.into(), links: links.to_vec() }
}

fn ramp_run(ramps: Vec<RampDef>, intents: Vec<IntentDef>, flow_intents: [Option<u32>; 2]) -> (Simulation, Corr) {
    let (net, c) = corridor(1.0, Control::Uncontrolled);
    let mut d = demand(&[(c.a[0], c.a[3], 150.0), (c.a[3], c.a[0], 120.0)]);
    for (f, i) in d.periods[0].flows.iter_mut().zip(flow_intents) {
        f.intent = i;
    }
    d.intents = intents;
    d.ramps = ramps;
    let mut sim = Simulation::from_parts(net, d, cfg(3, 1.0)).unwrap();
    run(&mut sim, 1500.0, |_| {});
    (sim, c)
}

fn intent(id: &str, on: Option<&str>, off: Option<&str>) -> IntentDef {
    IntentDef { id: id.into(), on_ramp: on.map(String::from), off_ramp: off.map(String::from) }
}

fn counts(sim: &Simulation) -> Vec<(String, u64)> {
    sim.metrics().cut_through.by_intent.iter().map(|b| (b.id.clone(), b.vehicles)).collect()
}

/// A through car is tallied under the on-ramp on its planned route, and any on-ramp no intent lists goes to "other on-ramps".
#[test]
fn through_cars_are_grouped_by_the_on_ramp_they_will_use() {
    let (net, c) = corridor(1.0, Control::Uncontrolled);
    drop(net);
    // Eastbound cars leave the local row for the arterial at the far end; westbound ones at the near end.
    let ramps = vec![ramp("r1", "on", &[c.conn[3].1]), ramp("r2", "on", &[c.conn[2].1, c.conn[1].1, c.conn[0].1])];
    let intents = vec![intent("to-r1", Some("r1"), None), intent("to-other", Some("other"), None), intent("od", None, None)];
    let (sim, _) = ramp_run(ramps, intents, [None, Some(2)]);
    let by = counts(&sim);
    let total = sim.metrics().cut_through.vehicles;
    assert_eq!(by.iter().map(|b| b.1).sum::<u64>(), total, "{by:?}");
    assert!(by[0].1 > 5 && by[1].1 > 5, "both on-ramp reasons carry cars: {by:?}");
    assert_eq!(by[2].1 + by[3].1, 0, "every through car of these flows uses a listed or unlisted on-ramp: {by:?}");
    let (checked, changed) = sim.on_ramp_plan_check();
    assert!(checked > 5 && changed == 0, "static costs: the planned ramp is the one driven ({checked}, {changed})");
}

/// A through car is tallied under the off-ramp it has driven; the first matching intent wins and the totals still add up.
#[test]
fn through_cars_are_grouped_by_the_off_ramp_they_came_from_and_the_first_match_wins() {
    let (_, c) = corridor(1.0, Control::Uncontrolled);
    let ramps = vec![ramp("o1", "off", &[c.conn[0].0]), ramp("o2", "off", &[c.conn[3].0])];
    let intents = vec![intent("from-o1", None, Some("o1")), intent("from-other", None, Some("other")), intent("od", None, None)];
    let (sim, _) = ramp_run(ramps.clone(), intents, [Some(2), Some(2)]);
    let by = counts(&sim);
    assert!(by[0].1 > 5 && by[1].1 > 5, "{by:?}");
    assert_eq!(by.iter().map(|b| b.1).sum::<u64>(), sim.metrics().cut_through.vehicles);
    // The same cars with the origin-and-destination intent first: it wins for the flows that carry it.
    let intents = vec![intent("od", None, None), intent("from-o1", None, Some("o1")), intent("from-other", None, Some("other"))];
    let (sim, _) = ramp_run(ramps, intents, [Some(0), None]);
    let by = counts(&sim);
    assert!(by[0].1 > 5 && by[1].1 == 0 && by[2].1 > 5, "{by:?}");
}

#[test]
fn a_demand_without_ramps_tallies_by_flow_as_before() {
    let (sim, _) = ramp_run(Vec::new(), vec![intent("a", None, None), intent("b", None, None)], [Some(0), Some(1)]);
    let by = counts(&sim);
    assert!(by[0].1 > 5 && by[1].1 > 5 && by[2].1 == 0, "{by:?}");
}

#[test]
fn intent_trips_add_up_to_each_reasons_count_and_name_its_trip_ends() {
    let (sim, c) = run_intents(1200.0, &[(0, 3, 90.0, Some(0)), (3, 0, 60.0, Some(1))], 2);
    let m = sim.metrics();
    let rows: Vec<(usize, u32, u32, f32)> = sim.intent_trips().chunks(4).map(|r| (r[0] as usize, r[1] as u32, r[2] as u32, r[3])).collect();
    for k in 0..2 {
        let n: f32 = rows.iter().filter(|r| r.0 == k).map(|r| r.3).sum();
        assert_eq!(n as u64, m.cut_through.by_intent[k].vehicles);
    }
    assert!(rows.iter().filter(|r| r.0 == 0).all(|r| r.1 == c.a[0] && r.2 == c.a[3]));
    assert!(rows.iter().filter(|r| r.0 == 1).all(|r| r.1 == c.a[3] && r.2 == c.a[0]));
}
