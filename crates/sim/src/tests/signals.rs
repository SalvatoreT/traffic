//! Signal timing contracts: an explicit cycle wins over an observed one, and every plan's greens and clearance fit its cycle.

use super::*;

fn green(links: Vec<u32>, g: f32, own: bool) -> ApproachGreen {
    ApproachGreen { links, green_s: g, own_phase: own, runs_with: Vec::new() }
}

fn timing(cycle: f32, greens: Vec<ApproachGreen>, clearance: Option<f32>) -> SignalTiming {
    SignalTiming { periods: vec!["p".into()], cycle_s: cycle, greens, source: "fixture worksheet".into(), clearance_s: clearance }
}

fn flows(x: &Cross) -> Demand {
    demand(&[(x.w, x.e, 700.0), (x.e, x.w, 600.0), (x.s, x.n, 150.0), (x.n, x.s, 150.0)])
}

/// Every phase starts where the previous one's green and clearance end, and the last one's end closes the cycle.
fn assert_budget(sim: &Simulation, node: u32, clearance: f32) -> f32 {
    let p = sim.test_eff().sig[node as usize].as_ref().expect("signal plan");
    let mut t = 0.0;
    for &(start, g) in &p.phases {
        assert!((start - t).abs() < 1e-2 && g > 0.0, "{:?} in a {} s cycle", p.phases, p.cycle);
        t = start + g + clearance;
    }
    assert!((t - p.cycle).abs() < 1e-2, "phases end at {t}, cycle {}", p.cycle);
    p.cycle
}

fn green_of(sim: &Simulation, node: u32, link: u32) -> f32 {
    let p = sim.test_eff().sig[node as usize].as_ref().unwrap();
    p.phases[p.links.iter().position(|g| g.contains(&link)).unwrap()].1
}

