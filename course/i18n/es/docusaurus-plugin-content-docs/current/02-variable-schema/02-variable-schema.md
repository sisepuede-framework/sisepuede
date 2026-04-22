---
id: variable-schema
title: "Esquema de Nombrado de Variables"
sidebar_position: 2
---

Cada columna en un DataFrame de entrada o salida de SISEPUEDE lleva un nombre que no es arbitrario — es una **especificación legible por máquina** de sector, subsector, descriptor, unidades y categoría. El patrón general es `{sector_prefix}_{descriptor}_{units_or_qualifier}_{$CAT-X$}`, donde `$CAT-X$` es un token que el framework expande en un nombre de columna concreto por categoría en el momento de instanciar el modelo. Comprender este esquema es el prerrequisito para leer tablas de atributos, escribir plantillas de entrada y depurar errores de campos no coincidentes.

## Objetivos de aprendizaje

- Descomponer el nombre de cualquier campo de variable de SISEPUEDE en sus partes constituyentes.
- Identificar la abreviatura del subsector a partir del primer segmento del nombre del campo.
- Explicar qué son los tokens `$CAT-X$` y cómo `build_fields()` los expande a nombres de columnas concretos.
- Describir el rol de `ModelVariable` y `VariableSchema` en la jerarquía de clases.
- Usar `dict_variable_fields_to_model_variables` para realizar una búsqueda inversa de un nombre de campo a su `ModelVariable`.

## La convención de nombrado

Los nombres de campos de variables de SISEPUEDE siguen una estructura fija delimitada por guiones bajos. El **primer segmento** es siempre la abreviatura del subsector — un código de dos o cuatro letras definido en `sisepuede/attributes/attribute_subsector.csv`. Lo que sigue es un descriptor que identifica la cantidad, y luego uno o más calificadores para unidades y categorías.

| Abreviatura del subsector | Subsector | Sector |
|---|---|---|
| `agrc` | Agricultura | AFOLU |
| `lvst` | Ganadería | AFOLU |
| `lndu` | Uso de Suelo | AFOLU |
| `frst` | Bosques | AFOLU |
| `lsmm` | Manejo de Estiércol Ganadero | AFOLU |
| `soil` | Manejo de Suelos | AFOLU |
| `wali` | Residuos Líquidos | Economía Circular |
| `waso` | Residuos Sólidos | Economía Circular |
| `trww` | Tratamiento de Aguas Residuales | Economía Circular |
| `enfu` | Combustibles Energéticos | Energía |
| `fgtv` | Emisiones Fugitivas | Energía |
| `inen` | Energía Industrial | Energía |
| `scoe` | Combustión Estacionaria y Otros Usos Energéticos | Energía |
| `trns` | Transporte | Energía |
| `entc` | Tecnología Energética | Energía |
| `ippu` | IPPU | IPPU |
| `econ` | Economía | Socioeconómico |
| `gnrl` | General | Socioeconómico |

### Ejemplos resueltos

<VariableTable rows={[
  {
    field: "pop_lvst_initial_$CAT-LIVESTOCK$",
    expanded: "pop_lvst_initial_buffalo (+ uno por categoría de ganado)",
    description: "Número inicial de cabezas de cada tipo de ganado en t=0",
    unit: "cabezas",
    type: "Entrada"
  },
  {
    field: "ef_agrc_anaerobicdom_$CAT-AGRICULTURE$_$UNIT-MASS$_$EMISSION-GAS$_$UNIT-AREA$",
    expanded: "ef_agrc_anaerobicdom_rice_kg_ch4_ha",
    description: "Factor de emisión de CH4 por descomposición anaerobia de cultivos de arroz",
    unit: "kg CH4 / ha",
    type: "Entrada"
  },
  {
    field: "ef_enfu_combustion_$UNIT-MASS$_$EMISSION-GAS$_per_$UNIT-ENERGY$_$CAT-FUEL$",
    expanded: "ef_enfu_combustion_tonne_co2_per_pj_fuel_diesel (+ uno por combustible)",
    description: "Factor de emisión de CO2 por combustión, por tipo de combustible",
    unit: "tonne CO2 / PJ",
    type: "Entrada"
  },
  {
    field: "scalar_scoe_appliance_energy_demand_$CAT-SCOE$",
    expanded: "scalar_scoe_appliance_energy_demand_commercial (+ uno por categoría SCOE)",
    description: "Escalar que modifica la demanda energética no térmica por eficiencia de electrodomésticos",
    unit: "adimensional",
    type: "Entrada"
  },
  {
    field: "ef_ippu_$UNIT-MASS$_$EMISSION-GAS$_per_$UNIT-MASS$_production_$CAT-INDUSTRY$",
    expanded: "ef_ippu_tonne_ch4_per_tonne_production_chemicals",
    description: "Factor de emisión de CH4 por proceso, por tonelada de producción industrial",
    unit: "tonne CH4 / tonne producto",
    type: "Entrada"
  },
  {
    field: "ef_fgtv_production_flaring_$UNIT-MASS$_$EMISSION-GAS$_per_$UNIT-VOLUME$_$CAT-FUEL$",
    expanded: "ef_fgtv_production_flaring_tonne_ch4_per_m3_fuel_natural_gas",
    description: "Factor de emisión de CH4 por quema en antorcha, por volumen de combustible producido",
    unit: "tonne CH4 / m3",
    type: "Entrada"
  }
]} />

