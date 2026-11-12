//! Reference packages: interventions written by hand and located by street names, so they survive network rebuilds.
//! They are evaluated by the same full recheck as the search results and published alongside them.
//!
//! Node interventions: `{ "type": "traffic_circle", "at": ["Street A", "Street B"] }`.
//! Link interventions: `{ "type": "modal_filter", "on": "Street", "between": ["Cross A", "Cross B"] }`.
//! `one_way` also takes `"toward": "Street"` (the kept direction runs toward that street at the block's end), `speed_limit` takes `"mph"`,
//! `control` takes `"control"`, `signal_timing` takes `"cycle"`, `turn_ban` takes `"at"`, `"from"` and `"to"` street names, and
//! `diagonal_diverter` takes `"connect": [["Street A", "north"], ["Street B", "west"]]` (one of the two leg pairs that stay connected;
//! the leg is named by street and the compass direction it leaves the node) or a raw `"bearing"`.

use super::cands::mph_to_mps;
use super::Study;
use crate::diverter::{node_legs, permitted_movements};
use crate::model::{Control, Intervention};
use serde::Deserialize;
use serde_json::Value;

#[derive(Clone, Debug, Deserialize)]
pub struct RefCfg {
    pub id: String,
    pub title: String,
    #[serde(default)]
    pub note: String,
    pub interventions: Vec<Value>,
}

pub fn load(path: &std::path::Path) -> Result<Vec<RefCfg>, String> {
    let b = std::fs::read(path).map_err(|e| format!("cannot read {}: {e}", path.display()))?;
    serde_json::from_slice(&b).map_err(|e| format!("{}: {e}", path.display()))
}

fn same(a: &str, b: &str) -> bool {
    a.trim().eq_ignore_ascii_case(b.trim())
}

fn strs(v: &Value, key: &str) -> Result<Vec<String>, String> {
    v[key].as_array().map(|a| a.iter().filter_map(|x| x.as_str().map(String::from)).collect()).ok_or_else(|| format!("missing array \"{key}\""))
}

/// The one in-study node where all the named streets meet.
pub fn find_node(study: &Study, names: &[String]) -> Result<u32, String> {
    let hits: Vec<u32> = study
        .net
        .nodes
        .iter()
        .filter(|n| n.in_study_area && names.iter().all(|s| study.idx.node_streets[n.id as usize].iter().any(|t| same(t, s))))
        .map(|n| n.id)
        .collect();
    match hits.len() {
        1 => Ok(hits[0]),
        0 => Err(format!("no node inside the study area where {} meet", names.join(" and "))),
        k => Err(format!("{k} nodes inside the study area where {} meet (ids {:?}); name a third street", names.join(" and "), hits)),
    }
}

/// The one in-study block on `on` between the two cross streets.
pub fn find_block(study: &Study, on: &str, between: &[String]) -> Result<usize, String> {
    if between.len() != 2 {
        return Err("\"between\" needs two cross streets".into());
    }
    let has = |n: u32, s: &str| study.idx.node_streets[n as usize].iter().any(|t| same(t, s));
    let hits: Vec<usize> = (0..study.idx.blocks.len())
        .filter(|&b| {
            let k = &study.idx.blocks[b];
            k.in_study && same(&k.name, on) && ((has(k.a, &between[0]) && has(k.b, &between[1])) || (has(k.a, &between[1]) && has(k.b, &between[0])))
        })
        .collect();
    match hits.len() {
        1 => Ok(hits[0]),
        0 => Err(format!("no block of {on} between {} and {} inside the study area", between[0], between[1])),
        k => Err(format!("{k} blocks of {on} between {} and {}", between[0], between[1])),
    }
}

fn compass(dir: &str) -> Result<f64, String> {
    match dir.to_lowercase().as_str() {
        "north" => Ok(0.0),
        "east" => Ok(90.0),
        "south" => Ok(180.0),
        "west" => Ok(270.0),
        d => Err(format!("unknown direction {d}; use north, east, south or west")),
    }
}

fn ang(a: f64, b: f64) -> f64 {
    let d = (a - b).abs() % 360.0;
    d.min(360.0 - d)
}

