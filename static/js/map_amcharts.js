
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

var popolazione_regioni ={
"IT-25"	: 10018806,
"IT-62":	5898124,
"IT-72":	5839084,
"IT-82":	5056641,
"IT-34":	4907529,
"IT-45":	4448841,
"IT-21":	4392526,
"IT-75":	4063888,
"IT-52":	3742437,
"IT-78":	1965128,
"IT-88":	1653135,
"IT-42":	1565307,
"IT-57":	1538055,
"IT-65":	1322247,
"IT-36":	1217872,
"IT-32":	1062860,
"IT-55":	888908,
"IT-77":	570365,
"IT-67": 310449,
"IT-23":	126883,
};

/* MAPPA DEI CONTAGI PER REGIONE */ 

function map_region(){
  // Theme
  am4core.useTheme(am4themes_animated);

  // Create map instance
  var chart = am4core.create("map_region", am4maps.MapChart);

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

  // Set heatmap values for each state
  polygonSeries.data = data_regioni.map((item)=>{
    return{
    id: remap_codes["IT-" + item.codice_regione],
    CNTRY : "Italy",
    NAME_ENG: item.denominazione_regione,
    name: item.denominazione_regione,
    value: item.totale_positivi,
  }
  });


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
}

map_region();

/* MAPPA RELATIVA DELLE REGIONI SULLA BASE DELLA POPOLAZIONE */ 

function map_region_relative(){
  // Theme
  am4core.useTheme(am4themes_animated);

  // Create map instance
  var chart = am4core.create("map_region_relative", am4maps.MapChart);

  // Set map definition
  chart.geodata = am4geodata_italyLow;


  // Create map polygon series
  var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

  //Set min/max fill color for each area
  polygonSeries.heatRules.push({
  property: "fill",
  target: polygonSeries.mapPolygons.template,
  min: am4core.color("#faafaf"),
  max: am4core.color("#5e0101"),
  logarithmic: true
  });

  // Make map load polygon data (state shapes and names) from GeoJSON
  polygonSeries.useGeodata = true;

  // Set heatmap values for each state
  polygonSeries.data = data_regioni.map((item)=>{
    return{
    id: remap_codes["IT-" + item.codice_regione],
    CNTRY : "Italy",
    NAME_ENG: item.denominazione_regione,
    name: item.denominazione_regione,
    value: (item.totale_positivi / popolazione_regioni[remap_codes["IT-" + item.codice_regione]])*100,
  }
  });


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
  hs.properties.fill = am4core.color("#ff5252");


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
}

map_region_relative();

/* MAPPA DEI VACCINI SOMMINISTRATI PER REGIONE */ 


function map_region_vaccini(){
  // Theme
  am4core.useTheme(am4themes_animated);

  // Create map instance
  var chart = am4core.create("map_region_vaccini", am4maps.MapChart);

  // Set map definition
  chart.geodata = am4geodata_italyLow;


  // Create map polygon series
  var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

  //Set min/max fill color for each area
  polygonSeries.heatRules.push({
  property: "fill",
  target: polygonSeries.mapPolygons.template,
  min: am4core.color("#f0ffe0"),
  max: am4core.color("#3b6b04"),
  logarithmic: true
  });

  // Make map load polygon data (state shapes and names) from GeoJSON
  polygonSeries.useGeodata = true;

  // Set heatmap values for each state
  polygonSeries.data = regioni_vaccini.map((item)=>{
    return{
    id: "IT-" + item.index,
    CNTRY : "Italy",
    NAME_ENG: item.area,
    name: item.area,
    value: item.dosi_somministrate,
  }
  });


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
  hs.properties.fill = am4core.color("#9ccc65");


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
}

map_region_vaccini();

/* MAPPA DEI VACCINI SOMMINISTRATI PER REGIONE RELATIVAMENTE ALLA POPOLAZIONE */ 


function map_region_vaccini_relative(){
  // Theme
  am4core.useTheme(am4themes_animated);

  // Create map instance
  var chart = am4core.create("map_region_vaccini_relative", am4maps.MapChart);

  // Set map definition
  chart.geodata = am4geodata_italyLow;


  // Create map polygon series
  var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

  //Set min/max fill color for each area
  polygonSeries.heatRules.push({
  property: "fill",
  target: polygonSeries.mapPolygons.template,
  min: am4core.color("#e8d8c1"),
  max: am4core.color("#ac6603"),
  logarithmic: true
  });

  // Make map load polygon data (state shapes and names) from GeoJSON
  polygonSeries.useGeodata = true;

  // Set heatmap values for each state
  polygonSeries.data = regioni_vaccini.map((item)=>{
    return{
    id: "IT-" + item.index,
    CNTRY : "Italy",
    NAME_ENG: item.area,
    name: item.area,
    value: ((item.dosi_somministrate / 2)  / popolazione_regioni["IT-" + item.index])*100,
  }
  });


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
  hs.properties.fill = am4core.color("#ffba57");


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
}

map_region_vaccini_relative();

function map_region_contagi_data(){
  // Theme
  am4core.useTheme(am4themes_animated);

  // Create map instance
  var chart = am4core.create("map_region_contagi_data", am4maps.MapChart);

  // Set map definition
  chart.geodata = am4geodata_italyLow;


  // Create map polygon series
  var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

  //Set min/max fill color for each area
  polygonSeries.heatRules.push({
  property: "fill",
  target: polygonSeries.mapPolygons.template,
  min: am4core.color("#e8d8c1"),
  max: am4core.color("#ac6603"),
  logarithmic: true
  });

  // Make map load polygon data (state shapes and names) from GeoJSON
  polygonSeries.useGeodata = true;

  // Set heatmap values for each state
  polygonSeries.data = andamento_regioni_storico_giorno.map((item)=>{
    return{
      id: "IT-" + item.codice_regione,
      CNTRY : "Italy",
      NAME_ENG: item.denominazione_regione,
      name: item.denominazione_regione,
      value: item.totale_positivi,
  }
  });


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
  hs.properties.fill = am4core.color("#ffba57");


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
}

map_region_contagi_data();