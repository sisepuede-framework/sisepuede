# Libya NDC Calibration Report
**Agent 4 (calibration_checker) — Generated 2026-04-07**
**Input files:** `_outputs/libya_ndc/model_output_strategy_{0,1,2}.csv`

---

## Summary Table — 2035 Aggregate Indicators (Reliable Sectors Only)

> IMPORTANT SCOPE NOTE: The reliable-sector total is structurally much smaller than Libya's full 127,163 ktCO2e BaU.
> Three dominant sectors — FGTV (gas flaring, ~28% of total NDC), ENTC (electricity generation, ~33%), and TRNS
> (transport, ~24%) — are not in these outputs due to NeMo-Mod/Julia absence and missing fugitive emissions data.
> Those three sectors account for roughly 85% of Libya's total NDC ambition. The calibration below covers ~15%.

| Indicator | NDC Target | Simulated S0 (BAU) | Simulated S2 (Cond) | Deviation | Status |
|---|---|---|---|---|---|
| Reliable-sector 2035 total (kt CO2e) | 127,163 (full BaU, not comparable) | 5,122 kt | 4,954 kt | N/A — scope mismatch | STRUCTURAL GAP |
| Reliable-sector cum reduction 2026-2035 (kt) | 50,459 (full scope) | 56,353 kt BAU | 55,384 kt | 969 kt simulated vs 50,459 target | -98.1% |
| Computed sectors fraction of BaU | ~15% | — | — | — | UNDERCOVERAGE |

**Key note on LNDU:** The `lndu` BAU cumulative (82,227 ktCO2e over 2026-2035) is a credible dominant land-use
emission that alone exceeds Libya's stated BaU total of 127,163 kt. This suggests the MEX-sourced land use
transition matrices are not Libya-specific and are driving large-scale LNDU emissions. LNDU values should
be treated as suspect for absolute magnitude, though the sector is classified RELIABLE for relative reductions.

---

## Sector-Level Calibration Table

| Sector | NDC Target Cumul 2026-2035 (kt CO2e) | S0 BAU Cumul (kt) | S2 Sim Cumul (kt) | Simulated Reduction (kt) | Deviation vs Target | Transformer in S2 | Status |
|---|---|---|---|---|---|---|---|
| agrc+lvst | 3,919 | 8,236 | 7,303 | 934 | -76.2% | TFR:LVST:DEC_ENTERIC_FERMENTATION | FLAG >25% |
| frst+lndu | 39,190 | 46,886 (net) | 46,886 (net) | 0 | -100.0% | TFR:LNDU:INC_REFORESTATION | FLAG >25% — ZERO EFFECT |
| scoe | 34,481 | 831 | 822 | 9 | -100.0% | TFR:SCOE:INC_EFFICIENCY_APPLIANCE + TFR:SCOE:DEC_DEMAND_HEAT | FLAG >25% — SCOPE MISMATCH |
| inen | 3,172 | 400 | 374 | 26 | -99.2% | TFR:INEN:INC_EFFICIENCY_ENERGY + TFR:INEN:INC_EFFICIENCY_PRODUCTION | FLAG >25% — SCALE MISMATCH |
| trww | 258 | 0 (S0 zeroes after tp=2) | MISSING IN S2 | N/A | N/A | TFR:TRWW:INC_CAPTURE_BIOGAS | MISSING IN S2 OUTPUT |
| FGTV | 84,994 | NOT COMPUTED | NOT COMPUTED | N/A | N/A | TFR:FGTV:DEC_LEAKS / INC_FLARE | STRUCTURAL GAP — NeMo-Mod absent |
| ENTC | 94,088 | NOT COMPUTED | NOT COMPUTED | N/A | N/A | TFR:ENTC:DEC_LOSSES / TARGET_RENEWABLE_ELEC | STRUCTURAL GAP — NeMo-Mod/Julia absent |
| TRNS | 12,921 | NOT COMPUTED | NOT COMPUTED | N/A | N/A | TFR:TRNS:INC_EFFICIENCY_NON_ELECTRIC / SHIFT_FUEL_LIGHT_DUTY | STRUCTURAL GAP — energy system model absent |
| IPPU (cement proc + HFC) | 2,998 | OVERFLOW (~10^49) | OVERFLOW | N/A | N/A | TFR:IPPU:DEC_CLINKER / DEC_HFCS | DATA QUALITY — MEX EFs not Libya-scaled |
| WASO (solid waste) | 1,543 | OVERFLOW (~10^47) | OVERFLOW | N/A | N/A | TFR:WASO:INC_RECYCLING / INC_CAPTURE_BIOGAS | DATA QUALITY — MEX waste data not Libya-scaled |

### Note on TRWW
S0 and S1 both show trww values only at time_periods 0, 1, and 2 (non-zero: 0.54, -0.0001, -0.37 MT CO2e)
then collapse to zero from tp=3 onward — indicating a wastewater input data initialization issue.
S2 is entirely missing the `emission_co2e_subsector_total_trww` column, meaning the TRWW transformer
was applied but the wastewater module produced no output column in the conditional run.

