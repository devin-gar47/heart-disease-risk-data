function createScatterPlotGraph(myData, idTag) {
  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select(idTag)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  function createCSV() {
    let myString = ``;
    myData.forEach((row) => {
      myString += `${row.Age},${row.Cholesterol}\n`;
    });

    const finalCSVString = `Age,Cholesterol
        ${myString}`;
    return finalCSVString;
  }
  const data = d3.csvParse(createCSV(), (d) => d);

  // Add X axis
  var x = d3.scaleLinear().domain([0, 700]).range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  var tooltip = d3
    .select(idTag)
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

  // A function that change this tooltip when the user hover a point.
  // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
  var mouseover = function (d) {
    tooltip.style("opacity", 1);
  };

  var mousemove = function (d) {
    tooltip
      .html(`Age: ${d.Age}: Cholesterol: ${d.Cholesterol}`)
      .style("left", d3.mouse(this)[0] + 590 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", d3.mouse(this)[1] + "px");
  };

  // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
  var mouseleave = function (d) {
    tooltip.transition().duration(200).style("opacity", 0);
  };

  // Add dots
  svg
    .append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d.Cholesterol);
    })
    .attr("cy", function (d) {
      return y(d.Age);
    })
    .attr("class", (d, index) => {
      return `age-${d.Age} cholesterol-${d.Cholesterol} index-${index}`;
    })
    .attr("r", 1.5)
    .style("fill", "#69b3a2")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);
}

function highlightDots(age, sex, chestPainType) {
  d3.selectAll(`circle`).style("r", 1.5).style("fill", "#69b3a2");

  d3.selectAll(`.age-${age}`)
    .style("z-index", 100)
    .style("r", 10)
    .style("fill", "red");

  d3.selectAll(`.hist-bar`).style("fill", "green");
  d3.selectAll(`.hist-bar.age-${age}`).style("fill", "red");

  d3.selectAll(".myRect rect").style("opacity", 0.2);
  d3.selectAll(
    `.${chestPainType} rect:nth-child(${sex === "F" ? "2" : "1"})`
  ).style("opacity", 1);
}
