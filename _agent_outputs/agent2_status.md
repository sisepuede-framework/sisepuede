# AGENT 2 Status — Input Validator
Date: 2026-04-07
Status: **BLOCKED — DATA ASSEMBLY REQUIRED**

---

## Summary of Data Availability

Libya (LBY) is **registered** in SISEPUEDE's region attribute tables and has extensive parametric batch data. However, no pre-assembled wide-format input DataFrame exists.

### What Exists (Usable)
- Libya in `attribute_region.csv` and `attribute_region_nations.csv` — model recognizes it as a valid region
- **22/26** batch reference CSVs contain Libya data, covering 2010–2050 (time_periods -5 to 35)
- NeMo-Mod inputs: residual capacity (gas-dominated, 8.8 GW in 2015), availability factors, demand profiles
- SCOE energy inputs: initial consumption, elasticities, scalars (2010–2050)
- IPPU: cement clinker fractions, FCS emission factors, industrial production (2010–2050)
- Soil carbon: SOC = 18.56 t/ha (dry climate, consistent with Saharan/semi-arid Libya)
- Climate zone fractions: available (Libya is predominantly dry/arid)
- Fuel costs: 2015–2050 for all major fuels
- Transmission loss fraction: 29% (2015), time series available 2010–2050
- Power mix: ~95% natural gas, ~4% oil (batch data); NDC states 60.7% gas / 26.6% diesel / 6.1% fuel oil in 2023

### What is Missing / Synthetic
- **`input_base_all_sectors.csv`**: Libya NOT present. This 2,189-column pre-built template covers only 70 countries. Full sector DataFrame assembly required.
- **GDP trajectory**: Synthetic from NDC assumptions (see `_inputs/libya/libya_baseline_parameters.json`). No SISEPUEDE batch data for Libya GDP.
- **Population trajectory**: Synthetic from UN WPP. ~7.0M in 2023, ~80% urban.
- **Land use transition matrices (LNDU)**: Not in any batch CSV. Must use regional MENA defaults or Tunisia as proxy.
- **Transport mode share / fleet data (TRNS)**: Not in batch data. Libya-specific data required.
- **AFOLU trade fractions 2020–2050**: Only 2011–2019 historical. Decision: extrapolate from 2019 constant values.
- **NeMo-Mod max technological capacity**: 0 Libya rows. Must set unconstrained for BAU or use NDC targets for mitigation scenarios.

---

## What AGENT 3 Needs to Know

### Inputs Location
- Baseline parameters JSON: `/Users/fabianfuentes/git/sisepuede/_inputs/libya/libya_baseline_parameters.json`
- Batch data (sectoral): `/Users/fabianfuentes/git/sisepuede/sisepuede/ref/batch_data_generation/`
- NeMo-Mod references: `/Users/fabianfuentes/git/sisepuede/sisepuede/ref/nemo_mod/`

### Assembly Approach (Recommended)
1. Use `input_base_all_sectors.csv` for MEX (Mexico) as a **structural template** — it has the correct 2,189 column schema.
2. Replace column values with Libya batch data from individual batch CSVs, joining on `time_period`.
3. Set GDP columns (`val_gdp_usd_2015` or equivalent Socioeconomic driver) from the synthetic trajectory in the JSON.
4. Set `population_gnrl_rural` and `population_gnrl_urban` from the JSON trajectory × urban fraction (0.80).
5. For LNDU transition matrices: use TUN (Tunisia) as proxy (closest similar country in batch data with MENA dry-land profile).
6. For TRNS: set Libya default from MENA average or use MEX mode shares scaled to Libya's motorization level.
7. For FGTV: initialize from IEA default venting/flaring rates scaled to Libya's ~1.2 Mbpd oil + 12 Bcm/yr gas production.

### Key Calibration Targets
- Total GHG 2023: 97,311 ktCO2e
- FGTV 2023: ~27,247 ktCO2e (28%)
- Energy Industries 2023: ~32,113 ktCO2e (33%)
- Transport 2023: ~23,355 ktCO2e (24%)
- NDC target: 12.9% reduction below BAU by 2035 (unconditional); 21% conditional

### NeMo-Mod Power Sector
- Residual capacity file is present and covers 2015–2040.
- Dispatch availability factors and demand profiles are present (32 seasonal time slices).
- New capacity must come from the LP optimization; no maximum capacity constraint set for Libya — model will build least-cost new capacity.
- NDC scenario: force minimum renewable share (solar) per NDC targets.

### SISEPUEDE Time Period Mapping
- time_period = 0 → year 2015
- time_period = 8 → year 2023
- time_period = 10 → year 2025
- time_period = 20 → year 2035
- time_period = 35 → year 2050

### Known Data Quality Issues
1. NeMo-Mod residual capacity batch data shows ~95% gas fraction in minimum_share_production, but NDC reports ~60% gas / ~33% diesel+oil in 2023. The discrepancy likely reflects different data vintages. Use NDC-stated mix for calibration via `nemomod_entc_frac_min_share_production` adjustments.
2. Transmission loss in batch data (29% for 2015) is higher than NDC-stated 22% grid losses. Both values are within plausible range for Libya's aging grid. Keep batch data value unless NDC simulation requires adjustment.
3. AFOLU sector is small (4% of total) and batch data is available for most parameters — low priority for calibration effort.

---

## Files Written by AGENT 2
1. `/Users/fabianfuentes/git/sisepuede/_inputs/libya/libya_baseline_parameters.json` — Synthetic baseline parameters
2. `/Users/fabianfuentes/git/sisepuede/_agent_outputs/input_validation_report.md` — Full validation report
3. `/Users/fabianfuentes/git/sisepuede/_agent_outputs/agent2_status.md` — This file
4. Appended to `/Users/fabianfuentes/git/sisepuede/_agent_outputs/decisions_log.md`
