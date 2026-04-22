---
id: architecture
title: "Architecture Overview"
sidebar_position: 2
---

SISEPUEDE is a hybrid **Python + Julia** framework organized around a deterministic 8-phase pipeline. Python owns the schema, sectoral models, orchestration, and I/O. Julia owns one narrow but computationally demanding task: solving the energy-system linear program via **NeMo-Mod**. The two runtimes communicate through a temporary **SQLite database** — no shared memory, no direct function calls across the language boundary.

Understanding this pipeline end-to-end tells you where any given variable comes from, where any given output is written, and how policy interventions (transformers) slot in between phases.

---

## Learning objectives

- Trace the 8-phase execution pipeline from schema compilation to database output.
- Explain what Python handles, what Julia handles, and how the SQLite handshake bridges them.
- Name the three key Python orchestrators (`ModelAttributes`, `SISEPUEDEModels`, `SISEPUEDEExperimentalManager`) and state each one's responsibility.
- Read the fixed sectoral execution order and justify it from cross-sector data dependencies.
- Identify which phase is the entry point for transformer-based policy analysis.

---

## The 8 phases

<PipelinePhase n={0} />

**Phase 0 — Schema compilation (`ModelAttributes`)**
Before any data is touched, `ModelAttributes` reads all attribute tables from `dir_attributes` and builds the complete variable registry: categories, units, GWP values, and the naming schema that every sectoral model must respect. This object is instantiated once and passed to every downstream component.

---

<PipelinePhase n={1} />

**Phase 1 — Template ingestion (`BaseInputDatabase`)**
Country-level Excel templates are read for each sector and region. `InputTemplate.build_inputs_by_strategy()` produces a long DataFrame keyed by `(strategy_id, variable_spec, time_period)`. The result is `base_input_database.database` — the baseline trajectory for every variable, before any uncertainty sampling.

---

<PipelinePhase n={2} />

**Phase 2 — Uncertainty sampling (`FutureTrajectories` / `LHSDesign`)**
SISEPUEDE draws two separate Latin Hypercube samples: one for **lever-effect uncertainties** (`arr_lhs_l`) and one for **exogenous uncertainties** (`arr_lhs_x`). Both arrays live in [0, 1] with shape `(n_trials, n_factors)`. `future_id = 0` is always reserved for the deterministic baseline — no sampling applied.

---

<PipelinePhase n={3} />

**Phase 3 — Primary key index (`OrderedDirectProductTable`)**
The three experimental dimensions — `design_id`, `strategy_id`, `future_id` — are encoded as a single mixed-radix integer `primary_id`. No full scenario table is materialized in memory; instead, `get_dims_from_key(primary_id)` and `get_key_value(**dims)` provide O(n\_dims) lookups on demand. Region is excluded from `primary_id`; runs are addressed as `(region, primary_id)`.

---

<PipelinePhase n={4} />

**Phase 4 — Input materialization**
On demand for each `(region, primary_id)`, SISEPUEDE decodes the primary key back to `(design, strategy, future)`, retrieves the matching LHS rows, and calls `future_trajectories.generate_future_from_lhs_vector(lhs_x, lhs_l)` to produce the perturbed wide-format input DataFrame that will feed the sectoral models.

---

<PipelinePhase n={5} />

**Phase 5 — Sectoral model execution (`SISEPUEDEModels`)**
All six sectoral models run in a fixed dependency order (detailed in the Execution order section below). Each model accepts the wide-format input DataFrame and returns a wide-format output DataFrame of emissions and intermediate variables. `SISEPUEDEModels` orchestrates the handoffs and assembles the full output table.

---

<PipelinePhase n={6} />

**Phase 6 — Julia / NeMo-Mod LP (Energy Production)**
The electricity dispatch model is the only component that crosses the language boundary. Python writes the energy-system problem to a temporary SQLite database; Julia reads it, solves the LP via NeMo-Mod, and writes results back to the same database; Python then reads the solution. `SISEPUEDEModels.__init__` accepts `fp_julia`, `fp_nemomod_reference_files`, and `fp_nemomod_temp_sqlite_db` to configure this boundary. Setting `allow_electricity_run=False` skips Julia entirely, which is useful for development and testing.

---

<PipelinePhase n={7} />

**Phase 7 — Output database (`SISEPUEDEOutputDatabase`)**
Results are written in batches to a SQLite (via SQLAlchemy) or CSV backend. Key tables include `MODEL_OUTPUT`, `ATTRIBUTE_STRATEGY`, `LHC_SAMPLES_LEVER_EFFECTS`, `LHC_SAMPLES_EXOGENOUS_UNCERTAINTIES`, and `MODEL_BASE_INPUT_DATABASE`. Each session carries a unique `AnalysisID` for full reproducibility.

---

## Python vs Julia boundary

| Concern | Runtime |
|---|---|
| Variable schema, attribute tables | Python (`ModelAttributes`) |
| All sectoral emission models | Python (`AFOLU`, `CircularEconomy`, `EnergyConsumption`, `IPPU`, `Socioeconomic`) |
| LHS sampling, primary key indexing | Python |
| Orchestration and I/O | Python (`SISEPUEDEModels`, `SISEPUEDEExperimentalManager`) |
| Energy Production LP (electricity dispatch) | **Julia** (NeMo-Mod) |
| Handshake medium | Temporary **SQLite database** |

The Julia files live under `sisepuede/julia/` and include `call_nemomod.jl`, `setup_analysis.jl`, `setup_runs.jl`, and `support_functions.jl`. Python manages the Julia process lifecycle through `pyjuliapkg`. The rest of the codebase has no Julia dependency — you can run all non-electricity models without installing Julia.

---

## Key orchestrators

