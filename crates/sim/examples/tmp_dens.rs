use traffic_sim::model::*;
use traffic_sim::sim::Simulation;
fn main() {
    let nets = std::fs::read_to_string("public/data/rockridge.network.json").unwrap();
    let dem = std::fs::read_to_string("public/data/rockridge.demand.json").unwrap();
    let net: Network = serde_json::from_str(&nets).unwrap();
    let mins: f64 = std::env::args().nth(1).unwrap_or("20".into()).parse().unwrap();
    let mut sim = Simulation::new(&nets, &dem, r#"{"period":"pm_peak"}"#).unwrap();
    sim.step(mins * 60.0);
    let ls = sim.link_stats();
    let mut v: Vec<(f32, usize)> = (0..net.links.len()).map(|l| (ls[l * 4 + 3] * net.links[l].length as f32 / 1000.0, l)).collect();
    v.sort_by(|a, b| b.0.partial_cmp(&a.0).unwrap());
    let m = sim.metrics();
    println!("veh in net {} backlog {}", m.vehicles_in_network, m.backlog);
    for (c, l) in v.iter().take(40) {
        let k = &net.links[*l];
        println!("link {l} {:?} {} lanes {} len {:.0} {}->{} ({:?}) veh {:.0} flow {:.0} spd {:.1}", k.class, k.name, k.lanes, k.length, k.from, k.to, net.nodes[k.to as usize].control, c, ls[l*4], ls[l*4+1]);
    }
}
