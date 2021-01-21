

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

andamento_nazionale.map((item)=>{

        if ((item.totale_positivi >= maxPos) || (maxPos == null)){
            maxPos = item.totale_positivi;
        }

        if ((item.terapia_intensiva >= maxTer) || (maxTer == null)){
            maxTer = item.terapia_intensiva;
        }
        
        PosTerAvg.push(item.totale_positivi / item.terapia_intensiva);
}); 

Interest_PostTerAvg = PosTerAvg.slice(150, PosTerAvg.length);

for(var i = 0; i < Interest_PostTerAvg.length; i++) {
    total += Interest_PostTerAvg[i];
}
var avg = total / Interest_PostTerAvg.length;


andamento_nazionale.map((item)=>{
    data_andamento.push(item.data.substring(0,10));
    totale_positivi_adj.push((item.totale_positivi/maxPos)*100);
    terapia_intensiva_adj.push((item.terapia_intensiva/maxTer)*100);
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
                borderColor: '#adc698',
                fill: false,
                pointRadius: 1,
                data: totale_positivi_adj,
                order: totale_positivi
            }, 
            {
                label: 'Terapie intensive',
                borderColor: '#a31621',
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
                borderColor: '#a31621',
                fill: false,
                pointRadius: 1,
                data: totale_positivi,
            }, 
            {
                label: 'Terapie intensive',
                borderColor: '#f94144',
                fill: false,
                pointRadius: 1,
                data: terapia_intensiva
            },
            {
                label: 'Probabili positivi',
                borderColor: '#f39237',
                fill: false,
                pointRadius: 1,
                data: probabili_positivi
            },
        ]
        
        },

        // Configuration options go here
        options: {}
    });



    