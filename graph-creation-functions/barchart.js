function createBarChartObj() {
    const barChartObj = {
        createBarChart: (heartDiseaseData, idTag) => {
            function createCSV() {
                let maleCount = 0;
                let femaleCount = 0;
                heartDiseaseData.forEach((row) => {
                  row.Sex === "M" && row.HeartDisease === "1" && maleCount++;
                });
            
                heartDiseaseData.forEach((row) => {
                  row.Sex === "F" && row.HeartDisease === "1" && femaleCount++;
                });
            
                const finalCSVString = `Sex,Value
                M,${maleCount}
                F,${femaleCount}`;
            
                return finalCSVString;
              }
              const data = d3.csvParse(createCSV(), (d) => d);
            
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
            
              // X axis
              var x = d3
                .scaleBand()
                .range([0, width])
                .domain(
                  data.map(function (d) {
                    return d.Sex;
                  })
                )
                .padding(0.2);
              svg
                .append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");
            
              // Add Y axis
              var y = d3.scaleLinear().domain([0, 500]).range([height, 0]);
              svg.append("g").call(d3.axisLeft(y));
            
              // Bars
              svg
                .selectAll("mybar")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", function (d) {
                  return x(d.Sex);
                })
                .attr("y", function (d) {
                  return y(d.Value);
                })
                .attr("width", x.bandwidth())
                .attr("height", function (d) {
                  return height - y(d.Value);
                })
                .attr("fill", "#69b3a2");

            }
        }
        return barChartObj
}
