import json
import requests
import pandas as pd

def get_last_data():

    res = requests.get("https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale-latest.json")

    j = res.json()
    
    df = pd.DataFrame(j)
    
    return df



