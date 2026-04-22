---
title: "Tutorial 1 — Sector Models"
sidebar_position: 1
---

This first hands-on tutorial puts the sectoral theory from **Modules 7–12** into practice. You will instantiate each of SISEPUEDE's emission models directly, project them in isolation, and then run the full integrated pipeline through `SISEPUEDEModels`. By the end you should feel comfortable moving between a single-sector debugging workflow and a full multi-sector run.

## Learning objectives

By the end of this tutorial you will be able to:

- Instantiate the five emission models (`AFOLU`, `CircularEconomy`, `EnergyConsumption`, `EnergyProduction`, `IPPU`) plus `Socioeconomic` from a shared `ModelAttributes` instance.
- Call each model's `project()` method on a wide-format input DataFrame and inspect its outputs.
- Recognize the cross-sector data dependencies (e.g. `Socioeconomic` → `AFOLU`, `CircularEconomy` → `IPPU`) that fix the execution order.
- Run an integrated projection through `SISEPUEDEModels.project()` and compare it to the per-sector outputs.
- Read sector outputs using the canonical variable naming schema (`{sector}_{cat}_{descriptor}_{units}`).

## Prerequisites

Before starting, you should have completed:

- **Modules 1–3** — framework foundations, installation, and the `ModelAttributes` registry.
- **Modules 4–6** — variable schema, attribute tables, and how categories like `$CAT-AGRICULTURE$` expand into concrete column names.
- A working SISEPUEDE environment with the Julia/NeMo-Mod backend reachable (required for `EnergyProduction`).

If `julia` is not installed locally, you can still complete steps 1–3 below; the integrated step will fall back or skip the LP solve depending on your config.

## What you'll do

1. **Bootstrap** — load attribute tables, build a `ModelAttributes` instance, and pull a baseline input DataFrame for a single region.
2. **Per-sector projection** — instantiate `Socioeconomic`, `AFOLU`, `CircularEconomy`, `EnergyConsumption`, `EnergyProduction`, and `IPPU`; call `project()` on each in dependency order.
3. **Integrated run** — hand the same input to `SISEPUEDEModels.project()` and verify that the assembled output matches the per-sector results.
4. **Inspect** — slice the output DataFrame to read out emissions by gas and sector in MT CO₂e (GWP100, AR6 WG1).

<TutorialCallout id="t1" />

[Open the rendered notebook](./rendered/t1)

## Reflection questions

After working through the notebook, take a few minutes to think through:

1. Why must `Socioeconomic.project()` always run before `AFOLU.project()`, and what would break in the AFOLU Markov land-use step if it didn't?
2. `IPPU` consumes recycled-material fractions produced by `CircularEconomy`. Trace which output variables carry that handshake — what would happen if you ran `IPPU` on the raw baseline DataFrame instead of the post-`CircularEconomy` frame?
3. Compare a per-sector emissions total against the same total from the integrated `SISEPUEDEModels` run. If they differ, what cross-sector feedback (or lack thereof) is the most likely culprit?
