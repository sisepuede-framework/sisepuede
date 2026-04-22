---
title: "Tutorial 5 — Análisis del Artículo 6 de París"
sidebar_position: 5
---

import TutorialCallout from '@site/src/components/TutorialCallout';

El **Artículo 6 del Acuerdo de París** establece el marco para la implementación cooperativa de las NDC, permitiendo a los países comerciar Resultados de Mitigación Transferidos Internacionalmente (ITMOs) y emprender proyectos conjuntos de mitigación. Cuantificar la adicionalidad, robustez y costo-efectividad de portafolios candidatos de ITMOs requiere un modelo capaz de comparar estrategias a través de muchos futuros — exactamente para lo que SISEPUEDE fue diseñado. Este tutorial recorre un caso de estudio aplicado del Artículo 6, mostrando cómo estructurar el espacio de estrategias, ejecutar experimentos pareados de referencia/intervención e interpretar los deltas de emisiones resultantes como unidades de mitigación transables.

## Objetivos de aprendizaje

Al finalizar este tutorial podrás:

- Plantear una pregunta de mitigación cooperativa del Artículo 6 como una comparación de estrategias en SISEPUEDE.
- Diseñar un par de estrategias referencia-vs-intervención cuya diferencia de emisiones define ITMOs candidatos.
- Ejecutar el experimento a través de múltiples futuros para caracterizar la incertidumbre en los resultados de mitigación.
- Agregar deltas sectoriales de emisiones en volúmenes equivalentes a ITMOs (MT CO₂e) sobre un periodo de acreditación.
- Discutir adicionalidad, integridad de la línea base y riesgos de doble conteo a la luz de los resultados del modelo.

## Requisitos previos

- **Tutoriales 1–4** — configuración del entorno, ejecución de SISEPUEDE, construcción de estrategias y posprocesamiento de salidas.
- **Módulo 13** — Diseño de estrategias y composición de transformadores.
- **Módulo 14** — Diseño experimental (estrategias × futuros × regiones).
- **Módulo 15** — Interpretación de `MODEL_OUTPUT` y cálculo de diferencias de emisiones.

También deberás contar con una instalación funcional con el backend Julia/NemoMod operativo (ver Tutorial 1).

## Lo que harás

1. **Definir el escenario del Artículo 6.** Elige un país anfitrión y una actividad candidata de mitigación cooperativa (p. ej., recuperación de gases fugitivos, reforestación, sustitución de combustibles). Identifica los transformadores correspondientes en `ATTRIBUTE_STRATEGY` — nunca inventes IDs.
2. **Construir el par de estrategias.** Construye una estrategia de referencia (referencia NDC) y una estrategia de intervención que active el conjunto de transformadores del Artículo 6 sobre la referencia.
3. **Ejecutar el experimento a través de futuros.** Ejecuta ambas estrategias bajo los diseños 0 (determinista) y 3 (incertidumbre completa) para obtener tanto una estimación central como un intervalo de robustez para el volumen de ITMOs.
4. **Agregar e interpretar.** Calcula los deltas anuales de emisiones por sector y gas, suma sobre el periodo de acreditación y discute si el resultado es robusto frente a la incertidumbre exógena (adicionalidad bajo incertidumbre profunda).

<TutorialCallout id="t5" />

El notebook completamente renderizado con código, gráficas y tablas de volúmenes de ITMOs está disponible aquí: [Tutorial 5 — notebook renderizado](./rendered/t5).

## Preguntas de reflexión

1. **Integridad de la línea base.** A través del ensamble de futuros, ¿qué tan sensible es el volumen de ITMOs calculado al supuesto de la línea base? Si la estimación central cae dentro de la propia banda de incertidumbre de la línea base, ¿qué implica esto sobre la adicionalidad reclamada?
2. **Atribución sectorial.** Las transacciones del Artículo 6 requieren una atribución clara de la mitigación a una actividad específica. Cuando un transformador (por ejemplo, electrificación) desplaza emisiones a través de la frontera AFOLU/Energy/IPPU, ¿cómo defenderías la atribución ante un regulador del país anfitrión o ante un auditor de ajustes correspondientes?
3. **Uso en política.** Si estuvieras asesorando a la Autoridad Nacional Designada del país anfitrión, ¿qué piezas de la salida de SISEPUEDE (series temporales, descomposición sectorial, intervalo de robustez) incluirías en la carta de autorización del Artículo 6 y cuáles mantendrías como análisis de sensibilidad interno?
