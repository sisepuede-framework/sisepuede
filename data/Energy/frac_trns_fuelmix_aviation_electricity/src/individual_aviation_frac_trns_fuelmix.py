import os 
import sys
import pandas as pd

# Set directories
dir_path = os.path.dirname(os.path.realpath(__file__))
#dir_path = os.getcwd()


save_path_historical = os.path.abspath(os.path.join(dir_path,"..","input_to_sisepuede" ,"historical" )) 

# Build and save to csv historical data

dict_aviation_fractions = { 'frac_trns_fuelmix_aviation_electricity' : 0.0,
                            'frac_trns_fuelmix_aviation_hydrogen' : 0.13,
                            'frac_trns_fuelmix_aviation_kerosene' : 0.87}

var_energy_to_process = sys.argv[1]
#var_energy_to_process = "frac_trns_fuelmix_aviation_electricity"

time = range(2010, 2020)

df_var_energy = pd.DataFrame({"Year" : time, var_energy_to_process : [dict_aviation_fractions[var_energy_to_process]]*len(time)})
lousiana_template = pd.DataFrame({"iso_code3" : ["LA"], "Region" : ["louisiana"]})

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