- **`ModelAttributes`** (`sisepuede/core/model_attributes.py`) — The schema registry. Instantiated first; passed to every other component. Reads all attribute CSVs, builds `dict_variable_fields_to_model_variables`, and runs 13 cross-table consistency checks at init time. Nothing else can start without it.

- **`SISEPUEDEModels`** (`sisepuede/manager/sisepuede_models.py`) — The sectoral executor. Holds instances of all six sectoral model classes and exposes a single `project()` call that runs them in the correct dependency order, assembles outputs, and returns a unified wide-format DataFrame.

- **`SISEPUEDEExperimentalManager`** (`sisepuede/manager/sisepuede.py`) — The experiment manager. Owns the full pipeline from baseline database through LHS sampling, primary-key encoding, input materialization, calls to `SISEPUEDEModels`, and final output batching. A single `primary_id` run is reproducible at any time via `generate_scenario_database_from_primary_key()`.

---

## Execution order

Sectoral models run in a fixed sequence because later models consume outputs from earlier ones. The dependency graph is acyclic and looks like this:

```mermaid
graph LR
  S[Socioeconomic] --> A[AFOLU]
  A --> C[Circular Economy]
  C --> EP[Energy Production]
  EP --> EC[Energy Consumption]
  EC --> I[IPPU]
```

**Why this order?**

- **Socioeconomic first** — GDP, population, and GDP/capita scalars are needed by every sectoral model to drive demand. Nothing else can run without them.
- **AFOLU second** — Land use, crop yields, and livestock outputs determine agricultural waste and organic content flowing into Circular Economy.
- **Circular Economy third** — Solid waste, wastewater, and industrial process outputs feed into energy demand calculations and provide recycled-material fractions.
- **Energy Production fourth** — The NeMo-Mod LP needs demand projections from all prior sectors. Its output (the electricity supply mix) feeds Energy Consumption.
- **Energy Consumption fifth** — Stationary combustion, transport, and fugitive emissions (`FGTV`, `INEN`, `SCOE`, `TRNS`, `TRDE`) are calculated once the electricity mix is known.
- **IPPU last** — Industrial processes and product use, including F-gases, cement, and CCS, pull recycled material fractions from Circular Economy output. Running IPPU last ensures those fractions are available.

---

## In the codebase

:::info In the codebase

| Component | File | Key entry point |
|---|---|---|
| `ModelAttributes` | `sisepuede/core/model_attributes.py` | `ModelAttributes.__init__(dir_attributes)` |
| `SISEPUEDEModels` | `sisepuede/manager/sisepuede_models.py` | `SISEPUEDEModels.project()` |
| `SISEPUEDEExperimentalManager` | `sisepuede/manager/sisepuede.py` | `generate_scenario_database_from_primary_key()` |
| Julia NeMo-Mod entry | `sisepuede/julia/call_nemomod.jl` | Called by Python via `pyjuliapkg` |
| Julia support | `sisepuede/julia/support_functions.jl` | Utility functions for NeMo-Mod setup |

:::

---

## Recap

- SISEPUEDE runs an **8-phase pipeline** from schema compilation (Phase 0) to output persistence (Phase 7).
- **Python** handles schema, sectoral models, sampling, orchestration, and I/O. **Julia** handles the electricity LP (NeMo-Mod) via an SQLite handshake.
- The three key Python orchestrators are `ModelAttributes` (schema), `SISEPUEDEModels` (run), and `SISEPUEDEExperimentalManager` (experiment pipeline).
- Sectoral execution order is fixed: Socioeconomic → AFOLU → Circular Economy → Energy Production → Energy Consumption → IPPU — driven by data dependencies that flow strictly forward.
- You can run all non-electricity models without Julia by passing `allow_electricity_run=False` to `SISEPUEDEModels`.

---

<Quiz>
  {{
    "questions": [
      {{
        "id": "arch-q1",
        "text": "In which phase does SISEPUEDE encode the combination of design_id, strategy_id, and future_id into a single integer?",
        "options": [
          "Phase 1 — Template ingestion",
          "Phase 2 — Uncertainty sampling",
          "Phase 3 — Primary key index",
          "Phase 5 — Sectoral model execution"
        ],
        "correct": 2,
        "explanation": "Phase 3 uses OrderedDirectProductTable to encode the three experimental dimensions as a mixed-radix primary_id. No full scenario table is materialized — only the index structure is built."
      }},
      {{
        "id": "arch-q2",
        "text": "Which of the following best describes how Python and Julia communicate in SISEPUEDE?",
        "options": [
          "Python calls Julia functions directly using a foreign function interface.",
          "Julia writes results to a shared in-memory DataFrame that Python reads.",
          "Python writes the energy problem to a temporary SQLite database; Julia reads, solves, and writes back; Python reads the solution.",
          "Julia spawns a subprocess that posts results to a REST API consumed by Python."
        ],
        "correct": 2,
        "explanation": "The handshake is entirely through a temporary SQLite database (fp_nemomod_temp_sqlite_db). This decouples the two runtimes cleanly — no shared memory or network calls required."
      }},
      {{
        "id": "arch-q3",
        "text": "Why does IPPU run last in the sectoral execution order?",
        "options": [
          "IPPU is the most computationally expensive model and runs best when memory is freed by earlier models.",
          "IPPU pulls recycled material fractions from Circular Economy output, so it must wait for that output to be available.",
          "IPPU requires the electricity supply mix from Energy Production to calculate F-gas emissions.",
          "IPPU is optional and only runs if enabled in the configuration file."
        ],
        "correct": 1,
        "explanation": "IPPU explicitly consumes recycled-material fractions produced by CircularEconomy.project(). Running IPPU last ensures those fractions are fully resolved before industrial process calculations begin."
      }}
    ]
  }}
</Quiz>
