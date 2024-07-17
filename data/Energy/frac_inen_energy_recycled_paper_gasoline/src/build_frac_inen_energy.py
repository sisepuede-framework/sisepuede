import pandas as pd
import matplotlib.pyplot as plt
import os 
import numpy as np 
import sys 

## Load local sources .py files
from sectors_assumptions import industries_correspondence, fuels_correspondence, industries_correspondence_recycled
from utilities import build_path, plot_area_value

#import tensorflow as tf
#import tensorflow_probability as tfp
from statsmodels.tsa.api import VAR
from statsmodels.tsa.base.datetools import dates_from_str

## Set directories
#dir_path = os.path.dirname(os.path.realpath(__file__))
FILE_PATH = os.getcwd()
DATA_PATH = build_path([FILE_PATH, "..","raw_data"])
SAVE_PATH_HISTORICAL = build_path([FILE_PATH, "..","input_to_sisepuede" ,"historical"])
SAVE_PATH_PROJECTED = build_path([FILE_PATH, "..","input_to_sisepuede" ,"projected"])

## Load IEA Energy Efficiency Indicators Database

# Define path
IEA_EEID_FILE_PATH  = build_path([DATA_PATH, "iea_industry_energy.csv.bz2"])

# Load data
eeid = pd.read_csv(IEA_EEID_FILE_PATH)

# Subset 'United States' data
eeid = eeid.\
            query("Country=='United States'").\
            reset_index(drop= True).\
            drop(columns = "Country")

# Fix Product column
eeid.Product = eeid.Product.str.strip()

# Convert from wide to long
leeid = eeid.melt(id_vars=["Subsector", "Product"])

# Replace ".." for np.nan
leeid["value"] = leeid["value"].replace("..", np.nan)
leeid.value = leeid.value.astype(float)

## We will apply a VAR model for each Subsector in order to project data to 2050


# Prepare data
store_projected_data = []

lag_order = 1
n_time_period_forecast = 30

for subsector in leeid.Subsector.unique():
    #subsector = 'Manufacturing [ISIC 10-18; 20-32]'

    if subsector != "Of which: cement":
        print(subsector)
        ydata = leeid[leeid["Subsector"]==subsector].pivot(index='variable', columns='Product', values='value').drop(columns='Total final energy use (PJ)')

        # Transform dta
        data = np.log(ydata)

        # Instance VAR model
        model = VAR(ydata)

        # Fit VAR model
        results = model.fit(lag_order, trend='ct')

        # Plot forecast
        results.plot_forecast(n_time_period_forecast)
        plt.show()

        # Get forecast values
        forecast_values = results.forecast(ydata.values[-lag_order:], n_time_period_forecast)

        energy_product_forecast = pd.DataFrame(forecast_values, columns = ydata.columns, index=range(2021,2051))
        energy_product_forecast.index.name = "variable"

        complete_data = pd.concat([ydata, energy_product_forecast]).reset_index()
        complete_data["Subsector"] = subsector

        wcomplete_data = complete_data.melt(id_vars=["Subsector", "variable"])

        wcomplete_data.loc[wcomplete_data["value"]<0, "value"] = 0.0

        store_projected_data.append(wcomplete_data)

leeid_projected = pd.concat(store_projected_data, ignore_index = True)

# Apply crosswalk to fuels
cw_fuels_ssp = []
for k,v in fuels_correspondence.items():
    if isinstance(v,tuple):
        partial_leeid = leeid_projected.query(f"Product =='{v[1]}'")
        partial_leeid["value"] = partial_leeid["value"]*v[0]
        partial_leeid["Product"] = partial_leeid["Product"].replace( {v[1] : k})
        cw_fuels_ssp.append(partial_leeid)

# Concat dataframes
df_cw_fuels_ssp = pd.concat(cw_fuels_ssp, ignore_index = True)

# Apply crosswalk to IEA-sisepuede industries
ssp_industries_cw = []

for sisepuede_ind, cw_iea_indus_list in industries_correspondence.items():

    partial_fuel_cw = []
    for ponderador, iea_industry in cw_iea_indus_list:
        individual_df = df_cw_fuels_ssp[df_cw_fuels_ssp["Subsector"]==iea_industry]
        individual_df.loc[:,"value"]  = individual_df["value"]*ponderador
        partial_fuel_cw.append(individual_df)
    
    partial_fuel_cw = pd.concat(partial_fuel_cw)
    partial_fuel_cw.loc[:,"Subsector"] = sisepuede_ind
    
    partial_fuel_cw = partial_fuel_cw.groupby(["Subsector", "Product", "variable"]).sum().reset_index()

    ssp_industries_cw.append(partial_fuel_cw)

# Concat data frames
df_ssp_industries_cw = pd.concat(ssp_industries_cw, ignore_index = True)

# Define sisepuede variable name 
df_ssp_industries_cw["sisepuede_var"] = "frac_inen_energy_" + df_ssp_industries_cw["Subsector"] + "_" +df_ssp_industries_cw["Product"]

# Convert year to int and rename it to "Year"
df_ssp_industries_cw["variable"] = df_ssp_industries_cw["variable"].astype(int)
df_ssp_industries_cw = df_ssp_industries_cw.rename(columns = {"variable" : "Year"})

