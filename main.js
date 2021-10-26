let covidData;
let loaded=false;
let listStates = new Set();
let indiaChron=[];
let stateData = new Object();
let presentArea="allIndia";
function printObject(b,e){
    if(!loaded) return;
    for(let i=b;i<e;++i)
        console.log(covidData[i]);
}

function parseDate(d){
    var parseDateD3 = d3version4.timeParse("%Y-%m-%d");
    return parseDateD3(d);
}

function responsivefy(svg) {

  var container = d3version4.select(svg.node().parentNode),
      width = parseInt(svg.style("width")),
      height = parseInt(svg.style("height")),
      aspect = width / height;

  svg.attr("viewBox", "0 0 " + width + " " + height)
      .attr("perserveAspectRatio", "xMinYMid")
      .call(resize);
  d3version4.select(window).on("resize." + container.attr("id"), resize);

  function resize() {
      var targetWidth = parseInt(container.style("width"));
      svg.attr("width", targetWidth);
      svg.attr("height", Math.round(targetWidth / aspect));
  }
}

function drawMap(states){

  var data = [
    ['in-py', 118087],
    ['in-ld', 9936],
    ['in-wb', 1506279],
    ['in-or', 924699],
    ['in-br', 722603],
    ['in-sk', 21226],
    ['in-ct', 996037],
    ['in-tn', 2500002],
    ['in-mp', 790015],
    ['in-2984', 823895],
    ['in-ga', 0],
    ['in-nl', 25559],
    ['in-mn', 72718],
    ['in-ar', 37531],
    ['in-mz', 21854],
    ['in-tr', 68151],
    ['in-3464', 16],
    ['in-dl', 1434608],
    ['in-hr', 768957],
    ['in-ch', 19],
    ['in-hp', 202800],
    ['in-jk', 317250],
    ['in-kl', 2981721],
    ['in-ka', 2856491],
    ['in-dn', 24],
    ['in-mh', 6104917],
    ['in-as', 519834],
    ['in-ap', 1905023],
    ['in-ml', 51901],
    ['in-pb', 596550],
    ['in-rj', 952789],
    ['in-up', 1706739],
    ['in-ut', 340793],
    ['in-jh', 345983]
  ];

Highcharts.mapChart('map_container', {
    chart: {
        map: 'countries/in/in-all',
        width: 600,
        height: 600,
        borderWidth: 1,
        borderColor: 'silver',
        borderRadius: 1,
        shadow: false,
        backgroundColor: 'lavender'
    },

    title: {
        text: 'Click on a state to See its data'
    },

    mapNavigation: {
        enabled: true,
        buttonOptions: {
            verticalAlign: 'bottom'
        }
    },

    colorAxis: {
        min: 0
    },

    plotOptions: {
      series: {
          point: {
              events: {
                  click: function () {
                      console.log( this.name );
                      for(const entry of Object.keys(stateData)){
                        if(entry==this.name){
                          document.getElementById("areaSelect").value=entry;
                          document.getElementById("areaButton").click();
                          break;
                        }
                        else if(this.name=="Orissa"){
                          document.getElementById("areaSelect").value="Odisha";
                          document.getElementById("areaButton").click();
                          break;
                        }
                        else if(this.name=="Uttaranchal"){
                          document.getElementById("areaSelect").value="Uttarakhand";
                          document.getElementById("areaButton").click();
                          break;
                        }
                      }
                  }
              }
          }
      }
  },

    series: [{
        data: data,
        name: 'Confirmed Cases',
        states: {
            hover: {
                color: '#BADA55'
            }
        },
        dataLabels: {
            enabled: true,
            format: '{point.name}'
        }
    }]
});


}

