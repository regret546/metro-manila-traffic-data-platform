import pandas as pd
import psycopg2
from dotenv import load_dotenv
from io import StringIO
import yaml
import os


def save_to_parquet(df: pd.DataFrame, path: str) -> None:
    """Save a DataFrame as a Parquet file."""
    df.to_parquet(path, index=False)


def save_to_csv(df: pd.DataFrame, path: str) -> None:
    """Save a DataFrame as a CSV file."""
    df.to_csv(path, index=False)


def connect_db():
    """Connect to PostgreSQL and load database settings from config."""
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
    """Clear the staging table and load fresh data from the Parquet file."""
    cursor.execute("TRUNCATE TABLE staging_incidents;")

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
    """Load distinct records from staging into dimension tables."""
    # dim_vehicle
    cursor.execute("""
    INSERT INTO dim_vehicle (vehicle_type)
    SELECT DISTINCT vehicle_type
    FROM staging_incidents
    ON CONFLICT DO NOTHING;
    """)

    # dim_location
    cursor.execute("""
    INSERT INTO dim_location (city, road_name, latitude, longitude)
    SELECT DISTINCT city, road_name, latitude, longitude
    FROM staging_incidents
    ON CONFLICT (city, road_name, latitude, longitude) DO NOTHING;
    """)
    
    # dim_severity
    cursor.execute("""
    INSERT INTO dim_severity (severity)
    SELECT DISTINCT severity
    FROM staging_incidents
    ON CONFLICT DO NOTHING;
    """)

    # dim_weather
    cursor.execute("""
    INSERT INTO dim_weather (weather_condition)
    SELECT DISTINCT weather_condition
    FROM staging_incidents
    ON CONFLICT DO NOTHING;
    """)

    # dim_road_condition
    cursor.execute("""
    INSERT INTO dim_road_condition (road_condition)
    SELECT DISTINCT road_condition
    FROM staging_incidents
    ON CONFLICT DO NOTHING;
    """)

    # dim_cause
    cursor.execute("""
    INSERT INTO dim_cause (cause)
    SELECT DISTINCT cause
    FROM staging_incidents
    ON CONFLICT DO NOTHING;
    """)

    # dim_driver
    cursor.execute("""
    INSERT INTO dim_driver (driver_age_group, driver_gender)
    SELECT DISTINCT age_group, driver_gender
    FROM staging_incidents
    ON CONFLICT (driver_age_group, driver_gender) DO NOTHING;
    """)

    # dim_date
    cursor.execute("""
    INSERT INTO dim_date (full_date, hour, day_of_week, is_weekend)
    SELECT DISTINCT datetime, hour, day_of_week, is_weekend
    FROM staging_incidents
    ON CONFLICT DO NOTHING;
    """)


def load_fact(cursor):
    """Load incident records into the fact table by joining dimension tables."""
    # fact_incidents
    cursor.execute("""
    INSERT INTO fact_incidents (
        incident_id,
        location_id,
        vehicle_id,
        severity_id,
        weather_id,
        road_condition_id,
        cause_id,
        driver_id,
        date_id,
        damage_cost_php,
        injury_count
    )
    SELECT
        st.incident_id,
        l.location_id,
        v.vehicle_id,
        s.severity_id,
        w.weather_id,
        r.road_condition_id,
        c.cause_id,
        d.driver_id,
        dt.date_id,
        st.damage_cost_php,
        st.injury_count
    FROM staging_incidents st
    LEFT JOIN dim_location l
        ON st.city = l.city
       AND st.road_name = l.road_name
       AND st.latitude = l.latitude
       AND st.longitude = l.longitude
    LEFT JOIN dim_vehicle v
        ON st.vehicle_type = v.vehicle_type
    LEFT JOIN dim_severity s
        ON st.severity = s.severity
    LEFT JOIN dim_weather w
        ON st.weather_condition = w.weather_condition
    LEFT JOIN dim_road_condition r
        ON st.road_condition = r.road_condition
    LEFT JOIN dim_cause c
        ON st.cause = c.cause
    LEFT JOIN dim_driver d
        ON st.age_group = d.driver_age_group
        AND st.driver_gender = d.driver_gender
    LEFT JOIN dim_date dt
        ON st.datetime::date = dt.full_date
        AND st.hour = dt.hour
        AND st.day_of_week = dt.day_of_week
        AND st.is_weekend = dt.is_weekend
    ON CONFLICT (incident_id) DO NOTHING
    """)


def main():
    """Run the full ETL process from staging load to fact load."""
    conn, cursor, config = connect_db()
    load_staging(cursor, config)
    load_dimensions(cursor)
    load_fact(cursor)
    conn.commit()
    cursor.close()
    conn.close()
    print("ETL load complete.")


if __name__ == "__main__":
    main()