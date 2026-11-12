//! Scenario-link encoder, version 1: a port of `encodeScenario` in `src/lib/hash.ts` so a proposal's `link` opens in the app.
//! Items are `code,geohash[,param...]` joined by `~`; the geohash (10 characters, about 1 m) is the intervention's place, so
//! links carry no network indices. Fixtures in `tests/fixtures/links.json` come from the TypeScript encoder.

use crate::model::{Control, Intervention, Network};

const ALPHABET: &[u8] = b"0123456789bcdefghjkmnpqrstuvwxyz";
const EARTH_R: f64 = 6371008.8;

pub fn encode_geohash(lat: f64, lon: f64, length: usize) -> String {
    let (mut lat_lo, mut lat_hi, mut lon_lo, mut lon_hi) = (-90.0f64, 90.0f64, -180.0f64, 180.0f64);
    let mut out = String::new();
    let (mut bits, mut ch, mut even) = (0u32, 0usize, true);
    while out.len() < length {
        let (lo, hi, v) = if even { (&mut lon_lo, &mut lon_hi, lon) } else { (&mut lat_lo, &mut lat_hi, lat) };
        let mid = (*lo + *hi) / 2.0;
        ch <<= 1;
        if v >= mid {
            ch |= 1;
            *lo = mid;
        } else {
            *hi = mid;
        }
        even = !even;
        bits += 1;
        if bits == 5 {
            out.push(ALPHABET[ch] as char);
            bits = 0;
            ch = 0;
        }
    }
    out
}

/// Local equirectangular projection about the network origin (`src/lib/projection.ts`).
#[derive(Clone, Copy)]
pub struct Proj {
    lon0: f64,
    lat0: f64,
    kx: f64,
    ky: f64,
}

impl Proj {
    pub fn new(lon0: f64, lat0: f64) -> Proj {
        let d2r = std::f64::consts::PI / 180.0;
        let ky = EARTH_R * d2r;
        let kx = ky * (lat0 * d2r).cos();
        Proj { lon0, lat0, kx, ky }
    }
    pub fn to_lon_lat(&self, x: f64, y: f64) -> (f64, f64) {
        (self.lon0 + x / self.kx, self.lat0 + y / self.ky)
    }
}

pub fn polyline_length(g: &[[f64; 2]]) -> f64 {
    g.windows(2).map(|w| (w[1][0] - w[0][0]).hypot(w[1][1] - w[0][1])).sum()
}

/// (x, y, math heading in radians) at distance `s` along the polyline (`pointAlong` in `src/lib/geom.ts`).
pub fn point_along(g: &[[f64; 2]], s: f64) -> (f64, f64, f64) {
    let mut acc = 0.0;
    for i in 0..g.len().saturating_sub(1) {
        let dx = g[i + 1][0] - g[i][0];
        let dy = g[i + 1][1] - g[i][1];
        let len = dx.hypot(dy);
        if s <= acc + len || i + 2 == g.len() {
            let t = if len > 0.0 { ((s - acc) / len).clamp(0.0, 1.0) } else { 0.0 };
            return (g[i][0] + dx * t, g[i][1] + dy * t, dy.atan2(dx));
        }
        acc += len;
    }
    (g[0][0], g[0][1], 0.0)
}

/// Compass bearing (degrees clockwise from north) of a math heading in radians.
fn compass(rad: f64) -> f64 {
    (((90.0 - rad * 180.0 / std::f64::consts::PI) % 360.0) + 360.0) % 360.0
}

/// JavaScript `Math.round`: halves round up.
fn js_round(x: f64) -> f64 {
    (x + 0.5).floor()
}

fn round5(b: f64) -> f64 {
    (js_round(b / 5.0) * 5.0) % 360.0
}

fn heading_at(g: &[[f64; 2]], s: f64) -> f64 {
    compass(point_along(g, s).2)
}

/// `String(+v.toFixed(dp) || 0)`.
fn num(v: f64, dp: usize) -> String {
    let r: f64 = format!("{v:.dp$}").parse().unwrap_or(0.0);
    if r == 0.0 {
        "0".into()
    } else {
        format!("{r}")
    }
}