La forma "expandida" es la que aparece efectivamente como encabezado de columna en el DataFrame. La forma cruda del esquema con tokens `$...$` es la que se almacena en el CSV de atributos y en `ModelVariable.schema`.

## Tokens de VariableSchema

Los tokens son subcadenas rodeadas por delimitadores `$`. Actúan como **marcadores de posición** para una dimensión de variabilidad. Cuando se llama a `build_fields()`, cada token es reemplazado por cada valor concreto en la tabla de categoría o unidad correspondiente.

Las dos familias principales de tokens son:

**Tokens de categoría** — se expanden sobre las filas de una tabla de atributos de categoría (por ejemplo, `attribute_cat_livestock.csv`):

| Token | Tabla de atributos de categoría | Valores de ejemplo |
|---|---|---|
| `$CAT-AGRICULTURE$` | `attribute_cat_agriculture.csv` | `bevs_and_spices`, `fiber`, `rice`, `vegetables` … |
| `$CAT-LIVESTOCK$` | `attribute_cat_livestock.csv` | `buffalo`, `cattle_dairy`, `cattle_nondairy`, `goats` … |
| `$CAT-INDUSTRY$` | `attribute_cat_industry.csv` | `cement`, `chemicals`, `metals`, `plastic` … |
| `$CAT-FUEL$` | `attribute_cat_fuel.csv` | `fuel_coal`, `fuel_diesel`, `fuel_natural_gas` … |
| `$CAT-SCOE$` | `attribute_cat_scoe.csv` | `commercial`, `industrial`, `residential` … |
| `$CAT-TRANSPORTATION$` | `attribute_cat_transportation.csv` | `aviation`, `rail_freight`, `road_heavy_truck` … |
| `$CAT-LANDUSE$` | `attribute_cat_land_use.csv` | `croplands`, `forests`, `grasslands`, `wetlands` … |

**Tokens de unidad** — se expanden sobre filas de tablas de atributos de unidades (por ejemplo, `attribute_unit_mass.csv`), pero crucialmente están **fijados a un único valor** en cada definición de variable. El CSV de definición de variables incluye el vínculo entre paréntesis directamente después de la cadena del esquema, por ejemplo: `(``$UNIT-MASS$ = tonne``, ``$EMISSION-GAS$ = ch4``)`. El token de unidad crea un calificador concreto en el nombre de columna en lugar de multiplicar columnas:

| Token | Se fija al ejemplo |
|---|---|
| `$UNIT-MASS$` | `tonne`, `kg` |
| `$UNIT-ENERGY$` | `pj`, `tj` |
| `$UNIT-AREA$` | `ha` |
| `$UNIT-VOLUME$` | `m3` |
| `$EMISSION-GAS$` | `ch4`, `co2`, `n2o` |

Un sufijo especial `-DIM1`, `-DIM2` (el mecanismo `flag_dim` en `VariableSchema`) permite que la misma categoría aparezca dos veces en un esquema — produciendo el producto exterior del espacio de categorías. Por ejemplo, `$CAT-LANDUSE-DIM1$_$CAT-LANDUSE-DIM2$` genera un campo por cada par ordenado de categorías de uso de suelo, que es como se representan las matrices de transición de uso de suelo.

### Cómo `build_fields()` expande un esquema

`ModelVariable.build_fields()` (definido en `sisepuede/core/model_variable.py`, línea 1192) realiza la expansión en el momento de la inicialización:

