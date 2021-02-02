remap_codes_regioni = [
    {65: "Abruzzo"},
    {77: "Basilicata"},
    {78: "Calabria"},
    {72: "Campania"},
    {45: "Emilia-Romagna"},
    {36: "Friuli-Venezia Giulia"},
    {62: "Lazio"},
    {42: "Liguria"},
    {25: "Lombardia"},
    {57: "Marche"},
    {67: "Molise"},
    {21: "Piemonte"},
    {75: "Puglia"},
    {88: "Sardegna"},
    {82: "Sicilia"},
    {52: "Toscana"},
    {32: "Trentino-Alto Adige"},
    {55: "Umbria"},
    {23: "Valle dAosta"},
    {34: "Veneto"}
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
s
    // The data for our dataset
    data: {
        labels: data_andamento,

        datasets: [

            remap_codes_regioni.map((regione) => {
                return {
                    label: "test",
                    borderColor: '#4680ff',
                    fill: false,
                    pointRadius: 1,
                    data: andamento_regioni_storico.filter((x) => x['codice_regione'] == regione).map(function (item) { return item['nuovi_positivi'] }),
                }
                
              })
        ]

    },


    options: {}
});



