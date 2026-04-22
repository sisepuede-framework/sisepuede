---
id: what-is-sisepuede
title: "¿Qué es SISEPUEDE?"
sidebar_position: 1
---

SISEPUEDE es un marco de modelación integrado en Python/Julia para explorar trayectorias de descarbonización a nivel país bajo incertidumbre profunda. En lugar de producir una única trayectoria "óptima", está construido sobre la idea de que el futuro es genuinamente desconocido — por lo que la pregunta correcta no es *qué va a suceder* sino *qué políticas siguen siendo robustas a través del rango más amplio posible de futuros*. Esta lección presenta qué es SISEPUEDE, de dónde proviene y por qué fue diseñado de la manera en que lo fue.

## Objetivos de aprendizaje

- Explicar qué significa SISEPUEDE y qué problema fue diseñado para resolver.
- Describir el rol de la Toma de Decisiones bajo Incertidumbre Profunda (DMDU) en el diseño experimental del modelo.
- Identificar los cuatro sectores de emisiones que SISEPUEDE modela y el motor socioeconómico transversal.
- Nombrar a los socios institucionales detrás de SISEPUEDE y las publicaciones clave que lo describen.
- Localizar los archivos principales de entrada en el código que corresponden a la arquitectura del modelo.

## El problema que SISEPUEDE resuelve

El análisis de política climática enfrenta una tensión fundamental: las decisiones deben tomarse hoy, pero las consecuencias de esas decisiones se desarrollan a lo largo de décadas en sistemas cuyo comportamiento — crecimiento económico, costos tecnológicos, cambio conductual, ciclos naturales del carbono — no puede conocerse con precisión. El análisis de escenarios estándar evade esto al elegir un pequeño número de "narrativas" y optimizar dentro de cada una. El problema es que una política que luce excelente bajo una narrativa puede tener un mal desempeño bajo otra. Los analistas y tomadores de decisiones quedan sin una manera fundamentada de comparar la robustez a través del espacio completo de incertidumbre.

SISEPUEDE fue construido específicamente para abordar esto. Aplica métodos de **Toma de Decisiones bajo Incertidumbre Profunda (DMDU)**, tratando el espacio de futuros posibles como un dominio de alta dimensionalidad que debe muestrearse en lugar de un conjunto fijo de escenarios. El marco genera miles de futuros usando Muestreo por Hipercubo Latino (LHS) — variando tanto las incertidumbres exógenas (tasas de crecimiento económico, difusión tecnológica) como las incertidumbres de efecto-palanca (qué tan efectiva es realmente una intervención de política) — y después evalúa cada combinación de estrategia política y futuro. El resultado es una imagen de *qué estrategias funcionan a través del rango más amplio de condiciones*, no solo qué estrategia luce mejor bajo los supuestos favoritos del analista.

Los cálculos de emisiones en sí mismos siguen un enfoque **bottom-up de equilibrio parcial** fundamentado en las **Directrices del IPCC de 2006 para los Inventarios Nacionales de Gases de Efecto Invernadero** y su **Refinamiento de 2019**. Esto significa que cada factor de emisión, motor de actividad y constante de conversión de gases se rastrea hasta un método del IPCC documentado. Los resultados se reportan en MT CO2-equivalente usando valores de GWP100 del IPCC AR6 WG1 Capítulo 7, Tabla 7.SM.7. El país o región es la unidad natural de análisis, lo que hace a SISEPUEDE directamente aplicable a la planeación de NDC, hojas de ruta de carbono-neutralidad y estimación de costos de mitigación sectorial.

## Quiénes lo construyen

SISEPUEDE es una colaboración entre tres instituciones:

- **RAND Corporation** — el desarrollador principal James Syme lidera el marco central (Python/Julia), la maquinaria de diseño experimental y el repositorio de GitHub `jcsyme/sisepuede`.
- **Banco Interamericano de Desarrollo (BID)** — co-financiador y socio principal de aplicación, apoyando implementaciones a nivel país a través de América Latina y el Caribe.
- **Tecnológico de Monterrey, EGobiernoyTP / Decision Science Center** (grupo del Dr. Edmundo Molina) — implementación país, pipelines de datos de entrada, integración de curvas MAC y mapeo de transformaciones NDC-a-SISEPUEDE.

Tres publicaciones anclan el marco:

- **Kalra et al. (2023)** — el artículo del marco central que describe la metodología SISEPUEDE, el diseño experimental DMDU y su aplicación al análisis de descarbonización en ALC.
- **"Costos y beneficios de lograr la carbono-neutralidad en América Latina y el Caribe"** (BID/RAND, 2023) — aplicación de política regional usando SISEPUEDE para estimar los costos y beneficios de la carbono-neutralidad a través de América Latina y el Caribe.
- **Esteves et al. (2024)** — artículo en *Frontiers in Climate* sobre la creación de empleo y las sinergias de descarbonización en ALC, demostrando a SISEPUEDE como una plataforma para análisis de co-beneficios.

## Qué lo hace diferente

Varias decisiones de diseño distinguen a SISEPUEDE de otras herramientas de contabilidad de GEI o de evaluación integrada:

- **Cuatro sectores de emisiones del IPCC más un motor socioeconómico.** SISEPUEDE modela Agricultura, Silvicultura y Uso de la Tierra (AFOLU); Economía Circular (gestión de residuos, aguas residuales, procesos industriales); Energía (combustión estacionaria, transporte, generación eléctrica, emisiones fugitivas); e IPPU (procesos industriales y uso de productos, incluyendo gases F y cemento). Un quinto módulo, Socioeconómico, no es un sector de emisiones pero impulsa la demanda en todos los demás a través de variables de PIB, población y comercio.
- **DMDU basado en LHS, no árboles de escenarios.** El marco mantiene dos tablas LHS separadas — una para incertidumbres exógenas (`arr_lhs_x`) y otra para incertidumbres de efecto-palanca (`arr_lhs_l`) — y las combina en una estructura de cuatro diseños (línea base, solo X, solo L, incertidumbre completa). Cada corrida está indexada por un `primary_id` que codifica la tripleta `(design_id, strategy_id, future_id)`, permitiendo reproducibilidad exacta y consultas eficientes a la base de datos.
- **Equilibrio parcial a escala país/región.** SISEPUEDE no resuelve un equilibrio general global. Toma trayectorias exógenas de demanda (PIB, población) y calcula emisiones de manera bottom-up a partir de niveles de actividad y factores de emisión. Esto lo hace tratable para que los equipos país lo calibren y mantengan, manteniéndose consistente con las convenciones contables del IPCC.
- **Transformadores de política componibles.** Las intervenciones de política se representan como **transformadores** — funciones que modifican un DataFrame de entrada base para reflejar un cambio tecnológico o conductual específico. Los transformadores están catalogados en una tabla oficial de atributos y pueden combinarse en **estrategias**. Esta separación entre "lo que la política le hace a los datos" y "cómo el modelo computa las emisiones" mantiene el diseño experimental limpio y auditable.
- **Híbrido Python/Julia para la optimización energética.** El sector eléctrico despacha la generación a través de un LP basado en Julia (NeMo-Mod), invocado vía un handshake de SQLite. Todos los demás sectores corren en Python puro. Esto permite que el LP computacionalmente intensivo se resuelva eficientemente mientras se mantiene el resto del marco accesible para profesionales de Python.

## En el código

:::note Puntos de entrada clave

Los tres archivos a continuación son los mejores puntos de partida para leer el código fuente de SISEPUEDE.

- **`sisepuede/core/model_attributes.py`** — clase `ModelAttributes`. Este es el registro del esquema: lee todos los CSV de atributos, define cada nombre de variable y aplica la consistencia entre sectores. Cada otra clase recibe una instancia de `ModelAttributes` en tiempo de construcción.
- **`sisepuede/manager/sisepuede_models.py`** — clase `SISEPUEDEModels`. Este orquestador corre las seis fases de modelos sectoriales en orden de dependencia (Socioeconomic → AFOLU → CircularEconomy → EnergyProduction → EnergyConsumption → IPPU) y ensambla la tabla de salida completa.
- **`sisepuede/manager/sisepuede.py`** — clase `SISEPUEDEExperimentalManager`. Punto de entrada para corridas experimentales completas: lee la base de datos de entrada base, aplica muestreo LHS, itera sobre los valores de `primary_id` y escribe los resultados en la base de datos de salida.

:::

## Recapitulación

- SISEPUEDE es un marco de modelación de GEI bottom-up de equilibrio parcial que aplica métodos DMDU para evaluar la robustez de estrategias de descarbonización a través de miles de futuros muestreados.
- Cubre cuatro sectores de emisiones del IPCC — AFOLU, Economía Circular, Energía e IPPU — más un motor Socioeconómico, todo fundamentado en las Directrices del IPCC de 2006 y el Refinamiento de 2019.
- El marco es un producto conjunto de RAND Corporation, el Banco Interamericano de Desarrollo y el Tecnológico de Monterrey, documentado en tres publicaciones revisadas por pares o institucionales (Kalra 2023, BID/RAND 2023, Esteves 2024).

---

<Quiz questions={[
  {q: "¿Qué permite principalmente el uso del Muestreo por Hipercubo Latino en SISEPUEDE?", choices: [
    {text: "Cómputo más rápido del LP energético NeMo-Mod"},
    {text: "Exploración de la robustez a través de un amplio rango de futuros inciertos", correct: true, explain: "SISEPUEDE genera miles de combinaciones (estrategia, futuro) vía LHS para evaluar qué políticas se mantienen robustas bajo incertidumbre profunda — un principio central de DMDU."},
    {text: "Calibración automática de los factores de emisión del IPCC"},
  ]},
  {q: "¿Qué socio institucional lidera el desarrollo del marco central en Python/Julia?", choices: [
    {text: "Banco Interamericano de Desarrollo (BID)"},
    {text: "Tecnológico de Monterrey"},
    {text: "RAND Corporation", correct: true, explain: "James Syme en RAND Corporation es el desarrollador principal del marco central de SISEPUEDE, mantenido en el repositorio de GitHub jcsyme/sisepuede."},
  ]},
  {q: "¿Qué rol juega el módulo Socioeconómico en SISEPUEDE?", choices: [
    {text: "Calcula emisiones de procesos industriales y uso de productos"},
    {text: "Impulsa la demanda en todos los sectores de emisiones a través de variables de PIB, población y comercio", correct: true, explain: "El módulo Socioeconómico no es en sí mismo un sector de emisiones — calcula los escalares de demanda (PIB, PIB per cápita, población) que alimentan a AFOLU, Energía, CircularEconomy e IPPU."},
    {text: "Gestiona las tablas de muestreo LHS para incertidumbres exógenas"},
  ]},
]}/>
