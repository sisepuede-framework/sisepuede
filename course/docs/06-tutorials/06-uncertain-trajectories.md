---
title: "Tutorial 6 — Uncertain Trajectories"
sidebar_position: 6
---

# Tutorial 6 — Uncertain Trajectories

This tutorial operationalizes the Decision Making under Deep Uncertainty (DMDU) machinery introduced in **Module 15 (Experimental Design)**. You will move beyond a single deterministic baseline and learn how SISEPUEDE turns input templates into thousands of plausible futures via Latin Hypercube Sampling. By the end you will be comfortable inspecting `FutureTrajectories`, manipulating individual `SamplingUnit` objects, and reading the LHS tables that drive every uncertainty run.

## Learning objectives

- Explain how a column in `MODEL_BASE_INPUT_DATABASE` becomes a `SamplingUnit` and is classified as a **lever (L)** or **exogenous uncertainty (X)** trajectory group.
- Generate `arr_lhs_l` and `arr_lhs_x` matrices with `LHSDesign.generate_lhs()` and apply a design row's `(m, b, sup, inf)` transform.
- Materialize a perturbed wide-format input DataFrame for an arbitrary `primary_id` using `OrderedDirectProductTable` and `generate_future_from_lhs_vector()`.
- Distinguish the four canonical designs (0=baseline, 1=X-only, 2=L-only, 3=full uncertainty) and recognize when each is appropriate.
- Diagnose simplex (fuel-mix) trajectory groups whose components must sum to one.

## Prerequisites

You should have completed **Modules 1–15**. In particular you need a working understanding of the variable schema (Module 4), sectoral models (Modules 6–13), strategy composition (Module 14), and the LHS / primary-id pipeline (Module 15). Tutorials 1–5 should already run end-to-end on your machine.

## What you'll do

1. **Inspect a `FutureTrajectories` instance** for a single region — list its `SamplingUnit` objects, count L vs. X groups, and identify simplex groups by shared group integer.
2. **Generate LHS samples** by calling `LHSDesign.generate_lhs()` and then `retrieve_lhs_tables_by_design(design_id)` for each of the four designs; verify shapes `(n_trials, n_factors)` and the reserved `future_id=0` baseline row.
3. **Decode a `primary_id`** with `OrderedDirectProductTable.get_dims_from_key()` and round-trip it back through `get_key_value()`.
4. **Materialize the perturbed input** by calling `SISEPUEDE.generate_scenario_database_from_primary_key()` and comparing a handful of variable fields against the baseline to confirm that L-trajectories move only when a non-baseline strategy is active.

<TutorialCallout id="t6" />

The full executable notebook lives at [`./rendered/t6`](./rendered/t6).

## Reference code

- `sisepuede/data_management/lhs_design.py` — `LHSDesign`, the `pyDOE2` wrapper and design-row affine transform.
- `sisepuede/data_management/sampling_unit.py` — `FutureTrajectories`, `SamplingUnit`, and the L/X classification logic.
- `sisepuede/data_management/ordered_direct_product_table.py` — mixed-radix `primary_id` encoding.
- `sisepuede/manager/sisepuede.py` — `generate_scenario_database_from_primary_key()` (line 1581).

## Reflection questions

1. If a stakeholder asks "which transformations actually matter under deep uncertainty?", which of the four designs would you compare, and what summary statistic over `MODEL_OUTPUT` would you compute to defend your answer?
2. A simplex trajectory group (e.g., a fuel-mix fraction across five fuels) shares one group integer. What would break in your analysis if you accidentally re-sampled each component independently, and how does `SamplingUnit` prevent that?
3. You observe that two `future_id` values produce nearly identical emissions for a given strategy. Is this evidence of redundant LHS coverage, of insensitivity in your levers, or of a degenerate uncertainty range — and how would you tell them apart using the L vs. X table split?
