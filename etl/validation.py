import pandas as pd
import logging


def check_missing_values(df: pd.DataFrame) -> pd.Series:
    """
    Returns number of missing values per column
    """
    try:
        return df.isna().sum()
    except Exception as e:
        logging.error(f"Failed to check missing values: {e}")
        raise


def check_duplicates(df: pd.DataFrame) -> int:
    """
    Returns number of duplicate rows
    """
    try:
        return df.duplicated().sum()
    except Exception as e:
        logging.error(f"Failed to check duplicates: {e}")
        raise


def validate_datetime(df: pd.DataFrame) -> pd.DataFrame:
    """
    Returns rows with invalid datetime values
    """
    try:
        invalid = df[df["datetime"].isna()]
        return invalid
    except Exception as e:
        logging.error(f"Datetime validation failed: {e}")
        raise


def validate_age_range(df: pd.DataFrame) -> pd.DataFrame:
    """
    Returns rows with unrealistic driver age
    """
    try:
        invalid = df[(df["driver_age"] < 16) | (df["driver_age"] > 100)]
        return invalid
    except Exception as e:
        logging.error(f"Driver age validation failed: {e}")
        raise


def validate_damage_cost(df: pd.DataFrame) -> pd.DataFrame:
    """
    Returns rows with negative damage cost
    """
    try:
        invalid = df[df["damage_cost_php"] < 0]
        return invalid
    except Exception as e:
        logging.error(f"Damage cost validation failed: {e}")
        raise


def validate_required_columns(df: pd.DataFrame) -> bool:
    """
    Ensure important columns exist
    """
    try:
        required = {
            "city",
            "severity",
            "datetime",
            "driver_age",
            "damage_cost_php"
        }
        
        missing = required - set(df.columns)

        if missing:
            raise ValueError(f"Missing required columns: {missing}")

        return True

    except Exception as e:
        logging.error(f"Column validation failed: {e}")
        raise