import pandas as pd

def save_to_parquet(df: pd.DataFrame, path: str)-> None:
    df.to_parquet(path, index=False)