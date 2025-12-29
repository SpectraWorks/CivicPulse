import os
import pandas as pd

RAW_DATA_DIRECTORY = "data/raw"

def loading_files():

    dataframes = []

    for file_name in os.listdir(RAW_DATA_DIRECTORY):
        if not file_name.endswith(".csv"):
            continue

        full_file_path = os.path.join(RAW_DATA_DIRECTORY, file_name)

        dataframe = pd.read_csv(full_file_path)

        dataframe["source_file"] = file_name
        dataframes.append(dataframe)

    return dataframes
