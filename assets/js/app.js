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
d3.csv("/data/data.csv").then(function(stateData) {
  if (err) throw err;

  // parse data
  stateData.forEach(function(stateData) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

    // Create x scale function
    var xLinearScale = d3.scaleLinear()
        .domain(d3.extent(stateData, d => d.poverty))
        .range([0, width])

    // Create y scale function
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(stateData, d => d.healthcare)])
        .range([height, 0]);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

  // Append X axis
  var xAxis = chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // Append Y axis
  chartGroup.append("g")
    .call(leftAxis);

    
  // Create Circles
  var circleLabels = chartGroup.selectAll(null).data(stateData).enter().append("text")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 15)
    .attr("class", "blue")
    .attr("opacity", ".5");

  circleLabels
    .attr("x", function(d) { return d.poverty; })
    .attr("y", function(d) { return d.healthcare; })
    .text(function(d) { return d.abbr; })
    .attr("font-family", "sans-serif")
    .attr("font-size", "5px")
    .attr("fill", "white");

//Axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("% Without Healthcare");

chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("% In Poverty");

}).catch(function(error) {

  console.log(error);

});

