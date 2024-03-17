function init() {
    let w = 1000;
    let h = 700;

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
    d3.json("dataset/world2.json").then(function (json) {
        let properties = json.properties;
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
                console.log(d.properties.name);
            })
            .on("mouseout", function (d) {
                d3.select(this).attr("fill", "grey");
            });

    });
}

window.onload = init;
