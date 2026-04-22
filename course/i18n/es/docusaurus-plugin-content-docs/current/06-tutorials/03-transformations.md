---
title: "Tutorial 3 — Trabajando con Transformaciones"
sidebar_position: 3
---

Este tutorial recorre la pila **Transformer / Transformation / Strategy** que está en el corazón de cada corrida de política en SISEPUEDE. Se construye directamente sobre los Módulos 13 y 14, donde viste cómo un DataFrame de entrada de referencia se muta en un contrafactual mediante objetos de política componibles y orientados a atributos.

Al concluir este notebook te sentirás cómodo cargando el registro de transformadores, configurando transformaciones individuales, agrupándolas en una estrategia y aplicando esa estrategia a un escenario de referencia.

## Objetivos de aprendizaje

- Distinguir un `Transformer` (la función de mutación) de una `Transformation` (una invocación parametrizada) y de una `Strategy` (un paquete ordenado).
- Localizar y leer las tablas de atributos relevantes: `attribute_transformer.csv`, `attribute_transformation.csv` y `attribute_strategy.csv`.
- Instanciar la colección `Transformers` contra una instancia de `ModelAttributes` y una base de datos de entrada de referencia.
- Aplicar una estrategia a un DataFrame de referencia y confirmar qué campos de variables fueron modificados.
- Inspeccionar la `transformation_specification` de una estrategia para entender lo que realmente hace.

## Requisitos previos

- **Módulo 13 — Transformadores:** los IDs canónicos `tx_*`, el patrón de parámetros `magnitude` / `magnitude_type` / `vec_ramp`, y cómo los transformadores acceden a campos específicos de variables.
- **Módulo 14 — Estrategias:** cómo se componen las transformaciones, cómo se registra `strategy_id` en `attribute_strategy.csv`, y el papel de `baseline_strategy_id`.
- Tutoriales 1 y 2 (configuración del entorno y corrida de referencia).

## Lo que harás

1. **Cargar el registro.** Construir una instancia de `Transformers` desde tu directorio de ejemplos e inspeccionar sus tablas de atributos para ver cada `transformer_code`, `transformation_code` y `strategy_code` disponible.
2. **Elegir y configurar una transformación.** Selecciona una transformación concreta (por ejemplo, una palanca AFOLU de reforestación o una palanca FGTV de recuperación de gas), lee su configuración YAML/JSON y ajusta su `magnitude` y rampa.
3. **Componer una estrategia.** Selecciona una estrategia registrada en `attribute_strategy.csv` o construye un paquete ad hoc de códigos de transformación, y luego aplícalo al DataFrame de entrada de referencia.
4. **Verificar el efecto.** Compara mediante diferencia el DataFrame resultante contra el de referencia en los campos de variables que el transformador modifica, y confirma que el perfil temporal, signo y magnitud coincidan con lo esperado.

<TutorialCallout id="t3" />

Abre el notebook renderizado aquí: [Tutorial 3 — Trabajando con Transformaciones](./rendered/t3).

## Preguntas de reflexión

1. ¿Cuál es la diferencia práctica entre editar la implementación en Python de un `Transformer` y editar la configuración de una `Transformation`? ¿Cuándo sería apropiado cada caso?
2. Si dos transformaciones dentro de la misma estrategia modifican el mismo campo de variable, ¿qué determina el valor final, y dónde en el código está implementada esa resolución?
3. ¿Por qué SISEPUEDE separa las estrategias registradas en `attribute_strategy.csv` de las transformaciones subyacentes, en lugar de tratar cada paquete de política como un objeto monolítico?
