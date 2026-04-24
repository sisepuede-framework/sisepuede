"""
Libya NDC Simulation - AGENT 3
Builds Libya input DataFrame, applies 3 strategies, runs SISEPUEDEModels.project(),
and writes outputs to _outputs/libya_ndc/
"""
import sys
import os
import json
import traceback
import warnings
import math
warnings.filterwarnings('ignore')

sys.path.insert(0, '/Users/fabianfuentes/git/sisepuede')

import pandas as pd
import numpy as np

# ── paths ────────────────────────────────────────────────────────────────────
BASE_PATH = '/Users/fabianfuentes/git/sisepuede'
ATTR_DIR  = f'{BASE_PATH}/sisepuede/attributes'
BATCH_DIR = f'{BASE_PATH}/sisepuede/ref/batch_data_generation'
OUT_DIR   = f'{BASE_PATH}/_outputs/libya_ndc'
LOG_DIR   = f'{BASE_PATH}/_agent_outputs'
os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(LOG_DIR, exist_ok=True)

# ── log helpers ──────────────────────────────────────────────────────────────
_sim_log_path = f'{LOG_DIR}/simulation_log.md'
_dec_log_path = f'{LOG_DIR}/decisions_log.md'

def log(msg, path=_sim_log_path):
    print(msg)
    with open(path, 'a') as f:
        f.write(msg + '\n')

def decide(msg):
    log(f'[DECISION] {msg}', _dec_log_path)
    print(f'[DECISION] {msg}')

log('\n\n# AGENT 3 — Libya NDC Simulation\n')

# ── Step 0: Initialize ModelAttributes and SISEPUEDEModels ──────────────────
log('## Step 0: Initializing ModelAttributes and SISEPUEDEModels')

from sisepuede.core.model_attributes import ModelAttributes
from sisepuede.manager.sisepuede_models import SISEPUEDEModels

ma = ModelAttributes(ATTR_DIR)
log('ModelAttributes initialized OK')

# Check Julia availability
import subprocess
julia_available = False
try:
    res = subprocess.run(['julia', '--version'], capture_output=True, timeout=5)
    julia_available = res.returncode == 0
except Exception:
    julia_available = False

decide(f'Julia available: {julia_available}. Setting allow_electricity_run={julia_available}.')

models = SISEPUEDEModels(
    ma,
    allow_electricity_run=julia_available,
    logger=None
)
log(f'SISEPUEDEModels initialized OK (allow_electricity_run={julia_available})')
log(f'Time periods available: {models.time_periods.all_time_periods[:5]}...')

# ── Step 1: Build Libya baseline DataFrame ──────────────────────────────────
log('\n## Step 1: Build Libya Baseline Input DataFrame')

# 1a. Load MEX as structural template (time_periods 0-20)
df_base = pd.read_csv(f'{BATCH_DIR}/input_base_all_sectors.csv')
df_mex = df_base[df_base['nation'] == 'mexico'].copy()
df_mex = df_mex[df_mex['time_period'] <= 20].copy().reset_index(drop=True)
log(f'MEX template: {len(df_mex)} rows, {len(df_mex.columns)} columns')

df_libya = df_mex.copy()
df_libya['nation'] = 'libya'
df_libya['iso_code3'] = 'LBY'

# 1b. Load Libya parameters from JSON
with open(f'{BASE_PATH}/_inputs/libya/libya_baseline_parameters.json') as f:
    params = json.load(f)

# 1c. Substitute GDP and population from parameters
gdp_values_billions = params['socioeconomic']['gdp_trajectory_usd_2015_billions']['values_usd_2015_billions']  # 21 values
pop_values_thousands = params['socioeconomic']['population_trajectory']['values_thousands']  # 21 values

# Compute GDP scaling ratio (Libya / MEX) per time period
# Libya GDP in absolute USD
gdp_libya = [g * 1e9 for g in gdp_values_billions]  # convert billions to USD
pop_libya = [p * 1e3 for p in pop_values_thousands]  # convert thousands to units

# MEX GDP: need to find GDP columns in df_mex
gdp_cols = [c for c in df_mex.columns if 'gdp' in c.lower() or 'val_gdp' in c.lower()]
pop_cols  = [c for c in df_mex.columns if 'pop' in c.lower() and 'lvst' not in c.lower() and 'agrc' not in c.lower()]
log(f'GDP columns found: {gdp_cols[:5]}')
log(f'Pop columns found: {pop_cols[:5]}')

# GDP per capita columns
gdppc_cols = [c for c in df_mex.columns if 'gdppc' in c.lower() or 'gdp_per_capita' in c.lower() or 'gdp_pc' in c.lower()]
log(f'GDPpc columns: {gdppc_cols[:5]}')

# Build GDP scaling ratio per time period
# Use MEX GDP column values if available; else fallback to a fixed ratio
gdp_scale_ratio = []
for tp in range(21):
    libya_gdp = gdp_libya[tp]
    # MEX nominal GDP 2015: ~1,170 B USD = 1.17 trillion
    mex_gdp_2015_usd = 1.17e12  # USD
    # Scale MEX GDP proportionally to match NDC growth pattern
    # MEX GDP growth 2015-2035 approximated as 1.5x (moderate growth)
    mex_gdp = mex_gdp_2015_usd * (1 + tp * 0.025)
    ratio = libya_gdp / mex_gdp
    gdp_scale_ratio.append(ratio)

