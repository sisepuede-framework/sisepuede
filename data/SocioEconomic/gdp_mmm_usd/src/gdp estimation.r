#set up root folder
 root <- r"(C:\Users\edmun\OneDrive\Edmundo-ITESM\3.Proyectos\59. Lousiana Project\sisepuede\data\SocioEconomic\gdp_mmm_usd\)"

#load gdp files
 historical <- read.csv(paste0(root,"raw_data\\SAGDP1__ALL_AREAS_1997_2023.csv")) 
 projected <- read.csv(paste0(root,"raw_data\\BAU GDP.csv"))

#work historical data first
  library(data.table)
  historical <- subset(historical,GeoName=="Louisiana")
  historical <- subset(historical,Unit=="Millions of chained 2017 dollars") 
  historical <- data.frame(melt(data.table(historical),id.vars=c( "GeoFIPS","GeoName","Region","TableName","LineCode","IndustryClassification","Description","Unit")))
  historical$value <- as.numeric(historical$value)
  historical$gdp_usd <- historical$value*1e6
  historical$Year <- as.numeric(gsub("X","",historical$variable))

#work projected  
 projected$Year <- projected$Unit..2012.USD
 projected$gdp_usd <- as.numeric(projected$GDP)

#subset and rbind 
 historical <- subset(historical,Year<2015)[,c("Year","gdp_usd")]
 projected <- subset(projected,Year>=2015)[,c("Year","gdp_usd")]
 gdp <- rbind(historical,projected)
 gdp$iso_code3<- "LA"
 gdp$Region <- "louisiana"
 gdp$gdp_mmm_usd <- gdp$gdp_usd/(1e9) 
 gdp$gdp_usd <- NULL

#write files
 variable <- "gdp_mmm_usd" 
 write.csv(subset(gdp,Year<2015),paste0(root,"\\input_to_sisepuede\\historical\\",variable,".csv"),row.names=FALSE)
 write.csv(subset(gdp,Year>=2015),paste0(root,"\\input_to_sisepuede\\projected\\",variable,".csv"),row.names=FALSE)
