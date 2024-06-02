import sys 
import os

## Set SISEPUEDE model repository
SSP_PYTHON_PATH = '/home/milo/Documents/egap/SISEPUEDE/sisepuede/python'
sys.path.append(SSP_PYTHON_PATH)

## Variable to process
var_energy_to_process = sys.argv[1]
#var_energy_to_process = "nemomod_entc_frac_min_share_production_pp_biomass"

# Set directories
DIR_PATH = os.path.dirname(os.path.realpath(__file__))
#DIR_PATH = os.getcwd()

SOURCES_PATH = os.path.abspath(os.path.join(DIR_PATH,"..","raw_data" )) 

SAVE_PATH_HISTORICAL = os.path.abspath(os.path.join(DIR_PATH,"..","input_to_sisepuede" ,"historical" )) 
SAVE_PATH_PROJECTED = os.path.abspath(os.path.join(DIR_PATH,"..","input_to_sisepuede" ,"projected" )) 


from attribute_table import AttributeTable
import datetime
import importlib
import matplotlib.pyplot as plt
import model_attributes as ma
import model_afolu as mafl
import model_ippu as mi
import model_circular_economy as mc
import model_energy as me
import model_electricity as ml
import model_socioeconomic as se
from model_socioeconomic import Socioeconomic
import numpy as np
import os, os.path
import pandas as pd
import re
import setup_analysis as sa
import support_classes as sc
import support_functions as sf
import time
from typing import *
import warnings

importlib.reload(ma)
importlib.reload(sa)
importlib.reload(sf)
importlib.reload(mafl)
importlib.reload(mc)
importlib.reload(mi)
importlib.reload(me)
importlib.reload(se)
importlib.reload(ml)

warnings.filterwarnings("ignore")


##  IMPORT SOME ATTRIBUTES, MODELS, AND SHARED VARIABLES

attr_fuel = sa.model_attributes.get_attribute_table(f"{sa.model_attributes.subsec_name_enfu}")
attr_region = sa.model_attributes.get_other_attribute_table(sa.model_attributes.dim_region)
attr_technology = sa.model_attributes.get_attribute_table(f"{sa.model_attributes.subsec_name_entc}")
attr_time_period = sa.model_attributes.get_dimensional_attribute_table(sa.model_attributes.dim_time_period)
attr_time_slice = sa.model_attributes.get_other_attribute_table(f"time_slice")

# support classes
time_periods = sc.TimePeriods(sa.model_attributes)
regions = sc.Regions(sa.model_attributes)

# set some fields
field_country = "Country"
field_date_string = "date_string"
field_fraction_production = "fraction_production"
field_generation = "generation_gwh"
field_gwp = "max_generation_gwp"
field_iso = "iso_code3"
field_iso_region_attr = "iso_alpha_3"
field_key = "GHD_ID"
field_latitude = "latitude_population_centroid_2020"
field_longitude = "longitude_population_centroid_2020"
field_month = "month"
field_ndays = "n_days"
field_technology = "technology"
field_wb_global_region = "world_bank_global_region"
field_year = "year"

# map each country to ISO code 3 and each code to 
dict_country_to_iso = dict((k, v.upper()) for k, v in attr_region.field_maps.get(f"{attr_region.key}_to_{field_iso_region_attr}").items())
dict_iso_to_country = sf.reverse_dict(dict_country_to_iso)
all_iso = list(dict_iso_to_country.keys())



# call variables from the electric model
model_elec = ml.ElectricEnergy(sa.model_attributes, sa.dir_jl, sa.dir_ref_nemo, initialize_julia = False)
model_energy = me.NonElectricEnergy(sa.model_attributes)

"""
##  Build Residual Capacity Data
- See inline source commenting
- WRI Global Power Plant database: https://datasets.wri.org/dataset/globalpowerplantdatabase
    - Global Energy Observatory, Google, KTH Royal Institute of Technology in Stockholm, Enipedia, World Resources Institute. 2018. Global Power Plant Database. Published on Resource Watch and Google Earth Engine; http://resourcewatch.org/ https://earthengine.google.com/
- powerplant level data may be incomplete, so scale to aggregate statistics from UN http://data.un.org/Data.aspx?d=EDATA&f=cmID%3AEC
- Ocean (wave and tidal) rough lifetimes and efficiencies from 
    - Are Wave and Tidal Energy Plants New Green Technologies? Mélanie Douziech, Stefanie Hellweg, and Francesca Verones. Environmental Science & Technology 2016 50 (14), 7870-7878, DOI: 10.1021/acs.est.6b00156
"""

########################################################
###                                                  ###
###    BUILD NEMOMOD ReserveCapacity INITIAL DATA    ###
###                                                  ###
########################################################

# get data 
#fp_data = "/Users/jsyme/Documents/Projects/FY21/SWCHE131_1000/Data/LAC_global_power_plant_database.csv"
fp_data = os.path.join(SOURCES_PATH,"global_power_plant_database.csv")
df_data_todo = pd.read_csv(fp_data)


########################################################
###                                                  ###
###    GET DATA FROM THE SPECIFIC STATE              ###
###                                                  ###
########################################################


import geopandas as gpd 

usa_states = gpd.read_file(os.path.join(SOURCES_PATH,"us-states.json") )
usa_codes = pd.read_csv(os.path.join(SOURCES_PATH, "usa_states_alpha_code.csv"))