## Compute share of fuel type in industrial sector
df_ssp_industries_cw["frac_inen"] = df_ssp_industries_cw.groupby(["Subsector", "Year"])["value"].transform(lambda x: x/x.sum())

### Test shares
#mapping_col_val = {"Subsector" : "agriculture_and_livestock"}
#mapping_columns_to_pivot = {"index" : "Year", "columns" : "Product", "values" : "frac_inen"}
#plot_area_value(df_ssp_industries_cw, mapping_col_val, mapping_columns_to_pivot)

for ssp_subsector in df_ssp_industries_cw.Subsector.unique():
    mapping_col_val = {"Subsector" : ssp_subsector}
    mapping_columns_to_pivot = {"index" : "Year", "columns" : "Product", "values" : "frac_inen"}
    plot_area_value(df_ssp_industries_cw, mapping_col_val, mapping_columns_to_pivot)

## Keep minimal columns and change dataframe to wide
df_ssp_industries_cw_w = df_ssp_industries_cw[["sisepuede_var", "Year", "frac_inen"]].pivot(index = "Year", columns = "sisepuede_var", values = "frac_inen")
# fill nan
df_ssp_industries_cw_w = df_ssp_industries_cw_w.fillna(0)

## Build data for recycled production. Assumption : recycled production will be the same that original production 
acumula_reciclados = []

for ssp_var, recycled in industries_correspondence_recycled.items():
    columnas_a_cambiar = [i for i in df_ssp_industries_cw_w.columns if ssp_var in i]
    df_recycled = df_ssp_industries_cw_w[columnas_a_cambiar]

    df_recycled = df_recycled.rename(columns = {i:i.replace(ssp_var, recycled) for i in columnas_a_cambiar})

    acumula_reciclados.append(df_recycled)

df_todo_reciclado = pd.concat(acumula_reciclados, axis = 1)

# Concat recycled and no-recycled production
df_ssp_industries_cw_w = pd.concat([df_ssp_industries_cw_w, df_todo_reciclado], axis = 1)

# The next variable will be 0.0. We haven´t yet a better assumption to build the data for these variable field
zero_variable_field = ['frac_inen_energy_mining_kerosene',
 'frac_inen_energy_recycled_plastic_kerosene', 'frac_inen_energy_recycled_metals_hydrocarbon_gas_liquids', 'frac_inen_energy_rubber_and_leather_kerosene', 'frac_inen_energy_metals_hydrocarbon_gas_liquids',
 'frac_inen_energy_recycled_rubber_and_leather_kerosene', 'frac_inen_energy_plastic_kerosene', 'frac_inen_energy_other_product_manufacturing_kerosene', 'frac_inen_energy_recycled_rubber_and_leather_hydrocarbon_gas_liquids',
 'frac_inen_energy_textiles_hydrocarbon_gas_liquids', 'frac_inen_energy_recycled_metals_kerosene', 'frac_inen_energy_wood_hydrocarbon_gas_liquids', 'frac_inen_energy_chemicals_kerosene',
 'frac_inen_energy_textiles_kerosene', 'frac_inen_energy_recycled_wood_kerosene', 'frac_inen_energy_recycled_textiles_kerosene', 'frac_inen_energy_lime_and_carbonite_hydrocarbon_gas_liquids',
 'frac_inen_energy_wood_kerosene', 'frac_inen_energy_electronics_kerosene', 'frac_inen_energy_other_product_manufacturing_hydrocarbon_gas_liquids', 'frac_inen_energy_cement_kerosene',
 'frac_inen_energy_recycled_plastic_hydrocarbon_gas_liquids', 'frac_inen_energy_recycled_glass_hydrocarbon_gas_liquids', 'frac_inen_energy_recycled_textiles_hydrocarbon_gas_liquids', 'frac_inen_energy_glass_kerosene',
 'frac_inen_energy_paper_hydrocarbon_gas_liquids', 'frac_inen_energy_recycled_paper_hydrocarbon_gas_liquids', 'frac_inen_energy_chemicals_hydrocarbon_gas_liquids', 'frac_inen_energy_paper_kerosene',
 'frac_inen_energy_recycled_paper_kerosene', 'frac_inen_energy_recycled_wood_hydrocarbon_gas_liquids', 'frac_inen_energy_electronics_hydrocarbon_gas_liquids', 'frac_inen_energy_plastic_hydrocarbon_gas_liquids',
 'frac_inen_energy_cement_hydrocarbon_gas_liquids', 'frac_inen_energy_mining_geothermal', 'frac_inen_energy_recycled_glass_kerosene', 'frac_inen_energy_rubber_and_leather_hydrocarbon_gas_liquids',
 'frac_inen_energy_mining_hydrocarbon_gas_liquids', 'frac_inen_energy_lime_and_carbonite_kerosene', 'frac_inen_energy_glass_hydrocarbon_gas_liquids', 'frac_inen_energy_metals_kerosene']

df_ssp_industries_cw_w[zero_variable_field] = 0.0

### Save results
FRAC_INEN_SSP_LA_PATH = build_path([DATA_PATH, "frac_inen_sisepuede_industry_fuels_data.csv"])

df_ssp_industries_cw_w.to_csv(FRAC_INEN_SSP_LA_PATH)