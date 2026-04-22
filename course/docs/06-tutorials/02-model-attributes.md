---
title: "Tutorial 2 — ModelAttributes"
sidebar_position: 2
---

import TutorialCallout from '@site/src/components/TutorialCallout';

This tutorial puts the variable schema material from **Modules 4-6** into practice. You will instantiate the `ModelAttributes` class, the central registry that defines every input and output variable in SISEPUEDE, and use it to navigate sectors, subsectors, categories, and units. By the end you should be able to look up any variable in the model and understand exactly what it represents.

## Learning objectives

- Instantiate `ModelAttributes` from the bundled attribute table directory and inspect what gets loaded.
- Resolve a `ModelVariable` from its variable name using `get_variable()` and read its `VariableSchema`.
- Retrieve sector and subsector attribute tables with `get_attribute_table()` and enumerate their categories.
- Look up units and conversion factors via `get_unit()` and the unit dimension helpers.
- Map a concrete column name in an input DataFrame back to its model variable using `dict_variable_fields_to_model_variables`.

## Prerequisites

- **Module 4** — Variable schema fundamentals (sector prefixes, category tokens, descriptors).
- **Module 5** — Attribute tables (`cat`, `dim`, `unit`, `other` buckets).
- **Module 6** — `ModelAttributes` lifecycle and the 14-step `__init__` flow.
- A working SISEPUEDE Python install (Tutorial 1).

## What you'll do

1. **Bootstrap the schema.** Build a `ModelAttributes` instance from `sisepuede/attributes/` and confirm the cross-table consistency checks pass.
2. **Browse sectors and subsectors.** Use `get_attribute_table()` to pull category tables for AFOLU, Energy, IPPU, and Circular Economy, and list their categories.
3. **Query variables.** Pick a variable (for example `agrc_yf_$CAT-AGRICULTURE$`) and call `get_variable()` to inspect its schema, expanded fields, and units.
4. **Resolve units.** Use `get_unit()` to read mass, energy, and monetary unit definitions, and convert between them with the unit conversion helpers.

<TutorialCallout id="t2" />

## Run the rendered notebook

A fully executed version of this tutorial — with outputs, attribute table snippets, and unit conversion examples — is available here:

[View the rendered Tutorial 2 notebook](./rendered/t2)

## Reflection questions

1. Given a column name like `agrc_lvst_pop_cattle_dairy` in an input DataFrame, which `ModelAttributes` lookup gets you back to the originating `ModelVariable`, and what does that tell you about the schema's reverse-mapping design?
2. Why does `ModelAttributes` classify CSVs into the four buckets (`cat`, `dim`, `unit`, `other`) before building variables, and what would break if a category table were misclassified?
3. When you call `get_variable()` on a variable whose schema contains `$CAT-AGRICULTURE$`, how many concrete fields does `build_fields()` produce, and what determines that count?
