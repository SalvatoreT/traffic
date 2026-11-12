# Traffic-science bibliography for the North Oakland (Rockridge) neighborhood traffic simulator

Compiled 2026-11-11. Second (verification) pass 2026-11-11.

## READ FIRST: verification method and limits

- Pass 1 (network blocked) verified entries only from search snippets. Pass 2 (this version, 2026-11-11) had `api.crossref.org`, `export.arxiv.org`/`arxiv.org/pdf`, NCBI eutils and several open pages (traffic-simulation.de, FHWA, LibreTexts) reachable. `doi.org` returned 403, and publisher sites (ScienceDirect, SAGE, TRB, NAP, TØI brage) were blocked or paywalled.
- Pass 3 (2026-11-12) added the multimodal parameter sources in section 6 ([Fitzpatrick2006], [OBrien2022], [Twaddle2016] and others), [Lubbe2022] in 5.2 and [FHWA-SSAM2008] in 7.2. Each entry says whether the numbers were read in the source or only in an abstract.
- What was checked, and how:
  - Every entry tagged V-partial or UNVERIFIED in pass 1 was re-resolved against Crossref (DOI lookup or bibliographic query) or the arXiv API. Fields were corrected from those records.
  - About 45 of the "V" entries were spot-checked against Crossref by DOI. All exist. Two had metadata errors (fixed): Marshall & Ferenchak 2019 (article no. 100539, not pp. 285-301) and the CityFlow page range.
  - Equations and parameter values were checked against full text that could be read (arXiv PDFs, Treiber's traffic-simulation.de pages, an FHWA HPMS appendix, an FHWA/SWOV table, a Virginia Tech thesis quoting VT-CPFM, a LibreTexts open textbook, a Wisconsin roundabout-software report quoting NCHRP 572). Each equation block carries a **Checked against:** line naming its source, or **unchecked - from memory**.
- Verification tags:
  - **[V]**: existence and core citation (authors, year, venue, volume/pages/DOI) confirmed by a Crossref or arXiv record (pass 2) or by multiple search records (pass 1, noted where no pass-2 record was possible).
  - **[V-partial]**: the item exists but some field or the content was not confirmed. The gap is flagged inline.
  - **[V-meta]**: metadata confirmed by Crossref/arXiv, but the full text was not read, so content notes come from abstracts only.
  - **[UNVERIFIED]**: not confirmed. Check before citing.
- Still blocked or unread: the Schakel 2010 IDM+ equation (IEEE, paywalled), HCM 6th/7th chapters themselves (only secondary reproductions seen), NCHRP 572/672 text, Webster 1958/1966 originals, Elvik 2013 and the urban exponents of Elvik 2009 (TØI/ScienceDirect blocked), Mahmud 2017 and Allen 1978 text.
- Corrections found in pass 1 (kept for the record):
  - Anvari et al. 2015 authors are Anvari, Bell, Sivakumar, Ochieng (Ben-Akiva is not an author).
  - Keyvan-Ekbatani et al. 2012 authors are Keyvan-Ekbatani, Kouvelas, Papamichail, Papageorgiou.
  - Johari et al. 2021 authors are Johari, Keyvan-Ekbatani, Leclercq, Ngoduy, Mahmassani.
  - Thomas & Aldred 2024 is in *Case Studies on Transport Policy*, not *Journal of Transport & Health*.
- Corrections found in pass 2:
  - [Zhang2022] first author is Yifan Zhang (Zhang, Chen, Wang, Zheng, Wu), *TR-C* 145, 103926; it was listed as "Zhang, C. et al.".
  - [Zhang2024] confirmed as Zhang & Sun, *IEEE TITS* 25(8), 9308-9320. It is calibrated on highD (not pNEUMA).
  - [Mercader2020] is *TR-C* 110, 275-290.
  - [Huang2002] title is "...on Crashes and Injuries" (TRR 1784, 80-90, DOI 10.3141/1784-11); the earlier title text was wrong.
  - [Hymel2019] is *Transport Policy* 76, 57-66.
  - [Ahn2002] co-authors (Ahn, Rakha, Trani, Van Aerde) confirmed; *J. Transp. Eng.* 128(2), 182-190.
  - [Twaddle2014] confirmed (authors, TRR 2434, 140-146), but the Crossref title is "Bicycles in Urban Areas".
  - [Verlinghieri2025] is in *Journal of Transport Geography* 128, 104360.
  - [Loder2019] DOI is 10.1038/s41598-019-51539-5.
  - Equations corrected: MOBIL threshold (0.2 not 0.1 m/s2), ballistic-update stopping rule, Tefft AIS4+ and death figures kept (confirmed), Elvik exponents added (rural), HCM follow-up values confirmed, roundabout capacity equation added. See each block.

---

## 1. Car-following models

### 1.1 Core model: IDM

**[Treiber2000]** [V] Treiber, M., Hennecke, A., Helbing, D. (2000). Congested traffic states in empirical observations and microscopic simulations. *Physical Review E* 62(2), 1805–1824. DOI 10.1103/PhysRevE.62.1805 (Crossref). arXiv cond-mat/0002177 (full text read for the IDM equations).
Introduces the Intelligent Driver Model. Bottlenecks are modeled by locally raising the time headway T.

**IDM equations** (**Checked against:** [Treiber2000] arXiv cond-mat/0002177 Eq. 6-7 and Table I, and traffic-simulation.de/info/info_IDM.html, 2026-11-11):

```
dv/dt = a * [ 1 - (v/v0)^delta - (s*(v,dv)/s)^2 ]
s*(v,dv) = s0 + max(0, v*T + v*dv/(2*sqrt(a*b)))
```

- `v` is speed, `dv = v - v_leader` is the approach rate (positive when closing), `s` is the net bumper-to-bumper gap, `delta = 4`.
- The original [Treiber2000] form is `s* = s0 + s1*sqrt(v/v0) + vT + v*dv/(2*sqrt(ab))`. The project form sets `s1 = 0`, as the paper itself does.
- Parameters: `v0` desired speed, `T` desired time gap, `s0` minimum jam gap, `a` max acceleration, `b` comfortable deceleration.
- **Highway reference values, checked:**
  - [Treiber2000] Table I: v0 = 120 km/h, T = 1.6 s, a = 0.73 m/s², b = 1.67 m/s², s0 = 2 m, delta = 4.
  - [Kesting2010] Table 1 (cars): v0 = 120 km/h, T = 1.5 s, s0 = 2.0 m, a = 1.4 m/s², b = 2.0 m/s² (trucks: 85 km/h, 2.0 s, 4.0 m, 0.7, 2.0).
  - traffic-simulation.de table: car v0 120 km/h, T 1.5 s, s0 2 m, a 0.3 m/s² (deliberately low there to provoke stop-and-go), b 3.0. It states that realistic a is 0.8-2.5 m/s², realistic b is about 2 m/s², and that "for city traffic one would adapt the desired speed while the other parameters essentially can be left unchanged".
- **Model in the simulator:** the IIDM of [Treiber2014] (below) with these parameters. The urban means are those calibrated on signal-discharge data in [Treiber2014]: T = 1.2 s, a = 1.5 m/s2, s0 = 2 m.
- **Urban values for this project, earlier priors** (**unchecked - from memory**; use as priors only): v0 ≈ 25–50 km/h (street limit or local speed), T ≈ 1.0–1.5 s, s0 ≈ 2 m, a ≈ 1.0–1.5 m/s², b ≈ 1.5–2.0 m/s².
  - Calibrate on [Barmpounakis2020] (pNEUMA) or on [Vasconcelos2025].
  - Treat the urban values as priors only.

**[Treiber2013]** [V] Treiber, M., Kesting, A. (2013). *Traffic Flow Dynamics: Data, Models and Simulation.* Springer, Berlin/Heidelberg. ISBN 978-3-642-32459-8. DOI 10.1007/978-3-642-32460-4.
The textbook reference for IDM, the numerics, calibration and fuel consumption. The first implementation reference.

**[Kesting2009]** [V-meta] Kesting, A., Treiber, M., Helbing, D. (2009). Agents for traffic simulation. In: Uhrmacher & Weyns (eds.), *Multi-Agent Systems: Simulation and Applications*, CRC Press, ch. 11, pp. 325–356. DOI 10.1201/9781420070248.ch11. arXiv 0805.0300 (journal_ref confirmed by the arXiv API).
Driver-agent parameterization (reaction time, desired speed, time gap, anticipation). The parameter table was not read; use [Kesting2010] Table 1 and [Treiber2000] Table I for values.

**[Treiber2006]** [V] Treiber, M., Kesting, A., Helbing, D. (2006). Delays, inaccuracies and anticipation in microscopic traffic models. *Physica A* 360(1), 71–88. DOI 10.1016/j.physa.2005.05.001 (Crossref).
Adds finite reaction time, estimation errors modeled as Wiener processes, and anticipation to IDM. This is the canonical stochastic and human-factors extension.

**[Treiber2015]** [V] Treiber, M., Kanagaraj, V. (2015). Comparing numerical integration schemes for time-continuous car-following models. *Physica A* 419, 183–195. arXiv 1403.4881.
DOI 10.1016/j.physa.2014.09.061 (Crossref). Compares Euler, ballistic update, Heun (trapezoidal) and RK4. The ballistic update has only about 30% of Euler's discretization error at equal cost. The paper recommends the ballistic and trapezoidal schemes. For h ≤ 0.5 s the order of performance is RK4, trapezoidal, ballistic, Euler, but RK4 is worst once lane changes are included.
**Implementation note** (**Checked against:** [Treiber2015] arXiv 1403.4881 Eq. 14-15, and traffic-simulation.de which states that any update step below 0.5 s gives essentially the same IDM result):

```
a = a_IDM(x, v, ...)              # evaluated once, at the start of the step
if v + a*dt < 0:                  # vehicle would stop within this step
    x += -v*v / (2*a)             # stopping position (a < 0 here); Eq. 15
    v  = 0
else:
    x += v*dt + 0.5*a*dt*dt
    v += a*dt
```

- **Correction:** the earlier note ("clamp v at zero") is wrong for position. Simply clamping `v` while still adding `0.5*a*dt²` makes the vehicle roll backwards or overshoot its stop. Use the stopping-position rule above.
- Use dt ≈ 0.1–0.5 s (0.2 s suggested).

### 1.2 Variants and improvements

**[Kesting2010]** [V] Kesting, A., Treiber, M., Helbing, D. (2010). Enhanced intelligent driver model to access the impact of driving strategies on traffic capacity. *Phil. Trans. R. Soc. A* 368(1928), 4585–4605. DOI 10.1098/rsta.2010.0084. arXiv 0912.3613.
The "constant-acceleration heuristic" (CAH) blended with IDM (the "ACC model"), which fixes unrealistic braking in cut-in and small-gap situations. Treiber's traffic-simulation.de uses this ACC model as its car-following model.
**Relevance:** this is the fix for cut-ins at merges, filtered diverters and turning movements in the simulator.

**CAH and ACC-blend equations** (**Checked against:** [Kesting2010] arXiv 0912.3613 Eq. 2.3-2.4 and Table 1):

```
a_l~ = min(a_l, a)                                   # leader acceleration, capped at own a
a_CAH = v^2 * a_l~ / (v_l^2 - 2 s a_l~)                              if v_l (v - v_l) <= -2 s a_l~
      = a_l~ - (v - v_l)^2 * Theta(v - v_l) / (2 s)                  otherwise
a_ACC = a_IDM                                                        if a_IDM >= a_CAH
      = (1-c) a_IDM + c a_CAH + b * tanh((a_IDM - a_CAH)/b)          otherwise
```

- `Theta` is the Heaviside step; `c` is the "coolness factor", 0.99 in the paper (realistic range 0.95-1.00).
- The CAH uses `s`, `v`, `v_l` and `a_l`. A simulator that does not track leader acceleration can pass `a_l = 0` (an approximation, not tested here).

**[Treiber2014]** [V] Treiber, M., Kesting, A. (2014). Automatic and efficient driving strategies while approaching a traffic light. *17th International IEEE Conference on Intelligent Transportation Systems (ITSC)*, pp. 1122-1128. DOI 10.1109/ITSC.2014.6957838 (Crossref). arXiv 1408.5498 (full text read, 2026-11-12).
Uses the Improved Intelligent-Driver Model (IIDM) of Chapter 11 of [Treiber2013] (Chapter 11, DOI 10.1007/978-3-642-32460-4_11, Crossref-confirmed) and calibrates it on queue-discharge trajectories at a signal (NGSIM Lankershim Boulevard data).

**IIDM equations** (**Checked against:** [Treiber2014] arXiv 1408.5498 eq. 1-3, which gives the case v <= v0 only):

```
z = s*(v, v_l) / s          s* = s0 + max(v T + v (v - v_l) / (2 sqrt(a b)), 0)      (same as the IDM)
a_free = a [1 - (v/v0)^delta]
dv/dt = a (1 - z^2)                    if z >= 1
      = a_free (1 - z^(2 a / a_free))  otherwise
```

- The paper states that in the IIDM the time-gap parameter T is exactly the steady-state time gap, while the plain IDM follows at a somewhat larger gap, and that a platoon with equal desired speeds does not disperse. The steady-state gap is s0 + v T for v < v0, so the lane capacity is v0 / (T v0 + s0 + L).
- **Calibrated urban values** (identical drivers, read in the paper): effective vehicle length 6.5 m (4.5 m car plus s0 = 2 m), a = 1.5 m/s2, T = 1.2 s, b = 2 m/s2, v0 = 50 km/h. With heterogeneous drivers, independent uniform values of length, T and a with a standard deviation of about 30% of their means reproduce the observed scatter of discharge times.
- **Not read:** the branch for v > v0 (the book chapter). The simulator uses a_free + a (1 - z^2) for z >= 1 and a_free otherwise there, an ASSUMPTION.

**[Schakel2010]** [V] Schakel, W.J., van Arem, B., Netten, B.D. (2010). Effects of cooperative adaptive cruise control on traffic flow stability. *Proc. 13th IEEE ITSC*, Funchal, pp. 759–764. DOI 10.1109/ITSC.2010.5625133.
Crossref confirms the paper. A 2025 IDM review (arXiv 2506.05909) cites IDM+ as resolving the mismatch between the time-gap parameter T and steady-state conditions, but gives no equation. **The IDM+ equation is unchecked - from memory** (the paper is IEEE-paywalled). The usual statement is `a * min[1-(v/v0)^4, 1-(s*/s)^2]`. Because it could not be checked, prefer the CAH/ACC blend above for the cut-in fix, which was checked.

**[Krauss1997]** [V] Krauß, S., Wagner, P., Gawron, C. (1997). Metastable states in a microscopic model of traffic flow. *Physical Review E* 55(5), 5597–5602. DOI 10.1103/PhysRevE.55.5597 (Crossref).
The collision-free, stochastic Krauß model, which is SUMO's default. The cheap alternative if IDM proves too stiff.

### 1.3 Calibration on urban and drone data (recent)

**[Barmpounakis2020]** [V] Barmpounakis, E., Geroliminis, N. (2020). On the new era of urban traffic monitoring with massive drone data: The pNEUMA large-scale field experiment. *Transportation Research Part C* 111, 50–71. DOI 10.1016/j.trc.2019.11.023.
The pNEUMA dataset: 10 drones over about 1.3 km² of central Athens, about 0.5M trajectories, open data (Zenodo, via open-traffic.epfl.ch). Volume and pages (111, 50–71) confirmed by Crossref.

**[Zhang2022]** [V-meta] Zhang, Y., Chen, X., Wang, J., Zheng, Z., Wu, K. (2022). A generative car-following model conditioned on driving styles. *Transportation Research Part C* 145, 103926. DOI 10.1016/j.trc.2022.103926. arXiv 2112.05399.
A hybrid model: an IDM with time-varying parameters (expressing inter- and intra-driver heterogeneity) plus a neural-process generator for driving styles. **Correction:** the first author is Yifan Zhang (the earlier entry said "Zhang, C."). The abstract does not name the dataset, so the earlier "calibrated on pNEUMA" claim is **not confirmed** and has been dropped.

**[Zhang2024]** [V-meta] Zhang, C., Sun, L. (2024). Bayesian calibration of the intelligent driver model. *IEEE Transactions on Intelligent Transportation Systems* 25(8), 9308–9320. DOI 10.1109/TITS.2024.3354102. arXiv 2210.03571.
Hierarchical Bayesian posterior over IDM parameters with Gaussian-process temporally correlated errors (memory-augmented IDM, MA-IDM). The abstract states it is evaluated on **highD** (highway), not urban data. Useful for sampling heterogeneous driver parameters, but its numbers are not urban priors.

**[Zhou2025]** [V] Zhou, S., Zheng, S., Xu, T., Treiber, M., Tian, J., Jiang, R. (2025). On the calibration of stochastic car following models. *Transportation Research Part B* 196, 103224. DOI 10.1016/j.trb.2025.103224 (Crossref confirms the author list). arXiv 2302.04648.
Common calibration objectives (multiple-runs mean error, MLE) are biased for stochastic models. MRMin is near-unbiased. Spacing as the measure of performance does not always beat speed.

**[Vasconcelos2025]** [V] Vasconcelos, L., Bandeira, J.M. (2025). Calibration of the Intelligent Driver Model (IDM) at the microscopic level. *Future Transportation* 5(2), 57. DOI 10.3390/futuretransp5020057.
A two-step urban calibration (manual physical-parameter fit, then bounded simultaneous optimization) on instrumented-vehicle data from an urban route. Crossref confirms the journal record and an earlier preprint (10.20944/preprints202501.0468.v1). The paper's parameters were not read.

**[Punzo2016]** [V] Punzo, V., Montanino, M. (2016). Speed or spacing? Cumulative variables, and convolution of model errors and time in traffic flow models validation and calibration. *Transportation Research Part B* 91, 21–33. DOI 10.1016/j.trb.2016.04.012.
Calibrating on traveled space (a cumulative variable) is more robust than calibrating on speed or acceleration. The NGSIM and IDM use in the paper was not confirmed.

**[Treiber2013cal]** [V] Treiber, M., Kesting, A. (2013). Microscopic calibration and validation of car-following models: a systematic approach. *Procedia – Social and Behavioral Sciences* 80, 922–939. DOI 10.1016/j.sbspro.2013.05.050 (DOI, year and pages confirmed by Crossref). arXiv 1403.4990.
Data preparation, local MLE and global least-squares calibration. A practical recipe.

**[Krajewski2018]** [V] Krajewski, R., Bock, J., Kloeker, L., Eckstein, L. (2018). The highD dataset: A drone dataset of naturalistic vehicle trajectories on German highways for validation of highly automated driving systems. *Proc. 21st IEEE ITSC*, Maui, pp. 2118–2125. DOI 10.1109/ITSC.2018.8569552. arXiv 1810.05642.
About 110k vehicles, 16.5 h. Highway only, so use it for IDM free-flow and lane-change statistics, not urban values.

**[Bock2020]** [V] Bock, J., Krajewski, R., Moers, T., Runde, S., Vater, L., Eckstein, L. (2020). The inD dataset: A drone dataset of naturalistic road user trajectories at German intersections. *2020 IEEE Intelligent Vehicles Symposium (IV)*, pp. 1929–1934. DOI 10.1109/IV47402.2020.9304839. arXiv 1911.07602. Authors and venue confirmed by Crossref and the arXiv API.
Four intersections, 10 h, more than 11.5k road users including cyclists and pedestrians (dataset size from recall, not re-read). Useful for intersection and gap-acceptance statistics. The companion roundabout dataset is Krajewski, Moers, Bock, Vater, Eckstein (2020), "The rounD dataset", *IEEE ITSC 2020* (DOI 10.1109/ITSC45102.2020.9294728, Crossref-confirmed).

**NGSIM:** no separate dataset-paper entry was verified. Cite via [Punzo2016] and the US DOT NGSIM data page if needed. [UNVERIFIED as a standalone entry]

---

## 2. Lane changing

**[Kesting2007]** [V] Kesting, A., Treiber, M., Helbing, D. (2007). General lane-changing model MOBIL for car-following models. *Transportation Research Record* 1999, 86–94. DOI 10.3141/1999-10 (Crossref).
MOBIL, the "minimising overall braking induced by lane changes" model. A conference version is Treiber & Kesting (2009), "Modeling lane-changing decisions with MOBIL", *Traffic and Granular Flow '07*, pp. 211–221, DOI 10.1007/978-3-540-77074-9_19 (Crossref).

**MOBIL equations** (**Checked against:** Kesting/Treiber/Helbing, "An open-source microscopic traffic simulator", arXiv 1012.4913 Eq. 4-5, and Treiber's traffic-simulation.de/info/info_MOBIL.html; the [Kesting2007] paper itself was not read):

```
Safety:    a_n' >= -b_safe                       (new follower's acceleration after the change)
Incentive: [a_c' - a_c] + p * ([a_n' - a_n] + [a_o' - a_o]) > Δa_th  (+ Δa_bias for asymmetric / keep-right rules)
```

- `a_c` is the changer, `a_n` the new follower, `a_o` the old follower. Primed values are after the change. All accelerations come from the longitudinal model (IDM).
- `p` is politeness. Treiber's page: p in ]0, 0.5] is realistic, p = 0 is purely selfish, p = 1 with Δa_th = 0 gives the original "minimise overall braking" rule.
- **Parameter values, checked** (traffic-simulation.de): b_safe = 4 m/s² (must stay below the maximum deceleration of about 9 m/s²), Δa_th = 0.2 m/s² (must stay below the lowest IDM `a` of any vehicle type), keep-right bias Δa_bias = 0.2 m/s² (European rules only).
- **Correction:** the earlier value Δa_th ≈ 0.1 m/s² was wrong; the source value is 0.2 m/s².
- Treiber's own implementation ignores the old follower's term and adds a minimum time between lane changes to prevent lane hopping.
- A statistical MOBIL calibration is mentioned in a Springer paper (s10010-021-00439-0). That paper was not fully identified.
- For urban single-lane-per-direction streets, MOBIL matters mainly on the arterials (Telegraph, College, Claremont). Local streets will not need lane changing in v1.

**[Gipps1986]** [V] Gipps, P.G. (1986). A model for the structure of lane-changing decisions. *Transportation Research Part B* 20(5), 403–414. DOI 10.1016/0191-2615(86)90012-3.
The rule-based hierarchy, designed for urban driving with signals, obstructions and heavy vehicles. Use it for the "should I change lanes now?" decision structure around turns.

**[Zheng2014]** [V] Zheng, Z. (2014). Recent developments and research needs in modeling lane changing. *Transportation Research Part B* 60, 16–32. DOI 10.1016/j.trb.2013.11.009.
The standard survey.

**Gap found:** a recent MOBIL calibration on highD or pNEUMA was searched for and **not found**. Do not claim one exists.

---

## 3. Intersections

### 3.1 Signalized

**[Webster1958]** [V-partial] Webster, F.V. (1958). *Traffic signal settings.* Road Research Technical Paper No. 39, HMSO, London.
Number and role were corroborated by secondary citations (Allsop 1971, SWOV, Salter). No catalog record or full text was seen.

**Webster equations:**

```
C_opt = (1.5 L + 5) / (1 - Y)        L = total lost time (s), Y = Σ critical flow ratios (y = q/s)
Uniform delay d1 = C (1 - g/C)^2 / (2 (1 - (g/C) x))    (= 0.5 C (1-g/C)^2 / (1 - (g/C) x), x capped at 1 in the HCM form)
```

- **Checked against:** C_opt, in the LibreTexts open textbook *Fundamentals of Transportation* (6.02 Traffic Signals), which attributes it to Webster (1958). Also the University of Idaho NIATT lab manual, which says to round up to a multiple of 5 s and takes L as the sum of intergreens (via search summary). The uniform-delay form matches the HCM uniform-delay term as shown in lecture slides (search summary); the HCM chapter itself was not read.
- **Webster's full delay formula** is `d = C(1-λ)²/(2(1-λx)) + x²/(2q(1-x)) − 0.65 (C/q²)^(1/3) x^(2+5λ)` with λ = g/C. **Unchecked - from memory**: search results confirmed the three-part structure (uniform, random, empirical correction) but not the coefficient 0.65 or the exponent. The random term diverges as x → 1, and sources note both models are inaccurate near X = 1 (uniform delay holds well for X ≤ 0.85).
- Saturation flow about 1900 veh/h/lane (HCM) or 1800 (Webster era) and lost time about 4 s per phase: **unchecked - from memory**.

**[Webster1966]** [V-partial] Webster, F.V., Cobbe, B.M. (1966). *Traffic Signals.* Road Research Technical Paper No. 56, HMSO. Existence confirmed indirectly (cited in TRRL Research Report 67, per search summary).

**[FHWA-SIG2004]** [V] Federal Highway Administration (2004). *Signalized Intersections: Informational Guide*, FHWA-HRT-04-091, August 2004. Chapter 7 read at `https://www.fhwa.dot.gov/publications/research/safety/04091/07.cfm` (no DOI found).
States that the HCM 2000 uses a default ideal saturation flow of 1,900 passenger cars per hour per lane (3.6 m lanes, through movements only, no pedestrians, bicyclists or grades), that saturation headway is measured from the fourth vehicle in the queue, that saturation flow rates "have been observed to range between 1,500 and 2,000 passenger cars per hour per lane", and that effective green is displayed green minus start-up loss plus end gain. It also gives the 1985 HCM planning capacity of about 1,400 veh/h for the critical lane at a signalized intersection.

**[FHWA-STM2008]** [V] Federal Highway Administration (2008). *Signal Timing Manual*, FHWA-HOP-08-024. Chapter 3 read at `https://ops.fhwa.dot.gov/publications/fhwahop08024/chapter3.htm` (no DOI found; the 2nd edition is NCHRP Report 812, DOI 10.17226/22097, not read).
States that the start-up lost time "is commonly assumed to be approximately 2 seconds", that after about the fourth vehicle the flow stabilizes at the saturation flow rate, that the ideal saturation flow rate is typically assumed to be 1,900 passenger cars per hour per lane, and that yellow extension (vehicles that cross during the yellow) is a further effect to account for in effective green.

**[Varaiya2013]** [V] Varaiya, P. (2013). The max-pressure controller for arbitrary networks of signalized intersections. In: Ukkusuri & Ozbay (eds.), *Advances in Dynamic Network Modeling in Complex Transportation Systems*, Springer, pp. 27–66. DOI 10.1007/978-1-4614-6243-9_2 (Crossref confirms title, pages and DOI; the Crossref container is listed as "Complex Networks and Dynamic Systems"). A *Transportation Research Part C* version ("Max pressure control of a network of signalized intersections", 2013) was **not found**. The chapter is the confirmed source.

**Max-pressure rule** (**Checked against:** Liu & Gayah, "A novel max pressure algorithm based on traffic delay", arXiv 2202.03290 Eq. 1-3, which restates Varaiya's original; [Varaiya2013] itself was not read):

```
w(l,m) = x(l,m) - Σ_{n in O_m} H(m,n) x(m,n)       # movement weight: own queue minus turn-ratio-weighted downstream queues
p(S_j) = Σ_{(l,m) in S_j} C(l,m) w(l,m)            # phase pressure; C = saturation flow of the movement
S*     = argmax_j p(S_j)
```

- This matches the earlier written form. In the original ("Original-MP") model `x` is the vehicle count on a point-queue link and downstream capacity is treated as infinite.
- **Property:** decentralized, needs no demand knowledge, and maximally stabilizing (serves all demand that any signal plan can serve). Strong v1 adaptive controller. Known weakness: it ignores finite link storage and spillover (the motivation for [Kouvelas2014] and travel-time variants).

**[Kouvelas2014]** [V] Kouvelas, A., Lioris, J., Fayazi, S.A., Varaiya, P. (2014). Maximum pressure controller for stabilizing queues in signalized arterial networks. *Transportation Research Record* 2421, 133–141. DOI 10.3141/2421-15 (Crossref). The arterial extension, accounting for finite link storage.

**[Mercader2020]** [V] Mercader, P., Uwayid, W., Haddad, J. (2020). Max-pressure traffic controller based on travel times: An experimental analysis. *Transportation Research Part C* 110, 275–290. DOI 10.1016/j.trc.2019.10.002 (Crossref). Cycle-based travel-time weights. Liu & Gayah (arXiv 2202.03290) describe it as using travel time per cycle as the weight, which grows convexly with queue length. The "first real-world implementation" claim is the authors' own and was not checked. Follow-ups by Zoabi & Haddad (2022 ITSC, 2025 *TR-C* 175, 105070) exist in Crossref.

**[Wei2019]** [V] Wei, H., Chen, C., Zheng, G., Wu, K., Gayah, V., Xu, K., Li, Z. (2019). PressLight: Learning max pressure control to coordinate traffic signals in arterial network. *Proc. 25th ACM SIGKDD*, pp. 1290–1298. DOI 10.1145/3292500.3330949 (Crossref).
RL reward built on max-pressure theory. A reference for later, learning-based signal retiming.

### 3.2 Unsignalized, all-way stop

**[HCM7]** [V-partial] Transportation Research Board (2022). *Highway Capacity Manual 7th Edition: A Guide for Multimodal Mobility Analysis.* National Academies Press.
Whether the 7th-edition AWSC model changes from the 2010/6th edition is not confirmed. Sources conflict. HCM 6th ed. (2016) is the safer cite, and the model is the same iterative departure-headway method.
Seen: the departure headway is a base plus adjustments for left, right and heavy vehicles, with the iteration starting at 3.2 s (NCHRP guidebook snippet). Per-degree-of-conflict saturation headway values were **not** seen. They must be taken from the HCM chapter.
**Read 2026-11-12:** the HCM 7 base saturation headways (3.9, 4.7, 5.8, 7.0 and 9.6 s for cases 1 to 5) are in [NCHRP08-135]. **Simulator note:** for v1, model AWSC by first-come-first-served with a discharge headway of about 3–4 s, falling to about 2–3 s in same-direction platoons (recalled, UNVERIFIED).

**[NCHRP08-135]** [V-partial] Rural Highway Analysis Guidebook (NCHRP Project 08-135), chapter 10, "All-Way Stop-Controlled Intersection Analysis Methodology", `https://nchrp-08-135.github.io/Guidebook/HCMawsc.html` (read 2026-11-12). Reproduces the HCM 7th edition AWSC procedure. **HCM 7 Exhibit 21-15**, base saturation headway for geometry group 1 (one-lane approaches): case 1 3.9 s, case 2 4.7 s, case 3 5.8 s, case 4 7.0 s, case 5 9.6 s (the cases are degrees of conflict). Departure headway is the probability-weighted sum over the cases (eq. 21-28) and the iteration starts at 3.2 s. The adjustment values for left turns, right turns and heavy vehicles and the case probabilities were not read here. The HCM itself was not opened, so this entry vouches for [HCM7] only through the reproduction.

### 3.3 Unsignalized, gap acceptance

**[Brilon1999]** [V] Brilon, W., Koenig, R., Troutbeck, R.J. (1999). Useful estimation procedures for critical gaps. *Transportation Research Part A* 33(3–4), 161–186. DOI 10.1016/S0965-8564(98)00048-2.
Recommends maximum likelihood (Troutbeck) and Hewitt's method. The test criterion is independence from major-street volume.

**Gap-acceptance equations:**

```
Potential capacity of a minor movement (HCM TWSC / Harders form):
c_p = v_c * exp(-v_c * t_c / 3600) / (1 - exp(-v_c * t_f / 3600))
      v_c = conflicting flow (veh/h), t_c = critical gap (s), t_f = follow-up time (s)
Per-driver rule in microsim: accept the first lead/lag gap >= t_c (draw t_c from a lognormal for heterogeneity).
```

- **Checked against:** the FHWA HPMS Field Manual Appendix 6 (fhwa.dot.gov/ohim/hpmsmanl/appn6.cfm), which reproduces the HCM-2000 TWSC potential-capacity method: `c_p,x = v_c,x e^(-v_c,x t_c,x/3600) / (1 - e^(-v_c,x t_f,x/3600))`, with `t_c,x = t_c,base + P_HV t_c,HV` (t_c,HV = 1.0 s for roads with at most two through lanes, else 2.0) and `t_f,x = t_f,base + P_HV t_f,HV` (t_f,HV = 0.9 s, else 1.0). The microsim accept-rule and the lognormal heterogeneity are design choices, not from a source.
- **Base values, checked against a secondary reproduction of the HCM:**
  - FHWA HPMS Table 11 (HCM-2000-based): right turn t_c = 6.2 s, t_f = 3.3 s; through t_c = 6.5 s, t_f = 4.0 s; left turn t_c = 7.1 s, t_f = 3.5 s.
  - PTV Visum documentation (states it follows HCM 6th ed., which is essentially unchanged from 2010): t_c,base major left 4.1, minor right 6.2 (6.9 on roads with 4 or more major lanes), minor through 6.5, minor left 7.1 (7.5 with 4+ lanes).
  - Major-street left t_f = 2.2 s: seen in one study guide citing HCM 7th ed. only. **The HCM chapter tables were not read**, so treat these as the standard defaults but confirm the exact HCM 6/7 values (which also include adjustments for grade, T-intersections and two-stage gaps) before claiming HCM compliance.

**[TxDOT-TSAP]** [V] Texas Department of Transportation. *Traffic and Safety Analysis Procedures Manual*, section 3.2.8 "Validation", Tables 3-1 and 3-2, `https://www.txdot.gov/manuals/des/tsp/chapter-3-traffic-volume-and-forecasting-/3-2-existing-traffic-volumes/3-2-8-validation.html` (read 2026-11-12). The tables give the capacities of the HCM 7th edition: basic freeway segment, per lane, free-flow speed 75 mph 2,400, 70 mph 2,400, 65 mph 2,350, 60 mph 2,300, 55 mph 2,250 pc/h/ln; multilane highway 45 mph 1,900 and 50 mph 2,000 pc/h/ln; single-lane ramp, free-flow speed above 50 mph 2,200, above 40 to 50 mph 2,100, above 30 to 40 mph 2,000, 20 to 30 mph 1,900, below 20 mph 1,800 pc/h. A secondary reproduction of the HCM table, so the HCM itself is still unread.

### 3.4 Roundabouts and mini-circles

**[Rodegerdts2010]** [V-partial] Rodegerdts, L. et al. (2010). *Roundabouts: An Informational Guide, 2nd ed.*, NCHRP Report 672, TRB. No record or text was retrieved in either pass (TRB hosts unreachable). It is a widely cited report, but this session cannot confirm the details. Roundabout capacity values below come from **NCHRP Report 572** (Rodegerdts et al., 2007, *Roundabouts in the United States*, a separate report), which was seen only as quoted in a secondary report (see [Rodegerdts2007]).

**[Rodegerdts2007]** [V-partial] Rodegerdts, L. et al. (2007). NCHRP Report 572, TRB. Existence and role confirmed by a Wisconsin roundabout-software evaluation report (topslab.wisc.edu, RoundaboutSoftwareEvaluation-Final.pdf): "published in 2007... eighteen single-lane and seven two-lane sites", with the HCM 2010 adopting its single-lane model. The report itself was not read.

**Roundabout entry capacity** (**Checked against:** the same Wisconsin report's model table, which lists the NCHRP/HCM-2010 single-lane model with intercept 1130 pcu/h and slope 1.00×10⁻³; equation typography was not extractable, so the exponential form is the standard reading of that table):

```
c_entry = 1130 * exp(-1.0e-3 * v_circ)         pcu/h, single-lane entry, v_circ = circulating flow (pcu/h)
generic Siegloch form used for calibration: c = (3600/t_f) * exp(-v_circ * (t_c - t_f/2) / 3600)
```

- The report states the two-lane models have the same 1130 intercept with slightly different slopes (right lane versus left lane differ by at most about 28 pcu/h).
- Calibration is by changing t_c and t_f, which move the intercept and slope. Typical values: **unchecked - from memory** (single-lane t_c ≈ 4-5 s, t_f ≈ 2.6-3.1 s). One source in pass 1 quoted an HCM 2016 average follow-up headway of about 2.6 s (secondary).
- Per the FHWA "Accelerating Roundabouts" summary seen in pass 1, HCM 2010 tends to underestimate capacity.
- The same report notes local calibration can differ materially from the NCHRP 572 model (Wisconsin sites had follow-up headways about 0.5 s lower).

**[Retting2001]** [V] Retting, R.A., Persaud, B.N., Garder, P.E., Lord, D. (2001). Crash and injury reduction following installation of roundabouts in the United States. *American Journal of Public Health* 91(4), 628–631. DOI 10.2105/AJPH.91.4.628 (Crossref; author list not returned in the record).
Empirical Bayes before/after at 24 intersections converted from signal or stop control: about −38% all crashes and about −76% injury crashes. About −90% for fatal/incapacitating, as reported in the abstract.
**Caveat:** these are mostly single-lane, higher-volume intersections, not neighborhood mini-circles. Do not transfer the magnitudes to residential traffic circles without adjustment.

---

## 4. Network-level dynamics, route choice, demand

### 4.1 Macroscopic fundamental diagram (MFD)

**[Daganzo2007]** [V] Daganzo, C.F. (2007). Urban gridlock: Macroscopic modeling and mitigation approaches. *Transportation Research Part B* 41(1), 49–62. DOI 10.1016/j.trb.2006.03.001.
Aggregate neighborhood accumulation-based models and perimeter control. Corrigendum in vol. 41(3), p. 379.

**[Geroliminis2008]** [V] Geroliminis, N., Daganzo, C.F. (2008). Existence of urban-scale macroscopic fundamental diagrams: Some experimental findings. *Transportation Research Part B* 42(9), 759–770. DOI 10.1016/j.trb.2008.02.002.
Yokohama detectors plus taxi GPS. A low-scatter relation between network flow and density, linked to trip completion rate.

**[Geroliminis2011]** [V] Geroliminis, N., Sun, J. (2011). Properties of a well-defined macroscopic fundamental diagram for urban traffic. *Transportation Research Part B* 45(3), 605–617. DOI 10.1016/j.trb.2010.11.004 (Crossref).
The spatial distribution of density drives scatter. No well-defined MFD for freeways (hysteresis).

**[Gayah2011]** [V] Gayah, V.V., Daganzo, C.F. (2011). Clockwise hysteresis loops in the macroscopic fundamental diagram: An effect of network instability. *Transportation Research Part B* 45(4), 643–655. DOI 10.1016/j.trb.2010.11.006.
Loops arise from uneven congestion, especially when drivers do not reroute. Adaptive route choice reduces them.

**[Keyvan2012]** [V] Keyvan-Ekbatani, M., Kouvelas, A., Papamichail, I., Papageorgiou, M. (2012). Exploiting the fundamental diagram of urban networks for feedback-based gating. *Transportation Research Part B* 46(10), 1393–1403. DOI 10.1016/j.trb.2012.06.008.
Perimeter gating, reducing delay in a Chania case study.

**[Loder2019]** [V] Loder, A., Ambühl, L., Menendez, M., Axhausen, K.W. (2019). Understanding traffic capacity of urban networks. *Scientific Reports* 9, 16283. DOI 10.1038/s41598-019-51539-5 (DOI from Crossref; article number from pass 1).
More than 40 cities. Network topology explains about 90% of the variation in the MFD critical point. Critical accumulation scales sublinearly with network size.
**Use:** the validation check. The simulated neighborhood's MFD (accumulation against trip completion rate) should show a plausible peak.

**[Johari2021]** [V] Johari, M., Keyvan-Ekbatani, M., Leclercq, L., Ngoduy, D., Mahmassani, H.S. (2021). Macroscopic network-level traffic models: Bridging fifty years of development toward the next era. *Transportation Research Part C* 131, 103334. DOI 10.1016/j.trc.2021.103334.
Review covering equilibrium and dynamic network models, MFD-based control and open gaps.

### 4.2 Route choice and assignment

**[Wardrop1952]** [V] Wardrop, J.G. (1952). Some theoretical aspects of road traffic research. *Proc. Institution of Civil Engineers* 1(3), 325–362. DOI 10.1680/ipeds.1952.11259 (Crossref confirms the pages).
The user-equilibrium and system-optimum principles.

**[Beckmann1956]** [V-partial] Beckmann, M., McGuire, C.B., Winsten, C.B. (1956). *Studies in the Economics of Transportation.* Yale University Press. Confirmed through retrospectives (Boyce; Nagurney).
Mathematical formulation of Wardrop's first principle.

**[BPR1964]** [V-partial] Bureau of Public Roads (1964). *Traffic Assignment Manual.* US Department of Commerce. The primary document was **not** seen. The function is confirmed through secondary sources (**unchecked against the primary**).
`t = t0 * (1 + α (v/c)^β)` with the default α = 0.15, β = 4 (snippet). These defaults are known to fit poorly for some road types.
**Note:** for a microsim, travel times come from simulation (equilibrium by iterating), so BPR is only a fast prior or a heuristic router.

**[Peeta2001]** [V] Peeta, S., Ziliaskopoulos, A.K. (2001). Foundations of dynamic traffic assignment: The past, the present and the future. *Networks and Spatial Economics* 1(3/4), 233–265. DOI 10.1023/A:1012827724856 (Crossref).
The DTA survey.

**[BarGera2002]** [V] Bar-Gera, H. (2002). Origin-based algorithm for the traffic assignment problem. *Transportation Science* 36(4), 398–417. DOI 10.1287/trsc.36.4.398.549.
A converging alternative to Frank–Wolfe. A later *Transportation Science* note reports a flaw in the second-derivative step. This is probably overkill for a neighborhood-sized network.

**Practical v1 route choice** (design suggestion, no citation): iterative day-to-day updating with MSA-style blending, or perturbed shortest paths (stochastic user equilibrium via logit), on a network of a few hundred links, run client-side.

### 4.3 Demand generation

**[LODES]** [V-partial] US Census Bureau, LEHD Origin-Destination Employment Statistics (LODES), v8, block-level OD, RAC and WAC files. `https://lehd.ces.census.gov/data/lodes/LODES8/`. Technical documentation: LODESTechDoc8.4.pdf.
Home-side flows are partially synthetic and work-side flows carry noise infusion, so counts at small areas are approximate. Provides commute OD at block level. The search found no ready-made paper on using LODES to drive trip generation, so none is cited.
**Gap partly filled (pass 2):**

**[Sen2025]** [V-meta, preprint] Sen, R., Talusan, J.P., Dubey, A., Mukhopadhyay, A., Samaranayake, S., Laszka, A. (2025). MoveOD: Synthesizing origin-destination commute distribution from U.S. Census data. arXiv 2510.18858 (authors, title and date confirmed by the arXiv API; not known to be peer-reviewed). An open-source pipeline combining ACS departure-time and travel-time distributions with LODES residence-to-workplace flows, county geometry and a road network to produce commuter OD tables with departure times for any US county. The authors report a Hamilton County, TN case (about 150k synthetic trips). The most directly relevant LODES-to-OD source found. Full text not read beyond the abstract.

**[Matet2024]** [V-meta] Matet, B., Côme, E., Furno, A., Hörl, S., Oukhellou, L., El Faouzi, N.-E. (2024). Improving the generation of synthetic travel demand using origin–destination matrices from mobile phone data. *Transportation* 53(3), 1107–1139. DOI 10.1007/s11116-024-10524-2 (Crossref). Uses mobile-phone OD matrices, **not LODES**. Relevant only as a method for calibrating synthetic demand to an observed OD matrix. (Initial name spelling "El Faouzi N" in Crossref; full given name not confirmed.)

Still **not found:** a peer-reviewed paper that specifically turns LODES block-level flows into microsimulation trips for a neighborhood. LODES also covers only commute trips (about a fifth of trips), so non-work trips need another source.

**Demand-synthesis methods and datasets (added 2026-11-11 for `data/demand/README.md`):**

**[DemingStephan1940]** [V] Deming, W.E., Stephan, F.F. (1940). On a least squares adjustment of a sampled frequency table when the expected marginal totals are known. *Annals of Mathematical Statistics* 11(4), 427–444. DOI 10.1214/aoms/1177731829 (Crossref). The origin of iterative proportional fitting (IPF). Stephan (1942), *Ann. Math. Stat.* 13(2), 166–178, DOI 10.1214/aoms/1177731604 (Crossref), gives the iterative form. Content not read.

**[Furness1965]** [UNVERIFIED] Furness, K.P. (1965). Time function iteration. *Traffic Engineering and Control* 7(7), 458–460. Cited from memory as the origin of the doubly-constrained "Furness" balancing used in trip distribution. A search for it found no record, and Crossref does not index the journal. Cite it as "Furness balancing = IPF" via [DemingStephan1940] until a record is seen.

**[Fratar1954]** [V-partial] Fratar, T.J. (1954). Vehicular trip distribution by successive approximations. *Traffic Quarterly* 8(1), 53–65. Confirmed by a TRID record (trid.trb.org/View/692385) and by a reference list in an ASCE paper (1993). No DOI, and the text was not read. A different 1954 item, Fratar/Voorhees/Raff in *Highway Research Board Proceedings* 33 (TRID 120891), shares the topic and should not be conflated.

**[VanZuylen1980]** [V-meta] Van Zuylen, H.J., Willumsen, L.G. (1980). The most likely trip matrix estimated from traffic counts. *Transportation Research Part B: Methodological* 14(3), 281–293. DOI 10.1016/0191-2615(80)90008-9 (Crossref record read 2026-11-12: title, both authors, volume, issue, pages). Crossref carries no abstract and the paper was not opened, so only its title is relied on: it states the problem of estimating an origin-destination table from link counts by the most likely table. The scaling rule in `tools/lib/fit-counts.ts` is our own implementation of count-based matrix adjustment and was not checked against this paper's equations.

**[Willumsen1981]** [V-meta] Willumsen, L.G. (1981). Simplified transport models based on traffic counts. *Transportation* 10(3), 257–278. DOI 10.1007/BF00148462 (Crossref record read 2026-11-12: title, author, volume, issue, pages). Not opened; no abstract in Crossref. Cited with [VanZuylen1980] as the count-based matrix estimation literature. A Crossref search for a 1990 gradient-approach paper on OD matrix adjustment returned no matching record, so none is cited.

**[PowellSheffi1982]** [V-meta] Powell, W.B., Sheffi, Y. (1982). The convergence of equilibrium algorithms with predetermined step sizes. *Transportation Science* 16(1), 45–55. DOI 10.1287/trsc.16.1.45 (Crossref record and abstract read 2026-11-12: authors, volume, issue, pages, date). The abstract says a predetermined sequence of step sizes in a descent direction converges to the equilibrium assignment under regularity conditions; the paper itself was not opened, so the step rule of 1/n (the method of successive averages) is the standard choice named here, not a quotation. Used in `tools/lib/assign.ts` (`assignMsa`) for the averaging of the passes. Sheffi's textbook *Urban Transportation Networks* (Prentice-Hall, 1985) treats the same method; its chapters were not reachable from this environment and it is not cited.

**[Spiess1990]** [V-meta] Spiess, H. (1990). Technical Note—Conical Volume-Delay Functions. *Transportation Science* 24(2), 153–158. DOI 10.1287/trsc.24.2.153 (Crossref record and abstract read 2026-11-12). The abstract calls the BPR volume-delay functions "widely used" and proposes conical functions as an alternative; the paper was not opened. Cited only for the existence and wide use of the BPR form, travel time = free-flow time x (1 + alpha (volume / capacity)^beta). The values alpha 0.15 and beta 4 used in `tools/lib/assign.ts` are the commonly quoted ones and were not read in a source: they are labeled ASSUMPTION wherever used. The original Bureau of Public Roads *Traffic Assignment Manual* (1964) was not found in Crossref and is not cited.

**[ITE-TGM11]** [V-partial] Institute of Transportation Engineers (2021). *Trip Generation Manual, 11th Edition.* ITE, Washington, DC. ISBN 978-1-7345078-7-4. Released September 2021 (TRID 1886990; ITE and Wisconsin DOT pages seen via search). Confirmed as the current edition as of the search; no newer edition was seen. The manual is paid and its rates were not read, so none are quoted. The README's per-worker and per-job daily trip rates are not taken from it.

**[FHWA-TMG2022]** [V-partial] Federal Highway Administration (2022). *Traffic Monitoring Guide.* Office of Highway Policy Information, December 2022. fhwa.dot.gov/policyinformation/tmguide/2022_TMG.pdf. The report and its date were seen in search results; the PDF was not opened. FHWA's traffic-data highlights page defines K-factor as the share of AADT in the design hour (K-30, K-50, K-100 are the 30th, 50th and 100th highest hours as a percentage of AADT) and DDHV = AADT × K × D. The pocket guide is FHWA-PL-18-027 (August 2018). **The 0.08–0.10 urban-arterial K range and the 0.09 value used in the README were not found in any source opened** (the HCM 7th ed. is [HCM7], DOI 10.17226/26432, now Crossref-confirmed; its K values were not read).

**[OaklandTMC]** [V] City of Oakland, OakDOT. *Annual Multi-Modal Counts, Raw Data* (dataset amtg-eh64). `https://data.oaklandca.gov/d/amtg-eh64`, file OaklandTurningMovementCounts.zip (about 35 MB). Confirmed by the Socrata metadata API on 2026-11-11 (name, attribution OakDOT, file size). Description: annual bicycle and pedestrian count program begun September 2011. No license field was checked beyond the README's note.

**[CaltransAADT]** [V] California Department of Transportation. *Annual Average Daily Traffic (AADT)*, ArcGIS FeatureServer layer 0. `https://caltrans-gis.dot.ca.gov/arcgis/rest/services/CHhighway/Traffic_AADT/FeatureServer/0`. Service metadata read on 2026-11-11: AADT is the annual total divided by 365, and the count year runs from 1 October to 30 September. Each year's vintage was not recorded here; the README uses the 2023-24 count year.

**[CaltransRampADT]** [V] California Department of Transportation, Traffic Operations, Traffic Census Program. *Ramp Volumes on the California State Freeway System, District 4* (annual xlsx workbooks of ramp ADT by route and postmile). Index page `https://dot.ca.gov/programs/traffic-operations/census`; files `https://dot.ca.gov/-/media/dot-media/programs/traffic-operations/documents/census/2021/d04-ramp-adt-2021-a11y.xlsx` (publication years 2012-2021) and `.../2024/2024-d4-ramp-adt-a11y.xlsx` (2015-2024). Downloaded and read on 2026-11-11 (HTTP 200; SR-24 rows at PM R3.064-R3.360 checked). Ramp ADT, not AADT: column values are the count-year ADT; the Claremont and Telegraph ramps only carry a 2012 value in these files.

---

## 5. Evidence on interventions

### 5.1 Low-traffic neighborhoods and modal filters

**[Cairns2002]** [V] Cairns, S., Atkins, S., Goodwin, P. (2002). Disappearing traffic? The story so far. *Proc. ICE – Municipal Engineer* 151(1), 13–22. DOI 10.1680/muen.2002.151.1.13.
The classic "traffic evaporation" paper. 63 cases (49 from the 1998 study plus 14), ten countries. Predicted traffic problems are often overstated, and drivers respond in more ways than planners assume.
**Caveat:** the explanations come largely from temporary closures, and the authors call them tentative.

**[Aldred2021]** [V] Aldred, R., Goodman, A. (2020). Low traffic neighbourhoods, car use, and active travel: evidence from the People and Places survey of Outer London active travel interventions. *Findings* (Nov 2020), DOI 10.32866/001c.17128 (Crossref; the venue is *Transport Findings*). Note the key year is 2021 but the paper is 2020. A follow-up exists: Aldred & Goodman (2021), *Findings*, DOI 10.32866/001c.21390.
Reduced car ownership and use, and more active travel, are found only where LTNs were introduced (mini-Holland, 2016–19). A self-reported survey.

**[Laverty2021]** [V] Laverty, A.A., Aldred, R., Goodman, A. (2021). The impact of introducing low traffic neighbourhoods on road traffic injuries. *Findings*, DOI 10.32866/001c.18330 (Crossref) (Waltham Forest, Stats19 2012–2019). Reported about a threefold decline in injuries inside the LTNs, relative to the rest of Waltham Forest and Outer London.
Exact adjusted effect sizes were not read.

**[Goodman2021]** [V-meta] Goodman, A., Furlong, J., Laverty, A.A., Thomas, A., Aldred, R. (2021). Impacts of 2020 low traffic neighbourhoods in London on road traffic injuries. *Findings*, DOI 10.32866/001c.25633 (Crossref). Result numbers were not read.

**[Thomas2024]** [V] Thomas, A., Aldred, R. (2024). Changes in motor traffic in London's Low Traffic Neighbourhoods and boundary roads. *Case Studies on Transport Policy* 15, 101124. DOI 10.1016/j.cstp.2023.101124. Open access.
Meta-analysis of monitoring data from 587 count locations in 46 schemes.
- Inside LTNs, traffic fell on average by 46.9%.
- Boundary roads changed little on average: 47% saw decreases and 53% increases.
- There was large variation between schemes.
**Use:** the empirical target for the simulator. Inside-filter volume should fall by roughly half. Boundary roads should be neutral on average, with a wide spread.
**Caveat:** the study was commissioned by an advocacy charity, per press reports. The data are borough monitoring reports with no controlled design, and 50 further schemes were excluded for lack of data.

**[Verlinghieri2025]** [V-meta] Verlinghieri, E., Larrington-Spencer, H., Furlong, J., Aldred, R., Goodman, A. (2025). Can mixed-methods help us better understand congestion on Low Traffic Neighbourhood boundary roads? *Journal of Transport Geography* 128, 104360. DOI 10.1016/j.jtrangeo.2025.104360 (Crossref). Combines sensor data and interviews, and shows that "congestion" is understood in several ways.

**A 2023 Southwark natural experiment** (about −56% and −61% inside two LTNs, boundary roads mostly unchanged apart from one weekday increase) was seen in a search snippet (MRC Epidemiology Unit record). Authors and venue were not captured, so no entry is made.

**Simulation studies of LTNs and street redesign (pass 2, partly filled):**

**[Yin2023]** [V-meta] Yin, B., Diallo, A., Seregina, T., Coulombel, N., Liu, L. (2023). Evaluation of low-traffic neighborhoods and scale effects: The Paris case study. *Transportation Research Record* 2678(1), 88–101. DOI 10.1177/03611981231170130 (Crossref). Uses the multi-agent simulator MATSim, extended with park-and-walk and park-and-ride intermodality, to evaluate two scales of a driving-restriction zone. It finds limited modal shift for a small central zone (about 1.4% of trips shift cars to other modes for the whole-Paris scale) and emissions that rise far from a small zone. **Caveat:** the abstract is about a regional driving-restriction zone, a macro-scale policy, not street-level modal filters.

**[Nieland2025]** [V-meta] Nieland, S., Krajzewicz, D., Weschke, J., Schuppan, J. (2025). Effects of street space redesign on travel demand in Berlin, Germany. *Lecture Notes in Mobility* (Springer), pp. 46–51. DOI 10.1007/978-3-031-85578-8_6 (Crossref). Couples an agent-based demand model with a microscopic traffic simulation for a baseline and a redesign scenario of an inner-city neighborhood. A short book chapter. A search snippet mentioned a "30% reduction in car traffic" and the use of SUMO, but **neither is confirmed** by the Crossref abstract, so neither is claimed here.

**[Furlong2026]** [V-meta, preprint] Furlong, J., Fevyer, D., Berkoff, N., Armstrong, B., Laverty, A., Aldred, R., Verlinghieri, E., Goodman, A. (2026). Low Traffic Neighbourhoods in London: boundary road journey times and congestion. SSRN, DOI 10.2139/ssrn.6685379 (Crossref; a second SSRN record, 10.2139/ssrn.6795014, has the same title). Observational, not a simulation. The best-targeted evidence on boundary-road delay. Not peer reviewed, and the content was not read.

Still **not found:** a verified study that microsimulates an LTN with street-scale modal filters in SUMO or MATSim, or a Coimbra traffic-calming microsimulation or SUMO superblock paper (seen only as snippets in pass 1, not individually verified). The empirical results above remain the validation targets.

### 5.1b Rat-running and navigation-app cut-through (new in pass 2)

**[Cabannes2018]** [V-partial] Cabannes, T., Sangiovanni Vincentelli, M., Sundt, A., Signargout, H., Porter, E., Fighiera, V., Ugirumurera, J., Bayen, A. (2018). The impact of GPS-enabled shortest path routing on mobility: A game theoretic approach. *97th Annual Meeting of the Transportation Research Board*, paper 18-02304 (TRID 1495267). Author list and venue taken from search records (UC Berkeley ITS, TRID); no Crossref record exists. Frames the recent rise of "cut-through" traffic as an effect of routing apps and simulates the I-210 corridor in the LA basin with Aimsun. Full text not read; the Berkeley PDF found is a 2017 draft.

**[Cabannes2019]** [V-meta] Cabannes, T., Sangiovanni Vincentelli, M., Keimer, A., Bayen, A.M. (2019). Regrets in routing networks: Measuring the impact of routing apps on traffic. *ACM Transactions on Spatial Algorithms and Systems* 5(2), 1–19. DOI 10.1145/3325916 (Crossref). Introduces the "average marginal regret", a distance between an observed traffic state and user equilibrium computable from link flows and times, and tests it on app-usage models on three networks including the whole LA network. Useful for modeling what fraction of drivers follow shortest-path apps versus habitual routes.

**[Macfarlane2019]** [V-meta, popular press] Macfarlane, J. (2019). When apps rule the road: The proliferation of navigation apps is causing traffic chaos. *IEEE Spectrum* 56(10), 22–27. DOI 10.1109/MSPEC.2019.8847586 (Crossref). A magazine article, not a peer-reviewed study. Content not read.

Not found: a peer-reviewed empirical measurement of app-induced cut-through volumes on residential streets.

### 5.2 Traffic calming, speed and safety

**[Bunn2003]** [V] Bunn, F., Collier, T., Frost, C., Ker, K., Steinbach, R., Roberts, I., Wentz, R. (2003). Area-wide traffic calming for preventing traffic related injuries. *Cochrane Database of Systematic Reviews*, Issue 1, CD003110. DOI 10.1002/14651858.CD003110 (Crossref returns Bunn, Collier, Frost, Ker, Steinbach, Roberts, Wentz for the 2003 record, so Steinbach was missing from the earlier author list).
Later update: 22 controlled before/after studies, injury crashes pooled rate ratio 0.85 (95% CI 0.75–0.96). Cochrane concluded that traffic calming "may reduce" death and injury, with more research needed. The updated version's authors and year were not captured. Cite the version you use.

**[Grundy2009]** [V] Grundy, C., Steinbach, R., Edwards, P., Green, J., Armstrong, B., Wilkinson, P. (2009). Effect of 20 mph traffic speed zones on road injuries in London, 1986–2006: controlled interrupted time series analysis. *BMJ* 339, b4469. DOI 10.1136/bmj.b4469.
Casualties fell by about 41.9% in zones (secondary reports), with no migration to adjacent roads (adjacent areas fell about 8%). The 41.9% figure was not read in the paper.
**Caveat:** these are signed 20 mph zones that mostly include physical calming.

**[Elvik2009]** [V] Elvik, R. (2009). *The Power Model of the relationship between speed and road safety: update and new analyses.* TØI Report 1034/2009, Institute of Transport Economics, Oslo. 115 studies, 526 estimates. Urban effects are smaller than rural effects.
A re-parameterization is in Elvik (2013), *Accident Analysis & Prevention* (doi 10.1016/j.aap.2012.07.012, seen as a repository filename; not read). An update is Elvik, Vadeby, Hels, van Schagen (2019), *AAP* 123, 114–122, DOI 10.1016/j.aap.2018.11.014 (Crossref); its text was blocked.

**Power model** (**Checked against:** FHWA-HRT-17-098 section 3, fhwa.dot.gov/publications/research/safety/17098/003.cfm, which reproduces Nilsson's equation and Table 18 of [Elvik2009]):

```
Crashes_after = Crashes_before * (v_after / v_before)^k
Nilsson original exponents:  injury crashes 2, severe (DSI) crashes 3, fatal crashes 4
Elvik 2009 best estimates, RURAL roads / freeways only:
  fatal accidents 4.1 (CI 2.9-5.3)     fatalities 4.6 (4.0-5.2)
  serious-injury accidents 2.6 (-2.7 to 7.9)   seriously injured 3.5 (0.5-5.5)
  slight-injury accidents 1.1 (0.0-2.2)         slightly injured 1.4 (0.5-2.3)
  all injury accidents 1.6 (0.9-2.3)            all injured 2.2 (1.8-2.6)
  property-damage-only accidents 1.5 (0.1-2.9)
```

- **The urban-road exponents were not obtained.** The FHWA page says the 2009 study gave separate rural and urban values, and that urban effects are smaller. For an urban neighborhood model, use Nilsson's 2/3/4 as a documented default and tag it as such, or fetch Table 18 or later tables from the TØI report.
- The earlier draft's "k higher for fatal than for injury crashes" is confirmed.

**[Tefft2013]** [V] Tefft, B.C. (2013). Impact speed and a pedestrian's risk of severe injury or death. *Accident Analysis & Prevention* 50, 871–878. DOI 10.1016/j.aap.2012.07.022 (Crossref). Abstract read via PubMed (PMID 22935347).
For a pedestrian struck by a car or light truck (**Checked against:** the PubMed abstract, 2026-11-11; the figures in the earlier draft were correct):
- Severe injury (AIS 4+) risk: 10% at 17.1 mph, 25% at 24.9, 50% at 33.0, 75% at 40.8, 90% at 48.1.
- Death risk: 10% at 24.1 mph, 25% at 32.5, 50% at 40.6, 75% at 48.0, 90% at 54.6.
- Age shifts these: the death risk for a 70-year-old at any speed equals that of a 30-year-old struck 11.8 mph faster.
- **Do not mix with the AAA Foundation technical report** (Tefft 2011), which reports different, rounded figures: severe injury 10% at 16 mph and 50% at 31 mph; death 10% at 23 mph and 50% at 42 mph. The journal paper is the version to cite.
- The data are US crashes from 1994-1998 (standardized to 2007-2009 vehicles), so risk at a given speed may now be somewhat different, and the sample was small.
**Use:** the pedestrian-injury-risk function for the safety score in the simulator.

**[Lubbe2022]** [V] Lubbe, N., Wu, D., Jeppsson, H. (2022). Safe speeds: fatality and injury risks of pedestrians, cyclists, motorcyclists, and car drivers impacting the front of another passenger car as a function of closing speed and age. *Traffic Safety Research* 2, 000006. DOI 10.55329/vfma7555 (Crossref). Open full text read (tsr.international).
German in-depth accident data (GIDAS), weighted logistic regression, P = 1 / (1 + exp(-z)). Table 3, cyclists, at-least-serious injury (MAIS3+F): intercept -7.467, closing speed 0.079 per km/h, age 0.047 per year. At the median cyclist age of 39 this gives 10% risk at 43.5 km/h, matching the 44 km/h in the abstract. Our arithmetic for the other points at age 39: 25% at 57.4 km/h, 50% at 71.3, 75% at 85.2, 90% at 99.1. The pedestrian curve (Table 2, 10% at 29 km/h at age 46) is more severe than the cyclist curve; the paper ranks vulnerability drivers, motorcyclists, cyclists, pedestrians.
Limits: closing speed of a cyclist impacting the front of a car, German data, MAIS3+F (not AIS4+ as in [Tefft2013]); the cyclist and pedestrian curves are close for MAIS3+F and fatal injuries.

**Speed humps and diversion (pass 2):** a peer-reviewed before-after study of hump effects on volume and speed was again **not found**. What exists is practitioner evidence, none individually verified in detail:
- FHWA *Traffic Calming ePrimer*, Module 4 (highways.dot.gov/safety/speed-management/traffic-calming-eprimer). Seen via search: a database of hump sites suggests 25–27 mph as a reasonable 85th-percentile speed after installation, higher where pre-installation speeds were higher, and that speed reductions may shift traffic off the street. The page itself could not be parsed, so these figures are **unverified**.
- Iowa State (CTRE) evaluation of temporary speed humps and tables: lower speeds at and just downstream of the device, weaker effects upstream, and no volume reductions suggesting diversion on the test streets (search summary only; not read).
- Mixed local reports (Portland: about −130 vehicles/day with no increase on parallel streets; a Mira Mesa case with +34% volume on one street) came from a search summary of agency documents and cannot be cited without opening them.
So for the simulator: model speed reduction at humps as a local speed cap or comfort-speed target (a design choice, no source), and treat diversion as an emergent outcome of routing, not a parameter.
An older related item seen in Crossref: a 2019 *International Journal of Engineering* 32(12) paper, "Simulating the effect of speed humps on the U-turn traffic" (DOI 10.5829/ije.2019.32.12c.10; authors not returned; content not read), is a simulation study of humps but not on diversion.

### 5.3 Road diets, induced demand, signal retiming, bike lanes

**[Huang2002]** [V] Huang, H.F., Stewart, J.R., Zegeer, C.V. (2002). Evaluation of lane reduction "road diet" measures on crashes and injuries. *Transportation Research Record* 1784, 80–90. DOI 10.3141/1784-11 (Crossref confirms authors, year, venue and pages). The FHWA summary of this work is FHWA-HRT-04-082, titled "...and their effects on crashes and injuries".
FHWA-HRT-04-082 (HSIS data): about 6% fewer crashes at road diet sites compared with controls (confirmed in the FHWA-HRT-10-053 page, which says this earlier study found only 6% and no significant change in crash rates).

**[FHWA2010]** [V-partial] Federal Highway Administration (2010). *Evaluation of Lane Reduction "Road Diet" Measures on Crashes* (summary report), FHWA-HRT-10-053, June 2010, fhwa.dot.gov/publications/research/safety/10053. The title, number, date and findings were confirmed by search records of the FHWA page; the individual authors were **not confirmed** (the NCHRP 17-25 reanalysis team is named only in a secondary summary, so none is listed).
Empirical Bayes reanalysis of California and Washington sites plus Iowa small-community sites (45 sites per the Informational Guide's summary): Iowa about −47% total crashes, California/Washington about −19%, combined about −29%. It replaced the earlier HSIS result of about −6% [Huang2002].
Sites with higher traffic volumes showed lower crash reductions, so the effect may diminish with volume.
Other studies named in the appendix: Pawlovich et al. 2006 (Iowa, −25.2% crash frequency per mile) and Noyce et al. 2006 (Minnesota, −44% by EB). Both are known only from the guide's summary.

**[Duranton2011]** [V] Duranton, G., Turner, M.A. (2011). The fundamental law of road congestion: Evidence from US cities. *American Economic Review* 101(6), 2616–2652.
Vehicle-km traveled rises roughly one-for-one with interstate lane-km. Little diversion from other road types. No evidence that transit affects VKT.
**Use:** a sanity check, not a neighborhood-scale model. Inform the "induced demand" toggle by applying elasticities near 1 to freeway-like capacity changes.

**[Hymel2019]** [V-meta] Hymel, K. (2019). If you build it, they will drive: Measuring induced demand for vehicle travel in urban areas. *Transport Policy* 76, 57–66. DOI 10.1016/j.tranpol.2018.12.006 (Crossref confirms title, venue and pages).
The effect-size note ("a 1% lane-mile increase leads to about 1% more VMT, speeds returning to baseline within about five years") comes from an SSTI blog summary only, not from the paper, and is **unverified**.

**[Sunkari2004]** [V-partial] Sunkari, S. (2004). The benefits of retiming traffic signals. *ITE Journal* 74(4), 26–29. **Pass 2: Crossref has no record of this item (ITE Journal is not indexed), so the pass-1 search-only verification stands; tag [V-partial].** Related Crossref-confirmed item: Day, Brennan, Premachandra (2010), "Quantifying benefits of traffic signal retiming", Purdue (DOI 10.5703/1288284314250); content not read.
Per secondary summaries: delay reductions of 13–94% and fuel savings of 2–9% across U.S. and Canadian retiming projects, with a benefit/cost of about 40:1. The range is very wide, so use it as a bounds check, not a target.

**[Marshall2019]** [V] Marshall, W.E., Ferenchak, N.N. (2019). Why cities with high bicycling rates are safer for all road users. *Journal of Transport & Health* 13, article 100539. DOI 10.1016/j.jth.2019.03.004. **Correction:** the earlier pages "285–301" were wrong; Crossref gives article number 100539.
Twelve large US cities, 13 years. Safety is better with more protected and separated bike facilities. Intersection density is strongly associated with better safety. The authors reported no significant benefit from painted lanes.
**Caveat:** a cross-sectional ecological study, so it shows association, not an intervention effect.

**Bike-lane effects on motor-vehicle speed or delay (pass 2):**

**[Younes2024]** [V-meta] Younes, H., Andrews, C., Noland, R., Xia, J., Wen, S., Zhang, W., Metaxas, D., Von Hagen, L. (2024). The traffic calming effect of delineated bicycle lanes. *Journal of Urban Mobility* 5, 100071. DOI 10.1016/j.urbmob.2024.100071 (Crossref). Before-after study of a temporary bike lane at one Asbury Park, NJ intersection with computer-vision speed data on more than 9,000 vehicles. Per press summaries (not the paper): cones/delineators gave the largest speed reductions, paint-only lanes smaller ones. **Caveat:** one site, temporary installation, speeds not delay.

Still **not found:** a systematic review or multi-site peer-reviewed study of permanent bike lanes on motor-vehicle delay or throughput. Journalistic analyses (Minneapolis AADT unchanged on 10 segments; Prospect Park West travel times unchanged) exist but are not peer reviewed and are not cited. The Atlanta case-control crash study and NYC DOT analysis from pass 1 remain unverified.

### 5.4 Local context (not literature, but relevant to scenarios)

Seen as search results only, not verified in detail:
- Oakland DOT, Oakland Slow Streets (oaklandca.gov/projects/oakland-slow-streets), plus an interim findings report (ABAG).
- An MTI/SJSU study, "Fewer Cars, Slower Streets: The Potential of the Oakland Slow Streets Program to Transform Communities". Summarized as finding that effects vary widely by site and that a Slow Streets designation alone does not reliably reduce through traffic or speeds.
- Telegraph Avenue Complete Streets (parking-protected bike lanes and a lane removal between 19th and 41st St, per Oakland DOT material).
- A resident-led Rockridge Slow Neighborhood pilot plan with 10 candidate projects (news item).
- College Avenue bike lanes on most of Broadway–Claremont (2021).
Treat these as scenario-design inspiration. They are not validated sources.

---

## 6. Multimodal microsimulation (cyclists, pedestrians)

**[Helbing1995]** [V] Helbing, D., Molnár, P. (1995). Social force model for pedestrian dynamics. *Physical Review E* 51, 4282–4286. DOI 10.1103/PhysRevE.51.4282. arXiv cond-mat/9805244.
Acceleration toward a desired velocity plus repulsive terms from other pedestrians and borders. The basis for pedestrian and shared-space models.

**[Anvari2015]** [V] Anvari, B., Bell, M.G.H., Sivakumar, A., Ochieng, W.Y. (2015). Modelling shared space users via rule-based social force model. *Transportation Research Part C* 51, 83–103. DOI 10.1016/j.trc.2014.10.012.
Three layers: a modified social force model for mixed traffic, velocity-angle constraints for vehicles, and rules for conflicts. Calibrated on shared-space data (New Road, Brighton). Relevant to crossings, slow streets and filtered streets where cyclists and pedestrians share space with cars.

**[Twaddle2014]** [V] Twaddle, H., Schendzielorz, T., Fakler, O. (2014). Bicycles in urban areas: review of existing methods for modeling behavior. *Transportation Research Record* 2434(1), 140–146. DOI 10.3141/2434-17. Crossref confirms authors, venue, pages and DOI; its title field reads "Bicycles in Urban Areas" (the subtitle is from the pass-1 snippet). The four-family classification (longitudinally continuous, cellular automata, social force, logic) was confirmed in a pass-1 snippet.
Existing microsimulation tools produce poor bicycle trajectories and bicycle–motor interactions.

**[Grigoropoulos2019]** [V] Grigoropoulos, G., Kaths, H., Busch, F. (2019). Introducing the effect of bicyclist stabilization control in microscopic traffic simulation. *2019 IEEE Intelligent Transportation Systems Conference (ITSC)*, pp. 1373–1378. DOI 10.1109/ITSC.2019.8916880 (Crossref). Social forces translated into changes in travel direction. Car-following models usually handle bicycles with lateral-position rules.

**Cyclist microsimulation models, 2016–2025 (pass 2, partly filled):**

**[Twaddle2016]** [V] Twaddle, H., Grigoropoulos, G. (2016). Modeling the speed, acceleration, and deceleration of bicyclists for microscopic traffic simulation. *Transportation Research Record* 2587(1), 8–16. DOI 10.3141/2587-02 (Crossref). Author preprint read in full (TU Wuppertal copy, 2026-11-12). Munich intersection data: 1030 trajectories from four signalized intersections in the city center.
Numbers taken: Table 2, bicyclists riding straight on a bicycle lane with a gap over 2 s and a green phase (N = 466): crossing speed mean 5.23 m/s, SD 1.25 m/s; mean minimum speed 4.20 m/s, mean maximum speed 6.02 m/s. The introduction cites earlier studies with mean speeds of 3.2 to 6.9 m/s and mean accelerations of 0.23 to 1.07 m/s². These are speeds through a junction on green, so they are probably higher than mid-block speeds with stops. The paper gives no acceleration range that maps onto the simulator's IDM `a`, `b` or `T`.

**[Kaths2023]** [V-meta] Kaths, H. (2023). A movement and interaction model for cyclists and other non-lane-based road users. *Frontiers in Future Transportation* 4, DOI 10.3389/ffutr.2023.1183270 (Crossref). Per its abstract (search record): built on the NOMAD pedestrian model and calibrated on cyclist trajectories at four signalized Munich intersections. Full text not read.

**[Schmidt2023]** [V-meta, thesis-grade] Schmidt, C., Dabiri, A., Schulte, F., Happee, R., Moore, J. (2023). Essential bicycle dynamics for microscopic traffic simulation: An example using the social force model. *The Evolving Scholar* (TU Delft), DOI 10.24404/63fe3f96e46cae666e6d2463 (Crossref). A review/preprint-style item. Not read.

**[Haque2024]** [V-meta, preprint] Haque, M., Hamdar, S., Talebpour, A. (2024). Bridging the gap between micro-economics and micro-mobility: a two-dimensional risk-based microscopic model of pedestrians' and bicyclists' operational behaviors. arXiv 2407.19172 (authors, title and date confirmed by the arXiv API). A preprint. Not known to be peer reviewed. Calibrated on trajectory data per search summary; not read.

Still **not found:** a verified 2018–2026 *review* of cyclist microsimulation. A Qu et al. 2017 e-bike social-force paper (*Advances in Mechanical Engineering*) from pass 1 stays uncited.

**Pedestrian crossing models (pass 2):**

**[Zeng2014]** [V] Zeng, W., Chen, P., Nakamura, H., Iryo-Asano, M. (2014). Application of social force model to pedestrian behavior analysis at signalized crosswalk. *Transportation Research Part C* 40, 143–159. DOI 10.1016/j.trc.2014.01.007 (Crossref). A social-force model for signalized crosswalks, including conflict with turning vehicles. Content not read beyond the title.

**[Tian2022]** [V-meta] Tian, K., Markkula, G., Wei, C., Lee, Y.M., Madigan, R., Merat, N., Romano, R. (2022). Explaining unsafe pedestrian road crossing behaviours using a psychophysics-based gap acceptance model. *Safety Science* 154, 105837. DOI 10.1016/j.ssci.2022.105837 (Crossref). A gap-acceptance model driven by visual looming cues with a logit choice, per its search summary. Relevant to unsignalized crossings. Not read.

**[Wang2025]** [V-meta] Wang, Y., Srinivasan, A.R., Jokinen, J.P.P., Oulasvirta, A., Markkula, G. (2025). Pedestrian crossing decisions can be explained by bounded optimal decision-making under noisy visual perception. *Transportation Research Part C* 171, 104963. DOI 10.1016/j.trc.2024.104963 (Crossref; initials beyond the first were taken from the search record). Reinforcement-learning model of speed-dependent gap acceptance. Not read.

Still **not found:** a verified calibrated microsimulation rule set for pedestrians crossing *unsignalized neighborhood* streets with yielding drivers. A FHWA-style 27-mid-block-crossing gap-acceptance prototype and a WCTR 2010 discrete-choice model were seen only as search snippets and are not cited.

**Pedestrian and cyclist parameter sources (multimodal-agents, pass 3, 2026-11-12).** Network access reached Crossref, PubMed, the NACTO-hosted copy of TCRP 112 / NCHRP 562, the FHWA site and several agency report PDFs. The California statute pages (leginfo, Justia, FindLaw) answered 403.

**[Fitzpatrick2006]** [V] Fitzpatrick, K., Turner, S., Brewer, M., Carlson, P., Ullman, B., Trout, N., Park, E.S., Whitacre, J., Lalani, N., Lord, D. (2006). *Improving Pedestrian Safety at Unsignalized Crossings.* TCRP Report 112 / NCHRP Report 562. Transportation Research Board, Washington, DC. DOI 10.17226/13962 (Crossref; Crossref lists no authors, the author list is from the report's title page). Full text read from the PDF. Page numbers are the printed ones.
Numbers taken:
- Table 18 (p. 45): walking speed of 2430 walking pedestrians in the field studies, 15th percentile 3.70 ft/s (1.13 m/s), 50th percentile 4.72 ft/s (1.44 m/s). Young (2324) 1.15 and 1.45 m/s; older (106) 0.92 and 1.30 m/s. The report's recommendation is 3.5 ft/s (1.1 m/s) for design, 3.0 ft/s (0.9 m/s) where older pedestrians matter (Table 20 discussion, p. 47).
- Table 11 (p. 25): pedestrian critical gap from HCM Equation 18-17 with 12-ft lanes, 4 ft/s walking speed and a 3-s start-up time: 9.0 s for two through lanes, 15.0 s for four. That is crossing distance / walking speed + 3 s.
- Tables 21 and 22 (p. 48): motorist yielding to staged pedestrians. High-visibility signs and markings: one site at a 25 mph limit 61%, two sites at 35 mph 10% and 24% (average 17%). In-street crossing signs at 25 to 30 mph limits: 82 to 91%, average 87%, all on two-lane streets. Median refuge islands (marked crosswalks, 6 sites): 7 to 75%, average 34%. The report states that number of lanes and posted speed limit were statistically significant for yielding.
These are mostly sites with a treatment, so they are not the baseline for a plain marked crosswalk.

**[Bertulis2014]** [V-meta] Bertulis, T., Dulaski, D.M. (2014). Driver approach speed and its impact on driver yielding to pedestrian behavior at unsignalized crosswalks. *Transportation Research Record* 2464(1), 46–51. DOI 10.3141/2464-06 (Crossref). Abstract read from the Crossref record; the full text was not read.
Staged pedestrian at marked crosswalks, nine sites in the Boston area, 100 trials per site. Yielding fell as the 85th percentile speed rose. On the eight two-lane streets it ran from 75% at the 20 mph street to 17% at the 37 mph street. The one four-lane street had 9%.

**[OBrien2022]** [V] O'Brien, S.W., Ahmed, I., Chase, T., Searcy, S., Kearns, B., Pyo, K., Zegeer, C.V. (2022). *Yielding Compliance at High Visibility Crosswalks.* Report FHWA/NC/2019-18, Highway Safety Research Center, University of North Carolina, for the North Carolina Department of Transportation. May 2022. `https://rosap.ntl.bts.gov/view/dot/64540` (PDF read in full; no DOI).
Staged-pedestrian yielding at 65 crossings in Cary, Clayton and Raleigh before any conversion. Tables 4-1, 4-2 and 4-3 give, per site, the control type, posted speed, lanes, marking style (U unmarked, T transverse, C continental), number of staged events and number of yields. Pooling the uncontrolled sites in those tables (our arithmetic, sites with the pedestrian-signage flag included):
- 25 mph, all two-lane: unmarked 38 yields in 475 events (8.0%, 11 sites); marked with transverse or continental lines 189 in 579 (32.6%, 9 sites).
- All speeds (25 and 35 mph): unmarked 70 in 644 (10.9%, 14 sites); marked 252 in 675 (37.3%, 12 sites).
The three marked 35 mph sites pooled to 65.6% (63 in 96) and are single-site outliers. The study is from North Carolina cities, not California.

**[Brewer2006]** [V-meta] Brewer, M.A., Fitzpatrick, K., Whitacre, J.A., Lord, D. (2006). Exploration of pedestrian gap-acceptance behavior at selected locations. *Transportation Research Record* 1982(1), 132–140. DOI 10.1177/0361198106198200117 (Crossref). Abstract read from Crossref.
Data from 42 sites in seven states. At the 11 approaches with enough events, 85th percentile accepted gaps were 5.3 to 9.4 s and grew with crossing distance. All were below the MUTCD critical gap for a 3.5 ft/s walking speed. Pedestrians often used "rolling gaps", starting before the far lane was clear.

**[Beck2019]** [V-meta] Beck, B., Chong, D., Olivier, J., Perkins, M., Tsay, A., Rushford, A., Li, L., Cameron, P., Fry, R., Johnson, M. (2019). How much space do drivers provide when passing cyclists? Understanding the impact of motor vehicle and infrastructure characteristics on passing distance. *Accident Analysis & Prevention* 128, 253–260. DOI 10.1016/j.aap.2019.03.007 (Crossref). Abstract read via PubMed (PMID 30981377).
Victoria, Australia, 18,527 passes recorded by 60 cyclists. Passing distance is the lateral gap from handlebar end to vehicle. Median 173 cm (Q1 137, Q3 224); 5.9% of passes under 100 cm. Buses passed 28 cm closer than sedans; a marked bike lane with parked cars lowered the mean by 40 cm.

**[Hamm2026]** [V-meta] Hamm, L., Miller, M. (2026). Bicyclist overtaking in naturalistic riding data: speed, clearance, and implications for injury risk. *Traffic Injury Prevention* 27(sup1), S232–S241. DOI 10.1080/15389588.2026.2686799 (Crossref). Abstract read via PubMed (PMID 42406922).
Six commuter cyclists, 8,753 passes with vehicle speed. Mean passing speed from about 10 m/s on residential roads to nearly 15 m/s on primary and four-lane roads. Mean lateral clearance 2.2 to 3.0 m in most contexts, rising only 0.016 m per 1 m/s of passing speed. Painted bike lanes went with 0.31 m less clearance and 1.36 m/s higher passing speed than roads without bicycle accommodation.

**[Rasch2020]** [V-partial] Rasch, A., Åkerberg Boda, C., Thalya, P., Aderum, T., Knauss, A., Dozza, M. (2020). How do oncoming traffic and cyclist lane position influence cyclist overtaking by drivers? *Accident Analysis & Prevention* 142, 105569. DOI 10.1016/j.aap.2020.105569 (Crossref). Open full text (Chalmers repository) skimmed for the design; results not extracted.
Test-track overtaking of a robot cyclist, with an oncoming vehicle set to arrive at 6 s or 9 s time-to-collision (measured when the participant's car was 2 s from the cyclist), or absent. Drivers kept smaller margins at the shorter gap and when the cyclist rode nearer the lane center. It reports no minimum acceptable gap.

**[CVC21760]** [V-partial] California Vehicle Code section 21760 ("Three Feet for Safety Act", added by AB 1371 in 2013, amended by AB 1909 in 2022). A driver overtaking a bicycle going the same way shall not pass with less than three feet between any part of the vehicle and any part of the bicycle or its operator. The statute text above comes from search-result summaries of the code; the official pages (leginfo, Justia, FindLaw) returned 403 and were not opened. Three feet is 0.9144 m.

Not found despite searching: a published rule for how many seconds of oncoming gap a driver needs before passing a cyclist on an urban two-lane street (only [Rasch2020] test-track conditions); a threshold speed difference for a "close pass"; a PET threshold validated for vehicle-pedestrian or vehicle-bicycle encounters; and a source for the 3.3 m urban lane width (the guides found state ranges of 10 to 12 ft in secondary summaries only).

---

## 7. Reference simulators and safety surrogate measures

### 7.1 Simulators

**[Lopez2018]** [V] Alvarez Lopez, P., Behrisch, M., Bieker-Walz, L., Erdmann, J., Flötteröd, Y.-P., Hilbrich, R., Lücken, L., Rummel, J., Wagner, P., Wießner, E. (2018). Microscopic traffic simulation using SUMO. *Proc. 21st IEEE ITSC*, Maui, pp. 2575–2582. DOI 10.1109/ITSC.2018.8569938.
The SUMO reference. It defaults to Krauß and has IDM, intermodal and pedestrian models. The documentation site is sumo.dlr.de.

**[Horni2016]** [V] Horni, A., Nagel, K., Axhausen, K.W. (eds.) (2016). *The Multi-Agent Transport Simulation MATSim.* Ubiquity Press, London. DOI 10.5334/baw. Open access (CC BY 4.0).
Co-evolutionary agent-based, queue-based mobility. A reference for plan-based demand and iterative route and time-of-day replanning.

**[Zhang2019CF]** [V] Zhang, H., Feng, S., Liu, C., Ding, Y., Zhu, Y., Zhou, Z., Zhang, W., Yu, Y., Jin, H., Li, Z. (2019). CityFlow: A multi-agent reinforcement learning environment for large scale city traffic scenario. *Proc. WWW '19 (demo)*, San Francisco, pp. 3620–3624. DOI 10.1145/3308558.3314139 (Crossref). arXiv 1905.05217.
Claimed to be more than twenty times faster than SUMO. A useful design reference for a lightweight engine with a data-oriented layout.

**A/B Street** [V-partial] Carlino, D. et al. A/B Street. Open-source (Apache-2.0, Rust), runs in the browser, built on OpenStreetMap and census data. Has an A/B test mode with two simulations side by side. `https://abstreet.org`, repository `a-b-street/abstreet`. **No peer-reviewed paper was found.** Cited as software only. Its own docs describe it as a simplified game-like model for advocacy, so it is the closest analog to this project's UX.

### 7.2 Safety surrogate measures

**[Hayward1972]** [V-partial] Hayward, J.C. (1972). Near miss determination through use of a scale of danger. *Highway Research Record* 384, 24–34. Introduced time-to-collision (TTC), after his 1971 Penn State thesis. The classic TTC assumes constant speeds, a known limitation.

**TTC and PET definitions** (the PET definition is **checked against** [FHWA-SSAM2008] Chapter 2; the TTC formula is **unchecked - from memory**; these are the standard definitions, and the descriptions of PET as "time between the first road user leaving and the second arriving at the conflict point" and of TTC/PET as the most widely used proximal indicators were consistent across pass-2 search summaries):

```
TTC = s / (v_follower - v_leader)   if v_follower > v_leader, else ∞
PET = t_second_user_arrives - t_first_user_left   (conflict-point crossing times)
```

**[Allen1978]** [V-partial] Allen, B.L., Shin, B.T., Cooper, P.J. (1978). Analysis of traffic conflicts and collisions. *Transportation Research Record* 667, 67–74. Pass 2: the SWOV review R-83-9 lists it as "Allen, Shin & Cooper, McMaster University, 1977; TRR 667, pp. 67-74, 1978", which confirms the citation. No source opened confirmed that this paper defines PET, so "the usual PET citation" remains secondary. The Cooper "Experience with traffic conflicts in Canada" TRID record (TRID 211381) confirms the PET origin in Canadian work.

**[Mahmud2017]** [V] Mahmud, S.M.S., Ferreira, L., Hoque, M.S., Tavassoli, A. (2017). Application of proximal surrogate indicators for safety evaluation: A review of recent developments and research needs. *IATSS Research* 41(4), 153–163. DOI 10.1016/j.iatssr.2017.02.001. Open access.
Reviews TTC, PET and related indicators, and their strengths and limitations.
**Threshold values:** a TTC threshold of 1.5 s is the SSAM default ([FHWA-SSAM2008], checked, vehicle-to-vehicle). No PET threshold for vehicle-pedestrian or vehicle-bicycle encounters was found in a source that could be read. Use both only as adjustable parameters.

**[FHWA-SSAM2008]** [V] Federal Highway Administration (2008). *Surrogate Safety Assessment Model and Validation: Final Report.* FHWA-HRT-08-051, June 2008. Chapter 2 read at `https://www.fhwa.dot.gov/publications/research/safety/08051/02.cfm` (no DOI found).
States that SSAM defaults to a TTC threshold of 1.5 s "as suggested in previous research", and defines PET as the time between the first vehicle last occupying a position and the second arriving at it, with zero meaning a collision. The chapter does not give a PET threshold; it attributes the use of one to Hydén. These cover vehicle-to-vehicle interactions only.

### 7.3 Map data conventions (OpenStreetMap)

**[OSMRestriction]** [V-meta] OpenStreetMap Wiki, "Relation:restriction". `https://wiki.openstreetmap.org/wiki/Relation:restriction` (wikitext fetched 2026-11-12, HTTP 200). Defines the restriction relation with a `from` way, a `via` node or way and a `to` way. The `restriction` values read there are `no_left_turn`, `no_right_turn`, `no_straight_on`, `no_u_turn` and the `only_*` forms. It also documents `restriction:conditional` for restrictions that hold only at certain times, with several values separated by semicolons. Used by the importer to ban motor-vehicle movements. Community documentation, not a standard.

**[OSMTurnLanes]** [V-meta] OpenStreetMap Wiki, "Key:turn" (section "Indicated turns by lane"; `Key:turn:lanes` redirects there). `https://wiki.openstreetmap.org/wiki/Key:turn` (wikitext fetched 2026-11-12, HTTP 200). Describes `turn:lanes` as the indicated turn of each lane, with the `:forward` and `:backward` suffixes for a specific direction of a way. The page states that lane tagging does not replace turn restrictions. Its examples separate lanes with `|`, for example `turn:lanes:forward=left|through;right`. The importer only counts lanes marked left-turn only, so the order of lanes does not matter to it.

---

## 8. Emissions and fuel models

**[Ahn2002]** [V] Ahn, K., Rakha, H., Trani, A., Van Aerde, M. (2002). Estimating vehicle fuel consumption and emissions based on instantaneous speed and acceleration levels. *Journal of Transportation Engineering* 128(2), 182–190. DOI 10.1061/(ASCE)0733-947X(2002)128:2(182) (Crossref confirms all four authors, venue and pages). A discussion and closure exist (J. Transp. Eng. 129(5), 578–581, 2003).
This is the VT-Micro model. The "within about 2.5% of measurement" and "emissions errors 3–33%" claims are from pass-1 snippets and were not re-read. The model form is `ln(MOE) = Σ_i Σ_j L_ij v^i a^j` (**unchecked - from memory**; I recall separate coefficient sets for acceleration and deceleration, not verified).
**Caveat:** fitted on 5 light-duty cars and 3 light-duty trucks (version 1). Version 2 used 60 vehicles (thesis). Not representative of the current US fleet, and EVs are absent.

**[Rakha2011]** [V] Rakha, H.A., Ahn, K., Moran, K., Saerens, B., Van den Bulck, E. (2011). Virginia Tech comprehensive power-based fuel consumption model: Model development and testing. *Transportation Research Part D* 16(7), 492–503. DOI 10.1016/j.trd.2011.05.008 (Crossref; the pass-1 pages were correct).
A power-based fuel model that avoids the "bang-bang" optimum of other power-based models. R² above 0.90 against in-field measurements. A TRB 2011 paper (11-1009) is the earlier version.
**Use:** the recommended lightweight fuel/CO₂ model for v1 (a handful of per-vehicle coefficients, computed from speed and acceleration).

**VT-CPFM equations** (**Checked against:** Edwardes, Virginia Tech MS thesis on diesel bus fuel consumption, vtechworks.lib.vt.edu handle 10919/49707, Section 2.4 Eq. 2-1 to 2-6, which restates Rakha et al. 2011 for light-duty vehicles; read from the rendered page image; [Rakha2011] itself was not read):

```
P(t)  = [ (R(t) + 1.04 m a(t)) / (3600 η_d) ] * v(t)            P in kW, m in kg, a in m/s², v in km/h
R(t)  = (ρ/25.92) C_d C_h A_f v(t)² + 9.8066 m (C_r/1000)(c1 v(t) + c2) + 9.8066 m G(t)     (N)
FC(t) = α0 + α1 P + α2 P²   if P >= 0 ;     α0   if P < 0              (fuel rate, L/s)
```

- `ρ` = 1.2256 kg/m³ at sea level and 15 °C, `C_d` drag coefficient, `C_h = 1 - 0.085 H` (H elevation in km), `A_f` frontal area (m²), `G` grade, `C_r, c1, c2` rolling-resistance parameters, `η_d` driveline efficiency. The 1.04 is `1 + 0.04` rotational-mass factor (0.1 is used for heavy vehicles).
- The α coefficients come from EPA city/highway fuel use: `α0 = max( P_mfo ω_idle d / (22164 Q N), [ (F_city − F_hwy P_city/P_hwy) − ε(P²_city − P²_hwy P_city/P_hwy) ] / [ T_city − T_hwy P_city/P_hwy ] )`, then α2 from Eq. 2-5, and α1 = (F_hwy − T_hwy α0 − P²_hwy α2)/P_hwy. ε = 1e-6 for light-duty vehicles (1e-8 for buses) forces α2 > 0, so the polynomial is convex and has no "bang-bang" optimum.
- Practical implication: a fuel rate that needs only vehicle mass, drag/frontal area, rolling-resistance constants and four EPA fuel/cycle numbers. Park, Rakha, Ahn, Moran (2013), *Int. J. Transportation Science and Technology* 2(4), 317–336, DOI 10.1260/2046-0430.2.4.317 (Crossref), is the calibration paper; a pass-1 search summary reports R² about 0.96 against EPA ratings. Not read.

**[EPA-MOVES]** [V-partial] US EPA. MOVES (Motor Vehicle Emission Simulator) technical reports, for example EPA-420-R-20-019 (Nov 2020) and EPA-420-R-24-016 (Nov 2024). The report titles were not captured.
Operating mode bins from vehicle specific power (VSP) and instantaneous speed. 23 bins in earlier versions. Whether MOVES5 changed the bin structure was **not confirmed**.
The "MOVES-lite" route is a lookup table (bins by VSP and speed) times a per-bin rate. The EPA VSP page says the VSP coefficients vary by source type.

**[HBEFA]** [V] INFRAS / UBA. Handbook Emission Factors for Road Transport (HBEFA), 4.2 (January 2022) and 5.1 (Oct 2025).
Factors by vehicle category and *traffic situation* (road type, speed limit, level of service), not per-second dynamics. It is the standard in the DACH countries, and SUMO has HBEFA emission classes.
**Use:** suited to link-average emissions, not to a second-by-second model. A license is required for the online tool.
The PHEM/HBEFA3 paper (Hausberger et al. 2009) was searched for and **not found**, so it is not cited.

**Not found:** a single "lightweight microsim" emissions comparison paper. A design choice (VSP-bin lookup, VT-CPFM, or link-average HBEFA) has to be made without a verified head-to-head benchmark.

---

## 9. Recommended v1 stack (summary, keyed to the entries above)

| Layer | Choice | Keys | Equation check status |
|---|---|---|---|
| Car following | IDM with the CAH/ACC blend (or IDM+, unchecked) for cut-ins, ballistic update with stopping rule, dt about 0.2 s, parameter heterogeneity from calibrated posteriors | [Treiber2000], [Treiber2013], [Kesting2010], [Schakel2010], [Treiber2015], [Zhang2024] | IDM, CAH/ACC, ballistic: checked. IDM+: unchecked. |
| Lane change | MOBIL on arterials only, p about 0.2, b_safe 4, threshold 0.2 | [Kesting2007] | Checked (secondary full-text sources) |
| Signals | Fixed-time Webster plans for baseline, max-pressure for "adaptive" | [Webster1958], [Varaiya2013], [Kouvelas2014] | Cycle formula and max-pressure: checked. Full Webster delay: unchecked. |
| Unsignalized | Gap acceptance with HCM-style t_c and t_f, FCFS for AWSC | [Brilon1999], [HCM7] | Capacity form and TWSC defaults: checked via FHWA/PTV reproductions. AWSC: unchecked. |
| Roundabouts | Gap acceptance on circulating flow; entry capacity 1130 exp(-0.001 v_c) as a check | [Rodegerdts2007], [Rodegerdts2010], [Retting2001] | Checked via a secondary report |
| Routing | Iterative equilibrium (MSA) on simulated travel times | [Wardrop1952], [Peeta2001], [Cabannes2019] | n/a |
| Demand | LODES + ACS commute pipeline for work trips; other trip purposes need another source | [LODES], [Sen2025] | n/a |
| Validation | Network MFD plausibility | [Geroliminis2008], [Loder2019] | n/a |
| Intervention targets | LTN inside −47%, boundary about 0 with wide spread | [Thomas2024], [Cairns2002], [Furlong2026] | n/a |
| Safety | TTC and PET, speed-based injury risk | [Hayward1972], [Allen1978], [Mahmud2017], [Tefft2013], [Elvik2009] | Tefft: checked. Elvik: rural exponents checked, urban not obtained. TTC/PET: unchecked. |
| Emissions | VT-CPFM or VSP-bin lookup | [Rakha2011], [EPA-MOVES] | VT-CPFM: checked via a thesis restatement |
| Pedestrians and cyclists | Social-force or rule-based hybrid | [Helbing1995], [Anvari2015], [Twaddle2016], [Kaths2023], [Zeng2014] | Not implemented from equations yet |

## 10. Gaps and items still needing follow-up

Resolved in pass 2: author/venue/DOI for [Bock2020], [Zhang2022], [Zhang2024], [Mercader2020], [Huang2002], [Hymel2019], [Twaddle2014], [Ahn2002], [Verlinghieri2025], [Grigoropoulos2019], [Kouvelas2014]; IDM, CAH, ballistic, MOBIL, max-pressure, Tefft, VT-CPFM equations and the TWSC base values checked. Partly filled: LODES-to-OD, cyclist models, pedestrian crossing, LTN simulation, rat-running, bike lanes (sections 4.3, 5.1, 5.1b, 5.3, 6).

Still open:

1. **Equations not checked against a primary source:** IDM+ (Schakel 2010, paywalled), Webster's three-term delay formula, HCM AWSC saturation headways, HCM 6/7 TWSC tables (only secondary reproductions), roundabout default t_c/t_f, TTC/PET definitions and thresholds, VT-Micro form, BPR (primary not seen).
2. **Elvik urban exponents** (and the 2013 re-parameterization): TØI and ScienceDirect were blocked. Use Nilsson 2/3/4 as a documented default meanwhile.
3. **No verified source** for: a MOBIL calibration on highD or pNEUMA; a peer-reviewed speed-hump diversion study; a multi-site peer-reviewed bike-lane delay study; a cyclist-microsimulation review 2018–2026; a LODES-to-microsim-trips methods paper beyond the [Sen2025] preprint; an LTN microsimulation with street-scale modal filters; a peer-reviewed measurement of app-induced residential cut-through; an HBEFA/PHEM paper.
4. **Metadata-only entries** tagged [V-meta] have not had their full text read. Entries with no Crossref DOI that cannot be re-checked: [Webster1958], [Webster1966], [Beckmann1956], [BPR1964], [Hayward1972], [Sunkari2004], [Rodegerdts2010], [Rodegerdts2007], [HCM7], [EPA-MOVES].
5. A/B Street has no paper. NGSIM has no standalone verified dataset entry.
6. Fetch restrictions that remained in pass 2: `doi.org` (403), ScienceDirect, SAGE, IEEE, TRB, NAP, TØI brage, journals behind paywalls. These would need to be opened by a person with access.
