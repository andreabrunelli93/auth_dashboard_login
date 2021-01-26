import json
import requests
import pandas as pd
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
import psycopg2 

engine = create_engine('postgresql://postgres:admin@localhost:5432/dashboard_flask1')



def get_andamento_regioni_storico():
    remap_codes = { 1: "21", 2: "23", 3: "25", 4: "", 5: "34", 6: "36", 7: "42", 8: "45", 9: "52", 10: "55", 11: "57", 12: "62", 
                   13: "65", 14: "67", 15: "72", 16: "75", 17: "77", 18: "78", 19: "82", 20: "88", 21: "32", 22: "32" }

    res = requests.get("https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json")

    j = res.json()
    
    df = pd.DataFrame(j)
    
    df['codice_regione'].replace(remap_codes, inplace=True)
    
    df.to_sql('andamento_regioni', engine, if_exists='replace', chunksize=1000)
    
    return df

df = get_andamento_regioni_storico()


test = engine.execute("SELECT TOP 1 data FROM andamento_regioni  ORDER BY ID DESC").fetchall()
print(test)

