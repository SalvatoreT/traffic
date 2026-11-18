use serde::de::DeserializeOwned;
use serde_json::{json, Value};
use std::{collections::BTreeMap, path::{Path, PathBuf}, time::Instant};
use traffic_sim::explore::{self, cands::{self, Cand, Hotspots}, objectives::Objective, report, search::*, Params, RunOut, Study};

fn read(path: &Path) -> Value { serde_json::from_slice(&std::fs::read(path).expect("read JSON")).expect("parse JSON") }
fn write(path: &Path, v: &Value) {
    let tmp = path.with_extension("tmp");
    std::fs::write(&tmp, serde_json::to_vec_pretty(v).unwrap()).expect("write temporary output");
    std::fs::rename(tmp, path).expect("replace output");
}
fn get<T: DeserializeOwned>(v: &Value, key: &str) -> T { serde_json::from_value(v[key].clone()).unwrap_or_else(|e| panic!("{key}: {e}")) }
fn command_output(cmd:&str,args:&[&str])->String{let o=std::process::Command::new(cmd).args(args).output().expect("verification command");assert!(o.status.success(),"verification command failed");String::from_utf8(o.stdout).unwrap().trim().to_string()}
macro_rules! fields { ($o:expr; $($f:ident),* $(,)?) => { json!({$(stringify!($f):$o.$f),*}) }; }
macro_rules! read_fields { ($ty:ident, $v:expr; $($f:ident),* $(,)?) => { $ty { $($f:get($v,stringify!($f))),* } }; }
fn stat_json(s: &PeriodStat) -> Value {
    let mut v=fields!(s; ct_vph,ct_cv_pct,ped_conflicts,bike_conflicts,inside_s,inside_tt_s,unroutable,gridlock,backlog,spawned,block_flow,block_sigma,block_through,block_through_sigma,link_through,link_flow,street_flow,street_speed);
    v["runs"]=json!(s.runs.iter().map(|r| fields!(r;ct_vph,inside_s,inside_tt_s,block_flow,block_through)).collect::<Vec<_>>()); v
}
fn stat_from(v: &Value) -> PeriodStat {
    PeriodStat { ct_vph:get(v,"ct_vph"),ct_cv_pct:get(v,"ct_cv_pct"),ped_conflicts:get(v,"ped_conflicts"),bike_conflicts:get(v,"bike_conflicts"),inside_s:get(v,"inside_s"),inside_tt_s:get(v,"inside_tt_s"),unroutable:get(v,"unroutable"),gridlock:get(v,"gridlock"),backlog:get(v,"backlog"),spawned:get(v,"spawned"),block_flow:get(v,"block_flow"),block_sigma:get(v,"block_sigma"),block_through:get(v,"block_through"),block_through_sigma:get(v,"block_through_sigma"),link_through:get(v,"link_through"),link_flow:get(v,"link_flow"),street_flow:get(v,"street_flow"),street_speed:get(v,"street_speed"),runs:v["runs"].as_array().unwrap().iter().map(|r|read_fields!(RunRec,r;ct_vph,inside_s,inside_tt_s,block_flow,block_through)).collect() }
}
fn run_json(r:&RunOut)->Value {fields!(r;ct_vph,veh_km,inside_n,inside_tt_s,unroutable,gridlock_removed,backlog,spawned,completed,invalid,ped_conflicts,bike_conflicts,flow,through,speed)}
fn run_from(v:&Value)->RunOut {RunOut {ct_vph:get(v,"ct_vph"),veh_km:get(v,"veh_km"),inside_n:get(v,"inside_n"),inside_tt_s:get(v,"inside_tt_s"),unroutable:get(v,"unroutable"),gridlock_removed:get(v,"gridlock_removed"),backlog:get(v,"backlog"),spawned:get(v,"spawned"),completed:get(v,"completed"),invalid:get(v,"invalid"),ped_conflicts:get(v,"ped_conflicts"),bike_conflicts:get(v,"bike_conflicts"),flow:get(v,"flow"),through:get(v,"through"),speed:get(v,"speed"),records:Vec::new()}}
fn baseline_json(b:&Baseline)->Value {json!({"full":b.full.iter().map(stat_json).collect::<Vec<_>>(),"screen":stat_json(&b.screen),"screenRuns":b.screen_runs.iter().map(run_json).collect::<Vec<_>>(),"hot":{"block_ct":b.hot.block_ct,"node_ct":b.hot.node_ct,"mv_ct":b.hot.mv_ct.iter().map(|(&(a,c),&v)|json!([a,c,v])).collect::<Vec<_>>()}})}
fn baseline_from(v:&Value)->Baseline {Baseline {full:v["full"].as_array().unwrap().iter().map(stat_from).collect(),screen:stat_from(&v["screen"]),screen_runs:v["screenRuns"].as_array().unwrap().iter().map(run_from).collect(),hot:Hotspots{block_ct:get(&v["hot"],"block_ct"),node_ct:get(&v["hot"],"node_ct"),mv_ct:v["hot"]["mv_ct"].as_array().unwrap().iter().map(|r|((r[0].as_u64().unwrap() as u32,r[1].as_u64().unwrap() as u32),r[2].as_f64().unwrap())).collect::<BTreeMap<_,_>>()}}}
fn cand_json(study:&Study,i:usize,c:&Cand)->Value {json!({"index":i,"label":c.label,"kind":c.kind,"key":c.key,"link":study.encode(std::slice::from_ref(&c.iv),None),"intervention":c.iv,"nodes":c.nodes,"block":c.block,"places":c.places})}
fn eval_json(ctx:&Ctx,e:&Eval)->Value {
    let raw=e.inc.iter().enumerate().max_by(|(ai,a),(bi,b)|a.total_cmp(b).then(bi.cmp(ai)));
    json!({"set":e.set,"link":ctx.study.encode(&ctx.ivs(&e.set),Some(&ctx.p.periods[0])),"labels":e.set.iter().map(|&i|&ctx.cands[i as usize].label).collect::<Vec<_>>(),"reject":e.reject,"score":e.score,"reductionPct":e.reduction_pct,"harm":e.harm,"detourS":e.detour_s,"worst":e.worst,"worstLabel":ctx.study.idx.blocks[ctx.study.harm_blocks[e.worst]].label,"rawWorst":raw.map(|(i,_)|i),"rawWorstLabel":raw.map(|(i,_)|ctx.study.idx.blocks[ctx.study.harm_blocks[i]].label.clone()),"rawIncrease":raw.map(|(_,x)|*x),"blockIncreases":e.inc})
}
fn eval_from(v:&Value)->Eval {Eval{set:get(v,"set"),reject:get(v,"reject"),score:v["score"].as_f64().unwrap_or(f64::NEG_INFINITY),reduction_pct:get(v,"reductionPct"),harm:get(v,"harm"),detour_s:get(v,"detourS"),worst:get(v,"worst"),inc:get(v,"blockIncreases")}}
fn final_json(ctx:&Ctx,f:&report::Final)->Value {
    json!({"set":f.set,"link":ctx.study.encode(&ctx.ivs(&f.set),Some(&ctx.p.periods[0])),"labels":f.set.iter().map(|&i|&ctx.cands[i as usize].label).collect::<Vec<_>>(),"reject":f.reject,"score":f.score,"baseVph":f.base_vph,"scenarioVph":f.scen_vph,"reductionPct":f.reduction_pct,"harm":f.harm,"worst":f.worst,"worstLabel":ctx.study.idx.blocks[ctx.study.harm_blocks[f.worst]].label,"effect":f.effect.to_json("increase","decrease"),"detour":f.detour.to_json("increase","decrease"),"detourS":f.detour_s,"detourSeeds":f.detour_seeds,"detourVehicleMinutesPerHour":f.detour_vmin_h,"blockThroughChanges":f.block_change,"periods":f.by_period.iter().zip(&ctx.p.periods).map(|(r,p)|json!({"period":p,"baseThrough":r.base_through,"scenarioThrough":r.scen_through,"reductionPct":r.cut_pct,"effect":r.effect.to_json("increase","decrease"),"rawWorst":r.worst,"rawWorstLabel":ctx.study.idx.blocks[ctx.study.harm_blocks[r.worst]].label,"blockBase":r.block_base,"blockScenario":r.block_scen,"blockThroughIncrease":r.block_through_inc,"blockEffect":r.block_effect.to_json("increase","decrease"),"penalty":r.penalty})).collect::<Vec<_>>()})
}
fn finalist_sets(ctx:&Ctx,state:&SearchState)->Vec<Vec<u16>> {
    let mut ids=pick_finalists(&state.evals,ctx.p.finalists,&[]);
    for &obj in ctx.p.objectives.iter().filter(|o|**o!=Objective::MostRemoved) {
        for i in pick_finalists_for(ctx,&state.evals,(ctx.p.finalists/3).max(3),&BeamLimit::for_objective(obj,ctx.p,ctx.cands)) {if !ids.contains(&i){ids.push(i)}}
    }
    ids.iter().map(|&i|state.evals[i].set.clone()).collect()
}
fn snapshot(ctx:&Ctx,state:&SearchState)->Value {
    let best=state.evals.iter().filter(|e|e.valid()).max_by(|a,b|a.score.total_cmp(&b.score).then_with(||b.set.cmp(&a.set)));
    let (best_set,best_score)=match best{Some(e) if e.score>0.0=>(e.set.clone(),e.score),_=>(Vec::new(),0.0)};
    json!({"simulations":state.used,"evaluations":state.evals.len(),"exhausted":state.exhausted,"visitedSets":state.evals.iter().map(|e|&e.set).collect::<Vec<_>>(),"bestScoreSet":best_set,"bestScore":best_score,"bestNonemptyScoreSet":best.map(|e|&e.set),"bestNonemptyScore":best.map(|e|e.score),"nonDominatedSets":non_dominated(&state.evals).iter().map(|&i|&state.evals[i].set).collect::<Vec<_>>(),"finalistSets":finalist_sets(ctx,state),"log":state.log})
}
fn all_sets(cands:&[Cand],depth:usize)->(Vec<Vec<u16>>,usize) {
    fn rec(c:&[Cand],depth:usize,start:usize,cur:&mut Vec<u16>,out:&mut Vec<Vec<u16>>,conflicted:&mut usize){
        if !cur.is_empty(){if cur.iter().enumerate().any(|(a,&i)|cur[a+1..].iter().any(|&j|cands::conflicts(&c[i as usize],&c[j as usize]))){*conflicted+=1;}else{out.push(cur.clone());}}
        if cur.len()==depth{return}
        for i in start..c.len(){cur.push(i as u16);rec(c,depth,i+1,cur,out,conflicted);cur.pop();}
    }
    let(mut sets,mut conflicted)=(Vec::new(),0);rec(cands,depth,0,&mut Vec::new(),&mut sets,&mut conflicted);sets.sort_by(|a,b|a.len().cmp(&b.len()).then(a.cmp(b)));(sets,conflicted)
}

