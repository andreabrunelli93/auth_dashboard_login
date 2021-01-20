/**
 * ---------------------------------------
 * This demo was created using amCharts 4.
 *
 * For more information visit:
 * https://www.amcharts.com/
 *
 * Documentation is available at:
 * https://www.amcharts.com/docs/v4/
 * ---------------------------------------
 */

// Theme
am4core.useTheme(am4themes_animated);

 // Create map instance
var chart = am4core.create("chartdiv", am4maps.MapChart);

// Set map definition
chart.geodata = am4geodata_italyLow;


// Create map polygon series
var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

//Set min/max fill color for each area
polygonSeries.heatRules.push({
  property: "fill",
  target: polygonSeries.mapPolygons.template,
  min: chart.colors.getIndex(1).brighten(1),
  max: chart.colors.getIndex(1).brighten(-0.3),
  logarithmic: true
});

// Make map load polygon data (state shapes and names) from GeoJSON
polygonSeries.useGeodata = true;

remap_codes = {
  "IT-1": "IT-21",
  "IT-2": "IT-23",
  "IT-3": "IT-25",
  "IT-4": "",
  "IT-5": "IT-34",
  "IT-6": "IT-36",
  "IT-7": "IT-42",
  "IT-8": "IT-45",
  "IT-9": "IT-52",
  "IT-10": "IT-55",
  "IT-11": "IT-57",
  "IT-12": "IT-62",
  "IT-13": "IT-65",
  "IT-14": "IT-67",
  "IT-15": "IT-72",
  "IT-16": "IT-75",
  "IT-17": "IT-77",
  "IT-18": "IT-78",
  "IT-19": "IT-82",
  "IT-20": "IT-88",
  "IT-21": "IT-32",
  "IT-22": "IT-32"
};

console.log(data_regioni[0].codice_regione)
console.log(remap_codes["IT-" + data_regioni[0].codice_regione])

// Set heatmap values for each state
polygonSeries.data = data_regioni.map((item)=>{
    return{
    id: remap_codes["IT-" + item.codice_regione],
    CNTRY : "Italy",
    NAME_ENG: item.denominazione_regione,
    name: item.denominazione_regione,
    value: item.nuovi_positivi,
  }
});

console.log(polygonSeries.data)

// Set up heat legend
let heatLegend = chart.createChild(am4maps.HeatLegend);
heatLegend.series = polygonSeries;
heatLegend.align = "right";
heatLegend.valign = "bottom";
heatLegend.height = am4core.percent(80);
heatLegend.orientation = "vertical";
heatLegend.valign = "middle";
heatLegend.marginRight = am4core.percent(4);
heatLegend.valueAxis.renderer.opposite = true;
heatLegend.valueAxis.renderer.dx = - 25;
heatLegend.valueAxis.strictMinMax = false;
heatLegend.valueAxis.fontSize = 9;
heatLegend.valueAxis.logarithmic = true;

// Configure series tooltip
var polygonTemplate = polygonSeries.mapPolygons.template;
polygonTemplate.tooltipText = "{name}: {value}";
polygonTemplate.nonScalingStroke = true;
polygonTemplate.strokeWidth = 0.5;

// Create hover state and set alternative fill color
var hs = polygonTemplate.states.create("hover");
hs.properties.fill = am4core.color("#3c5bdc");


// heat legend behavior
polygonSeries.mapPolygons.template.events.on("over", function (event) {
  handleHover(event.target);
})

polygonSeries.mapPolygons.template.events.on("hit", function (event) {
  handleHover(event.target);
})

function handleHover(column) {
  if (!isNaN(column.dataItem.value)) {
    heatLegend.valueAxis.showTooltipAt(column.dataItem.value)
  }
  else {
    heatLegend.valueAxis.hideTooltip();
  }
}

polygonSeries.mapPolygons.template.events.on("out", function (event) {
  heatLegend.valueAxis.hideTooltip();
})