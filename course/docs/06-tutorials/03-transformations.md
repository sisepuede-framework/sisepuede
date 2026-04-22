---
title: "Tutorial 3 — Working with Transformations"
sidebar_position: 3
---

This tutorial walks through the **Transformer / Transformation / Strategy** stack that sits at the heart of every SISEPUEDE policy run. It builds directly on Modules 13 and 14, where you saw how a baseline input DataFrame is mutated into a counterfactual through composable, attribute-driven policy objects.

By the end of this notebook you will be comfortable loading the transformer registry, configuring individual transformations, bundling them into a strategy, and applying that strategy to a baseline scenario.

## Learning objectives

- Distinguish a `Transformer` (the mutation function) from a `Transformation` (a parameterized invocation) from a `Strategy` (an ordered bundle).
- Locate and read the relevant attribute tables: `attribute_transformer.csv`, `attribute_transformation.csv`, and `attribute_strategy.csv`.
- Instantiate the `Transformers` collection against a `ModelAttributes` instance and a baseline input database.
- Apply a strategy to a baseline DataFrame and confirm which variable fields were modified.
- Inspect a strategy's `transformation_specification` to understand what it actually does.

## Prerequisites

- **Module 13 — Transformers:** the canonical `tx_*` IDs, the `magnitude` / `magnitude_type` / `vec_ramp` parameter pattern, and how transformers reach into specific variable fields.
- **Module 14 — Strategies:** how transformations compose, how `strategy_id` is registered in `attribute_strategy.csv`, and the role of `baseline_strategy_id`.
- Tutorials 1 and 2 (environment setup and baseline run).

## What you'll do

1. **Load the registry.** Build a `Transformers` instance from your examples directory and inspect its attribute tables to see every available `transformer_code`, `transformation_code`, and `strategy_code`.
2. **Pick and configure a transformation.** Choose a concrete transformation (for example, an AFOLU reforestation lever or an FGTV gas-recovery lever), read its YAML/JSON config, and adjust its `magnitude` and ramp.
3. **Compose a strategy.** Either select a registered strategy from `attribute_strategy.csv` or build an ad-hoc bundle of transformation codes, then apply it to the baseline input DataFrame.
4. **Verify the effect.** Diff the resulting DataFrame against the baseline on the variable fields the transformer targets, and confirm time profile, sign, and magnitude match expectations.

<TutorialCallout id="t3" />

Open the rendered notebook here: [Tutorial 3 — Working with Transformations](./rendered/t3).

## Reflection questions

1. What is the practical difference between editing a `Transformer`'s Python implementation and editing a `Transformation`'s configuration? When would each be appropriate?
2. If two transformations in the same strategy modify the same variable field, what determines the final value — and where in the codebase is that resolution implemented?
3. Why does SISEPUEDE separate the registered strategies in `attribute_strategy.csv` from the underlying transformations, rather than treating each policy package as a monolithic object?
