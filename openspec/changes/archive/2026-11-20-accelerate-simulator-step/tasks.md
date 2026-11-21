## 1. Benchmark

- [x] 1.1 Freeze the reference source and match the wide network and demand to the published assessment.
- [x] 1.2 Measure a release build with whole-hour runs. Find where it spends CPU time.

## 2. Optimize the simulator

- [x] 2.1 Remove repeated work in the measured hot paths while preserving the order of model decisions.

## 3. Check the result

- [x] 3.1 Run the simulator's tests and compare native and WebAssembly outputs to the reference across periods and street filters.
- [x] 3.2 Repeat the reference workload with the optimized code and record measured wall times and the achieved speedup.
