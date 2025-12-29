import pandas as pd

def clean_and_merge(dataframes):
    final_data = []

    for df in dataframes:
        df = df.drop_duplicates().copy()

        for column in df.columns:
            if df[column].dtype == "object":
                df[column] = df[column].fillna("unknown")
                df[column] = df[column].str.strip()
                df[column] = df[column].str.lower()
            else:
                df[column] = df[column].fillna(df[column].median())

        final_data.append(df)

    return pd.concat(final_data, ignore_index=True)
