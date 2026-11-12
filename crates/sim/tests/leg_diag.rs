use std::path::PathBuf;
use traffic_sim::eff::phase_groups;
use traffic_sim::topo::Topo;
use traffic_sim::Network;

#[test]
fn diag() {
    let p = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../../public/data/rockridge.network.json");
    let Ok(s) = std::fs::read_to_string(&p) else { return };
    let net: Network = serde_json::from_str(&s).unwrap();
    let mut topo = Topo::new(&net);
    let mut kdiff = std::collections::BTreeMap::new();
    let mut gnew = Vec::new();
    for n in 0..topo.n_nodes {
        let ins = topo.ins[n].clone();
        gnew.push(phase_groups(&topo, &net, &ins));
    }
    for i in 0..topo.mvs.len() {
        let (a, b) = (topo.mvs[i].a as usize, topo.mvs[i].b as usize);
        let (_, ha) = topo.link_point(a, topo.stop_pos[a] as f64, 0.0);
        let (_, hb) = topo.link_point(b, topo.emerge_pos[b] as f64, 0.0);
        let d = traffic_sim::topo::norm_angle(hb - ha);
        let k = if d.abs() > 2.6 { 3 } else if d > 0.52 { 1 } else if d < -0.52 { 2 } else { 0 };
        if k != topo.mvs[i].kind {
            let m = &topo.mvs[i];
            *kdiff.entry(m.node).or_insert(0) += 1;
            println!("KIND node {} {} -> {}: old {} new {}", m.node, net.links[a].name, net.links[b].name, k, m.kind);
        }
        topo.mvs[i].h_in = ha;
    }
    for n in 0..topo.n_nodes {
        let ins = topo.ins[n].clone();
        let mut old = phase_groups(&topo, &net, &ins);
        let mut new = gnew[n].clone();
        for g in old.iter_mut().chain(new.iter_mut()) { g.sort(); }
        old.sort(); new.sort();
        if old != new {
            println!("PHASE node {} ({:?}) at ({},{}) old {:?} new {:?}", n, net.nodes[n].control, net.nodes[n].x, net.nodes[n].y, old, new);
        }
    }
    println!("kind-diff nodes {}", kdiff.len());
}
