//SVG Object Dimensions
var svgWidth = 960;
var svgHeight = 500;

//Margins
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Retrieve data from the CSV file and execute everything below
d3.csv("data.csv").then(function(stateData, err) {
  if (err) throw err;

  // parse data
  stateData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.obesity = +data.healthcare;
  });

    // Create x scale function
    var xLinearScale = d3.scaleLinear()
        .domain(0, d3.max(stateData, d => d.poverty))
        .range([0, width])

    // Create y scale function
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(stateData, d => d.healthcare)])
        .range([height, 0]);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

  // Append x axis
  var xAxis = chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // Append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // Create Circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 15)
    .attr("class", "stateCircle")
    .attr("opacity", ".5");


    chartGroup.selectAll("div")
    .data(povertyData)
    .enter()
    .append("text")
    .text(function(d){
      console.log(d.abbr)
      return `${d.abbr}`;
    })
  .attr("x", function (d) {
      return xLinearScale(d.poverty);
    })
  .attr("y", function (d) {
      return yLinearScale(d.healthcare);
    })
  .attr("alignment-baseline", "central")
  .attr("class", "stateText");

// Tooltip Function

var tooltip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
    return (`${d.state}<br>% In Poverty: ${d.poverty}<br>Lacks Healthcare (%): ${d.healthcare}`);
    });

// Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(tooltip);    

//Event Listeners

circlesGroup.on("click", function(data) {
    tooltip.show(data, this);
    })
    // onmouseout event
    .on("mouseout", function(data, index) {
        tooltip.hide(data);
    });

//Axes labels
chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left + 40)
.attr("x", 0 - (height / 2))
.attr("dy", "1em")
.attr("class", "axisText")
.text("Lacks Healthcare (%)");

chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("% In Poverty");

}).catch(function(error) {
  console.log(error);

});