usa_states["alpha_code"] = usa_states["name"].replace({i:j for i,j in usa_codes[["State", "Alpha code"]].to_records(index = False)})
usa_states["name_ssp"] = usa_states.name.str.lower().str.replace(" ","_")

geo_df_data = gpd.GeoDataFrame(
    df_data_todo, geometry=gpd.points_from_xy(df_data_todo.longitude, df_data_todo.latitude), crs="EPSG:4326"
)

usa_geo_df_data = geo_df_data.query("country=='USA'")

alpha_code_usa_state = "LA"
import sys 

#alpha_code_usa_state = sys.argv[1]

print(alpha_code_usa_state)
subset_usa = [usa_states.query(f"alpha_code=='{alpha_code_usa_state}'").geometry.contains(geom).values[0] for geom in usa_geo_df_data.geometry]
usa_geo_df_data = usa_geo_df_data[subset_usa]

#import matplotlib.pyplot as plt 

#base = usa_states.plot(color='white', edgecolor='black')
#usa_geo_df_data.plot(ax=base, marker='o', color='red', markersize=5)

usa_edo_df_data = pd.DataFrame(usa_geo_df_data).drop(columns = "geometry")

df_data = pd.concat([df_data_todo.query("country!='USA'"), usa_edo_df_data], ignore_index = True)

########################################################
###                                                  ###
###    END DATA FROM THE SPECIFIC STATE              ###
###                                                  ###
########################################################
# some cleaning of ISO codes
df_data["country"].replace(
    {
        "KOS": "XKX"
    },
    inplace = True
)

##  integrate aggreate production from UN data to scale up Residual Capacities 
df_un_pp_agg = pd.read_csv(os.path.join(SOURCES_PATH,"UNdata_Export_20240602_003942076.csv"))
    

if False:
    df_data.dropna(
        how = "all", 
        subset = ["estimated_generation_gwh_2017", "estimated_generation_gwh_2016", "estimated_generation_gwh_2015", "estimated_generation_gwh_2014", "estimated_generation_gwh_2013"],
        inplace = True
    )

# assumed lifetimes (baseline) - add sources to attribute table
dict_lifetimes = {
    "Biomass": 25, # https://www.nrel.gov/analysis/tech-footprint.html
    "Other": 50, 
    "Gas": 25, # 22, but set to 25 https://www.eia.gov/todayinenergy/detail.php?id=34172
    "Hydro": 100, # https://www.nrel.gov/docs/fy04osti/34916.pdf
    "Oil": 40, 
    "Nuclear": 30, # https://www.iaea.org/sites/default/files/29402043133.pdf
    "Coal": 50, # https://www.nature.com/articles/s41467-019-12618-3
    "Solar": 30, # https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwiExIeGvL35AhVPKkQIHR1ABJMQFnoECBsQAw&url=https%3A%2F%2Fnews.energysage.com%2Fhow-long-do-solar-panels-last%2F&usg=AOvVaw0rJ8w3zaBIP4b83sJgsKcr
    "Wind": 20, # https://nepis.epa.gov/Exe/ZyNET.exe/P100IL8K.TXT?ZyActionD=ZyDocument&Client=EPA&Index=2011+Thru+2015&Docs=&Query=&Time=&EndTime=&SearchMethod=1&TocRestrict=n&Toc=&TocEntry=&QField=&QFieldYear=&QFieldMonth=&QFieldDay=&IntQFieldOp=0&ExtQFieldOp=0&XmlQuery=&File=D%3A%5Czyfiles%5CIndex%20Data%5C11thru15%5CTxt%5C00000010%5CP100IL8K.txt&User=ANONYMOUS&Password=anonymous&SortMethod=h%7C-&MaximumDocuments=1&FuzzyDegree=0&ImageQuality=r75g8/r75g8/x150y150g16/i425&Display=hpfr&DefSeekPage=x&SearchBack=ZyActionL&Back=ZyActionS&BackDesc=Results%20page&MaximumPages=1&ZyEntry=1&SeekPage=x&ZyPURL
    "Waste": 30, # https://www.pbs.org/newshour/science/is-burning-trash-a-good-way-to-dispose-of-it-waste-incineration-in-charts,
    "Geothermal": 30, # https://geothermal-energy-journal.springeropen.com/articles/10.1186/s40517-021-00183-2
    "Ocean": 34 # mean of 5 plants, from https://pubs.acs.org/doi/10.1021/acs.est.6b00156 ()
}

# real lifetimes are available here
attr_entc = sa.model_attributes.get_attribute_table(sa.model_attributes.subsec_name_entc)
dict_lifetimes = attr_entc.field_maps.get("cat_technology_to_operational_life")


# TEMPORARY (20230424): DROP `OTHER` POWER PLANTS (AFFECTS ONE IN ALBANIA GLOBALLY) AND COGENERATION (UK and USA ONLY—SISEPUEDE NEEDS WORK TO IMP)
fuels_drop = ["Storage"]
fuels_try_before_drop = ["Cogeneration", "Other"]
# setup a dictionary to map some fuels in the database to SISEPUEDE fuels
dict_fuel_repls = {"Petcoke": "Coal"}

# FOR PURPOSES OF INITIAL STATES, SET PETCOKE TO COAL
df_data["primary_fuel"].replace(dict_fuel_repls, inplace = True)
    
    
##  FOR OTHER POWER PLANTS, USE FIRST AVAILABLE NON-PRIMARY FUEL 

