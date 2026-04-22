---
id: model-attributes
title: "ModelAttributes"
sidebar_position: 1
---

`ModelAttributes` is the single object every other SISEPUEDE component depends on. Before any emissions are calculated, before any transformer is applied, before a Julia LP is sent to NeMo-Mod, `ModelAttributes` must be fully constructed. It is **Phase 0** of the seven-phase pipeline.

Instantiate it once, pass it everywhere. Every sectoral model (`AFOLU`, `CircularEconomy`, `Energy`, `IPPU`), every transformer, and the orchestrating `SISEPUEDEModels` class all receive the same `ModelAttributes` object. Think of it as the compiled schema: it turns a directory of CSV attribute tables into a living, cross-validated registry of sectors, categories, variables, units, and dimensions.

---

## Learning objectives

By the end of this lesson you will be able to:

- Explain what `ModelAttributes` does and why it exists as a shared singleton
- Identify the four attribute-table buckets (`cat`, `dim`, `unit`, `other`) and give examples of what goes in each
- Describe the sequence of the 14-step `__init__` at a high level
- Explain why `dict_variable_fields_to_model_variables` exists and how it is used
- Describe the role of `_check_attribute_tables` and name three concrete consistency checks it performs
- Write a minimal Python snippet to instantiate `ModelAttributes` from a directory

---

## What ModelAttributes does

- **Reads attribute CSVs** from a single directory (`dir_attributes`) and groups them into four buckets by filename prefix
- **Instantiates every `ModelVariable`** as a typed Python object by iterating over `variable_definitions_*.csv` files; each variable schema token (e.g., `$CAT-AGRICULTURE$`) is expanded into concrete column names
- **Registers dimensions of analysis** (`design_id`, `future_id`, `strategy_id`, `time_period`, `region`, `primary_id`) as named string constants on `self`
- **Initializes units** from `attribute_unit_*.csv` tables and builds conversion factors
- **Loads configuration** defaults (output units, GWP values) from an optional config file
- **Builds reverse-lookup maps** so any column name in a data frame can be resolved back to its `ModelVariable` instance
- **Cross-validates** all tables at init time through 13 subsector-specific check functions — raising exceptions before any model code runs

---

## The four attribute-table buckets

`_initialize_attribute_tables` (line 424 of `model_attributes.py`) scans `dir_attributes` and classifies every CSV by its filename prefix using three regular expressions, with a catch-all for anything else.

| Bucket key | Filename pattern | What belongs here |
|---|---|---|
| `cat` | `attribute_cat_*.csv` | **Category definitions** — one row per category instance. Examples: `attribute_cat_agriculture.csv` (crop types), `attribute_cat_land_use.csv` (land-cover classes), `attribute_cat_technology.csv` (power-generation technologies). Each file defines a key column (the category abbreviation) plus metadata fields used to build variable names and cross-sectoral crosswalks. |
| `dim` | `attribute_dim_*.csv` | **Dimensions of analysis** — integer index tables. Examples: `attribute_dim_time_period.csv` (time steps 0…T-1), `attribute_dim_strategy_id.csv` (strategy codes), `attribute_dim_design_id.csv` (experimental design codes). These define the experimental axes. |
| `unit` | `attribute_unit_*.csv` | **Unit definitions and conversion factors** — one row per unit, with fields that let `UnitsManager` convert between areas, energies, masses, volumes, and monetary amounts. |
| `other` | `attribute_*.csv` (remainder) | **Everything else.** This includes sector and subsector registry tables (`abbreviation_sector`, `abbreviation_subsector`), gas attributes (`attribute_gas.csv`), region lists (`attribute_region.csv`), NeMo-Mod table descriptors, and analytical/experimental parameter tables. |

The `other` bucket is always resolved last (the groups are sorted, with `other` appended) so that the stricter prefix regexes take priority (line 494).

---

## The 14-step init

`ModelAttributes.__init__` runs a fixed sequence of initialization methods (lines 103–141). The steps are ordered by dependency: each method may read properties set by earlier ones.