fn main(){
    let args:Vec<String>=std::env::args().skip(1).collect();let mut opts=BTreeMap::new();let mut k=0;
    while k<args.len(){assert!(args[k].starts_with("--") && k+1<args.len(),"arguments use --key value");opts.insert(args[k][2..].to_string(),args[k+1].clone());k+=2;}
    let mode=opts.get("mode").map(String::as_str).unwrap_or("screen");
    let root=PathBuf::from(opts.get("root").expect("--root"));let out=PathBuf::from(opts.get("out").expect("--out"));
    let study=Study::load(&root,"rockridge").expect("load study");
    if mode=="catalog" {
        let mut hot=cands::hotspots(&study,&[],1.0);hot.block_ct.fill(1.0);hot.node_ct.fill(1.0);let cs=cands::generate(&study,&hot,usize::MAX);
        write(&out,&json!({"networkHash":study.net_hash,"demandHash":study.demand_hash,"note":"Structural catalog generated with uniform synthetic hotspot weights; not traffic scores or the production ranked candidate list.","candidates":cs.iter().enumerate().map(|(i,c)|cand_json(&study,i,c)).collect::<Vec<_>>()}));return;
    }
    let manifest_path=PathBuf::from(opts.get("manifest").expect("--manifest"));let manifest=read(&manifest_path);
    if let Some(expected)=manifest["networkSha256"].as_str(){let actual=command_output("sha256sum",&[root.join("public/data/rockridge.network.json").to_str().unwrap()]);assert_eq!(actual.split_whitespace().next().unwrap(),expected,"network sha256 mismatch");}
    if let Some(expected)=manifest["sourceRevision"].as_str(){assert_eq!(command_output("git",&["-C","/workspace/traffic","rev-parse","HEAD"]),expected,"source revision mismatch");}
    let mut p=Params::new("rockridge");p.beam=5;p.expand=12;p.depth=3;p.minutes=60.0;p.screen_minutes=20.0;p.seeds=vec![1,2,3];p.jobs=opts.get("jobs").map(|s|s.parse().expect("jobs integer")).unwrap_or(4);
    if let Some(v)=manifest.get("params"){
        macro_rules! assign{($name:literal,$field:ident)=>{if let Some(x)=v.get($name){p.$field=serde_json::from_value(x.clone()).expect($name);}}}
        assign!("periods",periods);assign!("seeds",seeds);assign!("beam",beam);assign!("expand",expand);assign!("depth",depth);assign!("minutes",minutes);assign!("screenMinutes",screen_minutes);assign!("candidateLocations",candidates);assign!("finalists",finalists);assign!("harmWeight",harm_weight);
    }
    if let Some(s)=opts.get("seeds"){p.seeds=s.split(',').map(|x|x.parse().unwrap()).collect();}
    if let Some(s)=opts.get("periods"){p.periods=s.split(',').map(String::from).collect();}
    p.source_revision=manifest["sourceRevision"].as_str().unwrap_or("unknown").into();
    let mut cs=Vec::new();for spec in manifest["candidates"].as_array().expect("candidates array"){
        let link=if let Some(s)=spec["link"].as_str(){s.to_string()}else{let iv:traffic_sim::model::Intervention=get(spec,"iv");study.encode(&[iv],None)};
        let ivs=explore::decode::decode_scenario(&study.net,&study.topo,study.origin,&link).expect("decode candidate");assert_eq!(ivs.len(),1,"Each candidate must contain one intervention");let old=cs.len();let i=cands::adopt(&study,&mut cs,&ivs[0]);assert_eq!(i as usize,old,"duplicate candidate");
        if let Some(label)=spec["expectedLabel"].as_str(){assert_eq!(label,cs[i as usize].label,"candidate label mismatch")}
        for (field,actual) in [("expectedPermittedMovements",true),("expectedBannedMovements",false)]{if spec.get(field).is_some(){let iv=&ivs[0];let mut got=if actual{traffic_sim::diverter::permitted_movements(&study.topo,&study.net,iv.node.unwrap(),iv.bearing.unwrap())}else{traffic_sim::diverter::banned_movements(&study.topo,&study.net,iv.node.unwrap(),iv.bearing.unwrap())}.expect("valid diverter");let mut expected:Vec<(u32,u32)>=get(spec,field);got.sort();expected.sort();assert_eq!(got,expected,"diverter movement mismatch");}}
    }
    assert!(cs.len()<u16::MAX as usize && !cs.is_empty());
    let metadata=json!({"schema":"search-benchmark-1","manifest":manifest,"sourceRevision":p.source_revision,"simulatorFingerprint":traffic_sim::FINGERPRINT,"networkHash":study.net_hash,"demandHash":study.demand_hash,"calibration":study.calibration,"nodes":study.net.nodes.len(),"links":study.net.links.len(),"periods":p.periods,"seeds":p.seeds,"screenMinutes":p.screen_minutes,"minutes":p.minutes,"beam":p.beam,"expand":p.expand,"depth":p.depth,"harmWeight":p.harm_weight,"candidateLocations":p.candidates,"finalists":p.finalists,"knownPackages":false,"warmStarts":false,"objectives":p.objectives.iter().map(|o|o.id()).collect::<Vec<_>>(),"candidateOrdering":"manifest order","candidates":cs.iter().enumerate().map(|(i,c)|cand_json(&study,i,c)).collect::<Vec<_>>(),"scope":"restricted candidate combinator benchmark on full network; not global optimum or real-world validation"});
    if mode=="describe" {write(&out,&metadata);return}
    let start=Instant::now();let baseline_path=out.with_extension("baseline.json");
    let base=if baseline_path.exists(){let v=read(&baseline_path);assert_eq!(v["metadata"],metadata,"baseline metadata mismatch");eprintln!("loading cached baseline");baseline_from(&v["baseline"])}else{
        eprintln!("running baseline, jobs {}",p.jobs);let b=if mode=="confirm"{run_baseline_full(&study,&p)}else{run_baseline(&study,&p)};write(&baseline_path,&json!({"metadata":metadata,"baseline":baseline_json(&b)}));b
    };
    let ctx=Ctx{study:&study,p:&p,cands:&cs,base:&base};
    if mode=="baseline" {write(&out,&json!({"metadata":metadata,"phase":"baseline-complete","elapsedSecondsThisInvocation":start.elapsed().as_secs_f64()}));return}
    if mode=="confirm" {
        let sets_path=PathBuf::from(opts.get("sets").expect("--sets for confirm"));let input=read(&sets_path);let sets:Vec<Vec<u16>>=get(&input,"sets");
        let mut v=if out.exists(){read(&out)}else{json!({"metadata":metadata,"phase":"confirm","results":[]})};assert_eq!(v["metadata"],metadata);let mut done:Vec<Vec<u16>>=v["results"].as_array().unwrap().iter().map(|r|get(r,"set")).collect();
        for set in sets {assert!(set.iter().all(|&i|(i as usize)<cs.len()));assert!(set.windows(2).all(|x|x[0]<x[1]));if done.contains(&set){continue}explore::check_access(&study,&ctx.ivs(&set)).expect("confirmation set access");eprintln!("confirming {set:?}, {} periods x {} seeds",p.periods.len(),p.seeds.len());let fs=report::recheck(&ctx,std::slice::from_ref(&set));v["results"].as_array_mut().unwrap().push(final_json(&ctx,&fs[0]));done.push(set);write(&out,&v);}
        v["phase"]=json!("complete");v["elapsedSecondsThisInvocation"]=json!(start.elapsed().as_secs_f64());write(&out,&v);return;
    }
    assert_eq!(mode,"screen","unknown mode");
    let generated=cands::generate_with(&study,&base.hot,p.candidates,&p.profile);
    let generated_links:Vec<_>=generated.iter().map(|c|study.encode(std::slice::from_ref(&c.iv),None)).collect();
    let (sets,conflicts)=all_sets(&cs,p.depth);
    let mut result=if out.exists() && read(&out).get("evaluations").is_some(){read(&out)}else{json!({"metadata":metadata,"phase":"initialized","enumeratedNonempty":sets.len()+conflicts,"conflictingPackages":conflicts,"legalCandidateCombinations":sets.len(),"productionCandidateCount":generated.len(),"productionCandidatePresence":cs.iter().map(|c|{let link=study.encode(std::slice::from_ref(&c.iv),None);json!({"label":c.label,"link":link,"present":generated_links.contains(&link)})}).collect::<Vec<_>>(),"harmBlocks":study.harm_blocks.iter().map(|&i|json!({"index":i,"label":study.idx.blocks[i].label,"links":study.idx.blocks[i].links})).collect::<Vec<_>>(),"baseline":{"screen":stat_json(&base.screen),"full":base.full.iter().map(stat_json).collect::<Vec<_>>()},"evaluations":[]})};
    assert_eq!(result["metadata"],metadata,"result metadata mismatch");let mut state=SearchState::new();
    if result.get("beam").is_none(){
        for row in result["evaluations"].as_array().unwrap(){let e=eval_from(row);state.cache.insert(e.set.clone(),state.evals.len());state.evals.push(e);}
        state.used=result["simulations"].as_u64().unwrap_or(0) as usize;
        let mut stages=result["beamStages"].as_array().cloned().unwrap_or_default();
        if let Some(stage)=stages.last(){state.log=get(stage,"log");}
        write(&out,&result);
        for &obj in &p.objectives {if stages.iter().any(|s|s["objective"]==obj.id()){continue}eprintln!("production objective {}",obj.id());beam_search_in(&ctx,&[],&BeamLimit::for_objective(obj,&p,&cs),&mut state);let mut s=snapshot(&ctx,&state);s["objective"]=json!(obj.id());s["objectiveFinalistSets"]=json!(pick_finalists_for(&ctx,&state.evals,(p.finalists/3).max(3),&BeamLimit::for_objective(obj,&p,&cs)).iter().map(|&i|state.evals[i].set.clone()).collect::<Vec<_>>());stages.push(s);result["beamStages"]=json!(stages);result["evaluations"]=json!(state.evals.iter().map(|e|eval_json(&ctx,e)).collect::<Vec<_>>());result["simulations"]=json!(state.used);result["phase"]=json!("beam-progress");write(&out,&result);}
        result["beam"]=snapshot(&ctx,&state);result["beamStages"]=json!(stages);result["phase"]=json!("beam-complete");
    }else{
        for row in result["evaluations"].as_array().expect("evaluations"){let e=eval_from(row);state.cache.insert(e.set.clone(),state.evals.len());state.evals.push(e);}
        state.used=result["simulations"].as_u64().expect("simulations") as usize;state.log=get(&result["beam"],"log");eprintln!("resumed {} recorded evaluations",state.evals.len());
    }
    result["evaluations"]=json!(state.evals.iter().map(|e|eval_json(&ctx,e)).collect::<Vec<_>>());result["simulations"]=json!(state.used);write(&out,&result);
    for chunk in sets.chunks(p.jobs.max(1)){
        let previous=state.evals.len();eval_batch(&ctx,&mut state,chunk.to_vec());if state.evals.len()==previous{continue}result["phase"]=json!("exhaustive");result["evaluations"]=json!(state.evals.iter().map(|e|eval_json(&ctx,e)).collect::<Vec<_>>());result["simulations"]=json!(state.used);result["elapsedSecondsThisInvocation"]=json!(start.elapsed().as_secs_f64());write(&out,&result);eprintln!("exhaustive: {}/{} combinations recorded, {} simulations",state.evals.len(),sets.len(),state.used);
    }
    result["exhaustive"]=snapshot(&ctx,&state);result["phase"]=json!("complete");result["elapsedSecondsThisInvocation"]=json!(start.elapsed().as_secs_f64());write(&out,&result);
}

