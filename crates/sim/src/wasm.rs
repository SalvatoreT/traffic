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
}

#[wasm_bindgen(js_class = Simulation)]
impl WasmSimulation {
    #[wasm_bindgen(constructor)]
    pub fn new(network_json: &str, demand_json: &str, config_json: &str) -> Result<WasmSimulation, JsError> {
        let inner = crate::sim::Simulation::new(network_json, demand_json, config_json).map_err(|e| JsError::new(&e))?;
        Ok(WasmSimulation { inner })
    }

    #[wasm_bindgen(js_name = setInterventions)]
    pub fn set_interventions(&mut self, json: &str) -> Result<(), JsError> {
        self.inner.set_interventions(json).map_err(|e| JsError::new(&e))
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
    Ok(crate::redistribution::analyze(&net, period, mode, &parse(base_json)?, &parse(scenario_json)?).to_string())
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
