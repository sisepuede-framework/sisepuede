
"""New input creator
This script allows a contributor create a new model input based on two files: 
    * config.yaml 
    * new_input.csv
"""

import yaml
import os
import shutil
import argparse
import logging
import pandas as pd

from projected import projection_funct




class NewInput:
    """
    A class used to represent a new Input for the model
    and the Methods needed to manage its creation
    ...

    Attributes
    ----------
    config: dict
        Baseline to create the new input
    metadata: dict  
        Metadata informacion to document the new input
    

    Methods
    -------
    create_new_input():
        Create the paths needed for the 
        new model input data, if the path already exists then empty the folders, 
        copy the data raw data and scripts if they exist and create the new data
        
    """
    def __init__(self):
        """
        """
        self.config,self.metadata = self.__get_configs()
        self.__folder_root = os.path.join('..','..','data')

    def __get_configs(self)->dict:
        """Loads the information from the configuration file 
        and returns it as a two dictionary documents, 
        one for the creation of the new model input and the
        other for the metadata file in the documentation folder

        Parameters
        ----------
        None

        Returns
        -------
        config
            a dictionary from the config file
        """
        with open('config.yaml', 'r') as file:
            docs = [doc for doc in yaml.safe_load_all(file)]
        return docs
    
    def __create_path(self,path:str)->None:
        """Create a new path, and if the path already exists 
        then empty the folders
        ...

        Parameters
        ----------
        path:
            The new path to be created

        Returns
        -------
        config
            a dictionary from the config file
        """
        logging.debug('Crating the path ' + path)
        if os.path.exists(path):
            shutil.rmtree(path)
        os.makedirs(path)
    
    def create_new_input(self)->None:
        """Create the paths needed for the 
        new model input data, if the path already exists then empty the folders, 
        copy the data raw data and scripts if they exist and create the new data
        ...

        Parameters
        ----------
        None

        Returns
        -------
        None
        
        """

        #Creating new input folder structure
        self.__folder_sector        = os.path.join(self.__folder_root,self.config['sector'])
        self.__folder_new_input     = os.path.join(self.__folder_sector,self.config['name'])
        self.__folder_docs          = os.path.join(self.__folder_new_input,"docs")
        self.__folder_hispro        = os.path.join(self.__folder_new_input,"input_to_sisepuede")
        self.__folder_raw_data      = os.path.join(self.__folder_new_input,"raw_data")
        self.__folder_src           = os.path.join(self.__folder_new_input,"src")
        self.__folder_historical    = os.path.join(self.__folder_hispro,"historical")
        self.__folder_projected     = os.path.join(self.__folder_hispro,"projected")

        #creating the main folder
        self.__create_path(self.__folder_new_input)

        #creating the documentation
        logging.debug('Creating the documentation')
        self.__create_path(self.__folder_docs)
        metadata_file_name = os.path.join(self.__folder_docs,"metadata.yaml")
        metadata_file=open(metadata_file_name,"w")
        metadata_file_dict = dict()
        metadata_file_dict["variable"] = self.config
        yaml.dump(metadata_file_dict | self.metadata,metadata_file)
        metadata_file.close()

        #creating the raw data
        logging.debug('Creating the raw data folder')
        shutil.copytree("raw_data", self.__folder_raw_data)
        shutil.copy('new_input.csv', self.__folder_raw_data)
        shutil.copy('projected.py', self.__folder_raw_data)

        #creating the scripts
        logging.debug('Creating the src folder')
        shutil.copytree("src", self.__folder_src)

        #creating the input to sisepuede folder
        logging.debug('Creating the input to sisepuede folder')
        self.__create_path(self.__folder_hispro)
        
        self.__create_path(self.__folder_projected)

        #creating the historical csv file
        logging.debug('Creating the historical data')
        self.__create_path(self.__folder_historical)
        dfh = pd.read_csv('new_input.csv', header=None) 
        dfh.columns = ['Year',self.config['name']]
        dfh['Iso_code3'] = 'LA'
        dfh['Region'] = 'louisiana'
        historical_file_name = os.path.join(self.__folder_historical,self.config['name']+'.csv')
        dfh.to_csv( historical_file_name, index=False)


        ##creating the prejected csv file
        logging.debug('Creating the projected data')
        self.__create_path(self.__folder_projected)

        last_year = dfh['Year'].max()
        proy_len = 2050 - last_year

        if not self.config['projection']:
            new_input_projections = projection_funct(
                dfh[self.config['name']].values,proy_len)
        else:
            inc = float(self.config['projection'])
            last_value = float(dfh[self.config['name']].iloc[-1])
            new_input_projections = []
            for i in range(proy_len):
                last_value+=inc
                new_input_projections.append(round(last_value,2))
        
        years = [i for i in range(last_year+1,2051+1)]
        zipped = list(zip(years, new_input_projections))

        dfp = pd.DataFrame(zipped, columns=['Year',self.config['name']])
        dfp['Iso_code3'] = 'LA'
        dfp['Region'] = 'louisiana'

        projected_file_name = os.path.join(self.__folder_projected,self.config['name']+'.csv')
        dfp.to_csv( projected_file_name, index=False)




        
        

def main():
    """Main function of the script.
    It is based on the config.yaml and new_input.csv files 
    and creates the csv files that will serve as input to the model, 
    historical and projected, it also arranges them in the corresponding folders, 
    generates the necessary documentation and copies the backup of the raw data 
    and the scripts used to generate the new data in new_input.csv

    Parameters
    ----------
    None

    Returns
    -------
    None
    """

    #Get the config and metadata of the new_input variable
    logging.info('********************************************')
    logging.info('Creating the new input')
    logging.info('********************************************')
    logging.info('Loading the baseline information..')
    new_input = NewInput()
    logging.info('Creating new files..')
    new_input.create_new_input()
    logging.info('Success in creating the new variable\n\n')
    
#Entry point
if __name__ == "__main__":

    parser = argparse.ArgumentParser()
    parser.add_argument("-v", "--verbose", const=1, default=0, type=int, nargs="?",
                    help="increase verbosity: 0 = only warnings, 1 = info, 2 = debug. No number means info. Default is no verbosity.")
    # v 0 : warning,error,critical
    # v 1 : 0 + info
    # v 2 : 1 + debug
    args   = parser.parse_args()
    logger = logging.getLogger()

    if args.verbose   == 0:
        logger.setLevel(logging.WARN) 
    elif args.verbose == 1:
        logger.setLevel(logging.INFO) 
    elif args.verbose == 2:
        logger.setLevel(logging.DEBUG)

    main()







