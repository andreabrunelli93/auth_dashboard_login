import json
import requests
import pandas as pd
from pandas import json_normalize
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
import psycopg2 
from datetime import date, datetime
import numpy as np

engine = create_engine('postgresql://postgres:admin@localhost:5432/dashboard_flask1')

remap_codes_reg_vaccine = { 65: "ABR", 77: "BAS", 78: "CAL", 72: "CAM", 45: "EMR", 36: "FVG", 62: "LAZ", 42: "LIG", 25: "LOM", 57: "MAR", 67: "MOL", 21: "PIE", 
                            75: "PUG", 88: "SAR", 82: "SIC", 52: "TOS", 32: "PAT", 55: "UMB", 23: "VDA", 34: "VEN" };

def get_region_vaccine_last():
    
    today = str(date.today())

    try: 
        last_day = str(engine.execute("SELECT ultimo_aggiornamento FROM vaccini_regioni ORDER BY ultimo_aggiornamento DESC LIMIT 1").fetchall())
        last_day = last_day.rsplit('T',1)[0]
    except:
        last_day = 0
    
    now = datetime.now()
    current_hour = int(now.strftime("%H"))
    
    if(today != last_day):
        if(current_hour > 10):
            print('aggiorno gli elementi')
            res = requests.get("https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/vaccini-summary-latest.json")

            j = res.json()

            j_norm = json_normalize(j['data'])

            df = pd.DataFrame(j_norm)
            
            
            for index, (key, value) in enumerate(remap_codes_reg_vaccine.items()):
                df['index'] = np.where((df.area == value), key, df['index'])
            
            df.to_sql('vaccini_regioni', engine, if_exists='replace', chunksize=1000)
            
            df_j = df.to_json(orient='records')
            
            return df_j

    else:
        print("elementi già aggiornati in db")
        df = pd.read_sql_table('vaccini_regioni', engine )
        
        df_j = df.to_json(orient='records')
        return df_j


