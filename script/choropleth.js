let w = 500;
let h = 300;

// Create a new projection using the Mercator projection
let projection = d3.geoMercator()
    .center([145, -36.5])
    .scale(2450)
    .translate([w / 2, h / 2]);

// Create a new path using the projection
let path = d3.geoPath()
    .projection(projection);

// Create a new SVG element
let svg = d3.select("#map")
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
        .attr("fill", "lightblue")
        .attr("stroke", "grey")
        .attr("stroke-width", 1);
});