1. Comienza con `self.schema.schema` — la cadena cruda con tokens `$...$`.
2. Para cada elemento mutable (token) en el esquema, itera sobre los valores de categoría permitidos (almacenados en `self.dict_category_keys`) y realiza una sustitución de cadena.
3. Si la definición de variable restringe categorías (por ejemplo, `categories = "fuel_natural_gas"` en lugar de `"all"`), solo se sustituyen esas categorías.
4. El resultado es una lista de cadenas concretas de nombres de columnas almacenadas en `self.fields`.

Por ejemplo, `pop_lvst_initial_$CAT-LIVESTOCK$` con `categories = "all"` produce un campo por cada fila en `attribute_cat_livestock.csv` — `pop_lvst_initial_buffalo`, `pop_lvst_initial_cattle_dairy`, y así sucesivamente. El espacio completo (si las categorías no estuvieran restringidas) se almacena por separado en `self.fields_space`.

## La clase `ModelVariable`

`ModelVariable` (definida en `sisepuede/core/model_variable.py`, a partir de la línea 40) es el único objeto que encapsula todo lo conocido sobre una variable:

- `modvar.name` — el nombre legible de la variable tal como se define en el CSV de atributos (por ejemplo, `"Initial Livestock Head Count"`).
- `modvar.schema` — una instancia de `VariableSchema` que envuelve la cadena cruda del esquema.
- `modvar.fields` — la lista de nombres concretos de columnas de DataFrame producidos por `build_fields()`.
- `modvar.fields_space` — la expansión completa sobre todas las categorías (ignorando restricciones).
- `modvar.categories_are_restricted` — booleano; `True` si la variable solo aplica a un subconjunto de su categoría primaria.
- Propiedades adicionales de la fila de atributos (tipo de variable, valor por defecto, cotas escalares para LHS) son accesibles vía `modvar.get_property()`.

`VariableSchema` (línea 1636) es la clase de bajo nivel que parsea la cadena cruda del esquema, identifica elementos mutables mediante una expresión regular `$...$` y almacena la lista ordenada de tokens en `self.mutable_elements_clean_ordered`. Es un detalle interno de implementación; casi siempre interactuarás con la interfaz de más alto nivel `ModelVariable`.

## Búsqueda inversa: `dict_variable_fields_to_model_variables`

`ModelAttributes._initialize_variables_by_subsector()` (llamado durante `__init__`) construye el mapa inverso:

```python
self.dict_variable_fields_to_model_variables
```

Este diccionario mapea cada nombre concreto de columna (por ejemplo, `"pop_lvst_initial_cattle_dairy"`) al nombre del `ModelVariable` al que pertenece (por ejemplo, `"Initial Livestock Head Count"`). Se puebla iterando sobre cada `ModelVariable` en `dict_variables`, expandiendo sus campos y agregando `{field: modvar.name}` por cada uno.

El mapa directo acompañante es:

```python
self.dict_model_variables_to_variable_fields
```

el cual mapea `modvar.name -> [lista de nombres concretos de campos]`.

Juntos, estos dos diccionarios son la columna vertebral de la validación a nivel de campo y del traspaso de datos entre sectores en todo el modelo.

## Por qué importa: validación con falla rápida

Cuando un modelo sectorial (por ejemplo, `AFOLU.project()`) lee su DataFrame de entrada, busca los campos requeridos usando `ModelAttributes`. Si una plantilla tiene una columna mal escrita — digamos `pop_lvst_initail_cattle_dairy` — simplemente está ausente de `dict_variable_fields_to_model_variables`. El modelo lanza un error de inmediato o recurre al `default_value` de la variable (también almacenado en el `ModelVariable`). De cualquier manera, el esquema impone consistencia: **no puedes pasar una columna que el modelo no reconoce, y no puedes mezclar accidentalmente datos de dos espacios de categorías distintos**.

Esta es también la razón por la que el esquema debe usarse exactamente como se define en los CSVs de atributos. Inventar un nombre de columna que no esté registrado en `ModelAttributes` será silenciosamente ignorado o causará una falla dura — no hay un fallback elegante para campos no registrados.

## Ejemplo de código: buscar un campo

```python
import sisepuede.core.model_attributes as ma

# carga model attributes desde el directorio de atributos por defecto
model_attributes = ma.ModelAttributes("path/to/sisepuede/attributes")

# búsqueda directa: obtener todos los campos concretos de una variable nombrada
modvar_name = "Initial Livestock Head Count"
fields = model_attributes.dict_model_variables_to_variable_fields[modvar_name]
# -> ["pop_lvst_initial_buffalo", "pop_lvst_initial_cattle_dairy", ...]

# búsqueda inversa: encontrar a qué ModelVariable pertenece una columna
field = "pop_lvst_initial_cattle_dairy"
owner = model_attributes.dict_variable_fields_to_model_variables[field]
# -> "Initial Livestock Head Count"

# acceder al objeto ModelVariable mismo
modvar = model_attributes.dict_variables[owner]
print(modvar.schema.schema)
# -> "pop_lvst_initial_$CAT-LIVESTOCK$"
print(modvar.fields)
# -> ["pop_lvst_initial_buffalo", "pop_lvst_initial_cattle_dairy", ...]
```

