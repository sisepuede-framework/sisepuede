---
id: variable-schema
title: "Variable Naming Schema"
sidebar_position: 2
---

Every column in a SISEPUEDE input or output DataFrame carries a name that is not arbitrary — it is a **machine-readable specification** of sector, subsector, descriptor, units, and category. The general pattern is `{sector_prefix}_{descriptor}_{units_or_qualifier}_{$CAT-X$}`, where `$CAT-X$` is a token that the framework expands into one concrete column name per category at model instantiation. Understanding this schema is the prerequisite for reading attribute tables, writing input templates, and debugging mismatched field errors.

## Learning objectives

- Decompose any SISEPUEDE variable field name into its constituent parts.
- Identify the subsector abbreviation from the first segment of a field name.
- Explain what `$CAT-X$` tokens are and how `build_fields()` expands them into concrete column names.
- Describe the role of `ModelVariable` and `VariableSchema` in the class hierarchy.
- Use `dict_variable_fields_to_model_variables` to reverse-look up a field name to its `ModelVariable`.

## The naming convention

SISEPUEDE variable field names follow a fixed underscore-delimited structure. The **first segment** is always the subsector abbreviation — a two- or four-letter code defined in `sisepuede/attributes/attribute_subsector.csv`. What follows is a descriptor that identifies the quantity, and then one or more qualifiers for units and categories.

| Subsector abbreviation | Subsector | Sector |
|---|---|---|
| `agrc` | Agriculture | AFOLU |
| `lvst` | Livestock | AFOLU |
| `lndu` | Land Use | AFOLU |
| `frst` | Forest | AFOLU |
| `lsmm` | Livestock Manure Management | AFOLU |
| `soil` | Soil Management | AFOLU |
| `wali` | Liquid Waste | Circular Economy |
| `waso` | Solid Waste | Circular Economy |
| `trww` | Wastewater Treatment | Circular Economy |
| `enfu` | Energy Fuels | Energy |
| `fgtv` | Fugitive Emissions | Energy |
| `inen` | Industrial Energy | Energy |
| `scoe` | Stationary Combustion & Other Energy | Energy |
| `trns` | Transportation | Energy |
| `entc` | Energy Technology | Energy |
| `ippu` | IPPU | IPPU |
| `econ` | Economy | Socioeconomic |
| `gnrl` | General | Socioeconomic |

### Worked examples

<VariableTable rows={[
  {
    field: "pop_lvst_initial_$CAT-LIVESTOCK$",
    expanded: "pop_lvst_initial_buffalo (+ one per livestock category)",
    description: "Initial head count of each livestock type at t=0",
    unit: "head",
    type: "Input"
  },
  {
    field: "ef_agrc_anaerobicdom_$CAT-AGRICULTURE$_$UNIT-MASS$_$EMISSION-GAS$_$UNIT-AREA$",
    expanded: "ef_agrc_anaerobicdom_rice_kg_ch4_ha",
    description: "CH4 emission factor for anaerobic decomposition of rice crops",
    unit: "kg CH4 / ha",
    type: "Input"
  },
  {
    field: "ef_enfu_combustion_$UNIT-MASS$_$EMISSION-GAS$_per_$UNIT-ENERGY$_$CAT-FUEL$",
    expanded: "ef_enfu_combustion_tonne_co2_per_pj_fuel_diesel (+ one per fuel)",
    description: "CO2 combustion emission factor by fuel type",
    unit: "tonne CO2 / PJ",
    type: "Input"
  },
  {
    field: "scalar_scoe_appliance_energy_demand_$CAT-SCOE$",
    expanded: "scalar_scoe_appliance_energy_demand_commercial (+ one per SCOE category)",
    description: "Scalar modifying non-heat energy demand for appliance efficiency",
    unit: "dimensionless",
    type: "Input"
  },
  {
    field: "ef_ippu_$UNIT-MASS$_$EMISSION-GAS$_per_$UNIT-MASS$_production_$CAT-INDUSTRY$",
    expanded: "ef_ippu_tonne_ch4_per_tonne_production_chemicals",
    description: "CH4 process emission factor per tonne of industrial production",
    unit: "tonne CH4 / tonne product",
    type: "Input"
  },
  {
    field: "ef_fgtv_production_flaring_$UNIT-MASS$_$EMISSION-GAS$_per_$UNIT-VOLUME$_$CAT-FUEL$",
    expanded: "ef_fgtv_production_flaring_tonne_ch4_per_m3_fuel_natural_gas",
    description: "CH4 flaring emission factor per volume of fuel produced",
    unit: "tonne CH4 / m3",
    type: "Input"
  }
]} />

The "expanded" form is what actually appears as a DataFrame column header. The raw schema form with `$...$` tokens is what is stored in the attribute CSV and in `ModelVariable.schema`.

## VariableSchema tokens

Tokens are substrings surrounded by `$` delimiters. They act as **placeholders** for a dimension of variability. When `build_fields()` is called, each token is replaced by every concrete value in the corresponding category or unit table.

The two main families of tokens are:

**Category tokens** — expand over the rows of a category attribute table (e.g., `attribute_cat_livestock.csv`):

