lousiana_raw_data = {
    "petroleum" : {
        "production" : (366.0, "TBTU", "Trillion BTU's"),
        "consumption" : (2080.8, "TBTU", "Trillion BTU's"),
    },
    "natural_gas" : {
        "production" : (1792.2, "TBTU", "Trillion BTU's"),
        "consumption" : (1589.0, "TBTU", "Trillion BTU's"), 
    },
    "coal" : {
        "production" : (31.1 , "TBTU", "Trillion BTU's"),
        "consumption" : (174.2, "TBTU", "Trillion BTU's"), 
    },
    "nuclear" : {
        "production" : (160.0, "TBTU", "Trillion BTU's"),
        "consumption" : (160.0, "TBTU", "Trillion BTU's"), 
    },
    "hydroelectric_biofuels_other" : {
        "production" : (154.9, "TBTU", "Trillion BTU's"),
        "consumption" : (146.8, "TBTU", "Trillion BTU's"), 
    },
}


correspondencias_web_sisepuede = {"exports_enfu_pj_fuel" : {
                                    "exports_enfu_pj_fuel_coal" : ('coal', 1.0),
                                    "exports_enfu_pj_fuel_electricity" : (),
                                    "exports_enfu_pj_fuel_natural_gas" : ('natural_gas', 1.0),
                                    "exports_enfu_pj_fuel_crude" : ('petroleum', 1.0),
                                    "exports_enfu_pj_fuel_diesel" : (),
                                    "exports_enfu_pj_fuel_gasoline" : (),
                                    "exports_enfu_pj_fuel_hydrocarbon_gas_liquids" : ('hydroelectric_biofuels_other', 1.0),
                                    "exports_enfu_pj_fuel_hydrogen" : (),
                                    "exports_enfu_pj_fuel_kerosene" : (),
                                    "exports_enfu_pj_fuel_oil" : ('petroleum', 0.015),
                                    },
                                    "frac_enfu_fuel_demand_imported_pj" : {
                                    "frac_enfu_fuel_demand_imported_pj_fuel_coal" : ('coal', 1.0),
                                    "frac_enfu_fuel_demand_imported_pj_fuel_electricity" : (),
                                    "frac_enfu_fuel_demand_imported_pj_fuel_natural_gas" : ('natural_gas', 1.0),
                                    "frac_enfu_fuel_demand_imported_pj_fuel_crude" : ('petroleum', 1.0),
                                    "frac_enfu_fuel_demand_imported_pj_fuel_diesel" : (),
                                    "frac_enfu_fuel_demand_imported_pj_fuel_gasoline" : (),
                                    "frac_enfu_fuel_demand_imported_pj_fuel_hydrocarbon_gas_liquids" : ('hydroelectric_biofuels_other', 1.0),
                                    "frac_enfu_fuel_demand_imported_pj_fuel_hydrogen" : (),
                                    "frac_enfu_fuel_demand_imported_pj_fuel_kerosene" : (),
                                    "frac_enfu_fuel_demand_imported_pj_fuel_oil": ('petroleum', 0.015)
                                }
}