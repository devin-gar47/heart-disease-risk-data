function createHistogramObj() {
  const histogramObj = {
    createHistogramChart: (heartDiseaseData, idTag) => {
      //   set the dimensions and margins of the graph
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
        let myMap = new Map();

        heartDiseaseData.forEach((row) => {
          if (!myMap.has(row.Age) && row.HeartDisease === "1") {
            myMap.set(row.Age, 1);
          } else if (myMap.has(row.Age) && row.HeartDisease === "1") {
            myMap.set(row.Age, myMap.get(row.Age) + 1);
          }
        });

        const ageArr = Array.from(myMap.keys());
        const heartDiseaseCount = Array.from(myMap.values());
        console.log(heartDiseaseCount);

        let ageStr = ``;
        ageArr.forEach(
          (age, index) => (ageStr += `${age},${heartDiseaseCount[index]}\n`)
        );

        const finalCSVString = `Age,HeartDisease
${ageStr}
            `;
        return finalCSVString;
      }
      const data = d3.csvParse(createCSV(), (d) => d);

      var tooltip = d3
        .select(idTag)
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("color", "white")
        .style("border-radius", "5px")
        .style("padding", "10px");

      var showTooltip = function (d) {
        tooltip.transition().duration(100).style("opacity", 1);
        tooltip
          .html(`Age: ${d[0]?.Age}`)
          .style("left", d3.mouse(this)[0] + 520 + "px")
          .style("top", d3.mouse(this)[1] + "px");
      };
      var moveTooltip = function (d) {
          console.log(d3.mouse(this))
        tooltip
          .style("left", d3.mouse(this)[0] + 1220 + "px")
          .style("top", d3.mouse(this)[1] + 500 + "px");
      };
      // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
      var hideTooltip = function (d) {
        tooltip.transition().duration(100).style("opacity", 0);
      };

      // X axis: scale and draw:
      var x = d3.scaleLinear().domain([0, 100]).range([0, width]);
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // set the parameters for the histogram
      var histogram = d3
        .histogram()
        .value(function (d) {
          return d.Age;
        }) //the vector of value
        .domain(x.domain()) // then the domain
        .thresholds(x.ticks(47)); // then the numbers of ticks

      // And apply this function to data to get the bins
      var bins = histogram(data);

      // Y axis: scale and draw:
      var y = d3.scaleLinear().domain([0, 10]).range([height, 0]);
      svg.append("g").call(d3.axisLeft(y));

      // append the bar rectangles to the svg element
      svg
        .selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        .attr("x", 1)
        .attr("transform", function (d) {
          return "translate(" + x(d.x0) + "," + y(d.length) + ")";
        })
        .attr("width", function (d) {
          return x(d.x1) - x(d.x0) - 1;
        })
        .attr("height", function (d) {
          return height - y(d.length);
        })
        .attr("class", function (d) {
          return `hist-bar age-${d[0]?.Age || 0}`;
        })
        .style("fill", function (d) {
          if (d.x0 < 140) {
            return "green";
          } else {
            return "yellow";
          }
        })
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip);

      //implementing an Append function  of a vertical line to highlight the separation
      svg
        .append("line")
        .attr("x1", x(140))
        .attr("x2", x(140))
        .attr("y1", y(0))
        .attr("y2", y(1600))
        .attr("stroke", "blue")
        .attr("stroke-blue", "6");
      svg
        .append("text")
        .attr("x", x(195))
        .attr("y", y(1500))
        .style("font-size", "18px");
    },
  };
  return histogramObj;
}