# setup regex for other fuel columnsassume less than 10 are specified
regex_other_fuel = re.compile("other_fuel(\d$)")

def get_other_fuel_from_other(
    row: pd.Series,
    dict_repl_fuel: Union[Dict[str, str], None] = None,
    fuels_drop: Union[List[str], None] = None,
    regex_fuel: re.Pattern = re.compile("other_fuel(\d$)")
) -> Union[str, None]:
    """
    Using a row from input data frame, return a fuel based on "other_fuel" if
        primary_fuel is invalid
        
    
    Function Arguments
    ------------------
    - row: Pandas series representing a row from a data frame
    
    Keyword Arguments
    -----------------
    - dict_repl_fuel: dictionary of fuels to replace with other fuels
    - fuels_drop: optional list of fuels to drop
    - regex_fuel: regular expression used to define other_fuels in the row/df
    """
    fields_other_fuel = [x for x in row.index if (regex_other_fuel.match(x) is not None)]
    fields_other_fuel.sort()
    
    if len(fields_other_fuel) == 0:
        return None
    
    fuels_drop = [] if not isinstance(fuels_drop, list) else fuels_drop
    
    # get locations of potentially valid fuels
    vec = np.array(row[fields_other_fuel])
    w = [i for i in range(len(vec)) if isinstance(vec[i], str)]
    
    out = None
    
    if len(w) > 0:
        i = 0
        ind_take = -1
        while i <= len(w):
            ind_take = (
                i 
                if (vec[i] not in fuels_drop) or (vec[i] in dict_repl_fuel.keys())
                else ind_take
            )
            
            if (ind_take >= 0):
                break 
            i += 1
            
        out = vec[w[i]] if (i < len(w)) else out
        out = dict_repl_fuel.get(out, out)
        
    return out



if len(df_data["primary_fuel"][df_data["primary_fuel"].isin(fuels_try_before_drop)]) > 0:
    
    vec_new_pf = np.array(df_data["primary_fuel"])
    
    # try for any of the drop fuels
    inds = df_data[df_data["primary_fuel"].isin(fuels_try_before_drop)].index
    
    for i in inds:
        
        fuel_new = get_other_fuel_from_other(
            df_data.iloc[i], 
            dict_repl_fuel = dict_fuel_repls,
            fuels_drop = fuels_drop + fuels_try_before_drop
        )
        
        vec_new_pf[i] = (
            fuel_new 
            if (fuel_new is not None)
            else (
                "Solar"
                if (df_data["name"].iloc[i] == "Sol")
                else vec_new_pf[i]
            )
        )
     
    df_data["primary_fuel"] = vec_new_pf


        
            
# CONVERT TO FORMAT COMPATIBLE WITH SISEPUEDE

df_data["primary_fuel"] = df_data["primary_fuel"].replace(
    {
        "Hydro": "Hydropower",
        "Waste": "Waste Incineration",
        "Wave and Tidal": "Ocean"
    }
)

# drop any remainining instances of invalid fuels
df_data = df_data[
    ~df_data["primary_fuel"].isin(fuels_drop + fuels_try_before_drop)
].reset_index(drop = True)

all_fuel = list(set(df_data["primary_fuel"]))
dict_repl_fuel = {}
for fuel in all_fuel:
    fuel_new = fuel.lower().replace(" ", "_")
    fuel_new = f"pp_{fuel_new}"
    dict_repl_fuel.update({fuel: fuel_new})
df_data["primary_fuel"] = df_data["primary_fuel"].replace(dict_repl_fuel)



#############################################
#    FILL IN MISSING COMMISSIONING YEARS    #
#############################################

#
# TO FILL MISSING COMMISSION YEARS, GET MEAN COMMISSION YEAR FOR PLANTS BY TYPE IN LAC
# - USE RANDOM NUMBERS WITH A SEED
# - NEED TO ESTIMATE WHEN EXISTING PLANTS GO OFFLINE
# - CAN IMPROVE WITH BETTER INFORMATION LATER
#

# add some really rough numbers for commissionoing years for some plants where there are NO commissioning year data
dict_years_commission = {
    # see 
    "pp_ocean": {
        # https://en.wikipedia.org/wiki/European_Marine_Energy_Centre
        #     "ANDRITZ HYDRO Hammerfest installed their 1MW HS1000 tidal energy converter in 2011"
        "Hammerfest (EMEC)": 2011,
        # https://en.wikipedia.org/wiki/European_Marine_Energy_Centre
        #     "The test site was officially opened by Scotland's First Minister in September 2007"
        "Fall of Warness Tidal Demonstrator (EMEC)": 2007,
        # https://en.wikipedia.org/wiki/Wave_Hub
        "Hayle Wave Hub (Test Site)": 2010,
        # https://www.nsenergybusiness.com/projects/meygen-tidal-power-project/
        #    Offshore installation works for the initial 6MW project was completed in October 2016, while the first electricity was exported to the grid in the month that followed
        "Inner Sound Phase 1A (MeyGen)": 2016,
    }
}

all_plants = list(set(df_data["primary_fuel"]))
dict_mean_commission_year_by_plant = {}
dict_mean_commission_year_by_plant_by_country = {}
dict_std_commission_year_by_plant = {}
dict_std_commission_year_by_plant_by_country = {}

