import pandas as pd
import numpy as np
import sys 
import os
 
## Variable to process
var_energy_to_process = sys.argv[1]

#var_energy_to_process = "nemomod_entc_reserve_margin_tag_technology_pp_gas"

# Set directories
DIR_PATH = os.path.dirname(os.path.realpath(__file__))
#DIR_PATH = os.getcwd()

SOURCES_PATH = os.path.abspath(os.path.join(DIR_PATH,"..","raw_data" )) 

RESIDUAL_CAPACITY_FILE_PATH = os.path.join(SOURCES_PATH, "nemomod_entc_residual_capacity.csv")

SAVE_PATH_HISTORICAL = os.path.abspath(os.path.join(DIR_PATH,"..","input_to_sisepuede" ,"historical" )) 
SAVE_PATH_PROJECTED = os.path.abspath(os.path.join(DIR_PATH,"..","input_to_sisepuede" ,"projected" )) 

SAVE_HISTORICAL_FILE_PATH = os.path.join(SAVE_PATH_HISTORICAL, f"{var_energy_to_process}.csv")
SAVE_PROJECTED_FILE_PATH = os.path.join(SAVE_PATH_PROJECTED, f"{var_energy_to_process}.csv")

## Load row data
df_energy = pd.read_csv(RESIDUAL_CAPACITY_FILE_PATH)

# Convert GW to MW
df_energy = (df_energy.set_index(["iso_code3", "Region", "Year"])*1000)

# Estimate Peak Electrical Demand
"""
The reserve margin is calculated following smith (2010): 

            (1)                               (2)                   (3) = (1)-(2)        (4) = (3)/(2)     
Total Generating Capacity (MW)     Peak Electrical Demand (MW)      Reserves (MW)      Reserve Margin (%)
            12,000                            10,000                     2,000                20

For the Peak Electrical Demand, we used the Lousiana's 2030 Energy Efficiency Roadmap report. According to the report, the
peak demand estimated will grow at an average annual rate of 0.8% from 14,283 MW in 2010, to 15,351 MW in 2020 and
16,830 MW in 2030. 
"""

peak_electrical = pd.DataFrame({"time" : range(2009 + 1 , 2009 + 42), "peak_electrical" : [14283*((1+0.008)**i) for i in range(1,42)]})
peak_electrical = peak_electrical.query("time >= 2015").reset_index(drop = True)

# Build residual capacity shares by fuel
df_energy_shares = df_energy/df_energy.sum(axis = 1).to_numpy()[:,np.newaxis]

peak_electrical_demand_by_fuel = df_energy_shares*peak_electrical["peak_electrical"].to_numpy()[:, np.newaxis]
reserves_by_fuel = df_energy - peak_electrical_demand_by_fuel
#reserves_by_fuel[reserves_by_fuel <0] = 0.0

#reserve_margin = (reserves_by_fuel/peak_electrical_demand_by_fuel).replace(np.nan, 0.0)
#reserve_margin = (reserves_by_fuel/peak_electrical_demand_by_fuel).replace(1.0, 0.0)

reserve_margin = (reserves_by_fuel/peak_electrical_demand_by_fuel)

reserve_margin = reserve_margin + 1

reserve_margin = reserve_margin.fillna(0.0)


reserve_margin = reserve_margin.rename(columns = {i : "nemomod_entc_reserve_margin_tag_technology_" + i.replace("_gw", "").replace("nemomod_entc_residual_capacity_", "") for i in reserve_margin.columns})


### Save data

if var_energy_to_process in reserve_margin.columns:

    reserve_margin_by_fuel = reserve_margin[var_energy_to_process].reset_index()

    historical_reserve_margin_by_fuel = reserve_margin_by_fuel.query("Year <2025")
    projected_reserve_margin_by_fuel = reserve_margin_by_fuel.query("Year >=2025")

    historical_reserve_margin_by_fuel.to_csv(SAVE_HISTORICAL_FILE_PATH, index = False)
    projected_reserve_margin_by_fuel.to_csv(SAVE_PROJECTED_FILE_PATH, index = False)
else:
    reserve_margin_by_fuel = pd.DataFrame(index = reserve_margin.index)
    reserve_margin_by_fuel[var_energy_to_process] = 0.0
    reserve_margin_by_fuel = reserve_margin_by_fuel.reset_index()

    historical_reserve_margin_by_fuel = reserve_margin_by_fuel.query("Year <2025")
    projected_reserve_margin_by_fuel = reserve_margin_by_fuel.query("Year >=2025")

    historical_reserve_margin_by_fuel.to_csv(SAVE_HISTORICAL_FILE_PATH, index = False)
    projected_reserve_margin_by_fuel.to_csv(SAVE_PROJECTED_FILE_PATH, index = False)