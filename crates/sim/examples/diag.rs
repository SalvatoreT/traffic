use std::path::PathBuf;
use traffic_sim::model::{Config, Demand, Network};
use traffic_sim::sim::Simulation;
fn main() {
    let argv: Vec<String> = std::env::args().skip(1).collect();
    let period = argv.get(0).cloned().unwrap_or("pm_peak".into());
    let seed: u64 = argv.get(1).map(|s| s.parse().unwrap()).unwrap_or(1);
    let node: u32 = argv.get(2).map(|s| s.parse().unwrap()).unwrap_or(688);
    let links: Vec<usize> = argv.get(3).map(|s| s.split(',').map(|x| x.parse().unwrap()).collect()).unwrap_or_default();
    let root = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../../public/data");
    let nj = std::fs::read_to_string(root.join("rockridge.network.json")).unwrap();
    let dj = std::fs::read_to_string(root.join("rockridge.demand.json")).unwrap();
    let net: Network = serde_json::from_str(&nj).unwrap();
    let dem: Demand = serde_json::from_str(&dj).unwrap();
    let cfg = Config { seed, period, ..Default::default() };
    let mut sim = Simulation::from_parts(net, dem, cfg).unwrap();
    println!("plans: {:?}", sim.signal_plans().into_iter().filter(|p| p.0 == node).collect::<Vec<_>>());
    println!("phase links: {:?}", sim.signal_phase_links(node));
    for k in 0..60 {
        sim.step(30.0);
        let load = sim.debug_link_load();
        let sg = sim.signals();
        let s: Vec<String> = links.iter().map(|&l| format!("{}:{}n/{}st/s{}", l, load[l].0, load[l].2, sg[l])).collect();
        println!("t={:5} {}", (k + 1) * 30, s.join("  "));
        if k >= 50 && k < 54 { for l in sim.debug_stuck(0.0) { if links.iter().any(|x| l.starts_with(&format!("link {} ", x))) { println!("    {}", l); } } }
    }
    println!("plans: {:?}", sim.signal_plans().into_iter().filter(|p| p.0 == node).collect::<Vec<_>>());
}