function drawGraphA(data,element,lineColor,confirmed,cured,deaths,active){
    
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 760 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var svg = d3version4.select(element)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(responsivefy)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
          

    var x = d3version4.scaleTime()
      .domain(d3version4.extent(data, function(d) { return d.date; }))
      .range([ 0, width ]);
      svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3version4.axisBottom(x));

    if(confirmed==true || cured==true){
    var y = d3version4.scaleLinear()
      .domain([0, d3version4.max(data, function(d) { return d["confirmed"]; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3version4.axisLeft(y));
    }
    else if(deaths==true){
        var y = d3version4.scaleLinear()
        .domain([0, d3version4.max(data, function(d) { return d["deaths"]; })])
        .range([ height, 0 ]);
      svg.append("g")
        .call(d3version4.axisLeft(y));  
    }
    else{
      var y = d3version4.scaleLinear()
        .domain([0, d3version4.max(data, function(d) { return d["active"]; })])
        .range([ height, 0 ]);
      svg.append("g")
        .call(d3version4.axisLeft(y));  
    }

    const max = d3version4.max(data, function(d) { return +d.confirmed; })

      svg.append("linearGradient")
      .attr("id", "line-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", y(0))
      .attr("x2", 0)
      .attr("y2", y(max))
      .selectAll("stop")
        .data([
          {offset: "0%", color: "blue"},
          {offset: "100%", color: "red"}
        ])
      .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });

    if(confirmed==true){
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-width", 3.5)
      .attr("d", d3version4.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d["confirmed"]) })
      )
    }
    if(deaths==true){
      svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 3.5)
      .attr("d", d3version4.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d["deaths"]) })
      )
    }
    if(cured==true){
      svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 3.5)
      .attr("d", d3version4.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d["cured"]) })
      )
    }
    if(active==true){
        svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "yellow")
        .attr("stroke-width", 3.5)
        .attr("d", d3version4.line()
          .x(function(d) { return x(d.date) })
          .y(function(d) { return y(d["active"]) })
        )
      }

}

function generateTable(data){
  let element = document.getElementById("india_table");
  let table = document.createElement('table');
  let thead = document.createElement('thead');
  let tbody = document.createElement('tbody');
  table.appendChild(thead);
  table.appendChild(tbody);
  element.appendChild(table);
  let row_1 = document.createElement('tr');
  let heading_1 = document.createElement('th');
  heading_1.innerHTML = "Date";
  let heading_2 = document.createElement('th');
  heading_2.innerHTML = "Confirmed";
  let heading_3 = document.createElement('th');
  heading_3.innerHTML = "Deaths";
  let heading_4 = document.createElement('th');
  heading_4.innerHTML = "Cured";
  let heading_5 = document.createElement('th');
  heading_5.innerHTML = "Active";
  row_1.appendChild(heading_1);
  row_1.appendChild(heading_2);
  row_1.appendChild(heading_3);
  row_1.appendChild(heading_4);
  row_1.appendChild(heading_5);
  thead.appendChild(row_1);
  for(let i=0;i<data.length;++i){
  let currentRow = document.createElement('tr');
  let rowData1 = document.createElement('td');
  let date=String(data[i]["date"]).substring(4,15);
  rowData1.innerHTML = date;
  let rowData2 = document.createElement('td');
  rowData2.innerHTML = data[i]["confirmed"];
  let rowData3 = document.createElement('td');
  rowData3.innerHTML = data[i]["deaths"];
  let rowData4 = document.createElement('td');
  rowData4.innerHTML = data[i]["cured"];
  let rowData5 = document.createElement('td');
  rowData5.innerHTML = data[i]["active"];
  currentRow.appendChild(rowData1);
  currentRow.appendChild(rowData2);
  currentRow.appendChild(rowData3);
  currentRow.appendChild(rowData4);
  currentRow.appendChild(rowData5);
  tbody.appendChild(currentRow);
  //if(i>20) break;
  }
  
}

