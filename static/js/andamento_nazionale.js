remap_codes_regioni = [
    { "nome" : "Abruzzo", "codice": 65, "popolazione" : 1322247, "color": "" },
    { "nome": "Basilicata", "codice": 77, "popolazione" : 570365, "color": ""},
    { "nome": "Calabria", "codice": 78, "popolazione" : 1965128, "color": "" },
    { "nome": "Campania", "codice": 72, "popolazione" :  5839084, "color": ""},
    { "nome": "Emilia-Romagna", "codice": 45, "popolazione" :  4448841, "color": ""},
    { "nome": "Friuli-Venezia Giulia", "codice": 36, "popolazione" : 1217872, "color": "" },
    { "nome": "Lazio", "codice": 62, "popolazione" :  5898124, "color": ""},
    { "nome": "Liguria", "codice": 42, "popolazione" : 1565307, "color": "" },
    { "nome": "Lombardia", "codice": 25, "popolazione" : 10018806 , "color": ""},
    { "nome": "Marche", "codice": 57, "popolazione" : 1538055, "color": "" },
    { "nome": "Molise", "codice": 67, "popolazione" : 310449, "color": "" },
    { "nome": "Piemonte", "codice": 21, "popolazione" : 4392526, "color": "" },
    { "nome": "Puglia", "codice": 75, "popolazione" : 4063888, "color": "" },
    { "nome": "Sardegna", "codice": 88, "popolazione" : 1653135, "color": "" },
    { "nome": "Sicilia", "codice": 82, "popolazione" : 5056641, "color": "" },
    { "nome": "Toscana", "codice": 52, "popolazione" : 3742437, "color": "" },
    { "nome": "Trentino-Alto Adige", "codice": 32, "popolazione" : 1062860, "color": "" },
    { "nome": "Umbria", "codice": 55, "popolazione" : 888908, "color": "" },
    { "nome": "Valle dAosta" , "codice": 23, "popolazione" : 126883, "color": "" },
    { "nome": "Veneto", "codice": 34, "popolazione" : 4907529, "color": "" }
]

var data_andamento = [];
var totale_positivi = [];
var totale_positivi_adj = [];
var terapia_intensiva = [];
var terapia_intensiva_adj = [];
var probabili_positivi = [];

var maxPos = null;
var maxTer = null;
var PosTerAvg = [];
var Interest_PostTerAvg = [];

var total = 0;

andamento_nazionale.map((item) => {

    if ((item.totale_positivi >= maxPos) || (maxPos == null)) {
        maxPos = item.totale_positivi;
    }

    if ((item.terapia_intensiva >= maxTer) || (maxTer == null)) {
        maxTer = item.terapia_intensiva;
    }

    PosTerAvg.push(item.totale_positivi / item.terapia_intensiva);
});

Interest_PostTerAvg = PosTerAvg.slice(150, PosTerAvg.length);

for (var i = 0; i < Interest_PostTerAvg.length; i++) {
    total += Interest_PostTerAvg[i];
}
var avg = total / Interest_PostTerAvg.length;


andamento_nazionale.map((item) => {
    data_andamento.push(item.data.substring(0, 10));
    totale_positivi_adj.push((item.totale_positivi / maxPos) * 100);
    terapia_intensiva_adj.push((item.terapia_intensiva / maxTer) * 100);
    totale_positivi.push(item.totale_positivi);
    terapia_intensiva.push(item.terapia_intensiva);
    probabili_positivi.push(item.terapia_intensiva * avg);
});


var ctx = document.getElementById('andamento_indici').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: data_andamento,
        datasets: [{
            label: 'Totale Positivi',
            borderColor: '#4680ff',
            fill: false,
            pointRadius: 1,
            data: totale_positivi_adj,
            order: totale_positivi
        },
        {
            label: 'Terapie intensive',
            borderColor: '#ff5252',
            fill: false,
            pointRadius: 1,
            data: terapia_intensiva_adj
        },
        ]

    },

    // Configuration options go here
    options: {}
});

var ctx = document.getElementById('andamento_probabile').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: data_andamento,
        datasets: [{
            label: 'Totale Positivi',
            borderColor: '#4680ff',
            fill: false,
            pointRadius: 1,
            data: totale_positivi,
        },
        {
            label: 'Terapie intensive',
            borderColor: '#ff5252',
            fill: false,
            pointRadius: 1,
            data: terapia_intensiva
        },
        {
            label: 'Probabili positivi',
            borderColor: '#ffba57',
            fill: false,
            pointRadius: 1,
            data: probabili_positivi
        },
        ]

    },

    // Configuration options go here
    options: {}
});

var ctx = document.getElementById('andamento_regioni').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    //
    data: {
        labels: data_andamento,
        datasets: remap_codes_regioni.map((regione)=>{
            return{
                label: regione.nome,
                borderColor: '#4680ff',
                fill: false,
                pointRadius: 1,
                data: andamento_regioni_storico.filter((x) => x['codice_regione'] == regione.codice).map(function (item) { return item['totale_positivi'] / regione.popolazione })
                }
        })
    },



    options: {}
});



