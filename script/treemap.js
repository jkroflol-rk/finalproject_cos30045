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
    let color = d3.scaleThreshold([10, 50, 200, 1000, 2000, 4000, 5000, 10000, 20000], d3.schemeGreens[9])
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
            .style("fill", function (d) { return color(d.data.value) })
            .style("opacity", function (d) {
                return opacity(d.data.value / 10)
            })
            .on("mouseover", function (d) {
                d3.select(this).style("fill", "orange")
            })
            .on("mouseleave", function (d) {
                d3.select(this).style("fill", function (d) { return color(d.data.value) })
            });

        // and to add the text labels
        svg
            .selectAll("text")
            .data(root.leaves())
            .join("text")
            .attr("x", function (d) {
                console.log(d);
                return d.x0 + 5;

            })    // +10 to adjust position (more right)
            .attr("y", function (d) {
                return d.y0 + 30
            })    // +20 to adjust position (lower)
            .text(function (d) {
                return d.data.name + ": \n" + d.data.value
            })
            .attr("font-size", function (d) { return (d.x1 - d.x0) / 11 })
            .attr("fill", "white")
            .attr("width", "10px")
            .attr("class", "treeContent")
    });
}

window.addEventListener('load', init);