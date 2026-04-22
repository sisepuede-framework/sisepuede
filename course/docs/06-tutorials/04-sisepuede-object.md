---
title: "Tutorial 4 — The SISEPUEDE Object"
sidebar_position: 4
---

import TutorialCallout from '@site/src/components/TutorialCallout';

In Tutorials 1–3 you worked one layer at a time: schemas, sectoral models, and transformers. This tutorial zooms out to the top-level `SISEPUEDE` class — the orchestrator introduced in **Module 2 (Architecture)** that wires every component into a reproducible experimental pipeline, including the LHS sampling and `primary_id` indexing covered in **Module 15 (Experimental Design)**. By the end you will be able to launch a full multi-strategy, multi-future run with a single object.

## Learning objectives

- Instantiate the `SISEPUEDE` class and understand what it builds at construction time
- Identify the role of `SISEPUEDEExperimentalManager`, `SISEPUEDEModels`, and `SISEPUEDEOutputDatabase` as sub-orchestrators
- Configure a run by selecting strategies, designs, and a number of futures
- Trigger an end-to-end experiment with `project_scenarios()` and inspect the resulting database
- Reproduce any single scenario from its `primary_id` using `generate_scenario_database_from_primary_key()`

## Prerequisites

- **Module 1 — Installation & Environment**
- **Module 2 — Architecture** (orchestrator vs. sectoral models vs. transformers)
- **Module 3 — Variable Schema & ModelAttributes**
- **Module 15 — Experimental Design** (LHS, designs, primary keys)
- Tutorials 1–3 completed

## What you'll do

1. **Instantiate `SISEPUEDE`** — pass in regions, strategies, the input templates directory, and an `AnalysisID`. Inspect the attached `experimental_manager`, `models`, and `output_database` instances.
2. **Inspect the experimental design** — walk through `ATTRIBUTE_DESIGN`, `ATTRIBUTE_STRATEGY`, and the two LHC sample tables (`LHC_SAMPLES_LEVER_EFFECTS`, `LHC_SAMPLES_EXOGENOUS_UNCERTAINTIES`) to see how `primary_id` is composed.
3. **Run scenarios** — call `project_scenarios(primary_keys=...)` for a small slice (e.g. 1 region × 2 strategies × 4 futures) and watch outputs land in the SQLite/Parquet backend.
4. **Round-trip a scenario** — pick a `primary_id` from `ATTRIBUTE_PRIMARY` and use `generate_scenario_database_from_primary_key()` to rebuild the exact perturbed input DataFrame that produced the stored emissions.

<TutorialCallout id="t4" />

The full executable notebook with code, expected outputs, and a worked example on a small region is here:

[Open the rendered Tutorial 4 notebook →](./rendered/t4)

## Reflection questions

1. The `SISEPUEDE` constructor is expensive — it builds `ModelAttributes`, ingests templates via `BaseInputDatabase`, generates LHS tables, and constructs the `OrderedDirectProductTable`. Which of these steps would you cache across runs of the same region, and which must be regenerated whenever you add a new strategy?
2. `SISEPUEDEModels` runs sectors in a fixed order (Socioeconomic → AFOLU → CircularEconomy → Energy → IPPU). What would break if you ran IPPU before CircularEconomy, given that IPPU pulls recycled-material fractions from the CircularEconomy output?
3. If two analysts on different machines share the same input templates, the same `AnalysisID`, and the same random seed, should their `MODEL_OUTPUT` tables match row-for-row? What in the pipeline guarantees (or threatens) that reproducibility?
