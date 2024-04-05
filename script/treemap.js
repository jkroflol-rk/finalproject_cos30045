function init() {
    let margin = { top: 10, right: 10, bottom: 10, left: 10 },
        width = 600 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    let svg = d3.select("#treemap")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    let opacity = d3.scaleLinear()
        .domain([1000, 100000])
        .range([.5, 1])

    d3.csv("dataset/data_treemap.csv").then(function (data) {
        // stratify the data: reformatting for d3.js
        const root = d3.stratify()
            .id(function (d) {
                return d.name;
            })   // Name of the entity (column name is name in csv)
            .parentId(function (d) {
                return d.parent;
            })   // Name of the parent (column name is parent in csv)
            (data);
        root.sum(function (d) {
            return +d.value
        })   // Compute the numeric value for each entity

        // Then d3.treemap computes the position of each element of the hierarchy
        // The coordinates are added to the root object above
        d3.treemap()
            .size([width, height])
            .padding(4)
            (root)

        // use this information to add rectangles:
        svg
            .selectAll("rect")
            .data(root.leaves())
            .join("rect")
            .attr('x', function (d) {
                return d.x0;
            })
            .attr('y', function (d) {
                return d.y0;
            })
            .attr('width', function (d) {
                return d.x1 - d.x0;
            })
            .attr('height', function (d) {
                return d.y1 - d.y0;
            })
            .style("stroke", "black")
            .style("fill", "#69b3a2")
            .style("opacity", function (d) {
                return opacity(d.data.value)
            })
            .on("mouseover", function (d) {
                d3.select(this).style("fill", "orange")
            })
            .on("mouseleave", function (d) {
                d3.select(this).style("fill", "#69b3a2")
            });

        // and to add the text labels
        svg
            .selectAll("text")
            .data(root.leaves())
            .join("text")
            .attr("x", function (d) {
                return d.x0 + 10
            })    // +10 to adjust position (more right)
            .attr("y", function (d) {
                return d.y0 + 20
            })    // +20 to adjust position (lower)
            .text(function (d) {
                return d.data.name + ": \n" + d.data.value
            })
            .attr("font-size", "10px")
            .attr("fill", "white")
    });
}

window.addEventListener('load', init);