---
id: model-attributes
title: "ModelAttributes"
sidebar_position: 1
---

`ModelAttributes` es el único objeto del que dependen todos los demás componentes de SISEPUEDE. Antes de calcular cualquier emisión, antes de aplicar cualquier transformador y antes de enviar un LP de Julia a NeMo-Mod, `ModelAttributes` debe estar completamente construido. Constituye la **Fase 0** del pipeline de siete fases.

Se instancia una sola vez y se pasa a todas partes. Cada modelo sectorial (`AFOLU`, `CircularEconomy`, `Energy`, `IPPU`), cada transformador y la clase orquestadora `SISEPUEDEModels` reciben el mismo objeto `ModelAttributes`. Piénsalo como el esquema compilado: convierte un directorio de tablas de atributos en formato CSV en un registro vivo y validado de manera cruzada de sectores, categorías, variables, unidades y dimensiones.

---

## Objetivos de aprendizaje

Al finalizar esta lección serás capaz de:

- Explicar qué hace `ModelAttributes` y por qué existe como singleton compartido.
- Identificar los cuatro buckets de tablas de atributos (`cat`, `dim`, `unit`, `other`) y dar ejemplos de qué corresponde a cada uno.
- Describir a alto nivel la secuencia de los 14 pasos de `__init__`.
- Explicar por qué existe `dict_variable_fields_to_model_variables` y cómo se utiliza.
- Describir el rol de `_check_attribute_tables` y nombrar tres comprobaciones de consistencia concretas que realiza.
- Escribir un fragmento mínimo de Python para instanciar `ModelAttributes` desde un directorio.

---

## Qué hace ModelAttributes

- **Lee CSVs de atributos** desde un único directorio (`dir_attributes`) y los agrupa en cuatro buckets según el prefijo del nombre de archivo.
- **Instancia cada `ModelVariable`** como un objeto Python tipado iterando sobre los archivos `variable_definitions_*.csv`; cada token del esquema de variable (por ejemplo, `$CAT-AGRICULTURE$`) se expande a nombres concretos de columnas.
- **Registra las dimensiones del análisis** (`design_id`, `future_id`, `strategy_id`, `time_period`, `region`, `primary_id`) como constantes de cadena nombradas en `self`.
- **Inicializa unidades** desde las tablas `attribute_unit_*.csv` y construye los factores de conversión.
- **Carga la configuración** por defecto (unidades de salida, valores de GWP) desde un archivo de configuración opcional.
- **Construye mapas de búsqueda inversa** para que cualquier nombre de columna en un DataFrame pueda resolverse de regreso a su instancia de `ModelVariable`.
- **Valida de manera cruzada** todas las tablas en tiempo de inicialización mediante 13 funciones de verificación específicas por subsector, lanzando excepciones antes de que se ejecute cualquier código del modelo.

---

## Los cuatro buckets de tablas de atributos

`_initialize_attribute_tables` (línea 424 de `model_attributes.py`) escanea `dir_attributes` y clasifica cada CSV por su prefijo de nombre de archivo usando tres expresiones regulares, con un comodín que captura todo lo demás.

| Clave del bucket | Patrón de archivo | Qué pertenece aquí |
|---|---|---|
| `cat` | `attribute_cat_*.csv` | **Definiciones de categorías** — una fila por instancia de categoría. Ejemplos: `attribute_cat_agriculture.csv` (tipos de cultivos), `attribute_cat_land_use.csv` (clases de cobertura del suelo), `attribute_cat_technology.csv` (tecnologías de generación eléctrica). Cada archivo define una columna clave (la abreviatura de la categoría) más campos de metadatos utilizados para construir nombres de variables y vínculos cruzados entre sectores. |
| `dim` | `attribute_dim_*.csv` | **Dimensiones del análisis** — tablas de índices enteros. Ejemplos: `attribute_dim_time_period.csv` (pasos temporales 0…T-1), `attribute_dim_strategy_id.csv` (códigos de estrategia), `attribute_dim_design_id.csv` (códigos de diseño experimental). Definen los ejes experimentales. |
| `unit` | `attribute_unit_*.csv` | **Definiciones de unidades y factores de conversión** — una fila por unidad, con campos que permiten al `UnitsManager` convertir entre áreas, energías, masas, volúmenes y montos monetarios. |
| `other` | `attribute_*.csv` (resto) | **Todo lo demás.** Incluye tablas de registro de sectores y subsectores (`abbreviation_sector`, `abbreviation_subsector`), atributos de gases (`attribute_gas.csv`), listas de regiones (`attribute_region.csv`), descriptores de tablas de NeMo-Mod y tablas de parámetros analíticos/experimentales. |

