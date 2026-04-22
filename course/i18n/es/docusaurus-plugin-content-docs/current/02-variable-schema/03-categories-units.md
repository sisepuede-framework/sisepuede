---
title: Categorías y Unidades
sidebar_position: 3
---

# Categorías y Unidades

En el Módulo 5 viste que cada esquema de variable de SISEPUEDE contiene tokens como `$CAT-AGRICULTURE$` o `$UNIT-MASS$` que se expanden, en el momento de la carga, a nombres concretos de columnas. Este módulo mira bajo el capó **de dónde provienen esos tokens** — las tablas de atributos en CSV que definen las dimensiones categóricas, los sistemas de unidades y los gases del modelo — y **cómo `ModelAttributes` los convierte en búsquedas en tiempo de ejecución** para validación de categorías, conversión de unidades y agregación por GWP.

Si el objeto `ModelAttributes` es el compilador de esquema de SISEPUEDE, el directorio `attributes/` es su código fuente. Todo lo demás — `AFOLU`, `CircularEconomy`, `IPPU`, `Energy`, la librería de transformadores — es río abajo de lo que vive ahí.

## Tablas de categorías: `attribute_cat_*.csv`

Cada token `$CAT-X$` en un esquema de variable está respaldado por una **tabla de atributos de categoría**. Estas viven en `sisepuede/attributes/` y siguen una convención de nombrado estricta: `attribute_cat_{subsector}.csv`. Al día de hoy en la rama main, las tablas de categorías son:

| Archivo | Token | Propósito |
|---|---|---|
| `attribute_cat_agriculture.csv` | `$CAT-AGRICULTURE$` | Categorías de cultivos (rice, maize, sugar_cane, …) |
| `attribute_cat_livestock.csv` | `$CAT-LIVESTOCK$` | Tipos de ganado (cattle_dairy, sheep, poultry, …) |
| `attribute_cat_forest.csv` | `$CAT-FOREST$` | Clases de bosque (primary, secondary, mangroves, plantations) |
| `attribute_cat_land_use.csv` | `$CAT-LAND-USE$` | Estados de Markov (croplands, grasslands, settlements, …) |
| `attribute_cat_soil_management.csv` | `$CAT-SOIL-MANAGEMENT$` | Regímenes de manejo usados en la contabilidad de SOC |
| `attribute_cat_manure_management.csv` | `$CAT-MANURE-MANAGEMENT$` | Vías de disposición de estiércol |
| `attribute_cat_industry.csv` | `$CAT-INDUSTRY$` | Categorías de procesos IPPU (cement, chemicals, metals, electronics) |
| `attribute_cat_fuel.csv` | `$CAT-FUEL$` | Combustibles consumidos en sectores de combustión y fugitivos |
| `attribute_cat_technology.csv` | `$CAT-TECHNOLOGY$` | Tecnologías de generación eléctrica para NemoMod |
| `attribute_cat_storage.csv` | `$CAT-STORAGE$` | Tecnologías de almacenamiento eléctrico |
| `attribute_cat_transportation.csv` | `$CAT-TRANSPORTATION$` | Modos de transporte (road_light, rail_freight, aviation, …) |
| `attribute_cat_transportation_demand.csv` | `$CAT-TRANSPORTATION-DEMAND$` | Categorías de demanda (passenger, freight) |
| `attribute_cat_scoe.csv` | `$CAT-SCOE$` | Combustión estacionaria de usos finales energéticos (residential, commercial) |
| `attribute_cat_ccsq.csv` | `$CAT-CCSQ$` | Modalidades de captura y secuestro de carbono |
| `attribute_cat_solid_waste.csv` | `$CAT-SOLID-WASTE$` | Flujos de residuos enviados a rellenos sanitarios y composteras |
| `attribute_cat_liquid_waste.csv` | `$CAT-LIQUID-WASTE$` | Flujos de aguas residuales domésticas / industriales |
| `attribute_cat_wastewater_treatment.csv` | `$CAT-WASTEWATER-TREATMENT$` | Vías de tratamiento (anaerobic, aerobic, septic, …) |

Cada tabla tiene una fila por categoría, una columna que lleva el token `$CAT-X$` en marcado RST (por ejemplo, ``` ``rice`` ```), y un conjunto de columnas de propiedades que los modelos downstream consumen directamente (por ejemplo, `attribute_cat_agriculture.csv` lleva factores de fijación de nitrógeno por defecto y si un cultivo es de tipo paddy para la contabilidad de CH4).

### Cómo se cargan las categorías

Las tablas de categorías son descubiertas y parseadas dentro de `ModelAttributes._initialize_attribute_tables()` — el punto de entrada canónico está en `sisepuede/core/model_attributes.py:424`. El método recorre `attribute_directory` y clasifica cada archivo contra un conjunto de expresiones regulares compiladas:

```python
# sisepuede/core/model_attributes.py — alrededor de la línea 485
key_cat = "cat"
key_dim = "dim"
key_unit = "unit"

attribute_groups = [key_cat, key_dim, key_unit]

dict_attribute_group_to_regex = dict(
    (x, re.compile(f"{self.key_attribute}_{x}_(.*).csv"))
    for x in attribute_groups if (x != "other")
)
dict_attribute_group_to_regex.update(
    {attribute_group_protected_other: re.compile(f"{self.key_attribute}_(.*).csv")}
)
```

Cada archivo que coincida con `attribute_cat_(.*).csv` se convierte en una `AttributeTable` indexada por el grupo de captura. Estas se almacenan en `self.dict_attributes[self.attribute_group_key_cat]`, indexadas por el nombre python de la categoría declarado en `attribute_subsector.csv` (la columna `subsector_field_category_py`). Así es como `ModelVariable.build_fields()` (Módulo 5) resuelve un token `$CAT-AGRICULTURE$`: busca el mapeo subsector → categoría python, recupera la `AttributeTable` desde ese diccionario y expande de manera cartesiana el esquema contra las claves de la categoría.

La consistencia entre tablas se verifica luego en `_check_attribute_tables()`: cada `$CAT-X$` referenciado por cualquier variable debe resolver a una tabla cargada, y cada categoría referenciada en columnas downstream de atributos (por ejemplo, la columna "fuel_category" de `attribute_cat_technology.csv`) debe ser una clave válida en la tabla de destino. Esto es lo que hace que una fila faltante en un CSV de categoría lance excepción en el momento de construir el modelo, en lugar de hacerlo en lo profundo de una llamada `project()` sectorial.

## Tablas de unidades: `attribute_unit_*.csv`

Las unidades siguen el mismo mecanismo de descubrimiento pero apuntan al regex `attribute_unit_(.*).csv`. Las dimensiones de unidades incluidas son:

<VariableTable
  headers={["Tipo de unidad", "Archivo", "Token", "Unidades de ejemplo"]}
  rows={[
    ["Masa", "attribute_unit_mass.csv", "$UNIT-MASS$", "g, kg, tonne, kt, mt, gt"],
    ["Energía", "attribute_unit_energy.csv", "$UNIT-ENERGY$", "j, kj, mj, gj, tj, pj, kwh, mwh, gwh"],
    ["Potencia", "attribute_unit_power.csv", "$UNIT-POWER$", "w, kw, mw, gw"],
    ["Volumen", "attribute_unit_volume.csv", "$UNIT-VOLUME$", "l, m3, km3"],
    ["Área", "attribute_unit_area.csv", "$UNIT-AREA$", "ha, km2, m2"],
    ["Longitud", "attribute_unit_length.csv", "$UNIT-LENGTH$", "m, km, mi"],
    ["Monetaria", "attribute_unit_monetary.csv", "$UNIT-MONETARY$", "usd, mm_usd, bn_usd"]
  ]}
/>

El tiempo es un caso especial manejado a través de `attribute_dim_time_period.csv`, y los gases viven en una tabla independiente (`attribute_gas.csv`) descrita más abajo.

Cada archivo de unidad es una matriz de conversión cuasi-cuadrada. Por ejemplo, `attribute_unit_mass.csv` almacena una fila por unidad y una columna **"Mass Equivalent X"** por cada unidad de destino, de modo que una sola búsqueda te entrega directamente el escalar multiplicativo. Las dos primeras filas se ven así:

```
Mass,$UNIT-MASS$,Name,...,Mass Equivalent MT,Mass Equivalent GT
g,g,Grams,...,1E-12,1E-15
kg,kg,Kilograms,...,1E-9,1E-12
```

### Cómo recuperar unidades y factores de conversión

En tiempo de ejecución, dos métodos son la interfaz pública:

- `ModelAttributes.get_unit(unit, return_type="unit")` — `sisepuede/core/model_attributes.py:3779`. Devuelve el objeto `Units` (o su `AttributeTable` subyacente) para un nombre de dimensión dado como `"mass"`, `"energy"`, `"area"`. Internamente esto es simplemente `self.dict_attributes[self.attribute_group_key_unit].get(unit)`.

- `ModelAttributes.get_unit_equivalent(unit_type, unit, unit_to_match, config_str)` — `sisepuede/core/model_attributes.py:4346`. Devuelve el escalar `a` tal que `unit * a = unit_to_match`. Si `unit_to_match` es `None`, recurre al valor de configuración del modelo indexado por `config_str` (por ejemplo, la unidad `emissions_mass` configurada para las salidas de emisiones).

Esta es la maquinaria que los modelos sectoriales usan cada vez que las variables de entrada se declaran en una unidad y las emisiones de salida deben reportarse en otra. Nunca verás los escalares de conversión hardcodeados en `AFOLU.project()` o `Energy.project()` — todos pasan por `get_unit_equivalent`, que es por lo que cambiar la plantilla de entrada de un país de `tonne` a `kt` es un cambio de una línea en la configuración y no un cambio de código.

## Gases y GWP

`attribute_gas.csv` cumple el rol de tabla de unidades para gases de efecto invernadero. Cada fila es un gas (`co2`, `ch4`, `n2o`, `nf3`, `sf6`, las familias completas de HFC y PFC) y lleva tres columnas de GWP:

- `Global Warming Potential 20`
- `Global Warming Potential 100`
- `Global Warming Potential 500`

**Los valores por defecto siguen IPCC AR6 WG1 Capítulo 7, Tabla 7.SM.7**, con GWP100 como valor por defecto del modelo. La columna `Source` registra explícitamente esta procedencia. Por ejemplo, CH4 se almacena como GWP20 = 81.2, GWP100 = 27.9, GWP500 = 7.95.

### Por qué las emisiones salen en MT CO2e

Todos los modelos sectoriales emiten internamente cantidades específicas por gas (por ejemplo, kg de CH4 por cabeza de ganado por año). La agregación de salida en `SISEPUEDEModels` luego hace dos cosas:

1. Llama a `get_unit_equivalent("mass", native_unit, configured_emissions_mass, ...)` para reconciliar la escala de masa — por defecto **megatoneladas (MT)**.
2. Multiplica la columna de emisiones de cada gas por su GWP100 desde `attribute_gas.csv`, produciendo **MT CO2e**.

Ambos pasos están guiados por la configuración, así que si quisieras reportar con base en GWP20 sobrescribirías `global_warming_potential` en la configuración, y si quisieras la salida en kt en lugar de MT sobrescribirías `emissions_mass` — sin necesidad de editar código. Esto es una consecuencia directa de mantener las matrices de conversión y los valores de GWP de manera declarativa, en CSVs, en lugar de como constantes literales en Python.

## Poniéndolo todo junto

El flujo desde un token en un esquema de variable hasta un valor numérico en un CSV es:

1. Una fila de variable en `attribute_subsector_X_variables.csv` declara, por ejemplo, `agrc_yield_$CAT-AGRICULTURE$_$UNIT-MASS$_per_$UNIT-AREA$`.
2. `ModelAttributes._initialize_attribute_tables()` carga cada `attribute_cat_*.csv`, `attribute_unit_*.csv`, `attribute_gas.csv` y `attribute_dim_*.csv` en `self.dict_attributes`.
3. `ModelVariable.build_fields()` resuelve `$CAT-AGRICULTURE$` contra `attribute_cat_agriculture.csv` (una columna por cultivo) y deja los tokens de unidad adheridos a los metadatos del esquema en lugar de expandirlos como columnas.
4. En tiempo de `project()`, los modelos sectoriales llaman a `get_unit_equivalent()` sobre los metadatos de unidad adheridos al esquema para reescalar entradas y salidas de manera consistente.
5. `SISEPUEDEModels` aplica el GWP100 desde `attribute_gas.csv` para producir la salida final en `MT CO2e`.

Cada uno de estos pasos es una búsqueda pura en tabla. No hay constantes ocultas ni listas de cultivos hardcodeadas en ninguna parte del código sectorial — que es precisamente la razón por la que SISEPUEDE puede re-vestirse para un nuevo país, una nueva categoría o una nueva convención contable sin tocar Python.

<Quiz
  question="¿Qué método de ModelAttributes devuelve el escalar multiplicativo necesario para convertir entre dos unidades de la misma dimensión?"
  options={["get_unit()", "get_unit_attribute()", "get_unit_equivalent()", "get_valid_categories()"]}
  correctIndex={2}
  explanation="get_unit_equivalent(unit_type, unit, unit_to_match, config_str) en sisepuede/core/model_attributes.py:4346 devuelve el escalar a tal que unit * a = unit_to_match. get_unit() solo recupera el objeto Units mismo."
/>

<Quiz
  question="¿De dónde obtiene SISEPUEDE los valores de GWP usados para agregar emisiones específicas por gas a CO2e?"
  options={[
    "Constantes hardcodeadas en SISEPUEDEModels",
    "Valores por defecto de IPCC AR5 incrustados en cada modelo sectorial",
    "Las columnas Global Warming Potential de attribute_gas.csv, basadas en IPCC AR6 WG1 Capítulo 7 Tabla 7.SM.7",
    "Una llamada en tiempo de ejecución a una API externa del IPCC"
  ]}
  correctIndex={2}
  explanation="Los valores de GWP viven en attribute_gas.csv junto con cada entrada de gas, con columnas GWP20/GWP100/GWP500. El valor por defecto es GWP100 de IPCC AR6 WG1 Capítulo 7 Tabla 7.SM.7, y puede sobrescribirse vía configuración."
/>

<Quiz
  question="¿Qué expresión regular usa _initialize_attribute_tables() para descubrir las tablas de categorías?"
  options={[
    "attribute_(.*)_cat.csv",
    "attribute_cat_(.*).csv",
    "cat_attribute_(.*).csv",
    "$CAT-(.*)$.csv"
  ]}
  correctIndex={1}
  explanation="Dentro de _initialize_attribute_tables() (sisepuede/core/model_attributes.py:424), el regex se compila como f'{self.key_attribute}_{x}_(.*).csv' para cada grupo x en ['cat','dim','unit'], lo que se resuelve en attribute_cat_(.*).csv para las tablas de categorías."
/>