:::note En el código fuente

Los tres archivos que implementan todo lo descrito en este módulo:

- **`sisepuede/core/model_variable.py`** — `ModelVariable` (línea 40) y `VariableSchema` (línea 1636). `build_fields()` se define en la línea 1192 de `ModelVariable`.
- **`sisepuede/core/model_attributes.py`** — `get_variable_dict()` (línea 3899) instancia cada `ModelVariable` a partir de los CSVs de atributos. `_initialize_variables_by_subsector()` (alrededor de la línea 1340) construye `dict_variable_fields_to_model_variables` y su inverso.
- **`sisepuede/attributes/variable_definitions_*.csv`** — un archivo por subsector (por ejemplo, `variable_definitions_af_lvst.csv`). Cada fila es una variable: la columna `variable_schema` contiene la cadena cruda del token; la columna `categories` contiene la lista de restricción delimitada por barras verticales o `"all"`.

:::

## Recapitulación

- Los nombres de campo son determinísticos: primero la abreviatura del subsector, luego el descriptor, después los calificadores de unidad y por último el token de categoría.
- Los tokens `$CAT-X$` son expandidos por `build_fields()` en una columna concreta por cada valor de categoría permitido en el momento de instanciar el modelo — nunca en tiempo de ejecución.
- Los tokens de unidad (`$UNIT-MASS$`, `$EMISSION-GAS$`, etc.) están fijados a un único valor por variable y producen un calificador legible en el nombre de columna en lugar de columnas adicionales.
- `ModelVariable` envuelve el esquema, la lista de campos y todos los metadatos de atributos. `VariableSchema` es su parser interno.
- `dict_variable_fields_to_model_variables` y su inverso son las estructuras de búsqueda centrales utilizadas en cada modelo sectorial.
- El esquema se valida en la inicialización de `ModelAttributes`; un nombre de campo incorrecto se detecta antes de que se ejecute cualquier cálculo de emisiones.

---

<Quiz questions={[
  {q: "¿Qué indica siempre el primer segmento de un nombre de campo de variable de SISEPUEDE?", choices: [
    {text: "El gas de emisión (por ejemplo, ch4, co2)"},
    {text: "La abreviatura del subsector (por ejemplo, lvst, scoe, enfu)", correct: true, explain: "La abreviatura del subsector es siempre el primer segmento delimitado por guion bajo. Está definida en attribute_subsector.csv y vincula la variable con su sector contenedor y su tabla de categorías."},
    {text: "El tipo de variable (entrada o salida)"},
  ]},
  {q: "Dado el esquema `ef_agrc_anaerobicdom_$CAT-AGRICULTURE$_$UNIT-MASS$_$EMISSION-GAS$_$UNIT-AREA$` con el vínculo ($UNIT-MASS$ = kg, $EMISSION-GAS$ = ch4, $UNIT-AREA$ = ha) y categories = 'rice', ¿cuántos nombres de columna concretos produce build_fields()?", choices: [
    {text: "Una columna: ef_agrc_anaerobicdom_rice_kg_ch4_ha", correct: true, explain: "Como categories está restringido a 'rice' — un único valor — solo se produce una columna. Los tokens de unidad están fijados a valores únicos y no multiplican la salida."},
    {text: "Tres columnas — una por token de unidad ($UNIT-MASS$, $EMISSION-GAS$, $UNIT-AREA$)"},
    {text: "Una columna por cada fila en attribute_cat_agriculture.csv"},
  ]},
  {q: "¿Qué sucede cuando un modelo sectorial encuentra una columna en el DataFrame de entrada que no está registrada en dict_variable_fields_to_model_variables?", choices: [
    {text: "La columna se agrega automáticamente al esquema"},
    {text: "El modelo lanza un error o ignora silenciosamente la columna y usa el default_value de la variable", correct: true, explain: "Los campos no registrados no tienen entrada en la búsqueda inversa. El modelo lanza un error duro o recurre al default_value registrado. No hay extensión automática de esquema en tiempo de ejecución."},
    {text: "ModelAttributes reconstruye su diccionario de variables para incluir el nuevo campo"},
  ]}
]} />
