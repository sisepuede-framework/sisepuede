---
title: "Tutorial 4 — El Objeto SISEPUEDE"
sidebar_position: 4
---

import TutorialCallout from '@site/src/components/TutorialCallout';

En los Tutoriales 1–3 trabajaste una capa a la vez: esquemas, modelos sectoriales y transformadores. Este tutorial hace un acercamiento al nivel superior, la clase `SISEPUEDE` — el orquestador presentado en el **Módulo 2 (Arquitectura)** que conecta cada componente en una canalización experimental reproducible, incluyendo el muestreo LHS y la indexación `primary_id` cubiertos en el **Módulo 15 (Diseño Experimental)**. Al finalizar serás capaz de lanzar una corrida completa multi-estrategia y multi-futuro con un solo objeto.

## Objetivos de aprendizaje

- Instanciar la clase `SISEPUEDE` y comprender qué construye en el momento de la construcción.
- Identificar el papel de `SISEPUEDEExperimentalManager`, `SISEPUEDEModels` y `SISEPUEDEOutputDatabase` como sub-orquestadores.
- Configurar una corrida seleccionando estrategias, diseños y un número de futuros.
- Disparar un experimento de extremo a extremo con `project_scenarios()` e inspeccionar la base de datos resultante.
- Reproducir cualquier escenario individual a partir de su `primary_id` mediante `generate_scenario_database_from_primary_key()`.

## Requisitos previos

- **Módulo 1 — Instalación y Entorno**
- **Módulo 2 — Arquitectura** (orquestador vs. modelos sectoriales vs. transformadores)
- **Módulo 3 — Esquema de Variables y ModelAttributes**
- **Módulo 15 — Diseño Experimental** (LHS, diseños, claves primarias)
- Tutoriales 1–3 completados

## Lo que harás

1. **Instanciar `SISEPUEDE`** — pasa las regiones, estrategias, el directorio de plantillas de entrada y un `AnalysisID`. Inspecciona las instancias adjuntas `experimental_manager`, `models` y `output_database`.
2. **Inspeccionar el diseño experimental** — recorre `ATTRIBUTE_DESIGN`, `ATTRIBUTE_STRATEGY` y las dos tablas de muestras LHC (`LHC_SAMPLES_LEVER_EFFECTS`, `LHC_SAMPLES_EXOGENOUS_UNCERTAINTIES`) para ver cómo se compone `primary_id`.
3. **Ejecutar escenarios** — invoca `project_scenarios(primary_keys=...)` para una porción pequeña (p. ej., 1 región × 2 estrategias × 4 futuros) y observa cómo las salidas se depositan en el backend SQLite/Parquet.
4. **Recuperar un escenario en ida y vuelta** — elige un `primary_id` de `ATTRIBUTE_PRIMARY` y usa `generate_scenario_database_from_primary_key()` para reconstruir el DataFrame de entrada perturbado exacto que produjo las emisiones almacenadas.

<TutorialCallout id="t4" />

El notebook ejecutable completo con código, salidas esperadas y un ejemplo trabajado en una región pequeña está aquí:

[Abrir el notebook renderizado del Tutorial 4 →](./rendered/t4)

## Preguntas de reflexión

1. El constructor de `SISEPUEDE` es costoso — construye `ModelAttributes`, ingiere plantillas vía `BaseInputDatabase`, genera tablas LHS y construye el `OrderedDirectProductTable`. ¿Cuáles de estos pasos almacenarías en caché entre corridas de la misma región, y cuáles deben regenerarse cada vez que agregues una nueva estrategia?
2. `SISEPUEDEModels` ejecuta los sectores en un orden fijo (Socioeconomic → AFOLU → CircularEconomy → Energy → IPPU). ¿Qué se rompería si ejecutaras IPPU antes de CircularEconomy, dado que IPPU obtiene las fracciones de material reciclado de la salida de CircularEconomy?
3. Si dos analistas en máquinas distintas comparten las mismas plantillas de entrada, el mismo `AnalysisID` y la misma semilla aleatoria, ¿deberían sus tablas `MODEL_OUTPUT` coincidir fila por fila? ¿Qué garantiza (o amenaza) esa reproducibilidad en la canalización?
