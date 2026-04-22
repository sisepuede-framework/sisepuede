---
title: "Tutorial 6 — Trayectorias Inciertas"
sidebar_position: 6
---

# Tutorial 6 — Trayectorias Inciertas

Este tutorial operacionaliza la maquinaria de Toma de Decisiones bajo Incertidumbre Profunda (DMDU) presentada en el **Módulo 15 (Diseño Experimental)**. Te moverás más allá de una sola línea base determinista y aprenderás cómo SISEPUEDE convierte plantillas de entrada en miles de futuros plausibles mediante Muestreo Hipercúbico Latino. Al finalizar te sentirás cómodo inspeccionando `FutureTrajectories`, manipulando objetos `SamplingUnit` individuales y leyendo las tablas LHS que impulsan cada corrida bajo incertidumbre.

## Objetivos de aprendizaje

- Explicar cómo una columna en `MODEL_BASE_INPUT_DATABASE` se convierte en una `SamplingUnit` y se clasifica como un grupo de trayectoria de **palanca (L)** o **incertidumbre exógena (X)**.
- Generar las matrices `arr_lhs_l` y `arr_lhs_x` con `LHSDesign.generate_lhs()` y aplicar la transformación `(m, b, sup, inf)` de la fila de un diseño.
- Materializar un DataFrame de entrada perturbado en formato ancho para un `primary_id` arbitrario usando `OrderedDirectProductTable` y `generate_future_from_lhs_vector()`.
- Distinguir los cuatro diseños canónicos (0=línea base, 1=solo X, 2=solo L, 3=incertidumbre completa) y reconocer cuándo es apropiado cada uno.
- Diagnosticar grupos de trayectorias simplex (mezcla de combustibles) cuyos componentes deben sumar uno.

## Requisitos previos

Debes haber completado los **Módulos 1–15**. En particular, necesitas un entendimiento operativo del esquema de variables (Módulo 4), los modelos sectoriales (Módulos 6–13), la composición de estrategias (Módulo 14) y la canalización LHS / primary-id (Módulo 15). Los Tutoriales 1–5 ya deben ejecutarse de extremo a extremo en tu máquina.

## Lo que harás

1. **Inspeccionar una instancia de `FutureTrajectories`** para una sola región — listar sus objetos `SamplingUnit`, contar grupos L vs. X e identificar grupos simplex por entero de grupo compartido.
2. **Generar muestras LHS** invocando `LHSDesign.generate_lhs()` y luego `retrieve_lhs_tables_by_design(design_id)` para cada uno de los cuatro diseños; verificar las formas `(n_trials, n_factors)` y la fila de línea base reservada `future_id=0`.
3. **Decodificar un `primary_id`** con `OrderedDirectProductTable.get_dims_from_key()` y recuperarlo en ida y vuelta a través de `get_key_value()`.
4. **Materializar la entrada perturbada** invocando `SISEPUEDE.generate_scenario_database_from_primary_key()` y comparando un puñado de campos de variables contra la línea base para confirmar que las trayectorias L se mueven solo cuando una estrategia distinta a la línea base está activa.

<TutorialCallout id="t6" />

El notebook ejecutable completo se encuentra en [`./rendered/t6`](./rendered/t6).

## Código de referencia

- `sisepuede/data_management/lhs_design.py` — `LHSDesign`, el envoltorio de `pyDOE2` y la transformación afín por fila de diseño.
- `sisepuede/data_management/sampling_unit.py` — `FutureTrajectories`, `SamplingUnit` y la lógica de clasificación L/X.
- `sisepuede/data_management/ordered_direct_product_table.py` — codificación mixed-radix de `primary_id`.
- `sisepuede/manager/sisepuede.py` — `generate_scenario_database_from_primary_key()` (línea 1581).

## Preguntas de reflexión

1. Si una persona interesada pregunta "¿qué transformaciones realmente importan bajo incertidumbre profunda?", ¿cuáles de los cuatro diseños compararías y qué estadístico resumen sobre `MODEL_OUTPUT` calcularías para defender tu respuesta?
2. Un grupo de trayectoria simplex (p. ej., una fracción de mezcla de combustibles entre cinco combustibles) comparte un solo entero de grupo. ¿Qué se rompería en tu análisis si re-muestrearas accidentalmente cada componente de forma independiente, y cómo lo previene `SamplingUnit`?
3. Observas que dos valores de `future_id` producen emisiones casi idénticas para una estrategia dada. ¿Es esto evidencia de cobertura redundante del LHS, de insensibilidad en tus palancas o de un rango de incertidumbre degenerado, y cómo los distinguirías usando la división de tablas L vs. X?
