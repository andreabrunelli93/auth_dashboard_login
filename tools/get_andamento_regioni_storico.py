import json
import requests
import pandas as pd
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
import psycopg2 
from datetime import date, datetime

engine = create_engine('postgresql://postgres:admin@localhost:5432/dashboard_flask1')


def get_andamento_regioni_storico():
    remap_codes = { 1: "21", 2: "23", 3: "25", 4: "", 5: "34", 6: "36", 7: "42", 8: "45", 9: "52", 10: "55", 11: "57", 12: "62", 
                   13: "65", 14: "67", 15: "72", 16: "75", 17: "77", 18: "78", 19: "82", 20: "88", 21: "32", 22: "32" }
    
    today = str(date.today())

    last_day = str(engine.execute("SELECT data FROM andamento_regioni ORDER BY data DESC LIMIT 1").fetchall())
    last_day = last_day.rsplit('T',1)[0]
    last_day = last_day.rsplit("'",1)[1]
    
    now = datetime.now()
    current_hour = int(now.strftime("%H"))
    
    if(today == last_day):
        if(current_hour > 18):
            print('aggiorno gli elementi')
            res = requests.get("https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json")

            j = res.json()
            
            df = pd.DataFrame(j)
            
            df['codice_regione'].replace(remap_codes, inplace=True)
            
            df.to_sql('andamento_regioni', engine, if_exists='replace', chunksize=1000)
            
            return df
        
    else:
        print("elementi già aggiornati in db")
        df = pd.read_sql_table('andamento_regioni', engine )
        return df
    
def get_andamento_regioni_storico():
    remap_codes = { 1: "21", 2: "23", 3: "25", 4: "", 5: "34", 6: "36", 7: "42", 8: "45", 9: "52", 10: "55", 11: "57", 12: "62", 
                   13: "65", 14: "67", 15: "72", 16: "75", 17: "77", 18: "78", 19: "82", 20: "88", 21: "32", 22: "32" }
    
    today = str(date.today())

    last_day = str(engine.execute("SELECT data FROM andamento_regioni ORDER BY data DESC LIMIT 1").fetchall())
    last_day = last_day.rsplit('T',1)[0]
    last_day = last_day.rsplit("'",1)[1]
    
    now = datetime.now()
    current_hour = int(now.strftime("%H"))
    
    if(today == last_day):
        if(current_hour > 18):
            print('aggiorno gli elementi')
            res = requests.get("https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json")

            j = res.json()
            
            df = pd.DataFrame(j)
            
            df['codice_regione'].replace(remap_codes, inplace=True)
            
            df.to_sql('andamento_regioni', engine, if_exists='replace', chunksize=1000)
            
            return df
        
    else:
        print("elementi già aggiornati in db")
        df = pd.read_sql_table('andamento_regioni', engine )
        return df

def get_andamento_regioni_storico():
    remap_codes = { 1: "21", 2: "23", 3: "25", 4: "", 5: "34", 6: "36", 7: "42", 8: "45", 9: "52", 10: "55", 11: "57", 12: "62", 
                   13: "65", 14: "67", 15: "72", 16: "75", 17: "77", 18: "78", 19: "82", 20: "88", 21: "32", 22: "32" }
    
    today = str(date.today())

    last_day = str(engine.execute("SELECT data FROM andamento_regioni ORDER BY data DESC LIMIT 1").fetchall())
    last_day = last_day.rsplit('T',1)[0]
    last_day = last_day.rsplit("'",1)[1]
    
    now = datetime.now()
    current_hour = int(now.strftime("%H"))
    
    if(today != last_day):
        if(current_hour > 18):
            print('aggiorno gli elementi')
            res = requests.get("https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json")

            j = res.json()
            
            df = pd.DataFrame(j)
            
            df['codice_regione'].replace(remap_codes, inplace=True)
            
            df.to_sql('andamento_regioni', engine, if_exists='replace', chunksize=1000)
            
            return df
        
    else:
        print("elementi già aggiornati in db")
        df = pd.read_sql_table('andamento_regioni', engine )
        return df
    
    

def get_andamento_regioni_storico_giorno(giorno):
        query = f"SELECT * FROM andamento_regioni WHERE data ILIKE '{giorno}%%'" 
        df = pd.read_sql_query(query, engine)
        df_j = df.to_json(orient='records')
        return df_j


