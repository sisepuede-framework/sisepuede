---
title: Categories & Units
sidebar_position: 3
---

# Categories & Units

In Module 5 you saw that every SISEPUEDE variable schema contains tokens like `$CAT-AGRICULTURE$` or `$UNIT-MASS$` that get expanded at load time into concrete column names. This module looks under the hood at **where those tokens come from** — the CSV attribute tables that define the model's categorical dimensions, unit systems, and gases — and at **how `ModelAttributes` turns them into runtime lookups** for category validation, unit conversion, and GWP aggregation.

If the `ModelAttributes` object is the schema compiler for SISEPUEDE, the `attributes/` directory is its source code. Everything else — `AFOLU`, `CircularEconomy`, `IPPU`, `Energy`, the transformer library — is downstream of what lives there.

## Category tables: `attribute_cat_*.csv`

Every `$CAT-X$` token in a variable schema is backed by a **category attribute table**. These live in `sisepuede/attributes/` and follow a strict naming convention: `attribute_cat_{subsector}.csv`. As of the current main branch, the category tables are:

| File | Token | Purpose |
|---|---|---|
| `attribute_cat_agriculture.csv` | `$CAT-AGRICULTURE$` | Crop categories (rice, maize, sugar_cane, …) |
| `attribute_cat_livestock.csv` | `$CAT-LIVESTOCK$` | Livestock types (cattle_dairy, sheep, poultry, …) |
| `attribute_cat_forest.csv` | `$CAT-FOREST$` | Forest classes (primary, secondary, mangroves, plantations) |
| `attribute_cat_land_use.csv` | `$CAT-LAND-USE$` | Markov states (croplands, grasslands, settlements, …) |
| `attribute_cat_soil_management.csv` | `$CAT-SOIL-MANAGEMENT$` | Management regimes used in SOC accounting |
| `attribute_cat_manure_management.csv` | `$CAT-MANURE-MANAGEMENT$` | Manure disposal pathways |
| `attribute_cat_industry.csv` | `$CAT-INDUSTRY$` | IPPU process categories (cement, chemicals, metals, electronics) |
| `attribute_cat_fuel.csv` | `$CAT-FUEL$` | Fuels consumed in combustion and fugitive sectors |
| `attribute_cat_technology.csv` | `$CAT-TECHNOLOGY$` | Electricity generation technologies for NemoMod |
| `attribute_cat_storage.csv` | `$CAT-STORAGE$` | Electric storage technologies |
| `attribute_cat_transportation.csv` | `$CAT-TRANSPORTATION$` | Transport modes (road_light, rail_freight, aviation, …) |
| `attribute_cat_transportation_demand.csv` | `$CAT-TRANSPORTATION-DEMAND$` | Demand categories (passenger, freight) |
| `attribute_cat_scoe.csv` | `$CAT-SCOE$` | Stationary combustion of energy end-uses (residential, commercial) |
| `attribute_cat_ccsq.csv` | `$CAT-CCSQ$` | Carbon capture and sequestration modalities |
| `attribute_cat_solid_waste.csv` | `$CAT-SOLID-WASTE$` | Waste streams fed to landfills and composters |
| `attribute_cat_liquid_waste.csv` | `$CAT-LIQUID-WASTE$` | Domestic / industrial wastewater streams |
| `attribute_cat_wastewater_treatment.csv` | `$CAT-WASTEWATER-TREATMENT$` | Treatment pathways (anaerobic, aerobic, septic, …) |

Each table has one row per category, a column carrying the `$CAT-X$` token in RST markup (e.g. ``` ``rice`` ```), and a set of property columns that downstream models consume directly (for instance, `attribute_cat_agriculture.csv` carries default nitrogen fixation factors and whether a crop is a paddy for CH4 accounting).

### How categories get loaded

Category tables are discovered and parsed inside `ModelAttributes._initialize_attribute_tables()` — the canonical entry point is at `sisepuede/core/model_attributes.py:424`. The method walks `attribute_directory` and classifies each file against a set of compiled regular expressions:

```python
# sisepuede/core/model_attributes.py — around line 485
key_cat = "cat"
key_dim = "dim"
key_unit = "unit"

attribute_groups = [key_cat, key_dim, key_unit]

dict_attribute_group_to_regex = dict(
    (x, re.compile(f"{self.key_attribute}_{x}_(.*).csv"))
    for x in attribute_groups if (x != "other")
)
dict_attribute_group_to_regex.update(
    {attribute_group_protected_other: re.compile(f"{self.key_attribute}_(.*).csv")}
)
```

Every file matching `attribute_cat_(.*).csv` becomes an `AttributeTable` indexed by the capture group. These are stored in `self.dict_attributes[self.attribute_group_key_cat]`, keyed by the python category name declared in `attribute_subsector.csv` (the `subsector_field_category_py` column). That is how `ModelVariable.build_fields()` (Module 5) resolves a `$CAT-AGRICULTURE$` token: it looks up the subsector → python category mapping, fetches the `AttributeTable` from that dictionary, and Cartesian-expands the schema against the category keys.

Cross-table consistency is then checked in `_check_attribute_tables()`: every `$CAT-X$` referenced by any variable must resolve to a loaded table, and every category referenced in downstream attribute columns (for example, the "fuel_category" column of `attribute_cat_technology.csv`) must be a valid key in the target table. This is what makes a missing row in a category CSV raise at model construction time rather than deep inside a sectoral `project()` call.

## Unit tables: `attribute_unit_*.csv`

Units follow the same discovery mechanism but target the regex `attribute_unit_(.*).csv`. The shipped unit dimensions are:

<VariableTable
  headers={["Unit type", "File", "Token", "Example units"]}
  rows={[
    ["Mass", "attribute_unit_mass.csv", "$UNIT-MASS$", "g, kg, tonne, kt, mt, gt"],
    ["Energy", "attribute_unit_energy.csv", "$UNIT-ENERGY$", "j, kj, mj, gj, tj, pj, kwh, mwh, gwh"],
    ["Power", "attribute_unit_power.csv", "$UNIT-POWER$", "w, kw, mw, gw"],
    ["Volume", "attribute_unit_volume.csv", "$UNIT-VOLUME$", "l, m3, km3"],
    ["Area", "attribute_unit_area.csv", "$UNIT-AREA$", "ha, km2, m2"],
    ["Length", "attribute_unit_length.csv", "$UNIT-LENGTH$", "m, km, mi"],
    ["Monetary", "attribute_unit_monetary.csv", "$UNIT-MONETARY$", "usd, mm_usd, bn_usd"]
  ]}
/>

Time is special-cased through `attribute_dim_time_period.csv`, and gases live in a standalone table (`attribute_gas.csv`) described below.

Each unit file is a square-ish conversion matrix. For example, `attribute_unit_mass.csv` stores one row per unit and one **"Mass Equivalent X"** column per target unit, so a single lookup gives you the multiplicative scalar directly. The first two rows look like:

```
Mass,$UNIT-MASS$,Name,...,Mass Equivalent MT,Mass Equivalent GT
g,g,Grams,...,1E-12,1E-15
kg,kg,Kilograms,...,1E-9,1E-12
```

### Retrieving units and conversion factors

At runtime, two methods are the public interface:

- `ModelAttributes.get_unit(unit, return_type="unit")` — `sisepuede/core/model_attributes.py:3779`. Returns the `Units` object (or its underlying `AttributeTable`) for a given dimension name such as `"mass"`, `"energy"`, `"area"`. Internally this is just `self.dict_attributes[self.attribute_group_key_unit].get(unit)`.

- `ModelAttributes.get_unit_equivalent(unit_type, unit, unit_to_match, config_str)` — `sisepuede/core/model_attributes.py:4346`. Returns the scalar `a` such that `unit * a = unit_to_match`. If `unit_to_match` is `None`, it falls back to the model configuration value keyed by `config_str` (for example, the configured `emissions_mass` unit for emission outputs).

This is the machinery sectoral models use whenever input variables are declared in one unit and output emissions must be reported in another. You will never see the conversion scalars hard-coded in `AFOLU.project()` or `Energy.project()` — they all flow through `get_unit_equivalent`, which is why swapping a country's input template from `tonne` to `kt` is a one-line change in the config rather than a code change.

## Gases and GWP

`attribute_gas.csv` plays the role of a unit table for greenhouse gases. Each row is one gas (`co2`, `ch4`, `n2o`, `nf3`, `sf6`, the full HFC and PFC families) and carries three GWP columns:

- `Global Warming Potential 20`
- `Global Warming Potential 100`
- `Global Warming Potential 500`

**Defaults follow IPCC AR6 WG1 Chapter 7, Table 7.SM.7**, with GWP100 as the model default. The `Source` column records this provenance explicitly. For example, CH4 is stored as GWP20 = 81.2, GWP100 = 27.9, GWP500 = 7.95.

### Why emissions come out in MT CO2e

All sectoral models emit gas-specific quantities internally (e.g. kg CH4 per head of livestock per year). Output aggregation in `SISEPUEDEModels` then does two things:

1. Calls `get_unit_equivalent("mass", native_unit, configured_emissions_mass, ...)` to reconcile the mass scale — by default **megatonnes (MT)**.
2. Multiplies each gas's emissions column by its GWP100 from `attribute_gas.csv`, producing **MT CO2e**.

Both steps are config-driven, so if you wanted GWP20-based reporting you would override `global_warming_potential` in the configuration, and if you wanted output in kt rather than MT you would override `emissions_mass` — no code edits required. This is a direct consequence of keeping the conversion matrices and GWP values declarative, in CSVs, rather than literal constants in Python.

## Putting it together

The flow from a token in a variable schema down to a numeric value in a CSV is:

1. A variable row in `attribute_subsector_X_variables.csv` declares, for example, `agrc_yield_$CAT-AGRICULTURE$_$UNIT-MASS$_per_$UNIT-AREA$`.
2. `ModelAttributes._initialize_attribute_tables()` loads every `attribute_cat_*.csv`, `attribute_unit_*.csv`, `attribute_gas.csv`, and `attribute_dim_*.csv` into `self.dict_attributes`.
3. `ModelVariable.build_fields()` resolves `$CAT-AGRICULTURE$` against `attribute_cat_agriculture.csv` (one column per crop) and leaves the unit tokens attached to the schema metadata rather than expanding them as columns.
4. At `project()` time, sectoral models call `get_unit_equivalent()` on the schema-attached unit metadata to rescale inputs and outputs consistently.
5. `SISEPUEDEModels` applies GWP100 from `attribute_gas.csv` to produce the final `MT CO2e` output.

Every one of these steps is a pure table lookup. There are no hidden constants and no hardcoded crop lists anywhere in the sectoral code — which is precisely why SISEPUEDE can be re-skinned for a new country, a new category, or a new accounting convention without touching Python.

<Quiz
  question="Which ModelAttributes method returns the multiplicative scalar needed to convert between two units of the same dimension?"
  options={["get_unit()", "get_unit_attribute()", "get_unit_equivalent()", "get_valid_categories()"]}
  correctIndex={2}
  explanation="get_unit_equivalent(unit_type, unit, unit_to_match, config_str) at sisepuede/core/model_attributes.py:4346 returns the scalar a such that unit * a = unit_to_match. get_unit() only retrieves the Units object itself."
/>

<Quiz
  question="Where does SISEPUEDE get the GWP values used to aggregate gas-specific emissions into CO2e?"
  options={[
    "Hard-coded constants in SISEPUEDEModels",
    "IPCC AR5 defaults embedded in each sectoral model",
    "The Global Warming Potential columns of attribute_gas.csv, sourced from IPCC AR6 WG1 Chapter 7 Table 7.SM.7",
    "A runtime call to an external IPCC API"
  ]}
  correctIndex={2}
  explanation="GWP values live in attribute_gas.csv alongside each gas entry, with GWP20/GWP100/GWP500 columns. The default is GWP100 from IPCC AR6 WG1 Chapter 7 Table 7.SM.7, and this can be overridden via configuration."
/>

<Quiz
  question="Which regular expression does _initialize_attribute_tables() use to discover category tables?"
  options={[
    "attribute_(.*)_cat.csv",
    "attribute_cat_(.*).csv",
    "cat_attribute_(.*).csv",
    "$CAT-(.*)$.csv"
  ]}
  correctIndex={1}
  explanation="Inside _initialize_attribute_tables() (sisepuede/core/model_attributes.py:424), the regex is compiled as f'{self.key_attribute}_{x}_(.*).csv' for each group x in ['cat','dim','unit'], which resolves to attribute_cat_(.*).csv for category tables."
/>