El bucket `other` siempre se resuelve al final (los grupos se ordenan, con `other` añadido) para que los regex de prefijo más estrictos tengan prioridad (línea 494).

---

## Los 14 pasos de init

`ModelAttributes.__init__` ejecuta una secuencia fija de métodos de inicialización (líneas 103–141). Los pasos están ordenados por dependencia: cada método puede leer propiedades establecidas por los anteriores.

1. **`_initialize_basic_dimensions_of_analysis`** (línea 619) — vincula constantes de cadena para cada dimensión (`self.dim_time_period`, `self.dim_strategy_id`, etc.) y la lista de orden de clasificación.
2. **`_initialize_basic_other_properties`** (línea 679) — establece valores por defecto de extensión de archivo, delimitadores y banderas compartidas diversas.
3. **`_initialize_basic_subsector_names`** (línea 868) — registra cada abreviatura de subsector como una constante nombrada (por ejemplo, `self.subsec_name_agrc = "Agriculture"`).
4. **`_initialize_basic_table_names_nemomod`** (línea 724) — registra las constantes de nombres de tablas de NeMo-Mod necesarias para Energy Production.
5. **`_initialize_basic_template_substrings`** (línea 923) — establece las subcadenas regex utilizadas para identificar archivos CSV de parámetros analíticos y experimentales.
6. **`_initialize_basic_varchar_components`** (línea 939) — establece los prefijos clave (`"attribute"`, `"variable_definitions"`) usados al escanear el directorio de atributos.
7. **`_initialize_attribute_tables`** (línea 424) — carga principal de CSVs: escanea el directorio, lee todos los archivos, puebla `self.dict_attributes` (la estructura `{bucket: {table_name: AttributeTable}}`) y `self.dict_variable_definitions`.
8. **`_initialize_other_attributes`** — extrae tablas específicas de `dict_attributes["other"]` a propiedades nombradas para acceso rápido.
9. **`_initialize_units`** (línea 1246) — construye `UnitsManager` a partir de las tablas de unidades del bucket `cat`; puebla las búsquedas de factores de conversión.
10. **`_initialize_variables`** (línea 1320) — llama a `get_variable_dict()` para instanciar un `ModelVariable` por cada fila en cada `variable_definitions_*.csv`; los almacena en `self.dict_variables`.
11. **`_initialize_config`** (línea 969) — lee el archivo de configuración opcional; ensambla el objeto `Configuration` con unidades de salida por defecto y metadatos de período temporal.
12. **`_initialize_sector_sets`** (línea 1203) — construye los conjuntos de pertenencia sector → subsector → categoría.
13. **`_initialize_variables_by_subsector`** (línea 1350) — itera sobre todos los subsectores y todas las variables para construir los mapas de búsqueda inversa (ver siguiente sección).
14. **`_initialize_all_primary_category_flags`**, **`_initialize_emission_modvars_by_gas`**, **`_initialize_gas_attributes`**, **`_initialize_other_dictionaries`** — mapas auxiliares para totales de emisiones, agregación ponderada por GWP y búsquedas diversas.
15. **`_check_attribute_tables`** (línea 139) — 13 verificaciones de consistencia entre tablas; lanza una excepción ante cualquier violación.
16. **`_initialize_uuid`** — estampa un UUID de módulo para trazabilidad.

---

## Mapa de búsqueda inversa: `dict_variable_fields_to_model_variables`

Los modelos sectoriales reciben la entrada como DataFrames en formato ancho donde cada columna es un nombre concreto de campo — por ejemplo, `agrc_lvst_pop_cattle_dairy` o `enfu_frac_fuel_mix_electricity`. Necesitan responder a la pregunta: *dado este nombre de columna, ¿a qué `ModelVariable` pertenece?*

`dict_variable_fields_to_model_variables` se construye precisamente para esto. Durante `_initialize_variables_by_subsector` (línea 1350), el código itera sobre cada subsector y cada `ModelVariable` en ese subsector, luego llama a `modvar.fields` para obtener la lista de nombres concretos de columnas a los que se expande la variable. Construye el mapa inverso en una sola pasada (línea 1401):

```python
dict_fields_to_vars.update(dict((x, modvar_name) for x in modvar.fields))
```

El resultado es un dict plano: `{field_name: modvar_name}`. Cualquier componente downstream puede llamar:

```python
modvar_name = model_attributes.dict_variable_fields_to_model_variables.get("agrc_lvst_pop_cattle_dairy")
```

y obtener el nombre canónico de la variable, desde el cual puede recuperar el objeto `ModelVariable` completo vía `model_attributes.dict_variables[modvar_name]`.

