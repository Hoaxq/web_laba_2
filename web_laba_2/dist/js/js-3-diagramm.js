function GetTable() {
    let table = document.getElementById("my-table");

    const headers = [];
    for (let i = 0; i < table.rows[0].cells.length; i++) {
      headers[i] = table.rows[0].cells[i].textContent;
    }

    let data = [];

    for (let i = 1; i < table.rows.length; i++) {
      const tableRow = table.rows[i];
      const rowData = {};

      for (let j = 0; j < tableRow.cells.length; j++) {
        rowData[headers[j]] = tableRow.cells[j].textContent;
      }

      data.push(rowData);
    }

    return data;
}

function CreateOutpMassForDate(Date, int_mode_y, int_mode_x) {


    let str_mode;
    let str_mode_date;

    if(int_mode_y == 0) str_mode = "Бренд";
    else if (int_mode_y == 1) str_mode = "Год создания";

    if(int_mode_x == 0) str_mode_date = "Тираж";
    else if (int_mode_x == 1 || int_mode_x == 2) str_mode_date = "Тираж";

    let outMassForDate_x = {}; 

    for(let i = 0; i < Date.length; i++) {
        if(outMassForDate_x[Date[i][str_mode]] == null) {
            outMassForDate_x[Date[i][str_mode]] = Date[i][str_mode_date];
        } else {
            if(int_mode_x == 0) {
                if (outMassForDate_x[Date[i][str_mode]] < Date[i][str_mode_date]) {
                    outMassForDate_x[Date[i][str_mode]] = Date[i][str_mode_date];
                
                }
            }else if(int_mode_x == 1) {
                if (outMassForDate_x[Date[i][str_mode]] < Date[i][str_mode_date]) {
                    outMassForDate_x[Date[i][str_mode]] = Date[i][str_mode_date];

                }
            } else if (int_mode_x == 2) {
                if (outMassForDate_x[Date[i][str_mode]] > Date[i][str_mode_date]) {
                    outMassForDate_x[Date[i][str_mode]] = Date[i][str_mode_date];
                }
            }
        }
    } 

    console.log(outMassForDate_x);
    return outMassForDate_x;
}


function DrawLinearGrafic_02(data_x, data_y, strX, strY, int_color) {
    if (!Array.isArray(data_x) || !Array.isArray(data_y) || data_x.length !== data_y.length) {
        console.error("Invalid input data");
        return;
    }
    for (var i = 0; i < data_x.length; i++) {
        if (isNaN(data_x[i]) || isNaN(data_y[i])) {
            console.error("Invalid input data");
            return;
        }
    }
    
    var svg = d3.select(".curr-graff")
        .append("svg")
        .attr("width", '500px')
        .attr("height", '400px')
        .attr("margin", 'auto');

    let dat_x = GetMinMaxVal(data_x);
    let dat_y = GetMinMaxVal(data_y);

    var xScale = d3.scaleLinear()
      .domain([dat_x[0], dat_x[1]]) 
      .range([50, 450]);
    
    var yScale = d3.scaleLinear()
      .domain([dat_y[0], dat_y[1]]) 
      .range([250, 50]);

    var xAxis = d3.axisBottom(xScale);
    xAxis.tickFormat(d3.format(".0f"))

    var yAxis = d3.axisLeft(yScale)

    svg.append("g")
        .attr("transform", "translate(0," + 250 + ")")
        .attr("class", "x-axis")
        .call(xAxis);

    svg.append("g")
        .attr("transform", "translate(" + 50 + ",0)")
        .attr("class", "y-axis")
        .call(yAxis);

 
    svg.append("g")
        .attr("transform", "translate(225," + 290 + ")")
        .append("text")
        .attr("class", "x-legend")
        .style("fill", "gray"); 

    svg.append("g")
        .attr("transform", "translate(" + 20 + ", "+ 200 + ") rotate(-90)")
        .append("text")
        .attr("class", "y-legend")
        .style("fill", "gray"); 

    let currColor;

    if(int_color == 0) currColor = "orange";
    else if(int_color == 1) currColor = "lightgreen";
    else if(int_color == 2) currColor = "#00a3ff";

    svg.append("path")
        .datum(data_y)
        .attr("fill", "none")
        .attr("stroke", currColor)
        .attr("stroke-width", 3)
        .attr("stroke-linecap", "round")
        .attr("stroke-dasharray", "0,0")
        .attr("d", d3.line()
            .x(function(d, i) { return xScale(data_x[i]); })
            .y(function(d) { return yScale(d); })
            .curve(d3.curveCardinal.tension(0.1)) 
        );
}

