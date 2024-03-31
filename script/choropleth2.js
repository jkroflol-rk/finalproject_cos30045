function init() {
    const w = 1000;
    const h = 700;
    const sensitivity = 75;

    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "lightgray")
        .style("padding", "5px")
        .style("border-radius", "5px")
        .style("visibility", "hidden");

    let projection = d3.geoOrthographic()
        .center([0, 0])
        .scale(250)
        .rotate([190, 50])
        .translate([w / 2, h / 2]);

    let path = d3.geoPath()
        .projection(projection);

    const color = d3.scaleSequential(d3.interpolateBlues).domain([0, 500000]).unknown('grey');

    const initialScale = projection.scale();

    let svg = d3.select("#map")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    let globe = svg.append("circle")
        .attr("fill", "#EEE")
        .attr("stroke", "#000")
        .attr("stroke-width", "0.2")
        .attr("cx", w / 2)
        .attr("cy", h / 2)
        .attr("r", initialScale);

    let nzLocation = [];
    let ausLocation;

    var geoGenerator = d3.geoPath()
        .projection(projection)
        .pointRadius(4);

    d3.csv("dataset/arrival_nz.csv").then(function (d) {
        d3.json("dataset/world.json").then(function (json) {
            for (var i = 0; i < d.length; i++) {
                var dataState = d[i].Country;
                var dataValue = parseFloat(d[i].Total);
                for (var j = 0; j < json.features.length; j++) {
                    var jsonState = json.features[j].properties.name;
                    if (jsonState == "New Zealand") {
                        const centroid = path.centroid(json.features[j]);
                        nzLocation = projection.invert(centroid);
                    }
                    if (jsonState == "Australia") {
                        ausLocation = path.centroid(json.features[j]);
                    }
                    if (dataState == jsonState) {
                        json.features[j].properties.value = dataValue;
                        break;
                    }
                }
            }

            svg.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("fill", function (data) {
                    if (data.properties.name === "New Zealand") {
                        return "red";
                    } else {
                        return color(data.properties.value);
                    }
                })
                .attr("class", function (d) {
                    return "country";
                })
                .attr("stroke", "black")
                .attr("stroke-width", 0.2)
                .on("mouseover", function (event, d) {
                    const centroid = path.centroid(d);
                    const lonlat = projection.invert(centroid);
                    const name = d.properties.name;
                    const value = d.properties.value;

                    tooltip.style("visibility", "visible")
                        .html(name + "<br>" + value)
                        .style("left", (centroid[0] + 10) + "px")
                        .style("top", (centroid[1] + 10) + "px");

                    d3.select(this).attr("stroke", "black").attr("stroke-width", "2");

                    var geoInterpolator = d3.geoInterpolate(nzLocation, lonlat);
                    svg.append('path')
                        .datum({ type: 'LineString', coordinates: [nzLocation, lonlat] })
                        .attr('d', geoGenerator)
                        .style('stroke', 'red')
                        .style('stroke-width', 1)
                        .style('fill', 'none')
                        .attr('id', "lineCountry");
                    svg.append('circle')
                        .attr('id', 'runningCircle')
                        .attr('r', 2)
                        .attr('fill', 'red')
                        .attr('cx', nzLocation[0])
                        .attr('cy', nzLocation[1])
                        .transition()
                        .duration(2000)
                        .attrTween('cx', function () {
                            return function (t) {
                                const currentCoord = geoInterpolator(t);
                                return projection(currentCoord)[0];
                            };
                        })
                        .attrTween('cy', function () {
                            return function (t) {
                                const currentCoord = geoInterpolator(t);
                                return projection(currentCoord)[1];
                            };
                        });

                })
                .on("mouseout", function (d) {
                    d3.select(this).attr("stroke", "black").attr("stroke-width", "0.2");
                    tooltip.style("visibility", "hidden");
                    d3.select("#route").remove();
                    d3.select('#lineCountry').remove();
                    d3.select("#runningCircle").remove();
                });

            console.log(nzLocation);
            console.log(ausLocation);

        });
    });

    let zoom = d3.zoom().on('zoom', function (event) {
        if (event.transform.k > 0.3) {
            projection.scale(initialScale * event.transform.k);
            path = d3.geoPath().projection(projection);
            svg.selectAll("path").attr("d", path);
            globe.attr("r", projection.scale());
        } else {
            event.transform.k = 0.3;
        }
    });

    let drag = d3.drag().on('drag', function (event) {
        const rotate = projection.rotate();
        const k = sensitivity / projection.scale();
        projection.rotate([
            rotate[0] + event.dx * k,
            rotate[1] - event.dy * k
        ]);
        path = d3.geoPath().projection(projection);
        svg.selectAll("path").attr("d", path);
    });

    svg.call(drag);
    svg.call(zoom);
}

window.onload = init;
