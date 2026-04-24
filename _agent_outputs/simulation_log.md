

# AGENT 3 — Libya NDC Simulation

## Step 0: Initializing ModelAttributes and SISEPUEDEModels
ModelAttributes initialized OK
SISEPUEDEModels initialized OK (allow_electricity_run=False)
Time periods available: [0, 1, 2, 3, 4]...

## Step 1: Build Libya Baseline Input DataFrame
MEX template: 21 rows, 2189 columns


# AGENT 3 — Libya NDC Simulation

## Step 0: Initializing ModelAttributes and SISEPUEDEModels
ModelAttributes initialized OK
SISEPUEDEModels initialized OK (allow_electricity_run=False)
Time periods available: [0, 1, 2, 3, 4]...

## Step 1: Build Libya Baseline Input DataFrame
MEX template: 21 rows, 2189 columns
GDP columns found: ['elasticity_lvst_cattle_dairy_demand_to_gdppc', 'elasticity_lvst_cattle_nondairy_demand_to_gdppc', 'elasticity_lvst_chickens_demand_to_gdppc', 'elasticity_lvst_pigs_demand_to_gdppc', 'elasticity_lvst_sheep_demand_to_gdppc']
Pop columns found: ['population_gnrl_rural', 'population_gnrl_urban']
GDPpc columns: ['elasticity_lvst_cattle_dairy_demand_to_gdppc', 'elasticity_lvst_cattle_nondairy_demand_to_gdppc', 'elasticity_lvst_chickens_demand_to_gdppc', 'elasticity_lvst_pigs_demand_to_gdppc', 'elasticity_lvst_sheep_demand_to_gdppc']
GDP scaling ratio (2015 tp=0): 0.0278  (2035 tp=20): 0.0414
GDP/population substitution applied
  scoe_init_energy: OK: substituted 6 cols from scoe_initial_energy_consumption.csv
  scoe_elasticity: OK: substituted 6 cols from scoe_elasticity_of_energy_consumption.csv
  scoe_scalar: OK: substituted 6 cols from scoe_consumption_scalar.csv
  clinker: OK: substituted 1 cols from clinker_fraction_cement_ippu.csv
  net_imports_cement: OK: substituted 1 cols from net_imports_cement_clinker.csv
  transm_loss: OK: substituted 1 cols from inputs_by_country_modvar_enfu_transmission_loss_frac_electricity.csv
  fuel_costs: OK: substituted 16 cols from inputs_by_country_modvar_enfu_fuel_costs.csv
  min_share_prod: OK: substituted 10 cols from inputs_by_country_minimum_share_of_production_baseline.csv
  no_till: FILE NOT FOUND - /Users/fabianfuentes/git/sisepuede/sisepuede/ref/batch_data_generation/afolu_tillage/afolu_tillage_no_till.csv
  inen_industrial_production_components: ERROR industrial_production_components: [Errno 21] Is a directory: '/Users/fabianfuentes/git/sisepuede/sisepuede/ref/batch_data_generation/i
  generic/population_centroids_by_iso.csv: ERROR population_centroids_by_iso.csv: 'time_period'
  generic/countries_by_iso.csv: ERROR countries_by_iso.csv: 'iso_code3'
  soil_grids_soil_organic_carbon/soc_fields_by_country.csv: ERROR soc_fields_by_country.csv: 'iso_code3'
  soil_grids_soil_organic_carbon/soc_average_soc_by_country.csv: ERROR soc_average_soc_by_country.csv: 'iso_code3'
  koppen_climate_classifications/kcc_cell_counts_by_country.csv: ERROR kcc_cell_counts_by_country.csv: 'iso_code3'
  koppen_climate_classifications/cc_cell_counts_by_country_kcc.csv: ERROR cc_cell_counts_by_country_kcc.csv: 'iso_code3'
  koppen_climate_classifications/climate_fields_by_country.csv: ERROR climate_fields_by_country.csv: 'iso_code3'
Libya batch substitution complete. Shape: (21, 2189)
Sector scaling applied
Land use fractions adjusted for Libya arid climate
FGTV columns: 38 found
FGTV oil/gas production scaling applied
NaN values replaced with 0: 0 cells replaced

Libya baseline DataFrame ready: (21, 2189)
  Columns: 2189
  Rows: 21 (time_periods 0-20)
  Nations: ['libya']
