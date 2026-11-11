use traffic_sim::model::*;
use traffic_sim::sim::Simulation;
fn main() {
    let net: Network = serde_json::from_str(&std::fs::read_to_string("public/data/rockridge.network.json").unwrap()).unwrap();
    let nets = std::fs::read_to_string("public/data/rockridge.network.json").unwrap();
    let dem = std::fs::read_to_string("public/data/rockridge.demand.json").unwrap();
    let cfg = r#"{"period":"pm_peak"}"#;
    let sim = Simulation::new(&nets, &dem, cfg).unwrap();
    for (n, cyc, ysum, g) in sim.signal_plans() {
        let names: std::collections::BTreeSet<String> = net.links.iter().filter(|l| l.to == n).map(|l| format!("{}x{}", l.name, l.lanes)).collect();
        println!("node {n} cycle {cyc:.0} ysum {ysum:.2} greens {:?} {:?}", g.iter().map(|x| x.round()).collect::<Vec<_>>(), names);
    }
}
