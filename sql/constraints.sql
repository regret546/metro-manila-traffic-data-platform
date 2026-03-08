ALTER TABLE fact_incidents
ADD CONSTRAINT fk_incidents_location
FOREIGN KEY (location_id)
REFERENCES dim_location(location_id);

ALTER TABLE fact_incidents
ADD CONSTRAINT fk_incidents_vehicle
FOREIGN KEY (vehicle_id)
REFERENCES dim_vehicle(vehicle_id);

ALTER TABLE fact_incidents
ADD CONSTRAINT fk_incidents_severity
FOREIGN KEY (severity_id)
REFERENCES dim_severity(severity_id);

ALTER TABLE fact_incidents
ADD CONSTRAINT fk_incidents_weather
FOREIGN KEY (weather_id)
REFERENCES dim_weather(weather_id);

ALTER TABLE fact_incidents
ADD CONSTRAINT fk_incidents_road_condition
FOREIGN KEY (road_condition_id)
REFERENCES dim_road_condition(road_condition_id);

ALTER TABLE fact_incidents
ADD CONSTRAINT fk_incidents_cause
FOREIGN KEY (cause_id)
REFERENCES dim_cause(cause_id);

ALTER TABLE fact_incidents
ADD CONSTRAINT fk_incidents_driver
FOREIGN KEY (driver_id)
REFERENCES dim_driver(driver_id);

ALTER TABLE fact_incidents
ADD CONSTRAINT fk_incidents_date
FOREIGN KEY (date_id)
REFERENCES dim_date(date_id);