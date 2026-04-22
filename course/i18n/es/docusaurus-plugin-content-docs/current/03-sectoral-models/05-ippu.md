---
title: IPPU — Procesos Industriales y Uso de Productos
sidebar_position: 5
---

<SectorCard sector="ippu" />

# IPPU: Procesos Industriales y Uso de Productos

El sector IPPU cubre todo lo que sale de la chimenea de una fábrica o del venteo de un refrigerador que **no** es resultado de quemar combustible para energía. La química de hacer clinker libera CO₂ de la piedra caliza sin importar si el horno se calienta con carbón o con hidrógeno; un aire acondicionado fuga HFC-134a independientemente de cómo se haya generado la electricidad que opera el compresor. SISEPUEDE contabiliza estas emisiones de *proceso* y de *uso de producto* en `IPPU` (`sisepuede/models/ippu.py`), manteniéndolas rígidamente desacopladas de la contabilidad de combustión que vive en `EnergyConsumption.INEN`.

Esta separación concuerda con las **Directrices IPCC 2006, Volumen 3**, y es el punto conceptual más importante del sector: cuando una acería quema gas natural para calentar un alto horno, el CO₂ del gas es una emisión de **Energy/INEN**; el CO₂ liberado cuando la piedra caliza fundente se descompone dentro de ese mismo horno es una emisión de **IPPU**. Asignar mal entre los dos es un error clásico de inventario, y el esquema de SISEPUEDE está construido específicamente para prevenirlo.

---

## Qué cubre IPPU

El sector abarca la lista completa de productos del Volumen 3 del IPCC, mapeada a categorías bajo `$CAT-INDUSTRY$`:

| Grupo | Categorías | Gas dominante |
|---|---|---|
| **Productos minerales** | Cemento, clinker, cal, vidrio, cerámica | CO₂ (calcinación) |
| **Industria química** | Amoniaco, ácido nítrico, ácido adípico, metanol, caprolactama, carburo, carbonato de sodio | CO₂, N₂O |
| **Industria metalúrgica** | Hierro y acero, aluminio, ferroaleaciones, magnesio, plomo, zinc | CO₂, PFC (fundición Al), SF₆ (Mg) |
| **Productos no energéticos de combustibles** | Lubricantes, ceras de parafina, solventes, asfalto | CO₂ |
| **Electrónica** | Semiconductores, TFT-FPD, fotovoltaicos | NF₃, SF₆, c-C₄F₈, HFC-23 |
| **Uso de productos con gases F** | Refrigeración y AC, soplado de espumas, extinción de incendios, aerosoles, solventes | HFC, PFC, SF₆ |

El cemento recibe un manejo especial: el clinker se modela por separado del cemento para que la **fracción de clinker** (`modvar_ippu_clinker_fraction_cement`) y las **importaciones netas de clinker** (`modvar_ippu_net_imports_clinker`) puedan variar independientemente. Esto importa enormemente para el análisis de mitigación — la sustitución de clinker (cenizas volantes, escoria, arcilla calcinada) es una de las pocas palancas de cemento de bajo costo a corto plazo, y el modelo debe poder representarla sin tocar la demanda aguas abajo de concreto.

---

## Contabilidad impulsada por producción

Cada emisión IPPU en SISEPUEDE sigue la misma estructura Tier-1/Tier-2:

```
emissions[gas, category, t] = production[category, t] × EF[gas, category]
```

Las dos familias de factores están definidas en `_initialize_fc_emission_factor_modvars()`:

- **Factores por tonelada de producción** (`modvar_ippu_ef_<gas>_per_prod_process`) — usados para CO₂ de cemento, CO₂ de amoniaco, N₂O de ácido nítrico, N₂O de ácido adípico, PFC de aluminio, SF₆ de magnesio, NF₃ de semiconductores y subproducto HFC-23 de la manufactura de HCFC-22
- **Factores por PIB** (`modvar_ippu_ef_<gas>_per_gdp_produse`) — usados para emisiones difusas de uso de producto donde la actividad escala con la actividad económica en lugar de una sola línea de producción: HFC-134a de MAC y refrigeración doméstica, HFC-125 / HFC-143a de mezclas refrigerantes comerciales, HCFC-141b/142b de espumas, SF₆ de switchgear eléctrico