# get global averages
for plant in all_plants:

    df_tmp = df_data[df_data["primary_fuel"] == plant]   

    if len(df_tmp) > 0:

        yr_mean_commission = np.array(df_tmp["commissioning_year"])
        yr_mean_commission = yr_mean_commission[np.where(~np.isnan(yr_mean_commission))[0]]

        if len(yr_mean_commission) == 0:
            yr_mean_commission = dict_years_commission.get(plant)
            yr_mean_commission = (
                np.array(list(yr_mean_commission.values()))
                if yr_mean_commission is not None
                else np.array([])
            )

        yr_std_commission = np.std(yr_mean_commission)
        yr_mean_commission = int(np.round(np.mean(yr_mean_commission)))

        dict_mean_commission_year_by_plant.update({plant: yr_mean_commission})
        dict_std_commission_year_by_plant.update({plant: yr_std_commission})
            

##  GET MEANS BY COUNTRY

df_data_grouped = df_data.groupby([field_country.lower()])

for iso, df in df_data_grouped:

    dict_mean_commission_year_by_plant_by_country.update({iso: {}})
    dict_std_commission_year_by_plant_by_country.update({iso: {}})
    
    for plant in all_plants:
        
        df_tmp = df[df["primary_fuel"] == plant]   
        
        if len(df_tmp) > 0:
            
            yr_mean_commission = np.array(df_tmp["commissioning_year"])
            yr_mean_commission = yr_mean_commission[np.where(~np.isnan(yr_mean_commission))[0]]
            
            if len(yr_mean_commission) == 0:
                yr_mean_commission = dict_mean_commission_year_by_plant.get(plant)
                yr_std_commission = dict_std_commission_year_by_plant.get(plant)
            
            else: 
                yr_std_commission = np.std(yr_mean_commission)
                yr_mean_commission = int(np.round(np.mean(yr_mean_commission)))
            
            dict_mean_commission_year_by_plant_by_country[iso].update({plant: yr_mean_commission})
            dict_std_commission_year_by_plant_by_country[iso].update({plant: yr_std_commission})

            
            
# initialize some components
countries_iso = list(set(df_data[field_country.lower()]))
countries_iso.sort()
df_years = pd.DataFrame({"year": range(1920, 2056)})
# 
max_year_commission = 2020

# set a seed - I just chose 50 - and get some last-line numbers for sampling
np.random.seed(50)
commission_year_no_info = np.mean(df_data["commissioning_year"].dropna()).astype(int)
std_no_info = np.std(df_data["commissioning_year"].dropna()).astype(int)

df_out_total = []


for ind_country, country_iso in enumerate(countries_iso):
    
    df_tmp = (
        df_data[df_data[field_country.lower()] == country_iso]
        .copy()
        .reset_index(drop = True)
    )
    
    # check commision years
    df_na_comissions = df_tmp[df_tmp["commissioning_year"].isna()]
    inds_na_commissions = df_na_comissions.index
    
    for i, ind in enumerate(inds_na_commissions):
        plant = str(df_na_comissions["primary_fuel"].iloc[i])
        
        mu = dict_mean_commission_year_by_plant_by_country.get(country_iso)
        mu = mu.get(plant) if (mu is not None) else commission_year_no_info
        
        sd = dict_std_commission_year_by_plant_by_country.get(country_iso)
        sd = sd.get(plant) if (sd is not None) else std_no_info
        
        rand_yr = int(min(np.random.normal(mu, sd), max_year_commission))
        df_tmp["commissioning_year"].iloc[ind] = rand_yr
        

    df_years_tmp = []
    df_years_out = df_years.copy()
    
    for i in range(len(df_tmp)):
        field_plant = f"plant_{i}"
        plant = str(df_tmp["primary_fuel"].iloc[i])
        commission_year = int(df_tmp["commissioning_year"].iloc[i])
        lifetime = dict_lifetimes.get(plant)
        capacity = float(df_tmp["capacity_mw"].iloc[i])
        
        df_years_merge = pd.DataFrame({
            "year": range(commission_year, commission_year + lifetime), 
            "capacity": capacity,
            "plant": plant
        })
        
        if len(df_years_tmp) == 0:
            df_years_tmp = [df_years_merge for x in range(len(df_tmp))]
        else:
            df_years_tmp[i] = df_years_merge[df_years_tmp[0].columns]
            
    df_years_tmp = pd.concat(df_years_tmp, axis = 0)
    df_years_tmp = df_years_tmp.groupby(["year", "plant"]).agg({"year": "first", "plant": "first", "capacity": "sum"}).reset_index(drop = True)
    #
    df_years_out = pd.merge(df_years_out, df_years_tmp, how = "left")
    df_years_out["capacity"] = df_years_out["capacity"].fillna(0)
    df_years_out = df_years_out.dropna(how = "any", subset = ["plant"]).sort_values(by = ["year", "plant"]).reset_index(drop = True)
    df_years_out[field_country.lower()] = dict_iso_to_country.get(country_iso);
    
    df_years_out = (
        pd.pivot(
            data = df_years_out,
            index = ["year", field_country.lower()], 
            columns = ["plant"], 
            values = "capacity"
        )
        .reset_index()
        .dropna(subset = [field_country.lower()])
    )
    
    df_out = pd.DataFrame()
    for k in df_years_out.columns:
        df_out[k] = df_years_out[k].copy().fillna(0.0)
        
    
    if len(df_out_total) == 0:
        df_out_total = [df_out for x in countries_iso]
    else:
        df_out_total[ind_country] = df_out
    
