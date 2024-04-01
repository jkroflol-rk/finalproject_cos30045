
/* Radar chart design created by Nadieh Bremer - VisualCinnamon.com */

//draw the radar chart

let color = d3
    .scaleOrdinal()
    .range(["#EDC951", "#CC333F", "#00A0B0"]);

//set up the radar chart

var margin = { top: 100, right: 100, bottom: 100, left: 100 },
    width =
        Math.min(700, window.innerWidth - 10) -
        margin.left -
        margin.right,
    height = Math.min(
        width,
        window.innerHeight - margin.top - margin.bottom - 20
    );

let radarChartOptions = {
    w: width,
    h: height,
    margin: margin,
    maxValue: 0.5,
    levels: 5,
    roundStrokes: true,
    color: color,
};


let dataset = [
    [
        { axis: "NZ and Aus Citizens", value: 40 },
        { axis: "Visitor", value: 20 },
        { axis: "Work", value: 30 },
        { axis: "Student", value: 40 },
        { axis: "Resident", value: 50 },
        { axis: "Other", value: 60 },
    ],
];

console.log(dataset);
function drawRadar(country) {

    d3.csv("dataset/nz_radio.csv").then(function (data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].country == country) {
                if (data[i].visa === "NZ and Australian citizens") {
                    dataset[0][0].value = parseInt(data[i].sum);
                    console.log("NZ", data[i].sum);
                }
                if (data[i].visa === "Visitor") {
                    dataset[0][1].value = parseInt(data[i].sum);
                    console.log("Visit", data[i].sum);
                }
                if (data[i].visa === "Work") {
                    dataset[0][2].value = parseInt(data[i].sum);
                    console.log("Work", data[i].sum);
                }
                if (data[i].visa === "Student") {
                    dataset[0][3].value = parseInt(data[i].sum);
                    console.log("Stu", data[i].sum);
                }
                if (data[i].visa === "Resident") {
                    dataset[0][4].value = parseInt(data[i].sum);
                    console.log("Res", data[i].sum);
                }
                if (data[i].visa === "Other") {
                    dataset[0][5].value = parseInt(data[i].sum);
                    console.log("Other", data[i].sum);
                }
            }
        }

        RadarChart(".radarChart", dataset, radarChartOptions);
    });

}
window.addEventListener('load', function () {
    drawRadar("Vietnam");
});