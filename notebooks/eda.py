# %%
import pandas as pd
import numpy as np

# %%
# Load dataset
df = pd.read_csv("../data/Metro_Manila_Traffic_Incidents_2025.csv")


# %%
#Size
df.shape

# %%
#Data types
df.info()

# %%
#Columns names
df.columns

# %%
#Clean column names using snake_case and in lowercase

df.columns = df.columns.str.lower()
df.columns

# %%
# Removes rows where every column value is identical to another row.
df = df.drop_duplicates()

#Verify
df.duplicated().sum()

# %%
#Strip whitespace
df.columns = df.columns.str.strip()

for col in df.select_dtypes(include=["object", "string"]):
    df[col] = df[col].str.strip()

#Verify
for col in df.select_dtypes(include=["object", "string"]):
    print(col, df[col].str.contains(r"^\s|\s$", regex=True).sum())




# %%
# Validate primary key integrity:
# Ensure incident_id has no duplicates and matches total row count
total_rows = df.shape[0]
unique_ids = df["incident_id"].nunique()

print(total_rows, unique_ids)


# %%
# Datetime Standardization & Validation

# Combine date and time columns into a single datetime column
# Invalid or improperly formatted values will be converted to NaT
df["datetime"] = pd.to_datetime(
    df["date"] + " " + df["time"],
    errors="coerce"
)
invalid = df[df["datetime"].isna()]

#Verify
df["datetime"].isna().sum()

# Check Min and Max(All should be in range of year 2025)
df["datetime"].min()
df["datetime"].max()

#Drop date and time column
df = df.drop(columns=["date", "time"])
df.columns




# %%
#Standardize City names
df["city"] = df["city"].replace({
    "manila": "Manila",
    "QUEZON CITY": 'Quezon City',
})

#Verify
df["city"].value_counts(dropna=False)

# %%
# Analyze frequency of road_name values to identify inconsistencies and dominant entries
df["road_name"].value_counts(dropna=False)

# %%
# Analyze frequency of vehicle_type values to identify inconsistencies and dominant entries
df["vehicle_type"].value_counts(dropna=False)

# %%
# Analyze frequency of accident_type values to identify inconsistencies and dominant entries
df["accident_type"].value_counts(dropna=False)

# %%
# Analyze frequency of severity values to identify inconsistencies and dominant entries
df["severity"].value_counts(dropna=False)

# %%
# Analyze frequency of weather_condition values to identify inconsistencies and dominant entries
df["weather_condition"].value_counts(dropna=False)

#Standardize City names
df["weather_condition"] = df["weather_condition"].replace({
    "RAIN": "Rain",
    "clear": 'Clear',
})

#Verify
df["weather_condition"].value_counts(dropna=False)

# %%
# Analyze frequency of road_condition values to identify inconsistencies and dominant entries
df["road_condition"].value_counts(dropna=False)

# %%
# Analyze frequency of cause values to identify inconsistencies and dominant entries
df["cause"].value_counts(dropna=False)

# %%
# Data Quality Check: Validate and standardize driver_age
#Review distribution and summary statistics
df["driver_age"].describe()

#Check for missing values
df["driver_age"].isna().sum()

#Confirm current data type
df["driver_age"].dtype

#Identify unexpected decimal values (age should be whole number)
df[df["driver_age"] % 1 != 0]

#Detect unrealistic age values (domain validation)
df[df["driver_age"] < 0]
df[df["driver_age"] > 110]

#Convert to nullable integer type after validation
df["driver_age"] = df["driver_age"].astype("Int64")

#Verify: 
df["driver_age"].dtype

# %%
# Analyze frequency of driver_gender values to identify inconsistencies and dominant entries
df["driver_gender"].value_counts(dropna=False)

#Standardize Gender
df["driver_gender"] = df["driver_gender"].replace({
    "male": "Male",
    "FEMALE": 'Female',
})

#Verify
df["driver_gender"].value_counts(dropna=False)

# %%
# Analyze frequency of injury_count values to identify inconsistencies and dominant entries
df["injury_count"].value_counts(dropna=False)

df["injury_count"].dtype

# %%
#Remove negative damage costs

#Check if Any Negative Numbers Exist
(df["damage_cost_php"] < 0).any()

#Check How Many Negative Values
(df["damage_cost_php"] < 0).sum()

#See those negative rows
df[df["damage_cost_php"] < 0]

#Replacte negative damage cost by NaN
df.loc[df["damage_cost_php"]< 0, "damage_cost_php"] = np.nan

#Verify
(df["damage_cost_php"] < 0).sum()

# %%
#Data Quality Check: Validate Geographic Coordinates

#Ensure numeric type (convert if necessary)
df["latitude"] = pd.to_numeric(df["latitude"], errors="coerce")
df["longitude"] = pd.to_numeric(df["longitude"], errors="coerce")

#Check for missing values
lat_missing = df["latitude"].isna().sum()
lon_missing = df["longitude"].isna().sum()

# Latitude must be between -90 and 90
invalid_lat_global = df[
    (df["latitude"] < -90) | (df["latitude"] > 90)
]

# Longitude must be between -180 and 180
invalid_lon_global = df[
    (df["longitude"] < -180) | (df["longitude"] > 180)
]

# Confirm values fall within Philippines geographic range
# Approximate PH bounds: Latitude (4–21), Longitude (116–127)
invalid_lat_ph = df[
    (df["latitude"] < 4) | (df["latitude"] > 21)
]

invalid_lon_ph = df[
    (df["longitude"] < 116) | (df["longitude"] > 127)
]

# Detect potential swapped coordinates
# (Latitude unusually high for PH or longitude unusually low)
potential_swapped = df[
    (df["latitude"] > 90) | (df["longitude"] < 0)
]

#Detect placeholder coordinates (0,0)
zero_coordinates = df[
    (df["latitude"] == 0) & (df["longitude"] == 0)
]

#Verify
print("Missing Latitude:", lat_missing)
print("Missing Longitude:", lon_missing)
print("Invalid Global Latitude:", len(invalid_lat_global))
print("Invalid Global Longitude:", len(invalid_lon_global))
print("Invalid PH Latitude:", len(invalid_lat_ph))
print("Invalid PH Longitude:", len(invalid_lon_ph))
print("Potential Swapped:", len(potential_swapped))
print("Zero Coordinates:", len(zero_coordinates))


# %%
#Save Processed Data
df.to_csv("../data/processed/traffic_incidents_cleaned.csv", index=False)


