from typing import List, Dict
from pandas import DataFrame
import matplotlib.pyplot as plt
import os 

def build_path(path_list : List[str]) -> str:
    return os.path.abspath(os.path.join(*path_list)) 

def plot_area_value(df : DataFrame, 
                    mapping_col_val : Dict[str,str], 
                    mapping_columns_to_pivot : Dict[str,str]) -> None:

    columns_to_pivot = list(mapping_columns_to_pivot.values())

    for key,val in mapping_col_val.items():
        df.query(f"{key}=='{val}'")[columns_to_pivot].\
                            pivot(index = mapping_columns_to_pivot["index"], 
                                  columns = mapping_columns_to_pivot["columns"], 
                                  values = mapping_columns_to_pivot["values"]).\
                            plot.area(title = f"{key}\n{val}")
        plt.show()