1. **`_initialize_basic_dimensions_of_analysis`** (line 619) — binds string constants for every dimension (`self.dim_time_period`, `self.dim_strategy_id`, etc.) and the sort-order list
2. **`_initialize_basic_other_properties`** (line 679) — sets file-extension defaults, delimiters, and miscellaneous shared flags
3. **`_initialize_basic_subsector_names`** (line 868) — registers every subsector abbreviation as a named constant (e.g., `self.subsec_name_agrc = "Agriculture"`)
4. **`_initialize_basic_table_names_nemomod`** (line 724) — registers the NeMo-Mod table name constants needed by Energy Production
5. **`_initialize_basic_template_substrings`** (line 923) — sets the regex substrings used to identify analytical-parameter and experimental-parameter CSV files
6. **`_initialize_basic_varchar_components`** (line 939) — sets the key prefixes (`"attribute"`, `"variable_definitions"`) used when scanning the attribute directory
7. **`_initialize_attribute_tables`** (line 424) — main CSV load: scans the directory, reads all files, populates `self.dict_attributes` (the `{bucket: {table_name: AttributeTable}}` structure) and `self.dict_variable_definitions`
8. **`_initialize_other_attributes`** — extracts specific tables from `dict_attributes["other"]` into named properties for fast access
9. **`_initialize_units`** (line 1246) — builds `UnitsManager` from `cat`-bucket unit tables; populates conversion-factor lookups
10. **`_initialize_variables`** (line 1320) — calls `get_variable_dict()` to instantiate one `ModelVariable` per row in each `variable_definitions_*.csv`; stores them in `self.dict_variables`
11. **`_initialize_config`** (line 969) — reads the optional config file; assembles the `Configuration` object with default output units and time-period metadata
12. **`_initialize_sector_sets`** (line 1203) — builds sector → subsector → category membership sets
13. **`_initialize_variables_by_subsector`** (line 1350) — iterates over all subsectors and all variables to build the reverse-lookup maps (see next section)
14. **`_initialize_all_primary_category_flags`**, **`_initialize_emission_modvars_by_gas`**, **`_initialize_gas_attributes`**, **`_initialize_other_dictionaries`** — subsidiary maps for emission totals, GWP-weighted aggregation, and miscellaneous lookups
15. **`_check_attribute_tables`** (line 139) — 13 cross-table consistency checks; raises on any violation
16. **`_initialize_uuid`** — stamps a module UUID for traceability

---

## Reverse lookup map: `dict_variable_fields_to_model_variables`

Sectoral models receive input as wide-format DataFrames where every column is a concrete field name — for example, `agrc_lvst_pop_cattle_dairy` or `enfu_frac_fuel_mix_electricity`. They need to answer the question: *given this column name, which `ModelVariable` does it belong to?*

`dict_variable_fields_to_model_variables` is built for exactly this purpose. During `_initialize_variables_by_subsector` (line 1350), the code iterates over every subsector and every `ModelVariable` in that subsector, then calls `modvar.fields` to get the list of concrete column names the variable expands to. It builds the reverse map in one pass (line 1401):

```python
dict_fields_to_vars.update(dict((x, modvar_name) for x in modvar.fields))
```

The result is a flat dict: `{field_name: modvar_name}`. Any downstream component can call:

```python
modvar_name = model_attributes.dict_variable_fields_to_model_variables.get("agrc_lvst_pop_cattle_dairy")
```

and get back the canonical variable name, from which it can retrieve the full `ModelVariable` object via `model_attributes.dict_variables[modvar_name]`.

The companion dict `dict_model_variables_to_variable_fields` (line 1400) maps in the other direction: variable name → list of concrete field names. Together these two dicts let any component translate freely between abstract variable names and the column names that appear in DataFrames.

---

## Consistency checks: `_check_attribute_tables`

After all initialization is complete, `_check_attribute_tables` (line 150) runs 13 targeted validation functions — one for time periods plus one per subsector with cross-table dependencies. These fire at init time, not at model run time, so a misconfigured attribute table raises immediately before any computation begins.

Three concrete examples:

**1. Time periods must be a zero-based contiguous integer sequence** (`_check_dimensional_attribute_table_time_periods`, line 1518). The check reads `attribute_dim_time_period.csv`, casts the `time_period` column to integers, and verifies that the values match `np.arange(len(vec_periods))` exactly. Zero must be present; negative values and gaps are both illegal. This ensures that time-period indexing never produces out-of-bounds offsets in the Markov and pool-dynamics calculations.

**2. Agriculture must flag exactly one rice category and each crop must have a binary vegetarian-exchange flag** (`_check_attribute_tables_agrc`, line 1855). The check calls `_check_binary_fields` twice: once to verify that `apply_vegetarian_exchange_scalar` is strictly 0/1 for every row, and once with `force_sum_to_one=True` to verify that exactly one crop category is flagged as `rice_category`. If `attribute_cat_agriculture.csv` marks two rice categories, the init fails with a `ValueError` citing the file path.

**3. Every forest category must appear as a land-use category with the expected naming prefix** (`_check_attribute_tables_lndu`, line 2109). The check builds the set `{matchstr_forest + cat for cat in cats_forest}` and asserts it is a subset of `cats_landuse`. If a forest category in `attribute_cat_forest.csv` has no corresponding `"forests_"` entry in `attribute_cat_land_use.csv`, a `KeyError` is raised naming the missing values. It also checks the reverse: every `"forests_*"` land-use category must map to a valid forest category.

---

## Code example: instantiating ModelAttributes

