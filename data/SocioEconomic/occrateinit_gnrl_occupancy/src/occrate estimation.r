#set up root folder
 root <- r"(C:\Users\edmun\OneDrive\Edmundo-ITESM\3.Proyectos\59. Lousiana Project\sisepuede\data\SocioEconomic\occrateinit_gnrl_occupancy\)"

#load gdp files
 data <- read.csv(paste0(root,"raw_data\\average-household-size-by-state-2024.csv")) 

#create table for Lousiana 
 occ_rate <- data.frame(Year=2000:2050,iso_code3="LA",Region="louisiana")
 occ_rate$occrateinit_gnrl_occupancy <- subset(data,state=="Louisiana")$AverageHouseholdSize

#write files
 variable <- "occrateinit_gnrl_occupancy" 
 write.csv(subset(occ_rate,Year<2015),paste0(root,"\\input_to_sisepuede\\historical\\",variable,".csv"),row.names=FALSE)
 write.csv(subset(occ_rate,Year>=2015),paste0(root,"\\input_to_sisepuede\\projected\\",variable,".csv"),row.names=FALSE)
