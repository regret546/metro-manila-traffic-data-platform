import pandas as pd
import psycopg2
from dotenv import load_dotenv
from io import StringIO
import yaml
import os


def save_to_parquet(df: pd.DataFrame, path: str) -> None:
    df.to_parquet(path, index=False)


def save_to_csv(df: pd.DataFrame, path: str) -> None:
    df.to_csv(path, index=False)


def connect_db():
    load_dotenv()
    password = os.getenv("DB_PASSWORD")

    with open("config/config.yaml", "r") as f:
        config = yaml.safe_load(f)

    db = config["database"]

    conn = psycopg2.connect(
        host=db["host"],
        port=db["port"],
        database=db["name"],
        user=db["user"],
        password=password,
    )

    cursor = conn.cursor()

    return conn, cursor, config


def load_staging(cursor, config):
    df = pd.read_parquet(config["output_data"])

    buffer = StringIO()
    df.to_csv(buffer, index=False, header=False, na_rep="\\N")
    buffer.seek(0)

    cursor.copy_expert(
        """
        COPY staging_incidents
        FROM STDIN
        WITH CSV
        NULL '\\N'
        """,
        buffer
    )

    print("Staging table loaded.")


def load_dimensions(cursor):
    #dim_vehicle
    cursor.execute("""
    INSERT INTO dim_vehicle (vehicle_type)
    SELECT DISTINCT vehicle_type
    FROM staging_incidents
    ON CONFLICT DO NOTHING;
    """)

    #dim_location
    cursor.execute("""
    INSERT INTO dim_location (city, road_name, latitude, longitude)
    SELECT DISTINCT city, road_name, latitude, longitude
    FROM staging_incidents
    ON CONFLICT (city, road_name, latitude, longitude) DO NOTHING;
    """)
    
    #dim_severity
    cursor.execute("""
    INSERT INTO dim_severity (severity)
    SELECT DISTINCT severity
    FROM staging_incidents
    ON CONFLICT DO NOTHING;
    """)

    #dim_weather
    cursor.execute("""
    INSERT INTO dim_weather (weather_condition)
    SELECT DISTINCT weather_condition
    FROM staging_incidents
    ON CONFLICT DO NOTHING;
    """)

    #dim_road_condition
    cursor.execute("""
    INSERT INTO dim_road_condition (road_condition)
    SELECT DISTINCT road_condition
    FROM staging_incidents
    ON CONFLICT DO NOTHING;
    """)

    #dim_cause
    cursor.execute("""
    INSERT INTO dim_cause (cause)
    SELECT DISTINCT cause
    FROM staging_incidents
    ON CONFLICT DO NOTHING;
    """)

    #dim_driver
    cursor.execute("""
    INSERT INTO dim_driver (driver_age_group, driver_gender)
    SELECT DISTINCT age_group, driver_gender
    FROM staging_incidents
    ON CONFLICT (driver_age_group, driver_gender) DO NOTHING;
    """)

    #dim_date
    cursor.execute("""
    INSERT INTO dim_date (datetime, hour, day_of_week, is_weekend)
    SELECT DISTINCT datetime, hour, day_of_week, is_weekend
    FROM staging_incidents
    ON CONFLICT (date_id) DO NOTHING;
    """)


def load_fact(cursor):
    # TODO: Insert data into fact table
    pass


def main():
    conn, cursor, config = connect_db()
    load_staging(cursor, config)
    load_dimensions(cursor)
    # load_fact(cursor)
    conn.commit()
    cursor.close()
    conn.close()
    print("ETL load complete.")


if __name__ == "__main__":
    main()