df_out_total = pd.concat(df_out_total, axis = 0).fillna(0)


##  FORMAT VARIABLES FOR INGESTION

model_elec = ml.ElectricEnergy(
    sa.model_attributes, 
    sa.dir_jl,
    sa.dir_ref_nemo,
    initialize_julia = False
)

fields_rnm = [x for x in attr_entc.key_values if x in df_out_total.columns]
fields_new = sa.model_attributes.build_variable_fields(
    model_elec.modvar_entc_nemomod_residual_capacity,
    restrict_to_category_values = fields_rnm
)
dict_rnm = dict(zip(fields_rnm, fields_new))

#
#  do units conversion
#

units_target = sa.model_attributes.get_variable_characteristic(
    model_elec.modvar_entc_nemomod_residual_capacity, 
    sa.model_attributes.varchar_str_unit_power
)
scalar = sa.model_attributes.get_power_equivalent("mw", units_target)

for field in fields_rnm:
    df_out_total[field] = np.array(df_out_total[field])*scalar


df_out_total.rename(columns = dict_rnm, inplace = True)
fields_ind = [x for x in ["year", "country"] if x in df_out_total.columns]
fields_dat = sorted([x for x in df_out_total.columns if (x not in fields_ind)])

df_out_total = df_out_total[fields_ind + fields_dat]



df_out_total["iso_alpha_3"] = df_out_total["country"].replace({i:j for i,j in attr_region.table[["region","iso_alpha_3"]].to_records(index = False)})

df_out_total.query("country=='united_states_of_america'").set_index(["year","country"]).sum()

#  Build MinShareProduction data 
# NOTE: IEA puts these out monthly, easy to update regularly
fp_prod_elec = "/home/milo/Documents/egap/clases/licenciatura/concentracion/mod04/2024/local/asesorias/ENERGY_DATA/monthly_electricity/MES_0224.csv"


##  CATEGORIES TO IGNORE IN OUTPUT

categories_ignore = ["pp_waste_incineration", "pp_biogas", "pp_biomass"]

##  FIELDS

field_iea_balance = "Balance"
field_iea_country = "Country"
field_iea_product = "Product"
field_iea_time = "Time"
field_iea_unit = "Unit"
field_iea_value = "Value"


# 'Other Combustible Non-Renewables',
# 'Other Renewables',


##  SOME DICTIONARIES

# replace IEA products with SISEPUEDE powerplants
dict_repl_iea_product = {
    "Coal, Peat and Manufactured Gases": "pp_coal",
    "Combustible Renewables": "pp_biomass",
    "Oil and Petroleum Products": "pp_oil",
    "Natural Gas": "pp_gas",
    "Hydro": "pp_hydropower",
    "Solar": "pp_solar",
    "Geothermal": "pp_geothermal",
    "Nuclear": "pp_nuclear",
    "Other Renewables": "pp_ocean",
    "Wind": "pp_wind",
}

dict_wb_region_to_regions = sf.group_df_as_dict(
    attr_region.table,
    [field_wb_global_region],
    fields_out_set = attr_region.key
)
dict_region_to_wb_region = attr_region.field_maps.get(f"{attr_region.key}_to_{field_wb_global_region}")



###################
#    FUNCTIONS    #
###################

def time_str_to_month_year(
    date_str: str,
    format_str: str = "%B %Y"
) -> Tuple[int, int]:
    """
    Convert date string date_str using format_str to (month, year)
        tuple of ints
    """
    dt = datetime.datetime.strptime(date_str, format_str)
    
    return (dt.month, dt.year)



def clean_production_df(
    df_in: pd.DataFrame,
    cats_drop: Union[List[str], None] = None,
    field_country: str = field_country,
    field_iso: str = field_iso,
    field_technology: str = field_technology,
    **kwargs,
) -> pd.DataFrame:
    """
    Clean electricity production data frame df_in
    """
    df_in[field_iso] = get_isos_from_iea(
        df_in,  
        field_country = field_country,
        **kwargs
    )
    df_in.drop([field_country], axis = 1, inplace = True)
    
    if cats_drop is not None:
        df_in = df_in[
            ~df_in[field_technology].isin(cats_drop)
        ].reset_index(drop = True)
        
    return df_in