El dict acompañante `dict_model_variables_to_variable_fields` (línea 1400) mapea en la dirección contraria: nombre de variable → lista de nombres concretos de campos. Juntos, estos dos diccionarios permiten a cualquier componente traducir libremente entre nombres abstractos de variables y los nombres de columnas que aparecen en los DataFrames.

---

## Verificaciones de consistencia: `_check_attribute_tables`

Tras completar toda la inicialización, `_check_attribute_tables` (línea 150) ejecuta 13 funciones de validación específicas — una para los períodos temporales más una por subsector con dependencias entre tablas. Estas se disparan en tiempo de inicialización, no en tiempo de ejecución del modelo, de modo que una tabla de atributos mal configurada lanza una excepción de inmediato, antes de que comience cualquier cálculo.

Tres ejemplos concretos:

**1. Los períodos temporales deben ser una secuencia entera contigua basada en cero** (`_check_dimensional_attribute_table_time_periods`, línea 1518). La verificación lee `attribute_dim_time_period.csv`, convierte la columna `time_period` a enteros y verifica que los valores coincidan exactamente con `np.arange(len(vec_periods))`. El cero debe estar presente; los valores negativos y los huecos son ilegales. Esto asegura que la indexación de períodos temporales nunca produzca desplazamientos fuera de límites en los cálculos de Markov y de dinámica de pools.

**2. Agriculture debe marcar exactamente una categoría de arroz y cada cultivo debe tener una bandera binaria de intercambio vegetariano** (`_check_attribute_tables_agrc`, línea 1855). La verificación llama a `_check_binary_fields` dos veces: una para verificar que `apply_vegetarian_exchange_scalar` sea estrictamente 0/1 en cada fila, y otra con `force_sum_to_one=True` para verificar que exactamente una categoría de cultivo esté marcada como `rice_category`. Si `attribute_cat_agriculture.csv` marca dos categorías de arroz, la inicialización falla con un `ValueError` citando la ruta del archivo.

**3. Cada categoría de bosque debe aparecer como una categoría de uso de suelo con el prefijo de nombre esperado** (`_check_attribute_tables_lndu`, línea 2109). La verificación construye el conjunto `{matchstr_forest + cat for cat in cats_forest}` y comprueba que sea un subconjunto de `cats_landuse`. Si una categoría de bosque en `attribute_cat_forest.csv` no tiene una entrada `"forests_"` correspondiente en `attribute_cat_land_use.csv`, se lanza un `KeyError` nombrando los valores faltantes. También verifica el sentido inverso: cada categoría de uso de suelo `"forests_*"` debe mapear a una categoría de bosque válida.

---

## Ejemplo de código: instanciar ModelAttributes

```python
import pathlib
from sisepuede.core.model_attributes import ModelAttributes

# Apunta al directorio que contiene attribute_cat_*.csv, attribute_dim_*.csv, etc.
dir_attributes = pathlib.Path("sisepuede/attributes")

# Instanciar — ejecuta los 14+ pasos de init y las 13 verificaciones de consistencia.
# Lanza excepción si alguna tabla está mal formada o se violan restricciones cruzadas.
model_attributes = ModelAttributes(dir_attributes)

# Inspeccionar el registro de variables
print(len(model_attributes.all_variables), "model variables registered")

# Buscar a qué ModelVariable pertenece un nombre de campo dado
field = "agrc_lvst_pop_cattle_dairy"
modvar_name = model_attributes.dict_variable_fields_to_model_variables.get(field)
modvar = model_attributes.dict_variables.get(modvar_name)
print(f"Field '{field}' belongs to variable '{modvar_name}'")

# Revisar todos los campos de entrada de un subsector
input_fields = [
    f for f in model_attributes.all_variable_fields_input
    if f.startswith("agrc_")
]
print(f"Agriculture has {len(input_fields)} input fields")
```

Un argumento opcional `fp_config` acepta una ruta a un archivo de configuración estilo INI que sobrescribe las unidades de salida y los valores de GWP por defecto. Si se omite, `Configuration` usa los valores por defecto incrustados en `analytical_parameters.csv`.

---

## En el código fuente

