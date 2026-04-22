---
title: "Tutorial 5 — Paris Article 6 Analysis"
sidebar_position: 5
---

import TutorialCallout from '@site/src/components/TutorialCallout';

**Article 6 of the Paris Agreement** establishes the framework for cooperative implementation of NDCs, allowing countries to trade Internationally Transferred Mitigation Outcomes (ITMOs) and pursue joint mitigation projects. Quantifying the additionality, robustness, and cost-effectiveness of candidate ITMO portfolios requires a model that can compare strategies across many futures — exactly what SISEPUEDE was designed to do. This tutorial walks through an applied Article 6 case study, showing how to structure the strategy space, run paired baseline/intervention experiments, and interpret the resulting emission deltas as tradable mitigation units.

## Learning objectives

By the end of this tutorial you will be able to:

- Frame an Article 6 cooperative mitigation question as a SISEPUEDE strategy comparison.
- Design a baseline-vs-intervention strategy pair whose emissions difference defines candidate ITMOs.
- Run the experiment across multiple futures to characterize uncertainty in mitigation outcomes.
- Aggregate sectoral emission deltas into ITMO-equivalent volumes (MT CO₂e) over a crediting period.
- Discuss additionality, baseline integrity, and double-counting risks in light of the model results.

## Prerequisites

- **Tutorials 1–4** — environment setup, running SISEPUEDE, building strategies, and post-processing outputs.
- **Module 13** — Strategy design and transformer composition.
- **Module 14** — Experimental design (strategies × futures × regions).
- **Module 15** — Interpreting `MODEL_OUTPUT` and computing emission differences.

You should also have a working installation with the Julia/NemoMod backend operational (see Tutorial 1).

## What you will do

1. **Define the Article 6 scenario.** Pick a host country and a candidate cooperative mitigation activity (e.g., fugitive gas recovery, reforestation, fuel switching). Identify the corresponding transformers in `ATTRIBUTE_STRATEGY` — never invent IDs.
2. **Build the strategy pair.** Construct a baseline strategy (NDC reference) and an intervention strategy that activates the Article 6 transformer set on top of the baseline.
3. **Run the experiment across futures.** Execute both strategies under designs 0 (deterministic) and 3 (full uncertainty) so you obtain both a central estimate and a robustness envelope for the ITMO volume.
4. **Aggregate and interpret.** Compute annual emission deltas by sector and gas, sum over the crediting period, and discuss whether the result is robust to exogenous uncertainty (additionality under deep uncertainty).

<TutorialCallout id="t5" />

The fully rendered notebook with code, plots, and ITMO volume tables is available here: [Tutorial 5 — rendered notebook](./rendered/t5).

## Reflection questions

1. **Baseline integrity.** Across the future ensemble, how sensitive is the computed ITMO volume to the baseline assumption? If the central estimate falls inside the baseline's own uncertainty band, what does that imply about claimed additionality?
2. **Sectoral attribution.** Article 6 transactions require clear attribution of mitigation to a specific activity. When a transformer (for example, electrification) shifts emissions across the AFOLU/Energy/IPPU boundary, how would you defend the attribution to a host-country regulator or to a corresponding adjustment auditor?
3. **Policy use.** If you were advising the host country's Designated National Authority, which pieces of SISEPUEDE output (time series, sectoral decomposition, robustness envelope) would you put in the Article 6 authorization letter, and which would you keep as internal sensitivity analysis?