function DrawGistDiagramm(map, input_b) {    
    let width = 500;
    let height = 300;
    let marginX = 50;
    let marginY = 40;

    let svg = d3.select(".curr-graff")
     .append("svg")
     .attr("height", height)
     .attr("width", width)
     
    let min = 0;
    let max = 120000;

    let xAxisLen = width - 2 * marginX;
    let yAxisLen = height - 2 * marginY;
    let data = Object.entries(map);

    let scaleX = d3.scaleBand()
     .domain(data.map(function(d) {
       return d[0];
     }))
     .range([0, xAxisLen])
     .padding(0.45);
     
    let scaleY = d3.scaleLinear()
     .domain([min, max])
     .range([yAxisLen, 0]);
     
    let axisX = d3.axisBottom(scaleX);  
    let axisY = d3.axisLeft(scaleY)     

    svg.append("g")
     .attr("transform", `translate(${marginX}, ${height - marginY})`)
     .call(axisX)
     .attr("class", "x-axis");
     
    svg.append("g")
     .attr("transform", `translate(${marginX}, ${marginY})`)
     .call(axisY);

    let color = d3.scaleOrdinal(d3.schemeCategory10);

    let g = svg.append("g")
    .attr("transform", `translate(${ marginX}, ${ marginY})`)
    .selectAll(".rect")
    .data(data)
    .enter().append("rect")
    .attr("x", function(d) { return scaleX(d[0]); })
    .attr("width", scaleX.bandwidth())
    .attr("y", function(d) { return scaleY(d[1]); })
    .attr("height", function(d) { return yAxisLen - scaleY(d[1]); })
    .attr("fill", function(d) { return color(d[0]); })
    .attr("rx", 3)
    .attr("ry", 3);  
}
function GetMinMaxVal(mass) {
    for(let i = 0; i<mass.length; i++) {
        mass[i] = parseFloat(mass[i]);
    }

    let min = d3.min(mass); 
    let max = d3.max(mass); 
    let gerr = max-min;

    let outMin = min - gerr*0.1;
    let outMax = max + gerr*0.1;

    let outMass = [outMin, outMax];
    console.log('sizeMass = ' + outMass);
    return outMass;
}

function radioButtonCheck() {

    const radioButtons = document.querySelectorAll('.block-01 input[type="radio"]');
    
    let inpMassRad = [];

    for (let i = 0; i < radioButtons.length; i++) {
        console.log(radioButtons[i].checked); 
        inpMassRad.push(radioButtons[i].checked);
    }

    if(inpMassRad[0] == true) input_a = 0; else input_a = 1;
    if(inpMassRad[2] == true) input_b = 0; 
    else if(inpMassRad[3] == true) input_b = 1;
    else input_b = 2;

    // Если ничего не выбрано, вернёт последние значения
}

function setVisibleElementGraf(isVisible) {
    grafDiv[0].style.display = isVisible ? "block" : "none";
}


let grafDiv = document.getElementsByClassName('block-graf');

let isVisible = false; 
setVisibleElementGraf(isVisible);

let input_a = 0; 
let input_b = 0; 

let buttDraw = document.getElementById('butt-graf');
let graf_container = document.getElementById('graf-container');

buttDraw.addEventListener('click', () => {
    console.log('Кнопка нажата!');
    setVisibleElementGraf(true);

    let mainGraf = document.getElementsByClassName('curr-graff');
    mainGraf[0].remove();

    let mainGraf2 = document.createElement("div");
    mainGraf2.className = "curr-graff";

    graf_container.insertBefore(mainGraf2, graf_container.firstChild);

    radioButtonCheck(); 
    MainGenerateGrafic(input_a, input_b); 
});

function MainGenerateGrafic(input_a, input_b) {
    let data_x = []; 
    let data_y = []; 
    
    let data = GetTable(); 

    let newDate = CreateOutpMassForDate(data, input_a, input_b);
    
    data_x = Object.keys(newDate);
    data_y = Object.values(newDate);
    
    let strLett; 
    
    if(input_b == 0) strLett = "Кол-во частей";
    else if(input_b == 1) strLett = "Max рейтинг";
    else if(input_b == 2) strLett = "Min рейтинг";
    
    if(input_a == 1) { 
        DrawLinearGrafic_02(data_x, data_y, strLett, "Год выхода", input_b);
    } else { 
        DrawGistDiagramm(newDate, input_b);
    }
}