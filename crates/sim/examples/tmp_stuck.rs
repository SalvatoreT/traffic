use traffic_sim::sim::Simulation;
fn main() {
    let nets = std::fs::read_to_string("public/data/rockridge.network.json").unwrap();
    let dem = std::fs::read_to_string("public/data/rockridge.demand.json").unwrap();
    let mins: f64 = std::env::args().nth(1).unwrap_or("20".into()).parse().unwrap();
    let mut sim = Simulation::new(&nets, &dem, r#"{"period":"pm_peak"}"#).unwrap();
    sim.step(mins * 60.0);
    let m = sim.metrics();
    println!("t={} veh={} spawned={} done={} backlog={} removed={}", sim.time(), m.vehicles_in_network, m.spawned, m.completed_trips, m.backlog, m.gridlock_removed);
    let st = sim.debug_stuck(15.0);
    println!("stuck heads (>15s): {}", st.len());
    for l in st.iter().take(60) { println!("{l}"); }
}