/// Barrier bearing (whole degrees, 0 to 179) for which the legs named by street and compass direction stay connected.
fn diverter_bearing(study: &Study, node: u32, connect: &[(String, String)]) -> Result<f64, String> {
    let legs = node_legs(&study.topo, &study.net, node);
    if legs.len() != 4 {
        return Err(format!("{} has {} legs, a diverter needs four", study.idx.node_label(node), legs.len()));
    }
    let mut picked: Vec<usize> = Vec::new();
    for (street, dir) in connect {
        let want = compass(dir)?;
        let best = (0..legs.len())
            .filter(|&i| {
                let l = legs[i].outs.first().or(legs[i].ins.first()).copied().unwrap();
                same(&study.net.links[l as usize].name, street) && !picked.contains(&i)
            })
            .min_by(|&a, &b| ang(legs[a].bearing, want).partial_cmp(&ang(legs[b].bearing, want)).unwrap());
        match best {
            Some(i) if ang(legs[i].bearing, want) <= 60.0 => picked.push(i),
            _ => return Err(format!("no {street} leg toward the {dir} at {}", study.idx.node_label(node))),
        }
    }
    if picked.len() != 2 {
        return Err("\"connect\" needs two legs".into());
    }
    let degs: Vec<u32> = (0..180u32)
        .filter(|&d| {
            permitted_movements(&study.topo, &study.net, node, d as f64)
                .map(|ok| legs[picked[0]].ins.iter().any(|&a| legs[picked[1]].outs.iter().any(|&b| ok.binary_search(&(a, b)).is_ok())) || (legs[picked[0]].ins.is_empty() && legs[picked[1]].outs.is_empty()))
                .unwrap_or(false)
        })
        .collect();
    if degs.is_empty() {
        return Err(format!("no diverter at {} connects those two legs (they would sit on opposite sides of any barrier)", study.idx.node_label(node)));
    }
    // The legs may be connected across two separate bearing ranges only if they are adjacent; take the middle of the first range.
    let mut run: Vec<u32> = vec![degs[0]];
    for &d in &degs[1..] {
        if d == *run.last().unwrap() + 1 {
            run.push(d);
        } else {
            break;
        }
    }
    Ok(run[run.len() / 2] as f64)
}

pub fn resolve_one(study: &Study, v: &Value) -> Result<Intervention, String> {
    let ty = v["type"].as_str().ok_or("intervention has no type")?;
    let mut iv = Intervention { ty: ty.into(), ..Default::default() };
    let node = || -> Result<u32, String> { find_node(study, &strs(v, "at")?) };
    let block = || -> Result<usize, String> {
        let on = v["on"].as_str().ok_or("missing \"on\"")?;
        find_block(study, on, &strs(v, "between")?)
    };
    match ty {
        "modal_filter" => {
            if v.get("at").is_some() {
                iv.node = Some(node()?);
            } else {
                iv.link = Some(study.idx.blocks[block()?].links[0]);
            }
        }
        "speed_limit" => {
            iv.link = Some(study.idx.blocks[block()?].links[0]);
            iv.speed = Some(mph_to_mps(v["mph"].as_f64().ok_or("speed_limit needs \"mph\"")?));
        }
        "speed_hump" => {
            let l = study.idx.blocks[block()?].links[0];
            iv.link = Some(l);
            iv.position = Some(v["position"].as_f64().unwrap_or((study.net.links[l as usize].length / 2.0 * 10.0).round() / 10.0));
        }
        "one_way" => {
            let b = &study.idx.blocks[block()?];
            let toward = v["toward"].as_str().ok_or("one_way needs \"toward\" (a street at the end the kept direction runs to)")?;
            let l = b.links.iter().copied().find(|&l| study.idx.node_streets[study.net.links[l as usize].to as usize].iter().any(|t| same(t, toward)));
            iv.link = Some(l.ok_or_else(|| format!("{} does not run toward {toward}", b.label))?);
        }
        "traffic_circle" => iv.node = Some(node()?),
        "control" => {
            iv.node = Some(node()?);
            iv.control = Some(serde_json::from_value::<Control>(v["control"].clone()).map_err(|_| "control needs \"control\" such as all_way_stop".to_string())?);
        }
        "signal_timing" => {
            iv.node = Some(node()?);
            iv.cycle = Some(v["cycle"].as_f64().ok_or("signal_timing needs \"cycle\"")?);
        }
        "turn_ban" => {
            let n = node()?;
            let (from, to) = (v["from"].as_str().ok_or("turn_ban needs \"from\"")?, v["to"].as_str().ok_or("turn_ban needs \"to\"")?);
            let pick = |ls: &[u32], name: &str| -> Result<u32, String> {
                let m: Vec<u32> = ls.iter().copied().filter(|&l| same(&study.net.links[l as usize].name, name)).collect();
                if m.len() == 1 {
                    Ok(m[0])
                } else {
                    Err(format!("{} links of {name} at {}", m.len(), study.idx.node_label(n)))
                }
            };
            iv.from_link = Some(pick(&study.idx.incoming[n as usize], from)?);
            iv.to_link = Some(pick(&study.idx.outgoing[n as usize], to)?);
        }
        "diagonal_diverter" => {
            let n = node()?;
            iv.node = Some(n);
            iv.bearing = Some(match v.get("connect") {
                Some(c) => {
                    let pairs: Vec<(String, String)> = c.as_array().ok_or("\"connect\" must be an array")?.iter().map(|p| (p[0].as_str().unwrap_or("").to_string(), p[1].as_str().unwrap_or("").to_string())).collect();
                    diverter_bearing(study, n, &pairs)?
                }
                None => v["bearing"].as_f64().ok_or("diagonal_diverter needs \"connect\" or \"bearing\"")?,
            });
        }
        t => return Err(format!("unknown intervention type {t}")),
    }
    Ok(iv)
}

/// Resolve every intervention of a reference package; the error names the package and the failing entry.
pub fn resolve(study: &Study, cfg: &RefCfg) -> Result<Vec<Intervention>, String> {
    cfg.interventions.iter().enumerate().map(|(i, v)| resolve_one(study, v).map_err(|e| format!("reference {} intervention {}: {e}", cfg.id, i + 1))).collect()
}
