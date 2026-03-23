# Metro Manila ETL

This project builds a cleaned traffic incidents dataset and loads it into PostgreSQL using an ETL pipeline.

## Project Links
- Data source (Kaggle): [Metro Manila Traffic Incidents 2025](https://www.kaggle.com/datasets/hannile/metro-manila-traffic-incidents-2025?select=Metro_Manila_Traffic_Incidents_2025.csv)
- Dashboard website: [manilaanalytics.jodur.tech](https://manilaanalytics.jodur.tech/)
- GitHub portfolio repository: [regret546/metro-manila-traffic-data-platform](https://github.com/regret546/metro-manila-traffic-data-platform)

## Project Files
- `etl/pipeline.py` main ETL pipeline runner
- `etl/ingestion.py` load raw CSV data
- `etl/transformation.py` clean and standardize fields and create feature columns
- `etl/validation.py` validate cleaned data
- `etl/loader.py` load data into staging, dimension tables, and the fact table
- `config/config.yaml` paths for input and output data

## Data Model
`Data Model.png`

![Data Model](./Data%20Model.png)

## Data Pipeline and Architecture
`Data Pipiline and Architecture.png`

![Data Pipeline and Architecture](./Data%20Pipiline%20and%20Architecture.png)

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

