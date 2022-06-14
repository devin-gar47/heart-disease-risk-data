function createStackedBarChartObj() {
  const stackedBarChartObj = {
    createStackedBarChart: (heartDiseaseData, idTag) => {
      function createCSV() {
        let chestPainTypeArr = [];

        heartDiseaseData.forEach((obj) => {
          if (obj.Sex === "M") {
            const index = chestPainTypeArr.findIndex(
              (ele) =>
                ele?.chestPainType === obj.ChestPainType && ele?.sex === "M"
            );
            if (index === -1) {
              chestPainTypeArr.push({
                chestPainType: obj.ChestPainType,
                count: 1,
                sex: "M",
              });
            } else {
              chestPainTypeArr[index].count = chestPainTypeArr[index].count + 1;
            }
          } else {
            const index2 = chestPainTypeArr.findIndex(
              (ele) =>
                ele?.chestPainType === obj.ChestPainType && ele?.sex === "F"
            );

            if (index2 === -1) {
              chestPainTypeArr.push({
                chestPainType: obj.ChestPainType,
                count: 1,
                sex: "F",
              });
            } else {
              chestPainTypeArr[index2].count =
                chestPainTypeArr[index2].count + 1;
            }
          }
        });
        groupColumns = Array.from(
          new Set(chestPainTypeArr.map((ele) => ele.chestPainType))
        ).join(",");

        const finalCSVString = `group,${groupColumns}
M,${chestPainTypeArr
          .filter((obj) => obj.sex === "M")
          .map((obj) => obj.count)
          .join(",")}
F,${chestPainTypeArr
          .filter((obj) => obj.sex === "F")
          .map((obj) => obj.count)
          .join(",")}`;

        console.log(finalCSVString);

        return finalCSVString;
      }
      const data = d3.csvParse(createCSV(), (d) => d);

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

      // List of subgroups = header of the csv files = soil condition here
      var subgroups = data.columns.slice(1);

      // List of groups = species here = value of the first column called group -> I show them on the X axis
      var groups = d3
        .map(data, function (d) {
          return d.group;
        })
        .keys();

      // Add X axis
      var x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0));

      // Add Y axis
      var y = d3.scaleLinear().domain([0, 800]).range([height, 0]);
      svg.append("g").call(d3.axisLeft(y));

      // color palette = one color per subgroup
      var color = d3.scaleOrdinal().domain(subgroups).range(d3.schemeSet2);

      //stack the data? --> stack per subgroup
      var stackedData = d3.stack().keys(subgroups)(data);

      // ----------------
      // Highlight a specific subgroup when hovered
      // ----------------

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

      // Three function that change the tooltip when user hover / move / leave a cell
      var mouseover = function (d) {
        var subgroupName = d3.select(this.parentNode).datum().key;
        var subgroupValue = d.data[subgroupName];
        tooltip
          .html(
            "subgroup: " + subgroupName + "<br>" + "Value: " + subgroupValue
          )
          .style("opacity", 1);
      };
      var mousemove = function (d) {
        tooltip
          .style("left", d3.mouse(this)[0] + 720 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
          .style("top", d3.mouse(this)[1] + 350 + "px");
      };
      var mouseleave = function (d) {
        tooltip.style("opacity", 0);
      };

      // Show the bars
      svg
        .append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .enter()
        .append("g")
        .attr("fill", function (d) {
          return color(d.key);
        })
        .attr("class", function (d) {
          return "myRect " + d.key;
        }) // Add a class to each subgroup: their name
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(function (d) {
          return d;
        })
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return x(d.data.group);
        })
        .attr("y", function (d) {
          return y(d[1]);
        })
        .attr("height", function (d) {
          return y(d[0]) - y(d[1]);
        })
        .attr("width", x.bandwidth())
        .attr("stroke", "grey")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);
    },
  };
  return stackedBarChartObj;
}

function highlightBar(sex, chestPainType) {
  d3.selectAll(".myRect rect").style("opacity", 0.2);
  d3.selectAll(
    `.${chestPainType} > rect:nth-child(${sex === "M" ? "1" : "2"})`
  ).style("opacity", 1);
}