#[cfg(test)] mod tests {
    use super::*;
    #[test] fn subset_count(){let cs=(0..12).map(|i|Cand{iv:traffic_sim::model::Intervention{ty:"control".into(),node:Some(i),..Default::default()},kind:"control",label:format!("{i}"),key:format!("{i}"),block:None,nodes:vec![i],places:vec![],loc_score:0.0}).collect::<Vec<_>>();let(s,c)=all_sets(&cs,3);assert_eq!(s.len()+c,298);assert_eq!(c,0);assert_eq!(s.iter().filter(|s|s.len()==1).count(),12);assert_eq!(s.iter().filter(|s|s.len()==2).count(),66);assert_eq!(s.iter().filter(|s|s.len()==3).count(),220);}
    #[test] fn checkpoint_roundtrip(){let e=Eval{set:vec![1],reject:Some("no access".into()),score:f64::NEG_INFINITY,reduction_pct:0.0,harm:0.0,detour_s:0.0,worst:0,inc:vec![]};let v=json!({"set":e.set,"reject":e.reject,"score":e.score,"reductionPct":e.reduction_pct,"harm":e.harm,"detourS":e.detour_s,"worst":e.worst,"blockIncreases":e.inc});let r=eval_from(&v);assert_eq!(r.score,f64::NEG_INFINITY);assert_eq!(r.reject,e.reject);}
}
