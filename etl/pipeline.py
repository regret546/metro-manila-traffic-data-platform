import logging
import yaml


from ingestion import load_data
from transformation import (
    clean_column_names,
    remove_duplicates,
    fill_missing_values,
    create_datetime_column,
    standardize_city,
    standardize_weather_condition,
    convert_age_column,
    standardize_gender,
    clean_injury_count,
    replace_negative_damage_cost_column,
    clean_coordinates,
    transform_features
)
from validation import (
    check_missing_values,
    check_duplicates,
    validate_datetime,
    validate_age_range,
    validate_damage_cost,
    validate_required_columns,
)
from loader import (
    save_to_parquet, 
    save_to_csv
)

#Config
with open("config/config.yaml", "r") as f:
    config = yaml.safe_load(f)

input_path = config["input_data"]
output_path = config["output_data"]
output_csv_path = config["output_csv_path"]


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

logging.info("Starting ETL pipeline")

# Extract
logging.info("Loading dataset")
df = load_data(input_path)


# Transform
logging.info("Cleaning column names")
df = clean_column_names(df)

logging.info("Removing duplicate rows")
df = remove_duplicates(df)

logging.info("Filling missing values")
df = fill_missing_values(df)

logging.info("Creating datetime column")
df = create_datetime_column(df)

logging.info("Standardizing city column")
df = standardize_city(df)

logging.info("Standardizing weather condition column")
df = standardize_weather_condition(df)

logging.info("Converting driver age column")
df = convert_age_column(df)

logging.info("Cleaning injury_count value")
df = clean_injury_count(df)

logging.info("Standardizing driver gender column")
df = standardize_gender(df)

logging.info("Replacing negative damage cost values")
df = replace_negative_damage_cost_column(df)

logging.info("Cleaning coordinates")
df = clean_coordinates(df)

logging.info("Feature Engineering")
df = transform_features(df)


# Validation
logging.info("Running validation checks")

missing_values = check_missing_values(df)
duplicates = check_duplicates(df)
invalid_datetime = len(validate_datetime(df))
invalid_age = len(validate_age_range(df))
invalid_damage = len(validate_damage_cost(df))

logging.info(f"Missing values:\n{missing_values}")
logging.info(f"Duplicate rows: {duplicates}")
logging.info(f"Invalid datetime rows: {invalid_datetime}")
logging.info(f"Invalid age rows: {invalid_age}")
logging.info(f"Invalid damage cost rows: {invalid_damage}")

validate_required_columns(df)


# Load
logging.info("Saving cleaned dataset to parquet")
save_to_parquet(df, output_path)
save_to_csv(df, output_csv_path)

logging.info("ETL pipeline completed successfully")