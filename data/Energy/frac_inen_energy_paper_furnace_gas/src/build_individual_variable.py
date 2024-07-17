import pandas as pd
from typing import List
import os 
import sys

# Define auxiliary function
def build_path(path_list : List[str]) -> str:
    return os.path.abspath(os.path.join(*path_list)) 

# Get argument
sisepuede_var = sys.argv[1]

# Set directories
FILE_PATH = os.path.dirname(os.path.realpath(__file__))
DATA_PATH = build_path([FILE_PATH, "..","raw_data"])
FRAC_INEN_SSP_LA_PATH = build_path([DATA_PATH, "frac_inen_sisepuede_industry_fuels_data.csv"])
HISTORICAL_FILE_PATH = build_path([DATA_PATH, "..", "input_to_sisepuede", "historical", f"{sisepuede_var}.csv"])
PROJECTED_FILE_PATH = build_path([DATA_PATH, "..", "input_to_sisepuede", "projected", f"{sisepuede_var}.csv"])

## Load frac inen louisiana data
frac_inen_ssp_la = pd.read_csv(FRAC_INEN_SSP_LA_PATH)

## Save historical data
frac_inen_ssp_la["iso_code3"] = "LA"
frac_inen_ssp_la["Region"] = "louisiana"

frac_inen_ssp_la_historical = frac_inen_ssp_la[["iso_code3", "Region", "Year", sisepuede_var]].query("Year<=2020")
frac_inen_ssp_la_historical.to_csv(HISTORICAL_FILE_PATH, index = False)

## Save projected data
frac_inen_ssp_la_projected = frac_inen_ssp_la[["iso_code3", "Region", "Year", sisepuede_var]].query("Year>2020")
frac_inen_ssp_la_projected.to_csv(PROJECTED_FILE_PATH, index = False)