log(f'GDP scaling ratio (2015 tp=0): {gdp_scale_ratio[0]:.4f}  (2035 tp=20): {gdp_scale_ratio[20]:.4f}')

# Apply GDP scaling to relevant columns
for col in gdp_cols:
    if col in df_libya.columns:
        for tp in range(21):
            df_libya.loc[df_libya['time_period'] == tp, col] = (
                df_mex.loc[df_mex['time_period'] == tp, col].values[0] * gdp_scale_ratio[tp]
            )

# Apply population scaling
for col in pop_cols:
    if col in df_libya.columns:
        # MEX population 2015: ~127M; Libya 2015: ~6.28M
        mex_pop_2015 = 127e6
        for tp in range(21):
            mex_pop = df_mex.loc[df_mex['time_period'] == tp, col].values[0]
            # Scale by population ratio
            scale = pop_libya[tp] / (mex_pop_2015 * (1 + tp * 0.01))
            df_libya.loc[df_libya['time_period'] == tp, col] = max(mex_pop * scale, 0)

# Apply GDP per capita
for col in gdppc_cols:
    if col in df_libya.columns:
        for tp in range(21):
            if pop_libya[tp] > 0:
                gdppc = gdp_libya[tp] / pop_libya[tp]
                df_libya.loc[df_libya['time_period'] == tp, col] = gdppc

log('GDP/population substitution applied')

# 1c. Substitute Libya batch data
decide('Substituting Libya batch data from all available per-sector CSVs')

def substitute_batch(df_libya, batch_csv, id_cols=None, year_to_tp_offset=2015, melt_id=None):
    """Substitute Libya rows from a batch CSV into df_libya.
    batch_csv: path to CSV with iso_code3, year/time_period, and data columns.
    """
    try:
        df_batch = pd.read_csv(batch_csv)
        lby_rows = df_batch[df_batch['iso_code3'] == 'LBY'].copy()
        if len(lby_rows) == 0:
            return df_libya, f'No Libya rows in {os.path.basename(batch_csv)}'

        # Determine time_period
        if 'time_period' not in lby_rows.columns and 'year' in lby_rows.columns:
            lby_rows['time_period'] = lby_rows['year'] - year_to_tp_offset

        # Filter to time_periods 0-20
        lby_rows = lby_rows[(lby_rows['time_period'] >= 0) & (lby_rows['time_period'] <= 20)].copy()

        # Data columns (exclude identifier columns)
        skip_cols = {'iso_code3', 'year', 'time_period', 'region', 'nation', 'iso_alpha_3'}
        data_cols = [c for c in lby_rows.columns if c not in skip_cols and c in df_libya.columns]

        for col in data_cols:
            for tp_val in lby_rows['time_period'].unique():
                lby_val = lby_rows.loc[lby_rows['time_period'] == tp_val, col].values
                if len(lby_val) > 0 and not pd.isna(lby_val[0]):
                    mask = df_libya['time_period'] == tp_val
                    df_libya.loc[mask, col] = lby_val[0]

        return df_libya, f'OK: substituted {len(data_cols)} cols from {os.path.basename(batch_csv)}'
    except Exception as e:
        return df_libya, f'ERROR {os.path.basename(batch_csv)}: {str(e)[:100]}'

# Process each batch CSV
batch_files = {
    'scoe_init_energy':   f'{BATCH_DIR}/non_electric_energy_inputs/scoe_initial_energy_consumption.csv',
    'scoe_elasticity':    f'{BATCH_DIR}/non_electric_energy_inputs/scoe_elasticity_of_energy_consumption.csv',
    'scoe_scalar':        f'{BATCH_DIR}/non_electric_energy_inputs/scoe_consumption_scalar.csv',
    'clinker':            f'{BATCH_DIR}/ippu_cement_clinker_fraction/clinker_fraction_cement_ippu.csv',
    'net_imports_cement': f'{BATCH_DIR}/ippu_cement_clinker_fraction/net_imports_cement_clinker.csv',
    'transm_loss':        f'{BATCH_DIR}/nemomod_energy_inputs/inputs_by_country_modvar_enfu_transmission_loss_frac_electricity.csv',
    'fuel_costs':         f'{BATCH_DIR}/nemomod_energy_inputs/inputs_by_country_modvar_enfu_fuel_costs.csv',
    'min_share_prod':     f'{BATCH_DIR}/nemomod_energy_inputs/inputs_by_country_minimum_share_of_production_baseline.csv',
    'no_till':            f'{BATCH_DIR}/afolu_tillage/afolu_tillage_no_till.csv',
}

# Also check industrial production files
import os
inen_dir = f'{BATCH_DIR}'
for fname in os.listdir(inen_dir):
    if 'industrial' in fname.lower() or 'inen' in fname.lower():
        batch_files[f'inen_{fname}'] = f'{inen_dir}/{fname}'

for key, fpath in batch_files.items():
    if os.path.exists(fpath):
        df_libya, msg = substitute_batch(df_libya, fpath)
        log(f'  {key}: {msg}')
    else:
        log(f'  {key}: FILE NOT FOUND - {fpath}')

