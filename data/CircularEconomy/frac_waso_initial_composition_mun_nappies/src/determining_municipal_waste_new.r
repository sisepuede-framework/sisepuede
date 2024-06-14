#clean version 
#set root directory 
root <- r'(C:\Users\edmun\OneDrive\Edmundo-ITESM\3.Proyectos\59. Lousiana Project\sisepuede\data\CircularEconomy\)'
raw_data <- r'(C:\Users\edmun\OneDrive\Edmundo-ITESM\3.Proyectos\59. Lousiana Project\sisepuede\data\CircularEconomy\frac_waso_recycled_glass\raw_data\)'
wb_data <- read.csv(paste0(raw_data,"country_level_data_0.csv"))

dim(wb_data)
colnames(wb_data)
head(wb_data)

###
# [1] frac_waso_initial_composition_mun_paper
###
var_sisepuede <- "frac_waso_initial_composition_mun_paper"
var_wb_data <- subset(colnames(wb_data),grepl("paper",colnames(wb_data))==TRUE)
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- pivot[,var_wb_data]/100
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 

#now fill data gaps by imputation 
formula_imputation <- as.formula(paste(var_sisepuede,"~",paste(socio_economic,collapse="+"),sep=""))
model_imputation <- lm(formula_imputation,pivot)
pivot[,paste0(var_sisepuede,"_imputation")] <- predict(model_imputation, pivot[,socio_economic] )
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
summary(pivot_h)
write.csv(pivot_h,paste0(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\historical\\"),var_sisepuede,".csv"),row.names=FALSE)
#projection 
dir.create(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\projected\\"))
pivot_p<- merge(pivot, data.frame(Year=c(2021:2050)))
pivot_p<- pivot_p[order(pivot_p$iso_code3,pivot_p$Year),]
summary(pivot_p)
write.csv(pivot_p,paste0(paste0(root,var_sisepuede,"\\","input_to_sisepuede\\projected\\"),var_sisepuede,".csv"),row.names=FALSE)

###
# [2] frac_waso_initial_composition_mun_food
###
var_sisepuede <- "frac_waso_initial_composition_mun_food"
var_wb_data <- subset(colnames(wb_data),grepl("food",colnames(wb_data))==TRUE)
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- pivot[,var_wb_data]/100
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 

#now fill data gaps by imputation 
formula_imputation <- as.formula(paste(var_sisepuede,"~",paste(socio_economic,collapse="+"),sep=""))
model_imputation <- lm(formula_imputation,pivot)
pivot[,paste0(var_sisepuede,"_imputation")] <- predict(model_imputation, pivot[,socio_economic] )
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

###
# [3] frac_waso_initial_composition_mun_glass
###
var_sisepuede <- "frac_waso_initial_composition_mun_glass"
var_wb_data <- subset(colnames(wb_data),grepl("glass",colnames(wb_data))==TRUE)
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- pivot[,var_wb_data]/100
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 

#now fill data gaps by imputation 
formula_imputation <- as.formula(paste(var_sisepuede,"~",paste(socio_economic,collapse="+"),sep=""))
model_imputation <- lm(formula_imputation,pivot)
pivot[,paste0(var_sisepuede,"_imputation")] <- predict(model_imputation, pivot[,socio_economic] )
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

##########################
# [4] frac_waso_initial_composition_mun_plastic
##########################
var_sisepuede <- "frac_waso_initial_composition_mun_plastic"
var_wb_data <- subset(colnames(wb_data),grepl("plastic",colnames(wb_data))==TRUE)
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- pivot[,var_wb_data]/100
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 

#now fill data gaps by imputation 
formula_imputation <- as.formula(paste(var_sisepuede,"~",paste(socio_economic,collapse="+"),sep=""))
model_imputation <- lm(formula_imputation,pivot)
pivot[,paste0(var_sisepuede,"_imputation")] <- predict(model_imputation, pivot[,socio_economic] )
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

###################################
# [5] frac_waso_initial_composition_mun_metal
###################################
var_sisepuede <- "frac_waso_initial_composition_mun_metal"
var_wb_data <- subset(colnames(wb_data),grepl("metal",colnames(wb_data))==TRUE)
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- pivot[,var_wb_data]/100
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 

#now fill data gaps by imputation 
formula_imputation <- as.formula(paste(var_sisepuede,"~",paste(socio_economic,collapse="+"),sep=""))
model_imputation <- lm(formula_imputation,pivot)
pivot[,paste0(var_sisepuede,"_imputation")] <- predict(model_imputation, pivot[,socio_economic] )
pivot[,paste0(var_sisepuede,"_imputation")] <- ifelse(pivot[,paste0(var_sisepuede,"_imputation")] <0,0,pivot[,paste0(var_sisepuede,"_imputation")] )
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

###################################
# [6] frac_waso_initial_composition_mun_wood
###################################
var_sisepuede <- "frac_waso_initial_composition_mun_wood"
var_wb_data <- subset(colnames(wb_data),grepl("wood",colnames(wb_data))==TRUE)
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- pivot[,var_wb_data]/100
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 

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

##########################################
# [7] frac_waso_initial_composition_mun_rubber_leather
#########################################
var_sisepuede <- "frac_waso_initial_composition_mun_rubber_leather"
var_wb_data <- subset(colnames(wb_data),grepl("rubber",colnames(wb_data))==TRUE)
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- pivot[,var_wb_data]/100
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 

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


##########################################
# [8] frac_waso_initial_composition_mun_yard
#########################################
var_sisepuede <- "frac_waso_initial_composition_mun_yard"
var_wb_data <- subset(colnames(wb_data),grepl("yard",colnames(wb_data))==TRUE)
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- pivot[,var_wb_data]/100
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 

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


##########################################
# [9] frac_waso_initial_composition_mun_textiles
#########################################
other_group<- c("frac_waso_initial_composition_mun_chemical_industrial",
                "frac_waso_initial_composition_mun_nappies",
                "frac_waso_initial_composition_mun_other",
                "frac_waso_initial_composition_mun_sludge",
                "frac_waso_initial_composition_mun_textiles"
                 )
# the remainder of categories are proportionally divided by the WB's other category 
var_sisepuede <- "frac_waso_initial_composition_mun_textiles"
var_wb_data <- subset(colnames(wb_data),grepl("composition_other",colnames(wb_data))==TRUE)
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- ( pivot[,var_wb_data]/100 ) * (1/length(other_group))
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 

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

##########################################
# [10] frac_waso_initial_composition_mun_sludge
#########################################
other_group<- c("frac_waso_initial_composition_mun_chemical_industrial",
                "frac_waso_initial_composition_mun_nappies",
                "frac_waso_initial_composition_mun_other",
                "frac_waso_initial_composition_mun_sludge",
                "frac_waso_initial_composition_mun_textiles"
                 )
# the remainder of categories are proportionally divided by the WB's other category 
var_sisepuede <- "frac_waso_initial_composition_mun_sludge"
var_wb_data <- subset(colnames(wb_data),grepl("composition_other",colnames(wb_data))==TRUE)
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- ( pivot[,var_wb_data]/100 ) * (1/length(other_group))
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 

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

##########################################
# [11] frac_waso_initial_composition_mun_other
#########################################
other_group<- c("frac_waso_initial_composition_mun_chemical_industrial",
                "frac_waso_initial_composition_mun_nappies",
                "frac_waso_initial_composition_mun_other",
                "frac_waso_initial_composition_mun_sludge",
                "frac_waso_initial_composition_mun_textiles"
                 )
# the remainder of categories are proportionally divided by the WB's other category 
var_sisepuede <- "frac_waso_initial_composition_mun_other"
var_wb_data <- subset(colnames(wb_data),grepl("composition_other",colnames(wb_data))==TRUE)
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- ( pivot[,var_wb_data]/100 ) * (1/length(other_group))
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 

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


##########################################
# [12] frac_waso_initial_composition_mun_nappies
#########################################
other_group<- c("frac_waso_initial_composition_mun_chemical_industrial",
                "frac_waso_initial_composition_mun_nappies",
                "frac_waso_initial_composition_mun_other",
                "frac_waso_initial_composition_mun_sludge",
                "frac_waso_initial_composition_mun_textiles"
                 )
# the remainder of categories are proportionally divided by the WB's other category 
var_sisepuede <- "frac_waso_initial_composition_mun_nappies"
var_wb_data <- subset(colnames(wb_data),grepl("composition_other",colnames(wb_data))==TRUE)
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- ( pivot[,var_wb_data]/100 ) * (1/length(other_group))
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 

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

##########################################
# [13] frac_waso_initial_composition_mun_chemical_industrial
#########################################
other_group<- c("frac_waso_initial_composition_mun_chemical_industrial",
                "frac_waso_initial_composition_mun_nappies",
                "frac_waso_initial_composition_mun_other",
                "frac_waso_initial_composition_mun_sludge",
                "frac_waso_initial_composition_mun_textiles"
                 )
# the remainder of categories are proportionally divided by the WB's other category 
var_sisepuede <- "frac_waso_initial_composition_mun_chemical_industrial"
var_wb_data <- subset(colnames(wb_data),grepl("composition_other",colnames(wb_data))==TRUE)
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- ( pivot[,var_wb_data]/100 ) * (1/length(other_group))
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 

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

####################
#Estimate industry variables 
###############################
special_waste_vars <- subset(colnames(wb_data),grepl("special_waste",colnames(wb_data))==TRUE)
wb_data$special_waste_total <- rowSums(wb_data[,special_waste_vars],na.rm=TRUE)
wb_data[,paste0(special_waste_vars,"_new")] <- wb_data [,special_waste_vars]/wb_data$special_waste_total

#####
#"frac_waso_initial_composition_ind_chemical_industrial"
######
var_sisepuede <- "frac_waso_initial_composition_ind_chemical_industrial"
var_wb_data <- c("special_waste_construction_and_demolition_waste_tons_year_new",
                  "special_waste_e_waste_tons_year_new", 
                  "special_waste_hazardous_waste_tons_year_new", 
                  "special_waste_industrial_waste_tons_year_new", 
                  "special_waste_medical_waste_tons_year_new"
                )
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- rowSums(wb_data[,var_wb_data],na.rm=TRUE)
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 

#now fill data gaps by imputation, zero values are associated with mostly missing values 
pivot [, var_sisepuede] <- ifelse (pivot [, var_sisepuede]<=0.05,mean(pivot [, var_sisepuede]),pivot [, var_sisepuede])

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

##########
#"frac_waso_initial_composition_ind_food"
##############
var_sisepuede <- "frac_waso_initial_composition_ind_food"
var_wb_data <- c()
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- rowSums(wb_data[,var_wb_data],na.rm=TRUE)
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 
#now fill data gaps by imputation, zero values are associated with mostly missing values 
pivot [, var_sisepuede] <- ifelse (pivot [, var_sisepuede]<=0.05,mean(pivot [, var_sisepuede]),pivot [, var_sisepuede])

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

#############
#  [3] "frac_waso_initial_composition_ind_glass"
#################
var_sisepuede <- "frac_waso_initial_composition_ind_glass"
var_wb_data <- c()
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- rowSums(wb_data[,var_wb_data],na.rm=TRUE)
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 
#now fill data gaps by imputation, zero values are associated with mostly missing values 
pivot [, var_sisepuede] <- ifelse (pivot [, var_sisepuede]<=0.05,mean(pivot [, var_sisepuede]),pivot [, var_sisepuede])

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

##########################################
#  [4] "frac_waso_initial_composition_ind_metal"              
###########################################
var_sisepuede <- "frac_waso_initial_composition_ind_metal"
var_wb_data <- subset(colnames(wb_data),grepl("metal",colnames(wb_data))==TRUE)
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- pivot[,var_wb_data]/100
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 

#now fill data gaps by imputation, zero values are associated with mostly missing values 
pivot [, var_sisepuede] <- ifelse (pivot [, var_sisepuede]<=0.05,mean(pivot [, var_sisepuede]),pivot [, var_sisepuede])

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

#################
# [5] "frac_waso_initial_composition_ind_nappies"
#################
var_sisepuede <- "frac_waso_initial_composition_ind_nappies"
var_wb_data <- c()
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- rowSums(wb_data[,var_wb_data],na.rm=TRUE)
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 
#now fill data gaps by imputation, zero values are associated with mostly missing values 
pivot [, var_sisepuede] <- ifelse (pivot [, var_sisepuede]<=0.05,mean(pivot [, var_sisepuede]),pivot [, var_sisepuede])

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

#####################
# [6] "frac_waso_initial_composition_ind_other"
#####################
var_sisepuede <- "frac_waso_initial_composition_ind_other"
var_wb_data <- c("special_waste_construction_and_demolition_waste_tons_year_new",
                  "special_waste_e_waste_tons_year_new", 
                  "special_waste_hazardous_waste_tons_year_new", 
                  "special_waste_industrial_waste_tons_year_new", 
                  "special_waste_medical_waste_tons_year_new"
                )
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,"dummy"] <- rowSums(wb_data[,var_wb_data],na.rm=TRUE)
pivot [, "dummy"] <- ifelse (pivot [, "dummy"]<=0.05,mean(pivot [, "dummy"]),pivot [, "dummy"])
pivot[,var_sisepuede] <- 1- pivot [, "dummy"]
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 

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

###################################
#  [7] "frac_waso_initial_composition_ind_paper"
##################################
var_sisepuede <- "frac_waso_initial_composition_ind_paper"
var_wb_data <- c()
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- rowSums(wb_data[,var_wb_data],na.rm=TRUE)
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 
#now fill data gaps by imputation, zero values are associated with mostly missing values 
pivot [, var_sisepuede] <- ifelse (pivot [, var_sisepuede]<=0.05,mean(pivot [, var_sisepuede]),pivot [, var_sisepuede])

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

##############################################
##  [8] "frac_waso_initial_composition_ind_plastic"
##############################################
var_sisepuede <- "frac_waso_initial_composition_ind_plastic"
var_wb_data <- c()
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- rowSums(wb_data[,var_wb_data],na.rm=TRUE)
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 

#now fill data gaps by imputation, zero values are associated with mostly missing values 
pivot [, var_sisepuede] <- ifelse (pivot [, var_sisepuede]<=0.05,mean(pivot [, var_sisepuede]),pivot [, var_sisepuede])

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

#########################
# [9] "frac_waso_initial_composition_ind_rubber_leather"     
############################
var_sisepuede <- "frac_waso_initial_composition_ind_rubber_leather"
var_wb_data <- c()
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- rowSums(wb_data[,var_wb_data],na.rm=TRUE)
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 
#now fill data gaps by imputation, zero values are associated with mostly missing values 
pivot [, var_sisepuede] <- ifelse (pivot [, var_sisepuede]<=0.05,mean(pivot [, var_sisepuede]),pivot [, var_sisepuede])

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

#################
#[10] "frac_waso_initial_composition_ind_sludge"
#################
var_sisepuede <- "frac_waso_initial_composition_ind_sludge"
var_wb_data <- c()
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- rowSums(wb_data[,var_wb_data],na.rm=TRUE)
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 
#now fill data gaps by imputation, zero values are associated with mostly missing values 
pivot [, var_sisepuede] <- ifelse (pivot [, var_sisepuede]<=0.05,mean(pivot [, var_sisepuede]),pivot [, var_sisepuede])

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
#[11] "frac_waso_initial_composition_ind_textiles"
########################
var_sisepuede <- "frac_waso_initial_composition_ind_textiles"
var_wb_data <- c()
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- rowSums(wb_data[,var_wb_data],na.rm=TRUE)
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 
#now fill data gaps by imputation, zero values are associated with mostly missing values 
pivot [, var_sisepuede] <- ifelse (pivot [, var_sisepuede]<=0.05,mean(pivot [, var_sisepuede]),pivot [, var_sisepuede])

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

####################
#[12] "frac_waso_initial_composition_ind_wood"
####################
var_sisepuede <- "frac_waso_initial_composition_ind_wood"
var_wb_data <- subset(colnames(wb_data),grepl("wood",colnames(wb_data))==TRUE)
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- pivot[,var_wb_data]/100
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 

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

####################
#[13] "frac_waso_initial_composition_ind_yard"
###################
var_sisepuede <- "frac_waso_initial_composition_ind_yard"
var_wb_data <- c()
ids<- c("iso3c","region_id","income_id")
socio_economic <- c("gdp","population_population_number_of_people")
pivot <- wb_data[,c(ids,socio_economic,var_wb_data)]
head(pivot)
pivot[,var_sisepuede] <- rowSums(wb_data[,var_wb_data],na.rm=TRUE)
#check dimmensionality makes sense
summary(pivot[,var_sisepuede]) 
#now fill data gaps by imputation, zero values are associated with mostly missing values 
pivot [, var_sisepuede] <- ifelse (pivot [, var_sisepuede]<=0.05,mean(pivot [, var_sisepuede]),pivot [, var_sisepuede])

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


#read, review and rescale if necessary 
#municipal vars
municipal_vars <-list.files(root)
municipal_vars <-subset(municipal_vars,grepl("frac_waso_initial_composition_mun",municipal_vars)==TRUE)
mun_data<-list()
for (i in 1:length(municipal_vars))
{
#i <- 1
historical<-read.csv(paste0(paste0(root,municipal_vars[i],"\\","input_to_sisepuede\\historical\\"),municipal_vars[i],".csv"))
projected<-read.csv(paste0(paste0(root,municipal_vars[i],"\\","input_to_sisepuede\\projected\\"),municipal_vars[i],".csv"))
both<-rbind(historical,projected)
mun_data <- append(mun_data,list(both))
rm(both)
}
#merge all into one data.frame
mun_data<- Reduce(function(...) merge(...,), mun_data)
mun_data$total <- rowSums(mun_data[,municipal_vars])
dim(mun_data)
mun_data$total 
#all sum to one, no need to scale

#industrial vars
ind_vars <-list.files(root)
ind_vars <-subset(ind_vars,grepl("frac_waso_initial_composition_ind",ind_vars)==TRUE)
ind_data<-list()
for (i in 1:length(ind_vars))
{
#i <- 9
historical<-read.csv(paste0(paste0(root,ind_vars[i],"\\","input_to_sisepuede\\historical\\"),ind_vars[i],".csv"))
projected<-read.csv(paste0(paste0(root,ind_vars[i],"\\","input_to_sisepuede\\projected\\"),ind_vars[i],".csv"))
both<-rbind(historical,projected)
ind_data <- append(ind_data,list(both))
rm(both)
}
#merge all into one data.frame
ind_data<- Reduce(function(...) merge(...,), ind_data)
ind_data$total <- rowSums(ind_data[,ind_vars])
dim(ind_data)
ind_data$total 
#all sum to one, in this case we do scale 

ind_data[,ind_vars] <- ind_data[,ind_vars]/ind_data$total 
ind_data$total <- rowSums(ind_data[,ind_vars])
ind_data$total
ind_data$total<-NULL 

#re-write the files 
for (i in 1:length(ind_vars))
{
#i <- 1
pivot <- ind_data[,c("iso_code3","Year",ind_vars[i])]
#historical 
pivot_h<- subset(pivot,Year%in%c(2010:2020))
pivot_h <- pivot_h[order(pivot_h$iso_code3,pivot_h$Year),]
write.csv(pivot_h,paste0(paste0(root,ind_vars[i],"\\","input_to_sisepuede\\historical\\"),ind_vars[i],".csv"),row.names=FALSE)
#projection 
pivot_p<- subset(pivot,Year%in%c(2021:2050))
pivot_p<- pivot_p[order(pivot_p$iso_code3,pivot_p$Year),]
write.csv(pivot_p,paste0(paste0(root,ind_vars[i],"\\","input_to_sisepuede\\projected\\"),ind_vars[i],".csv"),row.names=FALSE)
}