#[test]
fn an_explicit_cycle_overrides_the_observed_one_and_keeps_its_phases() {
    let (mut net, x) = cross4(Control::Signal, RoadClass::Residential, false);
    net.nodes[x.c as usize].signal_timing = vec![timing(79.0, vec![green(vec![x.s_in], 4.0, false)], None)];
    let mut sim = Simulation::from_parts(net, flows(&x), cfg(2, 1.0)).unwrap();
    assert!((assert_budget(&sim, x.c, YELLOW + ALL_RED) - 79.0).abs() < 1e-2);
    assert!((green_of(&sim, x.c, x.s_in) - 4.0).abs() < 1e-2);
    assert!(sim.metrics().retimed_signals.is_empty());
    for cycle in [100.0, 150.0] {
        sim.set_interventions(&format!(r#"[{{"type":"signal_timing","node":{},"cycle":{cycle}}}]"#, x.c)).unwrap();
        assert!((assert_budget(&sim, x.c, YELLOW + ALL_RED) - cycle).abs() < 1e-2, "requested {cycle}");
        assert_eq!(sim.test_eff().sig[x.c as usize].as_ref().unwrap().phases.len(), 2, "the observed phase structure stays");
        assert!(green_of(&sim, x.c, x.s_in) > 4.0 + 1.0, "the observed green is released");
        assert_eq!(sim.metrics().retimed_signals, vec![x.c]);
    }
    // Adaptation keeps the requested cycle while the splits follow the flows.
    let before = green_of(&sim, x.c, x.s_in);
    let mut flow = vec![0.0f32; sim.n_links()];
    flow[x.s_in as usize] = 900.0;
    flow[x.w_in as usize] = 300.0;
    sim.test_adapt_with(&flow);
    run(&mut sim, 400.0, |_| {});
    assert!((assert_budget(&sim, x.c, YELLOW + ALL_RED) - 150.0).abs() < 1e-2);
    assert!((green_of(&sim, x.c, x.s_in) - before).abs() > 1.0, "splits adapt");
    // Removing the retiming restores the observation.
    sim.set_interventions("[]").unwrap();
    assert!((assert_budget(&sim, x.c, YELLOW + ALL_RED) - 79.0).abs() < 1e-2);
    assert!((green_of(&sim, x.c, x.s_in) - 4.0).abs() < 1e-2);
    assert!(sim.metrics().retimed_signals.is_empty());
}

/// The ramp signal of the audit: two phases of their own with 29 s and 13 s of green in a 50 s cycle.
fn ramp_like(clearance: Option<f32>, cycle: f32) -> Result<Simulation, String> {
    let (mut net, x) = cross4(Control::Signal, RoadClass::Residential, false);
    net.nodes[x.c as usize].signal_timing = vec![timing(cycle, vec![green(vec![x.w_in, x.e_in], 29.0, false), green(vec![x.s_in, x.n_in], 13.0, false)], clearance)];
    Simulation::from_parts(net, flows(&x), cfg(2, 1.0))
}

#[test]
fn an_observed_plan_that_does_not_add_up_is_rejected_with_its_budget_and_source() {
    let e = ramp_like(None, 50.0).err().expect("29 + 13 + 2 x 5 s is 52 s, not 50");
    assert!(e.contains("observed cycle of 50.0 s") && e.contains("need 52.0 s") && e.contains("fixture worksheet") && e.contains("(p)"), "{e}");
    // A declared cycle longer than its fixed greens and clearance does not add up either.
    assert!(ramp_like(None, 55.0).err().expect("52 s of phases in 55").contains("need 52.0 s"));
    // With the worksheet's 4 s clearance the plan fits and runs the declared cycle with the observed greens.
    let sim = ramp_like(Some(4.0), 50.0).unwrap();
    let c = sim.test_eff().sig.iter().flatten().next().unwrap().cycle;
    assert!((c - 50.0).abs() < 1e-2);
    let (_, x) = cross4(Control::Signal, RoadClass::Residential, false);
    assert!((assert_budget(&sim, x.c, 4.0) - 50.0).abs() < 1e-2);
    assert!((green_of(&sim, x.c, x.w_in) - 29.0).abs() < 1e-2 && (green_of(&sim, x.c, x.s_in) - 13.0).abs() < 1e-2);
    // A clearance shorter than the yellow is refused.
    assert!(ramp_like(Some(2.0), 50.0).err().unwrap().contains("clearance interval of 2 s"));
}

#[test]
fn an_infeasible_or_out_of_range_retiming_is_refused_and_the_scenario_stays() {
    let (mut net, x) = cross4(Control::Signal, RoadClass::Residential, false);
    // Four phases of their own: 4 x (5 s green + 5 s clearance) = 40 s at least.
    net.nodes[x.c as usize].signal_timing = vec![timing(100.0, [x.w_in, x.e_in, x.s_in, x.n_in].iter().map(|&l| green(vec![l], 10.0, true)).collect(), None)];
    net.nodes[x.c as usize].signal_timing[0].greens.truncate(3);
    let mut sim = Simulation::from_parts(net.clone(), flows(&x), cfg(2, 1.0)).unwrap();
    let phases = sim.test_eff().sig[x.c as usize].as_ref().unwrap().phases.len();
    assert_eq!(phases, 4);
    sim.set_interventions(&format!(r#"[{{"type":"signal_timing","node":{},"cycle":120}}]"#, x.c)).unwrap();
    let e = sim.set_interventions(&format!(r#"[{{"type":"signal_timing","node":{},"cycle":35}}]"#, x.c)).unwrap_err();
    assert!(e.contains("requested cycle of 35.0 s") && e.contains("need 40.0 s"), "{e}");
    assert!((assert_budget(&sim, x.c, YELLOW + ALL_RED) - 120.0).abs() < 1e-2, "the previous scenario stays");
    let e = sim.set_interventions(&format!(r#"[{{"type":"signal_timing","node":{},"cycle":240}}]"#, x.c)).unwrap_err();
    assert!(e.contains("outside the supported 30 to 180 s"), "{e}");
    // The same request at construction is an error, not a longer cycle.
    let iv: Vec<Intervention> = serde_json::from_str(&format!(r#"[{{"type":"signal_timing","node":{},"cycle":35}}]"#, x.c)).unwrap();
    assert!(Simulation::from_parts(net, flows(&x), Config { interventions: iv, ..cfg(2, 1.0) }).is_err());
    // A feasible request on the same signal runs as asked.
    sim.set_interventions(&format!(r#"[{{"type":"signal_timing","node":{},"cycle":40}}]"#, x.c)).unwrap();
    assert!((assert_budget(&sim, x.c, YELLOW + ALL_RED) - 40.0).abs() < 1e-2);
}

#[test]
fn generic_plans_always_fit_their_cycle() {
    for ys in [vec![0.1, 0.2], vec![0.3, 0.3, 0.3], vec![0.0; 6], vec![0.5, 0.6]] {
        let (cycle, phases, _) = crate::eff::webster(&ys, None);
        let end = phases.last().map_or(0.0, |&(s, g)| s + g + YELLOW + ALL_RED);
        assert!((end - cycle).abs() < 1e-2 && phases.iter().all(|p| p.1 >= 4.0), "{ys:?}: {phases:?} in {cycle}");
    }
}
