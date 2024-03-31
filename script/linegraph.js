function init() {
    let width = 700;
    let height = 500;
    let margin = 50;
    let svg = d3.select("#lineGraph")
        .append("svg")
        .attr("width", width)
        .attr("height", height)


    let dataset = [];
    d3.csv("dataset/NZ_MIGRATION.csv").then(function (d) {
        for (var i = 0; i < d.length; i++) {
            if (d[i].country == "Australia") {
                dataset.push({
                    "x": d[i].year, "y": parseInt(d[i].estimate)
                });
            }
        }
        // Add x Axis
        let xScale = d3.scaleLinear()
            .domain([2013, 2023])
            .range([0, width - margin - 30]);
        svg.append("g")
            .attr("transform", "translate(" + margin + "," + (height - margin) + ")")
            .call(d3.axisBottom(xScale));
        // Add Y axis
        let yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d.y)])
            .range([height - margin, margin]);
        svg.append("g")
            .call(d3.axisLeft(yScale))
            .attr("transform", "translate(" + margin + ", 0)");
        console.log(dataset);
        svg
            .append("path")
            .datum(dataset)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line().curve(d3.curveBasis)
                .x(function (d) {
                    return xScale(d.x)
                })
                .y(function (d) {
                    return yScale(d.y)
                })
            ).attr("transform", "translate(" + margin + ",0)")
        ;

    });
}

window.addEventListener('load', init);





