---
id: architecture
title: "Visión general de la arquitectura"
sidebar_position: 2
---

SISEPUEDE es un marco híbrido **Python + Julia** organizado en torno a un pipeline determinístico de 8 fases. Python es dueño del esquema, los modelos sectoriales, la orquestación y el I/O. Julia es dueño de una tarea estrecha pero computacionalmente exigente: resolver el programa lineal del sistema energético vía **NeMo-Mod**. Los dos runtimes se comunican a través de una **base de datos SQLite** temporal — sin memoria compartida, sin llamadas directas a funciones a través de la frontera de lenguajes.

Entender este pipeline de extremo a extremo te dice de dónde viene cualquier variable, dónde se escribe cualquier salida y cómo las intervenciones de política (transformadores) se insertan entre fases.

---

## Objetivos de aprendizaje

- Trazar el pipeline de ejecución de 8 fases desde la compilación del esquema hasta la salida a base de datos.
- Explicar qué maneja Python, qué maneja Julia y cómo el handshake de SQLite los puentea.
- Nombrar los tres orquestadores clave de Python (`ModelAttributes`, `SISEPUEDEModels`, `SISEPUEDEExperimentalManager`) y enunciar la responsabilidad de cada uno.
- Leer el orden fijo de ejecución sectorial y justificarlo a partir de las dependencias de datos entre sectores.
- Identificar qué fase es el punto de entrada para el análisis de políticas basado en transformadores.

---

## Las 8 fases

<PipelinePhase n={0} />

**Fase 0 — Compilación del esquema (`ModelAttributes`)**
Antes de tocar cualquier dato, `ModelAttributes` lee todas las tablas de atributos desde `dir_attributes` y construye el registro completo de variables: categorías, unidades, valores de GWP y el esquema de nombrado que cada modelo sectorial debe respetar. Este objeto se instancia una sola vez y se pasa a cada componente posterior.

---

<PipelinePhase n={1} />

**Fase 1 — Ingesta de plantillas (`BaseInputDatabase`)**
Las plantillas de Excel a nivel país se leen para cada sector y región. `InputTemplate.build_inputs_by_strategy()` produce un DataFrame largo indexado por `(strategy_id, variable_spec, time_period)`. El resultado es `base_input_database.database` — la trayectoria de línea base para cada variable, antes de cualquier muestreo de incertidumbre.

---

<PipelinePhase n={2} />

**Fase 2 — Muestreo de incertidumbre (`FutureTrajectories` / `LHSDesign`)**
SISEPUEDE extrae dos muestras separadas por Hipercubo Latino: una para **incertidumbres de efecto-palanca** (`arr_lhs_l`) y otra para **incertidumbres exógenas** (`arr_lhs_x`). Ambos arreglos viven en [0, 1] con forma `(n_trials, n_factors)`. `future_id = 0` siempre se reserva para la línea base determinística — sin muestreo aplicado.

---

<PipelinePhase n={3} />

**Fase 3 — Índice de clave primaria (`OrderedDirectProductTable`)**
Las tres dimensiones experimentales — `design_id`, `strategy_id`, `future_id` — se codifican como un único entero de radix mixto `primary_id`. No se materializa en memoria una tabla completa de escenarios; en su lugar, `get_dims_from_key(primary_id)` y `get_key_value(**dims)` proveen búsquedas O(n\_dims) bajo demanda. La región se excluye de `primary_id`; las corridas se direccionan como `(region, primary_id)`.

---

<PipelinePhase n={4} />

**Fase 4 — Materialización de entradas**
Bajo demanda para cada `(region, primary_id)`, SISEPUEDE decodifica la clave primaria de regreso a `(design, strategy, future)`, recupera las filas LHS correspondientes y llama a `future_trajectories.generate_future_from_lhs_vector(lhs_x, lhs_l)` para producir el DataFrame de entrada perturbado en formato ancho que alimentará a los modelos sectoriales.

---

<PipelinePhase n={5} />

**Fase 5 — Ejecución de modelos sectoriales (`SISEPUEDEModels`)**
Los seis modelos sectoriales corren en un orden fijo de dependencia (detallado en la sección Orden de ejecución más adelante). Cada modelo acepta el DataFrame de entrada en formato ancho y devuelve un DataFrame de salida en formato ancho con emisiones y variables intermedias. `SISEPUEDEModels` orquesta los traspasos y ensambla la tabla de salida completa.

---

<PipelinePhase n={6} />

