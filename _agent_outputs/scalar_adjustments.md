# Scalar Adjustments Log
## AGENT 5 — Libya NDC Calibration v2 (2026-04-07)

## Iteration 1

### agrc+lvst (TFR:LVST:DEC_ENTERIC_FERMENTATION)
- Original scalar applied: 0.15 (15% reduction by tp=20)
- Adjusted scalar: 0.50 (50% reduction by tp=20)
- Columns modified: `ef_lvst_entferm_*` (9 cols, all livestock species)
- Ramp: 0% at tp=8 (2023), 50% reduction by tp=20 (2035)
- Simulated reduction before: 0.97 ktCO2e (2026-2035)
- Simulated reduction after: 1.05 ktCO2e
- NDC target: 3,919 ktCO2e
- Remaining deviation: -100.0%
- Notes: EF reduction is the dominant lever for enteric fermentation.
  Full target requires actual Libya-specific livestock herd composition.

### frst/lndu (TFR:LNDU:INC_REFORESTATION)
- Status: TRANSFORMER WAS BROKEN — matched wrong columns (frac_lndu_initial_forests_*,
  which are time-invariant area fractions, not transition probabilities)
- Direct fix applied: Set pij_lndu_other_to_forests_secondary ramping from 0 at tp=8
  to 0.0008/yr by tp=20; pij_lndu_grasslands_to_forests_secondary ramping to 0.0002/yr
- This creates ~49,000 ha/yr of new secondary forest by 2035
- S0 cumulative frst emissions (2026-2035): -42.82 ktCO2e
- S2-v2 cumulative frst emissions (2026-2035): -45.09 ktCO2e
- S2 vs S0 frst change: 2.27 ktCO2e (negative = more sequestration)
- NDC target: -39,190 ktCO2e (i.e., 39,190 ktCO2e MORE sequestration than BAU)
- Notes: Libya forests are currently tiny (~0.8% land area). pij transitions drive
  land use change slowly; a decade of reforestation transitions produces modest
  sequestration gains. Full NDC frst target requires dramatic land cover change data.

### inen (TFR:INEN:INC_EFFICIENCY_ENERGY + TFR:INEN:INC_EFFICIENCY_PRODUCTION)
- Status: STRUCTURAL — no scalar fix applied
- Root cause diagnosed: production-driven INEN categories (cement, metals, chemicals)
  show energy_consumption = 0 in ALL output columns despite IPPU producing
  prod_ippu_cement_tonne = 41.66M tonnes/yr. This indicates IPPU→INEN integration
  transfer may have failed or produced a unit mismatch.
- The GDP-driven sector (other_product_manufacturing) gives only ~0.04 ktCO2e/yr.
- Simulated reduction before: 0.027 ktCO2e
- Simulated reduction after: 0.027 ktCO2e
- NDC target: 3,172 ktCO2e
- Remaining deviation: -100.0%
- Required fix: Libya-specific prodinit_ippu_cement (~5M t/yr, not 46.35M from MEX)
  + debugging IPPU→INEN integration transfer path

### trww (TFR:TRWW:INC_CAPTURE_BIOGAS)
- Status: FIX APPLIED — fraction normalization
- Root cause: TFR:WALI:INC_TREATMENT_URBAN multiplied treatment path fracs by 2.5x,
  causing frac sums to reach 2.26 (invalid > 1.0). WASO non-recycled also summed to 1.60.
  Both caused CircularEconomy model to fail for TRWW/WASO subsectors.
- Fix: Renormalized all WALI treatment path fraction groups to sum ≤ 1.0 per tp
  and renormalized WASO non-recycled fractions.
- Result: TRWW now present in V2 output

---

## Structural Gaps (Not Adjustable by Scalars)

### FGTV — 84,994 ktCO2e NDC target
- NeMo-Mod electricity LP not running (Julia unavailable)
- Libya petroleum/gas venting data absent from MEX template
- Transformer TFR:FGTV:DEC_LEAKS was applied but FGTV emission output = 0 (no fugitive model without NeMo-Mod)
- Fix required: Julia/NeMo-Mod LP solver + Libya FGTV sector-specific data

### ENTC — 94,088 ktCO2e NDC target
- NeMo-Mod Julia LP solver not running
- Solar/wind targets set in input but not modeled without electricity run
- Fix required: Julia/NeMo-Mod full LP solve with Libya grid data

### TRNS — 12,921 ktCO2e NDC target
- Partially blocked by ENTC (electricity emission factors)
- Transport efficiency transformers applied (TFR:TRNS:INC_EFFICIENCY_NON_ELECTRIC)
- Fuel-switching transformers applied (TFR:TRNS:SHIFT_FUEL_LIGHT_DUTY)
- Full evaluation requires ENTC output for grid emission factor

### INEN — 3,172 ktCO2e NDC target
- Structural: requires Libya-specific prodinit_ippu_cement (~5M t/yr)
  and debugging IPPU→INEN integration

---

## Summary

| Sector | Before (ktCO2e) | After (ktCO2e) | NDC Target | Status |
|--------|-----------------|----------------|------------|--------|
| agrc+lvst | 0.97 | 1.05 | 3,919 | Improved |
| frst/lndu | 0.0 | 2.27 | -39,190 | Partial fix |
| inen | 0.03 | 0.027 | 3,172 | Structural gap |
| trww | missing | present | 258 | Fix applied |
| FGTV | 0 | 0 | 84,994 | NeMo-Mod required |
| ENTC | 0 | 0 | 94,088 | Julia/NeMo-Mod required |
| TRNS | partial | partial | 12,921 | Needs ENTC |
