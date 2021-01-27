import json
import requests
import pandas as pd
from pandas import json_normalize
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
import psycopg2 
from datetime import date, datetime

engine = create_engine('postgresql://postgres:admin@localhost:5432/dashboard_flask1')

remap_codes_reg_vaccine = { 0: "65", 1: "77", 2: "78", 3: "72", 4: "45", 5: "36", 6: "62", 7: "42", 8: "25", 9: "57", 10: "67", 11: "21", 
                   12: "21", 13: "75", 14: "88", 15: "82", 16: "52", 17: "32", 18: "55", 19: "23", 20: "34" }
def get_region_vaccine_last():
    
    today = str(date.today())

    try: 
        last_day = str(engine.execute("SELECT ultimo_aggiornamento FROM vaccini_regioni ORDER BY ultimo_aggiornamento DESC LIMIT 1").fetchall())
        last_day = last_day.rsplit('T',1)[0]
    except:
        last_day = 0
    
    now = datetime.now()
    current_hour = int(now.strftime("%H"))
    
    if(today == last_day):
        if(current_hour > 18):
            print('aggiorno gli elementi')
            res = requests.get("https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/vaccini-summary-latest.json")

            j = res.json()

            j_norm = json_normalize(j['data'])

            df = pd.DataFrame(j_norm)

            df['index'].replace(remap_codes_reg_vaccine, inplace=True)
            
            df.to_sql('vaccini_regioni', engine, if_exists='replace', chunksize=1000)
            
            df_j = df.to_json(orient='records')
            
            return df_j

    else:
        print("elementi già aggiornati in db")
        df = pd.read_sql_table('vaccini_regioni', engine )
        
        df_j = df.to_json(orient='records')
        return df_j


