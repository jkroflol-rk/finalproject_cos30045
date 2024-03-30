const geojson = {};

const svg = d3.select('#map').append('svg')
    .attr('width', 800)
    .attr('height', 600);

const projection = d3.geoOrthographic()
    .scale(500)
    .rotate([30, -45]);

const pathGenerator = d3.geoPath()
    .projection(projection);

const londonLonLat = [0.1278, 51.5074];
const newYorkLonLat = [-74.0059, 40.7128];
const geoInterpolator = d3.geoInterpolate(londonLonLat, newYorkLonLat);
let u = 0;

// Graticule
const graticule = d3.geoGraticule();

// Append graticule to the SVG
svg.append('path')
    .datum(graticule())
    .attr('class', 'graticule')
    .attr('d', pathGenerator)
    .attr('fill', 'none')
    .attr('stroke', '#ccc');

// London - New York line
svg.append('path')
    .datum({ type: 'LineString', coordinates: [londonLonLat, newYorkLonLat] })
    .attr('class', 'line')
    .attr('d', pathGenerator)
    .attr('fill', 'none')
    .attr('stroke', 'red');

// Point
const point = svg.append('circle')
    .attr('r', 4)
    .attr('fill', 'red');

// Update function
function update() {
    point.attr('cx', function () {
        const pointCoordinates = geoInterpolator(u);
        return projection(pointCoordinates)[0];
    })
        .attr('cy', function () {
            const pointCoordinates = geoInterpolator(u);
            return projection(pointCoordinates)[1];
        });

    u += 0.01;
    if (u > 1) u = 0;
}

// Event loop to continuously update the point
d3.interval(update, 10);