def estimate_msp_from_residual_capacity(
    df_residual_capacity: pd.DataFrame,
    df_years: pd.DataFrame,
    model_elec: ml.ElectricEnergy,
    average_mix: float = 0.25,
    categories_keep: Union[list, None] = None,
    df_average_msp: Union[pd.DataFrame, None] = None,
    field_iso: str = field_iso,
    field_year: str = field_year,
    max_total_scalar: float = 1.0,
) -> Union[pd.DataFrame, None]:
    """
    Estimate MSP from residual capacity if it is not present. Can pass optional 
        df_average_msp MSP to mix with estimates (integrate regional behavior).
        
    Function Arguments
    ------------------
    - df_residual_capacity: residual capacities to use. Must contain only 1 iso code.
    - df_years: data frame containing years to merge to. Must contain field year
    - model_elec: ElectricEnergy model to pass for variables
    
    Keyword Arguments
    -----------------
    - average_mix: fraction of average to mix in. Default is 0.25.
    - categories_keep: optional list of categories to reduce to
    - df_average_msp: data frame containing average minimum share of production 
    - field_iso: field containing iso code
    - field_year: field containing year
    - max_total_scalar: optional scalar to give some room
    """
    
    # init
    average_mix = max(min(average_mix, 1.0), 0.0)
    if len(df_residual_capacity[field_iso].unique()) > 1:
        return None

    # initialize some model elements
    matt = model_elec.model_attributes
    modvar_msp = model_elec.modvar_entc_nemomod_min_share_production
    modvar_rc = model_elec.modvar_entc_nemomod_residual_capacity
    
    # get categories to operate on 
    cats_msp = matt.get_variable_categories(modvar_msp)
    cats_rc = matt.get_variable_categories(modvar_rc)
    cats_shared = [
        x for x in model_elec.get_entc_cat_by_type("pp")
        if x in (set(cats_msp) & set(cats_rc))
    ]
    if sf.islistlike(categories_keep):
        categories_keep = list(categories_keep)
        cats_shared = [x for x in cats_shared if x in categories_keep]
    
    
    # build variables
    vars_msp_all = matt.build_variable_fields(
        modvar_msp,
    )
    vars_msp_shared = matt.build_variable_fields(
        modvar_msp,
        restrict_to_category_values = cats_shared,
    )
    vars_rc_shared = matt.build_variable_fields(
        modvar_rc,
        restrict_to_category_values = cats_shared,
    )
    
    # initialize output
    df_return = pd.DataFrame(
        np.zeros((df_residual_capacity.shape[0], len(vars_msp_all))),
        columns = cats_msp,
    )
    df_return[field_year] = list(df_residual_capacity[field_year])
    

    for cat in cats_shared:
        
        var_msp_cur = matt.build_variable_fields(
            modvar_msp,
            restrict_to_category_values = [cat],
        )[0]
        var_rc_cur = matt.build_variable_fields(
            modvar_rc,
            restrict_to_category_values = [cat],
        )[0]
        
        if var_rc_cur in df_residual_capacity.columns:
            df_return[cat] = list(df_residual_capacity[var_rc_cur])
        
    # normalize
    vec_rc_total = np.array(df_return[cats_shared].sum(axis = 1))
    for field in cats_shared:
        df_return[field] = np.nan_to_num(
            max_total_scalar*np.array(df_return[field])/vec_rc_total,
            0.0
        )

 
    # merge to years and interpolate
    df_return = (
        pd.merge(
            df_years,
            df_return,
            how = "left"
        )
        .interpolate(method = "bfill")
        .interpolate(method = "ffill")
    )
        
    return df_return



def get_and_format_electricity_production(
    fp_in: str,
    balance_elec: str = "Net Electricity Production",
    dict_repl_iea_product: Dict[str, str] = dict_repl_iea_product,
    field_balance: str = field_iea_balance,
    field_month: str = field_month,
    field_product: str = field_iea_product,
    field_time: str = field_iea_time,
    field_year: str = field_year,
    year_min: int = 2010,
) -> Union[pd.DataFrame, None]:
    """
    Function Arguments
    ------------------
    - fp_in: path to input data frame
    
    Keyword Arguments
    -----------------
    - balance_elec: value in field_balance associated with electricity production
    - dict_repl_iea_product: dictionary mapping IEA Product values to SISEPUEDE
        electricity generation technologies (used for allocation)
    - field_balance: field storing IEA balances in the MES table
    - field_month: field with months
    - field_product: field storing IEA input products (fuels) associated with
        electricity produciton
    - field_time: field storing IEA time
    - field_year: field with year
    - year_min: minimum year to use for average factor
    """
    
    if not os.path.exists(fp_in):
        return None
    
    
    ##  READ IN PRODUCTION AND ADD/CLEAN SOME FIELDS
    
    df_production = pd.read_csv(
        fp_in, 
        encoding = "cp1252",
        skiprows = 8
    )
    
    # select balance that is needed
    df_production = df_production[
        df_production[field_balance].isin([balance_elec])
    ].drop([field_balance], axis = 1)
    
    # replace fields and drop any products that are unneeded
    df_production[field_product].replace(dict_repl_iea_product, inplace = True)
    df_production = df_production[
        df_production[field_product].isin(list(dict_repl_iea_product.values()))
    ].reset_index(drop = True)
    
    # add month/year
    df_production = pd.concat(
        [
            df_production.drop(field_time, axis = 1),
            pd.DataFrame(
                list(
                    df_production[field_time].apply(time_str_to_month_year)
                ),
                columns = [field_month, field_year]
            )
        ],
        axis = 1
    )
    
    return df_production
    
    
    