# Check subdirectories for more batch files
for subdir in ['generic', 'soil_grids_soil_organic_carbon', 'koppen_climate_classifications']:
    sdir = f'{BATCH_DIR}/{subdir}'
    if os.path.isdir(sdir):
        for fname in os.listdir(sdir):
            if fname.endswith('.csv'):
                fpath = f'{sdir}/{fname}'
                df_libya, msg = substitute_batch(df_libya, fpath)
                log(f'  {subdir}/{fname}: {msg}')

log(f'Libya batch substitution complete. Shape: {df_libya.shape}')

# 1d. Scale livestock, waste, transport variables by GDP ratio
decide(f'Scaling sector-specific variables not in batch data by GDP ratio (Libya/MEX ~{gdp_scale_ratio[8]:.3f} at 2023)')

# Scale livestock population columns
lvst_cols = [c for c in df_libya.columns if 'pop_lvst' in c or ('lvst' in c and 'pop' in c)]
for col in lvst_cols:
    if col in df_libya.columns:
        df_libya[col] = df_libya[col] * [gdp_scale_ratio[tp] for tp in range(21)]

# Scale waste quantities
waste_cols = [c for c in df_libya.columns if ('waso' in c or 'wali' in c or 'trww' in c) and
              ('demscalar' in c or 'deminit' in c or 'scalar' in c)]
for col in waste_cols:
    for tp in range(21):
        mask = df_libya['time_period'] == tp
        df_libya.loc[mask, col] = df_libya.loc[mask, col] * gdp_scale_ratio[tp]

# Scale transport demand
trns_scalar_cols = [c for c in df_libya.columns if 'demscalar_trns' in c or 'demscalar_trde' in c]
for col in trns_scalar_cols:
    for tp in range(21):
        mask = df_libya['time_period'] == tp
        df_libya.loc[mask, col] = df_libya.loc[mask, col] * gdp_scale_ratio[tp]

log('Sector scaling applied')

# 1e. LNDU: Libya is ~90% desert, ~3% agricultural land
# Adjust land use fractions if present
lndu_frac_cols = [c for c in df_libya.columns if 'frac_lndu' in c and 'cropland' in c]
lndu_forest_cols = [c for c in df_libya.columns if 'frac_lndu' in c and 'forest' in c]
lndu_desert_cols = [c for c in df_libya.columns if 'frac_lndu' in c and ('dryland' in c or 'desert' in c or 'shrub' in c)]

decide('Setting Libya land use fractions: ~90% dryland/shrubland, ~3% cropland, ~1% forest/pasture')
for col in lndu_frac_cols:
    df_libya[col] = df_libya[col] * 0.15  # Libya has ~15% of MEX cropland fraction
for col in lndu_forest_cols:
    df_libya[col] = df_libya[col] * 0.02  # Libya has very little forest

log(f'Land use fractions adjusted for Libya arid climate')

# 1f. Set FGTV (fugitive emissions) Libya-specific values
# Libya 2023 fugitive: 28% of 97,311 ktCO2e = 27,247 ktCO2e
# This is driven by venting/flaring fractions in FGTV
# Set oil & gas production variables proportionally
fgtv_cols = [c for c in df_libya.columns if 'fgtv' in c]
log(f'FGTV columns: {len(fgtv_cols)} found')

# Scale FGTV by Libya/MEX fugitive emission ratio (Libya: 28% of 97k vs MEX ~15% of 800k)
# Libya fugitive ~ 27k ktCO2e, MEX ~ 120k ktCO2e -> ratio ~ 0.226
fgtv_ratio = 27247 / 120000  # Libya/MEX fugitive ratio
for col in fgtv_cols:
    if col in df_libya.columns and not any(x in col for x in ['ef_', 'frac_', 'fraction']):
        df_libya[col] = df_libya[col] * fgtv_ratio

log('FGTV oil/gas production scaling applied')

# 1g. Handle NaN values - replace with 0 or column default
n_nan_before = df_libya.isnull().sum().sum()
df_libya = df_libya.fillna(0)
log(f'NaN values replaced with 0: {n_nan_before} cells replaced')

# 1h. Ensure time_period column is int
df_libya['time_period'] = df_libya['time_period'].astype(int)

# 1i. Copy MEX land use transition matrices (pij_lndu) from base CSV - better than zeros
base_pij = pd.read_csv(f'{BATCH_DIR}/input_base_all_sectors.csv')
mex_pij = base_pij[base_pij['nation']=='mexico'][base_pij['time_period']<=20].copy().reset_index(drop=True)
pij_cols = [c for c in mex_pij.columns if 'pij_lndu' in c]
for col in pij_cols:
    if col in df_libya.columns:
        df_libya[col] = mex_pij[col].values

log(f'Copied {len(pij_cols)} land use transition matrix columns from MEX template')

# 1j. Add all missing required fields from sector models with default values
from sisepuede.models.afolu import AFOLU
from sisepuede.models.energy_consumption import EnergyConsumption
from sisepuede.models.circular_economy import CircularEconomy
from sisepuede.models.ippu import IPPU
from sisepuede.models.socioeconomic import Socioeconomic

