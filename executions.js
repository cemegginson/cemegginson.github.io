"use strict";
var d3 = require('d3');
var _ = require('lodash');
var years = _.range(1977, 2015);
function GenerateGraph(data_row, iter) {
    var margins = [80, 80, 80, 80];
    var width = 1000 - margins[1] - margins[3];
    var height = 400 - margins[0] - margins[2];
    var x = d3.scale.linear().domain([1977, 2014]).range([0, height]);
    var y = d3.scale.linear().domain([0, 10]).range([height, 0]);
    var line = d3.svg.line()
        .x(function (d) { return d[0]; })
        .y(function (d) { return d[1]; })
        .interpolate("basis");
    var div_element = "#graph_" + iter;
    var graph = d3.select(div_element).append("svg:svg")
        .attr("width", width + margins[1] + margins[3])
        .attr("height", height + margins[0] + margins[2])
        .append("svg:g")
        .attr("transform", "translate(" + margins[3] + "," + margins[0] + ")");
    var xAxis = d3.svg.axis().scale(x).tickSize(-height);
    graph.append("svg:g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
    graph.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(-25,0)")
        .call(yAxisLeft);
    console.log(data_row);
    graph.append("svg:path").attr("d", line(data_row));
}
var current_graph = 1;
d3.csv("data/cp_executed.csv", function (data) {
    for (var i in data) {
        var actual_data = [];
        var data_row = data[i];
        for (var _i = 0, years_1 = years; _i < years_1.length; _i++) {
            var j = years_1[_i];
            actual_data.push(parseInt(data_row[j]));
        }
        GenerateGraph(actual_data, current_graph);
        current_graph++;
    }
});
