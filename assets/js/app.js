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
 

  // Parse data
  statedata.forEach(function(d) {
    d.state = +d.state;
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
    .attr("fill", "purple")
    .attr("opacity", ".5");

  var circleText = chartGroup.selectAll("null")
    .data(statedata)
    .enter()
    .append("text")
    .attr("class", "stateText")
    .attr("x", function(d) { 
      return xLinearScale(d.poverty)
      })
    .attr("y", function(d) {
      return yLinearScale(d.healthcare)
      })
    .text(function(d) {
      return d.abbr
      })
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("text-anchor", "middle")
    .attr("fill", "white");

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([20, -10])
      .html(function(d) {
        return (`<b>Poverty: ${d.poverty}<b>% No Healthcare: ${d.healthcare}<b>%`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    circleLabels.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circleLabels.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

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