Saved: /Users/fabianfuentes/git/sisepuede/_outputs/libya_ndc/model_input_strategy_0.csv

## Step 2: Apply Transformer Modifications

### Building Strategy 1 (Unconditional NDC)
  Applied: TFR:FGTV:DEC_LEAKS (scalar=1.0)
  Applied: TFR:FGTV:INC_FLARE (scalar=1.0)
  Applied: TFR:SCOE:INC_EFFICIENCY_APPLIANCE (scalar=1.0)
  Applied: TFR:ENTC:DEC_LOSSES (scalar=1.0)
  Applied: TFR:INEN:INC_EFFICIENCY_ENERGY (scalar=1.0)
  Applied: TFR:TRNS:INC_EFFICIENCY_NON_ELECTRIC (scalar=1.0)
  Applied: TFR:LNDU:INC_REFORESTATION (scalar=0.1)
Saved: /Users/fabianfuentes/git/sisepuede/_outputs/libya_ndc/model_input_strategy_1.csv

### Building Strategy 2 (Conditional NDC)
  Applied: TFR:FGTV:DEC_LEAKS (scalar=1.0)
  Applied: TFR:FGTV:INC_FLARE (scalar=1.0)
  Applied: TFR:LNDU:INC_REFORESTATION (scalar=1.0)
  Applied: TFR:SCOE:INC_EFFICIENCY_APPLIANCE (scalar=1.0)
  Applied: TFR:SCOE:DEC_DEMAND_HEAT (scalar=1.0)
  Applied: TFR:ENTC:DEC_LOSSES (scalar=1.0)
  Applied: TFR:ENTC:TARGET_RENEWABLE_ELEC (scalar=1.0)
  Applied: TFR:IPPU:DEC_CLINKER (scalar=1.0)
  Applied: TFR:INEN:INC_EFFICIENCY_ENERGY (scalar=1.0)
  Applied: TFR:INEN:INC_EFFICIENCY_PRODUCTION (scalar=1.0)
  Applied: TFR:IPPU:DEC_HFCS (scalar=1.0)
  Applied: TFR:WASO:INC_RECYCLING (scalar=1.0)
  Applied: TFR:WASO:INC_CAPTURE_BIOGAS (scalar=1.0)
  Applied: TFR:WALI:INC_TREATMENT_URBAN (scalar=1.0)
  Applied: TFR:TRWW:INC_CAPTURE_BIOGAS (scalar=1.0)
  Applied: TFR:LVST:DEC_ENTERIC_FERMENTATION (scalar=1.0)
  Applied: TFR:SOIL:DEC_N_APPLIED (scalar=1.0)
  Applied: TFR:TRNS:INC_EFFICIENCY_NON_ELECTRIC (scalar=1.0)
  Applied: TFR:TRNS:SHIFT_FUEL_LIGHT_DUTY (scalar=1.0)
Saved: /Users/fabianfuentes/git/sisepuede/_outputs/libya_ndc/model_input_strategy_2.csv

## Step 3: Running SISEPUEDEModels.project() for each strategy

### Strategy 0
  Input shape: (21, 2189)
  Attempt 1...
  ERROR (attempt 1): list index out of range
  TRACEBACK:
Traceback (most recent call last):
  File "/Users/fabianfuentes/git/sisepuede/run_libya_ndc_simulation.py", line 594, in <module>
    df_out = models.project(
             ^^^^^^^^^^^^^^^
  File "/Users/fabianfuentes/git/sisepuede/sisepuede/manager/sisepuede_models.py", line 571, in project
    df_return[0],
    ~~~~~~~~~^^^
IndexError: list index out of range

  Attempt 2...
  ERROR (attempt 2): list index out of range
  TRACEBACK:
Traceback (most recent call last):
  File "/Users/fabianfuentes/git/sisepuede/run_libya_ndc_simulation.py", line 594, in <module>
    df_out = models.project(
             ^^^^^^^^^^^^^^^
  File "/Users/fabianfuentes/git/sisepuede/sisepuede/manager/sisepuede_models.py", line 571, in project
    df_return[0],
    ~~~~~~~~~^^^
IndexError: list index out of range

  Attempt 3...
  ERROR (attempt 3): list index out of range
  TRACEBACK:
Traceback (most recent call last):
  File "/Users/fabianfuentes/git/sisepuede/run_libya_ndc_simulation.py", line 594, in <module>
    df_out = models.project(
             ^^^^^^^^^^^^^^^
  File "/Users/fabianfuentes/git/sisepuede/sisepuede/manager/sisepuede_models.py", line 571, in project
    df_return[0],
    ~~~~~~~~~^^^
IndexError: list index out of range

  FAILED after 3 attempts

### Strategy 1
  Input shape: (21, 2189)
  Attempt 1...
  ERROR (attempt 1): list index out of range
  TRACEBACK:
Traceback (most recent call last):
  File "/Users/fabianfuentes/git/sisepuede/run_libya_ndc_simulation.py", line 594, in <module>
    df_out = models.project(
             ^^^^^^^^^^^^^^^
  File "/Users/fabianfuentes/git/sisepuede/sisepuede/manager/sisepuede_models.py", line 571, in project
    df_return[0],
    ~~~~~~~~~^^^
IndexError: list index out of range

  Attempt 2...
  ERROR (attempt 2): list index out of range
  TRACEBACK:
Traceback (most recent call last):
  File "/Users/fabianfuentes/git/sisepuede/run_libya_ndc_simulation.py", line 594, in <module>
    df_out = models.project(
             ^^^^^^^^^^^^^^^
  File "/Users/fabianfuentes/git/sisepuede/sisepuede/manager/sisepuede_models.py", line 571, in project
    df_return[0],
    ~~~~~~~~~^^^
IndexError: list index out of range

  Attempt 3...
  ERROR (attempt 3): list index out of range
  TRACEBACK:
Traceback (most recent call last):
  File "/Users/fabianfuentes/git/sisepuede/run_libya_ndc_simulation.py", line 594, in <module>
    df_out = models.project(
             ^^^^^^^^^^^^^^^
  File "/Users/fabianfuentes/git/sisepuede/sisepuede/manager/sisepuede_models.py", line 571, in project
    df_return[0],
    ~~~~~~~~~^^^
IndexError: list index out of range

  FAILED after 3 attempts

### Strategy 2
  Input shape: (21, 2189)
  Attempt 1...
  ERROR (attempt 1): list index out of range
  TRACEBACK:
Traceback (most recent call last):
  File "/Users/fabianfuentes/git/sisepuede/run_libya_ndc_simulation.py", line 594, in <module>
    df_out = models.project(
             ^^^^^^^^^^^^^^^
  File "/Users/fabianfuentes/git/sisepuede/sisepuede/manager/sisepuede_models.py", line 571, in project
    df_return[0],
    ~~~~~~~~~^^^
IndexError: list index out of range

  Attempt 2...
  ERROR (attempt 2): list index out of range
  TRACEBACK:
Traceback (most recent call last):
  File "/Users/fabianfuentes/git/sisepuede/run_libya_ndc_simulation.py", line 594, in <module>
    df_out = models.project(
             ^^^^^^^^^^^^^^^
  File "/Users/fabianfuentes/git/sisepuede/sisepuede/manager/sisepuede_models.py", line 571, in project
    df_return[0],
    ~~~~~~~~~^^^
IndexError: list index out of range

  Attempt 3...
  ERROR (attempt 3): list index out of range
  TRACEBACK:
Traceback (most recent call last):
  File "/Users/fabianfuentes/git/sisepuede/run_libya_ndc_simulation.py", line 594, in <module>
    df_out = models.project(
             ^^^^^^^^^^^^^^^
  File "/Users/fabianfuentes/git/sisepuede/sisepuede/manager/sisepuede_models.py", line 571, in project
    df_return[0],
    ~~~~~~~~~^^^
IndexError: list index out of range

  FAILED after 3 attempts

## Step 4: Saving Outputs

## Step 5: Writing Status Files

Agent 3 complete. Status: BLOCKED
Results: [] strategies ran successfully


# AGENT 3 — Libya NDC Simulation

## Step 0: Initializing ModelAttributes and SISEPUEDEModels
ModelAttributes initialized OK
SISEPUEDEModels initialized OK (allow_electricity_run=False)
Time periods available: [0, 1, 2, 3, 4]...

## Step 1: Build Libya Baseline Input DataFrame
MEX template: 21 rows, 2189 columns
GDP columns found: ['elasticity_lvst_cattle_dairy_demand_to_gdppc', 'elasticity_lvst_cattle_nondairy_demand_to_gdppc', 'elasticity_lvst_chickens_demand_to_gdppc', 'elasticity_lvst_pigs_demand_to_gdppc', 'elasticity_lvst_sheep_demand_to_gdppc']
Pop columns found: ['population_gnrl_rural', 'population_gnrl_urban']
GDPpc columns: ['elasticity_lvst_cattle_dairy_demand_to_gdppc', 'elasticity_lvst_cattle_nondairy_demand_to_gdppc', 'elasticity_lvst_chickens_demand_to_gdppc', 'elasticity_lvst_pigs_demand_to_gdppc', 'elasticity_lvst_sheep_demand_to_gdppc']
GDP scaling ratio (2015 tp=0): 0.0278  (2035 tp=20): 0.0414
GDP/population substitution applied
  scoe_init_energy: OK: substituted 6 cols from scoe_initial_energy_consumption.csv
  scoe_elasticity: OK: substituted 6 cols from scoe_elasticity_of_energy_consumption.csv
  scoe_scalar: OK: substituted 6 cols from scoe_consumption_scalar.csv
  clinker: OK: substituted 1 cols from clinker_fraction_cement_ippu.csv
  net_imports_cement: OK: substituted 1 cols from net_imports_cement_clinker.csv
  transm_loss: OK: substituted 1 cols from inputs_by_country_modvar_enfu_transmission_loss_frac_electricity.csv
  fuel_costs: OK: substituted 16 cols from inputs_by_country_modvar_enfu_fuel_costs.csv
  min_share_prod: OK: substituted 10 cols from inputs_by_country_minimum_share_of_production_baseline.csv
  no_till: FILE NOT FOUND - /Users/fabianfuentes/git/sisepuede/sisepuede/ref/batch_data_generation/afolu_tillage/afolu_tillage_no_till.csv
  inen_industrial_production_components: ERROR industrial_production_components: [Errno 21] Is a directory: '/Users/fabianfuentes/git/sisepuede/sisepuede/ref/batch_data_generation/i
  generic/population_centroids_by_iso.csv: ERROR population_centroids_by_iso.csv: 'time_period'
  generic/countries_by_iso.csv: ERROR countries_by_iso.csv: 'iso_code3'
  soil_grids_soil_organic_carbon/soc_fields_by_country.csv: ERROR soc_fields_by_country.csv: 'iso_code3'
  soil_grids_soil_organic_carbon/soc_average_soc_by_country.csv: ERROR soc_average_soc_by_country.csv: 'iso_code3'
  koppen_climate_classifications/kcc_cell_counts_by_country.csv: ERROR kcc_cell_counts_by_country.csv: 'iso_code3'
  koppen_climate_classifications/cc_cell_counts_by_country_kcc.csv: ERROR cc_cell_counts_by_country_kcc.csv: 'iso_code3'
  koppen_climate_classifications/climate_fields_by_country.csv: ERROR climate_fields_by_country.csv: 'iso_code3'
Libya batch substitution complete. Shape: (21, 2189)
Sector scaling applied
Land use fractions adjusted for Libya arid climate
FGTV columns: 38 found
FGTV oil/gas production scaling applied
NaN values replaced with 0: 0 cells replaced

Libya baseline DataFrame ready: (21, 2189)
  Columns: 2189
  Rows: 21 (time_periods 0-20)
  Nations: ['libya']
Saved: /Users/fabianfuentes/git/sisepuede/_outputs/libya_ndc/model_input_strategy_0.csv

## Step 2: Apply Transformer Modifications

### Building Strategy 1 (Unconditional NDC)
  Applied: TFR:FGTV:DEC_LEAKS (scalar=1.0)
  Applied: TFR:FGTV:INC_FLARE (scalar=1.0)
  Applied: TFR:SCOE:INC_EFFICIENCY_APPLIANCE (scalar=1.0)
  Applied: TFR:ENTC:DEC_LOSSES (scalar=1.0)
  Applied: TFR:INEN:INC_EFFICIENCY_ENERGY (scalar=1.0)
  Applied: TFR:TRNS:INC_EFFICIENCY_NON_ELECTRIC (scalar=1.0)
  Applied: TFR:LNDU:INC_REFORESTATION (scalar=0.1)
Saved: /Users/fabianfuentes/git/sisepuede/_outputs/libya_ndc/model_input_strategy_1.csv

### Building Strategy 2 (Conditional NDC)
  Applied: TFR:FGTV:DEC_LEAKS (scalar=1.0)
  Applied: TFR:FGTV:INC_FLARE (scalar=1.0)
  Applied: TFR:LNDU:INC_REFORESTATION (scalar=1.0)
  Applied: TFR:SCOE:INC_EFFICIENCY_APPLIANCE (scalar=1.0)
  Applied: TFR:SCOE:DEC_DEMAND_HEAT (scalar=1.0)
  Applied: TFR:ENTC:DEC_LOSSES (scalar=1.0)
  Applied: TFR:ENTC:TARGET_RENEWABLE_ELEC (scalar=1.0)
  Applied: TFR:IPPU:DEC_CLINKER (scalar=1.0)
  Applied: TFR:INEN:INC_EFFICIENCY_ENERGY (scalar=1.0)
  Applied: TFR:INEN:INC_EFFICIENCY_PRODUCTION (scalar=1.0)
  Applied: TFR:IPPU:DEC_HFCS (scalar=1.0)
  Applied: TFR:WASO:INC_RECYCLING (scalar=1.0)
  Applied: TFR:WASO:INC_CAPTURE_BIOGAS (scalar=1.0)
  Applied: TFR:WALI:INC_TREATMENT_URBAN (scalar=1.0)
  Applied: TFR:TRWW:INC_CAPTURE_BIOGAS (scalar=1.0)
  Applied: TFR:LVST:DEC_ENTERIC_FERMENTATION (scalar=1.0)
  Applied: TFR:SOIL:DEC_N_APPLIED (scalar=1.0)
  Applied: TFR:TRNS:INC_EFFICIENCY_NON_ELECTRIC (scalar=1.0)
  Applied: TFR:TRNS:SHIFT_FUEL_LIGHT_DUTY (scalar=1.0)
Saved: /Users/fabianfuentes/git/sisepuede/_outputs/libya_ndc/model_input_strategy_2.csv

## Step 3: Running SISEPUEDEModels.project() for each strategy

### Strategy 0
  Input shape: (21, 2189)
  Attempt 1...
  ERROR (attempt 1): list index out of range
  TRACEBACK:
Traceback (most recent call last):
  File "/Users/fabianfuentes/git/sisepuede/run_libya_ndc_simulation.py", line 594, in <module>
    df_out = models.project(
             ^^^^^^^^^^^^^^^
  File "/Users/fabianfuentes/git/sisepuede/sisepuede/manager/sisepuede_models.py", line 571, in project
    df_return[0],
    ~~~~~~~~~^^^
IndexError: list index out of range

  Attempt 2...
  ERROR (attempt 2): list index out of range
  TRACEBACK:
Traceback (most recent call last):
  File "/Users/fabianfuentes/git/sisepuede/run_libya_ndc_simulation.py", line 594, in <module>
    df_out = models.project(
             ^^^^^^^^^^^^^^^
  File "/Users/fabianfuentes/git/sisepuede/sisepuede/manager/sisepuede_models.py", line 571, in project
    df_return[0],
    ~~~~~~~~~^^^
IndexError: list index out of range

  Attempt 3...
  ERROR (attempt 3): list index out of range
  TRACEBACK:
Traceback (most recent call last):
  File "/Users/fabianfuentes/git/sisepuede/run_libya_ndc_simulation.py", line 594, in <module>
    df_out = models.project(
             ^^^^^^^^^^^^^^^
  File "/Users/fabianfuentes/git/sisepuede/sisepuede/manager/sisepuede_models.py", line 571, in project
    df_return[0],
    ~~~~~~~~~^^^
IndexError: list index out of range

  FAILED after 3 attempts

### Strategy 1
  Input shape: (21, 2189)
  Attempt 1...
  ERROR (attempt 1): list index out of range
  TRACEBACK:
Traceback (most recent call last):
  File "/Users/fabianfuentes/git/sisepuede/run_libya_ndc_simulation.py", line 594, in <module>
    df_out = models.project(
             ^^^^^^^^^^^^^^^
  File "/Users/fabianfuentes/git/sisepuede/sisepuede/manager/sisepuede_models.py", line 571, in project
    df_return[0],
    ~~~~~~~~~^^^
IndexError: list index out of range

  Attempt 2...
  ERROR (attempt 2): list index out of range
  TRACEBACK:
Traceback (most recent call last):
  File "/Users/fabianfuentes/git/sisepuede/run_libya_ndc_simulation.py", line 594, in <module>
    df_out = models.project(
             ^^^^^^^^^^^^^^^
  File "/Users/fabianfuentes/git/sisepuede/sisepuede/manager/sisepuede_models.py", line 571, in project
    df_return[0],
    ~~~~~~~~~^^^
IndexError: list index out of range

  Attempt 3...
  ERROR (attempt 3): list index out of range
  TRACEBACK:
Traceback (most recent call last):
  File "/Users/fabianfuentes/git/sisepuede/run_libya_ndc_simulation.py", line 594, in <module>
    df_out = models.project(
             ^^^^^^^^^^^^^^^
  File "/Users/fabianfuentes/git/sisepuede/sisepuede/manager/sisepuede_models.py", line 571, in project
    df_return[0],
    ~~~~~~~~~^^^
IndexError: list index out of range

  FAILED after 3 attempts

### Strategy 2
  Input shape: (21, 2189)
  Attempt 1...
  ERROR (attempt 1): list index out of range
  TRACEBACK:
Traceback (most recent call last):
  File "/Users/fabianfuentes/git/sisepuede/run_libya_ndc_simulation.py", line 594, in <module>
    df_out = models.project(
             ^^^^^^^^^^^^^^^
  File "/Users/fabianfuentes/git/sisepuede/sisepuede/manager/sisepuede_models.py", line 571, in project
    df_return[0],
    ~~~~~~~~~^^^
IndexError: list index out of range

  Attempt 2...
  ERROR (attempt 2): list index out of range
  TRACEBACK:
Traceback (most recent call last):
  File "/Users/fabianfuentes/git/sisepuede/run_libya_ndc_simulation.py", line 594, in <module>
    df_out = models.project(
             ^^^^^^^^^^^^^^^
  File "/Users/fabianfuentes/git/sisepuede/sisepuede/manager/sisepuede_models.py", line 571, in project
    df_return[0],
    ~~~~~~~~~^^^
IndexError: list index out of range

  Attempt 3...
  ERROR (attempt 3): list index out of range
  TRACEBACK:
Traceback (most recent call last):
  File "/Users/fabianfuentes/git/sisepuede/run_libya_ndc_simulation.py", line 594, in <module>
    df_out = models.project(
             ^^^^^^^^^^^^^^^
  File "/Users/fabianfuentes/git/sisepuede/sisepuede/manager/sisepuede_models.py", line 571, in project
    df_return[0],
    ~~~~~~~~~^^^
IndexError: list index out of range

  FAILED after 3 attempts

## Step 4: Saving Outputs

## Step 5: Writing Status Files

Agent 3 complete. Status: BLOCKED
Results: [] strategies ran successfully


# AGENT 3 — Libya NDC Simulation

## Step 0: Initializing ModelAttributes and SISEPUEDEModels
ModelAttributes initialized OK
SISEPUEDEModels initialized OK (allow_electricity_run=False)
Time periods available: [0, 1, 2, 3, 4]...

## Step 1: Build Libya Baseline Input DataFrame
MEX template: 21 rows, 2189 columns
GDP columns found: ['elasticity_lvst_cattle_dairy_demand_to_gdppc', 'elasticity_lvst_cattle_nondairy_demand_to_gdppc', 'elasticity_lvst_chickens_demand_to_gdppc', 'elasticity_lvst_pigs_demand_to_gdppc', 'elasticity_lvst_sheep_demand_to_gdppc']
Pop columns found: ['population_gnrl_rural', 'population_gnrl_urban']
GDPpc columns: ['elasticity_lvst_cattle_dairy_demand_to_gdppc', 'elasticity_lvst_cattle_nondairy_demand_to_gdppc', 'elasticity_lvst_chickens_demand_to_gdppc', 'elasticity_lvst_pigs_demand_to_gdppc', 'elasticity_lvst_sheep_demand_to_gdppc']
GDP scaling ratio (2015 tp=0): 0.0278  (2035 tp=20): 0.0414
GDP/population substitution applied
  scoe_init_energy: OK: substituted 6 cols from scoe_initial_energy_consumption.csv
  scoe_elasticity: OK: substituted 6 cols from scoe_elasticity_of_energy_consumption.csv
  scoe_scalar: OK: substituted 6 cols from scoe_consumption_scalar.csv
  clinker: OK: substituted 1 cols from clinker_fraction_cement_ippu.csv
  net_imports_cement: OK: substituted 1 cols from net_imports_cement_clinker.csv
  transm_loss: OK: substituted 1 cols from inputs_by_country_modvar_enfu_transmission_loss_frac_electricity.csv
  fuel_costs: OK: substituted 16 cols from inputs_by_country_modvar_enfu_fuel_costs.csv
  min_share_prod: OK: substituted 10 cols from inputs_by_country_minimum_share_of_production_baseline.csv
  no_till: FILE NOT FOUND - /Users/fabianfuentes/git/sisepuede/sisepuede/ref/batch_data_generation/afolu_tillage/afolu_tillage_no_till.csv
  inen_industrial_production_components: ERROR industrial_production_components: [Errno 21] Is a directory: '/Users/fabianfuentes/git/sisepuede/sisepuede/ref/batch_data_generation/i
  generic/population_centroids_by_iso.csv: ERROR population_centroids_by_iso.csv: 'time_period'
  generic/countries_by_iso.csv: ERROR countries_by_iso.csv: 'iso_code3'
  soil_grids_soil_organic_carbon/soc_fields_by_country.csv: ERROR soc_fields_by_country.csv: 'iso_code3'
  soil_grids_soil_organic_carbon/soc_average_soc_by_country.csv: ERROR soc_average_soc_by_country.csv: 'iso_code3'
  koppen_climate_classifications/kcc_cell_counts_by_country.csv: ERROR kcc_cell_counts_by_country.csv: 'iso_code3'
  koppen_climate_classifications/cc_cell_counts_by_country_kcc.csv: ERROR cc_cell_counts_by_country_kcc.csv: 'iso_code3'
  koppen_climate_classifications/climate_fields_by_country.csv: ERROR climate_fields_by_country.csv: 'iso_code3'
Libya batch substitution complete. Shape: (21, 2189)
Sector scaling applied
Land use fractions adjusted for Libya arid climate
FGTV columns: 38 found
FGTV oil/gas production scaling applied
NaN values replaced with 0: 0 cells replaced
Copied 64 land use transition matrix columns from MEX template
Added 243 missing required fields with model default values

Libya baseline DataFrame ready: (21, 2432)
  Columns: 2432
  Rows: 21 (time_periods 0-20)
  Nations: ['libya']
Saved: /Users/fabianfuentes/git/sisepuede/_outputs/libya_ndc/model_input_strategy_0.csv

## Step 2: Apply Transformer Modifications

### Building Strategy 1 (Unconditional NDC)
  Applied: TFR:FGTV:DEC_LEAKS (scalar=1.0)
  Applied: TFR:FGTV:INC_FLARE (scalar=1.0)
  Applied: TFR:SCOE:INC_EFFICIENCY_APPLIANCE (scalar=1.0)
  Applied: TFR:ENTC:DEC_LOSSES (scalar=1.0)
  Applied: TFR:INEN:INC_EFFICIENCY_ENERGY (scalar=1.0)
  Applied: TFR:TRNS:INC_EFFICIENCY_NON_ELECTRIC (scalar=1.0)
  Applied: TFR:LNDU:INC_REFORESTATION (scalar=0.1)
Saved: /Users/fabianfuentes/git/sisepuede/_outputs/libya_ndc/model_input_strategy_1.csv

### Building Strategy 2 (Conditional NDC)
  Applied: TFR:FGTV:DEC_LEAKS (scalar=1.0)
  Applied: TFR:FGTV:INC_FLARE (scalar=1.0)
  Applied: TFR:LNDU:INC_REFORESTATION (scalar=1.0)
  Applied: TFR:SCOE:INC_EFFICIENCY_APPLIANCE (scalar=1.0)
  Applied: TFR:SCOE:DEC_DEMAND_HEAT (scalar=1.0)
  Applied: TFR:ENTC:DEC_LOSSES (scalar=1.0)
  Applied: TFR:ENTC:TARGET_RENEWABLE_ELEC (scalar=1.0)
  Applied: TFR:IPPU:DEC_CLINKER (scalar=1.0)
  Applied: TFR:INEN:INC_EFFICIENCY_ENERGY (scalar=1.0)
  Applied: TFR:INEN:INC_EFFICIENCY_PRODUCTION (scalar=1.0)
  Applied: TFR:IPPU:DEC_HFCS (scalar=1.0)
  Applied: TFR:WASO:INC_RECYCLING (scalar=1.0)
  Applied: TFR:WASO:INC_CAPTURE_BIOGAS (scalar=1.0)
  Applied: TFR:WALI:INC_TREATMENT_URBAN (scalar=1.0)
  Applied: TFR:TRWW:INC_CAPTURE_BIOGAS (scalar=1.0)
  Applied: TFR:LVST:DEC_ENTERIC_FERMENTATION (scalar=1.0)
  Applied: TFR:SOIL:DEC_N_APPLIED (scalar=1.0)
  Applied: TFR:TRNS:INC_EFFICIENCY_NON_ELECTRIC (scalar=1.0)
  Applied: TFR:TRNS:SHIFT_FUEL_LIGHT_DUTY (scalar=1.0)
Saved: /Users/fabianfuentes/git/sisepuede/_outputs/libya_ndc/model_input_strategy_2.csv

## Step 3: Running SISEPUEDEModels.project() for each strategy

### Strategy 0
  Input shape: (21, 2432)
  Attempt 1...
  SUCCESS: output shape = (21, 1336)
    emission_co2e_subsector_total_agrc: 0.8872277615542731
    emission_co2e_subsector_total_ccsq: 0.0
    emission_co2e_subsector_total_frst: -4.103417929893313
    emission_co2e_subsector_total_inen: 0.04938432161442975
    emission_co2e_subsector_total_ippu: -6.519681178837818e+49
    emission_co2e_subsector_total_lndu: 8.13460822405309
    emission_co2e_subsector_total_lsmm: -1818515166.0488014
    emission_co2e_subsector_total_lvst: 0.04072629919560855
    emission_co2e_subsector_total_scoe: 0.1136632565098874
    emission_co2e_subsector_total_soil: -2437686069.7248907

### Strategy 1
  Input shape: (21, 2432)
  Attempt 1...
  SUCCESS: output shape = (21, 1336)
    emission_co2e_subsector_total_agrc: 0.8872277615542731
    emission_co2e_subsector_total_ccsq: 0.0
    emission_co2e_subsector_total_frst: -4.103417929893313
    emission_co2e_subsector_total_inen: 0.04938432161442975
    emission_co2e_subsector_total_ippu: -6.519681178837818e+49
    emission_co2e_subsector_total_lndu: 8.13460822405309
    emission_co2e_subsector_total_lsmm: -1818515166.0488014
    emission_co2e_subsector_total_lvst: 0.04072629919560855
    emission_co2e_subsector_total_scoe: 0.1136632565098874
    emission_co2e_subsector_total_soil: -2437686069.758846

### Strategy 2
  Input shape: (21, 2432)
  Attempt 1...
  SUCCESS: output shape = (21, 1139)
    emission_co2e_subsector_total_agrc: 0.7330403105119624
    emission_co2e_subsector_total_ccsq: 0.0
    emission_co2e_subsector_total_frst: -4.103417929893313
    emission_co2e_subsector_total_inen: 0.044445889452986775
    emission_co2e_subsector_total_ippu: -3.259840589418909e+49
    emission_co2e_subsector_total_lndu: 8.13460822405309
    emission_co2e_subsector_total_lsmm: -1687255781.460283
    emission_co2e_subsector_total_lvst: 0.03461735431626726
    emission_co2e_subsector_total_scoe: 0.11069676529814093
    emission_co2e_subsector_total_soil: -1937425785.1321802

## Step 4: Saving Outputs
Saved output: /Users/fabianfuentes/git/sisepuede/_outputs/libya_ndc/model_output_strategy_0.csv (shape: (21, 1336))
Saved output: /Users/fabianfuentes/git/sisepuede/_outputs/libya_ndc/model_output_strategy_1.csv (shape: (21, 1336))
Saved output: /Users/fabianfuentes/git/sisepuede/_outputs/libya_ndc/model_output_strategy_2.csv (shape: (21, 1139))

## Step 5: Writing Status Files

Agent 3 complete. Status: COMPLETE
Results: [0, 1, 2] strategies ran successfully
Strategy 0 2035 total: -233150555156897143026789191246170046287361886650368.000 MT CO2e
Strategy 1 2035 total: -205207883691193323127971912253208679274459820982272.000 MT CO2e
Strategy 2 2035 total: -160511976051930333364103951479737033380726824763392.000 MT CO2e
