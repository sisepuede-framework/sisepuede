---
title: Transformador vs Transformación
sidebar_position: 1
---

# Transformador vs Transformación: La Distinción

Bienvenido a la Parte IV del curso. A partir de aquí, pasamos de *cómo SISEPUEDE simula una línea base* a *cómo SISEPUEDE representa intervenciones de política*. Lo primero que debes interiorizar — y la fuente de más confusión que cualquier otro elemento del vocabulario de SISEPUEDE — es la diferencia entre un **Transformador** (Transformer) y una **Transformación** (Transformation).

Si solo recuerdas una frase de este módulo, que sea esta:

> Un **Transformador** es el *código* que sabe CÓMO modificar un DataFrame de línea base. Una **Transformación** es la *intervención de política registrada y parametrizada* que indica QUÉ hacer con ese código en una estrategia dada.

Las dos palabras son fáciles de confundir en el habla casual, y la propia base de código no siempre es pedante al respecto (verás "transformation" en algunos docstrings donde, estrictamente, el objeto discutido es un Transformer). Pero son dos clases de Python distintas, viven en archivos distintos y responden preguntas distintas. Una vez que interiorices la separación, el resto de la Parte IV — estrategias, tablas de atributos, semántica de magnitudes, vectores de rampa — caerá en su lugar.

## El Transformador: CÓMO

Un `Transformer` es un objeto de Python que envuelve una función. La función toma un DataFrame en formato ancho de línea base y devuelve uno modificado. Nada más.

La clase vive en `sisepuede/transformers/transformers.py`:

```python
# sisepuede/transformers/transformers.py
_MODULE_CODE_SIGNATURE = "TFR"

class Transformer:
    """Create a Transformation class to support construction in sectoral
    transformations.

    Initialization Arguments
    ------------------------
    code : str
        Transformer code used to map the transformer to the attribute table.
        Must be defined in attr_transformers.table[attr_transformers.key]
    func : Callable
        The function associated with the transformation ...
    """
    def __init__(self, code, func, attr_transformer, ...):
        ...
```

Aquí importan dos piezas:

1. Un `code` como `TFR:FGTV:INC_GAS_RECOVERY` — el identificador canónico, prefijado con la firma del módulo `TFR`, luego una etiqueta de sector (`FGTV`, `AGRC`, `LNDU`, …), seguida de un nombre de acción corto en mayúsculas.
2. Un `func` — el callable que efectivamente muta el DataFrame.

Las funciones viven en dos capas:

- **`sisepuede/transformers/transformers.py`** contiene los wrappers de alto nivel. Estos son métodos enlazados a la clase grande `Transformers` (nótese el plural — ese es el registro, no un único transformador). Cada wrapper se llama `_trfunc_<sector>_<action>` y es responsable de la verificación de parámetros, la resolución del vector de rampa y el despacho.
- **`sisepuede/transformers/lib/_baselib_<sector>.py`** contiene las funciones base por sector que realizan la cirugía real sobre el DataFrame. Hay un archivo de biblioteca por sector: `_baselib_afolu.py`, `_baselib_circular_economy.py`, `_baselib_energy.py`, `_baselib_ippu.py`, `_baselib_cross_sector.py`, además de `_baselib_general.py` para utilidades compartidas.

Concretamente, el archivo de biblioteca de AFOLU comienza así:

```python
# sisepuede/transformers/lib/_baselib_afolu.py
def transformation_agrc_improve_crop_residue_management(
    df_input: pd.DataFrame,
    magnitude_burned: float,
    magnitude_removed: float,
    vec_ramp: np.ndarray,
    model_attributes: ma.ModelAttributes,
    categories: Union[List[str], None] = None,
    model_afolu: Union[mafl.AFOLU, None] = None,
    rescale: bool = True,
    **kwargs,
) -> pd.DataFrame:
    """Implement the 'Improve Crop Residue Management' transformation."""
    ...
```

Esa función es la lógica de QUÉ-hace-físicamente. El wrapper en `transformers.py` es la lógica de CUÁLES-son-los-defaults-y-cómo-llamarla. El objeto `Transformer` es el *handle de registro* — `Transformers.__init__` construye uno por cada intervención soportada y lo agrega a `self.all_transformers`.

## La Transformación: QUÉ

Una `Transformation` es una parametrización de un Transformer, definida en YAML y validada contra el registro. Su clase vive en `sisepuede/transformers/transformations.py`:

```python
# sisepuede/transformers/transformations.py
class Transformation:
    """Parameterization class for Transformer. Used to vary implementations of
    Transformers. A Transformation reads parameters from a configuration file,
    an existing YAMLConfiguration object, or an existing dictionary to allow
    users the ability to explore different magnitudes, timing, categories,
    or other parameterizations of a Transformer."""
```

