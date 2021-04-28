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
        .domain([d3.min(stateData, d -> d.poverty) - 1, d3.max(stateData, d -> d.poverty)])
        .range([0, width])

    // Create y scale function
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d -> d.healthcare) - 1, d3.max(stateData, d -> d.healthcare)])
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

  // append initial circles
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
  
  var tooltipfunction = d3.tip()

  
        


}).catch(function(error) {
  console.log(error);

});

