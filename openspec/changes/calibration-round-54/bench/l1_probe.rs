use traffic_sim::model::*;
use traffic_sim::validate::*;
fn main() {
    for on in [false, true] {
        let mut caps = vec![];
        let mut gcs = vec![];
        for seed in 1..=10u64 {
            let (net, x) = cross(Control::Signal, RoadClass::Secondary, 2, RoadClass::Secondary, 2, false);
            let q = 4000.0 * 2.0;
            let fl = vec![
                (x.w, x.e, q * 0.8, FlowMode::Car), (x.s, x.n, q, FlowMode::Car), (x.n, x.s, q, FlowMode::Car),
                (x.w, x.n, q * 0.2, FlowMode::Car), (x.e, x.w, 500.0 * 2.0, FlowMode::Car),
            ];
            let c = Config { single_control_charge: Some(on), record_trips: true, route_dispersion: std::env::var("DISP").ok().and_then(|v| v.parse().ok()), guided_share: std::env::var("GUIDED").ok().and_then(|v| v.parse().ok()), ..cfg(seed) };
            let mut r = Run::new(net, demand_m(&fl), c).with_ivs(&format!(r#"[{{"type":"signal_timing","node":{},"cycle":100.0}}]"#, x.c)).watching(&[x.w_in]);
            r.advance(1500.0);
            let (t0, t1) = (300.0, 1500.0);
            let tot = r.rate(&[x.w_in], t0, t1);
            let thr = r.rate(&[x.e_out], t0, t1);
            let sth = r.rate(&[x.s_in], t0, t1);
            let left = r.rate(&[x.n_out], t0, t1) - sth;
            let gc = r.green_frac(x.w_in, t0, t1);
            let tr = r.sim.trip_records();
            let (mut wn, mut wn_ind, mut wn_sw, mut we, mut we_ind, mut sw_all) = (0, 0, 0, 0, 0, 0);
            for t in tr {
                if t.switches > 0 { sw_all += 1; }
                if t.origin == x.w && t.dest == x.n { wn += 1; if t.trail.len() > 3 { wn_ind += 1; } if t.switches > 0 { wn_sw += 1; } }
                if t.origin == x.w && t.dest == x.e { we += 1; if t.trail.len() > 3 { we_ind += 1; } }
            }
            println!("   trips W->N {wn} indirect {wn_ind} switched {wn_sw}; W->E {we} indirect {we_ind}; all switched {sw_all}; trail example {:?}", tr.iter().find(|t| t.origin == x.w && t.dest == x.n).map(|t| t.trail.clone()));
            caps.push(tot / 2.0);
            gcs.push(gc);
            println!("{} seed {:2} cap/lane {:7.1} gc {:.3} through {:6.1} left {:6.1} oppS {:6.1}", if on { "on " } else { "off" }, seed, tot / 2.0, gc, thr, left, sth);
        }
        let m = caps.iter().sum::<f64>() / 10.0;
        let sd = (caps.iter().map(|c| (c - m).powi(2)).sum::<f64>() / 9.0).sqrt();
        println!("{} mean {:.2} sd {:.2} se {:.2} gc mean {:.4}", if on { "on " } else { "off" }, m, sd, sd / 10f64.sqrt(), gcs.iter().sum::<f64>() / 10.0);
    }
}