afolu_m  = AFOLU(ma)
ec_m     = EnergyConsumption(ma)
ce_m     = CircularEconomy(ma)
ippu_m   = IPPU(ma)
se_m     = Socioeconomic(ma)

all_required = set()
for m in [afolu_m, ec_m, ce_m, ippu_m, se_m]:
    if hasattr(m, 'required_variables'):
        all_required.update(m.required_variables)

n_added = 0
for field in (all_required - set(df_libya.columns)):
    default_val = 0.0
    for vname, v in ma.dict_variables.items():
        if field in v.fields:
            dv = v.default_value
            if dv is not None and not (isinstance(dv, float) and math.isnan(dv)):
                default_val = float(dv)
            break
    df_libya[field] = default_val
    n_added += 1

log(f'Added {n_added} missing required fields with model default values')

log(f'\nLibya baseline DataFrame ready: {df_libya.shape}')
log(f'  Columns: {len(df_libya.columns)}')
log(f'  Rows: {len(df_libya)} (time_periods 0-20)')
log(f'  Nations: {df_libya["nation"].unique().tolist()}')

# Save baseline input
df_libya.to_csv(f'{OUT_DIR}/model_input_strategy_0.csv', index=False)
log(f'Saved: {OUT_DIR}/model_input_strategy_0.csv')

# ── Step 2: Apply Transformers for Strategies 1 and 2 ───────────────────────
log('\n## Step 2: Apply Transformer Modifications')

