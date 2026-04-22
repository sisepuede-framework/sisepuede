---
title: "Tutorial 2 — ModelAttributes"
sidebar_position: 2
---

import TutorialCallout from '@site/src/components/TutorialCallout';

Este tutorial lleva a la práctica el material sobre el esquema de variables de los **Módulos 4-6**. Instanciarás la clase `ModelAttributes`, el registro central que define cada variable de entrada y salida en SISEPUEDE, y la utilizarás para navegar por sectores, subsectores, categorías y unidades. Al final deberás ser capaz de buscar cualquier variable del modelo y entender exactamente qué representa.

## Objetivos de aprendizaje

- Instanciar `ModelAttributes` desde el directorio de tablas de atributos incluido e inspeccionar lo que se carga.
- Resolver un `ModelVariable` a partir de su nombre de variable usando `get_variable()` y leer su `VariableSchema`.
- Recuperar tablas de atributos de sector y subsector con `get_attribute_table()` y enumerar sus categorías.
- Consultar unidades y factores de conversión vía `get_unit()` y los auxiliares de dimensión de unidades.
- Mapear un nombre de columna concreto en un DataFrame de entrada de regreso a su variable de modelo usando `dict_variable_fields_to_model_variables`.

## Requisitos previos

- **Módulo 4** — Fundamentos del esquema de variables (prefijos de sector, tokens de categoría, descriptores).
- **Módulo 5** — Tablas de atributos (cubetas `cat`, `dim`, `unit`, `other`).
- **Módulo 6** — Ciclo de vida de `ModelAttributes` y el flujo de 14 pasos de `__init__`.
- Una instalación Python de SISEPUEDE funcional (Tutorial 1).

## Lo que harás

1. **Inicializar el esquema.** Construir una instancia de `ModelAttributes` desde `sisepuede/attributes/` y confirmar que pasen las verificaciones de consistencia entre tablas.
2. **Explorar sectores y subsectores.** Usar `get_attribute_table()` para extraer las tablas de categorías de AFOLU, Energy, IPPU y Circular Economy, y listar sus categorías.
3. **Consultar variables.** Elegir una variable (por ejemplo, `agrc_yf_$CAT-AGRICULTURE$`) e invocar `get_variable()` para inspeccionar su esquema, los campos expandidos y sus unidades.
4. **Resolver unidades.** Usar `get_unit()` para leer las definiciones de unidades de masa, energía y monetarias, y convertir entre ellas con los auxiliares de conversión de unidades.

<TutorialCallout id="t2" />

## Ejecutar el notebook renderizado

Hay disponible una versión completamente ejecutada de este tutorial — con salidas, fragmentos de tablas de atributos y ejemplos de conversión de unidades — aquí:

[Ver el notebook renderizado del Tutorial 2](./rendered/t2)

## Preguntas de reflexión

1. Dado un nombre de columna como `agrc_lvst_pop_cattle_dairy` en un DataFrame de entrada, ¿qué consulta de `ModelAttributes` te lleva de regreso al `ModelVariable` de origen, y qué te dice eso sobre el diseño de mapeo inverso del esquema?
2. ¿Por qué `ModelAttributes` clasifica los CSVs en las cuatro cubetas (`cat`, `dim`, `unit`, `other`) antes de construir las variables, y qué se rompería si una tabla de categorías estuviera mal clasificada?
3. Cuando invocas `get_variable()` sobre una variable cuyo esquema contiene `$CAT-AGRICULTURE$`, ¿cuántos campos concretos produce `build_fields()`, y qué determina ese conteo?