def get_electricity_production_dictionary(
    df_in: Union[pd.DataFrame, str],    
    dict_rename_output: Union[Dict[str, str], None] = None,
    field_country: str = field_iea_country,
    field_month: str = field_month,
    field_product: str = field_iea_product,
    field_unit: str = field_iea_unit,
    field_value: str = field_iea_value,
    field_year: str = field_year,
    key_annual_prod_proportions: str = "annual_production_proportions",
    key_avg_prod_proportions: str = "average_annual_production_proportions",
    model_attributes: ma.ModelAttributes = sa.model_attributes,
    time_periods: Union[sc.TimePeriods, None] = None,
    **kwargs
) -> Union[Dict[str, pd.DataFrame], None]:
    """
    Return a dictionary of different averages for electricity production

    Function Arguments
    ------------------
    - df_in: data frame containing production data OR file path to 
        production data to read in (IEA MES file)

    Keyword Arguments
    -----------------
    - dict_rename_output: dictionary to rename output fields. If None, 
        returns DataFrame with IEA fields
    - field_country: field storing IEA country/regions
    - field_month: field with months
    - field_product: field storing IEA input products (fuels) associated 
        with electricity produciton
    - field_unit: field storing IEA Units
    - field_value: field storing IEA values
    - field_year: field with year
    - key_annual_prod_proportions: output dictionary key storing annual 
        production proportions by SISEPUEDE power plant type
    - key_avg_prod_proportions: output dictionary key storing average 
        production proportions by SISEPUEDE power plant type (across years)
    - model_attributes: ModelAttributes object used to determine time period 
        and key fields
    - time_periods: optional TimePeriods object used to map years to time 
        periods
    - **kwargs: passed to get_and_format_electricity_production if df_in is 
        a string
    """
    
    ##  INITIALIZATION
    
    attr_region = model_attributes.get_other_attribute_table(model_attributes.dim_region)
    attr_time_period = model_attributes.get_dimensional_attribute_table(model_attributes.dim_time_period)
    time_periods = sc.TimePeriods(model_attributes) if (time_periods is None) else time_periods
    
    df_in = (
        get_and_format_electricity_production(
            df_in,
            field_month = field_month,
            field_product = field_product,
            field_year = field_year,
            **kwargs
        )
        if isinstance(df_in, str)
        else (df_in if isinstance(df_in, pd.DataFrame) else None)
    )
    
    if df_in is None:
        return None
    
    
    ##  GET AGGREGATIONS
    
    # initialize output
    dict_out = {}
    
    # check acceptable years
    years_keep = []
    df_in_grouped = df_in.groupby([field_year])
    for yr, df in df_in_grouped:
        years_keep.append(yr[0]) if (len(set(df[field_month])) == 12) else None

    # total production by fuel (product) for each year
    df_production_annual_total = sf.simple_df_agg(
        df_in[
            df_in[field_year].isin(years_keep)
        ].drop([field_unit, field_month], axis = 1),
        [
            field_country, 
            field_product,
            field_year
        ],
        {
            field_value: "sum"
        }
    )
    
    # get production fractions by year and update dictionary
    df_production_fractions_annual = sf.get_cols_as_grouped_proportions(
        df_production_annual_total, 
        [field_iea_value], 
        [field_iea_country, field_year],
        drop_if_zero_sum = True
    )
    dict_out.update({key_annual_prod_proportions: df_production_fractions_annual})
    
    
    # get averages across years and add to output dictionary
    
    df_production_fractions_mean = []
    
    df_pfm_grouped = (
        df_production_fractions_annual
        .groupby([field_country])
    )
    
    for country, df in df_pfm_grouped:
        df_cur = sf.simple_df_agg(
            df,
            [
                field_country,
                field_product
            ],
            {
                field_iea_value: "sum"
            }
        )
        
        df_cur[field_iea_value] = np.array(df_cur[field_iea_value])/len(df[field_year].unique())
        df_production_fractions_mean.append(df_cur)
        
        
    df_production_fractions_mean = (
        pd.concat(df_production_fractions_mean, axis = 0)
        .reset_index(drop = True)
    )
    dict_out.update({key_avg_prod_proportions: df_production_fractions_mean})

    
    ##  SOME UPDATES TO EACH DATAFRAME
    
    for k in dict_out.keys():
        df_tmp = dict_out.get(k)
        
        # add time period
        if field_year in df_tmp.columns:
            df_tmp[attr_time_period.key] = df_tmp[field_year].apply(time_periods.year_to_tp)
    
        # rename
        if dict_rename_output is not None:
            dict_rnm_tmp = {}
            for r, v in dict_rename_output.items():
                dict_rnm_tmp.update({r: v}) if (r in df_tmp.columns) else None

            df_tmp.rename(columns = dict_rnm_tmp, inplace = True)
        
        
    return dict_out




#
#   ADD TO REGIONS CLASS
#
def get_isos_from_iea(
    df_in: pd.DataFrame,
    attr_region: AttributeTable = attr_region,
    field_country: str = field_country,
    field_iso_attr_region: str = field_iso_region_attr,
) -> np.ndarray:
    """
    Map IEA countries in field_country to ISO codes
    """
    dict_country_to_iso = attr_region.field_maps.get(f"{attr_region.key}_to_{field_iso_attr_region}")
    
    # some generic replacements
    dict_repl_consumption = {
        "czech_republic": "czechia",
        "korea": "republic_of_korea",
        "people's_republic_of_china": "china",
        "republic_of_turkiye": "turkey",
        "slovak_republic": "slovakia",
        "united_states": "united_states_of_america"
    }

    vec_iso = [x.lower().replace(" ", "_") for x in list(df_in[field_country])]
    vec_iso = [dict_repl_consumption.get(x, x) for x in vec_iso]
    vec_iso = [dict_country_to_iso.get(x, x) for x in vec_iso]
    
    return np.array(vec_iso)



##############
#    MAIN    #
##############

# retrieve and clean
dict_rnm_elec_prods = {
    field_iea_product: field_technology,
    field_iea_value: field_fraction_production,
}
dfs_production_by_country = get_electricity_production_dictionary(
    fp_prod_elec,
    dict_rename_output = dict_rnm_elec_prods
)
df_production_by_country = dfs_production_by_country.get("annual_production_proportions")
df_avg_production_by_country = dfs_production_by_country.get("average_annual_production_proportions")



