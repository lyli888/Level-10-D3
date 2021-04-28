// Clear SVG Area
var svgArea = d3.select("body").select("svg");
if (!svgArea.empty()) {
  svgArea.remove();
}

// SVG Object Dimensions
var svgWidth = 960;
var svgHeight = 500;

// Margins
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
d3.csv("assets/data/data.csv").then(function(statedata) {
 

  // parse data
  statedata.forEach(function(d) {
    d.abbr = +d.abbr;
    d.poverty = +d.poverty;
    d.healthcare = +d.healthcare;
  });

  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(statedata, d => (d.poverty-0.2)), d3.max(statedata, d => d.poverty) ])               
    .range([0, width]);
    
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(statedata, d=> (d.healthcare-1)), d3.max(statedata, d => d.healthcare) ])
    .range([height, 0]);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

  // Append X Axis
 chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // Append Y axis
  chartGroup.append("g")
    .call(leftAxis);
    
  // Create Circles
  var circleLabels = chartGroup.selectAll("circle")
    .data(statedata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 15)
    .attr("class", "blue")
    .attr("opacity", ".5");

  var circleText = chartGroup.selectAll(".stateText")
    .data(statedata)
    .enter()
    .append("text")
    .classed ("stateText", true)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("font-size", "8px")
    .text(d => d.abbr)
    .attr("text-anchor", "middle")
    .attr("fill", "white");

// Y Axis Label
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .style("text-anchor", "middle")
    .text("% Without Healthcare");

// X Axis Label
chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .style("text-anchor", "middle")
    .text("% In Poverty");


});

