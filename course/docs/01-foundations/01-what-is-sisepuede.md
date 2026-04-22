---
id: what-is-sisepuede
title: "What is SISEPUEDE?"
sidebar_position: 1
---

SISEPUEDE is an integrated Python/Julia modeling framework for exploring country-level decarbonization pathways under deep uncertainty. Rather than producing a single "optimal" trajectory, it is built around the idea that the future is genuinely unknown — so the right question is not *what will happen* but *which policies remain robust across the widest range of futures*. This lesson introduces what SISEPUEDE is, where it comes from, and why it was designed the way it was.

## Learning objectives

- Explain what SISEPUEDE stands for and what problem it was designed to solve.
- Describe the role of Decision Making under Deep Uncertainty (DMDU) in the model's experimental design.
- Identify the four emission sectors SISEPUEDE models and the cross-cutting socioeconomic driver.
- Name the institutional partners behind SISEPUEDE and the key publications that describe it.
- Locate the main entry-point files in the codebase that correspond to the model's architecture.

## The problem SISEPUEDE solves

Climate policy analysis faces a fundamental tension: decisions must be made today, but the consequences of those decisions play out over decades in systems whose behavior — economic growth, technology costs, behavioral change, natural carbon cycles — cannot be known with precision. Standard scenario analysis sidesteps this by picking a small number of "storylines" and optimizing within each one. The problem is that a policy that looks excellent under one storyline can perform poorly under another. Analysts and decision-makers are left without a principled way to compare robustness across the full uncertainty space.

SISEPUEDE was built specifically to address this. It applies **Decision Making under Deep Uncertainty (DMDU)** methods, treating the space of possible futures as a high-dimensional domain to be sampled rather than a fixed set of scenarios. The framework generates thousands of futures using Latin Hypercube Sampling (LHS) — varying both exogenous uncertainties (economic growth rates, technology diffusion) and lever-effect uncertainties (how effective a policy intervention actually is) — and then evaluates every combination of policy strategy and future. The result is a picture of *which strategies work across the widest range of conditions*, not just which strategy looks best under the analyst's favorite assumptions.

The emission calculations themselves follow a **bottom-up partial equilibrium** approach grounded in the **2006 IPCC Guidelines for National Greenhouse Gas Inventories** and their **2019 Refinement**. This means every emission factor, activity driver, and gas-conversion constant traces back to a documented IPCC method. Outputs are reported in MT CO2-equivalent using GWP100 values from IPCC AR6 WG1 Chapter 7, Table 7.SM.7. The country or region is the natural unit of analysis, making SISEPUEDE directly applicable to NDC planning, carbon-neutrality roadmaps, and sectoral mitigation cost estimation.

## Who builds it

SISEPUEDE is a collaboration across three institutions:

- **RAND Corporation** — principal developer James Syme leads the core framework (Python/Julia), the experimental design machinery, and the `jcsyme/sisepuede` GitHub repository.
- **Inter-American Development Bank (IDB)** — co-funder and primary application partner, supporting country-level implementations across Latin America and the Caribbean.
- **Tecnológico de Monterrey, EGobiernoyTP / Decision Science Center** (Dr. Edmundo Molina's group) — country implementation, input data pipelines, MAC curve integration, and NDC-to-SISEPUEDE transformation mapping.

Three publications anchor the framework:

- **Kalra et al. (2023)** — the core framework paper describing the SISEPUEDE methodology, the DMDU experimental design, and its application to LAC decarbonization analysis.
- **"Costos y beneficios de lograr la carbono-neutralidad en América Latina y el Caribe"** (BID/RAND, 2023) — regional policy application using SISEPUEDE to estimate the costs and benefits of carbon neutrality across Latin America and the Caribbean.
- **Esteves et al. (2024)** — *Frontiers in Climate* article on job creation and decarbonization synergies in LAC, demonstrating SISEPUEDE as a platform for co-benefit analysis.

## What makes it different

Several design choices distinguish SISEPUEDE from other GHG accounting or integrated assessment tools:

- **Four IPCC emission sectors plus a socioeconomic driver.** SISEPUEDE models Agriculture, Forestry and Land Use (AFOLU); Circular Economy (waste management, wastewater, industrial processes); Energy (stationary combustion, transport, electricity generation, fugitive emissions); and IPPU (industrial processes and product use, including F-gases and cement). A fifth module, Socioeconomic, is not an emission sector but drives demand across all others through GDP, population, and trade variables.
- **LHS-based DMDU, not scenario trees.** The framework maintains two separate LHS tables — one for exogenous uncertainties (`arr_lhs_x`) and one for lever-effect uncertainties (`arr_lhs_l`) — and combines them into a four-design structure (baseline, X-only, L-only, full uncertainty). Every run is indexed by a `primary_id` encoding the `(design_id, strategy_id, future_id)` triplet, enabling exact reproducibility and efficient database queries.
- **Partial equilibrium at country/region scope.** SISEPUEDE does not solve a global general equilibrium. It takes exogenous demand trajectories (GDP, population) and computes emissions bottom-up from activity levels and emission factors. This makes it tractable for country teams to calibrate and maintain, while remaining consistent with IPCC accounting conventions.
- **Composable policy transformers.** Policy interventions are represented as **transformers** — functions that modify a baseline input DataFrame to reflect a specific technology or behavioral change. Transformers are catalogued in an official attribute table and can be combined into **strategies**. This separation of "what the policy does to the data" from "how the model computes emissions" keeps the experimental design clean and auditable.
- **Python/Julia hybrid for energy optimization.** The electricity sector dispatches generation through a Julia-based LP (NeMo-Mod), called via a SQLite handshake. All other sectors run in pure Python. This allows the computationally intensive LP to be solved efficiently while keeping the rest of the framework accessible to Python practitioners.

## In the codebase

:::note Key entry points

The three files below are the best starting points for reading the SISEPUEDE source code.

- **`sisepuede/core/model_attributes.py`** — `ModelAttributes` class. This is the schema registry: it reads all attribute CSVs, defines every variable name, and enforces consistency across sectors. Every other class receives a `ModelAttributes` instance at construction time.
- **`sisepuede/manager/sisepuede_models.py`** — `SISEPUEDEModels` class. This orchestrator runs the six sectoral model phases in dependency order (Socioeconomic → AFOLU → CircularEconomy → EnergyProduction → EnergyConsumption → IPPU) and assembles the full output table.
- **`sisepuede/manager/sisepuede.py`** — `SISEPUEDEExperimentalManager` class. Entry point for full experimental runs: reads the base input database, applies LHS sampling, iterates over `primary_id` values, and writes results to the output database.

:::

## Recap

- SISEPUEDE is a bottom-up, partial equilibrium GHG modeling framework that applies DMDU methods to evaluate the robustness of decarbonization strategies across thousands of sampled futures.
- It covers four IPCC emission sectors — AFOLU, Circular Economy, Energy, and IPPU — plus a Socioeconomic driver, all grounded in 2006 IPCC Guidelines and the 2019 Refinement.
- The framework is a joint product of RAND Corporation, the Inter-American Development Bank, and Tecnológico de Monterrey, documented in three peer-reviewed or institutional publications (Kalra 2023, BID/RAND 2023, Esteves 2024).

---

<Quiz questions={[
  {q: "What does SISEPUEDE's use of Latin Hypercube Sampling primarily enable?", choices: [
    {text: "Faster computation of the NeMo-Mod energy LP"},
    {text: "Exploration of robustness across a wide range of uncertain futures", correct: true, explain: "SISEPUEDE generates thousands of (strategy, future) combinations via LHS to evaluate which policies remain robust under deep uncertainty — a core DMDU principle."},
    {text: "Automatic calibration of IPCC emission factors"},
  ]},
  {q: "Which institutional partner leads the core Python/Julia framework development?", choices: [
    {text: "Inter-American Development Bank (IDB)"},
    {text: "Tecnológico de Monterrey"},
    {text: "RAND Corporation", correct: true, explain: "James Syme at RAND Corporation is the principal developer of the core SISEPUEDE framework, maintained in the jcsyme/sisepuede GitHub repository."},
  ]},
  {q: "What role does the Socioeconomic module play in SISEPUEDE?", choices: [
    {text: "It calculates emissions from industrial processes and product use"},
    {text: "It drives demand across all emission sectors through GDP, population, and trade variables", correct: true, explain: "The Socioeconomic module is not itself an emission sector — it computes the demand scalars (GDP, GDP per capita, population) that feed into AFOLU, Energy, CircularEconomy, and IPPU."},
    {text: "It manages the LHS sampling tables for exogenous uncertainties"},
  ]},
]}/>