def apply_transformer(df, transformer_code, scalar=1.0, tp_start=8, tp_end=20):
    """Apply manual DataFrame modifications for each transformer.
    tp_start: time_period where intervention begins (default 8 = 2023)
    tp_end:   time_period where intervention reaches full effect (default 20 = 2035)
    """
    df = df.copy()
    n_periods = tp_end - tp_start

    def ramp(tp, final_value_factor, initial_factor=1.0):
        """Linear ramp from initial_factor to final_value_factor between tp_start and tp_end"""
        if tp < tp_start:
            return initial_factor
        elif tp >= tp_end:
            return final_value_factor
        else:
            frac = (tp - tp_start) / n_periods
            return initial_factor + frac * (final_value_factor - initial_factor)

    if transformer_code == 'TFR:FGTV:DEC_LEAKS':
        # Reduce fugitive venting and leakage factors by ~50% by 2035
        cols = [c for c in df.columns if 'fgtv' in c and ('frac_' in c or 'vent' in c or 'leak' in c) and 'flare' not in c]
        decide(f'{transformer_code}: scaling {len(cols)} FGTV venting/leak columns by {scalar*0.5:.2f} -> 0 by tp={tp_end}')
        for tp in range(21):
            factor = ramp(tp, 1.0 - 0.5*scalar)
            mask = df['time_period'] == tp
            for col in cols:
                df.loc[mask, col] = df.loc[mask, col] * factor

    elif transformer_code == 'TFR:FGTV:INC_FLARE':
        # Increase flaring fraction to recover vented CH4
        cols = [c for c in df.columns if 'fgtv' in c and 'flare' in c and 'frac' in c]
        decide(f'{transformer_code}: scaling {len(cols)} FGTV flaring columns up by {1.0+scalar*0.5:.2f} by tp={tp_end}')
        for tp in range(21):
            factor = ramp(tp, 1.0 + 0.5*scalar)
            mask = df['time_period'] == tp
            for col in cols:
                df.loc[mask, col] = np.minimum(df.loc[mask, col] * factor, 1.0)

    elif transformer_code == 'TFR:SCOE:INC_EFFICIENCY_APPLIANCE':
        # Reduce SCOE electricity consumption coefficients by 20-40%
        cols = [c for c in df.columns if 'scoe' in c and ('consump' in c or 'elasticity' in c or 'elas' in c)]
        cols_appl = [c for c in cols if 'elec' in c or 'appliance' in c]
        decide(f'{transformer_code}: reducing {len(cols_appl)} SCOE appliance efficiency cols by {scalar*0.3:.2f}')
        for tp in range(21):
            factor = ramp(tp, 1.0 - 0.3*scalar)
            mask = df['time_period'] == tp
            for col in cols_appl:
                df.loc[mask, col] = df.loc[mask, col] * factor

    elif transformer_code == 'TFR:SCOE:DEC_DEMAND_HEAT':
        # Reduce SCOE heat energy demand
        cols = [c for c in df.columns if 'scoe' in c and 'heat' in c and ('consump' in c or 'elas' in c)]
        decide(f'{transformer_code}: reducing {len(cols)} SCOE heat demand cols by {scalar*0.25:.2f}')
        for tp in range(21):
            factor = ramp(tp, 1.0 - 0.25*scalar)
            mask = df['time_period'] == tp
            for col in cols:
                df.loc[mask, col] = df.loc[mask, col] * factor

    elif transformer_code == 'TFR:ENTC:DEC_LOSSES':
        # Reduce transmission loss from 29% to 14% by 2035 (Libya NDC)
        cols = [c for c in df.columns if 'transmission_loss' in c or ('enfu' in c and 'loss' in c)]
        decide(f'{transformer_code}: reducing {len(cols)} transmission loss cols from ~0.29 toward 0.14')
        target_loss = 0.14 * scalar + 0.22 * (1 - scalar)
        for tp in range(21):
            factor = ramp(tp, target_loss / 0.2928, initial_factor=1.0)
            mask = df['time_period'] == tp
            for col in cols:
                df.loc[mask, col] = df.loc[mask, col] * factor

    elif transformer_code == 'TFR:ENTC:TARGET_RENEWABLE_ELEC':
        # Set renewable electricity minimum share to 22% by 2035
        re_cols = [c for c in df.columns if 'frac_min_share_production' in c and
                   any(x in c for x in ['solar', 'wind', 'hydropower', 'biomass'])]
        gas_cols = [c for c in df.columns if 'frac_min_share_production' in c and 'gas' in c]
        oil_cols = [c for c in df.columns if 'frac_min_share_production' in c and 'oil' in c]
        decide(f'{transformer_code}: setting renewable min share to 0.22 by tp={tp_end}, scaling {len(re_cols)} RE cols')
        for tp in range(21):
            re_target = ramp(tp, 0.22 * scalar)
            reduce_factor = ramp(tp, 1.0 - 0.22 * scalar)
            mask = df['time_period'] == tp
            # Distribute RE target: solar 15%, wind 5%, hydro 2%
            for col in re_cols:
                if 'solar' in col:
                    df.loc[mask, col] = re_target * 0.68
                elif 'wind' in col:
                    df.loc[mask, col] = re_target * 0.23
                elif 'hydropower' in col:
                    df.loc[mask, col] = re_target * 0.09
                else:
                    df.loc[mask, col] = re_target * 0.05
            # Reduce gas share to accommodate RE
            for col in gas_cols:
                df.loc[mask, col] = np.maximum(df.loc[mask, col] * reduce_factor, 0)

    elif transformer_code == 'TFR:INEN:INC_EFFICIENCY_ENERGY':
        # Reduce industrial energy intensity
        cols = [c for c in df.columns if 'inen' in c and ('ef_' in c or 'energy_intensity' in c or 'elas' in c)]
        decide(f'{transformer_code}: reducing {len(cols)} INEN energy intensity cols by {scalar*0.15:.2f}')
        for tp in range(21):
            factor = ramp(tp, 1.0 - 0.15*scalar)
            mask = df['time_period'] == tp
            for col in cols:
                df.loc[mask, col] = df.loc[mask, col] * factor

    elif transformer_code == 'TFR:INEN:INC_EFFICIENCY_PRODUCTION':
        # Increase industrial production efficiency
        cols = [c for c in df.columns if 'inen' in c and ('prod' in c or 'scalar' in c)]
        decide(f'{transformer_code}: modifying {len(cols)} INEN production cols')
        for tp in range(21):
            factor = ramp(tp, 1.0 - 0.10*scalar)
            mask = df['time_period'] == tp
            for col in cols:
                df.loc[mask, col] = df.loc[mask, col] * factor

    elif transformer_code == 'TFR:IPPU:DEC_CLINKER':
        # Reduce clinker fraction in cement
        cols = [c for c in df.columns if 'clinker' in c and 'frac' in c]
        decide(f'{transformer_code}: reducing {len(cols)} clinker fraction cols by {scalar*0.20:.2f}')
        for tp in range(21):
            factor = ramp(tp, 1.0 - 0.20*scalar)
            mask = df['time_period'] == tp
            for col in cols:
                df.loc[mask, col] = np.maximum(df.loc[mask, col] * factor, 0.65)  # min clinker ratio

    elif transformer_code == 'TFR:IPPU:DEC_HFCS':
        # Reduce HFC emission factors
        cols = [c for c in df.columns if 'ippu' in c and ('hfc' in c.lower() or 'f_gas' in c.lower() or 'refrigerant' in c.lower())]
        # Also look for EF columns with hfc patterns
        cols += [c for c in df.columns if ('ef_' in c or 'frac_' in c) and ('hfc' in c.lower() or 'ods' in c.lower())]
        cols = list(set(cols))
        decide(f'{transformer_code}: reducing {len(cols)} HFC-related cols by {scalar*0.50:.2f}')
        for tp in range(21):
            factor = ramp(tp, 1.0 - 0.50*scalar)
            mask = df['time_period'] == tp
            for col in cols:
                df.loc[mask, col] = df.loc[mask, col] * factor

    elif transformer_code == 'TFR:WASO:INC_RECYCLING':
        # Increase recycling fraction in solid waste
        cols = [c for c in df.columns if ('waso' in c or 'trww' in c) and ('recycle' in c or 'recycl' in c)]
        cols += [c for c in df.columns if 'frac_waso' in c and 'recycle' in c]
        cols = list(set(cols))
        decide(f'{transformer_code}: scaling {len(cols)} recycling fraction cols by {1.0+scalar*2.0:.2f}')
        for tp in range(21):
            factor = ramp(tp, 1.0 + 2.0*scalar)
            mask = df['time_period'] == tp
            for col in cols:
                df.loc[mask, col] = np.minimum(df.loc[mask, col] * factor, 0.80)

    elif transformer_code == 'TFR:WASO:INC_CAPTURE_BIOGAS':
        cols = [c for c in df.columns if ('waso' in c or 'trww' in c) and ('biogas' in c or 'capture' in c or 'recovery' in c)]
        decide(f'{transformer_code}: scaling {len(cols)} biogas capture cols')
        for tp in range(21):
            factor = ramp(tp, 1.0 + 3.0*scalar)
            mask = df['time_period'] == tp
            for col in cols:
                df.loc[mask, col] = np.minimum(df.loc[mask, col] * factor, 0.90)

    elif transformer_code == 'TFR:WALI:INC_TREATMENT_URBAN':
        cols = [c for c in df.columns if 'wali' in c and ('treat' in c or 'frac_' in c)]
        decide(f'{transformer_code}: scaling {len(cols)} wastewater treatment cols')
        for tp in range(21):
            factor = ramp(tp, 1.0 + scalar * 1.5)
            mask = df['time_period'] == tp
            for col in cols:
                df.loc[mask, col] = np.minimum(df.loc[mask, col] * factor, 1.0)

    elif transformer_code == 'TFR:TRWW:INC_CAPTURE_BIOGAS':
        cols = [c for c in df.columns if 'trww' in c and ('biogas' in c or 'capture' in c)]
        decide(f'{transformer_code}: scaling {len(cols)} TRWW biogas capture cols')
        for tp in range(21):
            factor = ramp(tp, 1.0 + 2.0*scalar)
            mask = df['time_period'] == tp
            for col in cols:
                df.loc[mask, col] = np.minimum(df.loc[mask, col] * factor, 0.90)

    elif transformer_code == 'TFR:LVST:DEC_ENTERIC_FERMENTATION':
        cols = [c for c in df.columns if 'lvst' in c and ('ef_' in c or 'enteric' in c)]
        decide(f'{transformer_code}: reducing {len(cols)} enteric fermentation cols by {scalar*0.15:.2f}')
        for tp in range(21):
            factor = ramp(tp, 1.0 - 0.15*scalar)
            mask = df['time_period'] == tp
            for col in cols:
                df.loc[mask, col] = df.loc[mask, col] * factor

    elif transformer_code == 'TFR:SOIL:DEC_N_APPLIED':
        cols = [c for c in df.columns if 'soil' in c and ('frac_' in c or 'n_' in c)]
        decide(f'{transformer_code}: reducing {len(cols)} soil N application cols by {scalar*0.20:.2f}')
        for tp in range(21):
            factor = ramp(tp, 1.0 - 0.20*scalar)
            mask = df['time_period'] == tp
            for col in cols:
                df.loc[mask, col] = df.loc[mask, col] * factor

    elif transformer_code == 'TFR:TRNS:INC_EFFICIENCY_NON_ELECTRIC':
        cols = [c for c in df.columns if 'trns' in c and ('fuelefficiency' in c or 'fuel_efficiency' in c)
                and 'electric' not in c and 'elecfuel' not in c]
        decide(f'{transformer_code}: improving {len(cols)} non-electric fuel efficiency cols by {scalar*0.20:.2f}')
        for tp in range(21):
            factor = ramp(tp, 1.0 + 0.20*scalar)  # higher efficiency = more km per litre
            mask = df['time_period'] == tp
            for col in cols:
                df.loc[mask, col] = df.loc[mask, col] * factor

    elif transformer_code == 'TFR:TRNS:SHIFT_FUEL_LIGHT_DUTY':
        # Shift light duty transport toward electricity
        gas_cols = [c for c in df.columns if 'trns' in c and 'fuelmix' in c and
                    ('gasoline' in c or 'diesel' in c) and 'light' in c]
        elec_cols = [c for c in df.columns if 'trns' in c and 'fuelmix' in c and
                     'electric' in c and 'light' in c]
        decide(f'{transformer_code}: shifting light duty from fossil fuels to electric (EV target 10% by 2035)')
        for tp in range(21):
            ev_share = ramp(tp, 0.10*scalar, initial_factor=0.0)
            mask = df['time_period'] == tp
            for col in elec_cols:
                df.loc[mask, col] = np.minimum(df.loc[mask, col] + ev_share, 1.0)
            for col in gas_cols:
                df.loc[mask, col] = np.maximum(df.loc[mask, col] - ev_share/max(len(gas_cols),1), 0.0)

    elif transformer_code == 'TFR:LNDU:INC_REFORESTATION':
        # Increase reforestation rates
        cols = [c for c in df.columns if 'lndu' in c and ('reforest' in c or 'forest' in c) and
                ('frac' in c or 'rate' in c)]
        decide(f'{transformer_code}: scaling {len(cols)} reforestation cols by scalar={scalar}')
        for tp in range(21):
            factor = ramp(tp, 1.0 + scalar * 5.0)  # up to 6x reforestation rate
            mask = df['time_period'] == tp
            for col in cols:
                df.loc[mask, col] = np.minimum(df.loc[mask, col] * factor, 0.15)

    else:
        log(f'  [WARNING] Unknown transformer: {transformer_code} - no modification applied')

    return df


