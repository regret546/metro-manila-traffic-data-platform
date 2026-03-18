# Metro Manila ETL

This project builds a cleaned traffic incidents dataset and loads it into PostgreSQL using an ETL pipeline.

## Files
- `etl/pipeline.py` main ETL pipeline runner
- `etl/ingestion.py` load raw CSV data
- `etl/transformation.py` clean and standardize fields and create feature columns
- `etl/validation.py` validate cleaned data
- `etl/loader.py` load data into staging, dimension tables, and the fact table
- `config/config.yaml` paths for input and output data

## Data model
See `Data Model.svg` in the project root:
[`Data Model`](./Data%20Model.svg)

## ETL flow
1. Ingestion reads the raw CSV into a pandas DataFrame.
2. Transformation cleans columns, standardizes city, weather, gender, and coordinates, and creates extra fields like `hour`, `day_of_week`, and `is_weekend`.
3. Validation checks for missing values, duplicates, and invalid fields.
4. Loading saves the cleaned dataset to Parquet, then loads:
   - `staging_incidents`
   - dimension tables like `dim_location`, `dim_severity`, `dim_weather`
   - the `fact_incidents` table using joins to the dimension tables

## Setup
- PostgreSQL must be running and reachable.
- Database settings are in `config/config.yaml`.
- The database password is read from your environment (the loader uses `.env`).

## Run the ETL
From the project root:
```bash
python etl/pipeline.py
```