| Token | Category attribute table | Example values |
|---|---|---|
| `$CAT-AGRICULTURE$` | `attribute_cat_agriculture.csv` | `bevs_and_spices`, `fiber`, `rice`, `vegetables` … |
| `$CAT-LIVESTOCK$` | `attribute_cat_livestock.csv` | `buffalo`, `cattle_dairy`, `cattle_nondairy`, `goats` … |
| `$CAT-INDUSTRY$` | `attribute_cat_industry.csv` | `cement`, `chemicals`, `metals`, `plastic` … |
| `$CAT-FUEL$` | `attribute_cat_fuel.csv` | `fuel_coal`, `fuel_diesel`, `fuel_natural_gas` … |
| `$CAT-SCOE$` | `attribute_cat_scoe.csv` | `commercial`, `industrial`, `residential` … |
| `$CAT-TRANSPORTATION$` | `attribute_cat_transportation.csv` | `aviation`, `rail_freight`, `road_heavy_truck` … |
| `$CAT-LANDUSE$` | `attribute_cat_land_use.csv` | `croplands`, `forests`, `grasslands`, `wetlands` … |

**Unit tokens** — expand over rows of unit attribute tables (e.g., `attribute_unit_mass.csv`), but crucially are **pinned to a single value** in each variable definition. The variable definition CSV includes the binding in parentheses directly after the schema string, for example: `(``$UNIT-MASS$ = tonne``, ``$EMISSION-GAS$ = ch4``)`. The unit token creates a concrete qualifier in the column name rather than multiplying columns:

| Token | Pins to example |
|---|---|
| `$UNIT-MASS$` | `tonne`, `kg` |
| `$UNIT-ENERGY$` | `pj`, `tj` |
| `$UNIT-AREA$` | `ha` |
| `$UNIT-VOLUME$` | `m3` |
| `$EMISSION-GAS$` | `ch4`, `co2`, `n2o` |

A special suffix `-DIM1`, `-DIM2` (the `flag_dim` mechanism in `VariableSchema`) allows the same category to appear twice in one schema — producing the outer product of the category space. For example, `$CAT-LANDUSE-DIM1$_$CAT-LANDUSE-DIM2$` generates one field per ordered pair of land-use categories, which is how land-use transition matrices are represented.

### How `build_fields()` expands a schema

`ModelVariable.build_fields()` (defined in `sisepuede/core/model_variable.py`, line 1192) performs the expansion at initialization time:

1. It starts with `self.schema.schema` — the raw string with `$...$` tokens.
2. For each mutable element (token) in the schema, it iterates over the allowed category values (stored in `self.dict_category_keys`) and performs a string replacement.
3. If the variable definition restricts categories (e.g., `categories = "fuel_natural_gas"` instead of `"all"`), only those categories are substituted.
4. The result is a list of concrete column name strings stored in `self.fields`.

For example, `pop_lvst_initial_$CAT-LIVESTOCK$` with `categories = "all"` produces one field per row in `attribute_cat_livestock.csv` — `pop_lvst_initial_buffalo`, `pop_lvst_initial_cattle_dairy`, and so on. The full space (if categories were unrestricted) is stored separately in `self.fields_space`.

## The `ModelVariable` class

`ModelVariable` (defined in `sisepuede/core/model_variable.py`, starting at line 40) is the single object that encapsulates everything known about one variable:

- `modvar.name` — the human-readable variable name as defined in the attribute CSV (e.g., `"Initial Livestock Head Count"`).
- `modvar.schema` — a `VariableSchema` instance wrapping the raw schema string.
- `modvar.fields` — the list of concrete DataFrame column names produced by `build_fields()`.
- `modvar.fields_space` — the full expansion over all categories (ignoring restrictions).
- `modvar.categories_are_restricted` — boolean; `True` if the variable only applies to a subset of its primary category.
- Additional properties from the attribute row (variable type, default value, LHS scalar bounds) are accessible via `modvar.get_property()`.

`VariableSchema` (line 1636) is the lower-level class that parses the raw schema string, identifies mutable elements via a `$...$` regular expression, and stores the ordered list of tokens in `self.mutable_elements_clean_ordered`. It is an internal implementation detail; you will almost always interact with the higher-level `ModelVariable` interface.

## Reverse lookup: `dict_variable_fields_to_model_variables`

`ModelAttributes._initialize_variables_by_subsector()` (called during `__init__`) builds the reverse map:

```python
self.dict_variable_fields_to_model_variables
```

This dictionary maps every concrete column name (e.g., `"pop_lvst_initial_cattle_dairy"`) to the name of the `ModelVariable` it belongs to (e.g., `"Initial Livestock Head Count"`). It is populated by iterating over every `ModelVariable` in `dict_variables`, expanding its fields, and adding `{field: modvar.name}` for each.

The companion forward map is:

```python
self.dict_model_variables_to_variable_fields
```

which maps `modvar.name -> [list of concrete field names]`.

Together these two dictionaries are the backbone of field-level validation and cross-sector data passing throughout the model.

## Why this matters: fail-fast validation