fn control_code(c: Control) -> &'static str {
    match c {
        Control::Signal => "s",
        Control::AllWayStop => "a",
        Control::TwoWayStop => "t",
        Control::Uncontrolled => "u",
        Control::TrafficCircle => "c",
    }
}

/// Midpoint of a block, taken from whichever direction runs north-to-east (stable for two-way streets).
fn block_point(net: &Network, id: u32) -> Option<(f64, f64)> {
    let mut l = net.links.get(id as usize)?;
    let rev = l.reverse.filter(|&r| r != l.id).and_then(|r| net.links.get(r as usize));
    if let Some(r) = rev {
        if heading_at(&l.geometry, polyline_length(&l.geometry) / 2.0) >= 180.0 {
            l = r;
        }
    }
    let p = point_along(&l.geometry, polyline_length(&l.geometry) / 2.0);
    Some((p.0, p.1))
}

/// Link fragment (`#v1;a=...`) for a set of interventions. `area` is the area id, `period` the demand period to open on.
pub fn encode_scenario(net: &Network, origin: (f64, f64), ivs: &[Intervention], area: &str, period: Option<&str>) -> String {
    let proj = Proj::new(origin.0, origin.1);
    let pt = |xy: Option<(f64, f64)>| -> Option<String> {
        let (x, y) = xy?;
        let (lon, lat) = proj.to_lon_lat(x, y);
        Some(encode_geohash(lat, lon, 10))
    };
    let node_pt = |id: u32| pt(net.nodes.get(id as usize).map(|n| (n.x, n.y)));
    let mut items: Vec<String> = Vec::new();
    for iv in ivs {
        let s: Option<String> = match iv.ty.as_str() {
            "modal_filter" => {
                if let Some(l) = iv.link {
                    pt(block_point(net, l)).map(|p| format!("mf,{p}"))
                } else {
                    iv.node.and_then(node_pt).map(|p| format!("mn,{p}"))
                }
            }
            "speed_limit" => iv.link.and_then(|l| pt(block_point(net, l))).map(|p| format!("sl,{p},{}", num(iv.speed.unwrap_or(0.0), 2))),
            "speed_hump" => iv.link.and_then(|l| net.links.get(l as usize)).and_then(|l| {
                let q = point_along(&l.geometry, iv.position.unwrap_or(0.0));
                pt(Some((q.0, q.1))).map(|p| format!("sh,{p}"))
            }),
            "traffic_circle" => iv.node.and_then(node_pt).map(|p| format!("tc,{p}")),
            "control" => iv.node.and_then(node_pt).zip(iv.control).map(|(p, c)| format!("ct,{p},{}", control_code(c))),
            "signal_timing" => iv.node.and_then(node_pt).map(|p| format!("st,{p},{}", num(iv.cycle.unwrap_or(0.0), 1))),
            "one_way" => iv.link.and_then(|l| net.links.get(l as usize)).and_then(|l| {
                let m = point_along(&l.geometry, polyline_length(&l.geometry) / 2.0);
                pt(Some((m.0, m.1))).map(|p| format!("ow,{p},{}", num(round5(compass(m.2)), 0)))
            }),
            "diagonal_diverter" => iv.node.and_then(node_pt).map(|p| format!("dd,{p},{}", num(js_round(iv.bearing.unwrap_or(0.0)) % 180.0, 0))),
            "turn_ban" => {
                let a = iv.from_link.and_then(|l| net.links.get(l as usize));
                let b = iv.to_link.and_then(|l| net.links.get(l as usize));
                match (a, b) {
                    (Some(a), Some(b)) => node_pt(a.to).map(|p| {
                        format!("tb,{p},{},{}", num(round5(heading_at(&a.geometry, polyline_length(&a.geometry))), 0), num(round5(heading_at(&b.geometry, 0.0)), 0))
                    }),
                    _ => None,
                }
            }
            _ => None,
        };
        if let Some(s) = s {
            items.push(s);
        }
    }
    let mut parts: Vec<String> = vec!["v1".into()];
    if !area.is_empty() {
        parts.push(format!("a={area}"));
    }
    if let Some(p) = period {
        parts.push(format!("p={p}"));
    }
    if !items.is_empty() {
        parts.push(format!("s={}", items.join("~")));
    }
    if !items.is_empty() || parts.len() > 2 {
        format!("#{}", parts.join(";"))
    } else {
        String::new()
    }
}
