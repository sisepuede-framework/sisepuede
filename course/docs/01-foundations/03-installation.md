---
id: installation
title: "Installation & First Steps"
sidebar_position: 3
---

SISEPUEDE runs on Python 3.11 and depends on a Julia back-end for electricity
dispatch optimization (NemoMod). Before you model a single tonne of CO₂e, you
need both runtimes in place. This module walks through **three installation
paths** — pip, conda, and Docker — and shows you what a successful first import
looks like.

---

## Learning objectives

By the end of this module you will be able to:

- Identify which Python and Julia versions SISEPUEDE requires.
- Set up a working environment using whichever of the three installation paths
  fits your workflow.
- Confirm the installation by importing the `SISEPUEDE` class and instantiating
  the file structure object.
- Diagnose three common environment problems: a missing Julia runtime, an
  SQLite permission error, and a JuliaPkg conflict.

---

## Requirements

| Component | Required version |
|-----------|-----------------|
| Python | **3.11.x** (pinned exactly — see `pyproject.toml`) |
| Julia | **1.11.5** (used in the official Docker image) |
| OS | Linux (recommended), macOS, Windows with WSL2 |

Key Python dependencies (from `requirements.txt`):

| Package | Version |
|---------|---------|
| `pandas` | 2.2.3 |
| `numpy` | 2.2.2 |
| `juliacall` | 0.9.25 |
| `juliapkg` | 0.1.17 |
| `SQLAlchemy` | 2.0.37 |
| `geopandas` | 1.0.1 |
| `pyDOE2` | 1.3.0 |
| `qpsolvers` | 4.4.0 |

All version pins are strict. Mixing versions — even patch releases — can break
the Julia–Python bridge or the LP solver interface.

---

## Option A: pip install

SISEPUEDE is installable directly from GitHub. The canonical command taken from
the Dockerfile is:

```bash
pip install git+https://github.com/jcsyme/sisepuede.git@bf4f954ef6747d8d1adac257e6b2395b42ba5fa0
```

