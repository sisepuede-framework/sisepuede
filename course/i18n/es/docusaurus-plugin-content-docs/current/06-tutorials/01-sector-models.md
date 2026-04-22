---
title: "Tutorial 1 — Modelos Sectoriales"
sidebar_position: 1
---

Este primer tutorial práctico lleva la teoría sectorial de los **Módulos 7–12** a la práctica. Instanciarás directamente cada uno de los modelos de emisiones de SISEPUEDE, los proyectarás de forma aislada y, finalmente, ejecutarás la canalización integrada completa mediante `SISEPUEDEModels`. Al concluir, deberás sentirte cómodo alternando entre un flujo de depuración de un solo sector y una corrida multisectorial completa.

## Objetivos de aprendizaje

Al finalizar este tutorial podrás:

- Instanciar los cinco modelos de emisiones (`AFOLU`, `CircularEconomy`, `EnergyConsumption`, `EnergyProduction`, `IPPU`) además de `Socioeconomic` a partir de una instancia compartida de `ModelAttributes`.
- Invocar el método `project()` de cada modelo sobre un DataFrame de entrada en formato ancho e inspeccionar sus salidas.
- Reconocer las dependencias de datos entre sectores (p. ej., `Socioeconomic` → `AFOLU`, `CircularEconomy` → `IPPU`) que fijan el orden de ejecución.
- Ejecutar una proyección integrada mediante `SISEPUEDEModels.project()` y compararla con las salidas por sector.
- Leer las salidas sectoriales utilizando el esquema canónico de nombrado de variables (`{sector}_{cat}_{descriptor}_{units}`).

## Requisitos previos

Antes de comenzar, debes haber completado:

- **Módulos 1–3** — fundamentos del marco, instalación y el registro `ModelAttributes`.
- **Módulos 4–6** — esquema de variables, tablas de atributos y cómo categorías como `$CAT-AGRICULTURE$` se expanden en nombres concretos de columnas.
- Un entorno SISEPUEDE funcional con el backend Julia/NeMo-Mod accesible (requerido para `EnergyProduction`).

Si `julia` no está instalado localmente, aún podrás completar los pasos 1–3 a continuación; el paso integrado recurrirá a una alternativa o omitirá la resolución del LP según tu configuración.

## Lo que harás

1. **Inicialización** — cargar las tablas de atributos, construir una instancia de `ModelAttributes` y obtener un DataFrame de entrada de referencia para una sola región.
2. **Proyección por sector** — instanciar `Socioeconomic`, `AFOLU`, `CircularEconomy`, `EnergyConsumption`, `EnergyProduction` e `IPPU`; invocar `project()` en cada uno siguiendo el orden de dependencias.
3. **Corrida integrada** — pasar la misma entrada a `SISEPUEDEModels.project()` y verificar que la salida ensamblada coincida con los resultados por sector.
4. **Inspección** — segmentar el DataFrame de salida para leer las emisiones por gas y sector en MT CO₂e (GWP100, AR6 WG1).

<TutorialCallout id="t1" />

[Abrir el notebook renderizado](./rendered/t1)

## Preguntas de reflexión

Después de trabajar el notebook, dedica unos minutos a reflexionar sobre:

1. ¿Por qué `Socioeconomic.project()` debe ejecutarse siempre antes que `AFOLU.project()`, y qué se rompería en el paso de uso de suelo de Markov de AFOLU si no fuera así?
2. `IPPU` consume las fracciones de material reciclado que produce `CircularEconomy`. Rastrea qué variables de salida transportan ese intercambio: ¿qué ocurriría si ejecutaras `IPPU` sobre el DataFrame de referencia sin procesar en lugar del marco posterior a `CircularEconomy`?
3. Compara un total de emisiones por sector contra el mismo total de la corrida integrada de `SISEPUEDEModels`. Si difieren, ¿qué retroalimentación entre sectores (o ausencia de la misma) es el culpable más probable?