---

## Diagnostic Detail by Sector

### agrc + lvst: FLAG >25%
- **Root cause:** Input data scale mismatch. AGRC+LVST BAU is 8,236 kt/decade. NDC target requires 3,919 kt
  reduction, which is 47.6% of BAU. The S2 simulation achieves only 11.3% reduction (934 kt).
- **Transformer effect:** TFR:LVST:DEC_ENTERIC_FERMENTATION reduced enteric fermentation by ~15% and
  TFR:SOIL:DEC_N_APPLIED reduced N2O. The transformers are functioning (non-zero effect) but the scalar
  applied (0.15 for enteric, 0.20 for soil N) is not strong enough relative to the NDC target.
- **Scale factor needed:** 4.2x more reduction. Either: (a) input activity data underestimates Libya
  livestock population/crop area, or (b) transformer scalars need upward adjustment.
- **Recommendation for AGENT 5:** Increase TFR:LVST:DEC_ENTERIC_FERMENTATION scalar toward 0.45-0.50
  AND revisit input livestock population data against Libya FAOSTAT values.

### frst + lndu: FLAG >25% — TRANSFORMER HAD ZERO EFFECT
- **Root cause:** TFR:LNDU:INC_REFORESTATION applied at scalar=1.0 in S2 produced **identical values**
  to S0 across all 21 time periods. The reforestation transformer did not modify any output.
- **Evidence:** S0 vs S2 difference is exactly 0.000000 at every time period for both frst and lndu.
- **Possible causes:**
  1. The land use transition matrix input variables targeted by the transformer were not present or
     already at boundary values in the Libya input data.
  2. The transformer may require specific input columns (`lndu_reforestation_*`) that were not
     populated in the Libya input templates (MEX templates ported without Libya-specific land categories).
  3. The LURF (Land Use Reallocation Factor) η may be pinned at a value that prevents reforestation signal.
- **Recommendation for AGENT 5:** This is NOT a scalar adjustment issue — the transformer mechanism
  itself produced no output. Requires structural investigation of Libya input templates for
  reforestation-relevant columns. Cannot be fixed by scalar tuning alone.

### scoe: FLAG >25% — SCOPE MISMATCH (NOT a calibration failure)
- **Root cause:** The NDC targets "Electricity Demand EE" (24,951 kt) and "Thermal Energy Demand" (9,530 kt)
  together = 34,481 kt. However, in SISEPUEDE architecture, building-level energy demand reductions
  (SCOE) reduce electricity CONSUMPTION, which translates to avoided generation (ENTC domain). The
  actual CO2e impact of demand EE shows up in ENTC output (avoided fuel combustion at power plants),
  not in SCOE direct emissions. SCOE direct emissions are only direct combustion in buildings.
- **Libya SCOE BAU:** 831 kt/decade. The SCOE transformer achieves 1.0% reduction = 9 kt. This is
  **physically correct** — building direct combustion in Libya is small. The 34,481 kt target is
  realizable only via ENTC, which is not computed.
- **Recommendation for AGENT 5:** Do NOT adjust SCOE scalar. This is a structural gap attributable
  to ENTC being absent. Flag as ENTC-dependent, not a SCOE calibration error.

### inen: FLAG >25% — INPUT SCALE MISMATCH
- **Root cause:** Libya INEN BAU is only 400 kt/decade. NDC target requires 3,172 kt reduction,
  implying Libya's industrial sector should be ~4,800 kt/decade to achieve that reduction at ~65%.
  The input industrial activity data (from MEX templates) does not reflect Libya's actual
  industrial throughput (cement production ~5-6 Mt/yr, steel minimal).
- **Scale factor needed:** 7.9x more INEN BAU for the target to be achievable.
- **Transformer effect:** INC_EFFICIENCY_ENERGY reduced INEN by 6.5% — transformer functions correctly,
  but input activity data is severely under-scaled.
- **Recommendation for AGENT 5:** Recalibrate INEN input activity data to Libya-specific cement
  production volumes. Libya cement sector ~5 Mt/yr; energy intensity ~3.5 GJ/t → should produce
  ~2,000-3,000 kt CO2e/decade. Input scalar adjustment (multiplier on production volumes) needed.

### trww: MISSING IN S2 OUTPUT
- **Root cause:** `emission_co2e_subsector_total_trww` is entirely absent from S2 output columns.
  S0/S1 show trww data only for tp=0,1,2 then zero — suggests the wastewater population/activity
  data collapses after initialization. S2 conditional run produced 1,139 columns vs S0's 1,336
  columns; trww is among the ~197 missing columns.
- **Recommendation for AGENT 5:** This requires input data investigation — the wastewater
  treatment fraction/population data is either all-zero or missing from the Libya S2 input templates.
  TFR:WALI:INC_TREATMENT_URBAN (urban wastewater) may have caused a model exception that silently
  dropped TRWW outputs.

