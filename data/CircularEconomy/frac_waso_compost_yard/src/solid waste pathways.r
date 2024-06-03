root <- r'(C:\Users\edmun\OneDrive\Edmundo-ITESM\3.Proyectos\59. Lousiana Project\sisepuede\data\CircularEconomy\)'
raw_data <- r'(C:\Users\edmun\OneDrive\Edmundo-ITESM\3.Proyectos\59. Lousiana Project\sisepuede\data\CircularEconomy\frac_waso_recycled_glass\raw_data\)'
wb_data <- read.csv(paste0(raw_data,"country_level_data_0.csv"))
dim(wb_data)
colnames(wb_data)
head(wb_data)

########################
## [1] frac_waso_non_recycled_incinerated
########################
var_sisepuede <- "frac_waso_non_recycled_incinerated"
var_wb_data <- c("waste_treatment_incineration_percent")
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- pivot[,var_wb_data]/100
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 

#now interpolate missing values  
#now fill data gaps by imputation 
formula_imputation <- as.formula(paste(var_sisepuede,"~",paste(socio_economic,collapse="+"),sep=""))
model_imputation <- lm(formula_imputation,pivot)
pivot[,paste0(var_sisepuede,"_imputation")] <- predict(model_imputation, pivot[,socio_economic] )
pivot[,paste0(var_sisepuede,"_imputation")] <- ifelse(pivot[,paste0(var_sisepuede,"_imputation")] <0,0,pivot[,paste0(var_sisepuede,"_imputation")] )
pivot[,paste0(var_sisepuede,"_imputation")] <- ifelse(is.na(pivot[,paste0(var_sisepuede,"_imputation")])==TRUE,mean(pivot [, var_sisepuede],na.rm=TRUE),pivot[,paste0(var_sisepuede,"_imputation")] )
pivot [, var_sisepuede] <- ifelse (is.na(pivot [, var_sisepuede])==TRUE,pivot[,paste0(var_sisepuede,"_imputation")],pivot [, var_sisepuede])

#subset to USA for Louisiana 
pivot<-subset(pivot,iso3c=="USA")
pivot$iso3c<- "LA"

#edit and print 
colnames(pivot) <- gsub("iso3c","iso_code3",colnames(pivot))
pivot <- pivot[,c("iso_code3",var_sisepuede)]
head(pivot)

#normalize so the sum of treatments is 100% 
pivot[,var_sisepuede]  <- pivot[,var_sisepuede]/(0.128+0.526)