La lista completa de gases F en `ippu.py` cubre HFC-23, -32, -41, -125, -134, -134a, -143, -143a, -152a, -227ea, -236fa, -245fa, -365mfc, -43-10mee, más PFC-14 (CF₄), PFC-116 (C₂F₆), c-C₄F₈ (octafluorooxolano), C₅F₁₂ (dodecafluoropentano), SF₆ y NF₃. Cada uno lleva su propio GWP100 del AR6 WG1 Capítulo 7, que es de donde viene la importancia desmedida de IPPU: el HFC-23 tiene un GWP de 12,400, el SF₆ es 24,300, el NF₃ es 17,400. Unos pocos cientos de toneladas de HFC-23 venteadas de una planta de HCFC-22 pueden superar el inventario de CO₂ entero de un país mediano una vez que se multiplica.

---

## La producción industrial como driver de actividad

Las trayectorias de producción se proyectan en `project_industrial_production()` (línea 750) y son impulsadas por elasticidad mediante:

- **Producción inicial** (`modvar_ippu_prod_qty_init`) — la salida del año base por categoría en unidades físicas (Mt cemento, Mt acero, kt amoniaco, etc.)
- **Elasticidad al PIB** (`modvar_ippu_elast_ind_prod_to_gdp`) — aplicada a `vec_rates_gdp` de la proyección Socioeconómica
- **Elasticidad al PIB per cápita** (`modvar_ippu_elast_produserate_to_gdppc`) — para tasas de uso de producto, ya que la propiedad per cápita de refrigerantes se satura con el ingreso
- **Escalar de producción** (`modvar_ippu_scalar_production`) — la palanca que los transformers usan para empujar la producción hacia arriba o abajo sin tocar las elasticidades
- **Cambio en importaciones netas** (`modvar_ippu_change_net_imports`) — separa las trayectorias de *consumo* (impulsadas por demanda) de las trayectorias de *producción* (que son las que realmente emiten)

El resultado, `array_ippu_production`, es la tabla de producción física por categoría contra la cual el resto de `project()` multiplica los factores.

---

## El handshake de reciclaje con CircularEconomy

Recuerde del Módulo 9 que `SISEPUEDEModels` corre `CircularEconomy` *antes* de `IPPU` por una razón: la producción industrial virgen debe reducirse por la fracción de la demanda que esté siendo satisfecha con materia prima reciclada. Esto se implementa en `get_production_with_recycling_adjustment()` (línea 916).

El flujo:

1. `CircularEconomy.WASO` produce `modvar_ippu_qty_recycled_used_in_production` para papel, vidrio, metal ferroso, metal no ferroso y plásticos
2. `IPPU` lee esa variable y la resta de la demanda bruta, **acotada** por `modvar_ippu_max_recycled_material_ratio` (no se puede hacer acero 100% reciclado solo de chatarra secundaria — aplican límites de calidad física)
3. La producción residual *virgen* lleva el factor de proceso por tonelada; la fracción reciclada no

Por eso las estrategias de mitigación que impulsan la recuperación de residuos en `CircularEconomy` aparecen como reducciones de emisiones en `IPPU` aun cuando ninguna variable de IPPU fue modificada directamente — la conexión es estructural, no paramétrica.

Existe un handshake simétrico para **productos de madera cosechada** (`modvar_ippu_demand_for_harvested_wood`, `modvar_ippu_ratio_of_production_to_harvested_wood`), que conecta la demanda de productos de papel/madera de IPPU con la contabilidad de cosecha forestal de AFOLU.

---

## CCS a nivel de proceso

El CCS se modela dentro de IPPU por separado de la captura del lado energético porque los flujos de CO₂ de proceso (gas de combustión del horno de cemento, síntesis de amoniaco, óxido de etileno) tienen concentraciones y economía distintas a la captura post-combustión en una planta eléctrica:

- `modvar_ippu_capture_prevalence_co2` — fracción de instalaciones equipadas con CCS
- `modvar_ippu_capture_efficacy_co2` — tasa de captura de instalaciones equipadas (típicamente 0.85–0.95)
- Salida: `modvar_ippu_gas_captured_co2` — lo que se remueve del balance atmosférico

