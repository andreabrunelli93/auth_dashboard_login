

var data_andamento = [];
var totale_positivi = [];


andamento_nazionale.map((item)=>{
        data_andamento.push(item.data.substring(0,10));
        totale_positivi.push(item.totale_positivi);
}); 

console.log(totale_positivi)


var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        /*
        andamento_nazionale.map((item)=>{
            return{
                labels: item.data
                datasets[{
                    label: 'Andamento nazionale',
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: item.totale_positivi
                }]
            }

        };)*/
        // The data for our dataset
        data: {
            labels: data_andamento,
            datasets: [{
                label: 'Totale Positivi',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                pointRadius: 0,
                data: totale_positivi
            }]
        },

        // Configuration options go here
        options: {}
    });


    /*

    polygonSeries.data = data_regioni.map((item)=>{
        return{
        id: remap_codes["IT-" + item.codice_regione],
        CNTRY : "Italy",
        NAME_ENG: item.denominazione_regione,
        name: item.denominazione_regione,
        value: item.totale_positivi,
      }
    }); */
    