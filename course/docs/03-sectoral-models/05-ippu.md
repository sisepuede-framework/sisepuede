---
title: IPPU — Industrial Processes & Product Use
sidebar_position: 5
---

<SectorCard sector="ippu" />

# IPPU: Industrial Processes & Product Use

The IPPU sector covers everything that comes out of a factory smokestack or a refrigerator vent that is **not** the result of burning fuel for energy. The chemistry of making clinker liberates CO₂ from limestone whether the kiln is heated by coal or by hydrogen; an air-conditioner leaks HFC-134a regardless of how the electricity that runs the compressor was generated. SISEPUEDE accounts for these *process* and *product use* emissions in `IPPU` (`sisepuede/models/ippu.py`), keeping them rigidly decoupled from the combustion accounting that lives in `EnergyConsumption.INEN`.

This separation matches the **2006 IPCC Guidelines, Volume 3**, and is the single most important conceptual point about the sector: when a steel mill burns natural gas to heat a blast furnace, the CO₂ from the gas is an **Energy/INEN** emission; the CO₂ released when limestone flux decomposes inside that same furnace is an **IPPU** emission. Misallocating between the two is a classic inventory error, and the SISEPUEDE schema is built specifically to prevent it.

---

## What IPPU covers

The sector spans the full IPCC Volume 3 product list, mapped to categories under `$CAT-INDUSTRY$`:

| Group | Categories | Dominant gas |
|---|---|---|
| **Mineral products** | Cement, clinker, lime, glass, ceramics | CO₂ (calcination) |
| **Chemical industry** | Ammonia, nitric acid, adipic acid, methanol, caprolactam, carbide, soda ash | CO₂, N₂O |
| **Metal industry** | Iron & steel, aluminum, ferroalloys, magnesium, lead, zinc | CO₂, PFCs (Al smelting), SF₆ (Mg) |
| **Non-energy products from fuels** | Lubricants, paraffin waxes, solvents, asphalt | CO₂ |
| **Electronics** | Semiconductors, TFT-FPD, photovoltaics | NF₃, SF₆, c-C₄F₈, HFC-23 |
| **F-gas product use** | Refrigeration & AC, foam blowing, fire suppression, aerosols, solvents | HFCs, PFCs, SF₆ |

Cement gets special handling: clinker is modeled separately from cement so the **clinker fraction** (`modvar_ippu_clinker_fraction_cement`) and **net imports of clinker** (`modvar_ippu_net_imports_clinker`) can vary independently. This matters enormously for mitigation analysis — clinker substitution (fly ash, slag, calcined clay) is one of the few near-term low-cost cement levers, and the model has to be able to represent it without touching downstream concrete demand.

---

## Production-driven accounting

Every IPPU emission in SISEPUEDE follows the same Tier-1/Tier-2 structure:

```
emissions[gas, category, t] = production[category, t] × EF[gas, category]
```

The two factor families are defined in `_initialize_fc_emission_factor_modvars()`:

- **Per-production-tonne factors** (`modvar_ippu_ef_<gas>_per_prod_process`) — used for cement CO₂, ammonia CO₂, nitric-acid N₂O, adipic-acid N₂O, aluminum PFCs, magnesium SF₆, semiconductor NF₃, and HFC-23 byproduct from HCFC-22 manufacture
- **Per-GDP factors** (`modvar_ippu_ef_<gas>_per_gdp_produse`) — used for diffuse product-use emissions where the activity scales with economic activity rather than a single production line: HFC-134a from MAC and domestic refrigeration, HFC-125 / HFC-143a from commercial refrigerant blends, HCFC-141b/142b from foams, SF₆ from electrical switchgear

The full F-gas list in `ippu.py` covers HFC-23, -32, -41, -125, -134, -134a, -143, -143a, -152a, -227ea, -236fa, -245fa, -365mfc, -43-10mee, plus PFC-14 (CF₄), PFC-116 (C₂F₆), c-C₄F₈ (octafluorooxolane), C₅F₁₂ (dodecafluoropentane), SF₆, and NF₃. Each carries its own GWP100 from AR6 WG1 Chapter 7, which is where IPPU's outsized importance comes from: HFC-23 has a GWP of 12,400, SF₆ is 24,300, NF₃ is 17,400. A few hundred tonnes of HFC-23 vented from an HCFC-22 plant can outweigh the entire CO₂ inventory of a mid-sized country once you multiply through.

---

## Industrial output as the activity driver

Production trajectories are projected in `project_industrial_production()` (line 750) and elasticity-driven by:

- **Initial production** (`modvar_ippu_prod_qty_init`) — the base-year output per category in physical units (Mt cement, Mt steel, kt ammonia, etc.)
- **Elasticity to GDP** (`modvar_ippu_elast_ind_prod_to_gdp`) — applied to `vec_rates_gdp` from the Socioeconomic projection
- **Elasticity to GDP per capita** (`modvar_ippu_elast_produserate_to_gdppc`) — for product-use rates, since per-capita refrigerant ownership saturates with income
- **Production scalar** (`modvar_ippu_scalar_production`) — the lever knob transformers use to push production up or down without touching elasticities
- **Net imports change** (`modvar_ippu_change_net_imports`) — separates *consumption* trajectories (driven by demand) from *production* trajectories (which are what actually emits)

