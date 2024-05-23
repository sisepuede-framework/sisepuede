#set up root folder
 root <- r"(C:\Users\edmun\OneDrive\Edmundo-ITESM\3.Proyectos\59. Lousiana Project\sisepuede\data\SocioEconomic\population_gnrl_rural\)"

#create population input

#read historic population
 file_name <- "apportionment.csv"
 pop_hist_data <- data.table::data.table(read.csv(paste0(root,"raw_data\\",file_name)))  
 pop_hist_data <- subset(pop_hist_data,Name=="Louisiana")
 pop_hist_data <- pop_hist_data[,c("Name","Year","Resident.Population"),with=FALSE]
 pop_hist_data$Resident.Population <- as.numeric(gsub(",","",pop_hist_data$Resident.Population))
#use this data to interpolate all values 
 pop_hist <- data.frame(iso_code3="LA",Region="louisiana",Year=1910:2018)
 pop_hist$Population <- apply(pop_hist,1,function(x){approx(pop_hist_data$Year,pop_hist_data$Resident.Population,xout=as.numeric(x["Year"]))$y})

#read population projection
 file_name <- "BPEaCP-population.csv"
 pop_future <- data.table::data.table(read.csv(paste0(root,"raw_data\\",file_name)))
 pop_future <- data.table::melt(pop_future, id.vars="Unit..people")
 pop_future$variable <- as.numeric(gsub("X","",as.character(pop_future$variable)))
 pop_future$Year <- pop_future$variable
 pop_future$variable <- NULL
 pop_future$Region <- "louisiana"
 pop_future$iso_code3 <- "LA"
 pop_future$Unit..people <- NULL
 pop_future$Population <- pop_future$value
 pop_future$value <- NULL
#merge both historic and projected 
 pop_data <- rbind(data.table::data.table(pop_hist),pop_future)

#estimate both rural and urban population shares 
#load census bureau file
  file_name <- "State_Urban_Rural_Pop_2020_2010_.csv"  
  urban_rural <- read.csv(paste0(root,"raw_data\\",file_name))
  urban_rural <- subset(urban_rural,STATE.NAME=="Louisiana")

#add share of urban population 
 pop_data$urban_share <- apply(pop_data,1,function(x){approx(c(1910,2010,2020,2050),c(0.25,urban_rural$X2010.PCT.URBAN.POP/100,urban_rural$X2020.PCT.URBAN.POP/100,0.90),xout=as.numeric(x["Year"]))$y})

#create variables for the repository 
 pop_data$population_gnrl_urban <- pop_data$Population*pop_data$urban_share
 pop_data$population_gnrl_rural <- pop_data$Population*(1-pop_data$urban_share)

#write files to repo  
  variable <- "population_gnrl_rural"
  historic <- data.frame(subset(pop_data,Year%in%c(1910:2020)))[,c("iso_code3","Region","Year",variable)]
  projection <- data.frame(subset(pop_data,Year%in%c(2021:2050)))[,c("iso_code3","Region","Year",variable)]
  write.csv(historic,paste0(root,"input_to_sisepuede\\historical\\",variable,".csv"),row.names=FALSE)
  write.csv(projection,paste0(root,"input_to_sisepuede\\projected\\",variable,".csv"),row.names=FALSE)