**Fase 6 — LP de Julia / NeMo-Mod (Producción Energética)**
El modelo de despacho eléctrico es el único componente que cruza la frontera de lenguajes. Python escribe el problema del sistema energético en una base de datos SQLite temporal; Julia la lee, resuelve el LP vía NeMo-Mod y escribe los resultados de regreso en la misma base; Python después lee la solución. `SISEPUEDEModels.__init__` acepta `fp_julia`, `fp_nemomod_reference_files` y `fp_nemomod_temp_sqlite_db` para configurar esta frontera. Establecer `allow_electricity_run=False` omite Julia por completo, lo cual es útil para desarrollo y pruebas.

---

<PipelinePhase n={7} />

**Fase 7 — Base de datos de salida (`SISEPUEDEOutputDatabase`)**
Los resultados se escriben en lotes a un backend SQLite (vía SQLAlchemy) o CSV. Las tablas clave incluyen `MODEL_OUTPUT`, `ATTRIBUTE_STRATEGY`, `LHC_SAMPLES_LEVER_EFFECTS`, `LHC_SAMPLES_EXOGENOUS_UNCERTAINTIES` y `MODEL_BASE_INPUT_DATABASE`. Cada sesión lleva un `AnalysisID` único para reproducibilidad completa.

---

## Frontera Python vs Julia

| Componente | Runtime |
|---|---|
| Esquema de variables, tablas de atributos | Python (`ModelAttributes`) |
| Todos los modelos sectoriales de emisiones | Python (`AFOLU`, `CircularEconomy`, `EnergyConsumption`, `IPPU`, `Socioeconomic`) |
| Muestreo LHS, indexación de clave primaria | Python |
| Orquestación e I/O | Python (`SISEPUEDEModels`, `SISEPUEDEExperimentalManager`) |
| LP de Producción Energética (despacho eléctrico) | **Julia** (NeMo-Mod) |
| Medio del handshake | Base de datos **SQLite** temporal |

Los archivos de Julia viven bajo `sisepuede/julia/` e incluyen `call_nemomod.jl`, `setup_analysis.jl`, `setup_runs.jl` y `support_functions.jl`. Python administra el ciclo de vida del proceso de Julia a través de `pyjuliapkg`. El resto del código no tiene dependencia de Julia — puedes correr todos los modelos no-eléctricos sin instalar Julia.

---

## Orquestadores clave

- **`ModelAttributes`** (`sisepuede/core/model_attributes.py`) — el registro del esquema. Se instancia primero; se pasa a cada otro componente. Lee todos los CSV de atributos, construye `dict_variable_fields_to_model_variables` y corre 13 verificaciones de consistencia entre tablas en tiempo de inicialización. Nada más puede iniciar sin él.

- **`SISEPUEDEModels`** (`sisepuede/manager/sisepuede_models.py`) — el ejecutor sectorial. Mantiene instancias de las seis clases de modelo sectorial y expone una sola llamada `project()` que las corre en el orden correcto de dependencia, ensambla las salidas y devuelve un DataFrame unificado en formato ancho.

- **`SISEPUEDEExperimentalManager`** (`sisepuede/manager/sisepuede.py`) — el administrador del experimento. Es dueño del pipeline completo desde la base de datos de línea base, pasando por el muestreo LHS, la codificación de claves primarias, la materialización de entradas, las llamadas a `SISEPUEDEModels` y el lote final de salida. Una sola corrida por `primary_id` es reproducible en cualquier momento vía `generate_scenario_database_from_primary_key()`.

---

## Orden de ejecución

Los modelos sectoriales corren en una secuencia fija porque los modelos posteriores consumen salidas de los anteriores. El grafo de dependencias es acíclico y luce así:

```mermaid
graph LR
  S[Socioeconómico] --> A[AFOLU]
  A --> C[Economía Circular]
  C --> EP[Producción Energética]
  EP --> EC[Consumo Energético]
  EC --> I[IPPU]
```

**¿Por qué este orden?**

- **Socioeconómico primero** — los escalares de PIB, población y PIB/cápita son necesarios para que cada modelo sectorial impulse la demanda. Nada más puede correr sin ellos.
- **AFOLU segundo** — el uso de la tierra, los rendimientos de cultivos y las salidas ganaderas determinan los residuos agrícolas y el contenido orgánico que fluye hacia Economía Circular.
- **Economía Circular tercero** — los residuos sólidos, las aguas residuales y las salidas de procesos industriales alimentan los cálculos de demanda energética y proveen las fracciones de material reciclado.
- **Producción Energética cuarto** — el LP de NeMo-Mod necesita las proyecciones de demanda de todos los sectores previos. Su salida (la mezcla de suministro eléctrico) alimenta a Consumo Energético.
- **Consumo Energético quinto** — la combustión estacionaria, el transporte y las emisiones fugitivas (`FGTV`, `INEN`, `SCOE`, `TRNS`, `TRDE`) se calculan una vez que la mezcla eléctrica es conocida.
- **IPPU al final** — los procesos industriales y el uso de productos, incluyendo gases F, cemento y CCS, jalan las fracciones de material reciclado de la salida de Economía Circular. Correr IPPU al final asegura que esas fracciones estén disponibles.

