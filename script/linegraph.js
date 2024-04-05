function drawGraph(country) {
    let width = 600;
    let height = 400;
    let margin = 60;
    let svg = d3.select("#lineGraph")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "line");

    let dataset = [];
    d3.csv("dataset/NZ_MIGRATION.csv").then(function (data) {
        data.forEach(function (d) {
            if (d.country === country) {
                dataset.push({
                    "x": parseInt(d.year),
                    "y": parseInt(d.estimate)
                });
            }
        });

        // Add x Axis
        let xScale = d3.scaleLinear()
            .domain([2013, 2023])
            .range([0, width - margin - 30]);
        svg.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(" + margin + "," + (height - margin) + ")")
            .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));
        svg.append("text")
            .attr("class", "x-label")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height - 6)
            .text("Year");
        // Add Y axis
        let yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d.y)])
            .range([height - margin, margin]);
        svg.append("g")
            .attr("class", "yAxis")
            .call(d3.axisLeft(yScale))
            .attr("transform", "translate(" + margin + ", 0)");
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle")
            .attr("y", 10)
            .attr("dy", "0.2em")
            .attr("x", -(height / 2))
            .attr("transform", "rotate(-90)")
            .text("Number of visitor");
        d3.selectAll("g.yAxis g.tick")
            .append("line")
            .attr("class", "gridline")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", width - margin - 30)
            .attr("y2", 0)
            .attr("stroke", "#9ca5aecf")
            .attr("stroke-dasharray", "4")
        d3.selectAll("g.xAxis g.tick")
            .append("line")
            .attr("class", "gridline")
            .attr("x1", 0)
            .attr("y1", -height + margin * 2)
            .attr("x2", 0)
            .attr("y2", 0)
            .attr("stroke", "#9ca5aecf")
            .attr("stroke-dasharray", "4")

        svg.append("path")
            .datum(dataset)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .curve(d3.curveBasis)
                .x(function (d) {
                    return xScale(d.x);
                })
                .y(function (d) {
                    return yScale(d.y);
                })
            )
            .attr("transform", "translate(" + margin + ",0)");

        // svg.on('mousemove', function (event) {
        //     var index = parseInt(dataset.length * (event.x - margin) / (width - margin) - 14)
        //     if (index > 0 && index < dataset.length) {
        //         console.log(index, dataset[index])
        //         d3.select(".hover-line").remove()
        //         d3.select(".hover-text").remove()
        //         svg.append("line")
        //             .style("position", "absolute")
        //             .attr("class", "hover-line")
        //             .attr("x1", event.x)
        //             .attr("y1", yScale(dataset[index].y))
        //             .attr("x2", event.x)
        //             .attr("y2", yScale(height) + 30)
        //             .style("stroke", "black")
        //             .style("stroke-width", 1);
        //
        //
        //         svg.append("text")
        //             .style("position", "absolute")
        //             .attr("class", "hover-text")
        //             .attr("x", event.x)
        //             .attr("y", yScale(dataset[index].y))
        //             .text(dataset[index].y)
        //             .attr("text-anchor", "middle")
        //             .style("font-weight", "600")
        //             .style("fill", "black");
        //     }
        // });
    });
}

window.addEventListener('load', function () {
    drawGraph("Vietnam"); // Initial call with default country
});