That SHA pin points to a verified release commit. If you want to track a named
branch or tag, see the [reference docs](https://sisepuede.readthedocs.io/) for
currently supported release identifiers.

Before running `pip install` it is strongly recommended to create a dedicated
virtual environment with Python 3.11 exactly:

```bash
python3.11 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
```

After the package installs, add the Julia bridge:

```bash
pip install juliacall==0.9.25 juliapkg==0.1.17
```

`juliapkg` will download and configure the Julia runtime automatically on first
use if Julia is not already on your `PATH`.

---

## Option B: conda

The repository ships two conda environment files. Use `environment.yaml` for
local workstation installs (it includes `juliacall` and `juliapkg` as conda
packages); use `environment_docker.yaml` only inside the Docker build chain
(it omits those packages, which the Dockerfile installs via pip).

```bash
# Clone the repository
git clone https://github.com/jcsyme/sisepuede.git
cd sisepuede

# Create and activate the environment
conda env create -f environment.yaml
conda activate sisepuede
```

The environment is named `sisepuede` as declared in `environment.yaml`. All
packages are pulled from the `conda-forge` channel. Python 3.11 is pinned
exactly; several other packages (e.g. `pandas`, `numpy`, `geopandas`) accept
compatible minimum versions.

After the environment is active, install the package itself:

```bash
pip install -e .
```

The `-e` flag installs in editable mode, which is convenient when you plan to
customize transformers or add country templates without reinstalling.

---

## Option C: Docker

Docker is the most reproducible path. The official `Dockerfile` uses a
multi-stage build:

1. **Stage 1 (`build`)** — creates the conda environment from
   `environment_docker.yaml` using `continuumio/miniconda3`, then packs it
   with `conda-pack`.
2. **Stage 2 (`final`)** — copies the packed environment into a
   `julia:1.11.5-bullseye` base image, installs `juliacall`, `juliapkg`, and
   SISEPUEDE via pip, then triggers a warm-up import to pre-compile Julia
   dependencies.

### Build the image

```bash
docker build -t sisepuede:latest .
```

The build warms up the Julia package registry and NemoMod solver during the
final `RUN python -c "import sisepuede..."` step, so the first build takes
10–20 minutes. Subsequent layers are cached.

### Run an interactive session

```bash
docker run -it --rm \
  -v "$(pwd)/data":/sisepuede/data \
  sisepuede:latest
```

The entrypoint is `/bin/bash`. Mount your country data directory under
`/sisepuede/data` so the container can read input templates and write outputs.

---

## First run

Once the environment is active (any path), verify the installation with a
minimal import sequence. The code below is drawn from the actual public API
exposed by `sisepuede/__init__.py` and the `SISEPUEDEFileStructure` class.

```python
# Confirm the Python package is importable
import sisepuede

# Import the two entry-point classes
from sisepuede.manager.sisepuede import SISEPUEDE
import sisepuede.manager.sisepuede_file_structure as sfs

# Instantiate the file structure (reads attribute tables and verifies paths)
file_struct = sfs.SISEPUEDEFileStructure()

# Inspect the model attributes object that all sectoral models share
model_attributes = file_struct.model_attributes
print(model_attributes)
```

If this runs without error you have a functional installation. The
`SISEPUEDEFileStructure` constructor will emit INFO-level log lines listing
the attribute tables it loaded — that is expected.

For a full end-to-end run against demo data, continue to **Tutorial T1**
(see the Tutorials section in the sidebar). Running the full model requires
country input templates and a configured output directory, which are covered
there.

---

## Troubleshooting

### Julia not found or JuliaPkg conflict

**Symptom:** `ImportError` or `juliacall` raises `JuliaError: could not find
Julia` on import.

**Cause:** `juliapkg` downloads Julia at first import but needs a writable
cache directory and internet access. Inside a locked-down environment the
download may be blocked, or a stale `.julia` depot from a different Julia
version may conflict.

**Fix:**
1. Set `JULIA_DEPOT_PATH` to a writable directory before launching Python:
   ```bash
   export JULIA_DEPOT_PATH=/tmp/julia_depot
   python your_script.py
   ```
2. Verify that `juliapkg==0.1.17` and `juliacall==0.9.25` are installed — no
   other versions are compatible with the Julia packages pinned in
   `sisepuede/julia/Project.toml` (`PythonCall = "=0.9.25"`).

### SQLite permission error when running energy dispatch

**Symptom:** `OperationalError: unable to open database file` during
`EnergyProduction.project()`.

**Cause:** NemoMod hands off LP data to Julia through a temporary SQLite file.
If the directory for that file is not writable (common in read-only container
mounts or networked filesystems), the handshake fails.

**Fix:** Point `fp_nemomod_temp_sqlite_db` to a local writable path, for
example `/tmp`, when constructing `SISEPUEDEModels`:

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

### Dependency version conflicts at `pip install`

**Symptom:** pip resolver refuses to install because a pre-existing package in
your environment conflicts with one of the strict pins.

**Cause:** SISEPUEDE pins exact versions for numerical reproducibility and
Julia–Python bridge compatibility. These pins will conflict with many
general-purpose environments.

**Fix:** Always install SISEPUEDE in a dedicated environment (virtual env or
conda env) — never into your system Python or a shared notebook kernel. Use
Option B (conda) or Option C (Docker) if you need the most isolation.

---

## Recap

- SISEPUEDE requires Python **3.11.x** exactly and Julia **1.11.5** for
  electricity dispatch.
- Three installation paths are available: pip from GitHub, conda from
  `environment.yaml`, and Docker for maximum reproducibility.
- The Docker image pre-warms Julia compilation during the build step, making
  container start-up fast at the cost of a longer initial build.
- A successful installation is confirmed by importing `SISEPUEDEFileStructure`
  and printing `model_attributes` without errors.
- The three most common issues are a missing/mismatched Julia runtime, an
  unwritable SQLite temp path, and version conflicts in a shared environment.

---

<Quiz
  questions={[
    {
      question: "Which Python version does SISEPUEDE's pyproject.toml pin exactly?",
      options: ["3.9", "3.10", "3.11", "3.12"],
      answer: 2,
      explanation:
        "pyproject.toml declares `requires-python = \"== 3.11.*\"`. Other Python 3.x releases are not supported.",
    },
    {
      question: "What is the purpose of `environment_docker.yaml` compared to `environment.yaml`?",
      options: [
        "It adds extra geospatial packages for Docker users.",
        "It omits juliacall and juliapkg so the Dockerfile can install them via pip after the Julia base image is in place.",
        "It pins looser version constraints to allow broader compatibility inside containers.",
        "It is identical to environment.yaml — the two files are interchangeable.",
      ],
      answer: 1,
      explanation:
        "The Dockerfile uses a two-stage build: Stage 1 creates the conda environment from environment_docker.yaml (no juliacall/juliapkg), and Stage 2 copies it into a Julia image and then installs juliacall and juliapkg via pip. This separates Julia installation from conda.",
    },
    {
      question: "Why does the Docker build step run `python -c \"import sisepuede.manager...\"` at the end?",
      options: [
        "To run a smoke test that prints version info to the build log.",
        "To pre-compile Julia packages and warm up the NemoMod solver so container start-up is fast.",
        "To generate the default output database schema.",
        "To download country input templates from the SISEPUEDE data server.",
      ],
      answer: 1,
      explanation:
        "The import sequence in the Dockerfile instantiates SISEPUEDEFileStructure and SISEPUEDEModels with allow_electricity_run=True. This triggers JuliaPkg to install and precompile all Julia dependencies (NemoMod, JuMP, HiGHS, etc.) at build time, so subsequent container runs skip that step.",
    },
  ]}
/>
