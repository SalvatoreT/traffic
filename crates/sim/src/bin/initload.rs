//! Check of initial loading against a cold warm-up on a real study area (change baseline-calibration).
//! Usage: initload [--dir DIR with <area>.network.json and <area>.demand.json] [--area rockridge] [--period midday] [--seeds 1,2,3] [--factor X] [--warmup 15] [--hour-s 3600]
//! Prints the state at time zero with initial loading against the state after a cold warm-up, and the headline metrics of the next hour.

use std::path::PathBuf;
use traffic_sim::model::{Config, Control, Demand, Network, RoadClass};
use traffic_sim::sim::Simulation;

struct Snap {
    veh: u64,
    by_class: [u64; 6],
    inside: u64,
    mean_speed: f64,
    node_queue: Vec<u32>,
}

fn snap(sim: &Simulation, net: &Network) -> Snap {
    let load = sim.debug_link_load();
    let mut s = Snap { veh: 0, by_class: [0; 6], inside: 0, mean_speed: 0.0, node_queue: vec![0; net.nodes.len()] };
    let mut vs = 0.0;
    for (l, &(n, v, st)) in load.iter().enumerate() {
        let link = &net.links[l];
        s.veh += n as u64;
        s.by_class[link.class.rank() as usize] += n as u64;
        if link.in_study_area {
            s.inside += n as u64;
        }
        vs += v as f64;
        if net.nodes[link.to as usize].control == Control::Signal {
            s.node_queue[link.to as usize] += st;
        }
    }
    s.mean_speed = if s.veh > 0 { vs / s.veh as f64 } else { 0.0 };
    s
}

struct Hour {
    completed: f64,
    ct_km: f64,
    delay: f64,
    trip: f64,
    removed: f64,
    backlog: f64,
    veh_km: f64,
}

/// `cold`: the run began empty and warmed up, so its means are cumulative and the window means come from the sums.
fn hour(sim: &mut Simulation, secs: f64, cold: bool) -> Hour {
    let m0 = sim.metrics();
    sim.step(secs);
    let m1 = sim.metrics();
    let (n0, n1) = (m0.completed_trips as f64, m1.completed_trips as f64);
    let win = |a: f64, b: f64| if cold && n1 > n0 { (b * n1 - a * n0) / (n1 - n0) } else { b };
    Hour {
        completed: (m1.completed_trips - m0.completed_trips) as f64,
        ct_km: m1.cut_through.veh_km - m0.cut_through.veh_km,
        delay: win(m0.mean_trip_delay, m1.mean_trip_delay),
        trip: win(m0.mean_trip_time, m1.mean_trip_time),
        removed: (m1.gridlock_removed - m0.gridlock_removed) as f64,
        backlog: m1.backlog as f64,
        veh_km: m1.veh_km - m0.veh_km,
    }
}

fn main() {
    let argv: Vec<String> = std::env::args().skip(1).collect();
    let get = |k: &str, d: &str| argv.iter().position(|a| a == k).and_then(|i| argv.get(i + 1)).cloned().unwrap_or(d.into());
    let area = get("--area", "rockridge");
    let period = get("--period", "midday");
    let seeds: Vec<u64> = get("--seeds", "1").split(',').map(|x| x.parse().unwrap()).collect();
    let warm: f64 = get("--warmup", "15").parse::<f64>().unwrap() * 60.0;
    let hour_s: f64 = get("--hour-s", "3600").parse().unwrap();
    let root = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../..");
    let dir = argv.iter().position(|a| a == "--dir").and_then(|i| argv.get(i + 1)).map_or(root.join("public/data"), PathBuf::from);
    let rd = |n: &str| std::fs::read_to_string(dir.join(format!("{area}.{n}.json"))).expect("read");
    let (nj, dj) = (rd("network"), rd("demand"));
    let net: Network = serde_json::from_str(&nj).unwrap();
    let _: Demand = serde_json::from_str(&dj).unwrap();
    let names = ["motorway", "primary", "secondary", "tertiary", "residential", "service"];
    let _ = RoadClass::Motorway;
    for &seed in &seeds {
        let mk = |load: bool| {
            let cfg = Config { seed, period: period.clone(), initial_load: load, ..Default::default() };
            let t = std::time::Instant::now();
            let s = Simulation::from_parts(serde_json::from_str(&nj).unwrap(), serde_json::from_str(&dj).unwrap(), cfg).unwrap();
            (s, t.elapsed().as_secs_f64())
        };
        let (mut a, build_s) = mk(true);
        let (mut b, empty_s) = mk(false);
        println!("construction without initial loading {empty_s:.2} s");
        let m = a.metrics();
        let sa = snap(&a, &net);
        println!("== {area} {period} seed {seed}: construction with initial loading {build_s:.2} s; initialAgents {} skipped {}; clock {}", m.initial_agents, m.initial_skipped, a.time());
        b.step(warm);
        let sb = snap(&b, &net);
        let pc = |x: u64, y: u64| if y > 0 { format!("{:+.0}%", 100.0 * (x as f64 / y as f64 - 1.0)) } else { "n/a".into() };
        println!("vehicles on network: loaded {} vs warmed {} ({})", sa.veh, sb.veh, pc(sa.veh, sb.veh));
        println!("inside study area: {} vs {} ({}); mean speed {:.2} vs {:.2} m/s", sa.inside, sb.inside, pc(sa.inside, sb.inside), sa.mean_speed, sb.mean_speed);
        for c in 0..6 {
            println!("  {:12} {:5} vs {:5} ({})", names[c], sa.by_class[c], sb.by_class[c], pc(sa.by_class[c], sb.by_class[c]));
        }
        // Busiest signals: by cars standing plus on approach in the warmed run.
        let mut idx: Vec<usize> = (0..net.nodes.len()).filter(|&n| net.nodes[n].control == Control::Signal).collect();
        idx.sort_by_key(|&n| std::cmp::Reverse((sb.node_queue[n], n)));
        let (qa, qb): (Vec<u32>, Vec<u32>) = idx.iter().take(10).map(|&n| (sa.node_queue[n], sb.node_queue[n])).unzip();
        println!("standing cars at the 10 busiest signals: loaded {:?} (sum {}) vs warmed {:?} (sum {})", qa, qa.iter().sum::<u32>(), qb, qb.iter().sum::<u32>());
        let ha = hour(&mut a, hour_s, false);
        let hb = hour(&mut b, hour_s, true);
        let row = |n: &str, x: f64, y: f64| println!("  {:24} {:10.1} vs {:10.1}", n, x, y);
        println!("hour (loaded vs 15-min warm-up then hour):");
        row("completed trips", ha.completed, hb.completed);
        row("cut-through veh-km", ha.ct_km, hb.ct_km);
        row("veh-km", ha.veh_km, hb.veh_km);
        row("mean delay (s)", ha.delay, hb.delay);
        row("mean trip time (s)", ha.trip, hb.trip);
        row("removals", ha.removed, hb.removed);
        row("backlog at end", ha.backlog, hb.backlog);
    }
}
