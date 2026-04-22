---
id: installation
title: "Instalación y primeros pasos"
sidebar_position: 3
---

SISEPUEDE corre sobre Python 3.11 y depende de un back-end de Julia para la
optimización del despacho eléctrico (NemoMod). Antes de modelar una sola
tonelada de CO₂e, necesitas ambos runtimes en su lugar. Este módulo recorre
**tres rutas de instalación** — pip, conda y Docker — y muestra cómo luce una
primera importación exitosa.

---

## Objetivos de aprendizaje

Al final de este módulo serás capaz de:

- Identificar qué versiones de Python y Julia requiere SISEPUEDE.
- Configurar un entorno funcional usando cualquiera de las tres rutas de
  instalación que mejor se ajuste a tu flujo de trabajo.
- Confirmar la instalación importando la clase `SISEPUEDE` e instanciando
  el objeto de estructura de archivos.
- Diagnosticar tres problemas comunes de entorno: un runtime de Julia
  faltante, un error de permisos de SQLite y un conflicto de JuliaPkg.

---

## Requisitos

| Componente | Versión requerida |
|-----------|-----------------|
| Python | **3.11.x** (fijado exactamente — ver `pyproject.toml`) |
| Julia | **1.11.5** (usado en la imagen oficial de Docker) |
| SO | Linux (recomendado), macOS, Windows con WSL2 |

Dependencias clave de Python (de `requirements.txt`):

| Paquete | Versión |
|---------|---------|
| `pandas` | 2.2.3 |
| `numpy` | 2.2.2 |
| `juliacall` | 0.9.25 |
| `juliapkg` | 0.1.17 |
| `SQLAlchemy` | 2.0.37 |
| `geopandas` | 1.0.1 |
| `pyDOE2` | 1.3.0 |
| `qpsolvers` | 4.4.0 |

Todos los pines de versión son estrictos. Mezclar versiones — incluso releases
de parche — puede romper el puente Julia–Python o la interfaz del solver de LP.

---

## Opción A: instalación con pip

SISEPUEDE es instalable directamente desde GitHub. El comando canónico tomado
del Dockerfile es:

```bash
pip install git+https://github.com/jcsyme/sisepuede.git@bf4f954ef6747d8d1adac257e6b2395b42ba5fa0
```