El CO₂ capturado se reporta en su propia variable para que los analistas puedan auditar los flujos de almacenamiento por separado de las emisiones brutas.

---

## Otra contabilidad residente en IPPU

Algunas variables viven en IPPU porque comparten los mismos drivers de actividad, aunque técnicamente pertenezcan a otros capítulos del inventario:

- **Coeficientes de aguas residuales** — `modvar_ippu_wwf_cod` y `modvar_ippu_wwf_vol` definen la carga de DQO y el volumen por tonelada de producción industrial, consumidos por `CircularEconomy.TRWW` para N₂O/CH₄ de aguas residuales industriales
- **Uso no energético de combustibles** — `modvar_ippu_useinit_nonenergy_fuel` rastrea lubricantes, ceras de parafina y asfalto que se venden como combustibles pero nunca se combustionan; su carbono termina en IPPU en lugar de Energy
- **Materiales de construcción residencial** — `project_hh_construction()` (línea 693) usa `modvar_ippu_average_construction_materials_required_per_household` y `modvar_ippu_average_lifespan_housing` para impulsar la demanda de cemento y acero desde la rotación del stock de vivienda

---

## Mapa de métodos

| Método | Línea | Rol |
|---|---|---|
| `project()` | 1238 | Orquestador de alto nivel |
| `project_industrial_production()` | 750 | Producción por categoría elástica al PIB |
| `get_production_with_recycling_adjustment()` | 916 | Resta el material reciclado suministrado por WASO de la demanda virgen |
| `project_hh_construction()` | 693 | Demanda de cemento y acero impulsada por el stock de vivienda |

`project()` devuelve un DataFrame en formato ancho referenciado por `(region, time_period)` con una columna por flujo de emisiones `(gas × categoría)`, más los diagnósticos de CO₂ capturado y de producción física.

---

<Quiz>
  <Question prompt="Una acería quema coque en un alto horno. El CO₂ liberado por la oxidación del coque (el combustible) y el CO₂ liberado por la reducción del mineral de hierro con ese coque (el proceso) aparecen respectivamente en cuáles sectores de SISEPUEDE?">
    <Choice>Ambos en IPPU.</Choice>
    <Choice>Ambos en Energy/INEN.</Choice>
    <Choice correct>Energy/INEN para el CO₂ de oxidación del combustible; IPPU para el CO₂ de proceso de reducción del mineral.</Choice>
    <Choice>Ambos en AFOLU porque el coque proviene del carbón.</Choice>
  </Question>
  <Question prompt="¿Por qué SISEPUEDE almacena HFC-134a, HFC-23, SF₆ y NF₃ como variables separadas en lugar de pre-agregarlas a CO₂e dentro de IPPU?">
    <Choice>Compatibilidad hacia atrás con una versión antigua del modelo.</Choice>
    <Choice correct>Cada gas tiene su propio GWP100 del AR6 y su propia palanca de mitigación; la agregación borraría la señal de política necesaria para el diseño de transformers y el análisis del Protocolo de Montreal/Enmienda de Kigali.</Choice>
    <Choice>Las Directrices IPCC 2006 prohíben la agregación a nivel sectorial.</Choice>
    <Choice>Porque los valores de GWP cambian cada año.</Choice>
  </Question>
  <Question prompt="En `get_production_with_recycling_adjustment()`, ¿qué hace cumplir que la producción virgen no pueda eliminarse por completo aun cuando WASO suministra grandes cantidades de materia prima reciclada?">
    <Choice>Un piso del 50% hardcodeado en el código fuente.</Choice>
    <Choice correct>La variable de entrada `modvar_ippu_max_recycled_material_ratio`, que acota la fracción reciclada por categoría para reflejar las restricciones físicas y de calidad sobre los materiales secundarios.</Choice>
    <Choice>La elasticidad al PIB Socioeconómico anula el ajuste de reciclaje.</Choice>
    <Choice>Nada — a tasas altas de reciclaje la producción virgen de IPPU puede ir a cero.</Choice>
  </Question>
</Quiz>
</content>
</invoke>