function processData(data){
    covidData=data;
    loaded=true;
    covidData.sort((a, b) => (a.Date > b.Date) ? 1 : -1)
    for(let i=0;i<covidData.length;++i){
        let state = (covidData[i]["State/UnionTerritory"]);
        listStates.add(state);
    }
    const stateIterator=listStates.values();
    let currentDate=covidData[0]["Date"];
    let dateSumConfirmed=0;
    let dateSumDeaths=0;
    let dateSumCured=0;
    for(let i=1;i<covidData.length;++i){
      if(covidData[i]["Date"]==currentDate){
          dateSumConfirmed=dateSumConfirmed+covidData[i]["Confirmed"];
          dateSumCured=dateSumCured+covidData[i]["Cured"];
          dateSumDeaths=dateSumDeaths+covidData[i]["Deaths"];
      }
      else{
        let activeCases = dateSumConfirmed-(dateSumCured+dateSumDeaths);
        indiaChron.push({date:parseDate(currentDate),confirmed:dateSumConfirmed,deaths:dateSumDeaths,cured:dateSumCured,active:activeCases});
        dateSumConfirmed=covidData[i]["Confirmed"];
        dateSumCured=covidData[i]["Cured"];
        dateSumDeaths=covidData[i]["Deaths"];
        currentDate=covidData[i]["Date"];
      }
    }
    
    drawMap();


    drawGraphA(indiaChron,"#india_linegraph","steelblue",true,true,true,true);

    for(const entry of stateIterator){
       let temp = covidData.filter(function(item){
        return item["State/UnionTerritory"] == entry;         
       })
       if(temp.length>60){
       stateData[entry]=[];
       currentDate=temp[0]["Date"];
       dateSumConfirmed=0;
       dateSumDeaths=0;
       dateSumCured=0;
       selectorString="";
       for(const entry of Object.keys(stateData)){
        selectorString+='<option value="'+entry+'">'+entry+'</option>';
      }      for(let i=1;i<temp.length;++i){
        if(temp[i]["Date"]==currentDate){
            dateSumConfirmed=dateSumConfirmed+temp[i]["Confirmed"];
            dateSumCured=dateSumCured+temp[i]["Cured"];
            dateSumDeaths=dateSumDeaths+temp[i]["Deaths"];
        }
        else{
          let activeCases = dateSumConfirmed-(dateSumCured+dateSumDeaths);
          stateData[entry].push({date:parseDate(currentDate),confirmed:dateSumConfirmed,deaths:dateSumDeaths,cured:dateSumCured,active:activeCases});
          dateSumConfirmed=temp[i]["Confirmed"];
          dateSumCured=temp[i]["Cured"];
          dateSumDeaths=temp[i]["Deaths"];
          currentDate=temp[i]["Date"];
        }
      }
    }
    }
    
    generateTable(indiaChron);

    let area=document.getElementById("areaSelect");
    selectorString="";
    selectorString+='<option value="allIndia">All India</option>';
    for(const entry of Object.keys(stateData)){
      selectorString+='<option value="'+entry+'">'+entry+'</option>';
    }
    area.innerHTML=selectorString;
    
}

function updateGraph(confirmed,cured,deaths,active){
    document.getElementById("india_linegraph").innerHTML="";
    if(presentArea=="allIndia"){
      drawGraphA(indiaChron,"#india_linegraph","steelblue",confirmed,cured,deaths,active);
    }
    else{
      drawGraphA(stateData[presentArea],"#india_linegraph","steelblue",confirmed,cured,deaths,active);
    }
}

function updateArea(){
  presentArea=document.getElementById("areaSelect").value;
  updateGraph(true,true,true,true);
  document.getElementById("india_table").innerHTML="";
  if(presentArea=="allIndia"){
    generateTable(indiaChron);
    document.getElementById("displayArea").innerText="Currently Displaying Data for: All of India";
    document.getElementById("displayArea2").innerText="Covid-19 chronological data for all India";
  }
  else{
    document.getElementById("displayArea").innerText="Currently Displaying Data for: "+presentArea;
    document.getElementById("displayArea2").innerText="Covid-19 chronological data for "+presentArea;
    generateTable(stateData[presentArea]);
  }
}

function getData(parameter){
    fetch(parameter)
    .then(function (response) {
      return response.json();
    })
    .then(function (text) {
        processData(text);
  });
}

getData("https://s3-ap-southeast-1.amazonaws.com/he-public-data/covid196c95c6e.json");

  