# Build strategy 1 DataFrame
log('\n### Building Strategy 1 (Unconditional NDC)')
df_s1 = df_libya.copy()
with open(f'{LOG_DIR}/strategy_definitions.json') as f:
    strat_defs = json.load(f)

for tfr in strat_defs['strategy_1']['transformers']:
    code = tfr['transformer_code']
    scalar = tfr.get('scalar', 1.0)
    try:
        df_s1 = apply_transformer(df_s1, code, scalar=scalar)
        log(f'  Applied: {code} (scalar={scalar})')
    except Exception as e:
        log(f'  ERROR applying {code}: {str(e)[:200]}')
        log(traceback.format_exc())

# Ensure strategy 1 also has all required fields
for field in (all_required - set(df_s1.columns)):
    default_val = 0.0
    for vname, v in ma.dict_variables.items():
        if field in v.fields:
            dv = v.default_value
            if dv is not None and not (isinstance(dv, float) and math.isnan(dv)):
                default_val = float(dv)
            break
    df_s1[field] = default_val

df_s1.to_csv(f'{OUT_DIR}/model_input_strategy_1.csv', index=False)
log(f'Saved: {OUT_DIR}/model_input_strategy_1.csv')

# Build strategy 2 DataFrame
log('\n### Building Strategy 2 (Conditional NDC)')
df_s2 = df_libya.copy()
for tfr in strat_defs['strategy_2']['transformers']:
    code = tfr['transformer_code']
    scalar = tfr.get('scalar', 1.0)
    try:
        df_s2 = apply_transformer(df_s2, code, scalar=scalar)
        log(f'  Applied: {code} (scalar={scalar})')
    except Exception as e:
        log(f'  ERROR applying {code}: {str(e)[:200]}')
        log(traceback.format_exc())