```python
import pathlib
from sisepuede.core.model_attributes import ModelAttributes

# Point to the directory that contains attribute_cat_*.csv, attribute_dim_*.csv, etc.
dir_attributes = pathlib.Path("sisepuede/attributes")

# Instantiate — runs all 14+ init steps and 13 consistency checks.
# Raises if any table is malformed or cross-table constraints are violated.
model_attributes = ModelAttributes(dir_attributes)

# Inspect the variable registry
print(len(model_attributes.all_variables), "model variables registered")

# Look up which ModelVariable owns a given field name
field = "agrc_lvst_pop_cattle_dairy"
modvar_name = model_attributes.dict_variable_fields_to_model_variables.get(field)
modvar = model_attributes.dict_variables.get(modvar_name)
print(f"Field '{field}' belongs to variable '{modvar_name}'")

# Check all input fields for a subsector
input_fields = [
    f for f in model_attributes.all_variable_fields_input
    if f.startswith("agrc_")
]
print(f"Agriculture has {len(input_fields)} input fields")
```

An optional `fp_config` argument accepts a path to an INI-style configuration file that overrides default output units and GWP values. If omitted, `Configuration` uses the defaults embedded in `analytical_parameters.csv`.

---

## In the codebase

| Symbol | File | Line |
|---|---|---|
| `ModelAttributes.__init__` | `sisepuede/core/model_attributes.py` | 103 |
| `_initialize_attribute_tables` | `sisepuede/core/model_attributes.py` | 424 |
| `_initialize_basic_dimensions_of_analysis` | `sisepuede/core/model_attributes.py` | 619 |
| `_initialize_variables` | `sisepuede/core/model_attributes.py` | 1320 |
| `_initialize_variables_by_subsector` | `sisepuede/core/model_attributes.py` | 1350 |
| `get_variable_dict` | `sisepuede/core/model_attributes.py` | 3899 |
| `_check_attribute_tables` | `sisepuede/core/model_attributes.py` | 150 |
| `_check_dimensional_attribute_table_time_periods` | `sisepuede/core/model_attributes.py` | 1518 |
| `_check_attribute_tables_agrc` | `sisepuede/core/model_attributes.py` | 1855 |
| `_check_attribute_tables_lndu` | `sisepuede/core/model_attributes.py` | 2109 |
| Attribute CSVs directory | `sisepuede/attributes/` | — |

---

## Recap

- `ModelAttributes` is Phase 0: it must be constructed before any model or transformer can run.
- It reads a directory of CSVs classified into four buckets: **`cat`** (categories), **`dim`** (experimental dimensions), **`unit`** (conversion factors), **`other`** (sectors, gases, regions, parameters).
- Its 14-step `__init__` runs in dependency order: basic constants first, then CSV loading, then variable instantiation, then cross-table validation.
- `dict_variable_fields_to_model_variables` provides O(1) reverse lookup from any concrete DataFrame column name to its `ModelVariable` — the key bridge between wide-format data and the typed variable registry.
- `_check_attribute_tables` runs 13 subsector-specific checks at init time and raises immediately on any violation, preventing silent data errors from propagating into model calculations.

---

<Quiz
  questions={[
    {
      question: "Which attribute-table bucket contains the list of land-use categories (e.g., forests, cropland, pastures)?",
      options: [
        "dim — because land-use classes are dimensions of analysis",
        "cat — because they are category definitions keyed by abbreviation",
        "unit — because land area is measured in hectares",
        "other — because they don't match any standard prefix"
      ],
      correct: 1,
      explanation: "Category files follow the `attribute_cat_*.csv` naming convention and define the instances (rows) of a category. `attribute_cat_land_use.csv` is read into the `cat` bucket. The `dim` bucket is reserved for experimental index tables like `time_period` and `strategy_id`."
    },
    {
      question: "After calling `ModelAttributes(dir_attributes)`, a colleague checks `model_attributes.dict_variable_fields_to_model_variables.get('enfu_frac_fuel_mix_electricity')` and gets `None`. What is the most likely cause?",
      options: [
        "The method `get_variable_dict` was not called",
        "The field `enfu_frac_fuel_mix_electricity` does not exist in any `variable_definitions_*.csv` for the Energy Fuels subsector",
        "`_check_attribute_tables` failed silently and skipped that subsector",
        "The `cat` bucket is missing `attribute_cat_fuel.csv`"
      ],
      correct: 1,
      explanation: "`dict_variable_fields_to_model_variables` is populated by iterating over every variable's expanded fields. If the field is absent, the variable definition either does not exist in the CSV or its schema token did not expand to that field name. A missing `attribute_cat_fuel.csv` would likely raise at init time rather than produce a silent `None`."
    },
    {
      question: "Why does `_check_attribute_tables` run at the end of `__init__` rather than at the start of each sectoral model's `project()` call?",
      options: [
        "Because sectoral models do not have access to `ModelAttributes`",
        "Because running checks at init time surfaces configuration errors before any computation begins, making failures fast and unambiguous",
        "Because the checks are too slow to run during a model projection",
        "Because `project()` already validates its input DataFrame independently"
      ],
      correct: 1,
      explanation: "Failing fast at construction time means a misconfigured attribute table (e.g., two rice categories, a missing forest-to-land-use mapping) raises an exception with a clear file path and field name before the user runs a single scenario. Deferring validation to `project()` would hide errors until deep inside a multi-hour batch run."
    }
  ]}
/>