Ese pin de SHA apunta a un commit de release verificado. Si quieres seguir una
rama o etiqueta nombrada, consulta los [docs de referencia](https://sisepuede.readthedocs.io/)
para los identificadores de release actualmente soportados.

Antes de ejecutar `pip install` se recomienda fuertemente crear un entorno
virtual dedicado con Python 3.11 exactamente:

```bash
python3.11 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
```

Después de que el paquete se instale, agrega el puente a Julia:

```bash
pip install juliacall==0.9.25 juliapkg==0.1.17
```

`juliapkg` descargará y configurará el runtime de Julia automáticamente en el
primer uso si Julia no está ya en tu `PATH`.

---

## Opción B: conda

El repositorio incluye dos archivos de entorno conda. Usa `environment.yaml`
para instalaciones locales en estación de trabajo (incluye `juliacall` y
`juliapkg` como paquetes conda); usa `environment_docker.yaml` solo dentro de
la cadena de build de Docker (omite esos paquetes, los cuales el Dockerfile
instala vía pip).

```bash
# Clonar el repositorio
git clone https://github.com/jcsyme/sisepuede.git
cd sisepuede

# Crear y activar el entorno
conda env create -f environment.yaml
conda activate sisepuede
```

El entorno se llama `sisepuede` como se declara en `environment.yaml`. Todos
los paquetes se obtienen del canal `conda-forge`. Python 3.11 está fijado
exactamente; varios otros paquetes (p. ej. `pandas`, `numpy`, `geopandas`)
aceptan versiones mínimas compatibles.

Después de que el entorno esté activo, instala el paquete en sí:

```bash
pip install -e .
```

La bandera `-e` instala en modo editable, lo cual es conveniente cuando planeas
personalizar transformadores o agregar plantillas país sin reinstalar.

---

## Opción C: Docker

Docker es la ruta más reproducible. El `Dockerfile` oficial usa un build
multi-etapa:

1. **Etapa 1 (`build`)** — crea el entorno conda desde
   `environment_docker.yaml` usando `continuumio/miniconda3`, luego lo empaca
   con `conda-pack`.
2. **Etapa 2 (`final`)** — copia el entorno empacado a una imagen base
   `julia:1.11.5-bullseye`, instala `juliacall`, `juliapkg` y SISEPUEDE vía
   pip, y luego dispara una importación de calentamiento para precompilar las
   dependencias de Julia.

### Construir la imagen

```bash
docker build -t sisepuede:latest .
```

El build calienta el registro de paquetes de Julia y el solver NemoMod durante
el paso final `RUN python -c "import sisepuede..."`, por lo que el primer
build toma 10–20 minutos. Las capas subsecuentes se cachean.

### Correr una sesión interactiva

```bash
docker run -it --rm \
  -v "$(pwd)/data":/sisepuede/data \
  sisepuede:latest
```

El entrypoint es `/bin/bash`. Monta tu directorio de datos país bajo
`/sisepuede/data` para que el contenedor pueda leer plantillas de entrada y
escribir salidas.

---

## Primera corrida

Una vez que el entorno esté activo (cualquier ruta), verifica la instalación
con una secuencia mínima de importación. El código a continuación está tomado
de la API pública real expuesta por `sisepuede/__init__.py` y la clase
`SISEPUEDEFileStructure`.

```python
# Confirmar que el paquete Python es importable
import sisepuede

# Importar las dos clases de punto de entrada
from sisepuede.manager.sisepuede import SISEPUEDE
import sisepuede.manager.sisepuede_file_structure as sfs

# Instanciar la estructura de archivos (lee tablas de atributos y verifica rutas)
file_struct = sfs.SISEPUEDEFileStructure()

# Inspeccionar el objeto model attributes que comparten todos los modelos sectoriales
model_attributes = file_struct.model_attributes
print(model_attributes)
```

Si esto corre sin error tienes una instalación funcional. El constructor de
`SISEPUEDEFileStructure` emitirá líneas de log a nivel INFO listando las
tablas de atributos que cargó — eso es esperado.

Para una corrida completa de extremo a extremo contra datos demo, continúa al
**Tutorial T1** (ver la sección Tutoriales en la barra lateral). Correr el
modelo completo requiere plantillas de entrada país y un directorio de salida
configurado, lo cual se cubre allá.

---

## Solución de problemas

### Julia no se encuentra o conflicto de JuliaPkg

**Síntoma:** `ImportError` o `juliacall` lanza `JuliaError: could not find
Julia` al importar.

**Causa:** `juliapkg` descarga Julia en la primera importación pero necesita
un directorio de cache con permisos de escritura y acceso a internet. Dentro
de un entorno restringido la descarga puede ser bloqueada, o un depot
`.julia` obsoleto de una versión diferente de Julia puede entrar en conflicto.

**Solución:**
1. Establece `JULIA_DEPOT_PATH` a un directorio con permisos de escritura
   antes de lanzar Python:
   ```bash
   export JULIA_DEPOT_PATH=/tmp/julia_depot
   python your_script.py
   ```
2. Verifica que `juliapkg==0.1.17` y `juliacall==0.9.25` estén instalados —
   ninguna otra versión es compatible con los paquetes de Julia fijados en
   `sisepuede/julia/Project.toml` (`PythonCall = "=0.9.25"`).

### Error de permisos de SQLite al correr el despacho energético

**Síntoma:** `OperationalError: unable to open database file` durante
`EnergyProduction.project()`.

**Causa:** NemoMod transfiere datos de LP a Julia a través de un archivo
SQLite temporal. Si el directorio para ese archivo no tiene permisos de
escritura (común en montajes de contenedor de solo lectura o sistemas de
archivos en red), el handshake falla.

**Solución:** Apunta `fp_nemomod_temp_sqlite_db` a una ruta local con
permisos de escritura, por ejemplo `/tmp`, al construir `SISEPUEDEModels`:

```python
import sisepuede.manager.sisepuede_models as sm

models = sm.SISEPUEDEModels(
    model_attributes,
    allow_electricity_run=True,
    fp_julia=file_struct.dir_jl,
    fp_nemomod_reference_files=file_struct.dir_ref_nemo,
    fp_nemomod_temp_sqlite_db="/tmp/nemomod_intermediate.sqlite",
)
```

### Conflictos de versión de dependencias en `pip install`

**Síntoma:** el resolver de pip se rehúsa a instalar porque un paquete
preexistente en tu entorno entra en conflicto con uno de los pines estrictos.

**Causa:** SISEPUEDE fija versiones exactas para reproducibilidad numérica y
compatibilidad del puente Julia–Python. Estos pines entrarán en conflicto con
muchos entornos de propósito general.

**Solución:** Siempre instala SISEPUEDE en un entorno dedicado (entorno
virtual o entorno conda) — nunca en tu Python del sistema o en un kernel de
notebook compartido. Usa la Opción B (conda) o la Opción C (Docker) si
necesitas el máximo aislamiento.

---

## Recapitulación

- SISEPUEDE requiere Python **3.11.x** exactamente y Julia **1.11.5** para
  el despacho eléctrico.
- Tres rutas de instalación están disponibles: pip desde GitHub, conda desde
  `environment.yaml`, y Docker para máxima reproducibilidad.
- La imagen de Docker pre-calienta la compilación de Julia durante el paso de
  build, haciendo que el arranque del contenedor sea rápido a costa de un
  build inicial más largo.
- Una instalación exitosa se confirma importando `SISEPUEDEFileStructure`
  e imprimiendo `model_attributes` sin errores.
- Los tres problemas más comunes son un runtime de Julia faltante o
  desajustado, una ruta temporal de SQLite sin permisos de escritura, y
  conflictos de versión en un entorno compartido.

---

<Quiz
  questions={[
    {
      question: "¿Qué versión de Python fija exactamente el pyproject.toml de SISEPUEDE?",
      options: ["3.9", "3.10", "3.11", "3.12"],
      answer: 2,
      explanation:
        "pyproject.toml declara `requires-python = \"== 3.11.*\"`. Otros releases de Python 3.x no están soportados.",
    },
    {
      question: "¿Cuál es el propósito de `environment_docker.yaml` comparado con `environment.yaml`?",
      options: [
        "Agrega paquetes geoespaciales adicionales para usuarios de Docker.",
        "Omite juliacall y juliapkg para que el Dockerfile pueda instalarlos vía pip después de que la imagen base de Julia esté en su lugar.",
        "Fija restricciones de versión más laxas para permitir mayor compatibilidad dentro de contenedores.",
        "Es idéntico a environment.yaml — los dos archivos son intercambiables.",
      ],
      answer: 1,
      explanation:
        "El Dockerfile usa un build de dos etapas: la Etapa 1 crea el entorno conda desde environment_docker.yaml (sin juliacall/juliapkg), y la Etapa 2 lo copia a una imagen de Julia y luego instala juliacall y juliapkg vía pip. Esto separa la instalación de Julia de conda.",
    },
    {
      question: "¿Por qué el paso de build de Docker corre `python -c \"import sisepuede.manager...\"` al final?",
      options: [
        "Para correr una prueba de humo que imprima información de versión al log de build.",
        "Para precompilar paquetes de Julia y calentar el solver NemoMod para que el arranque del contenedor sea rápido.",
        "Para generar el esquema por defecto de la base de datos de salida.",
        "Para descargar plantillas de entrada país desde el servidor de datos de SISEPUEDE.",
      ],
      answer: 1,
      explanation:
        "La secuencia de importación en el Dockerfile instancia SISEPUEDEFileStructure y SISEPUEDEModels con allow_electricity_run=True. Esto dispara que JuliaPkg instale y precompile todas las dependencias de Julia (NemoMod, JuMP, HiGHS, etc.) en tiempo de build, para que las corridas subsecuentes del contenedor omitan ese paso.",
    },
  ]}
/>