---

## En el código

:::info En el código

| Componente | Archivo | Punto de entrada clave |
|---|---|---|
| `ModelAttributes` | `sisepuede/core/model_attributes.py` | `ModelAttributes.__init__(dir_attributes)` |
| `SISEPUEDEModels` | `sisepuede/manager/sisepuede_models.py` | `SISEPUEDEModels.project()` |
| `SISEPUEDEExperimentalManager` | `sisepuede/manager/sisepuede.py` | `generate_scenario_database_from_primary_key()` |
| Punto de entrada Julia NeMo-Mod | `sisepuede/julia/call_nemomod.jl` | Llamado por Python vía `pyjuliapkg` |
| Soporte Julia | `sisepuede/julia/support_functions.jl` | Funciones utilitarias para la configuración de NeMo-Mod |

:::

---

## Recapitulación

- SISEPUEDE corre un **pipeline de 8 fases** desde la compilación del esquema (Fase 0) hasta la persistencia de salidas (Fase 7).
- **Python** maneja el esquema, los modelos sectoriales, el muestreo, la orquestación y el I/O. **Julia** maneja el LP de electricidad (NeMo-Mod) vía un handshake de SQLite.
- Los tres orquestadores clave de Python son `ModelAttributes` (esquema), `SISEPUEDEModels` (corrida) y `SISEPUEDEExperimentalManager` (pipeline experimental).
- El orden de ejecución sectorial es fijo: Socioeconómico → AFOLU → Economía Circular → Producción Energética → Consumo Energético → IPPU — impulsado por dependencias de datos que fluyen estrictamente hacia adelante.
- Puedes correr todos los modelos no-eléctricos sin Julia pasando `allow_electricity_run=False` a `SISEPUEDEModels`.

---

<Quiz>
  {{
    "questions": [
      {{
        "id": "arch-q1",
        "text": "¿En qué fase codifica SISEPUEDE la combinación de design_id, strategy_id y future_id en un solo entero?",
        "options": [
          "Fase 1 — Ingesta de plantillas",
          "Fase 2 — Muestreo de incertidumbre",
          "Fase 3 — Índice de clave primaria",
          "Fase 5 — Ejecución de modelos sectoriales"
        ],
        "correct": 2,
        "explanation": "La Fase 3 usa OrderedDirectProductTable para codificar las tres dimensiones experimentales como un primary_id de radix mixto. No se materializa una tabla completa de escenarios — solo se construye la estructura de índice."
      }},
      {{
        "id": "arch-q2",
        "text": "¿Cuál de las siguientes describe mejor cómo se comunican Python y Julia en SISEPUEDE?",
        "options": [
          "Python llama a funciones de Julia directamente usando una interfaz de funciones foráneas.",
          "Julia escribe resultados a un DataFrame compartido en memoria que Python lee.",
          "Python escribe el problema energético en una base de datos SQLite temporal; Julia lee, resuelve y escribe de regreso; Python lee la solución.",
          "Julia genera un subproceso que publica resultados en una API REST consumida por Python."
        ],
        "correct": 2,
        "explanation": "El handshake es enteramente a través de una base de datos SQLite temporal (fp_nemomod_temp_sqlite_db). Esto desacopla los dos runtimes limpiamente — sin memoria compartida ni llamadas de red requeridas."
      }},
      {{
        "id": "arch-q3",
        "text": "¿Por qué IPPU corre al final en el orden de ejecución sectorial?",
        "options": [
          "IPPU es el modelo más caro computacionalmente y corre mejor cuando la memoria es liberada por modelos previos.",
          "IPPU jala fracciones de material reciclado de la salida de Economía Circular, por lo que debe esperar a que esa salida esté disponible.",
          "IPPU requiere la mezcla de suministro eléctrico de Producción Energética para calcular emisiones de gases F.",
          "IPPU es opcional y solo corre si está habilitado en el archivo de configuración."
        ],
        "correct": 1,
        "explanation": "IPPU consume explícitamente fracciones de material reciclado producidas por CircularEconomy.project(). Correr IPPU al final asegura que esas fracciones estén completamente resueltas antes de que comiencen los cálculos de procesos industriales."
      }}
    ]
  }}
</Quiz>