##  CLEAN FIELDS AND DATA FRAMES
cats_entc_drop = None
#  drop integrated techs for now
df_production_by_country = clean_production_df(
    df_production_by_country,
    cats_drop = cats_entc_drop
)

df_avg_production_by_country = clean_production_df(
    df_avg_production_by_country,
    cats_drop = cats_entc_drop
)



#set sets of tech & isos available
all_technology = sorted(list(df_production_by_country[field_technology].unique()))
all_iso_defined_in_production = sorted(list(df_production_by_country[field_iso].unique()))

# get all years and techs to merge to
years_merge = range(
    min(df_production_by_country[field_year]), 
    max(df_production_by_country[field_year]) + 1
)
df_left = pd.DataFrame({field_year: years_merge})
df_left = sf.explode_merge(
    df_left,
    pd.DataFrame({field_technology: all_technology})
)
df_left = sf.explode_merge(
    df_left,
    pd.DataFrame({field_iso: all_iso_defined_in_production})
)

# merge to all years/techs available and fill missing fractions with 0
df_production_by_country = pd.merge(
    df_left, 
    df_production_by_country,
    how = "left"
)
df_production_by_country[sa.model_attributes.dim_time_period] = df_production_by_country[field_year].apply(time_periods.year_to_tp).astype(int)

# clean the time period and group by country; group and iterate to     
df_production_by_country = sf.pivot_df_clean(
    df_production_by_country,
    [field_technology],
    [field_fraction_production]
)

# interpolate (backfill) missing years
df_production_by_country_list = []
df_production_by_country_grouped = df_production_by_country.groupby([field_iso])
fields_data = [x for x in df_production_by_country if x not in [field_iso, field_year, attr_time_period.key]]

for iso, df in df_production_by_country_grouped:
    
    for i in range(len(df)):
        if np.abs(df[fields_data].iloc[i].sum() - 1.0) < 0.000001:
            df.iloc[i] = df.iloc[i].fillna(0.0)
            
    df[fields_data] = df[fields_data].interpolate()
    df[fields_data] = df[fields_data].interpolate(method = "bfill")
    
    df_production_by_country_list.append(df)
    
df_production_by_country = pd.concat(df_production_by_country_list, axis = 0).reset_index(drop = True)

df_out = [
    df_production_by_country
]



##  NEXT, EXPAND TO ALL YEARS

years_merge = range(
    max(df_production_by_country[field_year]) + 1, 
    max(attr_time_period.table[field_year]) + 1
)
df_left = pd.DataFrame({field_year: years_merge})
df_left = sf.explode_merge(
    df_left,
    pd.DataFrame({field_technology: all_technology})
)
df_left = sf.explode_merge(
    df_left,
    pd.DataFrame({field_iso: all_iso_defined_in_production})
)

# use averages for all future dates 
df_production_by_country_append = pd.merge(
    df_left,
    df_avg_production_by_country,
    how = "left"
)


df_production_by_country_append = sf.pivot_df_clean(
    df_production_by_country_append,
    [field_technology],
    [field_fraction_production]
).fillna(0.0)

# clean the time period
df_production_by_country_append[sa.model_attributes.dim_time_period] = df_production_by_country_append[
    field_year
].apply(time_periods.year_to_tp).astype(int)

df_out += [
    df_production_by_country_append
]


# concatenate
df_out = (
    pd.concat(df_out, axis = 0)
    .sort_values(by = [field_iso, field_year])
    .reset_index(drop = True)
)

df_out

########################################################






##  FORMAT OUTPUT DATASET

fields_group = [field_year, attr_time_period.key, field_iso]
fields_data = [x for x in attr_technology.key_values if x in df_out.columns]

# name as MSP variable
modvar = model_elec.modvar_entc_nemomod_min_share_production
subsec = model_elec.model_attributes.get_variable_subsector(modvar)
fields_new = sa.model_attributes.build_variable_fields(
    modvar,
    restrict_to_category_values = fields_data
)

df_out = df_out.rename(columns = {"_".join(i.split("_")[-2:]):"nemomod_entc_frac_min_share_production_" + "_".join(i.split("_")[-2:]) for i in df_out.columns[3:]})

usa_state_ssp_name =  usa_states.query(f"alpha_code=='{alpha_code_usa_state}'")["name_ssp"].values[0]

df_out = df_out.query("iso_code3=='USA'").reset_index(drop=True)
df_out["region"] = usa_state_ssp_name
df_out["iso_code3"] = alpha_code_usa_state


## Define historical and projected data
#df_out_usa_state_total["iso_code3"] = "LA"
df_out = df_out[["iso_code3", "region", "year" ,var_energy_to_process]]
df_out.columns = ["iso_code3", "Region", "Year", var_energy_to_process]

historical_df_out_usa_state_total = df_out.query("Year>=2015 and Year <=2024").reset_index(drop = True)
projected_df_out_usa_state_total = df_out.query("Year>=2025 and Year <=2050").reset_index(drop = True)

## Save data

historical_df_out_usa_state_total.to_csv(os.path.join(SAVE_PATH_HISTORICAL, f"{var_energy_to_process}.csv"), index = False)
projected_df_out_usa_state_total.to_csv(os.path.join(SAVE_PATH_PROJECTED, f"{var_energy_to_process}.csv"), index = False)

