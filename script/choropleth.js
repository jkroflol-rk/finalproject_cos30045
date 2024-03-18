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
    var color = d3.scaleQuantize().range([
        '#deebf7',
        '#c6dbef',
        '#9ecae1',
        '#6baed6',
        '#4292c6',
        '#2171b5',
        '#08519c',
        '#08306b'
    ])
        .domain([0, 10000]) // Define the domain of the color scale
        .unknown('grey'); // Define the color for unknown values
    // Create a new SVG element
    let svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("fill", "lightblue");

    // Load the JSON file and draw the map
    d3.csv("dataset/arrival_nz.csv").then(function (d) {
        d3.json("dataset/world.json").then(function (json) {
            for (var i = 0; i < d.length; i++) {
                var dataState = d[i].Country; // Get the LGA from the CSV data
                var dataValue = parseFloat(d[i].Total); // Get the unemployment rate from the CSV data
                for (var j = 0; j < json.features.length; j++) {
                    var jsonState = json.features[j].properties.name; // Get the LGA name from the JSON data
                    console.log(dataState);


                    // Check if the LGA names match
                    if (dataState == jsonState) {
                        json.features[j].properties.value = dataValue; // Set the value property in the JSON data
                        break;
                    }
                }
            }
            svg.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("fill", function (data, i) {
                    console.log(color(data.properties.value)); // Log the color value
                    return color(data.properties.value)
                })
                .attr("stroke", "white")
                .attr("stroke-width", 1)
                .on("mouseover", function (event, d) {
                    const centroid = path.centroid(d); // Get the centroid of the country
                    const name = d.properties.value; // Get the name of the country

                    // Show tooltip
                    d3.select(".tooltip")
                        .style("opacity", 1)
                        .html(name)
                        .style("left", (centroid[0] + 10) + "px")
                        .style("top", (centroid[1] + 10) + "px");
                })
                .on("mouseout", function (d) {

                    d3.select(".tooltip").style("opacity", 0);
                });
            console.log(json.features)
        });
    })
}
window.onload = init;