| Símbolo | Archivo | Línea |
|---|---|---|
| `ModelAttributes.__init__` | `sisepuede/core/model_attributes.py` | 103 |
| `_initialize_attribute_tables` | `sisepuede/core/model_attributes.py` | 424 |
| `_initialize_basic_dimensions_of_analysis` | `sisepuede/core/model_attributes.py` | 619 |
| `_initialize_variables` | `sisepuede/core/model_attributes.py` | 1320 |
| `_initialize_variables_by_subsector` | `sisepuede/core/model_attributes.py` | 1350 |
| `get_variable_dict` | `sisepuede/core/model_attributes.py` | 3899 |
| `_check_attribute_tables` | `sisepuede/core/model_attributes.py` | 150 |
| `_check_dimensional_attribute_table_time_periods` | `sisepuede/core/model_attributes.py` | 1518 |
| `_check_attribute_tables_agrc` | `sisepuede/core/model_attributes.py` | 1855 |
| `_check_attribute_tables_lndu` | `sisepuede/core/model_attributes.py` | 2109 |
| Directorio de CSVs de atributos | `sisepuede/attributes/` | — |

---

## Recapitulación

- `ModelAttributes` es la Fase 0: debe construirse antes de que pueda ejecutarse cualquier modelo o transformador.
- Lee un directorio de CSVs clasificados en cuatro buckets: **`cat`** (categorías), **`dim`** (dimensiones experimentales), **`unit`** (factores de conversión), **`other`** (sectores, gases, regiones, parámetros).
- Su `__init__` de 14 pasos se ejecuta en orden de dependencia: primero las constantes básicas, luego la carga de CSVs, después la instanciación de variables y finalmente la validación cruzada.
- `dict_variable_fields_to_model_variables` ofrece búsqueda inversa O(1) desde cualquier nombre concreto de columna de DataFrame hacia su `ModelVariable` — el puente clave entre los datos en formato ancho y el registro tipado de variables.
- `_check_attribute_tables` ejecuta 13 verificaciones específicas por subsector en tiempo de inicialización y lanza excepción de inmediato ante cualquier violación, evitando que errores silenciosos de datos se propaguen a los cálculos del modelo.

---

<Quiz
  questions={[
    {
      question: "¿Qué bucket de tablas de atributos contiene la lista de categorías de uso de suelo (por ejemplo, bosques, cultivos, pastizales)?",
      options: [
        "dim — porque las clases de uso de suelo son dimensiones del análisis",
        "cat — porque son definiciones de categorías indexadas por abreviatura",
        "unit — porque el área de suelo se mide en hectáreas",
        "other — porque no coinciden con ningún prefijo estándar"
      ],
      correct: 1,
      explanation: "Los archivos de categorías siguen la convención de nombrado `attribute_cat_*.csv` y definen las instancias (filas) de una categoría. `attribute_cat_land_use.csv` se carga en el bucket `cat`. El bucket `dim` está reservado para tablas de índices experimentales como `time_period` y `strategy_id`."
    },
    {
      question: "Tras llamar a `ModelAttributes(dir_attributes)`, una colega revisa `model_attributes.dict_variable_fields_to_model_variables.get('enfu_frac_fuel_mix_electricity')` y obtiene `None`. ¿Cuál es la causa más probable?",
      options: [
        "El método `get_variable_dict` no fue llamado",
        "El campo `enfu_frac_fuel_mix_electricity` no existe en ningún `variable_definitions_*.csv` para el subsector Energy Fuels",
        "`_check_attribute_tables` falló silenciosamente y omitió ese subsector",
        "Al bucket `cat` le falta `attribute_cat_fuel.csv`"
      ],
      correct: 1,
      explanation: "`dict_variable_fields_to_model_variables` se puebla iterando sobre los campos expandidos de cada variable. Si el campo está ausente, la definición de variable o no existe en el CSV o su token de esquema no se expandió a ese nombre de campo. Un `attribute_cat_fuel.csv` faltante probablemente lanzaría excepción en tiempo de inicialización en lugar de producir un `None` silencioso."
    },
    {
      question: "¿Por qué `_check_attribute_tables` se ejecuta al final de `__init__` en lugar de al inicio de la llamada `project()` de cada modelo sectorial?",
      options: [
        "Porque los modelos sectoriales no tienen acceso a `ModelAttributes`",
        "Porque ejecutar las verificaciones en tiempo de inicialización saca a la luz errores de configuración antes de que comience cualquier cálculo, haciendo que las fallas sean rápidas e inequívocas",
        "Porque las verificaciones son demasiado lentas para ejecutarse durante una proyección del modelo",
        "Porque `project()` ya valida su DataFrame de entrada de forma independiente"
      ],
      correct: 1,
      explanation: "Fallar rápido en tiempo de construcción significa que una tabla de atributos mal configurada (por ejemplo, dos categorías de arroz, un mapeo faltante de bosque a uso de suelo) lanza una excepción con una ruta de archivo y un nombre de campo claros antes de que el usuario ejecute un solo escenario. Diferir la validación a `project()` ocultaría errores hasta el interior de una corrida por lotes de varias horas."
    }
  ]}
/>
