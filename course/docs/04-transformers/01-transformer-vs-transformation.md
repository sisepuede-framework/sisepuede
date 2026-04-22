---
title: Transformer vs Transformation
sidebar_position: 1
---

# Transformer vs Transformation: The Distinction

Welcome to Part IV of the course. From here on, we shift from *how SISEPUEDE simulates a baseline* to *how SISEPUEDE represents policy interventions*. The very first thing you need to internalize — and the source of more confusion than any other piece of SISEPUEDE vocabulary — is the difference between a **Transformer** and a **Transformation**.

If you only remember one sentence from this module, make it this one:

> A **Transformer** is the *code* that knows HOW to modify a baseline DataFrame. A **Transformation** is the *registered, parameterized policy intervention* that says WHAT to do with that code in a given strategy.

The two words are easy to mix up in casual speech, and the codebase is itself not always pedantic about it (you will see "transformation" in some docstrings where, strictly, the object being discussed is a Transformer). But the two are different Python classes, they live in different files, and they answer different questions. Once you internalize the split, every other piece of Part IV — strategies, attribute tables, magnitude semantics, ramp vectors — falls into place.

## The Transformer: HOW

A `Transformer` is a Python object that wraps a function. The function takes a baseline wide-format DataFrame and returns a modified one. Nothing more.

The class lives in `sisepuede/transformers/transformers.py`:

```python
# sisepuede/transformers/transformers.py
_MODULE_CODE_SIGNATURE = "TFR"

class Transformer:
    """Create a Transformation class to support construction in sectoral
    transformations.

    Initialization Arguments
    ------------------------
    code : str
        Transformer code used to map the transformer to the attribute table.
        Must be defined in attr_transformers.table[attr_transformers.key]
    func : Callable
        The function associated with the transformation ...
    """
    def __init__(self, code, func, attr_transformer, ...):
        ...
```

Two pieces matter here:

1. A `code` like `TFR:FGTV:INC_GAS_RECOVERY` — the canonical identifier, prefixed with the module signature `TFR`, then a sector tag (`FGTV`, `AGRC`, `LNDU`, …), then a short uppercase action name.
2. A `func` — the callable that actually mutates the DataFrame.

The functions live in two layers:

