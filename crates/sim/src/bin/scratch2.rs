use traffic_sim::eff::Eff;
use traffic_sim::model::*;
use traffic_sim::route::*;
use traffic_sim::topo::Topo;
fn main() {
    let a: Vec<String> = std::env::args().collect();
    let scale: f64 = a[1].parse().unwrap();
    let root = std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("../..");
    let net: Network = serde_json::from_str(&std::fs::read_to_string(root.join("public/data/rockridge.network.json")).unwrap()).unwrap();
    let dem: Demand = serde_json::from_str(&std::fs::read_to_string(root.join("public/data/rockridge.demand.json")).unwrap()).unwrap();
    let topo = Topo::new(&net);
    let eff = Eff::derive(&topo, &net, &[]);
    let mut est = vec![0.0f32; topo.n_links];
    let mut r = Router::new(topo.n_nodes);
    let p = dem.periods.iter().find(|p| p.id == "pm_peak").unwrap();
    let mut fl: Vec<_> = p.flows.iter().collect();
    fl.sort_by_key(|f| f.destination);
    let mut last = u32::MAX;
    let mut route = Vec::new();
    for f in fl {
        if f.destination != last {
            if last != u32::MAX { r.tables[last as usize] = None; }
            r.ensure(f.destination, &topo, &eff, &eff.ff);
            last = f.destination;
        }
        let t = r.table(f.destination);
        if let Some(b) = first_link(t, &topo, &eff, f.origin, NO_NOISE) {
            route.clear();
            if walk(t, &topo, &eff, b, f.destination, NO_NOISE, &mut route) {
                let q = (f.veh_per_hour * scale) as f32;
                est[b as usize] += q;
                for &l in &route { est[l as usize] += q; }
            }
        }
    }
    let mut idx: Vec<usize> = (0..topo.n_links).collect();
    // v/c with 1 lane capacity 600 (signal/stop end), 1700 free
    let cap = |l: usize| -> f32 {
        let c = match net.nodes[net.links[l].to as usize].control {
            Control::Signal => 800.0, Control::AllWayStop => 500.0, Control::TwoWayStop => 700.0, _ => 1500.0 };
        c * net.links[l].lanes.max(1) as f32
    };
    idx.sort_by(|&a, &b| (est[b] / cap(b)).partial_cmp(&(est[a] / cap(a))).unwrap());
    let tot: f32 = est.iter().zip(&net.links).map(|(e, l)| e * l.length as f32).sum::<f32>() / 1000.0;
    println!("veh-km/h {tot:.0}");
    for &l in idx.iter().take(40) {
        let k = &net.links[l];
        println!("link {l} {:?} {:<22} ln{} len{:.0} flow {:.0} cap {:.0} v/c {:.2} end {:?}", k.class, k.name, k.lanes, k.length, est[l], cap(l), est[l]/cap(l), net.nodes[k.to as usize].control);
    }
}
