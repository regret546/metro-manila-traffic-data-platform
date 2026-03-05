import pandas as pd
import numpy as np

# Data Cleaning

def clean_column_names(df: pd.DataFrame) -> pd.DataFrame:
    """Standardize column names (strip spaces, lowercase, replace spaces with underscores)."""
    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
    )
    return df


def remove_duplicates(df: pd.DataFrame) -> pd.DataFrame:
    """Remove duplicate rows from the DataFrame."""
    df = df.drop_duplicates()
    return df


def fill_missing_values(df: pd.DataFrame) -> pd.DataFrame:
    """Fill missing values for selected columns with default values."""
    df = df.fillna({
        "severity": "Unknown",
        "road_condition": "Unknown",
        "cause": "Unknown",
        "injury_count": 0
    })
    return df


def create_datetime_column(df: pd.DataFrame) -> pd.DataFrame:
    """Create a datetime column by combining 'date' and 'time', then drop the original columns."""
    df["datetime"] = pd.to_datetime(
        df["date"].astype(str) + " " + df["time"].astype(str),
        errors="coerce"
    )

    df = df.drop(columns=["date", "time"])
    return df


def standardize_city(df: pd.DataFrame) -> pd.DataFrame:
    """Clean and standardize city names."""
    df["city"] = df["city"].str.strip().str.title()
    return df


def standardize_weather_condition(df: pd.DataFrame) -> pd.DataFrame:
    """Clean and standardize weather condition values."""
    df["weather_condition"] = df["weather_condition"].str.strip().str.title()
    return df


def convert_age_column(df: pd.DataFrame) -> pd.DataFrame:
    """Convert 'driver_age' column to nullable integer type."""
    df["driver_age"] = df["driver_age"].astype("Int64")
    return df


def standardize_gender(df: pd.DataFrame) -> pd.DataFrame:
    """Clean and standardize driver gender values."""
    df["driver_gender"] = df["driver_gender"].str.strip().str.title()
    return df


def replace_negative_damage_cost_column(df: pd.DataFrame) -> pd.DataFrame:
    """Convert to INT. Replace negative damage cost values with NaN."""
    df["damage_cost_php"] = df["damage_cost_php"].astype("Int64")
    df.loc[df["damage_cost_php"] < 0, "damage_cost_php"] = np.nan
    return df

# Feature Engineering
def transform_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create additional analytical features for the traffic dataset.

    Adds hour, day_of_week, month_name, weekend flag,
    cost_category, and age_group columns.
    """

    # Hour of incident
    df["hour"] = df["datetime"].dt.strftime("%#I %p")

    # Day of the week
    df["day_of_week"] = df["datetime"].dt.day_name()

    # Month name
    df["month_name"] = df["datetime"].dt.month_name()

    # Weekend flag
    df["is_weekend"] = df["datetime"].dt.weekday >= 5

    # Damage cost category
    df["cost_category"] = pd.cut(
        df["damage_cost_php"],
        bins=[0, 30000, 70000, 100000],
        labels=["Low", "Medium", "High"]
    )

    # Age group category
    df["age_group"] = pd.cut(
        df["driver_age"],
        bins=[0, 17, 25, 40, 60, float("inf")],
        labels=["Minor", "18-25", "26-40", "41-60", "Senior"]
    )

    # Replace missing age groups
    df["age_group"] = df["age_group"].cat.add_categories(["Unknown"]).fillna("Unknown")

    return df
