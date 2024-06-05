import pandas as pd
import os
import sys

## Variable to process
var_energy_to_process = sys.argv[1]
#var_energy_to_process = "nemomod_entc_renewable_energy_tag_pp_biogas"
# Set directories
DIR_PATH = os.path.dirname(os.path.realpath(__file__))
#DIR_PATH = os.getcwd()

SOURCES_PATH = os.path.abspath(os.path.join(DIR_PATH,"..","raw_data" )) 

SAVE_PATH_HISTORICAL = os.path.abspath(os.path.join(DIR_PATH,"..","input_to_sisepuede" ,"historical" )) 
SAVE_PATH_PROJECTED = os.path.abspath(os.path.join(DIR_PATH,"..","input_to_sisepuede" ,"projected" )) 


frac_min_share_production_fp = {
                            "nemomod_entc_frac_min_share_production_fp_hydrogen_electrolysis" : 0.0,
                            "nemomod_entc_frac_min_share_production_fp_hydrogen_gasification" : 0.0,
                            "nemomod_entc_frac_min_share_production_fp_hydrogen_reformation" : 0.0
                            }

## Build dataframe
df_renewable_tags = pd.DataFrame({k:[v] for k,v in frac_min_share_production_fp.items()})

## Build lousiana template
time_period = range(2015, 2051)
template = pd.DataFrame({"iso_code3" : ["LA"]*len(time_period), "Region" : ["louisiana"]*len(time_period), "Year" : time_period})

## Merge dataframes
all_lousiana_renewable_tags = template.merge(right=df_renewable_tags, how="cross")
all_lousiana_renewable_tags = all_lousiana_renewable_tags[["iso_code3", "Region", "Year", var_energy_to_process]]


## Define historical and projected data
historical_all_lousiana_renewable_tags = all_lousiana_renewable_tags.query("Year>=2015 and Year <=2024").reset_index(drop = True)
projected_all_lousiana_renewable_tags = all_lousiana_renewable_tags.query("Year>=2025 and Year <=2050").reset_index(drop = True)

## Save data
historical_all_lousiana_renewable_tags.to_csv(os.path.join(SAVE_PATH_HISTORICAL, f"{var_energy_to_process}.csv"), index = False)
projected_all_lousiana_renewable_tags.to_csv(os.path.join(SAVE_PATH_PROJECTED, f"{var_energy_to_process}.csv"), index = False)