Una Transformation tiene su propio identificador, el `transformation_id` (códigos en string como `tx_agrc_improve_rice_management`, ids enteros en la tabla de atributos). Vincula *un Transformer* a *un conjunto de parámetros*. El paso de validación, en `_initialize_config`, rechaza instanciar una Transformation cuyo campo `transformer` no aparezca en `transformers.all_transformers`:

```python
# sisepuede/transformers/transformations.py
transformer_code = config.get(self.key_transformer)
if transformer_code not in transformers.all_transformers:
    msg = f"Transformer code '{transformer_code}' not found in the Transformers."
    raise RuntimeError(msg)
```

Este es el cortafuegos que evita que typos y nombres inventados de transformers se cuelen en una estrategia. **Si un código de transformer no está registrado en `Transformers`, ninguna Transformation puede referenciarlo, y ninguna Strategy puede aplicarlo.**

## Un ejemplo trabajado: `TFR:FGTV:INC_GAS_RECOVERY`

Esta rama (`feature/fgtv-gas-recovery`) recientemente añadió un nuevo transformer para *Recuperación de Gas de Quema en Antorcha* — captura del gas asociado en la cabeza de pozo de petróleo/gas, antes de que entre en la división de emisiones por quema/venteo/fugitivas. Es un ejemplo limpio y mínimo de toda la maquinaria.

**1. La función base** (`sisepuede/transformers/lib/_baselib_energy.py`):
Una nueva función `transformation_fgtv_increase_gas_recovery` que llama a la función genérica `transformation_general` con `magnitude_type="final_value"` sobre la nueva variable de modelo `frac_fgtv_capture_associated_gas_$CAT-FUEL$`.

**2. El método wrapper** (`sisepuede/transformers/transformers.py`, línea 6056):

```python
def _trfunc_fgtv_increase_gas_recovery(self,
    df_input: Union[pd.DataFrame, None] = None,
    magnitude: float = 0.5,
    strat: Union[int, None] = None,
    vec_implementation_ramp: Union[np.ndarray, None] = None,
) -> pd.DataFrame:
    """Implement the 'Increase Gas Recovery' (Gas Flaring Recovery) FGTV
    transformer on input DataFrame df_input. ..."""

    df_input = (self.baseline_inputs
                if not isinstance(df_input, pd.DataFrame) else df_input)
    vec_implementation_ramp = self.check_implementation_ramp(
        vec_implementation_ramp, df_input,
    )
    magnitude = self.bounded_real_magnitude(magnitude, 0.5)

    df_strat_cur = tbe.transformation_fgtv_increase_gas_recovery(
        df_input, magnitude, vec_implementation_ramp,
        self.model_attributes,
        field_region=self.key_region,
        model_enercons=self.model_enercons,
        strategy_id=strat,
    )
    return df_strat_cur
```

**3. El registro del Transformer** (`transformers.py`, línea 1454):

```python
self.fgtv_increase_gas_recovery = Transformer(
    f"{_MODULE_CODE_SIGNATURE}:FGTV:INC_GAS_RECOVERY",
    self._trfunc_fgtv_increase_gas_recovery,
    attr_transformer_code,
)
all_transformers.append(self.fgtv_increase_gas_recovery)
```

**4. La fila en la tabla de atributos** en `sisepuede/attributes/attribute_transformer_code.csv` — id 73, código `TFR:FGTV:INC_GAS_RECOVERY`. Sin esta fila, el constructor `Transformer.__init__` lanza una excepción antes de que `Transformers` pueda terminar de cablearse.

**5. Una Transformation** que lo referencia ahora puede ser escrita, con un nombre como `tx_fgtv_increase_gas_recovery`, eligiendo una magnitud, una ventana de rampa y cualquier otro parámetro que el wrapper acepte. Esa Transformation, y *únicamente* esa Transformation (u otras construidas sobre el mismo Transformer), puede aparecer dentro de una estrategia.

## Convenciones de nomenclatura

Dos familias de nomenclatura paralelas, fáciles de confundir:

| Objeto | Patrón de nomenclatura | Ejemplo | Dónde vive |
|---|---|---|---|
| Código de Transformer | `TFR:<SECTOR>:<ACTION>` (mayúsculas, separado por dos puntos) | `TFR:FGTV:INC_GAS_RECOVERY` | `attribute_transformer_code.csv`, `Transformers.__init__` |
| Método wrapper de Transformer | `_trfunc_<sector>_<action>` (snake_case) | `_trfunc_fgtv_increase_gas_recovery` | `transformers.py` |
| Función base de Transformer | `transformation_<sector>_<action>` | `transformation_fgtv_increase_gas_recovery` | `lib/_baselib_<sector>.py` |
| Id de Transformation | `tx_<sector>_<action>` (snake_case, prefijo `tx_`) | `tx_fgtv_increase_gas_recovery` | YAML de estrategia, `attribute_strategy.csv` |

