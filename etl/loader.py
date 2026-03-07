import pandas as pd

def save_to_parquet(df: pd.DataFrame, path: str)-> None:
    df.to_parquet(path, index=False)

def save_to_csv(df: pd.DataFrame, path: star)-> None:
    df.to_csv(path, index=False)