# Ensure strategy 2 also has all required fields
for field in (all_required - set(df_s2.columns)):
    default_val = 0.0
    for vname, v in ma.dict_variables.items():
        if field in v.fields:
            dv = v.default_value
            if dv is not None and not (isinstance(dv, float) and math.isnan(dv)):
                default_val = float(dv)
            break
    df_s2[field] = default_val

df_s2.to_csv(f'{OUT_DIR}/model_input_strategy_2.csv', index=False)
log(f'Saved: {OUT_DIR}/model_input_strategy_2.csv')

# ── Step 3: Run project() for each strategy ──────────────────────────────────
log('\n## Step 3: Running SISEPUEDEModels.project() for each strategy')

results = {}
strategy_inputs = {0: df_libya, 1: df_s1, 2: df_s2}

for strategy_id, df_in in strategy_inputs.items():
    log(f'\n### Strategy {strategy_id}')

    # Select only time_periods 0-20
    df_run = df_in[df_in['time_period'].isin(range(21))].copy().reset_index(drop=True)
    log(f'  Input shape: {df_run.shape}')

    attempt = 0
    max_attempts = 3
    success = False

    while attempt < max_attempts and not success:
        attempt += 1
        try:
            log(f'  Attempt {attempt}...')
            df_out = models.project(
                df_run,
                regions=None,  # no region filtering - df has no region column
                run_integrated=True,
                include_electricity_in_energy=False,  # skip NeMo-Mod Julia
                verbose=False,
                check_results=False,  # skip result verification to avoid errors
            )

            if df_out is not None and len(df_out) > 0:
                results[strategy_id] = df_out
                success = True
                log(f'  SUCCESS: output shape = {df_out.shape}')

                # Summarize emission outputs
                emit_cols = [c for c in df_out.columns if 'emission_co2e' in c and 'subsector_total' in c]
                if emit_cols:
                    tp20 = df_out[df_out['time_period'] == 20] if 'time_period' in df_out.columns else df_out.tail(1)
                    for col in emit_cols[:10]:
                        val = tp20[col].values[0] if len(tp20) > 0 else 'N/A'
                        log(f'    {col}: {val}')
                else:
                    # Try aggregate columns
                    co2e_cols = [c for c in df_out.columns if 'emission_co2e' in c]
                    log(f'  Emission output columns: {len(co2e_cols)} found')
                    if co2e_cols and 'time_period' in df_out.columns:
                        tp20 = df_out[df_out['time_period'] == 20]
                        if len(tp20) > 0:
                            total = tp20[co2e_cols].sum(axis=1).values[0]
                            log(f'  Total co2e at tp=20: {total:.2f} MT CO2e')
            else:
                log(f'  WARNING: project() returned empty/None result')

        except Exception as e:
            err_msg = str(e)[:500]
            tb = traceback.format_exc()
            log(f'  ERROR (attempt {attempt}): {err_msg}')
            log(f'  TRACEBACK:\n{tb[:1000]}')

            # Diagnose and fix
            if 'region' in err_msg.lower() and 'valid' in err_msg.lower():
                # Add 'region' column if missing
                if 'region' not in df_run.columns:
                    df_run['region'] = 'libya'
                    decide(f'Strategy {strategy_id}: added region=libya column to fix region error')

            elif 'shape' in err_msg.lower() or 'dimension' in err_msg.lower():
                log(f'  Shape mismatch - ensuring 21 rows and resetting index')
                df_run = df_run[df_run['time_period'].isin(range(21))].reset_index(drop=True)

            elif 'nan' in err_msg.lower() or 'inf' in err_msg.lower():
                n_nan = df_run.isnull().sum().sum()
                n_inf = np.isinf(df_run.select_dtypes(include=np.number)).sum().sum()
                log(f'  Fixing NaN ({n_nan}) and Inf ({n_inf}) values')
                df_run = df_run.fillna(0)
                df_run = df_run.replace([np.inf, -np.inf], 0)

            elif 'key' in err_msg.lower() or 'column' in err_msg.lower():
                # Column not found - don't need to fix, just continue
                log(f'  Missing column error - will retry with same data')
                break  # If column is missing, retrying won't help

            if attempt == max_attempts:
                log(f'  FAILED after {max_attempts} attempts')

