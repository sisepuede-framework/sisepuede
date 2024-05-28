import os 
import sys
import pandas as pd

# Set directories
dir_path = os.path.dirname(os.path.realpath(__file__))
#dir_path = os.getcwd()

sources_path = os.path.abspath(os.path.join(dir_path,"..","raw_data" ,"USA_transportation_energy_data" )) 

save_path_historical = os.path.abspath(os.path.join(dir_path,"..","input_to_sisepuede" ,"historical" )) 


# Load ISO3 code
lousiana_template = pd.DataFrame({"iso_code3" : ["LA"], "Region" : ["louisiana"]})

# Build and save to csv historical data
#var_energy_to_process = "frac_trns_fuelmix_road_light_biofuels"
var_energy_to_process = sys.argv[1]

file_var_energy_path = os.path.join(sources_path, f"{var_energy_to_process}.csv")

df_var_energy = pd.read_csv(file_var_energy_path)

historical_df_var_energy = lousiana_template.merge(right = df_var_energy, how = "cross") 

save_path_historical = os.path.abspath(os.path.join(dir_path,"..","input_to_sisepuede" ,"historical" )) 

file_save_path_historical = os.path.join(save_path_historical, f"{var_energy_to_process}.csv")
historical_df_var_energy.to_csv(file_save_path_historical, index = False)

# Build and save to csv projected data
last_value = df_var_energy[var_energy_to_process].to_list()[-1]
last_year = df_var_energy["Year"].to_list()[-1]

time_period = range(last_year +1, 2051)

projected_df_var_energy = pd.DataFrame({"Year" : time_period, var_energy_to_process : [last_value]*len(time_period)})

all_projected_df_var_energy = lousiana_template.merge( right = projected_df_var_energy, how = "cross")


save_path_projected = os.path.abspath(os.path.join(dir_path,"..","input_to_sisepuede" ,"projected" )) 

file_save_path_projected = os.path.join(save_path_projected, f"{var_energy_to_process}.csv")

all_projected_df_var_energy.to_csv(file_save_path_projected, index = False)