When a sectoral model (e.g., `AFOLU.project()`) reads its input DataFrame, it looks up required fields using `ModelAttributes`. If a template has a misspelled column — say `pop_lvst_initail_cattle_dairy` — it is simply absent from `dict_variable_fields_to_model_variables`. The model either raises an error immediately or falls back to the variable's `default_value` (also stored in the `ModelVariable`). Either way, the schema enforces consistency: **you cannot pass a column the model does not recognize, and you cannot accidentally merge data from two different category spaces**.

This is also why the schema must be used exactly as defined in the attribute CSVs. Fabricating a column name that is not registered in `ModelAttributes` will silently be ignored or cause a hard failure — there is no graceful fallback for unregistered fields.

## Code example: looking up a field

```python
import sisepuede.core.model_attributes as ma

# load model attributes from the default attribute directory
model_attributes = ma.ModelAttributes("path/to/sisepuede/attributes")

# forward lookup: get all concrete fields for a named variable
modvar_name = "Initial Livestock Head Count"
fields = model_attributes.dict_model_variables_to_variable_fields[modvar_name]
# -> ["pop_lvst_initial_buffalo", "pop_lvst_initial_cattle_dairy", ...]

# reverse lookup: find which ModelVariable owns a column
field = "pop_lvst_initial_cattle_dairy"
owner = model_attributes.dict_variable_fields_to_model_variables[field]
# -> "Initial Livestock Head Count"

# access the ModelVariable object itself
modvar = model_attributes.dict_variables[owner]
print(modvar.schema.schema)
# -> "pop_lvst_initial_$CAT-LIVESTOCK$"
print(modvar.fields)
# -> ["pop_lvst_initial_buffalo", "pop_lvst_initial_cattle_dairy", ...]
```

:::note In the codebase

The three files that implement everything described in this module:

- **`sisepuede/core/model_variable.py`** — `ModelVariable` (line 40) and `VariableSchema` (line 1636). `build_fields()` is defined at line 1192 of `ModelVariable`.
- **`sisepuede/core/model_attributes.py`** — `get_variable_dict()` (line 3899) instantiates every `ModelVariable` from the attribute CSVs. `_initialize_variables_by_subsector()` (around line 1340) builds `dict_variable_fields_to_model_variables` and its inverse.
- **`sisepuede/attributes/variable_definitions_*.csv`** — one file per subsector (e.g., `variable_definitions_af_lvst.csv`). Each row is one variable: the `variable_schema` column holds the raw token string; the `categories` column holds the pipe-delimited restriction list or `"all"`.

:::

## Recap

- Field names are deterministic: subsector abbreviation first, then descriptor, then unit qualifiers, then category token last.
- `$CAT-X$` tokens are expanded by `build_fields()` into one concrete column per allowed category value at model instantiation — never at runtime.
- Unit tokens (`$UNIT-MASS$`, `$EMISSION-GAS$`, etc.) are pinned to a single value per variable and produce a human-readable qualifier in the column name rather than additional columns.
- `ModelVariable` wraps the schema, the field list, and all attribute metadata. `VariableSchema` is its internal parser.
- `dict_variable_fields_to_model_variables` and its inverse are the core lookup structures used throughout every sectoral model.
- The schema is validated at `ModelAttributes` initialization; a wrong field name is caught before any emission calculation runs.

---

<Quiz questions={[
  {q: "What does the first segment of a SISEPUEDE variable field name always indicate?", choices: [
    {text: "The emission gas (e.g., ch4, co2)"},
    {text: "The subsector abbreviation (e.g., lvst, scoe, enfu)", correct: true, explain: "The subsector abbreviation is always the first underscore-delimited segment. It is defined in attribute_subsector.csv and links the variable to its containing sector and category table."},
    {text: "The variable type (input or output)"},
  ]},
  {q: "Given the schema `ef_agrc_anaerobicdom_$CAT-AGRICULTURE$_$UNIT-MASS$_$EMISSION-GAS$_$UNIT-AREA$` with the binding ($UNIT-MASS$ = kg, $EMISSION-GAS$ = ch4, $UNIT-AREA$ = ha) and categories = 'rice', how many concrete column names does build_fields() produce?", choices: [
    {text: "One column: ef_agrc_anaerobicdom_rice_kg_ch4_ha", correct: true, explain: "Because categories is restricted to 'rice' — a single value — only one column is produced. The unit tokens are pinned to single values and do not multiply the output."},
    {text: "Three columns — one per unit token ($UNIT-MASS$, $EMISSION-GAS$, $UNIT-AREA$)"},
    {text: "One column per row in attribute_cat_agriculture.csv"},
  ]},
  {q: "What happens when a sectoral model encounters an input DataFrame column that is not registered in dict_variable_fields_to_model_variables?", choices: [
    {text: "The column is automatically added to the schema"},
    {text: "The model raises an error or silently ignores the column and uses the variable's default_value", correct: true, explain: "Unregistered fields have no entry in the reverse lookup. The model either raises a hard error or falls back to the registered default_value. There is no automatic schema extension at runtime."},
    {text: "ModelAttributes rebuilds its variable dictionary to include the new field"},
  ]}
]} />
