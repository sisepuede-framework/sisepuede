import pandas as pd 
import sys
import os 

from lousiana_raw_data import lousiana_raw_data, correspondencias_web_sisepuede

## Set SISEPUEDE model repository
SSP_PYTHON_PATH = '/home/milo/Documents/egap/SISEPUEDE/sisepuede/python'
sys.path.append(SSP_PYTHON_PATH)

# import the file structure
import sisepuede_file_structure as sfs

## Variable to process
var_energy_to_process = sys.argv[1]
#var_energy_to_process = "exports_enfu_pj_fuel_coal"
# Set directories
DIR_PATH = os.path.dirname(os.path.realpath(__file__))
#DIR_PATH = os.getcwd()

SOURCES_PATH = os.path.abspath(os.path.join(DIR_PATH,"..","raw_data" )) 

SAVE_PATH_HISTORICAL = os.path.abspath(os.path.join(DIR_PATH,"..","input_to_sisepuede" ,"historical" )) 
SAVE_PATH_PROJECTED = os.path.abspath(os.path.join(DIR_PATH,"..","input_to_sisepuede" ,"projected" )) 


# initialize a file structure
file_struct = sfs.SISEPUEDEFileStructure()

# Import model attributes
matt = file_struct.model_attributes

# Load unit convertion tables
unit_energy = matt.get_unit("energy")
#unit_energy.attribute_table
#unit_energy.convert("btu", "pj")

def convert_TBTU2PJ(value : float) -> float:
    return (value * 1e12)*unit_energy.convert("btu", "pj")

## Build dataframes from raw data
production = []
consumption = []

for energy, cw_params in correspondencias_web_sisepuede["exports_enfu_pj_fuel"].items():
    if cw_params:
        cw,params = cw_params

        production.append(
            (energy, convert_TBTU2PJ(lousiana_raw_data[cw]["production"][0] * params))
        )
        consumption.append(
            (energy, convert_TBTU2PJ(lousiana_raw_data[cw]["consumption"][0] * params))
        )
    else:
        production.append((energy, 0))
        consumption.append((energy, 0))

df_production = pd.DataFrame(production, columns = ["ssp_var","production"]).set_index("ssp_var")
df_consumption = pd.DataFrame(consumption, columns = ["ssp_var","consumption"]).set_index("ssp_var")

lousiana_energy = pd.concat([df_production, df_consumption], axis = 1).reset_index()

lousiana_energy["imports"] = (lousiana_energy["production"] - lousiana_energy["consumption"]).apply(lambda x : x*-1 if x < 0 else 0.0)
lousiana_energy["exports"] = (lousiana_energy["production"] - lousiana_energy["consumption"]).apply(lambda x : x if x > 0 else 0.0)

lousiana_energy["frac_imports"] = lousiana_energy["imports"]/lousiana_energy["imports"].sum()

### Reset index for frac_enfu_fuel_demand_imported_pj
lousiana_energy_long = lousiana_energy[["ssp_var", "exports"]].set_index("ssp_var").T.reset_index(drop=True)

time_period = range(2015, 2051)

template = pd.DataFrame({"iso_code3" : ["LA"]*len(time_period), "Region" : ["louisiana"]*len(time_period), "Year" : time_period})

all_lousiana_energy = template.merge(right=lousiana_energy_long, how="cross")

all_lousiana_energy = all_lousiana_energy[["iso_code3", "Region", "Year", var_energy_to_process]]

## Define historical and projected data

historical_all_lousiana_energy = all_lousiana_energy.query("Year>=2015 and Year <=2024").reset_index(drop = True)
projected_all_lousiana_energy = all_lousiana_energy.query("Year>=2025 and Year <=2050").reset_index(drop = True)

## Save data

historical_all_lousiana_energy.to_csv(os.path.join(SAVE_PATH_HISTORICAL, f"{var_energy_to_process}.csv"), index = False)
projected_all_lousiana_energy.to_csv(os.path.join(SAVE_PATH_PROJECTED, f"{var_energy_to_process}.csv"), index = False)