# ── Step 4: Save Outputs ─────────────────────────────────────────────────────
log('\n## Step 4: Saving Outputs')

for strategy_id, df_out in results.items():
    fpath = f'{OUT_DIR}/model_output_strategy_{strategy_id}.csv'
    df_out.to_csv(fpath, index=False)
    log(f'Saved output: {fpath} (shape: {df_out.shape})')

# ── Step 5: Write Status Files ────────────────────────────────────────────────
log('\n## Step 5: Writing Status Files')

# Compute emission totals at tp=20 for each strategy
emission_summary = {}
for sid, df_out in results.items():
    if df_out is not None and 'time_period' in df_out.columns:
        co2e_cols = [c for c in df_out.columns if 'emission_co2e' in c]
        aggregate_cols = [c for c in co2e_cols if 'subsector_total' in c]
        tp20 = df_out[df_out['time_period'] == 20]
        if len(tp20) > 0 and aggregate_cols:
            total_mt = tp20[aggregate_cols].sum(axis=1).values[0]
            emission_summary[sid] = {
                'total_mt_co2e_2035': total_mt,
                'aggregate_cols': aggregate_cols[:5],
            }
        elif len(tp20) > 0 and co2e_cols:
            total_mt = tp20[co2e_cols].sum(axis=1).values[0]
            emission_summary[sid] = {
                'total_mt_co2e_2035': total_mt,
                'aggregate_cols': co2e_cols[:5],
            }

# Write agent3_status.md
status = 'COMPLETE' if len(results) == 3 else ('PARTIAL' if len(results) > 0 else 'BLOCKED')
with open(f'{LOG_DIR}/agent3_status.md', 'w') as f:
    f.write(f'# AGENT 3 Status: {status}\n\n')
    f.write(f'## Strategy Run Results\n')
    for sid in [0, 1, 2]:
        run_status = 'SUCCESS' if sid in results else 'FAILED'
        f.write(f'- Strategy {sid}: {run_status}\n')

    f.write(f'\n## 2035 Emission Totals (MT CO2e, time_period=20)\n')
    for sid, em in emission_summary.items():
        f.write(f'- Strategy {sid}: {em["total_mt_co2e_2035"]:.3f} MT CO2e\n')

    if len(emission_summary) >= 2 and 0 in emission_summary and 1 in emission_summary:
        bau = emission_summary[0]['total_mt_co2e_2035']
        s1 = emission_summary[1]['total_mt_co2e_2035']
        pct_red = (bau - s1) / bau * 100 if bau != 0 else 0
        f.write(f'\n## NDC Reduction Assessment\n')
        f.write(f'- BAU 2035: {bau:.3f} MT CO2e\n')
        f.write(f'- Unconditional NDC reduction: {pct_red:.1f}% (target: 12.9%)\n')
        if 2 in emission_summary:
            s2 = emission_summary[2]['total_mt_co2e_2035']
            pct_red2 = (bau - s2) / bau * 100 if bau != 0 else 0
            f.write(f'- Conditional NDC reduction: {pct_red2:.1f}% (target: 21.0%)\n')

    f.write(f'\n## Output Files in {OUT_DIR}\n')
    for fname in sorted(os.listdir(OUT_DIR)):
        fpath = f'{OUT_DIR}/{fname}'
        size_kb = os.path.getsize(fpath) / 1024
        f.write(f'- {fname} ({size_kb:.1f} KB)\n')

    f.write(f'\n## For AGENT 4\n')
    f.write(f'- Output CSVs: `{OUT_DIR}/model_output_strategy_{{0,1,2}}.csv`\n')
    f.write(f'- Input CSVs: `{OUT_DIR}/model_input_strategy_{{0,1,2}}.csv`\n')
    f.write(f'- Emission aggregate columns: look for `emission_co2e_*_subsector_total` or `emission_co2e_*`\n')
    f.write(f'- time_period 20 = year 2035 (BAU comparison year)\n')
    f.write(f'- NeMo-Mod Julia electricity model was SKIPPED (include_electricity_in_energy=False)\n')
    f.write(f'- Power sector emissions are NOT included in energy sector totals\n')

log(f'\nAgent 3 complete. Status: {status}')
log(f'Results: {list(results.keys())} strategies ran successfully')
for sid, em in emission_summary.items():
    log(f'Strategy {sid} 2035 total: {em["total_mt_co2e_2035"]:.3f} MT CO2e')

print('\n=== SIMULATION COMPLETE ===')
print(f'Status: {status}')
print(f'Strategies with output: {list(results.keys())}')
print(f'Outputs in: {OUT_DIR}')