- **`sisepuede/transformers/transformers.py`** holds the high-level wrappers. These are bound methods on the big `Transformers` class (note the plural — that's the registry, not a single transformer). Each wrapper is named `_trfunc_<sector>_<action>` and is responsible for parameter checking, ramp vector resolution, and dispatch.
- **`sisepuede/transformers/lib/_baselib_<sector>.py`** holds the per-sector base functions that do the real DataFrame surgery. There is one library file per sector: `_baselib_afolu.py`, `_baselib_circular_economy.py`, `_baselib_energy.py`, `_baselib_ippu.py`, `_baselib_cross_sector.py`, plus `_baselib_general.py` for shared helpers.

Concretely, the AFOLU library file opens like this:

```python
# sisepuede/transformers/lib/_baselib_afolu.py
def transformation_agrc_improve_crop_residue_management(
    df_input: pd.DataFrame,
    magnitude_burned: float,
    magnitude_removed: float,
    vec_ramp: np.ndarray,
    model_attributes: ma.ModelAttributes,
    categories: Union[List[str], None] = None,
    model_afolu: Union[mafl.AFOLU, None] = None,
    rescale: bool = True,
    **kwargs,
) -> pd.DataFrame:
    """Implement the 'Improve Crop Residue Management' transformation."""
    ...
```

That function is the WHAT-it-physically-does logic. The wrapper in `transformers.py` is the WHAT-the-defaults-are-and-how-to-call-it logic. The `Transformer` object is the *registration handle* — `Transformers.__init__` builds one for every supported intervention and appends it to `self.all_transformers`.

## The Transformation: WHAT

A `Transformation` is a parameterization of a Transformer, defined in YAML and validated against the registry. Its class lives in `sisepuede/transformers/transformations.py`:

```python
# sisepuede/transformers/transformations.py
class Transformation:
    """Parameterization class for Transformer. Used to vary implementations of
    Transformers. A Transformation reads parameters from a configuration file,
    an existing YAMLConfiguration object, or an existing dictionary to allow
    users the ability to explore different magnitudes, timing, categories,
    or other parameterizations of a Transformer."""
```

A Transformation has its own identifier, the `transformation_id` (string codes like `tx_agrc_improve_rice_management`, integer ids in the attribute table). It binds *one Transformer* to *one set of parameters*. The validation step, in `_initialize_config`, refuses to instantiate a Transformation whose `transformer` field doesn't appear in `transformers.all_transformers`:

```python
# sisepuede/transformers/transformations.py
transformer_code = config.get(self.key_transformer)
if transformer_code not in transformers.all_transformers:
    msg = f"Transformer code '{transformer_code}' not found in the Transformers."
    raise RuntimeError(msg)
```

This is the firewall that prevents typos and invented transformer names from sneaking into a strategy. **If a transformer code isn't registered in `Transformers`, no Transformation can reference it, and no Strategy can apply it.**

## A worked example: `TFR:FGTV:INC_GAS_RECOVERY`

This branch (`feature/fgtv-gas-recovery`) recently added a new transformer for *Gas Flaring Recovery* — capture of associated gas at oil/gas wellheads, before it enters the flaring/venting/fugitive emission split. It is a clean, minimal example of the full machinery.

**1. The base function** (`sisepuede/transformers/lib/_baselib_energy.py`):
A new function `transformation_fgtv_increase_gas_recovery` that calls the generic `transformation_general` with `magnitude_type="final_value"` on the new `frac_fgtv_capture_associated_gas_$CAT-FUEL$` model variable.

**2. The wrapper method** (`sisepuede/transformers/transformers.py`, line 6056):

```python
def _trfunc_fgtv_increase_gas_recovery(self,
    df_input: Union[pd.DataFrame, None] = None,
    magnitude: float = 0.5,
    strat: Union[int, None] = None,
    vec_implementation_ramp: Union[np.ndarray, None] = None,
) -> pd.DataFrame:
    """Implement the 'Increase Gas Recovery' (Gas Flaring Recovery) FGTV
    transformer on input DataFrame df_input. ..."""

    df_input = (self.baseline_inputs
                if not isinstance(df_input, pd.DataFrame) else df_input)
    vec_implementation_ramp = self.check_implementation_ramp(
        vec_implementation_ramp, df_input,
    )
    magnitude = self.bounded_real_magnitude(magnitude, 0.5)

    df_strat_cur = tbe.transformation_fgtv_increase_gas_recovery(
        df_input, magnitude, vec_implementation_ramp,
        self.model_attributes,
        field_region=self.key_region,
        model_enercons=self.model_enercons,
        strategy_id=strat,
    )
    return df_strat_cur
```

**3. The Transformer registration** (`transformers.py`, line 1454):

```python
self.fgtv_increase_gas_recovery = Transformer(
    f"{_MODULE_CODE_SIGNATURE}:FGTV:INC_GAS_RECOVERY",
    self._trfunc_fgtv_increase_gas_recovery,
    attr_transformer_code,
)
all_transformers.append(self.fgtv_increase_gas_recovery)
```

**4. The attribute-table row** in `sisepuede/attributes/attribute_transformer_code.csv` — id 73, code `TFR:FGTV:INC_GAS_RECOVERY`. Without this row, the `Transformer.__init__` constructor raises before `Transformers` can finish wiring itself up.

**5. A Transformation** referencing it can now be written, with a name like `tx_fgtv_increase_gas_recovery`, choosing a magnitude, a ramp window, and any other parameters the wrapper accepts. That Transformation, and *only* that Transformation (or others built on the same Transformer), can appear inside a strategy.

## Naming conventions

Two parallel naming families, easy to confuse:

| Object | Naming pattern | Example | Where it lives |
|---|---|---|---|
| Transformer code | `TFR:<SECTOR>:<ACTION>` (uppercase, colon-delimited) | `TFR:FGTV:INC_GAS_RECOVERY` | `attribute_transformer_code.csv`, `Transformers.__init__` |
| Transformer wrapper method | `_trfunc_<sector>_<action>` (snake_case) | `_trfunc_fgtv_increase_gas_recovery` | `transformers.py` |
| Transformer base function | `transformation_<sector>_<action>` | `transformation_fgtv_increase_gas_recovery` | `lib/_baselib_<sector>.py` |
| Transformation id | `tx_<sector>_<action>` (snake_case, `tx_` prefix) | `tx_fgtv_increase_gas_recovery` | strategy YAML, `attribute_strategy.csv` |

The `TFR:` family identifies *code*. The `tx_` family identifies *registered policy interventions*. Mixing them up is the single most common error in newcomer pull requests — and the attribute-table cross-checks in `ModelAttributes._check_attribute_tables` will reject inconsistencies at startup, but only if both tables exist. Always check both.

## Why the distinction matters

`SISEPUEDEExperimentalManager` does not consume Transformers directly. It consumes **Strategies**, which are ordered collections of **Transformations**, which reference **Transformers**. The chain is:

```
Strategy  →  Transformation(s)  →  Transformer  →  base function  →  modified DataFrame
   ^               ^                    ^
   |               |                    |
attribute      YAML/attr           attribute_transformer_code.csv
_strategy.csv  table row            + Transformers registry
```

If you skip steps — write a base function but never wrap it, or wrap it but never add the attribute-table row, or add the row but never write a Transformation YAML — the manager cannot reach your code. The exploratory pipeline will silently apply nothing.

This is also why **you should never invent a `transformation_id`** in conversation, in NDC mappings, or in client-facing reports. If `tx_<your_idea>` is not in `attribute_strategy.csv`, the model cannot run it, no matter how clean the name sounds.

## Summary comparison

| Aspect | Transformer | Transformation |
|---|---|---|
| What it is | Python callable wrapped in a class | Parameterized configuration referencing a Transformer |
| Class name | `Transformer` | `Transformation` |
| Lives in | `transformers/transformers.py` + `transformers/lib/_baselib_*.py` | `transformers/transformations.py`, parameterized via YAML |
| Identifier | `TFR:<SECTOR>:<NAME>` (uppercase, colons) | `tx_<sector>_<name>` (snake_case, `tx_` prefix) + integer id |
| Registered in | `attribute_transformer_code.csv` | `attribute_strategy.csv` (indirectly, via strategies) |
| Answers | HOW to modify the DataFrame | WHAT policy and parameters to apply |
| Cardinality | One per supported intervention type | Many per Transformer (different magnitudes, ramps, categories) |
| Consumed by | `Transformation`, `Strategy` | `Strategy`, `SISEPUEDEExperimentalManager` |

In the next module we'll look inside the `Transformer` registry itself — the `Transformers` class with its hundred-plus appended objects — and see how it is constructed at startup and how `get_transformer(code)` retrieval works in practice.

<Quiz>
  <Question prompt="Which file would you edit to change the actual DataFrame mutation logic of an AFOLU transformer?">
    <Choice correct>`sisepuede/transformers/lib/_baselib_afolu.py`</Choice>
    <Choice>`sisepuede/transformers/transformations.py`</Choice>
    <Choice>`sisepuede/attributes/attribute_strategy.csv`</Choice>
    <Choice>`sisepuede/models/afolu.py`</Choice>
  </Question>
  <Question prompt="A teammate tells you they are 'using the transformation tx_fgtv_inc_gas_recovery_v2'. The model raises an error. What is the most likely root cause?">
    <Choice>The base function in `_baselib_energy.py` has a bug.</Choice>
    <Choice correct>That `transformation_id` is not registered in `attribute_strategy.csv`, so it does not exist in the official model registry.</Choice>
    <Choice>The Transformer code `TFR:FGTV:INC_GAS_RECOVERY` was not appended to `all_transformers`.</Choice>
    <Choice>The YAML strategy file is missing a `magnitude` field.</Choice>
  </Question>
  <Question prompt="What is the relationship between a Transformer and a Transformation?">
    <Choice>They are the same object — `Transformation` is just a deprecated alias for `Transformer`.</Choice>
    <Choice>A Transformer wraps one or more Transformations and applies them in order.</Choice>
    <Choice correct>A Transformation references exactly one Transformer and supplies its parameters; many Transformations can target the same Transformer with different parameter sets.</Choice>
    <Choice>A Transformer references one or more Transformations and selects which to apply at runtime based on the strategy id.</Choice>
  </Question>
</Quiz>
