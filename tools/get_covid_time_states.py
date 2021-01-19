import csv
import requests
import pandas as pd

def get_covid_data_time_states():
    CSV_URL = 'https://data.humdata.org/hxlproxy/api/data-preview.csv?url=https%3A%2F%2Fraw.githubusercontent.com%2FCSSEGISandData%2FCOVID-19%2Fmaster%2Fcsse_covid_19_data%2Fcsse_covid_19_time_series%2Ftime_series_covid19_confirmed_global.csv&filename=time_series_covid19_confirmed_global.csv'


    with requests.Session() as s:
        download = s.get(CSV_URL)

        decoded_content = download.content.decode('utf-8')

        #cr = csv.reader(decoded_content.splitlines(), delimiter=',')
        df = pd.read_csv(CSV_URL)
        
    return df
