from requests import requests

def get_data():
    url = "https://covid-193.p.rapidapi.com/statistics"

    querystring = {"country":"Italy"}

    headers = {
        'x-rapidapi-key': "28e3a76855msh024184e1ac4d23ep139572jsn4f441e0e5b60",
        'x-rapidapi-host': "covid-193.p.rapidapi.com"
        }

    response = requests.request("GET", url, headers=headers, params=querystring)

    return response

test = get_data()

print(test.text)

