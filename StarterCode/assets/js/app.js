var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Initial Params
var chosenXAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(factData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(factData, d => d[chosenXAxis]) * 0.8,
      d3.max(factData, d => d[chosenXAxis]) * 1.1
    ])
    .range([0, width]);

  return xLinearScale;

}


d3.csv("./assets/data/data.csv").then(function(factData, err) {
    if (err) throw err;

 
    // parse data
    factData.forEach(function(data) {
      data.abbrv = data.abbr;
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      console.log(data.abbrv);
    });
  
    // xLinearScale function above csv import
    var xLinearScale = xScale(factData, chosenXAxis);
  
    // Create y scale function
    var yLinearScale = d3.scaleLinear()
      .domain([4, d3.max(factData, d => d.healthcare)+4])
      .range([height, 0]);
  
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
    // append y axis
    chartGroup.append("g")
      .call(leftAxis);
  
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(factData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", 10)
      .attr("fill", "lightblue")
      .attr("opacity", ".7");

      var circlesText = chartGroup.selectAll("text")
      .data(factData)
      .enter().append("text")      
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d.healthcare))
      .attr("style","dominant-baseline:central; text-anchor:middle; font-size:12px;")
      .text(function(d) { return d.abbrv;});
      
      

    
    // Create group for two x-axis labels
    var labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);

      
  
    var povertyLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 28)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("In Poverty (%)");
  
  
    // append y axis
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .classed("axis-text", true)
      .classed("active", true)
      .text("Lacks Healthcare (%)");
    
    
  }).catch(function(error) {
    console.log(error);
  });