The result, `array_ippu_production`, is the table of per-category physical production that the rest of `project()` multiplies factors against.

---

## The recycling handshake with CircularEconomy

Recall from Module 9 that `SISEPUEDEModels` runs `CircularEconomy` *before* `IPPU` for one reason: virgin industrial production must be reduced by whatever fraction of demand is being met by recycled feedstock. This is implemented in `get_production_with_recycling_adjustment()` (line 916).

The flow:

1. `CircularEconomy.WASO` outputs `modvar_ippu_qty_recycled_used_in_production` for paper, glass, ferrous metal, non-ferrous metal, and plastics
2. `IPPU` reads that variable and subtracts it from gross demand, **capped** by `modvar_ippu_max_recycled_material_ratio` (you cannot make 100% recycled steel from secondary scrap alone — physical-quality limits apply)
3. The residual *virgin* production carries the per-tonne process factor; the recycled fraction does not

This is why mitigation strategies that boost waste recovery in `CircularEconomy` show up as emission reductions in `IPPU` even though no IPPU variable was directly modified — the connection is structural, not parametric.

A symmetric handshake exists for **harvested wood products** (`modvar_ippu_demand_for_harvested_wood`, `modvar_ippu_ratio_of_production_to_harvested_wood`), which connects IPPU paper/wood-product demand back to AFOLU forest harvest accounting.

---

## CCS at the process level

CCS is modeled inside IPPU separately from energy-side capture because process CO₂ streams (cement kiln flue gas, ammonia synthesis, ethylene oxide) have different concentrations and economics from post-combustion capture on a power plant:

- `modvar_ippu_capture_prevalence_co2` — fraction of facilities equipped with CCS
- `modvar_ippu_capture_efficacy_co2` — capture rate of equipped facilities (typically 0.85–0.95)
- Output: `modvar_ippu_gas_captured_co2` — what gets removed from the atmospheric balance

The captured CO₂ is reported in its own variable so analysts can audit storage flows separately from gross emissions.

---

## Other IPPU-resident accounting

A few variables live in IPPU because they share the same activity drivers, even though they technically belong to other inventory chapters:

- **Wastewater coefficients** — `modvar_ippu_wwf_cod` and `modvar_ippu_wwf_vol` define the COD load and volume per tonne of industrial output, consumed by `CircularEconomy.TRWW` for industrial wastewater N₂O/CH₄
- **Non-energy fuel use** — `modvar_ippu_useinit_nonenergy_fuel` tracks lubricants, paraffin waxes, and asphalt that are sold as fuels but never combusted; their carbon ends up in IPPU rather than Energy
- **Household construction materials** — `project_hh_construction()` (line 693) uses `modvar_ippu_average_construction_materials_required_per_household` and `modvar_ippu_average_lifespan_housing` to drive cement and steel demand from the housing stock turnover

---

## Method map

| Method | Line | Role |
|---|---|---|
| `project()` | 1238 | Top-level orchestrator |
| `project_industrial_production()` | 750 | GDP-elastic per-category production |
| `get_production_with_recycling_adjustment()` | 916 | Subtracts WASO-supplied recycled material from virgin demand |
| `project_hh_construction()` | 693 | Housing-stock-driven demand for cement and steel |

`project()` returns a wide-format DataFrame keyed on `(region, time_period)` with one column per `(gas × category)` emission stream, plus the captured-CO₂ and physical-production diagnostics.

---

<Quiz>
  <Question prompt="A steel mill burns coke in a blast furnace. The CO₂ released by oxidizing the coke (the fuel) and the CO₂ released by reducing iron ore with that coke (the process) appear in which SISEPUEDE sectors, respectively?">
    <Choice>Both in IPPU.</Choice>
    <Choice>Both in Energy/INEN.</Choice>
    <Choice correct>Energy/INEN for the fuel-oxidation CO₂; IPPU for the ore-reduction process CO₂.</Choice>
    <Choice>Both in AFOLU because coke comes from coal.</Choice>
  </Question>
  <Question prompt="Why does SISEPUEDE store HFC-134a, HFC-23, SF₆ and NF₃ as separate variables instead of pre-aggregating them to CO₂e inside IPPU?">
    <Choice>Backwards compatibility with an older model version.</Choice>
    <Choice correct>Each gas has its own GWP100 from AR6 and its own mitigation lever; aggregation would erase the policy signal needed for transformer design and Montreal-Protocol/Kigali-Amendment analysis.</Choice>
    <Choice>The 2006 IPCC Guidelines forbid aggregation at the sectoral level.</Choice>
    <Choice>Because GWP values change every year.</Choice>
  </Question>
  <Question prompt="In `get_production_with_recycling_adjustment()`, what enforces that virgin production cannot be eliminated entirely even when WASO supplies large quantities of recycled feedstock?">
    <Choice>A hardcoded 50% floor in the source code.</Choice>
    <Choice correct>The `modvar_ippu_max_recycled_material_ratio` input variable, which caps the recycled share per category to reflect physical and quality constraints on secondary materials.</Choice>
    <Choice>The Socioeconomic GDP elasticity overrides the recycling adjustment.</Choice>
    <Choice>Nothing — at high recycling rates IPPU virgin production can go to zero.</Choice>
  </Question>
</Quiz>
