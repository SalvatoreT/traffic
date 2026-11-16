//! Thin wasm-bindgen wrapper exposing the JS class `Simulation`.

use wasm_bindgen::prelude::*;

/// See `crate::FINGERPRINT`.
#[wasm_bindgen(js_name = simulatorFingerprint)]
pub fn simulator_fingerprint() -> String {
    crate::FINGERPRINT.to_string()
}

#[wasm_bindgen(js_name = Simulation)]
pub struct WasmSimulation {
    inner: crate::sim::Simulation,
    network_json: String,
}

/// The engine's form of an intervention list (`explore::street::expand`): Slow Streets become per-block speed limits. A list with none is passed on untouched.
fn expand_list(network_json: &str, list: &serde_json::Value) -> Result<Option<String>, String> {
    let has = list.as_array().map_or(false, |a| a.iter().any(|v| v["type"] == crate::explore::street::TYPE));
    if !has {
        return Ok(None);
    }
    let net: crate::model::Network = serde_json::from_str(network_json).map_err(|e| format!("network: {e}"))?;
    let ivs: Vec<crate::model::Intervention> = serde_json::from_value(list.clone()).map_err(|e| format!("interventions: {e}"))?;
    serde_json::to_string(&crate::explore::street::expand(&net, &ivs)).map(Some).map_err(|e| e.to_string())
}

#[wasm_bindgen(js_class = Simulation)]
impl WasmSimulation {
    #[wasm_bindgen(constructor)]
    pub fn new(network_json: &str, demand_json: &str, config_json: &str) -> Result<WasmSimulation, JsError> {
        let mut cfg: serde_json::Value = serde_json::from_str(config_json).map_err(|e| JsError::new(&format!("config: {e}")))?;
        let config_json = match expand_list(network_json, &cfg["interventions"]).map_err(|e| JsError::new(&e))? {
            Some(list) => {
                cfg["interventions"] = serde_json::from_str(&list).map_err(|e| JsError::new(&e.to_string()))?;
                cfg.to_string()
            }
            None => config_json.to_string(),
        };
        let inner = crate::sim::Simulation::new(network_json, demand_json, &config_json).map_err(|e| JsError::new(&e))?;
        Ok(WasmSimulation { inner, network_json: network_json.to_string() })
    }

    #[wasm_bindgen(js_name = setInterventions)]
    pub fn set_interventions(&mut self, json: &str) -> Result<(), JsError> {
        let list: serde_json::Value = serde_json::from_str(json).map_err(|e| JsError::new(&format!("interventions: {e}")))?;
        let json = expand_list(&self.network_json, &list).map_err(|e| JsError::new(&e))?.unwrap_or_else(|| json.to_string());
        self.inner.set_interventions(&json).map_err(|e| JsError::new(&e))
    }

    pub fn step(&mut self, seconds: f64) {
        self.inner.step(seconds);
    }

    pub fn time(&self) -> f64 {
        self.inner.time()
    }

    pub fn vehicles(&self) -> Vec<f32> {
        self.inner.vehicles()
    }

    pub fn signals(&self) -> Vec<u8> {
        self.inner.signals()
    }

    #[wasm_bindgen(js_name = linkStats)]
    pub fn link_stats(&self) -> Vec<f32> {
        self.inner.run_link_stats()
    }

    /// Stride 3: intent slot, link id, cumulative through vehicles (see `Simulation::intent_links`).
    #[wasm_bindgen(js_name = intentLinks)]
    pub fn intent_links(&self) -> Vec<f32> {
        self.inner.intent_links()
    }

    /// Stride 4: intent slot, origin node, destination node, cumulative through vehicles (see `Simulation::intent_trips`).
    #[wasm_bindgen(js_name = intentTrips)]
    pub fn intent_trips(&self) -> Vec<f32> {
        self.inner.intent_trips()
    }

    pub fn metrics(&self) -> String {
        self.inner.metrics_json()
    }

    pub fn reset(&mut self) {
        self.inner.reset();
    }

    /// Request records of a traced run (config `trace`), `REQ_STRIDE` values each (see `Simulation::trace_requests`).
    #[wasm_bindgen(js_name = traceRequests)]
    pub fn trace_requests(&self) -> Vec<f64> {
        self.inner.trace_requests()
    }

    /// Link exits of a traced run: request index, link, time as f32 bits (see `Simulation::trace_events`).
    #[wasm_bindgen(js_name = traceEvents)]
    pub fn trace_events(&self) -> Vec<u32> {
        self.inner.trace_events()
    }

    /// Exact counts and coverage of the trace, JSON (see `Simulation::trace_summary`).
    #[wasm_bindgen(js_name = traceSummary)]
    pub fn trace_summary(&self) -> String {
        self.inner.trace_summary()
    }
}

/// Closed movements and legal witnesses of a closure on the effective movement graph, JSON (see `redistribution::analyze`).
#[wasm_bindgen(js_name = redistributionGraph)]
pub fn redistribution_graph(network_json: &str, period: &str, mode: &str, base_json: &str, scenario_json: &str) -> Result<String, JsError> {
    let net: crate::model::Network = serde_json::from_str(network_json).map_err(|e| JsError::new(&format!("network: {e}")))?;
    let parse = |s: &str| -> Result<Vec<crate::model::Intervention>, JsError> {
        if s.trim().is_empty() {
            Ok(Vec::new())
        } else {
            serde_json::from_str(s).map_err(|e| JsError::new(&format!("interventions: {e}")))
        }
    };
    let (base, scenario) = (parse(base_json)?, parse(scenario_json)?);
    let (base, scenario) = (crate::explore::street::expand(&net, &base), crate::explore::street::expand(&net, &scenario));
    Ok(crate::redistribution::analyze(&net, period, mode, &base, &scenario).to_string())
}

/// The established paired estimate (`explore::paired`, method `REPORT_METHOD`) of per-seed differences, JSON with `n`, `mean`, `sd`,
/// `interval` and `status` (`increase`, `decrease`, `unresolved` or `insufficient`).
#[wasm_bindgen(js_name = pairedEffect)]
pub fn paired_effect(diffs: Vec<f64>) -> String {
    let mut v = crate::explore::paired::Paired::of(&diffs).to_json("increase", "decrease");
    v["method"] = crate::explore::paired::REPORT_METHOD.into();
    v["minPairs"] = crate::explore::paired::MIN_PAIRS.into();
    v.to_string()
}
