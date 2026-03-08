-- dim table 

CREATE TABLE dim_location(
    location_id SERIAL PRIMARY KEY,
    city TEXT NOT NULL,
    road_name TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    UNIQUE (city, road_name, latitude, longitude)
);

CREATE TABLE dim_vehicle(
    vehicle_id SERIAL PRIMARY KEY,
    vehicle_type TEXT NOT NULL UNIQUE
);

CREATE TABLE dim_severity(
    severity_id SERIAL PRIMARY KEY,
    severity TEXT NOT NULL UNIQUE
);

CREATE TABLE dim_weather (
    weather_id SERIAL PRIMARY KEY,
    weather TEXT NOT NULL UNIQUE
);

CREATE TABLE dim_road_condition (
    road_condition_id SERIAL PRIMARY KEY,
    road_condition TEXT NOT NULL UNIQUE
);

CREATE TABLE dim_cause (
    cause_id SERIAL PRIMARY KEY,
    cause TEXT NOT NULL UNIQUE
);

CREATE TABLE dim_driver (
    driver_id SERIAL PRIMARY KEY,
    driver_age_group TEXT,
    driver_gender TEXT,
    UNIQUE(driver_age_group, driver_gender)
);

CREATE TABLE dim_date (
    date_id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    hour INTEGER,
    day_of_week TEXT,
    is_weekend BOOLEAN
);

-- fact table 

CREATE TABLE fact_incidents (
    incident_id SERIAL PRIMARY KEY,
    injury_count INT NOT NULL,
    damage_cost_php NUMERIC(12,2),
    location_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    severity_id INT NOT NULL,
    weather_id INT NOT NULL,
    road_condition_id INT NOT NULL,
    cause_id INT NOT NULL,
    driver_id INT NOT NULL,
    date_id INT NOT NULL
);