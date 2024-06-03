#clean version 
#set root directory 
root <- r'(C:\Users\edmun\OneDrive\Edmundo-ITESM\3.Proyectos\59. Lousiana Project\sisepuede\data\CircularEconomy\)'
raw_data <- r'(C:\Users\edmun\OneDrive\Edmundo-ITESM\3.Proyectos\59. Lousiana Project\sisepuede\data\CircularEconomy\frac_waso_recycled_glass\raw_data\)'
wb_data <- read.csv(paste0(raw_data,"country_level_data_0.csv"))

#wb_data <- read.csv(paste0(dir_wb_data,"country_level_data_0.csv"))
dim(wb_data)
colnames(wb_data)

#subset data to USA 
wb_data<-subset(wb_data,iso3c=="USA")
wb_data$iso3c<- "LA"
vars_sisepuede <- c("frac_waso_recycled_glass", 
                   "frac_waso_recycled_metal",
                   "frac_waso_recycled_paper",
                   "frac_waso_recycled_plastic",
                   "frac_waso_recycled_rubber_leather",
                   "frac_waso_recycled_textiles", 
                   "frac_waso_recycled_wood")
var_wb_data <- c("waste_treatment_recycling_percent")

for (i in 1:length(vars_sisepuede))
{
#i <- 1
var_sisepuede <- vars_sisepuede[i]
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,vars_sisepuede[i]] <- pivot[,var_wb_data]/100

#edit and print 
colnames(pivot) <- gsub("iso3c","iso_code3",colnames(pivot))
pivot <- pivot[,c("iso_code3",var_sisepuede)]
head(pivot)
#create directory 
dir.create(paste0(root,var_sisepuede,"\\"))
dir.create(paste0(root,var_sisepuede,"\\","input_to_sisepuede"))
#historical 
dir.create(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\historical\\"))
pivot_h<- merge(pivot, data.frame(Year=c(2010:2020)))
pivot_h <- pivot_h[order(pivot_h$iso_code3,pivot_h$Year),]
#summary(pivot_h[,var_sisepuede])
write.csv(pivot_h,paste0(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\historical\\"),var_sisepuede,".csv"),row.names=FALSE)
#projection 
dir.create(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\projected\\"))
pivot_p<- merge(pivot, data.frame(Year=c(2021:2050)))
pivot_p<- pivot_p[order(pivot_p$iso_code3,pivot_p$Year),]
#summary(pivot_p[,var_sisepuede])
write.csv(pivot_p,paste0(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\projected\\"),var_sisepuede,".csv"),row.names=FALSE)
#cleandata 
rm(pivot_h)
rm(pivot_p)
}



