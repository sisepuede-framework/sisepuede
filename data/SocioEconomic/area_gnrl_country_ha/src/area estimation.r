#set up root folder
 root <- r"(C:\Users\edmun\OneDrive\Edmundo-ITESM\3.Proyectos\59. Lousiana Project\sisepuede\data\SocioEconomic\area_gnrl_country_ha\)"


#create table for Lousiana 
 area <- data.frame(Year=2000:2050,iso_code3="LA",Region="louisiana")
 area$area_gnrl_country_ha <- 135659 * (100) # [km2*ha/km2]

#write files
 variable <- "area_gnrl_country_ha" 
 write.csv(subset(area,Year<2015),paste0(root,"\\input_to_sisepuede\\historical\\",variable,".csv"),row.names=FALSE)
 write.csv(subset(area,Year>=2015),paste0(root,"\\input_to_sisepuede\\projected\\",variable,".csv"),row.names=FALSE)
