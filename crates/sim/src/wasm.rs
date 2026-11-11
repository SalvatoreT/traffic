//! Thin wasm-bindgen wrapper exposing the JS class `Simulation`.

use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_name = Simulation)]
pub struct WasmSimulation {
    inner: crate::sim::Simulation,
}

#[wasm_bindgen(js_class = Simulation)]
impl WasmSimulation {
    #[wasm_bindgen(constructor)]
    pub fn new(network_json: &str, demand_json: &str, config_json: &str) -> Result<WasmSimulation, JsError> {
        let inner = crate::sim::Simulation::new(network_json, demand_json, config_json)
            .map_err(|e| JsError::new(&e))?;
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
        self.inner.link_stats()
    }

    pub fn metrics(&self) -> String {
        self.inner.metrics_json()
    }

    pub fn reset(&mut self) {
        self.inner.reset();
    }
}
