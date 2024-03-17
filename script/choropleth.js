function init() {
    let w = 1000;
    let h = 700;


    const tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("background-color", "lightgray")
        .style("padding", "5px")
        .style("border-radius", "5px")
        .style("visibility", "hidden");
    // Create a new projection using the Mercator projection
    let projection = d3.geoNaturalEarth1()
        .center([0, 0])
        .scale(w / 1.5 / Math.PI)
        .translate([w / 2, h / 2]);

    // Create a new path using the projection
    let path = d3.geoPath()
        .projection(projection);

    // Create a new SVG element
    let svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("fill", "lightblue");

    // Load the JSON file and draw the map
    d3.json("dataset/world.json").then(function (json) {

        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", "grey")
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .on("mouseover", function (event, d) {
                d3.select(this).attr("fill", "orange");
                const centroid = path.centroid(d); // Get the centroid of the country
                const name = d.properties.name; // Get the name of the country

                // Show tooltip
                d3.select(".tooltip")
                    .style("opacity", 1)
                    .html(name)
                    .style("left", (centroid[0] + 10) + "px")
                    .style("top", (centroid[1] + 10) + "px");

            })
            .on("mouseout", function (d) {
                d3.select(this).attr("fill", "grey");
                d3.select(".tooltip").style("opacity", 0);
            });
        console.log(json.features)
    });
}

window.onload = init;