La familia `TFR:` identifica *código*. La familia `tx_` identifica *intervenciones de política registradas*. Mezclarlas es el error más común en pull requests de recién llegados — y las verificaciones cruzadas de tablas de atributos en `ModelAttributes._check_attribute_tables` rechazarán inconsistencias al inicio, pero solo si ambas tablas existen. Siempre verifica las dos.

## Por qué importa la distinción

`SISEPUEDEExperimentalManager` no consume Transformers directamente. Consume **Strategies**, que son colecciones ordenadas de **Transformations**, que referencian **Transformers**. La cadena es:

```
Strategy  →  Transformation(s)  →  Transformer  →  función base  →  DataFrame modificado
   ^               ^                    ^
   |               |                    |
attribute      YAML/attr           attribute_transformer_code.csv
_strategy.csv  fila de tabla       + registro Transformers
```

Si te saltas pasos — escribir una función base pero nunca envolverla, o envolverla pero nunca añadir la fila a la tabla de atributos, o añadir la fila pero nunca escribir un YAML de Transformation — el manager no puede llegar a tu código. El pipeline exploratorio aplicará silenciosamente nada.

Por esto también **nunca debes inventar un `transformation_id`** en conversaciones, en mapeos de NDC o en reportes para clientes. Si `tx_<tu_idea>` no está en `attribute_strategy.csv`, el modelo no puede ejecutarlo, sin importar qué tan limpio suene el nombre.

## Comparación resumen

| Aspecto | Transformer | Transformation |
|---|---|---|
| Qué es | Callable de Python envuelto en una clase | Configuración parametrizada que referencia un Transformer |
| Nombre de clase | `Transformer` | `Transformation` |
| Vive en | `transformers/transformers.py` + `transformers/lib/_baselib_*.py` | `transformers/transformations.py`, parametrizado vía YAML |
| Identificador | `TFR:<SECTOR>:<NAME>` (mayúsculas, dos puntos) | `tx_<sector>_<name>` (snake_case, prefijo `tx_`) + id entero |
| Registrado en | `attribute_transformer_code.csv` | `attribute_strategy.csv` (indirectamente, vía estrategias) |
| Responde | CÓMO modificar el DataFrame | QUÉ política y parámetros aplicar |
| Cardinalidad | Uno por cada tipo de intervención soportada | Muchas por Transformer (distintas magnitudes, rampas, categorías) |
| Consumido por | `Transformation`, `Strategy` | `Strategy`, `SISEPUEDEExperimentalManager` |

En el siguiente módulo veremos por dentro el propio registro de `Transformer` — la clase `Transformers` con sus más de cien objetos agregados — y veremos cómo se construye al inicio y cómo funciona en la práctica la recuperación con `get_transformer(code)`.

<Quiz>
  <Question prompt="¿Qué archivo editarías para cambiar la lógica real de mutación del DataFrame de un transformer de AFOLU?">
    <Choice correct>`sisepuede/transformers/lib/_baselib_afolu.py`</Choice>
    <Choice>`sisepuede/transformers/transformations.py`</Choice>
    <Choice>`sisepuede/attributes/attribute_strategy.csv`</Choice>
    <Choice>`sisepuede/models/afolu.py`</Choice>
  </Question>
  <Question prompt="Un compañero te dice que está 'usando la transformación tx_fgtv_inc_gas_recovery_v2'. El modelo lanza un error. ¿Cuál es la causa raíz más probable?">
    <Choice>La función base en `_baselib_energy.py` tiene un bug.</Choice>
    <Choice correct>Ese `transformation_id` no está registrado en `attribute_strategy.csv`, por lo que no existe en el registro oficial del modelo.</Choice>
    <Choice>El código de Transformer `TFR:FGTV:INC_GAS_RECOVERY` no fue agregado a `all_transformers`.</Choice>
    <Choice>Al archivo YAML de estrategia le falta el campo `magnitude`.</Choice>
  </Question>
  <Question prompt="¿Cuál es la relación entre un Transformer y una Transformation?">
    <Choice>Son el mismo objeto — `Transformation` es solo un alias deprecado de `Transformer`.</Choice>
    <Choice>Un Transformer envuelve una o más Transformations y las aplica en orden.</Choice>
    <Choice correct>Una Transformation referencia exactamente un Transformer y proporciona sus parámetros; muchas Transformations pueden apuntar al mismo Transformer con distintos conjuntos de parámetros.</Choice>
    <Choice>Un Transformer referencia una o más Transformations y selecciona cuál aplicar en tiempo de ejecución según el id de estrategia.</Choice>
  </Question>
</Quiz>