#create directory 
dir.create(paste0(root,var_sisepuede,"\\"))
dir.create(paste0(root,var_sisepuede,"\\","input_to_sisepuede"))
#historical 
dir.create(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\historical\\"))
pivot_h<- merge(pivot, data.frame(Year=c(2010:2020)))
pivot_h <- pivot_h[order(pivot_h$iso_code3,pivot_h$Year),]
summary(pivot_h[,var_sisepuede])
write.csv(pivot_h,paste0(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\historical\\"),var_sisepuede,".csv"),row.names=FALSE)
#projection 
dir.create(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\projected\\"))
pivot_p<- merge(pivot, data.frame(Year=c(2021:2050)))
pivot_p<- pivot_p[order(pivot_p$iso_code3,pivot_p$Year),]
summary(pivot_p[,var_sisepuede])
write.csv(pivot_p,paste0(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\projected\\"),var_sisepuede,".csv"),row.names=FALSE)


########################
## [2] frac_waso_non_recycled_landfilled
########################
var_sisepuede <- "frac_waso_non_recycled_landfilled"
var_wb_data <- c("waste_treatment_controlled_landfill_percent","waste_treatment_landfill_unspecified_percent")
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- rowSums(pivot[,var_wb_data],na.rm=TRUE)/100
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 

#now interpolate missing values  
#now fill data gaps by imputation 
formula_imputation <- as.formula(paste(var_sisepuede,"~",paste(socio_economic,collapse="+"),sep=""))
model_imputation <- lm(formula_imputation,pivot)
pivot[,paste0(var_sisepuede,"_imputation")] <- predict(model_imputation, pivot[,socio_economic] )
pivot[,paste0(var_sisepuede,"_imputation")] <- ifelse(pivot[,paste0(var_sisepuede,"_imputation")] <0,0,pivot[,paste0(var_sisepuede,"_imputation")] )
pivot[,paste0(var_sisepuede,"_imputation")] <- ifelse(is.na(pivot[,paste0(var_sisepuede,"_imputation")])==TRUE,mean(pivot [, var_sisepuede],na.rm=TRUE),pivot[,paste0(var_sisepuede,"_imputation")] )
pivot [, var_sisepuede] <- ifelse (is.na(pivot [, var_sisepuede])==TRUE,pivot[,paste0(var_sisepuede,"_imputation")],pivot [, var_sisepuede])

#subset to USA for Louisiana 
pivot<-subset(pivot,iso3c=="USA")
pivot$iso3c<- "LA" 


#edit and print 
colnames(pivot) <- gsub("iso3c","iso_code3",colnames(pivot))
pivot <- pivot[,c("iso_code3",var_sisepuede)]
head(pivot)

#normalize so the sum of treatments is 100% 
pivot[,var_sisepuede]  <- pivot[,var_sisepuede]/(0.128+0.526)


#create directory 
dir.create(paste0(root,var_sisepuede,"\\"))
dir.create(paste0(root,var_sisepuede,"\\","input_to_sisepuede"))
#historical 
dir.create(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\historical\\"))
pivot_h<- merge(pivot, data.frame(Year=c(2010:2020)))
pivot_h <- pivot_h[order(pivot_h$iso_code3,pivot_h$Year),]
summary(pivot_h[,var_sisepuede])
write.csv(pivot_h,paste0(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\historical\\"),var_sisepuede,".csv"),row.names=FALSE)
#projection 
dir.create(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\projected\\"))
pivot_p<- merge(pivot, data.frame(Year=c(2021:2050)))
pivot_p<- pivot_p[order(pivot_p$iso_code3,pivot_p$Year),]
summary(pivot_p[,var_sisepuede])
write.csv(pivot_p,paste0(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\projected\\"),var_sisepuede,".csv"),row.names=FALSE)

########################
## [2] frac_waso_non_recycled_open_dump
########################
var_sisepuede <- "frac_waso_non_recycled_open_dump"
var_wb_data <- c("waste_treatment_open_dump_percent")
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- 0.0
#check dimmensionality makes sense

#now interpolate missing values  

#subset to USA for Louisiana 
pivot<-subset(pivot,iso3c=="USA")
pivot$iso3c<- "LA" #revise this number

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
summary(pivot_h[,var_sisepuede])
write.csv(pivot_h,paste0(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\historical\\"),var_sisepuede,".csv"),row.names=FALSE)
#projection 
dir.create(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\projected\\"))
pivot_p<- merge(pivot, data.frame(Year=c(2021:2050)))
pivot_p<- pivot_p[order(pivot_p$iso_code3,pivot_p$Year),]
summary(pivot_p[,var_sisepuede])
write.csv(pivot_p,paste0(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\projected\\"),var_sisepuede,".csv"),row.names=FALSE)


########################
## [4] frac_waso_landfill_gas_recovered
########################
var_sisepuede <- "frac_waso_landfill_gas_recovered"
var_wb_data <- c("waste_treatment_sanitary_landfill_landfill_gas_system_percent")
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- pivot[,var_wb_data]/100
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 

#now interpolate missing values  
#now fill data gaps by imputation 
formula_imputation <- as.formula(paste(var_sisepuede,"~",paste(socio_economic,collapse="+"),sep=""))
model_imputation <- lm(formula_imputation,pivot)
pivot[,paste0(var_sisepuede,"_imputation")] <- predict(model_imputation, pivot[,socio_economic] )
pivot[,paste0(var_sisepuede,"_imputation")] <- ifelse(pivot[,paste0(var_sisepuede,"_imputation")] <0,0,pivot[,paste0(var_sisepuede,"_imputation")] )
pivot[,paste0(var_sisepuede,"_imputation")] <- ifelse(pivot[,paste0(var_sisepuede,"_imputation")] >1.0,1.0,pivot[,paste0(var_sisepuede,"_imputation")] )
pivot[,paste0(var_sisepuede,"_imputation")] <- ifelse(is.na(pivot[,paste0(var_sisepuede,"_imputation")])==TRUE,mean(pivot [, var_sisepuede],na.rm=TRUE),pivot[,paste0(var_sisepuede,"_imputation")] )
pivot [, var_sisepuede] <- ifelse (is.na(pivot [, var_sisepuede])==TRUE,pivot[,paste0(var_sisepuede,"_imputation")],pivot [, var_sisepuede])


#subset to USA for Louisiana 
pivot<-subset(pivot,iso3c=="USA")
pivot$iso3c<- "LA" #revise this number


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
summary(pivot_h[,var_sisepuede])
write.csv(pivot_h,paste0(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\historical\\"),var_sisepuede,".csv"),row.names=FALSE)
#projection 
dir.create(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\projected\\"))
pivot_p<- merge(pivot, data.frame(Year=c(2021:2050)))
pivot_p<- pivot_p[order(pivot_p$iso_code3,pivot_p$Year),]
summary(pivot_p[,var_sisepuede])
write.csv(pivot_p,paste0(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\projected\\"),var_sisepuede,".csv"),row.names=FALSE)

########################
## [5] frac_waso_lgc_recovered_for_energy
########################
var_sisepuede <- "frac_waso_lgc_recovered_for_energy"
var_wb_data <- c("waste_treatment_anaerobic_digestion_percent")
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- pivot[,var_wb_data]/100
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 

#now interpolate missing values  
#now fill data gaps by imputation 
formula_imputation <- as.formula(paste(var_sisepuede,"~",paste(socio_economic,collapse="+"),sep=""))
model_imputation <- lm(formula_imputation,pivot)
pivot[,paste0(var_sisepuede,"_imputation")] <- predict(model_imputation, pivot[,socio_economic] )
pivot[,paste0(var_sisepuede,"_imputation")] <- ifelse(pivot[,paste0(var_sisepuede,"_imputation")] <0,0,pivot[,paste0(var_sisepuede,"_imputation")] )
pivot[,paste0(var_sisepuede,"_imputation")] <- ifelse(pivot[,paste0(var_sisepuede,"_imputation")] >1.0,1.0,pivot[,paste0(var_sisepuede,"_imputation")] )
pivot[,paste0(var_sisepuede,"_imputation")] <- ifelse(is.na(pivot[,paste0(var_sisepuede,"_imputation")])==TRUE,mean(pivot [, var_sisepuede],na.rm=TRUE),pivot[,paste0(var_sisepuede,"_imputation")] )
pivot [, var_sisepuede] <- ifelse (is.na(pivot [, var_sisepuede])==TRUE,pivot[,paste0(var_sisepuede,"_imputation")],pivot [, var_sisepuede])

#subset to USA for Louisiana 
pivot<-subset(pivot,iso3c=="USA")
pivot$iso3c<- "LA" #revise this number

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
summary(pivot_h[,var_sisepuede])
write.csv(pivot_h,paste0(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\historical\\"),var_sisepuede,".csv"),row.names=FALSE)
#projection 
dir.create(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\projected\\"))
pivot_p<- merge(pivot, data.frame(Year=c(2021:2050)))
pivot_p<- pivot_p[order(pivot_p$iso_code3,pivot_p$Year),]
summary(pivot_p[,var_sisepuede])
write.csv(pivot_p,paste0(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\projected\\"),var_sisepuede,".csv"),row.names=FALSE)

########################
## [6] frac_waso_isw_incinerated_recovered_for_energy
########################
#we assume that half of the treatment shares in World Bank data "other" corresponds to the two incinerayed recovered categories in sisepuede
var_sisepuede <- "frac_waso_isw_incinerated_recovered_for_energy"
var_wb_data <- c("waste_treatment_other_percent")
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- (pivot[,var_wb_data]/100)*0.5*0.5
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 

#now interpolate missing values  
#now fill data gaps by imputation 
formula_imputation <- as.formula(paste(var_sisepuede,"~",paste(socio_economic,collapse="+"),sep=""))
model_imputation <- lm(formula_imputation,pivot)
pivot[,paste0(var_sisepuede,"_imputation")] <- predict(model_imputation, pivot[,socio_economic] )
pivot[,paste0(var_sisepuede,"_imputation")] <- ifelse(pivot[,paste0(var_sisepuede,"_imputation")] <0,0,pivot[,paste0(var_sisepuede,"_imputation")] )
pivot[,paste0(var_sisepuede,"_imputation")] <- ifelse(pivot[,paste0(var_sisepuede,"_imputation")] >1.0,1.0,pivot[,paste0(var_sisepuede,"_imputation")] )
pivot[,paste0(var_sisepuede,"_imputation")] <- ifelse(is.na(pivot[,paste0(var_sisepuede,"_imputation")])==TRUE,mean(pivot [, var_sisepuede],na.rm=TRUE),pivot[,paste0(var_sisepuede,"_imputation")] )
pivot [, var_sisepuede] <- ifelse (is.na(pivot [, var_sisepuede])==TRUE,pivot[,paste0(var_sisepuede,"_imputation")],pivot [, var_sisepuede])

#subset to USA for Louisiana 
pivot<-subset(pivot,iso3c=="USA")
pivot$iso3c<- "LA" 

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
summary(pivot_h[,var_sisepuede])
write.csv(pivot_h,paste0(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\historical\\"),var_sisepuede,".csv"),row.names=FALSE)
#projection 
dir.create(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\projected\\"))
pivot_p<- merge(pivot, data.frame(Year=c(2021:2050)))
pivot_p<- pivot_p[order(pivot_p$iso_code3,pivot_p$Year),]
summary(pivot_p[,var_sisepuede])
write.csv(pivot_p,paste0(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\projected\\"),var_sisepuede,".csv"),row.names=FALSE)

########################
## [7] frac_waso_msw_incinerated_recovered_for_energy
########################
#we assume that half of the treatment shares in World Bank data "other" corresponds to the two incinerayed recovered categories in sisepuede
var_sisepuede <- "frac_waso_msw_incinerated_recovered_for_energy"
var_wb_data <- c("waste_treatment_other_percent")
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- (pivot[,var_wb_data]/100)*0.5*0.5
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 

#now interpolate missing values  
#now fill data gaps by imputation 
formula_imputation <- as.formula(paste(var_sisepuede,"~",paste(socio_economic,collapse="+"),sep=""))
model_imputation <- lm(formula_imputation,pivot)
pivot[,paste0(var_sisepuede,"_imputation")] <- predict(model_imputation, pivot[,socio_economic] )
pivot[,paste0(var_sisepuede,"_imputation")] <- ifelse(pivot[,paste0(var_sisepuede,"_imputation")] <0,0,pivot[,paste0(var_sisepuede,"_imputation")] )
pivot[,paste0(var_sisepuede,"_imputation")] <- ifelse(pivot[,paste0(var_sisepuede,"_imputation")] >1.0,1.0,pivot[,paste0(var_sisepuede,"_imputation")] )
pivot[,paste0(var_sisepuede,"_imputation")] <- ifelse(is.na(pivot[,paste0(var_sisepuede,"_imputation")])==TRUE,mean(pivot [, var_sisepuede],na.rm=TRUE),pivot[,paste0(var_sisepuede,"_imputation")] )
pivot [, var_sisepuede] <- ifelse (is.na(pivot [, var_sisepuede])==TRUE,pivot[,paste0(var_sisepuede,"_imputation")],pivot [, var_sisepuede])

#subset to USA for Louisiana 
pivot<-subset(pivot,iso3c=="USA")
pivot$iso3c<- "LA" #revise this number


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
summary(pivot_h[,var_sisepuede])
write.csv(pivot_h,paste0(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\historical\\"),var_sisepuede,".csv"),row.names=FALSE)
#projection 
dir.create(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\projected\\"))
pivot_p<- merge(pivot, data.frame(Year=c(2021:2050)))
pivot_p<- pivot_p[order(pivot_p$iso_code3,pivot_p$Year),]
summary(pivot_p[,var_sisepuede])
write.csv(pivot_p,paste0(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\projected\\"),var_sisepuede,".csv"),row.names=FALSE)

###############
# composting fractions 
###############
######
# frac_waso_compost_food
######
#note the assumption is that general recycling rates apply to each product 
i <- 1
vars_sisepuede <- c(
                    "frac_waso_compost_food",
                    "frac_waso_compost_methane_flared",
                    "frac_waso_compost_sludge",
                    "frac_waso_compost_yard"
                    )
var_wb_data <- c("waste_treatment_compost_percent")
var_sisepuede <- vars_sisepuede[i]
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,vars_sisepuede[i]] <- (pivot[,var_wb_data]/100)/length(vars_sisepuede)
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 

#now interpolate missing values  
#now fill data gaps by imputation 
formula_imputation <- as.formula(paste(var_sisepuede,"~",paste(socio_economic,collapse="+"),sep=""))
model_imputation <- lm(formula_imputation,pivot)
pivot[,paste0(var_sisepuede,"_imputation")] <- predict(model_imputation, pivot[,socio_economic] )
pivot[,paste0(var_sisepuede,"_imputation")] <- ifelse(pivot[,paste0(var_sisepuede,"_imputation")] <0,0,pivot[,paste0(var_sisepuede,"_imputation")] )
pivot[,paste0(var_sisepuede,"_imputation")] <- ifelse(is.na(pivot[,paste0(var_sisepuede,"_imputation")])==TRUE,mean(pivot [, var_sisepuede],na.rm=TRUE),pivot[,paste0(var_sisepuede,"_imputation")] )
pivot [, var_sisepuede] <- ifelse (is.na(pivot [, var_sisepuede])==TRUE,pivot[,paste0(var_sisepuede,"_imputation")],pivot [, var_sisepuede])

#subset to USA for Louisiana 
pivot<-subset(pivot,iso3c=="USA")
pivot$iso3c<- "LA" 

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
summary(pivot_h[,var_sisepuede])
write.csv(pivot_h,paste0(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\historical\\"),var_sisepuede,".csv"),row.names=FALSE)
#projection 
dir.create(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\projected\\"))
pivot_p<- merge(pivot, data.frame(Year=c(2021:2050)))
pivot_p<- pivot_p[order(pivot_p$iso_code3,pivot_p$Year),]
summary(pivot_p[,var_sisepuede])
write.csv(pivot_p,paste0(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\projected\\"),var_sisepuede,".csv"),row.names=FALSE)




######
# frac_waso_compost_methane_flared
######
#note the assumption is that general recycling rates apply to each product 
i <- 2
vars_sisepuede <- c(
                    "frac_waso_compost_food",
                    "frac_waso_compost_methane_flared",
                    "frac_waso_compost_sludge",
                    "frac_waso_compost_yard"
                    )
var_wb_data <- c("waste_treatment_compost_percent")
var_sisepuede <- vars_sisepuede[i]
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,vars_sisepuede[i]] <- (pivot[,var_wb_data]/100)/length(vars_sisepuede)
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 

#now interpolate missing values  
#now fill data gaps by imputation 
formula_imputation <- as.formula(paste(var_sisepuede,"~",paste(socio_economic,collapse="+"),sep=""))
model_imputation <- lm(formula_imputation,pivot)
pivot[,paste0(var_sisepuede,"_imputation")] <- predict(model_imputation, pivot[,socio_economic] )
pivot[,paste0(var_sisepuede,"_imputation")] <- ifelse(pivot[,paste0(var_sisepuede,"_imputation")] <0,0,pivot[,paste0(var_sisepuede,"_imputation")] )
pivot[,paste0(var_sisepuede,"_imputation")] <- ifelse(is.na(pivot[,paste0(var_sisepuede,"_imputation")])==TRUE,mean(pivot [, var_sisepuede],na.rm=TRUE),pivot[,paste0(var_sisepuede,"_imputation")] )
pivot [, var_sisepuede] <- ifelse (is.na(pivot [, var_sisepuede])==TRUE,pivot[,paste0(var_sisepuede,"_imputation")],pivot [, var_sisepuede])

#subset to USA for Louisiana 
pivot<-subset(pivot,iso3c=="USA")
pivot$iso3c<- "LA" 


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
summary(pivot_h[,var_sisepuede])
write.csv(pivot_h,paste0(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\historical\\"),var_sisepuede,".csv"),row.names=FALSE)
#projection 
dir.create(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\projected\\"))
pivot_p<- merge(pivot, data.frame(Year=c(2021:2050)))
pivot_p<- pivot_p[order(pivot_p$iso_code3,pivot_p$Year),]
summary(pivot_p[,var_sisepuede])
write.csv(pivot_p,paste0(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\projected\\"),var_sisepuede,".csv"),row.names=FALSE)

######
# frac_waso_compost_sludge
######
#note the assumption is that general recycling rates apply to each product 
i <- 3
vars_sisepuede <- c(
                    "frac_waso_compost_food",
                    "frac_waso_compost_methane_flared",
                    "frac_waso_compost_sludge",
                    "frac_waso_compost_yard"
                    )
var_wb_data <- c("waste_treatment_compost_percent")
var_sisepuede <- vars_sisepuede[i]
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,vars_sisepuede[i]] <- (pivot[,var_wb_data]/100)/length(vars_sisepuede)
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 

#now interpolate missing values  
#now fill data gaps by imputation 
formula_imputation <- as.formula(paste(var_sisepuede,"~",paste(socio_economic,collapse="+"),sep=""))
model_imputation <- lm(formula_imputation,pivot)
pivot[,paste0(var_sisepuede,"_imputation")] <- predict(model_imputation, pivot[,socio_economic] )
pivot[,paste0(var_sisepuede,"_imputation")] <- ifelse(pivot[,paste0(var_sisepuede,"_imputation")] <0,0,pivot[,paste0(var_sisepuede,"_imputation")] )
pivot[,paste0(var_sisepuede,"_imputation")] <- ifelse(is.na(pivot[,paste0(var_sisepuede,"_imputation")])==TRUE,mean(pivot [, var_sisepuede],na.rm=TRUE),pivot[,paste0(var_sisepuede,"_imputation")] )
pivot [, var_sisepuede] <- ifelse (is.na(pivot [, var_sisepuede])==TRUE,pivot[,paste0(var_sisepuede,"_imputation")],pivot [, var_sisepuede])

#subset to USA for Louisiana 
pivot<-subset(pivot,iso3c=="USA")
pivot$iso3c<- "LA" 

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
summary(pivot_h[,var_sisepuede])
write.csv(pivot_h,paste0(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\historical\\"),var_sisepuede,".csv"),row.names=FALSE)
#projection 
dir.create(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\projected\\"))
pivot_p<- merge(pivot, data.frame(Year=c(2021:2050)))
pivot_p<- pivot_p[order(pivot_p$iso_code3,pivot_p$Year),]
summary(pivot_p[,var_sisepuede])
write.csv(pivot_p,paste0(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\projected\\"),var_sisepuede,".csv"),row.names=FALSE)

######
# frac_waso_compost_yard
######
#note the assumption is that general recycling rates apply to each product 
i <- 4
vars_sisepuede <- c(
                    "frac_waso_compost_food",
                    "frac_waso_compost_methane_flared",
                    "frac_waso_compost_sludge",
                    "frac_waso_compost_yard"
                    )
var_wb_data <- c("waste_treatment_compost_percent")
var_sisepuede <- vars_sisepuede[i]
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,vars_sisepuede[i]] <- (pivot[,var_wb_data]/100)/length(vars_sisepuede)
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 
summary(fake_data[,var_sisepuede])

#now interpolate missing values  
#now fill data gaps by imputation 
formula_imputation <- as.formula(paste(var_sisepuede,"~",paste(socio_economic,collapse="+"),sep=""))
model_imputation <- lm(formula_imputation,pivot)
pivot[,paste0(var_sisepuede,"_imputation")] <- predict(model_imputation, pivot[,socio_economic] )
pivot[,paste0(var_sisepuede,"_imputation")] <- ifelse(pivot[,paste0(var_sisepuede,"_imputation")] <0,0,pivot[,paste0(var_sisepuede,"_imputation")] )
pivot[,paste0(var_sisepuede,"_imputation")] <- ifelse(is.na(pivot[,paste0(var_sisepuede,"_imputation")])==TRUE,mean(pivot [, var_sisepuede],na.rm=TRUE),pivot[,paste0(var_sisepuede,"_imputation")] )
pivot [, var_sisepuede] <- ifelse (is.na(pivot [, var_sisepuede])==TRUE,pivot[,paste0(var_sisepuede,"_imputation")],pivot [, var_sisepuede])

#subset to USA for Louisiana 
pivot<-subset(pivot,iso3c=="USA")
pivot$iso3c<- "LA" 

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
summary(pivot_h[,var_sisepuede])
write.csv(pivot_h,paste0(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\historical\\"),var_sisepuede,".csv"),row.names=FALSE)
#projection 
dir.create(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\projected\\"))
pivot_p<- merge(pivot, data.frame(Year=c(2021:2050)))
pivot_p<- pivot_p[order(pivot_p$iso_code3,pivot_p$Year),]
summary(pivot_p[,var_sisepuede])
write.csv(pivot_p,paste0(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\projected\\"),var_sisepuede,".csv"),row.names=FALSE)

