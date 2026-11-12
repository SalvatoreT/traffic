use std::collections::HashMap;
use std::path::PathBuf;
use traffic_sim::model::{Config, Demand, Network};
use traffic_sim::sim::Simulation;
fn main() {
    let argv: Vec<String> = std::env::args().skip(1).collect();
    let period = argv.get(0).cloned().unwrap_or("pm_peak".into());
    let seed: u64 = argv.get(1).map(|s| s.parse().unwrap()).unwrap_or(1);
    let at: u32 = argv.get(2).map(|s| s.parse().unwrap()).unwrap_or(1679);
    let dir = std::env::var("DIR").map(PathBuf::from).unwrap_or(PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../../public/data"));
    let nj = std::fs::read_to_string(dir.join("rockridge.network.json")).unwrap();
    let dj = std::fs::read_to_string(dir.join("rockridge.demand.json")).unwrap();
    let net: Network = serde_json::from_str(&nj).unwrap();
    let dem: Demand = serde_json::from_str(&dj).unwrap();
    let cfg = Config { seed, period, record_trips: true, ..Default::default() };
    let mut sim = Simulation::from_parts(net, dem, cfg).unwrap();
    sim.step(3600.0);
    let mut nxt: HashMap<(u32, u32), u32> = HashMap::new();
    let mut org: HashMap<u32, u32> = HashMap::new();
    let mut tot = 0;
    for t in sim.trip_records() {
        for w in t.trail.windows(3) {
            if w[0] == at { *nxt.entry((w[1], w[2])).or_default() += 1; }
        }
        if t.trail.contains(&at) { *org.entry(t.origin).or_default() += 1; tot += 1; }
    }
    let mut v: Vec<_> = nxt.into_iter().collect(); v.sort_by_key(|x| -(x.1 as i32));
    println!("completed trips through {}: {}", at, tot);
    println!("next two links: {:?}", &v[..v.len().min(12)]);
    let mut o: Vec<_> = org.into_iter().collect(); o.sort_by_key(|x| -(x.1 as i32));
    println!("origins: {:?}", &o[..o.len().min(10)]);
    let m = sim.metrics();
    println!("completed {} removed {} backlog {}", m.completed_trips, m.gridlock_removed, m.backlog);
}
