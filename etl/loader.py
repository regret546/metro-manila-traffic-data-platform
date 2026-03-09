import pandas as pd
import psycopg2
from dotenv import load_dotenv
from io import StringIO
import yaml
import os


def save_to_parquet(df: pd.DataFrame, path: str)-> None:
    df.to_parquet(path, index=False)

def save_to_csv(df: pd.DataFrame, path: star)-> None:
    df.to_csv(path, index=False)


#Load to postggres
# def load_to_postgres():

# load .env
load_dotenv()
password = os.getenv("DB_PASSWORD")

#load yaml
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
conn.commit()








# print("Database connection successful!")

# cursor.execute("SELECT * FROM dim_vehicle;")
# rows = cursor.fetchall()

# for row in rows:
#     print(row)

# 
# print("Rows loaded:", len(df))