---

## Overflow / Not-Computed Sectors — Structural Gap Analysis

### IPPU (OVERFLOW — magnitude ~10^49)
- **Sectors:** `emission_co2e_subsector_total_ippu`
- **2035 value S0:** -6.52e+49 MT CO2e (unphysical)
- **Root cause:** HFC emission factors and/or cement process emission factors from MEX templates
  are orders of magnitude larger than Libya's actual industrial base. Mexico's HFC stock is
  ~10x Libya's; cement sector is ~20x. The MEX-scaled emission factors propagate as overflow.
- **Fix required:** Replace IPPU emission factor inputs with Libya-specific values from
  EDGAR/UNFCCC Libya inventory or IEA Libya data.

### WASO (OVERFLOW — magnitude ~10^47)
- **Sectors:** `emission_co2e_subsector_total_waso`
- **2035 value S0:** -2.98e+47 MT CO2e (unphysical)
- **Root cause:** Solid waste generation rates and/or landfill CH4 generation parameters
  from MEX templates are not Libya-scaled. Mexico solid waste ~53 Mt/yr vs Libya ~2 Mt/yr.
- **Fix required:** Libya-specific solid waste generation per capita and landfill gas generation
  factors (kgCH4/tonne waste).

### lsmm + soil (OVERFLOW — magnitude ~10^9)
- `lsmm` 2035: -1.82e+09 MT (unphysical; should be ~0.5-2 MT for Libya)
- `soil` 2035: -2.44e+09 MT (unphysical; Libya N2O from soils should be ~0.1-0.5 MT)
- **Root cause:** Manure management and soil N application rates from MEX are ~1000x Libya's scale.

### Structural Gaps (Energy System — NeMo-Mod/Julia Absent)
| Sector | NDC Share | Required Action |
|---|---|---|
| FGTV (gas flaring) | 84,994 / 285,772 total = 29.7% | Requires Libya-specific petroleum sector gas flaring data |
| ENTC (power generation) | 94,088 kt = 32.9% | Requires NeMo-Mod LP solver or proxy electricity dispatch model |
| TRNS (transport) | 12,921 kt = 4.5% | Requires ENTC electricity emission factors as input; blocked by ENTC absence |

Combined structural gap: 191,003 ktCO2e out of 285,772 total NDC sectoral targets = **66.8%** not computable.

---

## Sectors Flagged for AGENT 5 Scalar Adjustment

**Sectors where computed deviations exceed 10% AND scalar adjustment is technically feasible:**

| Priority | Sector | Transformer | Current Deviation | Suggested Action | Type |
|---|---|---|---|---|---|
| HIGH | agrc+lvst | TFR:LVST:DEC_ENTERIC_FERMENTATION | -76.2% | Increase scalar to 0.45-0.50; audit Libya livestock population inputs | SCALAR + INPUT DATA |
| HIGH | inen | TFR:INEN:INC_EFFICIENCY_ENERGY + INC_EFFICIENCY_PRODUCTION | -99.2% | Recalibrate INEN activity data (cement production volumes) to Libya scale; ~7.9x upward | INPUT DATA |
| HIGH | frst+lndu | TFR:LNDU:INC_REFORESTATION | -100% (zero effect) | Not a scalar issue — input reforestation template columns absent or zero; structural fix needed | STRUCTURAL |
| MEDIUM | scoe | TFR:SCOE:* | -100% (scope mismatch) | Do NOT adjust; gap is ENTC-domain, not SCOE scalar error | NOT A SCALAR ISSUE |
| LOW | trww | TFR:TRWW:INC_CAPTURE_BIOGAS | Missing S2 output | Investigate WALI transformer interaction; may have caused silent column drop | STRUCTURAL |

**Sectors where scalar adjustment is NOT feasible (structural fixes required first):**
- FGTV, ENTC, TRNS: Require NeMo-Mod/Julia or energy system proxy
- IPPU, WASO, lsmm, soil: Require Libya-specific input data replacement (not scalar tuning)

---

## Data Quality Decisions Log (Agent 4)

- **DECISION:** trww flagged as MISSING_IN_S2; S0 trww is effectively zero from tp=3 — treating as non-functional
- **DECISION:** scoe deviation reclassified as SCOPE MISMATCH not calibration failure; not flagging for scalar adjustment
- **DECISION:** lndu/frst reforestation transformer confirmed to have produced zero output difference; escalating to AGENT 5 as STRUCTURAL, not scalar
- **DECISION:** agrc+lvst flagged for scalar uplift with recommended range 0.45-0.50 for enteric fermentation
- **DECISION:** inen flagged for input activity data recalibration (cement production volumes)
- **DECISION:** ippu, waso, lsmm, soil confirmed overflow; cannot be corrected by scalar adjustment in transformers
