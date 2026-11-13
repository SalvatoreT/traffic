//! Cut-through headline: each through vehicle counts once, the first time it exits a local link.

use super::*;

fn count_after(art_limit: f64, flows: &[(u32, u32, f64)], secs: f64) -> (u64, u64) {
    let (net, c) = corridor(art_limit, Control::Uncontrolled);
    let flows: Vec<(u32, u32, f64)> = flows.iter().map(|&(o, d, r)| (c.pick(o), c.pick(d), r)).collect();
    let mut sim = Simulation::from_parts(net, demand(&flows), cfg_empty(3, 1.0)).unwrap();
    run(&mut sim, secs, |_| {});
    let m = sim.metrics();
    (m.cut_through.vehicles, m.completed_trips)
}

impl Corr {
    /// Node index by role code: 0..4 arterial nodes, 10..14 local nodes.
    fn pick(&self, code: u32) -> u32 {
        if code >= 10 { self.l[(code - 10) as usize] } else { self.a[code as usize] }
    }
}

#[test]
fn a_through_vehicle_on_several_local_links_counts_once() {
    // A 1 m/s arterial sends the gate-to-gate trip along the local street: it exits five local links.
    let (net, c) = corridor(1.0, Control::Uncontrolled);
    let mut sim = Simulation::from_parts(net, demand(&[(c.a[0], c.a[3], 60.0)]), cfg_empty(3, 1.0)).unwrap();
    run(&mut sim, 1800.0, |_| {});
    let m = sim.metrics();
    assert!(m.completed_trips >= 5, "completed {}", m.completed_trips);
    assert!(m.cut_through.vehicles >= m.completed_trips, "every completed trip used the local street");
    assert!(m.cut_through.vehicles <= m.completed_trips + m.vehicles_in_network, "counted once per vehicle: {}", m.cut_through.vehicles);
    let n = m.cut_through.vehicles as f64;
    assert!((m.cut_through.vehicles_per_hour - n * 3600.0 / m.time).abs() < 1e-9);
}

#[test]
fn a_non_through_vehicle_counts_zero() {
    let (n, done) = count_after(11.2, &[(11, 3, 300.0)], 600.0);
    assert!(done > 5);
    assert_eq!(n, 0);
}

#[test]
fn a_through_vehicle_on_arterials_counts_zero() {
    let (n, done) = count_after(11.2, &[(0, 3, 300.0)], 600.0);
    assert!(done > 5);
    assert_eq!(n, 0);
}

#[test]
fn the_count_is_deterministic_for_a_seed() {
    let a = count_after(1.0, &[(0, 3, 200.0), (3, 0, 200.0)], 900.0);
    let b = count_after(1.0, &[(0, 3, 200.0), (3, 0, 200.0)], 900.0);
    assert_eq!(a, b);
    assert!(a.0 > 0);
}
