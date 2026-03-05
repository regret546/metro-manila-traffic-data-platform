import pandas as pd
import numpy as np

# Data Cleaning

def clean_column_names(df: pd.DataFrame) -> pd.DataFrame:
    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
    )
    return df

def remove_duplicates(df: pd.DataFrame) -> pd.DataFrame:
    df = df.drop_duplicates()
    return df

def fill_missing_values(df: pd.DataFrame) -> pd.DataFrame:
    df = df.fillna({
    "severity": "Unknown",
    "road_condition": "Unknown",
    "cause": "Unknown",
    "injury_count": 0
    })
    return df

def create_datetime_column(df: pd.DataFrame) -> pd.DataFrame:
    df["datetime"] = pd.to_datetime(
        df["date"].astype(str) + " " + df["time"].astype(str),
        errors="coerce"
    )

    df = df.drop(columns=["date", "time"])
    return df

def standardize_city(df: pd.DataFrame) -> pd.DataFrame:
    df["city"] = df["city"].str.strip().str.title()
    return df

def standardize_weather_condition(df: pd.DataFrame) -> pd.DataFrame:
    df["weather_condition"] = df["weather_condition"].str.strip().str.title()
    return df

def convert_age_column(df: pd.DataFrame) -> pd.DataFrame:
    df["driver_age"] = df["driver_age"].astype("Int64")
    return df

def standardize_gender(df: pd.DataFrame) -> pd.DataFrame:
    df["driver_gender"] = df["driver_gender"].str.strip().str.title()
    return df

def replace_negative_damage_cost_column(df: pd.DataFrame) -> pd.DataFrame:
    df.loc[df["damage_cost_php"]< 0, "damage_cost_php"] = np.nan
    return df

# Feature Engineering